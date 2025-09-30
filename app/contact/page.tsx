import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-black text-white">
          <Container className="py-28 text-center md:py-36">
            <h1 className="heading-xl text-white">Granted | Contact Us</h1>
          </Container>
        </section>

        <Container className="grid gap-16 py-28 md:grid-cols-2 md:py-32">
          <div>
            <h2 className="heading-lg">Get In Touch</h2>
            <p className="body-lg mt-6 text-slate-700">We&apos;d love to hear from you! Let us know if you have questions or would like to work together.</p>
            <p className="body-lg mt-4 text-slate-700">
              Or, email: <a className="font-semibold text-slate-900 underline" href="mailto:team@grantedai.com">team@grantedai.com</a>
            </p>
          </div>
          <form action="/api/contact" method="post" className="card space-y-5 p-8 md:p-10">
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="name">Your name</label>
              <input
                id="name"
                name="name"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
            <button className="button button-primary w-full" type="submit">Send</button>
            <p className="body-sm text-slate-500">We&apos;ll route messages to info@grantedai.com.</p>
          </form>
        </Container>

        <section className="bg-black text-white">
          <Container className="py-24 text-center md:py-32">
            <h3 className="heading-lg text-white">Ready to Get Granted?</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-300">
              Save time. Stop frustration. Get inspired. Start your free trial today.
            </p>
            <div className="mt-10"><ButtonLink href="https://app.grantedai.com">Start Writing</ButtonLink></div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
