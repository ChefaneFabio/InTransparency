const { v4: uuidv4 } = require('uuid')
const db = require('../config/database')
const { validateInput } = require('../utils/validation')
const { matchCandidates, analyzeMarketTrends } = require('../services/aiService')

class JobController {
  // Get all jobs with filtering and pagination
  async getJobs(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        company,
        location,
        type,
        experience,
        salary_min,
        salary_max,
        skills,
        remote,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = req.query

      const offset = (page - 1) * limit
      let query = db('jobs')
        .select([
          'jobs.*',
          'users.first_name as recruiter_first_name',
          'users.last_name as recruiter_last_name',
          'users.company as recruiter_company',
          'users.avatar_url as recruiter_avatar'
        ])
        .leftJoin('users', 'jobs.created_by', 'users.id')
        .where('jobs.is_active', true)
        .where('jobs.status', 'published')

      // Apply filters
      if (search) {
        query = query.where(function() {
          this.where('jobs.title', 'ilike', `%${search}%`)
            .orWhere('jobs.description', 'ilike', `%${search}%`)
            .orWhere('jobs.company', 'ilike', `%${search}%`)
        })
      }

      if (company) {
        query = query.where('jobs.company', 'ilike', `%${company}%`)
      }

      if (location) {
        query = query.where('jobs.location', 'ilike', `%${location}%`)
      }

      if (type) {
        query = query.where('jobs.employment_type', type)
      }

      if (experience) {
        query = query.where('jobs.experience_level', experience)
      }

      if (salary_min) {
        query = query.where('jobs.salary_min', '>=', salary_min)
      }

      if (salary_max) {
        query = query.where('jobs.salary_max', '<=', salary_max)
      }

      if (skills) {
        query = query.where('jobs.required_skills', 'ilike', `%${skills}%`)
      }

      if (remote !== undefined) {
        query = query.where('jobs.is_remote', remote === 'true')
      }

      // Apply sorting
      const validSortFields = ['created_at', 'updated_at', 'title', 'salary_min', 'salary_max', 'applications_count']
      if (validSortFields.includes(sortBy)) {
        query = query.orderBy(`jobs.${sortBy}`, sortOrder.toLowerCase())
      }

      // Get total count
      const totalQuery = query.clone().clearSelect().clearOrder().count('* as count')
      const [{ count: total }] = await totalQuery

      // Execute main query
      const jobs = await query.limit(limit).offset(offset)

      // Process jobs
      const processedJobs = jobs.map(job => ({
        ...job,
        required_skills: JSON.parse(job.required_skills || '[]'),
        preferred_skills: JSON.parse(job.preferred_skills || '[]'),
        benefits: JSON.parse(job.benefits || '[]'),
        requirements: JSON.parse(job.requirements || '[]'),
        recruiter: {
          firstName: job.recruiter_first_name,
          lastName: job.recruiter_last_name,
          company: job.recruiter_company,
          avatarUrl: job.recruiter_avatar
        }
      }))

      res.json({
        success: true,
        data: {
          jobs: processedJobs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      console.error('Get jobs error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch jobs'
      })
    }
  }

  // Get single job by ID
  async getJob(req, res) {
    try {
      const { id } = req.params

      const job = await db('jobs')
        .select([
          'jobs.*',
          'users.first_name as recruiter_first_name',
          'users.last_name as recruiter_last_name',
          'users.company as recruiter_company',
          'users.avatar_url as recruiter_avatar',
          'users.linkedin_url as recruiter_linkedin',
          'users.email as recruiter_email'
        ])
        .leftJoin('users', 'jobs.created_by', 'users.id')
        .where('jobs.id', id)
        .where('jobs.is_active', true)
        .first()

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        })
      }

      // Increment view count (only if not the creator)
      if (!req.user || req.user.id !== job.created_by) {
        await db('jobs')
          .where('id', id)
          .increment('views_count', 1)
      }

