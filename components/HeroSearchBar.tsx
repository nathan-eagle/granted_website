'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

const AGENCY_CHIPS = [
  { label: 'NIH', href: '/grants/nih' },
  { label: 'NSF', href: '/grants/nsf' },
  { label: 'EPA', href: '/grants/epa' },
  { label: 'USDA', href: '/grants/usda' },
  { label: 'DARPA', href: '/grants/darpa' },
  { label: 'NOAA', href: '/grants/noaa' },
]

export default function HeroSearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return

    trackEvent('hero_search_submit', {
      query: normalizedQuery,
      query_length: normalizedQuery.length,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
    })

    router.push(`/grants?q=${encodeURIComponent(normalizedQuery)}`)
  }

  return (
    <div className={className ?? "mt-10 max-w-2xl"}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search grants by topic, agency, or keyword..."
          className="hero-search-input flex-1 rounded-pill px-5 py-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-all"
        />
        <button
          type="submit"
          className="shrink-0 rounded-pill bg-brand-yellow px-6 py-3.5 text-sm font-semibold text-navy hover:bg-brand-gold transition-colors"
        >
          Search Grants
        </button>
      </form>

      {/* Agency quick-link chips */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <span className="text-xs text-white/40 mr-1">Popular:</span>
        {AGENCY_CHIPS.map(chip => (
          <Link
            key={chip.label}
            href={chip.href}
            onClick={() =>
              trackEvent('hero_search_chip_click', {
                chip_label: chip.label,
                chip_href: chip.href,
              })
            }
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/8 text-white/70 border border-white/10 hover:bg-white/15 hover:text-white hover:border-white/20 transition-all"
          >
            {chip.label}
          </Link>
        ))}
        <Link
          href="/grants"
          onClick={() =>
            trackEvent('hero_search_chip_click', {
              chip_label: 'More',
              chip_href: '/grants',
            })
          }
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-brand-yellow/70 hover:text-brand-yellow transition-colors"
        >
          More &rarr;
        </Link>
      </div>
    </div>
  )
}
