import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'AI Grant Writing for Nonprofits — Draft Proposals in Hours',
  description:
    'Granted AI is the grant writing tool built for nonprofits. Upload your RFP, get coached through every section, and draft federal and foundation proposals in hours instead of weeks.',
  alternates: { canonical: 'https://grantedai.com/for/nonprofits' },
}

const painPoints = [
  {
    icon: '\u{1F9E9}',
    title: 'Small teams wearing multiple hats',
    body: 'Your program director is also the grant writer, event planner, and data manager. There is never enough time to write a thorough proposal.',
  },
  {
    icon: '\u{1F4B8}',
    title: 'Can\u2019t afford a $5k\u201315k grant writer',
    body: 'Professional grant consultants charge thousands per proposal. For a 10-person nonprofit, that is your entire discretionary budget.',
  },
  {
    icon: '\u{1F4CB}',
    title: 'Missed requirements in long RFPs',
    body: 'Federal NOFOs run 80+ pages. One missed evaluation criterion or formatting rule can sink your entire application.',
  },
  {
    icon: '\u{1F4C9}',
    title: 'Inconsistent proposal quality',
    body: 'Without a dedicated grants office, every proposal reads differently. Reviewers notice when your narrative does not match your budget justification.',
  },
]

const features = [
  {
    title: 'EPA, USDA, HUD & community development grants',
    body: 'Purpose-built support for the federal agencies that fund community and nonprofit work. Granted understands EJCPS, Community Facilities, CDBG, and more.',
  },
  {
    title: 'RFP upload and intelligent analysis',
    body: 'Upload your NOFO or RFP. Granted reads the full document, identifies every required section and evaluation criterion, and builds a drafting plan around your application.',
  },
  {
    title: 'AI coaching grounded in your mission',
    body: 'A grant writing coach asks targeted questions about your organization, community, and project. Every paragraph in your draft is grounded in real details, not generic filler.',
  },
  {
    title: 'Real-time coverage tracking',
    body: 'Watch your proposal come together section by section. Granted tracks which RFP requirements you have addressed and which still need attention.',
  },
]

export default function NonprofitsPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                For Nonprofits
              </p>
              <h1 className="heading-xl">
                AI grant writing for nonprofits &mdash; stop losing to bigger budgets
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                Your mission matters more than your grant writing budget. Granted AI coaches you
                through every section &mdash; from needs statements to evaluation plans.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CheckoutButton label="Draft Your First Nonprofit Grant" />
                <ButtonLink
                  href="/features"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  See all features &rarr;
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Pain points ── */}
        <section className="section-angle-top bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                The nonprofit grant writing struggle
              </p>
              <h2 className="heading-lg text-center max-w-2xl mx-auto">
                Sound familiar? You are not alone.
              </h2>
            </RevealOnScroll>
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {painPoints.map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 100}>
                  <div className="card p-8 h-full">
                    <span className="text-3xl" aria-hidden>{item.icon}</span>
                    <h3 className="heading-md mt-4 text-lg">{item.title}</h3>
                    <p className="body-lg mt-3 text-navy-light">{item.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Feature highlights ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                How Granted helps
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                From NOFO to polished draft &mdash; built for community-focused grants
              </h2>
            </RevealOnScroll>
            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              {features.map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 100}>
                  <div className="border-l-4 border-brand-yellow pl-6">
                    <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="body-lg mt-3 text-navy-light">{item.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Cost comparison ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                The math
              </p>
              <h2 className="heading-lg text-white">
                A professional grant writer charges $5,000&ndash;$15,000 per proposal. Granted costs $29/month.
              </h2>
              <p className="body-lg mt-6 text-white/60">
                That is one subscription for unlimited drafts &mdash; federal proposals, foundation
                letters of inquiry, community development applications, and more. Every dollar you
                save on writing goes back to your mission.
              </p>
              <div className="mt-12 grid gap-6 md:grid-cols-3 text-center">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-8">
                  <p className="text-4xl font-display font-normal text-brand-yellow">$5k+</p>
                  <p className="body-sm mt-2 text-white/50">Per proposal with a consultant</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-8">
                  <p className="text-4xl font-display font-normal text-brand-yellow">40+ hrs</p>
                  <p className="body-sm mt-2 text-white/50">Writing time for a single federal grant</p>
                </div>
                <div className="rounded-[24px] border border-brand-yellow/40 bg-brand-yellow/10 p-8">
                  <p className="text-4xl font-display font-normal text-brand-yellow">$29/mo</p>
                  <p className="body-sm mt-2 text-white/70">Unlimited drafts with Granted</p>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Related blog posts ── */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                From the blog
              </p>
              <h2 className="heading-lg text-center">Nonprofit grant writing resources</h2>
            </RevealOnScroll>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <RevealOnScroll delay={0}>
                <a
                  href="/blog/first-time-federal-grant-tips-small-nonprofits"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Guide</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    First-Time Federal Grant Tips for Small Nonprofits
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    Everything you need to know before submitting your first federal application.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <a
                  href="/blog/epa-environmental-justice-grants-2026-what-nonprofits-need-to-know"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">EPA</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    EPA Environmental Justice Grants: What Nonprofits Need to Know
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    A breakdown of EPA EJ funding opportunities and how to position your organization.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <a
                  href="/blog/how-to-apply-for-usda-community-facilities-grants"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">USDA</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    How to Apply for USDA Community Facilities Grants
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    Step-by-step guidance on USDA Community Facilities applications for rural nonprofits.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">Your mission deserves funded proposals</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Join hundreds of nonprofits using Granted to draft stronger applications,
              win more funding, and spend less time writing.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Draft Your First Nonprofit Grant" />
              <ButtonLink
                href="/contact"
                variant="ghost"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                Talk to sales
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
