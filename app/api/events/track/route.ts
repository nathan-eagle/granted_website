import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Lazy singleton — avoid creating a new client per request
let _supabase: ReturnType<typeof createClient> | null = null
function getSupabase() {
  if (_supabase) return _supabase
  if (!supabaseUrl || !supabaseKey) return null
  _supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  return _supabase
}

const ALLOWED_EVENTS = new Set([
  // Grant finder
  'search.query', 'search.result_click', 'search.apply_click',
  'search.detail_open', 'search.detail_close', 'search.sort_change',
  'search.filter_change', 'search.email_submit', 'search.email_success',
  'search.enriched', 'search.gate', 'search.results', 'search.error',
  'search.saved', 'search.locked_details_click',
  // Hero
  'hero.search_submit', 'hero.chip_click',
  // Discovery
  'discovery.tab_switch', 'discovery.funder_click', 'discovery.filter',
  // Navigation / CTA
  'nav.header_click', 'nav.sign_in', 'nav.logo_click',
  'cta.click', 'cta.blog_sticky',
  // Email / conversion
  'email.signup', 'email.exit_intent_shown',
  'conversion.intent', 'conversion.trial_signup',
  // Quiz
  'quiz.start', 'quiz.answer', 'quiz.complete',
  'quiz.email_submit', 'quiz.email_success',
  // Grant pages
  'grant.card_click', 'grant.trending_click',
  'grant.category_filter', 'grant.category_unlock_submit',
  'grant.category_unlock_success', 'grant.category_unlock_error',
  // Foundation pages
  'foundation.card_click', 'foundation.category_filter',
  'foundation.unlock_submit', 'foundation.unlock_success', 'foundation.unlock_error',
  // Deadlines
  'deadline.filter_toggle', 'deadline.reminder_signup',
  'deadline.filters_cleared', 'deadline.search',
  // Cost calculator
  'calculator.submit', 'calculator.email',
  // External links
  'external.link_click',
  // Page views & landings
  'page.view', 'page.landing', 'page.grant_view',
  'page.grant_landing', 'page.seo_grant_landing',
  // Site-wide clicks
  'site.click',
  // Catch-all for unmapped events
  'site.other',
])

const MAX_METADATA_SIZE = 4096
const MAX_BATCH = 20

function hashIP(ip: string): string {
  return createHash('sha256')
    .update(ip + (process.env.RATE_LIMIT_SALT || 'granted'))
    .digest('hex')
    .slice(0, 16)
}

interface EventPayload {
  event: string
  anon_id?: string | null
  metadata?: Record<string, unknown>
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Accept { events: [...] } or single { event, ... }
    const rawEvents: EventPayload[] = Array.isArray(body.events)
      ? body.events.slice(0, MAX_BATCH)
      : [body]

    if (rawEvents.length === 0 || !rawEvents[0]?.event) {
      return NextResponse.json({ error: 'Missing event' }, { status: 400 })
    }

    // Extract request context
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
    const ipHash = hashIP(ip)
    const ua = (req.headers.get('user-agent') || '').slice(0, 200)

    // Validate and build rows
    const rows = []
    for (const ev of rawEvents) {
      if (!ev.event || typeof ev.event !== 'string') continue
      if (!ALLOWED_EVENTS.has(ev.event)) continue

      // Validate metadata size
      let metadata = ev.metadata ?? null
      if (metadata) {
        const serialized = JSON.stringify(metadata)
        if (serialized.length > MAX_METADATA_SIZE) {
          metadata = { _truncated: true, _size: serialized.length }
        }
      }

      rows.push({
        event: ev.event,
        level: 'info',
        anon_id: ev.anon_id || null,
        ip_hash: ipHash,
        user_agent: ua,
        source: 'site',
        metadata,
      })
    }

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, inserted: 0 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ ok: true, inserted: 0 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('app_events').insert(rows as any)
    if (error) {
      console.error('[events/track] Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to persist' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, inserted: rows.length })
  } catch (e) {
    console.error('[events/track]', e)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
