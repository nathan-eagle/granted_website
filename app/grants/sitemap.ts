import type { MetadataRoute } from 'next'
import { GRANT_CATEGORIES, GRANT_US_STATES } from '@/lib/grants'
import { supabase } from '@/lib/supabase'

// Regenerate every hour so data stays fresh (build-time queries timeout on Supabase free tier)
export const revalidate = 3600

const GRANTS_PER_SITEMAP = 50_000

/**
 * Generate a sitemap index so all ~70K grants get indexed.
 * Hardcoded to 2 chunks to avoid DB queries at build time (which timeout on Vercel).
 * Bump if grants exceed 100K.
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }]
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
