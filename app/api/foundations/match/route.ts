import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { FOUNDATION_CATEGORIES } from '@/lib/foundations'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
    : null

// Map search terms to NTEE major codes
function focusAreaToNteeMajors(focusArea: string): string[] {
  const lower = focusArea.toLowerCase()
  const matched: string[] = []

  const keywordMap: Record<string, string[]> = {
    'arts': ['A'],
    'culture': ['A'],
    'music': ['A'],
    'theater': ['A'],
    'education': ['B'],
    'school': ['B'],
    'university': ['B'],
    'scholarship': ['B'],
    'stem': ['B', 'U'],
    'environment': ['C'],
    'climate': ['C'],
    'conservation': ['C'],
    'clean energy': ['C'],
    'sustainability': ['C'],
    'animal': ['D'],
    'wildlife': ['D'],
    'health': ['E', 'F', 'G', 'H'],
    'medical': ['E', 'G'],
    'mental health': ['F'],
    'hospital': ['E'],
    'disease': ['G', 'H'],
    'cancer': ['G', 'H'],
    'housing': ['L'],
    'homeless': ['L'],
    'youth': ['O'],
    'children': ['O'],
    'human services': ['P'],
    'food': ['K'],
    'hunger': ['K'],
    'international': ['Q'],
    'global': ['Q'],
    'civil rights': ['R'],
    'justice': ['R'],
    'equity': ['R'],
    'community': ['S', 'W'],
    'philanthropy': ['T'],
    'science': ['U'],
    'technology': ['U'],
    'research': ['U', 'V'],
    'religion': ['X'],
    'faith': ['X'],
    'marine': ['C'],
    'ocean': ['C'],
    'workforce': ['J'],
    'job training': ['J'],
  }

  for (const [keyword, codes] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      for (const code of codes) {
        if (!matched.includes(code)) matched.push(code)
      }
    }
  }

  // Also match against FOUNDATION_CATEGORIES names
  for (const cat of FOUNDATION_CATEGORIES) {
    if (lower.includes(cat.name.toLowerCase()) || lower.includes(cat.slug.replace('-', ' '))) {
      for (const code of cat.nteeMajors) {
        if (!matched.includes(code)) matched.push(code)
      }
    }
  }

  return matched
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { focus_area, state, limit = 20 } = body

    if (!focus_area || typeof focus_area !== 'string') {
      return NextResponse.json({ error: 'focus_area is required' }, { status: 400 })
    }

    const nteeMajors = focusAreaToNteeMajors(focus_area)

    let query = supabase
      .from('foundations')
      .select('id, slug, name, city, state, ntee_category, ntee_major, asset_amount, website')

    if (nteeMajors.length > 0) {
      query = query.in('ntee_major', nteeMajors)
    }

    if (state) {
      // Get state abbreviation from full name
      const stateAbbrevMap: Record<string, string> = {
        'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
        'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
        'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
        'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
        'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
        'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
        'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
        'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
        'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
        'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
        'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
        'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
        'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
      }
      const abbrev = stateAbbrevMap[state] || state
      query = query.eq('state', abbrev)
    }

    query = query
      .not('asset_amount', 'is', null)
      .order('asset_amount', { ascending: false })
      .limit(Math.min(limit, 50))

    const { data: foundations, error } = await query

    if (error) {
      console.error('Foundation match error:', error.message)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    // Fetch financials for total_giving (latest year per foundation)
    const foundationIds = (foundations ?? []).map(f => f.id)
    let givingMap = new Map<string, number>()
    let granteeCountMap = new Map<string, number>()

    if (foundationIds.length > 0) {
      // Get latest total_giving from foundation_financials
      const { data: financials } = await supabase
        .from('foundation_financials')
        .select('foundation_id, total_giving, fiscal_year')
        .in('foundation_id', foundationIds)
        .not('total_giving', 'is', null)
        .order('fiscal_year', { ascending: false })

      if (financials) {
        for (const f of financials) {
          if (!givingMap.has(f.foundation_id)) {
            givingMap.set(f.foundation_id, f.total_giving)
          }
        }
      }

      // Get grantee counts from foundation_grants
      const { data: grantCounts } = await supabase
        .from('foundation_grants')
        .select('foundation_id')
        .in('foundation_id', foundationIds)

      if (grantCounts) {
        const countMap = new Map<string, number>()
        for (const g of grantCounts) {
          countMap.set(g.foundation_id, (countMap.get(g.foundation_id) ?? 0) + 1)
        }
        granteeCountMap = countMap
      }
    }

    const results = (foundations ?? []).map(f => ({
      id: f.id,
      slug: f.slug,
      name: f.name,
      city: f.city,
      state: f.state,
      ntee_category: f.ntee_category,
      asset_amount: f.asset_amount,
      total_giving: givingMap.get(f.id) ?? null,
      grantee_count: granteeCountMap.get(f.id) ?? null,
      website: f.website,
    }))

    return NextResponse.json({ funders: results })
  } catch (err) {
    console.error('Foundation match error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
