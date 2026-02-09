import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

const AUDIENCES = [
  {
    heading: 'Academic Researchers',
    body: 'Writing NSF, NIH, DOE, or NOAA proposals. From your first R01 to your fifth CAREER renewal.',
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
    heading: 'Tribal Colleges & Indigenous-Serving Institutions',
    body: 'NSF TCUP, EPA IGAP, IHS, and BIA programs. Your data stays yours.',
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
    body: 'Never written a federal grant before? The grant writing coach walks you through every section.',
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
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {AUDIENCES.map((audience) => (
            <div key={audience.heading} className="flex flex-col gap-4 p-7 rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.1] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                {audience.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{audience.heading}</h3>
              <p className="text-base text-white/60 leading-relaxed">{audience.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/find-grants" className="button button-primary cta-shimmer">
            Find Your Grants &rarr;
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
