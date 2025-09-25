const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await database.findAllJobs()

    // Apply filters if provided
    let filteredJobs = jobs

    if (req.query.status) {
      filteredJobs = filteredJobs.filter(job => job.status === req.query.status)
    }

    if (req.query.companyId) {
      filteredJobs = filteredJobs.filter(job => job.companyId === parseInt(req.query.companyId))
    }

    if (req.query.level) {
      filteredJobs = filteredJobs.filter(job => job.level === req.query.level)
    }

    if (req.query.remote === 'true') {
      filteredJobs = filteredJobs.filter(job => job.remote === true)
    }

    res.json(filteredJobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({
      error: 'Failed to fetch jobs',
      message: error.message
    })
  }
})

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await database.findJobById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        id: req.params.id
      })
    }

    // Increment view count
    job.views = (job.views || 0) + 1

    res.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    res.status(500).json({
      error: 'Failed to fetch job',
      message: error.message
    })
  }
})

// Get job applications
router.get('/:id/applications', async (req, res) => {
  try {
    const job = await database.findJobById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        id: req.params.id
      })
    }

    // For now, return empty array (will implement when we have applications table)
    res.json([])
  } catch (error) {
    console.error('Error fetching applications:', error)
    res.status(500).json({
      error: 'Failed to fetch applications',
      message: error.message
    })
  }
})

// Apply to a job
router.post('/:id/apply', async (req, res) => {
  try {
    const job = await database.findJobById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        id: req.params.id
      })
    }

    // Increment applicants count
    job.applicants = (job.applicants || 0) + 1

    // Here you would typically:
    // 1. Create an application record
    // 2. Send notification to company
    // 3. Send confirmation to applicant

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: Math.random().toString(36).substr(2, 9), // Mock application ID
      jobId: job.id
    })
  } catch (error) {
    console.error('Error applying to job:', error)
    res.status(400).json({
      error: 'Failed to submit application',
      message: error.message
    })
  }
})

// Create a new job
router.post('/', async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      posted: new Date().toISOString(),
      status: 'active',
      applicants: 0,
      views: 0
    }

    const job = await database.createJob(jobData)
    res.status(201).json(job)
  } catch (error) {
    console.error('Error creating job:', error)
    res.status(400).json({
      error: 'Failed to create job',
      message: error.message
    })
  }
})

// Update job
router.put('/:id', async (req, res) => {
  try {
    const job = await database.findJobById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        id: req.params.id
      })
    }

    // Update job properties
    Object.assign(job, req.body, {
      updatedAt: new Date().toISOString()
    })

    res.json(job)
  } catch (error) {
    console.error('Error updating job:', error)
    res.status(400).json({
      error: 'Failed to update job',
      message: error.message
    })
  }
})

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await database.findJobById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        id: req.params.id
      })
    }

    // Soft delete by setting status to 'deleted'
    job.status = 'deleted'
    job.updatedAt = new Date().toISOString()

    res.json({
      success: true,
      message: 'Job deleted successfully',
      id: req.params.id
    })
  } catch (error) {
    console.error('Error deleting job:', error)
    res.status(400).json({
      error: 'Failed to delete job',
      message: error.message
    })
  }
})

module.exports = router