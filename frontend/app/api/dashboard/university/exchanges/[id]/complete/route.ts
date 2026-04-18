import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { resolveEscoUri } from '@/lib/esco'
import type { Prisma } from '@prisma/client'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * POST /api/dashboard/university/exchanges/[id]/complete
 *
 * Host institution marks an exchange as complete and writes the skill deltas
 * back to the student's home skill graph. This is the cross-border verification
 * reciprocity flow — a Spanish university endorses, an Italian student's
 * profile is updated automatically.
 *
 * Body: { skillsAcquired: [{ skill: string, level: 1-4, evidence?: string }] }
 */
export async function POST(req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await ctx.params
  const { skillsAcquired } = await req.json()

  const exchange = await prisma.exchangeEnrollment.findUnique({ where: { id } })
  if (!exchange) return NextResponse.json({ error: 'Exchange not found' }, { status: 404 })

  const universityName = user.company || user.university || ''
  const isHost = exchange.hostUniversityName === universityName
  const isHome = exchange.homeUniversityName === universityName

  if (!isHost && !isHome && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not a party to this exchange' }, { status: 403 })
  }

  // Only the host can complete; home only verifies
  if (!isHost && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only the host institution can mark complete' }, { status: 403 })
  }

  await prisma.exchangeEnrollment.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      verifiedByHost: true,
      endDate: exchange.endDate ?? new Date(),
    },
  })

  // Write skill deltas — source=EXCHANGE, host as evaluator
  let deltasCreated = 0
  if (Array.isArray(skillsAcquired)) {
    for (const s of skillsAcquired) {
      if (!s?.skill || typeof s.level !== 'number') continue

      const existing = await prisma.skillDelta.findFirst({
        where: {
          studentId: exchange.studentId,
          source: 'EXCHANGE',
          sourceId: id,
          skillTerm: { equals: s.skill, mode: 'insensitive' },
        },
        select: { id: true },
      })
      if (existing) continue

      const prior = await prisma.skillDelta.findFirst({
        where: { studentId: exchange.studentId, skillTerm: { equals: s.skill, mode: 'insensitive' } },
        orderBy: { occurredAt: 'desc' },
        select: { afterLevel: true },
      })

      const esco = await resolveEscoUri(s.skill).catch(() => null)

      await prisma.skillDelta.create({
        data: {
          studentId: exchange.studentId,
          skillTerm: s.skill,
          escoUri: esco?.uri ?? null,
          source: 'EXCHANGE',
          sourceId: id,
          sourceName: `Exchange at ${exchange.hostUniversityName}`,
          beforeLevel: prior?.afterLevel ?? null,
          afterLevel: Math.max(1, Math.min(4, Math.floor(s.level))),
          confidence: 0.85,
          evaluatorType: 'PROFESSOR',
          evaluatorName: exchange.hostUniversityName,
          evidence: {
            hostCountry: exchange.hostCountry,
            programType: exchange.programType,
            evidenceNote: s.evidence ?? null,
          } as Prisma.InputJsonValue,
        },
      })
      deltasCreated++
    }
  }

  return NextResponse.json({
    success: true,
    exchangeId: id,
    deltasCreated,
    message: 'Exchange marked complete. Skill deltas pushed to home institution.',
  })
}
