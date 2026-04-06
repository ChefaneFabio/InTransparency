import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import prisma from '@/lib/prisma'

export const maxDuration = 25

/**
 * POST /api/ai/stage-coach
 * AI coach for internship/stage preparation and post-stage reflection.
 *
 * Modes:
 * - "prepare": helps student prepare for an upcoming stage
 * - "reflect": after the stage, extracts learnings and creates a project
 * - "guide": general stage/internship guidance
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = getClientIp(request)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { messages = [], mode = 'guide', locale = 'en' } = await request.json()
    if (messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    // Get student context
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true, university: true, degree: true, country: true,
        graduationYear: true, skills: true,
        projects: {
          select: { title: true, skills: true, discipline: true },
          take: 5, orderBy: { createdAt: 'desc' },
        },
      },
    })

    const lang = locale === 'it' ? 'Italian' : 'English'
    const allSkills = user?.projects.flatMap(p => p.skills) || []
    const uniqueSkills = Array.from(new Set(allSkills.map(s => s.toLowerCase())))

    const modePrompts: Record<string, string> = {
      prepare: `You are an internship preparation coach for InTransparency.

A student is about to start an internship/stage. Help them:
- Understand what to expect in the first days
- Prepare questions to ask their supervisor
- Identify skills they should brush up on
- Set learning goals for the internship
- Understand workplace culture and professional behavior
- Prepare a brief self-introduction

STUDENT CONTEXT:
- Name: ${user?.firstName || 'Student'}
- University: ${user?.university || 'Not specified'}
- Degree: ${user?.degree || 'Not specified'}
- Known skills: ${uniqueSkills.join(', ') || 'None listed'}
- Projects: ${user?.projects.map(p => p.title).join(', ') || 'None'}

Be practical and specific. Give actionable advice, not generic motivation.
Respond in ${lang}.`,

      reflect: `You are a post-internship reflection coach for InTransparency.

A student just finished an internship/stage. Your goal is to help them:
1. Extract what they learned (skills, tools, competencies)
2. Document their experience as a project for their portfolio
3. Identify what they did well and what they'd improve
4. Connect the experience to their career goals

Guide them through a structured reflection. Ask about:
- What did they work on? What was their role?
- What tools/technologies/methods did they use?
- What was the biggest challenge and how did they handle it?
- What feedback did they receive?
- Would they recommend this company to other students?

At the end, suggest creating a project on InTransparency with the extracted data.

When you have enough information, include a JSON block:
<project_data>
{
  "title": "...",
  "description": "...",
  "discipline": "...",
  "skills": [...],
  "tools": [...],
  "role": "...",
  "duration": "...",
  "client": "...",
  "outcome": "..."
}
</project_data>

STUDENT CONTEXT:
- Name: ${user?.firstName || 'Student'}
- University: ${user?.university || 'Not specified'}
- Degree: ${user?.degree || 'Not specified'}

Respond in ${lang}. Be warm and encouraging — they're reflecting on a meaningful experience.`,

      guide: `You are an internship guidance counselor for InTransparency.

Help students with:
- Finding the right internship for their skills and interests
- Understanding different types of stages (curriculare, extracurriculare, Erasmus+)
- CV and cover letter tips specific to internship applications
- Understanding Italian labor law for internships (rimborso spese, durata massima, etc.)
- Preparing for internship interviews
- Understanding what companies look for in interns

STUDENT CONTEXT:
- Name: ${user?.firstName || 'Student'}
- University: ${user?.university || 'Not specified'}
- Degree: ${user?.degree || 'Not specified'}
- Country: ${user?.country || 'IT'}
- Skills: ${uniqueSkills.join(', ') || 'None listed'}

Be specific to their discipline — don't default to tech examples.
Respond in ${lang}. Be professional and helpful.`,
    }

    const systemPrompt = modePrompts[mode] || modePrompts.guide

    const claudeMessages = messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: claudeMessages,
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract project data if present (reflect mode)
    let projectData = null
    const dataMatch = reply.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
    if (dataMatch) {
      try { projectData = JSON.parse(dataMatch[1]) } catch { /* ignore */ }
    }
    const message = reply.replace(/<project_data>[\s\S]*?<\/project_data>/, '').trim()

    return NextResponse.json({ message, projectData })
  } catch (error) {
    console.error('Stage coach error:', error)
    return NextResponse.json({ error: 'Failed to get advice' }, { status: 500 })
  }
}
