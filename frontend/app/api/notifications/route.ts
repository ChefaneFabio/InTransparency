import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/notifications
 * List notifications for the current user.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(url.searchParams.get('limit') || '20')

    const where: Record<string, unknown> = { userId: session.user.id, dismissed: false }
    if (unreadOnly) where.read = false

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(limit, 50),
      }),
      prisma.notification.count({
        where: { userId: session.user.id, read: false, dismissed: false },
      }),
    ])

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/notifications
 * Mark notifications as read or dismissed.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, notificationIds } = body

    if (!action) {
      return NextResponse.json({ error: 'Action required' }, { status: 400 })
    }

    const where: Record<string, unknown> = { userId: session.user.id }
    if (notificationIds && Array.isArray(notificationIds)) {
      where.id = { in: notificationIds }
    }

    switch (action) {
      case 'markRead':
        await prisma.notification.updateMany({
          where: { ...where, read: false },
          data: { read: true, readAt: new Date() },
        })
        break
      case 'markAllRead':
        await prisma.notification.updateMany({
          where: { userId: session.user.id, read: false },
          data: { read: true, readAt: new Date() },
        })
        break
      case 'dismiss':
        if (!notificationIds) {
          return NextResponse.json({ error: 'notificationIds required for dismiss' }, { status: 400 })
        }
        await prisma.notification.updateMany({
          where,
          data: { dismissed: true },
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, read: false, dismissed: false },
    })

    return NextResponse.json({ success: true, unreadCount })
  } catch (error) {
    console.error('Notifications update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
