import { NextResponse } from 'next/server'

const SENDER_API_KEY = process.env.SENDER_API_KEY || ''
const SENDER_GROUP_ID = process.env.SENDER_GROUP_ID || ''

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!SENDER_API_KEY) {
      // Sender not configured yet — log and return success so the UI isn't broken
      console.warn('SENDER_API_KEY not set; dropping subscribe request for', email)
      return NextResponse.json({ ok: true })
    }

    const body: Record<string, unknown> = { email }
    if (SENDER_GROUP_ID) {
      body.groups = [SENDER_GROUP_ID]
    }

    const res = await fetch('https://api.sender.net/v2/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDER_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Sender API error:', res.status, text)
      return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Subscribe error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
