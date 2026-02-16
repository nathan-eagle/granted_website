// Adapter: maps NDJSON stream envelopes → visualization engine API calls
// Handles dedup (the ONE chokepoint) and variable cadence queuing

import type { Opportunity } from '@/hooks/useGrantSearch'
import type { VizGrant, SearchVisualization, StreamEnvelope } from './types'

/** Heuristic to classify grant type from Opportunity fields */
function inferType(opp: Opportunity): VizGrant['type'] {
  // Federal indicators
  const funderLower = (opp.funder || '').toLowerCase()
  const nameLower = (opp.name || '').toLowerCase()
  if (
    opp.source_provider === 'grants_gov' ||
    opp.source_provider === 'sam_assistance' ||
    opp.source_provider === 'nih_guide' ||
    opp.source_provider === 'nsf_funding' ||
    opp.source_provider === 'nih_weekly_index' ||
    opp.source_provider === 'nsf_upcoming'
  ) return 'Federal'
  if (funderLower.includes('department of') || funderLower.includes('national science') ||
      funderLower.includes('national institutes') || nameLower.includes('sbir') ||
      nameLower.includes('sttr')) return 'Federal'

  // Foundation indicators
  if (funderLower.includes('foundation') || funderLower.includes('trust') ||
      funderLower.includes('endowment') || funderLower.includes('fund') ||
      opp.source_provider === 'pnd_rfps') return 'Foundation'

  // Default to Corporate
  return 'Corporate'
}

/** Map a production Opportunity to a VizGrant for the engine */
export function toVizGrant(opp: Opportunity): VizGrant {
  return {
    id: opp.name, // name is unique per search
    name: opp.name,
    funder: opp.funder,
    amount: opp.amount,
    deadline: opp.deadline,
    fit_score: opp.fit_score ?? 0,
    summary: opp.summary,
    type: inferType(opp),
    source: opp.source_provider,
    url: opp.google_url || opp.rfp_url,
    slug: opp.slug,
    eligibility: opp.eligibility,
    match_reasons: opp.match_reasons,
  }
}

/** Normalize grant name to a stable dedup key */
function dedupKey(name: string): string {
  return (name || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Create an adapter that routes NDJSON envelopes to the engine.
 * Handles dedup (the ONE chokepoint) and variable cadence queuing.
 */
export function createAdapter(engine: SearchVisualization) {
  let searchStartTime = Date.now()
  let isFirstBatch = true
  // NUCLEAR dedup: no grant with the same normalized name passes through twice
  const seenGrants = new Set<string>()

  function resetTiming() {
    searchStartTime = Date.now()
    isFirstBatch = true
    seenGrants.clear()
  }

  /** Filter out grants we've already sent to the engine */
  function dedup(grants: VizGrant[]): VizGrant[] {
    const unique: VizGrant[] = []
    for (const g of grants) {
      const key = dedupKey(g.name)
      if (!key || seenGrants.has(key)) continue
      seenGrants.add(key)
      unique.push(g)
    }
    return unique
  }

  function processEnvelope(envelope: StreamEnvelope) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = envelope as any
    switch (envelope.type) {
      case 'db_results': {
        const opps = (env.opportunities as Opportunity[] | undefined) || []
        const vizGrants = dedup(opps.map(toVizGrant))
        if (vizGrants.length > 0) engine.addBatch('db_results', vizGrants, true)
        isFirstBatch = false
        break
      }

      case 'model_batch': {
        const provider = (env.provider as string) || 'unknown'
        const opps = (env.opportunities as Opportunity[] | undefined) || []
        const vizGrants = dedup(opps.map(toVizGrant))
        if (vizGrants.length > 0) engine.addBatch(provider, vizGrants, isFirstBatch)
        isFirstBatch = false
        break
      }

      case 'model_error':
        break

      case 'reranked': {
        const opps = (env.opportunities as Opportunity[] | undefined) || []
        const vizGrants = opps.map(toVizGrant)
        // Rerank uses ALL grants (no dedup filter — engine only updates existing nodes)
        engine.rerank(vizGrants)
        break
      }

      case 'complete': {
        const summary = env.summary as { totalCount: number; totalDurationMs: number } | undefined
        engine.complete({
          totalCount: summary?.totalCount ?? 0,
          durationMs: summary?.totalDurationMs || (Date.now() - searchStartTime),
        })
        break
      }

      case 'heartbeat':
        break
    }
  }

  /** Pre-register grants that were loaded via loadAll so adapter skips them */
  function markSeen(grants: VizGrant[]) {
    for (const g of grants) {
      const key = dedupKey(g.name)
      if (key) seenGrants.add(key)
    }
  }

  return { processEnvelope, resetTiming, markSeen }
}
