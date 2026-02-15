import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { PricingTable } from '@/components/PricingTable'
import CheckoutButton from '@/components/CheckoutButton'

export const metadata: Metadata = {
  title: 'Pricing — Granted AI Grant Writing Tool, Plans from $29/mo',
  description:
    'Compare Granted AI pricing plans. Basic ($29/mo) and Professional ($89/mo). Start free, upgrade when you\'re ready. Cheaper than hiring a grant writer.',
  alternates: { canonical: 'https://grantedai.com/pricing' },
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Granted AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      name: 'Basic',
      price: '29',
      priceCurrency: 'USD',
      priceValidUntil: '2027-01-01',
    },
    {
      '@type': 'Offer',
      name: 'Professional',
      price: '89',
      priceCurrency: 'USD',
      priceValidUntil: '2027-01-01',
    },
  ],
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <main>
        <section className="bg-navy text-white">
          <Container className="py-28 text-center md:py-36">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
              Pricing
            </p>
            <h1 className="heading-xl text-white">A professional grant writer costs $5K+. <br className="hidden md:block" />Granted costs $29/month.</h1>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Every plan includes full-cycle workflow: discover grants, evaluate fit, run RFP analysis, and draft section-by-section proposals. Start free with 5 AI drafts per month.
            </p>
            <div className="mt-10">
              <CheckoutButton label="Start Writing — Free" />
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
            <h3 className="heading-md">Start Free, Upgrade When Ready</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-navy-light">
              Every account starts with 5 free AI drafts per month — no credit card required. Once you see how Granted transforms your grant writing, upgrade to unlock unlimited drafting, DOCX export, and more.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
