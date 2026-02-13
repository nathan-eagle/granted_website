type DripInput = {
  unsubscribeUrl: string
}

type DripDay14Input = DripInput & {
  grantCount: number
  searchQuery: string
}

// ---------------------------------------------------------------------------
// Day 3: Grant search tips
// ---------------------------------------------------------------------------

export function buildDripDay3Text({ unsubscribeUrl }: DripInput): string {
  return [
    '3 tips for finding the right grant',
    '',
    'Hi there,',
    '',
    'You searched for grants on Granted a few days ago. Here are 3 quick tips to help you find the best match:',
    '',
    '1. Be specific with your focus area',
    '   "Youth mentoring program for at-risk teens in urban areas" will return much better results than just "youth programs".',
    '',
    '2. Save your search for weekly updates',
    '   New grants are posted every day. Save your search and we\'ll email you when new matches appear.',
    '',
    '3. Check eligibility before you apply',
    '   Each grant page shows who can apply. Make sure your organization type matches before investing time.',
    '',
    'Search for grants: https://grantedai.com/grants',
    '',
    '---',
    `Unsubscribe: ${unsubscribeUrl}`,
    '',
    'Granted AI · grantedai.com',
  ].join('\n')
}

export function buildDripDay3Html({ unsubscribeUrl }: DripInput): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f4f4f5; font-family: 'DM Sans', system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden;">
        <tr><td style="background: #1a1a2e; padding: 24px 30px;">
          <div style="color: #F5CF49; font-weight: 700; font-size: 18px;">Granted</div>
        </td></tr>
        <tr><td style="padding: 30px;">
          <h1 style="margin: 0 0 16px; font-size: 22px; color: #1a1a2e;">3 tips for finding the right grant</h1>
          <p style="margin: 0 0 24px; color: #555; font-size: 15px; line-height: 1.6;">You searched for grants on Granted a few days ago. Here are 3 quick tips to find the best match:</p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding: 16px 20px; background: #f8f9fa; border-radius: 6px; margin-bottom: 12px;">
              <div style="font-weight: 700; color: #1a1a2e; font-size: 14px; margin-bottom: 6px;">1. Be specific with your focus area</div>
              <div style="color: #666; font-size: 13px; line-height: 1.5;">&ldquo;Youth mentoring program for at-risk teens in urban areas&rdquo; returns much better results than just &ldquo;youth programs.&rdquo;</div>
            </td></tr>
            <tr><td style="height: 12px;"></td></tr>
            <tr><td style="padding: 16px 20px; background: #f8f9fa; border-radius: 6px;">
              <div style="font-weight: 700; color: #1a1a2e; font-size: 14px; margin-bottom: 6px;">2. Save your search for weekly updates</div>
              <div style="color: #666; font-size: 13px; line-height: 1.5;">New grants are posted every day. Save your search and we&rsquo;ll email you when new matches appear.</div>
            </td></tr>
            <tr><td style="height: 12px;"></td></tr>
            <tr><td style="padding: 16px 20px; background: #f8f9fa; border-radius: 6px;">
              <div style="font-weight: 700; color: #1a1a2e; font-size: 14px; margin-bottom: 6px;">3. Check eligibility before you apply</div>
              <div style="color: #666; font-size: 13px; line-height: 1.5;">Each grant page shows who can apply. Make sure your organization type matches before investing time.</div>
            </td></tr>
          </table>

          <div style="margin-top: 28px; text-align: center;">
            <a href="https://grantedai.com/grants" style="display: inline-block; background: #F5CF49; color: #1a1a2e; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Search for Grants</a>
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

// ---------------------------------------------------------------------------
// Day 7: Free trial push
// ---------------------------------------------------------------------------

export function buildDripDay7Text({ unsubscribeUrl }: DripInput): string {
  return [
    'Your grants are waiting — start your free proposal',
    '',
    'Hi there,',
    '',
    'Finding the right grant is only half the battle. Writing a winning proposal is where most organizations get stuck.',
    '',
    'Granted\'s AI grant writing assistant can help you:',
    '',
    '- Draft a full proposal in hours, not weeks',
    '- Match your organization\'s strengths to funder priorities',
    '- Generate budget narratives, logic models, and evaluation plans',
    '- Export a polished, submission-ready document',
    '',
    'Start your free 7-day trial — no credit card required.',
    '',
    'Get started: https://app.grantedai.com',
    '',
    '---',
    `Unsubscribe: ${unsubscribeUrl}`,
    '',
    'Granted AI · grantedai.com',
  ].join('\n')
}

