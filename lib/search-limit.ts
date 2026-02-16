const STORAGE_KEY = 'gf_search_count'
export const FREE_SEARCH_LIMIT = 3

/** Return the current search count from localStorage; 0 during SSR. */
export function getSearchCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseInt(raw, 10) || 0 : 0
  } catch {
    return 0
  }
}

/** Increment the search count by 1 and persist it. */
export function incrementSearchCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const next = getSearchCount() + 1
    localStorage.setItem(STORAGE_KEY, String(next))
    return next
  } catch {
    return 0
  }
}

/** True when the user has exhausted their free searches. */
export function hasReachedSearchLimit(): boolean {
  return getSearchCount() >= FREE_SEARCH_LIMIT
}

/** How many free searches remain (never negative). */
export function getSearchesRemaining(): number {
  return Math.max(0, FREE_SEARCH_LIMIT - getSearchCount())
}
