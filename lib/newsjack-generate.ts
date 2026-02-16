import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import {
  GENERATION_SCHEMA,
  GENERATION_SYSTEM_PROMPT,
  QUALITY_CHECK_SCHEMA,
  QUALITY_CHECK_SYSTEM_PROMPT,
} from './newsjack-prompts'
import { slugify } from './newsjack-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
}

/** Make a JSON schema OpenAI strict-mode compatible */
function makeStrictSchema(schema: Record<string, unknown>): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(schema)) as Record<string, unknown>
  function walk(node: Record<string, unknown>) {
    if (node.type === 'object' && node.properties) {
      node.additionalProperties = false
      node.required = Object.keys(node.properties as Record<string, unknown>)
      for (const val of Object.values(node.properties as Record<string, unknown>)) {
        if (val && typeof val === 'object') walk(val as Record<string, unknown>)
      }
    }
    if (node.items && typeof node.items === 'object') {
      walk(node.items as Record<string, unknown>)
    }
  }
  walk(clone)
  return clone
}

/**
 * Run the full generation pipeline for a newsjack story:
 * Jina scrape → Perplexity context → GPT-4.1 draft → Gemini quality check → DB update
 *
 * Returns the generated slug on success.
 */
export async function runGenerationPipeline(
  storyId: string,
  story: Record<string, unknown>,
): Promise<string> {
  const supabase = getSupabase()

  // 1. Scrape source via Jina
  let sourceText = ''
  const sourceUrl = story.source_url as string | undefined
  if (sourceUrl) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const jinaRes = await fetch(`https://r.jina.ai/${sourceUrl}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'text/plain',
          'User-Agent': 'GrantedBot/1.0 (+https://grantedai.com)',
        },
      })
      clearTimeout(timeout)

      if (jinaRes.ok) {
        sourceText = await jinaRes.text()
        sourceText = sourceText
          .replace(/^Title:\s.*$/gim, '')
          .replace(/^URL Source:\s.*$/gim, '')
          .replace(/^Published Time:\s.*$/gim, '')
          .slice(0, 8000)
      }
    } catch (err) {
      console.warn('[newsjack] Jina scrape failed:', err)
    }
  }

  // 2. Gather additional context via Perplexity
  let additionalContext = ''
  const perplexityKey = process.env.PERPLEXITY_API_KEY
  if (perplexityKey) {
    try {
      const pxRes = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${perplexityKey}`,
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            { role: 'system', content: 'Provide comprehensive context and reactions about this news story. Include key facts, stakeholder reactions, and implications.' },
            { role: 'user', content: `Summarize the latest developments and reactions to: ${story.headline}` },
          ],
          max_tokens: 3000,
          search_recency_filter: 'week',
        }),
      })

      if (pxRes.ok) {
        const pxData = await pxRes.json()
        additionalContext = pxData.choices?.[0]?.message?.content ?? ''
      }
    } catch (err) {
      console.warn('[newsjack] Perplexity context failed:', err)
    }
  }

  // 3. Generate draft via GPT-4.1
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) throw new Error('OPENAI_API_KEY not configured')

  const openai = new OpenAI({ apiKey: openaiKey })
  const genResponse = await openai.responses.create({
    model: 'gpt-4.1',
    instructions: GENERATION_SYSTEM_PROMPT,
    input: [
      `Headline: ${story.headline}`,
      `Grant Angle: ${story.grant_angle}`,
      sourceText ? `\n--- Source Article ---\n${sourceText}` : '',
      additionalContext ? `\n--- Additional Context ---\n${additionalContext}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    text: {
      format: {
        type: 'json_schema',
        name: 'newsjack_article',
        schema: makeStrictSchema(GENERATION_SCHEMA),
        strict: true,
      },
    },
  })

  let genText = ''
  for (const item of genResponse.output) {
    if (item.type === 'message') {
      for (const block of item.content) {
        if (block.type === 'output_text') {
          genText += block.text
        }
      }
    }
  }

  const article = JSON.parse(genText) as {
    title: string
    meta_description: string
    category: string
    content_markdown: string
  }

  const slug = slugify(article.title)

  // 4. Quality check via Gemini with Google Search grounding
  let qualityPass = true
  let qualityIssues: string[] = []

  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey })
      const qcResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${QUALITY_CHECK_SYSTEM_PROMPT}\n\n--- Article to Review ---\nTitle: ${article.title}\n\n${article.content_markdown}`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: QUALITY_CHECK_SCHEMA,
        },
      })

      const qcText = qcResponse.text ?? '{}'
      const qcResult = JSON.parse(qcText) as { pass: boolean; issues: string[] }
      qualityPass = qcResult.pass
      qualityIssues = qcResult.issues ?? []
    } catch (err) {
      console.warn('[newsjack] Quality check failed:', err)
    }
  }

  // 5. Update DB with generated content
  await supabase
    .from('newsjack_stories')
    .update({
      slug,
      title: article.title,
      meta_description: article.meta_description,
      content_markdown: article.content_markdown,
      category: article.category,
      quality_pass: qualityPass,
      quality_issues: qualityIssues,
      source_articles: sourceText ? [{ url: sourceUrl, text: sourceText.slice(0, 2000) }] : [],
      updated_at: new Date().toISOString(),
    })
    .eq('id', storyId)

  return slug
}
