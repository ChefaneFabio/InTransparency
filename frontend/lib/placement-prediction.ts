/**
 * Placement Prediction Engine
 *
 * Rule-based scoring v1 that computes placement probability for a student.
 * No 'use client' — server-side only.
 */

import prisma from '@/lib/prisma'

export interface PredictionSignal {
  name: string
  weight: number
  value: number
  contribution: number
  description: string
}

export interface PlacementPredictionResult {
  probability: number
  signals: PredictionSignal[]
  topFactors: Array<{ factor: string; impact: number; description: string }>
}

/**
 * Compute placement probability for a student.
 *
 * Formula:
 *   base = 0.30
 *   + hireabilityScore/100 * 0.25
 *   + (verifiedProjects/totalProjects) * 0.15
 *   + avgAiScore/100 * 0.15
 *   - skillGapSeverity/100 * 0.10
 *   + min(endorsementCount/3, 1) * 0.10
 *   + disciplineDemand/100 * 0.05
 *   = probability (clamped 0-0.99)
 */
export async function computePlacementPrediction(
  studentId: string
): Promise<PlacementPredictionResult> {
  // Gather data
  const [student, skillPath, projects, endorsements, placements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, role: true },
    }),
    prisma.skillPathRecommendation.findUnique({
      where: { userId: studentId },
    }),
    prisma.project.findMany({
      where: { userId: studentId },
      select: {
        id: true,
        aiAnalyzed: true,
        innovationScore: true,
        complexityScore: true,
        marketRelevance: true,
        verificationStatus: true,
        discipline: true,
      },
    }),
    prisma.professorEndorsement.count({
      where: { studentId, status: 'VERIFIED' },
    }),
    prisma.placement.count({
      where: { studentId, status: 'CONFIRMED' },
    }),
  ])

  if (!student || student.role !== 'STUDENT') {
    return { probability: 0, signals: [], topFactors: [] }
  }

  const signals: PredictionSignal[] = []

  // 1. Base probability
  const baseWeight = 0.30
  signals.push({
    name: 'base',
    weight: baseWeight,
    value: 1,
    contribution: baseWeight,
    description: 'Base placement probability',
  })

  // 2. Hireability score from SkillPath
  const hireabilityScore = skillPath?.hireabilityScore ?? 0
  const hireWeight = 0.25
  const hireContrib = (hireabilityScore / 100) * hireWeight
  signals.push({
    name: 'hireabilityScore',
    weight: hireWeight,
    value: hireabilityScore,
    contribution: hireContrib,
    description: `Hireability score: ${hireabilityScore}/100`,
  })

  // 3. Verified projects ratio
  const totalProjects = projects.length
  const verifiedProjects = projects.filter(
    (p) => p.verificationStatus === 'VERIFIED'
  ).length
  const verifiedRatio = totalProjects > 0 ? verifiedProjects / totalProjects : 0
  const verifiedWeight = 0.15
  const verifiedContrib = verifiedRatio * verifiedWeight
  signals.push({
    name: 'verifiedProjects',
    weight: verifiedWeight,
    value: Math.round(verifiedRatio * 100),
    contribution: verifiedContrib,
    description: `${verifiedProjects}/${totalProjects} projects verified`,
  })

  // 4. Average AI score
  const analyzedProjects = projects.filter((p) => p.aiAnalyzed)
  let avgAiScore = 0
  if (analyzedProjects.length > 0) {
    const totalScore = analyzedProjects.reduce((sum, p) => {
      const scores = [p.innovationScore, p.complexityScore, p.marketRelevance].filter(
        (s): s is number => s != null
      )
      return sum + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0)
    }, 0)
    avgAiScore = totalScore / analyzedProjects.length
  }
  const aiWeight = 0.15
  const aiContrib = (avgAiScore / 100) * aiWeight
  signals.push({
    name: 'avgAiScore',
    weight: aiWeight,
    value: Math.round(avgAiScore),
    contribution: aiContrib,
    description: `Average AI analysis score: ${Math.round(avgAiScore)}/100`,
  })

  // 5. Skill gap severity (negative signal)
  let skillGapSeverity = 50 // default moderate gap if no data
  if (skillPath) {
    try {
      const gaps = skillPath.skillGaps as Array<{ priority?: string }>
      if (Array.isArray(gaps) && gaps.length > 0) {
        const highPriorityGaps = gaps.filter((g) => g.priority === 'high').length
        skillGapSeverity = Math.min(100, (highPriorityGaps / gaps.length) * 100)
      }
    } catch {
      // Keep default
    }
  }
  const gapWeight = 0.10
  const gapContrib = -(skillGapSeverity / 100) * gapWeight
  signals.push({
    name: 'skillGapSeverity',
    weight: -gapWeight,
    value: Math.round(skillGapSeverity),
    contribution: gapContrib,
    description: `Skill gap severity: ${Math.round(skillGapSeverity)}% high-priority gaps`,
  })

  // 6. Endorsement count
  const endorsementScore = Math.min(endorsements / 3, 1)
  const endorseWeight = 0.10
  const endorseContrib = endorsementScore * endorseWeight
  signals.push({
    name: 'endorsements',
    weight: endorseWeight,
    value: endorsements,
    contribution: endorseContrib,
    description: `${endorsements} verified professor endorsement${endorsements !== 1 ? 's' : ''}`,
  })

  // 7. Discipline demand (simplified — use most common discipline)
  let disciplineDemand = 50 // default moderate
  if (projects.length > 0) {
    const disciplineCounts = new Map<string, number>()
    for (const p of projects) {
      disciplineCounts.set(
        p.discipline,
        (disciplineCounts.get(p.discipline) || 0) + 1
      )
    }
    const topDiscipline = Array.from(disciplineCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0]

    // Hardcoded demand scores for v1
    const demandMap: Record<string, number> = {
      TECHNOLOGY: 90,
      ENGINEERING: 85,
      HEALTHCARE: 80,
      BUSINESS: 70,
      DESIGN: 65,
      SCIENCE: 60,
      LAW: 55,
      ARCHITECTURE: 50,
      MEDIA: 45,
      EDUCATION: 40,
      SOCIAL_SCIENCES: 35,
      ARTS: 30,
      TRADES: 75,
      WRITING: 35,
      OTHER: 40,
    }
    if (topDiscipline) {
      disciplineDemand = demandMap[topDiscipline] ?? 50
    }
  }
  const demandWeight = 0.05
  const demandContrib = (disciplineDemand / 100) * demandWeight
  signals.push({
    name: 'disciplineDemand',
    weight: demandWeight,
    value: disciplineDemand,
    contribution: demandContrib,
    description: `Discipline market demand: ${disciplineDemand}/100`,
  })

  // 8. Bonus: prior placements
  if (placements > 0) {
    signals.push({
      name: 'priorPlacements',
      weight: 0.05,
      value: placements,
      contribution: 0.05,
      description: `${placements} confirmed prior placement${placements !== 1 ? 's' : ''}`,
    })
  }

  // Sum contributions
  const rawProbability = signals.reduce((sum, s) => sum + s.contribution, 0)
  const probability = Math.max(0, Math.min(0.99, rawProbability))

  // Top factors (highest absolute contribution)
  const sortedSignals = signals
    .filter((s) => s.name !== 'base')
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 5)

  const topFactors = sortedSignals.map((s) => ({
    factor: s.name,
    impact: Math.round(s.contribution * 100),
    description: s.description,
  }))

  return { probability: Math.round(probability * 100) / 100, signals, topFactors }
}
