/**
 * Fit-score engine — compute a FitScore for a (student, job) pair.
 *
 * Deterministic axes (tag overlap, enum match, dealbreaker check) run
 * instantly in TypeScript. The two semantic axes (intent: goal ↔ growthFocus,
 * culture: scope ↔ environment) call Claude once per pair.
 *
 * Call shape:
 *   const score = await computeFitScore({ profile, offering, skillsScore })
 *
 * skillsScore is passed in (already computed by the existing applicants-evidence
 * endpoint) so we don't duplicate that logic here.
 */

import { anthropic, AI_MODEL } from './openai-shared'
import {
  type FitProfile,
  type RoleOffering,
  type FitScore,
  type AxisScore,
  computeComposite,
  FIT_ENGINE_VERSION,
} from './fit-profile'
import type { ExtractedJobSignals } from './job-signals-extractor'

export interface ComputeFitScoreInput {
  profile: FitProfile | null
  offering: RoleOffering | null
  /**
   * Signals extracted from the JD prose (title, description, responsibilities).
   * Fills in for axes where the recruiter hasn't tagged roleOffering
   * explicitly. Tags in `offering` win when present; `extracted` fills gaps.
   */
  extracted?: ExtractedJobSignals | null
  /**
   * Skills axis score (0-100). Computed upstream by the skills pipeline so we
   * don't re-implement required-coverage + verified-density here.
   */
  skillsScore: number
  skillsReason?: string
  /**
   * Optional job-level context for industry / geography matching.
   */
  jobIndustry?: string | null
  jobLocation?: string | null
  jobIsRemote?: boolean
  /**
   * Optional company-size label for dimension matching (e.g. from Job.companySize).
   */
  companySize?: string | null
  /**
   * Job title — used for deterministic position inference when neither the
   * recruiter's tag nor the extracted signal is available.
   */
  jobTitle?: string | null
  jobExperience?: string | null
}

/**
 * Merge explicit roleOffering with extracted signals. Role offering wins
 * whenever a field is populated; extracted signals fill empty fields.
 * This is the "real data first, tags as supplement" reconciliation point.
 */
function mergeOffering(
  offering: RoleOffering | null,
  extracted: ExtractedJobSignals | null | undefined
): RoleOffering | null {
  if (!offering && !extracted) return null
  if (!offering) {
    return {
      careerTrack: 'ic-path',
      positionLevel: (extracted?.positionLevel as any) || 'junior-ic',
      environment: [],
      growthFocus: extracted?.growthFocus || '',
      motivations: (extracted?.motivations as any) || [],
      cultureTags: (extracted?.cultureTags as any) || [],
      nonNegotiables: [],
      perks: [],
    }
  }
  if (!extracted) return offering
  return {
    ...offering,
    // positionLevel: keep recruiter's tag if set
    positionLevel: offering.positionLevel || (extracted.positionLevel as any) || 'junior-ic',
    // growthFocus: prefer recruiter prose, fall back to extracted
    growthFocus: offering.growthFocus?.trim() || extracted.growthFocus || '',
    // cultureTags: union — recruiter explicit + JD-extracted
    cultureTags: Array.from(
      new Set([...(offering.cultureTags || []), ...(extracted.cultureTags || [])])
    ),
    // motivations: union, recruiter-first
    motivations: Array.from(
      new Set([...(offering.motivations || []), ...(extracted.motivations || [])])
    ),
  }
}

// ─── Deterministic axes ──────────────────────────────────────────────────

/**
 * Tag overlap scored as Jaccard * 100 (intersection / union, both as percent
 * of student preferences). Falls back to a neutral 50 if either side is empty.
 */
function tagOverlap(student: string[], role: string[]): number {
  if (student.length === 0 || role.length === 0) return 50
  const s = new Set(student.map(t => t.toLowerCase()))
  const r = new Set(role.map(t => t.toLowerCase()))
  let intersect = 0
  for (const x of Array.from(s)) if (r.has(x)) intersect++
  // Coverage of student's preferences — what fraction of what they said they
  // want does this role offer? Better signal for satisfaction than Jaccard.
  return Math.round((intersect / s.size) * 100)
}

/**
 * Company-stage → preferred size bucket mapping.
 */
const STAGE_TO_SIZE: Record<string, string> = {
  seed: 'startup-under-20',
  'series-a': 'scaleup-20-200',
  growth: 'midmarket-200-2000',
  established: 'enterprise-2000-plus',
  public: 'enterprise-2000-plus',
}

