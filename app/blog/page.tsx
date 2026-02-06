import type { Metadata } from 'next'
import Link from 'next/link'
import { listPosts, getPost, deriveDescription, readingTime } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Grant Writing Blog | Granted AI',
  description: 'Expert tips on writing NIH, NSF, and SBIR grant proposals. Learn from successful strategies and avoid common mistakes.',
  alternates: { canonical: 'https://grantedai.com/blog' },
  openGraph: {
    title: 'Grant Writing Blog | Granted AI',
    description: 'Expert tips on writing NIH, NSF, and SBIR grant proposals.',
    url: 'https://grantedai.com/blog',
    siteName: 'Granted AI',
    type: 'website',
  },
}

// Simple category detection from title
function detectCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('sbir')) return 'SBIR'
  if (t.includes('nih')) return 'NIH'
  if (t.includes('nsf')) return 'NSF'
  return 'Tips'
}

const CATEGORY_COLORS: Record<string, string> = {
  NIH: 'bg-blue-100 text-blue-800',
  NSF: 'bg-emerald-100 text-emerald-800',
  SBIR: 'bg-purple-100 text-purple-800',
  Tips: 'bg-amber-100 text-amber-800',
}

export default async function BlogIndex() {
  const postList = await listPosts().catch(() => [])

  // Load content for descriptions and reading time
  const posts = await Promise.all(
    postList.map(async (p) => {
      const { content } = await getPost(p.slug)
      return {
        ...p,
        description: deriveDescription(p.frontmatter, content),
        minutes: readingTime(content),
        category: detectCategory(p.frontmatter.title || p.slug),
      }
    })
  )

  return (
    <>
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-slate-600 mb-10">Expert advice on grant proposal writing for NIH, NSF, SBIR, and beyond.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(p => (
            <article key={p.slug} className="group flex flex-col border rounded-xl p-6 transition-shadow hover:shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[p.category]}`}>
                  {p.category}
                </span>
                <span className="text-xs text-slate-400">{p.minutes} min read</span>
              </div>
              <Link href={`/blog/${p.slug}`} className="text-lg font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors leading-snug">
                {p.frontmatter.title || p.slug}
              </Link>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3 flex-1">{p.description}</p>
              {p.frontmatter.date && (
                <div className="text-xs text-slate-400 mt-4">
                  {new Date(p.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              )}
            </article>
          ))}
          {posts.length === 0 && <div className="text-gray-600 col-span-full">No posts yet.</div>}
        </div>
      </section>
      <Footer />
    </>
  )
}
