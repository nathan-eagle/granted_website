import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import RevealOnScroll from '@/components/RevealOnScroll'
import GrantStatusBadge from '@/components/GrantStatusBadge'
import GrantCard from '@/components/GrantCard'
import GrantQuickFacts from '@/components/GrantQuickFacts'
import GrantBreadcrumbs from '@/components/GrantBreadcrumbs'
import GrantCTA from '@/components/GrantCTA'
import GrantFinderCTA from '@/components/GrantFinderCTA'
import CategoryGrantList from '@/components/CategoryGrantList'
import {
  getAllGrants,
  getGrantBySlug,
  getRelatedGrants,
  getCategoryBySlug,
  getGrantsForCategory,
  isGrantSeoReady,
  GRANT_CATEGORIES,
  type PublicGrant,
  type GrantCategory,
} from '@/lib/grants'
import {
  getPostsByGrantCategory,
  getPostsByAudienceCategory,
  getRelatedBlogPosts,
  type PostFrontmatter,
} from '@/lib/blog'
import RelatedBlogPosts from '@/components/RelatedBlogPosts'

export const revalidate = 86400

type Props = { params: { slug: string } }
type GrantFaq = { question: string; answer: string }

function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'rolling deadlines or periodic funding windows'
  return new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function splitIntoParagraphs(value: string): string[] {
  const normalized = value
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .trim()

  if (!normalized) return []

  const byBlankLine = normalized
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  if (byBlankLine.length > 1) return byBlankLine

  return normalized
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

function buildGrantFaq(grant: PublicGrant): GrantFaq[] {
  const deadlineText = formatDeadline(grant.deadline)
  const amountText = grant.amount ?? 'Funding amounts vary based on project scope and sponsor guidance.'
  const eligibilityText =
    grant.eligibility ??
    'Eligibility depends on the sponsor notice, legal entity requirements, and program-specific restrictions.'

  return [
    {
      question: `Who can apply for ${grant.name}?`,
      answer: `Based on current listing details, eligibility includes: ${eligibilityText} Applicants should confirm final requirements in the official notice before submission.`,
    },
    {
      question: `What is the typical funding level for ${grant.name}?`,
      answer: `Current published award information indicates ${amountText} Always verify allowable costs, matching requirements, and funding caps directly in the sponsor documentation.`,
    },
    {
      question: `When is the deadline for ${grant.name}?`,
      answer: `The current target date is ${deadlineText}. Build your timeline backwards from this date to cover registrations, approvals, attachments, and final submission checks.`,
    },
  ]
}

/* ── Static params ── */

export async function generateStaticParams() {
  const categoryParams = GRANT_CATEGORIES.map((c) => ({ slug: c.slug }))
  const grants = (await getAllGrants().catch(() => [])).filter((g) => isGrantSeoReady(g))
  const grantParams = grants.map((g) => ({ slug: g.slug }))
  return [...categoryParams, ...grantParams]
}

/* ── Metadata ── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  if (category) {
    const url = `https://grantedai.com/grants/${category.slug}`
    return {
      title: `${category.name} 2026 | Granted`,
      description: category.description,
      alternates: { canonical: url },
      openGraph: {
        title: category.name,
        description: category.description,
        url,
        siteName: 'Granted AI',
        type: 'website',
        images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: category.name }],
      },
      twitter: { card: 'summary_large_image', title: category.name, description: category.description },
    }
  }

  const grant = await getGrantBySlug(params.slug).catch(() => null)
  if (!grant) return {}
  if (!isGrantSeoReady(grant)) {
    return {
      robots: { index: false, follow: false },
    }
  }

  const year = grant.deadline ? new Date(grant.deadline).getFullYear() : 2026
  const title = `${grant.name} (${year})`
  const description = [
    grant.summary?.slice(0, 120),
    grant.amount ? `Up to ${grant.amount}.` : null,
    grant.deadline
      ? `Deadline: ${new Date(grant.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`
      : null,
  ]
    .filter(Boolean)
    .join(' ')
  const url = `https://grantedai.com/grants/${grant.slug}`

  return {
    title: `${title} | Granted`,
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

function CategoryPage({ category, grants, blogPosts }: { category: GrantCategory; grants: PublicGrant[]; blogPosts: { slug: string; frontmatter: PostFrontmatter }[] }) {
  return (
    <>
      <Header />
      <main>
        <section className={`${category.gradient} noise-overlay overflow-hidden`}>
          <Container className="py-20 md:py-28 relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-white/50 mb-4">
              {category.type === 'agency' ? 'Federal Agency' : 'Grant Category'}
            </p>
            <h1 className="heading-xl text-white max-w-2xl">{category.name}</h1>
            <p className="body-lg mt-4 text-white/50 max-w-xl">{category.description}</p>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {grants.length > 0 ? (
            <CategoryGrantList category={category} grants={grants} />
          ) : (
            <RevealOnScroll>
              <div className="text-center py-20">
                <p className="heading-md text-navy/60">More grants coming soon</p>
                <p className="body-lg text-navy-light/50 mt-3 max-w-md mx-auto">
                  We&apos;re adding new {category.name.toLowerCase()} regularly. Check back or start your
                  search with Granted AI.
                </p>
                <a
                  href="https://app.grantedai.com/api/auth/signin?callbackUrl=/overview"
                  className="button button-primary mt-8"
                >
                  Try Granted Free
                </a>
              </div>
            </RevealOnScroll>
          )}

          {grants.length > 0 && (
            <RevealOnScroll delay={160}>
              <div className="mt-10">
                <GrantFinderCTA />
              </div>
            </RevealOnScroll>
          )}

          {blogPosts.length > 0 && (
            <RevealOnScroll delay={200}>
              <RelatedBlogPosts
                posts={blogPosts}
                heading={`${category.name.replace(/^Grants for /, '')} Grant Writing Guides`}
              />
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

/* ── Grant detail layout ── */

function GrantDetailPage({ grant, related, blogPosts }: { grant: PublicGrant; related: PublicGrant[]; blogPosts: { slug: string; frontmatter: PostFrontmatter }[] }) {
  const year = grant.deadline ? new Date(grant.deadline).getFullYear() : 2026
  const url = `https://grantedai.com/grants/${grant.slug}`
  const faqs = buildGrantFaq(grant)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: grant.name,
    description: grant.summary,
    url,
    provider: { '@type': 'GovernmentOrganization', name: grant.funder },
    ...(grant.amount ? { offers: { '@type': 'Offer', price: grant.amount } } : {}),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const eligibilityItems = grant.eligibility
    ? grant.eligibility.split(/[;\n]/).map((s) => s.trim()).filter(Boolean)
    : []

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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />

          <RevealOnScroll>
            <GrantBreadcrumbs
              crumbs={[
                { label: grant.funder, href: `/grants/${grant.funder.toLowerCase().split(/[\s/]+/)[0]}` },
                { label: grant.name },
              ]}
            />
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <GrantStatusBadge status={grant.status} />
              <span className="text-sm text-navy-light/50">{grant.funder} &middot; {year}</span>
            </div>
            <h1 className="heading-xl text-navy">{grant.name}</h1>
          </RevealOnScroll>

          <RevealOnScroll delay={160}>
            <div className="mt-10">
              <GrantQuickFacts grant={grant} />
            </div>
          </RevealOnScroll>

          {grant.summary && (
            <RevealOnScroll delay={240}>
              <section className="mt-12">
                <h2 className="heading-md text-navy text-2xl font-bold mb-4">About This Grant</h2>
                <p className="body-lg text-navy-light leading-relaxed">{grant.summary}</p>
                {grant.rfp_url && (
                  <a
                    href={grant.rfp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-brand-gold hover:underline"
                  >
                    View Original RFP
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}
              </section>
            </RevealOnScroll>
          )}

          {grant.source_text && (
            <RevealOnScroll delay={280}>
              <section className="mt-12">
                <h2 className="heading-md text-navy text-2xl font-bold mb-4">Official Opportunity Details</h2>
                <p className="text-sm text-navy-light/70 mb-4">
                  Extracted from the official opportunity page/RFP to help you evaluate fit faster.
                </p>
                <div className="space-y-4">
                  {splitIntoParagraphs(grant.source_text).map((paragraph, index) => (
                    <p key={`${grant.id}-source-${index}`} className="body-lg text-navy-light leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          )}

          {eligibilityItems.length > 0 && (
            <RevealOnScroll delay={320}>
              <section className="mt-12">
                <h2 className="heading-md text-navy text-2xl font-bold mb-4">Eligibility Requirements</h2>
                <ul className="space-y-2">
                  {eligibilityItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 body-lg text-navy-light">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </RevealOnScroll>
          )}

          <RevealOnScroll delay={360}>
            <section className="mt-12">
              <h2 className="heading-md text-navy text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border border-navy/10 bg-white p-5">
                    <h3 className="text-base font-semibold text-navy">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-light">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll delay={400}>
            <div className="mt-16">
              <GrantCTA />
            </div>
          </RevealOnScroll>

          {related.length > 0 && (
            <RevealOnScroll delay={480}>
              <section className="mt-16">
                <h2 className="heading-md text-navy text-2xl font-bold mb-6">Related Grants</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((g) => (
                    <GrantCard key={g.id} grant={g} />
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          )}

          {blogPosts.length > 0 && (
            <RevealOnScroll delay={560}>
              <RelatedBlogPosts
                posts={blogPosts}
                heading={`${grant.funder} Grant Writing Tips`}
              />
            </RevealOnScroll>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}

/* ── Page resolver ── */

export default async function GrantSlugPage({ params }: Props) {
  // 1. Check category
  const category = getCategoryBySlug(params.slug)
  if (category) {
    const [grants, blogPosts] = await Promise.all([
      getGrantsForCategory(category).catch(() => []),
      (category.type === 'audience'
        ? getPostsByAudienceCategory(category.slug, 6)
        : getPostsByGrantCategory(category.slug, 6)
      ).catch(() => []),
    ])
    const readyGrants = grants.filter((g) => isGrantSeoReady(g))
    return <CategoryPage category={category} grants={readyGrants} blogPosts={blogPosts} />
  }

  // 2. Check individual grant
  const grant = await getGrantBySlug(params.slug).catch(() => null)
  if (grant) {
    if (!isGrantSeoReady(grant)) {
      return notFound()
    }
    const [related, blogPosts] = await Promise.all([
      getRelatedGrants(grant.funder, grant.slug, 3).catch(() => []),
      getRelatedBlogPosts(grant.funder, 3).catch(() => []),
    ])
    const readyRelated = related.filter((g) => isGrantSeoReady(g))
    return <GrantDetailPage grant={grant} related={readyRelated} blogPosts={blogPosts} />
  }

  // 3. Not found
  return notFound()
}
