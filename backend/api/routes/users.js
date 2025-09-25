const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    // In real app, get user ID from JWT token
    const mockUserId = 1
    const user = await database.findUserById(mockUserId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Don't send password
    const { password, ...userProfile } = user
    res.json(userProfile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({
      error: 'Failed to fetch user profile',
      message: error.message
    })
  }
})

// Update user profile
router.put('/me', async (req, res) => {
  try {
    const mockUserId = 1
    const user = await database.findUserById(mockUserId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Update user fields
    const allowedFields = [
      'firstName', 'lastName', 'email', 'university', 'company',
      'department', 'graduationYear', 'major', 'bio', 'location',
      'linkedin', 'github', 'website', 'phone'
    ]

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field]
      }
    })

    user.updatedAt = new Date().toISOString()

    const { password, ...updatedProfile } = user
    res.json(updatedProfile)
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(400).json({
      error: 'Failed to update user profile',
      message: error.message
    })
  }
})

// Get user's dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const mockUserId = 1
    const user = await database.findUserById(mockUserId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Get user's stats based on role
    let dashboardData = {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        email: user.email
      }
    }

    if (user.role === 'student') {
      // Student dashboard data
      const student = await database.findStudentById(mockUserId)
      const jobMatches = [] // Would get from matching service

      dashboardData = {
        ...dashboardData,
        stats: {
          profileViews: student?.profileViews || 0,
          applicationsSent: student?.applicationsSent || 0,
          interviewsScheduled: student?.interviewsScheduled || 0,
          aiScore: student?.aiScore || 0
        },
        recentJobMatches: jobMatches.slice(0, 5),
        recentApplications: [], // Would get from applications
        upcomingInterviews: [],
        profileCompleteness: 85
      }
    } else if (user.role === 'recruiter') {
      // Recruiter dashboard data
      const company = await database.findCompanyBySlug('weroad') // Mock company
      const jobs = await database.findJobsByCompany(company?.id || 1)

      dashboardData = {
        ...dashboardData,
        stats: {
          activeJobs: jobs.filter(j => j.status === 'active').length,
          totalApplications: jobs.reduce((sum, job) => sum + (job.applicants || 0), 0),
          shortlistedCandidates: 12,
          interviewsScheduled: 5
        },
        recentJobs: jobs.slice(0, 5),
        recentApplications: [],
        topCandidates: [],
        companyStats: company ? {
          name: company.name,
          rating: company.stats?.rating || 0,
          employees: company.stats?.employees || 0
        } : null
      }
    }

    res.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: error.message
    })
  }
})

// Get user's notifications
router.get('/notifications', async (req, res) => {
  try {
    const mockNotifications = [
      {
        id: 1,
        type: 'application_status',
        title: 'Application Update',
        message: 'Your application for Full Stack Developer at WeRoad has been reviewed',
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          jobId: 1,
          applicationId: 1,
          status: 'reviewed'
        }
      },
      {
        id: 2,
        type: 'job_match',
        title: 'New Job Match',
        message: 'We found 3 new jobs that match your profile',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        data: {
          matchCount: 3
        }
      },
      {
        id: 3,
        type: 'profile_view',
        title: 'Profile Viewed',
        message: 'A recruiter from Google viewed your profile',
        read: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        data: {
          company: 'Google'
        }
      }
    ]

    res.json({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter(n => !n.read).length
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({
      error: 'Failed to fetch notifications',
      message: error.message
    })
  }
})

// Mark notification as read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Notification marked as read'
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(400).json({
      error: 'Failed to mark notification as read',
      message: error.message
    })
  }
})

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    const preferences = {
      emailNotifications: req.body.emailNotifications !== false,
      pushNotifications: req.body.pushNotifications !== false,
      jobAlerts: req.body.jobAlerts !== false,
      weeklyDigest: req.body.weeklyDigest !== false,
      profileVisibility: req.body.profileVisibility || 'public',
      theme: req.body.theme || 'light'
    }

    res.json({
      success: true,
      preferences
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    res.status(400).json({
      error: 'Failed to update preferences',
      message: error.message
    })
  }
})

// Get user's saved items (jobs, companies, etc.)
router.get('/saved', async (req, res) => {
  try {
    const { type } = req.query

    const savedItems = {
      jobs: [
        {
          id: 1,
          title: 'Full Stack Developer',
          company: 'WeRoad',
          location: 'Milan',
          savedAt: new Date().toISOString()
        }
      ],
      companies: [
        {
          id: 1,
          name: 'WeRoad',
          industry: 'Travel & Tourism',
          savedAt: new Date().toISOString()
        }
      ],
      students: [] // For recruiters
    }

    if (type && savedItems[type]) {
      res.json({ [type]: savedItems[type] })
    } else {
      res.json(savedItems)
    }
  } catch (error) {
    console.error('Error fetching saved items:', error)
    res.status(500).json({
      error: 'Failed to fetch saved items',
      message: error.message
    })
  }
})

// Save/unsave an item
router.post('/saved', async (req, res) => {
  try {
    const { type, itemId, action = 'save' } = req.body

    res.json({
      success: true,
      message: `Item ${action === 'save' ? 'saved' : 'removed'}`,
      type,
      itemId,
      action
    })
  } catch (error) {
    console.error('Error saving/unsaving item:', error)
    res.status(400).json({
      error: 'Failed to update saved items',
      message: error.message
    })
  }
})

module.exports = router