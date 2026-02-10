import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function verifyToken(email: string, token: string): boolean {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'granted-unsubscribe-default'
  const expected = createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 32)
  return token === expected
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!email || !token) {
    return new Response(unsubscribePage('Invalid unsubscribe link.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (!verifyToken(email, token)) {
    return new Response(unsubscribePage('Invalid or expired unsubscribe link.', false), {
      status: 403,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (!supabaseUrl || !supabaseKey) {
    return new Response(unsubscribePage('Service temporarily unavailable.', false), {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

    // Mark lead as unsubscribed
    await supabase
      .from('leads')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', email.toLowerCase())

    // Deactivate all saved searches for this email
    await supabase
      .from('saved_searches')
      .update({ is_active: false })
      .eq('email', email.toLowerCase())

    return new Response(unsubscribePage('You have been successfully unsubscribed.', true), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (e) {
    console.error('[unsubscribe]', e)
    return new Response(unsubscribePage('Something went wrong. Please try again.', false), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

function unsubscribePage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe — Granted</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8f9fa; color: #1a1a2e; }
    .card { background: white; border-radius: 12px; padding: 40px; max-width: 420px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 20px; margin-bottom: 12px; }
    p { font-size: 14px; color: #666; line-height: 1.6; }
    .icon { font-size: 40px; margin-bottom: 16px; }
    a { color: #b8941c; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '&#10003;' : '&#10005;'}</div>
    <h1>${success ? 'Unsubscribed' : 'Error'}</h1>
    <p>${message}</p>
    <p style="margin-top: 20px;"><a href="https://grantedai.com">Return to Granted</a></p>
  </div>
</body>
</html>`
}
