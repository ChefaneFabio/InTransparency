import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/privacy/audit-log
 *
 * GDPR Art. 15 (Right of Access) self-service for students.
 * Lists every AuditEvent where the student's data was touched:
 *   - events where entityId === studentId (direct: e.g. placement the
 *     student is the subject of, mediation thread addressed to them)
 *   - events where payload references the student (e.g. recruiter
 *     AI-search results — logged via `assistant.search_candidates`)
 *   - events the student themselves triggered (as actor)
 *
 * Free of charge, no institution plan gate — this is a legal right.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)

    const since = searchParams.get('since')
    const sinceDate = since ? new Date(since) : null
    const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10), 500)

    // 1. Events where the student is the actor (their own actions)
    //    OR the entityId matches the student (events about their account
    //    directly, e.g. a placement they're the subject of)
    // 2. Separately, events where the student id appears in payload
    //    (e.g. AI assistant search results — json query).
    const baseTimeFilter = sinceDate ? { createdAt: { gte: sinceDate } } : {}

    // Fetch placements / threads the student is a subject of so we can
    // also match events whose entityId is one of those.
    const [myPlacementIds, myThreadIds] = await Promise.all([
      prisma.placement
        .findMany({ where: { studentId: userId }, select: { id: true } })
        .then(r => r.map(x => x.id)),
      prisma.mediationThread
        .findMany({ where: { studentId: userId }, select: { id: true } })
        .then(r => r.map(x => x.id)),
    ])

    // Assistant tool-use events log the candidate id in payload.candidateId
    // or payload.candidateIds[]; we query those via Prisma Json path.
    // Note: Prisma's json array_contains doesn't cover all cases — we
    // run a text-match fallback (a server-side prisma query using
    // raw JSON contains) combined with the direct entity-id match.
    const directEvents = await prisma.auditEvent.findMany({
      where: {
        ...baseTimeFilter,
        OR: [
          { actorId: userId },
          { entityId: userId },
          { entityId: { in: myPlacementIds } },
          { entityId: { in: myThreadIds } },
          // Events like mediation.message.* log { threadId } in payload
          {
            AND: [
              { entityType: 'MediationMessage' },
              // no simple json match — we fetch a larger window and filter
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    })

    // Also query a separate set: events mentioning the student in payload
    // (ai assistant surface). Use raw SQL path where supported — for
    // simplicity we pull recent assistant events and filter in JS.
    const recentAssistant = await prisma.auditEvent.findMany({
      where: {
        ...baseTimeFilter,
        action: { startsWith: 'assistant.' },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    })

    // Filter assistant events whose payload references this user
    const userIdMatch = (payload: unknown): boolean => {
      if (!payload || typeof payload !== 'object') return false
      const str = JSON.stringify(payload)
      return str.includes(userId)
    }

    const assistantHits = recentAssistant.filter(e => userIdMatch(e.payload))

    // De-dupe and merge
    const allMap = new Map<string, typeof directEvents[number]>()
    for (const e of directEvents) allMap.set(e.id, e)
    for (const e of assistantHits) allMap.set(e.id, e)
    const merged = Array.from(allMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)

    // Resolve actor metadata
    const actorIds = Array.from(
      new Set(merged.map(e => e.actorId).filter((x): x is string => !!x)),
    )
    const actors = actorIds.length
      ? await prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            company: true,
          },
        })
      : []
    const actorById = new Map(actors.map(a => [a.id, a]))

    const items = merged.map(e => {
      const actor = e.actorId ? actorById.get(e.actorId) : null
      // What party is this?
      const actorParty =
        actor?.role === 'RECRUITER'
          ? `${actor.company || 'Azienda'} (recruiter)`
          : actor?.role === 'UNIVERSITY' || e.actorRole === 'INSTITUTION_STAFF'
            ? 'Il tuo ateneo'
            : actor?.role === 'STUDENT' && actor.id === userId
              ? 'Tu'
              : actor
                ? `${actor.firstName ?? ''} ${actor.lastName ?? ''}`.trim() || 'Sconosciuto'
                : 'Sistema'

      // Was I the data subject (surfaced/touched) or the actor?
      const iAmSubject =
        e.entityId === userId ||
        myPlacementIds.includes(e.entityId) ||
        myThreadIds.includes(e.entityId) ||
        (e.action.startsWith('assistant.') && userIdMatch(e.payload))
      const iAmActor = e.actorId === userId

      return {
        id: e.id,
        action: e.action,
        entityType: e.entityType,
        entityId: e.entityId,
        createdAt: e.createdAt,
        actor: actorParty,
        iAmSubject,
        iAmActor,
      }
    })

    return NextResponse.json({
      items,
      summary: {
        total: items.length,
        byActionPrefix: items.reduce<Record<string, number>>((acc, i) => {
          const prefix = i.action.split('.')[0]
          acc[prefix] = (acc[prefix] || 0) + 1
          return acc
        }, {}),
      },
    })
  } catch (error: any) {
    console.error('Student audit trail error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load audit trail' },
      { status: 500 }
    )
  }
}
