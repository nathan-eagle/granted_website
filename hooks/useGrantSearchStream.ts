'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { supabase } from '@/lib/supabase'
import {
  ORG_TYPES,
  AMOUNT_RANGES,
  type AmountRangeKey,
  type Opportunity,
  type Phase,
  deduplicateOpportunities,
  summarizeTerm,
  buildApplyUrl,
  isPastDeadline,
  deadlineUrgency,
  relativeTime,
} from './useGrantSearch'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.grantedai.com'
const SEARCH_CACHE_KEY = 'granted_search_cache'

/** Build a cache key from search params */
function cacheKey(q: string, orgType: string, state: string): string {
  return [q, orgType, state].map(s => s.toLowerCase().trim()).join('|')
}

/** Save search results to sessionStorage */
function cacheResults(q: string, orgType: string, state: string, opportunities: Opportunity[]) {
  try {
    sessionStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify({
      key: cacheKey(q, orgType, state),
      opportunities,
      ts: Date.now(),
    }))
  } catch {}
}

/** Load cached results if they match the query and are <30 min old */
function loadCachedResults(q: string, orgType: string, state: string): Opportunity[] | null {
  try {
    const raw = sessionStorage.getItem(SEARCH_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (cached.key !== cacheKey(q, orgType, state)) return null
    if (Date.now() - cached.ts > 30 * 60 * 1000) return null
    return cached.opportunities
  } catch { return null }
}

type ProviderName =
  | 'gemini'
  | 'perplexity_sonar_pro'
  | 'openai_gpt4_1'
  | 'claude_haiku'
  | 'grok_deep'
  | 'perplexity_deep_research'

type ProviderStatus = {
  provider: ProviderName
  status: 'pending' | 'success' | 'error'
  resultCount?: number
}

type StreamEnvelope =
  | { type: 'db_results'; opportunities: Opportunity[]; count: number }
  | { type: 'model_batch'; provider: ProviderName; opportunities: Opportunity[]; newCount: number; totalCount: number }
  | { type: 'model_error'; provider: ProviderName; error: string }
  | { type: 'reranked'; opportunities: Opportunity[]; totalCount: number }
  | { type: 'complete'; summary: { totalCount: number; providerResults: ProviderStatus[]; totalDurationMs: number } }
  | { type: 'heartbeat' }

export type { StreamEnvelope }

export function useGrantSearchStream(opts?: {
  onPhaseChange?: (phase: Phase) => void
  onEnvelope?: (envelope: StreamEnvelope) => void
}) {
  const onPhaseChange = opts?.onPhaseChange
  const onEnvelopeRef = useRef(opts?.onEnvelope)
  onEnvelopeRef.current = opts?.onEnvelope
  const [phase, setPhase] = useState<Phase>('form')
  const [orgType, setOrgType] = useState('')
  const [focusArea, setFocusArea] = useState('')
  const [state, setState] = useState('')
  const [amountRange, setAmountRange] = useState<AmountRangeKey>('')
  const [deepResearch, setDeepResearch] = useState(false)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [error, setError] = useState('')
  const [broadened, setBroadened] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [enrichedNames, setEnrichedNames] = useState<Set<string>>(new Set())
  const [providers, setProviders] = useState<Map<ProviderName, ProviderStatus>>(new Map())

  const searchParams = useSearchParams()
  const autoSearchedQueryRef = useRef<string | null>(null)
  const profileFetched = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    onPhaseChange?.(phase)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Prepopulate from app profile if logged in
  useEffect(() => {
    if (profileFetched.current) return
    profileFetched.current = true

    fetch(`${API_URL}/api/public/profile-summary`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data?.authenticated || !data.profile) return
        if (data.profile.org_type && !orgType) setOrgType(data.profile.org_type)
        if (data.profile.state && !state) setState(data.profile.state)
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const matchSlugs = useCallback(async (results: Opportunity[]) => {
    if (!supabase || results.length === 0) return
    try {
      const names = results.map(r => r.name)
      const { data: matches } = await supabase
        .from('public_grants')
        .select('name, slug')
        .in('name', names)
      if (matches) {
        const slugMap = new Map(matches.map(m => [m.name, m.slug]))
        for (const r of results) {
          const slug = slugMap.get(r.name)
          if (slug) r.slug = slug
        }
      }
    } catch {}
  }, [])

  const doStreamSearch = useCallback(async (
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    searchAmountRange?: AmountRangeKey,
    searchDeepResearch?: boolean,
  ): Promise<{ opportunities: Opportunity[]; streamed: boolean }> => {
    // Abort any previous stream
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const amountDef = AMOUNT_RANGES.find(r => r.key === (searchAmountRange ?? ''))

    const res = await fetch(`${API_URL}/api/public/discover-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_type: searchOrgType || undefined,
        focus_area: searchFocusArea,
        state: searchState || undefined,
        ...(amountDef?.min ? { amount_min: amountDef.min } : {}),
        ...(amountDef?.max ? { amount_max: amountDef.max } : {}),
        ...(searchDeepResearch ? { deep_research: true } : {}),
      }),
      signal: controller.signal,
    })

    if (res.status === 429) {
      setError('You have reached the daily search limit. Please try again tomorrow.')
      setPhase('form')
      return { opportunities: [], streamed: false }
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Search failed')
    }

    // Check if response is JSON (cache hit) or NDJSON (stream)
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      return {
        opportunities: data.opportunities || [],
        streamed: false,
      }
    }

    // NDJSON streaming response
    const reader = res.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''
    const dbNames = new Set<string>()
    let allOpps: Opportunity[] = []
    const localEnrichedNames = new Set<string>()

    setEnriching(true)

    const processLine = (line: string) => {
      if (!line.trim()) return

      let envelope: StreamEnvelope
      try {
        envelope = JSON.parse(line) as StreamEnvelope
      } catch {
        return
      }

      // Fire envelope to visualization before state updates
      onEnvelopeRef.current?.(envelope)

      switch (envelope.type) {
        case 'db_results': {
          allOpps = [...envelope.opportunities]
          for (const opp of envelope.opportunities) {
            dbNames.add(opp.name.toLowerCase())
          }
          const deduped = deduplicateOpportunities(allOpps)
          // Sort by fit_score for intermediate display while LLMs are still running
          deduped.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
          setOpportunities(deduped)
          setPhase('results')
          break
        }

        case 'model_batch': {
          // Track new names for "AI Found" badges (local set avoids stale closure)
          for (const opp of envelope.opportunities) {
            // Stamp source_provider so viz engines can attribute grants to their LLM source
            if (!opp.source_provider) opp.source_provider = envelope.provider
            if (!dbNames.has(opp.name.toLowerCase())) {
              localEnrichedNames.add(opp.name)
            }
            allOpps.push(opp)
          }
          setEnrichedNames(new Set(localEnrichedNames))

          const deduped = deduplicateOpportunities(allOpps)
          // Sort by fit_score for intermediate display while LLMs are still running
          deduped.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
          setOpportunities(deduped)

          // Update provider status
          setProviders(prev => {
            const next = new Map(prev)
            next.set(envelope.provider, {
              provider: envelope.provider,
              status: 'success',
              resultCount: envelope.newCount,
            })
            return next
          })
          break
        }

        case 'model_error': {
          setProviders(prev => {
            const next = new Map(prev)
            next.set(envelope.provider, {
              provider: envelope.provider,
              status: 'error',
            })
            return next
          })
          break
        }

        case 'reranked': {
          // Server sends grants in GPT-4.1-mini reranked order — do NOT re-sort by fit_score
          allOpps = [...envelope.opportunities]
          const deduped = deduplicateOpportunities(allOpps)
          setOpportunities(deduped)
          break
        }

        case 'complete': {
          setEnriching(false)
          trackEvent('grant_finder_stream_complete', {
            total_count: String(envelope.summary.totalCount),
            duration_ms: String(envelope.summary.totalDurationMs),
            providers_success: String(
              envelope.summary.providerResults.filter(p => p.status === 'success').length
            ),
            providers_error: String(
              envelope.summary.providerResults.filter(p => p.status === 'error').length
            ),
          })
          break
        }

        case 'heartbeat':
          // Ignore — keeps connection alive
          break
      }
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        // Keep last (potentially incomplete) line in buffer
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          processLine(line)
        }
      }
      // Process any remaining data
      if (buffer.trim()) {
        processLine(buffer)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Search was cancelled, expected
      } else {
        throw err
      }
    } finally {
      setEnriching(false)
      reader.releaseLock()
    }

    return { opportunities: allOpps, streamed: true }
  }, [])

  const runSearch = useCallback(async (
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    source: 'manual' | 'url' = 'manual',
    searchAmountRange?: AmountRangeKey,
    searchDeepResearch?: boolean,
  ) => {
    const normalizedFocus = searchFocusArea.trim()
    if (!normalizedFocus) return

    setError('')
    setBroadened(false)
    setEnriching(false)
    setEnrichedNames(new Set())
    setProviders(new Map())

    trackEvent('grant_finder_search', {
      org_type: searchOrgType || 'any',
      state: searchState || 'any',
      focus_area: summarizeTerm(normalizedFocus),
      focus_area_length: normalizedFocus.length,
      source,
      mode: 'stream',
      deep_research: String(!!searchDeepResearch),
    })
    setPhase('loading')

    try {
      let result = await doStreamSearch(searchOrgType, normalizedFocus, searchState, searchAmountRange, searchDeepResearch)
      let broadenedSearch = false

      // Broaden if no results
      if (result.opportunities.length === 0 && (searchOrgType || searchState)) {
        if (searchState) {
          result = await doStreamSearch(searchOrgType, normalizedFocus, '', searchAmountRange, searchDeepResearch)
        }
        if (result.opportunities.length === 0 && searchOrgType) {
          result = await doStreamSearch('', normalizedFocus, '', searchAmountRange, searchDeepResearch)
        }
        if (result.opportunities.length > 0) {
          broadenedSearch = true
          setBroadened(true)
        }
      }

      // For non-streamed (cached) responses, update state normally
      if (!result.streamed) {
        const deduped = deduplicateOpportunities(result.opportunities)
        await matchSlugs(deduped)
        setOpportunities(deduped)
        setPhase('results')
      } else {
        // For streamed responses, matchSlugs on final results
        await matchSlugs(result.opportunities)
      }

      setPhase('results')

      // Cache results in sessionStorage so page refresh is instant
      const finalOpps = deduplicateOpportunities(result.opportunities)
      cacheResults(normalizedFocus, searchOrgType, searchState, finalOpps)

      trackEvent('grant_finder_results', {
        count: String(result.opportunities.length),
        broadened: String(broadenedSearch),
        streamed: String(result.streamed),
        source,
        focus_area: summarizeTerm(normalizedFocus),
        top_grant: result.opportunities[0]?.name ?? '',
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      trackEvent('grant_finder_search_error', {
        source,
        message: err instanceof Error ? err.message : 'unknown_error',
      })
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }, [doStreamSearch, matchSlugs])

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await runSearch(orgType, focusArea, state, 'manual', amountRange, deepResearch)
  }, [orgType, focusArea, state, amountRange, deepResearch, runSearch])

  const handleBackToBrowsing = useCallback(() => {
    abortRef.current?.abort()
    setEnriching(false)
    setEnrichedNames(new Set())
    setProviders(new Map())
    setPhase('form')
    autoSearchedQueryRef.current = null
    try { sessionStorage.removeItem(SEARCH_CACHE_KEY) } catch {}
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    window.history.replaceState({}, '', url.pathname + url.search)
  }, [])

  // Read state/org_type from URL params (passed from hero search bar)
  const urlParamsApplied = useRef(false)
  useEffect(() => {
    if (urlParamsApplied.current) return
    const urlState = searchParams.get('state')?.trim() ?? ''
    const urlOrgType = searchParams.get('org_type')?.trim() ?? ''
    if (urlState && !state) setState(urlState)
    if (urlOrgType && !orgType) setOrgType(urlOrgType)
    if (urlState || urlOrgType) urlParamsApplied.current = true
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-run search from URL query string.
  // IMPORTANT: Guard on `q` alone so that async profile-fetch filling in
  // state/orgType doesn't trigger a SECOND concurrent search with the same query.
  useEffect(() => {
    const q = searchParams.get('q')?.trim() ?? ''

    if (!q) {
      autoSearchedQueryRef.current = null
      return
    }

    if (!focusArea) {
      setFocusArea(q)
    }

    // Only fire once per unique query string — profile-fetched state/orgType
    // changes must NOT re-trigger the search
    if (autoSearchedQueryRef.current === q) {
      return
    }

    // Use URL params for state/org if available (from hero search)
    const effectiveState = state || searchParams.get('state')?.trim() || ''
    const effectiveOrgType = orgType || searchParams.get('org_type')?.trim() || ''

    autoSearchedQueryRef.current = q

    // Check sessionStorage cache first — instant restore on refresh
    const cached = loadCachedResults(q, effectiveOrgType, effectiveState)
    if (cached && cached.length > 0) {
      setOpportunities(cached)
      setPhase('results')
      trackEvent('grant_finder_cache_hit', { source: 'session', count: String(cached.length) })
      return
    }

    void runSearch(effectiveOrgType, q, effectiveState, 'url', amountRange, deepResearch)
  }, [searchParams, focusArea, orgType, state, amountRange, deepResearch, runSearch])

  return {
    // State
    phase,
    orgType,
    focusArea,
    state,
    amountRange,
    deepResearch,
    opportunities,
    error,
    broadened,
    enriching,
    enrichedNames,
    providers,
    // Setters
    setOrgType,
    setFocusArea,
    setState,
    setAmountRange,
    setDeepResearch,
    // Actions
    handleSearch,
    handleBackToBrowsing,
  }
}

// Re-export types and utilities from useGrantSearch for backward compat
export {
  ORG_TYPES,
  AMOUNT_RANGES,
  US_STATES,
  SOURCE_LABELS,
  OFFICIAL_SOURCES,
  buildApplyUrl,
  isPastDeadline,
  deadlineUrgency,
  relativeTime,
  deduplicateOpportunities,
  summarizeTerm,
} from './useGrantSearch'
export type { Opportunity, Phase, AmountRangeKey } from './useGrantSearch'
