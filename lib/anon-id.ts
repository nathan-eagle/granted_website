const STORAGE_KEY = 'gf_anon_id'

/** Return a stable anonymous UUID from localStorage; null during SSR. */
export function getAnonId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    return null
  }
}
