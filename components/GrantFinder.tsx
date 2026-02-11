'use client'

import { trackEvent } from '@/lib/analytics'
import {
  type Phase,
  type Opportunity,
  ORG_TYPES,
  US_STATES,
  summarizeTerm,
} from '@/hooks/useGrantSearch'

export type { Phase, Opportunity }
export { ORG_TYPES, US_STATES }

interface GrantFinderProps {
  // Form state (controlled by parent via hook)
  orgType: string
  focusArea: string
  state: string
  error: string
  gateRequired: boolean
  unlocked: boolean
  email: string
  emailStatus: 'idle' | 'loading' | 'success' | 'error'
  // Setters
  setOrgType: (v: string) => void
  setFocusArea: (v: string) => void
  setState: (v: string) => void
  setEmail: (v: string) => void
  // Actions
  handleSearch: (e: React.FormEvent) => void
  handleEmailSubmit: (e: React.FormEvent) => void
  // Phase (for loading display)
  phase: Phase
}

export default function GrantFinder({
  orgType,
  focusArea,
  state,
  error,
  gateRequired,
  unlocked,
  email,
  emailStatus,
  setOrgType,
  setFocusArea,
  setState,
  setEmail,
  handleSearch,
  handleEmailSubmit,
  phase,
}: GrantFinderProps) {
  /* -- Loading -- */
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

  /* -- Form -- */
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