      // Check if user has applied (if authenticated)
      let hasApplied = false
      if (req.user) {
        const application = await db('job_applications')
          .where('job_id', id)
          .where('user_id', req.user.id)
          .first()
        hasApplied = !!application
      }

      // Process job data
      const processedJob = {
        ...job,
        required_skills: JSON.parse(job.required_skills || '[]'),
        preferred_skills: JSON.parse(job.preferred_skills || '[]'),
        benefits: JSON.parse(job.benefits || '[]'),
        requirements: JSON.parse(job.requirements || '[]'),
        recruiter: {
          firstName: job.recruiter_first_name,
          lastName: job.recruiter_last_name,
          company: job.recruiter_company,
          avatarUrl: job.recruiter_avatar,
          linkedinUrl: job.recruiter_linkedin,
          email: job.recruiter_email
        },
        hasApplied
      }

      res.json({
        success: true,
        data: { job: processedJob }
      })
    } catch (error) {
      console.error('Get job error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch job'
      })
    }
  }

  // Create new job posting
  async createJob(req, res) {
    try {
      const userId = req.user.id
      const {
        title,
        description,
        company,
        location,
        employmentType,
        experienceLevel,
        salaryMin,
        salaryMax,
        currency = 'USD',
        requiredSkills,
        preferredSkills,
        benefits,
        requirements,
        isRemote = false,
        applicationDeadline,
        targetUniversities
      } = req.body

      // Validate required fields
      const validation = validateInput({
        title,
        description,
        company,
        location,
        employmentType,
        experienceLevel,
        requiredSkills
      }, {
        title: 'required|min:10|max:100',
        description: 'required|min:50|max:3000',
        company: 'required|min:2|max:100',
        location: 'required|min:2|max:100',
        employmentType: 'required|in:full-time,part-time,contract,internship',
        experienceLevel: 'required|in:entry,junior,mid,senior,lead,executive',
        requiredSkills: 'required|array|min:1'
      })

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        })
      }

      // Verify user is a recruiter
      const user = await db('users')
        .select('role', 'company as user_company')
        .where('id', userId)
        .first()

      if (user.role !== 'recruiter') {
        return res.status(403).json({
          success: false,
          error: 'Only recruiters can create job postings'
        })
      }

      // Create job
      const jobId = uuidv4()
      const jobData = {
        id: jobId,
        created_by: userId,
        title,
        description,
        company: company || user.user_company,
        location,
        employment_type: employmentType,
        experience_level: experienceLevel,
        salary_min: salaryMin || null,
        salary_max: salaryMax || null,
        currency,
        required_skills: JSON.stringify(requiredSkills),
        preferred_skills: JSON.stringify(preferredSkills || []),
        benefits: JSON.stringify(benefits || []),
        requirements: JSON.stringify(requirements || []),
        is_remote: isRemote,
        application_deadline: applicationDeadline ? new Date(applicationDeadline) : null,
        target_universities: JSON.stringify(targetUniversities || []),
        status: 'published',
        views_count: 0,
        applications_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true
      }

      await db('jobs').insert(jobData)

      // Get created job with recruiter info
      const job = await db('jobs')
        .select([
          'jobs.*',
          'users.first_name as recruiter_first_name',
          'users.last_name as recruiter_last_name',
          'users.company as recruiter_company',
          'users.avatar_url as recruiter_avatar'
        ])
        .leftJoin('users', 'jobs.created_by', 'users.id')
        .where('jobs.id', jobId)
        .first()

      const processedJob = {
        ...job,
        required_skills: JSON.parse(job.required_skills || '[]'),
        preferred_skills: JSON.parse(job.preferred_skills || '[]'),
        benefits: JSON.parse(job.benefits || '[]'),
        requirements: JSON.parse(job.requirements || '[]'),
        target_universities: JSON.parse(job.target_universities || '[]'),
        recruiter: {
          firstName: job.recruiter_first_name,
          lastName: job.recruiter_last_name,
          company: job.recruiter_company,
          avatarUrl: job.recruiter_avatar
        }
      }

      res.status(201).json({
        success: true,
        data: { job: processedJob }
      })
    } catch (error) {
      console.error('Create job error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create job'
      })
    }
  }

  // Update job posting
  async updateJob(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const updateData = req.body

      // Check if job exists and user owns it
      const existingJob = await db('jobs')
        .where('id', id)
        .where('created_by', userId)
        .where('is_active', true)
        .first()

      if (!existingJob) {
        return res.status(404).json({
          success: false,
          error: 'Job not found or access denied'
        })
      }

      // Build update object
      const jobUpdate = {
        updated_at: new Date()
      }

      const allowedFields = [
        'title', 'description', 'company', 'location', 'employment_type',
        'experience_level', 'salary_min', 'salary_max', 'currency',
        'is_remote', 'application_deadline', 'status'
      ]

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          if (field === 'application_deadline' && updateData[field]) {
            jobUpdate[field] = new Date(updateData[field])
          } else {
            jobUpdate[field] = updateData[field]
          }
        }
      })

      // Handle array fields
      if (updateData.requiredSkills) {
        jobUpdate.required_skills = JSON.stringify(updateData.requiredSkills)
      }
      if (updateData.preferredSkills) {
        jobUpdate.preferred_skills = JSON.stringify(updateData.preferredSkills)
      }
      if (updateData.benefits) {
        jobUpdate.benefits = JSON.stringify(updateData.benefits)
      }
      if (updateData.requirements) {
        jobUpdate.requirements = JSON.stringify(updateData.requirements)
      }
      if (updateData.targetUniversities) {
        jobUpdate.target_universities = JSON.stringify(updateData.targetUniversities)
      }

      // Update job
      await db('jobs')
        .where('id', id)
        .update(jobUpdate)

      // Get updated job
      const job = await db('jobs')
        .select([
          'jobs.*',
          'users.first_name as recruiter_first_name',
          'users.last_name as recruiter_last_name',
          'users.company as recruiter_company',
          'users.avatar_url as recruiter_avatar'
        ])
        .leftJoin('users', 'jobs.created_by', 'users.id')
        .where('jobs.id', id)
        .first()

      const processedJob = {
        ...job,
        required_skills: JSON.parse(job.required_skills || '[]'),
        preferred_skills: JSON.parse(job.preferred_skills || '[]'),
        benefits: JSON.parse(job.benefits || '[]'),
        requirements: JSON.parse(job.requirements || '[]'),
        target_universities: JSON.parse(job.target_universities || '[]'),
        recruiter: {
          firstName: job.recruiter_first_name,
          lastName: job.recruiter_last_name,
          company: job.recruiter_company,
          avatarUrl: job.recruiter_avatar
        }
      }

      res.json({
        success: true,
        data: { job: processedJob }
      })
    } catch (error) {
      console.error('Update job error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update job'
      })
    }
  }

  // Delete job posting
  async deleteJob(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Check if job exists and user owns it
      const job = await db('jobs')
        .where('id', id)
        .where('created_by', userId)
        .where('is_active', true)
        .first()

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found or access denied'
        })
      }

      // Soft delete the job
      await db('jobs')
        .where('id', id)
        .update({
          is_active: false,
          status: 'deleted',
          updated_at: new Date()
        })

      res.json({
        success: true,
        message: 'Job deleted successfully'
      })
    } catch (error) {
      console.error('Delete job error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete job'
      })
    }
  }

  // Apply to job
  async applyToJob(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const { coverLetter, resumeUrl } = req.body

      // Check if job exists and is active
      const job = await db('jobs')
        .where('id', id)
        .where('is_active', true)
        .where('status', 'published')
        .first()

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found or no longer available'
        })
      }

      // Check if application deadline has passed
      if (job.application_deadline && new Date() > new Date(job.application_deadline)) {
        return res.status(400).json({
          success: false,
          error: 'Application deadline has passed'
        })
      }

      // Check if user has already applied
      const existingApplication = await db('job_applications')
        .where('job_id', id)
        .where('user_id', userId)
        .first()

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          error: 'You have already applied to this job'
        })
      }

      // Verify user is a student or professional (not recruiter)
      const user = await db('users')
        .select('role')
        .where('id', userId)
        .first()

      if (user.role === 'recruiter') {
        return res.status(403).json({
          success: false,
          error: 'Recruiters cannot apply to jobs'
        })
      }

      // Create application
      const applicationId = uuidv4()
      const applicationData = {
        id: applicationId,
        job_id: id,
        user_id: userId,
        cover_letter: coverLetter || null,
        resume_url: resumeUrl || null,
        status: 'pending',
        applied_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }

      await db('job_applications').insert(applicationData)

      // Increment applications count
      await db('jobs')
        .where('id', id)
        .increment('applications_count', 1)

      res.status(201).json({
        success: true,
        data: { applicationId },
        message: 'Application submitted successfully'
      })
    } catch (error) {
      console.error('Apply to job error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to submit application'
      })
    }
  }

  // Get user's job applications
  async getMyApplications(req, res) {
    try {
      const userId = req.user.id
      const { page = 1, limit = 20, status } = req.query
      const offset = (page - 1) * limit

      let query = db('job_applications')
        .select([
          'job_applications.*',
          'jobs.title',
          'jobs.company',
          'jobs.location',
          'jobs.employment_type',
          'jobs.salary_min',
          'jobs.salary_max',
          'jobs.is_remote',
          'jobs.status as job_status'
        ])
        .join('jobs', 'job_applications.job_id', 'jobs.id')
        .where('job_applications.user_id', userId)
        .orderBy('job_applications.applied_at', 'desc')

      if (status) {
        query = query.where('job_applications.status', status)
      }

      // Get total count
      const totalQuery = query.clone().clearSelect().count('* as count')
      const [{ count: total }] = await totalQuery

      // Get applications with pagination
      const applications = await query.limit(limit).offset(offset)

      res.json({
        success: true,
        data: {
          applications,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      console.error('Get applications error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch applications'
      })
    }
  }

  // Get job applications (for recruiters)
  async getJobApplications(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const { page = 1, limit = 20, status } = req.query
      const offset = (page - 1) * limit

      // Verify user owns the job
      const job = await db('jobs')
        .where('id', id)
        .where('created_by', userId)
        .first()

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found or access denied'
        })
      }

      let query = db('job_applications')
        .select([
          'job_applications.*',
          'users.first_name',
          'users.last_name',
          'users.email',
          'users.university',
          'users.graduation_year',
          'users.avatar_url',
          'users.bio',
          'users.skills',
          'users.location as user_location'
        ])
        .join('users', 'job_applications.user_id', 'users.id')
        .where('job_applications.job_id', id)
        .orderBy('job_applications.applied_at', 'desc')

      if (status) {
        query = query.where('job_applications.status', status)
      }

      // Get total count
      const totalQuery = query.clone().clearSelect().count('* as count')
      const [{ count: total }] = await totalQuery

      // Get applications with pagination
      const applications = await query.limit(limit).offset(offset)

      // Process applications
      const processedApplications = applications.map(app => ({
        ...app,
        candidate: {
          id: app.user_id,
          firstName: app.first_name,
          lastName: app.last_name,
          email: app.email,
          university: app.university,
          graduationYear: app.graduation_year,
          avatarUrl: app.avatar_url,
          bio: app.bio,
          skills: JSON.parse(app.skills || '[]'),
          location: app.user_location
        }
      }))

      res.json({
        success: true,
        data: {
          applications: processedApplications,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      console.error('Get job applications error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch job applications'
      })
    }
  }

  // Update application status
  async updateApplicationStatus(req, res) {
    try {
      const { id, applicationId } = req.params
      const userId = req.user.id
      const { status, feedback } = req.body

      // Verify user owns the job
      const job = await db('jobs')
        .where('id', id)
        .where('created_by', userId)
        .first()

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found or access denied'
        })
      }

      // Verify application exists for this job
      const application = await db('job_applications')
        .where('id', applicationId)
        .where('job_id', id)
        .first()

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        })
      }

      // Validate status
      const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interviewing', 'rejected', 'hired']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status'
        })
      }

      // Update application
      await db('job_applications')
        .where('id', applicationId)
        .update({
          status,
          feedback: feedback || null,
          updated_at: new Date()
        })

      res.json({
        success: true,
        message: 'Application status updated successfully'
      })
    } catch (error) {
      console.error('Update application status error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update application status'
      })
    }
  }

  // Get AI-powered candidate matches
  async getCandidateMatches(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Verify user owns the job
      const job = await db('jobs')
        .where('id', id)
        .where('created_by', userId)
        .first()

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found or access denied'
        })
      }

      // Get potential candidates (students with public profiles)
      const candidates = await db('users')
        .select([
          'id', 'first_name', 'last_name', 'email', 'university',
          'graduation_year', 'bio', 'skills', 'avatar_url', 'location'
        ])
        .where('role', 'student')
        .where('is_active', true)
        .limit(100) // Limit for performance

      // Get candidates' projects for analysis
      const candidateIds = candidates.map(c => c.id)
      const projects = await db('projects')
        .select(['user_id', 'title', 'description', 'technologies', 'ai_analysis'])
        .whereIn('user_id', candidateIds)
        .where('is_active', true)
        .where('is_public', true)

      // Group projects by user
      const projectsByUser = {}
      projects.forEach(project => {
        if (!projectsByUser[project.user_id]) {
          projectsByUser[project.user_id] = []
        }
        projectsByUser[project.user_id].push({
          ...project,
          technologies: JSON.parse(project.technologies || '[]'),
          ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null
        })
      })

      // Prepare data for AI matching
      const jobRequirements = {
        title: job.title,
        description: job.description,
        required_skills: JSON.parse(job.required_skills || '[]'),
        preferred_skills: JSON.parse(job.preferred_skills || '[]'),
        experience_level: job.experience_level,
        requirements: JSON.parse(job.requirements || '[]')
      }

      const candidatesForMatching = candidates.map(candidate => ({
        ...candidate,
        skills: JSON.parse(candidate.skills || '[]'),
        projects: projectsByUser[candidate.id] || []
      }))

      // Get AI matches
      const matches = await matchCandidates(jobRequirements, candidatesForMatching)

      res.json({
        success: true,
        data: { matches }
      })
    } catch (error) {
      console.error('Get candidate matches error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get candidate matches'
      })
    }
  }

  // Get recruiter's jobs
  async getRecruiterJobs(req, res) {
    try {
      const userId = req.user.id
      const { page = 1, limit = 20, status } = req.query
      const offset = (page - 1) * limit

      let query = db('jobs')
        .select([
          'id', 'title', 'company', 'location', 'employment_type',
          'status', 'views_count', 'applications_count', 'created_at', 'updated_at'
        ])
        .where('created_by', userId)
        .where('is_active', true)
        .orderBy('created_at', 'desc')

      if (status) {
        query = query.where('status', status)
      }

      // Get total count
      const totalQuery = query.clone().clearSelect().count('* as count')
      const [{ count: total }] = await totalQuery

      // Get jobs with pagination
      const jobs = await query.limit(limit).offset(offset)

      res.json({
        success: true,
        data: {
          jobs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      console.error('Get recruiter jobs error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recruiter jobs'
      })
    }
  }
}

module.exports = new JobController()