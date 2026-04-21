import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET   /api/dashboard/student/hire-status    — current signal
 * PATCH /api/dashboard/student/hire-status    — update signal
 *                                                body: { jobSearchStatus?, availabilityFrom? }
 *
 * The student owns this signal. Recruiter search can filter on it;
 * the dashboard shows it as a visible toggle so students feel in control.
 */
const ALLOWED: readonly string[] = ['NOT_LOOKING', 'OPEN', 'ACTIVELY_LOOKING']

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { jobSearchStatus: true, availabilityFrom: true, jobSearchUpdatedAt: true },
    })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      jobSearchStatus: user.jobSearchStatus,
      availabilityFrom: user.availabilityFrom?.toISOString() || null,
      updatedAt: user.jobSearchUpdatedAt?.toISOString() || null,
    })
  } catch (error) {
    console.error('GET hire-status error:', error)
    return NextResponse.json({ error: 'Failed to load hire status' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const data: any = { jobSearchUpdatedAt: new Date() }

    if ('jobSearchStatus' in body) {
      if (!ALLOWED.includes(body.jobSearchStatus)) {
        return NextResponse.json({ error: 'Invalid jobSearchStatus' }, { status: 400 })
      }
      data.jobSearchStatus = body.jobSearchStatus
    }
    if ('availabilityFrom' in body) {
      data.availabilityFrom = body.availabilityFrom ? new Date(body.availabilityFrom) : null
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { jobSearchStatus: true, availabilityFrom: true, jobSearchUpdatedAt: true },
    })

    return NextResponse.json({
      jobSearchStatus: user.jobSearchStatus,
      availabilityFrom: user.availabilityFrom?.toISOString() || null,
      updatedAt: user.jobSearchUpdatedAt?.toISOString() || null,
    })
  } catch (error) {
    console.error('PATCH hire-status error:', error)
    return NextResponse.json({ error: 'Failed to update hire status' }, { status: 500 })
  }
}
