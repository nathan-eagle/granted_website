'use client'

import { useEffect, useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'
import {
  type Opportunity,
  SOURCE_LABELS,
  OFFICIAL_SOURCES,
  relativeTime,
  summarizeTerm,
  isPastDeadline,
  deadlineUrgency,
} from '@/hooks/useGrantSearch'
import BookmarkButton from './BookmarkButton'

interface Props {
  opportunity: Opportunity | null
  onClose: () => void
  onApplyClick?: (opp: Opportunity) => void
  focusArea: string
  orgType: string
  state: string
  side?: 'left' | 'right'
}

export default function GrantDetailPanel({
  opportunity,
  onClose,
  onApplyClick,
  focusArea,
  orgType,
  state,
  side = 'right',
}: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!opportunity) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [opportunity, handleKeyDown])

  useEffect(() => {
    if (opportunity) {
      trackEvent('grant_discovery_detail_open', {
        grant_name: opportunity.name.slice(0, 120),
        grant_slug: opportunity.slug || '',
      })
    }
  }, [opportunity])

  if (!opportunity) return null

  const opp = opportunity

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 md:backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={`fixed inset-0 md:inset-y-0 md:w-[480px] z-50 bg-white shadow-2xl flex flex-col ${
          side === 'left'
            ? 'md:right-auto md:left-0 animate-slide-in-left'
            : 'md:left-auto md:right-0 animate-slide-in-right'
        }`}
        role="dialog"
        aria-label="Grant details"
      >
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between gap-4 p-6 border-b border-navy/8">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-navy leading-snug" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              {opp.name}
            </h2>
            <p className="text-sm text-navy-light/60 mt-1">{opp.funder}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {opp.slug && <BookmarkButton slug={opp.slug} size="sm" />}
            <button
              type="button"
              onClick={() => {
                trackEvent('grant_discovery_detail_close', {
                  grant_name: opp.name.slice(0, 120),
                  method: 'button',
                })
                onClose()
              }}
              className="p-2 -m-2 rounded-md text-navy-light/40 hover:text-navy hover:bg-navy/5 transition-colors"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key facts bar */}
          <div className="flex flex-wrap gap-3">
            {opp.amount && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy/[0.03] border border-navy/8">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy-light/50">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                <span className="text-sm font-semibold text-navy">{opp.amount}</span>
              </div>
            )}
            {opp.deadline && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isPastDeadline(opp.deadline) ? 'bg-red-50 border-red-200' : 'bg-navy/[0.03] border-navy/8'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isPastDeadline(opp.deadline) ? 'text-red-400' : 'text-navy-light/50'}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className={`text-sm font-medium ${isPastDeadline(opp.deadline) ? 'text-red-600' : 'text-navy'}`}>
                  {isPastDeadline(opp.deadline) ? `${opp.deadline} — Expired` : opp.deadline}
                </span>
                {!isPastDeadline(opp.deadline) && deadlineUrgency(opp.deadline) && (
                  <span className="ml-2 text-xs font-semibold text-amber-600 animate-pulse">
                    {deadlineUrgency(opp.deadline)}
                  </span>
                )}
              </div>
            )}
            {opp.source_provider && OFFICIAL_SOURCES.has(opp.source_provider) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#1e40af0d', color: '#1e40af' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                {SOURCE_LABELS[opp.source_provider] ?? opp.source_provider}
              </span>
            )}
            {/* Score badge removed — rank order is the signal */}
          </div>

          {isPastDeadline(opp.deadline) && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-500">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-red-700 leading-snug">
                This grant&apos;s deadline has passed. It may reopen in a future cycle — check the original source for updates.
              </p>
            </div>
          )}

          {/* Match reasons */}
          {opp.match_reasons && opp.match_reasons.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-light/40 mb-2">Match Reasons</h4>
              <div className="flex flex-wrap gap-1.5">
                {opp.match_reasons.map((reason, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium text-navy bg-brand-yellow/10 border border-brand-yellow/15">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verified info */}
          {opp.last_verified_at && (
            <div className="flex items-center gap-2 text-xs text-navy-light/50">
              {opp.verified && opp.rfp_url && (
                <span className="inline-flex items-center gap-1 text-green-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  Verified
                </span>
              )}
              <span>Last checked {relativeTime(opp.last_verified_at)}</span>
              {opp.staleness_bucket === 'aging' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: '#f59e0b12', color: '#b45309' }}>
                  Verify at source
                </span>
              )}
            </div>
          )}

          {/* Summary */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-light/40 mb-2">Summary</h4>
            <p className="text-sm text-navy-light leading-relaxed">
              {opp.summary || 'No summary available.'}
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-light/40 mb-2">Eligibility</h4>
            <p className="text-sm text-navy-light leading-relaxed">
              {opp.eligibility || 'No eligibility information available.'}
            </p>
          </div>

          {/* Link to SEO page — gated for anon users */}
          {opp.slug && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold hover:underline underline-offset-2"
              onClick={() => {
                trackEvent('grant_finder_result_grant_click', {
                  grant_name: opp.name.slice(0, 120),
                  grant_slug: opp.slug,
                  source: 'detail_panel',
                })
                onApplyClick?.(opp)
              }}
            >
              View full grant page
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {/* Footer actions */}
        <div className="shrink-0 p-6 border-t border-navy/8 bg-navy/[0.02] space-y-3">
          {isPastDeadline(opp.deadline) ? (
            <div className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 px-5 py-3 text-sm font-medium text-gray-400 cursor-not-allowed">
              Deadline Passed
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                trackEvent('grant_finder_apply_click', {
                  grant_name: opp.name.slice(0, 120),
                  grant_slug: opp.slug || '',
                  source: 'detail_panel',
                  focus_area: summarizeTerm(focusArea),
                  org_type: orgType || 'any',
                  state: state || 'any',
                })
                onApplyClick?.(opp)
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-yellow px-5 py-3 text-sm font-semibold text-navy hover:bg-brand-gold transition-colors"
            >
              Apply with Granted
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          )}

          {opp.rfp_url && (
            <a
              href={opp.rfp_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('grant_finder_view_opportunity_click', {
                  grant_name: opp.name.slice(0, 120),
                  grant_slug: opp.slug || '',
                  funder: opp.funder,
                  source: 'detail_panel',
                })
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-navy/15 bg-white px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy/5 transition-colors"
            >
              View Original RFP
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out;
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.25s ease-out;
        }
      `}</style>
    </>
  )
}
