import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { DETECTION_SCHEMA, DETECTION_SYSTEM_PROMPT } from '@/lib/newsjack-prompts'
import { hashHeadline } from '@/lib/newsjack-helpers'
import { runGenerationPipeline } from '@/lib/newsjack-generate'

export const runtime = 'nodejs'
export const maxDuration = 300

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export async function GET(request: Request) {
  // Auth: Vercel cron sends Authorization header
  const authHeader = request.headers.get('authorization')
  const expected = process.env.CRON_SECRET
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Kill switch
  if (process.env.NEWSJACK_ENABLED !== 'true') {
    return NextResponse.json({ skipped: true, reason: 'NEWSJACK_ENABLED is not true' })
  }

  const perplexityKey = process.env.PERPLEXITY_API_KEY
  if (!perplexityKey) {
    return NextResponse.json({ error: 'PERPLEXITY_API_KEY not configured' }, { status: 500 })
  }

  try {
    // 1. Call Perplexity Sonar Pro for trending grant news
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${perplexityKey}`,
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: DETECTION_SYSTEM_PROMPT },
          {
            role: 'user',
            content:
              'What are the most trending, breaking, or viral news stories about grants, research funding, federal funding policy, or higher education funding from the last 48 hours? Include any major policy changes, controversial decisions, or announcements generating significant discussion.',
          },
        ],
        max_tokens: 4000,
        search_recency_filter: 'week',
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'newsjack_detection', schema: DETECTION_SCHEMA },
        },
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`[newsjack/scan] Perplexity error: ${res.status} ${body.slice(0, 300)}`)
      return NextResponse.json({ error: 'Perplexity API error', status: res.status }, { status: 502 })
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? '{}'

    let stories: Array<{
      headline: string
      source_url: string
      search_queries: string[]
      relevance_score: number
      timeliness_score: number
      grant_angle: string
    }>

    try {
      const parsed = JSON.parse(content)
      stories = parsed.stories ?? []
    } catch {
      console.error('[newsjack/scan] Failed to parse Perplexity response')
      return NextResponse.json({ error: 'Failed to parse detection response' }, { status: 500 })
    }

    // 2. Filter: relevance >= 7 only
    const qualified = stories.filter((s) => s.relevance_score >= 7)

    if (qualified.length === 0) {
      return NextResponse.json({ detected: 0, message: 'No trending stories met threshold' })
    }

    // 3. Dedup + insert + auto-generate + auto-publish
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
    let inserted = 0
    const published: string[] = []

    for (const story of qualified) {
      const hHash = hashHeadline(story.headline)

      // Check for existing headline OR same source URL
      const { data: existing } = await supabase
        .from('newsjack_stories')
        .select('id')
        .eq('headline_hash', hHash)
        .limit(1)

      if (existing && existing.length > 0) continue

      if (story.source_url) {
        const { data: urlMatch } = await supabase
          .from('newsjack_stories')
          .select('id')
          .eq('source_url', story.source_url)
          .limit(1)

        if (urlMatch && urlMatch.length > 0) continue
      }

      // Insert new story
      const { data: row, error } = await supabase
        .from('newsjack_stories')
        .insert({
          headline: story.headline,
          headline_hash: hHash,
          source_url: story.source_url,
          relevance_score: story.relevance_score,
          timeliness_score: story.timeliness_score,
          search_queries: story.search_queries,
          grant_angle: story.grant_angle,
          status: 'drafting',
        })
        .select('id')
        .single()

      if (error) {
        console.error(`[newsjack/scan] Insert error: ${error.message}`)
        continue
      }

      inserted++

      // Auto-generate article
      try {
        const slug = await runGenerationPipeline(row.id, story)

        // Auto-publish
        const now = new Date().toISOString()
        await supabase
          .from('newsjack_stories')
          .update({ status: 'published', published_at: now, updated_at: now })
          .eq('id', row.id)

        revalidatePath(`/blog/news/${slug}`)
        published.push(slug)
      } catch (err) {
        console.error(`[newsjack/scan] Generation failed for "${story.headline}":`, err)
        // Leave in drafting status for manual retry
      }
    }

    // Revalidate blog index if anything was published
    if (published.length > 0) {
      revalidatePath('/blog')

      // IndexNow: notify search engines of new URLs
      const indexNowKey = process.env.INDEXNOW_KEY
      if (indexNowKey) {
        try {
          const urls = published.map((slug) => `https://grantedai.com/blog/news/${slug}`)
          await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              host: 'grantedai.com',
              key: indexNowKey,
              keyLocation: `https://grantedai.com/${indexNowKey}.txt`,
              urlList: urls,
            }),
          })
          console.log(`[newsjack/scan] IndexNow pinged for ${urls.length} URLs`)
        } catch (err) {
          console.error('[newsjack/scan] IndexNow ping failed:', err)
        }
      }

      // Google sitemap ping
      try {
        await fetch(
          'https://www.google.com/ping?sitemap=https%3A%2F%2Fgrantedai.com%2Fnews-sitemap.xml',
        )
        console.log('[newsjack/scan] Google sitemap ping sent')
      } catch (err) {
        console.error('[newsjack/scan] Google sitemap ping failed:', err)
      }
    }

    return NextResponse.json({
      detected: qualified.length,
      inserted,
      published: published.length,
      slugs: published,
      total_candidates: stories.length,
    })
  } catch (err) {
    console.error('[newsjack/scan] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
