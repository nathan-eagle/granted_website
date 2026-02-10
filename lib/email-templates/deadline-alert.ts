type DeadlineGrant = {
  name: string
  funder: string
  slug: string
  deadline: string
  amount: string | null
}

type DeadlineAlertInput = {
  grants: DeadlineGrant[]
  unsubscribeUrl: string
}

export function buildDeadlineAlertText({ grants, unsubscribeUrl }: DeadlineAlertInput): string {
  const lines: string[] = [
    'Grant deadlines approaching!',
    '',
    `${grants.length} grant${grants.length === 1 ? '' : 's'} from your saved searches have deadlines in the next 7 days.`,
    '',
  ]

  for (const grant of grants) {
    const daysLeft = Math.max(1, Math.ceil((Date.parse(grant.deadline) - Date.now()) / (1000 * 60 * 60 * 24)))
    lines.push(`• ${grant.name} — ${grant.funder}`)
    lines.push(`  Deadline: ${new Date(grant.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${daysLeft} day${daysLeft === 1 ? '' : 's'} left)`)
    if (grant.amount) lines.push(`  Amount: ${grant.amount}`)
    lines.push(`  View: https://grantedai.com/grants/${grant.slug}`)
    lines.push('')
  }

  lines.push('---')
  lines.push('Start your proposal with AI: https://app.grantedai.com')
  lines.push('')
  lines.push(`Unsubscribe: ${unsubscribeUrl}`)
  lines.push('')
  lines.push('Granted AI · grantedai.com')

  return lines.join('\n')
}

export function buildDeadlineAlertHtml({ grants, unsubscribeUrl }: DeadlineAlertInput): string {
  const grantCards = grants.map((grant) => {
    const deadline = new Date(grant.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const daysLeft = Math.max(1, Math.ceil((Date.parse(grant.deadline) - Date.now()) / (1000 * 60 * 60 * 24)))
    return `
      <tr><td style="padding: 16px 0; border-bottom: 1px solid #eee;">
        <a href="https://grantedai.com/grants/${grant.slug}" style="color: #1a1a2e; text-decoration: none; font-weight: 600; font-size: 15px;">${grant.name}</a>
        <div style="color: #666; font-size: 13px; margin-top: 4px;">${grant.funder}</div>
        <div style="margin-top: 6px;">
          <span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${daysLeft} day${daysLeft === 1 ? '' : 's'} left — ${deadline}</span>
        </div>
        ${grant.amount ? `<div style="color: #888; font-size: 12px; margin-top: 4px;">${grant.amount}</div>` : ''}
      </td></tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f4f4f5; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden;">
        <tr><td style="background: #92400e; padding: 24px 30px;">
          <div style="color: #fef3c7; font-weight: 700; font-size: 18px;">Granted</div>
          <div style="color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 4px;">Deadline Alert</div>
        </td></tr>
        <tr><td style="padding: 30px;">
          <h1 style="margin: 0 0 8px; font-size: 20px; color: #1a1a2e;">Deadlines approaching!</h1>
          <p style="margin: 0 0 24px; color: #666; font-size: 14px;">${grants.length} grant${grants.length === 1 ? ' has a deadline' : 's have deadlines'} in the next 7 days.</p>
          <table width="100%" cellpadding="0" cellspacing="0">${grantCards}</table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="https://app.grantedai.com" style="display: inline-block; background: #F5CF49; color: #1a1a2e; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Start Your Proposal with AI</a>
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
