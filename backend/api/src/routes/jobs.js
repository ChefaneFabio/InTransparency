const express = require('express')
const jobController = require('../controllers/jobController')
const { authMiddleware } = require('../middleware/auth')
const { apiRateLimit, strictRateLimit } = require('../middleware/rateLimit')

const router = express.Router()

// Apply rate limiting
router.use(apiRateLimit)

// Public routes (no authentication required)
router.get('/', jobController.getJobs)
router.get('/:id', jobController.getJob)

// Protected routes (authentication required)
router.post('/', authMiddleware, jobController.createJob)
router.put('/:id', authMiddleware, jobController.updateJob)
router.delete('/:id', authMiddleware, jobController.deleteJob)

// Job application routes
router.post('/:id/apply', authMiddleware, jobController.applyToJob)
router.get('/:id/applications', authMiddleware, jobController.getJobApplications)
router.put('/:id/applications/:applicationId/status', authMiddleware, jobController.updateApplicationStatus)

// AI-powered matching (rate limited due to computational cost)
router.get('/:id/matches', authMiddleware, strictRateLimit, jobController.getCandidateMatches)

// User-specific routes
router.get('/user/applications', authMiddleware, jobController.getMyApplications)
router.get('/user/posted', authMiddleware, jobController.getRecruiterJobs)

module.exports = router