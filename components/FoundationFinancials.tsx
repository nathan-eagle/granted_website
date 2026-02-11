'use client'

import { useMemo } from 'react'
import type { FoundationFinancial } from '@/lib/foundations'
import { formatAssets } from '@/lib/foundations'

type Props = {
  financials: FoundationFinancial[]
}

export default function FoundationFinancials({ financials }: Props) {
  if (financials.length === 0) return null

  const latestYear = financials[financials.length - 1]
  const previousYear = financials.length >= 2 ? financials[financials.length - 2] : null

  // Giving trend data
  const givingData = useMemo(
    () =>
      financials
        .filter((f) => f.total_giving !== null && f.total_giving > 0)
        .map((f) => ({
          year: f.fiscal_year,
          giving: f.total_giving!,
          assets: f.total_assets,
        })),
    [financials],
  )

  const maxGiving = Math.max(...givingData.map((d) => d.giving), 1)

  // Year-over-year giving change
  const givingChange =
    previousYear?.total_giving && latestYear.total_giving
      ? ((latestYear.total_giving - previousYear.total_giving) / previousYear.total_giving) * 100
      : null

  // Asset growth data
  const assetData = useMemo(
    () =>
      financials
        .filter((f) => f.total_assets !== null && f.total_assets > 0)
        .map((f) => ({ year: f.fiscal_year, assets: f.total_assets! })),
    [financials],
  )

  const maxAssets = Math.max(...assetData.map((d) => d.assets), 1)

  // Asset growth
  const assetChange =
    previousYear?.total_assets && latestYear.total_assets
      ? ((latestYear.total_assets - previousYear.total_assets) / previousYear.total_assets) * 100
      : null

  // Investment portfolio breakdown for latest year
  const investmentData = useMemo(() => {
    const items: { label: string; value: number; color: string }[] = []
    if (latestYear.investments_stock) items.push({ label: 'Corporate Stock', value: latestYear.investments_stock, color: 'bg-brand-yellow' })
    if (latestYear.investments_bonds) items.push({ label: 'Corporate Bonds', value: latestYear.investments_bonds, color: 'bg-navy/60' })
    if (latestYear.investments_govt) items.push({ label: 'Government Obligations', value: latestYear.investments_govt, color: 'bg-brand-gold/70' })
    if (latestYear.investments_other) items.push({ label: 'Other Investments', value: latestYear.investments_other, color: 'bg-navy/30' })
    if (latestYear.cash_on_hand) items.push({ label: 'Cash', value: latestYear.cash_on_hand, color: 'bg-green-500/50' })
    return items
  }, [latestYear])

  const totalInvestments = investmentData.reduce((s, d) => s + d.value, 0)

  // Expense breakdown
  const expenseData = useMemo(() => {
    const items: { label: string; value: number }[] = []
    if (latestYear.grants_paid) items.push({ label: 'Grants Paid', value: latestYear.grants_paid })
    if (latestYear.officer_compensation) items.push({ label: 'Officer Compensation', value: latestYear.officer_compensation })
    if (latestYear.pension_benefits) items.push({ label: 'Pension & Benefits', value: latestYear.pension_benefits })
    if (latestYear.legal_fees) items.push({ label: 'Legal Fees', value: latestYear.legal_fees })
    if (latestYear.accounting_fees) items.push({ label: 'Accounting Fees', value: latestYear.accounting_fees })
    if (latestYear.occupancy) items.push({ label: 'Occupancy', value: latestYear.occupancy })
    if (latestYear.travel_conferences) items.push({ label: 'Travel & Conferences', value: latestYear.travel_conferences })
    if (latestYear.interest_expense) items.push({ label: 'Interest', value: latestYear.interest_expense })
    if (latestYear.depreciation) items.push({ label: 'Depreciation', value: latestYear.depreciation })
    if (latestYear.printing_publications) items.push({ label: 'Printing & Publications', value: latestYear.printing_publications })
    return items.sort((a, b) => b.value - a.value)
  }, [latestYear])

  const maxExpense = expenseData.length > 0 ? Math.max(...expenseData.map((d) => d.value)) : 1

  // Revenue breakdown
  const revenueData = useMemo(() => {
    const items: { label: string; value: number }[] = []
    if (latestYear.contributions_received) items.push({ label: 'Contributions', value: latestYear.contributions_received })
    if (latestYear.interest_revenue) items.push({ label: 'Interest', value: latestYear.interest_revenue })
    if (latestYear.dividends) items.push({ label: 'Dividends', value: latestYear.dividends })
    if (latestYear.capital_gains_net) items.push({ label: 'Capital Gains (Net)', value: latestYear.capital_gains_net })
    if (latestYear.gross_rents) items.push({ label: 'Gross Rents', value: latestYear.gross_rents })
    if (latestYear.gross_profit_business) items.push({ label: 'Business Profits', value: latestYear.gross_profit_business })
    if (latestYear.other_income) items.push({ label: 'Other Income', value: latestYear.other_income })
    return items.sort((a, b) => b.value - a.value)
  }, [latestYear])

  // Foundation flags
  const flags = useMemo(() => {
    const items: { label: string; value: boolean }[] = []
    if (latestYear.is_operating !== null) items.push({ label: 'Operating Foundation', value: latestYear.is_operating })
    if (latestYear.grants_to_individuals !== null) items.push({ label: 'Grants to Individuals', value: latestYear.grants_to_individuals })
    if (latestYear.noncharity_grants !== null) items.push({ label: 'Non-Charity Grants', value: latestYear.noncharity_grants })
    if (latestYear.lobbying !== null) items.push({ label: 'Lobbying Activity', value: latestYear.lobbying })
    if (latestYear.excess_holdings !== null) items.push({ label: 'Excess Business Holdings', value: latestYear.excess_holdings })
    return items
  }, [latestYear])

  return (
    <section className="mt-12 space-y-10">
      <h2 className="heading-md text-navy text-2xl font-bold">Financial Overview</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Giving"
          value={formatAssets(latestYear.total_giving)}
          year={latestYear.fiscal_year}
          change={givingChange}
        />
        <MetricCard
          label="Total Assets"
          value={formatAssets(latestYear.total_assets)}
          year={latestYear.fiscal_year}
          change={assetChange}
        />
        <MetricCard
          label="Fair Market Value"
          value={formatAssets(latestYear.fair_market_value)}
          year={latestYear.fiscal_year}
        />
        <MetricCard
          label="Net Worth"
          value={formatAssets(latestYear.net_worth)}
          year={latestYear.fiscal_year}
        />
      </div>

      {/* Second row of metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Grants Paid"
          value={formatAssets(latestYear.grants_paid)}
          year={latestYear.fiscal_year}
        />
        <MetricCard
          label="Contributions"
          value={formatAssets(latestYear.contributions_received)}
          year={latestYear.fiscal_year}
        />
        <MetricCard
          label="Net Investment Income"
          value={formatAssets(latestYear.net_investment_income)}
          year={latestYear.fiscal_year}
        />
        <MetricCard
          label="Distribution Amount"
          value={formatAssets(latestYear.distribution_amount)}
          year={latestYear.fiscal_year}
        />
      </div>

      {/* Giving Trend Bar Chart */}
      {givingData.length >= 2 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Total Giving by Year
          </h3>
          <div className="flex items-end gap-[3px] md:gap-1.5 h-48">
            {givingData.map((d) => {
              const pct = (d.giving / maxGiving) * 100
              return (
                <div
                  key={d.year}
                  className="flex-1 flex flex-col items-center group relative min-w-0"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {formatAssets(d.giving)}
                  </div>
                  <div
                    className="w-full bg-brand-yellow/80 hover:bg-brand-yellow rounded-t transition-colors min-h-[4px]"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  />
                  <span className="text-[10px] md:text-xs text-navy-light/40 mt-1.5 tabular-nums">
                    {String(d.year).slice(-2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Asset Growth Chart */}
      {assetData.length >= 2 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Asset Growth
          </h3>
          <div className="flex items-end gap-[3px] md:gap-1.5 h-48">
            {assetData.map((d) => {
              const pct = (d.assets / maxAssets) * 100
              return (
                <div
                  key={d.year}
                  className="flex-1 flex flex-col items-center group relative min-w-0"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {formatAssets(d.assets)}
                  </div>
                  <div
                    className="w-full bg-navy/15 hover:bg-navy/25 rounded-t transition-colors min-h-[4px]"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  />
                  <span className="text-[10px] md:text-xs text-navy-light/40 mt-1.5 tabular-nums">
                    {String(d.year).slice(-2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Investment Portfolio Breakdown */}
      {investmentData.length >= 2 && totalInvestments > 0 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-2">
            Investment Portfolio ({latestYear.fiscal_year})
          </h3>
          <p className="text-xs text-navy-light/40 mb-6">
            Total: {formatAssets(latestYear.investments_total_sec ?? totalInvestments)}
          </p>

          {/* Stacked bar */}
          <div className="flex h-8 rounded-lg overflow-hidden mb-6">
            {investmentData.map((d, i) => (
              <div
                key={i}
                className={`${d.color} relative group`}
                style={{ width: `${(d.value / totalInvestments) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {d.label}: {formatAssets(d.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {investmentData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm ${d.color}`} />
                <span className="text-xs text-navy-light/70">
                  {d.label} ({((d.value / totalInvestments) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Breakdown */}
      {expenseData.length >= 2 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Expense Breakdown ({latestYear.fiscal_year})
          </h3>
          <div className="space-y-3">
            {expenseData.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-navy-light/70">{d.label}</span>
                  <span className="text-navy font-semibold tabular-nums">{formatAssets(d.value)}</span>
                </div>
                <div className="h-2 bg-navy/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-gold/60 rounded-full transition-all"
                    style={{ width: `${(d.value / maxExpense) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Sources */}
      {revenueData.length >= 2 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Revenue Sources ({latestYear.fiscal_year})
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {revenueData.map((d, i) => (
              <FinancialRow key={i} label={d.label} value={d.value} />
            ))}
          </dl>
        </div>
      )}

      {/* Financial Details */}
      <div className="card p-6 md:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
          Financial Details ({latestYear.fiscal_year})
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {latestYear.total_revenue !== null && (
            <FinancialRow label="Total Revenue" value={latestYear.total_revenue} />
          )}
          {latestYear.total_giving !== null && (
            <FinancialRow label="Total Expenses" value={latestYear.total_giving} />
          )}
          {latestYear.exempt_purpose_expenses !== null && (
            <FinancialRow label="Exempt Purpose Expenses" value={latestYear.exempt_purpose_expenses} />
          )}
          {latestYear.distribution_amount !== null && (
            <FinancialRow label="Required Distribution" value={latestYear.distribution_amount} />
          )}
          {latestYear.undistributed_income !== null && (
            <FinancialRow label="Undistributed Income" value={latestYear.undistributed_income} />
          )}
          {latestYear.grants_approved_future !== null && latestYear.grants_approved_future > 0 && (
            <FinancialRow label="Grants Approved (Future)" value={latestYear.grants_approved_future} />
          )}
          {latestYear.total_liabilities !== null && (
            <FinancialRow label="Total Liabilities" value={latestYear.total_liabilities} />
          )}
          {latestYear.excise_tax !== null && latestYear.excise_tax > 0 && (
            <FinancialRow label="Excise Tax" value={latestYear.excise_tax} />
          )}
          {latestYear.tax_due !== null && latestYear.tax_due > 0 && (
            <FinancialRow label="Tax Due" value={latestYear.tax_due} />
          )}
        </dl>
      </div>

      {/* Foundation Flags */}
      {flags.length > 0 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-6">
            Foundation Classification ({latestYear.fiscal_year})
          </h3>
          <div className="flex flex-wrap gap-3">
            {flags.map((f, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  f.value
                    ? 'bg-brand-yellow/15 text-brand-gold border border-brand-yellow/30'
                    : 'bg-navy/5 text-navy-light/50 border border-navy/10'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${f.value ? 'bg-brand-gold' : 'bg-navy/20'}`} />
                {f.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function MetricCard({
  label,
  value,
  year,
  change,
}: {
  label: string
  value: string
  year: number
  change?: number | null
}) {
  return (
    <div className="card p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-light/50 mb-2">{label}</p>
      <p className="text-xl md:text-2xl font-bold text-navy tabular-nums">{value}</p>
      <div className="flex items-center justify-center gap-2 mt-1.5">
        <span className="text-[10px] text-navy-light/40">{year}</span>
        {change !== null && change !== undefined && Number.isFinite(change) && (
          <span
            className={`text-[10px] font-semibold ${
              change >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {change >= 0 ? '+' : ''}
            {change.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  )
}

function FinancialRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-navy/5">
      <dt className="text-sm text-navy-light/70">{label}</dt>
      <dd className="text-sm font-semibold text-navy tabular-nums">{formatAssets(value)}</dd>
    </div>
  )
}
