/**
 * Psychometric Assessment Scoring Engine
 *
 * Scores Big Five (OCEAN), DISC, and Competency assessments.
 * Uses Claude for AI-generated interpretations.
 */

import { anthropic, AI_MODEL } from './openai-shared'

// ============================================================================
// BIG FIVE SCORING
// ============================================================================

interface BigFiveScores {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

interface BigFiveResult extends BigFiveScores {
  personality: string
  strengths: string[]
  developmentAreas: string[]
  careerFit: string[]
  facets: Record<string, number>
}

/**
 * Score Big Five (OCEAN) responses.
 * Questions map to dimensions: openness, conscientiousness, extraversion, agreeableness, neuroticism
 */
export function scoreBigFive(
  responses: Record<string, number>,
  questions: Array<{
    id: string
    dimension: string
    facet?: string | null
    isReverseCoded: boolean
    weight: number
    maxValue: number
  }>
): BigFiveScores {
  const dimensionScores: Record<string, { total: number; count: number }> = {
    openness: { total: 0, count: 0 },
    conscientiousness: { total: 0, count: 0 },
    extraversion: { total: 0, count: 0 },
    agreeableness: { total: 0, count: 0 },
    neuroticism: { total: 0, count: 0 },
  }

  for (const q of questions) {
    const rawResponse = responses[q.id]
    if (rawResponse === undefined) continue

    let score = rawResponse
    if (q.isReverseCoded) {
      score = q.maxValue + 1 - score
    }

    // Normalize to 0-100
    const normalized = ((score - 1) / (q.maxValue - 1)) * 100 * q.weight

    const dim = q.dimension.toLowerCase()
    if (dimensionScores[dim]) {
      dimensionScores[dim].total += normalized
      dimensionScores[dim].count += 1
    }
  }

  const result: Record<string, number> = {}
  for (const [dim, data] of Object.entries(dimensionScores)) {
    result[dim] = data.count > 0 ? Math.round(data.total / data.count) : 50
  }

  return result as unknown as BigFiveScores
}

// ============================================================================
// DISC SCORING
// ============================================================================

interface DISCScores {
  dominance: number
  influence: number
  steadiness: number
  compliance: number
}

type DISCStyleType =
  | 'DOMINANCE' | 'INFLUENCE' | 'STEADINESS' | 'COMPLIANCE'
  | 'DI' | 'DC' | 'IS' | 'IC' | 'DS' | 'SC'

interface DISCResult extends DISCScores {
  primaryStyle: DISCStyleType
  secondaryStyle: DISCStyleType | null
  workStyle: string
  communicationStyle: string
  motivators: string[]
  stressors: string[]
  idealTeamRole: string
}

export function scoreDISC(
  responses: Record<string, number>,
  questions: Array<{
    id: string
    dimension: string
    isReverseCoded: boolean
    weight: number
    maxValue: number
  }>
): DISCScores {
  const dimensionScores: Record<string, { total: number; count: number }> = {
    dominance: { total: 0, count: 0 },
    influence: { total: 0, count: 0 },
    steadiness: { total: 0, count: 0 },
    compliance: { total: 0, count: 0 },
  }

  for (const q of questions) {
    const rawResponse = responses[q.id]
    if (rawResponse === undefined) continue

    let score = rawResponse
    if (q.isReverseCoded) {
      score = q.maxValue + 1 - score
    }

    const normalized = ((score - 1) / (q.maxValue - 1)) * 100 * q.weight

    const dim = q.dimension.toLowerCase()
    if (dimensionScores[dim]) {
      dimensionScores[dim].total += normalized
      dimensionScores[dim].count += 1
    }
  }

  const result: Record<string, number> = {}
  for (const [dim, data] of Object.entries(dimensionScores)) {
    result[dim] = data.count > 0 ? Math.round(data.total / data.count) : 50
  }

  return result as unknown as DISCScores
}

export function getDISCStyle(scores: DISCScores): { primary: DISCStyleType; secondary: DISCStyleType | null } {
  const entries: [string, number][] = [
    ['DOMINANCE', scores.dominance],
    ['INFLUENCE', scores.influence],
    ['STEADINESS', scores.steadiness],
    ['COMPLIANCE', scores.compliance],
  ]
  entries.sort((a, b) => b[1] - a[1])

  const primary = entries[0][0] as DISCStyleType
  const secondaryScore = entries[1][1]
  const secondary = secondaryScore > 50 ? entries[1][0] as DISCStyleType : null

  return { primary, secondary }
}

// ============================================================================
// COMPETENCY SCORING
// ============================================================================

interface CompetencyScores {
  communication: number
  teamwork: number
  leadership: number
  problemSolving: number
  adaptability: number
  emotionalIntelligence: number
  timeManagement: number
  conflictResolution: number
}

export function scoreCompetencies(
  responses: Record<string, number>,
  questions: Array<{
    id: string
    dimension: string
    isReverseCoded: boolean
    weight: number
    maxValue: number
  }>
): CompetencyScores {
  const dimensions = [
    'communication', 'teamwork', 'leadership', 'problemSolving',
    'adaptability', 'emotionalIntelligence', 'timeManagement', 'conflictResolution',
  ]

  const dimensionScores: Record<string, { total: number; count: number }> = {}
  for (const d of dimensions) {
    dimensionScores[d] = { total: 0, count: 0 }
  }

  for (const q of questions) {
    const rawResponse = responses[q.id]
    if (rawResponse === undefined) continue

    let score = rawResponse
    if (q.isReverseCoded) {
      score = q.maxValue + 1 - score
    }

    const normalized = ((score - 1) / (q.maxValue - 1)) * 100 * q.weight
    const dim = q.dimension

    if (dimensionScores[dim]) {
      dimensionScores[dim].total += normalized
      dimensionScores[dim].count += 1
    }
  }

  const result: Record<string, number> = {}
  for (const [dim, data] of Object.entries(dimensionScores)) {
    result[dim] = data.count > 0 ? Math.round(data.total / data.count) : 50
  }

  return result as unknown as CompetencyScores
}

// ============================================================================
// PERCENTILE CALCULATION
// ============================================================================

/**
 * Simple percentile approximation using normal distribution.
 * In production, compare against actual peer group data.
 */
export function calculatePercentile(score: number, mean: number = 50, stdDev: number = 15): number {
  const z = (score - mean) / stdDev
  // Approximate CDF using logistic function
  const percentile = Math.round(100 / (1 + Math.exp(-1.7 * z)))
  return Math.max(1, Math.min(99, percentile))
}

// ============================================================================
// AI INTERPRETATION
// ============================================================================

export async function generateBigFiveInterpretation(scores: BigFiveScores): Promise<BigFiveResult> {
  const fallback: BigFiveResult = {
    ...scores,
    personality: scores.extraversion > 60 ? 'Social Innovator' : 'Analytical Thinker',
    strengths: [
      scores.openness > 60 ? 'Creative thinking' : 'Practical approach',
      scores.conscientiousness > 60 ? 'Strong organization' : 'Flexible planning',
      scores.agreeableness > 60 ? 'Excellent collaboration' : 'Independent judgment',
    ],
    developmentAreas: [
      scores.neuroticism > 60 ? 'Stress management' : 'Risk tolerance',
      scores.extraversion < 40 ? 'Public speaking' : 'Active listening',
    ],
    careerFit: ['Consulting', 'Project Management', 'Research'],
    facets: {},
  }

  if (!anthropic) return fallback

  try {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      system: 'You are a psychometric assessment expert. Generate a personality interpretation based on Big Five (OCEAN) scores. Return JSON only: { "personality": string, "strengths": string[], "developmentAreas": string[], "careerFit": string[] }',
      messages: [{
        role: 'user',
        content: `Big Five scores (0-100): Openness=${scores.openness}, Conscientiousness=${scores.conscientiousness}, Extraversion=${scores.extraversion}, Agreeableness=${scores.agreeableness}, Neuroticism=${scores.neuroticism}. Provide personality type label, 3 strengths, 2 development areas, and 3 career fits.`,
      }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return fallback

    let text = textBlock.text.trim()
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const parsed = JSON.parse(text)
    return { ...scores, facets: {}, ...parsed }
  } catch {
    return fallback
  }
}

export async function generateDISCInterpretation(scores: DISCScores): Promise<Omit<DISCResult, keyof DISCScores>> {
  const style = getDISCStyle(scores)
  const fallback = {
    primaryStyle: style.primary,
    secondaryStyle: style.secondary,
    workStyle: 'Results-oriented with attention to detail',
    communicationStyle: 'Direct and clear',
    motivators: ['Achievement', 'Recognition', 'Growth'],
    stressors: ['Micromanagement', 'Lack of clarity'],
    idealTeamRole: 'Project Lead',
  }

  if (!anthropic) return fallback

  try {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 600,
      system: 'You are a DISC behavioral assessment expert. Generate interpretation based on DISC scores. Return JSON only: { "workStyle": string, "communicationStyle": string, "motivators": string[], "stressors": string[], "idealTeamRole": string }',
      messages: [{
        role: 'user',
        content: `DISC scores (0-100): D=${scores.dominance}, I=${scores.influence}, S=${scores.steadiness}, C=${scores.compliance}. Primary style: ${style.primary}. Provide work style, communication style, 3 motivators, 2 stressors, ideal team role.`,
      }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return fallback

    let text = textBlock.text.trim()
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const parsed = JSON.parse(text)
    return { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}
