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
          <Container className="py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Granted | Contact Us</h1>
          </Container>
        </section>

        <Container className="py-16 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold">Get In Touch</h2>
            <p className="mt-2 text-slate-700">We&apos;d love to hear from you! Let us know if you have questions or would like to work together.</p>
            <p className="mt-4">Or, email: <a className="underline" href="mailto:team@grantedai.com">team@grantedai.com</a></p>
          </div>
          <form action="/api/contact" method="post" className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Your name</label>
              <input name="name" className="mt-1 w-full border rounded-md px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" name="email" className="mt-1 w-full border rounded-md px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Message</label>
              <textarea name="message" rows={5} className="mt-1 w-full border rounded-md px-3 py-2" required />
            </div>
            <button className="button button-primary w-full" type="submit">Send</button>
            <p className="text-xs text-slate-500">We’ll route messages to info@grantedai.com.</p>
          </form>
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
