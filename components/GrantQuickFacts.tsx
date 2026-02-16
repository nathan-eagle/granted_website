import type { PublicGrant } from '@/lib/grants'
import GrantStatusBadge from './GrantStatusBadge'
import BookmarkButton from './BookmarkButton'

function deadlineCountdown(deadline: string | null): string {
  if (!deadline) return 'Rolling / Open'
  const d = new Date(deadline)
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  if (diff < 0) return 'Passed'
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `${days} days remaining`
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Rolling'
  return new Date(deadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const SIGN_IN_URL =
  'https://app.grantedai.com/api/auth/signin?callbackUrl=/overview'

export default function GrantQuickFacts({ grant, slug }: { grant: PublicGrant; slug?: string }) {
  const rows = [
    { label: 'Agency', value: grant.funder },
    { label: 'Funding', value: grant.amount || 'See RFP' },
    {
      label: 'Deadline',
      value: `${formatDeadline(grant.deadline)} (${deadlineCountdown(grant.deadline)})`,
    },
    { label: 'Status', value: null, badge: true },
    ...(grant.eligibility
      ? [{ label: 'Eligibility', value: grant.eligibility }]
      : []),
  ]

  return (
    <div className="bg-cream-dark rounded-[20px] border-l-4 border-brand-yellow p-8">
      <h2 className="text-lg font-bold text-navy mb-6">Quick Facts</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-1">
              {row.label}
            </dt>
            <dd className="text-sm text-navy font-medium">
              {row.badge ? (
                <GrantStatusBadge status={grant.status} />
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={SIGN_IN_URL}
          className="button button-primary w-full sm:w-auto"
        >
          Start Your Application with AI
        </a>
        {slug && <BookmarkButton slug={slug} />}
      </div>
    </div>
  )
}
