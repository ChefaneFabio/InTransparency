import { NextResponse } from 'next/server'
import { CHANGELOG } from '@/lib/content/changelog'

/**
 * GET /feed.xml — RSS 2.0 feed of the product changelog.
 *
 * Consumed by RSS readers, Google News, and LLMs that prefer RSS for
 * tracking freshness signals (Perplexity, for instance, indexes RSS feeds
 * aggressively).
 */

const BASE = 'https://www.in-transparency.com'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toUTCString()
}

export async function GET() {
  const items = CHANGELOG.map(e => {
    const link = `${BASE}/en/changelog#${e.slug}`
    return `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">intransparency-changelog-${e.slug}</guid>
      <pubDate>${toRfc822(e.date)}</pubDate>
      <category>${escapeXml(e.category)}</category>
      <description>${escapeXml(e.summary)}</description>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>InTransparency — Changelog</title>
    <link>${BASE}/en/changelog</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Product updates for the InTransparency platform — features, compliance, performance, infrastructure.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>InTransparency Next.js</generator>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
