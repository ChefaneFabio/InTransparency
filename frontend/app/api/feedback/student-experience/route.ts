import { NextResponse } from 'next/server'

// Types for student interview experience sharing
export interface StudentExperience {
  id: string
  studentId: string
  companyId: string
  applicationId: string
  submissionDate: string

  // Experience details (NOT ratings - focus on process transparency)
  position: string
  companyName: string
  applicationDate: string

  // Interview process details
  interviewProcess: {
    rounds: number
    roundDescriptions: string[] // e.g., "Phone screen", "Technical assessment", "Cultural fit"
    timeline: string // e.g., "2 weeks from application to final decision"
    interviewFormat: string[] // e.g., "Video call", "In-person", "Take-home project"
  }

  // Question types (helps other students prepare)
  questionTypes: string[] // e.g., "Behavioral", "Technical", "Case study", "Live coding"

  // Preparation advice
  preparationTips: string
  skillsAssessed: string[] // e.g., "Python", "Communication", "Problem-solving"

  // Outcome (optional)
  outcome: 'pending' | 'offer-received' | 'offer-accepted' | 'offer-declined' | 'not-selected' | 'withdrew'

  // Helpful for other students
  wouldRecommendApplying: boolean
  difficultyLevel: 'entry-friendly' | 'moderate' | 'challenging' | 'very-challenging'

  // Metadata
  institutionId: string
  verified: boolean // Institution career center can verify
  visibleToCareerCenter: boolean
  anonymized: boolean // Show to peers without student name
}

// Mock database
const mockExperienceDatabase: StudentExperience[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'studentId',
      'companyId',
      'position',
      'companyName',
      'interviewProcess'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create experience entry
    const experience: StudentExperience = {
      id: `exp_${Date.now()}`,
      studentId: body.studentId,
      companyId: body.companyId,
      applicationId: body.applicationId || '',
      submissionDate: new Date().toISOString(),

      position: body.position,
      companyName: body.companyName,
      applicationDate: body.applicationDate || new Date().toISOString(),

      interviewProcess: {
        rounds: body.interviewProcess.rounds || 1,
        roundDescriptions: body.interviewProcess.roundDescriptions || [],
        timeline: body.interviewProcess.timeline || '',
        interviewFormat: body.interviewProcess.interviewFormat || []
      },

      questionTypes: body.questionTypes || [],
      preparationTips: body.preparationTips || '',
      skillsAssessed: body.skillsAssessed || [],

      outcome: body.outcome || 'pending',
      wouldRecommendApplying: body.wouldRecommendApplying ?? true,
      difficultyLevel: body.difficultyLevel || 'moderate',

      institutionId: body.institutionId || '',
      verified: false, // Career center can verify later
      visibleToCareerCenter: body.visibleToCareerCenter ?? true,
      anonymized: body.anonymized ?? true
    }

    // Store experience
    mockExperienceDatabase.push(experience)

    // In production: Notify career center for verification
    // await notifyCareerCenterForVerification(experience.id)

    return NextResponse.json({
      success: true,
      experienceId: experience.id,
      message: 'Interview experience shared successfully. Thank you for helping your peers!'
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting student experience:', error)
    return NextResponse.json(
      { error: 'Failed to submit experience' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const institutionId = searchParams.get('institutionId')
    const position = searchParams.get('position')

    let filteredExperiences = [...mockExperienceDatabase]

    // Filter by company
    if (companyId) {
      filteredExperiences = filteredExperiences.filter(e => e.companyId === companyId)
    }

    // Filter by institution (for career center view)
    if (institutionId) {
      filteredExperiences = filteredExperiences.filter(
        e => e.institutionId === institutionId && e.visibleToCareerCenter
      )
    }

    // Filter by position type
    if (position) {
      filteredExperiences = filteredExperiences.filter(
        e => e.position.toLowerCase().includes(position.toLowerCase())
      )
    }

    // Return anonymized data by default
    const anonymizedExperiences = filteredExperiences.map(exp => {
      if (exp.anonymized) {
        const { studentId, ...rest } = exp
        return { ...rest, studentId: 'anonymous' }
      }
      return exp
    })

    // Sort by most recent
    anonymizedExperiences.sort((a, b) =>
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    )

    return NextResponse.json({
      success: true,
      experiences: anonymizedExperiences,
      count: anonymizedExperiences.length
    })

  } catch (error) {
    console.error('Error fetching student experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}
