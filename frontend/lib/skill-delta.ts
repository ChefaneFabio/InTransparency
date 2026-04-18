/**
 * SkillDelta — writeback pipeline
 *
 * When a stage is evaluated, a project is verified, or a course completes,
 * we compute one or more SkillDelta records: "student X moved from level Y to Z
 * on skill S, based on evidence E".
 *
 * This closes the loop on the three-sided platform: the verified skill graph
 * is continuously updated by real outcomes, not self-declared claims.
 */

import prisma from './prisma'
import { resolveEscoUri } from './esco'
import type { SkillDeltaSource, Prisma } from '@prisma/client'

/**
 * Proficiency level scale (shared across project competencies, stage evals, self-assessments)
 * 0 = not observed
 * 1 = Beginner — exposed, needs guidance
 * 2 = Intermediate — can execute with some support
 * 3 = Advanced — autonomous, can mentor peers
 * 4 = Expert — reference for the team/cohort
 */
export type ProficiencyLevel = 0 | 1 | 2 | 3 | 4

export interface StageCompetencyRating {
  skill: string
  rating: number // 1-5 from supervisor rubric
  notes?: string
}

/**
 * Convert a 1-5 supervisor rating to our 1-4 proficiency scale.
 * 1-2 → Beginner, 3 → Intermediate, 4 → Advanced, 5 → Expert.
 */
export function supervisorRatingToProficiency(rating: number): ProficiencyLevel {
  if (rating <= 2) return 1
  if (rating === 3) return 2
  if (rating === 4) return 3
  return 4
}

/**
 * Write skill deltas for a completed stage evaluation.
 * Called from the stage evaluation endpoint when supervisor submits ratings.
 *
 * For each competency rated by the supervisor:
 * - Look up the student's prior level for that skill (from earlier deltas)
 * - Compute the new level from the rubric
 * - Resolve ESCO URI when possible
 * - Insert a SkillDelta record
 *
 * Idempotent: safe to call multiple times per stage; prior deltas from the
 * same stage source are not duplicated (we check source+sourceId+skill).
 */
export async function writeStageDeltas(params: {
  stageId: string
  studentId: string
  supervisorCompetencies: StageCompetencyRating[]
  supervisorName?: string | null
  companyName: string
  overallRating?: number | null
}): Promise<{ deltasCreated: number; deltasSkipped: number }> {
  const { stageId, studentId, supervisorCompetencies, supervisorName, companyName } = params

  if (!Array.isArray(supervisorCompetencies) || supervisorCompetencies.length === 0) {
    return { deltasCreated: 0, deltasSkipped: 0 }
  }

  let created = 0
  let skipped = 0

  for (const comp of supervisorCompetencies) {
    if (!comp?.skill || typeof comp.rating !== 'number') {
      skipped++
      continue
    }

    // Idempotency guard — skip if we already wrote a delta for this skill from this stage
    const existing = await prisma.skillDelta.findFirst({
      where: {
        studentId,
        source: 'STAGE',
        sourceId: stageId,
        skillTerm: { equals: comp.skill, mode: 'insensitive' },
      },
      select: { id: true },
    })
    if (existing) {
      skipped++
      continue
    }

    // Resolve prior level — the student's most recent delta for this skill before this stage
    const prior = await prisma.skillDelta.findFirst({
      where: {
        studentId,
        skillTerm: { equals: comp.skill, mode: 'insensitive' },
      },
      orderBy: { occurredAt: 'desc' },
      select: { afterLevel: true },
    })

    const afterLevel = supervisorRatingToProficiency(comp.rating)

    // Attempt ESCO resolution (non-blocking — delta is still written without it)
    const esco = await resolveEscoUri(comp.skill).catch(() => null)

    // Find or note a SkillMapping FK if one exists
    const mapping = await prisma.skillMapping.findFirst({
      where: {
        OR: [
          { academicTerm: { equals: comp.skill, mode: 'insensitive' } },
          { synonyms: { has: comp.skill.toLowerCase() } },
        ],
      },
      select: { id: true },
    })

    await prisma.skillDelta.create({
      data: {
        studentId,
        skillTerm: comp.skill,
        skillMappingId: mapping?.id ?? null,
        escoUri: esco?.uri ?? null,
        source: 'STAGE',
        sourceId: stageId,
        sourceName: `Stage at ${companyName}`,
        beforeLevel: prior?.afterLevel ?? null,
        afterLevel,
        confidence: 0.9, // Supervisor-rated = high confidence
        evaluatorType: 'SUPERVISOR',
        evaluatorName: supervisorName ?? null,
        evidence: {
          rubricRating: comp.rating,
          supervisorNotes: comp.notes ?? null,
          overallStageRating: params.overallRating ?? null,
        } as Prisma.InputJsonValue,
      },
    })
    created++
  }

  return { deltasCreated: created, deltasSkipped: skipped }
}

