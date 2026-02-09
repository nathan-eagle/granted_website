import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantFinderCTA from '@/components/GrantFinderCTA'

export const metadata: Metadata = {
  title: 'Granted AI vs. Hiring a Grant Writer — Honest Comparison',
  description:
    'Compare the cost, speed, and quality of hiring a professional grant writer versus using Granted AI. An honest breakdown to help you decide.',
  keywords: ['AI vs grant writer', 'should I hire a grant writer', 'grant writer cost'],
  alternates: { canonical: 'https://grantedai.com/compare/grant-writers' },
}

const comparisonRows = [
  {
    feature: 'Cost per proposal',
    writer: '$5,000\u2013$15,000',
    granted: '$29/month (unlimited)',
  },
  {
    feature: 'Turnaround time',
    writer: '2\u20136 weeks',
    granted: 'Hours',
  },
  {
    feature: 'Available 24/7',
    writer: 'No (business hours)',
    granted: 'Yes',
  },
  {
    feature: 'Knows your RFP',
    writer: 'After reading & meetings',
    granted: 'Instant AI analysis',
  },
  {
    feature: 'Revision rounds',
    writer: '1\u20132 included',
    granted: 'Unlimited',
  },
  {
    feature: 'Agency expertise',
    writer: 'Varies by writer',
    granted: 'NIH, NSF, EPA, USDA, DARPA, DOD + more',
  },
  {
    feature: 'Learning curve',
    writer: 'None (they do the work)',
    granted: '~30 minutes',
  },
  {
    feature: 'Your involvement',
    writer: 'Interviews + reviews',
    granted: 'Answer coaching questions + review draft',
  },
]

const hireReasons = [
  'You need a relationships-based approach with a specific funder',
  'Compliance requirements are extremely complex or novel',
  'The grant is over $5M and the stakes justify the investment',
]

const grantedReasons = [
  'Your budget is limited and every dollar matters',
  'You need a proposal fast \u2014 days, not weeks',
  'You write multiple proposals per year and need volume',
  'You want to build your own grant writing skills over time',
]

export default function CompareGrantWritersPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
              Honest Comparison
            </p>
            <h1 className="heading-xl text-white">
              Granted AI vs. Hiring a Grant Writer
            </h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              An honest comparison of cost, speed, quality, and when each option
              makes the most sense for your organization.
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* ── Comparison Table ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <h2 className="heading-lg text-center mb-12">
                Feature-by-Feature Comparison
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
                        Professional Grant Writer
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-2xl">
                        Granted AI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={
                          i % 2 === 0
                            ? 'bg-white'
                            : 'bg-cream-dark'
                        }
                      >
                        <td className="px-6 py-4 font-semibold text-navy text-sm">
                          {row.feature}
                        </td>
                        <td className="px-6 py-4 text-navy-light text-sm">
                          {row.writer}
                        </td>
                        <td className="px-6 py-4 text-navy font-medium text-sm">
                          {row.granted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── When to Hire / When to Use ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-32 relative z-10">
            <div className="grid gap-12 md:grid-cols-2">
              <RevealOnScroll>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
                  <h3 className="heading-md text-white mb-6">
                    When to hire a grant writer
                  </h3>
                  <ul className="space-y-4">
                    {hireReasons.map((reason) => (
                      <li
                        key={reason}
                        className="flex items-start gap-3 text-slate-200"
                      >
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-brand-yellow">
                          &rarr;
                        </span>
                        <span className="body-lg">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={150}>
                <div className="rounded-3xl border border-brand-yellow/20 bg-brand-yellow/[0.06] p-8 md:p-10">
                  <h3 className="heading-md text-white mb-6">
                    When to use Granted AI
                  </h3>
                  <ul className="space-y-4">
                    {grantedReasons.map((reason) => (
                      <li
                        key={reason}
                        className="flex items-start gap-3 text-slate-200"
                      >
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow/20 text-xs font-bold text-brand-yellow">
                          &#10003;
                        </span>
                        <span className="body-lg">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* ── The Best Approach ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                  The Best Approach
                </p>
                <h2 className="heading-lg text-navy">
                  Many organizations use both
                </h2>
                <p className="body-lg mt-6 text-navy-light">
                  The smartest grant teams are not choosing one or the other.
                  They use Granted AI for first drafts and high-volume proposals,
                  then bring in a professional writer for final polish on
                  high-stakes grants. This hybrid approach cuts costs while
                  keeping quality where it matters most.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Grant Finder ── */}
        <section>
          <Container className="py-16 md:py-20">
            <RevealOnScroll>
              <GrantFinderCTA />
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32 relative z-10">
            <RevealOnScroll>
              <div className="mx-auto max-w-2xl text-center">
                <h3 className="heading-lg text-white">
                  Try the $29/month alternative
                </h3>
                <p className="body-lg mt-4 text-white/60">
                  Upload your RFP, answer a few coaching questions, and get a
                  full draft in hours &mdash; not weeks. Start with a free
                  7-day trial.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <CheckoutButton label="Start Your Free Trial" />
                  <ButtonLink
                    href="/pricing"
                    variant="ghost"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  >
                    View pricing
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
