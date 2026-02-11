'use client'

import { trackEvent } from '@/lib/analytics'
import {
  type Opportunity,
  SOURCE_LABELS,
  OFFICIAL_SOURCES,
  relativeTime,
  buildApplyUrl,
  summarizeTerm,
} from '@/hooks/useGrantSearch'
import { inferGrantHeaderClass } from '@/lib/card-theme'

export type SortOption = 'best_match' | 'deadline' | 'amount' | 'newest'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'best_match', label: 'Best Match' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'amount', label: 'Amount' },
  { value: 'newest', label: 'Newest' },
]

function parseAmount(amount: string): number {
  if (!amount) return 0
  const cleaned = amount.replace(/[^0-9.kmb]/gi, '').toLowerCase()
  const num = parseFloat(cleaned)
  if (isNaN(num)) return 0
  if (cleaned.includes('b')) return num * 1_000_000_000
  if (cleaned.includes('m')) return num * 1_000_000
  if (cleaned.includes('k')) return num * 1_000
  // Handle raw numbers with commas removed
  const raw = amount.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(raw)
  return isNaN(parsed) ? 0 : parsed
}

function parseDeadline(deadline: string): number {
  if (!deadline) return Infinity
  const d = Date.parse(deadline)
  return isNaN(d) ? Infinity : d
}

function isNew(opp: Opportunity): boolean {
  if (!opp.created_at && !opp.last_verified_at) return false
  const dateStr = opp.created_at || opp.last_verified_at!
  const ms = Date.now() - Date.parse(dateStr)
  return ms < 14 * 24 * 60 * 60 * 1000
}

function scoreColors(score: number): { bg: string; text: string } {
  if (score >= 70) return { bg: '#22c55e18', text: '#16a34a' }
  if (score >= 40) return { bg: '#F5CF4918', text: '#b8941c' }
  return { bg: '#6b728018', text: '#6b7280' }
}

export function sortOpportunities(opps: Opportunity[], sort: SortOption): Opportunity[] {
  const sorted = [...opps]
  switch (sort) {
    case 'best_match':
      sorted.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0))
      break
    case 'deadline':
      sorted.sort((a, b) => parseDeadline(a.deadline) - parseDeadline(b.deadline))
      break
    case 'amount':
      sorted.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount))
      break
    case 'newest':
      sorted.sort((a, b) => {
        const aDate = a.last_verified_at ? Date.parse(a.last_verified_at) : 0
        const bDate = b.last_verified_at ? Date.parse(b.last_verified_at) : 0
        return bDate - aDate
      })
      break
  }
  return sorted
}

interface Props {
  opportunities: Opportunity[]
  unlocked: boolean
  onRowClick: (opp: Opportunity) => void
  onEmailGateClick: () => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  focusArea: string
  orgType: string
  state: string
}

export default function GrantResultsTable({
  opportunities,
  unlocked,
  onRowClick,
  onEmailGateClick,
  sort,
  onSortChange,
  focusArea,
  orgType,
  state,
}: Props) {
  const sorted = sortOpportunities(opportunities, sort)

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium text-navy-light/50 uppercase tracking-wider">Sort:</span>
        <div className="flex gap-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSortChange(opt.value)
                trackEvent('grant_discovery_sort', { sort: opt.value })
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                sort === opt.value
                  ? 'bg-navy text-white'
                  : 'bg-navy/5 text-navy-light hover:bg-navy/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results cards */}
      <div className="space-y-3">
        {sorted.map((opp, i) => {
          const fitColors = opp.fit_score > 0 ? scoreColors(opp.fit_score) : null

          return (
            <div
              key={i}
              className="card card-hover overflow-hidden transition-all hover:border-brand-yellow/30 cursor-pointer group"
              onClick={() => onRowClick(opp)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onRowClick(opp) }}
            >
              <div className={`${inferGrantHeaderClass(opp)} px-4 md:px-5 py-3 flex items-center justify-between gap-3`}>
                <div className="min-w-0 flex items-center gap-2">
                  <span className="inline-flex max-w-[11rem] truncate rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white/90">
                    {opp.funder}
                  </span>
                  {isNew(opp) && (
                    <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      New
                    </span>
                  )}
                </div>
                {fitColors && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: fitColors.bg, color: fitColors.text }}
                  >
                    {opp.fit_score}% match
                  </span>
                )}
              </div>

              <div className="p-4 md:p-5">
                <h3 className="text-sm font-semibold text-navy leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors">
                  {opp.name}
                </h3>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {opp.source_provider && OFFICIAL_SOURCES.has(opp.source_provider) && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: '#1e40af0d', color: '#1e40af' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      {SOURCE_LABELS[opp.source_provider] ?? opp.source_provider}
                    </span>
                  )}
                  {opp.match_reasons?.slice(0, 3).map((reason, ri) => (
                    <span key={ri} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-navy-light/60 bg-navy/[0.04]">
                      {reason}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-navy/5 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-light/45">Amount</p>
                    <p className="text-xs text-navy-light mt-1 line-clamp-1">{opp.amount || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-light/45">Deadline</p>
                    <p className="text-xs text-navy-light mt-1 line-clamp-1">{opp.deadline || 'Rolling'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-light/45">Last Checked</p>
                    <p className="text-xs text-navy-light mt-1 line-clamp-1">
                      {opp.last_verified_at ? relativeTime(opp.last_verified_at) : 'Unknown'}
                    </p>
                  </div>
                </div>

                {!unlocked && (
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onEmailGateClick() }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-navy-light/55 hover:text-brand-gold transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    Unlock details
                  </button>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2" onClick={e => e.stopPropagation()}>
                  <a
                    href={buildApplyUrl(opp)}
                    onClick={() => {
                      trackEvent('grant_finder_apply_click', {
                        grant_name: opp.name.slice(0, 120),
                        grant_slug: opp.slug || '',
                        source: 'result_table',
                        focus_area: summarizeTerm(focusArea),
                        org_type: orgType || 'any',
                        state: state || 'any',
                      })
                    }}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-yellow px-3 py-1.5 text-xs font-semibold text-navy hover:bg-brand-gold transition-colors"
                  >
                    Apply
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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
                          source: 'result_table',
                        })
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-navy-light/60 hover:text-brand-gold transition-colors"
                      title="View original RFP"
                    >
                      View RFP
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
