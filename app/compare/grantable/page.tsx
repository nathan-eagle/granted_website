import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Granted AI vs. Grantable — Honest Feature Comparison (2026)',
  description:
    'Compare Granted AI and Grantable side by side. Pricing, RFP analysis, AI coaching, section drafting, and federal agency coverage.',
  keywords: [
    'granted ai vs grantable',
    'grantable alternative',
    'grantable review',
    'ai grant writing comparison',
  ],
  alternates: { canonical: 'https://grantedai.com/compare/grantable' },
}

const comparisonRows = [
  {
    feature: 'Starting price',
    granted: '$29/month',
    competitor: 'Custom / enterprise pricing',
  },
  {
    feature: 'Free trial',
    granted: '7 days, full access',
    competitor: 'Demo available',
  },
  {
    feature: 'RFP analysis',
    granted: 'Full document upload & automatic parsing',
    competitor: 'Document upload with AI extraction',
  },
  {
    feature: 'AI approach',
    granted: 'Interactive coaching Q&A before drafting',
    competitor: 'Template-driven generation',
  },
  {
    feature: 'Section drafting',
    granted: 'Section-by-section with live coverage tracking',
    competitor: 'Full proposal generation',
  },
  {
    feature: 'Federal agency specialization',
    granted: 'NIH, NSF, EPA, USDA, DARPA, DOD, HUD',
    competitor: 'General-purpose with some agency templates',
  },
  {
    feature: 'Target audience',
    granted: 'Researchers, nonprofits, small businesses',
    competitor: 'Enterprise teams and larger organizations',
  },
  {
    feature: 'Data privacy',
    granted: 'Data never used for AI training',
    competitor: 'Check their policy',
  },
]

const grantedExcels = [
  'Affordable flat pricing at $29/month with unlimited drafts',
  'Interactive coaching that gathers your unique project context before writing',
  'Deep federal agency specialization with format-aware section templates',
  'Real-time coverage tracking so nothing gets missed in complex RFPs',
]

const competitorExcels = [
  'Larger established user base with 27,000+ users',
  'Enterprise features for bigger grant writing teams',
  'Help Center with an AI Grant Writing Course',
]

export default function CompareGrantablePage() {
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
              Granted AI vs. Grantable
            </h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              A fair comparison to help you pick the right AI grant writing tool
              for your team and budget.
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* Comparison Table */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <h2 className="heading-lg text-center mb-12">
                Side-by-Side Features
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
                        Grantable
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
                    Where Grantable excels
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
                  Coaching-first vs. template-first
                </h2>
                <p className="body-lg mt-6 text-navy-light">
                  Grantable has built a strong platform with a large user base
                  and enterprise features. Granted takes a different approach:
                  interactive coaching that gathers your specific project
                  details before writing a single word, combined with real-time
                  coverage tracking against the full RFP. If you value
                  affordable pricing and a workflow that grounds every paragraph
                  in your real data, Granted is worth a try.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32 relative z-10">
            <RevealOnScroll>
              <div className="mx-auto max-w-2xl text-center">
                <h3 className="heading-lg text-white">
                  See the difference for yourself
                </h3>
                <p className="body-lg mt-4 text-white/60">
                  Upload your RFP and experience the full Granted workflow
                  &mdash; coaching, drafting, and coverage tracking &mdash; free
                  for 7 days.
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
