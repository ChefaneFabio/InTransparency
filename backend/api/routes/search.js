const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Global search across all entities
router.get('/', async (req, res) => {
  try {
    const { q: query, type, limit = 20 } = req.query

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      })
    }

    const results = {
      students: [],
      jobs: [],
      companies: [],
      universities: []
    }

    const searchTerm = query.toLowerCase()

    // Search students
    if (!type || type === 'students') {
      const students = await database.findAllStudents()
      results.students = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        (student.major && student.major.toLowerCase().includes(searchTerm)) ||
        (student.university && student.university.toLowerCase().includes(searchTerm)) ||
        (student.skills && student.skills.some(skill =>
          typeof skill === 'object' ? skill.name.toLowerCase().includes(searchTerm) :
          skill.toLowerCase().includes(searchTerm)
        ))
      ).slice(0, parseInt(limit))
    }

    // Search jobs
    if (!type || type === 'jobs') {
      const jobs = await database.findAllJobs()
      results.jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        (job.description && job.description.toLowerCase().includes(searchTerm)) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm))) ||
        (job.company && job.company.name.toLowerCase().includes(searchTerm))
      ).slice(0, parseInt(limit))
    }

    // Search companies
    if (!type || type === 'companies') {
      const companies = await database.findAllCompanies()
      results.companies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm) ||
        (company.industry && company.industry.toLowerCase().includes(searchTerm)) ||
        (company.description && company.description.toLowerCase().includes(searchTerm))
      ).slice(0, parseInt(limit))
    }

    // Search universities
    if (!type || type === 'universities') {
      const universities = await database.findAllUniversities()
      results.universities = universities.filter(university =>
        university.name.toLowerCase().includes(searchTerm) ||
        (university.location &&
          (university.location.city.toLowerCase().includes(searchTerm) ||
           university.location.state.toLowerCase().includes(searchTerm)))
      ).slice(0, parseInt(limit))
    }

    res.json({
      query,
      results,
      totalResults: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    })
  } catch (error) {
    console.error('Error performing search:', error)
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    })
  }
})

// Search jobs with advanced filters
router.get('/jobs', async (req, res) => {
  try {
    const {
      q: query,
      location,
      remote,
      level,
      salary_min,
      salary_max,
      company_id,
      skills,
      limit = 50
    } = req.query

    let jobs = await database.findAllJobs()

    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase()
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        (job.description && job.description.toLowerCase().includes(searchTerm)) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm)))
      )
    }

    // Filter by location
    if (location) {
      jobs = jobs.filter(job =>
        job.location && job.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Filter by remote work
    if (remote === 'true') {
      jobs = jobs.filter(job => job.remote === true)
    }

    // Filter by level
    if (level) {
      jobs = jobs.filter(job => job.level === level)
    }

    // Filter by salary range
    if (salary_min || salary_max) {
      jobs = jobs.filter(job => {
        if (!job.salary) return false
        if (salary_min && job.salary.min < parseInt(salary_min)) return false
        if (salary_max && job.salary.max > parseInt(salary_max)) return false
        return true
      })
    }

    // Filter by company
    if (company_id) {
      jobs = jobs.filter(job => job.companyId === parseInt(company_id))
    }

    // Filter by skills
    if (skills) {
      const requiredSkills = skills.split(',').map(s => s.trim().toLowerCase())
      jobs = jobs.filter(job =>
        job.skills && requiredSkills.some(skill =>
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill))
        )
      )
    }

    res.json({
      jobs: jobs.slice(0, parseInt(limit)),
      total: jobs.length,
      filters: {
        query,
        location,
        remote,
        level,
        salary_min,
        salary_max,
        company_id,
        skills
      }
    })
  } catch (error) {
    console.error('Error searching jobs:', error)
    res.status(500).json({
      error: 'Job search failed',
      message: error.message
    })
  }
})

// Search students/candidates
router.get('/students', async (req, res) => {
  try {
    const {
      q: query,
      university_id,
      major,
      graduation_year,
      min_gpa,
      skills,
      location,
      limit = 50
    } = req.query

    let students = await database.findAllStudents()

    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase()
      students = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        (student.major && student.major.toLowerCase().includes(searchTerm)) ||
        (student.university && student.university.toLowerCase().includes(searchTerm))
      )
    }

    // Filter by university
    if (university_id) {
      students = students.filter(student => student.universityId === parseInt(university_id))
    }

    // Filter by major
    if (major) {
      students = students.filter(student =>
        student.major && student.major.toLowerCase().includes(major.toLowerCase())
      )
    }

    // Filter by graduation year
    if (graduation_year) {
      students = students.filter(student => student.graduation === graduation_year)
    }

    // Filter by GPA
    if (min_gpa) {
      students = students.filter(student => student.gpa >= parseFloat(min_gpa))
    }

    // Filter by skills
    if (skills) {
      const requiredSkills = skills.split(',').map(s => s.trim().toLowerCase())
      students = students.filter(student =>
        student.skills && requiredSkills.some(skill =>
          student.skills.some(studentSkill =>
            typeof studentSkill === 'object' ?
              studentSkill.name.toLowerCase().includes(skill) :
              studentSkill.toLowerCase().includes(skill)
          )
        )
      )
    }

    // Filter by location
    if (location) {
      students = students.filter(student =>
        student.location && student.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    res.json({
      students: students.slice(0, parseInt(limit)),
      total: students.length,
      filters: {
        query,
        university_id,
        major,
        graduation_year,
        min_gpa,
        skills,
        location
      }
    })
  } catch (error) {
    console.error('Error searching students:', error)
    res.status(500).json({
      error: 'Student search failed',
      message: error.message
    })
  }
})

module.exports = router