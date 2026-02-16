import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Grants for K-12 Schools & Districts — AI Grant Writing for Education',
  description:
    'Find Title I, ESSER, ED.gov, and state education grants. Granted helps K-12 schools and districts discover funding and draft stronger proposals with AI coaching.',
  alternates: { canonical: 'https://grantedai.com/for/k12' },
}

const painPoints = [
  {
    icon: '\u{1F3EB}',
    title: 'Teachers writing grants at 10pm',
    body: 'Most school districts do not have a dedicated grants office. The burden falls on principals, curriculum coordinators, and teachers who are already stretched thin.',
  },
  {
    icon: '\u{1F4C4}',
    title: 'ESSER is ending \u2014 what replaces it?',
    body: 'Pandemic-era ESSER funds are expiring. Districts need to find alternative federal and state funding to sustain programs they built over the past three years.',
  },
  {
    icon: '\u{1F50D}',
    title: 'Thousands of education grants, no way to search them',
    body: 'Title I, Title II, Title IV, IDEA, 21st Century Community Learning Centers, state-level programs \u2014 the funding landscape is fragmented and hard to navigate.',
  },
  {
    icon: '\u{23F0}',
    title: 'Short deadlines, long applications',
    body: 'State education grants often have 30-day windows with 50-page applications. Between running a school and writing a grant, something always gets missed.',
  },
]

const features = [
  {
    title: 'Title I, IDEA, and ED.gov programs',
    body: 'Granted understands the structure of Department of Education grant applications. Upload your NOFO and get section-by-section drafting support tailored to education-specific requirements.',
  },
  {
    title: 'State education grant discovery',
    body: 'Search across federal and state education funding in one place. Granted\u2019s AI crawls all 50 state education agency websites to surface opportunities other tools miss.',
  },
  {
    title: 'Logic models and needs assessments',
    body: 'Education grants require data-driven needs assessments and logic models. Granted\u2019s AI coach asks targeted questions about your student population, achievement data, and intervention design.',
  },
  {
    title: 'Budget narratives that pass review',
    body: 'Education grant budgets have specific allowable cost rules. Granted helps you build budget justifications that align with federal cost principles and your district\u2019s indirect cost rate.',
  },
]

const fundingTypes = [
  { name: 'Title I Part A', desc: 'Improving education for disadvantaged students' },
  { name: 'Title II Part A', desc: 'Teacher and principal training and recruitment' },
  { name: 'Title IV Part A', desc: 'Student support and academic enrichment' },
  { name: 'IDEA Part B', desc: 'Special education and related services' },
  { name: '21st CCLC', desc: 'After-school and summer learning programs' },
  { name: 'Perkins V', desc: 'Career and technical education' },
  { name: 'ESSER/ARP', desc: 'Pandemic recovery (final obligation deadlines)' },
  { name: 'State SEA Grants', desc: 'State-specific education agency programs' },
]

export default function K12Page() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                For K-12 Schools &amp; Districts
              </p>
              <h1 className="heading-xl">
                Your students deserve funded programs &mdash; not unfunded proposals
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                Search federal and state education grants, then draft stronger proposals with AI coaching. Built for the educators who write grants after the school day ends.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CheckoutButton label="Find Education Grants Free" />
                <ButtonLink
                  href="/grants"
                  variant="ghost"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  Search all grants &rarr;
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-white/40">
                Free grant search. AI drafting from $29/month. No grants department required.
              </p>
            </div>
          </Container>
        </section>

        {/* Pain points */}
        <section className="section-angle-top bg-cream-dark">
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                The K-12 grant writing challenge
              </p>
              <h2 className="heading-lg text-center max-w-2xl mx-auto">
                Schools leave billions in grant funding on the table every year
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

        {/* Funding types */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4 text-center">
                Education funding landscape
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                One search across every education funding stream
              </h2>
              <p className="body-lg text-center text-navy-light mt-4 max-w-2xl mx-auto">
                Granted indexes 76,000+ grants from 12 federal sources plus state education agencies. Search them all at once.
              </p>
            </RevealOnScroll>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {fundingTypes.map((item, i) => (
                <RevealOnScroll key={item.name} delay={i * 60}>
                  <div className="card p-6 h-full text-center">
                    <h3 className="text-lg font-semibold tracking-tight text-navy">{item.name}</h3>
                    <p className="text-sm mt-2 text-navy-light">{item.desc}</p>
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
                Built for education grants
              </p>
              <h2 className="heading-lg text-white text-center max-w-3xl mx-auto">
                From Title I to state programs &mdash; AI coaching that understands education funding
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

        {/* Cost comparison */}
        <section>
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4">
                The math for schools
              </p>
              <h2 className="heading-lg">
                A grant consultant charges $5,000+ per application. Granted costs $29/month.
              </h2>
              <p className="body-lg mt-6 text-navy-light">
                That is one subscription for unlimited proposals &mdash; Title I, IDEA, state programs, foundation grants, and more. Every dollar saved on writing goes back to your classrooms.
              </p>
              <div className="mt-12 grid gap-6 md:grid-cols-3 text-center">
                <div className="card p-8">
                  <p className="text-4xl font-display font-normal text-brand-yellow">$5k+</p>
                  <p className="body-sm mt-2 text-navy-light">Per proposal with a consultant</p>
                </div>
                <div className="card p-8">
                  <p className="text-4xl font-display font-normal text-brand-yellow">40+ hrs</p>
                  <p className="body-sm mt-2 text-navy-light">Writing time for a single federal grant</p>
                </div>
                <div className="rounded-[24px] border-2 border-brand-yellow/40 bg-brand-yellow/5 p-8">
                  <p className="text-4xl font-display font-normal text-brand-yellow">$29/mo</p>
                  <p className="body-sm mt-2 text-navy-light">Unlimited drafts with Granted</p>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-24 text-center md:py-32 relative z-10">
            <h3 className="heading-lg text-white">Fund what your students need</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Search education grants for free. Draft proposals with AI coaching. No grants department required.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Find Education Grants Free" />
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
