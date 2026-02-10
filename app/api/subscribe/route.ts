import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[subscribe] Supabase not configured; dropping subscribe for', email)
      return NextResponse.json({ ok: true })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    const { error } = await supabase.from('leads').upsert(
      {
        email: email.toLowerCase().trim(),
        source: 'newsletter',
        alert_preferences: { weekly_digest: true },
      },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('[subscribe] leads upsert error:', error)
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[subscribe]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
