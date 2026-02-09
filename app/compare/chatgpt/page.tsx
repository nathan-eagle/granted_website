import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantFinderCTA from '@/components/GrantFinderCTA'

export const metadata: Metadata = {
  title: 'Granted AI vs. ChatGPT for Grant Writing — Why Generic AI Falls Short',
  description:
    'Can ChatGPT write a grant proposal? Compare purpose-built AI grant writing with general-purpose AI assistants like ChatGPT, Claude, and Gemini.',
  keywords: [
    'chatgpt grant writing',
    'can chatgpt write a grant proposal',
    'chatgpt vs grant writing software',
    'ai grant writing tool',
  ],
  alternates: { canonical: 'https://grantedai.com/compare/chatgpt' },
}

const comparisonRows = [
  {
    feature: 'RFP/NOFO analysis',
    granted: 'Upload full document, auto-extract every requirement',
    competitor: 'Paste text into chat (context window limits)',
  },
  {
    feature: 'Agency-specific formats',
    granted: 'Built-in templates for NIH, NSF, EPA, USDA, DARPA, DOD',
    competitor: 'Must describe format in prompt each time',
  },
  {
    feature: 'Section drafting',
    granted: 'Section-by-section with live requirement coverage tracking',
    competitor: 'One response at a time, no tracking',
  },
  {
    feature: 'Context grounding',
    granted: 'Interactive coaching gathers your project details first',
    competitor: 'Generates from prompt alone, often invents details',
  },
  {
    feature: 'Cross-section consistency',
    granted: 'Budget, narrative, and timeline stay aligned',
    competitor: 'Each response is independent, inconsistencies likely',
  },
  {
    feature: 'Evaluation criteria awareness',
    granted: 'Parses review criteria and scores against them',
    competitor: 'Only if you paste criteria and ask',
  },
  {
    feature: 'Price',
    granted: '$29/month (unlimited drafts)',
    competitor: '$20/month (ChatGPT Plus) or free tier',
  },
  {
    feature: 'Data privacy',
    granted: 'Data never used for AI training',
    competitor: 'May use conversations for training (opt-out available)',
  },
]

const grantedExcels = [
  'Understands grant proposal structure and evaluation criteria natively',
  'Parses full 80+ page NOFOs and tracks every requirement',
  'Coaching workflow ensures every paragraph is grounded in your real data',
  'Cross-section consistency between narrative, budget, and timeline',
  'Coverage tracking tells you exactly what the reviewer will look for',
]

const competitorExcels = [
  'Lower price or free tier for basic use',
  'Useful for brainstorming, outlining, and general writing tasks',
  'Broad general knowledge for background research',
  'Good for first-pass editing and proofreading',
]

export default function CompareChatGPTPage() {
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
              Granted AI vs. ChatGPT for Grant Writing
            </h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              ChatGPT is great at many things. Writing grant proposals that
              score well with federal reviewers is not one of them. Here is why.
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* The Problem */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <div className="mx-auto max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4">
                  The core problem
                </p>
                <h2 className="heading-lg text-navy">
                  Grant writing is not general writing
                </h2>
                <p className="body-lg mt-6 text-navy-light">
                  A grant proposal is a highly structured document with specific
                  sections mandated by a funder, scored against explicit review
                  criteria, and subject to formatting rules that vary by agency.
                  ChatGPT can generate fluent text, but it cannot parse an
                  80-page NOFO, track evaluation criteria across sections, or
                  ensure your budget justification aligns with your research
                  strategy.
                </p>
                <p className="body-lg mt-4 text-navy-light">
                  Purpose-built grant writing tools solve the structural
                  problem that general AI cannot.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

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
                        ChatGPT / General AI
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
                    Where ChatGPT works well
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
                  Use the right tool for the job
                </h2>
                <p className="body-lg mt-6 text-navy-light">
                  ChatGPT is an excellent general-purpose AI assistant. Use it
                  for brainstorming, background research, and quick editing. But
                  when you need to write a competitive grant proposal that
                  responds to a specific RFP, tracks evaluation criteria, and
                  maintains consistency across sections &mdash; use a tool
                  purpose-built for that job.
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
                  Ready for purpose-built grant writing AI?
                </h3>
                <p className="body-lg mt-4 text-white/60">
                  Upload your RFP and see what a tool designed for grants can
                  do. Free for 7 days, no credit card required.
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
