import Link from 'next/link'
import type { PostFrontmatter } from '@/lib/blog'

type Props = {
  posts: { slug: string; frontmatter: PostFrontmatter }[]
  heading?: string
}

export default function RelatedBlogPosts({ posts, heading = 'Related Articles' }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="heading-md text-navy text-2xl font-bold mb-6">{heading}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block rounded-2xl border border-navy/8 bg-white p-6 transition-all hover:border-brand-yellow/40 hover:shadow-lg"
          >
            <h3 className="text-base font-semibold text-navy leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
              {p.frontmatter.title || p.slug}
            </h3>
            {p.frontmatter.description && (
              <p className="text-sm text-navy-light mt-2 line-clamp-2">{p.frontmatter.description}</p>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-gold mt-3">
              Read article
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
