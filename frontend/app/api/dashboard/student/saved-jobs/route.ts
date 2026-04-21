import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET  /api/dashboard/student/saved-jobs     — list saved jobs for the current student
 * POST /api/dashboard/student/saved-jobs     — save a job (body: { jobId, notes? })
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const saved = await prisma.savedJob.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          select: {
            id: true, title: true, companyName: true, companyLogo: true,
            location: true, jobType: true, workLocation: true,
            requiredSkills: true, status: true, isPublic: true,
            salaryMin: true, salaryMax: true, salaryCurrency: true, showSalary: true,
            postedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Hide jobs that were closed/made private after saving
    const visible = saved.filter(s => s.job.isPublic && s.job.status === 'ACTIVE')
    const hiddenCount = saved.length - visible.length

    return NextResponse.json({
      savedJobs: visible.map(s => ({
        id: s.id,
        savedAt: s.createdAt.toISOString(),
        notes: s.notes,
        job: {
          ...s.job,
          postedAt: s.job.postedAt?.toISOString() || null,
        },
      })),
      hiddenCount,
    })
  } catch (error) {
    console.error('GET saved-jobs error:', error)
    return NextResponse.json({ error: 'Failed to load saved jobs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { jobId, notes } = body
    if (!jobId || typeof jobId !== 'string') {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({ where: { id: jobId }, select: { id: true } })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const saved = await prisma.savedJob.upsert({
      where: { userId_jobId: { userId: session.user.id, jobId } },
      update: { notes: notes?.trim() || null },
      create: { userId: session.user.id, jobId, notes: notes?.trim() || null },
    })

    return NextResponse.json({ saved: { id: saved.id, jobId: saved.jobId } }, { status: 201 })
  } catch (error) {
    console.error('POST saved-jobs error:', error)
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboard/student/saved-jobs?jobId=xxx — unsave
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const jobId = new URL(req.url).searchParams.get('jobId')
    if (!jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 })

    await prisma.savedJob.deleteMany({
      where: { userId: session.user.id, jobId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE saved-jobs error:', error)
    return NextResponse.json({ error: 'Failed to unsave job' }, { status: 500 })
  }
}
