import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

/**
 * POST /api/badge/[projectId]/issue
 * Creates a PortableBadge record with SHA-256 hash.
 * Auth required: project owner or university admin.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        skills: true,
        technologies: true,
        grade: true,
        verificationStatus: true,
        verifiedAt: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.verificationStatus !== 'VERIFIED') {
      return NextResponse.json(
        { error: 'Project must be verified before badge issuance' },
        { status: 400 }
      )
    }

    // Auth check: project owner or university admin
    const isOwner = project.userId === user.id
    const isAdmin = user.role === 'UNIVERSITY' || user.role === 'ADMIN'
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Compute SHA-256 hash of project content
    const contentToHash = JSON.stringify({
      title: project.title,
      description: project.description,
      skills: project.skills,
      technologies: project.technologies,
      grade: project.grade,
      verifiedAt: project.verifiedAt?.toISOString(),
    })
    const contentHash = crypto
      .createHash('sha256')
      .update(contentToHash)
      .digest('hex')

    // Check if badge already exists with same hash
    const existing = await prisma.portableBadge.findFirst({
      where: { projectId, contentHash },
    })

    if (existing) {
      return NextResponse.json({
        badge: existing,
        message: 'Badge already exists with current content',
      })
    }

    // Create badge
    const badge = await prisma.portableBadge.create({
      data: {
        projectId,
        contentHash,
        issuedBy: user.id,
      },
    })

    return NextResponse.json({ badge }, { status: 201 })
  } catch (error) {
    console.error('Badge issuance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
