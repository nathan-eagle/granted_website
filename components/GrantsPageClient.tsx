'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useGrantSearchStream, summarizeTerm } from '@/hooks/useGrantSearchStream'
import type { Phase, Opportunity, StreamEnvelope } from '@/hooks/useGrantSearchStream'
import GrantFinder from '@/components/GrantFinder'
import GrantResultsTable, { type SortOption } from '@/components/GrantResultsTable'
import GrantDetailPanel from '@/components/GrantDetailPanel'
import SignupGateModal from '@/components/SignupGateModal'
import SearchLimitGateModal from '@/components/SearchLimitGateModal'
import SignupNudgeBanner from '@/components/SignupNudgeBanner'
import DiscoveryFilters, { type FilterState, DEFAULT_FILTERS, applyFilters } from '@/components/DiscoveryFilters'
import DiscoveryTabs, { type DiscoveryTab } from '@/components/DiscoveryTabs'
import FunderMatchesTable, { type FunderMatch } from '@/components/FunderMatchesTable'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import EnrichmentProgress from '@/components/EnrichmentProgress'
import CheckoutButton from '@/components/CheckoutButton'
import SearchVisualization from '@/components/SearchVisualization'
import VizToggle, { persistVizMode } from '@/components/VizToggle'
import DeepResearchToggle from '@/components/DeepResearchToggle'
import type { VizMode, VizGrant } from '@/lib/viz/types'
import { trackEvent } from '@/lib/analytics'
import { hasReachedSearchLimit, incrementSearchCount, getSearchesRemaining } from '@/lib/search-limit'
import { GRANT_CATEGORIES, GRANT_US_STATES, type PublicGrant } from '@/lib/grants'
import { ORG_TYPES, US_STATES, AMOUNT_RANGES, type AmountRangeKey } from '@/hooks/useGrantSearchStream'

const agencyCategories = GRANT_CATEGORIES.filter((c) => c.type === 'agency')
const audienceCategories = GRANT_CATEGORIES.filter((c) => c.type === 'audience')
const topicCategories = GRANT_CATEGORIES.filter((c) => c.type === 'topic')

const STATS = [
  { stat: '20 hrs', label: 'avg. weekly search time saved' },
  { stat: '85%', label: 'of grants won by matched orgs' },
  { stat: '30 sec', label: 'to find grants with Granted' },
]

interface Props {
  closingSoon: PublicGrant[]
  newGrants: PublicGrant[]
  recentlyAdded: PublicGrant[]
  totalGrantCount: number
}

