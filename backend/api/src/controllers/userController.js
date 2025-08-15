const { v4: uuidv4 } = require('uuid')
const db = require('../config/database')
const { validateInput } = require('../utils/validation')
const { uploadToS3, deleteFromS3 } = require('../services/s3Service')
const { assessSkills, generateResumeSuggestions } = require('../services/aiService')

class UserController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const { id } = req.params
      const requestingUserId = req.user?.id

      // Check if user exists
      const user = await db('users')
        .select([
          'id',
          'first_name',
          'last_name', 
          'email',
          'role',
          'university',
          'company',
          'department',
          'graduation_year',
          'bio',
          'avatar_url',
          'linkedin_url',
          'github_url',
          'portfolio_url',
          'location',
          'skills',
          'interests',
          'email_verified',
          'created_at',
          'last_login'
        ])
        .where('id', id)
        .where('is_active', true)
        .first()

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      // Parse JSON fields
      const processedUser = {
        ...user,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]'),
        isOwnProfile: requestingUserId === id
      }

      // Get user's projects count
      const projectsCount = await db('projects')
        .where('user_id', id)
        .where('is_active', true)
        .where('is_public', true)
        .count('* as count')
        .first()

      processedUser.projectsCount = parseInt(projectsCount.count)

      // Get user's project statistics
      const projectStats = await db('projects')
        .select([
          db.raw('COUNT(*) as total_projects'),
          db.raw('SUM(views_count) as total_views'),
          db.raw('SUM(likes_count) as total_likes'),
          db.raw('AVG(CASE WHEN ai_analysis IS NOT NULL THEN (ai_analysis->>\'score\')::numeric ELSE 0 END) as avg_score')
        ])
        .where('user_id', id)
        .where('is_active', true)
        .where('is_public', true)
        .first()

      processedUser.stats = {
        totalProjects: parseInt(projectStats.total_projects) || 0,
        totalViews: parseInt(projectStats.total_views) || 0,
        totalLikes: parseInt(projectStats.total_likes) || 0,
        averageScore: Math.round(parseFloat(projectStats.avg_score) || 0)
      }

      res.json({
        success: true,
        data: { user: processedUser }
      })
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user profile'
      })
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id
      const {
        firstName,
        lastName,
        bio,
        location,
        skills,
        interests,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        university,
        company,
        department,
        graduationYear
      } = req.body

      // Validate input
      const validation = validateInput({
        firstName,
        lastName,
        bio,
        location
      }, {
        firstName: 'required|min:2|max:50',
        lastName: 'required|min:2|max:50',
        bio: 'max:500',
        location: 'max:100'
      })

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        })
      }

      // Validate URLs
      if (linkedinUrl && !linkedinUrl.match(/^https?:\/\/(www\.)?linkedin\.com/)) {
        return res.status(400).json({
          success: false,
          error: 'LinkedIn URL must be a valid LinkedIn profile URL'
        })
      }

      if (githubUrl && !githubUrl.match(/^https?:\/\/(www\.)?github\.com/)) {
        return res.status(400).json({
          success: false,
          error: 'GitHub URL must be a valid GitHub profile URL'
        })
      }

      // Build update object
      const updateData = {
        first_name: firstName,
        last_name: lastName,
        bio: bio || null,
        location: location || null,
        skills: JSON.stringify(skills || []),
        interests: JSON.stringify(interests || []),
        linkedin_url: linkedinUrl || null,
        github_url: githubUrl || null,
        portfolio_url: portfolioUrl || null,
        updated_at: new Date()
      }

      // Add role-specific fields
      if (university) updateData.university = university
      if (company) updateData.company = company
      if (department) updateData.department = department
      if (graduationYear) updateData.graduation_year = graduationYear

      // Update user
      await db('users')
        .where('id', userId)
        .update(updateData)

      // Get updated user
      const user = await db('users')
        .select([
          'id',
          'first_name',
          'last_name',
          'email',
          'role',
          'university',
          'company',
          'department',
          'graduation_year',
          'bio',
          'avatar_url',
          'linkedin_url',
          'github_url',
          'portfolio_url',
          'location',
          'skills',
          'interests',
          'email_verified',
          'created_at'
        ])
        .where('id', userId)
        .first()

      const processedUser = {
        ...user,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]')
      }

      res.json({
        success: true,
        data: { user: processedUser }
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      })
    }
  }

  // Upload profile picture
  async uploadAvatar(req, res) {
    try {
      const userId = req.user.id

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        })
      }

      // Validate file type
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          error: 'File must be an image'
        })
      }

      // Get current user to check for existing avatar
      const currentUser = await db('users')
        .select('avatar_url')
        .where('id', userId)
        .first()

      // Delete old avatar if exists
      if (currentUser.avatar_url && currentUser.avatar_url.includes('amazonaws.com')) {
        try {
          const oldKey = currentUser.avatar_url.split('/').pop()
          await deleteFromS3(`avatars/${oldKey}`)
        } catch (deleteError) {
          console.error('Failed to delete old avatar:', deleteError)
        }
      }

      // Upload new avatar
      const uploadResult = await uploadToS3(req.file, 'avatars/')

      // Update user avatar URL
      await db('users')
        .where('id', userId)
        .update({
          avatar_url: uploadResult.url,
          updated_at: new Date()
        })

      res.json({
        success: true,
        data: {
          avatarUrl: uploadResult.url
        }
      })
    } catch (error) {
      console.error('Upload avatar error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to upload avatar'
      })
    }
  }

  // Get user's projects
  async getUserProjects(req, res) {
    try {
      const { id } = req.params
      const requestingUserId = req.user?.id
      const { 
        page = 1, 
        limit = 20, 
        status,
        isPublic 
      } = req.query

      const offset = (page - 1) * limit

      // Check if user exists
      const userExists = await db('users')
        .where('id', id)
        .where('is_active', true)
        .first()

      if (!userExists) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      let query = db('projects')
        .select([
          'id',
          'title',
          'description',
          'technologies',
          'is_public',
          'status',
          'views_count',
          'likes_count',
          'ai_analysis',
          'created_at',
          'updated_at'
        ])
        .where('user_id', id)
        .where('is_active', true)
        .orderBy('created_at', 'desc')

      // Apply filters
      if (status) {
        query = query.where('status', status)
      }

      // If not the owner, only show public projects
      if (requestingUserId !== id) {
        query = query.where('is_public', true)
      } else if (isPublic !== undefined) {
        query = query.where('is_public', isPublic === 'true')
      }

      // Get total count
      const totalQuery = query.clone().clearSelect().count('* as count')
      const [{ count: total }] = await totalQuery

      // Get projects with pagination
      const projects = await query.limit(limit).offset(offset)

      // Process projects
      const processedProjects = projects.map(project => ({
        ...project,
        technologies: JSON.parse(project.technologies || '[]'),
        ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null
      }))

      res.json({
        success: true,
        data: {
          projects: processedProjects,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      console.error('Get user projects error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user projects'
      })
    }
  }

  // Search users
  async searchUsers(req, res) {
    try {
      const {
        q: searchQuery,
        role,
        university,
        skills,
        page = 1,
        limit = 20
      } = req.query

      const offset = (page - 1) * limit

      let query = db('users')
        .select([
          'id',
          'first_name',
          'last_name',
          'role',
          'university',
          'company',
          'bio',
          'avatar_url',
          'location',
          'skills',
          'created_at'
        ])
        .where('is_active', true)

      // Apply search filters
      if (searchQuery) {
        query = query.where(function() {
          this.where('first_name', 'ilike', `%${searchQuery}%`)
            .orWhere('last_name', 'ilike', `%${searchQuery}%`)
            .orWhere('bio', 'ilike', `%${searchQuery}%`)
        })
      }

      if (role) {
        query = query.where('role', role)
      }

      if (university) {
        query = query.where('university', university)
      }

      if (skills) {
        query = query.where('skills', 'ilike', `%${skills}%`)
      }

      // Get total count
      const totalQuery = query.clone().clearSelect().count('* as count')
      const [{ count: total }] = await totalQuery

      // Get users with pagination
      const users = await query
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)

      // Process users
      const processedUsers = users.map(user => ({
        ...user,
        skills: JSON.parse(user.skills || '[]')
      }))

      res.json({
        success: true,
        data: {
          users: processedUsers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      console.error('Search users error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to search users'
      })
    }
  }

  // Get skill assessment
  async getSkillAssessment(req, res) {
    try {
      const userId = req.user.id
      const { targetSkills } = req.body

      if (!targetSkills || !Array.isArray(targetSkills)) {
        return res.status(400).json({
          success: false,
          error: 'Target skills must be provided as an array'
        })
      }

      // Get user's projects
      const projects = await db('projects')
        .select([
          'title',
          'description', 
          'technologies',
          'achievements',
          'ai_analysis'
        ])
        .where('user_id', userId)
        .where('is_active', true)

      const processedProjects = projects.map(project => ({
        ...project,
        technologies: JSON.parse(project.technologies || '[]'),
        achievements: JSON.parse(project.achievements || '[]'),
        ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null
      }))

      // Call AI service for skill assessment
      const assessment = await assessSkills(processedProjects, targetSkills)

      res.json({
        success: true,
        data: { assessment }
      })
    } catch (error) {
      console.error('Skill assessment error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to assess skills'
      })
    }
  }

  // Get resume suggestions
  async getResumeSuggestions(req, res) {
    try {
      const userId = req.user.id
      const { targetRole } = req.body

      // Get user profile
      const user = await db('users')
        .select('*')
        .where('id', userId)
        .first()

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      // Get user's projects
      const projects = await db('projects')
        .select([
          'title',
          'description',
          'technologies',
          'achievements',
          'ai_analysis'
        ])
        .where('user_id', userId)
        .where('is_active', true)

      const userProfile = {
        ...user,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]'),
        projects: projects.map(project => ({
          ...project,
          technologies: JSON.parse(project.technologies || '[]'),
          achievements: JSON.parse(project.achievements || '[]'),
          ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null
        }))
      }

      // Call AI service for resume suggestions
      const suggestions = await generateResumeSuggestions(userProfile, targetRole)

      res.json({
        success: true,
        data: { suggestions }
      })
    } catch (error) {
      console.error('Resume suggestions error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to generate resume suggestions'
      })
    }
  }

  // Delete user account
  async deleteAccount(req, res) {
    try {
      const userId = req.user.id
      const { password } = req.body

      // Verify password before deletion
      const user = await db('users')
        .select('password_hash')
        .where('id', userId)
        .first()

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      const bcrypt = require('bcryptjs')
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Invalid password'
        })
      }

      // Soft delete user account
      await db('users')
        .where('id', userId)
        .update({
          is_active: false,
          email: `deleted_${Date.now()}_${user.email}`,
          updated_at: new Date()
        })

      // Soft delete user's projects
      await db('projects')
        .where('user_id', userId)
        .update({
          is_active: false,
          updated_at: new Date()
        })

      res.json({
        success: true,
        message: 'Account deleted successfully'
      })
    } catch (error) {
      console.error('Delete account error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete account'
      })
    }
  }
}

module.exports = new UserController()