function matchDimension(profile: FitProfile, offering: RoleOffering, companySize?: string | null): AxisScore {
  if (profile.companySizes.length === 0) {
    return { score: 50, reason: 'No size preference stated — neutral.' }
  }
  // Derive role's bucket from either companyStage (preferred) or companySize label
  let roleBucket: string | null = null
  if (offering.companyStage && STAGE_TO_SIZE[offering.companyStage]) {
    roleBucket = STAGE_TO_SIZE[offering.companyStage]
  } else if (companySize) {
    // companySize from Job model is "1-10", "11-50", "51-200", "201-500", "500+"
    const n = parseInt(companySize)
    if (!isNaN(n)) {
      if (n < 20) roleBucket = 'startup-under-20'
      else if (n < 200) roleBucket = 'scaleup-20-200'
      else if (n < 2000) roleBucket = 'midmarket-200-2000'
      else roleBucket = 'enterprise-2000-plus'
    }
  }
  if (!roleBucket) {
    return { score: 50, reason: 'Role did not specify company stage.' }
  }
  const match = profile.companySizes.includes(roleBucket as any)
  return {
    score: match ? 100 : 0,
    reason: match
      ? `Student prefers ${roleBucket.replace(/-/g, ' ')}; role matches.`
      : `Student wants ${profile.companySizes.join(', ')}; role is ${roleBucket.replace(/-/g, ' ')}.`,
  }
}

function matchPosition(profile: FitProfile, offering: RoleOffering): AxisScore {
  if (profile.positionTypes.length === 0) {
    return { score: 50, reason: 'No position preference stated.' }
  }
  const match = profile.positionTypes.includes(offering.positionLevel as any)
  return {
    score: match ? 100 : 30,
    reason: match
      ? `Role is ${offering.positionLevel.replace(/-/g, ' ')} — matches preference.`
      : `Role is ${offering.positionLevel.replace(/-/g, ' ')}; student prefers ${profile.positionTypes.join(', ')}.`,
  }
}

function matchIndustry(profile: FitProfile, offering: RoleOffering, jobIndustry?: string | null): AxisScore {
  const industryName = (offering.industry || jobIndustry || '').toLowerCase().trim()
  if (profile.industries.length === 0) {
    return { score: 50, reason: 'No industry preference stated.' }
  }
  if (!industryName) {
    return { score: 50, reason: 'Role did not specify industry.' }
  }
  const hit = profile.industries.some(i => {
    const a = i.toLowerCase().trim()
    return a === industryName || industryName.includes(a) || a.includes(industryName)
  })
  return {
    score: hit ? 100 : 20,
    reason: hit
      ? `Industry "${industryName}" matches student's preferences.`
      : `Industry "${industryName}" not in student's stated preferences (${profile.industries.join(', ')}).`,
  }
}

function matchGeography(
  profile: FitProfile,
  jobLocation?: string | null,
  jobIsRemote?: boolean
): AxisScore {
  if (profile.geographies.length === 0) {
    return { score: 50, reason: 'No geography preference stated.' }
  }
  const wantsRemote = profile.geographies.some(g => g.toLowerCase() === 'remote')
  if (wantsRemote && jobIsRemote) {
    return { score: 100, reason: 'Both student and role are remote-first.' }
  }
  if (!jobLocation) {
    return { score: 50, reason: 'Role location unspecified.' }
  }
  const loc = jobLocation.toLowerCase()
  const hit = profile.geographies.some(g => {
    const a = g.toLowerCase().trim()
    return a !== 'remote' && (loc.includes(a) || a.includes(loc))
  })
  return {
    score: hit ? 100 : 25,
    reason: hit
      ? `Role in ${jobLocation} matches student's preferred geographies.`
      : `Role in ${jobLocation}; student prefers ${profile.geographies.join(', ')}.`,
  }
}

function matchMotivation(profile: FitProfile, offering: RoleOffering): AxisScore {
  const score = tagOverlap(profile.motivations, offering.motivations)
  return {
    score,
    reason:
      score >= 75
        ? `Strong overlap on motivations (${profile.motivations.filter(m => offering.motivations.includes(m)).join(', ')}).`
        : score >= 40
        ? 'Partial overlap on motivations.'
        : 'Motivations differ — student drives are not what this team celebrates.',
  }
}

function matchCulture(profile: FitProfile, offering: RoleOffering): AxisScore {
  // Role side: cultureTags + environment, both CultureTag[]
  const roleTags = Array.from(new Set([...offering.cultureTags, ...offering.environment]))
  const score = tagOverlap(profile.cultureFit, roleTags)
  return {
    score,
    reason:
      score >= 75
        ? 'Culture fit is strong.'
        : score >= 40
        ? 'Partial culture fit — some signals align, others differ.'
        : 'Culture signals diverge significantly.',
  }
}

// ─── Dealbreakers (hard) ─────────────────────────────────────────────────

