import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import FoundationCard from '@/components/FoundationCard'
import GrantCTA from '@/components/GrantCTA'
import CategoryFoundationList from '@/components/CategoryFoundationList'
import FoundationInsights from '@/components/FoundationInsights'
import FoundationFinancials from '@/components/FoundationFinancials'
import Link from 'next/link'
import {
  getFoundationBySlug,
  getRelatedFoundations,
  getSimilarFoundations,
  getSimilarFoundationsByAssets,
  getFoundationGrantees,
  getFoundationsByCategory,
  getCategoryBySlug,
  getFoundationFinancials,
  getFoundationSlugsByPrefixes,
  getPublicGrantSlugsForRfps,
  getFoundationRfps,
  computeGrantStats,
  computeGivingByYear,
  computeStateDistribution,
  computeNewGranteeRate,
  formatAssets,
  getFoundationLocation,
  getFoundationCategoryLabel,
  getStateByAbbrev,
  slugifyName,
  FOUNDATION_CATEGORIES,
  type Foundation,
  type FoundationCategory,
  type FoundationGrantee,
  type FoundationFinancial,
  type FoundationRfp,
  type GrantStats,
  type GivingByYear,
  type StateDistribution,
} from '@/lib/foundations'

export const revalidate = 3600

type Props = { params: { slug: string } }

const SIGN_IN_URL =
  'https://app.grantedai.com/api/auth/signin?callbackUrl=/overview'

/* ── Metadata ── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  if (category) {
    const url = `https://grantedai.com/foundations/${category.slug}`
    return {
      title: `${category.name} Foundations | Granted Foundation Directory`,
      description: category.description,
      alternates: { canonical: url },
      openGraph: {
        title: `${category.name} Foundations`,
        description: category.description,
        url,
        siteName: 'Granted AI',
        type: 'website',
        images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: category.name }],
      },
      twitter: { card: 'summary_large_image', title: `${category.name} Foundations`, description: category.description },
    }
  }

  const foundation = await getFoundationBySlug(params.slug).catch((err) => { console.error(`[foundations/${params.slug}] metadata getFoundationBySlug failed:`, err); return null })
  if (!foundation) return {}

  const title = foundation.name
  const location = getFoundationLocation(foundation)
  const orgType = foundation.organization_type ? foundation.organization_type.toLowerCase() : 'foundation'
  const description = [
    `${foundation.name} is a private ${orgType} based in ${location}.`,
    foundation.asset_amount ? `Total assets: ${formatAssets(foundation.asset_amount)}.` : null,
    foundation.income_amount ? `Annual income: ${formatAssets(foundation.income_amount)}.` : null,
    foundation.ntee_major ? `Category: ${getFoundationCategoryLabel(foundation)}.` : null,
    foundation.contact_name ? `Principal officer: ${foundation.contact_name}.` : null,
    'View financial details and grantmaking history.',
  ]
    .filter(Boolean)
    .join(' ')
  const url = `https://grantedai.com/foundations/${foundation.slug}`

  return {
    title: `${title} | Granted Foundation Directory`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Granted AI',
      type: 'article',
      images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

/* ── Category layout ── */

