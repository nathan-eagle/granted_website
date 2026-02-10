import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'AI SBIR Proposal Writer — Phase I & Phase II Drafting Tool',
  description:
    'Find high-fit SBIR opportunities in the world\'s largest grants and funders database, then draft Phase I and Phase II proposals faster with Granted AI.',
  alternates: { canonical: 'https://grantedai.com/for/sbir' },
}

const painPoints = [
  {
    icon: '\u{1F3E2}',
    title: 'Startups don\u2019t have grant departments',
    body: 'Your founding team is building product, talking to customers, and fundraising. Nobody was hired to write 25-page government proposals.',
  },
  {
    icon: '\u{1F4C8}',
    title: 'Commercialization plan is the hardest section',
    body: 'Reviewers want a credible path to market. Most technical founders struggle to translate their innovation into the business language agencies expect.',
  },
  {
    icon: '\u{1F500}',
    title: 'Different agencies, different SBIR formats',
    body: 'DOD, NIH, NSF, DOE, and USDA all run SBIR programs with different structures, page limits, and evaluation criteria. One template does not fit all.',
  },
  {
    icon: '\u{1F680}',
    title: 'Phase II transition requires a strong Phase I',
    body: 'A weak Phase I proposal does not just lose funding &mdash; it closes the door on the larger Phase II award that could scale your technology.',
  },
]

const features = [
  {
    title: 'DOD, NIH, NSF, DOE & USDA SBIR topics',
    body: 'Upload your specific BAA topic or solicitation. Granted reads the full document and builds a section-by-section drafting plan matched to that agency\u2019s SBIR requirements.',
  },
  {
    title: 'Commercialization coaching',
    body: 'Granted\u2019s AI coach asks targeted questions about your market, competitors, IP strategy, and go-to-market plan. Your commercialization section is grounded in real business details, not boilerplate.',
  },
  {
    title: 'Technical approach drafting',
    body: 'From objectives and milestones to methodology and anticipated results, Granted helps you articulate your technical plan in the structured format reviewers expect.',
  },
  {
    title: 'Real-time requirement coverage',
    body: 'SBIR solicitations are dense with requirements. Granted tracks every evaluation criterion and flags gaps before you submit.',
  },
]

const speedStats = [
  { value: '3\u20135 days', label: 'Average time to a complete Phase I draft' },
  { value: '85%', label: 'Less writing time vs. starting from scratch' },
  { value: 'Unlimited', label: 'Proposals per month for $29' },
]

export default function SbirPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                For SBIR Applicants
              </p>
              <h1 className="heading-xl">
                AI SBIR proposal writer &mdash; Phase I drafts in days, not months
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                Find the right SBIR topics in the world&apos;s largest grants + funders database,
                then draft every required section with commercialization and technical coaching.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CheckoutButton label="Draft Your SBIR Proposal Free" />
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
                The SBIR challenge
              </p>
              <h2 className="heading-lg text-center max-w-2xl mx-auto">
                Non-dilutive funding is worth the effort &mdash; but the effort is real
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
                Purpose-built for SBIR
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                Every agency. Every section. One tool.
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

        {/* ── Speed advantage ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Speed matters
              </p>
              <h2 className="heading-lg text-white">
                Move fast, win funding, stay focused on building
              </h2>
              <p className="body-lg mt-4 text-white/60 max-w-2xl mx-auto">
                SBIR deadlines do not wait for your product roadmap. Granted compresses weeks of
                proposal writing into days so your team can stay focused on what matters &mdash;
                building technology.
              </p>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {speedStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-8"
                  >
                    <p className="text-3xl font-display font-normal text-brand-yellow">{stat.value}</p>
                    <p className="body-sm mt-3 text-white/50">{stat.label}</p>
                  </div>
                ))}
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
              <h2 className="heading-lg text-center">SBIR proposal writing resources</h2>
            </RevealOnScroll>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <RevealOnScroll delay={0}>
                <a
                  href="/blog/tips-for-writing-a-successful-sbir-proposal"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Guide</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    Tips for Writing a Successful SBIR Proposal
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    Proven strategies from funded applicants on structuring a competitive SBIR submission.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <a
                  href="/blog/commercialization-strategy-crafting-a-winning-plan-for-your-nih-sbir-grant-application"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Strategy</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    Crafting a Winning Commercialization Plan for NIH SBIR
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    How to build a commercialization strategy that satisfies reviewers and maps your path to market.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <a
                  href="/blog/from-phase-i-to-phase-ii-a-guide-to-advancing-your-nih-sbir-research-and-development-efforts"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">NIH SBIR</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    From Phase I to Phase II: Advancing Your NIH SBIR R&amp;D
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    What it takes to transition from a funded Phase I into a competitive Phase II application.
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
            <h3 className="heading-lg text-white">Win non-dilutive funding for your startup</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Move from opportunity search to submission-ready SBIR proposals
              without switching tools.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Draft Your SBIR Proposal Free" />
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
