'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { type Opportunity, isPastDeadline } from '@/hooks/useGrantSearch'

export type FundingType = 'Federal' | 'Foundation' | 'Corporate' | 'State'
export type AmountRange = 'any' | 'lt50k' | '50k-250k' | '250k-1m' | 'gt1m'
export type DeadlineRange = 'any' | '30days' | '90days' | '6months' | 'rolling'
export type StatusFilter = 'all' | 'active' | 'upcoming'

export interface FilterState {
  fundingTypes: FundingType[]
  amountRange: AmountRange
  deadlineRange: DeadlineRange
  orgType: string
  location: string
  status: StatusFilter
  searchWithin: string
  hideExpired: boolean
}

export const DEFAULT_FILTERS: FilterState = {
  fundingTypes: [],
  amountRange: 'any',
  deadlineRange: 'any',
  orgType: '',
  location: '',
  status: 'all',
  searchWithin: '',
  hideExpired: true,
}

const AMOUNT_LABELS: Record<AmountRange, string> = {
  any: 'Any Amount',
  lt50k: 'Under $50K',
  '50k-250k': '$50K–$250K',
  '250k-1m': '$250K–$1M',
  gt1m: 'Over $1M',
}

const DEADLINE_LABELS: Record<DeadlineRange, string> = {
  any: 'Any Deadline',
  '30days': 'Next 30 days',
  '90days': 'Next 90 days',
  '6months': 'Next 6 months',
  rolling: 'Rolling',
}

const FUNDING_TYPES: FundingType[] = ['Federal', 'Foundation', 'Corporate', 'State']

function parseAmountNumber(amount: string): number {
  if (!amount) return 0
  const raw = amount.replace(/[^0-9.kmb]/gi, '').toLowerCase()
  const num = parseFloat(raw)
  if (isNaN(num)) return 0
  if (raw.includes('b')) return num * 1_000_000_000
  if (raw.includes('m')) return num * 1_000_000
  if (raw.includes('k')) return num * 1_000
  const cleanNum = amount.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleanNum)
  return isNaN(parsed) ? 0 : parsed
}

function inferFundingType(opp: Opportunity): FundingType | null {
  const funder = (opp.funder || '').toLowerCase()
  const source = opp.source_provider || ''

  // Federal agencies
  const federalSources = ['grants_gov', 'sam_assistance', 'nih_guide', 'nsf_funding', 'nih_weekly_index', 'nsf_upcoming']
  if (federalSources.includes(source)) return 'Federal'
  const federalKeywords = ['nih', 'nsf', 'epa', 'usda', 'doe', 'darpa', 'noaa', 'hud', 'dol', 'dod', 'nasa', 'fema', 'cdc', 'nea', 'neh', 'department of', 'u.s.', 'federal', 'national institutes', 'national science', 'national endowment']
  if (federalKeywords.some(k => funder.includes(k))) return 'Federal'

  // State
  if (source === 'ca_grants_portal') return 'State'
  const stateKeywords = ['state of', 'state government', 'governor']
  if (stateKeywords.some(k => funder.includes(k))) return 'State'

  // Foundation
  if (source === 'pnd_rfps') return 'Foundation'
  const foundationKeywords = ['foundation', 'fund', 'trust', 'endowment', 'philanthrop']
  if (foundationKeywords.some(k => funder.includes(k))) return 'Foundation'

  // Corporate
  const corpKeywords = ['inc', 'corp', 'llc', 'company', 'enterprises']
  if (corpKeywords.some(k => funder.includes(k))) return 'Corporate'

  return null
}

