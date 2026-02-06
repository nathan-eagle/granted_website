import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'

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
        <section className="bg-navy text-white">
          <Container className="py-28 text-center md:py-36">
            <h1 className="heading-xl text-white">Granted | FAQs</h1>
          </Container>
        </section>

        <Container className="py-28 md:py-32">
          <h2 className="heading-lg text-center">Frequently Asked Questions</h2>
          <div className="mt-12 divide-y divide-navy/10 border-y border-navy/10">
            {faqs.map((q, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left text-base font-semibold text-navy md:text-lg">
                  {q}
                  <span className="text-slate-400 transition-transform duration-200 group-open:rotate-180">
                    <svg aria-hidden className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </span>
                </summary>
                <div className="body-lg pb-6 text-navy-light">
                  We&apos;ll add the exact copy from Bubble here (this is a placeholder so the component style and order match).
                </div>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/features" variant="ghost">Discover more features</ButtonLink>
          </div>
        </Container>

        <section className="bg-navy text-white">
          <Container className="py-24 text-center md:py-32">
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
