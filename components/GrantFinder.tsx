'use client'

import { useEffect, useMemo, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import {
  type Phase,
  type Opportunity,
  type AmountRangeKey,
  ORG_TYPES,
  US_STATES,
  AMOUNT_RANGES,
  summarizeTerm,
} from '@/hooks/useGrantSearch'
import DeepResearchToggle from '@/components/DeepResearchToggle'

export type { Phase, Opportunity }
export { ORG_TYPES, US_STATES }

function createShuffledIndices(count: number): number[] {
  const indices = Array.from({ length: count }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = indices[i]
    indices[i] = indices[j]
    indices[j] = temp
  }
  return indices
}

interface GrantFinderProps {
  // Form state (controlled by parent via hook)
  orgType: string
  focusArea: string
  state: string
  amountRange: AmountRangeKey
  error: string
  deepResearch?: boolean
  // Setters
  setOrgType: (v: string) => void
  setFocusArea: (v: string) => void
  setState: (v: string) => void
  setAmountRange: (v: AmountRangeKey) => void
  setDeepResearch?: (v: boolean) => void
  // Actions
  handleSearch: (e: React.FormEvent) => void
  // Phase (for loading display)
  phase: Phase
  // Search limit
  searchesRemaining?: number
}

export default function GrantFinder({
  orgType,
  focusArea,
  state,
  amountRange,
  error,
  deepResearch,
  setOrgType,
  setFocusArea,
  setState,
  setAmountRange,
  setDeepResearch,
  handleSearch,
  phase,
  searchesRemaining,
}: GrantFinderProps) {
  const [loadingRotation, setLoadingRotation] = useState<{ order: number[]; index: number }>({
    order: [],
    index: 0,
  })

  const focusQuery = useMemo(() => summarizeTerm(focusArea).trim(), [focusArea])
  const audienceContext = useMemo(() => [orgType, state].filter(Boolean).join(', '), [orgType, state])
  const personalizedQuery = useMemo(() => {
    if (!focusQuery) return 'your search'
    return audienceContext ? `"${focusQuery}" (${audienceContext})` : `"${focusQuery}"`
  }, [focusQuery, audienceContext])

  const rotatingLoadingMessages = useMemo(
    () => [
      `Exploring the world's largest private foundation database for ${personalizedQuery}...`,
      `Combing through our database of millions of grants to find best-fit matches for ${personalizedQuery}...`,
      `AI agents are evaluating hundreds of thousands of funders daily for opportunities tied to ${personalizedQuery}...`,
      `Cross-checking newly posted and recently updated opportunities from official feeds and the open web for ${personalizedQuery}...`,
      `Ranking top opportunities for ${personalizedQuery} by fit, eligibility, deadline, and funding size...`,
      `Matching ${personalizedQuery} against active grants plus historical award patterns to surface repeat funders...`,
      `Scanning private, corporate, and public funding channels for programs aligned with ${personalizedQuery}...`,
      `Prioritizing funders most likely to back ${personalizedQuery} based on mission overlap and award behavior...`,
      `Verifying eligibility constraints for ${personalizedQuery} across geography, org type, and funding rules...`,
      `Building a shortlist for ${personalizedQuery} from high-volume feeds and our continuously refreshed grants index...`,
    ],
    [personalizedQuery],
  )

  useEffect(() => {
    if (phase !== 'loading') {
      setLoadingRotation({ order: [], index: 0 })
      return
    }

    setLoadingRotation({
      order: createShuffledIndices(rotatingLoadingMessages.length),
      index: 0,
    })

    const interval = window.setInterval(() => {
      setLoadingRotation(current => {
        if (current.order.length === 0) return current
        const nextIndex = current.index + 1
        if (nextIndex < current.order.length) {
          return { ...current, index: nextIndex }
        }
        return {
          order: createShuffledIndices(current.order.length),
          index: 0,
        }
      })
    }, 3000)

    return () => window.clearInterval(interval)
  }, [phase, rotatingLoadingMessages.length])

  const activeLoadingMessage = useMemo(() => {
    if (loadingRotation.order.length === 0) return rotatingLoadingMessages[0]
    const activeIndex = loadingRotation.order[loadingRotation.index] ?? 0
    return rotatingLoadingMessages[activeIndex]
  }, [loadingRotation, rotatingLoadingMessages])

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
            <span className="text-sm font-medium text-navy">
              {activeLoadingMessage}
            </span>
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

          {/* State + Amount row */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label htmlFor="gf-amount" className="block text-sm font-semibold text-navy mb-2">
                Funding Amount
              </label>
              <select
                id="gf-amount"
                value={amountRange}
                onChange={e => {
                  const value = e.target.value as AmountRangeKey
                  setAmountRange(value)
                  trackEvent('grant_finder_filter_change', {
                    filter: 'amount_range',
                    value: value || 'any',
                    surface: 'form',
                  })
                }}
                className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none focus:border-brand-yellow/60 focus:ring-2 focus:ring-brand-yellow/20 transition appearance-none"
              >
                {AMOUNT_RANGES.map(r => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Deep Research toggle */}
        {setDeepResearch && (
          <div className="pt-1">
            <DeepResearchToggle
              enabled={deepResearch ?? false}
              onChange={setDeepResearch}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-pill min-h-[3.25rem] text-base font-semibold bg-brand-yellow text-navy hover:bg-brand-gold transition-colors duration-150"
        >
          Find Matching Grants
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {searchesRemaining !== undefined && searchesRemaining < 3 && searchesRemaining > 0 && (
          <p className="mt-3 text-xs text-navy-light/50 text-center">
            {searchesRemaining} free {searchesRemaining === 1 ? 'search' : 'searches'} remaining
          </p>
        )}
      </form>

      <p className="mt-4 text-sm text-navy-light/60 text-center">
        Free &middot; No account required &middot; Powered by AI across the world&apos;s largest grants + funders database
      </p>
      <p className="mt-1.5 text-xs text-navy-light/40 text-center">
        Currently focused on US federal, state, and foundation grants.
      </p>
    </div>
  )
}
