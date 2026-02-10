import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantFinderCTA from '@/components/GrantFinderCTA'

export const metadata: Metadata = {
  title: 'Granted AI vs. Instrumentl — Grant Writing vs. Grant Discovery (2026)',
  description:
    'Compare Granted AI and Instrumentl. See how a purpose-built AI grant writing tool compares to a grant discovery and tracking platform.',
  keywords: [
    'granted ai vs instrumentl',
    'instrumentl alternative',
    'instrumentl review',
    'grant writing vs grant discovery',
  ],
  alternates: { canonical: 'https://grantedai.com/compare/instrumentl' },
}

const comparisonRows = [
  {
    feature: 'Primary purpose',
    granted: 'AI grant writing & proposal drafting',
    competitor: 'Grant discovery, tracking & management',
  },
  {
    feature: 'Starting price',
    granted: '$29/month',
    competitor: '$179/month',
  },
  {
    feature: 'Free trial',
    granted: '7 days, full access',
    competitor: '14-day trial',
  },
  {
    feature: 'Grant discovery',
    granted: 'Largest growing grants + funders database with AI fit matching',
    competitor: 'Strong discovery database with matching and tracking workflows',
  },
  {
    feature: 'Proposal writing',
    granted: 'Full AI drafting with RFP analysis and coaching',
    competitor: 'Not a writing tool',
  },
  {
    feature: 'RFP analysis',
    granted: 'Upload full document, auto-parse requirements',
    competitor: 'N/A (discovery focused)',
  },
  {
    feature: 'Grant tracking',
    granted: 'Basic pipeline in app',
    competitor: 'Advanced pipeline, calendar, and team management',
  },
  {
    feature: 'Target audience',
    granted: 'Anyone writing grant proposals',
    competitor: 'Teams managing a portfolio of grants',
  },
]

const grantedExcels = [
  'Purpose-built AI that actually writes your grant proposal sections',
  'Interactive coaching that grounds every paragraph in your real project data',
  'Federal agency specialization (NIH, NSF, EPA, USDA, DARPA, DOD)',
  '85% less expensive at $29/month vs. $179+/month',
]

const competitorExcels = [
  'Strong grant tracking workflows for teams managing many deadlines',
  'Advanced pipeline management for teams tracking dozens of grants',
  'Funder insights and 990 data for foundation research',
  'Team collaboration and deadline management features',
]

export default function CompareInstrumentlPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
              Tool Comparison
            </p>
            <h1 className="heading-xl text-white">
              Granted AI vs. Instrumentl
            </h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              Both platforms help with discovery. Granted combines the world&apos;s
              largest grants + funders database with full AI proposal drafting.
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* Comparison Table */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <h2 className="heading-lg text-center mb-12">
                Side-by-Side Comparison
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(10,22,40,0.08)]">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-2xl">
                        Feature
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                        Granted AI
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-2xl">
                        Instrumentl
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={i % 2 === 0 ? 'bg-white' : 'bg-cream-dark'}
                      >
                        <td className="px-6 py-4 font-semibold text-navy text-sm">
                          {row.feature}
                        </td>
                        <td className="px-6 py-4 text-navy font-medium text-sm">
                          {row.granted}
                        </td>
                        <td className="px-6 py-4 text-navy-light text-sm">
                          {row.competitor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* Where Each Excels */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-32 relative z-10">
            <div className="grid gap-12 md:grid-cols-2">
              <RevealOnScroll>
                <div className="rounded-3xl border border-brand-yellow/20 bg-brand-yellow/[0.06] p-8 md:p-10">
                  <h3 className="heading-md text-white mb-6">
                    Where Granted excels
                  </h3>
                  <ul className="space-y-4">
                    {grantedExcels.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-200">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow/20 text-xs font-bold text-brand-yellow">
                          &#10003;
                        </span>
                        <span className="body-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={150}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
                  <h3 className="heading-md text-white mb-6">
                    Where Instrumentl excels
                  </h3>
                  <ul className="space-y-4">
                    {competitorExcels.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-200">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/60">
                          &rarr;
                        </span>
                        <span className="body-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* Bottom Line */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                  Bottom Line
                </p>
                <h2 className="heading-lg text-navy">
                  Discovery plus drafting, all in one workflow
                </h2>
                <p className="body-lg mt-6 text-navy-light">
                  Instrumentl is strong for grant tracking workflows. Granted
                  gives teams a larger discovery layer plus full drafting,
                  coaching, and requirement coverage in one place, so you can
                  move from opportunity search to submission-ready narrative
                  without switching tools.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* Grant Finder */}
        <section>
          <Container className="py-16 md:py-20">
            <RevealOnScroll>
              <GrantFinderCTA />
            </RevealOnScroll>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32 relative z-10">
            <RevealOnScroll>
              <div className="mx-auto max-w-2xl text-center">
                <h3 className="heading-lg text-white">
                  Found the grant? Now write it.
                </h3>
                <p className="body-lg mt-4 text-white/60">
                  Upload your RFP and get a complete first draft &mdash;
                  coaching, section-by-section writing, and coverage tracking
                  &mdash; free for 7 days.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <CheckoutButton label="Try Granted AI Free" />
                  <ButtonLink
                    href="/features"
                    variant="ghost"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  >
                    Explore features
                  </ButtonLink>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
