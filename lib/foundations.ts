import { supabase } from './supabase'

/* ── Types ── */

export type Foundation = {
  id: string
  slug: string
  ein: string
  name: string
  sort_name: string | null
  street: string | null
  city: string | null
  state: string | null
  zip: string | null
  ntee_code: string | null
  ntee_major: string | null
  ntee_category: string | null
  foundation_code: string | null
  subsection: string | null
  ruling_date: string | null
  asset_amount: number | null
  income_amount: number | null
  revenue_amount: number | null
  website: string | null
  contact_name: string | null
  organization_type: string | null
  deductibility: string | null
  activity_codes: string | null
  group_exemption: string | null
  affiliation: string | null
  source: string
  last_verified_at: string | null
  created_at: string
  updated_at: string
}

/* ── Category config ── */

export type FoundationCategory = {
  slug: string
  name: string
  description: string
  nteeMajors: string[]
  gradient: string
}

export const FOUNDATION_CATEGORIES: FoundationCategory[] = [
  {
    slug: 'arts-culture',
    name: 'Arts & Culture',
    description: 'Private foundations funding arts, culture, and humanities organizations across the United States.',
    nteeMajors: ['A'],
    gradient: 'blog-header-tips',
  },
  {
    slug: 'education',
    name: 'Education',
    description: 'Foundations supporting educational institutions, scholarships, and learning initiatives.',
    nteeMajors: ['B'],
    gradient: 'blog-header-nsf',
  },
  {
    slug: 'environment',
    name: 'Environment',
    description: 'Foundations focused on environmental conservation, climate, and natural resource protection.',
    nteeMajors: ['C'],
    gradient: 'blog-header-epa',
  },
  {
    slug: 'animals',
    name: 'Animals',
    description: 'Foundations dedicated to animal welfare, wildlife conservation, and veterinary programs.',
    nteeMajors: ['D'],
    gradient: 'blog-header-usda',
  },
  {
    slug: 'health',
    name: 'Health',
    description: 'Foundations supporting healthcare, medical research, mental health, and disease prevention.',
    nteeMajors: ['E', 'F', 'G', 'H'],
    gradient: 'blog-header-nih',
  },
  {
    slug: 'human-services',
    name: 'Human Services',
    description: 'Foundations addressing human needs including housing, food security, employment, youth development, and public safety.',
    nteeMajors: ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
    gradient: 'blog-header-sbir',
  },
  {
    slug: 'international',
    name: 'International',
    description: 'Foundations supporting international development, foreign affairs, and global humanitarian efforts.',
    nteeMajors: ['Q'],
    gradient: 'blog-header-noaa',
  },
  {
    slug: 'advocacy',
    name: 'Advocacy',
    description: 'Foundations supporting civil rights, social action, and public policy advocacy.',
    nteeMajors: ['R'],
    gradient: 'blog-header-darpa',
  },
  {
    slug: 'community-development',
    name: 'Community Development',
    description: 'Foundations investing in community improvement, capacity building, and public benefit programs.',
    nteeMajors: ['S', 'W'],
    gradient: 'blog-header-tribal',
  },
  {
    slug: 'philanthropy',
    name: 'Philanthropy & Grantmaking',
    description: 'Foundations focused on philanthropy, voluntarism, and grantmaking infrastructure.',
    nteeMajors: ['T'],
    gradient: 'blog-header-tips',
  },
  {
    slug: 'science-technology',
    name: 'Science & Technology',
    description: 'Foundations advancing scientific research, technology development, and social science.',
    nteeMajors: ['U', 'V'],
    gradient: 'blog-header-nsf',
  },
  {
    slug: 'religion',
    name: 'Religion',
    description: 'Foundations supporting religious organizations, spiritual development, and faith-based programs.',
    nteeMajors: ['X'],
    gradient: 'blog-header-darpa',
  },
]

/* ── US States ── */

export type USState = {
  slug: string
  name: string
  abbreviation: string
}

