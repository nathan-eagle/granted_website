import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'
import { Resend } from 'resend'
import { buildDeadlineAlertText, buildDeadlineAlertHtml } from '@/lib/email-templates/deadline-alert'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.CONTACT_FROM_EMAIL || 'hello@grantedai.com'
const cronSecret = process.env.CRON_SECRET

function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'granted-unsubscribe-default'
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 32)
}

function buildUnsubscribeUrl(email: string): string {
  const token = generateUnsubscribeToken(email)
  return `https://grantedai.com/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseUrl || !supabaseKey || !resendApiKey) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 503 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  const resend = new Resend(resendApiKey)

  try {
    // Find grants with deadlines in the next 7 days
    const now = new Date().toISOString()
    const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: urgentGrants } = await supabase
      .from('public_grants')
      .select('name, funder, slug, deadline, amount, summary')
      .eq('status', 'active')
      .gte('deadline', now)
      .lte('deadline', sevenDays)
      .order('deadline', { ascending: true })

    if (!urgentGrants || urgentGrants.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No urgent deadlines' })
    }

    // Get active saved searches
    const { data: searches } = await supabase
      .from('saved_searches')
      .select('id, email, search_params, label')
      .eq('is_active', true)
      .limit(100)

    if (!searches || searches.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No active searches' })
    }

    // Check unsubscribed
    const emails = [...new Set(searches.map((s) => s.email))]
    const { data: leads } = await supabase
      .from('leads')
      .select('email, unsubscribed_at')
      .in('email', emails)

    const unsubscribed = new Set(
      (leads ?? []).filter((l) => l.unsubscribed_at).map((l) => l.email)
    )

    let sent = 0

    for (const search of searches) {
      if (unsubscribed.has(search.email)) continue

      const params = search.search_params as Record<string, string> | null
      if (!params?.focus_area) continue

      // Match urgent grants to this search
      const tokens = params.focus_area.toLowerCase().split(/\s+/).filter((t: string) => t.length >= 3)
      const matchingGrants = urgentGrants.filter((g) => {
        const haystack = `${g.name} ${g.funder} ${g.summary ?? ''}`.toLowerCase()
        return tokens.some((t: string) => haystack.includes(t))
      })

      if (matchingGrants.length === 0) continue

      // Only include grants with valid deadlines
      const grantsWithDeadlines = matchingGrants.filter((g) => g.deadline)

      if (grantsWithDeadlines.length === 0) continue

      const unsubscribeUrl = buildUnsubscribeUrl(search.email)

      try {
        await resend.emails.send({
          to: search.email,
          from: fromEmail,
          subject: `⏰ ${grantsWithDeadlines.length} grant deadline${grantsWithDeadlines.length === 1 ? '' : 's'} approaching`,
          text: buildDeadlineAlertText({ grants: grantsWithDeadlines as { name: string; funder: string; slug: string; deadline: string; amount: string | null }[], unsubscribeUrl }),
          html: buildDeadlineAlertHtml({ grants: grantsWithDeadlines as { name: string; funder: string; slug: string; deadline: string; amount: string | null }[], unsubscribeUrl }),
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
          },
        })

        sent++
      } catch (emailErr) {
        console.error(`[deadline-alerts] failed to send to ${search.email}:`, emailErr)
      }
    }

    return NextResponse.json({ sent, urgent_grants: urgentGrants.length, active_searches: searches.length })
  } catch (e) {
    console.error('[deadline-alerts] cron error:', e)
    return NextResponse.json({ error: 'Alert failed' }, { status: 500 })
  }
}
