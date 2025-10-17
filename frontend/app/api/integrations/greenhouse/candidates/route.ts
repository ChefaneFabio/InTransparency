import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/integrations/greenhouse/candidates - Export candidate to Greenhouse
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { candidateId, jobId } = body

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

    // Get recruiter's Greenhouse API key (would be stored in user settings)
    const recruiter = await prisma.user.findUnique({
      where: { id: userId }
    })

    // In production, this would come from encrypted user settings
    const greenhouseApiKey = process.env.GREENHOUSE_API_KEY || recruiter?.stripeCustomerId // placeholder

    if (!greenhouseApiKey) {
      return NextResponse.json({
        error: 'Greenhouse integration not configured. Please add your API key in settings.'
      }, { status: 400 })
    }

    // Format candidate for Greenhouse API
    const greenhouseCandidate = {
      first_name: candidate.firstName,
      last_name: candidate.lastName,
      company: candidate.university,
      title: candidate.degree,
      phone_numbers: [],
      addresses: [],
      email_addresses: [
        {
          value: candidate.email,
          type: 'personal'
        }
      ],
      website_addresses: [
        ...(candidate.portfolioUrl ? [{
          value: `https://intransparency.com/students/${candidate.username}/public`,
          type: 'portfolio'
        }] : []),
        ...candidate.projects
          .filter(p => p.githubUrl)
          .map(p => ({
            value: p.githubUrl,
            type: 'other'
          }))
      ],
      social_media_addresses: [],
      tags: [
        'InTransparency',
        candidate.university || '',
        candidate.degree || '',
        ...candidate.projects.flatMap(p => p.technologies || [])
      ].filter(Boolean),
      custom_fields: [
        {
          name: 'University',
          value: candidate.university
        },
        {
          name: 'Degree',
          value: candidate.degree
        },
        {
          name: 'Graduation Year',
          value: candidate.graduationYear
        },
        {
          name: 'GPA',
          value: candidate.gpa
        },
        {
          name: 'Project Count',
          value: candidate.projects.length.toString()
        },
        {
          name: 'InTransparency Profile',
          value: `https://intransparency.com/students/${candidate.username}/public`
        }
      ].filter(f => f.value),
      applications: jobId ? [
        {
          job_id: jobId
        }
      ] : undefined
    }

    // Call Greenhouse API
    const response = await fetch('https://harvest.greenhouse.io/v1/candidates', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(greenhouseApiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
        'On-Behalf-Of': userId
      },
      body: JSON.stringify(greenhouseCandidate)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Greenhouse API error: ${response.status} - ${error}`)
    }

    const result = await response.json()

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'greenhouse_export',
        properties: {
          candidateId,
          greenhouseCandidateId: result.id
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Candidate exported to Greenhouse successfully',
      greenhouseCandidateId: result.id,
      greenhouseUrl: `https://app.greenhouse.io/people/${result.id}`
    })
  } catch (error: any) {
    console.error('Greenhouse export error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export to Greenhouse' },
      { status: 500 }
    )
  }
}
