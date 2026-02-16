import Link from 'next/link'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

const AUDIENCES = [
  {
    heading: 'Academic Researchers',
    body: 'Writing NSF, NIH, DOE, or NOAA proposals. From your first R01 to your fifth CAREER renewal.',
    href: '/for/researchers',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
      </svg>
    ),
  },
  {
    heading: 'Nonprofits & Community Organizations',
    body: 'Applying for EPA, USDA, HUD, or HRSA grants. No grants department required.',
    href: '/for/nonprofits',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
      </svg>
    ),
  },
  {
    heading: 'K-12 Schools & Districts',
    body: 'Title I, IDEA, ESSER, and state education grants. Built for educators who write grants after the school day ends.',
    href: '/for/k12',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" />
        <path d="M8 7h6M8 11h4" />
      </svg>
    ),
  },
  {
    heading: 'Environmental & Climate Organizations',
    body: 'EPA, NOAA, DOE clean energy, and IRA-funded programs. Billions in new climate funding, one search.',
    href: '/for/environmental',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <path d="M2 22c1.25-1.25 2.5-2 4-2 3 0 3 2 6 2s3-2 6-2c1.5 0 2.75.75 4 2" />
        <path d="M12 2a10 10 0 00-7.07 17.07" />
        <path d="M12 2a10 10 0 017.07 17.07" />
        <path d="M12 2v10" />
      </svg>
    ),
  },
  {
    heading: 'Small Businesses & SBIR Applicants',
    body: 'Phase I and Phase II SBIR/STTR proposals across DOD, NIH, NSF, DOE, and USDA.',
    href: '/for/sbir',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    heading: 'First-Time Federal Applicants',
    body: 'Never written a federal grant before? AI coaching walks you through every section.',
    href: '/for/first-time',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
]

export default function AudienceSection() {
  return (
    <section className="bg-navy noise-overlay overflow-hidden">
      <Container className="py-20 md:py-24 relative z-10">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 text-center mb-4">
          Who it&apos;s for
        </p>
        <h2 className="heading-lg text-center text-white">Built for organizations like yours</h2>
        <p className="body-lg text-center text-white/60 mt-4 mx-auto max-w-2xl">
          The grants office you can&apos;t afford to hire.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <Link
              key={audience.heading}
              href={audience.href}
              className="flex flex-col gap-4 p-7 rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.1] hover:border-white/[0.15] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                {audience.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{audience.heading}</h3>
              <p className="text-base text-white/60 leading-relaxed">{audience.body}</p>
              <span className="text-sm font-semibold text-brand-yellow group-hover:underline mt-auto">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/grants" className="button button-primary cta-shimmer">
            Find Your Grants &rarr;
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