export default function GrantsPageClient({
  closingSoon,
  newGrants,
  recentlyAdded,
  totalGrantCount,
}: Props) {
  // Visualization state
  const [vizMode, setVizMode] = useState<VizMode>('list')
  const [vizActive, setVizActive] = useState(false)
  const vizEnvelopeHandlerRef = useRef<((envelope: StreamEnvelope) => void) | null>(null)
  // Buffer envelopes that arrive before the engine is ready (e.g., db_results
  // arrive in ~1s but engine needs 2-5s to load d3 dynamically)
  const vizEnvelopeBufferRef = useRef<StreamEnvelope[]>([])

  // NOTE: We intentionally do NOT restore persisted viz mode on mount.
  // The view always starts as 'list', and the toggle should match.
  // Users switch via the toggle, which persists their choice for next time
  // only within the same search session (handleVizModeChange).

  // No mobile override — list is default for all devices

  // onEnvelope callback — forwards NDJSON envelopes to the visualization engine,
  // buffering them if the engine isn't ready yet
  const handleEnvelope = useCallback((envelope: StreamEnvelope) => {
    if (vizEnvelopeHandlerRef.current) {
      vizEnvelopeHandlerRef.current(envelope)
    } else {
      // Engine not ready yet — buffer for replay
      vizEnvelopeBufferRef.current.push(envelope)
    }
  }, [])

  const search = useGrantSearchStream({ onEnvelope: handleEnvelope })
  const {
    phase,
    orgType,
    focusArea,
    state: searchState,
    amountRange,
    deepResearch,
    opportunities,
    error,
    broadened,
    enriching,
    enrichedNames,
    setOrgType,
    setFocusArea,
    setState,
    setAmountRange,
    setDeepResearch,
    handleSearch,
    handleBackToBrowsing,
  } = search

  // Activate visualization when enriching starts — only if user chose a viz mode (not list)
  useEffect(() => {
    if (enriching) {
      if (vizMode !== 'list') {
        setVizActive(true)
      }
      vizEnvelopeBufferRef.current = [] // Clear buffer for fresh search
    }
  }, [enriching]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset vizActive when going back to form/browsing
  useEffect(() => {
    if (phase === 'form') {
      setVizActive(false)
      vizEnvelopeBufferRef.current = []
    }
  }, [phase])

  // Results state
  const [sort, setSort] = useState<SortOption>('best_match')
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('grants')
  const [gatedGrant, setGatedGrant] = useState<Opportunity | null>(null)
  const [searchLimitReached, setSearchLimitReached] = useState(false)
  const [searchesRemaining, setSearchesRemaining] = useState(3)

  // Initialize search limit counter on mount
  useEffect(() => {
    setSearchesRemaining(getSearchesRemaining())
  }, [])

  // Track whether a search was user-initiated (via form) vs auto-triggered (URL ?q=)
  const userInitiatedRef = useRef(false)

  // Wrapped search handler — checks limit before executing, increments after
  const gatedHandleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (hasReachedSearchLimit()) {
      setSearchLimitReached(true)
      return
    }
    userInitiatedRef.current = true
    incrementSearchCount()
    setSearchesRemaining(getSearchesRemaining())
    handleSearch(e)
  }, [handleSearch])

  // Count auto-searches (URL ?q=) toward the limit too
  useEffect(() => {
    if (phase === 'loading' && !userInitiatedRef.current) {
      incrementSearchCount()
      setSearchesRemaining(getSearchesRemaining())
    }
    if (phase !== 'loading') {
      userInitiatedRef.current = false
    }
  }, [phase])

  // Auto-switch to funders tab if URL has tab=funders
  const tabParam = useSearchParams().get('tab')

  // Funder matches state
  const [funders, setFunders] = useState<FunderMatch[]>([])
  const [funderLoading, setFunderLoading] = useState(false)
  const funderCacheRef = useRef<{ key: string; data: FunderMatch[] } | null>(null)

  // Reset filters when new search happens
  useEffect(() => {
    if (phase === 'results') {
      setFilters(DEFAULT_FILTERS)
      setActiveTab(tabParam === 'funders' ? 'funders' : 'grants')
      setSelectedOpp(null)
    }
  }, [opportunities]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch funder matches when results come in
  useEffect(() => {
    if (phase !== 'results' || !focusArea) return

    const cacheKey = `${focusArea}|${searchState}`
    if (funderCacheRef.current?.key === cacheKey) {
      setFunders(funderCacheRef.current.data)
      return
    }

    setFunderLoading(true)
    fetch('/api/foundations/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        focus_area: focusArea,
        state: searchState || undefined,
        limit: 30,
      }),
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const results = data?.funders ?? []
        setFunders(results)
        funderCacheRef.current = { key: cacheKey, data: results }
      })
      .catch(() => setFunders([]))
      .finally(() => setFunderLoading(false))
  }, [phase, focusArea, searchState])

  const filteredOpps = applyFilters(opportunities, filters)
  const visibleEnrichedCount = filteredOpps.filter(opp => enrichedNames.has(opp.name)).length

  // Auto-scroll to completion banner when enrichment finishes
  const prevEnrichingRef = useRef(false)
  const completionBannerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prevEnrichingRef.current && !enriching && enrichedNames.size > 0) {
      setTimeout(() => {
        completionBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 150)
    }
    prevEnrichingRef.current = enriching
  }, [enriching, enrichedNames.size])

  // Handle grant selection from visualization — engine shows its own detail panel,
  // so we do NOT open the React GrantDetailPanel here (just track the event)
  const handleVizGrantSelect = useCallback((vizGrant: VizGrant) => {
    trackEvent('viz_grant_select', { name: vizGrant.name.slice(0, 120), mode: vizMode })
  }, [vizMode])

  // Unified toggle handler — Map/Grid activate viz, List deactivates
  const handleVizModeChange = useCallback((newMode: VizMode) => {
    setVizMode(newMode)
    persistVizMode(newMode)
    if (newMode === 'list') {
      setVizActive(false)
      trackEvent('viz_switch_to_list', { from: vizMode })
    } else {
      setVizActive(true)
      trackEvent('viz_mode_change', { mode: newMode })
    }
  }, [vizMode])

  const handleRowClick = useCallback((opp: Opportunity) => {
    setSelectedOpp(opp)
  }, [])

  const handleDetailClose = useCallback(() => {
    if (selectedOpp) {
      trackEvent('grant_discovery_detail_close', {
        grant_name: selectedOpp.name.slice(0, 120),
        method: 'close',
      })
    }
    setSelectedOpp(null)
  }, [selectedOpp])

  return (
    <>
      {/* Hero — only during form/loading phases */}
      {(phase === 'form' || phase === 'loading') && (
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-8 md:py-12 relative z-10">
            <RevealOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                {totalGrantCount > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 mb-6">
                    <span className="text-sm font-semibold text-brand-yellow">
                      {totalGrantCount.toLocaleString()}+ Opportunities
                    </span>
                  </div>
                )}
                <h1 className="heading-xl text-white">
                  Find the right grant for your organization
                </h1>
                <p className="body-lg mt-4 text-white/50 max-w-2xl mx-auto">
                  Search federal, foundation, and corporate grants with AI &mdash; or browse by agency, topic, and state.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      <Container>
      {/* Grant Finder — form + loading */}
      {(phase === 'form' || phase === 'loading') && (
        <div className="py-12 md:py-16">
          <GrantFinder
            phase={phase}
            orgType={orgType}
            focusArea={focusArea}
            state={searchState}
            amountRange={amountRange}
            error={error}
            deepResearch={deepResearch}
            setOrgType={setOrgType}
            setFocusArea={setFocusArea}
            setState={setState}
            setAmountRange={setAmountRange}
            setDeepResearch={setDeepResearch}
            handleSearch={gatedHandleSearch}
            searchesRemaining={searchesRemaining}
          />
        </div>
      )}

      {/* Visualization phase — shown when viz is active (during AND after enrichment) */}
      {phase === 'results' && vizActive && (
        <>
          {/* Search bar above visualization — matches list view controls */}
          <div className="pt-8 md:pt-12 pb-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handleBackToBrowsing}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-light hover:text-navy transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Back to browsing
                </button>
                <div className="flex items-center gap-3">
                  <DeepResearchToggle compact enabled={deepResearch} onChange={setDeepResearch} />
                  <VizToggle mode={vizMode} onChange={handleVizModeChange} />
                </div>
              </div>

              <form onSubmit={gatedHandleSearch} className="card p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <select
                      value={orgType}
                      onChange={e => {
                        setOrgType(e.target.value)
                        trackEvent('grant_finder_filter_change', {
                          filter: 'org_type',
                          value: e.target.value || 'any',
                          surface: 'results_viz',
                        })
                      }}
                      className="sm:w-36 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
                    >
                      <option value="">Any org type</option>
                      {ORG_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      minLength={3}
                      value={focusArea}
                      onChange={e => setFocusArea(e.target.value)}
                      onBlur={() =>
                        trackEvent('grant_finder_focus_blur', {
                          focus_area: summarizeTerm(focusArea),
                          surface: 'results_viz',
                        })
                      }
                      placeholder="Focus area..."
                      className="flex-1 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 transition"
                    />
                    <select
                      value={searchState}
                      onChange={e => {
                        setState(e.target.value)
                        trackEvent('grant_finder_filter_change', {
                          filter: 'state',
                          value: e.target.value || 'any',
                          surface: 'results_viz',
                        })
                      }}
                      className="sm:w-36 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
                    >
                      <option value="">Any state</option>
                      {US_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      value={amountRange}
                      onChange={e => {
                        setAmountRange(e.target.value as AmountRangeKey)
                        trackEvent('grant_finder_filter_change', {
                          filter: 'amount_range',
                          value: e.target.value || 'any',
                          surface: 'results_viz',
                        })
                      }}
                      className="sm:w-36 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
                    >
                      {AMOUNT_RANGES.map(r => (
                        <option key={r.key} value={r.key}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold bg-brand-yellow text-navy hover:bg-brand-gold transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Visualization canvas — overflow-hidden clips sidebar within container bounds */}
          <div className="relative overflow-hidden rounded-lg">
            <SearchVisualization
              mode={vizMode}
              focusArea={focusArea}
              orgType={orgType}
              state={searchState}
              enriching={enriching}
              opportunities={opportunities}
              onGrantSelect={handleVizGrantSelect}
              onReady={(processEnvelope) => {
                vizEnvelopeHandlerRef.current = processEnvelope
                // Don't replay buffered envelopes — loadAll already rendered existing
                // opportunities. Only forward NEW envelopes from here on.
                vizEnvelopeBufferRef.current = []
              }}
              onTeardown={() => {
                vizEnvelopeHandlerRef.current = null
              }}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* Results phase — list view */}
      {phase === 'results' && !vizActive && (
        <div className="py-4 md:py-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button + view toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handleBackToBrowsing}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-light hover:text-navy transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to browsing
              </button>
              <div className="flex items-center gap-3">
                <DeepResearchToggle compact enabled={deepResearch} onChange={setDeepResearch} />
                <VizToggle mode={vizMode} onChange={handleVizModeChange} />
              </div>
            </div>

            {/* Compact search bar */}
            <form onSubmit={gatedHandleSearch} className="card p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <select
                    value={orgType}
                    onChange={e => {
                      setOrgType(e.target.value)
                      trackEvent('grant_finder_filter_change', {
                        filter: 'org_type',
                        value: e.target.value || 'any',
                        surface: 'results',
                      })
                    }}
                    className="sm:w-36 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
                  >
                    <option value="">Any org type</option>
                    {ORG_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={focusArea}
                    onChange={e => setFocusArea(e.target.value)}
                    onBlur={() =>
                      trackEvent('grant_finder_focus_blur', {
                        focus_area: summarizeTerm(focusArea),
                        surface: 'results',
                      })
                    }
                    placeholder="Focus area..."
                    className="flex-1 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 transition"
                  />
                  <select
                    value={searchState}
                    onChange={e => {
                      setState(e.target.value)
                      trackEvent('grant_finder_filter_change', {
                        filter: 'state',
                        value: e.target.value || 'any',
                        surface: 'results',
                      })
                    }}
                    className="sm:w-36 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
                  >
                    <option value="">Any state</option>
                    {US_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    value={amountRange}
                    onChange={e => {
                      setAmountRange(e.target.value as AmountRangeKey)
                      trackEvent('grant_finder_filter_change', {
                        filter: 'amount_range',
                        value: e.target.value || 'any',
                        surface: 'results',
                      })
                    }}
                    className="sm:w-36 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
                  >
                    {AMOUNT_RANGES.map(r => (
                      <option key={r.key} value={r.key}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold bg-brand-yellow text-navy hover:bg-brand-gold transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </button>
              </div>
            </form>

            {broadened && (
              <p className="text-xs text-navy-light/60 mb-3">
                We broadened your search to find more results.
              </p>
            )}

            {/* Enrichment progress */}
            {enriching && (
              <EnrichmentProgress
                focusArea={focusArea}
                orgType={orgType}
                state={searchState}
                resultCount={opportunities.length}
              />
            )}
            {!enriching && visibleEnrichedCount > 0 && (
              <div
                ref={completionBannerRef}
                className="flex items-center gap-3 px-5 py-4 rounded-xl bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 border border-brand-yellow/25 mb-6"
                style={{ animation: 'enrichSlideIn 0.5s ease-out' }}
              >
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-yellow/20">
                  <svg className="text-brand-gold" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Found {visibleEnrichedCount} additional {visibleEnrichedCount === 1 ? 'grant' : 'grants'} from AI web search
                  </p>
                  <p className="text-xs text-navy-light/50 mt-0.5">
                    Look for the highlighted results below
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {opportunities.length === 0 ? (
              <div className="text-center">
                <div className="card p-10">
                  <svg className="mx-auto mb-4 text-navy-light/30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <h3 className="text-lg font-semibold text-navy mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                    No grants found for that search
                  </h3>
                  <p className="text-sm text-navy-light max-w-md mx-auto">
                    Try broadening your focus area or removing the state filter. Shorter, more general terms work best — e.g. &ldquo;clean energy&rdquo; instead of &ldquo;residential solar panel installation programs.&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex items-center gap-3 mb-1">
                  <DiscoveryTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    grantCount={filteredOpps.length}
                    funderCount={funders.length}
                    funderLoading={funderLoading}
                  />
                </div>

                {activeTab === 'grants' && (
                  <>
                    {/* Filters */}
                    <DiscoveryFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      totalCount={opportunities.length}
                      filteredCount={filteredOpps.length}
                    />

                    {/* Results table */}
                    <GrantResultsTable
                      opportunities={filteredOpps}
                      onRowClick={handleRowClick}
                      onApplyClick={setGatedGrant}
                      sort={sort}
                      onSortChange={setSort}
                      focusArea={focusArea}
                      orgType={orgType}
                      state={searchState}
                      enrichedNames={enrichedNames}
                    />
                  </>
                )}

                {activeTab === 'funders' && (
                  <FunderMatchesTable
                    funders={funders}
                    loading={funderLoading}
                  />
                )}
              </>
            )}

            {/* CTA */}
            <div className="mt-10 text-center">
              <p className="text-sm text-navy-light mb-4">
                Want AI to help you write a winning proposal for any of these grants?
              </p>
              <CheckoutButton label="Sign Up Free" eventName="grant_finder_cta" />
            </div>
          </div>

          {/* Sticky nudge banner */}
          <SignupNudgeBanner
            enriching={enriching}
            resultCount={filteredOpps.length}
            focusArea={focusArea}
            orgType={orgType}
            state={searchState}
          />
        </div>
      )}

      {/* Detail panel — only in list mode (viz engines have their own built-in detail panel) */}
      {!vizActive && (
        <GrantDetailPanel
          opportunity={selectedOpp}
          onClose={handleDetailClose}
          onApplyClick={setGatedGrant}
          focusArea={focusArea}
          orgType={orgType}
          state={searchState}
        />
      )}

      {/* Signup gate modal */}
      {gatedGrant && (
        <SignupGateModal
          opportunity={gatedGrant}
          onClose={() => setGatedGrant(null)}
          focusArea={focusArea}
          orgType={orgType}
          state={searchState}
        />
      )}

      {/* Search limit gate modal */}
      {searchLimitReached && (
        <SearchLimitGateModal
          onClose={() => setSearchLimitReached(false)}
          focusArea={focusArea}
          orgType={orgType}
          state={searchState}
        />
      )}

      {/* Stats bar */}
      {phase === 'form' && (
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {STATS.map((item) => (
            <div key={item.stat} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/8 border border-brand-yellow/15">
              <span className="text-sm font-bold text-navy" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                {item.stat}
              </span>
              <span className="text-xs text-navy-light">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Browse sections — visible only in form phase */}
      {phase === 'form' && (
        <>
          {/* Category quick-links */}
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4">By Agency</h2>
              <div className="flex flex-wrap gap-2">
                {agencyCategories.map((c) => (
                  <Link key={c.slug} href={`/grants/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">By Audience</h2>
              <div className="flex flex-wrap gap-2">
                {audienceCategories.map((c) => (
                  <Link key={c.slug} href={`/grants/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {c.name}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">By Topic</h2>
              <div className="flex flex-wrap gap-2">
                {topicCategories.map((c) => (
                  <Link key={c.slug} href={`/grants/${c.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">By State</h2>
              <div className="flex flex-wrap gap-2">
                {GRANT_US_STATES.map((s) => (
                  <Link key={s.slug} href={`/grants/state/${s.slug}`} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
                    {s.abbreviation}
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Closing soon */}
          {closingSoon.length > 0 && (
            <RevealOnScroll delay={50}>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-lg text-navy">Closing Soon</h2>
                  <Link href="/grants/closing-soon" className="text-sm font-semibold text-brand-gold hover:underline">View all</Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {closingSoon.slice(0, 3).map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* New this month */}
          {newGrants.length > 0 && (
            <RevealOnScroll delay={75}>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-lg text-navy">New This Month</h2>
                  <Link href="/grants/new" className="text-sm font-semibold text-brand-gold hover:underline">View all</Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {newGrants.slice(0, 3).map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* Recently added */}
          {recentlyAdded.length > 0 && (
            <RevealOnScroll delay={100}>
              <div className="mb-12">
                <h2 className="heading-lg text-navy mb-8">Recently Discovered</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentlyAdded.map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* Empty state — only when DB has no grants */}
          {totalGrantCount === 0 && (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">Search for grants above</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  Use our AI-powered search to discover federal, foundation, and corporate grant opportunities tailored to your organization.
                </p>
              </div>
            </RevealOnScroll>
          )}

          {/* Bottom CTA */}
          <RevealOnScroll delay={300}>
            <div className="mt-20">
              <GrantCTA />
            </div>
          </RevealOnScroll>
        </>
      )}
      </Container>
    </>
  )
}
