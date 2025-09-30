import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-black text-white">
          <Container className="py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Granted | Pricing</h1>
            <p className="mt-3 text-slate-300">Experience grant writing at the speed of thought. Get unlimited writing and ideas with our Professional plan.</p>
            <div className="mt-6"><ButtonLink href="https://app.grantedai.com">Try for Free</ButtonLink></div>
          </Container>
        </section>

        <Container className="py-16">
          <div className="flex items-center justify-center gap-6 mb-10">
            <button className="button button-ghost">Monthly</button>
            <button className="button button-ghost">Annual</button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8">
              <h2 className="text-2xl font-semibold">Basic</h2>
              <p className="mt-1 text-slate-600">$29 per month billed monthly</p>
              <ul className="mt-6 space-y-2 list-disc pl-5">
                <li>20k words per month</li>
                <li>30+ Writing Models</li>
                <li>AI Idea Generators</li>
                <li>Unlimited Projects</li>
              </ul>
              <div className="mt-6"><ButtonLink href="https://app.grantedai.com" className="w-full">Try for free</ButtonLink></div>
            </div>

            <div className="card p-8 relative">
              <div className="absolute -top-3 right-5 bg-black text-white text-xs px-3 py-1 rounded-full">Most Popular</div>
              <h2 className="text-2xl font-semibold">Professional</h2>
              <p className="mt-1 text-slate-600">$89 per month billed monthly</p>
              <ul className="mt-6 space-y-2 list-disc pl-5">
                <li>Unlimited words</li>
                <li>Early Access to New Features</li>
                <li>30+ Writing Models</li>
                <li>AI Idea Generators</li>
                <li>Unlimited Projects</li>
              </ul>
              <div className="mt-6"><ButtonLink href="https://app.grantedai.com" className="w-full">Try for free</ButtonLink></div>
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-6">Each plan is subject to our fair use policy and its respective platform limits.</p>

          <div className="mt-14 text-center">
            <h3 className="text-2xl font-semibold">7-Days On Us</h3>
            <p className="max-w-2xl mx-auto mt-3 text-slate-700">
              Our goal is that once you use Granted you will fall in love with it. That&apos;s why, when you sign up now,
              you will get 7-days free with access to every feature and model. As you work in Granted, please send us your feedback — we&apos;re building Granted for you!
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
