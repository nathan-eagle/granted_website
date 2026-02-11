'use client'

import Link from 'next/link'
import type { PublicGrant } from '@/lib/grants'
import GrantStatusBadge from './GrantStatusBadge'
import { trackEvent } from '@/lib/analytics'

function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Rolling'
  return new Date(deadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function isNewGrant(createdAt: string): boolean {
  const ms = Date.now() - Date.parse(createdAt)
  return ms < 14 * 24 * 60 * 60 * 1000
}

export default function GrantCard({ grant }: { grant: PublicGrant }) {
  const isNew = isNewGrant(grant.created_at)

  return (
    <Link
      href={`/grants/${grant.slug}`}
      onClick={() =>
        trackEvent('grant_card_click', {
          grant_slug: grant.slug,
          grant_name: grant.name,
          funder: grant.funder,
          source_page: typeof window !== 'undefined' ? window.location.pathname : '',
        })
      }
      className="group flex flex-col card card-hover overflow-hidden"
    >
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
              {grant.funder}
            </span>
            {isNew && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                New
              </span>
            )}
          </div>
          <GrantStatusBadge status={grant.status} />
        </div>
        <h3 className="heading-md text-navy group-hover:text-brand-gold transition-colors leading-snug text-lg font-bold line-clamp-2">
          {grant.name}
        </h3>
        <p className="text-sm text-navy-light mt-3 line-clamp-2 flex-1">
          {grant.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-navy-light/50 mt-5 pt-4 border-t border-navy/5">
          {grant.amount && <span className="font-medium">{grant.amount}</span>}
          <span>Deadline: {formatDeadline(grant.deadline)}</span>
        </div>
      </div>
    </Link>
  )
}
