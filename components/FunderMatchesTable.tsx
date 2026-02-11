'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { formatAssets } from '@/lib/foundations'

export type FunderMatch = {
  id: string
  slug: string
  name: string
  city: string | null
  state: string | null
  ntee_category: string | null
  asset_amount: number | null
  total_giving: number | null
  grantee_count: number | null
  website: string | null
}

type FunderSortOption = 'assets' | 'giving' | 'grantees'

const SORT_OPTIONS: { value: FunderSortOption; label: string }[] = [
  { value: 'assets', label: 'Total Assets' },
  { value: 'giving', label: 'Annual Giving' },
  { value: 'grantees', label: 'Grantees' },
]

function sortFunders(funders: FunderMatch[], sort: FunderSortOption): FunderMatch[] {
  const sorted = [...funders]
  switch (sort) {
    case 'assets':
      sorted.sort((a, b) => (b.asset_amount ?? 0) - (a.asset_amount ?? 0))
      break
    case 'giving':
      sorted.sort((a, b) => (b.total_giving ?? 0) - (a.total_giving ?? 0))
      break
    case 'grantees':
      sorted.sort((a, b) => (b.grantee_count ?? 0) - (a.grantee_count ?? 0))
      break
  }
  return sorted
}

function getLocation(city: string | null, state: string | null): string {
  const parts = [city, state].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : '—'
}

interface Props {
  funders: FunderMatch[]
  loading?: boolean
}

export default function FunderMatchesTable({ funders, loading }: Props) {
  const [sort, setSort] = useState<FunderSortOption>('assets')

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-5 bg-navy/8 rounded w-2/3 mb-2" />
            <div className="flex gap-4">
              <div className="h-4 bg-navy/5 rounded w-24" />
              <div className="h-4 bg-navy/5 rounded w-20" />
              <div className="h-4 bg-navy/5 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (funders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto mb-3 text-navy-light/20" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
        </svg>
        <p className="text-sm font-medium text-navy-light/50">No matching foundations found</p>
        <p className="text-xs text-navy-light/30 mt-1">Try broadening your search terms</p>
      </div>
    )
  }

  const sorted = sortFunders(funders, sort)

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
              onClick={() => setSort(opt.value)}
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

      {/* Table */}
      <div className="space-y-2">
        {sorted.map(funder => (
          <a
            key={funder.id}
            href={`/foundations/${funder.slug}`}
            onClick={() => {
              trackEvent('grant_discovery_funder_click', {
                funder_name: funder.name.slice(0, 120),
                funder_slug: funder.slug,
              })
            }}
            className="card p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 hover:shadow-lg hover:border-brand-yellow/30 transition-all group"
          >
            {/* Name + location */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-navy truncate group-hover:text-brand-gold transition-colors">
                {funder.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-navy-light/50">{getLocation(funder.city, funder.state)}</span>
                {funder.ntee_category && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-navy-light/50 bg-navy/[0.04]">
                    {funder.ntee_category}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-6 shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-medium text-navy-light/40 uppercase tracking-wider">Assets</p>
                <p className="text-sm font-semibold text-navy">{formatAssets(funder.asset_amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium text-navy-light/40 uppercase tracking-wider">Giving</p>
                <p className="text-sm font-semibold text-navy">{funder.total_giving ? formatAssets(funder.total_giving) : '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium text-navy-light/40 uppercase tracking-wider">Grantees</p>
                <p className="text-sm font-semibold text-navy">{funder.grantee_count ?? '—'}</p>
              </div>

              {/* Arrow */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy-light/20 group-hover:text-brand-gold transition-colors hidden md:block">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
