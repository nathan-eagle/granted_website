import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getPost, hasPost, listPosts, deriveDescription, readingTime, detectCategory, grantSlugForCategory } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogStickyCTA from '@/components/BlogStickyCTA'
import RelatedBlogPosts from '@/components/RelatedBlogPosts'
import GrantFinderCTA from '@/components/GrantFinderCTA'

type Params = { params: { slug: string } }

export async function generateStaticParams() {
  const posts = await listPosts().catch(() => [])
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const exists = await hasPost(params.slug)
  if (!exists) return {}
  const { frontmatter, content } = await getPost(params.slug)
  const title = frontmatter.title || params.slug
  const description = deriveDescription(frontmatter, content)
  const url = `https://grantedai.com/blog/${params.slug}`

  return {
    title: `${title} | Granted AI`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Granted AI',
      type: 'article',
      images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: title }],
      ...(frontmatter.date ? { publishedTime: frontmatter.date } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogPost({ params }: Params) {
  const exists = await hasPost(params.slug)
  if (!exists) return notFound()
  const { frontmatter, content } = await getPost(params.slug)
  const title = frontmatter.title || params.slug
  const description = deriveDescription(frontmatter, content)
  const minutes = readingTime(content)
  const url = `https://grantedai.com/blog/${params.slug}`

  const category = detectCategory(title)
  const grantSlug = grantSlugForCategory(category)

  // Get related posts from same category (excluding current)
  const allPosts = await listPosts().catch(() => [])
  const relatedPosts = allPosts
    .filter((p) => p.slug !== params.slug && detectCategory(p.frontmatter.title || p.slug) === category)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Granted AI',
      url: 'https://grantedai.com',
    },
    ...(frontmatter.date ? { datePublished: frontmatter.date } : {}),
    ...(frontmatter.author ? { author: { '@type': 'Person', name: frontmatter.author } } : {}),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://grantedai.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://grantedai.com/blog' },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  }

  return (
    <>
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <article className="prose prose-slate max-w-none">
          <h1>{title}</h1>
          <div className="flex items-center justify-between -mt-4">
            <p className="text-sm text-slate-500">
              {frontmatter.date && (
                <>
                  {new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {' · '}
                </>
              )}
              {minutes} min read
            </p>
            {frontmatter.author && (
              <p className="text-sm text-slate-500 font-medium">{frontmatter.author}</p>
            )}
          </div>
          <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
        </article>
        {/* ── Post bottom section ── */}
        <div className="mt-12 border-t pt-8 space-y-10">
          {grantSlug && (
            <a
              href={`/grants/${grantSlug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:underline"
            >
              Browse all {category} grants
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}

          {relatedPosts.length > 0 && (
            <RelatedBlogPosts posts={relatedPosts} heading={`More ${category} Articles`} />
          )}

          <GrantFinderCTA />

          <div className="text-center pt-4">
            <p className="text-lg font-semibold text-slate-900">Ready to write your next grant?</p>
            <p className="mt-1 text-slate-600">Let Granted AI draft your proposal in minutes.</p>
            <a
              href="https://app.grantedai.com/api/auth/signin?callbackUrl=/overview"
              className="mt-4 inline-block rounded-md bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              Try Granted Free
            </a>
          </div>
        </div>
      </section>
      <BlogStickyCTA />
      <Footer />
    </>
  )
}
