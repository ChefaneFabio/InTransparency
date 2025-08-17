const express = require('express')
const database = require('../database/Database')
const { authenticate, authorize, checkOwnership, optionalAuth } = require('../middleware/auth')
const router = express.Router()

// Get all projects (public view with optional auth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      search, 
      category, 
      technology, 
      complexityLevel,
      userId,
      limit = 20,
      page = 1
    } = req.query

    let projects = []

    if (userId && req.userId && parseInt(userId) === req.userId) {
      // User requesting their own projects
      projects = await database.findProjectsByUserId(req.userId)
    } else {
      // Public projects only
      const filters = {
        category,
        technology,
        complexityLevel
      }
      
      projects = await database.searchProjects(search, filters)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedProjects = projects.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: {
        projects: paginatedProjects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: projects.length,
          totalPages: Math.ceil(projects.length / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get projects error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get projects'
    })
  }
})

// Get single project by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id)
    const project = await database.findProjectById(projectId)
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    // Check if user can view this project
    const canView = project.isPublic || 
                   (req.userId && project.userId === req.userId) ||
                   (req.user && req.user.role === 'admin')

    if (!canView) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    // Get project owner info (public fields only)
    const owner = await database.findUserById(project.userId)
    const ownerInfo = owner ? {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
      university: owner.university,
      role: owner.role
    } : null

    // Get related course info if applicable
    let courseInfo = null
    if (project.courseId) {
      const course = await database.findCourseById(project.courseId)
      if (course) {
        courseInfo = {
          id: course.id,
          courseCode: course.courseCode,
          courseName: course.courseName,
          semester: course.semester,
          year: course.year
        }
      }
    }

    res.json({
      success: true,
      data: {
        project,
        owner: ownerInfo,
        course: courseInfo,
        metrics: project.getMetrics()
      }
    })
  } catch (error) {
    console.error('Get project error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get project'
    })
  }
})

// Create new project
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId
    const {
      courseId,
      title,
      description,
      technologies,
      category,
      repositoryUrl,
      liveUrl,
      status,
      isPublic,
      complexityLevel,
      skills,
      tags,
      collaborators,
      startDate,
      endDate
    } = req.body

    // Verify course ownership if courseId provided
    if (courseId) {
      const course = await database.findCourseById(courseId)
      if (!course || course.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Invalid course ID'
        })
      }
    }

    const project = await database.createProject({
      userId,
      courseId: courseId ? parseInt(courseId) : null,
      title: title?.trim(),
      description: description?.trim(),
      technologies: technologies || [],
      category: category || 'other',
      repositoryUrl: repositoryUrl?.trim(),
      liveUrl: liveUrl?.trim(),
      status: status || 'draft',
      isPublic: Boolean(isPublic),
      complexityLevel: complexityLevel || 'Beginner',
      skills: skills || [],
      tags: tags || [],
      collaborators: collaborators || [],
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    })

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project
      }
    })
  } catch (error) {
    console.error('Create project error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Update project
router.put('/:id', authenticate, checkOwnership('project'), async (req, res) => {
  try {
    const projectId = parseInt(req.params.id)
    const updates = req.body

    // Remove fields that shouldn't be updated
    delete updates.id
    delete updates.userId
    delete updates.createdAt

    // Verify course ownership if courseId being updated
    if (updates.courseId) {
      const course = await database.findCourseById(updates.courseId)
      if (!course || course.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Invalid course ID'
        })
      }
      updates.courseId = parseInt(updates.courseId)
    }

    // Parse dates
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate)
    }
    if (updates.endDate) {
      updates.endDate = new Date(updates.endDate)
    }

    const updatedProject = await database.updateProject(projectId, updates)
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project: updatedProject
      }
    })
  } catch (error) {
    console.error('Update project error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Delete project
router.delete('/:id', authenticate, checkOwnership('project'), async (req, res) => {
  try {
    const projectId = parseInt(req.params.id)
    
    await database.deleteProject(projectId)
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Delete project error:', error.message)
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// Analyze project with AI (placeholder for AI service integration)
router.post('/:id/analyze', authenticate, checkOwnership('project'), async (req, res) => {
  try {
    const project = req.resource
    
    // In a real implementation, this would call the AI service
    // For now, return mock analysis
    const analysis = {
      innovationScore: Math.floor(Math.random() * 40) + 60, // 60-100
      technicalDepth: Math.floor(Math.random() * 30) + 70, // 70-100
      marketRelevance: Math.floor(Math.random() * 25) + 75, // 75-100
      codeQuality: Math.floor(Math.random() * 20) + 80, // 80-100
      documentation: Math.floor(Math.random() * 30) + 60, // 60-90
      suggestions: [
        'Consider adding unit tests to improve code quality',
        'Add more detailed documentation for better maintainability',
        'Implement error handling for edge cases',
        'Consider performance optimizations for scalability'
      ],
      skillsDetected: project.technologies,
      estimatedLevel: project.complexityLevel
    }

    // Update project with analysis results
    await database.updateProject(project.id, {
      innovationScore: analysis.innovationScore,
      lastAnalyzedAt: new Date()
    })

    res.json({
      success: true,
      message: 'Project analysis completed',
      data: {
        analysis
      }
    })
  } catch (error) {
    console.error('Project analysis error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to analyze project'
    })
  }
})

// Get project analytics
router.get('/:id/analytics', authenticate, checkOwnership('project'), async (req, res) => {
  try {
    const project = req.resource
    
    const analytics = {
      project: project,
      metrics: project.getMetrics(),
      performance: {
        views: Math.floor(Math.random() * 1000), // Mock data
        likes: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        recruiterViews: Math.floor(Math.random() * 25)
      },
      recommendations: [
        'Add live demo link to increase engagement',
        'Include more detailed project description',
        'Add screenshots or demo video',
        'Tag relevant skills for better discoverability'
      ]
    }
    
    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Project analytics error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get project analytics'
    })
  }
})

// Toggle project visibility
router.patch('/:id/visibility', authenticate, checkOwnership('project'), async (req, res) => {
  try {
    const project = req.resource
    const { isPublic } = req.body
    
    const updatedProject = await database.updateProject(project.id, {
      isPublic: Boolean(isPublic)
    })
    
    res.json({
      success: true,
      message: `Project ${isPublic ? 'published' : 'made private'} successfully`,
      data: {
        project: updatedProject
      }
    })
  } catch (error) {
    console.error('Toggle visibility error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to update project visibility'
    })
  }
})

module.exports = router