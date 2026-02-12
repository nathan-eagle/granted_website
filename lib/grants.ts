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
  source_text: string | null
  eligibility: string | null
  rfp_url: string | null
  status: 'active' | 'closed' | 'upcoming'
  source: string
  source_provider?: string
  citations: unknown[]
  last_verified_at: string | null
  created_at: string
  updated_at: string
  target_states?: string[]
}

/** Columns for listing queries — excludes large source_text column */
const LISTING_COLS = 'id,slug,name,funder,deadline,amount,summary,status,source,source_provider,eligibility,rfp_url,created_at,last_verified_at,target_states'

export const SEO_SUMMARY_MIN_WORDS = 50
export const SEO_FRESHNESS_DAYS = 90

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
  // For sitemap inclusion, only require sufficient summary content.
  // Freshness matters for active grants but closed grants with good content still rank.
  return hasSeoSummary(grant.summary)
}

export async function getGrantCount(includeClosedGrants = false): Promise<number> {
  if (!supabase) return 0
  let query = supabase.from('public_grants').select('*', { count: 'exact', head: true })
  if (!includeClosedGrants) {
    query = query.neq('status', 'closed')
  }
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

export async function getGrantSlugsPage(
  offset: number,
  limit: number,
  includeClosedGrants = false,
): Promise<{ slug: string; status: string; updated_at: string; summary: string | null }[]> {
  if (!supabase) return []
  const BATCH = 1000
  const results: { slug: string; status: string; updated_at: string; summary: string | null }[] = []
  let fetched = 0
  while (fetched < limit) {
    const batchSize = Math.min(BATCH, limit - fetched)
    const from = offset + fetched
    let query = supabase
      .from('public_grants')
      .select('slug, status, updated_at, summary')
      .order('deadline', { ascending: true, nullsFirst: false })
      .range(from, from + batchSize - 1)
    if (!includeClosedGrants) {
      query = query.neq('status', 'closed')
    }
    const { data, error } = await query
    if (error) throw error
    if (!data || data.length === 0) break
    results.push(...data)
    fetched += data.length
    if (data.length < batchSize) break
  }
  return results
}

/* ── Data functions ── */

export async function getAllGrants(includeClosedGrants = false): Promise<PublicGrant[]> {
  if (!supabase) return []
  // Supabase PostgREST caps at 1000 rows per request, so paginate in batches
  const BATCH = 1000
  const results: PublicGrant[] = []
  let offset = 0
  while (true) {
    let query = supabase
      .from('public_grants')
      .select(LISTING_COLS)
      .order('deadline', { ascending: true, nullsFirst: false })
      .range(offset, offset + BATCH - 1)
    if (!includeClosedGrants) {
      query = query.neq('status', 'closed')
    }
    const { data, error } = await query
    if (error) throw error
    if (!data || data.length === 0) break
    results.push(...(data as PublicGrant[]))
    offset += data.length
    if (data.length < BATCH) break // no more rows
  }
  return results
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
    .select(LISTING_COLS)
    .ilike('funder', `%${funder}%`)
    .neq('status', 'closed')
    .order('deadline', { ascending: true, nullsFirst: false })
  if (error) throw error
  return (data ?? []) as PublicGrant[]
}

export async function getActiveGrants(limit?: number): Promise<PublicGrant[]> {
  if (!supabase) return []
  let query = supabase
    .from('public_grants')
    .select(LISTING_COLS)
    .eq('status', 'active')
    .order('deadline', { ascending: true, nullsFirst: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as PublicGrant[]
}

export async function getRelatedGrants(
  funder: string,
  excludeSlug: string,
  limit = 3,
): Promise<PublicGrant[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('public_grants')
    .select(LISTING_COLS)
    .ilike('funder', `%${funder}%`)
    .neq('slug', excludeSlug)
    .neq('status', 'closed')
    .order('deadline', { ascending: true, nullsFirst: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as PublicGrant[]
}

/* ── State config ── */

export type USState = {
  slug: string
  name: string
  abbreviation: string
}

export const GRANT_US_STATES: USState[] = [
  { slug: 'alabama', name: 'Alabama', abbreviation: 'AL' },
  { slug: 'alaska', name: 'Alaska', abbreviation: 'AK' },
  { slug: 'arizona', name: 'Arizona', abbreviation: 'AZ' },
  { slug: 'arkansas', name: 'Arkansas', abbreviation: 'AR' },
  { slug: 'california', name: 'California', abbreviation: 'CA' },
  { slug: 'colorado', name: 'Colorado', abbreviation: 'CO' },
  { slug: 'connecticut', name: 'Connecticut', abbreviation: 'CT' },
  { slug: 'delaware', name: 'Delaware', abbreviation: 'DE' },
  { slug: 'florida', name: 'Florida', abbreviation: 'FL' },
  { slug: 'georgia', name: 'Georgia', abbreviation: 'GA' },
  { slug: 'hawaii', name: 'Hawaii', abbreviation: 'HI' },
  { slug: 'idaho', name: 'Idaho', abbreviation: 'ID' },
  { slug: 'illinois', name: 'Illinois', abbreviation: 'IL' },
  { slug: 'indiana', name: 'Indiana', abbreviation: 'IN' },
  { slug: 'iowa', name: 'Iowa', abbreviation: 'IA' },
  { slug: 'kansas', name: 'Kansas', abbreviation: 'KS' },
  { slug: 'kentucky', name: 'Kentucky', abbreviation: 'KY' },
  { slug: 'louisiana', name: 'Louisiana', abbreviation: 'LA' },
  { slug: 'maine', name: 'Maine', abbreviation: 'ME' },
  { slug: 'maryland', name: 'Maryland', abbreviation: 'MD' },
  { slug: 'massachusetts', name: 'Massachusetts', abbreviation: 'MA' },
  { slug: 'michigan', name: 'Michigan', abbreviation: 'MI' },
  { slug: 'minnesota', name: 'Minnesota', abbreviation: 'MN' },
  { slug: 'mississippi', name: 'Mississippi', abbreviation: 'MS' },
  { slug: 'missouri', name: 'Missouri', abbreviation: 'MO' },
  { slug: 'montana', name: 'Montana', abbreviation: 'MT' },
  { slug: 'nebraska', name: 'Nebraska', abbreviation: 'NE' },
  { slug: 'nevada', name: 'Nevada', abbreviation: 'NV' },
  { slug: 'new-hampshire', name: 'New Hampshire', abbreviation: 'NH' },
  { slug: 'new-jersey', name: 'New Jersey', abbreviation: 'NJ' },
  { slug: 'new-mexico', name: 'New Mexico', abbreviation: 'NM' },
  { slug: 'new-york', name: 'New York', abbreviation: 'NY' },
  { slug: 'north-carolina', name: 'North Carolina', abbreviation: 'NC' },
  { slug: 'north-dakota', name: 'North Dakota', abbreviation: 'ND' },
  { slug: 'ohio', name: 'Ohio', abbreviation: 'OH' },
  { slug: 'oklahoma', name: 'Oklahoma', abbreviation: 'OK' },
  { slug: 'oregon', name: 'Oregon', abbreviation: 'OR' },
  { slug: 'pennsylvania', name: 'Pennsylvania', abbreviation: 'PA' },
  { slug: 'rhode-island', name: 'Rhode Island', abbreviation: 'RI' },
  { slug: 'south-carolina', name: 'South Carolina', abbreviation: 'SC' },
  { slug: 'south-dakota', name: 'South Dakota', abbreviation: 'SD' },
  { slug: 'tennessee', name: 'Tennessee', abbreviation: 'TN' },
  { slug: 'texas', name: 'Texas', abbreviation: 'TX' },
  { slug: 'utah', name: 'Utah', abbreviation: 'UT' },
  { slug: 'vermont', name: 'Vermont', abbreviation: 'VT' },
  { slug: 'virginia', name: 'Virginia', abbreviation: 'VA' },
  { slug: 'washington', name: 'Washington', abbreviation: 'WA' },
  { slug: 'west-virginia', name: 'West Virginia', abbreviation: 'WV' },
  { slug: 'wisconsin', name: 'Wisconsin', abbreviation: 'WI' },
  { slug: 'wyoming', name: 'Wyoming', abbreviation: 'WY' },
  { slug: 'district-of-columbia', name: 'District of Columbia', abbreviation: 'DC' },
]

export function getGrantStateBySlug(slug: string): USState | undefined {
  return GRANT_US_STATES.find((s) => s.slug === slug)
}

export async function getGrantsByState(stateName: string): Promise<PublicGrant[]> {
  if (!supabase) return []
  // Try target_states array first, fall back to eligibility text ILIKE
  const { data: byArray, error: arrErr } = await supabase
    .from('public_grants')
    .select(LISTING_COLS)
    .contains('target_states', [stateName])
    .neq('status', 'closed')
    .order('deadline', { ascending: true, nullsFirst: false })
  if (!arrErr && byArray && byArray.length > 0) return byArray as PublicGrant[]

  const { data, error } = await supabase
    .from('public_grants')
    .select(LISTING_COLS)
    .ilike('eligibility', `%${stateName}%`)
    .neq('status', 'closed')
    .order('deadline', { ascending: true, nullsFirst: false })
  if (error) throw error
  return (data ?? []) as PublicGrant[]
}

export async function getClosingSoonGrants(days = 30): Promise<PublicGrant[]> {
  if (!supabase) return []
  const now = new Date().toISOString()
  const future = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('public_grants')
    .select(LISTING_COLS)
    .eq('status', 'active')
    .gte('deadline', now)
    .lte('deadline', future)
    .order('deadline', { ascending: true })
  if (error) throw error
  return (data ?? []) as PublicGrant[]
}

export async function getNewGrants(sinceDate?: Date): Promise<PublicGrant[]> {
  if (!supabase) return []
  const since = sinceDate ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const { data, error } = await supabase
    .from('public_grants')
    .select(LISTING_COLS)
    .gte('created_at', since.toISOString())
    .neq('status', 'closed')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as PublicGrant[]
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
  {
    slug: 'health-research',
    name: 'Health Research Grants',
    description: 'Federal and foundation grants for biomedical research, public health initiatives, clinical trials, and disease prevention programs advancing health equity.',
    type: 'topic',
    topicKeywords: ['health research', 'biomedical', 'public health', 'clinical trial', 'disease prevention', 'health equity'],
    gradient: 'blog-header-nih',
  },
  {
    slug: 'education',
    name: 'Education Grants',
    description: 'Funding for K-12 schools, higher education institutions, and educational nonprofits focused on STEM education, literacy, and student success.',
    type: 'topic',
    topicKeywords: ['education', 'K-12', 'higher education', 'STEM education', 'literacy', 'student success', 'educational equity'],
    gradient: 'blog-header-tips',
  },
  {
    slug: 'workforce-development',
    name: 'Workforce Development Grants',
    description: 'Grant opportunities for job training programs, apprenticeships, career pathways, and skills development initiatives that strengthen local employment.',
    type: 'topic',
    topicKeywords: ['workforce development', 'job training', 'apprenticeship', 'career pathways', 'skills development', 'employment'],
    gradient: 'blog-header-sbir',
  },
  {
    slug: 'housing',
    name: 'Housing Grants',
    description: 'Federal and state grants supporting affordable housing construction, homelessness prevention, community development, and fair housing enforcement.',
    type: 'topic',
    topicKeywords: ['housing', 'affordable housing', 'homelessness', 'community development', 'fair housing', 'housing assistance'],
    gradient: 'blog-header-darpa',
  },
  {
    slug: 'technology-innovation',
    name: 'Technology & Innovation Grants',
    description: 'Grants for technology research and development, including artificial intelligence, cybersecurity, advanced manufacturing, and digital infrastructure.',
    type: 'topic',
    topicKeywords: ['technology', 'innovation', 'artificial intelligence', 'cybersecurity', 'advanced manufacturing', 'digital'],
    gradient: 'blog-header-nsf',
  },
  {
    slug: 'marine-science',
    name: 'Marine Science Grants',
    description: 'Funding for ocean and coastal research, fisheries management, marine debris removal, sea grant programs, and marine conservation efforts.',
    type: 'topic',
    topicKeywords: ['marine', 'ocean', 'coastal', 'fisheries', 'marine debris', 'sea grant', 'marine conservation'],
    gradient: 'blog-header-noaa',
  },
  {
    slug: 'rural-development',
    name: 'Rural Development Grants',
    description: 'Grants for rural communities, agricultural programs, farm operations, rural health services, and critical infrastructure in underserved areas.',
    type: 'topic',
    topicKeywords: ['rural', 'agriculture', 'farm', 'rural community', 'rural health', 'rural infrastructure'],
    gradient: 'blog-header-usda',
  },
  {
    slug: 'public-safety',
    name: 'Public Safety Grants',
    description: 'Federal grants for emergency management, law enforcement programs, fire prevention, disaster preparedness, and homeland security initiatives.',
    type: 'topic',
    topicKeywords: ['public safety', 'emergency management', 'law enforcement', 'fire prevention', 'disaster preparedness', 'homeland security'],
    gradient: 'blog-header-darpa',
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
      .select(LISTING_COLS)
      .ilike('eligibility', `%${category.eligibilityMatch}%`)
      .neq('status', 'closed')
      .order('deadline', { ascending: true, nullsFirst: false })
    if (error) throw error
    return (data ?? []) as PublicGrant[]
  }
  return []
}
