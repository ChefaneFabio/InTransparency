const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await database.findAllStudents()

    // Apply filters if provided
    let filteredStudents = students

    if (req.query.universityId) {
      filteredStudents = filteredStudents.filter(student =>
        student.universityId === parseInt(req.query.universityId)
      )
    }

    if (req.query.major) {
      filteredStudents = filteredStudents.filter(student =>
        student.major && student.major.toLowerCase().includes(req.query.major.toLowerCase())
      )
    }

    if (req.query.year) {
      filteredStudents = filteredStudents.filter(student => student.year === req.query.year)
    }

    if (req.query.minAiScore) {
      filteredStudents = filteredStudents.filter(student =>
        (student.aiScore || 0) >= parseInt(req.query.minAiScore)
      )
    }

    res.json(filteredStudents)
  } catch (error) {
    console.error('Error fetching students:', error)
    res.status(500).json({
      error: 'Failed to fetch students',
      message: error.message
    })
  }
})

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found',
        id: req.params.id
      })
    }

    // Increment profile views
    student.profileViews = (student.profileViews || 0) + 1

    // Ensure all required fields exist for frontend
    const formattedStudent = {
      ...student,
      contact: student.contact || {
        email: student.email,
        phone: student.phone || '',
        linkedin: student.linkedin || '',
        github: student.github || '',
        website: student.website || ''
      },
      stats: student.stats || {
        projectsCompleted: student.projects ? student.projects.length : 0,
        githubContributions: 0,
        profileViews: student.profileViews,
        applicationsSent: student.applicationsSent || 0,
        interviewsScheduled: student.interviewsScheduled || 0
      },
      careerPreferences: student.careerPreferences || {
        roles: student.preferredRoles || [],
        industries: [],
        locations: [],
        salaryExpectation: student.salaryExpectation || '',
        workType: student.workPreference || '',
        startDate: student.availability || ''
      }
    }

    res.json(formattedStudent)
  } catch (error) {
    console.error('Error fetching student:', error)
    res.status(500).json({
      error: 'Failed to fetch student',
      message: error.message
    })
  }
})

// Get student's projects
router.get('/:id/projects', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found',
        id: req.params.id
      })
    }

    // Return student's projects or fetch from projects table if linked
    const projects = student.projects || []
    res.json(projects)
  } catch (error) {
    console.error('Error fetching student projects:', error)
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: error.message
    })
  }
})

// Get student's matches (job recommendations)
router.get('/:id/matches', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found',
        id: req.params.id
      })
    }

    // Get all active jobs and calculate match scores
    const jobs = await database.findAllJobs()
    const activeJobs = jobs.filter(job => job.status === 'active')

    // Simple matching algorithm based on skills
    const studentSkills = student.skills || []
    const matches = activeJobs.map(job => {
      const jobSkills = job.skills || []
      let matchScore = 0

      // Calculate skill overlap
      studentSkills.forEach(studentSkill => {
        if (typeof studentSkill === 'object' && studentSkill.name) {
          jobSkills.forEach(jobSkill => {
            if (jobSkill.toLowerCase().includes(studentSkill.name.toLowerCase())) {
              matchScore += 20
            }
          })
        }
      })

      // Bonus points for location match
      if (job.remote || job.hybrid) {
        matchScore += 10
      }

      // Bonus for level match
      if (student.year === 'Senior' && job.level === 'Entry-level') {
        matchScore += 15
      }

      return {
        ...job,
        matchScore: Math.min(100, matchScore)
      }
    })

    // Sort by match score and return top matches
    const topMatches = matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)

    res.json(topMatches)
  } catch (error) {
    console.error('Error fetching student matches:', error)
    res.status(500).json({
      error: 'Failed to fetch matches',
      message: error.message
    })
  }
})

// Create a new student
router.post('/', async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      aiScore: req.body.aiScore || Math.floor(Math.random() * 30) + 70
    }

    const student = await database.createStudent(studentData)
    res.status(201).json(student)
  } catch (error) {
    console.error('Error creating student:', error)
    res.status(400).json({
      error: 'Failed to create student',
      message: error.message
    })
  }
})

// Update student profile
router.put('/:id/profile', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found',
        id: req.params.id
      })
    }

    // Update student properties
    Object.assign(student, req.body, {
      updatedAt: new Date().toISOString()
    })

    res.json(student)
  } catch (error) {
    console.error('Error updating student profile:', error)
    res.status(400).json({
      error: 'Failed to update profile',
      message: error.message
    })
  }
})

// Update student (general)
router.put('/:id', async (req, res) => {
  try {
    const student = await database.findStudentById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found',
        id: req.params.id
      })
    }

    // Update student properties
    Object.assign(student, req.body, {
      updatedAt: new Date().toISOString()
    })

    res.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
    res.status(400).json({
      error: 'Failed to update student',
      message: error.message
    })
  }
})

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    res.status(501).json({
      error: 'Delete functionality not yet implemented'
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    res.status(400).json({
      error: 'Failed to delete student',
      message: error.message
    })
  }
})

module.exports = router