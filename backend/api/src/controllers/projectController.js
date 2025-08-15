const { v4: uuidv4 } = require('uuid')
const db = require('../config/database')
const { validateInput } = require('../utils/validation')
const { uploadToS3, deleteFromS3 } = require('../services/s3Service')
const { analyzeProject } = require('../services/aiService')

class ProjectController {
  // Get all projects with filtering and pagination
  async getProjects(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        technology,
        university,
        role,
        sortBy = 'created_at',
        sortOrder = 'desc',
        userId,
        isPublic
      } = req.query

      const offset = (page - 1) * limit
      let query = db('projects')
        .select([
          'projects.*',
          'users.first_name',
          'users.last_name',
          'users.university',
          'users.role',
          'users.avatar_url'
        ])
        .leftJoin('users', 'projects.user_id', 'users.id')
        .where('projects.is_active', true)

      // Apply filters
      if (search) {
        query = query.where(function() {
          this.where('projects.title', 'ilike', `%${search}%`)
            .orWhere('projects.description', 'ilike', `%${search}%`)
            .orWhere('projects.technologies', 'ilike', `%${search}%`)
        })
      }

      if (technology) {
        query = query.where('projects.technologies', 'ilike', `%${technology}%`)
      }

      if (university) {
        query = query.where('users.university', '=', university)
      }

      if (role) {
        query = query.where('users.role', '=', role)
      }

      if (userId) {
        query = query.where('projects.user_id', '=', userId)
      }

      if (isPublic !== undefined) {
        query = query.where('projects.is_public', '=', isPublic === 'true')
      }

      // If not authenticated or not the owner, only show public projects
      if (!req.user || (userId && req.user.id !== userId)) {
        query = query.where('projects.is_public', true)
      }

      // Apply sorting
      const validSortFields = ['created_at', 'updated_at', 'title', 'views_count', 'likes_count']
      if (validSortFields.includes(sortBy)) {
        query = query.orderBy(`projects.${sortBy}`, sortOrder.toLowerCase())
      }

      // Get total count for pagination
      const totalQuery = query.clone().clearSelect().clearOrder().count('* as count')
      const [{ count: total }] = await totalQuery

      // Execute main query with pagination
      const projects = await query.limit(limit).offset(offset)

      // Parse JSON fields
      const processedProjects = projects.map(project => ({
        ...project,
        technologies: JSON.parse(project.technologies || '[]'),
        collaborators: JSON.parse(project.collaborators || '[]'),
        achievements: JSON.parse(project.achievements || '[]'),
        links: JSON.parse(project.links || '{}'),
        media: JSON.parse(project.media || '[]'),
        ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null,
        author: {
          firstName: project.first_name,
          lastName: project.last_name,
          university: project.university,
          role: project.role,
          avatarUrl: project.avatar_url
        }
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
      console.error('Get projects error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch projects'
      })
    }
  }

