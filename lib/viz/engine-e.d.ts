import type { SearchVisualization } from './types'

declare class RisingStakesEngine implements SearchVisualization {
  init(container: HTMLElement, config: import('./types').VizConfig, d3?: unknown): void
  addBatch(provider: string, grants: import('./types').VizGrant[], isInitial: boolean): void
  rerank(grants: import('./types').VizGrant[]): void
  complete(summary: { totalCount: number; durationMs: number }): void
  onGrantSelect(callback: (grant: import('./types').VizGrant) => void): void
  reset(): void
  destroy(): void
}

export default RisingStakesEngine
