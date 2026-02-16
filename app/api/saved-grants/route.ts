import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

function getAdmin() {
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  })
}

async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('gf_user_id')?.value ?? null
}

/** GET /api/saved-grants?slug=foo — check if a grant is saved */
export async function GET(req: Request) {
  const userId = await getUserIdFromCookie()
  if (!userId) {
    return NextResponse.json({ saved: false })
  }

  const admin = getAdmin()
  if (!admin) {
    return NextResponse.json({ saved: false })
  }

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  // Resolve slug to public_grant_id
  const { data: grant } = await admin
    .from('public_grants')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!grant) {
    return NextResponse.json({ saved: false })
  }

  // Check if saved — owner_id in saved_grants references profiles.id which equals the auth user ID
  const { data: existing } = await admin
    .from('saved_grants')
    .select('id')
    .eq('owner_id', userId)
    .eq('public_grant_id', grant.id)
    .maybeSingle()

  return NextResponse.json({ saved: !!existing })
}

/** POST /api/saved-grants — toggle save/unsave */
export async function POST(req: Request) {
  const userId = await getUserIdFromCookie()
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const admin = getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  const { slug } = await req.json()
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  // Ensure the profile row exists (same logic as the app's ensureAppUser)
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Resolve slug to public_grant_id
  const { data: grant } = await admin
    .from('public_grants')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!grant) {
    return NextResponse.json({ error: 'Grant not found' }, { status: 404 })
  }

  // Check if already saved
  const { data: existing } = await admin
    .from('saved_grants')
    .select('id')
    .eq('owner_id', userId)
    .eq('public_grant_id', grant.id)
    .maybeSingle()

  if (existing) {
    // Unsave
    await admin.from('saved_grants').delete().eq('id', existing.id)
    return NextResponse.json({ saved: false })
  }

  // Save
  const { error } = await admin.from('saved_grants').insert({
    owner_id: userId,
    public_grant_id: grant.id,
  })

  if (error) {
    console.error('[saved-grants] INSERT error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ saved: true })
}
