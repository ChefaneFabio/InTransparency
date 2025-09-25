const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Get all universities
router.get('/', async (req, res) => {
  try {
    const universities = await database.findAllUniversities()
    res.json(universities)
  } catch (error) {
    console.error('Error fetching universities:', error)
    res.status(500).json({
      error: 'Failed to fetch universities',
      message: error.message
    })
  }
})

// Get university by slug
router.get('/:slug', async (req, res) => {
  try {
    const university = await database.findUniversityBySlug(req.params.slug)

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        slug: req.params.slug
      })
    }

    // Format response to match frontend expectations
    const formattedUniversity = {
      ...university,
      ranking: university.ranking || { global: 0, national: 0, engineering: 0 },
      location: university.location || { city: '', state: '', country: '' },
      stats: university.stats || {
        students: 0,
        undergrad: 0,
        graduate: 0,
        faculty: 0,
        internationalStudents: 0,
        acceptanceRate: 0
      }
    }

    res.json(formattedUniversity)
  } catch (error) {
    console.error('Error fetching university:', error)
    res.status(500).json({
      error: 'Failed to fetch university',
      message: error.message
    })
  }
})

// Get students from a university
router.get('/:slug/students', async (req, res) => {
  try {
    const university = await database.findUniversityBySlug(req.params.slug)

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        slug: req.params.slug
      })
    }

    const students = await database.findStudentsByUniversity(university.id)
    res.json(students)
  } catch (error) {
    console.error('Error fetching university students:', error)
    res.status(500).json({
      error: 'Failed to fetch students',
      message: error.message
    })
  }
})

// Get university analytics
router.get('/:slug/analytics', async (req, res) => {
  try {
    const university = await database.findUniversityBySlug(req.params.slug)

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        slug: req.params.slug
      })
    }

    const students = await database.findStudentsByUniversity(university.id)

    // Calculate analytics
    const analytics = {
      totalStudents: students.length,
      avgAiScore: students.reduce((sum, s) => sum + (s.aiScore || 0), 0) / (students.length || 1),
      topMajors: {},
      employmentStatus: {
        employed: 0,
        seeking: 0,
        studying: students.length
      },
      averageGPA: students.reduce((sum, s) => sum + (s.gpa || 0), 0) / (students.length || 1)
    }

    // Count majors
    students.forEach(student => {
      if (student.major) {
        analytics.topMajors[student.major] = (analytics.topMajors[student.major] || 0) + 1
      }
    })

    res.json(analytics)
  } catch (error) {
    console.error('Error fetching university analytics:', error)
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    })
  }
})

// Create a new university
router.post('/', async (req, res) => {
  try {
    const university = await database.createUniversity(req.body)
    res.status(201).json(university)
  } catch (error) {
    console.error('Error creating university:', error)
    res.status(400).json({
      error: 'Failed to create university',
      message: error.message
    })
  }
})

// Update university (placeholder for now)
router.put('/:id', async (req, res) => {
  res.status(501).json({
    error: 'Update functionality not yet implemented'
  })
})

// Delete university (placeholder for now)
router.delete('/:id', async (req, res) => {
  res.status(501).json({
    error: 'Delete functionality not yet implemented'
  })
})

module.exports = router