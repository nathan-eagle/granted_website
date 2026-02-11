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
    // A — Arts, Culture & Humanities
    'arts': ['A'], 'culture': ['A'], 'music': ['A'], 'theater': ['A'], 'theatre': ['A'],
    'film': ['A'], 'media': ['A'], 'museum': ['A'], 'dance': ['A'], 'literary': ['A'],
    'humanities': ['A'], 'design': ['A', 'U'], 'architecture': ['A', 'U'],
    'visual arts': ['A'], 'performing arts': ['A'], 'creative': ['A'],
    // B — Education
    'education': ['B'], 'school': ['B'], 'university': ['B'], 'scholarship': ['B'],
    'stem': ['B', 'U'], 'literacy': ['B'], 'higher education': ['B'], 'college': ['B'],
    'academic': ['B'], 'teacher': ['B'], 'student': ['B'], 'learning': ['B'],
    'curriculum': ['B'], 'k-12': ['B'], 'early childhood': ['B'],
    // C — Environment
    'environment': ['C'], 'climate': ['C'], 'conservation': ['C'], 'clean energy': ['C'],
    'sustainability': ['C'], 'marine': ['C'], 'ocean': ['C'], 'water': ['C'],
    'forestry': ['C'], 'ecology': ['C'], 'pollution': ['C'], 'biodiversity': ['C'],
    'renewable': ['C'], 'solar': ['C'], 'wind energy': ['C'], 'coastal': ['C'],
    // D — Animals
    'animal': ['D'], 'wildlife': ['D'], 'veterinary': ['D'], 'endangered species': ['D'],
    // E–H — Health & Medical
    'health': ['E', 'F', 'G', 'H'], 'medical': ['E', 'G'], 'mental health': ['F'],
    'hospital': ['E'], 'disease': ['G', 'H'], 'cancer': ['G', 'H'],
    'nursing': ['E'], 'public health': ['E'], 'biomedical': ['E', 'U'],
    'pharmaceutical': ['E', 'G'], 'disability': ['E', 'P'], 'therapy': ['F'],
    'wellness': ['E', 'F'], 'healthcare': ['E'],
    // J — Employment
    'workforce': ['J'], 'job training': ['J'], 'employment': ['J'], 'vocational': ['J'],
    // K — Food & Agriculture
    'food': ['K'], 'hunger': ['K'], 'agriculture': ['K'], 'farming': ['K'], 'nutrition': ['K'],
    // L — Housing
    'housing': ['L'], 'homeless': ['L'], 'shelter': ['L'], 'affordable housing': ['L'],
    // O — Youth
    'youth': ['O'], 'children': ['O'], 'adolescent': ['O'], 'juvenile': ['O'],
    // P — Human Services
    'human services': ['P'], 'social services': ['P'], 'disaster relief': ['P'],
    'emergency': ['P'], 'veteran': ['P'], 'aging': ['P'], 'elder': ['P'],
    // Q — International
    'international': ['Q'], 'global': ['Q'], 'foreign': ['Q'], 'developing countries': ['Q'],
    // R — Civil Rights
    'civil rights': ['R'], 'justice': ['R'], 'equity': ['R'], 'diversity': ['R'],
    'inclusion': ['R'], 'racial': ['R'],
    // S, W — Community
    'community': ['S', 'W'], 'civic': ['S'], 'neighborhood': ['S'],
    'community development': ['S'], 'rural': ['S'],
    // T — Philanthropy
    'philanthropy': ['T'], 'grantmaking': ['T'],
    // U — Science & Technology
    'science': ['U'], 'technology': ['U'], 'research': ['U', 'V'],
    'engineering': ['U'], 'computer': ['U'], 'robotics': ['U'],
    'artificial intelligence': ['U'], 'ai': ['U'], 'innovation': ['U'],
    'data science': ['U'], 'software': ['U'], 'hardware': ['U'],
    'aerospace': ['U'], 'physics': ['U'], 'chemistry': ['U'], 'biology': ['U'],
    'mathematics': ['U'], 'nanotechnology': ['U'], 'materials science': ['U'],
    // V — Social Science
    'social science': ['V'], 'economics': ['V'], 'psychology': ['V'], 'sociology': ['V'],
    'anthropology': ['V'], 'political science': ['V'], 'policy': ['V'],
    // X — Religion
    'religion': ['X'], 'faith': ['X'], 'church': ['X'], 'spiritual': ['X'],
  }

  // Compound phrases take priority — prevent "environmental justice" from matching civil rights
  const compoundMap: Record<string, string[]> = {
    'environmental justice': ['C'],
    'social justice': ['R'],
    'criminal justice': ['R'],
    'racial justice': ['R'],
    'climate justice': ['C'],
    'food justice': ['K'],
    'health equity': ['E', 'F', 'G', 'H'],
    'arts education': ['A', 'B'],
    'music education': ['A', 'B'],
    'stem education': ['B', 'U'],
    'science education': ['B', 'U'],
    'environmental education': ['B', 'C'],
    'community health': ['E', 'S'],
    'public health': ['E'],
    'mental health': ['F'],
    'youth development': ['O'],
    'workforce development': ['J'],
    'community development': ['S'],
    'economic development': ['S', 'W'],
    'rural development': ['S'],
    'international development': ['Q'],
    'marine conservation': ['C'],
    'ocean conservation': ['C'],
    'wildlife conservation': ['C', 'D'],
  }

  const consumedWords = new Set<string>()
  for (const [phrase, codes] of Object.entries(compoundMap)) {
    if (lower.includes(phrase)) {
      for (const code of codes) {
        if (!matched.includes(code)) matched.push(code)
      }
      // Mark words in this phrase as consumed so they don't trigger separate matches
      for (const word of phrase.split(' ')) {
        consumedWords.add(word)
      }
    }
  }

  for (const [keyword, codes] of Object.entries(keywordMap)) {
    // Skip single-word keywords that were already consumed by compound phrases
    if (consumedWords.has(keyword)) continue
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
    } else {
      // No NTEE match — fall back to text search against foundation name/category
      const words = focus_area.trim().split(/\s+/).filter(w => w.length >= 3)
      if (words.length > 0) {
        const pattern = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
        query = query.or(`name.ilike.%${words[0]}%,ntee_category.ilike.%${words[0]}%`)
      }
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

    // Score relevance based on keyword overlap with category name
    const searchWords = focus_area.toLowerCase().split(/\s+/).filter((w: string) => w.length >= 3)

    const results = (foundations ?? []).map(f => {
      let relevance = 0
      const catLower = (f.ntee_category || '').toLowerCase()
      const nameLower = (f.name || '').toLowerCase()

      // Category name match
      for (const word of searchWords) {
        if (catLower.includes(word)) relevance += 3
        if (nameLower.includes(word)) relevance += 2
      }

      // Boost foundations with giving data (more active)
      if (givingMap.has(f.id)) relevance += 1
      if (granteeCountMap.has(f.id)) relevance += 1

      return {
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
        _relevance: relevance,
      }
    })

    // Sort by relevance first, then by assets as tiebreaker
    results.sort((a, b) => {
      if (b._relevance !== a._relevance) return b._relevance - a._relevance
      return (b.asset_amount ?? 0) - (a.asset_amount ?? 0)
    })

    // Strip internal _relevance field before returning
    const cleaned = results.map(({ _relevance, ...rest }) => rest)

    return NextResponse.json({ funders: cleaned })
  } catch (err) {
    console.error('Foundation match error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
