import type { MetadataRoute } from 'next'
import { getAllGrants, isGrantSeoReady, GRANT_CATEGORIES, GRANT_US_STATES } from '@/lib/grants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://grantedai.com'
  const now = new Date().toISOString()

  // Index page
  const index: MetadataRoute.Sitemap = [
    { url: `${base}/grants`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
  ]

  // Closing-soon and new pages (high-value, update daily)
  const timely: MetadataRoute.Sitemap = [
    { url: `${base}/grants/closing-soon`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
    { url: `${base}/grants/new`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
  ]

  // Category pages
  const categories: MetadataRoute.Sitemap = GRANT_CATEGORIES.map((c) => ({
    url: `${base}/grants/${c.slug}`,
    priority: 0.9,
    changeFrequency: 'weekly' as const,
    lastModified: now,
  }))

  // State facet pages
  const states: MetadataRoute.Sitemap = GRANT_US_STATES.map((s) => ({
    url: `${base}/grants/state/${s.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
    lastModified: now,
  }))

  // Individual grant pages
  const grants = (await getAllGrants().catch(() => [])).filter((g) => isGrantSeoReady(g))
  const grantPages: MetadataRoute.Sitemap = grants.map((g) => {
    const freq: 'weekly' | 'monthly' = g.status === 'active' ? 'weekly' : 'monthly'
    return {
      url: `${base}/grants/${g.slug}`,
      priority: g.status === 'active' ? 0.8 : 0.5,
      changeFrequency: freq,
      lastModified: g.updated_at ? new Date(g.updated_at).toISOString() : now,
    }
  })

  return [...index, ...timely, ...categories, ...states, ...grantPages]
}
