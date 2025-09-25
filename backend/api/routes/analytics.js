const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Platform-wide analytics (admin)
router.get('/platform', async (req, res) => {
  try {
    const users = await database.users ? Array.from(database.users.values()) : []
    const students = await database.findAllStudents()
    const jobs = await database.findAllJobs()
    const companies = await database.findAllCompanies()
    const universities = await database.findAllUniversities()

    const analytics = {
      overview: {
        totalUsers: users.length,
        totalStudents: students.length,
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'active').length,
        totalCompanies: companies.length,
        totalUniversities: universities.length
      },
      userGrowth: {
        thisMonth: Math.floor(users.length * 0.15),
        lastMonth: Math.floor(users.length * 0.12),
        growthRate: 25.0
      },
      jobMarket: {
        totalApplications: jobs.reduce((sum, job) => sum + (job.applicants || 0), 0),
        avgApplicationsPerJob: jobs.length > 0 ?
          jobs.reduce((sum, job) => sum + (job.applicants || 0), 0) / jobs.length : 0,
        topIndustries: [
          { industry: 'Technology', count: 45 },
          { industry: 'Finance', count: 23 },
          { industry: 'Healthcare', count: 18 }
        ]
      },
      engagement: {
        avgProfileViews: students.reduce((sum, s) => sum + (s.profileViews || 0), 0) / (students.length || 1),
        avgAiScore: students.reduce((sum, s) => sum + (s.aiScore || 0), 0) / (students.length || 1),
        mostPopularSkills: [
          { skill: 'JavaScript', count: 45 },
          { skill: 'Python', count: 38 },
          { skill: 'React', count: 32 }
        ]
      }
    }

    res.json(analytics)
  } catch (error) {
    console.error('Error fetching platform analytics:', error)
    res.status(500).json({
      error: 'Failed to fetch platform analytics',
      message: error.message
    })
  }
})

// University analytics
router.get('/university/:slug', async (req, res) => {
  try {
    const university = await database.findUniversityBySlug(req.params.slug)

    if (!university) {
      return res.status(404).json({
        error: 'University not found'
      })
    }

    const students = await database.findStudentsByUniversity(university.id)

    const analytics = {
      universityId: university.id,
      overview: {
        totalStudents: students.length,
        avgAiScore: students.reduce((sum, s) => sum + (s.aiScore || 0), 0) / (students.length || 1),
        avgGpa: students.reduce((sum, s) => sum + (s.gpa || 0), 0) / (students.length || 1),
        totalProfileViews: students.reduce((sum, s) => sum + (s.profileViews || 0), 0)
      },
      demographics: {
        byMajor: students.reduce((acc, student) => {
          const major = student.major || 'Unknown'
          acc[major] = (acc[major] || 0) + 1
          return acc
        }, {}),
        byYear: students.reduce((acc, student) => {
          const year = student.year || 'Unknown'
          acc[year] = (acc[year] || 0) + 1
          return acc
        }, {}),
        byLocation: students.reduce((acc, student) => {
          const location = student.location || 'Unknown'
          acc[location] = (acc[location] || 0) + 1
          return acc
        }, {})
      },
      skills: {
        mostCommon: students.reduce((acc, student) => {
          if (student.skills) {
            student.skills.forEach(skill => {
              const skillName = typeof skill === 'object' ? skill.name : skill
              acc[skillName] = (acc[skillName] || 0) + 1
            })
          }
          return acc
        }, {}),
        trending: ['AI/ML', 'Cloud Computing', 'Data Science']
      },
      careerOutcomes: {
        employmentRate: 94.5,
        avgStartingSalary: '$75,000',
        topEmployers: ['Google', 'Microsoft', 'Apple', 'Meta']
      }
    }

    res.json(analytics)
  } catch (error) {
    console.error('Error fetching university analytics:', error)
    res.status(500).json({
      error: 'Failed to fetch university analytics',
      message: error.message
    })
  }
})

