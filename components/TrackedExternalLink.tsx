'use client'

import { ReactNode } from 'react'
import { trackEvent, type AnalyticsValue } from '@/lib/analytics'

type Props = {
  href: string
  eventName: string
  eventParams?: Record<string, AnalyticsValue>
  className?: string
  children: ReactNode
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

export default function TrackedExternalLink({
  href,
  eventName,
  eventParams,
  className,
  children,
  target = '_blank',
  rel = 'noopener noreferrer',
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => {
        let host = ''
        try {
          host = new URL(href).hostname
        } catch {
          host = ''
        }
        trackEvent(eventName, {
          href,
          href_host: host || undefined,
          ...eventParams,
        })
      }}
    >
      {children}
    </a>
  )
}

