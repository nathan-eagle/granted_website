import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import GrantFinderCTA from '@/components/GrantFinderCTA'
import {
  getGrantsByState,
  getActiveGrantCountByState,
  getGrantStateBySlug,
  isGrantSeoReady,
} from '@/lib/grants'

export const revalidate = 3600

type Props = { params: { state: string } }

/* ── Metadata ── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateObj = getGrantStateBySlug(params.state)
  if (!stateObj) return {}

  const count = await getActiveGrantCountByState(stateObj.name).catch(() => 0)
  const url = `https://grantedai.com/grants/state/${stateObj.slug}`
  const title = `Grants in ${stateObj.name}`
  const description = count > 0
    ? `Browse ${count} active federal and foundation grants available in ${stateObj.name}. Find funding opportunities and draft AI-powered proposals with Granted.`
    : `Browse federal and foundation grants available in ${stateObj.name}. Find active funding opportunities and start your AI-powered proposal with Granted.`

  return {
    title: `${title} | Granted`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Granted AI',
      type: 'website',
      images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

/* ── Page ── */

export default async function StateGrantsPage({ params }: Props) {
  const stateObj = getGrantStateBySlug(params.state)
  if (!stateObj) return notFound()

  const grants = await getGrantsByState(stateObj.name).catch((err) => { console.error(`[grants/state/${stateObj.slug}] getGrantsByState failed:`, err); return [] })
  const activeGrants = grants.filter((g) => g.status === 'active')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Grants in ${stateObj.name}`,
    description: `Federal and foundation grants available in ${stateObj.name}.`,
    url: `https://grantedai.com/grants/state/${stateObj.slug}`,
  }

  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Grants by State
              </p>
              <h1 className="heading-xl text-white max-w-2xl">
                Grants in {stateObj.name}
              </h1>
              <p className="body-lg mt-4 text-white/50 max-w-xl">
                {activeGrants.length > 0
                  ? `Browse ${activeGrants.length} active grant${activeGrants.length === 1 ? '' : 's'} available in ${stateObj.name}.`
                  : `Grant opportunities in ${stateObj.name} will appear here as our database grows.`}
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {activeGrants.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeGrants.map((g, i) => (
                <RevealOnScroll key={g.id} delay={Math.min(i * 30, 300)}>
                  <GrantCard grant={g} />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">No grants found yet</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  Try searching for grants in {stateObj.name} with our AI-powered grant finder.
                </p>
                <Link
                  href={`/grants?q=${encodeURIComponent(stateObj.name)}`}
                  className="button button-primary mt-8 inline-flex"
                >
                  Search Grants in {stateObj.name}
                </Link>
              </div>
            </RevealOnScroll>
          )}

          {activeGrants.length > 0 && (
            <RevealOnScroll delay={160}>
              <div className="mt-10">
                <GrantFinderCTA />
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={300}>
            <div className="mt-16">
              <GrantCTA />
            </div>
          </RevealOnScroll>
        </Container>
      </main>
      <Footer />
    </>
  )
}
