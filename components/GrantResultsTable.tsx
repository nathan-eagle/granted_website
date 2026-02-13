'use client'

import { trackEvent } from '@/lib/analytics'
import {
  type Opportunity,
  SOURCE_LABELS,
  OFFICIAL_SOURCES,
  relativeTime,
  buildApplyUrl,
  summarizeTerm,
  isPastDeadline,
  deadlineUrgency,
} from '@/hooks/useGrantSearch'

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
  if (!opp.created_at) return false
  const ms = Date.now() - Date.parse(opp.created_at)
  return ms < 14 * 24 * 60 * 60 * 1000
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
  enrichedNames?: Set<string>
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
  enrichedNames,
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

      {/* Results table */}
      <div className="space-y-2">
        {sorted.map((opp, i) => {
          const isEnriched = enrichedNames?.has(opp.name) ?? false
          return (
          <div
            key={i}
            className={`card p-4 md:p-5 transition-all hover:shadow-lg hover:border-brand-yellow/30 cursor-pointer group ${
              isEnriched ? 'border-l-[3px] border-l-brand-yellow ring-1 ring-brand-yellow/15' : ''
            }`}
            style={isEnriched ? { animation: 'enrichHighlight 3s ease-out', backgroundColor: 'rgb(245 207 73 / 0.04)' } : undefined}
            onClick={() => {
              trackEvent('grant_finder_result_click', {
                grant_name: opp.name.slice(0, 120),
                funder: (opp.funder || '').slice(0, 80),
                fit_score: opp.fit_score || 0,
                position: i + 1,
                focus_area: summarizeTerm(focusArea),
                org_type: orgType || 'any',
                state: state || 'any',
              })
              onRowClick(opp)
            }}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') onRowClick(opp) }}
          >
            {/* Desktop layout */}
            <div className="hidden md:flex items-start gap-4">
              {/* Grant info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-navy leading-snug truncate group-hover:text-brand-gold transition-colors">
                    {opp.name}
                  </h3>
                  {isNew(opp) && !isPastDeadline(opp.deadline) && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                      New
                    </span>
                  )}
                  {isEnriched && (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-yellow/15 text-amber-700 border border-brand-yellow/30">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7L2 9.4h7.6z"/></svg>
                      AI Found
                    </span>
                  )}
                </div>
                <p className="text-xs text-navy-light/60 mt-0.5 truncate">{opp.funder}</p>
                {/* Source + match reasons inline */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {opp.source_provider && OFFICIAL_SOURCES.has(opp.source_provider) && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: '#1e40af0d', color: '#1e40af' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      {SOURCE_LABELS[opp.source_provider] ?? opp.source_provider}
                    </span>
                  )}
                  {opp.match_reasons?.slice(0, 2).map((reason, ri) => (
                    <span key={ri} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-navy-light/60 bg-navy/[0.04]">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0 w-16 text-center">
                {opp.fit_score > 0 && (
                  <span
                    className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: opp.fit_score >= 70 ? '#22c55e18' : opp.fit_score >= 40 ? '#F5CF4918' : '#6b728018',
                      color: opp.fit_score >= 70 ? '#16a34a' : opp.fit_score >= 40 ? '#b8941c' : '#6b7280',
                    }}
                  >
                    {opp.fit_score}%
                  </span>
                )}
              </div>

              {/* Amount */}
              <div className="shrink-0 w-28 text-right">
                <span className="text-xs font-medium text-navy-light">{opp.amount || '—'}</span>
              </div>

              {/* Deadline */}
              <div className="shrink-0 w-28 text-right">
                {isPastDeadline(opp.deadline) ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                    Deadline Passed
                  </span>
                ) : (
                  <div>
                    <span className="text-xs text-navy-light/70">{opp.deadline || 'Rolling'}</span>
                    {deadlineUrgency(opp.deadline) && (
                      <span className="block mt-0.5 text-[10px] font-semibold text-amber-600">
                        {deadlineUrgency(opp.deadline)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                {isPastDeadline(opp.deadline) ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed">
                    Expired
                  </span>
                ) : (
                  <a
                    href={buildApplyUrl(opp)}
                    onClick={() => {
                      trackEvent('grant_finder_apply_click', {
                        grant_name: opp.name.slice(0, 120),
                        grant_slug: opp.slug || '',
                        source: 'result_table',
                        position: i + 1,
                        fit_score: opp.fit_score || 0,
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
                )}
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
                        position: i + 1,
                        source: 'result_table',
                      })
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-navy-light/60 hover:text-brand-gold transition-colors"
                    title="View original RFP"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                )}
              </div>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-navy leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors">
                      {opp.name}
                    </h3>
                    {isNew(opp) && !isPastDeadline(opp.deadline) && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                        New
                      </span>
                    )}
                    {isEnriched && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-yellow/15 text-amber-700 border border-brand-yellow/30">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7L2 9.4h7.6z"/></svg>
                        AI Found
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-navy-light/60 mt-0.5">{opp.funder}</p>
                </div>
                {opp.fit_score > 0 && (
                  <span
                    className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: opp.fit_score >= 70 ? '#22c55e18' : opp.fit_score >= 40 ? '#F5CF4918' : '#6b728018',
                      color: opp.fit_score >= 70 ? '#16a34a' : opp.fit_score >= 40 ? '#b8941c' : '#6b7280',
                    }}
                  >
                    {opp.fit_score}%
                  </span>
                )}
              </div>

              {/* Source badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {opp.source_provider && OFFICIAL_SOURCES.has(opp.source_provider) && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: '#1e40af0d', color: '#1e40af' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    {SOURCE_LABELS[opp.source_provider] ?? opp.source_provider}
                  </span>
                )}
                {opp.match_reasons?.slice(0, 2).map((reason, ri) => (
                  <span key={ri} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-navy-light/60 bg-navy/[0.04]">
                    {reason}
                  </span>
                ))}
              </div>

              {/* Amount + deadline */}
              <div className="flex flex-wrap gap-3 text-xs text-navy-light/70">
                {opp.amount && (
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                    {opp.amount}
                  </span>
                )}
                {opp.deadline && (
                  <span className={`inline-flex items-center gap-1 ${isPastDeadline(opp.deadline) ? 'text-red-500 font-medium' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    {isPastDeadline(opp.deadline) ? 'Deadline Passed' : opp.deadline}
                    {!isPastDeadline(opp.deadline) && deadlineUrgency(opp.deadline) && (
                      <span className="text-[10px] font-semibold text-amber-600 ml-1">{deadlineUrgency(opp.deadline)}</span>
                    )}
                  </span>
                )}
              </div>

              {/* Gated details */}
              {!unlocked && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onEmailGateClick() }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-navy-light/50 hover:text-brand-gold transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  Unlock details
                </button>
              )}

              {/* Action buttons */}
              <div className="mt-3 flex items-center gap-3" onClick={e => e.stopPropagation()}>
                {isPastDeadline(opp.deadline) ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed">
                    Expired
                  </span>
                ) : (
                  <a
                    href={buildApplyUrl(opp)}
                    onClick={() => {
                      trackEvent('grant_finder_apply_click', {
                        grant_name: opp.name.slice(0, 120),
                        grant_slug: opp.slug || '',
                        source: 'result_table_mobile',
                        position: i + 1,
                        fit_score: opp.fit_score || 0,
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
                )}
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
                        position: i + 1,
                        source: 'result_table_mobile',
                      })
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-navy-light/60 hover:text-brand-gold transition-colors"
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
