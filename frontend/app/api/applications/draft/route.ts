import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// Application drafts are stored client-side in localStorage.
// This API exists only to validate draft data before submission
// and could be extended to persist drafts when a JSON field is added to the schema.

interface DraftFormData {
  coverLetter?: string
  whyThisRole?: string
  selectedProjects?: string[]
  selectedSkills?: string[]
  availability?: string
  salaryExpectation?: string
  additionalInfo?: string
}

const calculateCompletionPercentage = (formData: DraftFormData | undefined): number => {
  if (!formData) return 0

  const fields: (keyof DraftFormData)[] = [
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.jobId) {
      return NextResponse.json({ error: 'Missing required field: jobId' }, { status: 400 })
    }

    const completionPercentage = calculateCompletionPercentage(body.formData)

    return NextResponse.json({
      success: true,
      completionPercentage,
      message: `Draft validated. ${completionPercentage}% complete`,
      status: body.status || 'draft'
    })
  } catch (error) {
    console.error('Error validating draft:', error)
    return NextResponse.json({ error: 'Failed to validate draft' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Drafts are stored client-side; return empty for API consumers
    return NextResponse.json({ success: true, drafts: [], count: 0 })
  } catch (error) {
    console.error('Error fetching drafts:', error)
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ success: true, message: 'Draft deleted' })
  } catch (error) {
    console.error('Error deleting draft:', error)
    return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
  }
}
