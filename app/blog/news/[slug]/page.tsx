import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getPublishedStory } from '@/lib/newsjack'
import { readingTime, stripMarkdown } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogStickyCTA from '@/components/BlogStickyCTA'
import GrantFinderCTA from '@/components/GrantFinderCTA'

export const revalidate = 3600

type Params = { params: { slug: string } }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const story = await getPublishedStory(params.slug)
  if (!story) return {}

  const url = `https://grantedai.com/blog/news/${params.slug}`
  return {
    title: `${story.title} | Granted AI`,
    description: story.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: story.title,
      description: story.meta_description,
      url,
      siteName: 'Granted AI',
      type: 'article',
      images: [{ url: 'https://grantedai.com/opengraph-image.png', width: 1200, height: 630, alt: story.title }],
      publishedTime: story.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.meta_description,
    },
  }
}

export default async function NewsjackPost({ params }: Params) {
  const story = await getPublishedStory(params.slug)
  if (!story) return notFound()

  const minutes = readingTime(story.content_markdown)
  const url = `https://grantedai.com/blog/news/${params.slug}`
  const description = story.meta_description || stripMarkdown(story.content_markdown).slice(0, 160)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: story.title,
    description,
    url,
    datePublished: story.published_at,
    publisher: {
      '@type': 'Organization',
      name: 'Granted AI',
      url: 'https://grantedai.com',
    },
    author: { '@type': 'Person', name: story.author || 'Arthur Griffin' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://grantedai.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://grantedai.com/blog' },
      { '@type': 'ListItem', position: 3, name: 'News', item: 'https://grantedai.com/blog' },
      { '@type': 'ListItem', position: 4, name: story.title, item: url },
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
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-800">
              News
            </span>
            {story.category && story.category !== 'News' && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {story.category}
              </span>
            )}
          </div>
          <h1>{story.title}</h1>
          <div className="flex items-center justify-between -mt-4">
            <p className="text-sm text-slate-500">
              {new Date(story.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              {minutes} min read
            </p>
            <p className="text-sm text-slate-500 font-medium">{story.author || 'Arthur Griffin'}</p>
          </div>
          <MDXRemote source={story.content_markdown} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
        </article>

        {/* ── Post bottom section ── */}
        <div className="mt-12 border-t pt-8 space-y-10">
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
