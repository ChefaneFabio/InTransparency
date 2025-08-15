const db = require('../config/database')
const { analyzeMarketTrends } = require('../services/aiService')

class AnalyticsController {
  // Get platform-wide analytics (admin only)
  async getPlatformAnalytics(req, res) {
    try {
      const { timeframe = '30d' } = req.query

      // Verify admin access
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        })
      }

      let dateFilter = new Date()
      switch (timeframe) {
        case '7d':
          dateFilter.setDate(dateFilter.getDate() - 7)
          break
        case '30d':
          dateFilter.setDate(dateFilter.getDate() - 30)
          break
        case '90d':
          dateFilter.setDate(dateFilter.getDate() - 90)
          break
        case '1y':
          dateFilter.setFullYear(dateFilter.getFullYear() - 1)
          break
        default:
          dateFilter.setDate(dateFilter.getDate() - 30)
      }

      // Get user statistics
      const userStats = await db('users')
        .select([
          db.raw('COUNT(*) as total_users'),
          db.raw("COUNT(CASE WHEN role = 'student' THEN 1 END) as students"),
          db.raw("COUNT(CASE WHEN role = 'recruiter' THEN 1 END) as recruiters"),
          db.raw("COUNT(CASE WHEN role = 'university' THEN 1 END) as universities"),
          db.raw('COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users'),
          db.raw(`COUNT(CASE WHEN created_at >= '${dateFilter.toISOString()}' THEN 1 END) as new_users`)
        ])
        .where('is_active', true)
        .first()

      // Get project statistics
      const projectStats = await db('projects')
        .select([
          db.raw('COUNT(*) as total_projects'),
          db.raw('COUNT(CASE WHEN is_public = true THEN 1 END) as public_projects'),
          db.raw('SUM(views_count) as total_views'),
          db.raw('SUM(likes_count) as total_likes'),
          db.raw(`COUNT(CASE WHEN created_at >= '${dateFilter.toISOString()}' THEN 1 END) as new_projects`)
        ])
        .where('is_active', true)
        .first()

      // Get job statistics
      const jobStats = await db('jobs')
        .select([
          db.raw('COUNT(*) as total_jobs'),
          db.raw("COUNT(CASE WHEN status = 'published' THEN 1 END) as active_jobs"),
          db.raw('SUM(applications_count) as total_applications'),
          db.raw('SUM(views_count) as total_job_views'),
          db.raw(`COUNT(CASE WHEN created_at >= '${dateFilter.toISOString()}' THEN 1 END) as new_jobs`)
        ])
        .where('is_active', true)
        .first()

      // Get application statistics
      const applicationStats = await db('job_applications')
        .select([
          db.raw('COUNT(*) as total_applications'),
          db.raw("COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications"),
          db.raw("COUNT(CASE WHEN status = 'hired' THEN 1 END) as successful_hires"),
          db.raw(`COUNT(CASE WHEN applied_at >= '${dateFilter.toISOString()}' THEN 1 END) as new_applications`)
        ])
        .first()

      // Get university distribution
      const universityDistribution = await db('users')
        .select('university')
        .count('* as count')
        .where('role', 'student')
        .where('is_active', true)
        .whereNotNull('university')
        .groupBy('university')
        .orderBy('count', 'desc')
        .limit(10)

      // Get top technologies
      const topTechnologies = await db('projects')
        .select('technologies')
        .where('is_active', true)
        .where('is_public', true)

      // Process technologies
      const techCount = {}
      topTechnologies.forEach(project => {
        const techs = JSON.parse(project.technologies || '[]')
        techs.forEach(tech => {
          techCount[tech] = (techCount[tech] || 0) + 1
        })
      })

      const sortedTechnologies = Object.entries(techCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([tech, count]) => ({ technology: tech, count }))

      res.json({
        success: true,
        data: {
          timeframe,
          users: userStats,
          projects: projectStats,
          jobs: jobStats,
          applications: applicationStats,
          universityDistribution,
          topTechnologies: sortedTechnologies
        }
      })
    } catch (error) {
      console.error('Get platform analytics error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch platform analytics'
      })
    }
  }

  // Get user analytics (for individual users)
  async getUserAnalytics(req, res) {
    try {
      const userId = req.user.id
      const { timeframe = '30d' } = req.query

      let dateFilter = new Date()
      switch (timeframe) {
        case '7d':
          dateFilter.setDate(dateFilter.getDate() - 7)
          break
        case '30d':
          dateFilter.setDate(dateFilter.getDate() - 30)
          break
        case '90d':
          dateFilter.setDate(dateFilter.getDate() - 90)
          break
        default:
          dateFilter.setDate(dateFilter.getDate() - 30)
      }

      // Get project analytics
      const projectAnalytics = await db('projects')
        .select([
          db.raw('COUNT(*) as total_projects'),
          db.raw('COUNT(CASE WHEN is_public = true THEN 1 END) as public_projects'),
          db.raw('SUM(views_count) as total_views'),
          db.raw('SUM(likes_count) as total_likes'),
          db.raw('AVG(views_count) as avg_views_per_project'),
          db.raw(`COUNT(CASE WHEN created_at >= '${dateFilter.toISOString()}' THEN 1 END) as recent_projects`)
        ])
        .where('user_id', userId)
        .where('is_active', true)
        .first()

      // Get project views over time
      const viewsOverTime = await db('projects')
        .select([
          db.raw('DATE(created_at) as date'),
          db.raw('SUM(views_count) as views')
        ])
        .where('user_id', userId)
        .where('is_active', true)
        .where('created_at', '>=', dateFilter)
        .groupBy(db.raw('DATE(created_at)'))
        .orderBy('date')

      // Get technology usage
      const projects = await db('projects')
        .select('technologies')
        .where('user_id', userId)
        .where('is_active', true)

      const techUsage = {}
      projects.forEach(project => {
        const techs = JSON.parse(project.technologies || '[]')
        techs.forEach(tech => {
          techUsage[tech] = (techUsage[tech] || 0) + 1
        })
      })

      const topTechnologies = Object.entries(techUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tech, count]) => ({ technology: tech, count }))

      // Role-specific analytics
      let roleSpecificData = {}

      if (req.user.role === 'student') {
        // Application analytics for students
        const applicationAnalytics = await db('job_applications')
          .select([
            db.raw('COUNT(*) as total_applications'),
            db.raw("COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending"),
            db.raw("COUNT(CASE WHEN status = 'reviewing' THEN 1 END) as reviewing"),
            db.raw("COUNT(CASE WHEN status = 'shortlisted' THEN 1 END) as shortlisted"),
            db.raw("COUNT(CASE WHEN status = 'interviewing' THEN 1 END) as interviewing"),
            db.raw("COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired"),
            db.raw("COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected")
          ])
          .where('user_id', userId)
          .first()

        roleSpecificData = { applications: applicationAnalytics }

      } else if (req.user.role === 'recruiter') {
        // Job posting analytics for recruiters
        const jobAnalytics = await db('jobs')
          .select([
            db.raw('COUNT(*) as total_jobs'),
            db.raw("COUNT(CASE WHEN status = 'published' THEN 1 END) as active_jobs"),
            db.raw('SUM(applications_count) as total_applications'),
            db.raw('SUM(views_count) as total_job_views'),
            db.raw('AVG(applications_count) as avg_applications_per_job')
          ])
          .where('created_by', userId)
          .where('is_active', true)
          .first()

        // Get top performing jobs
        const topJobs = await db('jobs')
          .select('id', 'title', 'applications_count', 'views_count')
          .where('created_by', userId)
          .where('is_active', true)
          .orderBy('applications_count', 'desc')
          .limit(5)

        roleSpecificData = { 
          jobs: jobAnalytics,
          topJobs
        }
      }

      res.json({
        success: true,
        data: {
          timeframe,
          projects: projectAnalytics,
          viewsOverTime,
          topTechnologies,
          ...roleSpecificData
        }
      })
    } catch (error) {
      console.error('Get user analytics error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user analytics'
      })
    }
  }

  // Get university analytics (for university staff)
  async getUniversityAnalytics(req, res) {
    try {
      const userId = req.user.id
      const { timeframe = '30d' } = req.query

      // Verify university role
      if (req.user.role !== 'university') {
        return res.status(403).json({
          success: false,
          error: 'University access required'
        })
      }

      // Get user's university
      const user = await db('users')
        .select('university')
        .where('id', userId)
        .first()

      if (!user.university) {
        return res.status(400).json({
          success: false,
          error: 'University not specified in profile'
        })
      }

      let dateFilter = new Date()
      switch (timeframe) {
        case '7d':
          dateFilter.setDate(dateFilter.getDate() - 7)
          break
        case '30d':
          dateFilter.setDate(dateFilter.getDate() - 30)
          break
        case '90d':
          dateFilter.setDate(dateFilter.getDate() - 90)
          break
        default:
          dateFilter.setDate(dateFilter.getDate() - 30)
      }

      // Get student statistics
      const studentStats = await db('users')
        .select([
          db.raw('COUNT(*) as total_students'),
          db.raw('COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_students'),
          db.raw(`COUNT(CASE WHEN created_at >= '${dateFilter.toISOString()}' THEN 1 END) as new_students`)
        ])
        .where('university', user.university)
        .where('role', 'student')
        .where('is_active', true)
        .first()

      // Get project statistics for university students
      const projectStats = await db('projects')
        .join('users', 'projects.user_id', 'users.id')
        .select([
          db.raw('COUNT(*) as total_projects'),
          db.raw('COUNT(CASE WHEN projects.is_public = true THEN 1 END) as public_projects'),
          db.raw('SUM(projects.views_count) as total_views'),
          db.raw('SUM(projects.likes_count) as total_likes'),
          db.raw('AVG(projects.views_count) as avg_views')
        ])
        .where('users.university', user.university)
        .where('users.role', 'student')
        .where('projects.is_active', true)
        .first()

      // Get application success rates
      const applicationStats = await db('job_applications')
        .join('users', 'job_applications.user_id', 'users.id')
        .select([
          db.raw('COUNT(*) as total_applications'),
          db.raw("COUNT(CASE WHEN job_applications.status = 'hired' THEN 1 END) as successful_hires"),
          db.raw("COUNT(CASE WHEN job_applications.status = 'interviewing' THEN 1 END) as interviews"),
          db.raw("ROUND(COUNT(CASE WHEN job_applications.status = 'hired' THEN 1 END) * 100.0 / COUNT(*), 2) as hire_rate")
        ])
        .where('users.university', user.university)
        .where('users.role', 'student')
        .first()

      // Get graduation year distribution
      const graduationDistribution = await db('users')
        .select('graduation_year')
        .count('* as count')
        .where('university', user.university)
        .where('role', 'student')
        .where('is_active', true)
        .whereNotNull('graduation_year')
        .groupBy('graduation_year')
        .orderBy('graduation_year')

      // Get top skills among students
      const students = await db('users')
        .select('skills')
        .where('university', user.university)
        .where('role', 'student')
        .where('is_active', true)
        .whereNotNull('skills')

      const skillCount = {}
      students.forEach(student => {
        const skills = JSON.parse(student.skills || '[]')
        skills.forEach(skill => {
          skillCount[skill] = (skillCount[skill] || 0) + 1
        })
      })

      const topSkills = Object.entries(skillCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 15)
        .map(([skill, count]) => ({ skill, count }))

      // Get companies hiring from this university
      const hiringCompanies = await db('job_applications')
        .join('users', 'job_applications.user_id', 'users.id')
        .join('jobs', 'job_applications.job_id', 'jobs.id')
        .select('jobs.company')
        .count('* as applications')
        .where('users.university', user.university)
        .where('users.role', 'student')
        .whereIn('job_applications.status', ['hired', 'interviewing', 'shortlisted'])
        .groupBy('jobs.company')
        .orderBy('applications', 'desc')
        .limit(10)

      res.json({
        success: true,
        data: {
          university: user.university,
          timeframe,
          students: studentStats,
          projects: projectStats,
          applications: applicationStats,
          graduationDistribution,
          topSkills,
          hiringCompanies
        }
      })
    } catch (error) {
      console.error('Get university analytics error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch university analytics'
      })
    }
  }

  // Get market trends and insights
  async getMarketTrends(req, res) {
    try {
      const { industry = 'technology', location = 'United States' } = req.query

      try {
        // Get AI-powered market analysis
        const trends = await analyzeMarketTrends(industry, location)
        
        res.json({
          success: true,
          data: { trends }
        })
      } catch (aiError) {
        // Fallback to database analysis if AI service fails
        console.warn('AI service unavailable, using fallback trends')
        
        // Get basic trends from database
        const jobTrends = await db('jobs')
          .select([
            'employment_type',
            db.raw('COUNT(*) as count'),
            db.raw('AVG(salary_min) as avg_salary_min'),
            db.raw('AVG(salary_max) as avg_salary_max')
          ])
          .where('is_active', true)
          .where('status', 'published')
          .where('created_at', '>=', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
          .groupBy('employment_type')

        // Get skill demand
        const jobs = await db('jobs')
          .select('required_skills')
          .where('is_active', true)
          .where('status', 'published')
          .where('created_at', '>=', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))

        const skillDemand = {}
        jobs.forEach(job => {
          const skills = JSON.parse(job.required_skills || '[]')
          skills.forEach(skill => {
            skillDemand[skill] = (skillDemand[skill] || 0) + 1
          })
        })

        const topSkills = Object.entries(skillDemand)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 20)
          .map(([skill, demand]) => ({ skill, demand }))

        res.json({
          success: true,
          data: {
            trends: {
              employment_trends: jobTrends,
              skill_demand: topSkills,
              source: 'database_fallback'
            }
          }
        })
      }
    } catch (error) {
      console.error('Get market trends error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market trends'
      })
    }
  }

  // Get skills gap analysis
  async getSkillsGapAnalysis(req, res) {
    try {
      // Get job skill requirements
      const jobs = await db('jobs')
        .select('required_skills', 'preferred_skills')
        .where('is_active', true)
        .where('status', 'published')
        .where('created_at', '>=', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))

      const demandedSkills = {}
      jobs.forEach(job => {
        const required = JSON.parse(job.required_skills || '[]')
        const preferred = JSON.parse(job.preferred_skills || '[]')
        
        required.forEach(skill => {
          demandedSkills[skill] = (demandedSkills[skill] || 0) + 2 // Weight required skills higher
        })
        
        preferred.forEach(skill => {
          demandedSkills[skill] = (demandedSkills[skill] || 0) + 1
        })
      })

      // Get student skills supply
      const students = await db('users')
        .select('skills')
        .where('role', 'student')
        .where('is_active', true)
        .whereNotNull('skills')

      const suppliedSkills = {}
      students.forEach(student => {
        const skills = JSON.parse(student.skills || '[]')
        skills.forEach(skill => {
          suppliedSkills[skill] = (suppliedSkills[skill] || 0) + 1
        })
      })

      // Calculate gap
      const skillsAnalysis = []
      const allSkills = new Set([...Object.keys(demandedSkills), ...Object.keys(suppliedSkills)])

      allSkills.forEach(skill => {
        const demand = demandedSkills[skill] || 0
        const supply = suppliedSkills[skill] || 0
        const gap = demand - supply
        const gapPercentage = demand > 0 ? Math.round((gap / demand) * 100) : 0

        skillsAnalysis.push({
          skill,
          demand,
          supply,
          gap,
          gapPercentage,
          status: gap > 0 ? 'shortage' : gap < 0 ? 'surplus' : 'balanced'
        })
      })

      // Sort by gap (highest shortage first)
      skillsAnalysis.sort((a, b) => b.gap - a.gap)

      const topShortages = skillsAnalysis.filter(s => s.gap > 0).slice(0, 20)
      const topSurplus = skillsAnalysis.filter(s => s.gap < 0).slice(-10).reverse()

      res.json({
        success: true,
        data: {
          overview: {
            total_skills_analyzed: skillsAnalysis.length,
            skills_in_shortage: skillsAnalysis.filter(s => s.gap > 0).length,
            skills_in_surplus: skillsAnalysis.filter(s => s.gap < 0).length,
            balanced_skills: skillsAnalysis.filter(s => s.gap === 0).length
          },
          top_shortages: topShortages,
          top_surplus: topSurplus
        }
      })
    } catch (error) {
      console.error('Get skills gap analysis error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to perform skills gap analysis'
      })
    }
  }

  // Export analytics data
  async exportAnalytics(req, res) {
    try {
      const { type, format = 'json' } = req.query
      
      // Verify admin access for platform exports
      if (type === 'platform' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        })
      }

      let data = {}

      switch (type) {
        case 'platform':
          // Get comprehensive platform data
          data = await this.getPlatformExportData()
          break
        case 'user':
          data = await this.getUserExportData(req.user.id)
          break
        case 'university':
          if (req.user.role !== 'university') {
            return res.status(403).json({
              success: false,
              error: 'University access required'
            })
          }
          data = await this.getUniversityExportData(req.user.id)
          break
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid export type'
          })
      }

      if (format === 'csv') {
        // Convert to CSV format
        const csv = this.convertToCSV(data)
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename="${type}_analytics.csv"`)
        res.send(csv)
      } else {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Content-Disposition', `attachment; filename="${type}_analytics.json"`)
        res.json({
          success: true,
          exported_at: new Date().toISOString(),
          data
        })
      }
    } catch (error) {
      console.error('Export analytics error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to export analytics'
      })
    }
  }

  // Helper methods for data export
  async getPlatformExportData() {
    // Implementation would include comprehensive platform statistics
    return {
      users: await db('users').select('*').where('is_active', true),
      projects: await db('projects').select('*').where('is_active', true),
      jobs: await db('jobs').select('*').where('is_active', true),
      applications: await db('job_applications').select('*')
    }
  }

  async getUserExportData(userId) {
    return {
      projects: await db('projects').select('*').where('user_id', userId).where('is_active', true),
      applications: await db('job_applications').select('*').where('user_id', userId)
    }
  }

  async getUniversityExportData(userId) {
    const user = await db('users').select('university').where('id', userId).first()
    
    return {
      students: await db('users').select('*').where('university', user.university).where('role', 'student'),
      projects: await db('projects')
        .join('users', 'projects.user_id', 'users.id')
        .select('projects.*')
        .where('users.university', user.university)
        .where('projects.is_active', true)
    }
  }

  convertToCSV(data) {
    // Simple CSV conversion - in production, use a proper CSV library
    if (Array.isArray(data)) {
      if (data.length === 0) return ''
      
      const headers = Object.keys(data[0]).join(',')
      const rows = data.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(',')
      ).join('\n')
      
      return `${headers}\n${rows}`
    }
    
    return JSON.stringify(data, null, 2)
  }
}

module.exports = new AnalyticsController()