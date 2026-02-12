import type { MetadataRoute } from 'next'
import {
  getFoundationCount,
  getFoundationSlugsPage,
  FOUNDATION_CATEGORIES,
  US_STATES,
} from '@/lib/foundations'

export const revalidate = 3600

const FOUNDATIONS_PER_SITEMAP = 50_000

/**
 * Generate a sitemap index so all ~133K foundations get indexed.
 * Requires Supabase PostgREST max_rows >= 50000.
 */
export async function generateSitemaps() {
  const total = await getFoundationCount().catch((err) => { console.error('[foundations/sitemap] getFoundationCount failed:', err); return 0 })
  const chunks = Math.max(1, Math.ceil(total / FOUNDATIONS_PER_SITEMAP))
  return Array.from({ length: chunks }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const base = 'https://grantedai.com'
  const now = new Date().toISOString()

  const entries: MetadataRoute.Sitemap = []

  // First chunk includes index, categories, and state pages
  if (id === 0) {
    entries.push({
      url: `${base}/foundations`,
      priority: 0.9,
      changeFrequency: 'daily',
      lastModified: now,
    })

    for (const c of FOUNDATION_CATEGORIES) {
      entries.push({
        url: `${base}/foundations/${c.slug}`,
        priority: 0.9,
        changeFrequency: 'weekly',
        lastModified: now,
      })
    }

    for (const s of US_STATES) {
      entries.push({
        url: `${base}/foundations/state/${s.slug}`,
        priority: 0.8,
        changeFrequency: 'weekly',
        lastModified: now,
      })
    }
  }

  // Foundation pages for this chunk
  const offset = id * FOUNDATIONS_PER_SITEMAP
  const slugs = await getFoundationSlugsPage(offset, FOUNDATIONS_PER_SITEMAP).catch((err) => { console.error(`[foundations/sitemap] getFoundationSlugsPage(${offset}) failed:`, err); return [] })

  for (const f of slugs) {
    entries.push({
      url: `${base}/foundations/${f.slug}`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: f.updated_at ? new Date(f.updated_at).toISOString() : now,
    })
  }

  return entries
}
