'use client'

import { useState, useEffect, useCallback } from 'react'
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
  slug?: string
}

type Phase = 'form' | 'loading' | 'results'

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

  const searchParams = useSearchParams()

  useEffect(() => {
    setUnlocked(isUnlocked())
  }, [])

  // Pre-fill focus area from URL query param (from homepage hero search)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !focusArea) {
      setFocusArea(q)
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!unlocked && getSearchCount() >= 3) {
      setGateRequired(true)
      trackEvent('grant_finder_gate', { reason: 'search_limit' })
      return
    }

    trackEvent('grant_finder_search', { org_type: orgType, state })
    setPhase('loading')

    try {
      const res = await fetch(`${API_URL}/api/public/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_type: orgType || undefined,
          focus_area: focusArea,
          state: state || undefined,
        }),
      })

      if (res.status === 429) {
        setError('You have reached the daily search limit. Enter your email below for unlimited access, or try again tomorrow.')
        setPhase('form')
        setGateRequired(true)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Search failed')
      }

      const data = await res.json()
      const results: Opportunity[] = data.opportunities || []

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

      setOpportunities(results)
      incrementSearchCount()
      setPhase('results')
      trackEvent('grant_finder_results', { count: String(results.length), cached: String(!!data.cached) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPhase('form')
    }
  }, [orgType, focusArea, state, unlocked])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    trackEvent('grant_finder_email_submit', {})

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
        setGateRequired(false)
        trackEvent('grant_finder_email_success', {})
      } else {
        setEmailStatus('error')
      }
    } catch {
      setEmailStatus('error')
    }
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
            <span className="text-sm font-medium text-navy">Searching federal, foundation &amp; corporate grants...</span>
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
    return (
      <div className="max-w-3xl mx-auto">
        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-navy-light">
            Found <span className="font-semibold text-navy">{opportunities.length}</span> matching grants
          </p>
          <button
            onClick={() => { setPhase('form'); setOpportunities([]) }}
            className="text-sm font-medium text-brand-yellow hover:text-brand-gold transition-colors flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            New search
          </button>
        </div>

        {/* Opportunity cards */}
        <div className="space-y-4">
          {opportunities.map((opp, i) => (
            <div key={i} className="card p-6 transition-shadow hover:shadow-lg">
              {/* Ungated: always visible */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-semibold text-navy leading-snug">{opp.name}</h3>
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
              </div>

              {/* Gated: summary, eligibility, link */}
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
                  <div className="flex flex-wrap gap-3">
                    {opp.rfp_url && (
                      <a
                        href={opp.rfp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-yellow hover:text-brand-gold transition-colors"
                      >
                        View opportunity
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                      </a>
                    )}
                    {opp.slug && (
                      <a
                        href={`/grants/${opp.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-navy-light hover:text-navy transition-colors"
                      >
                        View full details
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="select-none blur-[6px] pointer-events-none" aria-hidden="true">
                    <p className="text-sm text-navy-light leading-relaxed mb-2">This grant supports organizations working in community development and environmental justice initiatives across the United States.</p>
                    <p className="text-xs text-navy-light/70">Eligible: 501(c)(3) nonprofits with annual budget under $5M</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-navy/5 text-navy-light border border-navy/10">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                      Enter email to unlock details
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Email gate (shown below results if not unlocked) */}
        {!unlocked && (
          <div className="card overflow-hidden mt-8">
            <div className="bg-navy p-8 text-center noise-overlay">
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  Unlock full grant details
                </h3>
                <p className="text-white/60 mt-2 text-sm max-w-md mx-auto">
                  Enter your email to see summaries, eligibility requirements, and direct links to all {opportunities.length} grants.
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
              onChange={e => setOrgType(e.target.value)}
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
              onChange={e => setState(e.target.value)}
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
        Free &middot; No account required &middot; Powered by AI
      </p>
    </div>
  )
}
