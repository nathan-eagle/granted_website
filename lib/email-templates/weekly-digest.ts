type DigestGrant = {
  name: string
  funder: string
  slug: string
  deadline: string | null
  amount: string | null
}

type WeeklyDigestInput = {
  grants: DigestGrant[]
  searchLabel: string
  unsubscribeUrl: string
}

export function buildWeeklyDigestText({ grants, searchLabel, unsubscribeUrl }: WeeklyDigestInput): string {
  const lines: string[] = [
    `Your weekly grant digest for "${searchLabel}"`,
    '',
    `We found ${grants.length} new or updated grant${grants.length === 1 ? '' : 's'} matching your search.`,
    '',
  ]

  for (const grant of grants) {
    lines.push(`• ${grant.name} — ${grant.funder}`)
    if (grant.deadline) lines.push(`  Deadline: ${new Date(grant.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`)
    if (grant.amount) lines.push(`  Amount: ${grant.amount}`)
    lines.push(`  View: https://grantedai.com/grants/${grant.slug}`)
    lines.push('')
  }

  lines.push('---')
  lines.push(`Search for more: https://grantedai.com/find-grants?q=${encodeURIComponent(searchLabel)}`)
  lines.push('')
  lines.push('Want AI to help write your next proposal? Try Granted free: https://app.grantedai.com')
  lines.push('')
  lines.push(`Unsubscribe: ${unsubscribeUrl}`)
  lines.push('')
  lines.push('Granted AI · grantedai.com')

  return lines.join('\n')
}

export function buildWeeklyDigestHtml({ grants, searchLabel, unsubscribeUrl }: WeeklyDigestInput): string {
  const grantCards = grants.map((grant) => {
    const deadline = grant.deadline
      ? new Date(grant.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Rolling'
    return `
      <tr><td style="padding: 16px 0; border-bottom: 1px solid #eee;">
        <a href="https://grantedai.com/grants/${grant.slug}" style="color: #1a1a2e; text-decoration: none; font-weight: 600; font-size: 15px;">${grant.name}</a>
        <div style="color: #666; font-size: 13px; margin-top: 4px;">${grant.funder}</div>
        <div style="color: #888; font-size: 12px; margin-top: 4px;">Deadline: ${deadline}${grant.amount ? ` · ${grant.amount}` : ''}</div>
      </td></tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f4f4f5; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden;">
        <tr><td style="background: #1a1a2e; padding: 24px 30px;">
          <div style="color: #F5CF49; font-weight: 700; font-size: 18px;">Granted</div>
          <div style="color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 4px;">Weekly Grant Digest</div>
        </td></tr>
        <tr><td style="padding: 30px;">
          <h1 style="margin: 0 0 8px; font-size: 20px; color: #1a1a2e;">New grants for &ldquo;${searchLabel}&rdquo;</h1>
          <p style="margin: 0 0 24px; color: #666; font-size: 14px;">${grants.length} grant${grants.length === 1 ? '' : 's'} matched your saved search this week.</p>
          <table width="100%" cellpadding="0" cellspacing="0">${grantCards}</table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="https://grantedai.com/find-grants?q=${encodeURIComponent(searchLabel)}" style="display: inline-block; background: #F5CF49; color: #1a1a2e; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Search for More Grants</a>
          </div>
        </td></tr>
        <tr><td style="padding: 20px 30px; background: #f8f9fa; border-top: 1px solid #eee;">
          <div style="color: #999; font-size: 11px; text-align: center;">
            <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a> · <a href="https://grantedai.com" style="color: #999;">Granted AI</a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
