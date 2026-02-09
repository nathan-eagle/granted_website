'use client'

import { useInView } from '@/hooks/useInView'
import { ButtonLink } from '@/components/ButtonLink'

const PILLARS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: 'Discover',
    heading: 'Find grants matched to your org and research focus',
    body: 'Search thousands of federal grants from NIH, NSF, EPA, USDA, DARPA, and more. Filter by agency, eligibility, and deadline to find the right fit fast.',
    cta: { label: 'Browse Grants', href: '/grants' },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="12" y1="7" x2="12" y2="13" />
      </svg>
    ),
    title: 'Draft',
    heading: 'AI coach drafts every section of your proposal',
    body: 'Upload your RFP and let Granted\u2019s grant writing coach ask targeted questions, then draft a complete proposal grounded in your real data.',
    cta: { label: 'See the Coach', href: '/tech' },
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Win',
    heading: 'Submit with confidence \u2014 nothing missed',
    body: 'Real-time coverage tracking ensures every section and evaluation criterion is addressed. Export a polished, submission-ready document.',
    cta: { label: 'View Pricing', href: '/pricing' },
  },
]

export default function HowGrantedWorks() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <section id="how-it-works" className="bg-cream-dark">
      <div className="container py-20 md:py-24">
        <div
          ref={ref}
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow text-center mb-4">
            How it works
          </p>
          <h2 className="heading-lg text-center text-navy">Discover, draft, and win &mdash; in one platform</h2>
        </div>

        <div className="mt-14 relative">
          <div className="timeline-path">
            <div className="grid gap-8 md:grid-cols-3">
              {PILLARS.map((pillar, i) => (
                <div
                  key={pillar.title}
                  className="relative z-10"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity 0.6s ease ${i * 200}ms, transform 0.6s ease ${i * 200}ms`,
                  }}
                >
                  {/* Timeline node */}
                  <div className="flex justify-center mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl bg-navy/5 border-2 border-brand-yellow/20 flex items-center justify-center"
                      style={{
                        opacity: isInView ? 1 : 0,
                        transform: isInView ? 'scale(1)' : 'scale(0.5)',
                        transition: `opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 200 + 100}ms, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 200 + 100}ms`,
                      }}
                    >
                      {pillar.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="card card-hover flex flex-col gap-4 p-8 text-center">
                    <div
                      className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-yellow"
                      style={{
                        opacity: isInView ? 1 : 0,
                        transition: `opacity 0.5s ease ${i * 200 + 200}ms`,
                      }}
                    >
                      {pillar.title}
                    </div>
                    <h3 className="text-lg font-semibold text-navy">{pillar.heading}</h3>
                    <p className="text-base text-navy-light leading-relaxed">{pillar.body}</p>
                    <div className="mt-4">
                      <ButtonLink
                        href={pillar.cta.href}
                        variant="ghost"
                        className="text-sm px-5 min-h-[2.5rem]"
                      >
                        {pillar.cta.label} &rarr;
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
