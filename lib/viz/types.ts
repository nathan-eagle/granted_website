// Shared types for search visualization engines (Concept D & E)

export interface VizGrant {
  id: string
  name: string
  funder: string
  amount: string
  deadline: string
  fit_score: number
  summary: string
  type: 'Federal' | 'Foundation' | 'Corporate'
  source?: string
  url?: string
  slug?: string
  eligibility?: string
  match_reasons?: string[]
}

export interface VizConfig {
  focusArea: string
  orgType: string
  state: string
  soundEnabled: boolean
}

export type VizMode = 'discovery-map' | 'rising-stakes'

export interface SearchVisualization {
  init(container: HTMLElement, config: VizConfig, d3?: unknown): void
  addBatch(provider: string, grants: VizGrant[], isInitial: boolean): void
  rerank(grants: VizGrant[]): void
  complete(summary: { totalCount: number; durationMs: number }): void
  /** Render all grants in final state instantly (no animation). Used when switching back to viz after enrichment. */
  loadAll(grants: VizGrant[]): void
  onGrantSelect(callback: (grant: VizGrant) => void): void
  reset(): void
  destroy(): void
}

export type ProviderName =
  | 'gemini'
  | 'perplexity_sonar_pro'
  | 'openai_gpt5'
  | 'claude_sonnet'
  | 'perplexity_reasoning'
  | 'grok'

export interface StreamEnvelope {
  type: 'db_results' | 'model_batch' | 'model_error' | 'reranked' | 'complete' | 'heartbeat'
  [key: string]: unknown
}
