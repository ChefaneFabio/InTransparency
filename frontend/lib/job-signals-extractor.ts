/**
 * Extract structured fit signals from a job's prose fields.
 *
 * The recruiter's roleOffering tags are the explicit override. This extractor
 * reads title + description + responsibilities + requirements and produces
 * inferred signals for the same vocab — closing the gap when the recruiter
 * hasn't tagged everything. One Claude call per job, cached on
 * Job.extractedSignals.
 */

import { anthropic, AI_MODEL } from './openai-shared'
import prisma from './prisma'
import {
  CULTURE_TAGS,
  MOTIVATIONS,
  POSITION_TYPES,
  type CultureTag,
  type Motivation,
  type PositionType,
} from './fit-profile'

export const EXTRACTOR_VERSION = 'v1.2026-04-23'

export interface ExtractedJobSignals {
  version: string
  /** Inferred from title + experience + description. */
  positionLevel: PositionType | null
  cultureTags: CultureTag[]
  motivations: Motivation[]
  /** What a junior will learn in 6 months — inferred from responsibilities + growth prose. */
  growthFocus: string
  extractedAt: string
}

// ─── Deterministic position inference from title + experience ───────────

const TITLE_PATTERNS: Array<{ match: RegExp; level: PositionType }> = [
  { match: /\b(intern|stagista|stage|tirocinio)\b/i, level: 'intern' },
  { match: /\b(thesis|tesi|laureand[oi])\b/i, level: 'thesis-stage' },
  { match: /\b(founding|first hire)\b/i, level: 'founding-engineer' },
  { match: /\b(principal|staff|architect)\b/i, level: 'senior-ic' },
  { match: /\b(senior|sr\.?|lead)\s+(manager|director)\b/i, level: 'lead' },
  { match: /\b(senior|sr\.?)\b/i, level: 'senior-ic' },
  { match: /\b(lead|head of|manager|director)\b/i, level: 'lead' },
  { match: /\b(rotational|graduate program|neolaureat)\b/i, level: 'rotational-program' },
  { match: /\b(research|phd|postdoc|dottorato)\b/i, level: 'research' },
  { match: /\b(junior|jr\.?|neo|entry)\b/i, level: 'junior-ic' },
  { match: /\b(product manager|pm)\b/i, level: 'pm' },
  { match: /\b(designer|ux|ui)\b/i, level: 'designer' },
]

const EXPERIENCE_PATTERNS: Array<{ match: RegExp; level: PositionType }> = [
  { match: /\b(0|no|zero)\s*(-|to)?\s*(1|2)\s*year/i, level: 'junior-ic' },
  { match: /\b(1|2)\s*(-|to)\s*(3|4)\s*year/i, level: 'junior-ic' },
  { match: /\b(3|4|5)\s*(-|to)\s*(5|6|7)\s*year/i, level: 'mid-ic' },
  { match: /\b(5|6|7|8)\s*\+?\s*year/i, level: 'senior-ic' },
  { match: /\bentry\s*level\b/i, level: 'junior-ic' },
  { match: /\bmid\s*level\b/i, level: 'mid-ic' },
]

/**
 * Deterministic level inference from title + experience string. Title wins
 * over experience. Returns null if nothing matches — caller falls back to
 * Claude extraction or the recruiter's tag.
 */
export function inferPositionLevel(
  title: string | null | undefined,
  experience: string | null | undefined
): PositionType | null {
  const titleStr = (title || '').trim()
  if (titleStr) {
    for (const { match, level } of TITLE_PATTERNS) {
      if (match.test(titleStr)) return level
    }
  }
  const expStr = (experience || '').trim()
  if (expStr) {
    for (const { match, level } of EXPERIENCE_PATTERNS) {
      if (match.test(expStr)) return level
    }
  }
  return null
}

// ─── Claude extraction from JD prose ─────────────────────────────────────

interface JobTextFields {
  title: string | null
  description: string | null
  responsibilities?: string | null
  requirements?: string | null
  niceToHave?: string | null
  experience?: string | null
}

