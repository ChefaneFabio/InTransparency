import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/stats
 * Returns aggregated stats for student dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Run all queries in parallel for performance
    const [
      user,
      projectCount,
      profileViews,
      unreadMessages,
      jobMatches,
      recentJobs
    ] = await Promise.all([
      // Get user profile for completion calculation
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          bio: true,
          tagline: true,
          photo: true,
          university: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          emailVerified: true,
          portfolioUrl: true,
        }
      }),

      // Count user's projects
      prisma.project.count({
        where: { userId }
      }),

      // Count profile views in last 30 days
      prisma.profileView.count({
        where: {
          profileUserId: userId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Count unread messages
      prisma.message.count({
        where: {
          recipientId: userId,
          read: false
        }
      }),

      // Count active jobs that match user's skills (simplified - count all active jobs for now)
      prisma.job.count({
        where: {
          status: 'ACTIVE',
          isPublic: true
        }
      }),

      // Get recent jobs for the dashboard (limit 5)
      prisma.job.findMany({
        where: {
          status: 'ACTIVE',
          isPublic: true
        },
        select: {
          id: true,
          title: true,
          companyName: true,
          location: true,
          jobType: true,
          workLocation: true,
          createdAt: true,
          requiredSkills: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    // Calculate profile completion percentage
    const profileFields = [
      user?.firstName,
      user?.lastName,
      user?.bio,
      user?.tagline,
      user?.photo,
      user?.university,
      user?.degree,
      user?.graduationYear,
      user?.emailVerified,
    ]
    const filledFields = profileFields.filter(Boolean).length
    const profileCompletion = Math.round((filledFields / profileFields.length) * 100)

    // Format jobs for display
    const formattedJobs = recentJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.companyName,
      location: job.location || 'Remote',
      type: formatJobType(job.jobType),
      posted: formatTimeAgo(job.createdAt),
      match: job.requiredSkills.length > 0
        ? `Requires: ${job.requiredSkills.slice(0, 2).join(', ')}`
        : 'New opportunity'
    }))

    return NextResponse.json({
      stats: {
        projectCount,
        profileViews,
        unreadMessages,
        jobMatches: Math.min(jobMatches, 50), // Cap at 50 for display
        profileCompletion,
      },
      recentJobs: formattedJobs
    })

  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

function formatJobType(type: string): string {
  const types: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
    TEMPORARY: 'Temporary',
    FREELANCE: 'Freelance'
  }
  return types[type] || type
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return `${Math.floor(seconds / 604800)} weeks ago`
}