function CategoryPage({ category, foundations }: { category: FoundationCategory; foundations: Foundation[] }) {
  return (
    <>
      <Header />
      <main>
        <section className={`${category.gradient} noise-overlay overflow-hidden`}>
          <Container className="py-20 md:py-28 relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-white/50 mb-4">
              Foundation Category
            </p>
            <h1 className="heading-xl text-white max-w-2xl">{category.name} Foundations</h1>
            <p className="body-lg mt-4 text-white/50 max-w-xl">{category.description}</p>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {foundations.length > 0 ? (
            <CategoryFoundationList
              categoryLabel={category.name}
              categorySlug={category.slug}
              foundations={foundations}
            />
          ) : (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">No {category.name.toLowerCase()} foundations yet</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  Our foundation database is growing. Check back soon or try a related category.
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

/* ── Foundation detail layout ── */

function buildAboutParagraph(f: Foundation): string {
  const parts: string[] = []
  const location = getFoundationLocation(f)

  const orgType = f.organization_type ? f.organization_type.toLowerCase() : 'foundation'
  parts.push(`${f.name} is a private ${orgType} based in ${location}.`)

  if (f.ruling_date) {
    const year = f.ruling_date.length >= 4 ? f.ruling_date.slice(0, 4) : f.ruling_date
    parts.push(`The foundation received its IRS ruling in ${year}.`)
  }

  if (f.contact_name) {
    parts.push(`The principal officer is ${f.contact_name}.`)
  }

  if (f.asset_amount) {
    parts.push(`It holds total assets of ${formatAssets(f.asset_amount)}.`)
  }

  if (f.income_amount) {
    parts.push(`Annual income is reported at ${formatAssets(f.income_amount)}.`)
  }

  const catLabel = getFoundationCategoryLabel(f)
  if (catLabel !== 'General') {
    parts.push(`The foundation operates in the area of ${catLabel.toLowerCase()}.`)
  }

  if (f.deductibility === 'Contributions are deductible') {
    parts.push('Contributions to this foundation are tax-deductible.')
  }

  return parts.join(' ')
}

function FoundationDetailPage({
  foundation,
  related,
  similar,
  grantees,
  insightStats,
  insightGivingByYear,
  insightStateDistribution,
  insightNewGranteeInfo,
  financials,
  rfps,
  rfpSlugMap,
  granteeSlugMap,
}: {
  foundation: Foundation
  related: Foundation[]
  similar: Foundation[]
  grantees: FoundationGrantee[]
  insightStats: GrantStats | null
  insightGivingByYear: GivingByYear[]
  insightStateDistribution: StateDistribution[]
  insightNewGranteeInfo: { rate: number; year: number } | null
  financials: FoundationFinancial[]
  rfps: FoundationRfp[]
  rfpSlugMap: Map<string, string>
  granteeSlugMap: Map<string, string>
}) {
  const location = getFoundationLocation(foundation)
  const url = `https://grantedai.com/foundations/${foundation.slug}`
  const stateObj = foundation.state ? getStateByAbbrev(foundation.state) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: foundation.name,
    description: buildAboutParagraph(foundation),
    url,
    ...(foundation.ein ? { taxID: foundation.ein } : {}),
    ...(foundation.contact_name
      ? { employee: { '@type': 'Person', name: foundation.contact_name, jobTitle: 'Principal Officer' } }
      : {}),
    address: {
      '@type': 'PostalAddress',
      ...(foundation.street ? { streetAddress: foundation.street } : {}),
      ...(foundation.city ? { addressLocality: foundation.city } : {}),
      ...(foundation.state ? { addressRegion: foundation.state } : {}),
      ...(foundation.zip ? { postalCode: foundation.zip } : {}),
      addressCountry: 'US',
    },
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Foundations', href: '/foundations' },
    ...(stateObj
      ? [{ label: stateObj.name, href: `/foundations/state/${stateObj.slug}` }]
      : []),
    { label: foundation.name },
  ]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...('href' in c && c.href ? { item: `https://grantedai.com${c.href}` } : {}),
    })),
  }

  const quickFacts = [
    { label: 'EIN', value: foundation.ein },
    { label: 'Location', value: location },
    { label: 'Category', value: getFoundationCategoryLabel(foundation) },
    { label: 'Total Assets', value: formatAssets(foundation.asset_amount) },
    { label: 'Annual Income', value: formatAssets(foundation.income_amount) },
    ...(foundation.ruling_date
      ? [{ label: 'IRS Ruling Year', value: foundation.ruling_date.length >= 4 ? foundation.ruling_date.slice(0, 4) : foundation.ruling_date }]
      : []),
    ...(foundation.organization_type
      ? [{ label: 'Organization Type', value: foundation.organization_type }]
      : []),
    ...(foundation.contact_name
      ? [{ label: 'Principal Officer', value: foundation.contact_name }]
      : []),
    ...(foundation.deductibility
      ? [{ label: 'Tax Deductibility', value: foundation.deductibility }]
      : []),
    ...(foundation.affiliation && foundation.affiliation !== 'Independent organization'
      ? [{ label: 'Affiliation', value: foundation.affiliation }]
      : []),
  ]

  return (
    <>
      <Header />
      <main>
        <Container className="py-12 md:py-16">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />

          {/* Breadcrumbs */}
          <RevealOnScroll>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-navy-light/50 mb-6 flex-wrap">
              {breadcrumbItems.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {'href' in c && c.href ? (
                    <a href={c.href} className="hover:text-navy transition-colors">
                      {c.label}
                    </a>
                  ) : (
                    <span className="text-navy font-medium">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </RevealOnScroll>

          {/* Heading */}
          <RevealOnScroll delay={80}>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-sm text-navy-light/50">{location}</span>
            </div>
            <h1 className="heading-xl text-navy">{foundation.name}</h1>
          </RevealOnScroll>

          {/* Quick Facts */}
          <RevealOnScroll delay={160}>
            <div className="mt-10 bg-cream-dark rounded-[20px] border-l-4 border-brand-yellow p-8">
              <h2 className="text-lg font-bold text-navy mb-6">Quick Facts</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {quickFacts.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-1">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-navy font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                {foundation.website && (
                  <a
                    href={foundation.website.startsWith('http') ? foundation.website : `https://${foundation.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
                  >
                    Visit Website
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}
                {foundation.grants_page_url && foundation.grants_page_url !== foundation.website && (
                  <a
                    href={foundation.grants_page_url.startsWith('http') ? foundation.grants_page_url : `https://${foundation.grants_page_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
                  >
                    View Grants Page
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}
              </div>
              <div className="mt-6">
                <a
                  href={SIGN_IN_URL}
                  className="button button-primary w-full sm:w-auto"
                >
                  Find Grants from This Foundation
                </a>
              </div>
            </div>
          </RevealOnScroll>

          {/* Open Grant Opportunities */}
          {rfps.length > 0 && (
            <RevealOnScroll delay={200}>
              <section className="mt-12">
                <h2 className="heading-md text-navy text-2xl font-bold mb-6">Open Grant Opportunities</h2>
                <div className="space-y-4">
                  {rfps.map((rfp) => {
                    const grantSlug = rfpSlugMap.get(rfp.name)
                    return (
                    <div key={rfp.id} className="bg-cream-dark rounded-2xl p-6 border border-navy/5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-navy">
                            {grantSlug ? (
                              <Link href={`/grants/${grantSlug}`} className="hover:text-brand-gold transition-colors hover:underline">
                                {rfp.name}
                              </Link>
                            ) : (
                              rfp.name
                            )}
                          </h3>
                          {rfp.description && (
                            <p className="text-sm text-navy-light/70 mt-1 line-clamp-2">{rfp.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-navy-light/50">
                            {rfp.deadline && (
                              <span>
                                Deadline: <span className="font-medium text-navy">{rfp.deadline}</span>
                              </span>
                            )}
                            {rfp.amount && rfp.amount !== 'Not specified' && (
                              <span>
                                Amount: <span className="font-medium text-navy">{rfp.amount}</span>
                              </span>
                            )}
                            {rfp.grant_type === 'rolling_program' && (
                              <span className="bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full font-medium">
                                Rolling
                              </span>
                            )}
                          </div>
                          {rfp.focus_areas && rfp.focus_areas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {rfp.focus_areas.slice(0, 4).map((area) => (
                                <span key={area} className="text-xs bg-navy/5 text-navy-light/70 px-2 py-0.5 rounded-full">
                                  {area}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {rfp.application_url && (
                          <a
                            href={rfp.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:underline"
                          >
                            Apply
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                              <path d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                    )
                  })}
                </div>
              </section>
            </RevealOnScroll>
          )}

          {/* About */}
          <RevealOnScroll delay={240}>
            <section className="mt-12">
              <h2 className="heading-md text-navy text-2xl font-bold mb-4">About This Foundation</h2>
              <p className="body-lg text-navy-light leading-relaxed">
                {buildAboutParagraph(foundation)}
              </p>
            </section>
          </RevealOnScroll>

          {/* Financial Overview (from ProPublica summary data) */}
          <RevealOnScroll delay={320}>
            <FoundationFinancials financials={financials} />
          </RevealOnScroll>

          {/* Grantmaking Insights (charts, map, stats — from grant-level data) */}
          <RevealOnScroll delay={340}>
            <FoundationInsights
              stats={insightStats}
              givingByYear={insightGivingByYear}
              stateDistribution={insightStateDistribution}
              newGranteeInfo={insightNewGranteeInfo}
            />
          </RevealOnScroll>

          {/* Past Grantees */}
          {grantees.length > 0 && (
            <RevealOnScroll delay={360}>
              <section className="mt-12">
                <h2 className="heading-md text-navy text-2xl font-bold mb-6">Past Grantees</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy/10">
                        <th className="text-left py-3 pr-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">Recipient</th>
                        <th className="text-left py-3 pr-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">Location</th>
                        <th className="text-right py-3 pr-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">Amount</th>
                        <th className="text-right py-3 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grantees.map((g) => {
                        const prefix = g.recipient_name ? slugifyName(g.recipient_name) : null
                        const matchedSlug = prefix ? granteeSlugMap.get(prefix) : undefined
                        return (
                        <tr key={g.id} className="border-b border-navy/5 hover:bg-navy/[0.02]">
                          <td className="py-3 pr-4 text-navy font-medium">
                            {matchedSlug ? (
                              <Link href={`/foundations/${matchedSlug}`} className="hover:text-brand-gold transition-colors hover:underline">
                                {g.recipient_name}
                              </Link>
                            ) : (
                              g.recipient_name || 'Unnamed'
                            )}
                            {g.purpose && (
                              <span className="block text-xs text-navy-light/50 mt-0.5 line-clamp-1">{g.purpose}</span>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-navy-light">
                            {[g.recipient_city, g.recipient_state].filter(Boolean).join(', ') || '—'}
                          </td>
                          <td className="py-3 pr-4 text-right text-navy font-medium tabular-nums">
                            {g.amount ? formatAssets(g.amount) : '—'}
                          </td>
                          <td className="py-3 text-right text-navy-light tabular-nums">
                            {g.grant_year ?? '—'}
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </RevealOnScroll>
          )}

          {/* See Similar Foundations */}
          {similar.length > 0 && (() => {
            const catLabel = getFoundationCategoryLabel(foundation)
            const catObj = FOUNDATION_CATEGORIES.find((c) => c.nteeMajors.includes(foundation.ntee_major ?? ''))
            const heading = catObj ? 'See Similar Foundations' : 'Foundations of Similar Size'
            return (
              <RevealOnScroll delay={400}>
                <section className="mt-12">
                  <h2 className="heading-md text-navy text-2xl font-bold mb-4">{heading}</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                    {similar.map((f) => (
                      <FoundationCard key={f.id} foundation={f} />
                    ))}
                  </div>
                  {catObj && (
                    <Link
                      href={`/foundations/${catObj.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
                    >
                      Browse all {catLabel} foundations
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </section>
              </RevealOnScroll>
            )
          })()}

          {/* Related (same state) */}
          {related.length > 0 && (
            <RevealOnScroll delay={440}>
              <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-md text-navy text-2xl font-bold">
                    More Foundations in {stateObj?.name ?? foundation.state}
                  </h2>
                  {stateObj && (
                    <Link
                      href={`/foundations/state/${stateObj.slug}`}
                      className="text-sm font-semibold text-brand-gold hover:underline hidden sm:inline-flex items-center gap-1"
                    >
                      View all
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((f) => (
                    <FoundationCard key={f.id} foundation={f} />
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          )}

          {/* CTA */}
          <RevealOnScroll delay={520}>
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

/* ── Page resolver ── */

export default async function FoundationSlugPage({ params }: Props) {
  // 1. Check category
  const category = getCategoryBySlug(params.slug)
  if (category) {
    const foundations = await getFoundationsByCategory(category.nteeMajors).catch((err) => { console.error(`[foundations/${params.slug}] getFoundationsByCategory failed:`, err); return [] })
    return <CategoryPage category={category} foundations={foundations} />
  }

  // 2. Check individual foundation
  const foundation = await getFoundationBySlug(params.slug).catch((err) => { console.error(`[foundations/${params.slug}] getFoundationBySlug failed:`, err); return null })
  if (foundation) {
    const similarFn = foundation.ntee_major
      ? getSimilarFoundations(foundation.ntee_major, foundation.slug, 6)
      : getSimilarFoundationsByAssets(foundation.asset_amount ?? 0, foundation.slug, 6)

    const [related, similar, allGrantees, financials, rfps] = await Promise.all([
      getRelatedFoundations(foundation.state, foundation.ntee_major, foundation.slug, 3).catch((err) => { console.error(`[foundations/${params.slug}] getRelatedFoundations failed:`, err); return [] }),
      similarFn.catch((err) => { console.error(`[foundations/${params.slug}] getSimilarFoundations failed:`, err); return [] }),
      getFoundationGrantees(foundation.id, 5000).catch((err) => { console.error(`[foundations/${params.slug}] getFoundationGrantees failed:`, err); return [] }),
      getFoundationFinancials(foundation.id).catch((err) => { console.error(`[foundations/${params.slug}] getFoundationFinancials failed:`, err); return [] }),
      getFoundationRfps(foundation.id).catch((err) => { console.error(`[foundations/${params.slug}] getFoundationRfps failed:`, err); return [] }),
    ])

    // Display table: one row per unique grantee (largest grant), top 50
    const seen = new Set<string>()
    const grantees = allGrantees.filter((g) => {
      const key = (g.recipient_name ?? '').toLowerCase().trim()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 50)

    // Only look up slugs for the 50 display grantees (not all 2000+ unique names)
    const displayPrefixes = [...new Set(
      grantees
        .map((g) => g.recipient_name ? slugifyName(g.recipient_name) : null)
        .filter((p): p is string => !!p)
    )]
    const [granteeSlugMap, rfpSlugMap] = await Promise.all([
      getFoundationSlugsByPrefixes(displayPrefixes).catch((err) => {
        console.error(`[foundations/${params.slug}] getFoundationSlugsByPrefixes failed:`, err)
        return new Map<string, string>()
      }),
      getPublicGrantSlugsForRfps(rfps.map((r) => r.name)).catch((err) => {
        console.error(`[foundations/${params.slug}] getPublicGrantSlugsForRfps failed:`, err)
        return new Map<string, string>()
      }),
    ])

    // Compute chart summaries server-side (only summaries sent to client, not 5000 raw records)
    const insightStats = computeGrantStats(allGrantees)
    const insightGivingByYear = computeGivingByYear(allGrantees).filter((y) => y.total > 0)
    const insightStateDistribution = computeStateDistribution(allGrantees)
    const insightNewGranteeInfo = computeNewGranteeRate(allGrantees)

    return (
      <FoundationDetailPage
        foundation={foundation}
        related={related}
        similar={similar}
        grantees={grantees}
        insightStats={insightStats}
        insightGivingByYear={insightGivingByYear}
        insightStateDistribution={insightStateDistribution}
        insightNewGranteeInfo={insightNewGranteeInfo}
        financials={financials}
        rfps={rfps}
        rfpSlugMap={rfpSlugMap}
        granteeSlugMap={granteeSlugMap}
      />
    )
  }

  // 3. Not found
  return notFound()
}
