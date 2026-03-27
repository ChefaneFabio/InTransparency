import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const decodeJobSchema = z.object({
  jobAdText: z.string().min(50, 'Job ad must be at least 50 characters').max(5000),
})

/**
 * POST /api/dashboard/student/decode-job
 *
 * Analyzes a pasted job ad and returns:
 * - Plain-language explanation of requirements
 * - Hard vs nice-to-have requirements
 * - Estimated salary range (Italy)
 * - Student's match % based on their skills
 * - Red flags in the listing
 * - Tips for applying
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
    const { jobAdText } = decodeJobSchema.parse(body)

    // Fetch student's skills for match calculation
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        degree: true,
        university: true,
        projects: {
          where: { isPublic: true },
          select: {
            technologies: true,
            skills: true,
            competencies: true,
          },
          take: 10,
        },
      },
    })

    const allSkills = new Set<string>()
    for (const p of student?.projects || []) {
      for (const s of [...(p.technologies || []), ...(p.skills || []), ...(p.competencies || [])]) {
        allSkills.add(s)
      }
    }
    const skillsList = Array.from(allSkills).join(', ')

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a career advisor helping a young graduate in Italy understand a job posting.

Student profile:
- Degree: ${student?.degree || 'Not specified'}
- University: ${student?.university || 'Not specified'}
- Skills from projects: ${skillsList || 'None listed'}

Job ad to analyze:
"""
${jobAdText}
"""

Analyze this job posting and respond in valid JSON with this exact structure:
{
  "roleSummary": "One-sentence plain-language description of what this job actually involves",
  "requirements": {
    "mustHave": ["requirement 1", "requirement 2"],
    "niceToHave": ["requirement 1", "requirement 2"],
    "explanation": "Brief note explaining which listed requirements are actually flexible for junior candidates"
  },
  "jargonDecoded": [
    {"term": "agile environment", "meaning": "They use short work cycles (sprints) and daily team meetings"},
    {"term": "competitive salary", "meaning": "They don't want to state the salary upfront — always ask"}
  ],
  "salaryEstimate": {
    "range": "€22,000 - €28,000",
    "note": "Estimated RAL for this role in Italy based on seniority level and sector"
  },
  "matchAnalysis": {
    "matchPercent": 65,
    "matchingSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1", "skill2"],
    "verdict": "Brief assessment of whether the student should apply"
  },
  "redFlags": ["Any concerning patterns in the listing"],
  "applicationTips": ["Specific tip 1", "Specific tip 2", "Specific tip 3"]
}

Be honest and practical. If the role is clearly too senior, say so. If "years of experience" requirements are unrealistic, explain that many companies accept projects and education as equivalent.

Only output the JSON, nothing else.`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to analyze job ad' }, { status: 500 })
    }

    const analysis = JSON.parse(jsonMatch[0])
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Decode job error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to analyze job posting' }, { status: 500 })
  }
}
