import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import {
  type FitProfile,
  MOTIVATIONS,
  CULTURE_TAGS,
  POSITION_TYPES,
  COMPANY_SIZES,
  emptyFitProfile,
  type Motivation,
  type CultureTag,
  type PositionType,
  type CompanySize,
} from '@/lib/fit-profile'

export const maxDuration = 30

/**
 * POST /api/student/fit-profile/import-from-discovery
 * Uses the student's existing SelfDiscoveryProfile narratives to pre-fill
 * FitProfile. One Claude call maps free-text (narratives, values) + already-
 * selected tags (motivations, dealbreakers) into the FitProfile vocabulary.
 *
 * Does NOT overwrite fields the student has already filled on fit-profile —
 * only fills empty ones. Returns the merged result for the UI to display.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const studentId = session.user.id

    const [discovery, user] = await Promise.all([
      prisma.selfDiscoveryProfile.findUnique({
        where: { studentId },
        select: {
          coreValues: true,
          strengths: true,
          energizingActivities: true,
          drainingActivities: true,
          motivations: true,
          dealbreakers: true,
          idealDayNarrative: true,
          fiveYearNarrative: true,
          stepsCompleted: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: studentId },
        select: { fitProfile: true },
      }),
    ])

    if (!discovery || discovery.stepsCompleted < 4) {
      return NextResponse.json(
        { error: 'Complete at least step 4 of Self-Discovery before importing.' },
        { status: 400 }
      )
    }

    const current = (user?.fitProfile as FitProfile | null) ?? emptyFitProfile()

    // Build the prompt — give Claude the raw discovery data + vocabularies
    const prompt = `You are converting a student's Self-Discovery answers into a structured fit profile for job matching. Map their free-text narratives and already-selected tags into the exact vocabularies below.

STUDENT'S SELF-DISCOVERY DATA:
Core values (selected): ${discovery.coreValues.join(', ') || '(none)'}
Strengths: ${discovery.strengths.join(', ') || '(none)'}
Energizing activities: ${discovery.energizingActivities.join(', ') || '(none)'}
Draining activities: ${discovery.drainingActivities.join(', ') || '(none)'}
Motivations (self-described): ${discovery.motivations.join(', ') || '(none)'}
Dealbreakers (self-described): ${discovery.dealbreakers.join(', ') || '(none)'}

IDEAL DAY NARRATIVE:
${discovery.idealDayNarrative || '(not written)'}

FIVE-YEAR NARRATIVE:
${discovery.fiveYearNarrative || '(not written)'}

Produce a FitProfile in this EXACT JSON shape:
{
  "goal": "<one sentence extracted from the 5-year narrative, max 160 chars, or '' if none>",
  "scope": "<one sentence about their ideal environment from the ideal-day narrative, max 200 chars, or ''>",
  "motivations": <array of tags from: ${MOTIVATIONS.join(', ')}>,
  "cultureFit": <array of tags from: ${CULTURE_TAGS.join(', ')}>,
  "positionTypes": <array of tags from: ${POSITION_TYPES.join(', ')}>,
  "companySizes": <array of tags from: ${COMPANY_SIZES.join(', ')}>,
  "industries": <array of free-text industry names mentioned (e.g. "Fintech", "Automotive") or []>,
  "geographies": <array of cities, countries, or "remote" mentioned, or []>,
  "wishes": <2-5 short phrases summarizing what they want (free text)>,
  "dealBreakers": <array of short phrases from their self-described dealbreakers, or []>
}

Rules:
- NEVER invent tags outside the vocabularies.
- Empty arrays are fine if the data doesn't support a signal.
- Return ONLY the JSON — no prose, no markdown, no code fence.`

    let extracted: Partial<FitProfile> = {}
    try {
      const response = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 800,
        system: 'Return only the JSON object. No prose, no markdown.',
        messages: [{ role: 'user', content: prompt }],
      })
      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        // Filter enum arrays through the vocabularies — ignore hallucinated tags
        const mSet = new Set<string>(MOTIVATIONS)
        const cSet = new Set<string>(CULTURE_TAGS)
        const pSet = new Set<string>(POSITION_TYPES)
        const sSet = new Set<string>(COMPANY_SIZES)
        extracted = {
          goal: typeof parsed.goal === 'string' ? parsed.goal.slice(0, 160) : '',
          scope: typeof parsed.scope === 'string' ? parsed.scope.slice(0, 200) : '',
          motivations: (parsed.motivations ?? []).filter((t: string): t is Motivation => mSet.has(t)),
          cultureFit: (parsed.cultureFit ?? []).filter((t: string): t is CultureTag => cSet.has(t)),
          positionTypes: (parsed.positionTypes ?? []).filter((t: string): t is PositionType => pSet.has(t)),
          companySizes: (parsed.companySizes ?? []).filter((t: string): t is CompanySize => sSet.has(t)),
          industries: Array.isArray(parsed.industries) ? parsed.industries.slice(0, 10) : [],
          geographies: Array.isArray(parsed.geographies) ? parsed.geographies.slice(0, 10) : [],
          wishes: Array.isArray(parsed.wishes) ? parsed.wishes.slice(0, 5) : [],
          dealBreakers: Array.isArray(parsed.dealBreakers) ? parsed.dealBreakers.slice(0, 8) : [],
        }
      }
    } catch (err) {
      console.error('import-from-discovery extraction failed:', err)
    }

    // Merge: extracted fills empties in current. Never overwrite non-empty fields.
    const merged: FitProfile = {
      ...current,
      goal: current.goal?.trim() || extracted.goal || '',
      scope: current.scope?.trim() || extracted.scope || '',
      motivations: current.motivations.length > 0 ? current.motivations : (extracted.motivations ?? []),
      cultureFit: current.cultureFit.length > 0 ? current.cultureFit : (extracted.cultureFit ?? []),
      positionTypes: current.positionTypes.length > 0 ? current.positionTypes : (extracted.positionTypes ?? []),
      companySizes: current.companySizes.length > 0 ? current.companySizes : (extracted.companySizes ?? []),
      industries: current.industries.length > 0 ? current.industries : (extracted.industries ?? []),
      geographies: current.geographies.length > 0 ? current.geographies : (extracted.geographies ?? []),
      wishes: current.wishes.length > 0 ? current.wishes : (extracted.wishes ?? []),
      dealBreakers: current.dealBreakers.length > 0 ? current.dealBreakers : (extracted.dealBreakers ?? []),
    }
    const axes = [
      merged.goal.trim().length > 0,
      merged.scope.trim().length > 0,
      merged.motivations.length > 0,
      merged.cultureFit.length > 0,
      merged.positionTypes.length > 0,
      merged.companySizes.length > 0,
      merged.industries.length > 0,
      merged.geographies.length > 0,
    ]
    merged.completion = axes.filter(Boolean).length / axes.length

    await prisma.user.update({
      where: { id: studentId },
      data: { fitProfile: merged as any, fitProfileUpdatedAt: new Date() },
    })

    return NextResponse.json({
      profile: merged,
      imported: Object.keys(extracted).filter(k => {
        const v = (extracted as any)[k]
        return Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.length > 0 : false
      }),
    })
  } catch (error) {
    console.error('POST /api/student/fit-profile/import-from-discovery error:', error)
    return NextResponse.json({ error: 'Failed to import' }, { status: 500 })
  }
}
