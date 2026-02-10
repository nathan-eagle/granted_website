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

export function trackEvent(eventName: string, params?: Record<string, AnalyticsValue>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, sanitizeParams(params))
}
