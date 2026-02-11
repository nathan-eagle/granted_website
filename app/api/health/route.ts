import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {}
  let healthy = true

  // Supabase PostgREST
  if (supabase) {
    try {
      const { error } = await supabase
        .from('public_grants')
        .select('id', { count: 'exact', head: true })
      checks.supabase = error ? 'error' : 'ok'
      if (error) {
        console.error('[health] Supabase check failed:', error.message)
        healthy = false
      }
    } catch (err) {
      checks.supabase = 'error'
      healthy = false
      console.error('[health] Supabase check threw:', err)
    }
  } else {
    checks.supabase = 'error'
    healthy = false
  }

  const status = healthy ? 200 : 503
  return NextResponse.json(
    { status: healthy ? 'healthy' : 'degraded', checks, timestamp: new Date().toISOString() },
    { status },
  )
}