/**
 * Write skill deltas for a verified project.
 * Called when a professor endorsement is confirmed or a project is marked VERIFIED.
 */
export async function writeProjectDeltas(params: {
  projectId: string
  studentId: string
  projectTitle: string
  competencies: Array<{ skill: string; proficiencyLevel: string; evidence?: string }>
  endorserName?: string | null
}): Promise<{ deltasCreated: number; deltasSkipped: number }> {
  const { projectId, studentId, projectTitle, competencies, endorserName } = params
  let created = 0
  let skipped = 0

  const levelMap: Record<string, ProficiencyLevel> = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
    Expert: 4,
  }

  for (const comp of competencies ?? []) {
    if (!comp?.skill) {
      skipped++
      continue
    }
    const afterLevel = levelMap[comp.proficiencyLevel] ?? 2

    const existing = await prisma.skillDelta.findFirst({
      where: {
        studentId,
        source: 'PROJECT',
        sourceId: projectId,
        skillTerm: { equals: comp.skill, mode: 'insensitive' },
      },
      select: { id: true },
    })
    if (existing) {
      skipped++
      continue
    }

    const prior = await prisma.skillDelta.findFirst({
      where: { studentId, skillTerm: { equals: comp.skill, mode: 'insensitive' } },
      orderBy: { occurredAt: 'desc' },
      select: { afterLevel: true },
    })

    const esco = await resolveEscoUri(comp.skill).catch(() => null)

    await prisma.skillDelta.create({
      data: {
        studentId,
        skillTerm: comp.skill,
        escoUri: esco?.uri ?? null,
        source: 'PROJECT',
        sourceId: projectId,
        sourceName: projectTitle,
        beforeLevel: prior?.afterLevel ?? null,
        afterLevel,
        confidence: endorserName ? 0.95 : 0.7,
        evaluatorType: endorserName ? 'PROFESSOR' : 'AI',
        evaluatorName: endorserName ?? null,
        evidence: {
          projectEvidence: comp.evidence ?? null,
        } as Prisma.InputJsonValue,
      },
    })
    created++
  }

  return { deltasCreated: created, deltasSkipped: skipped }
}

/**
 * Fetch the current skill graph for a student — one row per skill, showing
 * the student's current proficiency (from most recent delta) and provenance.
 *
 * Used by: student profile, recruiter DecisionPack, Europass export, match reasoning.
 */
export interface CurrentSkillRow {
  skillTerm: string
  escoUri: string | null
  currentLevel: ProficiencyLevel
  sourceCount: number // How many independent sources confirm
  sources: Array<{ source: string; sourceId: string; sourceName: string | null; level: ProficiencyLevel; occurredAt: Date }>
  firstObservedAt: Date
  lastObservedAt: Date
}

export async function getCurrentSkillGraph(studentId: string): Promise<CurrentSkillRow[]> {
  const deltas = await prisma.skillDelta.findMany({
    where: { studentId },
    orderBy: { occurredAt: 'desc' },
  })

  // Group by normalized skillTerm (case-insensitive)
  const grouped = new Map<string, typeof deltas>()
  for (const d of deltas) {
    const key = d.skillTerm.toLowerCase()
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(d)
  }

  const rows: CurrentSkillRow[] = []
  for (const [, group] of Array.from(grouped.entries())) {
    const sorted = group.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    const newest = sorted[0]
    const oldest = sorted[sorted.length - 1]
    rows.push({
      skillTerm: newest.skillTerm,
      escoUri: newest.escoUri,
      currentLevel: newest.afterLevel as ProficiencyLevel,
      sourceCount: new Set(sorted.map(d => `${d.source}:${d.sourceId}`)).size,
      sources: sorted.map(d => ({
        source: d.source,
        sourceId: d.sourceId,
        sourceName: d.sourceName,
        level: d.afterLevel as ProficiencyLevel,
        occurredAt: d.occurredAt,
      })),
      firstObservedAt: oldest.occurredAt,
      lastObservedAt: newest.occurredAt,
    })
  }

  return rows.sort((a, b) => b.currentLevel - a.currentLevel || b.sourceCount - a.sourceCount)
}
