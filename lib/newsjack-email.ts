const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://grantedai.com'

type DetectionEmailParams = {
  storyId: string
  headline: string
  sourceUrl: string
  relevanceScore: number
  timelinessScore: number
  grantAngle: string
  approveToken: string
  skipToken: string
}

type ReviewEmailParams = {
  storyId: string
  title: string
  slug: string
  wordCount: number
  qualityPass: boolean
  qualityIssues: string[]
  publishToken: string
  rejectToken: string
}

function actionUrl(token: string): string {
  return `${SITE_BASE}/api/newsjack/action?token=${encodeURIComponent(token)}`
}

/** Send a detection notification email via Resend */
export async function sendDetectionEmail(params: DetectionEmailParams): Promise<void> {
  const to = process.env.NEWSJACK_NOTIFY_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) {
    console.warn('[newsjack] Missing NEWSJACK_NOTIFY_EMAIL or RESEND_API_KEY, skipping email')
    return
  }

  const approveUrl = actionUrl(params.approveToken)
  const skipUrl = actionUrl(params.skipToken)

  const html = `
<div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a1a2e;">Trending Grant Story Detected</h2>
  <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 16px 0;">
    <h3 style="margin: 0 0 8px;">${escapeHtml(params.headline)}</h3>
    <p style="color: #666; margin: 4px 0;"><strong>Source:</strong> <a href="${escapeHtml(params.sourceUrl)}">${escapeHtml(params.sourceUrl)}</a></p>
    <p style="color: #666; margin: 4px 0;"><strong>Relevance:</strong> ${params.relevanceScore}/10 | <strong>Timeliness:</strong> ${params.timelinessScore}/10</p>
    <p style="color: #444; margin: 12px 0 0;"><strong>Grant Angle:</strong> ${escapeHtml(params.grantAngle)}</p>
  </div>
  <div style="margin: 24px 0;">
    <a href="${approveUrl}" style="display: inline-block; background: #f59e0b; color: #000; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-right: 12px;">Approve & Generate</a>
    <a href="${skipUrl}" style="display: inline-block; background: #e5e7eb; color: #374151; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Skip</a>
  </div>
  <p style="color: #999; font-size: 12px;">Story ID: ${params.storyId}</p>
</div>`

  await sendViaResend(apiKey, to, `[Newsjack] ${params.headline}`, html)
}

/** Send a review notification email via Resend */
export async function sendReviewEmail(params: ReviewEmailParams): Promise<void> {
  const to = process.env.NEWSJACK_NOTIFY_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) {
    console.warn('[newsjack] Missing NEWSJACK_NOTIFY_EMAIL or RESEND_API_KEY, skipping email')
    return
  }

  const publishUrl = actionUrl(params.publishToken)
  const rejectUrl = actionUrl(params.rejectToken)
  const previewUrl = `${SITE_BASE}/blog/news/${params.slug}`

  const qualityBadge = params.qualityPass
    ? '<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 13px;">PASS</span>'
    : '<span style="background: #fef2f2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-size: 13px;">ISSUES FOUND</span>'

  const issuesList = params.qualityIssues.length > 0
    ? `<ul style="color: #991b1b; margin: 8px 0;">${params.qualityIssues.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
    : ''

  const html = `
<div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a1a2e;">Article Ready for Review</h2>
  <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 16px 0;">
    <h3 style="margin: 0 0 8px;">${escapeHtml(params.title)}</h3>
    <p style="color: #666; margin: 4px 0;"><strong>Words:</strong> ${params.wordCount} | <strong>Quality:</strong> ${qualityBadge}</p>
    ${issuesList}
  </div>
  <div style="margin: 24px 0;">
    <a href="${previewUrl}" style="display: inline-block; background: #e0e7ff; color: #3730a3; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-right: 12px;">Preview</a>
    <a href="${publishUrl}" style="display: inline-block; background: #f59e0b; color: #000; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-right: 12px;">Publish Now</a>
    <a href="${rejectUrl}" style="display: inline-block; background: #fef2f2; color: #991b1b; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Reject</a>
  </div>
  <p style="color: #999; font-size: 12px;">Story ID: ${params.storyId}</p>
</div>`

  await sendViaResend(apiKey, to, `[Review] ${params.title}`, html)
}

async function sendViaResend(apiKey: string, to: string, subject: string, html: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? 'Granted AI <hello@grantedai.com>',
      to: [to],
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[newsjack] Resend error: ${res.status} ${body.slice(0, 300)}`)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
