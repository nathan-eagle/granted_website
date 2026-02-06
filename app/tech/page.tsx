import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'

export default function TechPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy text-white">
          <Container className="py-28 text-center md:py-36">
            <h1 className="heading-xl text-white">Granted | Technology</h1>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              This is not your father&apos;s GPT. Granted&apos;s purpose-built AI was designed to do one thing: get your proposal funded.
            </p>
            <div className="mt-10">
              <CheckoutButton label="Start Writing" />
            </div>
          </Container>
        </section>

        <Container className="py-28 md:py-32">
          <h2 className="heading-lg text-center">
            The best training data, tools, models, and AI evaluators
          </h2>
          <div className="body-lg mx-auto mt-12 max-w-3xl space-y-6 text-navy-light">
            <p><strong>Data.</strong> Granted has the world&apos;s largest database of 615,000 successful grant proposals vectorized using OpenAI&apos;s embedding protocol. (Data from our users remains private and never becomes training data.)</p>
            <p><strong>Algorithms.</strong> The Facebook AI Similarity Search (FAISS) identifies similar successful grants from the public grant database.</p>
            <p><strong>Tools.</strong> In parallel, LangChain is used to build out the applicant&apos;s biography via web summarization while learning what the prospective funding agency is looking for.</p>
            <p><strong>Models.</strong> A suite of large language models, including GPT‑4, are provided with all of this context along with proprietary prompts to generate a first draft of the proposal.</p>
            <p><strong>Evaluators.</strong> Granted&apos;s AI proposal evaluators reflect on this first draft and identify reasons why it should not be funded. This feedback is incorporated into a second draft and then sent back out to the panel of AI evaluators. Through recurrent loops of reflection and evaluation, Granted converges on the winning proposal in minutes.</p>
            <p><strong>Agents.</strong> Meanwhile, AutoGPT is always on the lookout for new grant announcements and requests for proposals that fit the applicant&apos;s profile.</p>
          </div>

          <div className="mt-20 text-slate-800">
            <h3 className="heading-md">Combining custom large language models with world-class fundraising expertise</h3>
            <p className="body-lg mt-6 text-navy-light">
              Granted&apos;s AI is a highly specialized version of a generative pre-trained transformer (GPT) with model weights finetuned by leading fundraising experts. After modifying the parameter weights, these experts designed hundreds of writing models for this purpose-built AI to target specific grants and funding agencies.
            </p>
            <div className="mt-8">
              <ButtonLink href="/features" variant="ghost">Discover more features</ButtonLink>
            </div>
          </div>
        </Container>

        <section className="bg-navy text-white">
          <Container className="py-24 text-center md:py-32">
            <h3 className="heading-lg text-white">Get Funded — Not Chatted Up.</h3>
            <p className="body-lg mx-auto mt-4 max-w-3xl text-white/60">
              Securing funding for your project is too important to use general purpose AI writing tools. Granted combines state-of-the-art AI technology, the world&apos;s largest corpus of successful grant proposals, and the expertise of fundraising specialists to ensure your ideas get the funding they deserve.
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
