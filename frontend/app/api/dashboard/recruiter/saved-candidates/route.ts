import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/saved-candidates
 * List saved candidates for current recruiter, with optional folder filter
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const folder = searchParams.get('folder')

    // Build where clause
    const where: Record<string, unknown> = { recruiterId: userId }
    if (folder) {
      where.folder = folder
    }

    const savedCandidates = await prisma.savedCandidate.findMany({
      where,
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            university: true,
            degree: true,
            graduationYear: true,
            photo: true,
            gpa: true,
            gpaPublic: true,
            _count: {
              select: { projects: { where: { isPublic: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = savedCandidates.map((sc) => ({
      id: sc.id,
      candidateId: sc.candidateId,
      folder: sc.folder,
      notes: sc.notes,
      rating: sc.rating,
      tags: sc.tags,
      savedAt: sc.createdAt,
      candidate: {
        id: sc.candidate.id,
        firstName: sc.candidate.firstName,
        lastName: sc.candidate.lastName,
        university: sc.candidate.university,
        degree: sc.candidate.degree,
        graduationYear: sc.candidate.graduationYear,
        photo: sc.candidate.photo,
        gpa: sc.candidate.gpaPublic ? sc.candidate.gpa : null,
        projectCount: sc.candidate._count.projects,
      },
    }))

    return NextResponse.json({ savedCandidates: formatted })
  } catch (error) {
    console.error('Error fetching saved candidates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved candidates' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dashboard/recruiter/saved-candidates
 * Save a candidate. Body: { candidateId, folder?, notes?, tags? }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { candidateId, folder, notes, tags } = body

    if (!candidateId) {
      return NextResponse.json(
        { error: 'candidateId is required' },
        { status: 400 }
      )
    }

    // Verify candidate exists
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      select: { id: true, role: true },
    })

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    // Upsert to avoid duplicates
    const saved = await prisma.savedCandidate.upsert({
      where: {
        recruiterId_candidateId: {
          recruiterId: userId,
          candidateId,
        },
      },
      create: {
        recruiterId: userId,
        candidateId,
        folder: folder || 'all',
        notes: notes || null,
        tags: tags || [],
      },
      update: {
        folder: folder || undefined,
        notes: notes !== undefined ? notes : undefined,
        tags: tags !== undefined ? tags : undefined,
      },
    })

    return NextResponse.json({ savedCandidate: saved }, { status: 201 })
  } catch (error) {
    console.error('Error saving candidate:', error)
    return NextResponse.json(
      { error: 'Failed to save candidate' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/dashboard/recruiter/saved-candidates
 * Unsave a candidate. Body: { candidateId }
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { candidateId } = body

    if (!candidateId) {
      return NextResponse.json(
        { error: 'candidateId is required' },
        { status: 400 }
      )
    }

    await prisma.savedCandidate.delete({
      where: {
        recruiterId_candidateId: {
          recruiterId: userId,
          candidateId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unsaving candidate:', error)
    return NextResponse.json(
      { error: 'Failed to unsave candidate' },
      { status: 500 }
    )
  }
}
