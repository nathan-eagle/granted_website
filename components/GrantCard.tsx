import Link from 'next/link'
import type { PublicGrant } from '@/lib/grants'
import GrantStatusBadge from './GrantStatusBadge'

function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Rolling'
  return new Date(deadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function GrantCard({ grant }: { grant: PublicGrant }) {
  return (
    <Link
      href={`/grants/${grant.slug}`}
      className="group flex flex-col card card-hover overflow-hidden"
    >
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
            {grant.funder}
          </span>
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
