import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auditFromRequest } from '@/lib/audit'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { canRecruiterAccessStudent } from '@/lib/access-grants'
import { shapeProjectForViewer } from '@/lib/project-visibility'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Find user by username or ID
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { id: username }] },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        photo: true,
        bio: true,
        university: true,
        degree: true,
        graduationYear: true,
        profilePublic: true,
        projects: {
          where: {
            isPublic: true
          },
          select: {
            id: true,
            title: true,
            description: true,
            courseCode: true,
            courseName: true,
            category: true,
            discipline: true,
            skills: true,
            technologies: true,
            videos: true,
            githubUrl: true,
            liveUrl: true,
            grade: true,
            createdAt: true,
            universityVerified: true,
            verificationStatus: true,
            professor: true,
            userId: true,
            peerVisibility: true,
            endorsements: {
              select: {
                id: true,
                professorName: true,
                professorTitle: true,
                endorsementText: true,
                createdAt: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if profile is public
    if (!user.profilePublic) {
      return NextResponse.json(
        { error: 'This portfolio is private' },
        { status: 403 }
      )
    }

    // Admin-managed access grants — when a recruiter is restricted, they can
    // only open profiles of students at granted institutions. Other roles
    // (admin, university staff, public visitors, the student themselves) bypass.
    const session = await getServerSession(authOptions).catch(() => null)
    if (session?.user?.role === 'RECRUITER' && session.user.id !== user.id) {
      const access = await canRecruiterAccessStudent(session.user.id, user.id, 'profile')
      if (!access.ok) {
        return NextResponse.json(
          {
            error: 'You do not have access to this profile.',
            code: access.reason ?? 'NOT_GRANTED',
          },
          { status: 403 }
        )
      }
    }

    // Calculate stats
    const projectsCount = user.projects.length
    const verifiedProjectsCount = user.projects.filter(
      (p) => p.universityVerified || (p.endorsements && p.endorsements.length > 0)
    ).length
    const verificationScore = projectsCount > 0
      ? Math.round((verifiedProjectsCount / projectsCount) * 100)
      : 0

    // Aggregate unique skills from all projects
    const allSkills = new Set<string>()
    user.projects.forEach(project => {
      if (project.skills && Array.isArray(project.skills)) {
        project.skills.forEach(skill => allSkills.add(skill))
      }
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => allSkills.add(tech))
      }
    })
    const skillsCount = allSkills.size

    // Peer visibility gate. Free students browsing peers' PREMIUM_ONLY
    // projects see only the locked-card payload. Stats above (counts +
    // skill aggregation) are computed from the unlocked source so the
    // profile always shows accurate totals — only the per-project content
    // is hidden.
    const viewer = session?.user
      ? {
          id: (session.user as { id?: string }).id ?? null,
          role: (session.user as { role?: string }).role ?? null,
          subscriptionTier: (session.user as { subscriptionTier?: string }).subscriptionTier ?? null,
        }
      : null
    const shapedProjects = user.projects.map(p =>
      shapeProjectForViewer(p as any, viewer)
    )

    // Remove sensitive data
    const { email, projects: _rawProjects, ...publicUserData } = user

    void auditFromRequest(request, {
      actorId: session?.user?.id ?? null,
      actorEmail: session?.user?.email ?? null,
      actorRole: session?.user?.role ?? 'PUBLIC',
      action: 'VIEW_PROFILE',
      targetType: 'User',
      targetId: user.id,
      context: { username: user.username, projectsCount },
    })

    return NextResponse.json({
      ...publicUserData,
      projects: shapedProjects,
      stats: {
        projectsCount,
        verifiedProjectsCount,
        verificationScore,
        skillsCount
      }
    })
  } catch (error) {
    console.error('Error fetching public portfolio:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
