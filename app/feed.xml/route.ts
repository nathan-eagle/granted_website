import { listPosts, deriveDescription } from '@/lib/blog'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function GET() {
  const base = 'https://grantedai.com'
  const posts = await listPosts()

  const items = await Promise.all(
    posts.map(async (post) => {
      const filePath = path.join(process.cwd(), 'content', 'blog', `${post.slug}.mdx`)
      const raw = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(raw)
      const description = deriveDescription(data as { title: string; description?: string }, content)

      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${base}/blog/${post.slug}</link>
      <guid isPermaLink="true">${base}/blog/${post.slug}</guid>
      <description>${escapeXml(description)}</description>${
        post.frontmatter.date
          ? `\n      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>`
          : ''
      }${
        post.frontmatter.author
          ? `\n      <author>${escapeXml(post.frontmatter.author)}</author>`
          : ''
      }
    </item>`
    })
  )

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Granted AI Blog</title>
    <link>${base}/blog</link>
    <description>Grant writing tips, funding strategies, and AI-powered proposal guidance from Granted AI.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
