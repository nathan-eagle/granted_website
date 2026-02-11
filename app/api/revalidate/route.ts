import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const path = body.path as string | undefined

  if (path) {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  }

  // Default: revalidate all foundation pages
  revalidatePath('/foundations/[slug]', 'page')
  return NextResponse.json({ revalidated: true, path: '/foundations/[slug]' })
}
