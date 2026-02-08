import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/candidates/[id]
 * Loads full candidate (student) profile by user ID
 * Records a profile view for analytics
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: candidateId } = await params

    // Fetch candidate profile and public projects in parallel
    const [candidate, projectCount, viewerUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: candidateId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          showEmail: true,
          university: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          gpaPublic: true,
          bio: true,
          tagline: true,
          photo: true,
          profilePublic: true,
          projects: {
            where: { isPublic: true },
            select: {
              id: true,
              title: true,
              description: true,
              technologies: true,
              skills: true,
              innovationScore: true,
              complexityScore: true,
              githubUrl: true,
              liveUrl: true,
              imageUrl: true,
              views: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { projects: { where: { isPublic: true } } },
          },
        },
      }),
      prisma.project.count({
        where: { userId: candidateId, isPublic: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { company: true },
      }),
    ])

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    // Record profile view (fire and forget - don't block response)
    prisma.profileView
      .create({
        data: {
          profileUserId: candidateId,
          viewerId: session.user.id,
          viewerRole: 'RECRUITER',
          viewerCompany: viewerUser?.company || null,
        },
      })
      .catch((err: unknown) => {
        console.error('Failed to record profile view:', err)
      })

    // Build response - respect privacy settings
    const response = {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.showEmail ? candidate.email : null,
      university: candidate.university,
      degree: candidate.degree,
      graduationYear: candidate.graduationYear,
      gpa: candidate.gpaPublic ? candidate.gpa : null,
      bio: candidate.bio,
      tagline: candidate.tagline,
      photo: candidate.photo,
      profilePublic: candidate.profilePublic,
      projectCount,
      projects: candidate.projects,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching candidate profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidate profile' },
      { status: 500 }
    )
  }
}