/**
 * Any of the student's dealBreakers that appears (by substring match) in the
 * role's growthFocus, non-negotiables, cultureTags, or environment fires a
 * hard zero composite. Returns the triggering phrase if any.
 */
function dealBreakerHit(
  profile: FitProfile,
  offering: RoleOffering,
  jobIsRemote?: boolean,
  jobLocation?: string | null
): { hit: boolean; reason?: string } {
  if (profile.dealBreakers.length === 0) return { hit: false }

  const haystack = [
    offering.growthFocus,
    ...offering.nonNegotiables,
    ...offering.cultureTags,
    ...offering.environment,
    jobLocation ?? '',
  ]
    .join(' | ')
    .toLowerCase()

  for (const db of profile.dealBreakers) {
    const phrase = db.toLowerCase().trim()
    if (!phrase) continue
    // "remote-only" / "no remote" dealbreaker — check against role's remote flag
    if ((phrase.includes('no remote') || phrase.includes('remote-only')) && jobIsRemote === false) {
      return { hit: true, reason: `Student dealbreaker "${db}" vs on-site role` }
    }
    if (haystack.includes(phrase)) {
      return { hit: true, reason: `Student dealbreaker "${db}" present in role` }
    }
    // Direct match in non-negotiables is also a fail
    if (offering.nonNegotiables.some(n => n.toLowerCase().includes(phrase))) {
      return { hit: true, reason: `Student dealbreaker "${db}" is a role non-negotiable` }
    }
  }
  return { hit: false }
}

// ─── Semantic axis (intent = goal ↔ growthFocus) ─────────────────────────

async function scoreIntent(
  profile: FitProfile,
  offering: RoleOffering
): Promise<AxisScore> {
  const goal = profile.goal.trim()
  const scope = profile.scope.trim()
  const growthFocus = offering.growthFocus.trim()

  // If either side is empty, don't waste a Claude call.
  if (!goal && !scope) {
    return { score: 50, reason: 'Student goal not stated — neutral.' }
  }
  if (!growthFocus) {
    return { score: 50, reason: 'Role growth focus not stated — neutral.' }
  }

  try {
    const prompt = `You are scoring how well a role's growth opportunity fits a student's career goal. Return a single integer 0-100 and one short sentence explaining why, in this JSON shape only:

{"score": <int 0-100>, "reason": "<one sentence, max 140 chars>"}

STUDENT GOAL: ${goal || '(unstated)'}
STUDENT SCOPE PREFERENCE: ${scope || '(unstated)'}

ROLE GROWTH FOCUS: ${growthFocus}
ROLE POSITION LEVEL: ${offering.positionLevel}
ROLE CAREER TRACK: ${offering.careerTrack}

Score guidance:
 90-100: role directly advances student's stated goal.
 70-89: strong alignment, role is a plausible stepping stone.
 50-69: partial — teaches relevant skills but trajectory differs.
 25-49: weak alignment, different direction.
 0-24: mismatch or counterproductive for the student's goal.

Return ONLY the JSON — no prose, no code fence.`

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 200,
      system: 'Return only the JSON object. No prose, no code fence, no markdown.',
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    // Tolerant parse: find the first {...} in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('no json')
    const parsed = JSON.parse(jsonMatch[0]) as { score?: number; reason?: string }
    const score = Math.max(0, Math.min(100, Math.round(parsed.score ?? 50)))
    return {
      score,
      reason: parsed.reason?.slice(0, 200) ?? 'Goal alignment scored semantically.',
    }
  } catch {
    return { score: 50, reason: 'Intent scoring unavailable — neutral.' }
  }
}

// ─── Fast, no-Claude variant for list views ─────────────────────────────

/**
 * Like computeFitScore but skips the Claude intent call. Used for list/grid
 * views where we can't afford 1 LLM call per tile. Intent is neutralized to
 * 50; every other axis runs as usual.
 *
 * Tradeoff: loses the goal-alignment signal. Students clicking into a role
 * see the full score (with intent) computed on-demand.
 */
