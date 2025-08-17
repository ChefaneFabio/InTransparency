const express = require('express')
const database = require('../database/Database')
const { authenticate, authorize, checkOwnership } = require('../middleware/auth')
const router = express.Router()

// Get all courses for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId
    const { semester, year, category, completed } = req.query
    
    let courses = await database.findCoursesByUserId(userId)
    
    // Apply filters
    if (semester) {
      courses = courses.filter(course => course.semester === semester)
    }
    
    if (year) {
      courses = courses.filter(course => course.year === parseInt(year))
    }
    
    if (category) {
      courses = courses.filter(course => course.category === category)
    }
    
    if (completed !== undefined) {
      const isCompleted = completed === 'true'
      courses = courses.filter(course => course.isCompleted === isCompleted)
    }
    
    res.json({
      success: true,
      data: {
        courses,
        total: courses.length
      }
    })
  } catch (error) {
    console.error('Get courses error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get courses'
    })
  }
})

// Get single course by ID
router.get('/:id', authenticate, checkOwnership('course'), async (req, res) => {
  try {
    const course = req.resource
    
    res.json({
      success: true,
      data: {
        course
      }
    })
  } catch (error) {
    console.error('Get course error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get course'
    })
  }
})

// Create new course
router.post('/', authenticate, authorize('student'), async (req, res) => {
  try {
    const userId = req.userId
    const {
      courseCode,
      courseName,
      semester,
      year,
      grade,
      credits,
      instructor,
      description,
      category,
      isCompleted,
      projects,
      skills
    } = req.body

    const course = await database.createCourse({
      userId,
      courseCode: courseCode?.trim(),
      courseName: courseName?.trim(),
      semester,
      year: year ? parseInt(year) : null,
      grade: grade?.trim(),
      credits: credits ? parseFloat(credits) : 0,
      instructor: instructor?.trim(),
      description: description?.trim(),
      category: category || 'other',
      isCompleted: Boolean(isCompleted),
      projects: projects || [],
      skills: skills || []
    })

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        course
      }
    })
  } catch (error) {
    console.error('Create course error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Update course
router.put('/:id', authenticate, checkOwnership('course'), async (req, res) => {
  try {
    const courseId = parseInt(req.params.id)
    const updates = req.body

    // Remove fields that shouldn't be updated
    delete updates.id
    delete updates.userId
    delete updates.createdAt

    // Parse numeric fields
    if (updates.year) {
      updates.year = parseInt(updates.year)
    }
    if (updates.credits) {
      updates.credits = parseFloat(updates.credits)
    }

    const updatedCourse = await database.updateCourse(courseId, updates)
    
    res.json({
      success: true,
      message: 'Course updated successfully',
      data: {
        course: updatedCourse
      }
    })
  } catch (error) {
    console.error('Update course error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Delete course
router.delete('/:id', authenticate, checkOwnership('course'), async (req, res) => {
  try {
    const courseId = parseInt(req.params.id)
    
    await database.deleteCourse(courseId)
    
    res.json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.error('Delete course error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Bulk upload courses (for transcript imports)
router.post('/bulk', authenticate, authorize('student'), async (req, res) => {
  try {
    const userId = req.userId
    const { courses } = req.body

    if (!Array.isArray(courses)) {
      return res.status(400).json({
        success: false,
        error: 'Courses must be an array'
      })
    }

    const createdCourses = []
    const errors = []

    for (let i = 0; i < courses.length; i++) {
      try {
        const courseData = { ...courses[i], userId }
        const course = await database.createCourse(courseData)
        createdCourses.push(course)
      } catch (error) {
        errors.push({
          index: i,
          course: courses[i],
          error: error.message
        })
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdCourses.length} courses`,
      data: {
        courses: createdCourses,
        errors: errors
      }
    })
  } catch (error) {
    console.error('Bulk upload error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Bulk upload failed'
    })
  }
})

// Get course analytics
router.get('/:id/analytics', authenticate, checkOwnership('course'), async (req, res) => {
  try {
    const course = req.resource
    
    // Get related projects
    const userProjects = await database.findProjectsByUserId(req.userId)
    const courseProjects = userProjects.filter(p => p.courseId === course.id)
    
    const analytics = {
      course: course,
      projects: {
        total: courseProjects.length,
        published: courseProjects.filter(p => p.status === 'published').length,
        technologies: [...new Set(courseProjects.flatMap(p => p.technologies))],
        avgComplexity: courseProjects.length > 0 ? 
          courseProjects.reduce((sum, p) => {
            const complexity = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 }
            return sum + (complexity[p.complexityLevel] || 1)
          }, 0) / courseProjects.length : 0
      },
      skills: course.skills,
      gpaContribution: course.getGpaPoints()
    }
    
    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Course analytics error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get course analytics'
    })
  }
})

module.exports = router