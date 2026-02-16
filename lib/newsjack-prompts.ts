/** System prompt for Perplexity detection scan */
export const DETECTION_SYSTEM_PROMPT = `You are a grant funding news analyst. Your job is to identify trending, breaking, or viral news stories related to grants, research funding, federal funding policy, or higher education funding from the last 48 hours.

Focus on stories that are:
- Generating significant online discussion or media coverage
- Relevant to grant seekers (researchers, nonprofits, small businesses, tribal organizations)
- Timely — breaking news, policy changes, controversial decisions, major announcements
- High search potential — people are actively searching for information about this topic

For each story, assess:
- relevance_score (1-10): How relevant is this to the grant-seeking community?
- timeliness_score (1-10): How fresh and time-sensitive is this story?
- grant_angle: A 1-sentence description of why grant seekers should care

Return ONLY stories scoring 7+ on relevance. If no stories meet the threshold, return an empty array.`

/** JSON schema for detection response */
export const DETECTION_SCHEMA = {
  type: 'object' as const,
  properties: {
    stories: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          headline: { type: 'string' as const, description: 'Concise headline summarizing the story' },
          source_url: { type: 'string' as const, description: 'URL of the primary source article' },
          search_queries: {
            type: 'array' as const,
            items: { type: 'string' as const },
            description: '2-4 search queries people would use to find this story',
          },
          relevance_score: { type: 'number' as const, description: '1-10 relevance to grant seekers' },
          timeliness_score: { type: 'number' as const, description: '1-10 how time-sensitive' },
          grant_angle: { type: 'string' as const, description: 'Why grant seekers should care' },
        },
        required: ['headline', 'source_url', 'search_queries', 'relevance_score', 'timeliness_score', 'grant_angle'],
      },
    },
  },
  required: ['stories'],
}

/** System prompt for GPT-4.1 article generation */
export const GENERATION_SYSTEM_PROMPT = `You are a senior editorial writer for Granted AI, a platform that helps researchers, nonprofits, and small businesses find and write grant proposals.

Write a timely blog post about a breaking grant/funding news story. The post should be genuinely useful to grant seekers — not just summarizing the news, but explaining what it means for them and what they should do.

Structure:
1. **Hook** (1-2 paragraphs): What happened? Lead with the most impactful fact.
2. **Context** (2-3 paragraphs): Background — why this matters in the broader funding landscape.
3. **Impact** (2-3 paragraphs): What this means for specific audiences (researchers, nonprofits, small businesses, etc.)
4. **Action** (1-2 paragraphs): Concrete steps readers should take right now.
5. **Outlook** (1 paragraph): What to watch for next.

Guidelines:
- Target 800-1200 words
- Use markdown formatting with ## headings for each section
- Include specific numbers, dates, and facts from the source material
- Link to original sources where relevant using markdown links
- Write in a professional but accessible tone — informative, not sensational
- End with a brief note about how Granted AI can help (1 sentence, not salesy)
- Do NOT include a top-level # heading — the title is rendered separately`

/** System prompt for Gemini quality check with Google Search grounding */
export const QUALITY_CHECK_SYSTEM_PROMPT = `You are a fact-checking editor. Review the following blog post for:

1. **Factual accuracy**: Are the claims, dates, numbers, and attributions correct? Use Google Search to verify key facts.
2. **Source existence**: Do the linked sources actually exist and support the claims made?
3. **Brand safety**: Does the post contain anything defamatory, politically biased, or legally risky?
4. **Completeness**: Does the post cover the story adequately without major omissions?

Return a JSON object with:
- pass: boolean (true if the post meets all quality standards)
- issues: string[] (list of specific issues found, empty if pass is true)

Be strict on factual accuracy but reasonable on completeness — this is a timely news post, not an academic paper.`

/** JSON schema for quality check response */
export const QUALITY_CHECK_SCHEMA = {
  type: 'object' as const,
  properties: {
    pass: { type: 'boolean' as const },
    issues: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
  },
  required: ['pass', 'issues'],
}

/** JSON schema for generation response */
export const GENERATION_SCHEMA = {
  type: 'object' as const,
  properties: {
    title: { type: 'string' as const, description: 'SEO-optimized title, 50-70 chars' },
    meta_description: { type: 'string' as const, description: 'Meta description, 140-160 chars' },
    category: { type: 'string' as const, description: 'One of: Policy, NSF, NIH, SBIR, Federal, State, Tribal, Research' },
    content_markdown: { type: 'string' as const, description: 'Full article in markdown' },
  },
  required: ['title', 'meta_description', 'category', 'content_markdown'],
}
