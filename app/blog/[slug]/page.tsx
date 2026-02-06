import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getPost, hasPost, listPosts, deriveDescription, readingTime } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  }

  return (
    <>
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="prose prose-slate max-w-none">
          <h1>{title}</h1>
          {frontmatter.date && (
            <p className="text-sm text-slate-500 -mt-4">
              {new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              {minutes} min read
            </p>
          )}
          {!frontmatter.date && (
            <p className="text-sm text-slate-500 -mt-4">{minutes} min read</p>
          )}
          <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
        </article>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Ready to write your next grant?</p>
          <p className="mt-1 text-slate-600">Let Granted AI draft your proposal in minutes.</p>
          <a
            href="https://app.grantedai.com/api/auth/signin?callbackUrl=/overview"
            className="mt-4 inline-block rounded-md bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Try Granted Free
          </a>
        </div>
      </section>
      <Footer />
    </>
  )
}