export function computeFastFitScore(input: ComputeFitScoreInput): FitScore {
  const {
    profile,
    skillsScore,
    skillsReason,
    jobIndustry,
    jobLocation,
    jobIsRemote,
    companySize,
  } = input

  const offering = mergeOffering(input.offering, input.extracted ?? null)

  const skills: AxisScore = {
    score: Math.max(0, Math.min(100, Math.round(skillsScore))),
    reason: skillsReason || 'Skills coverage from required/preferred match.',
  }

  if (!profile || !offering) {
    const neutral = (reason: string): AxisScore => ({ score: 50, reason })
    return {
      composite: Math.round(skills.score * 0.25 + 50 * 0.75),
      skills,
      intent: neutral('Fast score skips Claude intent call.'),
      motivation: neutral('Profile/offering incomplete.'),
      cultureFit: neutral('Profile/offering incomplete.'),
      position: neutral('Profile/offering incomplete.'),
      dimension: neutral('Profile/offering incomplete.'),
      industry: neutral('Profile/offering incomplete.'),
      geography: neutral('Profile/offering incomplete.'),
      dealBreakerHit: false,
      engineVersion: FIT_ENGINE_VERSION,
    }
  }

  const db = dealBreakerHit(profile, offering, jobIsRemote, jobLocation)

  // Intent neutralized — we don't call Claude for list views.
  const intent: AxisScore = {
    score: 50,
    reason: 'Quick estimate — click in for full goal-alignment score.',
  }
  const motivation = matchMotivation(profile, offering)
  const cultureFit = matchCulture(profile, offering)
  const position = matchPosition(profile, offering)
  const dimension = matchDimension(profile, offering, companySize)
  const industry = matchIndustry(profile, offering, jobIndustry)
  const geography = matchGeography(profile, jobLocation, jobIsRemote)

  const composite = computeComposite(
    { skills, intent, motivation, cultureFit, position, dimension, industry, geography },
    db.hit
  )

  return {
    composite,
    skills,
    intent,
    motivation,
    cultureFit,
    position,
    dimension,
    industry,
    geography,
    dealBreakerHit: db.hit,
    dealBreakerReason: db.reason,
    engineVersion: FIT_ENGINE_VERSION,
  }
}

// ─── Public entry point ──────────────────────────────────────────────────

/**
 * Compute a FitScore for a (student, job) pair. If the student hasn't filled
 * fitProfile, returns a neutral FitScore with skills as the only loaded axis.
 *
 * Real-data reconciliation: the recruiter's `offering` tags are merged with
 * `extracted` signals from the JD prose. Recruiter wins when tagged; extractor
 * fills gaps. This means a role is match-ready even if the recruiter only
 * wrote a description and never touched the role-offering editor.
 */
export async function computeFitScore(input: ComputeFitScoreInput): Promise<FitScore> {
  const {
    profile,
    skillsScore,
    skillsReason,
    jobIndustry,
    jobLocation,
    jobIsRemote,
    companySize,
  } = input

  // Merge explicit tags with JD-extracted signals. After this point, the
  // engine only reads from `offering` (possibly synthesized from extracted).
  const offering = mergeOffering(input.offering, input.extracted ?? null)

  const skills: AxisScore = {
    score: Math.max(0, Math.min(100, Math.round(skillsScore))),
    reason: skillsReason || 'Skills coverage from required/preferred match.',
  }

  // Profile or offering missing → neutral-ish fallback, no dealbreakers
  if (!profile || !offering) {
    const neutral = (reason: string): AxisScore => ({ score: 50, reason })
    return {
      composite: Math.round(skills.score * 0.25 + 50 * 0.75), // weighted so missing ≠ zero
      skills,
      intent: neutral('Profile/offering incomplete.'),
      motivation: neutral('Profile/offering incomplete.'),
      cultureFit: neutral('Profile/offering incomplete.'),
      position: neutral('Profile/offering incomplete.'),
      dimension: neutral('Profile/offering incomplete.'),
      industry: neutral('Profile/offering incomplete.'),
      geography: neutral('Profile/offering incomplete.'),
      dealBreakerHit: false,
      engineVersion: FIT_ENGINE_VERSION,
    }
  }

  // Run deterministic axes + semantic intent in parallel
  const db = dealBreakerHit(profile, offering, jobIsRemote, jobLocation)
  const [intent, motivation, cultureFit, position, dimension, industry, geography] =
    await Promise.all([
      scoreIntent(profile, offering),
      Promise.resolve(matchMotivation(profile, offering)),
      Promise.resolve(matchCulture(profile, offering)),
      Promise.resolve(matchPosition(profile, offering)),
      Promise.resolve(matchDimension(profile, offering, companySize)),
      Promise.resolve(matchIndustry(profile, offering, jobIndustry)),
      Promise.resolve(matchGeography(profile, jobLocation, jobIsRemote)),
    ])

  const composite = computeComposite(
    { skills, intent, motivation, cultureFit, position, dimension, industry, geography },
    db.hit
  )

  return {
    composite,
    skills,
    intent,
    motivation,
    cultureFit,
    position,
    dimension,
    industry,
    geography,
    dealBreakerHit: db.hit,
    dealBreakerReason: db.reason,
    engineVersion: FIT_ENGINE_VERSION,
  }
}
