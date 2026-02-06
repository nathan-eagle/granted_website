declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}
