'use client'

import { useEffect, useMemo, useState } from 'react'
import FoundationCard from '@/components/FoundationCard'
import type { Foundation } from '@/lib/foundations'
import { trackEvent } from '@/lib/analytics'

type Props = {
  categoryLabel: string
  categorySlug: string
  foundations: Foundation[]
}

export default function CategoryFoundationList({ categoryLabel, categorySlug, foundations }: Props) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      trackEvent('foundation_category_filter_change', {
        category_slug: categorySlug,
        query: query.trim() || undefined,
      })
    }, 400)
    return () => window.clearTimeout(timeout)
  }, [categorySlug, query])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return foundations

    return foundations.filter((f) => {
      const haystack = [f.name, f.city ?? '', f.state ?? '']
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [foundations, query])

  return (
    <>
      <div className="card p-5 md:p-6 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${categoryLabel.toLowerCase()} foundations by name or city...`}
          className="w-full rounded-md border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-navy-light/40 outline-none focus:border-brand-yellow/60 transition"
        />
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-navy-light/50">
          {filtered.length.toLocaleString()} matching foundations
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <FoundationCard key={f.id} foundation={f} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card">
          <p className="heading-md text-navy/70">No foundations match this filter</p>
          <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
            Try a broader keyword or check your spelling.
          </p>
        </div>
      )}
    </>
  )
}
