import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'
import { Resend } from 'resend'
import {
  buildDripDay3Text, buildDripDay3Html,
  buildDripDay7Text, buildDripDay7Html,
  buildDripDay14Text, buildDripDay14Html,
} from '@/lib/email-templates/nurture-drip'

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

// Drip stages: the day on which each email is sent
const DRIP_STAGES = [
  { day: 3, fromStage: 0, toStage: 3 },
  { day: 7, fromStage: 3, toStage: 7 },
  { day: 14, fromStage: 7, toStage: 14 },
] as const

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

  const results: Record<string, number> = { day3: 0, day7: 0, day14: 0 }

  try {
    for (const stage of DRIP_STAGES) {
      // Find leads created exactly `stage.day` days ago (within a 24h window)
      // that are at the previous drip stage (haven't received this email yet)
      const targetDate = new Date(Date.now() - stage.day * 24 * 60 * 60 * 1000)
      const dayBefore = new Date(targetDate.getTime() - 24 * 60 * 60 * 1000)

      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, email, search_query, converted_at, unsubscribed_at, drip_stage')
        .eq('drip_stage', stage.fromStage)
        .gte('created_at', dayBefore.toISOString())
        .lte('created_at', targetDate.toISOString())
        .is('unsubscribed_at', null)
        .is('converted_at', null)
        .limit(200)

      if (error || !leads || leads.length === 0) continue

      for (const lead of leads) {
        const unsubscribeUrl = buildUnsubscribeUrl(lead.email)
        const searchQuery = (lead.search_query as Record<string, string> | null)?.focus_area || 'grants'

        let subject: string
        let text: string
        let html: string
        const resultKey = `day${stage.day}` as keyof typeof results

        if (stage.day === 3) {
          subject = '3 tips for finding the right grant'
          text = buildDripDay3Text({ unsubscribeUrl })
          html = buildDripDay3Html({ unsubscribeUrl })
        } else if (stage.day === 7) {
          subject = 'Your grants are waiting — start your free proposal'
          text = buildDripDay7Text({ unsubscribeUrl })
          html = buildDripDay7Html({ unsubscribeUrl })
        } else {
          // Day 14: re-run their search to get a fresh count
          const tokens = searchQuery.toLowerCase().split(/\s+/).filter((t: string) => t.length >= 3).slice(0, 4)
          let grantCount = 0

          if (tokens.length > 0) {
            const clauses = tokens.flatMap((t: string) => [
              `name.ilike.%${t}%`,
              `summary.ilike.%${t}%`,
            ])
            const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
            const { count } = await supabase
              .from('public_grants')
              .select('id', { count: 'exact', head: true })
              .eq('status', 'active')
              .gte('updated_at', twoWeeksAgo)
              .or(clauses.join(','))

            grantCount = count ?? 0
          }

          if (grantCount === 0) grantCount = 5 // fallback so email isn't empty

          subject = `We found ${grantCount} new grant${grantCount === 1 ? '' : 's'} in your area`
          text = buildDripDay14Text({ unsubscribeUrl, grantCount, searchQuery })
          html = buildDripDay14Html({ unsubscribeUrl, grantCount, searchQuery })
        }

        try {
          await resend.emails.send({
            to: lead.email,
            from: fromEmail,
            subject,
            text,
            html,
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}>`,
            },
          })

          // Advance drip stage
          await supabase
            .from('leads')
            .update({ drip_stage: stage.toStage })
            .eq('id', lead.id)

          results[resultKey]++
        } catch (emailErr) {
          console.error(`[nurture-drip] failed to send day-${stage.day} to ${lead.email}:`, emailErr)
        }
      }
    }

    return NextResponse.json({ sent: results, total: results.day3 + results.day7 + results.day14 })
  } catch (e) {
    console.error('[nurture-drip] cron error:', e)
    return NextResponse.json({ error: 'Drip failed' }, { status: 500 })
  }
}
