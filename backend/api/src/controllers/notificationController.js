const { v4: uuidv4 } = require('uuid')
const db = require('../config/database')
const { sendEmail } = require('../services/emailService')

class NotificationController {
  // Get user notifications
  async getNotifications(req, res) {
    try {
      const userId = req.user.id
      const { 
        page = 1, 
        limit = 20, 
        unread_only = false,
        type 
      } = req.query

      const offset = (page - 1) * limit

      let query = db('notifications')
        .select([
          'id',
          'type',
          'title',
          'message',
          'data',
          'is_read',
          'created_at'
        ])
        .where('user_id', userId)
        .orderBy('created_at', 'desc')

      if (unread_only === 'true') {
        query = query.where('is_read', false)
      }

      if (type) {
        query = query.where('type', type)
      }

      // Get total count
      const totalQuery = query.clone().clearSelect().count('* as count')
      const [{ count: total }] = await totalQuery

      // Get notifications with pagination
      const notifications = await query.limit(limit).offset(offset)

      // Process notifications
      const processedNotifications = notifications.map(notification => ({
        ...notification,
        data: notification.data ? JSON.parse(notification.data) : null
      }))

      // Get unread count
      const unreadCount = await db('notifications')
        .where('user_id', userId)
        .where('is_read', false)
        .count('* as count')
        .first()

      res.json({
        success: true,
        data: {
          notifications: processedNotifications,
          unread_count: parseInt(unreadCount.count),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      console.error('Get notifications error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications'
      })
    }
  }

  // Mark notification as read
  async markAsRead(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Verify notification belongs to user
      const notification = await db('notifications')
        .where('id', id)
        .where('user_id', userId)
        .first()

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        })
      }

      // Update notification
      await db('notifications')
        .where('id', id)
        .update({
          is_read: true,
          read_at: new Date(),
          updated_at: new Date()
        })