export const US_STATES: USState[] = [
  { slug: 'alabama', name: 'Alabama', abbreviation: 'AL' },
  { slug: 'alaska', name: 'Alaska', abbreviation: 'AK' },
  { slug: 'arizona', name: 'Arizona', abbreviation: 'AZ' },
  { slug: 'arkansas', name: 'Arkansas', abbreviation: 'AR' },
  { slug: 'california', name: 'California', abbreviation: 'CA' },
  { slug: 'colorado', name: 'Colorado', abbreviation: 'CO' },
  { slug: 'connecticut', name: 'Connecticut', abbreviation: 'CT' },
  { slug: 'delaware', name: 'Delaware', abbreviation: 'DE' },
  { slug: 'district-of-columbia', name: 'District of Columbia', abbreviation: 'DC' },
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
]

/* ── Helpers ── */

export function formatAssets(amount: number | null): string {
  if (amount === null || amount === undefined) return 'N/A'
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount.toLocaleString()}`
}

export function getStateBySlug(slug: string): USState | undefined {
  return US_STATES.find((s) => s.slug === slug)
}

export function getStateByAbbrev(abbrev: string): USState | undefined {
  return US_STATES.find((s) => s.abbreviation === abbrev.toUpperCase())
}

export function getCategoryBySlug(slug: string): FoundationCategory | undefined {
  return FOUNDATION_CATEGORIES.find((c) => c.slug === slug)
}

function nteeMajorLabel(nteeMajor: string | null): string {
  if (!nteeMajor) return 'General'
  const cat = FOUNDATION_CATEGORIES.find((c) => c.nteeMajors.includes(nteeMajor))
  return cat?.name ?? 'General'
}

export function getFoundationLocation(f: Pick<Foundation, 'city' | 'state'>): string {
  const parts = [f.city, f.state].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'United States'
}

export function getFoundationCategoryLabel(f: Pick<Foundation, 'ntee_major'>): string {
  return nteeMajorLabel(f.ntee_major)
}

/* ── Financial summary type (from foundation_financials table) ── */

export type FoundationFinancial = {
  id: string
  foundation_id: string
  fiscal_year: number
  total_giving: number | null
  total_assets: number | null
  total_revenue: number | null
  contributions_received: number | null
  net_investment_income: number | null
  distribution_amount: number | null
  officer_compensation: number | null
  total_liabilities: number | null
  net_worth: number | null

  // Grantmaking
  grants_paid: number | null
  exempt_purpose_expenses: number | null
  fair_market_value: number | null
  grants_approved_future: number | null
  undistributed_income: number | null

  // Investment portfolio
  investments_govt: number | null
  investments_stock: number | null
  investments_bonds: number | null
  investments_total_sec: number | null
  investments_other: number | null
  cash_on_hand: number | null

  // Expense details
  pension_benefits: number | null
  legal_fees: number | null
  accounting_fees: number | null
  interest_expense: number | null
  depreciation: number | null
  occupancy: number | null
  travel_conferences: number | null
  printing_publications: number | null

  // Revenue breakdown
  interest_revenue: number | null
  dividends: number | null
  gross_rents: number | null
  gross_profit_business: number | null
  other_income: number | null
  capital_gains_net: number | null

  // Foundation flags
  is_operating: boolean | null
  grants_to_individuals: boolean | null
  noncharity_grants: boolean | null
  lobbying: boolean | null
  excess_holdings: boolean | null

  // Tax details
  excise_tax: number | null
  tax_due: number | null

  created_at: string
}

/* ── Grantee type (from foundation_grants table) ── */

export type FoundationGrantee = {
  id: string
  foundation_id: string
  recipient_name: string | null
  recipient_city: string | null
  recipient_state: string | null
  amount: number | null
  grant_year: number | null
  purpose: string | null
  created_at: string
}

/* ── Filing type (from foundation_filings table) ── */

export type FoundationFiling = {
  id: string
  foundation_id: string
  fiscal_year: number
  tax_period: string | null
  return_type: string | null
  object_id: string | null
  pdf_url: string | null
  xml_available: boolean
  created_at: string
}

/* ── Data functions ── */

export async function getFoundationBySlug(slug: string): Promise<Foundation | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('foundations')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getTopFoundations(limit = 20): Promise<Foundation[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundations')
    .select('*')
    .not('asset_amount', 'is', null)
    .order('asset_amount', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getFoundationsByState(stateAbbrev: string, limit?: number): Promise<Foundation[]> {
  if (!supabase) return []
  let query = supabase
    .from('foundations')
    .select('*')
    .eq('state', stateAbbrev)
    .order('asset_amount', { ascending: false, nullsFirst: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getFoundationsByCategory(nteeMajors: string[]): Promise<Foundation[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundations')
    .select('*')
    .in('ntee_major', nteeMajors)
    .order('asset_amount', { ascending: false, nullsFirst: false })
    .limit(500)
  if (error) throw error
  return data ?? []
}

export async function getFoundationCount(): Promise<number> {
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('foundations')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

export async function getFoundationCountByState(stateAbbrev: string): Promise<number> {
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('foundations')
    .select('*', { count: 'exact', head: true })
    .eq('state', stateAbbrev)
  if (error) throw error
  return count ?? 0
}

export async function getFoundationSlugsPage(
  offset: number,
  limit: number,
): Promise<{ slug: string; updated_at: string }[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundations')
    .select('slug, updated_at')
    .order('asset_amount', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data ?? []
}

export async function getAllFoundationSlugs(limit = 50000): Promise<{ slug: string; updated_at: string }[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundations')
    .select('slug, updated_at')
    .order('asset_amount', { ascending: false, nullsFirst: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getRelatedFoundations(
  state: string | null,
  nteeMajor: string | null,
  excludeSlug: string,
  limit = 3,
): Promise<Foundation[]> {
  if (!supabase) return []

  // Try same state + same category first
  if (state && nteeMajor) {
    const { data, error } = await supabase
      .from('foundations')
      .select('*')
      .eq('state', state)
      .eq('ntee_major', nteeMajor)
      .neq('slug', excludeSlug)
      .order('asset_amount', { ascending: false, nullsFirst: false })
      .limit(limit)
    if (error) throw error
    if (data && data.length >= limit) return data
  }

  // Fallback: same state only
  if (state) {
    const { data, error } = await supabase
      .from('foundations')
      .select('*')
      .eq('state', state)
      .neq('slug', excludeSlug)
      .order('asset_amount', { ascending: false, nullsFirst: false })
      .limit(limit)
    if (error) throw error
    return data ?? []
  }

  return []
}

export async function getSimilarFoundations(
  nteeMajor: string | null,
  excludeSlug: string,
  limit = 6,
): Promise<Foundation[]> {
  if (!supabase || !nteeMajor) return []
  const { data, error } = await supabase
    .from('foundations')
    .select('*')
    .eq('ntee_major', nteeMajor)
    .neq('slug', excludeSlug)
    .order('asset_amount', { ascending: false, nullsFirst: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getFoundationFinancials(
  foundationId: string,
): Promise<FoundationFinancial[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundation_financials')
    .select('*')
    .eq('foundation_id', foundationId)
    .order('fiscal_year', { ascending: true })
  if (error) {
    console.error('Error fetching financials:', error.message)
    return []
  }
  return data ?? []
}

export async function getFoundationFilings(
  foundationId: string,
): Promise<FoundationFiling[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundation_filings')
    .select('*')
    .eq('foundation_id', foundationId)
    .order('fiscal_year', { ascending: false })
  if (error) {
    console.error('Error fetching filings:', error.message)
    return []
  }
  return data ?? []
}

export async function getFoundationGrantees(
  foundationId: string,
  limit = 500,
): Promise<FoundationGrantee[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundation_grants')
    .select('*')
    .eq('foundation_id', foundationId)
    .order('grant_year', { ascending: false })
    .order('amount', { ascending: false, nullsFirst: false })
    .limit(limit)
  if (error) {
    // Table might not exist yet or be empty — graceful fallback
    console.error('Error fetching grantees:', error.message)
    return []
  }
  return data ?? []
}

export async function getFoundationGranteeYears(foundationId: string): Promise<number[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('foundation_grants')
    .select('grant_year')
    .eq('foundation_id', foundationId)
    .not('grant_year', 'is', null)
    .order('grant_year', { ascending: false })
  if (error) return []
  const years = [...new Set((data ?? []).map((d) => d.grant_year as number))]
  return years
}

/* ── Grantee stats computation (client-side from fetched data) ── */

export type GivingByYear = { year: number; total: number; count: number }
export type GrantStats = {
  totalGrants: number
  totalGiving: number
  averageGrant: number
  medianGrant: number
  minGrant: number
  maxGrant: number
}
export type StateDistribution = { state: string; count: number; total: number }

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

export function computeGrantStats(grantees: FoundationGrantee[]): GrantStats | null {
  const amounts = grantees
    .map((g) => g.amount)
    .filter((a): a is number => a !== null && a > 0)
    .sort((a, b) => a - b)
  if (amounts.length === 0) return null

  return {
    totalGrants: grantees.length,
    totalGiving: amounts.reduce((sum, a) => sum + a, 0),
    averageGrant: amounts.reduce((sum, a) => sum + a, 0) / amounts.length,
    medianGrant: median(amounts),
    minGrant: amounts[0],
    maxGrant: amounts[amounts.length - 1],
  }
}

export function computeGivingByYear(grantees: FoundationGrantee[]): GivingByYear[] {
  const map = new Map<number, { total: number; count: number }>()
  for (const g of grantees) {
    if (g.grant_year === null) continue
    const entry = map.get(g.grant_year) ?? { total: 0, count: 0 }
    entry.total += g.amount ?? 0
    entry.count += 1
    map.set(g.grant_year, entry)
  }
  return Array.from(map.entries())
    .map(([year, { total, count }]) => ({ year, total, count }))
    .sort((a, b) => a.year - b.year)
}

export function computeStateDistribution(grantees: FoundationGrantee[]): StateDistribution[] {
  const map = new Map<string, { count: number; total: number }>()
  for (const g of grantees) {
    const st = g.recipient_state?.toUpperCase()
    if (!st) continue
    const entry = map.get(st) ?? { count: 0, total: 0 }
    entry.count += 1
    entry.total += g.amount ?? 0
    map.set(st, entry)
  }
  return Array.from(map.entries())
    .map(([state, { count, total }]) => ({ state, count, total }))
    .sort((a, b) => b.total - a.total)
}

export function computeNewGranteeRate(grantees: FoundationGrantee[]): { rate: number; year: number } | null {
  const byYear = new Map<number, Set<string>>()
  for (const g of grantees) {
    if (!g.grant_year || !g.recipient_name) continue
    const normalized = g.recipient_name.trim().toLowerCase()
    const set = byYear.get(g.grant_year) ?? new Set()
    set.add(normalized)
    byYear.set(g.grant_year, set)
  }

  const years = Array.from(byYear.keys()).sort((a, b) => b - a)
  if (years.length < 2) return null

  const latestYear = years[0]
  const latestRecipients = byYear.get(latestYear)!
  const priorRecipients = new Set<string>()
  for (const y of years.slice(1)) {
    for (const name of byYear.get(y)!) {
      priorRecipients.add(name)
    }
  }

  let newCount = 0
  for (const name of latestRecipients) {
    if (!priorRecipients.has(name)) newCount++
  }

  return {
    rate: latestRecipients.size > 0 ? newCount / latestRecipients.size : 0,
    year: latestYear,
  }
}
