import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// Draft data is stored in User.metadata JSON field as "applicationDrafts"
// This avoids needing a schema migration while providing persistence

interface DraftFormData {
  coverLetter?: string
  whyThisRole?: string
  selectedProjects?: string[]
  selectedSkills?: string[]
  availability?: string
  salaryExpectation?: string
  additionalInfo?: string
}

interface DraftApplication {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  formData: DraftFormData
  completionPercentage: number
  lastUpdated: string
  createdAt: string
  status: 'draft' | 'ready-to-submit'
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

const getDrafts = (metadata: any): DraftApplication[] => {
  if (!metadata || typeof metadata !== 'object') return []
  return (metadata as any).applicationDrafts || []
}

const saveDrafts = async (userId: string, drafts: DraftApplication[]) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { metadata: true } })
  const currentMetadata = (user?.metadata as any) || {}
  await prisma.user.update({
    where: { id: userId },
    data: { metadata: { ...currentMetadata, applicationDrafts: drafts } }
  })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const userId = session.user.id

    if (!body.jobId) {
      return NextResponse.json({ error: 'Missing required field: jobId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { metadata: true } })
    const drafts = getDrafts(user?.metadata)

    const existingIndex = drafts.findIndex(d => d.jobId === body.jobId && d.status === 'draft')
    let draft: DraftApplication

    if (existingIndex >= 0) {
      draft = {
        ...drafts[existingIndex],
        formData: { ...drafts[existingIndex].formData, ...body.formData },
        completionPercentage: calculateCompletionPercentage(body.formData),
        lastUpdated: new Date().toISOString(),
        status: body.status || 'draft'
      }
      drafts[existingIndex] = draft
    } else {
      draft = {
        id: `draft_${Date.now()}`,
        jobId: body.jobId,
        jobTitle: body.jobTitle || 'Untitled Position',
        companyName: body.companyName || 'Company',
        formData: body.formData || {},
        completionPercentage: calculateCompletionPercentage(body.formData),
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: body.status || 'draft'
      }
      drafts.push(draft)
    }

    await saveDrafts(userId, drafts)

    return NextResponse.json({
      success: true,
      draft,
      message: draft.status === 'draft'
        ? `Draft saved! ${draft.completionPercentage}% complete`
        : 'Application ready to submit'
    })
  } catch (error) {
    console.error('Error saving draft:', error)
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { metadata: true } })
    let drafts = getDrafts(user?.metadata)

    if (jobId) {
      drafts = drafts.filter(d => d.jobId === jobId)
    }

    drafts = drafts.filter(d => d.status === 'draft' || d.status === 'ready-to-submit')
    drafts.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())

    return NextResponse.json({ success: true, drafts, count: drafts.length })
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

    const { searchParams } = new URL(request.url)
    const draftId = searchParams.get('draftId')

    if (!draftId) {
      return NextResponse.json({ error: 'Missing required parameter: draftId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { metadata: true } })
    const drafts = getDrafts(user?.metadata)

    const draftIndex = drafts.findIndex(d => d.id === draftId)
    if (draftIndex === -1) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    drafts.splice(draftIndex, 1)
    await saveDrafts(session.user.id, drafts)

    return NextResponse.json({ success: true, message: 'Draft deleted successfully' })
  } catch (error) {
    console.error('Error deleting draft:', error)
    return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
  }
}