export function buildDripDay7Html({ unsubscribeUrl }: DripInput): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f4f4f5; font-family: 'DM Sans', system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden;">
        <tr><td style="background: #1a1a2e; padding: 24px 30px;">
          <div style="color: #F5CF49; font-weight: 700; font-size: 18px;">Granted</div>
        </td></tr>
        <tr><td style="padding: 30px;">
          <h1 style="margin: 0 0 16px; font-size: 22px; color: #1a1a2e;">Your grants are waiting</h1>
          <p style="margin: 0 0 8px; color: #555; font-size: 15px; line-height: 1.6;">Finding the right grant is only half the battle. Writing a winning proposal is where most organizations get stuck.</p>
          <p style="margin: 0 0 24px; color: #555; font-size: 15px; line-height: 1.6;">Granted&rsquo;s AI grant writing assistant helps you go from discovery to submission:</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px 16px; border-left: 3px solid #F5CF49;">
                <div style="color: #1a1a2e; font-size: 14px; font-weight: 600;">Draft a full proposal in hours, not weeks</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-left: 3px solid #F5CF49;">
                <div style="color: #1a1a2e; font-size: 14px; font-weight: 600;">Match your strengths to funder priorities</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-left: 3px solid #F5CF49;">
                <div style="color: #1a1a2e; font-size: 14px; font-weight: 600;">Generate budgets, logic models, and eval plans</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-left: 3px solid #F5CF49;">
                <div style="color: #1a1a2e; font-size: 14px; font-weight: 600;">Export a polished, submission-ready document</div>
              </td>
            </tr>
          </table>

          <div style="text-align: center; margin-bottom: 16px;">
            <a href="https://app.grantedai.com" style="display: inline-block; background: #F5CF49; color: #1a1a2e; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px;">Start Your Free 7-Day Trial</a>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px; margin: 0;">No credit card required.</p>
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

// ---------------------------------------------------------------------------
// Day 14: Fresh results + last push
// ---------------------------------------------------------------------------

export function buildDripDay14Text({ unsubscribeUrl, grantCount, searchQuery }: DripDay14Input): string {
  return [
    `We found ${grantCount} new grant${grantCount === 1 ? '' : 's'} in your area`,
    '',
    'Hi there,',
    '',
    `Since you last searched for "${searchQuery}", we've added ${grantCount} new grant${grantCount === 1 ? '' : 's'} that may match your needs.`,
    '',
    `See results: https://grantedai.com/grants?q=${encodeURIComponent(searchQuery)}`,
    '',
    'Ready to turn one of these into a winning proposal? Granted\'s AI assistant can help you draft, refine, and export a full application.',
    '',
    'Start your free trial: https://app.grantedai.com',
    '',
    '---',
    `Unsubscribe: ${unsubscribeUrl}`,
    '',
    'Granted AI · grantedai.com',
  ].join('\n')
}

export function buildDripDay14Html({ unsubscribeUrl, grantCount, searchQuery }: DripDay14Input): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f4f4f5; font-family: 'DM Sans', system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden;">
        <tr><td style="background: #1a1a2e; padding: 24px 30px;">
          <div style="color: #F5CF49; font-weight: 700; font-size: 18px;">Granted</div>
        </td></tr>
        <tr><td style="padding: 30px;">
          <h1 style="margin: 0 0 16px; font-size: 22px; color: #1a1a2e;">${grantCount} new grant${grantCount === 1 ? '' : 's'} in your area</h1>
          <p style="margin: 0 0 24px; color: #555; font-size: 15px; line-height: 1.6;">Since you last searched for &ldquo;${searchQuery}&rdquo;, we&rsquo;ve added new grants that may match your needs.</p>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://grantedai.com/grants?q=${encodeURIComponent(searchQuery)}" style="display: inline-block; background: #1a1a2e; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">View Your Results</a>
          </div>

          <div style="background: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
            <div style="font-weight: 700; color: #1a1a2e; font-size: 15px; margin-bottom: 8px;">Ready to apply?</div>
            <div style="color: #666; font-size: 13px; line-height: 1.5; margin-bottom: 16px;">Granted&rsquo;s AI assistant helps you draft a full proposal, match funder priorities, and export a submission-ready document.</div>
            <a href="https://app.grantedai.com" style="display: inline-block; background: #F5CF49; color: #1a1a2e; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px;">Start Your Free Trial</a>
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
