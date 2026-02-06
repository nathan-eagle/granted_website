import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'
import AgencyLogos from '@/components/AgencyLogos'
import AudienceSection from '@/components/AudienceSection'
import DocumentStackC from '@/components/DocumentStackC'
import CoachConversationC from '@/components/CoachConversationC'
import AnimatedGoldRule from '@/components/AnimatedGoldRule'
import StepCards from '@/components/StepCards'
import RevealOnScroll from '@/components/RevealOnScroll'
import HeroIllustrationB from '@/components/HeroIllustrationB'
import { StatsCounter, Testimonials, OrgLogos } from '@/components/SocialProof'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="relative py-24 md:py-32 lg:py-36">
            {/* Decorative accents */}
            <div className="hero-accent-circle w-[280px] h-[280px] -top-20 -right-20 hidden lg:block" />
            <div className="hero-accent-circle w-[180px] h-[180px] bottom-10 -left-16 hidden lg:block" />
            <div className="hero-accent-grid w-[200px] h-[200px] top-16 -left-8 hidden lg:block" />

            <div className="grid items-center gap-12 lg:grid-cols-2 relative z-10">
              {/* Left: copy */}
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-6">
                  Grant Writing Coach
                </p>
                <h1 className="heading-display">
                  Your research deserves better than fundraising
                </h1>
                <p className="body-lg mt-6 text-white/70 max-w-xl">
                  Upload your RFP. Answer a few questions from a grant writing coach. Get a complete,
                  grounded first draft of every section &mdash; project narrative, budget
                  justification, and everything in between.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-10">
                  <CheckoutButton label="Draft Your First Proposal" />
                  <ButtonLink href="/tech" variant="ghost" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                    See how it works &rarr;
                  </ButtonLink>
                </div>
                <p className="mt-6 text-sm text-white/40">
                  7-day free trial. Your data is never used to train AI.{' '}
                  <a href="/security" className="underline hover:text-white/60">Security details &rarr;</a>
                </p>
              </div>

              {/* Right: animated proposal illustration */}
              <div className="hidden lg:block">
                <HeroIllustrationB />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Gold rule divider ── */}
        <AnimatedGoldRule />

        {/* ── Organization logos ── */}
        <OrgLogos />

        {/* ── Agency logos ── */}
        <AgencyLogos />

        {/* ── Stats counter ── */}
        <StatsCounter />

        {/* ── Quality of ideas ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4">
                  Built for every grant writer
                </p>
                <h2 className="heading-xl">The quality of your ideas should decide your funding &mdash; not your English.</h2>
                <p className="body-lg mt-6 text-navy-light">
                  Upload any RFP or grant guidelines. Granted&apos;s AI reads the full document, identifies every required section, and coaches you through the details it needs to draft a grounded, complete proposal.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/tech" variant="ghost" className="px-6">
                    See all 50+ writing models &rarr;
                  </ButtonLink>
                </div>
              </div>
              <CoachConversationC />
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Use cases ── */}
        <section className="bg-cream-dark section-angle-top">
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-2">
              <DocumentStackC />
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4">
                  From donor appeals to federal grants
                </p>
                <h3 className="heading-lg">Purpose-built for grant proposals. Not a chatbot with a prompt.</h3>
                <ul className="body-lg mt-6 space-y-2.5 list-disc pl-6 text-navy-light">
                  <li>Upload any RFP and let the AI identify every required section and evaluation criterion.</li>
                  <li>A grant writing coach asks targeted questions to ground every paragraph in your real data.</li>
                  <li>Section-by-section drafting for federal grants including NIH, NSF, EPA, USDA, and DARPA.</li>
                  <li>Real-time coverage tracking so you never miss a requirement.</li>
                  <li>Purpose-built for grant writing &mdash; not a general-purpose chatbot with a prompt.</li>
                </ul>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Who is this for? ── */}
        <AudienceSection />

        {/* ── Testimonials ── */}
        <Testimonials />

        {/* ── Yellow banner CTA ── */}
        <section>
          <Container className="py-16 md:py-20">
            <RevealOnScroll>
              <div className="banner-yellow paper-texture rounded-[32px] px-10 py-16 text-center md:px-16 md:py-20 relative overflow-hidden">
                <h3 className="heading-lg text-navy relative z-10">
                  Take it for a spin &mdash;
                  <br className="hidden md:block" />
                  keep everything you write.
                </h3>
                <p className="body-lg mx-auto mt-6 max-w-2xl text-navy/70 relative z-10">
                  See what Granted can do in just a few minutes. Your 7-day free trial
                  includes every feature and model, no credit card required.
                </p>
                <div className="mt-8 relative z-10">
                  <CheckoutButton label="Try a Free Draft" />
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── 3 Steps ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-36">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow text-center mb-4">
                How it works
              </p>
              <h2 className="heading-lg text-center">From RFP to polished draft in three steps</h2>
            </RevealOnScroll>
            <StepCards />
          </Container>
        </section>

        {/* ── Equity section ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="mx-auto max-w-3xl text-center">
              <AnimatedGoldRule />
              <div className="mt-12">
                <h2 className="heading-lg">The grants office you can&apos;t afford to hire.</h2>
                <p className="body-lg mt-6 text-navy-light">
                  The grant system has always favored organizations with dedicated grants departments and expensive consultants. We built Granted to change that.
                </p>
                <p className="body-lg mt-4 text-navy-light">
                  Whether you&apos;re a community nonprofit with a six-person team, a tribal college building research capacity from scratch, or an early-career researcher writing your first independent proposal &mdash; Granted gives you the same AI-powered coaching that levels the playing field.
                </p>
                <p className="body-lg mt-4 text-navy-light font-semibold">
                  A professional grant writer charges $5,000&ndash;$15,000 per proposal. Granted costs $29/month.
                </p>
              </div>
              <div className="mt-12">
                <AnimatedGoldRule />
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">Start winning grants today</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Join thousands of researchers, nonprofits, and community organizations
              drafting stronger proposals with Granted.
            </p>
            <div className="mt-10">
              <CheckoutButton label="Draft Your First Proposal" />
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}
