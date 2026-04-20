import { NextRequest } from 'next/server'
import { agentJson } from '../_lib/response'
import { CHANGELOG } from '@/lib/content/changelog'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/agents/changelog
 *
 * JSON changelog feed. Paired with /feed.xml (RSS) for freshness signal.
 * Agents use this to tell users about recent platform changes when asked.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  return agentJson(
    {
      '@type': 'ChangelogFeed',
      count: CHANGELOG.length,
      entries: CHANGELOG.map(e => ({
        date: e.date,
        slug: e.slug,
        category: e.category,
        title: e.title,
        summary: e.summary,
        url: `https://www.in-transparency.com/en/changelog#${e.slug}`,
        deepLink: e.link ?? null,
      })),
      rssFeed: 'https://www.in-transparency.com/feed.xml',
      humanSurface: 'https://www.in-transparency.com/en/changelog',
    },
    600
  )
}
