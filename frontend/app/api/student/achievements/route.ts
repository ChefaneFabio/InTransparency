import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'profile' | 'projects' | 'engagement' | 'career'
  unlocked: boolean
  progress: number
}

/**
 * GET /api/student/achievements
 *
 * Returns the student's achievement milestones based on profile completion,
 * project uploads, engagement metrics, and career actions.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch user profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch projects with endorsements and certifications
    const projects = await prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        isPublic: true,
        verificationStatus: true,
        certifications: true,
        endorsements: { select: { id: true } },
      },
    })

    // Count messages and applications
    const messageCount = await prisma.message.count({ where: { senderId: userId } })
    const applicationCount = await prisma.application.count({ where: { applicantId: userId } })

    const projectCount = projects.length
    const publicProjects = projects.filter((p) => p.isPublic).length
    const verifiedProjects = projects.filter((p) => p.verificationStatus === 'VERIFIED').length
    const endorsedProjects = projects.filter((p) => p.endorsements.length > 0).length
    const hasBio = !!user.bio && user.bio.length > 20
    const hasPhoto = !!user.photo
    const hasUniversity = !!user.university
    const hasDegree = !!user.degree
    const hasUsername = !!user.username
    const isPublic = !!user.profilePublic
    const hasSocialLinks = !!(user.linkedinUrl || user.githubUrl || user.portfolioUrl)
    // Certifications are on Project model
    let certCount = 0
    for (let i = 0; i < projects.length; i++) {
      certCount += projects[i].certifications.length
    }

    // Calculate profile completeness
    const profileFields = [hasBio, hasPhoto, hasUniversity, hasDegree, hasUsername, isPublic, hasSocialLinks]
    const profileComplete = profileFields.filter(Boolean).length
    const profilePercent = Math.round((profileComplete / profileFields.length) * 100)

    const achievements: Achievement[] = [
      {
        id: 'profile-starter',
        title: 'Getting Started',
        description: 'Complete your basic profile (name, bio, photo)',
        icon: 'user',
        category: 'profile',
        unlocked: hasBio && hasPhoto,
        progress: [hasBio, hasPhoto].filter(Boolean).length * 50,
      },
      {
        id: 'profile-complete',
        title: 'Profile Pro',
        description: 'Complete all profile fields including university, degree, and social links',
        icon: 'award',
        category: 'profile',
        unlocked: profilePercent === 100,
        progress: profilePercent,
      },
      {
        id: 'go-public',
        title: 'Open for Business',
        description: 'Make your profile public so recruiters can find you',
        icon: 'globe',
        category: 'profile',
        unlocked: isPublic,
        progress: isPublic ? 100 : 0,
      },
      {
        id: 'custom-url',
        title: 'Personal Brand',
        description: 'Set a custom username for your shareable profile URL',
        icon: 'link',
        category: 'profile',
        unlocked: hasUsername,
        progress: hasUsername ? 100 : 0,
      },
      {
        id: 'first-project',
        title: 'First Upload',
        description: 'Upload your first project to your portfolio',
        icon: 'folder-plus',
        category: 'projects',
        unlocked: projectCount >= 1,
        progress: Math.min(projectCount * 100, 100),
      },
      {
        id: 'portfolio-builder',
        title: 'Portfolio Builder',
        description: 'Upload 3 or more projects',
        icon: 'layers',
        category: 'projects',
        unlocked: projectCount >= 3,
        progress: Math.min(Math.round((projectCount / 3) * 100), 100),
      },
      {
        id: 'showcase-star',
        title: 'Showcase Star',
        description: 'Upload 5 or more public projects',
        icon: 'star',
        category: 'projects',
        unlocked: publicProjects >= 5,
        progress: Math.min(Math.round((publicProjects / 5) * 100), 100),
      },
      {
        id: 'verified-work',
        title: 'Verified Work',
        description: 'Get at least one project verified by your institution',
        icon: 'shield-check',
        category: 'projects',
        unlocked: verifiedProjects >= 1,
        progress: verifiedProjects >= 1 ? 100 : 0,
      },
      {
        id: 'endorsed',
        title: 'Professor Endorsed',
        description: 'Receive a professor endorsement on a project',
        icon: 'thumbs-up',
        category: 'projects',
        unlocked: endorsedProjects >= 1,
        progress: endorsedProjects >= 1 ? 100 : 0,
      },
      {
        id: 'first-message',
        title: 'Conversation Starter',
        description: 'Send or receive your first message',
        icon: 'message-circle',
        category: 'engagement',
        unlocked: messageCount >= 1,
        progress: messageCount >= 1 ? 100 : 0,
      },
      {
        id: 'certified',
        title: 'Skill Certified',
        description: 'Add at least one certification or course',
        icon: 'badge-check',
        category: 'engagement',
        unlocked: certCount >= 1,
        progress: certCount >= 1 ? 100 : 0,
      },
      {
        id: 'first-application',
        title: 'Job Seeker',
        description: 'Apply to your first job on the platform',
        icon: 'briefcase',
        category: 'career',
        unlocked: applicationCount >= 1,
        progress: applicationCount >= 1 ? 100 : 0,
      },
      {
        id: 'active-applicant',
        title: 'Active Applicant',
        description: 'Apply to 5 or more jobs',
        icon: 'rocket',
        category: 'career',
        unlocked: applicationCount >= 5,
        progress: Math.min(Math.round((applicationCount / 5) * 100), 100),
      },
    ]

    const totalUnlocked = achievements.filter((a) => a.unlocked).length
    const totalAchievements = achievements.length
    const overallProgress = Math.round((totalUnlocked / totalAchievements) * 100)

    return NextResponse.json({
      achievements,
      summary: {
        totalUnlocked,
        totalAchievements,
        overallProgress,
        profileCompleteness: profilePercent,
      },
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}
