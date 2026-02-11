'use client'

import Link from 'next/link'
import type { Foundation } from '@/lib/foundations'
import { formatAssets, getFoundationLocation, getFoundationCategoryLabel } from '@/lib/foundations'
import { trackEvent } from '@/lib/analytics'

export default function FoundationCard({ foundation }: { foundation: Foundation }) {
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
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
            {getFoundationCategoryLabel(foundation)}
          </span>
        </div>
        <h3 className="heading-md text-navy group-hover:text-brand-gold transition-colors leading-snug text-lg font-bold line-clamp-2">
          {foundation.name}
        </h3>
        <p className="text-sm text-navy-light mt-3 line-clamp-1 flex-1">
          {getFoundationLocation(foundation)}
        </p>
        <div className="flex items-center justify-between text-xs text-navy-light/50 mt-5 pt-4 border-t border-navy/5">
          <span className="font-medium">{formatAssets(foundation.asset_amount)}</span>
          <span>{getFoundationCategoryLabel(foundation)}</span>
        </div>
      </div>
    </Link>
  )
}
