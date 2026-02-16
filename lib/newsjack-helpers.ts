import { createHmac, randomBytes } from 'crypto'

/** SHA-256 hash of a headline for dedup */
export function hashHeadline(headline: string): string {
  return createHmac('sha256', 'newsjack-dedup')
    .update(headline.trim().toLowerCase())
    .digest('hex')
}

/** Generate an HMAC-signed action token encoding story ID + action */
export function generateActionToken(storyId: string, action: string): string {
  const secret = process.env.NEWSJACK_ACTION_SECRET
  if (!secret) throw new Error('NEWSJACK_ACTION_SECRET not configured')

  const nonce = randomBytes(8).toString('hex')
  const payload = `${storyId}:${action}:${nonce}`
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

/** Verify and decode an action token. Returns { storyId, action } or null. */
export function verifyActionToken(token: string): { storyId: string; action: string } | null {
  const secret = process.env.NEWSJACK_ACTION_SECRET
  if (!secret) return null

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length !== 4) return null

    const [storyId, action, nonce, sig] = parts
    const expected = createHmac('sha256', secret)
      .update(`${storyId}:${action}:${nonce}`)
      .digest('hex')

    if (sig !== expected) return null
    return { storyId, action }
  } catch {
    return null
  }
}

/** Convert a title string to a URL-safe slug */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}
