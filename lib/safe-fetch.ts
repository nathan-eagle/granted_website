/**
 * Wraps an async data fetch with error logging and a typed result.
 * Distinguishes "query returned empty" from "query failed" so components
 * can show the right fallback.
 */
export type SafeResult<T> = { data: T; error: false } | { data: T; error: true }

export async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T,
  label: string,
): Promise<SafeResult<T>> {
  try {
    const data = await fn()
    return { data, error: false }
  } catch (err) {
    console.error(`[safeFetch] ${label} failed:`, err instanceof Error ? err.message : err)
    return { data: fallback, error: true }
  }
}
