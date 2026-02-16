import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'First-Time Federal Grant Applicants — Step-by-Step AI Coaching',
  description:
    'Never written a federal grant before? Granted walks you through every section with AI coaching. Search 76,000+ grants, then draft your first proposal with confidence.',
  alternates: { canonical: 'https://grantedai.com/for/first-time' },
}

const painPoints = [
  {
    icon: '\u{1F4DA}',
    title: 'Federal NOFOs are 80+ pages of dense requirements',
    body: 'Your first time reading a Notice of Funding Opportunity feels like translating a foreign language. Evaluation criteria, cost principles, assurances, certifications \u2014 it is overwhelming by design.',
  },
  {
    icon: '\u{1F6AB}',
    title: 'No mentor, no grants office, no template',
    body: 'Large universities have entire departments dedicated to grant writing. If you are at a smaller org or working independently, you are starting from zero with no institutional knowledge to draw on.',
  },
  {
    icon: '\u{1F4B0}',
    title: 'Hiring a consultant costs more than the grant',
    body: 'Professional grant writers charge $5,000\u201315,000 per proposal. For a first-time applicant seeking a $25K planning grant, that math does not work.',
  },
  {
    icon: '\u{2753}',
    title: 'You do not know what you do not know',
    body: 'SAM.gov registration, indirect cost rates, logic models, DUNS numbers \u2014 the administrative prerequisites alone can derail an application before you write a single word.',
  },
]

const features = [
  {
    title: 'Upload any RFP \u2014 Granted reads it for you',
    body: 'Upload your NOFO, FOA, or grant guidelines. Granted reads the full document, identifies every required section and evaluation criterion, and builds a step-by-step drafting plan.',
  },
  {
    title: 'AI coaching that asks the right questions',
    body: 'Instead of staring at a blank page, Granted\u2019s grant writing coach asks you targeted questions about your organization, project, and community. Your answers become grounded proposal text.',
  },
  {
    title: 'Coverage tracking \u2014 nothing missed',
    body: 'Real-time tracking maps every requirement from the solicitation and shows which you have addressed and which still need attention. Submit knowing you covered everything.',
  },
  {
    title: 'From Grants.gov to foundation LOIs',
    body: 'Whether it is a federal grant on Grants.gov, a state program, or a foundation letter of inquiry, Granted adapts to the format and requirements of each opportunity.',
  },
]

const steps = [
  { step: '1', title: 'Search for grants', body: 'Describe your project and organization. Granted searches 76,000+ grants across 12 federal sources plus real-time AI web search to find your best-fit opportunities.' },
  { step: '2', title: 'Upload your RFP', body: 'Found a grant? Upload the solicitation. Granted reads it and maps every section, requirement, and evaluation criterion.' },
  { step: '3', title: 'Answer coaching questions', body: 'The AI coach asks about your mission, project design, team, and budget. No grant writing jargon \u2014 just questions you can answer.' },
  { step: '4', title: 'Review your draft', body: 'Granted generates a complete section-by-section draft grounded in your real data. Edit, refine, and export to DOCX.' },
]

export default function FirstTimePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                For First-Time Applicants
              </p>
              <h1 className="heading-xl">
                Never written a federal grant? Start here.
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                Granted walks you through every section of your first proposal with AI coaching. No grants department required. No prior experience needed.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CheckoutButton label="Draft Your First Grant Free" />
                <ButtonLink
                  href="/grants"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  Search grants free &rarr;
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-white/40">
                Other grant platforms charge $300&ndash;$900/month. Granted starts at $29.
              </p>
            </div>
          </Container>
        </section>

        {/* Pain points */}
        <section className="section-angle-top bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                The first-timer problem
              </p>
              <h2 className="heading-lg text-center max-w-2xl mx-auto">
                The grant system was not designed for newcomers
              </h2>
              <p className="body-lg text-center text-navy-light mt-4 max-w-2xl mx-auto">
                Federal grants fund transformative work. But the application process assumes you already know how to apply. We built Granted to close that gap.
              </p>
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

        {/* How it works — step by step */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                How it works
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                From &ldquo;where do I start?&rdquo; to a complete draft in four steps
              </h2>
            </RevealOnScroll>
            <div className="mt-14 max-w-2xl mx-auto space-y-10">
              {steps.map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 100}>
                  <div className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow font-bold text-lg">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                      <p className="body-lg mt-2 text-navy-light">{item.body}</p>
                    </div>
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
                Built for beginners, powered by serious tech
              </p>
              <h2 className="heading-lg text-white text-center max-w-3xl mx-auto">
                The same AI that powers expert grant writers &mdash; designed for your first proposal
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
              <h2 className="heading-lg text-center">Resources for first-time applicants</h2>
            </RevealOnScroll>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <RevealOnScroll delay={0}>
                <a href="/blog/federal-grants-for-first-time-applicants" className="card card-hover block p-8 h-full">
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Guide</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">Federal Grants for First-Time Applicants</h3>
                  <p className="body-sm mt-3 text-navy-light">A step-by-step guide to navigating your first federal grant application.</p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <a href="/blog/federal-grants-for-nonprofits-in-2026" className="card card-hover block p-8 h-full">
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">2026</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">Federal Grants for Nonprofits in 2026</h3>
                  <p className="body-sm mt-3 text-navy-light">The complete guide to federal grant opportunities for nonprofits this year.</p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <a href="/blog/first-time-federal-grant-tips-small-nonprofits" className="card card-hover block p-8 h-full">
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Tips</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">First-Time Federal Grant Tips for Small Nonprofits</h3>
                  <p className="body-sm mt-3 text-navy-light">Practical strategies for small teams submitting their first federal application.</p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">Everyone starts somewhere. Start here.</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Search grants for free. Draft your first proposal with AI coaching. No experience required.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Draft Your First Grant Free" />
              <ButtonLink
                href="/grants"
                variant="ghost"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                Search grants &rarr;
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
