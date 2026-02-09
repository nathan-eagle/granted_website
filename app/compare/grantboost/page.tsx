import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantFinderCTA from '@/components/GrantFinderCTA'

export const metadata: Metadata = {
  title: 'Granted AI vs. Grantboost — Feature Comparison (2026)',
  description:
    'A fair, factual comparison of Granted AI and Grantboost. Compare pricing, RFP analysis, AI coaching, section drafting, and agency coverage.',
  keywords: [
    'granted ai vs grantboost',
    'grantboost alternative',
    'grantboost review',
  ],
  alternates: { canonical: 'https://grantedai.com/compare/grantboost' },
}

const comparisonRows = [
  {
    feature: 'Starting price',
    granted: '$29/month',
    grantboost: '$19.99/month',
  },
  {
    feature: 'Free trial',
    granted: '7 days (full access)',
    grantboost: 'Limited free tier',
  },
  {
    feature: 'RFP analysis',
    granted: 'Full document upload & parsing',
    grantboost: 'Manual input',
  },
  {
    feature: 'AI coaching',
    granted: 'Interactive Q&A to ground drafts',
    grantboost: 'Template-based',
  },
  {
    feature: 'Section drafting',
    granted: 'Section-by-section with coverage tracking',
    grantboost: 'Full proposal generation',
  },
  {
    feature: 'Agency coverage',
    granted: 'NIH, NSF, EPA, USDA, DARPA, DOD, HUD',
    grantboost: 'General-purpose',
  },
  {
    feature: 'Data privacy',
    granted: 'Data never used for AI training',
    grantboost: 'Check their policy',
  },
]

const grantedExcels = [
  'Deep RFP analysis that parses full solicitation documents automatically',
  'A coaching approach that gathers your unique context before drafting',
  'Federal agency specialization with format-aware section templates',
  'Real-time coverage tracking so you never miss a requirement',
]

const grantboostExcels = [
  'Lower entry price for teams just getting started',
  'Simpler interface suited for quick, straightforward proposals',
]

export default function CompareGrantboostPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
              Tool Comparison
            </p>
            <h1 className="heading-xl text-white">
              Granted AI vs. Grantboost
            </h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              A fair, factual comparison to help you choose the right AI grant
              writing tool.
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* ── Comparison Table ── */}
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
                        Grantboost
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
                        <td className="px-6 py-4 text-navy font-medium text-sm">
                          {row.granted}
                        </td>
                        <td className="px-6 py-4 text-navy-light text-sm">
                          {row.grantboost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Where Each Excels ── */}
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
                      <li
                        key={item}
                        className="flex items-start gap-3 text-slate-200"
                      >
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
                    Where Grantboost excels
                  </h3>
                  <ul className="space-y-4">
                    {grantboostExcels.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-slate-200"
                      >
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

        {/* ── Bottom Line ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                  Bottom Line
                </p>
                <h2 className="heading-lg text-navy">
                  Built for federal grant accuracy
                </h2>
                <p className="body-lg mt-6 text-navy-light">
                  Granted is built for teams who need accuracy and compliance on
                  federal grants. Its RFP parsing, coaching workflow, and
                  requirement coverage tracking are designed to reduce errors and
                  ensure nothing gets missed. Grantboost may work well for
                  simpler applications where speed is the priority and
                  agency-specific formatting matters less.
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
