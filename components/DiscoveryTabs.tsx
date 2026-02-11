'use client'

import { trackEvent } from '@/lib/analytics'

export type DiscoveryTab = 'grants' | 'funders'

interface Props {
  activeTab: DiscoveryTab
  onTabChange: (tab: DiscoveryTab) => void
  grantCount: number
  funderCount: number
  funderLoading?: boolean
}

export default function DiscoveryTabs({
  activeTab,
  onTabChange,
  grantCount,
  funderCount,
  funderLoading,
}: Props) {
  const tabs: { id: DiscoveryTab; label: string; count: number; loading?: boolean }[] = [
    { id: 'grants', label: 'Grant Matches', count: grantCount },
    { id: 'funders', label: 'Funder Matches', count: funderCount, loading: funderLoading },
  ]

  return (
    <div className="flex gap-1 border-b border-navy/8 mb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => {
            onTabChange(tab.id)
            trackEvent('grant_discovery_tab_switch', { tab: tab.id })
          }}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-navy'
              : 'text-navy-light/50 hover:text-navy-light'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {tab.label}
            {tab.loading ? (
              <span className="inline-flex items-center justify-center w-5 h-5">
                <svg className="animate-spin h-3 w-3 text-navy-light/40" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : (
              <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id
                  ? 'bg-navy text-white'
                  : 'bg-navy/8 text-navy-light/50'
              }`}>
                {tab.count}
              </span>
            )}
          </span>
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
