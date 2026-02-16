import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantCTA from '@/components/GrantCTA'
import CategoryFoundationList from '@/components/CategoryFoundationList'
import {
  getFoundationsByState,
  getFoundationCountByState,
  getStateBySlug,
  US_STATES,
  type Foundation,
} from '@/lib/foundations'

export const revalidate = 86400

type Props = { params: { state: string } }

/* ── Metadata ── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateObj = getStateBySlug(params.state)
  if (!stateObj) return {}

  const count = await getFoundationCountByState(stateObj.abbreviation).catch(() => 0)
  const url = `https://grantedai.com/foundations/state/${stateObj.slug}`
  const title = `Foundations in ${stateObj.name}`
  const description = count > 0
    ? `Browse ${count.toLocaleString()} private foundations based in ${stateObj.name}. Search by category and asset size to find funders for your nonprofit or research project.`
    : `Browse private foundations based in ${stateObj.name}. Find funders by category and asset size in the Granted Foundation Directory.`

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

export default async function StateFoundationsPage({ params }: Props) {
  const stateObj = getStateBySlug(params.state)
  if (!stateObj) return notFound()

  const foundations = await getFoundationsByState(stateObj.abbreviation, 500).catch((err) => { console.error(`[foundations/state/${stateObj.slug}] getFoundationsByState failed:`, err); return [] as Foundation[] })

  return (
    <>
      <Header />
      <main>
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <RevealOnScroll>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
                Foundation Directory
              </p>
              <h1 className="heading-xl text-white max-w-2xl">
                Foundations in {stateObj.name}
              </h1>
              <p className="body-lg mt-4 text-white/50 max-w-xl">
                Browse private foundations based in {stateObj.name} from the
                world&apos;s largest continuously updated funder database.
              </p>
            </RevealOnScroll>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {foundations.length > 0 ? (
            <CategoryFoundationList
              categoryLabel={stateObj.name}
              categorySlug={`state-${stateObj.slug}`}
              foundations={foundations}
            />
          ) : (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">No foundations in {stateObj.name} yet</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  Our foundation database is growing. Check back soon or browse by category from the directory.
                </p>
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