  // Get single project by ID
  async getProject(req, res) {
    try {
      const { id } = req.params

      const project = await db('projects')
        .select([
          'projects.*',
          'users.first_name',
          'users.last_name',
          'users.university',
          'users.role',
          'users.avatar_url',
          'users.bio',
          'users.linkedin_url',
          'users.github_url'
        ])
        .leftJoin('users', 'projects.user_id', 'users.id')
        .where('projects.id', id)
        .where('projects.is_active', true)
        .first()

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        })
      }

      // Check if user can view this project
      if (!project.is_public) {
        if (!req.user || req.user.id !== project.user_id) {
          return res.status(403).json({
            success: false,
            error: 'Access denied'
          })
        }
      }

      // Increment view count (only for public projects and if not the owner)
      if (project.is_public && (!req.user || req.user.id !== project.user_id)) {
        await db('projects')
          .where('id', id)
          .increment('views_count', 1)
      }

      // Parse JSON fields
      const processedProject = {
        ...project,
        technologies: JSON.parse(project.technologies || '[]'),
        collaborators: JSON.parse(project.collaborators || '[]'),
        achievements: JSON.parse(project.achievements || '[]'),
        links: JSON.parse(project.links || '{}'),
        media: JSON.parse(project.media || '[]'),
        ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null,
        author: {
          firstName: project.first_name,
          lastName: project.last_name,
          university: project.university,
          role: project.role,
          avatarUrl: project.avatar_url,
          bio: project.bio,
          linkedinUrl: project.linkedin_url,
          githubUrl: project.github_url
        }
      }

      res.json({
        success: true,
        data: { project: processedProject }
      })
    } catch (error) {
      console.error('Get project error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch project'
      })
    }
  }

  // Create new project
  async createProject(req, res) {
    try {
      const userId = req.user.id
      const {
        title,
        description,
        technologies,
        collaborators,
        achievements,
        links,
        isPublic = true,
        startDate,
        endDate,
        status = 'completed'
      } = req.body

      // Validate required fields
      const validation = validateInput({
        title,
        description,
        technologies
      }, {
        title: 'required|min:5|max:100',
        description: 'required|min:20|max:2000',
        technologies: 'required|array|min:1'
      })

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        })
      }

      // Create project
      const projectId = uuidv4()
      const projectData = {
        id: projectId,
        user_id: userId,
        title,
        description,
        technologies: JSON.stringify(technologies),
        collaborators: JSON.stringify(collaborators || []),
        achievements: JSON.stringify(achievements || []),
        links: JSON.stringify(links || {}),
        is_public: isPublic,
        start_date: startDate ? new Date(startDate) : null,
        end_date: endDate ? new Date(endDate) : null,
        status,
        views_count: 0,
        likes_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true
      }

      await db('projects').insert(projectData)

      // Trigger AI analysis in background
      try {
        const aiAnalysis = await analyzeProject({
          title,
          description,
          technologies,
          collaborators,
          achievements
        })

        await db('projects')
          .where('id', projectId)
          .update({
            ai_analysis: JSON.stringify(aiAnalysis),
            updated_at: new Date()
          })
      } catch (aiError) {
        console.error('AI analysis failed:', aiError)
        // Don't fail project creation if AI analysis fails
      }

      // Get created project with user info
      const project = await db('projects')
        .select([
          'projects.*',
          'users.first_name',
          'users.last_name',
          'users.university',
          'users.role',
          'users.avatar_url'
        ])
        .leftJoin('users', 'projects.user_id', 'users.id')
        .where('projects.id', projectId)
        .first()

      const processedProject = {
        ...project,
        technologies: JSON.parse(project.technologies || '[]'),
        collaborators: JSON.parse(project.collaborators || '[]'),
        achievements: JSON.parse(project.achievements || '[]'),
        links: JSON.parse(project.links || '{}'),
        media: JSON.parse(project.media || '[]'),
        ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null,
        author: {
          firstName: project.first_name,
          lastName: project.last_name,
          university: project.university,
          role: project.role,
          avatarUrl: project.avatar_url
        }
      }

      res.status(201).json({
        success: true,
        data: { project: processedProject }
      })
    } catch (error) {
      console.error('Create project error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create project'
      })
    }
  }

  // Update project
  async updateProject(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const {
        title,
        description,
        technologies,
        collaborators,
        achievements,
        links,
        isPublic,
        startDate,
        endDate,
        status
      } = req.body

      // Check if project exists and user owns it
      const existingProject = await db('projects')
        .where('id', id)
        .where('user_id', userId)
        .where('is_active', true)
        .first()

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          error: 'Project not found or access denied'
        })
      }

      // Build update object
      const updateData = {
        updated_at: new Date()
      }

      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (technologies !== undefined) updateData.technologies = JSON.stringify(technologies)
      if (collaborators !== undefined) updateData.collaborators = JSON.stringify(collaborators)
      if (achievements !== undefined) updateData.achievements = JSON.stringify(achievements)
      if (links !== undefined) updateData.links = JSON.stringify(links)
      if (isPublic !== undefined) updateData.is_public = isPublic
      if (startDate !== undefined) updateData.start_date = startDate ? new Date(startDate) : null
      if (endDate !== undefined) updateData.end_date = endDate ? new Date(endDate) : null
      if (status !== undefined) updateData.status = status

      // Update project
      await db('projects')
        .where('id', id)
        .update(updateData)

      // Re-run AI analysis if content changed
      if (title || description || technologies || achievements) {
        try {
          const projectForAnalysis = {
            title: title || existingProject.title,
            description: description || existingProject.description,
            technologies: technologies || JSON.parse(existingProject.technologies || '[]'),
            collaborators: collaborators || JSON.parse(existingProject.collaborators || '[]'),
            achievements: achievements || JSON.parse(existingProject.achievements || '[]')
          }

          const aiAnalysis = await analyzeProject(projectForAnalysis)

          await db('projects')
            .where('id', id)
            .update({
              ai_analysis: JSON.stringify(aiAnalysis),
              updated_at: new Date()
            })
        } catch (aiError) {
          console.error('AI analysis failed:', aiError)
        }
      }

      // Get updated project
      const project = await db('projects')
        .select([
          'projects.*',
          'users.first_name',
          'users.last_name',
          'users.university',
          'users.role',
          'users.avatar_url'
        ])
        .leftJoin('users', 'projects.user_id', 'users.id')
        .where('projects.id', id)
        .first()

      const processedProject = {
        ...project,
        technologies: JSON.parse(project.technologies || '[]'),
        collaborators: JSON.parse(project.collaborators || '[]'),
        achievements: JSON.parse(project.achievements || '[]'),
        links: JSON.parse(project.links || '{}'),
        media: JSON.parse(project.media || '[]'),
        ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null,
        author: {
          firstName: project.first_name,
          lastName: project.last_name,
          university: project.university,
          role: project.role,
          avatarUrl: project.avatar_url
        }
      }

      res.json({
        success: true,
        data: { project: processedProject }
      })
    } catch (error) {
      console.error('Update project error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update project'
      })
    }
  }

  // Delete project
  async deleteProject(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Check if project exists and user owns it
      const project = await db('projects')
        .where('id', id)
        .where('user_id', userId)
        .where('is_active', true)
        .first()

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found or access denied'
        })
      }

      // Soft delete the project
      await db('projects')
        .where('id', id)
        .update({
          is_active: false,
          updated_at: new Date()
        })

      // Delete associated media files from S3
      try {
        const media = JSON.parse(project.media || '[]')
        for (const mediaFile of media) {
          if (mediaFile.url && mediaFile.url.includes('amazonaws.com')) {
            await deleteFromS3(mediaFile.key)
          }
        }
      } catch (deleteError) {
        console.error('Failed to delete media files:', deleteError)
      }

      res.json({
        success: true,
        message: 'Project deleted successfully'
      })
    } catch (error) {
      console.error('Delete project error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete project'
      })
    }
  }

  // Upload project media
  async uploadMedia(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Check if project exists and user owns it
      const project = await db('projects')
        .where('id', id)
        .where('user_id', userId)
        .where('is_active', true)
        .first()

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found or access denied'
        })
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded'
        })
      }

      const uploadedFiles = []
      const existingMedia = JSON.parse(project.media || '[]')

      // Upload each file to S3
      for (const file of req.files) {
        try {
          const uploadResult = await uploadToS3(file, `projects/${id}/`)
          uploadedFiles.push({
            id: uuidv4(),
            type: file.mimetype.startsWith('image/') ? 'image' : 'document',
            filename: file.originalname,
            url: uploadResult.url,
            key: uploadResult.key,
            size: file.size,
            uploadedAt: new Date()
          })
        } catch (uploadError) {
          console.error('File upload failed:', uploadError)
        }
      }

      // Update project with new media
      const updatedMedia = [...existingMedia, ...uploadedFiles]
      await db('projects')
        .where('id', id)
        .update({
          media: JSON.stringify(updatedMedia),
          updated_at: new Date()
        })

      res.json({
        success: true,
        data: { uploadedFiles }
      })
    } catch (error) {
      console.error('Upload media error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to upload media'
      })
    }
  }

  // Delete project media
  async deleteMedia(req, res) {
    try {
      const { id, mediaId } = req.params
      const userId = req.user.id

      // Check if project exists and user owns it
      const project = await db('projects')
        .where('id', id)
        .where('user_id', userId)
        .where('is_active', true)
        .first()

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found or access denied'
        })
      }

      const media = JSON.parse(project.media || '[]')
      const mediaIndex = media.findIndex(m => m.id === mediaId)

      if (mediaIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Media file not found'
        })
      }

      const mediaFile = media[mediaIndex]

      // Delete from S3
      try {
        await deleteFromS3(mediaFile.key)
      } catch (deleteError) {
        console.error('Failed to delete from S3:', deleteError)
      }

      // Remove from media array
      media.splice(mediaIndex, 1)

      // Update project
      await db('projects')
        .where('id', id)
        .update({
          media: JSON.stringify(media),
          updated_at: new Date()
        })

      res.json({
        success: true,
        message: 'Media file deleted successfully'
      })
    } catch (error) {
      console.error('Delete media error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete media'
      })
    }
  }

  // Like/Unlike project
  async toggleLike(req, res) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Check if project exists and is public
      const project = await db('projects')
        .where('id', id)
        .where('is_active', true)
        .where('is_public', true)
        .first()

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        })
      }

      // Check if user already liked this project
      const existingLike = await db('project_likes')
        .where('project_id', id)
        .where('user_id', userId)
        .first()

      if (existingLike) {
        // Unlike
        await db('project_likes')
          .where('project_id', id)
          .where('user_id', userId)
          .del()

        await db('projects')
          .where('id', id)
          .decrement('likes_count', 1)

        res.json({
          success: true,
          data: { liked: false }
        })
      } else {
        // Like
        await db('project_likes').insert({
          id: uuidv4(),
          project_id: id,
          user_id: userId,
          created_at: new Date()
        })

        await db('projects')
          .where('id', id)
          .increment('likes_count', 1)

        res.json({
          success: true,
          data: { liked: true }
        })
      }
    } catch (error) {
      console.error('Toggle like error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to toggle like'
      })
    }
  }

  // Get user's liked projects
  async getLikedProjects(req, res) {
    try {
      const userId = req.user.id
      const { page = 1, limit = 20 } = req.query
      const offset = (page - 1) * limit

      const projects = await db('projects')
        .select([
          'projects.*',
          'users.first_name',
          'users.last_name',
          'users.university',
          'users.role',
          'users.avatar_url'
        ])
        .join('project_likes', 'projects.id', 'project_likes.project_id')
        .leftJoin('users', 'projects.user_id', 'users.id')
        .where('project_likes.user_id', userId)
        .where('projects.is_active', true)
        .where('projects.is_public', true)
        .orderBy('project_likes.created_at', 'desc')
        .limit(limit)
        .offset(offset)

      const processedProjects = projects.map(project => ({
        ...project,
        technologies: JSON.parse(project.technologies || '[]'),
        collaborators: JSON.parse(project.collaborators || '[]'),
        achievements: JSON.parse(project.achievements || '[]'),
        links: JSON.parse(project.links || '{}'),
        media: JSON.parse(project.media || '[]'),
        ai_analysis: project.ai_analysis ? JSON.parse(project.ai_analysis) : null,
        author: {
          firstName: project.first_name,
          lastName: project.last_name,
          university: project.university,
          role: project.role,
          avatarUrl: project.avatar_url
        }
      }))

      res.json({
        success: true,
        data: { projects: processedProjects }
      })
    } catch (error) {
      console.error('Get liked projects error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch liked projects'
      })
    }
  }
}

module.exports = new ProjectController()