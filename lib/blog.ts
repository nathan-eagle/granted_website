import path from 'path'
import { promises as fs } from 'fs'
import matter from 'gray-matter'

export type PostFrontmatter = {
  title: string
  description?: string
  date?: string
  author?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

export async function listPosts() {
  const files = await fs.readdir(CONTENT_DIR)
  const posts = await Promise.all(
    files
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(async (file) => {
        const slug = file.replace(/\.(mdx|md)$/i, '')
        const fullPath = path.join(CONTENT_DIR, file)
        const raw = await fs.readFile(fullPath, 'utf8')
        const { data } = matter(raw)
        return { slug, frontmatter: data as PostFrontmatter }
      })
  )
  posts.sort((a, b) => {
    const da = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0
    const db = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0
    return db - da
  })
  return posts
}

export async function getPost(slug: string) {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`)
  const raw = await fs.readFile(file, 'utf8')
  const { data, content } = matter(raw)
  return { frontmatter: data as PostFrontmatter, content }
}

export async function hasPost(slug: string) {
  try {
    await fs.access(path.join(CONTENT_DIR, `${slug}.mdx`))
    return true
  } catch {
    return false
  }
}

/** Strip markdown/MDX syntax to get plain text */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '')       // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text
    .replace(/#{1,6}\s+/g, '')             // headings
    .replace(/[*_~`>]/g, '')               // formatting chars
    .replace(/\n{2,}/g, ' ')              // collapse newlines
    .replace(/\s+/g, ' ')                 // collapse spaces
    .trim()
}

/** Auto-generate description from content if frontmatter is empty */
export function deriveDescription(frontmatter: PostFrontmatter, content: string): string {
  if (frontmatter.description) return frontmatter.description
  const plain = stripMarkdown(content)
  if (plain.length <= 160) return plain
  return plain.slice(0, 157).replace(/\s+\S*$/, '') + '...'
}

/** Estimate reading time in minutes */
export function readingTime(content: string): number {
  const words = stripMarkdown(content).split(/\s+/).length
  return Math.max(1, Math.ceil(words / 250))
}

/* ── Category detection (moved from app/blog/page.tsx) ── */

export function detectCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('sbir')) return 'SBIR'
  if (t.includes('nih')) return 'NIH'
  if (t.includes('nsf')) return 'NSF'
  if (t.includes('epa') || t.includes('environmental justice')) return 'EPA'
  if (t.includes('noaa') || t.includes('marine debris') || t.includes('coastal')) return 'NOAA'
  if (t.includes('darpa') || t.includes('defense') || t.includes('dod')) return 'DARPA'
  if (t.includes('usda') || t.includes('rural development') || t.includes('community facilit')) return 'USDA'
  if (t.includes('tribal') || t.includes('indigenous') || t.includes('tcup')) return 'Tribal'
  return 'Tips'
}

/* ── Blog ↔ Grant category bridging ── */

/** Maps blog categories to grant category slugs */
const CATEGORY_TO_GRANT_SLUG: Record<string, string> = {
  NIH: 'nih',
  NSF: 'nsf',
  EPA: 'epa',
  NOAA: 'noaa',
  DARPA: 'darpa',
  USDA: 'usda',
  SBIR: 'small-business',
  Tribal: 'tribal',
}

/** Returns the grant category slug for a blog category, or null */
export function grantSlugForCategory(blogCategory: string): string | null {
  return CATEGORY_TO_GRANT_SLUG[blogCategory] ?? null
}

/** Returns blog posts matching an agency category slug */
export async function getPostsByGrantCategory(
  grantSlug: string,
  limit = 6,
): Promise<{ slug: string; frontmatter: PostFrontmatter }[]> {
  // Find the blog category key(s) that map to this grant slug
  const matchingCategories = Object.entries(CATEGORY_TO_GRANT_SLUG)
    .filter(([, slug]) => slug === grantSlug)
    .map(([cat]) => cat)

  if (matchingCategories.length === 0) return []

  const posts = await listPosts()
  return posts
    .filter((p) => {
      const cat = detectCategory(p.frontmatter.title || p.slug)
      return matchingCategories.includes(cat)
    })
    .slice(0, limit)
}

/** Returns blog posts matching a grant's funder string */
export async function getRelatedBlogPosts(
  funder: string,
  limit = 3,
): Promise<{ slug: string; frontmatter: PostFrontmatter }[]> {
  const posts = await listPosts()
  const funderLower = funder.toLowerCase()

  return posts
    .filter((p) => {
      const title = (p.frontmatter.title || p.slug).toLowerCase()
      return title.includes(funderLower)
    })
    .slice(0, limit)
}

/** Keyword map for audience categories */
const AUDIENCE_KEYWORDS: Record<string, string[]> = {
  nonprofits: ['nonprofit', 'nonprofits', 'non-profit', '501(c)', 'community organization'],
  'small-business': ['small business', 'startup', 'sbir', 'sttr', 'entrepreneur'],
  researchers: ['researcher', 'academic', 'pi ', 'principal investigator', 'r01', 'fellowship', 'postdoc'],
  tribal: ['tribal', 'indigenous', 'native american', 'tcup', 'indian'],
}

/** Returns blog posts matching audience category keywords */
export async function getPostsByAudienceCategory(
  audienceSlug: string,
  limit = 6,
): Promise<{ slug: string; frontmatter: PostFrontmatter }[]> {
  const keywords = AUDIENCE_KEYWORDS[audienceSlug]
  if (!keywords) return []

  const posts = await listPosts()
  return posts
    .filter((p) => {
      const title = (p.frontmatter.title || p.slug).toLowerCase()
      return keywords.some((kw) => title.includes(kw))
    })
    .slice(0, limit)
}

