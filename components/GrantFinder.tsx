'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { supabase } from '@/lib/supabase'
import CheckoutButton from '@/components/CheckoutButton'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.grantedai.com'

const ORG_TYPES = [
  'Nonprofit',
  'University',
  'Small Business',
  'Tribal',
  'Government',
  'Other',
] as const

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
  'District of Columbia', 'Puerto Rico', 'Guam', 'US Virgin Islands',
  'American Samoa', 'Northern Mariana Islands',
]

interface Opportunity {
  name: string
  funder: string
  deadline: string
  amount: string
  fit_score: number
  summary: string
  eligibility: string
  rfp_url?: string
  google_url?: string
  verified?: boolean
  source_provider?: string
  slug?: string
  match_reasons?: string[]
  last_verified_at?: string
  staleness_bucket?: string
  quality_score?: number
}

const SOURCE_LABELS: Record<string, string> = {
  grants_gov: 'Grants.gov',
  sam_assistance: 'SAM.gov',
  nih_guide: 'NIH',
  nsf_funding: 'NSF',
  nih_weekly_index: 'NIH',
  nsf_upcoming: 'NSF',
}

const OFFICIAL_SOURCES = new Set([
  'grants_gov',
  'sam_assistance',
  'nih_guide',
  'nsf_funding',
  'nih_weekly_index',
  'nsf_upcoming',
])

type Phase = 'form' | 'loading' | 'results'
const APPLY_CALLBACK_PATH = '/opportunities'

function getSearchCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem('gf_searches')
    return raw ? parseInt(raw, 10) : 0
  } catch { return 0 }
}

function incrementSearchCount(): number {
  const next = getSearchCount() + 1
  try { localStorage.setItem('gf_searches', String(next)) } catch {}
  return next
}

function isUnlocked(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('gf_unlocked=1')
}

function setUnlockedCookie() {
  document.cookie = 'gf_unlocked=1; max-age=2592000; path=/; SameSite=Lax'
}

