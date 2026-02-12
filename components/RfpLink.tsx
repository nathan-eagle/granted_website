'use client'

import { useEffect, useState } from 'react'
import TrackedExternalLink from './TrackedExternalLink'
import { supabase } from '@/lib/supabase'

type Props = {
  slug: string
  initialRfpUrl: string | null
  grantName: string
  funder: string
}

export default function RfpLink({ slug, initialRfpUrl, grantName, funder }: Props) {
  const [rfpUrl, setRfpUrl] = useState(initialRfpUrl)
  const [loading, setLoading] = useState(!initialRfpUrl)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (rfpUrl || !supabase) {
      setLoading(false)
      return
    }

    let attempts = 0
    const maxAttempts = 6 // 6 * 5s = 30s

    const poll = setInterval(async () => {
      attempts++
      try {
        const { data } = await supabase!
          .from('public_grants')
          .select('rfp_url')
          .eq('slug', slug)
          .maybeSingle()

        if (data?.rfp_url) {
          setRfpUrl(data.rfp_url)
          setLoading(false)
          clearInterval(poll)
          return
        }
      } catch {
        // Ignore polling errors
      }

      if (attempts >= maxAttempts) {
        setLoading(false)
        setHidden(true)
        clearInterval(poll)
      }
    }, 5000)

    return () => clearInterval(poll)
  }, [rfpUrl, slug])

  if (hidden) return null

  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-brand-gold/60">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Locating official RFP&hellip;
      </span>
    )
  }

  if (!rfpUrl) return null

  return (
    <TrackedExternalLink
      href={rfpUrl}
      eventName="grant_detail_rfp_click"
      eventParams={{
        grant_slug: slug,
        grant_name: grantName,
        funder: funder,
      }}
      className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-brand-gold hover:underline"
    >
      View Original RFP
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline">
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </TrackedExternalLink>
  )
}
