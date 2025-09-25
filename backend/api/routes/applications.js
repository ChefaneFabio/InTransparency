const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Get all applications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    // Mock application data - would come from applications table in real DB
    const applications = [
      {
        id: 1,
        userId: parseInt(req.params.userId),
        jobId: 1,
        status: 'pending', // pending, reviewed, accepted, rejected
        appliedAt: new Date().toISOString(),
        coverLetter: 'I am very interested in this position...',
        resumeUrl: '/files/resume-user1.pdf',
        customFields: {
          portfolio: 'https://myportfolio.com',
          expectedSalary: '€50,000'
        },
        job: {
          id: 1,
          title: 'Full Stack Developer',
          company: 'WeRoad',
          location: 'Milan'
        }
      }
    ]

    res.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    res.status(500).json({
      error: 'Failed to fetch applications',
      message: error.message
    })
  }
})

// Get all applications for a job (for recruiters)
router.get('/job/:jobId', async (req, res) => {
  try {
    // Mock data - filter by job ID
    const applications = [
      {
        id: 1,
        jobId: parseInt(req.params.jobId),
        applicant: {
          id: 1,
          name: 'Alex Chen',
          email: 'alex@example.com',
          university: 'MIT',
          aiScore: 94
        },
        status: 'pending',
        appliedAt: new Date().toISOString(),
        resumeUrl: '/files/resume-alex.pdf'
      }
    ]

    res.json(applications)
  } catch (error) {
    console.error('Error fetching job applications:', error)
    res.status(500).json({
      error: 'Failed to fetch job applications',
      message: error.message
    })
  }
})

// Create new application
router.post('/', async (req, res) => {
  try {
    const applicationData = {
      id: Math.floor(Math.random() * 10000),
      ...req.body,
      status: 'pending',
      appliedAt: new Date().toISOString()
    }

    // Here you would save to applications table
    res.status(201).json(applicationData)
  } catch (error) {
    console.error('Error creating application:', error)
    res.status(400).json({
      error: 'Failed to create application',
      message: error.message
    })
  }
})

// Update application status (for recruiters)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, feedback } = req.body

    const application = {
      id: parseInt(req.params.id),
      status,
      feedback,
      updatedAt: new Date().toISOString()
    }

    res.json(application)
  } catch (error) {
    console.error('Error updating application status:', error)
    res.status(400).json({
      error: 'Failed to update application',
      message: error.message
    })
  }
})

// Withdraw application
router.delete('/:id', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Application withdrawn successfully',
      id: req.params.id
    })
  } catch (error) {
    console.error('Error withdrawing application:', error)
    res.status(400).json({
      error: 'Failed to withdraw application',
      message: error.message
    })
  }
})

module.exports = router