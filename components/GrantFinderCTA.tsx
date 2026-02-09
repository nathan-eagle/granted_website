import Link from 'next/link'

type Props = {
  heading?: string
  body?: string
}

export default function GrantFinderCTA({
  heading = 'Not sure which grants to apply for?',
  body = 'Use our free grant finder to search active federal funding opportunities by agency, eligibility, and deadline.',
}: Props) {
  return (
    <section className="bg-cream-dark rounded-2xl p-8 md:p-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-lg">
          <h3 className="text-lg font-bold text-navy">{heading}</h3>
          <p className="text-sm text-navy-light mt-1.5">{body}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/find-grants"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-brand-yellow/90"
          >
            Find Grants
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/grants"
            className="inline-flex items-center gap-2 rounded-lg border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-navy/30 hover:bg-white"
          >
            Browse All
          </Link>
        </div>
      </div>
    </section>
  )
}
