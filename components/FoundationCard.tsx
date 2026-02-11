'use client'

import Link from 'next/link'
import type { Foundation } from '@/lib/foundations'
import { formatAssets, getFoundationLocation, getFoundationCategoryTheme } from '@/lib/foundations'
import { trackEvent } from '@/lib/analytics'

function formatWebsiteHost(website: string | null): string | null {
  if (!website) return null
  try {
    const normalized = website.startsWith('http') ? website : `https://${website}`
    const host = new URL(normalized).hostname.replace(/^www\./, '')
    return host || null
  } catch {
    return null
  }
}

export default function FoundationCard({ foundation }: { foundation: Foundation }) {
  const categoryTheme = getFoundationCategoryTheme(foundation)
  const location = getFoundationLocation(foundation)
  const host = formatWebsiteHost(foundation.website)

  return (
    <Link
      href={`/foundations/${foundation.slug}`}
      onClick={() =>
        trackEvent('foundation_card_click', {
          foundation_slug: foundation.slug,
          foundation_name: foundation.name,
          state: foundation.state,
          source_page: typeof window !== 'undefined' ? window.location.pathname : '',
        })
      }
      className="group flex flex-col card card-hover overflow-hidden"
    >
      <div className={`${categoryTheme.gradient} px-6 py-4 flex items-center justify-between gap-3`}>
        <span className="inline-flex max-w-[12rem] truncate rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white/90">
          {categoryTheme.label}
        </span>
        <span className="text-xs text-white/70 truncate">
          {foundation.state || 'US'}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-navy group-hover:text-brand-gold transition-colors leading-snug line-clamp-2">
          {foundation.name}
        </h3>
        <p className="text-sm text-navy-light mt-3 line-clamp-2">
          {location}
        </p>
        {host && (
          <p className="text-xs text-navy-light/55 mt-2 line-clamp-1">
            Website: {host}
          </p>
        )}
        <div className="mt-5 pt-4 border-t border-navy/5 grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-light/45">Assets</p>
            <p className="text-sm text-navy-light mt-1 line-clamp-1">
              {formatAssets(foundation.asset_amount)}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-light/45">Category</p>
            <p className="text-sm text-navy-light mt-1 line-clamp-1">
              {categoryTheme.label}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
