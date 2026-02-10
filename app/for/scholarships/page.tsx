import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import CheckoutButton from '@/components/CheckoutButton'
import { ButtonLink } from '@/components/ButtonLink'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'AI Scholarship & Fellowship Application Writer',
  description:
    'Find scholarships and fellowships in the world\'s largest grants and funders database, then write stronger applications with Granted AI coaching.',
  alternates: { canonical: 'https://grantedai.com/for/scholarships' },
}

const painPoints = [
  {
    icon: '\u{270D}\uFE0F',
    title: 'Personal statements are hard to start',
    body: 'Writing about yourself is the most difficult kind of writing. Most applicants stare at a blank page for days before producing a first draft they do not like.',
  },
  {
    icon: '\u{1F4D1}',
    title: 'Every scholarship has different requirements',
    body: 'One wants a research proposal. Another wants a personal essay. A third wants a statement of purpose. Each application feels like starting from zero.',
  },
  {
    icon: '\u{1F6AB}',
    title: 'No feedback until rejection',
    body: 'Most scholarship committees never share reviewer comments. You submit, you wait months, and you find out you were not selected with no explanation.',
  },
  {
    icon: '\u{1F393}',
    title: 'Limited support for first-gen applicants',
    body: 'Students without family experience in academia or access to writing centers face a structural disadvantage. The application process rewards polish, not just potential.',
  },
]

const features = [
  {
    title: 'NSF GRFP & graduate fellowships',
    body: 'Granted coaches you through the research plan, personal statement, and broader impacts sections that define competitive GRFP applications.',
  },
  {
    title: 'NIH F31, F32 & training grants',
    body: 'From specific aims to the training plan and sponsor statement, Granted understands the structure of NIH fellowship applications and guides you section by section.',
  },
  {
    title: 'Fulbright, Rhodes & international fellowships',
    body: 'Statement of grant purpose, personal statement, and affiliation letters &mdash; Granted helps you articulate your goals and qualifications for competitive international awards.',
  },
  {
    title: 'Institutional scholarships & personal statements',
    body: 'Whether it is a university merit award, a diversity scholarship, or a departmental fellowship, Granted coaches you through essays that communicate your story with clarity and impact.',
  },
]

const accessPoints = [
  {
    title: 'No writing center appointment needed',
    body: 'Granted is available 24/7. Get coaching at midnight the week before a deadline, not whenever the writing center has an opening.',
  },
  {
    title: 'Guidance regardless of background',
    body: 'First-generation students, international applicants, and career changers get the same structured coaching that students at well-resourced institutions take for granted.',
  },
  {
    title: 'Affordable for students',
    body: 'At $29/month, Granted costs less than a single hour with a private admissions consultant. Use it for every application in a cycle, then cancel.',
  },
]

export default function ScholarshipsPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-28 md:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                For Scholarship &amp; Fellowship Applicants
              </p>
              <h1 className="heading-xl">
                AI scholarship &amp; fellowship writer &mdash; applications that stand out
              </h1>
              <p className="body-lg mt-6 text-white/70 max-w-2xl mx-auto">
                Discover fellowships and scholarships in the world&apos;s largest grants + funders
                database, then draft personal statements, research proposals, and impact essays with AI coaching.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CheckoutButton label="Start Your Application Free" />
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
                The application struggle
              </p>
              <h2 className="heading-lg text-center max-w-2xl mx-auto">
                Talent should not lose to polish
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
                What Granted supports
              </p>
              <h2 className="heading-lg text-center max-w-3xl mx-auto">
                Graduate fellowships, national scholarships, and institutional awards
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

        {/* ── Accessibility / equity ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden section-angle-top">
          <Container className="py-28 md:py-32">
            <RevealOnScroll className="mx-auto max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4 text-center">
                Accessible to all students
              </p>
              <h2 className="heading-lg text-white text-center">
                The application coach every student deserves
              </h2>
              <p className="body-lg mt-4 text-white/60 text-center max-w-2xl mx-auto">
                Scholarship success should not depend on whether your university has a fellowships
                office or whether your parents went to college. Granted levels the playing field.
              </p>
              <div className="mt-12 space-y-8">
                {accessPoints.map((item, i) => (
                  <RevealOnScroll key={item.title} delay={i * 100}>
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-8">
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="body-lg mt-2 text-white/60">{item.body}</p>
                    </div>
                  </RevealOnScroll>
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
              <h2 className="heading-lg text-center">Fellowship and scholarship resources</h2>
            </RevealOnScroll>
            <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              <RevealOnScroll delay={0}>
                <a
                  href="/blog/nih-grant-writing-tips-for-early-career-researchers-securing-funding-for-your-first-project"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">Early Career</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    NIH Grant Writing Tips for Early-Career Researchers
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    Strategies for securing your first NIH funding as a graduate student or postdoc.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand-yellow">Read more &rarr;</p>
                </a>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <a
                  href="/blog/the-best-biosketch"
                  className="card card-hover block p-8 h-full"
                >
                  <p className="text-sm font-medium uppercase tracking-wider text-brand-yellow">NIH</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    The Best Biosketch
                  </h3>
                  <p className="body-sm mt-3 text-navy-light">
                    How to write a biosketch that positions you as the right person for the project.
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
            <h3 className="heading-lg text-white">Your next chapter starts with a strong application</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Whether you are applying for the NSF GRFP, a Fulbright, or a departmental fellowship,
              Granted helps you find the right opportunity and write the application that gets you funded.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <CheckoutButton label="Start Your Application Free" />
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
