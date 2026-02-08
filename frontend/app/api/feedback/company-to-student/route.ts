import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

// Types for institutional feedback
export interface CompanyFeedback {
  id: string
  applicationId: string
  companyId: string
  studentId: string
  feedbackDate: string

  // Structured feedback categories
  skillsDemonstrated: {
    skill: string
    rating: 'not-assessed' | 'developing' | 'proficient' | 'advanced'
    notes: string
  }[]

  areasForGrowth: string[]
  interviewPerformance: {
    communication: 'not-assessed' | 'needs-improvement' | 'good' | 'excellent'
    technicalKnowledge: 'not-assessed' | 'needs-improvement' | 'good' | 'excellent'
    problemSolving: 'not-assessed' | 'needs-improvement' | 'good' | 'excellent'
    culturalFit: 'not-assessed' | 'needs-improvement' | 'good' | 'excellent'
  }

  constructiveFeedback: string
  recommendationsForStudent: string

  // Visibility controls
  visibleToStudent: boolean
  visibleToInstitution: boolean
  sharedWithCareerCenter: boolean

  // Metadata
  recruiterName: string
  recruiterEmail: string
  companyName: string
  positionTitle: string
}

// In-memory store (no Feedback model in Prisma yet)
const feedbackStore: CompanyFeedback[] = []

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'applicationId',
      'companyId',
      'studentId',
      'skillsDemonstrated',
      'constructiveFeedback'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create feedback entry
    const feedback: CompanyFeedback = {
      id: `feedback_${Date.now()}`,
      applicationId: body.applicationId,
      companyId: body.companyId,
      studentId: body.studentId,
      feedbackDate: new Date().toISOString(),

      skillsDemonstrated: body.skillsDemonstrated || [],
      areasForGrowth: body.areasForGrowth || [],
      interviewPerformance: body.interviewPerformance || {
        communication: 'not-assessed',
        technicalKnowledge: 'not-assessed',
        problemSolving: 'not-assessed',
        culturalFit: 'not-assessed'
      },

      constructiveFeedback: body.constructiveFeedback,
      recommendationsForStudent: body.recommendationsForStudent || '',

      visibleToStudent: body.visibleToStudent ?? true,
      visibleToInstitution: body.visibleToInstitution ?? true,
      sharedWithCareerCenter: body.sharedWithCareerCenter ?? true,

      recruiterName: body.recruiterName || 'Anonymous Recruiter',
      recruiterEmail: body.recruiterEmail || '',
      companyName: body.companyName || 'Company',
      positionTitle: body.positionTitle || 'Position'
    }

    feedbackStore.push(feedback)

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
      message: 'Institutional feedback submitted successfully. Student and career center will be notified.'
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting company feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const studentId = session.user.id

    // Filter feedback visible to this student
    const filteredFeedback = feedbackStore
      .filter(f => f.studentId === studentId && f.visibleToStudent)
      .sort((a, b) =>
        new Date(b.feedbackDate).getTime() - new Date(a.feedbackDate).getTime()
      )

    return NextResponse.json({
      success: true,
      feedback: filteredFeedback,
      count: filteredFeedback.length
    })

  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
