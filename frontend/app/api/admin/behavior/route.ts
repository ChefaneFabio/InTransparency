import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

/**
 * GET /api/admin/behavior
 *
 * Returns aggregates over the chosen window:
 *   - totals      — page_views / clicks / unique sessions / unique users
 *   - topPages    — top page paths by view count
 *   - topClicks   — top (pagePath, selector) pairs
 *   - heatmap     — when ?page=<path>, raw click coordinates for canvas viz
 *   - scrollDepth — per-page % of sessions reaching 25/50/75/100
 *   - forms       — per (page, form) focus count vs submit count
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

  const [topPages, topClicks, totalsRaw, heatmapPoints, scrollRaw, formFocusRaw, formSubmitRaw] =
    await Promise.all([
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
      prisma.trackingEvent.findMany({
        where: { type: 'scroll_depth', createdAt: { gte: since } },
        select: { pagePath: true, sessionId: true, value: true },
      }),
      prisma.trackingEvent.groupBy({
        by: ['pagePath', 'selector'],
        where: {
          type: 'form_focus',
          createdAt: { gte: since },
          selector: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.trackingEvent.groupBy({
        by: ['pagePath', 'selector'],
        where: {
          type: 'form_submit',
          createdAt: { gte: since },
          selector: { not: null },
        },
        _count: { _all: true },
      }),
    ])

  // Hand-aggregate totals
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

  // Scroll depth: per page, count distinct sessions per threshold.
  // Since we only emit each threshold once per session per pageload (and
  // treat sessions as a proxy for "visit"), we can count distinct
  // (page, threshold) sessionIds.
  const scrollByPage = new Map<
    string,
    { thresholds: Map<number, Set<string>>; sessions: Set<string> }
  >()
  for (const s of scrollRaw) {
    if (s.value == null) continue
    let entry = scrollByPage.get(s.pagePath)
    if (!entry) {
      entry = { thresholds: new Map(), sessions: new Set() }
      scrollByPage.set(s.pagePath, entry)
    }
    entry.sessions.add(s.sessionId)
    let bucket = entry.thresholds.get(s.value)
    if (!bucket) {
      bucket = new Set()
      entry.thresholds.set(s.value, bucket)
    }
    bucket.add(s.sessionId)
  }
  const scrollDepth = Array.from(scrollByPage.entries())
    .map(([pagePath, e]) => {
      const sessions = e.sessions.size
      const pct = (t: number) =>
        sessions > 0 ? Math.round(((e.thresholds.get(t)?.size ?? 0) / sessions) * 100) : 0
      return {
        pagePath,
        sessions,
        p25: pct(25),
        p50: pct(50),
        p75: pct(75),
        p100: pct(100),
      }
    })
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 30)

  // Form abandonment: pair focus + submit by (page, form-prefix).
  // We strip the input-specific tail from focus selectors so we group at
  // the form level. Selector shape: "form#x input[name='y']" → "form#x".
  const formKey = (page: string, sel: string | null) => {
    if (!sel) return null
    const formPart = sel.split(' ')[0]
    return `${page}::${formPart}`
  }
  const formStats = new Map<string, { pagePath: string; formSelector: string; focuses: number; submits: number }>()
  for (const f of formFocusRaw) {
    const k = formKey(f.pagePath, f.selector)
    if (!k) continue
    const formPart = (f.selector ?? '').split(' ')[0]
    const cur = formStats.get(k) ?? { pagePath: f.pagePath, formSelector: formPart, focuses: 0, submits: 0 }
    cur.focuses += f._count._all
    formStats.set(k, cur)
  }
  for (const s of formSubmitRaw) {
    const k = `${s.pagePath}::${s.selector}`
    const cur = formStats.get(k) ?? { pagePath: s.pagePath, formSelector: s.selector ?? '', focuses: 0, submits: 0 }
    cur.submits += s._count._all
    formStats.set(k, cur)
  }
  const forms = Array.from(formStats.values())
    .map(f => ({
      ...f,
      abandonRate: f.focuses > 0 ? Math.round(((f.focuses - f.submits) / f.focuses) * 100) : 0,
    }))
    .sort((a, b) => b.focuses - a.focuses)
    .slice(0, 20)

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
    scrollDepth,
    forms,
    heatmap: heatmapPage
      ? {
          page: heatmapPage,
          points: heatmapPoints,
        }
      : null,
  })
}
