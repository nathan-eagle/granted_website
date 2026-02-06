'use client'

import { useState } from 'react'

type CheckoutPlan = 'monthly' | 'yearly'

interface CheckoutButtonProps {
  plan?: CheckoutPlan
  label?: string
  className?: string
}

export default function CheckoutButton({
  plan = 'monthly',
  label = 'Start Writing',
  className = '',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  async function go() {
    setLoading(true)
    const url = plan === 'yearly'
      ? process.env.NEXT_PUBLIC_STRIPE_YEARLY_URL
      : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL
    if (url) {
      window.location.href = url
    } else {
      // Fallback to Google OAuth sign-in when Stripe URLs aren't configured
      window.location.href = 'https://app.grantedai.com/api/auth/signin?callbackUrl=/overview'
    }
  }
  const baseStyles =
    'inline-flex items-center justify-center rounded-md border border-yellow-500 bg-yellow-400 px-6 py-3 font-semibold text-black shadow transition hover:bg-yellow-300 disabled:opacity-60'
  const buttonClassName = `${baseStyles} ${className}`.trim()

  return (
    <button
      type="button"
      onClick={go}
      disabled={loading}
      className={buttonClassName}
      aria-busy={loading}
    >
      {loading ? 'Redirecting…' : label}
    </button>
  )
}
