import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'
import { Resend } from 'resend'
import { buildWeeklyDigestText, buildWeeklyDigestHtml } from '@/lib/email-templates/weekly-digest'

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
  // Verify cron secret (Vercel sends this header for cron jobs)
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
    // Get active saved searches with non-unsubscribed leads
    const { data: searches, error: searchErr } = await supabase
      .from('saved_searches')
      .select('id, email, search_params, label')
      .eq('is_active', true)
      .limit(100)

    if (searchErr || !searches || searches.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No active searches' })
    }

    // Check which emails are unsubscribed
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
      if (!params) continue

      // Find matching grants added/updated in the last 7 days
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      let query = supabase
        .from('public_grants')
        .select('name, funder, slug, deadline, amount')
        .eq('status', 'active')
        .gte('updated_at', weekAgo)
        .order('deadline', { ascending: true })
        .limit(10)

      // Apply search params as filters
      if (params.focus_area) {
        const tokens = params.focus_area.toLowerCase().split(/\s+/).filter((t: string) => t.length >= 3).slice(0, 4)
        if (tokens.length > 0) {
          const clauses = tokens.flatMap((t: string) => [
            `name.ilike.%${t}%`,
            `summary.ilike.%${t}%`,
          ])
          query = query.or(clauses.join(','))
        }
      }

      const { data: grants } = await query

      if (!grants || grants.length === 0) continue

      // Check against last digest to find new grants
      const { data: lastDigest } = await supabase
        .from('digest_emails')
        .select('grant_slugs')
        .eq('email', search.email)
        .eq('digest_type', 'weekly')
        .order('sent_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const previousSlugs = new Set(lastDigest?.grant_slugs ?? [])
      const newGrants = grants.filter((g) => !previousSlugs.has(g.slug))

      if (newGrants.length === 0) continue

      const unsubscribeUrl = buildUnsubscribeUrl(search.email)
      const searchLabel = search.label || params.focus_area || 'your search'

      try {
        await resend.emails.send({
          to: search.email,
          from: fromEmail,
          subject: `${newGrants.length} new grant${newGrants.length === 1 ? '' : 's'} for "${searchLabel}"`,
          text: buildWeeklyDigestText({ grants: newGrants, searchLabel, unsubscribeUrl }),
          html: buildWeeklyDigestHtml({ grants: newGrants, searchLabel, unsubscribeUrl }),
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
          },
        })

        // Log digest
        await supabase.from('digest_emails').insert({
          email: search.email,
          digest_type: 'weekly',
          grant_slugs: grants.map((g) => g.slug),
        })

        // Update last_run_at
        await supabase
          .from('saved_searches')
          .update({ last_run_at: new Date().toISOString(), last_result_count: newGrants.length })
          .eq('id', search.id)

        sent++
      } catch (emailErr) {
        console.error(`[weekly-digest] failed to send to ${search.email}:`, emailErr)
      }
    }

    return NextResponse.json({ sent, total_searches: searches.length })
  } catch (e) {
    console.error('[weekly-digest] cron error:', e)
    return NextResponse.json({ error: 'Digest failed' }, { status: 500 })
  }
}
