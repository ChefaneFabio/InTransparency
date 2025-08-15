const express = require('express')
const notificationController = require('../controllers/notificationController')
const { authMiddleware } = require('../middleware/auth')
const { apiRateLimit, strictRateLimit } = require('../middleware/rateLimit')

const router = express.Router()

// Apply rate limiting
router.use(apiRateLimit)

// All notification routes require authentication
router.use(authMiddleware)

// User notification management
router.get('/', notificationController.getNotifications)
router.put('/:id/read', notificationController.markAsRead)
router.put('/read-all', notificationController.markAllAsRead)
router.delete('/:id', notificationController.deleteNotification)

// Notification preferences
router.get('/preferences', notificationController.getPreferences)
router.put('/preferences', notificationController.updatePreferences)

// Admin-only routes
router.post('/bulk', strictRateLimit, notificationController.sendBulkNotifications)
router.get('/stats', notificationController.getNotificationStats)

module.exports = router