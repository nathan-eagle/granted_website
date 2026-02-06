'use client'

import { useState } from 'react'
import CheckoutButton from '@/components/CheckoutButton'

const PLANS = [
  {
    name: 'Basic',
    badge: null as string | null,
    monthly: {
      price: '$29',
      cadence: 'per month billed monthly',
      note: null as string | null,
    },
    annual: {
      price: '$290',
      cadence: 'per year (save 2 months)',
      note: 'Effective rate $24/mo when billed annually',
    },
    features: [
      '20k words per month',
      'AI Grant Coach',
      'RFP Analysis & Requirement Discovery',
      'Unlimited Projects',
    ],
  },
  {
    name: 'Professional',
    badge: 'Most Popular',
    monthly: {
      price: '$89',
      cadence: 'per month billed monthly',
      note: null as string | null,
    },
    annual: {
      price: '$890',
      cadence: 'per year (save 2 months)',
      note: 'Effective rate $74/mo when billed annually',
    },
    features: [
      'Unlimited words',
      'Early Access to New Features',
      'AI Grant Coach',
      'RFP Analysis & Requirement Discovery',
      'Unlimited Projects',
    ],
  },
]

const BILLING = [
  { id: 'monthly' as const, label: 'Monthly' },
  { id: 'annual' as const, label: 'Annual', helper: '2 months free' },
]

export function PricingTable() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {BILLING.map(option => {
          const isActive = billing === option.id
          return (
            <button
              key={option.id}
              type="button"
              className={`button ${isActive ? 'button-primary' : 'button-ghost'}`}
              onClick={() => setBilling(option.id)}
              aria-pressed={isActive}
            >
              <span>{option.label}</span>
              {option.helper && (
                <span className="ml-2 rounded-pill bg-white/70 px-2 py-0.5 text-xs font-semibold text-navy">
                  {option.helper}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {PLANS.map(plan => {
          const current = plan[billing]
          return (
            <div key={plan.name} className="relative">
              {plan.badge ? (
                <span className="absolute -top-4 right-6 rounded-pill bg-navy px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              ) : null}
              <div className="card flex h-full flex-col gap-6 p-10">
                <div>
                  <h2 className="text-2xl font-semibold text-navy">{plan.name}</h2>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-navy">{current.price}</span>
                    <span className="text-sm font-medium uppercase tracking-[0.08em] text-navy-light/60">
                      {current.cadence}
                    </span>
                  </div>
                  {current.note ? (
                    <p className="body-sm mt-3 text-navy-light/60">{current.note}</p>
                  ) : null}
                </div>
                <ul className="body-lg space-y-2.5 list-disc pl-6 text-navy-light">
                  {plan.features.map(feature => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <CheckoutButton
                  plan={billing === 'annual' ? 'yearly' : 'monthly'}
                  label="Start free trial"
                  className="mt-auto w-full"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
