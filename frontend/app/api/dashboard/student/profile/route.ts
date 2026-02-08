import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/profile
 * Returns comprehensive student profile data
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [user, projects, profileViewCount, recruiterViewCount, applicationCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          photo: true,
          bio: true,
          tagline: true,
          university: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          gpaPublic: true,
          profilePublic: true,
          portfolioUrl: true,
          subscriptionTier: true,
          showLocation: true,
          showEmail: true,
          showPhone: true,
          showLastActive: true,
          anonymousBrowsing: true,
          allowMessagesFrom: true,
          indexInSearchEngines: true,
          showProjects: true,
          blockedCompanies: true,
          createdAt: true,
        },
      }),
      prisma.project.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          skills: true,
          technologies: true,
          views: true,
          recruiterViews: true,
          complexityScore: true,
          githubUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.profileView.count({
        where: {
          profileUserId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.profileView.count({
        where: {
          profileUserId: userId,
          viewerRole: 'RECRUITER',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.application.count({
        where: { applicantId: userId },
      }),
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Derive skills from projects
    const skillMap = new Map<string, { level: number; projectCount: number }>()
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]
      const allSkills = p.skills.concat(p.technologies)
      for (let j = 0; j < allSkills.length; j++) {
        const skill = allSkills[j]
        const existing = skillMap.get(skill)
        if (existing) {
          existing.projectCount += 1
          existing.level = Math.min(100, existing.level + 10)
        } else {
          skillMap.set(skill, { level: 40, projectCount: 1 })
        }
      }
    }

    // Factor in complexity scores
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]
      const bonus = Math.round((p.complexityScore || 0) / 10)
      const allSkills = p.skills.concat(p.technologies)
      for (let j = 0; j < allSkills.length; j++) {
        const skill = allSkills[j]
        const existing = skillMap.get(skill)
        if (existing) {
          existing.level = Math.min(100, existing.level + bonus)
        }
      }
    }

    const skills = Array.from(skillMap.entries())
      .map(([name, data]) => ({
        name,
        level: data.level,
        projectCount: data.projectCount,
      }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 20)

    // Calculate profile completion
    const completionItems = [
      { field: 'firstName', label: 'First name', filled: !!user.firstName },
      { field: 'lastName', label: 'Last name', filled: !!user.lastName },
      { field: 'bio', label: 'Bio', filled: !!user.bio },
      { field: 'tagline', label: 'Tagline', filled: !!user.tagline },
      { field: 'photo', label: 'Profile photo', filled: !!user.photo },
      { field: 'university', label: 'University', filled: !!user.university },
      { field: 'degree', label: 'Degree', filled: !!user.degree },
      { field: 'graduationYear', label: 'Graduation year', filled: !!user.graduationYear },
      { field: 'gpa', label: 'GPA', filled: !!user.gpa },
      { field: 'projects', label: 'At least one project', filled: projects.length > 0 },
    ]

    const filledCount = completionItems.filter((item) => item.filled).length
    const profileCompletion = Math.round((filledCount / completionItems.length) * 100)

    // Derive GitHub URL from projects
    let githubUrl: string | null = null
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].githubUrl) {
        const url = projects[i].githubUrl as string
        const match = url.match(/github\.com\/([^/]+)/)
        if (match) {
          githubUrl = `https://github.com/${match[1]}`
          break
        }
      }
    }

    return NextResponse.json({
      user,
      skills,
      stats: {
        profileViews: profileViewCount,
        recruiterViews: recruiterViewCount,
        totalApplications: applicationCount,
        totalProjects: projects.length,
      },
      profileCompletion,
      completionItems,
      projects,
      githubUrl,
    })
  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/dashboard/student/profile
 * Update editable profile fields
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const body = await req.json()
    const {
      bio, tagline, portfolioUrl, profilePublic, showLocation, showEmail, showPhone, gpaPublic,
      showLastActive, anonymousBrowsing, allowMessagesFrom, indexInSearchEngines, showProjects, blockedCompanies,
    } = body

    // Gate portfolioUrl behind STUDENT_PREMIUM
    if (portfolioUrl !== undefined && portfolioUrl !== null && portfolioUrl !== '') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true },
      })

      if (user?.subscriptionTier !== 'STUDENT_PREMIUM') {
        return NextResponse.json(
          {
            error: 'Custom portfolio URL requires a Premium subscription',
            upgradeUrl: '/dashboard/student/upgrade',
          },
          { status: 403 }
        )
      }
    }

    // Build update data — only include fields that were provided
    const updateData: Record<string, any> = {}
    if (bio !== undefined) updateData.bio = bio
    if (tagline !== undefined) updateData.tagline = tagline
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl || null
    if (profilePublic !== undefined) updateData.profilePublic = profilePublic
    if (showLocation !== undefined) updateData.showLocation = showLocation
    if (showEmail !== undefined) updateData.showEmail = showEmail
    if (showPhone !== undefined) updateData.showPhone = showPhone
    if (gpaPublic !== undefined) updateData.gpaPublic = gpaPublic
    if (showLastActive !== undefined) updateData.showLastActive = showLastActive
    if (anonymousBrowsing !== undefined) updateData.anonymousBrowsing = anonymousBrowsing
    if (allowMessagesFrom !== undefined) updateData.allowMessagesFrom = allowMessagesFrom
    if (indexInSearchEngines !== undefined) updateData.indexInSearchEngines = indexInSearchEngines
    if (showProjects !== undefined) updateData.showProjects = showProjects
    if (blockedCompanies !== undefined) updateData.blockedCompanies = blockedCompanies

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        bio: true,
        tagline: true,
        portfolioUrl: true,
        profilePublic: true,
        showLocation: true,
        showEmail: true,
        showPhone: true,
        gpaPublic: true,
        showLastActive: true,
        anonymousBrowsing: true,
        allowMessagesFrom: true,
        indexInSearchEngines: true,
        showProjects: true,
        blockedCompanies: true,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating student profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
