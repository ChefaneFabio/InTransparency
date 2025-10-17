import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/integrations/lever/candidates - Export candidate to Lever
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { candidateId, opportunityId } = body

    if (!candidateId) {
      return NextResponse.json({ error: 'Missing candidate ID' }, { status: 400 })
    }

    // Get candidate (student) details
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      include: {
        projects: {
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // Get recruiter's Lever API key (would be stored in user settings)
    const recruiter = await prisma.user.findUnique({
      where: { id: userId }
    })

    // In production, this would come from encrypted user settings
    const leverApiKey = process.env.LEVER_API_KEY || recruiter?.stripeCustomerId // placeholder

    if (!leverApiKey) {
      return NextResponse.json({
        error: 'Lever integration not configured. Please add your API key in settings.'
      }, { status: 400 })
    }

    // Build resume-like text for Lever
    const resumeText = `
${candidate.firstName} ${candidate.lastName}
${candidate.email}
${candidate.university} - ${candidate.degree}
${candidate.graduationYear ? `Expected Graduation: ${candidate.graduationYear}` : ''}
${candidate.gpa ? `GPA: ${candidate.gpa}` : ''}

PROJECTS:
${candidate.projects.map(p => `
- ${p.title}
  ${p.description}
  Technologies: ${(p.technologies || []).join(', ')}
  ${p.githubUrl || ''}
`).join('\n')}

InTransparency Profile: https://intransparency.com/students/${candidate.username}/public
    `.trim()

    // Format candidate for Lever API
    const leverCandidate = {
      name: `${candidate.firstName} ${candidate.lastName}`,
      emails: [candidate.email],
      phones: [],
      links: [
        ...(candidate.portfolioUrl ? [`https://intransparency.com/students/${candidate.username}/public`] : []),
        ...candidate.projects.filter(p => p.githubUrl).map(p => p.githubUrl)
      ].filter(Boolean),
      tags: [
        'InTransparency',
        candidate.university || '',
        candidate.degree || '',
        ...candidate.projects.flatMap(p => p.technologies || [])
      ].filter(Boolean),
      sources: ['InTransparency'],
      origin: 'sourced',
      headline: `${candidate.degree} student at ${candidate.university}`,
      location: candidate.university,
      resumeText,
      customQuestions: [
        {
          question: 'University',
          answer: candidate.university
        },
        {
          question: 'Graduation Year',
          answer: candidate.graduationYear
        },
        {
          question: 'GPA',
          answer: candidate.gpa
        },
        {
          question: 'Number of Projects',
          answer: candidate.projects.length.toString()
        }
      ].filter(q => q.answer),
      ...(opportunityId && { opportunityId })
    }

    // Call Lever API
    const response = await fetch('https://api.lever.co/v1/candidates', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(leverApiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leverCandidate)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Lever API error: ${response.status} - ${error}`)
    }

    const result = await response.json()

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'lever_export',
        properties: {
          candidateId,
          leverCandidateId: result.data.id
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Candidate exported to Lever successfully',
      leverCandidateId: result.data.id,
      leverUrl: `https://hire.lever.co/candidates/${result.data.id}`
    })
  } catch (error: any) {
    console.error('Lever export error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export to Lever' },
      { status: 500 }
    )
  }
}
