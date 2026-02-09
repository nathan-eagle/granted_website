import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import AgencyLogos from '@/components/AgencyLogos'
import AudienceSection from '@/components/AudienceSection'
import CoachConversationC from '@/components/CoachConversationC'
import AnimatedGoldRule from '@/components/AnimatedGoldRule'
import RevealOnScroll from '@/components/RevealOnScroll'
import HeroAnimationCombined from '@/components/hero-concepts/HeroAnimationCombined'
import HeroSearchBar from '@/components/HeroSearchBar'
import HowGrantedWorks from '@/components/HowGrantedWorks'
import TrendingGrants from '@/components/TrendingGrants'
import EmailCapture from '@/components/EmailCapture'
import { StatsCounter, Testimonials, OrgLogos } from '@/components/SocialProof'
import { getActiveGrants } from '@/lib/grants'

export const revalidate = 86400

export const metadata: Metadata = {
  alternates: { canonical: 'https://grantedai.com' },
}

const homeBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://grantedai.com' },
  ],
}

const softwareAppLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Granted AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://grantedai.com',
  description: 'Search thousands of federal grants, find matching opportunities, and draft proposals with AI. Free grant finder for nonprofits, researchers, and small businesses.',
  offers: {
    '@type': 'Offer',
    price: '29',
    priceCurrency: 'USD',
    priceValidUntil: '2026-12-31',
  },
}

export default async function HomePage() {
  const trendingGrants = await getActiveGrants(8)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }} />
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
                  Grant Discovery + AI Writing
                </p>
                <h1 className="heading-display">
                  Find the right funding. Apply with confidence.
                </h1>
                <p className="body-lg mt-6 text-white/70 max-w-xl">
                  Search thousands of grants, discover the best fit for your organization,
                  and draft a complete proposal with an AI writing coach &mdash; all in one place.
                </p>
                <HeroSearchBar />
                <p className="mt-6 text-sm text-white/40">
                  7-day free trial. Your data is never used to train AI.{' '}
                  <a href="/security" className="underline hover:text-white/60">Security details &rarr;</a>
                </p>
              </div>

              {/* Right: animated discovery illustration */}
              <div className="hidden lg:block">
                <HeroAnimationCombined />
              </div>
            </div>

            {/* Centered search bar below hero */}
            <div className="mt-12 relative z-10">
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 md:px-5">
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <input
                    type="text"
                    readOnly
                    value="Search grants by topic, agency, or keyword..."
                    className="w-full rounded-full border border-white/15 bg-[#0b1c38] px-5 py-3.5 text-sm text-white/75 outline-none"
                  />
                  <a
                    href="/find-grants"
                    className="shrink-0 rounded-full bg-brand-yellow px-7 py-3.5 text-sm font-semibold text-navy text-center"
                  >
                    Search Grants
                  </a>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {['Community Nonprofit', 'Research Lab', 'Tribal College', 'Rural Health', 'Education Program'].map((chip) => (
                    <span key={chip} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                      {chip}
                    </span>
                  ))}
                </div>
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

        {/* ── How Granted Works (Discover → Draft → Win) ── */}
        <HowGrantedWorks />

        {/* ── Trending Grants ── */}
        <TrendingGrants grants={trendingGrants} />

        {/* ── Stats counter ── */}
        <StatsCounter />

        {/* ── Quality / Coach section ── */}
        <section>
          <Container className="py-20 md:py-24">
            <RevealOnScroll className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4">
                  From donor appeals to federal grants
                </p>
                <h2 className="heading-xl text-navy">AI drafting that grounds every paragraph in your real data</h2>
                <p className="body-lg mt-6 text-navy-light">
                  Upload any RFP or grant guidelines. Granted&apos;s AI reads the full document, identifies every required section, and coaches you through the details it needs to draft a grounded, complete proposal.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/tech" variant="primary" className="cta-shimmer">
                    See All 50+ Writing Models &rarr;
                  </ButtonLink>
                </div>
              </div>
              <CoachConversationC />
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Who is this for? ── */}
        <AudienceSection />

        {/* ── Testimonials ── */}
        <Testimonials />

        {/* ── Email capture ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-16 md:py-20">
            <RevealOnScroll className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Stay in the loop
              </p>
              <h2 className="heading-lg text-white">Not ready to start? No pressure.</h2>
              <p className="body-lg mt-4 text-white/70 max-w-xl mx-auto">
                Get free grant writing tips, deadline alerts, and strategy guides every week.
              </p>
              <div className="mt-8 relative">
                <EmailCapture />
              </div>
              <p className="mt-4 text-xs text-white/30">
                Join 500+ grant writers. No spam, unsubscribe anytime.
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Equity section ── */}
        <section>
          <Container className="py-20 md:py-24">
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
            <h3 className="heading-lg text-white">Find your next grant in 30 seconds.</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/70">
              Join thousands of researchers, nonprofits, and community organizations
              discovering grants and drafting stronger proposals with Granted.
            </p>
            <div className="mt-10">
              <ButtonLink href="/find-grants" className="button button-primary cta-shimmer">
                Search Grants &rarr;
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}
