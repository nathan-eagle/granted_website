import { supabase } from './supabase'

/* ── Types ── */

export type PublicGrant = {
  id: string
  slug: string
  name: string
  funder: string
  deadline: string | null
  amount: string | null
  summary: string | null
  eligibility: string | null
  rfp_url: string | null
  status: 'active' | 'closed' | 'upcoming'
  source: string
  citations: unknown[]
  last_verified_at: string | null
  created_at: string
  updated_at: string
}

export const SEO_SUMMARY_MIN_WORDS = 300
export const SEO_FRESHNESS_DAYS = 30

function wordCount(value: string | null | undefined): number {
  if (!value) return 0
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function hasSeoSummary(summary: string | null): boolean {
  return wordCount(summary) >= SEO_SUMMARY_MIN_WORDS
}

export function isGrantFresh(lastVerifiedAt: string | null): boolean {
  if (!lastVerifiedAt) return false
  const parsed = Date.parse(lastVerifiedAt)
  if (Number.isNaN(parsed)) return false
  const ageMs = Date.now() - parsed
  return ageMs <= SEO_FRESHNESS_DAYS * 24 * 60 * 60 * 1000
}

export function isGrantSeoReady(grant: Pick<PublicGrant, 'summary' | 'last_verified_at'>): boolean {
  return hasSeoSummary(grant.summary) && isGrantFresh(grant.last_verified_at)
}

/* ── Data functions ── */

export async function getAllGrants(): Promise<PublicGrant[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('public_grants')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data ?? []
}

export async function getGrantBySlug(slug: string): Promise<PublicGrant | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('public_grants')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getGrantsByFunder(funder: string): Promise<PublicGrant[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('public_grants')
    .select('*')
    .ilike('funder', `%${funder}%`)
    .order('deadline', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data ?? []
}

export async function getActiveGrants(limit?: number): Promise<PublicGrant[]> {
  if (!supabase) return []
  let query = supabase
    .from('public_grants')
    .select('*')
    .eq('status', 'active')
    .order('deadline', { ascending: true, nullsFirst: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getRelatedGrants(
  funder: string,
  excludeSlug: string,
  limit = 3,
): Promise<PublicGrant[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('public_grants')
    .select('*')
    .ilike('funder', `%${funder}%`)
    .neq('slug', excludeSlug)
    .order('deadline', { ascending: true, nullsFirst: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

/* ── Category config ── */

export type GrantCategory = {
  slug: string
  name: string
  description: string
  type: 'agency' | 'audience' | 'topic'
  funderMatch?: string
  eligibilityMatch?: string
  topicKeywords?: string[]
  gradient: string
}

export const GRANT_CATEGORIES: GrantCategory[] = [
  // Agency categories
  {
    slug: 'nih',
    name: 'NIH Grants',
    description: 'National Institutes of Health funding opportunities for biomedical and public health research.',
    type: 'agency',
    funderMatch: 'NIH',
    gradient: 'blog-header-nih',
  },
  {
    slug: 'nsf',
    name: 'NSF Grants',
    description: 'National Science Foundation awards supporting fundamental research and education across all fields of science and engineering.',
    type: 'agency',
    funderMatch: 'NSF',
    gradient: 'blog-header-nsf',
  },
  {
    slug: 'epa',
    name: 'EPA Grants',
    description: 'Environmental Protection Agency grants for environmental justice, community change, and pollution prevention.',
    type: 'agency',
    funderMatch: 'EPA',
    gradient: 'blog-header-epa',
  },
  {
    slug: 'usda',
    name: 'USDA Grants',
    description: 'U.S. Department of Agriculture funding for rural development, community facilities, and agricultural research.',
    type: 'agency',
    funderMatch: 'USDA',
    gradient: 'blog-header-usda',
  },
  {
    slug: 'doe',
    name: 'DOE Grants',
    description: 'Department of Energy grants for clean energy, advanced manufacturing, and scientific research.',
    type: 'agency',
    funderMatch: 'DOE',
    gradient: 'blog-header-nih',
  },
  {
    slug: 'darpa',
    name: 'DARPA Grants',
    description: 'Defense Advanced Research Projects Agency awards for breakthrough technologies and national security innovation.',
    type: 'agency',
    funderMatch: 'DARPA',
    gradient: 'blog-header-darpa',
  },
  {
    slug: 'noaa',
    name: 'NOAA Grants',
    description: 'National Oceanic and Atmospheric Administration funding for ocean, coastal, and atmospheric science.',
    type: 'agency',
    funderMatch: 'NOAA',
    gradient: 'blog-header-noaa',
  },
  {
    slug: 'hud',
    name: 'HUD Grants',
    description: 'Department of Housing and Urban Development grants for affordable housing and community development.',
    type: 'agency',
    funderMatch: 'HUD',
    gradient: 'blog-header-darpa',
  },
  // Audience categories
  {
    slug: 'nonprofits',
    name: 'Grants for Nonprofits',
    description: 'Federal and foundation grants available to 501(c)(3) nonprofit organizations.',
    type: 'audience',
    eligibilityMatch: 'nonprofit',
    gradient: 'blog-header-tips',
  },
  {
    slug: 'small-business',
    name: 'Small Business Grants',
    description: 'SBIR, STTR, and other grants designed for small businesses and startups.',
    type: 'audience',
    eligibilityMatch: 'small business',
    gradient: 'blog-header-sbir',
  },
  {
    slug: 'researchers',
    name: 'Grants for Researchers',
    description: 'Academic and independent research funding from NIH, NSF, DOE, and more.',
    type: 'audience',
    eligibilityMatch: 'research',
    gradient: 'blog-header-nsf',
  },
  {
    slug: 'tribal',
    name: 'Tribal Grants',
    description: 'Federal grants for tribal nations, tribal colleges, and Indigenous-serving organizations.',
    type: 'audience',
    eligibilityMatch: 'tribal',
    gradient: 'blog-header-tribal',
  },
  // Topic categories
  {
    slug: 'environmental-justice',
    name: 'Environmental Justice Grants',
    description: 'Grant opportunities supporting environmental justice, pollution reduction, and community health outcomes.',
    type: 'topic',
    topicKeywords: ['environmental justice', 'pollution', 'brownfield', 'clean air', 'clean water', 'community health'],
    gradient: 'blog-header-epa',
  },
  {
    slug: 'clean-energy',
    name: 'Clean Energy Grants',
    description: 'Funding opportunities for clean energy deployment, efficiency, and climate technology projects.',
    type: 'topic',
    topicKeywords: ['clean energy', 'renewable', 'energy efficiency', 'decarbonization', 'climate', 'solar'],
    gradient: 'blog-header-noaa',
  },
]

export function getCategoryBySlug(slug: string): GrantCategory | undefined {
  return GRANT_CATEGORIES.find((c) => c.slug === slug)
}

export async function getGrantsForCategory(
  category: GrantCategory,
): Promise<PublicGrant[]> {
  if (!supabase) return []

  if (category.topicKeywords && category.topicKeywords.length > 0) {
    const all = await getAllGrants()
    const keywords = category.topicKeywords.map((k) => k.toLowerCase())
    return all.filter((grant) => {
      const haystack = [
        grant.name,
        grant.funder,
        grant.summary ?? '',
        grant.eligibility ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return keywords.some((keyword) => haystack.includes(keyword))
    })
  }

  if (category.funderMatch) {
    return getGrantsByFunder(category.funderMatch)
  }
  if (category.eligibilityMatch) {
    const { data, error } = await supabase
      .from('public_grants')
      .select('*')
      .ilike('eligibility', `%${category.eligibilityMatch}%`)
      .order('deadline', { ascending: true, nullsFirst: false })
    if (error) throw error
    return data ?? []
  }
  return []
}
