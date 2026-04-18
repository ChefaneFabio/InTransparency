/**
 * MatchExplanation — P2 (AI Act Explainability)
 *
 * Every match produced by the platform is persisted with its reasoning
 * so that:
 *   - Students can exercise their "right to explanation" (GDPR Art. 22 + AI Act Art. 86)
 *   - Universities can audit fairness across cohorts
 *   - Recruiters can show evidence-based rationale
 *
 * All three audiences read the same underlying record; only presentation differs.
 */

import prisma from './prisma'
import type { Prisma } from '@prisma/client'

export const MATCH_MODEL_VERSION = 'talent-match-v1.2.0'
export const MATCH_MODEL_TYPE = 'rule-based'

export type MatchFactorCategory =
  | 'skills'
  | 'verified_evidence'
  | 'experience'
  | 'academic'
  | 'preferences'
  | 'availability'

export interface MatchFactor {
  name: string
  category: MatchFactorCategory
  /** Weight in the final score (0-1 or absolute points, depending on modelType) */
  weight: number
  /** The raw value observed (e.g. "3 of 5 skills matched") */
  value: number | string
  /** Contribution to final score (weight × normalized value) */
  contribution: number
  /** Evidence — structured references the subject can inspect */
  evidence?: Array<{
    type: 'skill' | 'project' | 'stage' | 'gpa' | 'endorsement' | 'course'
    id?: string
    label: string
    detail?: string
  }>
  /** Human-readable explanation */
  humanReason?: string
}

export interface WriteExplanationParams {
  subjectId: string
  subjectType: 'STUDENT' | 'CANDIDATE'
  counterpartyId: string
  counterpartyType: 'RECRUITER' | 'JOB'
  contextType?: 'JOB' | 'STAGE' | 'GENERIC'
  contextId?: string | null
  matchScore: number
  factors: MatchFactor[]
  inputSnapshot?: Record<string, unknown>
  modelVersion?: string
  modelType?: string
}

export function decisionLabel(score: number): string {
  if (score >= 80) return 'STRONG_MATCH'
  if (score >= 60) return 'MATCH'
  if (score >= 40) return 'WEAK_MATCH'
  return 'NO_MATCH'
}

export async function persistMatchExplanation(params: WriteExplanationParams) {
  return prisma.matchExplanation.create({
    data: {
      subjectId: params.subjectId,
      subjectType: params.subjectType,
      counterpartyId: params.counterpartyId,
      counterpartyType: params.counterpartyType,
      contextType: params.contextType ?? 'GENERIC',
      contextId: params.contextId ?? null,
      matchScore: params.matchScore,
      decisionLabel: decisionLabel(params.matchScore),
      factors: params.factors as unknown as Prisma.InputJsonValue,
      modelVersion: params.modelVersion ?? MATCH_MODEL_VERSION,
      modelType: params.modelType ?? MATCH_MODEL_TYPE,
      inputSnapshot: (params.inputSnapshot ?? {}) as Prisma.InputJsonValue,
    },
  })
}

/**
 * Convenience: convert the legacy `reasons[]` shape used by Talent Match
 * into typed MatchFactor[].
 */
export function legacyReasonsToFactors(
  reasons: Array<{ factor: string; score: number; detail: string }>,
  context: { matchedSkills?: string[]; topProjects?: Array<{ title: string }>; internships?: Array<{ company: string; role: string }> }
): MatchFactor[] {
  return reasons.map(r => {
    const category: MatchFactorCategory =
      r.factor === 'requiredSkills' || r.factor === 'preferredSkills'
        ? 'skills'
        : r.factor === 'verifiedProjects'
        ? 'verified_evidence'
        : r.factor === 'internshipExperience'
        ? 'experience'
        : r.factor === 'academicPerformance'
        ? 'academic'
        : 'skills'

    const evidence: MatchFactor['evidence'] = []
    if (r.factor === 'requiredSkills' || r.factor === 'preferredSkills') {
      for (const s of context.matchedSkills ?? []) {
        evidence.push({ type: 'skill', label: s })
      }
    }
    if (r.factor === 'verifiedProjects') {
      for (const p of context.topProjects ?? []) {
        evidence.push({ type: 'project', label: p.title })
      }
    }
    if (r.factor === 'internshipExperience') {
      for (const s of context.internships ?? []) {
        evidence.push({ type: 'stage', label: `${s.role} @ ${s.company}` })
      }
    }

    return {
      name: r.factor,
      category,
      weight: r.score,
      value: r.detail,
      contribution: r.score,
      evidence,
      humanReason: r.detail,
    }
  })
}

/**
 * Read-time views — same data, three presentations.
 */

export async function getExplanationForSubject(explanationId: string, subjectId: string) {
  const expl = await prisma.matchExplanation.findFirst({
    where: { id: explanationId, subjectId },
  })
  if (!expl) return null

  // Mark as viewed if not already
  if (!expl.subjectViewed) {
    await prisma.matchExplanation.update({
      where: { id: expl.id },
      data: { subjectViewed: true, subjectViewedAt: new Date() },
    })
  }

  return {
    id: expl.id,
    matchScore: expl.matchScore,
    decisionLabel: expl.decisionLabel,
    factors: expl.factors as unknown as MatchFactor[],
    modelVersion: expl.modelVersion,
    createdAt: expl.createdAt,
  }
}

export async function getExplanationForAudit(explanationId: string) {
  const expl = await prisma.matchExplanation.findUnique({ where: { id: explanationId } })
  if (!expl) return null
  return {
    id: expl.id,
    matchScore: expl.matchScore,
    decisionLabel: expl.decisionLabel,
    factors: expl.factors as unknown as MatchFactor[],
    modelVersion: expl.modelVersion,
    modelType: expl.modelType,
    inputSnapshot: expl.inputSnapshot,
    reviewed: expl.reviewed,
    reviewOutcome: expl.reviewOutcome,
    subjectViewed: expl.subjectViewed,
    subjectViewedAt: expl.subjectViewedAt,
    createdAt: expl.createdAt,
  }
}

export async function getExplanationForRecruiter(explanationId: string, recruiterId: string) {
  const expl = await prisma.matchExplanation.findFirst({
    where: { id: explanationId, counterpartyId: recruiterId },
  })
  if (!expl) return null
  return {
    id: expl.id,
    matchScore: expl.matchScore,
    decisionLabel: expl.decisionLabel,
    factors: expl.factors as unknown as MatchFactor[],
    subjectId: expl.subjectId,
    createdAt: expl.createdAt,
  }
}
