'use client'

import { useState, useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

interface Props {
  enriching: boolean
  resultCount: number
  focusArea: string
  orgType: string
  state: string
}

const NUDGE_DELAY_MS = 30_000

function buildSignupUrl(focusArea: string, orgType: string, state: string): string {
  const params = new URLSearchParams()
  if (focusArea) params.set('q', focusArea)
  if (orgType) params.set('org_type', orgType)
  if (state) params.set('state', state)
  params.set('ref', 'grant-finder')

  const callbackPath = `/opportunities?${params.toString()}`
  return `https://app.grantedai.com/api/auth/signin?callbackUrl=${encodeURIComponent(callbackPath)}`
}

export default function SignupNudgeBanner({
  enriching,
  resultCount,
  focusArea,
  orgType,
  state,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const enrichmentCompleted = useRef(false)

  // Track enrichment completion (enriching goes true → false)
  useEffect(() => {
    if (enriching) {
      enrichmentCompleted.current = false
    } else if (!enrichmentCompleted.current && resultCount > 0) {
      // Enrichment just finished (or results came from cache)
      enrichmentCompleted.current = true

      // Start 30s timer
      timerRef.current = setTimeout(() => {
        setVisible(true)
        trackEvent('grant_finder_nudge_shown', {
          result_count: String(resultCount),
          focus_area: focusArea,
        })
      }, NUDGE_DELAY_MS)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [enriching, resultCount, focusArea])

  // Reset on new search (resultCount drops to 0)
  useEffect(() => {
    if (resultCount === 0) {
      setVisible(false)
      setDismissed(false)
      enrichmentCompleted.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resultCount])

  if (!visible || dismissed || resultCount === 0) return null

  const signupUrl = buildSignupUrl(focusArea, orgType, state)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-navy border-t border-navy-light/10 shadow-lg"
      style={{ animation: 'nudgeSlideUp 0.3s ease-out' }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-white/80 flex-1">
          <span className="font-semibold text-white">{resultCount} grants</span> matched your search.
          Sign up with Google to start applying — takes 5 seconds.
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={signupUrl}
            onClick={() => {
              trackEvent('grant_finder_nudge_click', {
                result_count: String(resultCount),
                focus_area: focusArea,
              })
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-yellow px-5 py-2 text-sm font-semibold text-navy hover:bg-brand-gold transition-colors"
          >
            Sign Up Free
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>

          <button
            type="button"
            onClick={() => {
              setDismissed(true)
              trackEvent('grant_finder_nudge_dismiss', {
                result_count: String(resultCount),
              })
            }}
            className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes nudgeSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
