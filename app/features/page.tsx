import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import Image from 'next/image'

const checkMarks = [
  '50+ writing models tuned for fundraising, development, and grant teams',
  'Expert prompts and reviewer feedback engineered by real grant writers',
  'Yellowbox guidance shows where to strengthen clarity, evidence, and impact',
  'Fast editing in Granted — accept, rearrange, remix, or export drafts instantly',
]

const skillCards = [
  {
    title: 'Long-form skills',
    body: 'Easily weave proven storytelling techniques to win allies for your cause.',
    footer: 'Full Grant Proposals, Appeals, Campaigns, and more',
  },
  {
    title: 'Short-form skills',
    body: 'Designed to hook the reader, deliver key info, and drive them to action.',
    footer: 'Constructive feedback to sharpen how you explain your work',
  },
]

const modelCards = [
  {
    emoji: '✉️',
    title: 'Appeal – Human Impact',
    body: 'Spotlight the people behind your mission and move donors to act.',
  },
  {
    emoji: '🧍',
    title: 'NIH – Biosketch (Personal Statement)',
    body: 'Introduce reviewers to your qualifications and why you matter to the project.',
  },
  {
    emoji: '📝',
    title: 'NSF – Project Pitch (SBIR)',
    body: 'Qualify for NSF SBIR by clearly framing the innovation, market, and impact.',
  },
  {
    emoji: '🎯',
    title: 'NIH – Specific Aims',
    body: 'Define 3–4 razor-sharp aims that anchor the rest of your application.',
  },
  {
    emoji: '💰',
    title: 'Non-Federal – Grant Proposal',
    body: 'Draft a polished two-page proposal perfect for unsolicited or smaller requests.',
  },
  {
    emoji: '📰',
    title: 'Article Introduction',
    body: 'Open every article with a compelling lead that keeps readers hooked.',
  },
]

function CheckIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5 flex-shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 13.5 5.5 10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 13.5 15 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <section className="border-b border-white/10">
          <Container className="py-28 md:py-36 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">Features</p>
            <h1 className="heading-xl mt-6 text-white">Funding For All</h1>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-200">
              Granted ensures it&apos;s the quality of your ideas that counts, not your English. Bring the same polished
              fundraising experience from Bubble directly to your native Next.js site.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink>
              <ButtonLink href="/tech" variant="ghost">Learn about the technology</ButtonLink>
            </div>
          </Container>
        </section>

        <section className="py-24 md:py-32">
          <Container className="grid items-start gap-16 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-10">
              <div className="grid gap-6 sm:grid-cols-2">
                {skillCards.map(card => (
                  <div key={card.title} className="rounded-[32px] bg-[#F5CF49] p-8 text-black shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                    <h3 className="text-xl font-semibold tracking-tight">{card.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-black/80">{card.body}</p>
                    <p className="body-sm mt-4 text-black/70">{card.footer}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 rounded-[32px] bg-white/[0.03] p-8">
                <h3 className="heading-md">Craft full grant proposals in minutes, not weeks.</h3>
                <ul className="space-y-3 text-left text-slate-200">
                  {checkMarks.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 text-[#F5CF49]"><CheckIcon /></span>
                      <span className="body-lg text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <ButtonLink href="/faq" variant="ghost" className="text-white">
                    Check out our FAQ
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative overflow-hidden rounded-[32px] bg-[#F5CF49] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/imgi_7_img1.jpg"
                    alt="Use Granted for long-form content"
                    fill
                    className="rounded-[24px] object-cover shadow-lg"
                    sizes="(min-width: 1024px) 340px, 80vw"
                  />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[32px] bg-[#F5CF49] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/imgi_8_img2.jpg"
                    alt="Granted AI helping draft"
                    fill
                    className="rounded-[24px] object-cover shadow-lg"
                    sizes="(min-width: 1024px) 340px, 80vw"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-white/10 bg-white/[0.02]">
          <Container className="py-24 md:py-32">
            <h2 className="heading-lg text-center">What can Granted help you write today?</h2>
            <p className="body-lg mx-auto mt-4 max-w-3xl text-center text-slate-200">
              From first-touch donor appeals to specialized NIH submissions, every model is trained on real funded
              examples so you can move faster without sacrificing polish.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {modelCards.map(card => (
                <div key={card.title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden>{card.emoji}</span>
                    <h3 className="text-lg font-semibold tracking-tight text-white">{card.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-24 md:py-32">
          <Container className="rounded-[40px] border border-white/10 bg-gradient-to-r from-[#0F172A] via-black to-[#0F172A] px-10 py-16 text-center shadow-[0_40px_100px_rgba(15,23,42,0.6)] md:px-20 md:py-20">
            <h3 className="heading-lg text-white">Ready to Get Granted?</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-200">
              Save time. Stop frustration. Get inspired. Start your free trial today.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink>
              <ButtonLink href="/contact" variant="ghost" className="text-white">
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
