'use client'

import { useEffect, useMemo, useState } from 'react'
import GrantCard from '@/components/GrantCard'
import type { GrantCategory, PublicGrant } from '@/lib/grants'
import { trackEvent } from '@/lib/analytics'

type Props = {
  category: GrantCategory
  grants: PublicGrant[]
}

type StatusFilter = 'all' | 'active' | 'upcoming' | 'closed'

export default function CategoryGrantList({ category, grants }: Props) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      trackEvent('grant_category_filter_change', {
        category_slug: category.slug,
        query: query.trim() || undefined,
        status_filter: statusFilter,
      })
    }, 400)
    return () => window.clearTimeout(timeout)
  }, [category.slug, query, statusFilter])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return grants.filter((grant) => {
      const matchesStatus =
        statusFilter === 'all' ? true : grant.status === statusFilter

      if (!matchesStatus) return false
      if (!normalizedQuery) return true

      const haystack = [
        grant.name,
        grant.funder,
        grant.summary ?? '',
        grant.eligibility ?? '',
        grant.amount ?? '',
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [grants, query, statusFilter])

  return (
    <>
      <div className="card p-5 md:p-6 mb-8">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${category.name.toLowerCase()} by keyword...`}
            className="rounded-md border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 transition"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brand-yellow/60 transition appearance-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-navy-light/50">
          {filtered.length} matching grants
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card">
          <p className="heading-md text-navy/70">No grants match this filter</p>
          <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
            Try a broader keyword or switch to a different status.
          </p>
        </div>
      )}
    </>
  )
}
