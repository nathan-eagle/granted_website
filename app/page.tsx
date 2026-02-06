import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'
import AgencyLogos from '@/components/AgencyLogos'
import AudienceSection from '@/components/AudienceSection'
import { DocumentStack, CoachConversation } from '@/components/AbstractIllustration'
import AnimatedGoldRule from '@/components/AnimatedGoldRule'
import StepCards from '@/components/StepCards'
import RevealOnScroll from '@/components/RevealOnScroll'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="relative py-32 md:py-40">
            {/* Decorative accents */}
            <div className="hero-accent-circle w-[280px] h-[280px] -top-20 -right-20 hidden lg:block" />
            <div className="hero-accent-circle w-[180px] h-[180px] bottom-10 -left-16 hidden lg:block" />
            <div className="hero-accent-grid w-[200px] h-[200px] top-16 -left-8 hidden lg:block" />

            <div className="mx-auto max-w-3xl text-center relative z-10">
              <h1 className="heading-display">You have better things to do with your time</h1>
              <p className="mt-6 text-lg md:text-2xl font-semibold text-brand-yellow">
                Your AI grant coach &mdash; from NIH R01s to community development grants
              </p>
              <p className="body-lg mx-auto mt-6 text-white/70">
                Upload your RFP. Answer a few questions. Get a complete, grounded first draft
                of every section &mdash; project narrative, budget justification, and everything in between.
              </p>
              <div className="mt-10">
                <CheckoutButton label="Start Writing" />
              </div>
              <p className="mt-6 text-sm text-white/50">
                Your proposals are never used to train AI. Data encrypted. Delete anytime.{' '}
                <a href="/security" className="underline hover:text-white/70">Learn more &rarr;</a>
              </p>
            </div>
          </Container>
        </section>

        {/* ── Gold rule divider ── */}
        <AnimatedGoldRule />

        {/* ── Agency logos ── */}
        <AgencyLogos />

        {/* ── Quality of ideas ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="heading-xl">Granted ensures it&apos;s the quality of your ideas that counts, not your English.</h2>
                <p className="body-lg mt-6 text-navy-light">
                  Upload any RFP or grant guidelines. Granted&apos;s AI reads the full document, identifies every required section, and coaches you through the details it needs to draft a grounded, complete proposal.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/features" variant="ghost" className="px-6">
                    Discover more features &rarr;
                  </ButtonLink>
                </div>
              </div>
              <CoachConversation />
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Use cases ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-2">
              <DocumentStack />
              <div>
                <h3 className="heading-lg">From a $100 donor appeal to a $1 million NIH R01 grant.</h3>
                <ul className="body-lg mt-6 space-y-2.5 list-disc pl-6 text-navy-light">
                  <li>Upload any RFP and let the AI identify every required section and evaluation criterion.</li>
                  <li>An AI grant coach asks targeted questions to ground every paragraph in your real data.</li>
                  <li>Section-by-section drafting for federal grants including NIH, NSF, EPA, USDA, and DARPA.</li>
                  <li>Real-time coverage tracking so you never miss a requirement.</li>
                  <li>Purpose-built for grant writing &mdash; not a general-purpose chatbot with a prompt.</li>
                  <li>Improve how you explain your work with specialized AI feedback.</li>
                </ul>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Who is this for? ── */}
        <AudienceSection />

        {/* ── Yellow banner CTA ── */}
        <section>
          <Container className="py-16 md:py-20">
            <RevealOnScroll>
              <div className="banner-yellow rounded-[32px] px-10 py-16 text-center md:px-16 md:py-20">
                <h3 className="heading-lg text-navy">
                  Let us write your next draft,
                  <br className="hidden md:block" />
                  no strings attached.
                </h3>
                <p className="body-lg mx-auto mt-6 max-w-2xl text-navy/70">
                  See what Granted can do for you in just a few minutes and leave with the content you need.
                </p>
                <div className="mt-8">
                  <CheckoutButton label="Start a 7-day free trial" />
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── 3 Steps ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-36">
            <RevealOnScroll>
              <h2 className="heading-lg text-center">3 Steps To Your Fastest Funding Ever</h2>
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

        {/* ── Pilot CTA ── */}
        <section className="bg-cream-dark">
          <Container className="py-20 md:py-28 text-center">
            <RevealOnScroll>
              <h2 className="heading-lg mb-6">Join 50+ grant writers testing Granted</h2>
              <p className="body-lg text-navy-light max-w-2xl mx-auto">
                We&apos;re building Granted with real feedback from researchers, nonprofits, and community organizations. Try it free and tell us what you think.
              </p>
              <div className="mt-8">
                <CheckoutButton label="Start your free trial" />
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">Ready to Get Granted?</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Save time. Stop frustration. Get inspired. Start your free trial today.
            </p>
            <div className="mt-10">
              <CheckoutButton label="Start Writing" />
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}
