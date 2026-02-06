import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-32 md:py-40">
            <div className="mx-auto max-w-3xl text-center relative z-10">
              <h1 className="heading-display">You have better things to do with your time</h1>
              <p className="mt-6 text-lg md:text-2xl font-semibold text-brand-yellow">
                Get your projects funded faster with AI
              </p>
              <p className="body-lg mx-auto mt-6 text-white/70">
                Studies show grant applicants spend 40% of their time fundraising. It&apos;s time to get back to the real work.
                Granted&apos;s specialized AI is trained on over half a million successful grant proposals. Say hello to your fundraising copilot.
              </p>
              <div className="mt-10">
                <CheckoutButton label="Start Writing" />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Gold rule divider ── */}
        <div className="gold-rule" />

        {/* ── Quality of ideas ── */}
        <section>
          <Container className="py-28 md:py-32 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="heading-xl">Granted ensures it&apos;s the quality of your ideas that counts, not your English.</h2>
              <p className="body-lg mt-6 text-navy-light">
                Instantly generate high-quality drafts for a wide range of grant proposals, appeals, letters of support, articles, and more, just by entering simple information about your project.
              </p>
              <div className="mt-8">
                <ButtonLink href="/features" variant="ghost" className="px-6">
                  Discover more features →
                </ButtonLink>
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
              <Image src="/images/hero-figure.png" alt="Granted" fill className="object-contain" sizes="(min-width: 1024px) 480px, 80vw" />
            </div>
          </Container>
        </section>

        {/* ── Use cases ── */}
        <section>
          <Container className="py-28 md:py-32 grid items-center gap-12 lg:grid-cols-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm lg:max-w-md">
              <Image src="/images/portrait-1.png" alt="Use cases" fill className="object-contain" sizes="(min-width: 1024px) 420px, 70vw" />
            </div>
            <div>
              <h3 className="heading-lg">From a $100 donor appeal to a $1 million NIH R01 grant.</h3>
              <ul className="body-lg mt-6 space-y-2.5 list-disc pl-6 text-navy-light">
                <li>Quickly assemble full fundraising proposals.</li>
                <li>Granted&apos;s AI is specifically trained for grant proposal writing and produces superior outcomes compared to general-purpose AI writing tools.</li>
                <li>50+ writing models to help draft highly personalized fundraising proposals.</li>
                <li>Specialized models for federal grants.</li>
                <li>Custom engineered for nearly every section of many NIH and NSF grants.</li>
                <li>Improve how you explain your work with specialized AI feedback.</li>
                <li>Keep donors in the loop with well-written project updates.</li>
              </ul>
            </div>
          </Container>
        </section>

        {/* ── Yellow banner CTA ── */}
        <section>
          <Container className="py-16 md:py-20">
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
          </Container>
        </section>

        {/* ── 3 Steps ── */}
        <section className="bg-cream-dark">
          <Container className="py-28 md:py-36">
            <h2 className="heading-lg text-center">3 Steps To Your Fastest Funding Ever</h2>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Create a new project.',
                  body: 'Enter your mission statement and describe your work.'
                },
                {
                  title: 'Select a model and complete the prompt.',
                  body: 'Each of the 50+ models require essential information, such as key personnel, values, funding request amount, and project description.'
                },
                {
                  title: 'Watch as Granted creates a quality draft in seconds.',
                  body: 'Pick your favorite draft and go. Or copy it into a larger document in the editor to assemble your full proposal.'
                },
              ].map((card, i) => (
                <div key={card.title} className="card flex h-full flex-col gap-5 p-10">
                  <div className="font-display text-[3.75rem] leading-none text-brand-yellow">{i + 1}</div>
                  <h3 className="text-lg font-semibold text-navy">{card.title}</h3>
                  <p className="text-base text-navy-light leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Equity section ── */}
        <section>
          <Container className="py-28 md:py-32 grid items-center gap-12 lg:grid-cols-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm lg:max-w-md">
              <Image src="/images/portrait-2.png" alt="Equity" fill className="object-contain" sizes="(min-width: 1024px) 420px, 70vw" />
            </div>
            <div>
              <h2 className="heading-lg">Level the fundraising playing field.</h2>
              <p className="body-lg mt-6 text-navy-light">
                The fundraising game isn&apos;t fair. The submission and selection process has well-known equity issues that disproportionately affect the careers of women, minorities, and non-native English speakers.
              </p>
              <p className="body-lg mt-4 text-navy-light">
                Granted&apos;s mission is to make fundraising less tedious, more accessible, and more successful for everyone — while freeing up millions of additional hours of productivity.
              </p>
            </div>
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
