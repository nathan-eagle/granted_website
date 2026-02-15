'use client'

import { useEffect, useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'
import type { Opportunity } from '@/hooks/useGrantSearch'

interface Props {
  opportunity: Opportunity
  onClose: () => void
  focusArea: string
  orgType: string
  state: string
}

function buildSignupUrl(focusArea: string, orgType: string, state: string): string {
  const params = new URLSearchParams()
  if (focusArea) params.set('q', focusArea)
  if (orgType) params.set('org_type', orgType)
  if (state) params.set('state', state)
  params.set('ref', 'grant-finder')

  const callbackPath = `/opportunities?${params.toString()}`
  return `https://app.grantedai.com/api/auth/signin?callbackUrl=${encodeURIComponent(callbackPath)}`
}

export default function SignupGateModal({
  opportunity,
  onClose,
  focusArea,
  orgType,
  state,
}: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const signupUrl = buildSignupUrl(focusArea, orgType, state)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto"
          role="dialog"
          aria-label="Sign up to apply"
          style={{ animation: 'gateModalIn 0.2s ease-out' }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md text-navy-light/40 hover:text-navy hover:bg-navy/5 transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="p-8 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-yellow/15 mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            {/* Grant name */}
            <h3
              className="text-xl font-semibold text-navy mb-2 leading-snug"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Sign up to apply
            </h3>

            <p className="text-sm text-navy-light/70 mb-1 leading-relaxed line-clamp-2">
              {opportunity.name}
            </p>

            <p className="text-sm text-navy-light/50 mb-8">
              Your search results will be waiting for you.
            </p>

            {/* Google sign-up CTA */}
            <a
              href={signupUrl}
              onClick={() => {
                trackEvent('grant_finder_signup_gate_click', {
                  grant_name: opportunity.name.slice(0, 120),
                  grant_slug: opportunity.slug || '',
                  focus_area: focusArea,
                  org_type: orgType || 'any',
                  state: state || 'any',
                })
              }}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </a>

            <p className="mt-4 text-xs text-navy-light/30">
              Free account. No credit card required.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gateModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  )
}
