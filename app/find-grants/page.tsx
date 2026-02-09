import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantFinder from '@/components/GrantFinder'
import { ButtonLink } from '@/components/ButtonLink'

export const metadata: Metadata = {
  title: 'Find Grants — Free Grant Search Engine | Granted',
  description: 'Search thousands of federal, foundation, and corporate grants. Enter your focus area and instantly discover matching funding opportunities for your organization.',
  alternates: { canonical: 'https://grantedai.com/find-grants' },
  openGraph: {
    title: 'Find Grants — Free Grant Search Engine | Granted',
    description: 'Search thousands of federal, foundation, and corporate grants. Enter your focus area and instantly discover matching funding opportunities.',
    url: 'https://grantedai.com/find-grants',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Grants — Free Grant Search Engine | Granted',
    description: 'Search thousands of federal, foundation, and corporate grants. Enter your focus area and discover matching funding opportunities.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Granted Grant Finder',
  description: 'Free AI-powered grant search engine for nonprofits, universities, and small businesses.',
  url: 'https://grantedai.com/find-grants',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  operatingSystem: 'All',
}

export default function FindGrantsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto relative z-10">
              <div className="hero-accent-circle w-[220px] h-[220px] -top-16 -right-24 hidden lg:block" />
              <div className="hero-accent-circle w-[140px] h-[140px] bottom-8 -left-20 hidden lg:block" />

              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Free Search Tool
              </p>
              <h1 className="heading-xl text-white">
                Find grants for your organization
              </h1>
              <p className="body-lg mt-6 text-white/60 max-w-2xl mx-auto">
                Search federal, foundation, and corporate funding opportunities.
                Tell us your focus area and we will find the grants that match.
              </p>
            </div>
          </Container>
        </section>

        {/* Finder */}
        <section>
          <Container className="py-16 md:py-20">
            <RevealOnScroll>
              <GrantFinder />
            </RevealOnScroll>
          </Container>
        </section>

        {/* Education */}
        <section className="bg-cream-dark">
          <Container className="py-20 md:py-28">
            <RevealOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow mb-4">
                  Why Discovery Matters
                </p>
                <h2 className="heading-lg text-navy">
                  The hardest part of grants is finding the right ones
                </h2>
                <p className="body-lg text-navy-light mt-6 max-w-2xl mx-auto">
                  Organizations spend an average of 20 hours per week searching for
                  funding opportunities. The right grant match can mean the
                  difference between a competitive application and wasted effort.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="grid sm:grid-cols-3 gap-6 mt-14 max-w-3xl mx-auto">
                {[
                  { stat: '20 hrs', label: 'average weekly time spent searching for grants by nonprofits' },
                  { stat: '85%', label: 'of grants are won by organizations that match funder priorities' },
                  { stat: '30 sec', label: 'to find matched grants with Granted instead of hours of manual search' },
                ].map((item) => (
                  <div key={item.stat} className="card card-hover p-6 text-center">
                    <p className="font-display text-3xl tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: '#F5CF49' }}>
                      {item.stat}
                    </p>
                    <p className="text-sm text-navy-light mt-2 leading-relaxed">{item.label}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-navy text-white noise-overlay overflow-hidden">
          <Container className="py-20 md:py-24 text-center relative z-10">
            <RevealOnScroll>
              <h2 className="heading-lg text-white">
                Want AI to help you apply?
              </h2>
              <p className="body-lg text-white/60 mt-4 max-w-2xl mx-auto">
                Granted drafts complete, requirement-aligned grant proposals. Upload
                your RFP and start writing in minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                <ButtonLink href="https://app.grantedai.com" variant="primary" className="bg-brand-yellow text-navy hover:bg-brand-gold border-brand-yellow">
                  Try Granted Free
                </ButtonLink>
                <ButtonLink href="/pricing" variant="ghost" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                  View Pricing
                </ButtonLink>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
