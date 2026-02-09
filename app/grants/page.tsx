import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCard from '@/components/GrantCard'
import GrantCTA from '@/components/GrantCTA'
import { getAllGrants, GRANT_CATEGORIES } from '@/lib/grants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Browse Federal Grants 2026 | Granted',
  description:
    'Find federal grants from NIH, NSF, EPA, USDA, DARPA, NOAA, and more. Browse active grant opportunities and start your AI-powered proposal today.',
  alternates: { canonical: 'https://grantedai.com/grants' },
  openGraph: {
    title: 'Browse Federal Grants 2026 | Granted',
    description:
      'Find federal grants from NIH, NSF, EPA, USDA, DARPA, NOAA, and more.',
    url: 'https://grantedai.com/grants',
    siteName: 'Granted AI',
    type: 'website',
    images: [
      {
        url: 'https://grantedai.com/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Browse Federal Grants',
      },
    ],
  },
}

const agencyCategories = GRANT_CATEGORIES.filter((c) => c.type === 'agency')
const audienceCategories = GRANT_CATEGORIES.filter((c) => c.type === 'audience')
const topicCategories = GRANT_CATEGORIES.filter((c) => c.type === 'topic')

export default async function GrantsIndex() {
  const grants = await getAllGrants().catch(() => [])
  const activeGrants = grants.filter((g) => g.status === 'active')
  const upcomingGrants = grants.filter((g) => g.status === 'upcoming')

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Grant Discovery
              </p>
              <h1 className="heading-xl text-white max-w-2xl">
                Browse Federal Grants
              </h1>
              <p className="body-lg mt-4 text-white/50 max-w-xl">
                Explore active funding opportunities from top federal agencies. Find
                the right grant and start your AI-powered proposal.
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {/* ── Category quick-links ── */}
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4">
                By Agency
              </h2>
              <div className="flex flex-wrap gap-2">
                {agencyCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/grants/${c.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">
                By Audience
              </h2>
              <div className="flex flex-wrap gap-2">
                {audienceCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/grants/${c.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4 mt-6">
                By Topic
              </h2>
              <div className="flex flex-wrap gap-2">
                {topicCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/grants/${c.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {c.name.replace(' Grants', '')}
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* ── Active grants grid ── */}
          {activeGrants.length > 0 && (
            <RevealOnScroll delay={100}>
              <h2 className="heading-lg text-navy mb-8">Active Grants</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeGrants.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* ── Upcoming grants ── */}
          {upcomingGrants.length > 0 && (
            <RevealOnScroll delay={200}>
              <h2 className="heading-lg text-navy mb-8 mt-16">Upcoming Grants</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingGrants.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* ── Empty state ── */}
          {grants.length === 0 && (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">Grants coming soon</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  We&apos;re populating our grant database. In the meantime, start your
                  proposal with Granted AI.
                </p>
              </div>
            </RevealOnScroll>
          )}

          {/* ── Bottom CTA ── */}
          <RevealOnScroll delay={300}>
            <div className="mt-20">
              <GrantCTA />
            </div>
          </RevealOnScroll>
        </Container>
      </main>
      <Footer />
    </>
  )
}
