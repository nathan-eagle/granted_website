import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantFinderCTA from '@/components/GrantFinderCTA'

export const metadata: Metadata = {
  title: 'Writing Grants Yourself vs. Using Granted AI',
  description:
    'Compare writing grant proposals yourself versus using Granted AI. See the real time and cost breakdown \u2014 80+ hours DIY vs. ~6 hours with AI assistance.',
  keywords: [
    'how to write a grant proposal',
    'grant writing tips',
    'grant writing software',
  ],
  alternates: { canonical: 'https://grantedai.com/compare/doing-it-yourself' },
}

const diySteps = [
  { label: 'Research RFP', hours: 8 },
  { label: 'Outline', hours: 4 },
  { label: 'First draft', hours: 40 },
  { label: 'Revisions', hours: 20 },
  { label: 'Formatting', hours: 8 },
]

const grantedSteps = [
  { label: 'Upload RFP', hours: 0.08, display: '5 min' },
  { label: 'Answer coaching questions', hours: 1, display: '1 hr' },
  { label: 'Review & edit AI draft', hours: 3, display: '3 hrs' },
  { label: 'Final polish', hours: 2, display: '2 hrs' },
]

const diyTotal = 80
const grantedTotal = 6

const diyGains = [
  'Deep personal knowledge of every sentence in the proposal',
  'Full creative control over narrative and strategy',
  'No monthly software cost',
]

const grantedGains = [
  '90% time savings on every proposal you write',
  'Built-in requirement tracking so nothing gets missed',
  'Agency-specific formatting for NIH, NSF, EPA, USDA, and more',
  'Consistent quality across proposals, even under tight deadlines',
]

