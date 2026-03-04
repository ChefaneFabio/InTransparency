import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const contentDirectory = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  coverImage?: string
  featured?: boolean
  readingTime: string
  content: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  coverImage?: string
  featured?: boolean
  readingTime: string
}

export function getPostSlugs(locale: string): string[] {
  const localeDir = path.join(contentDirectory, locale)
  if (!fs.existsSync(localeDir)) return []
  return fs.readdirSync(localeDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  const filePath = path.join(contentDirectory, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    author: data.author || 'InTransparency Team',
    tags: data.tags || [],
    coverImage: data.coverImage,
    featured: data.featured || false,
    readingTime: stats.text,
    content,
  }
}

export function getAllPosts(locale: string): BlogPostMeta[] {
  const slugs = getPostSlugs(locale)
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug, locale)
      if (!post) return null
      const { content: _, ...meta } = post
      return meta
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function generateRssFeed(posts: BlogPostMeta[], locale: string): string {
  const baseUrl = 'https://intransparency.eu'
  const feedUrl = `${baseUrl}/api/blog/rss?locale=${locale}`

  const items = posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${locale}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post.author}</author>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
    </item>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>InTransparency Blog</title>
    <link>${baseUrl}/${locale}/blog</link>
    <description>Insights on verified credentials, career development, and the future of university-to-work transitions.</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}
