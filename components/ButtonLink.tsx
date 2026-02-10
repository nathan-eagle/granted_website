'use client'

import { ComponentProps } from 'react'
import Link from 'next/link'
import { trackEvent, type AnalyticsValue } from '@/lib/analytics'

type Props = ComponentProps<'a'> & {
  href: string
  variant?: 'primary' | 'ghost'
  eventName?: string
  eventParams?: Record<string, AnalyticsValue>
}

export function ButtonLink({
  href,
  children,
  className = '',
  variant = 'primary',
  eventName,
  eventParams,
  onClick,
  ...rest
}: Props) {
  const base = 'button ' + (variant === 'primary' ? 'button-primary' : 'button-ghost')
  return (
    <Link
      href={href}
      className={base + ' ' + className}
      onClick={(e) => {
        onClick?.(e)
        trackEvent(eventName || 'button_link_click', {
          href,
          label: typeof children === 'string' ? children : undefined,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          ...eventParams,
        })
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