export async function extractSignalsFromJob(
  job: JobTextFields
): Promise<ExtractedJobSignals> {
  const title = job.title || ''
  const blob = [
    `TITLE: ${title}`,
    job.experience ? `EXPERIENCE: ${job.experience}` : null,
    job.description ? `DESCRIPTION:\n${job.description}` : null,
    job.responsibilities ? `RESPONSIBILITIES:\n${job.responsibilities}` : null,
    job.requirements ? `REQUIREMENTS:\n${job.requirements}` : null,
    job.niceToHave ? `NICE TO HAVE:\n${job.niceToHave}` : null,
  ]
    .filter(Boolean)
    .join('\n\n')

  // Fallback inference if we have no prose
  if (!blob.trim()) {
    return {
      version: EXTRACTOR_VERSION,
      positionLevel: inferPositionLevel(title, job.experience),
      cultureTags: [],
      motivations: [],
      growthFocus: '',
      extractedAt: new Date().toISOString(),
    }
  }

  const cultureList = CULTURE_TAGS.join(', ')
  const motivationList = MOTIVATIONS.join(', ')
  const positionList = POSITION_TYPES.join(', ')

  const prompt = `Read this job posting and extract structured fit signals.

${blob}

Return ONLY a JSON object in this exact shape:
{
  "positionLevel": one of [${positionList}] or null if unclear,
  "cultureTags": array (2-5) of tags from [${cultureList}] that clearly describe this team's working culture,
  "motivations": array (1-4) of tags from [${motivationList}] that drive this team (what the role explicitly celebrates),
  "growthFocus": one sentence describing what a junior will learn in the first 6 months (max 200 chars)
}

Rules:
- Never invent tags outside the provided vocabulary.
- Only include tags that are explicitly supported by the text; empty array is fine.
- Return ONLY the JSON, no prose, no code fence, no markdown.`

  try {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 500,
      system: 'Return only the JSON object. No prose, no markdown.',
      messages: [{ role: 'user', content: prompt }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('no json in response')
    const raw = JSON.parse(jsonMatch[0]) as {
      positionLevel?: string
      cultureTags?: string[]
      motivations?: string[]
      growthFocus?: string
    }

    // Sanitize against vocabularies — ignore hallucinated tags
    const cultureSet = new Set<string>(CULTURE_TAGS)
    const motivSet = new Set<string>(MOTIVATIONS)
    const posSet = new Set<string>(POSITION_TYPES)

    const positionFromClaude =
      raw.positionLevel && posSet.has(raw.positionLevel) ? (raw.positionLevel as PositionType) : null

    // If Claude didn't pick one, fall back to deterministic title/experience parser
    const positionLevel =
      positionFromClaude || inferPositionLevel(title, job.experience)

    return {
      version: EXTRACTOR_VERSION,
      positionLevel,
      cultureTags: (raw.cultureTags ?? [])
        .filter((t): t is CultureTag => cultureSet.has(t))
        .slice(0, 6),
      motivations: (raw.motivations ?? [])
        .filter((m): m is Motivation => motivSet.has(m))
        .slice(0, 4),
      growthFocus: (raw.growthFocus ?? '').slice(0, 200),
      extractedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('extractSignalsFromJob failed:', err)
    // Deterministic fallback so we never block the match pipeline
    return {
      version: EXTRACTOR_VERSION,
      positionLevel: inferPositionLevel(title, job.experience),
      cultureTags: [],
      motivations: [],
      growthFocus: '',
      extractedAt: new Date().toISOString(),
    }
  }
}

/**
 * Read-through cache for job signals. Reads Job.extractedSignals; if the
 * cached version doesn't match EXTRACTOR_VERSION (or is absent), calls Claude,
 * writes back, returns fresh. Use this everywhere the engine needs signals.
 */
export async function ensureJobSignals(jobId: string): Promise<ExtractedJobSignals | null> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      description: true,
      responsibilities: true,
      requirements: true,
      niceToHave: true,
      experience: true,
      extractedSignals: true,
    },
  })
  if (!job) return null

  const cached = job.extractedSignals as ExtractedJobSignals | null
  if (cached && cached.version === EXTRACTOR_VERSION) return cached

  const fresh = await extractSignalsFromJob(job)
  // Fire-and-forget cache write (don't block the caller)
  prisma.job
    .update({
      where: { id: jobId },
      data: { extractedSignals: fresh as any },
    })
    .catch(err => console.error('ensureJobSignals cache write failed:', err))

  return fresh
}
