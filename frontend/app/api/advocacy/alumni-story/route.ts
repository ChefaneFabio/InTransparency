import { NextResponse } from 'next/server'

// Types for alumni success stories
export interface AlumniStory {
  id: string
  alumniId: string
  submissionDate: string

  // Alumni info
  alumniName: string
  graduationYear: number
  degree: string
  institution: string
  institutionId: string

  // Career path
  currentRole: string
  currentCompany: string
  careerPath: Array<{
    role: string
    company: string
    duration: string
    year: number
  }>

  // Success story
  story: string // Main narrative
  keySkills: string[] // Skills that helped in career
  adviceForStudents: string

  // Verification
  verified: boolean // Verified via .edu email
  verificationEmail: string
  verificationToken?: string

  // Privacy
  anonymous: boolean
  publiclyVisible: boolean
}

// Mock database
const mockAlumniStories: AlumniStory[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'alumniName',
      'graduationYear',
      'degree',
      'institution',
      'currentRole',
      'currentCompany',
      'story',
      'verificationEmail'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate .edu email
    if (!body.verificationEmail.endsWith('.edu') && !body.verificationEmail.includes('@') ) {
      return NextResponse.json(
        { error: 'Please use your institutional email (.edu) for verification' },
        { status: 400 }
      )
    }

    // Create story entry
    const story: AlumniStory = {
      id: `story_${Date.now()}`,
      alumniId: body.alumniId || `alumni_${Date.now()}`,
      submissionDate: new Date().toISOString(),

      alumniName: body.alumniName,
      graduationYear: body.graduationYear,
      degree: body.degree,
      institution: body.institution,
      institutionId: body.institutionId || '',

      currentRole: body.currentRole,
      currentCompany: body.currentCompany,
      careerPath: body.careerPath || [{
        role: body.currentRole,
        company: body.currentCompany,
        duration: 'Current',
        year: new Date().getFullYear()
      }],

      story: body.story,
      keySkills: body.keySkills || [],
      adviceForStudents: body.adviceForStudents || '',

      verified: false, // Will be verified via email
      verificationEmail: body.verificationEmail,
      verificationToken: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

      anonymous: body.anonymous ?? false,
      publiclyVisible: false // Only visible after verification
    }

    // Store story
    mockAlumniStories.push(story)

    // In production: Send verification email
    // await sendVerificationEmail(story.verificationEmail, story.verificationToken)

    return NextResponse.json({
      success: true,
      storyId: story.id,
      verificationToken: story.verificationToken,
      message: 'Story submitted! Please check your email to verify and publish.'
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting alumni story:', error)
    return NextResponse.json(
      { error: 'Failed to submit story' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const degree = searchParams.get('degree')
    const verified = searchParams.get('verified') !== 'false'

    let filteredStories = [...mockAlumniStories]

    // Only show verified stories by default
    if (verified) {
      filteredStories = filteredStories.filter(s => s.verified && s.publiclyVisible)
    }

    // Filter by institution
    if (institutionId) {
      filteredStories = filteredStories.filter(s => s.institutionId === institutionId)
    }

    // Filter by degree
    if (degree) {
      filteredStories = filteredStories.filter(s =>
        s.degree.toLowerCase().includes(degree.toLowerCase())
      )
    }

    // Anonymize if needed
    const stories = filteredStories.map(story => {
      if (story.anonymous) {
        const { alumniName, verificationEmail, ...rest } = story
        return {
          ...rest,
          alumniName: `${story.degree} Graduate`,
          verificationEmail: 'verified@institution.edu'
        }
      }
      // Remove sensitive data
      const { verificationEmail, verificationToken, ...public Data } = story
      return publicData
    })

    // Sort by most recent
    stories.sort((a, b) =>
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    )

    return NextResponse.json({
      success: true,
      stories,
      count: stories.length
    })

  } catch (error) {
    console.error('Error fetching alumni stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}
