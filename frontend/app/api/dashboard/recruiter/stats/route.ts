import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getPricingTier } from '@/lib/config/pricing'

/**
 * GET /api/dashboard/recruiter/stats
 * Returns aggregated stats for recruiter dashboard
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

    // Get user subscription info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        premiumUntil: true,
      }
    })

    // Calculate contact usage
    let contactUsage = { used: 0, limit: 0, remaining: 0 }
    if (user) {
      const tier = getPricingTier(user.subscriptionTier)
      const contactLimit = tier?.limits.contacts ?? 0

      const now = new Date()
      let billingPeriodStart: Date

      if (user.premiumUntil) {
        const premiumDate = new Date(user.premiumUntil)
        const dayOfMonth = premiumDate.getDate()
        billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), dayOfMonth)
        if (billingPeriodStart > now) {
          billingPeriodStart.setMonth(billingPeriodStart.getMonth() - 1)
        }
      } else {
        billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      }

      const used = await prisma.contactUsage.count({
        where: {
          recruiterId: userId,
          billingPeriodStart: billingPeriodStart,
        }
      })

      contactUsage = {
        used,
        limit: contactLimit,
        remaining: contactLimit === -1 ? -1 : Math.max(0, contactLimit - used),
      }
    }

    // Run all queries in parallel
    const [
      activeJobs,
      totalApplications,
      newApplicationsThisWeek,
      pendingReview,
      shortlisted,
      interviewsScheduled,
      recentCandidates,
      myJobs
    ] = await Promise.all([
      // Count active job postings
      prisma.job.count({
        where: {
          recruiterId: userId,
          status: 'ACTIVE'
        }
      }),

      // Total applications across all jobs
      prisma.application.count({
        where: {
          job: { recruiterId: userId }
        }
      }),

      // New applications this week
      prisma.application.count({
        where: {
          job: { recruiterId: userId },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Pending review count
      prisma.application.count({
        where: {
          job: { recruiterId: userId },
          status: 'PENDING',
          isRead: false
        }
      }),

      // Shortlisted candidates
      prisma.application.count({
        where: {
          job: { recruiterId: userId },
          status: 'SHORTLISTED'
        }
      }),

      // Interviews scheduled
      prisma.application.count({
        where: {
          job: { recruiterId: userId },
          status: 'INTERVIEW'
        }
      }),

      // Recent applications with applicant details
      prisma.application.findMany({
        where: {
          job: { recruiterId: userId }
        },
        include: {
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              university: true,
              degree: true,
              photo: true,
            }
          },
          job: {
            select: {
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Recruiter's jobs with application counts
      prisma.job.findMany({
        where: { recruiterId: userId },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          views: true,
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    // Get top candidates (students with high project scores)
    const topCandidates = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        profilePublic: true,
        projects: {
          some: {
            isPublic: true
          }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        university: true,
        degree: true,
        photo: true,
        projects: {
          where: { isPublic: true },
          select: {
            id: true,
            title: true,
            innovationScore: true,
            discipline: true
          },
          take: 3,
          orderBy: { innovationScore: 'desc' }
        },
        _count: {
          select: { projects: true }
        }
      },
      take: 5,
      orderBy: {
        projects: {
          _count: 'desc'
        }
      }
    })

    // Format candidates
    const formattedCandidates = topCandidates.map(candidate => ({
      id: candidate.id,
      name: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Anonymous',
      initials: getInitials(candidate.firstName, candidate.lastName),
      university: candidate.university || 'University not specified',
      degree: candidate.degree || 'Degree not specified',
      photo: candidate.photo,
      projectCount: candidate._count.projects,
      topProject: candidate.projects[0]?.title,
      discipline: candidate.projects[0]?.discipline,
      score: candidate.projects[0]?.innovationScore || 0
    }))

    // Format recent applications
    const formattedApplications = recentCandidates.map(app => ({
      id: app.id,
      applicant: {
        id: app.applicant.id,
        name: `${app.applicant.firstName || ''} ${app.applicant.lastName || ''}`.trim() || 'Anonymous',
        initials: getInitials(app.applicant.firstName, app.applicant.lastName),
        university: app.applicant.university,
        photo: app.applicant.photo
      },
      jobTitle: app.job.title,
      status: app.status,
      createdAt: app.createdAt
    }))

    // Format jobs
    const formattedJobs = myJobs.map(job => ({
      id: job.id,
      title: job.title,
      status: job.status,
      applications: job._count.applications,
      views: job.views,
      posted: formatTimeAgo(job.createdAt)
    }))

    return NextResponse.json({
      stats: {
        activeJobs,
        totalApplications,
        newApplicationsThisWeek,
        pendingReview,
        shortlisted,
        interviewsScheduled,
        contactUsage,
      },
      recentApplications: formattedApplications,
      topCandidates: formattedCandidates,
      myJobs: formattedJobs
    })

  } catch (error) {
    console.error('Error fetching recruiter stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return `${Math.floor(seconds / 604800)} weeks ago`
}
