import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import CostCalculator from '@/components/CostCalculator'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'

export const metadata: Metadata = {
  title: 'Grant Proposal Cost Calculator — Consultant vs AI Comparison',
  description:
    'Calculate how much your grant proposal would cost with a professional consultant vs. Granted AI. Free cost comparison tool for nonprofits and researchers.',
  alternates: { canonical: 'https://grantedai.com/tools/cost-calculator' },
}

export default function CostCalculatorPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36 text-center relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
              Free Tool
            </p>
            <h1 className="heading-xl text-white">
              How much would this proposal cost<br className="hidden md:block" /> with a consultant?
            </h1>
            <p className="body-lg mx-auto mt-5 max-w-2xl text-slate-200">
              Get a realistic estimate of consultant fees for your grant proposal,
              then see how much you could save with Granted AI.
            </p>
          </Container>
        </section>

        <div className="gold-rule" />

        {/* ── Calculator ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <h2 className="heading-lg text-center mb-4">
                Estimate Your Costs
              </h2>
              <p className="body-lg text-navy-light text-center mx-auto max-w-2xl mb-12">
                Select the parameters below to match your proposal. Our estimates
                are based on industry data from thousands of grant writing
                engagements.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <CostCalculator />
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── How we calculate ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                  Methodology
                </p>
                <h2 className="heading-lg text-navy mb-6">
                  How we calculate these estimates
                </h2>
                <p className="body-lg text-navy-light">
                  Our cost model uses publicly available data on grant writing
                  consultant rates, adjusted for complexity, proposal size, and
                  timeline pressure. Rates reflect the 2024&ndash;2025 market for
                  experienced grant writers with federal and foundation expertise.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
                {[
                  {
                    title: 'Hourly Rates',
                    body: '$75\u2013$150/hr depending on the technical complexity and credentials required.',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="11" stroke="#F5CF49" strokeWidth="1.5" />
                        <path d="M14 8v4l3 3" stroke="#F5CF49" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Estimated Hours',
                    body: '30\u2013250 hours based on the number of sections, page count, and level of collaboration required.',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="4" y="6" width="20" height="16" rx="2" stroke="#F5CF49" strokeWidth="1.5" />
                        <path d="M4 11h20" stroke="#F5CF49" strokeWidth="1.5" />
                        <path d="M10 6V4M18 6V4" stroke="#F5CF49" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Rush Premiums',
                    body: 'Expedited timelines add 25%. Rush timelines add 50% to total cost due to overtime and priority scheduling.',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M14 4L16.5 11H23L17.5 15.5L19.5 23L14 18.5L8.5 23L10.5 15.5L5 11H11.5L14 4Z" stroke="#F5CF49" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="card card-hover p-6 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/[0.04]">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                    <p className="body-sm text-navy-light">{item.body}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32 relative z-10">
            <RevealOnScroll>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="heading-lg text-white">
                  Stop overpaying for grant proposals
                </h2>
                <p className="body-lg mt-4 text-white/60">
                  Upload your RFP, answer a few coaching questions, and get a
                  polished draft in hours&mdash;not weeks. Start with a free
                  7-day trial.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
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
