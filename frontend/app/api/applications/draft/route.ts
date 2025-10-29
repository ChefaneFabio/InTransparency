import { NextResponse } from 'next/server'

// Types for draft applications
export interface DraftApplication {
  id: string
  studentId: string
  jobId: string
  jobTitle: string
  companyName: string

  // Application data
  formData: {
    coverLetter?: string
    whyThisRole?: string
    selectedProjects?: string[] // Project IDs
    selectedSkills?: string[] // Skill names
    availability?: string
    salaryExpectation?: string
    additionalInfo?: string
  }

  // Progress tracking
  completionPercentage: number
  lastUpdated: string
  createdAt: string

  // Status
  status: 'draft' | 'ready-to-submit' | 'submitted'
  submittedAt?: string
}

// Mock database
const mockDraftDatabase: DraftApplication[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.studentId || !body.jobId) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId and jobId' },
        { status: 400 }
      )
    }

    // Check if draft already exists
    const existingDraftIndex = mockDraftDatabase.findIndex(
      d => d.studentId === body.studentId && d.jobId === body.jobId && d.status === 'draft'
    )

    let draft: DraftApplication

    if (existingDraftIndex >= 0) {
      // Update existing draft
      draft = {
        ...mockDraftDatabase[existingDraftIndex],
        formData: { ...mockDraftDatabase[existingDraftIndex].formData, ...body.formData },
        completionPercentage: calculateCompletionPercentage(body.formData),
        lastUpdated: new Date().toISOString(),
        status: body.status || 'draft'
      }
      mockDraftDatabase[existingDraftIndex] = draft
    } else {
      // Create new draft
      draft = {
        id: `draft_${Date.now()}`,
        studentId: body.studentId,
        jobId: body.jobId,
        jobTitle: body.jobTitle || 'Untitled Position',
        companyName: body.companyName || 'Company',
        formData: body.formData || {},
        completionPercentage: calculateCompletionPercentage(body.formData),
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: body.status || 'draft'
      }
      mockDraftDatabase.push(draft)
    }

    return NextResponse.json({
      success: true,
      draft,
      message: draft.status === 'draft'
        ? `Draft saved! ${draft.completionPercentage}% complete`
        : 'Application submitted successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Error saving draft:', error)
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const jobId = searchParams.get('jobId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'Missing required parameter: studentId' },
        { status: 400 }
      )
    }

    let drafts = mockDraftDatabase.filter(d => d.studentId === studentId)

    // Filter by specific job if provided
    if (jobId) {
      drafts = drafts.filter(d => d.jobId === jobId)
    }

    // Only return drafts, not submitted applications
    drafts = drafts.filter(d => d.status === 'draft' || d.status === 'ready-to-submit')

    // Sort by most recently updated
    drafts.sort((a, b) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )

    return NextResponse.json({
      success: true,
      drafts,
      count: drafts.length
    })

  } catch (error) {
    console.error('Error fetching drafts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const draftId = searchParams.get('draftId')

    if (!draftId) {
      return NextResponse.json(
        { error: 'Missing required parameter: draftId' },
        { status: 400 }
      )
    }

    const draftIndex = mockDraftDatabase.findIndex(d => d.id === draftId)

    if (draftIndex === -1) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    mockDraftDatabase.splice(draftIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting draft:', error)
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    )
  }
}

// Helper function to calculate completion percentage
function calculateCompletionPercentage(formData: any): number {
  if (!formData) return 0

  const fields = [
    'coverLetter',
    'whyThisRole',
    'selectedProjects',
    'selectedSkills',
    'availability'
  ]

  const completedFields = fields.filter(field => {
    const value = formData[field]
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim().length > 0
    return !!value
  })

  return Math.round((completedFields.length / fields.length) * 100)
}
