'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

const SEARCH_ENGINE_HOSTS = [
  'google.',
  'bing.com',
  'search.yahoo.com',
  'duckduckgo.com',
  'ecosia.org',
  'baidu.com',
  'yandex.',
  'aol.com',
  'ask.com',
  'naver.com',
]

const SOCIAL_HOSTS = [
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'twitter.com',
  'x.com',
  't.co',
  'reddit.com',
  'youtube.com',
  'tiktok.com',
]

const SESSION_ID_KEY = 'ga_session_id'
const LANDING_RECORDED_KEY = 'ga_landing_recorded'
const LAST_PAGE_KEY = 'ga_last_page_tracked'

function hostMatches(hostname: string, candidates: string[]): boolean {
  return candidates.some((candidate) => hostname.includes(candidate))
}

function getReferrerContext() {
  if (typeof document === 'undefined' || !document.referrer) {
    return { type: 'direct', host: '' }
  }

  try {
    const refUrl = new URL(document.referrer)
    const refHost = refUrl.hostname.toLowerCase()
    const currentHost = window.location.hostname.toLowerCase()

    if (refHost === currentHost) return { type: 'internal', host: refHost }
    if (hostMatches(refHost, SEARCH_ENGINE_HOSTS)) return { type: 'search_engine', host: refHost }
    if (hostMatches(refHost, SOCIAL_HOSTS)) return { type: 'social', host: refHost }
    return { type: 'referral', host: refHost }
  } catch {
    return { type: 'unknown', host: '' }
  }
}

function getPageType(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname === '/grants') return 'grants_index'
  if (pathname.startsWith('/grants/')) return 'grants_slug'
  if (pathname.startsWith('/blog/')) return 'blog_post'
  return 'site_page'
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  const existing = window.sessionStorage.getItem(SESSION_ID_KEY)
  if (existing) return existing

  const generated =
    typeof window.crypto !== 'undefined' && 'randomUUID' in window.crypto
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  window.sessionStorage.setItem(SESSION_ID_KEY, generated)
  return generated
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA4_ID) return
    if (!pathname) return
    const pendingTimers: number[] = []

    const sendWithRetry = (
      eventName: string,
      params: Record<string, string | number | boolean | null | undefined>,
      attempt = 0,
    ) => {
      if (typeof window !== 'undefined' && window.gtag) {
        trackEvent(eventName, params)
        return
      }
      if (attempt >= 8) return
      const timer = window.setTimeout(() => {
        sendWithRetry(eventName, params, attempt + 1)
      }, 350)
      pendingTimers.push(timer)
    }

    const query = searchParams.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    const lastTracked = window.sessionStorage.getItem(LAST_PAGE_KEY)

    if (lastTracked === pagePath) return
    window.sessionStorage.setItem(LAST_PAGE_KEY, pagePath)

    const sessionId = getOrCreateSessionId()
    const referrer = getReferrerContext()
    const pageType = getPageType(pathname)
    const slug = pathname.startsWith('/grants/') ? pathname.replace('/grants/', '') : ''
    const landingAlreadyTracked = window.sessionStorage.getItem(LANDING_RECORDED_KEY) === '1'

    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    const utmTerm = searchParams.get('utm_term')
    const utmContent = searchParams.get('utm_content')
    const gclid = searchParams.get('gclid')
    const fbclid = searchParams.get('fbclid')
    const msclkid = searchParams.get('msclkid')

    const commonParams = {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      page_type: pageType,
      page_slug: slug || undefined,
      query_string: query || undefined,
      referrer_type: referrer.type,
      referrer_host: referrer.host || undefined,
      session_id: sessionId,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
      gclid,
      fbclid,
      msclkid,
    }

    sendWithRetry('page_view', commonParams)
    sendWithRetry('page_view_enriched', commonParams)

    if (!landingAlreadyTracked) {
      window.sessionStorage.setItem(LANDING_RECORDED_KEY, '1')
      sendWithRetry('landing_page', {
        ...commonParams,
        landing_page_path: pathname,
      })
    }

    if (pathname.startsWith('/grants/')) {
      sendWithRetry('grant_page_view', commonParams)
      if (!landingAlreadyTracked) {
        sendWithRetry('grant_landing', {
          ...commonParams,
          is_seo_landing: referrer.type === 'search_engine',
        })
      }
      if (!landingAlreadyTracked && referrer.type === 'search_engine') {
        sendWithRetry('seo_grant_landing', {
          ...commonParams,
          search_engine: referrer.host || 'unknown',
        })
      }
    }

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const clickable = target.closest('a,button') as HTMLAnchorElement | HTMLButtonElement | null
      if (!clickable) return

      const tag = clickable.tagName.toLowerCase()
      const text = clickable.textContent?.trim().replace(/\s+/g, ' ').slice(0, 140) || ''
      const href = tag === 'a' ? (clickable as HTMLAnchorElement).href : ''

      let clickType = 'button'
      let clickHost = ''
      let isExternal = false

      if (href) {
        clickType = 'link'
        try {
          const hrefUrl = new URL(href, window.location.origin)
          clickHost = hrefUrl.hostname
          isExternal = hrefUrl.hostname !== window.location.hostname
        } catch {
          clickHost = ''
        }
      }

      sendWithRetry('site_click', {
        page_path: pathname,
        page_type: pageType,
        click_type: clickType,
        element_tag: tag,
        click_text: text || undefined,
        click_href: href || undefined,
        click_host: clickHost || undefined,
        is_external_click: isExternal,
      })
    }

    document.addEventListener('click', clickHandler, true)

    return () => {
      document.removeEventListener('click', clickHandler, true)
      pendingTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [pathname, searchParams])

  return null
}
