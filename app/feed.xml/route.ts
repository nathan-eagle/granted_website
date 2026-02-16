import { listPosts, deriveDescription } from '@/lib/blog'
import { listPublishedStories } from '@/lib/newsjack'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function GET() {
  const base = 'https://grantedai.com'

  const [posts, stories] = await Promise.all([
    listPosts(),
    listPublishedStories(50).catch(() => []),
  ])

  // Build blog post items
  const blogItems = await Promise.all(
    posts.map(async (post) => {
      const filePath = path.join(process.cwd(), 'content', 'blog', `${post.slug}.mdx`)
      const raw = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(raw)
      const description = deriveDescription(data as { title: string; description?: string }, content)

      const xml = `    <item>
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

      return {
        xml,
        date: post.frontmatter.date ? new Date(post.frontmatter.date).getTime() : 0,
      }
    })
  )

  // Build news story items
  const newsItems = stories.map((story) => {
    const xml = `    <item>
      <title>${escapeXml(story.title)}</title>
      <link>${base}/blog/news/${story.slug}</link>
      <guid isPermaLink="true">${base}/blog/news/${story.slug}</guid>
      <description>${escapeXml(story.meta_description)}</description>
      <pubDate>${new Date(story.published_at).toUTCString()}</pubDate>
      <author>${escapeXml(story.author)}</author>
    </item>`

    return {
      xml,
      date: new Date(story.published_at).getTime(),
    }
  })

  // Merge and sort by date descending
  const allItems = [...blogItems, ...newsItems].sort((a, b) => b.date - a.date)

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Granted AI Blog</title>
    <link>${base}/blog</link>
    <description>Grant writing tips, funding strategies, and AI-powered proposal guidance from Granted AI.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
${allItems.map((i) => i.xml).join('\n')}
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