function relativeTime(isoDate: string): string {
  const ms = Date.now() - Date.parse(isoDate)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

function buildApplyUrl(opportunity: Opportunity): string {
  const grantName = encodeURIComponent(opportunity.name)
  const callback = encodeURIComponent(`${APPLY_CALLBACK_PATH}?source=public-grant-finder&grant=${grantName}`)
  return `${API_URL}/api/auth/signin?callbackUrl=${callback}`
}

function summarizeTerm(input: string): string {
  const normalized = input.trim().replace(/\s+/g, ' ')
  if (!normalized) return ''
  return normalized.length > 140 ? `${normalized.slice(0, 140)}...` : normalized
}

export default function GrantFinder() {
  const [phase, setPhase] = useState<Phase>('form')
  const [orgType, setOrgType] = useState('')
  const [focusArea, setFocusArea] = useState('')
  const [state, setState] = useState('')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [gateRequired, setGateRequired] = useState(false)
  const [broadened, setBroadened] = useState(false)
  const [searchSaved, setSearchSaved] = useState(false)

  const searchParams = useSearchParams()
  const autoSearchedQueryRef = useRef<string | null>(null)
  const profileFetched = useRef(false)

  useEffect(() => {
    setUnlocked(isUnlocked())
  }, [])

  // Prepopulate from app profile if logged in (cross-origin, may fail silently on Safari ITP)
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
      .catch(() => {
        // Expected to fail silently (ITP, no cookies, network)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const doSearch = useCallback(async (searchOrgType: string, searchFocusArea: string, searchState: string, isRetry = false): Promise<Opportunity[]> => {
    const res = await fetch(`${API_URL}/api/public/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_type: searchOrgType || undefined,
        focus_area: searchFocusArea,
        state: searchState || undefined,
      }),
    })

    if (res.status === 429) {
      setError('You have reached the daily search limit. Enter your email below for unlimited access, or try again tomorrow.')
      setPhase('form')
      setGateRequired(true)
      return []
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Search failed')
    }

    const data = await res.json()
    return data.opportunities || []
  }, [])

  const runSearch = useCallback(async (
    searchOrgType: string,
    searchFocusArea: string,
    searchState: string,
    source: 'manual' | 'url' = 'manual',
  ) => {
    const normalizedFocus = searchFocusArea.trim()
    if (!normalizedFocus) return

    setError('')
    setBroadened(false)
    setGateRequired(false)

    const currentlyUnlocked = isUnlocked()
    setUnlocked(currentlyUnlocked)

    if (!currentlyUnlocked && getSearchCount() >= 3) {
      setGateRequired(true)
      trackEvent('grant_finder_gate', { reason: source === 'url' ? 'search_limit_url' : 'search_limit' })
      return
    }

    trackEvent('grant_finder_search', {
      org_type: searchOrgType || 'any',
      state: searchState || 'any',
      focus_area: summarizeTerm(normalizedFocus),
      focus_area_length: normalizedFocus.length,
      source,
    })
    setPhase('loading')

    try {
      let results = await doSearch(searchOrgType, normalizedFocus, searchState)
      let broadenedSearch = false

      // Auto-retry with fewer filters if no results
      if (results.length === 0 && (searchOrgType || searchState)) {
        // Drop state first, then org type
        if (searchState) {
          results = await doSearch(searchOrgType, normalizedFocus, '')
        }
        if (results.length === 0 && searchOrgType) {
          results = await doSearch('', normalizedFocus, '')
        }
        if (results.length > 0) {
          broadenedSearch = true
          setBroadened(true)
        }
      }

      // Match slugs from public_grants table
      if (supabase && results.length > 0) {
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
        } catch {
          // Non-critical — slug matching is a bonus
        }
      }

      // Sort by fit score descending
      results.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))

      setOpportunities(results)
      incrementSearchCount()
      setPhase('results')
      trackEvent('grant_finder_results', {
        count: String(results.length),
        broadened: String(broadenedSearch),
        source,
        focus_area: summarizeTerm(normalizedFocus),
        top_grant: results[0]?.name ?? '',
      })
    } catch (err) {
      trackEvent('grant_finder_search_error', {
        source,
        message: err instanceof Error ? err.message : 'unknown_error',
      })
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }, [doSearch])

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await runSearch(orgType, focusArea, state, 'manual')
  }, [orgType, focusArea, state, runSearch])

  // Auto-run search when arriving from homepage with a query string.
  useEffect(() => {
    const q = searchParams.get('q')?.trim() ?? ''

    if (!q) {
      autoSearchedQueryRef.current = null
      return
    }

    if (!focusArea) {
      setFocusArea(q)
    }

    if (autoSearchedQueryRef.current === q) {
      return
    }

    autoSearchedQueryRef.current = q
    void runSearch(orgType, q, state, 'url')
  }, [searchParams, focusArea, orgType, state, runSearch])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    trackEvent('grant_finder_email_submit', {
      org_type: orgType || 'any',
      state: state || 'any',
      focus_area: summarizeTerm(focusArea),
      result_count: opportunities.length,
    })

    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          search_query: { org_type: orgType, focus_area: focusArea, state },
        }),
      })

      if (res.ok) {
        setEmailStatus('success')
        setUnlocked(true)
        setUnlockedCookie()
        document.cookie = `gf_email=${encodeURIComponent(email)}; max-age=2592000; path=/; SameSite=Lax`
        setGateRequired(false)
        trackEvent('grant_finder_email_success', {
          org_type: orgType || 'any',
          state: state || 'any',
          focus_area: summarizeTerm(focusArea),
          result_count: opportunities.length,
        })
      } else {
        setEmailStatus('error')
        trackEvent('grant_finder_email_error', { status: String(res.status) })
      }
    } catch {
      setEmailStatus('error')
      trackEvent('grant_finder_email_error', { status: 'network_error' })
    }
  }

  const handleSaveSearch = async () => {
    const emailValue = email || (document.cookie.match(/gf_email=([^;]+)/)?.[1] ?? '')
    if (!emailValue) {
      document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    try {
      const res = await fetch('/api/searches/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          search_params: { org_type: orgType, focus_area: focusArea, state },
          label: focusArea,
        }),
      })
      if (res.ok) {
        setSearchSaved(true)
        trackEvent('grant_finder_search_saved', {
          focus_area: summarizeTerm(focusArea),
          org_type: orgType || 'any',
        })
      }
    } catch {}
  }

  /* ── Loading ── */
  if (phase === 'loading') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20">
            <svg className="animate-spin h-4 w-4 text-brand-yellow" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-navy">Scanning the largest grants + funders database...</span>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 bg-navy/8 rounded w-3/4 mb-3" />
              <div className="h-4 bg-navy/5 rounded w-1/2 mb-4" />
              <div className="flex gap-4">
                <div className="h-4 bg-navy/5 rounded w-24" />
                <div className="h-4 bg-navy/5 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Results ── */
  if (phase === 'results') {
    // Empty state — no results even after broadening
    if (opportunities.length === 0) {
      return (
        <div className="max-w-3xl mx-auto">
          {/* Compact search bar */}
          <form onSubmit={handleSearch} className="card p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <select
                  value={orgType}
                  onChange={e => {
                    const value = e.target.value
                    setOrgType(value)
                    trackEvent('grant_finder_filter_change', {
                      filter: 'org_type',
                      value: value || 'any',
                      surface: 'results_empty',
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
                      surface: 'results_empty',
                    })
                  }
                  placeholder="Focus area..."
                  className="flex-1 rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 transition"
                />
                <select
                  value={state}
                  onChange={e => {
                    const value = e.target.value
                    setState(value)
                    trackEvent('grant_finder_filter_change', {
                      filter: 'state',
                      value: value || 'any',
                      surface: 'results_empty',
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
        </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto">
        {/* Compact search bar (Google-style) */}
        <form onSubmit={handleSearch} className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <select
                value={orgType}
                onChange={e => {
                  const value = e.target.value
                  setOrgType(value)
                  trackEvent('grant_finder_filter_change', {
                    filter: 'org_type',
                    value: value || 'any',
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
                value={state}
                onChange={e => {
                  const value = e.target.value
                  setState(value)
                  trackEvent('grant_finder_filter_change', {
                    filter: 'state',
                    value: value || 'any',
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

        {/* Result count */}
        <div className="mb-4">
          <p className="text-sm font-medium text-navy-light">
            Found <span className="font-semibold text-navy">{opportunities.length}</span> high-fit opportunities from across federal, foundation, and corporate sources
          </p>
          {broadened && (
            <p className="text-xs text-navy-light/60 mt-1">
              We broadened your search to find more results.
            </p>
          )}
        </div>

        {/* Opportunity cards */}
        <div className="space-y-4">
          {opportunities.map((opp, i) => (
            <div key={i} className="card p-6 transition-shadow hover:shadow-lg">
              {/* Ungated: always visible */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-semibold text-navy leading-snug">
                    {opp.slug ? (
                      <a
                        href={`/grants/${opp.slug}`}
                        onClick={() => {
                          trackEvent('grant_finder_result_grant_click', {
                            grant_name: opp.name.slice(0, 120),
                            grant_slug: opp.slug,
                            source: 'result_card_title',
                          })
                        }}
                        className="hover:text-brand-gold hover:underline underline-offset-2 transition-colors"
                      >
                        {opp.name}
                      </a>
                    ) : (
                      opp.name
                    )}
                  </h3>
                  <p className="text-sm text-navy-light mt-1">{opp.funder}</p>
                </div>
                {opp.fit_score > 0 && (
                  <span
                    className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: opp.fit_score >= 70 ? '#22c55e18' : opp.fit_score >= 40 ? '#F5CF4918' : '#6b728018',
                      color: opp.fit_score >= 70 ? '#16a34a' : opp.fit_score >= 40 ? '#b8941c' : '#6b7280',
                    }}
                  >
                    {opp.fit_score}% fit
                  </span>
                )}
              </div>

              {/* Source + trust badges */}
              {(opp.source_provider || opp.verified) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {opp.source_provider && OFFICIAL_SOURCES.has(opp.source_provider) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ backgroundColor: '#1e40af0d', color: '#1e40af' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      {SOURCE_LABELS[opp.source_provider] ?? opp.source_provider}
                    </span>
                  )}
                  {opp.verified && opp.rfp_url && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ backgroundColor: '#16a34a0d', color: '#15803d' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      Verified link
                    </span>
                  )}
                </div>
              )}

              {/* Match reasons */}
              {opp.match_reasons && opp.match_reasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {opp.match_reasons.slice(0, 3).map((reason, ri) => (
                    <span key={ri} className="px-2 py-0.5 rounded text-[11px] font-medium text-navy-light/70 bg-navy/[0.04]">
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* Amount + Deadline: always visible */}
              <div className="flex flex-wrap gap-3 mb-4">
                {opp.amount && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-navy-light">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                    {opp.amount}
                  </span>
                )}
                {opp.deadline && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-navy-light">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    {opp.deadline}
                  </span>
                )}
                {opp.last_verified_at && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-navy-light/50">
                    Verified {relativeTime(opp.last_verified_at)}
                  </span>
                )}
                {opp.staleness_bucket === 'aging' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ backgroundColor: '#f59e0b12', color: '#b45309' }}>
                    Verify at source
                  </span>
                )}
                {opp.staleness_bucket === 'stale' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ backgroundColor: '#6b728012', color: '#6b7280' }}>
                    Verify at source
                  </span>
                )}
              </div>

              {/* Gated: summary and eligibility */}
              {unlocked ? (
                <div>
                  {opp.summary && (
                    <p className="text-sm text-navy-light leading-relaxed mb-3">{opp.summary}</p>
                  )}
                  {opp.eligibility && (
                    <p className="text-xs text-navy-light/70 mb-3">
                      <span className="font-semibold text-navy-light">Eligible:</span> {opp.eligibility}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('grant_finder_locked_details_click', {
                      grant_name: opp.name.slice(0, 120),
                    })
                    document.getElementById('email-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                  className="relative w-full text-left cursor-pointer group"
                >
                  <div className="select-none blur-[6px] pointer-events-none" aria-hidden="true">
                    <p className="text-sm text-navy-light leading-relaxed mb-2">This grant supports organizations working in community development and environmental justice initiatives across the United States.</p>
                    <p className="text-xs text-navy-light/70">Eligible: 501(c)(3) nonprofits with annual budget under $5M</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-navy/5 text-navy-light border border-navy/10 group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/30 group-hover:text-navy transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                      Enter email to unlock details
                    </span>
                  </div>
                </button>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={buildApplyUrl(opp)}
                  onClick={() => {
                    trackEvent('grant_finder_apply_click', {
                      grant_name: opp.name.slice(0, 120),
                      grant_slug: opp.slug || '',
                      source: 'result_card',
                      focus_area: summarizeTerm(focusArea),
                      org_type: orgType || 'any',
                      state: state || 'any',
                    })
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-yellow px-4 py-2 text-sm font-semibold text-navy hover:bg-brand-gold transition-colors"
                >
                  Apply with Granted
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>

                {unlocked && opp.rfp_url && (
                  <a
                    href={opp.rfp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent('grant_finder_view_opportunity_click', {
                        grant_name: opp.name.slice(0, 120),
                        grant_slug: opp.slug || '',
                        funder: opp.funder,
                        source: 'result_card',
                      })
                    }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-yellow hover:text-brand-gold transition-colors"
                  >
                    View opportunity
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* Email gate (shown below results if not unlocked) */}
        {!unlocked && (
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
        {unlocked && !searchSaved && (
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
    )
  }

  /* ── Form ── */
  return (
    <div className="max-w-2xl mx-auto">
      {/* Email gate overlay (if search limit reached) */}
      {gateRequired && !unlocked && (
        <div className="card overflow-hidden mb-8">
          <div className="bg-navy p-8 text-center noise-overlay">
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                Unlock unlimited searches
              </h3>
              <p className="text-white/60 mt-2 text-sm max-w-md mx-auto">
                Enter your email to continue searching and unlock full grant details.
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
                  {emailStatus === 'loading' ? 'Unlocking...' : 'Unlock Access'}
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

      <form onSubmit={handleSearch} className="card p-8 md:p-10">
        <div className="space-y-6">
          {/* Org type */}
          <div>
            <label htmlFor="gf-org-type" className="block text-sm font-semibold text-navy mb-2">
              Organization type
            </label>
            <select
              id="gf-org-type"
              value={orgType}
              onChange={e => {
                const value = e.target.value
                setOrgType(value)
                trackEvent('grant_finder_filter_change', {
                  filter: 'org_type',
                  value: value || 'any',
                  surface: 'form',
                })
              }}
              className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none focus:border-brand-yellow/60 focus:ring-2 focus:ring-brand-yellow/20 transition appearance-none"
            >
              <option value="">Select type (optional)</option>
              {ORG_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Focus area */}
          <div>
            <label htmlFor="gf-focus" className="block text-sm font-semibold text-navy mb-2">
              Focus area <span className="text-red-400">*</span>
            </label>
            <input
              id="gf-focus"
              type="text"
              required
              minLength={3}
              value={focusArea}
              onChange={e => setFocusArea(e.target.value)}
              onBlur={() =>
                trackEvent('grant_finder_focus_blur', {
                  focus_area: summarizeTerm(focusArea),
                  surface: 'form',
                })
              }
              placeholder="e.g. youth mental health, clean energy, marine conservation"
              className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 focus:ring-2 focus:ring-brand-yellow/20 transition"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="gf-state" className="block text-sm font-semibold text-navy mb-2">
              State / Territory
            </label>
            <select
              id="gf-state"
              value={state}
              onChange={e => {
                const value = e.target.value
                setState(value)
                trackEvent('grant_finder_filter_change', {
                  filter: 'state',
                  value: value || 'any',
                  surface: 'form',
                })
              }}
              className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none focus:border-brand-yellow/60 focus:ring-2 focus:ring-brand-yellow/20 transition appearance-none"
            >
              <option value="">Select state (optional)</option>
              {US_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={gateRequired && !unlocked}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-pill min-h-[3.25rem] text-base font-semibold bg-brand-yellow text-navy hover:bg-brand-gold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Find Matching Grants
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      <p className="mt-4 text-sm text-navy-light/60 text-center">
        Free &middot; No account required &middot; Powered by AI across the world&apos;s largest grants + funders database
      </p>
    </div>
  )
}
