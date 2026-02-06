import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { PricingTable } from '@/components/PricingTable'
import CheckoutButton from '@/components/CheckoutButton'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy text-white">
          <Container className="py-28 text-center md:py-36">
            <h1 className="heading-xl text-white">Granted | Pricing</h1>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Experience grant writing at the speed of thought. Unlock unlimited writing and ideas with our Professional plan.
            </p>
            <div className="mt-10">
              <CheckoutButton label="Try for Free" />
            </div>
          </Container>
        </section>

        <Container className="py-28 md:py-32">
          <PricingTable />

          <p className="body-sm mt-8 text-center text-navy-light/60">
            Each plan is subject to our fair use policy and its respective platform limits.
          </p>
          <p className="text-center text-sm text-navy-light/60 mt-4">
            Nonprofit or educational institution?{' '}
            <a href="/contact" className="underline hover:text-navy">Contact us for special pricing.</a>
          </p>

          <div className="mt-20 text-center">
            <h3 className="heading-md">7-Days On Us</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-navy-light">
              Our goal is that once you use Granted you will fall in love with it. That&apos;s why, when you sign up now, you will get 7-days free with access to every feature and model. As you work in Granted, please send us your feedback — we&apos;re building Granted for you!
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
