import type { Metadata } from 'next'
import Link from 'next/link'
import { listPosts, getPost, deriveDescription, readingTime } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Grant Writing Blog',
  description: 'Expert tips on writing NIH, NSF, SBIR, EPA, NOAA, DARPA, USDA, and tribal grant proposals. Learn from successful strategies and avoid common mistakes.',
  alternates: { canonical: 'https://grantedai.com/blog' },
  openGraph: {
    title: 'Grant Writing Blog',
    description: 'Expert tips on writing NIH, NSF, SBIR, EPA, NOAA, DARPA, USDA, and tribal grant proposals.',
    url: 'https://grantedai.com/blog',
    siteName: 'Granted AI',
    type: 'website',
  },
}

function detectCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('sbir')) return 'SBIR'
  if (t.includes('nih')) return 'NIH'
  if (t.includes('nsf')) return 'NSF'
  if (t.includes('epa') || t.includes('environmental justice')) return 'EPA'
  if (t.includes('noaa') || t.includes('marine debris') || t.includes('coastal')) return 'NOAA'
  if (t.includes('darpa') || t.includes('defense') || t.includes('dod')) return 'DARPA'
  if (t.includes('usda') || t.includes('rural development') || t.includes('community facilit')) return 'USDA'
  if (t.includes('tribal') || t.includes('indigenous') || t.includes('tcup')) return 'Tribal'
  return 'Tips'
}

const CATEGORY_COLORS: Record<string, string> = {
  NIH: 'bg-blue-100 text-blue-800',
  NSF: 'bg-emerald-100 text-emerald-800',
  SBIR: 'bg-purple-100 text-purple-800',
  EPA: 'bg-teal-100 text-teal-800',
  NOAA: 'bg-cyan-100 text-cyan-800',
  DARPA: 'bg-slate-100 text-slate-800',
  USDA: 'bg-lime-100 text-lime-800',
  Tribal: 'bg-orange-100 text-orange-800',
  Tips: 'bg-amber-100 text-amber-800',
}

const CATEGORY_HEADERS: Record<string, string> = {
  NIH: 'blog-header-nih',
  NSF: 'blog-header-nsf',
  SBIR: 'blog-header-sbir',
  EPA: 'blog-header-epa',
  NOAA: 'blog-header-noaa',
  DARPA: 'blog-header-darpa',
  USDA: 'blog-header-usda',
  Tribal: 'blog-header-tribal',
  Tips: 'blog-header-tips',
}

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  NIH: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  NSF: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  SBIR: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  EPA: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M7 12h10M12 7v10" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  ),
  NOAA: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <path d="M2 12c2-3 4-4 6-4s4 4 6 4 4-4 6-4" />
      <path d="M2 17c2-3 4-4 6-4s4 4 6 4 4-4 6-4" />
      <path d="M2 7c2-3 4-4 6-4s4 4 6 4 4-4 6-4" />
    </svg>
  ),
  DARPA: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
    </svg>
  ),
  USDA: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <path d="M12 2v8M5 6c0 4 3.5 7 7 7s7-3 7-7" />
      <path d="M3 22v-4c0-2 2-3 4-3h10c2 0 4 1 4 3v4" />
      <line x1="3" y1="22" x2="21" y2="22" />
    </svg>
  ),
  Tribal: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <path d="M12 2L8 10l-6 2 4 5-1 7 7-3 7 3-1-7 4-5-6-2z" />
    </svg>
  ),
  Tips: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
      <path d="M12 2a7 7 0 0 1 4 12.75V17H8v-2.25A7 7 0 0 1 12 2z" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  ),
}

export default async function BlogIndex() {
  const postList = await listPosts().catch(() => [])

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

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-navy noise-overlay overflow-hidden">
          <Container className="py-20 md:py-28 relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-brand-yellow/80 mb-4">
              Grant Writing Blog
            </p>
            <h1 className="heading-xl text-white max-w-2xl">Expert advice for every grant — from EPA to DARPA</h1>
            <p className="body-lg mt-4 text-white/50 max-w-xl">
              Strategies, tips, and deep dives on writing winning grant proposals.
            </p>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {/* ── Featured post ── */}
          {featured && (
            <article className="mb-16">
              <Link href={`/blog/${featured.slug}`} className="group block">
                <div className={`${CATEGORY_HEADERS[featured.category]} rounded-2xl p-8 md:p-12 mb-6 relative overflow-hidden`}>
                  <div className="relative z-10 flex items-end justify-between gap-8">
                    <div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[featured.category]}`}>
                        {featured.category}
                      </span>
                      <h2 className="heading-lg text-white mt-4 group-hover:text-brand-yellow transition-colors">
                        {featured.frontmatter.title || featured.slug}
                      </h2>
                      <p className="body-lg text-white/60 mt-3 max-w-2xl line-clamp-2">{featured.description}</p>
                    </div>
                    <div className="hidden md:block flex-shrink-0 opacity-40">
                      {CATEGORY_ICONS[featured.category]}
                    </div>
                  </div>
                  {/* Abstract pattern overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  }} />
                </div>
                <div className="flex items-center gap-4 text-sm text-navy-light/60">
                  <span>{featured.minutes} min read</span>
                  {featured.frontmatter.date && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-navy-light/30" />
                      <span>{new Date(featured.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </>
                  )}
                </div>
              </Link>
            </article>
          )}

          {/* ── Post grid ── */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(p => (
              <article key={p.slug} className="group flex flex-col card card-hover overflow-hidden">
                {/* Category header band */}
                <div className={`${CATEGORY_HEADERS[p.category]} px-6 py-4 flex items-center justify-between`}>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[p.category]}`}>
                    {p.category}
                  </span>
                  <span className="text-xs text-white/40">{p.minutes} min read</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <Link href={`/blog/${p.slug}`} className="text-lg font-semibold text-navy group-hover:text-brand-gold transition-colors leading-snug">
                    {p.frontmatter.title || p.slug}
                  </Link>
                  <p className="text-sm text-navy-light mt-3 line-clamp-3 flex-1">{p.description}</p>
                  {p.frontmatter.date && (
                    <div className="text-xs text-navy-light/40 mt-4 pt-4 border-t border-navy/5">
                      {new Date(p.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {posts.length === 0 && <div className="text-navy-light col-span-full text-center py-20">No posts yet.</div>}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
