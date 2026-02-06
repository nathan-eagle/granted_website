import path from 'path'
import { promises as fs } from 'fs'
import matter from 'gray-matter'

export type PostFrontmatter = {
  title: string
  description?: string
  date?: string
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

