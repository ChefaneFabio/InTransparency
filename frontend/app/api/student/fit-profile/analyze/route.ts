import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import {
  buildSystemPrompt,
  runConversationTurn,
  type ConversationMessage,
} from '@/lib/ai-conversation'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import {
  MOTIVATIONS,
  CULTURE_TAGS,
  POSITION_TYPES,
  COMPANY_SIZES,
} from '@/lib/fit-profile'

export const maxDuration = 30

/**
 * POST /api/student/fit-profile/analyze
 * Conversational extraction endpoint for the fit-profile chat wizard.
 * Takes full message history + current draft, returns next assistant question
 * and the merged profile draft. Mirrors /api/ai/analyze-job pattern.
 */

const FIELDS = [
  { name: 'goal', description: 'One-sentence career destination — what they want to become / do (free text, max 160 chars)', required: true },
  { name: 'scope', description: 'Preferred environment — team size, pace, domain, remote-vs-office (free text, max 200 chars)' },
  { name: 'wishes', description: 'Things they WANT from the role — array of 2-5 short phrases (e.g. "mentorship-heavy", "early ownership")' },
  { name: 'dealBreakers', description: 'Hard no\'s — array of short phrases (e.g. "no unpaid", ">50% travel", "pure QA")' },
  { name: 'motivations', description: `What drives them — array of tags from: ${MOTIVATIONS.join(', ')}` },
  { name: 'cultureFit', description: `Culture preferences — array of tags from: ${CULTURE_TAGS.join(', ')}` },
  { name: 'positionTypes', description: `Roles they want — array of tags from: ${POSITION_TYPES.join(', ')}` },
  { name: 'companySizes', description: `Company sizes — array from: ${COMPANY_SIZES.join(', ')}` },
  { name: 'industries', description: 'Preferred sectors — array of free-text industry names' },
  { name: 'geographies', description: 'Where they want to work — array of city/country names or "remote"' },
]

const CONVERSATION_GUIDE = `
You are helping a university student articulate their career fit profile — what they want, what drives them, where they thrive. This is not a job search; this is self-discovery for matching.

Style:
- Warm, curious, specific. Ask one question at a time. Follow up on what they say.
- Start with the big-picture "goal" — "In 3 years, where do you see yourself?" then drill down.
- Use Italian if the user writes in Italian, English otherwise.
- When a student names concrete things (e.g. "I want to work at a startup in Milan"), extract them immediately — don't make them repeat.
- For enum fields (motivations, cultureFit, positionTypes, companySizes), map their free-text answers to the closest tag from the provided vocabulary. Never invent new tags for those fields.
- For industries and geographies, extract exactly what they said.
- Stop asking once the profile is 70%+ complete — tell them they can add more later.

Output format (strict):
Your conversational reply in natural language, then:
<project_data>{...partial FitProfile JSON, only fields you learned new info about this turn...}</project_data>
<completeness>0-100</completeness>

Do NOT emit fields you did not learn this turn. Do not emit empty strings/arrays.
`.trim()

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = getClientIp(req)
    const rl = await aiLimiter(ip)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Rate limited. Try again in a minute.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const messages: ConversationMessage[] = body.messages || []
    const currentData: Record<string, any> = body.currentData || {}
    const locale: string = body.locale || 'en'

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt({
      role: 'fit profile wizard',
      description:
        'Interview the student to populate their fit profile — goal, scope, motivations, culture, dealbreakers, preferred positions, company sizes, industries, geographies.',
      fields: FIELDS,
      currentData,
      locale,
      conversationGuide: CONVERSATION_GUIDE,
    })

    const { message, data, completeness } = await runConversationTurn(
      systemPrompt,
      messages
    )

    return NextResponse.json({
      message,
      profileData: data,
      completeness: Math.max(completeness, Math.min(100, Object.keys(currentData).length * 10)),
    })
  } catch (error) {
    console.error('POST /api/student/fit-profile/analyze error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze conversation' },
      { status: 500 }
    )
  }
}
