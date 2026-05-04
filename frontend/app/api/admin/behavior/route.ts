import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

/**
 * GET /api/admin/behavior
 * Returns:
 *   - topPages          : top page paths by view count (last N days)
 *   - topClicks         : top (pagePath, selector) pairs by click count
 *   - heatmap           : if ?page=<path> given, raw click coordinates for canvas viz
 *   - totals            : page_views / clicks / unique sessions / unique users in window
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN' && session.user.email?.toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '7', 10)))
  const since = new Date(Date.now() - days * 86400_000)
  const heatmapPage = searchParams.get('page') || ''

  const [topPages, topClicks, totalsRaw, heatmapPoints] = await Promise.all([
    prisma.trackingEvent.groupBy({
      by: ['pagePath'],
      where: { type: 'page_view', createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { pagePath: 'desc' } },
      take: 30,
    }),
    prisma.trackingEvent.groupBy({
      by: ['pagePath', 'selector'],
      where: {
        type: 'click',
        createdAt: { gte: since },
        selector: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { selector: 'desc' } },
      take: 50,
    }),
    prisma.trackingEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { type: true, sessionId: true, userId: true },
    }),
    heatmapPage
      ? prisma.trackingEvent.findMany({
          where: {
            type: 'click',
            pagePath: heatmapPage,
            createdAt: { gte: since },
            x: { not: null },
            y: { not: null },
          },
          select: { x: true, y: true, vw: true, vh: true, selector: true, text: true },
          take: 5000,
          orderBy: { createdAt: 'desc' },
        })
      : Promise.resolve([]),
  ])

  // For unique-session/unique-user/click+view counts we hand-aggregate the
  // findMany result above to avoid a multi-column distinct.
  const uniqueSessions = new Set<string>()
  const uniqueUsers = new Set<string>()
  let pageViews = 0
  let clicks = 0
  for (const r of totalsRaw) {
    uniqueSessions.add(r.sessionId)
    if (r.userId) uniqueUsers.add(r.userId)
    if (r.type === 'page_view') pageViews++
    else if (r.type === 'click') clicks++
  }

  return NextResponse.json({
    days,
    totals: {
      pageViews,
      clicks,
      uniqueSessions: uniqueSessions.size,
      uniqueUsers: uniqueUsers.size,
    },
    topPages: topPages.map(p => ({ pagePath: p.pagePath, count: p._count._all })),
    topClicks: topClicks.map(c => ({
      pagePath: c.pagePath,
      selector: c.selector,
      count: c._count._all,
    })),
    heatmap: heatmapPage
      ? {
          page: heatmapPage,
          points: heatmapPoints,
        }
      : null,
  })
}
