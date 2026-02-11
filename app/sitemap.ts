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
    { url: `${base}/privacy`, changeFrequency: 'yearly', lastModified: now },
    { url: `${base}/terms`, changeFrequency: 'yearly', lastModified: now },
    { url: `${base}/security`, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/blog`, priority: 0.9, changeFrequency: 'weekly', lastModified: now },
    { url: `${base}/grants`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
    // Audience landing pages
    { url: `${base}/for/nonprofits`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/for/researchers`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/for/sbir`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/for/scholarships`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    // Comparison pages
    { url: `${base}/compare/grant-writers`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/compare/grantboost`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/compare/doing-it-yourself`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/compare/grantable`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/compare/instrumentl`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/compare/chatgpt`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    // Interactive tools
    { url: `${base}/tools/readiness-quiz`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/tools/deadlines`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/tools/cost-calculator`, priority: 0.8, changeFrequency: 'monthly', lastModified: now },
  ]

  const posts = await listPosts().catch((err) => { console.error('[sitemap] listPosts failed:', err); return [] })
  const blogPaths: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${base}/blog/${p.slug}`,
    changeFrequency: 'monthly' as const,
    lastModified: p.frontmatter.date ? new Date(p.frontmatter.date).toISOString() : now,
  }))

  return [...staticPaths, ...blogPaths]
}
