import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import { PricingTable } from '@/components/PricingTable'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-black text-white">
          <Container className="py-28 text-center md:py-36">
            <h1 className="heading-xl text-white">Granted | Pricing</h1>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-300">
              Experience grant writing at the speed of thought. Unlock unlimited writing and ideas with our Professional plan.
            </p>
            <div className="mt-10">
              <ButtonLink href="https://app.grantedai.com">Try for Free</ButtonLink>
            </div>
          </Container>
        </section>

        <Container className="py-28 md:py-32">
          <PricingTable />

          <p className="body-sm mt-8 text-center text-slate-500">
            Each plan is subject to our fair use policy and its respective platform limits.
          </p>

          <div className="mt-20 text-center">
            <h3 className="heading-md">7-Days On Us</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-slate-700">
              Our goal is that once you use Granted you will fall in love with it. That&apos;s why, when you sign up now, you will get 7-days free with access to every feature and model. As you work in Granted, please send us your feedback — we&apos;re building Granted for you!
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
