import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'AI Grant Writing for Researchers — NIH, NSF & Federal Proposals',
  description:
    'Draft NIH R01, NSF CAREER, and federal research proposals faster with Granted AI. Upload your FOA, get coached through Specific Aims and Research Strategy, and produce a complete first draft.',
  alternates: { canonical: 'https://grantedai.com/for/researchers' },
}

const painPoints = [
  {
    icon: '\u{23F3}',
    title: 'Weeks spent writing instead of doing research',
    body: 'Every hour you spend formatting a biosketch or rewriting your significance section is an hour away from the bench, the field, or your students.',
  },
  {
    icon: '\u{1F50D}',
    title: 'Reviewer expectations are opaque',
    body: 'Study sections evaluate on criteria you have to intuit from experience. Early-career researchers rarely have mentors who can decode what reviewers actually want.',
  },
  {
    icon: '\u{1F504}',
    title: 'Resubmissions are demoralizing',
    body: 'A scored-but-not-funded application means months of revision for the next cycle. Many researchers abandon promising projects after a single rejection.',
  },
  {
    icon: '\u{1F4D0}',
    title: 'Formatting requirements change across agencies',
    body: 'NIH page limits, NSF project descriptions, DOE technical volumes &mdash; every agency has different structures, fonts, and margin rules.',
  },
]

const features = [
  {
    title: 'NIH R01, R21, K-series & fellowship support',
    body: 'Granted understands the structure of NIH applications from Specific Aims through Research Strategy. Upload your FOA and get section-by-section drafting tailored to your institute.',
  },
  {
    title: 'NSF CAREER, standard grants & collaborative proposals',
    body: 'From the project description to the data management plan, Granted coaches you through NSF-specific requirements including broader impacts and intellectual merit.',
  },
  {
    title: 'DOE, DARPA & defense research proposals',
    body: 'Technical volume drafting for mission-driven agencies. Granted reads your BAA or solicitation and structures your response around the stated evaluation criteria.',
  },
  {
    title: 'Real-time coverage tracking',
    body: 'Never wonder what you forgot. Granted maps every requirement from the solicitation and tracks your coverage as you draft each section.',
  },
]

const timeComparison = [
  { label: 'Write Specific Aims', traditional: '1\u20132 weeks', granted: '2\u20133 hours' },
  { label: 'Draft Research Strategy', traditional: '3\u20134 weeks', granted: '1\u20132 days' },
  { label: 'Budget justification', traditional: '3\u20135 days', granted: '1\u20132 hours' },
  { label: 'Facilities & equipment', traditional: '1\u20132 days', granted: '30 minutes' },
]

export default function ResearchersPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                For Researchers
              </p>
              <h1 className="heading-xl">
                AI grant writing for researchers &mdash; NIH, NSF & federal proposals
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                Upload your FOA or program solicitation. Answer coaching questions grounded in your
                science. Get a complete first draft &mdash; Specific Aims, Research Strategy, and all.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CheckoutButton label="Draft Your R01 Free" />
                <ButtonLink
                  href="/tech"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  How it works &rarr;
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
                The grant writing grind
              </p>
              <h2 className="heading-lg text-center max-w-2xl mx-auto">
                You became a scientist to do research, not to write proposals full-time
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
                Built for research proposals
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                NIH, NSF, DOE, DARPA &mdash; every section, every format
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

        {/* ── Time comparison ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="mx-auto max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4 text-center">
                Time saved
              </p>
              <h2 className="heading-lg text-white text-center">
                Weeks of writing compressed into hours
              </h2>
              <p className="body-lg mt-4 text-white/60 text-center max-w-2xl mx-auto">
                Granted does not write your proposal for you. It coaches you through each section,
                asks the right questions, and drafts grounded content you can refine &mdash; fast.
              </p>
              <div className="mt-12 overflow-hidden rounded-[24px] border border-white/10">
                <div className="grid grid-cols-3 bg-white/[0.06] px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white/50">
                  <span>Section</span>
                  <span className="text-center">Traditional</span>
                  <span className="text-center">With Granted</span>
                </div>
                {timeComparison.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-3 border-t border-white/10 px-6 py-5"
                  >
                    <span className="font-medium text-white/90">{row.label}</span>
                    <span className="text-center text-white/40">{row.traditional}</span>
                    <span className="text-center font-semibold text-brand-yellow">{row.granted}</span>
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
              <h2 className="heading-lg text-center">Resources for research grant writing</h2>
            </RevealOnScroll>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <RevealOnScroll delay={0}>
                <a
                  href="/blog/getting-your-first-r01"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">NIH</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    Getting Your First R01
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    Practical strategies for early-career investigators navigating the R01 process.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <a
                  href="/blog/the-perfect-specific-aims-page"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Strategy</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    The Perfect Specific Aims Page
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    How to structure aims that hook reviewers and anchor your entire application.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <a
                  href="/blog/what-nih-reviewers-wish-you-knew"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Insights</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    What NIH Reviewers Wish You Knew
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    Common mistakes and missed opportunities from the perspective of study section reviewers.
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
            <h3 className="heading-lg text-white">Get back to your research</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Join thousands of researchers drafting stronger NIH, NSF, and federal proposals
              with Granted &mdash; and spending less time at the keyboard.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Draft Your R01 Free" />
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
