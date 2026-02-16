const COOKIE_NAME = 'gf_signed_in'

/** True when the user has signed in via app.grantedai.com (cross-domain cookie). */
export function isSignedIn(): boolean {
  if (typeof document === 'undefined') return false
  try {
    return document.cookie.split(';').some(c => c.trim().startsWith(`${COOKIE_NAME}=`))
  } catch {
    return false
  }
}
