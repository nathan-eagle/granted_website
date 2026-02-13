import type { MetadataRoute } from 'next'
import { GRANT_CATEGORIES, GRANT_US_STATES, getGrantCount } from '@/lib/grants'
import { supabase } from '@/lib/supabase'

// Regenerate every hour so data stays fresh (build-time queries timeout on Supabase free tier)
export const revalidate = 3600

// Keep well under the 50,000 URL / 50 MB sitemap protocol limits.
// Smaller chunks = faster Supabase queries = reliable serving on Vercel serverless.
const GRANTS_PER_SITEMAP = 10_000

/**
 * Generate a sitemap index so all grants get indexed.
 * Dynamically computes chunk count from DB to handle growth automatically.
 */
export async function generateSitemaps() {
  const total = await getGrantCount(true).catch((err) => {
    console.error('[grants/sitemap] getGrantCount failed:', err)
    return 80_000 // fallback estimate — produces 8 chunks
  })
  const chunks = Math.max(1, Math.ceil(total / GRANTS_PER_SITEMAP))
  return Array.from({ length: chunks }, (_, i) => ({ id: i }))
}

async function getGrantSitemapSlugs(offset: number, limit: number) {
  if (!supabase) return []
  // Use created_at ordering (faster than deadline) and exclude summary to avoid timeouts
  const { data, error } = await supabase
    .from('public_grants')
    .select('slug, status, updated_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data ?? []
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
  const slugs = await getGrantSitemapSlugs(offset, GRANTS_PER_SITEMAP).catch((err) => {
    console.error(`[grants/sitemap] getGrantSitemapSlugs(${offset}) failed:`, err)
    return []
  })

  for (const g of slugs) {
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
