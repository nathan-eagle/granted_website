import { Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantsPageClient from '@/components/GrantsPageClient'
import { getGrantCount, getClosingSoonGrants, getNewGrants, getRecentlyAddedGrants } from '@/lib/grants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Find & Browse Grants — Free Grant Search | Granted',
  description:
    'Search the world\'s largest grants and funders database and browse active opportunities by agency, topic, and state. Free AI-powered grant discovery for nonprofits, universities, and small businesses.',
  alternates: { canonical: 'https://grantedai.com/grants' },
  openGraph: {
    title: 'Find & Browse Grants — Free Grant Search | Granted',
    description:
      'Search and browse the world\'s largest grants and funders database. Free AI-powered grant discovery.',
    url: 'https://grantedai.com/grants',
    siteName: 'Granted AI',
    type: 'website',
    images: [
      {
        url: 'https://grantedai.com/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Find & Browse Grants',
      },
    ],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Granted Grant Finder',
  description: 'Free AI-powered grant search engine for nonprofits, universities, and small businesses.',
  url: 'https://grantedai.com/grants',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  operatingSystem: 'All',
}

export default async function GrantsIndex() {
  const [totalGrantCount, closingSoon, newGrants, recentlyAdded] = await Promise.all([
    getGrantCount().catch((err) => { console.error('[grants/page] getGrantCount failed:', err); return 0 }),
    getClosingSoonGrants(30).catch((err) => { console.error('[grants/page] getClosingSoonGrants failed:', err); return [] }),
    getNewGrants().catch((err) => { console.error('[grants/page] getNewGrants failed:', err); return [] }),
    getRecentlyAddedGrants(24, 9).catch((err) => { console.error('[grants/page] getRecentlyAddedGrants failed:', err); return [] }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-8 md:py-12 relative z-10">
            <RevealOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                {totalGrantCount > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 mb-6">
                    <span className="text-sm font-semibold text-brand-yellow">
                      {totalGrantCount.toLocaleString()}+ Opportunities
                    </span>
                  </div>
                )}
                <h1 className="heading-xl text-white">
                  Find the right grant for your organization
                </h1>
                <p className="body-lg mt-4 text-white/50 max-w-2xl mx-auto">
                  Search federal, foundation, and corporate grants with AI — or browse by agency, topic, and state.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        <Container>
          <Suspense fallback={
            <div className="py-12 md:py-16">
              <div className="max-w-2xl mx-auto">
                <div className="card p-8 md:p-10 animate-pulse">
                  <div className="h-6 bg-navy/8 rounded w-1/3 mb-6" />
                  <div className="h-12 bg-navy/5 rounded mb-6" />
                  <div className="h-6 bg-navy/8 rounded w-1/3 mb-6" />
                  <div className="h-12 bg-navy/5 rounded mb-6" />
                  <div className="h-12 bg-navy/8 rounded-pill mt-8" />
                </div>
              </div>
            </div>
          }>
            <GrantsPageClient
              closingSoon={closingSoon}
              newGrants={newGrants}
              recentlyAdded={recentlyAdded}
              totalGrantCount={totalGrantCount}
            />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  )
}
