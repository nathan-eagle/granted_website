import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

const faqs = [
  'How does Granted work?',
  "What's wrong with the way grant proposals are written today?" ,
  'How much does Granted cost?',
  'Do you have a free trial?',
  'Is the content from Granted original?',
  'How will my data be used?',
  'Do you work with OpenAI, Microsoft, Google, Meta, or any other AI model providers?',
  'Is the Granted AI trustworthy?',
  'Can Granted get even a bad idea funded?',
  'What projects can I use Granted for?',
  'How do I request a new feature?',
  'Is it dishonest to use AI writing tools like Granted?',
  'Can I trust Granted with highly sensitive or protected information?',
  'What happens if I cancel my plan?',
]

export default function FAQPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-black text-white">
          <Container className="py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Granted | FAQs</h1>
          </Container>
        </section>

        <Container className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="mt-8 divide-y">
            {faqs.map((q, i) => (
              <details key={i} className="group py-5">
                <summary className="flex justify-between items-center cursor-pointer text-lg font-medium">
                  {q}
                  <span className="transform transition group-open:rotate-180">⌄</span>
                </summary>
                <div className="mt-3 text-slate-700">
                  We&apos;ll add the exact copy from Bubble here (this is a placeholder so the component style and order match).
                </div>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/features" variant="ghost">Discover more features</ButtonLink>
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
