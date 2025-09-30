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
          <Container className="py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Granted | Features</h1>
          </Container>
        </section>

        <Container className="py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Funding For All</h2>
              <p className="mt-3 text-slate-700">Don&apos;t let your writing limit you. AI can help you master the art of grant writing.</p>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="font-semibold">Long-form skills</h3>
                  <p className="mt-2 text-slate-700">Easily incorporate proven techniques, like storytelling, to win allies for your cause.</p>
                  <p className="mt-2 text-sm text-slate-600">Full Grant Proposals, Appeals, Campaigns, and more</p>
                </div>
                <div className="card p-6">
                  <h3 className="font-semibold">Short-form skills</h3>
                  <p className="mt-2 text-slate-700">Designed to hook the reader, deliver key information, and drive them to action.</p>
                  <p className="mt-2 text-sm text-slate-600">Constructive feedback from Granted&apos;s AI to improve how you explain your work</p>
                </div>
              </div>

              <div className="mt-6">
                <ButtonLink href="/tech" variant="ghost">Learn about the technology</ButtonLink>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-semibold">Craft full grant proposals in minutes, not weeks.</h3>
                <p className="mt-2 text-slate-700">
                  Steer our AI as it writes on the fly. Select the best generated content, rearrange it, add and delete language. 
                  Granted&apos;s specialized AI will adapt as it writes more of your document.
                </p>
                <div className="mt-4"><ButtonLink href="/faq" variant="ghost">Check out our FAQ</ButtonLink></div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">What can Granted help you write today?</h3>
              <ul className="mt-4 space-y-3 list-disc pl-5 text-slate-800">
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
          <Container className="py-16 text-center">
            <h3 className="text-3xl md:text-4xl font-bold">Ready to Get Granted?</h3>
            <p className="mt-2 text-slate-300">Save time. Stop frustration. Get inspired. Start your free trial today.</p>
            <div className="mt-6"><ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink></div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
