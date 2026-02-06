import Container from '@/components/Container'

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
    <section className="bg-cream-dark">
      <Container className="py-28 md:py-32">
        <h2 className="heading-lg text-center">Who is Granted for?</h2>
        <p className="body-lg text-center text-navy-light mt-4 mx-auto max-w-2xl">
          Granted is the grants office you can&apos;t afford to hire.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {AUDIENCES.map((audience) => (
            <div key={audience.heading} className="card flex flex-col gap-4 p-8">
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                {audience.icon}
              </div>
              <h3 className="text-lg font-semibold text-navy">{audience.heading}</h3>
              <p className="text-base text-navy-light leading-relaxed">{audience.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
