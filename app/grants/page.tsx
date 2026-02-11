import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantsPageClient from '@/components/GrantsPageClient'
import { getAllGrants, getClosingSoonGrants, getNewGrants } from '@/lib/grants'

export const revalidate = 86400

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
  const [grants, closingSoon, newGrants] = await Promise.all([
    getAllGrants().catch(() => []),
    getClosingSoonGrants(30).catch(() => []),
    getNewGrants().catch(() => []),
  ])
  const activeGrants = grants.filter((g) => g.status === 'active')
  const upcomingGrants = grants.filter((g) => g.status === 'upcoming')

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
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 mb-6">
                  <span className="text-sm font-semibold text-brand-yellow">
                    {grants.length.toLocaleString()}+ Opportunities
                  </span>
                </div>
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
          <GrantsPageClient
            closingSoon={closingSoon}
            newGrants={newGrants}
            activeGrants={activeGrants}
            upcomingGrants={upcomingGrants}
            totalGrantCount={grants.length}
          />
        </Container>
      </main>
      <Footer />
    </>
  )
}
