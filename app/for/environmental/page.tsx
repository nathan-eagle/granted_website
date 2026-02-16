import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Environmental & Climate Grants — AI Grant Writing for Green Organizations',
  description:
    'Find EPA, NOAA, DOE clean energy, and environmental justice grants. Granted helps climate and environmental organizations discover funding and draft winning proposals.',
  alternates: { canonical: 'https://grantedai.com/for/environmental' },
}

const painPoints = [
  {
    icon: '\u{1F30D}',
    title: 'Unprecedented funding, impossible to navigate',
    body: 'The Inflation Reduction Act, Bipartisan Infrastructure Law, and EPA environmental justice programs have created billions in new funding. But the opportunities are scattered across dozens of agencies and programs.',
  },
  {
    icon: '\u{23F3}',
    title: 'Short windows for massive applications',
    body: 'EPA and DOE competitive grants often have 60-day application windows for proposals that require environmental assessments, community engagement plans, and detailed technical designs.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Data-heavy proposals with strict requirements',
    body: 'Environmental grants require baseline data, monitoring plans, measurable outcomes, and compliance with NEPA, EJ screening tools, and community benefit plans. Missing one requirement can disqualify your application.',
  },
  {
    icon: '\u{1F91D}',
    title: 'Community engagement documentation',
    body: 'EJ and climate grants increasingly require evidence of meaningful community engagement. Documenting partnerships, input sessions, and community-driven priorities adds weeks of work.',
  },
]

const features = [
  {
    title: 'EPA, NOAA, DOE & climate-focused grants',
    body: 'Granted covers Environmental Justice Collaborative Problem-Solving, Clean Energy grants, NOAA coastal programs, DOE weatherization, and state environmental agency funding \u2014 all searchable in one place.',
  },
  {
    title: 'IRA and BIL funding tracker',
    body: 'Billions from the Inflation Reduction Act and Bipartisan Infrastructure Law are flowing through new programs. Granted\u2019s daily-updated database tracks these opportunities as agencies release them.',
  },
  {
    title: 'Environmental justice screening support',
    body: 'Many climate grants require EJScreen or CEJST data. Granted\u2019s AI coach helps you articulate how your project serves disadvantaged communities using the language reviewers expect.',
  },
  {
    title: 'Technical narrative drafting',
    body: 'From monitoring plans to greenhouse gas reduction estimates, Granted helps you draft the technical sections that make environmental proposals credible and fundable.',
  },
]

const fundingAreas = [
  { name: 'Environmental Justice', agencies: 'EPA EJCPS, EJ Government-to-Government, CPRG', icon: '\u{2696}\u{FE0F}' },
  { name: 'Clean Energy', agencies: 'DOE, IRA tax credits, state energy offices', icon: '\u{26A1}' },
  { name: 'Coastal & Marine', agencies: 'NOAA Sea Grant, NERRS, coastal resilience', icon: '\u{1F30A}' },
  { name: 'Conservation', agencies: 'USDA NRCS, USFWS, state wildlife agencies', icon: '\u{1F333}' },
  { name: 'Water Infrastructure', agencies: 'EPA SRF, BIL water programs, state revolving funds', icon: '\u{1F4A7}' },
  { name: 'Climate Resilience', agencies: 'FEMA BRIC, HUD CDBG-DR, NOAA climate adaptation', icon: '\u{1F321}\u{FE0F}' },
]

export default function EnvironmentalPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                For Environmental &amp; Climate Organizations
              </p>
              <h1 className="heading-xl">
                Billions in climate funding. One search to find it.
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                The IRA, BIL, and EPA environmental justice programs have created the largest climate funding moment in history. Granted helps you find and win it.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CheckoutButton label="Find Environmental Grants Free" />
                <ButtonLink
                  href="/grants"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  Search all grants &rarr;
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-white/40">
                Free grant search. AI drafting from $29/month. Not a ChatGPT wrapper.
              </p>
            </div>
          </Container>
        </section>

        {/* Pain points */}
        <section className="section-angle-top bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                The challenge
              </p>
              <h2 className="heading-lg text-center max-w-2xl mx-auto">
                More climate funding than ever &mdash; and more competition to win it
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

        {/* Funding areas */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                Funding landscape
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                Search across every environmental funding stream at once
              </h2>
              <p className="body-lg text-center text-navy-light mt-4 max-w-2xl mx-auto">
                Granted indexes 76,000+ grants across 12 federal sources, plus real-time AI search that crawls agency websites for opportunities other tools miss.
              </p>
            </RevealOnScroll>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fundingAreas.map((item, i) => (
                <RevealOnScroll key={item.name} delay={i * 80}>
                  <div className="card p-7 h-full">
                    <span className="text-2xl" aria-hidden>{item.icon}</span>
                    <h3 className="text-lg font-semibold tracking-tight mt-3">{item.name}</h3>
                    <p className="text-sm mt-2 text-navy-light">{item.agencies}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* Features */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4 text-center">
                Built for environmental proposals
              </p>
              <h2 className="heading-lg text-white text-center max-w-3xl mx-auto">
                From EJScreen data to technical narratives &mdash; AI coaching that speaks your language
              </h2>
            </RevealOnScroll>
            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              {features.map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 100}>
                  <div className="border-l-4 border-brand-yellow pl-6">
                    <h3 className="text-xl font-semibold tracking-tight text-white">{item.title}</h3>
                    <p className="body-lg mt-3 text-white/60">{item.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>

        {/* Blog resources */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                From the blog
              </p>
              <h2 className="heading-lg text-center">Environmental grant writing resources</h2>
            </RevealOnScroll>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <RevealOnScroll delay={0}>
                <a href="/blog/epa-environmental-justice-grants-2026-what-nonprofits-need-to-know" className="card card-hover block p-8 h-full">
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">EPA</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">EPA Environmental Justice Grants: What You Need to Know</h3>
                  <p className="body-sm mt-3 text-navy-light">A breakdown of EPA EJ funding opportunities and how to position your organization.</p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <a href="/blog/noaa-coastal-marine-grants-researchers-guide-2026" className="card card-hover block p-8 h-full">
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">NOAA</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">NOAA Coastal and Marine Grants: A Guide for 2026</h3>
                  <p className="body-sm mt-3 text-navy-light">Navigate NOAA funding programs for coastal resilience, marine research, and climate adaptation.</p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <a href="/blog/how-to-apply-for-usda-reap-grants" className="card card-hover block p-8 h-full">
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">USDA</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">USDA REAP Grants: Eligibility and Application Tips</h3>
                  <p className="body-sm mt-3 text-navy-light">How to apply for Rural Energy for America Program grants for renewable energy projects.</p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">The funding is there. Go get it.</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Search environmental and climate grants for free. Draft proposals with AI coaching that understands EPA, DOE, and NOAA requirements.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Find Environmental Grants Free" />
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
