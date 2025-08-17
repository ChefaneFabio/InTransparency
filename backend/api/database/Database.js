class Database {
  constructor() {
    // In-memory storage for now (can be easily replaced with PostgreSQL/MongoDB)
    this.users = new Map()
    this.courses = new Map()
    this.projects = new Map()
    this.files = new Map()
    
    // Auto-increment IDs
    this.userIdCounter = 1
    this.courseIdCounter = 1
    this.projectIdCounter = 1
    this.fileIdCounter = 1
  }

  // User operations
  async createUser(userData) {
    const User = require('../models/User')
    const user = new User(userData)
    
    // Validate user data
    const errors = user.validate()
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`)
    }

    // Check if email already exists
    const existingUser = Array.from(this.users.values())
      .find(u => u.email.toLowerCase() === user.email.toLowerCase())
    
    if (existingUser) {
      throw new Error('Email already registered')
    }

    // Hash password
    await user.hashPassword()
    
    // Assign ID and save
    user.id = this.userIdCounter++
    this.users.set(user.id, user)
    
    return user
  }

  async findUserByEmail(email) {
    return Array.from(this.users.values())
      .find(user => user.email.toLowerCase() === email.toLowerCase())
  }

  async findUserById(id) {
    return this.users.get(parseInt(id))
  }

  async updateUser(id, updates) {
    const user = this.users.get(parseInt(id))
    if (!user) {
      throw new Error('User not found')
    }

    Object.assign(user, updates, { updatedAt: new Date() })
    this.users.set(parseInt(id), user)
    return user
  }

  // Course operations
  async createCourse(courseData) {
    const Course = require('../models/Course')
    const course = new Course(courseData)
    
    // Validate course data
    const errors = course.validate()
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`)
    }

    // Verify user exists
    const user = await this.findUserById(course.userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Assign ID and save
    course.id = this.courseIdCounter++
    this.courses.set(course.id, course)
    
    return course
  }

  async findCoursesByUserId(userId) {
    return Array.from(this.courses.values())
      .filter(course => course.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async findCourseById(id) {
    return this.courses.get(parseInt(id))
  }

  async updateCourse(id, updates) {
    const course = this.courses.get(parseInt(id))
    if (!course) {
      throw new Error('Course not found')
    }

    Object.assign(course, updates, { updatedAt: new Date() })
    this.courses.set(parseInt(id), course)
    return course
  }

  async deleteCourse(id) {
    const course = this.courses.get(parseInt(id))
    if (!course) {
      throw new Error('Course not found')
    }

    this.courses.delete(parseInt(id))
    return course
  }

  // Project operations
  async createProject(projectData) {
    const Project = require('../models/Project')
    const project = new Project(projectData)
    
    // Validate project data
    const errors = project.validate()
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`)
    }

    // Verify user exists
    const user = await this.findUserById(project.userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Verify course exists if courseId provided
    if (project.courseId) {
      const course = await this.findCourseById(project.courseId)
      if (!course) {
        throw new Error('Course not found')
      }
    }

    // Assign ID and save
    project.id = this.projectIdCounter++
    this.projects.set(project.id, project)
    
    return project
  }

  async findProjectsByUserId(userId) {
    return Array.from(this.projects.values())
      .filter(project => project.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async findProjectById(id) {
    return this.projects.get(parseInt(id))
  }

  async findPublicProjects(limit = 20) {
    return Array.from(this.projects.values())
      .filter(project => project.isPublic && project.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  }

  async updateProject(id, updates) {
    const project = this.projects.get(parseInt(id))
    if (!project) {
      throw new Error('Project not found')
    }

    Object.assign(project, updates, { updatedAt: new Date() })
    this.projects.set(parseInt(id), project)
    return project
  }

  async deleteProject(id) {
    const project = this.projects.get(parseInt(id))
    if (!project) {
      throw new Error('Project not found')
    }

    this.projects.delete(parseInt(id))
    return project
  }

  // Analytics
  async getUserStats(userId) {
    const courses = await this.findCoursesByUserId(userId)
    const projects = await this.findProjectsByUserId(userId)
    
    const completedCourses = courses.filter(c => c.isCompleted)
    const publishedProjects = projects.filter(p => p.status === 'published')
    
    // Calculate GPA
    const completedCoursesWithGrades = completedCourses.filter(c => c.grade)
    let totalPoints = 0
    let totalCredits = 0
    
    completedCoursesWithGrades.forEach(course => {
      totalPoints += course.getGpaPoints()
      totalCredits += course.credits
    })
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null

    // Extract skills from projects
    const allSkills = projects.reduce((skills, project) => {
      return [...skills, ...project.skills, ...project.technologies]
    }, [])
    
    const skillFrequency = allSkills.reduce((freq, skill) => {
      freq[skill] = (freq[skill] || 0) + 1
      return freq
    }, {})

    return {
      totalCourses: courses.length,
      completedCourses: completedCourses.length,
      totalCredits: courses.reduce((sum, c) => sum + c.credits, 0),
      gpa: gpa,
      totalProjects: projects.length,
      publishedProjects: publishedProjects.length,
      topSkills: Object.entries(skillFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }))
    }
  }

  // Search functionality
  async searchProjects(query, filters = {}) {
    let projects = Array.from(this.projects.values())
      .filter(project => project.isPublic && project.status === 'published')

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase()
      projects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm)) ||
        project.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      )
    }

    // Apply filters
    if (filters.category) {
      projects = projects.filter(p => p.category === filters.category)
    }

    if (filters.technology) {
      projects = projects.filter(p => 
        p.technologies.some(tech => tech.toLowerCase().includes(filters.technology.toLowerCase()))
      )
    }

    if (filters.complexityLevel) {
      projects = projects.filter(p => p.complexityLevel === filters.complexityLevel)
    }

    return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

// Singleton instance
const database = new Database()
module.exports = database