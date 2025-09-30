import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Black hero */}
      <section className="bg-black text-white">
        <Container className="py-24 md:py-36 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">You have better things to do with your time</h1>
          <p className="mt-6 text-xl md:text-2xl">Get your projects funded faster with AI</p>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-slate-300">
            Studies show grant applicants spend 40% of their time fundraising. It's time to get back to the real work.
            Granted&apos;s specialized AI is trained on over half a million successful grant proposals.
            Say hello to your fundraising copilot.
          </p>
          <div className="mt-10">
            <ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink>
          </div>
        </Container>
      </section>

      {/* Ensure's it's the quality of your ideas */}
      <section>
        <Container className="py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl">Granted ensures it&apos;s the quality of your ideas that counts, not your English.</h2>
            <p className="mt-5 text-lg text-slate-700">
              Instantly generate high-quality drafts for a wide range of grant proposals, appeals, letters of support,
              articles, and more, just by entering simple information about your project.
            </p>
            <div className="mt-6">
              <ButtonLink href="/features" variant="ghost">Discover more features →</ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image src="/images/hero-figure.png" alt="Granted" fill className="object-contain" />
          </div>
        </Container>
      </section>

      {/* Use case block */}
      <section>
        <Container className="py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[3/4] w-full">
            <Image src="/images/portrait-1.png" alt="Use cases" fill className="object-contain" />
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold">From a $100 donor appeal to a $1 million NIH R01 grant.</h3>
            <ul className="mt-6 space-y-3 list-disc pl-6 text-slate-700">
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

      {/* Yellow banner */}
      <section className="my-10">
        <Container>
          <div className="banner-yellow rounded-[32px] p-10 md:p-16 text-center">
            <h3 className="text-3xl md:text-5xl font-extrabold">Let us write your next draft,<br className="hidden md:block" /> no strings attached.</h3>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              See what Granted can do for you in just a few minutes and leave with the content you need.
            </p>
            <div className="mt-6">
              <ButtonLink href="https://app.grantedai.com">Start a 7-day free trial</ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* 3 steps */}
      <section className="bg-slate-50">
        <Container className="py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center">3 Steps To Your Fastest Funding Ever</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Create a new project.',
                body: 'Enter your mission statement and describe your work.'
              },
              {
                title: 'Select a model and complete the prompt.',
                body: 'Each of the 50+ models require some essential information, such as key personnel, values, funding request amount, and project description.'
              },
              {
                title: 'Watch as Granted creates a quality draft in seconds.',
                body: 'Pick your favorite draft and go. Or copy it into a larger document in the editor to assemble your full proposal.'
              },
            ].map((card, i) => (
              <div key={i} className="card p-8">
                <div className="text-4xl font-extrabold text-[#F5CF49]">{i+1}</div>
                <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
                <p className="mt-2 text-slate-700">{card.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Equity / playing field section */}
      <section className="py-20">
        <Container className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[3/4] w-full">
            <Image src="/images/portrait-2.png" alt="Equity" fill className="object-contain" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Level the fundraising playing field.</h2>
            <p className="mt-4 text-slate-700">
              The fundraising game isn&apos;t fair. The submission and selection process has well-known equity issues that
              disproportionately affect the careers of women, minorities, and non-native English speakers.
            </p>
            <p className="mt-4 text-slate-700">
              Granted&apos;s mission is to make fundraising less tedious, more accessible, and more successful for everyone —
              while freeing up millions of additional hours of productivity.
            </p>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black text-white">
        <Container className="py-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold">Ready to Get Granted?</h3>
          <p className="mt-2 text-slate-300">Save time. Stop frustration. Get inspired. Start your free trial today.</p>
          <div className="mt-6">
            <ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  )
}
