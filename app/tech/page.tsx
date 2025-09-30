import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

export default function TechPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-black text-white">
          <Container className="py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Granted | Technology</h1>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              This is not your father&apos;s GPT. Granted&apos;s purpose-built AI was designed to do one thing: get your proposal funded.
            </p>
            <div className="mt-6"><ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink></div>
          </Container>
        </section>

        <Container className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center">The best training data, tools, models, and AI evaluators</h2>
          <div className="mt-10 space-y-6 text-slate-800">
            <p><b>Data.</b> Granted has the world&apos;s largest database of 615,000 successful grant proposals vectorized using OpenAI&apos;s embedding protocol. (Note: Data from our users is considered private and never shared, nor is it incorporated as training data.)</p>
            <p><b>Algorithms.</b> The Facebook AI Similarity Search (FAISS) identifies similar successful grants from the public grant database.</p>
            <p><b>Tools.</b> In parallel, Langchain is used to build out the applicant&apos;s biography via web summarization while learning what the prospective funding agency is looking for.</p>
            <p><b>Models.</b> A suite of large language models, including GPT‑4, are provided with all of this context along with proprietary prompts to generate a first draft of the proposal.</p>
            <p><b>Evaluators.</b> Granted&apos;s AI proposal evaluators reflect on this first draft and identify reasons why it should not be funded. This feedback is incorporated into a second draft and then sent back out to the panel of AI evaluators. After these recurrent loops of unsupervised reflection and evaluation, ultimately Granted converges on the winning proposal — all in a matter of minutes!</p>
            <p><b>Agents.</b> Meanwhile, AutoGPT will always be on the lookout for new grant announcements and requests for proposals that fit the applicant&apos;s profile.</p>
          </div>

          <div className="mt-16 text-slate-800">
            <h3 className="text-2xl font-semibold">Combining custom large language models with world-class fundraising expertise</h3>
            <p className="mt-4">
              Granted&apos;s AI is a highly specialized version of a generative pre-trained transformer (GPT) with model weights finetuned by leading fundraising experts.
              After modifying the parameter weights, these experts then designed hundreds of writing models for this purpose-built AI to target specific grants and funding agencies.
            </p>
            <div className="mt-6"><ButtonLink href="/features" variant="ghost">Discover more features</ButtonLink></div>
          </div>
        </Container>

        <section className="bg-black text-white">
          <Container className="py-16 text-center">
            <h3 className="text-3xl md:text-4xl font-bold">Get Funded — Not Chatted Up.</h3>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              Securing funding for your project is too important to use general purpose AI writing tools. Granted is the only specialized AI that can give you grant proposal writing superpowers.
              Granted combines state of the art AI technology, the world&apos;s largest corpus of successful grant proposals, and the combined expertise from a team of fundraising specialists to ensure your ideas gets the funding they deserve.
            </p>
            <div className="mt-6"><ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink></div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
