'use client'

import Link from 'next/link'
import type { PublicGrant } from '@/lib/grants'
import GrantStatusBadge from './GrantStatusBadge'
import { trackEvent } from '@/lib/analytics'

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
      className="group card card-hover h-full min-h-[270px] p-6 flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-navy-light/55 line-clamp-2">
          {grant.funder}
        </p>
        <GrantStatusBadge status={grant.status} />
      </div>

      <h3 className="text-[2rem] leading-[1.05] tracking-[-0.02em] font-semibold text-navy group-hover:text-brand-gold transition-colors line-clamp-3">
        {grant.name}
      </h3>

      <div className="mt-auto pt-5 border-t border-navy/8 grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-navy-light/45">
            Amount
          </p>
          <p className="text-sm text-navy-light mt-1 line-clamp-2">
            {grant.amount || 'Varies'}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-navy-light/45">
            Deadline
          </p>
          <p className="text-sm text-navy-light mt-1 line-clamp-1">
            {formatDeadline(grant.deadline)}
          </p>
          <p className="text-xs text-navy-light/60 mt-1 line-clamp-1">
            {daysRemaining(grant.deadline)}
          </p>
        </div>
      </div>
    </Link>
  )
}
