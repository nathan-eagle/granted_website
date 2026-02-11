import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import FoundationCard from '@/components/FoundationCard'
import GrantCTA from '@/components/GrantCTA'
import {
  getTopFoundations,
  FOUNDATION_CATEGORIES,
  US_STATES,
} from '@/lib/foundations'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Foundation Directory — Largest Private Foundation Database | Granted',
  description:
    'Browse the largest private foundation database. Search by category, state, or assets to find funders for your nonprofit or research project.',
  alternates: { canonical: 'https://grantedai.com/foundations' },
  openGraph: {
    title: 'Foundation Directory — Largest Private Foundation Database | Granted',
    description:
      'Browse the largest private foundation database. Search by category, state, or assets.',
    url: 'https://grantedai.com/foundations',
    siteName: 'Granted AI',
    type: 'website',
    images: [
      {
        url: 'https://grantedai.com/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Foundation Directory',
      },
    ],
  },
}

export default async function FoundationsIndex() {
  const topFoundations = await getTopFoundations(12).catch((err) => { console.error('[foundations] getTopFoundations failed:', err); return [] })

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Foundation Discovery
              </p>
              <h1 className="heading-xl text-white max-w-2xl">
                Foundation Directory
              </h1>
              <p className="body-lg mt-4 text-white/50 max-w-xl">
                Explore the world&apos;s largest private foundation database.
                Search by category, state, or asset size to find the right funder.
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {/* ── Category quick-links ── */}
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4">
                By Category
              </h2>
              <div className="flex flex-wrap gap-2">
                {FOUNDATION_CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/foundations/${c.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* ── State quick-links ── */}
          <RevealOnScroll delay={100}>
            <div className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-light/50 mb-4">
                By State
              </h2>
              <div className="flex flex-wrap gap-2">
                {US_STATES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/foundations/state/${s.slug}`}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-navy/10 text-navy hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors"
                  >
                    {s.abbreviation}
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* ── Largest Foundations ── */}
          {topFoundations.length > 0 && (
            <RevealOnScroll delay={200}>
              <h2 className="heading-lg text-navy mb-8">Largest Foundations</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topFoundations.map((f) => (
                  <FoundationCard key={f.id} foundation={f} />
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* ── Empty state ── */}
          {topFoundations.length === 0 && (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">Browse foundations above</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  Select a category or state to explore the world&apos;s largest private foundation database.
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
