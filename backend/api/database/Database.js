class Database {
  constructor() {
    // In-memory storage for now (can be easily replaced with PostgreSQL/MongoDB)
    this.users = new Map()
    this.courses = new Map()
    this.projects = new Map()
    this.files = new Map()
    this.universities = new Map()
    this.companies = new Map()
    this.jobs = new Map()
    this.students = new Map()

    // Auto-increment IDs
    this.userIdCounter = 1
    this.courseIdCounter = 1
    this.projectIdCounter = 1
    this.fileIdCounter = 1
    this.universityIdCounter = 1
    this.companyIdCounter = 1
    this.jobIdCounter = 1
    this.studentIdCounter = 1

    // Initialize with sample data
    this.initializeSampleData()
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

  // University operations
  async createUniversity(data) {
    const university = {
      id: this.universityIdCounter++,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.universities.set(university.id, university)
    return university
  }

  async findUniversityBySlug(slug) {
    return Array.from(this.universities.values())
      .find(uni => uni.slug === slug)
  }

  async findAllUniversities() {
    return Array.from(this.universities.values())
  }

  // Company operations
  async createCompany(data) {
    const company = {
      id: this.companyIdCounter++,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.companies.set(company.id, company)
    return company
  }

  async findCompanyBySlug(slug) {
    return Array.from(this.companies.values())
      .find(company => company.slug === slug)
  }

  async findAllCompanies() {
    return Array.from(this.companies.values())
  }

  // Job operations
  async createJob(data) {
    const job = {
      id: this.jobIdCounter++,
      ...data,
      posted: data.posted || new Date().toISOString(),
      applicants: data.applicants || 0,
      views: data.views || 0,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.jobs.set(job.id, job)
    return job
  }

  async findJobById(id) {
    const job = this.jobs.get(parseInt(id))
    if (job && job.companyId) {
      // Attach company info
      const company = this.companies.get(job.companyId)
      if (company) {
        job.company = {
          id: company.id,
          name: company.name,
          slug: company.slug,
          logo: company.logo,
          industry: company.industry,
          size: company.size,
          website: company.website,
          location: company.headquarters
        }
      }
    }
    return job
  }

  async findAllJobs() {
    const jobs = Array.from(this.jobs.values())
    // Attach company info to each job
    return jobs.map(job => {
      if (job.companyId) {
        const company = this.companies.get(job.companyId)
        if (company) {
          job.company = {
            id: company.id,
            name: company.name,
            slug: company.slug,
            logo: company.logo,
            industry: company.industry,
            size: company.size,
            website: company.website,
            location: company.headquarters
          }
        }
      }
      return job
    })
  }

  async findJobsByCompany(companyId) {
    return Array.from(this.jobs.values())
      .filter(job => job.companyId === companyId)
  }

  // Student operations
  async createStudent(data) {
    const student = {
      id: this.studentIdCounter++,
      ...data,
      profileViews: data.profileViews || 0,
      connections: data.connections || 0,
      applicationsSent: data.applicationsSent || 0,
      interviewsScheduled: data.interviewsScheduled || 0,
      aiScore: data.aiScore || Math.floor(Math.random() * 30) + 70, // Random 70-100
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.students.set(student.id, student)
    return student
  }

  async findStudentById(id) {
    return this.students.get(parseInt(id))
  }

  async findAllStudents() {
    return Array.from(this.students.values())
  }

  async findStudentsByUniversity(universityId) {
    return Array.from(this.students.values())
      .filter(student => student.universityId === universityId)
  }

  // Initialize sample data
  initializeSampleData() {
    // Sample Universities
    const mit = {
      id: this.universityIdCounter++,
      name: 'Massachusetts Institute of Technology',
      shortName: 'MIT',
      slug: 'mit',
      ranking: { global: 1, national: 1, engineering: 1 },
      location: { city: 'Cambridge', state: 'Massachusetts', country: 'United States' },
      stats: {
        students: 11520,
        undergrad: 4638,
        graduate: 6882,
        faculty: 1234,
        internationalStudents: 3456,
        acceptanceRate: 6.7
      },
      programs: [
        { name: 'Computer Science', ranking: 1, students: 890 },
        { name: 'Engineering', ranking: 1, students: 1200 }
      ],
      topSkills: ['AI', 'Machine Learning', 'Computer Science'],
      companies: ['Google', 'Microsoft', 'Apple'],
      avgSalary: '$145,000',
      employmentRate: 96.8,
      description: 'MIT is a world-renowned institution for science and technology.',
      founded: 1861,
      website: 'https://web.mit.edu/',
      contact: { email: 'info@mit.edu', phone: '+1 617-253-1000' },
      socialMedia: { twitter: '@MIT', linkedin: 'mit' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.universities.set(mit.id, mit)

    // Sample Companies
    const weroad = {
      id: this.companyIdCounter++,
      name: 'WeRoad',
      slug: 'weroad',
      tagline: 'Connecting People, Cultures, and Stories',
      description: 'Fast-growing travel startup disrupting the industry.',
      industry: 'Travel & Tourism',
      founded: 2017,
      size: '200-500 employees',
      headquarters: 'Milan, Italy',
      locations: ['Milan', 'Barcelona', 'London'],
      website: 'https://weroad.com',
      stats: { employees: 200, openJobs: 5, rating: 4.6, reviews: 89 },
      values: [{ name: 'Agility', description: 'Move fast and adapt' }],
      benefits: ['Unlimited vacation', 'Learning budget', 'Remote work'],
      techStack: ['JavaScript', 'React', 'Node.js'],
      averageSalary: '€55,000',
      workCulture: { remote: true, diversity: 85, workLifeBalance: 4.2, careerGrowth: 4.1 },
      contact: { email: 'careers@weroad.com' },
      socialMedia: { linkedin: 'weroad', twitter: '@weroad' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.companies.set(weroad.id, weroad)

    // Sample Jobs
    const job1 = {
      id: this.jobIdCounter++,
      title: 'Full Stack Developer',
      companyId: weroad.id,
      location: 'Milan (Hybrid)',
      type: 'Full-time',
      contractType: 'Permanent',
      level: 'Mid-level',
      remote: true,
      hybrid: true,
      description: 'Join our tech team to build amazing travel experiences.',
      fullDescription: 'We are looking for a passionate Full Stack Developer...',
      salary: { min: 40000, max: 60000, currency: 'EUR', period: 'yearly' },
      requirements: ['3+ years experience', 'React/Node.js expertise'],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      benefits: ['Remote work', 'Travel opportunities', 'Learning budget'],
      posted: new Date().toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 23,
      views: 456,
      matchScore: 85,
      status: 'active',
      applicationUrl: 'https://weroad.com/careers',
      isExternal: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.jobs.set(job1.id, job1)

    // Sample Student
    const student1 = {
      id: this.studentIdCounter++,
      name: 'Alex Chen',
      email: 'alex.chen@student.mit.edu',
      title: 'Computer Science Student',
      universityId: mit.id,
      university: 'MIT',
      major: 'Computer Science',
      year: 'Senior',
      graduation: '2024',
      gpa: 3.8,
      location: 'Boston, MA',
      skills: [
        { name: 'Python', level: 'Expert', years: 4 },
        { name: 'Machine Learning', level: 'Advanced', years: 2 }
      ],
      projects: [
        {
          id: 1,
          name: 'AI Recommendation System',
          description: 'Built ML recommendation system',
          technologies: ['Python', 'TensorFlow'],
          github: 'https://github.com/alexchen/ai-rec',
          featured: true,
          stars: 234
        }
      ],
      experience: [
        {
          company: 'Google',
          position: 'Software Engineering Intern',
          duration: 'Summer 2023',
          description: 'Worked on search infrastructure'
        }
      ],
      aiScore: 94,
      profileViews: 247,
      connections: 89,
      availability: 'Available for full-time roles',
      preferredRoles: ['Software Engineer', 'ML Engineer'],
      salaryExpectation: '$120,000 - $150,000',
      workPreference: 'Hybrid',
      visaStatus: 'US Citizen',
      languages: ['English', 'Mandarin'],
      interests: ['Machine Learning', 'Open Source'],
      contact: {
        email: 'alex.chen@student.mit.edu',
        linkedin: 'alexchen',
        github: 'alexchen92'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.students.set(student1.id, student1)
  }
}

// Singleton instance
const database = new Database()
module.exports = database