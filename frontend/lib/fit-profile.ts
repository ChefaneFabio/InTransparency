/**
 * Fit Profile + Role Offering + Fit Score — the shared shapes for the
 * non-skills matching dimensions (motivation, culture, position, company
 * dimension, goal alignment). Skills stay in their own pipeline.
 *
 * All three shapes are stored as Prisma Json on User / Job / Application.
 * Keeping them here means the wizard, the job-creation flow, the scoring
 * engine, and the recruiter evidence list all agree on the vocabulary.
 */

// ─── Controlled vocabularies ─────────────────────────────────────────────

export const MOTIVATIONS = [
  'impact',        // I want my work to matter
  'learning',      // I want to grow fast
  'autonomy',      // I want to own what I build
  'money',         // compensation is a top driver
  'stability',     // long-term, predictable role
  'craft',         // deep mastery of a discipline
  'prestige',      // brand / reputation matters
  'mission',       // cause-driven company
] as const
export type Motivation = (typeof MOTIVATIONS)[number]

export const CULTURE_TAGS = [
  'flat',
  'hierarchical',
  'fast-paced',
  'structured',
  'debate-heavy',
  'harmony-first',
  'remote-first',
  'office-first',
  'async',
  'sync-collaboration',
  'data-driven',
  'experiment-friendly',
  'craft-focused',
  'scrappy',
] as const
export type CultureTag = (typeof CULTURE_TAGS)[number]

export const POSITION_TYPES = [
  'intern',
  'thesis-stage',        // tirocinio di tesi
  'junior-ic',
  'mid-ic',
  'senior-ic',
  'lead',
  'rotational-program',
  'research',
  'pm',
  'designer',
  'founding-engineer',
] as const
export type PositionType = (typeof POSITION_TYPES)[number]

export const COMPANY_SIZES = [
  'startup-under-20',
  'scaleup-20-200',
  'midmarket-200-2000',
  'enterprise-2000-plus',
] as const
export type CompanySize = (typeof COMPANY_SIZES)[number]

export const CAREER_TRACKS = [
  'ic-path',          // build expert, no people management
  'leadership-track', // manager path from day one or soon
  'rotational',       // multiple teams before settling
  'research',         // R&D, publish, research lab
  'founder-track',    // first hires, high ownership
] as const
export type CareerTrack = (typeof CAREER_TRACKS)[number]

// ─── Student fit profile ─────────────────────────────────────────────────

export interface FitProfile {
  /** One sentence career destination — free text, used semantically. */
  goal: string

  /** Environment preference — free-text description of what "good" looks like. */
  scope: string

  /** What the student wants from the role (soft). */
  wishes: string[]

  /** Hard no's. Any match kicks the role to a 0 composite. */
  dealBreakers: string[]

  motivations: Motivation[]
  cultureFit: CultureTag[]
  positionTypes: PositionType[]
  companySizes: CompanySize[]

  /** Preferred sectors — free text, matched against Job.companyIndustry. */
  industries: string[]

  /** Preferred cities / countries / 'remote'. */
  geographies: string[]

  /** Wizard progress — 0..1, drives the "complete your profile" CTA. */
  completion?: number
}

// ─── Job role offering ───────────────────────────────────────────────────

export interface RoleOffering {
  careerTrack: CareerTrack
  positionLevel: PositionType
  environment: CultureTag[]

  /** What a junior will learn in the first 6 months — free text, semantic. */
  growthFocus: string

  motivations: Motivation[]
  cultureTags: CultureTag[]
  teamSize?: string
  companyStage?: 'seed' | 'series-a' | 'growth' | 'public' | 'established'
  industry?: string
  nonNegotiables: string[]
  perks: string[]
}

// ─── Fit score (cached on Application) ───────────────────────────────────

export interface AxisScore {
  /** 0-100 on this axis alone. */
  score: number
  /** One-sentence explanation the recruiter sees on expand. */
  reason: string
}

export interface FitScore {
  /** Final weighted score 0-100. If any dealBreaker fires, composite = 0. */
  composite: number

  /** Each axis with its own score + explanation. */
  skills: AxisScore
  intent: AxisScore       // goal ↔ growthFocus semantic match
  motivation: AxisScore
  cultureFit: AxisScore
  position: AxisScore
  dimension: AxisScore    // company size preference
  industry: AxisScore
  geography: AxisScore

  /** True if any hard dealbreaker was triggered. */
  dealBreakerHit: boolean
  dealBreakerReason?: string

  /** Model + prompt version so we can recompute old scores when weights change. */
  engineVersion: string
}

// ─── Scoring weights ─────────────────────────────────────────────────────

/**
 * Weights sum to 100. Tune here; engineVersion bumps when these change so
 * cached scores invalidate.
 */
export const FIT_WEIGHTS = {
  skills: 25,
  intent: 15,
  motivation: 15,
  cultureFit: 15,
  position: 10,
  dimension: 10,
  industry: 5,
  geography: 5,
} as const

export const FIT_ENGINE_VERSION = 'v1.2026-04-23'

/**
 * Compute composite from per-axis scores using FIT_WEIGHTS. Returns 0 if
 * dealBreakerHit regardless of other axes.
 */
export function computeComposite(
  axes: Pick<
    FitScore,
    'skills' | 'intent' | 'motivation' | 'cultureFit' | 'position' | 'dimension' | 'industry' | 'geography'
  >,
  dealBreakerHit: boolean
): number {
  if (dealBreakerHit) return 0
  const w = FIT_WEIGHTS
  const raw =
    axes.skills.score * w.skills +
    axes.intent.score * w.intent +
    axes.motivation.score * w.motivation +
    axes.cultureFit.score * w.cultureFit +
    axes.position.score * w.position +
    axes.dimension.score * w.dimension +
    axes.industry.score * w.industry +
    axes.geography.score * w.geography
  return Math.round(raw / 100)
}

// ─── Empty/default helpers ───────────────────────────────────────────────

export function emptyFitProfile(): FitProfile {
  return {
    goal: '',
    scope: '',
    wishes: [],
    dealBreakers: [],
    motivations: [],
    cultureFit: [],
    positionTypes: [],
    companySizes: [],
    industries: [],
    geographies: [],
    completion: 0,
  }
}

export function isFitProfileComplete(p: FitProfile | null | undefined): boolean {
  if (!p) return false
  // Minimum viable: goal + at least one motivation + at least one cultureFit
  return !!p.goal.trim() && p.motivations.length > 0 && p.cultureFit.length > 0
}
