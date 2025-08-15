const express = require('express')
const analyticsController = require('../controllers/analyticsController')
const { authMiddleware } = require('../middleware/auth')
const { apiRateLimit, strictRateLimit } = require('../middleware/rateLimit')

const router = express.Router()

// Apply rate limiting
router.use(apiRateLimit)

// All analytics routes require authentication
router.use(authMiddleware)

// User analytics (available to all authenticated users)
router.get('/user', analyticsController.getUserAnalytics)

// University analytics (university staff only)
router.get('/university', analyticsController.getUniversityAnalytics)

// Platform analytics (admin only)
router.get('/platform', analyticsController.getPlatformAnalytics)

// Market insights (rate limited due to AI usage)
router.get('/market-trends', strictRateLimit, analyticsController.getMarketTrends)
router.get('/skills-gap', strictRateLimit, analyticsController.getSkillsGapAnalysis)

// Data export (heavily rate limited)
router.get('/export', strictRateLimit, analyticsController.exportAnalytics)

module.exports = router