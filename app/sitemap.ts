import type { MetadataRoute } from 'next'
import { listPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://grantedai.com'
  const now = new Date().toISOString()

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: 'weekly', lastModified: now },
    { url: `${base}/features`, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/pricing`, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/faq`, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/tech`, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/contact`, changeFrequency: 'yearly', lastModified: now },
    { url: `${base}/blog`, priority: 0.9, changeFrequency: 'weekly', lastModified: now },
  ]

  const posts = await listPosts().catch(() => [])
  const blogPaths: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${base}/blog/${p.slug}`,
    changeFrequency: 'monthly' as const,
    lastModified: p.frontmatter.date || now,
  }))

  return [...staticPaths, ...blogPaths]
}
