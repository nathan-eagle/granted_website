import type { MetadataRoute } from 'next'
import { getAllGrants, isGrantSeoReady, GRANT_CATEGORIES, GRANT_US_STATES } from '@/lib/grants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://grantedai.com'
  const now = new Date().toISOString()

  // Static entries — always returned, even during DB outages
  const index: MetadataRoute.Sitemap = [
    { url: `${base}/grants`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
  ]

  const timely: MetadataRoute.Sitemap = [
    { url: `${base}/grants/closing-soon`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
    { url: `${base}/grants/new`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
  ]

  const categories: MetadataRoute.Sitemap = GRANT_CATEGORIES.map((c) => ({
    url: `${base}/grants/${c.slug}`,
    priority: 0.9,
    changeFrequency: 'weekly' as const,
    lastModified: now,
  }))

  const states: MetadataRoute.Sitemap = GRANT_US_STATES.map((s) => ({
    url: `${base}/grants/state/${s.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
    lastModified: now,
  }))

  const staticEntries = [...index, ...timely, ...categories, ...states]

  // Dynamic entries — log and degrade gracefully on DB failure
  let grantPages: MetadataRoute.Sitemap = []
  try {
    const grants = (await getAllGrants()).filter((g) => isGrantSeoReady(g))
    grantPages = grants.map((g) => {
      const freq: 'weekly' | 'monthly' = g.status === 'active' ? 'weekly' : 'monthly'
      return {
        url: `${base}/grants/${g.slug}`,
        priority: g.status === 'active' ? 0.8 : 0.5,
        changeFrequency: freq,
        lastModified: g.updated_at ? new Date(g.updated_at).toISOString() : now,
      }
    })
  } catch (err) {
    console.error('[grants/sitemap] getAllGrants failed — returning static entries only:', err)
  }

  return [...staticEntries, ...grantPages]
}
