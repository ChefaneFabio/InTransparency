const express = require('express')
const router = express.Router()
const { seedEuropeanData } = require('../scripts/seed-european-universities')
const { seedGlobalExpansion } = require('../scripts/seed-global-expansion')
const { seedMassiveExpansion } = require('../scripts/seed-massive-expansion')

// Seed European universities and students
router.post('/seed-european-data', async (req, res) => {
  try {
    console.log('🌍 Starting European data seeding via API...')

    await seedEuropeanData()

    res.json({
      success: true,
      message: 'European universities and students data seeded successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error seeding European data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to seed European data',
      message: error.message
    })
  }
})

// Seed global universities, companies, and jobs
router.post('/seed-global-expansion', async (req, res) => {
  try {
    console.log('🌍 Starting global expansion seeding via API...')

    await seedGlobalExpansion()

    res.json({
      success: true,
      message: 'Global universities, companies, jobs, and students data seeded successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error seeding global expansion:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to seed global expansion data',
      message: error.message
    })
  }
})

// Seed massive global dataset (100+ universities, 50+ companies, diverse industries)
router.post('/seed-massive-expansion', async (req, res) => {
  try {
    console.log('🌍 Starting massive global expansion seeding via API...')

    await seedMassiveExpansion()

    res.json({
      success: true,
      message: 'Massive global dataset seeded successfully - 100+ universities, 50+ companies across 15+ industries',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error seeding massive expansion:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to seed massive expansion data',
      message: error.message
    })
  }
})

// Get seeding status/stats
router.get('/stats', async (req, res) => {
  try {
    const database = require('../database/Database')

    const universities = await database.findAllUniversities()
    const students = await database.findAllStudents()
    const jobs = await database.findAllJobs()
    const companies = await database.findAllCompanies()

    const stats = {
      universities: {
        total: universities.length,
        byCountry: universities.reduce((acc, uni) => {
          const country = uni.location?.country || 'Unknown'
          acc[country] = (acc[country] || 0) + 1
          return acc
        }, {})
      },
      students: {
        total: students.length,
        byUniversity: students.reduce((acc, student) => {
          const uni = student.university || 'Unknown'
          acc[uni] = (acc[uni] || 0) + 1
          return acc
        }, {}),
        avgAiScore: students.reduce((sum, s) => sum + (s.aiScore || 0), 0) / (students.length || 1)
      },
      jobs: {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'active').length
      },
      companies: {
        total: companies.length,
        byCountry: companies.reduce((acc, comp) => {
          const country = comp.headquarters?.split(', ').pop() || 'Unknown'
          acc[country] = (acc[country] || 0) + 1
          return acc
        }, {})
      }
    }

    res.json(stats)
  } catch (error) {
    console.error('Error getting stats:', error)
    res.status(500).json({
      error: 'Failed to get stats',
      message: error.message
    })
  }
})

// Clear all data (for testing)
router.delete('/clear-all', async (req, res) => {
  try {
    const database = require('../database/Database')

    // Clear all maps
    database.universities.clear()
    database.students.clear()
    database.jobs.clear()
    database.companies.clear()

    // Reset counters
    database.universityIdCounter = 1
    database.studentIdCounter = 1
    database.jobIdCounter = 1
    database.companyIdCounter = 1

    res.json({
      success: true,
      message: 'All data cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing data:', error)
    res.status(500).json({
      error: 'Failed to clear data',
      message: error.message
    })
  }
})

module.exports = router