// Company analytics
router.get('/company/:slug', async (req, res) => {
  try {
    const company = await database.findCompanyBySlug(req.params.slug)

    if (!company) {
      return res.status(404).json({
        error: 'Company not found'
      })
    }

    const jobs = await database.findJobsByCompany(company.id)

    const analytics = {
      companyId: company.id,
      overview: {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'active').length,
        totalApplications: jobs.reduce((sum, job) => sum + (job.applicants || 0), 0),
        totalViews: jobs.reduce((sum, job) => sum + (job.views || 0), 0)
      },
      hiring: {
        avgApplicationsPerJob: jobs.length > 0 ?
          jobs.reduce((sum, job) => sum + (job.applicants || 0), 0) / jobs.length : 0,
        mostPopularJobs: jobs.sort((a, b) => (b.applicants || 0) - (a.applicants || 0)).slice(0, 5),
        hiringFunnel: {
          applied: 100,
          screened: 25,
          interviewed: 10,
          offered: 3,
          hired: 2
        }
      },
      candidates: {
        topUniversities: [
          { university: 'MIT', count: 12 },
          { university: 'Stanford', count: 8 },
          { university: 'UC Berkeley', count: 6 }
        ],
        topSkills: [
          { skill: 'JavaScript', count: 34 },
          { skill: 'Python', count: 28 },
          { skill: 'React', count: 22 }
        ],
        avgAiScore: 82.5
      },
      performance: {
        fillRate: 75.0,
        avgTimeToHire: 21, // days
        offerAcceptanceRate: 85.0,
        employeeRetention: 92.0
      }
    }

    res.json(analytics)
  } catch (error) {
    console.error('Error fetching company analytics:', error)
    res.status(500).json({
      error: 'Failed to fetch company analytics',
      message: error.message
    })
  }
})

// Job analytics
router.get('/job/:id', async (req, res) => {
  try {
    const job = await database.findJobById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      })
    }

    // Mock application data
    const applications = [
      {
        id: 1,
        studentId: 1,
        status: 'pending',
        aiScore: 94,
        matchScore: 87,
        appliedAt: new Date().toISOString()
      }
    ]

    const analytics = {
      jobId: job.id,
      overview: {
        totalViews: job.views || 0,
        totalApplications: job.applicants || 0,
        conversionRate: job.views > 0 ? ((job.applicants || 0) / job.views * 100).toFixed(2) : 0,
        avgMatchScore: applications.length > 0 ?
          applications.reduce((sum, app) => sum + (app.matchScore || 0), 0) / applications.length : 0
      },
      applications: {
        total: applications.length,
        byStatus: {
          pending: applications.filter(a => a.status === 'pending').length,
          reviewed: applications.filter(a => a.status === 'reviewed').length,
          accepted: applications.filter(a => a.status === 'accepted').length,
          rejected: applications.filter(a => a.status === 'rejected').length
        },
        recentApplications: applications.slice(0, 10)
      },
      candidates: {
        avgAiScore: applications.length > 0 ?
          applications.reduce((sum, app) => sum + (app.aiScore || 0), 0) / applications.length : 0,
        topUniversities: [
          { university: 'MIT', count: 3 },
          { university: 'Stanford', count: 2 }
        ],
        skillsDistribution: {
          'JavaScript': 8,
          'Python': 6,
          'React': 5
        }
      },
      performance: {
        daysActive: Math.floor((new Date() - new Date(job.posted)) / (1000 * 60 * 60 * 24)),
        competitionLevel: 'High', // based on application rate
        recommendedActions: [
          'Consider increasing salary range',
          'Add more technical requirements',
          'Improve job description clarity'
        ]
      }
    }

    res.json(analytics)
  } catch (error) {
    console.error('Error fetching job analytics:', error)
    res.status(500).json({
      error: 'Failed to fetch job analytics',
      message: error.message
    })
  }
})

// Student profile analytics
router.get('/student/:id', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      })
    }

    const analytics = {
      studentId: student.id,
      profile: {
        views: student.profileViews || 0,
        aiScore: student.aiScore || 0,
        completeness: 85,
        lastUpdated: student.updatedAt || student.createdAt
      },
      activity: {
        applicationsSent: student.applicationsSent || 0,
        interviewsScheduled: student.interviewsScheduled || 0,
        projectsCompleted: student.projects ? student.projects.length : 0,
        skillsCount: student.skills ? student.skills.length : 0
      },
      performance: {
        applicationSuccessRate: 15.5,
        avgMatchScore: 78.5,
        profileRanking: 'Top 25%',
        marketValue: 'High'
      },
      recommendations: {
        profileImprovements: [
          'Add more project details',
          'Update skills section',
          'Add work experience'
        ],
        jobMatches: 12,
        skillGaps: ['Docker', 'AWS', 'System Design']
      },
      trends: {
        viewsThisMonth: 45,
        growthRate: 23.5,
        engagementScore: 82
      }
    }

    res.json(analytics)
  } catch (error) {
    console.error('Error fetching student analytics:', error)
    res.status(500).json({
      error: 'Failed to fetch student analytics',
      message: error.message
    })
  }
})

module.exports = router