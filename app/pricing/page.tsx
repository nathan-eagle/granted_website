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
          <div className="flex items-center justify-center gap-4">
            <button className="button button-ghost">Monthly</button>
            <button className="button button-ghost">Annual</button>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {[{
              name: 'Basic',
              price: '$29 per month billed monthly',
              features: [
                '20k words per month',
                '30+ Writing Models',
                'AI Idea Generators',
                'Unlimited Projects',
              ],
            }, {
              name: 'Professional',
              price: '$89 per month billed monthly',
              features: [
                'Unlimited words',
                'Early Access to New Features',
                '30+ Writing Models',
                'AI Idea Generators',
                'Unlimited Projects',
              ],
              badge: 'Most Popular',
            }].map(plan => (
              <div key={plan.name} className="relative">
                {plan.badge ? (
                  <span className="absolute -top-4 right-6 rounded-pill bg-black px-3 py-1 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                ) : null}
                <div className="card flex h-full flex-col gap-6 p-10">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{plan.name}</h2>
                    <p className="body-lg mt-3 text-slate-700">{plan.price}</p>
                  </div>
                  <ul className="body-lg space-y-2.5 list-disc pl-6 text-slate-700">
                    {plan.features.map(feature => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <ButtonLink href="https://app.grantedai.com" className="mt-auto w-full">
                    Try for free
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>

          <p className="body-sm mt-6 text-slate-500">
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
