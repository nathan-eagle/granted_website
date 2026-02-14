import { getAnonId } from './anon-id'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export type AnalyticsValue = string | number | boolean | null | undefined

function sanitizeValue(value: AnalyticsValue): string | number | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.length > 180 ? `${trimmed.slice(0, 180)}...` : trimmed
}

function sanitizeParams(params?: Record<string, AnalyticsValue>): Record<string, string | number> | undefined {
  if (!params) return undefined

  const clean: Record<string, string | number> = {}
  for (const [key, rawValue] of Object.entries(params)) {
    const cleanValue = sanitizeValue(rawValue)
    if (cleanValue === undefined) continue
    clean[key] = cleanValue
  }

  return Object.keys(clean).length > 0 ? clean : undefined
}

// ---------------------------------------------------------------------------
// GA4-to-Supabase event name mapping
// ---------------------------------------------------------------------------

const EVENT_MAP: Record<string, string> = {
  grant_finder_search: 'search.query',
  grant_finder_result_click: 'search.result_click',
  grant_finder_apply_click: 'search.apply_click',
  grant_discovery_detail_open: 'search.detail_open',
  grant_discovery_detail_close: 'search.detail_close',
  grant_discovery_sort: 'search.sort_change',
  grant_finder_filter_change: 'search.filter_change',
  grant_finder_email_submit: 'search.email_submit',
  grant_finder_email_success: 'search.email_success',
  grant_finder_email_error: 'search.error',
  grant_finder_enriched: 'search.enriched',
  grant_finder_gate: 'search.gate',
  grant_finder_results: 'search.results',
  grant_finder_search_error: 'search.error',
  grant_finder_search_saved: 'search.saved',
  grant_finder_locked_details_click: 'search.locked_details_click',
  grant_finder_result_grant_click: 'search.result_click',
  grant_finder_view_opportunity_click: 'search.apply_click',
  grant_finder_focus_blur: 'search.filter_change',
  hero_search_submit: 'hero.search_submit',
  hero_search_chip_click: 'hero.chip_click',
  grant_discovery_tab_switch: 'discovery.tab_switch',
  grant_discovery_funder_click: 'discovery.funder_click',
  grant_discovery_filter: 'discovery.filter',
  header_nav_click: 'nav.header_click',
  header_resources_click: 'nav.header_click',
  sign_in_click: 'nav.sign_in',
  header_logo_click: 'nav.logo_click',
  cta_click_blog_sticky: 'cta.blog_sticky',
  grant_finder_cta_click: 'cta.click',
  button_link_click: 'cta.click',
  email_signup: 'email.signup',
  exit_intent_shown: 'email.exit_intent_shown',
  conversion_intent: 'conversion.intent',
  trial_signup_intent: 'conversion.trial_signup',
  quiz_start: 'quiz.start',
  quiz_answer: 'quiz.answer',
  quiz_complete: 'quiz.complete',
  quiz_email_submit: 'quiz.email_submit',
  quiz_email_success: 'quiz.email_success',
  grant_card_click: 'grant.card_click',
  trending_grant_click: 'grant.trending_click',
  grant_category_filter_change: 'grant.category_filter',
  grant_category_unlock_submit: 'grant.category_unlock_submit',
  grant_category_unlock_success: 'grant.category_unlock_success',
  grant_category_unlock_error: 'grant.category_unlock_error',
  foundation_card_click: 'foundation.card_click',
  foundation_category_filter_change: 'foundation.category_filter',
  foundation_unlock_submit: 'foundation.unlock_submit',
  foundation_unlock_success: 'foundation.unlock_success',
  foundation_unlock_error: 'foundation.unlock_error',
  deadline_filter_toggle: 'deadline.filter_toggle',
  deadline_reminder_signup: 'deadline.reminder_signup',
  deadline_filters_cleared: 'deadline.filters_cleared',
  deadline_search: 'deadline.search',
  cost_calculator_submit: 'calculator.submit',
  cost_calculator_email: 'calculator.email',
  external_link_click: 'external.link_click',
}

function mapEventName(ga4Name: string): string {
  return EVENT_MAP[ga4Name] || 'site.other'
}

// ---------------------------------------------------------------------------
// Supabase event queue — batched POST to /api/events/track
// ---------------------------------------------------------------------------

interface QueuedEvent {
  event: string
  anon_id: string | null
  metadata: Record<string, unknown> | undefined
}

let queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null
const FLUSH_INTERVAL_MS = 2000
const FLUSH_SIZE = 10

function flushEvents() {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
  if (queue.length === 0) return

  const batch = queue.splice(0, 20)

  try {
    fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    }).catch(() => {
      // Best-effort — don't retry
    })
  } catch {
    // Swallow
  }
}

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(flushEvents, FLUSH_INTERVAL_MS)
}

function queueEvent(supabaseEvent: string, params?: Record<string, string | number>) {
  if (typeof window === 'undefined') return

  queue.push({
    event: supabaseEvent,
    anon_id: getAnonId(),
    metadata: params,
  })

  if (queue.length >= FLUSH_SIZE) {
    flushEvents()
  } else {
    scheduleFlush()
  }
}

// Flush on tab hide / close
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEvents()
  })
}

// ---------------------------------------------------------------------------
// Public API — dual-write to GA4 + Supabase
// ---------------------------------------------------------------------------

export function trackEvent(eventName: string, params?: Record<string, AnalyticsValue>) {
  const cleanParams = sanitizeParams(params)

  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, cleanParams)
  }

  // Supabase
  queueEvent(mapEventName(eventName), cleanParams)
}
