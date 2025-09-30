import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-black text-white">
          <Container className="py-28 md:py-36 text-center">
            <h1 className="heading-xl text-white">Granted | Features</h1>
          </Container>
        </section>

        <Container className="py-28 md:py-32">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <h2 className="heading-lg">Funding For All</h2>
              <p className="body-lg mt-6 text-slate-700">
                Don&apos;t let your writing limit you. AI can help you master the art of grant writing.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div className="card p-8">
                  <h3 className="text-lg font-semibold text-slate-900">Long-form skills</h3>
                  <p className="mt-3 text-base text-slate-700 leading-relaxed">
                    Easily incorporate proven techniques, like storytelling, to win allies for your cause.
                  </p>
                  <p className="body-sm mt-4 text-slate-500">Full Grant Proposals, Appeals, Campaigns, and more</p>
                </div>
                <div className="card p-8">
                  <h3 className="text-lg font-semibold text-slate-900">Short-form skills</h3>
                  <p className="mt-3 text-base text-slate-700 leading-relaxed">
                    Designed to hook the reader, deliver key information, and drive them to action.
                  </p>
                  <p className="body-sm mt-4 text-slate-500">Constructive feedback from Granted&apos;s AI to improve how you explain your work</p>
                </div>
              </div>

              <div className="mt-10">
                <ButtonLink href="/tech" variant="ghost">Learn about the technology</ButtonLink>
              </div>

              <div className="mt-12">
                <h3 className="heading-md">Craft full grant proposals in minutes, not weeks.</h3>
                <p className="body-lg mt-6 text-slate-700">
                  Steer our AI as it writes on the fly. Select the best generated content, rearrange it, add and delete language.
                  Granted&apos;s specialized AI will adapt as it writes more of your document.
                </p>
                <div className="mt-6">
                  <ButtonLink href="/faq" variant="ghost">Check out our FAQ</ButtonLink>
                </div>
              </div>
            </div>

            <div>
              <h3 className="heading-md text-slate-900">What can Granted help you write today?</h3>
              <ul className="body-lg mt-6 space-y-2.5 list-disc pl-6 text-slate-700">
                <li>✉️ Appeal - Human Impact</li>
                <li>NIH - Biosketch - Personal Statement</li>
                <li>NSF - Project Pitch (SBIR)</li>
                <li>NIH - Specific Aims</li>
                <li>Non-Federal - Grant Proposal</li>
                <li>Article Introduction</li>
              </ul>
            </div>
          </div>
        </Container>

        <section className="bg-black text-white">
          <Container className="py-24 text-center md:py-32">
            <h3 className="heading-lg text-white">Ready to Get Granted?</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-300">
              Save time. Stop frustration. Get inspired. Start your free trial today.
            </p>
            <div className="mt-10">
              <ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
