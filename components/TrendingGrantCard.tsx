'use client'

import Link from 'next/link'
import type { PublicGrant } from '@/lib/grants'
import GrantStatusBadge from './GrantStatusBadge'
import { trackEvent } from '@/lib/analytics'
import { inferGrantHeaderClass } from '@/lib/card-theme'

function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Rolling'
  return new Date(deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function daysRemaining(deadline: string | null): string {
  if (!deadline) return 'Open'
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return 'Closed'
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export default function TrendingGrantCard({ grant }: { grant: PublicGrant }) {
  const headerClass = inferGrantHeaderClass(grant)

  return (
    <Link
      href={`/grants/${grant.slug}`}
      onClick={() =>
        trackEvent('trending_grant_click', {
          grant_slug: grant.slug,
          grant_name: grant.name,
          funder: grant.funder,
          source_page: typeof window !== 'undefined' ? window.location.pathname : '',
        })
      }
      className="group flex flex-col card card-hover h-full overflow-hidden"
    >
      <div className={`${headerClass} px-6 py-4 flex items-center justify-between gap-3`}>
        <span className="inline-flex max-w-[12rem] truncate rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white/90">
          {grant.funder}
        </span>
        <GrantStatusBadge status={grant.status} />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-navy group-hover:text-brand-gold transition-colors leading-snug line-clamp-2">
          {grant.name}
        </h3>
        {grant.summary && (
          <p className="text-sm text-navy-light mt-3 line-clamp-3 flex-1">
            {grant.summary}
          </p>
        )}

        <div className="mt-5 pt-4 border-t border-navy/5 grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-light/45">Amount</p>
            <p className="text-sm text-navy-light mt-1 line-clamp-2">
              {grant.amount || 'Varies'}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-light/45">Deadline</p>
            <p className="text-sm text-navy-light mt-1 line-clamp-1">
              {formatDeadline(grant.deadline)}
            </p>
            <p className="text-xs text-navy-light/60 mt-1 line-clamp-1">
              {daysRemaining(grant.deadline)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
