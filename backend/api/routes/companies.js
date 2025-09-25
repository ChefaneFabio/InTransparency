const express = require('express')
const router = express.Router()
const database = require('../database/Database')

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await database.findAllCompanies()

    // Apply filters if provided
    let filteredCompanies = companies

    if (req.query.industry) {
      filteredCompanies = filteredCompanies.filter(company =>
        company.industry && company.industry.toLowerCase().includes(req.query.industry.toLowerCase())
      )
    }

    if (req.query.size) {
      filteredCompanies = filteredCompanies.filter(company => company.size === req.query.size)
    }

    res.json(filteredCompanies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    res.status(500).json({
      error: 'Failed to fetch companies',
      message: error.message
    })
  }
})

// Get company by slug
router.get('/:slug', async (req, res) => {
  try {
    const company = await database.findCompanyBySlug(req.params.slug)

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        slug: req.params.slug
      })
    }

    // Get job count for this company
    const jobs = await database.findJobsByCompany(company.id)
    company.jobsCount = jobs.filter(job => job.status === 'active').length

    // Ensure stats object exists
    if (!company.stats) {
      company.stats = {
        employees: company.employees || 0,
        openJobs: company.jobsCount,
        rating: company.rating || 0,
        reviews: company.reviews || 0
      }
    }

    res.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    res.status(500).json({
      error: 'Failed to fetch company',
      message: error.message
    })
  }
})

// Get jobs for a company
router.get('/:slug/jobs', async (req, res) => {
  try {
    const company = await database.findCompanyBySlug(req.params.slug)

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        slug: req.params.slug
      })
    }

    let jobs = await database.findJobsByCompany(company.id)

    // Filter active jobs by default
    if (req.query.includeInactive !== 'true') {
      jobs = jobs.filter(job => job.status === 'active')
    }

    // Add company info to each job
    jobs = jobs.map(job => ({
      ...job,
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        logo: company.logo,
        industry: company.industry,
        size: company.size,
        website: company.website,
        location: company.headquarters
      }
    }))

    res.json(jobs)
  } catch (error) {
    console.error('Error fetching company jobs:', error)
    res.status(500).json({
      error: 'Failed to fetch jobs',
      message: error.message
    })
  }
})

// Follow a company
router.post('/:id/follow', async (req, res) => {
  try {
    // In a real app, you would:
    // 1. Check authentication
    // 2. Add follow relationship to database
    // 3. Send notification to company

    res.status(201).json({
      success: true,
      message: 'Successfully followed company',
      companyId: req.params.id
    })
  } catch (error) {
    console.error('Error following company:', error)
    res.status(400).json({
      error: 'Failed to follow company',
      message: error.message
    })
  }
})

// Unfollow a company
router.delete('/:id/follow', async (req, res) => {
  try {
    // In a real app, you would:
    // 1. Check authentication
    // 2. Remove follow relationship from database

    res.json({
      success: true,
      message: 'Successfully unfollowed company',
      companyId: req.params.id
    })
  } catch (error) {
    console.error('Error unfollowing company:', error)
    res.status(400).json({
      error: 'Failed to unfollow company',
      message: error.message
    })
  }
})

// Create a new company
router.post('/', async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    const company = await database.createCompany(companyData)
    res.status(201).json(company)
  } catch (error) {
    console.error('Error creating company:', error)
    res.status(400).json({
      error: 'Failed to create company',
      message: error.message
    })
  }
})

// Update company
router.put('/:id', async (req, res) => {
  try {
    // Find company by ID (would need to add this method to database)
    const companies = await database.findAllCompanies()
    const company = companies.find(c => c.id === parseInt(req.params.id))

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        id: req.params.id
      })
    }

    // Update company properties
    Object.assign(company, req.body, {
      updatedAt: new Date().toISOString()
    })

    res.json(company)
  } catch (error) {
    console.error('Error updating company:', error)
    res.status(400).json({
      error: 'Failed to update company',
      message: error.message
    })
  }
})

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    res.status(501).json({
      error: 'Delete functionality not yet implemented'
    })
  } catch (error) {
    console.error('Error deleting company:', error)
    res.status(400).json({
      error: 'Failed to delete company',
      message: error.message
    })
  }
})

module.exports = router