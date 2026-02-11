'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useGrantSearch, summarizeTerm } from '@/hooks/useGrantSearch'
import type { Phase, Opportunity } from '@/hooks/useGrantSearch'
import GrantFinder from '@/components/GrantFinder'
import GrantResultsTable, { type SortOption } from '@/components/GrantResultsTable'
import GrantDetailPanel from '@/components/GrantDetailPanel'
import DiscoveryFilters, { type FilterState, DEFAULT_FILTERS, applyFilters } from '@/components/DiscoveryFilters'
import DiscoveryTabs, { type DiscoveryTab } from '@/components/DiscoveryTabs'
import FunderMatchesTable, { type FunderMatch } from '@/components/FunderMatchesTable'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import CheckoutButton from '@/components/CheckoutButton'
import { trackEvent } from '@/lib/analytics'
import { GRANT_CATEGORIES, GRANT_US_STATES, type PublicGrant } from '@/lib/grants'
import { ORG_TYPES, US_STATES } from '@/hooks/useGrantSearch'

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
  activeGrants: PublicGrant[]
  upcomingGrants: PublicGrant[]
  totalGrantCount: number
}

export default function GrantsPageClient({
  closingSoon,
  newGrants,
  activeGrants,
  upcomingGrants,
  totalGrantCount,
}: Props) {
  const search = useGrantSearch()
  const {
    phase,
    orgType,
    focusArea,
    state: searchState,
    opportunities,
    error,
    unlocked,
    email,
    emailStatus,
    gateRequired,
    broadened,
    searchSaved,
    setOrgType,
    setFocusArea,
    setState,
    setEmail,
    handleSearch,
    handleBackToBrowsing,
    handleEmailSubmit,
    handleSaveSearch,
  } = search

  // Results state
  const [sort, setSort] = useState<SortOption>('best_match')
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('grants')

  // Funder matches state
  const [funders, setFunders] = useState<FunderMatch[]>([])
  const [funderLoading, setFunderLoading] = useState(false)
  const funderCacheRef = useRef<{ key: string; data: FunderMatch[] } | null>(null)

  // Reset filters when new search happens
  useEffect(() => {
    if (phase === 'results') {
      setFilters(DEFAULT_FILTERS)
      setActiveTab('grants')
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
        limit: 20,
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

  const handleEmailGateClick = useCallback(() => {
    trackEvent('grant_finder_locked_details_click', { surface: 'discovery' })
    document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  return (
    <>
      {/* Grant Finder — form + loading */}
      {(phase === 'form' || phase === 'loading') && (
        <div className="py-12 md:py-16">
          <GrantFinder
            phase={phase}
            orgType={orgType}
            focusArea={focusArea}
            state={searchState}
            error={error}
            gateRequired={gateRequired}
            unlocked={unlocked}
            email={email}
            emailStatus={emailStatus}
            setOrgType={setOrgType}
            setFocusArea={setFocusArea}
            setState={setState}
            setEmail={setEmail}
            handleSearch={handleSearch}
            handleEmailSubmit={handleEmailSubmit}
          />
        </div>
      )}

      {/* Results phase */}
      {phase === 'results' && (
        <div className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBackToBrowsing}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-light hover:text-navy transition-colors mb-4"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Back to browsing
            </button>

            {/* Compact search bar */}
            <form onSubmit={handleSearch} className="card p-4 mb-6">
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
                <DiscoveryTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  grantCount={filteredOpps.length}
                  funderCount={funders.length}
                  funderLoading={funderLoading}
                />

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
                      unlocked={unlocked}
                      onRowClick={handleRowClick}
                      onEmailGateClick={handleEmailGateClick}
                      sort={sort}
                      onSortChange={setSort}
                      focusArea={focusArea}
                      orgType={orgType}
                      state={searchState}
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

            {/* Email gate (shown below results if not unlocked) */}
            {!unlocked && opportunities.length > 0 && (
              <div id="email-gate" className="card overflow-hidden mt-8">
                <div className="bg-navy p-8 text-center noise-overlay">
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                      Unlock full fit analysis + source links
                    </h3>
                    <p className="text-white/60 mt-2 text-sm max-w-md mx-auto">
                      Enter your email to see full summaries, eligibility requirements, and direct links for every result.
                    </p>

                    <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@organization.org"
                        className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-yellow/60 focus:ring-1 focus:ring-brand-yellow/40 transition"
                      />
                      <button
                        type="submit"
                        disabled={emailStatus === 'loading'}
                        className="rounded-md bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60 shrink-0"
                      >
                        {emailStatus === 'loading' ? 'Unlocking...' : 'Unlock Details'}
                      </button>
                    </form>
                    {emailStatus === 'error' && (
                      <p className="text-xs text-red-400 mt-2">Something went wrong. Please try again.</p>
                    )}
                    <p className="mt-3 text-xs text-white/30">No spam. Unsubscribe anytime.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save search CTA */}
            {unlocked && !searchSaved && opportunities.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={handleSaveSearch}
                  className="inline-flex items-center gap-2 rounded-md border border-navy/15 bg-white px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy/5 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                  Save this search & get weekly alerts
                </button>
              </div>
            )}
            {searchSaved && (
              <div className="mt-8 text-center">
                <p className="text-sm text-green-700 font-medium">
                  Search saved! We&apos;ll email you weekly when new grants match.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 text-center">
              <p className="text-sm text-navy-light mb-4">
                Want AI to help you write a winning proposal for any of these grants?
              </p>
              <CheckoutButton label="Try Granted Free" eventName="grant_finder_cta" />
            </div>
          </div>
        </div>
      )}

      {/* Detail panel */}
      <GrantDetailPanel
        opportunity={selectedOpp}
        onClose={handleDetailClose}
        unlocked={unlocked}
        onEmailGateClick={handleEmailGateClick}
        focusArea={focusArea}
        orgType={orgType}
        state={searchState}
      />

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

          {/* Active grants */}
          {activeGrants.length > 0 && (
            <RevealOnScroll delay={100}>
              <h2 className="heading-lg text-navy mb-8">Active Grants</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeGrants.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* Upcoming grants */}
          {upcomingGrants.length > 0 && (
            <RevealOnScroll delay={200}>
              <h2 className="heading-lg text-navy mb-8 mt-16">Upcoming Grants</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingGrants.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* Empty state */}
          {totalGrantCount === 0 && (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">No grants matched right now</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  New grants are added continuously. Try a broader search, or start drafting your next proposal with Granted AI.
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
    </>
  )
}
