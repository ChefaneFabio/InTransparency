import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'

// POST /api/dashboard/recruiter/interview-kit — Generate interview kit for a job
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { jobId, customPrompt } = await req.json()

    let jobContext = ''
    if (jobId) {
      const job = await prisma.job.findFirst({
        where: { id: jobId, recruiterId: session.user.id },
      })
      if (job) {
        jobContext = `
Job Title: ${job.title}
Type: ${job.jobType}
Location: ${job.location || 'Not specified'}
Description: ${job.description?.substring(0, 1000) || 'Not provided'}
Required Skills: ${job.requiredSkills?.join(', ') || 'Not specified'}
Preferred Skills: ${job.preferredSkills?.join(', ') || 'Not specified'}
Experience: ${job.experience || 'Entry level'}
Education: ${job.education || 'Not specified'}
Salary: ${job.salaryMin ? `€${job.salaryMin}` : ''}${job.salaryMax ? `-€${job.salaryMax}` : ''} ${job.salaryPeriod || ''}`
      }
    }

    const prompt = `Generate a comprehensive interview kit for this position.
${jobContext ? `\nJob Details:\n${jobContext}` : ''}
${customPrompt ? `\nAdditional context: ${customPrompt}` : ''}

Create a structured interview kit with:

## Screening Questions (Phone Screen, 5 questions)
Quick questions to filter candidates in a 15-minute call.

## Technical Assessment (5-7 questions)
Role-specific technical or domain questions with what good answers look like.

## Behavioral Questions (5 questions)
STAR-method behavioral questions relevant to the role and company culture.

## Culture Fit (3 questions)
Questions to assess values alignment without bias.

## Candidate Evaluation Rubric
A scoring framework (1-5) for: Technical Skills, Problem Solving, Communication, Culture Fit, Growth Potential.

## Red Flags to Watch For
Common warning signs specific to this role.

## Closing Questions for Candidate
Good questions to let the candidate evaluate the role.

Format everything in clean markdown. Be specific to the role — no generic filler.
Answer in the same language as the job description (Italian if Italian, English if English).`

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ kit: content })
  } catch (error) {
    console.error('Interview kit error:', error)
    return NextResponse.json({ error: 'Failed to generate interview kit' }, { status: 500 })
  }
}
