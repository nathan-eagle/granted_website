import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.CONTACT_FROM_EMAIL || 'hello@grantedai.com'

export async function POST(req: Request) {
  try {
    const { email, search_query } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Upsert into leads table (server-side, uses service_role key if available)
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })

      const { error } = await supabase.from('leads').upsert(
        {
          email: email.toLowerCase().trim(),
          source: 'grant_finder',
          search_query: search_query ?? null,
        },
        { onConflict: 'email' }
      )

      if (error) {
        console.error('[leads/capture] Supabase upsert error:', error)
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
      }
    }

    // Send welcome email via Resend
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)
      await resend.emails.send({
        to: email,
        from: fromEmail,
        subject: 'Your grant search results are unlocked',
        text: `Thanks for using Granted's free grant finder!\n\nYou now have full access to detailed grant information including summaries, eligibility requirements, and direct links to funding opportunities.\n\nWant AI to help you write your next grant proposal? Try Granted free for 7 days:\nhttps://app.grantedai.com\n\n— The Granted Team`,
      })
    }

    return NextResponse.json({ ok: true, unlocked: true })
  } catch (e) {
    console.error('[leads/capture]', e)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