export default function CompareDIYPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
              Time &amp; Cost Comparison
            </p>
            <h1 className="heading-xl text-white">
              Writing Grants Yourself vs. Using Granted AI
            </h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              You can absolutely write grants yourself. But should you spend
              80+ hours on each one?
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* ── Time Comparison Visualization ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <h2 className="heading-lg text-center mb-4">
                Where does the time go?
              </h2>
              <p className="body-lg text-center text-navy-light mx-auto max-w-2xl mb-14">
                A single grant proposal represents a serious time commitment.
                Here is how the hours break down.
              </p>
            </RevealOnScroll>

            <div className="grid gap-10 lg:grid-cols-2">
              {/* DIY column */}
              <RevealOnScroll>
                <div className="rounded-3xl bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(10,22,40,0.06)]">
                  <h3 className="heading-md text-navy mb-2">DIY Approach</h3>
                  <p className="text-sm text-navy-light/60 mb-8 font-medium uppercase tracking-wider">
                    ~{diyTotal} hours per proposal
                  </p>
                  <div className="space-y-4">
                    {diySteps.map((step) => {
                      const pct = (step.hours / diyTotal) * 100
                      return (
                        <div key={step.label}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-navy">
                              {step.label}
                            </span>
                            <span className="text-navy-light">
                              {step.hours}h
                            </span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-navy/[0.06]">
                            <div
                              className="h-3 rounded-full bg-navy/30"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-8 flex items-baseline gap-2 border-t border-navy/10 pt-6">
                    <span className="font-display text-4xl text-navy tracking-tight">
                      {diyTotal}
                    </span>
                    <span className="text-navy-light font-medium">
                      hours total
                    </span>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Granted column */}
              <RevealOnScroll delay={150}>
                <div className="rounded-3xl border-2 border-brand-yellow/40 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(245,207,73,0.12)]">
                  <h3 className="heading-md text-navy mb-2">
                    With Granted AI
                  </h3>
                  <p className="text-sm text-navy-light/60 mb-8 font-medium uppercase tracking-wider">
                    ~{grantedTotal} hours per proposal
                  </p>
                  <div className="space-y-4">
                    {grantedSteps.map((step) => {
                      const pct = (step.hours / grantedTotal) * 100
                      return (
                        <div key={step.label}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-navy">
                              {step.label}
                            </span>
                            <span className="text-navy-light">
                              {step.display}
                            </span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-navy/[0.06]">
                            <div
                              className="h-3 rounded-full bg-brand-yellow"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-8 flex items-baseline gap-2 border-t border-brand-yellow/30 pt-6">
                    <span className="font-display text-4xl text-brand-yellow tracking-tight">
                      {grantedTotal}
                    </span>
                    <span className="text-navy-light font-medium">
                      hours total
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* ── What You Gain ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-32 relative z-10">
            <div className="grid gap-12 md:grid-cols-2">
              <RevealOnScroll>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
                  <h3 className="heading-md text-white mb-6">
                    What you gain with DIY
                  </h3>
                  <ul className="space-y-4">
                    {diyGains.map((item) => (
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
              <RevealOnScroll delay={150}>
                <div className="rounded-3xl border border-brand-yellow/20 bg-brand-yellow/[0.06] p-8 md:p-10">
                  <h3 className="heading-md text-white mb-6">
                    What you gain with Granted
                  </h3>
                  <ul className="space-y-4">
                    {grantedGains.map((item) => (
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
            </div>
          </Container>
        </section>

        {/* ── The Real Cost of DIY ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                  The Real Cost of DIY
                </p>
                <h2 className="heading-lg text-navy">
                  Time is money &mdash; literally
                </h2>
                <p className="body-lg mt-6 text-navy-light">
                  If your time is worth $50/hour, an 80-hour proposal costs
                  $4,000 in opportunity cost alone. That is time you could spend
                  on programs, fundraising, or research. Granted costs $29/month
                  and brings that time down to about 6 hours &mdash; saving you
                  thousands on every proposal.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <div className="mt-14 grid gap-6 sm:grid-cols-3 mx-auto max-w-3xl">
                <div className="card p-8 text-center">
                  <p className="font-display text-4xl text-navy tracking-tight">
                    $4,000
                  </p>
                  <p className="text-sm text-navy-light mt-2 font-medium">
                    Opportunity cost per DIY proposal
                  </p>
                </div>
                <div className="card p-8 text-center border-2 border-brand-yellow/40">
                  <p className="font-display text-4xl text-brand-yellow tracking-tight">
                    $29
                  </p>
                  <p className="text-sm text-navy-light mt-2 font-medium">
                    Granted AI per month (unlimited)
                  </p>
                </div>
                <div className="card p-8 text-center">
                  <p className="font-display text-4xl text-navy tracking-tight">
                    74
                  </p>
                  <p className="text-sm text-navy-light mt-2 font-medium">
                    Hours saved per proposal
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Related Reading ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                  Keep Learning
                </p>
                <h2 className="heading-lg text-navy mb-10">
                  Related reading
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 text-left">
                  <a
                    href="/blog/become-a-grant-writer-essential-steps-tips"
                    className="card card-hover p-8 block group"
                  >
                    <p className="font-semibold text-navy group-hover:text-brand-gold transition-colors">
                      How to Become a Grant Writer: Essential Steps &amp; Tips
                    </p>
                    <p className="body-sm text-navy-light mt-2">
                      A practical guide for anyone getting started with grant
                      writing, covering skills, process, and common pitfalls.
                    </p>
                  </a>
                  <a
                    href="/blog/writing-a-proposal-is-not-like-writing-an-article"
                    className="card card-hover p-8 block group"
                  >
                    <p className="font-semibold text-navy group-hover:text-brand-gold transition-colors">
                      Writing a Proposal Is Not Like Writing an Article
                    </p>
                    <p className="body-sm text-navy-light mt-2">
                      Why grant proposals require a fundamentally different
                      approach than academic or journalistic writing.
                    </p>
                  </a>
                </div>
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
                  Save 80% of your writing time
                </h3>
                <p className="body-lg mt-4 text-white/60">
                  Stop spending weeks on each proposal. Upload your RFP, let
                  Granted coach you through the key decisions, and get a
                  polished draft in hours.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <CheckoutButton label="Draft Your First Proposal" />
                  <ButtonLink
                    href="/features"
                    variant="ghost"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  >
                    See how it works
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
