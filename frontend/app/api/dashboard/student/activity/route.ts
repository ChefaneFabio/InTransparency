import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface ActivityItem {
  id: string
  type: 'profile_view' | 'message_received' | 'application_status'
  title: string
  description: string
  timestamp: string
  metadata: Record<string, any>
}

/**
 * GET /api/dashboard/student/activity
 * Returns aggregated activity feed from profile views, messages, and applications
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

    const [profileViews, receivedMessages, applications] = await Promise.all([
      prisma.profileView.findMany({
        where: {
          profileUserId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: {
          id: true,
          viewerCompany: true,
          viewerRole: true,
          viewDuration: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.message.findMany({
        where: {
          recipientId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: {
          id: true,
          subject: true,
          content: true,
          read: true,
          createdAt: true,
          sender: {
            select: {
              firstName: true,
              lastName: true,
              company: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.application.findMany({
        where: {
          applicantId: userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          job: {
            select: {
              title: true,
              companyName: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      }),
    ])

    // Map to unified activity format
    const activities: ActivityItem[] = []

    for (let i = 0; i < profileViews.length; i++) {
      const pv = profileViews[i]
      const viewer = pv.viewerCompany || 'Someone'
      const role = pv.viewerRole === 'RECRUITER' ? 'recruiter' : 'visitor'
      const duration = pv.viewDuration ? `${Math.round(pv.viewDuration / 60)} min` : null

      activities.push({
        id: `pv_${pv.id}`,
        type: 'profile_view',
        title: `Profile viewed by ${viewer}`,
        description: duration
          ? `A ${role} from ${viewer} viewed your profile for ${duration}`
          : `A ${role} from ${viewer} viewed your profile`,
        timestamp: pv.createdAt.toISOString(),
        metadata: {
          company: pv.viewerCompany,
          viewerRole: pv.viewerRole,
          viewDuration: pv.viewDuration,
        },
      })
    }

    for (let i = 0; i < receivedMessages.length; i++) {
      const msg = receivedMessages[i]
      const senderName = msg.sender
        ? `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim()
        : 'Unknown'
      const company = msg.sender?.company

      activities.push({
        id: `msg_${msg.id}`,
        type: 'message_received',
        title: company
          ? `New message from ${senderName} at ${company}`
          : `New message from ${senderName}`,
        description: msg.subject || msg.content.slice(0, 100),
        timestamp: msg.createdAt.toISOString(),
        metadata: {
          read: msg.read,
          senderName,
          company,
          messageId: msg.id,
        },
      })
    }

    for (let i = 0; i < applications.length; i++) {
      const app = applications[i]
      const statusLabels: Record<string, string> = {
        PENDING: 'Applied',
        REVIEWING: 'Under Review',
        SHORTLISTED: 'Shortlisted',
        INTERVIEW: 'Interview Scheduled',
        OFFER: 'Offer Received',
        ACCEPTED: 'Accepted',
        REJECTED: 'Not Selected',
        WITHDRAWN: 'Withdrawn',
      }
      const statusLabel = statusLabels[app.status] || app.status

      activities.push({
        id: `app_${app.id}`,
        type: 'application_status',
        title: `${app.job.title} at ${app.job.companyName}`,
        description: `Status: ${statusLabel}`,
        timestamp: app.updatedAt.toISOString(),
        metadata: {
          status: app.status,
          statusLabel,
          jobTitle: app.job.title,
          companyName: app.job.companyName,
          applicationId: app.id,
        },
      })
    }

    // Sort all activities by timestamp desc
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Take top 50
    const trimmed = activities.slice(0, 50)

    return NextResponse.json({
      activities: trimmed,
      summary: {
        profileViews: profileViews.length,
        messagesReceived: receivedMessages.length,
        applicationUpdates: applications.length,
      },
    })
  } catch (error) {
    console.error('Error fetching student activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}
