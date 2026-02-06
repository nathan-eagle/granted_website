import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import ReadinessQuiz from '@/components/ReadinessQuiz'
import { ButtonLink } from '@/components/ButtonLink'

export const metadata: Metadata = {
  title: 'Grant Readiness Assessment Quiz — Are You Ready to Apply?',
  description: 'Take our free 2-minute quiz to assess your organization\'s grant readiness. Get a personalized score and actionable recommendations to improve your chances.',
  alternates: { canonical: 'https://grantedai.com/tools/readiness-quiz' },
}

export default function ReadinessQuizPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto relative z-10">
              {/* Decorative accents */}
              <div className="hero-accent-circle w-[220px] h-[220px] -top-16 -right-24 hidden lg:block" />
              <div className="hero-accent-circle w-[140px] h-[140px] bottom-8 -left-20 hidden lg:block" />

              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Free Assessment Tool
              </p>
              <h1 className="heading-xl text-white">
                Is your organization ready to win grants?
              </h1>
              <p className="body-lg mt-6 text-white/60 max-w-2xl mx-auto">
                Take this 2-minute assessment to get a personalized readiness score and an
                actionable plan for closing the gaps that cost organizations funding.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Quiz section ── */}
        <section>
          <Container className="py-16 md:py-20">
            <RevealOnScroll>
              <ReadinessQuiz />
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── About this tool ── */}
        <section className="bg-cream-dark">
          <Container className="py-20 md:py-28">
            <RevealOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4">
                  Why Grant Readiness Matters
                </p>
                <h2 className="heading-lg text-navy">
                  Most rejected proposals fail on readiness, not ideas
                </h2>
                <p className="body-lg text-navy-light mt-6 max-w-2xl mx-auto">
                  Federal reviewers evaluate organizational capacity alongside your
                  project narrative. Missing a SAM.gov registration, lacking audited
                  financials, or submitting without letters of support can disqualify
                  an otherwise strong proposal before it reaches merit review.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="grid sm:grid-cols-3 gap-6 mt-14 max-w-3xl mx-auto">
                {[
                  { stat: '40%', label: 'of federal applications are returned without review due to compliance gaps' },
                  { stat: '3x', label: 'higher win rate for organizations that complete readiness assessments first' },
                  { stat: '2 min', label: 'is all it takes to identify your biggest gaps and build a plan' },
                ].map((item) => (
                  <div key={item.stat} className="card card-hover p-6 text-center">
                    <p className="font-display text-3xl tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: '#F5CF49' }}>
                      {item.stat}
                    </p>
                    <p className="text-sm text-navy-light mt-2 leading-relaxed">{item.label}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-20 md:py-24 text-center relative z-10">
            <RevealOnScroll>
              <h2 className="heading-lg text-white">
                Turn readiness into funded proposals
              </h2>
              <p className="body-lg text-white/60 mt-4 max-w-2xl mx-auto">
                Granted helps you draft complete, requirement-aligned proposals once
                your organization is ready. Upload your RFP and start writing in minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                <ButtonLink href="/pricing" variant="ghost" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                  View Pricing
                </ButtonLink>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
