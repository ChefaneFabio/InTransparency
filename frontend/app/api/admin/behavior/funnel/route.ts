import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

/**
 * GET /api/admin/behavior/funnel?steps=path1,path2,path3&days=7
 *
 * For each session in the window, determine which steps (pagePath
 * page_view) it reached *in order*. Returns:
 *   - steps: [{ path, sessions, pctOfStart, pctOfPrev }]
 *
 * "In order" means the timestamp of step N must be after step N-1.
 * A session that hits step 1 then step 3 (skipping step 2) is NOT
 * counted at step 3 — strict sequential funnel.
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
  const stepsParam = searchParams.get('steps') || ''
  const steps = stepsParam
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 6)

  if (steps.length < 2) {
    return NextResponse.json({ error: 'need at least 2 steps' }, { status: 400 })
  }

  // Pull every relevant page_view event (only for the candidate paths)
  const rows = await prisma.trackingEvent.findMany({
    where: {
      type: 'page_view',
      createdAt: { gte: since },
      pagePath: { in: steps },
    },
    select: { sessionId: true, pagePath: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // For each session, compute the highest step they reached in order
  const sessionMaxStep = new Map<string, number>()
  const sessionTimestamps = new Map<string, number>() // last-seen ts at current step

  for (const r of rows) {
    const stepIdx = steps.indexOf(r.pagePath)
    if (stepIdx === -1) continue
    const cur = sessionMaxStep.get(r.sessionId) ?? -1
    // To advance to step N, the session must currently be at step N-1
    if (stepIdx === cur + 1) {
      sessionMaxStep.set(r.sessionId, stepIdx)
      sessionTimestamps.set(r.sessionId, r.createdAt.getTime())
    } else if (stepIdx === 0 && cur === -1) {
      sessionMaxStep.set(r.sessionId, 0)
      sessionTimestamps.set(r.sessionId, r.createdAt.getTime())
    }
    // If they revisit step 0 after dropping, we DON'T reset — first
    // attempt counts. Could revisit this if you want last-attempt semantics.
  }

  // Count sessions reaching each step
  const reached: number[] = new Array(steps.length).fill(0)
  Array.from(sessionMaxStep.values()).forEach(max => {
    for (let i = 0; i <= max; i++) reached[i]++
  })

  const start = reached[0] || 0
  const result = steps.map((path, i) => ({
    path,
    sessions: reached[i],
    pctOfStart: start > 0 ? Math.round((reached[i] / start) * 100) : 0,
    pctOfPrev: i === 0 ? 100 : reached[i - 1] > 0 ? Math.round((reached[i] / reached[i - 1]) * 100) : 0,
  }))

  return NextResponse.json({ days, steps: result })
}