      res.json({
        success: true,
        message: 'Notification marked as read'
      })
    } catch (error) {
      console.error('Mark notification as read error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read'
      })
    }
  }

  // Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id

      await db('notifications')
        .where('user_id', userId)
        .where('is_read', false)
        .update({
          is_read: true,
          read_at: new Date(),
          updated_at: new Date()
        })

      res.json({
        success: true,
        message: 'All notifications marked as read'
      })
    } catch (error) {
      console.error('Mark all as read error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read'
      })
    }
  }

  // Delete notification
  async deleteNotification(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Verify notification belongs to user
      const notification = await db('notifications')
        .where('id', id)
        .where('user_id', userId)
        .first()

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        })
      }

      // Delete notification
      await db('notifications')
        .where('id', id)
        .del()

      res.json({
        success: true,
        message: 'Notification deleted'
      })
    } catch (error) {
      console.error('Delete notification error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete notification'
      })
    }
  }

  // Get notification preferences
  async getPreferences(req, res) {
    try {
      const userId = req.user.id

      let preferences = await db('notification_preferences')
        .where('user_id', userId)
        .first()

      if (!preferences) {
        // Create default preferences
        const defaultPreferences = {
          id: uuidv4(),
          user_id: userId,
          email_enabled: true,
          push_enabled: true,
          job_applications: true,
          application_updates: true,
          new_job_matches: true,
          project_interactions: true,
          system_updates: false,
          marketing: false,
          created_at: new Date(),
          updated_at: new Date()
        }

        await db('notification_preferences').insert(defaultPreferences)
        preferences = defaultPreferences
      }

      res.json({
        success: true,
        data: { preferences }
      })
    } catch (error) {
      console.error('Get preferences error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notification preferences'
      })
    }
  }

  // Update notification preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id
      const {
        emailEnabled,
        pushEnabled,
        jobApplications,
        applicationUpdates,
        newJobMatches,
        projectInteractions,
        systemUpdates,
        marketing
      } = req.body

      const updateData = {
        email_enabled: emailEnabled,
        push_enabled: pushEnabled,
        job_applications: jobApplications,
        application_updates: applicationUpdates,
        new_job_matches: newJobMatches,
        project_interactions: projectInteractions,
        system_updates: systemUpdates,
        marketing: marketing,
        updated_at: new Date()
      }

      // Update or create preferences
      const existingPreferences = await db('notification_preferences')
        .where('user_id', userId)
        .first()

      if (existingPreferences) {
        await db('notification_preferences')
          .where('user_id', userId)
          .update(updateData)
      } else {
        await db('notification_preferences').insert({
          id: uuidv4(),
          user_id: userId,
          ...updateData,
          created_at: new Date()
        })
      }

      res.json({
        success: true,
        message: 'Notification preferences updated'
      })
    } catch (error) {
      console.error('Update preferences error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update notification preferences'
      })
    }
  }

  // Send notification (internal method, used by other controllers)
  static async createNotification(userId, type, title, message, data = null, sendEmail = false) {
    try {
      const notificationId = uuidv4()
      
      const notificationData = {
        id: notificationId,
        user_id: userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }

      await db('notifications').insert(notificationData)

      // Send email if requested and user has email notifications enabled
      if (sendEmail) {
        try {
          const preferences = await db('notification_preferences')
            .where('user_id', userId)
            .first()

          if (!preferences || preferences.email_enabled) {
            const user = await db('users')
              .select('email', 'first_name')
              .where('id', userId)
              .first()

            if (user) {
              await sendEmail({
                to: user.email,
                subject: title,
                template: 'notification',
                data: {
                  firstName: user.first_name,
                  title,
                  message,
                  actionData: data
                }
              })
            }
          }
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError)
          // Don't fail the notification creation if email fails
        }
      }

      // Emit real-time notification via WebSocket if available
      const io = global.io
      if (io) {
        io.to(`user_${userId}`).emit('notification', {
          id: notificationId,
          type,
          title,
          message,
          data,
          created_at: new Date()
        })
      }

      return notificationId
    } catch (error) {
      console.error('Create notification error:', error)
      throw error
    }
  }

  // Bulk send notifications (admin only)
  async sendBulkNotifications(req, res) {
    try {
      // Verify admin access
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        })
      }

      const {
        userIds,
        type,
        title,
        message,
        data,
        sendEmail = false
      } = req.body

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'User IDs array is required'
        })
      }

      if (!type || !title || !message) {
        return res.status(400).json({
          success: false,
          error: 'Type, title, and message are required'
        })
      }

      // Create notifications for all users
      const notifications = userIds.map(userId => ({
        id: uuidv4(),
        user_id: userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }))

      await db('notifications').insert(notifications)

      // Send emails if requested
      if (sendEmail) {
        try {
          const users = await db('users')
            .select('id', 'email', 'first_name')
            .whereIn('id', userIds)
            .where('is_active', true)

          const emailPromises = users.map(user => 
            sendEmail({
              to: user.email,
              subject: title,
              template: 'notification',
              data: {
                firstName: user.first_name,
                title,
                message,
                actionData: data
              }
            }).catch(err => {
              console.error(`Failed to send email to ${user.email}:`, err)
            })
          )

          await Promise.allSettled(emailPromises)
        } catch (emailError) {
          console.error('Bulk email error:', emailError)
        }
      }

      res.json({
        success: true,
        message: `Notifications sent to ${userIds.length} users`
      })
    } catch (error) {
      console.error('Send bulk notifications error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to send bulk notifications'
      })
    }
  }

  // Get notification statistics (admin only)
  async getNotificationStats(req, res) {
    try {
      // Verify admin access
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        })
      }

      const { timeframe = '30d' } = req.query

      let dateFilter = new Date()
      switch (timeframe) {
        case '7d':
          dateFilter.setDate(dateFilter.getDate() - 7)
          break
        case '30d':
          dateFilter.setDate(dateFilter.getDate() - 30)
          break
        case '90d':
          dateFilter.setDate(dateFilter.getDate() - 90)
          break
        default:
          dateFilter.setDate(dateFilter.getDate() - 30)
      }

      // Get notification statistics
      const stats = await db('notifications')
        .select([
          db.raw('COUNT(*) as total_notifications'),
          db.raw('COUNT(CASE WHEN is_read = true THEN 1 END) as read_notifications'),
          db.raw('COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications'),
          db.raw('ROUND(COUNT(CASE WHEN is_read = true THEN 1 END) * 100.0 / COUNT(*), 2) as read_rate')
        ])
        .where('created_at', '>=', dateFilter)
        .first()

      // Get notifications by type
      const typeDistribution = await db('notifications')
        .select('type')
        .count('* as count')
        .where('created_at', '>=', dateFilter)
        .groupBy('type')
        .orderBy('count', 'desc')

      // Get daily notification volume
      const dailyVolume = await db('notifications')
        .select([
          db.raw('DATE(created_at) as date'),
          db.raw('COUNT(*) as count')
        ])
        .where('created_at', '>=', dateFilter)
        .groupBy(db.raw('DATE(created_at)'))
        .orderBy('date')

      res.json({
        success: true,
        data: {
          timeframe,
          overview: stats,
          type_distribution: typeDistribution,
          daily_volume: dailyVolume
        }
      })
    } catch (error) {
      console.error('Get notification stats error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notification statistics'
      })
    }
  }
}

module.exports = new NotificationController()
module.exports.createNotification = NotificationController.createNotification