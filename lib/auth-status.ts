const SIGNED_IN_COOKIE = 'gf_signed_in'
const USER_NAME_COOKIE = 'gf_user_name'
const USER_ID_COOKIE = 'gf_user_id'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  try {
    const match = document.cookie.split(';').find(c => c.trim().startsWith(`${name}=`))
    if (!match) return null
    return decodeURIComponent(match.split('=').slice(1).join('=').trim())
  } catch {
    return null
  }
}

/** True when the user has signed in via app.grantedai.com (cross-domain cookie). */
export function isSignedIn(): boolean {
  return getCookie(SIGNED_IN_COOKIE) === '1'
}

/** Return the user's display name from the cross-domain cookie, or null. */
export function getUserName(): string | null {
  return getCookie(USER_NAME_COOKIE) || null
}

/** Return the user's ID (Supabase auth UID) from the cross-domain cookie, or null. */
export function getUserId(): string | null {
  return getCookie(USER_ID_COOKIE) || null
}

/** Clear cross-domain auth cookies (client-side sign-out from marketing site). */
export function clearAuthCookies(): void {
  if (typeof document === 'undefined') return
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = `${SIGNED_IN_COOKIE}=; domain=.grantedai.com; path=/; expires=${expires}; secure; samesite=lax`
  document.cookie = `${USER_NAME_COOKIE}=; domain=.grantedai.com; path=/; expires=${expires}; secure; samesite=lax`
  document.cookie = `${USER_ID_COOKIE}=; domain=.grantedai.com; path=/; expires=${expires}; secure; samesite=lax`
}
