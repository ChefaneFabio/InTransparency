import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const interviewPrepSchema = z.object({
  action: z.enum(['generate_questions', 'evaluate_answer']),
  role: z.string().optional(),
  company: z.string().optional(),
  questionIndex: z.number().optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
})

/**
 * POST /api/dashboard/student/interview-prep
 *
 * Two actions:
 * 1. generate_questions — creates role-specific interview questions based on student's real skills
 * 2. evaluate_answer — gives AI feedback on a practice answer
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!anthropic) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
    }

    const body = await req.json()
    const input = interviewPrepSchema.parse(body)

    // Fetch student's profile and skills for personalization
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true,
        degree: true,
        university: true,
        projects: {
          where: { isPublic: true },
          select: {
            title: true,
            technologies: true,
            skills: true,
            competencies: true,
            description: true,
          },
          take: 5,
          orderBy: { innovationScore: 'desc' },
        },
      },
    })

    const allSkills = new Set<string>()
    const projectTitles: string[] = []
    for (const p of student?.projects || []) {
      projectTitles.push(p.title)
      for (const s of [...(p.technologies || []), ...(p.skills || []), ...(p.competencies || [])]) {
        allSkills.add(s)
      }
    }
    const skillsList = Array.from(allSkills).slice(0, 15).join(', ')

    if (input.action === 'generate_questions') {
      const roleContext = input.role ? `for a "${input.role}" position` : 'for a junior position'
      const companyContext = input.company ? ` at ${input.company}` : ''

      const response = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `You are an interview coach helping a recent graduate prepare for a job interview.

Student profile:
- Degree: ${student?.degree || 'Not specified'}
- University: ${student?.university || 'Not specified'}
- Skills: ${skillsList || 'Not specified'}
- Projects: ${projectTitles.join(', ') || 'None listed'}

Generate 6 interview questions ${roleContext}${companyContext}. Mix these types:
1. Two behavioral questions (STAR method) related to their actual project experience
2. Two technical questions based on their demonstrated skills
3. One "tell me about yourself" style question
4. One situational/problem-solving question

For each question, include:
- The question itself
- The type (behavioral, technical, introductory, situational)
- A brief tip on what the interviewer is looking for (1 sentence)

Respond in valid JSON array format:
[{"question": "...", "type": "...", "tip": "..."}]

Only output the JSON array, nothing else.`
        }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
      }

      const questions = JSON.parse(jsonMatch[0])
      return NextResponse.json({ questions })
    }

    if (input.action === 'evaluate_answer') {
      if (!input.question || !input.answer) {
        return NextResponse.json({ error: 'Question and answer required' }, { status: 400 })
      }

      const response = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `You are an interview coach evaluating a candidate's practice answer.

Student profile:
- Skills: ${skillsList || 'Not specified'}
- Projects: ${projectTitles.join(', ') || 'None'}

Interview question: "${input.question}"
Student's answer: "${input.answer}"

Evaluate the answer and provide:
1. A score from 1-10
2. What was strong about the answer (2-3 points)
3. What could be improved (2-3 specific, actionable suggestions)
4. A brief model answer or key points they should have included

Respond in valid JSON:
{"score": 7, "strengths": ["..."], "improvements": ["..."], "modelAnswer": "..."}

Only output the JSON, nothing else.`
        }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Failed to evaluate answer' }, { status: 500 })
      }

      const evaluation = JSON.parse(jsonMatch[0])
      return NextResponse.json({ evaluation })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Interview prep error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
