import prisma from '@/lib/prisma'

type NotificationType =
  | 'VERIFICATION_UPDATE'
  | 'MESSAGE_RECEIVED'
  | 'BADGE_ISSUED'
  | 'MENTORSHIP_REQUEST'
  | 'EVENT_RSVP'
  | 'REVIEW_POSTED'
  | 'SCORE_UPDATE'
  | 'GENERAL'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  body: string
  link?: string
  groupKey?: string
}

/**
 * Create a notification for a user.
 * Safe to call from any server-side code — silently fails if DB is unavailable.
 */
export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        link: params.link || null,
        groupKey: params.groupKey || null,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
    // Don't throw — notifications are best-effort
  }
}

/**
 * Create notifications for multiple users at once.
 */
export async function createBulkNotifications(
  userIds: string[],
  notification: Omit<CreateNotificationParams, 'userId'>
): Promise<void> {
  try {
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        link: notification.link || null,
        groupKey: notification.groupKey || null,
      })),
    })
  } catch (error) {
    console.error('Failed to create bulk notifications:', error)
  }
}
