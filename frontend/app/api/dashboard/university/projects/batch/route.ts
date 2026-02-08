import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const batchActionSchema = z.object({
  projectIds: z.array(z.string()).min(1).max(100),
  action: z.enum(['verify', 'reject', 'request_info']),
  message: z.string().optional(),
})

/**
 * POST /api/dashboard/university/projects/batch
 * Batch verify/reject/request_info on multiple projects
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { projectIds, action, message } = batchActionSchema.parse(body)

    // Get the university name from session user
    const universityUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        university: true,
        firstName: true,
        lastName: true,
      }
    })

    const universityName = universityUser?.university ||
      `${universityUser?.firstName || ''} ${universityUser?.lastName || ''}`.trim()

    // Verify all projects exist and belong to this university
    const projects = await prisma.project.findMany({
      where: {
        id: { in: projectIds },
      },
      include: {
        user: { select: { university: true } }
      }
    })

    // Filter to only projects from this university
    const validProjectIds = projects
      .filter(p => p.user.university === universityName || session.user.role === 'ADMIN')
      .map(p => p.id)

    const skippedCount = projectIds.length - validProjectIds.length

    if (validProjectIds.length === 0) {
      return NextResponse.json({
        error: 'No valid projects found from your university',
      }, { status: 400 })
    }

    // Determine verification status
    let verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_INFO'
    let universityVerified: boolean

    switch (action) {
      case 'verify':
        verificationStatus = 'VERIFIED'
        universityVerified = true
        break
      case 'reject':
        verificationStatus = 'REJECTED'
        universityVerified = false
        break
      case 'request_info':
        verificationStatus = 'NEEDS_INFO'
        universityVerified = false
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Batch update
    const result = await prisma.project.updateMany({
      where: { id: { in: validProjectIds } },
      data: {
        verificationStatus,
        universityVerified,
        verificationMessage: message || null,
        verifiedBy: session.user.id,
        verifiedAt: action === 'verify' ? new Date() : null,
      }
    })

    return NextResponse.json({
      success: true,
      updated: result.count,
      skipped: skippedCount,
      message: `${result.count} project(s) ${action === 'verify' ? 'verified' : action === 'reject' ? 'rejected' : 'marked for review'}`,
    })

  } catch (error) {
    console.error('Error batch updating projects:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to batch update projects' },
      { status: 500 }
    )
  }
}
