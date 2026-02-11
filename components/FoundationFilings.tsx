'use client'

import type { FoundationFiling } from '@/lib/foundations'

type Props = {
  filings: FoundationFiling[]
  ein: string
}

export default function FoundationFilings({ filings }: Props) {
  if (filings.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="heading-md text-navy text-2xl font-bold mb-6">990-PF Filings</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/10 bg-cream-dark/50">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
                Tax Period
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50">
                Return Type
              </th>
            </tr>
          </thead>
          <tbody>
            {filings.map((f) => {
              const taxPeriodLabel = f.tax_period
                ? `${f.tax_period.slice(0, 4)}-${f.tax_period.slice(4)}`
                : String(f.fiscal_year)

              return (
                <tr key={f.id} className="border-b border-navy/5 hover:bg-navy/[0.02]">
                  <td className="py-3 px-4 text-navy font-medium tabular-nums">
                    {taxPeriodLabel}
                  </td>
                  <td className="py-3 px-4 text-navy-light">
                    {f.return_type || '990PF'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-navy-light/40 mt-3">
        Filings sourced from IRS e-file index.
      </p>
    </section>
  )
}