export function applyFilters(opportunities: Opportunity[], filters: FilterState): Opportunity[] {
  let results = opportunities

  // Hide expired filter
  if (filters.hideExpired) {
    results = results.filter(opp => !isPastDeadline(opp.deadline))
  }

  // Funding type filter
  if (filters.fundingTypes.length > 0) {
    results = results.filter(opp => {
      const type = inferFundingType(opp)
      return type && filters.fundingTypes.includes(type)
    })
  }

  // Amount range filter
  if (filters.amountRange !== 'any') {
    results = results.filter(opp => {
      const amount = parseAmountNumber(opp.amount)
      if (amount === 0) return false
      switch (filters.amountRange) {
        case 'lt50k': return amount < 50_000
        case '50k-250k': return amount >= 50_000 && amount <= 250_000
        case '250k-1m': return amount >= 250_000 && amount <= 1_000_000
        case 'gt1m': return amount > 1_000_000
        default: return true
      }
    })
  }

  // Deadline range filter
  if (filters.deadlineRange !== 'any') {
    const now = Date.now()
    results = results.filter(opp => {
      if (!opp.deadline) return filters.deadlineRange === 'rolling'
      const deadlineMs = Date.parse(opp.deadline)
      if (isNaN(deadlineMs)) return filters.deadlineRange === 'rolling'
      const daysUntil = (deadlineMs - now) / (1000 * 60 * 60 * 24)
      if (daysUntil < 0) return false
      switch (filters.deadlineRange) {
        case '30days': return daysUntil <= 30
        case '90days': return daysUntil <= 90
        case '6months': return daysUntil <= 180
        case 'rolling': return false
        default: return true
      }
    })
  }

  // Search within results
  if (filters.searchWithin.trim()) {
    const term = filters.searchWithin.trim().toLowerCase()
    results = results.filter(opp => {
      const haystack = [opp.name, opp.funder, opp.summary, opp.eligibility]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }

  return results
}

export function activeFilterCount(filters: FilterState): number {
  let count = 0
  if (filters.fundingTypes.length > 0) count++
  if (filters.amountRange !== 'any') count++
  if (filters.deadlineRange !== 'any') count++
  if (filters.searchWithin.trim()) count++
  if (!filters.hideExpired) count++ // default is ON, so OFF is an active filter
  return count
}

interface Props {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

export default function DiscoveryFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const filterCount = activeFilterCount(filters)
  const hasFilters = filterCount > 0

  const update = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial }
    onFiltersChange(next)
  }

  const clearAll = () => {
    onFiltersChange(DEFAULT_FILTERS)
    trackEvent('grant_discovery_filter', { action: 'clear_all' })
  }

  const toggleFundingType = (type: FundingType) => {
    const next = filters.fundingTypes.includes(type)
      ? filters.fundingTypes.filter(t => t !== type)
      : [...filters.fundingTypes, type]
    update({ fundingTypes: next })
    trackEvent('grant_discovery_filter', { filter: 'funding_type', value: next.join(',') || 'any' })
  }

  return (
    <div className="mb-4">
      {/* Result count + filter toggle */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-navy-light">
          Showing <span className="font-semibold text-navy">{filteredCount}</span>
          {filteredCount !== totalCount && (
            <span className="text-navy-light/60"> of {totalCount}</span>
          )}{' '}
          grants
        </p>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-navy-light/50 hover:text-navy transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              expanded
                ? 'bg-navy text-white'
                : 'bg-navy/5 text-navy-light hover:bg-navy/10'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {filterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-yellow text-navy text-[10px] font-bold">
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {filters.fundingTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => toggleFundingType(type)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-brand-yellow/10 text-navy border border-brand-yellow/20 hover:bg-brand-yellow/20 transition-colors"
            >
              {type}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          ))}
          {filters.amountRange !== 'any' && (
            <button
              type="button"
              onClick={() => update({ amountRange: 'any' })}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-brand-yellow/10 text-navy border border-brand-yellow/20 hover:bg-brand-yellow/20 transition-colors"
            >
              {AMOUNT_LABELS[filters.amountRange]}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
          {filters.deadlineRange !== 'any' && (
            <button
              type="button"
              onClick={() => update({ deadlineRange: 'any' })}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-brand-yellow/10 text-navy border border-brand-yellow/20 hover:bg-brand-yellow/20 transition-colors"
            >
              {DEADLINE_LABELS[filters.deadlineRange]}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
          {filters.searchWithin.trim() && (
            <button
              type="button"
              onClick={() => update({ searchWithin: '' })}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-brand-yellow/10 text-navy border border-brand-yellow/20 hover:bg-brand-yellow/20 transition-colors"
            >
              &ldquo;{filters.searchWithin.slice(0, 20)}&rdquo;
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
          {!filters.hideExpired && (
            <button
              type="button"
              onClick={() => update({ hideExpired: true })}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
            >
              Showing expired
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
      )}

      {/* Expanded filter bar */}
      {expanded && (
        <div className="card p-4 space-y-4">
          {/* Hide expired toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-navy-light/50">Hide expired grants</label>
            <button
              type="button"
              role="switch"
              aria-checked={filters.hideExpired}
              onClick={() => {
                update({ hideExpired: !filters.hideExpired })
                trackEvent('grant_discovery_filter', { filter: 'hide_expired', value: String(!filters.hideExpired) })
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                filters.hideExpired ? 'bg-green-500' : 'bg-navy/20'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  filters.hideExpired ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Search within results */}
          <div>
            <label className="block text-xs font-medium text-navy-light/50 mb-1.5">Search within results</label>
            <input
              type="text"
              value={filters.searchWithin}
              onChange={e => update({ searchWithin: e.target.value })}
              placeholder="Filter by keyword..."
              className="w-full rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy-light/30 outline-none focus:border-brand-yellow/60 transition"
            />
          </div>

          {/* Funding type pills */}
          <div>
            <label className="block text-xs font-medium text-navy-light/50 mb-1.5">Funding Type</label>
            <div className="flex flex-wrap gap-1.5">
              {FUNDING_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleFundingType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.fundingTypes.includes(type)
                      ? 'bg-navy text-white'
                      : 'bg-navy/5 text-navy-light hover:bg-navy/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Amount range */}
            <div>
              <label className="block text-xs font-medium text-navy-light/50 mb-1.5">Amount</label>
              <select
                value={filters.amountRange}
                onChange={e => {
                  const val = e.target.value as AmountRange
                  update({ amountRange: val })
                  trackEvent('grant_discovery_filter', { filter: 'amount_range', value: val })
                }}
                className="w-full rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
              >
                {Object.entries(AMOUNT_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            {/* Deadline range */}
            <div>
              <label className="block text-xs font-medium text-navy-light/50 mb-1.5">Deadline</label>
              <select
                value={filters.deadlineRange}
                onChange={e => {
                  const val = e.target.value as DeadlineRange
                  update({ deadlineRange: val })
                  trackEvent('grant_discovery_filter', { filter: 'deadline_range', value: val })
                }}
                className="w-full rounded-md border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
              >
                {Object.entries(DEADLINE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
