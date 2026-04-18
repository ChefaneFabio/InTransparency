import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getCurrentSkillGraph } from '@/lib/skill-delta'
import type { Prisma } from '@prisma/client'

/**
 * GET /api/student/self-discovery
 * Returns the current student's SelfDiscoveryProfile (creates empty on first hit).
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let profile = await prisma.selfDiscoveryProfile.findUnique({
    where: { studentId: session.user.id },
  })
  if (!profile) {
    profile = await prisma.selfDiscoveryProfile.create({
      data: { studentId: session.user.id },
    })
  }

  return NextResponse.json({ profile })
}

/**
 * PUT /api/student/self-discovery
 * Body: { step: 1-6, data: {...} }
 * Updates a specific step of the onboarding.
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { step, data } = await req.json()
  if (typeof step !== 'number' || step < 1 || step > 6) {
    return NextResponse.json({ error: 'step must be 1-6' }, { status: 400 })
  }

  const existing = await prisma.selfDiscoveryProfile.findUnique({
    where: { studentId: session.user.id },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Profile not initialized; call GET first' }, { status: 404 })
  }

  const update: Prisma.SelfDiscoveryProfileUpdateInput = {
    stepsCompleted: Math.max(existing.stepsCompleted, step),
  }

  switch (step) {
    case 1: // Values
      update.coreValues = data.coreValues ?? []
      update.valueRankings = data.valueRankings ?? undefined
      break
    case 2: // Strengths
      update.strengths = data.strengths ?? []
      update.strengthStories = data.strengthStories ?? undefined
      update.energizingActivities = data.energizingActivities ?? []
      update.drainingActivities = data.drainingActivities ?? []
      break
    case 3: // Project tagging
      update.projectTags = data.projectTags ?? undefined
      break
    case 4: // Career interests
      update.motivations = data.motivations ?? []
      update.dealbreakers = data.dealbreakers ?? []
      update.idealDayNarrative = data.idealDayNarrative ?? null
      update.fiveYearNarrative = data.fiveYearNarrative ?? null
      break
    case 5: // Skill self-seed
      update.selfAssessedSkills = data.selfAssessedSkills ?? undefined
      break
    case 6: // Reconcile — server computes insights
      {
        const graph = await getCurrentSkillGraph(session.user.id)
        const selfSkills = (existing.selfAssessedSkills as any) ?? []
        const insights = reconcile(selfSkills, graph)
        update.discoveryInsights = insights as any
        update.completedAt = new Date()
      }
      break
  }

  const profile = await prisma.selfDiscoveryProfile.update({
    where: { studentId: session.user.id },
    data: update,
  })

  return NextResponse.json({ profile })
}

/**
 * Reconcile self-assessment with verified skill graph.
 * Returns structured insights for the discovery report.
 */
function reconcile(
  selfSkills: Array<{ skill: string; level: number }>,
  graph: Array<{ skillTerm: string; currentLevel: number; sourceCount: number }>
) {
  const graphMap = new Map<string, { level: number; sources: number }>()
  for (const g of graph) {
    graphMap.set(g.skillTerm.toLowerCase(), {
      level: g.currentLevel,
      sources: g.sourceCount,
    })
  }

  const overestimates: Array<{ skill: string; selfLevel: number; verifiedLevel: number }> = []
  const underestimates: Array<{ skill: string; selfLevel: number; verifiedLevel: number }> = []
  const aligned: Array<{ skill: string; level: number }> = []
  const unclaimed: Array<{ skill: string; verifiedLevel: number; sources: number }> = []

  const selfMap = new Map<string, number>()
  for (const s of selfSkills ?? []) {
    if (!s?.skill) continue
    selfMap.set(s.skill.toLowerCase(), s.level)
    const verified = graphMap.get(s.skill.toLowerCase())
    if (!verified) continue
    if (s.level > verified.level + 1) {
      overestimates.push({ skill: s.skill, selfLevel: s.level, verifiedLevel: verified.level })
    } else if (verified.level > s.level + 1) {
      underestimates.push({ skill: s.skill, selfLevel: s.level, verifiedLevel: verified.level })
    } else {
      aligned.push({ skill: s.skill, level: verified.level })
    }
  }

  for (const [key, v] of Array.from(graphMap.entries())) {
    if (!selfMap.has(key) && v.sources >= 2) {
      unclaimed.push({ skill: key, verifiedLevel: v.level, sources: v.sources })
    }
  }

  return {
    overestimates: overestimates.slice(0, 5),
    underestimates: underestimates.slice(0, 5),
    aligned: aligned.slice(0, 10),
    unclaimed: unclaimed.slice(0, 5),
    summary: {
      verifiedSkillCount: graph.length,
      selfAssessedCount: selfSkills?.length ?? 0,
      alignmentRate: aligned.length + overestimates.length + underestimates.length > 0
        ? Math.round((aligned.length / (aligned.length + overestimates.length + underestimates.length)) * 100)
        : 0,
    },
  }
}
