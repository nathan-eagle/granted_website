import type { MetadataRoute } from 'next'
import { getGrantCount, getGrantSlugsPage, hasSeoSummary, GRANT_CATEGORIES, GRANT_US_STATES } from '@/lib/grants'

const GRANTS_PER_SITEMAP = 10_000

/**
 * Generate a sitemap index so all ~64K grants get indexed.
 * Smaller chunks (10K) avoid Vercel function timeouts from sequential Supabase fetches.
 */
export async function generateSitemaps() {
  const total = await getGrantCount(true).catch((err) => { console.error('[grants/sitemap] getGrantCount failed:', err); return 0 })
  const chunks = Math.max(1, Math.ceil(total / GRANTS_PER_SITEMAP))
  return Array.from({ length: chunks }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const base = 'https://grantedai.com'
  const now = new Date().toISOString()

  const entries: MetadataRoute.Sitemap = []

  // First chunk includes index, categories, and state pages
  if (id === 0) {
    entries.push(
      { url: `${base}/grants`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
      { url: `${base}/grants/closing-soon`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
      { url: `${base}/grants/new`, priority: 0.9, changeFrequency: 'daily', lastModified: now },
    )

    for (const c of GRANT_CATEGORIES) {
      entries.push({
        url: `${base}/grants/${c.slug}`,
        priority: 0.9,
        changeFrequency: 'weekly' as const,
        lastModified: now,
      })
    }

    for (const s of GRANT_US_STATES) {
      entries.push({
        url: `${base}/grants/state/${s.slug}`,
        priority: 0.8,
        changeFrequency: 'weekly' as const,
        lastModified: now,
      })
    }
  }

  // Grant pages for this chunk (including closed grants)
  const offset = id * GRANTS_PER_SITEMAP
  const slugs = await getGrantSlugsPage(offset, GRANTS_PER_SITEMAP, true).catch((err) => {
    console.error(`[grants/sitemap] getGrantSlugsPage(${offset}) failed:`, err)
    return []
  })

  for (const g of slugs) {
    if (!hasSeoSummary(g.summary)) continue
    const isActive = g.status === 'active'
    entries.push({
      url: `${base}/grants/${g.slug}`,
      priority: isActive ? 0.8 : 0.5,
      changeFrequency: isActive ? 'weekly' : 'monthly',
      lastModified: g.updated_at ? new Date(g.updated_at).toISOString() : now,
    })
  }

  return entries
}
