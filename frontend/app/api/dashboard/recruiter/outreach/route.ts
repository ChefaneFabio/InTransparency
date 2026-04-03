import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/outreach
 * List saved outreach templates for the recruiter.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const templates = await prisma.outreachTemplate.findMany({
      where: { recruiterId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching outreach templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

/**
 * POST /api/dashboard/recruiter/outreach
 * Create a new outreach template.
 * Body: { name: string, steps: Array<{type, subject, body, delayDays}> }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name, steps } = await req.json()

    if (!name || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: 'Name and at least one step are required' }, { status: 400 })
    }

    // Validate steps structure
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      if (!step.type || !step.body) {
        return NextResponse.json({ error: `Step ${i + 1} requires type and body` }, { status: 400 })
      }
    }

    const template = await prisma.outreachTemplate.create({
      data: {
        recruiterId: session.user.id,
        name,
        steps,
      },
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating outreach template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboard/recruiter/outreach
 * Delete a template. Body: { templateId: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { templateId } = await req.json()
    if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 })

    const existing = await prisma.outreachTemplate.findFirst({
      where: { id: templateId, recruiterId: session.user.id },
    })
    if (!existing) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    await prisma.outreachTemplate.delete({ where: { id: templateId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting outreach template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
