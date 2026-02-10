import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'granted-unsubscribe-default'
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 32)
}

export async function POST(req: Request) {
  try {
    const { email, search_params, label } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
    const normalizedEmail = email.toLowerCase().trim()

    // Insert saved search
    const { data: search, error: searchErr } = await supabase
      .from('saved_searches')
      .insert({
        email: normalizedEmail,
        search_params: search_params ?? {},
        label: label || null,
      })
      .select('id')
      .single()

    if (searchErr) {
      console.error('[searches/save] saved_searches insert error:', searchErr)
      return NextResponse.json({ error: 'Failed to save search' }, { status: 500 })
    }

    // Create default alert subscription
    if (search) {
      const { error: alertErr } = await supabase.from('alert_subscriptions').insert({
        saved_search_id: search.id,
        alert_type: 'new_matches',
        frequency: 'weekly',
      })
      if (alertErr) {
        console.error('[searches/save] alert subscription insert error:', alertErr)
      }
    }

    // Update leads table with unsubscribe token
    const token = generateUnsubscribeToken(normalizedEmail)
    const { error: leadsErr } = await supabase.from('leads').upsert({
      email: normalizedEmail,
      source: 'grant_finder',
      unsubscribe_token: token,
      alert_preferences: { weekly_digest: true },
    }, { onConflict: 'email' })
    if (leadsErr) {
      console.error('[searches/save] leads upsert error:', leadsErr)
    }

    return NextResponse.json({ ok: true, saved: true })
  } catch (e) {
    console.error('[searches/save]', e)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
