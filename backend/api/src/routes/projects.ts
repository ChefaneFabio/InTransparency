import { Router } from 'express'
import Joi from 'joi'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { db } from '../config/database'
import { authenticate, AuthRequest, optional } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'

const router = Router()
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// Validation schemas
const projectSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(2000).required(),
  technologies: Joi.array().items(Joi.string()).min(1).required(),
  category: Joi.string().valid(
    'web-development',
    'mobile-development', 
    'data-science',
    'machine-learning',
    'ai',
    'blockchain',
    'game-development',
    'iot',
    'cybersecurity',
    'other'
  ).required(),
  repositoryUrl: Joi.string().uri().optional(),
  liveUrl: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublic: Joi.boolean().default(true),
  collaborators: Joi.array().items(Joi.string().email()).optional(),
})

const updateProjectSchema = projectSchema.fork(['title', 'description', 'technologies', 'category'], (schema) => 
  schema.optional()
)

// Get all projects (with filtering and pagination)
router.get('/', optional, async (req: AuthRequest, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      technologies,
      search,
      userId,
      featured,
      sortBy = 'created_at',
      order = 'desc'
    } = req.query

    const offset = (Number(page) - 1) * Number(limit)
    
    let query = db('projects')
      .select(
        'projects.*',
        'users.first_name as authorFirstName',
        'users.last_name as authorLastName',
        'users.avatar_url as authorAvatar',
        'users.university as authorUniversity'
      )
      .leftJoin('users', 'projects.user_id', 'users.id')
      .where('projects.is_public', true)

    // Apply filters
    if (category) {
      query = query.where('projects.category', category)
    }

    if (technologies) {
      const techArray = Array.isArray(technologies) ? technologies : [technologies]
      query = query.whereRaw('projects.technologies ?| array[?]', [techArray])
    }

    if (search) {
      query = query.where(function() {
        this.whereILike('projects.title', `%${search}%`)
          .orWhereILike('projects.description', `%${search}%`)
          .orWhereRaw('projects.tags ?| array[?]', [search])
      })
    }

    if (userId) {
      query = query.where('projects.user_id', userId)
    }

    if (featured) {
      query = query.where('projects.is_featured', true)
    }

    // Sorting
    const allowedSortFields = ['created_at', 'updated_at', 'title', 'innovation_score', 'complexity_level']
    const sortField = allowedSortFields.includes(String(sortBy)) ? String(sortBy) : 'created_at'
    const sortOrder = order === 'asc' ? 'asc' : 'desc'
    
    query = query.orderBy(`projects.${sortField}`, sortOrder)

    // Get total count for pagination
    const totalQuery = query.clone().clearSelect().count('* as count').first()
    const total = await totalQuery

    // Apply pagination
    const projects = await query.limit(Number(limit)).offset(offset)

    // Get analytics for each project if user is authenticated
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const stats = await db('project_analytics')
          .select(
            db.raw('COUNT(DISTINCT user_id) as views'),
            db.raw('COUNT(DISTINCT CASE WHEN action = ? THEN user_id END) as likes', ['like']),
            db.raw('COUNT(DISTINCT CASE WHEN action = ? THEN user_id END) as shares', ['share'])
          )
          .where('project_id', project.id)
          .first()

        return {
          ...project,
          stats: {
            views: Number(stats?.views || 0),
            likes: Number(stats?.likes || 0),
            shares: Number(stats?.shares || 0)
          }
        }
      })
    )

    res.json({
      projects: projectsWithStats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total?.count || 0),
        pages: Math.ceil(Number(total?.count || 0) / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Get single project
router.get('/:id', optional, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const project = await db('projects')
      .select(
        'projects.*',
        'users.first_name as authorFirstName',
        'users.last_name as authorLastName',
        'users.avatar_url as authorAvatar',
        'users.university as authorUniversity',
        'users.email as authorEmail'
      )
      .leftJoin('users', 'projects.user_id', 'users.id')
      .where('projects.id', id)
      .first()

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Check if project is public or user owns it
    if (!project.is_public && (!req.user || req.user.id !== project.user_id)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Get project statistics
    const stats = await db('project_analytics')
      .select(
        db.raw('COUNT(DISTINCT user_id) as views'),
        db.raw('COUNT(DISTINCT CASE WHEN action = ? THEN user_id END) as likes', ['like']),
        db.raw('COUNT(DISTINCT CASE WHEN action = ? THEN user_id END) as shares', ['share']),
        db.raw('COUNT(DISTINCT CASE WHEN action = ? THEN user_id END) as bookmarks', ['bookmark'])
      )
      .where('project_id', id)
      .first()

    // Record view if user is authenticated and not the owner
    if (req.user && req.user.id !== project.user_id) {
      await db('project_analytics')
        .insert({
          id: uuidv4(),
          project_id: id,
          user_id: req.user.id,
          action: 'view',
          created_at: new Date()
        })
        .onConflict(['project_id', 'user_id', 'action'])
        .merge({ created_at: new Date() })
    }

    res.json({
      project,
      stats: {
        views: Number(stats?.views || 0),
        likes: Number(stats?.likes || 0),
        shares: Number(stats?.shares || 0),
        bookmarks: Number(stats?.bookmarks || 0)
      }
    })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// Create project
router.post('/', authenticate, validateRequest(projectSchema), async (req: AuthRequest, res) => {
  try {
    const projectData = req.body
    const projectId = uuidv4()

    const project = {
      id: projectId,
      user_id: req.user!.id,
      title: projectData.title,
      description: projectData.description,
      technologies: JSON.stringify(projectData.technologies),
      category: projectData.category,
      repository_url: projectData.repositoryUrl,
      live_url: projectData.liveUrl,
      images: JSON.stringify(projectData.images || []),
      tags: JSON.stringify(projectData.tags || []),
      is_public: projectData.isPublic,
      collaborators: JSON.stringify(projectData.collaborators || []),
      status: 'pending_analysis',
      created_at: new Date(),
      updated_at: new Date()
    }

    await db('projects').insert(project)

    // Trigger AI analysis
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze-project`, {
        title: projectData.title,
        description: projectData.description,
        technologies: projectData.technologies,
        category: projectData.category
      })

      // Update project with AI analysis results
      await db('projects')
        .where({ id: projectId })
        .update({
          ai_analysis: JSON.stringify(aiResponse.data),
          innovation_score: aiResponse.data.innovation_score || 0,
          complexity_level: aiResponse.data.complexity_level || 'Beginner',
          skill_level: aiResponse.data.skill_level || 5,
          professional_story: aiResponse.data.professional_story || '',
          status: 'analyzed',
          updated_at: new Date()
        })
    } catch (aiError) {
      console.error('AI analysis failed:', aiError)
      // Project is still created, just without AI analysis
    }

    const createdProject = await db('projects')
      .select('*')
      .where({ id: projectId })
      .first()

    res.status(201).json({
      message: 'Project created successfully',
      project: createdProject
    })
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// Update project
router.put('/:id', authenticate, validateRequest(updateProjectSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Check if project exists and user owns it
    const existingProject = await db('projects').where({ id }).first()
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' })
    }

    if (existingProject.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date()
    }

    if (updates.title) updateData.title = updates.title
    if (updates.description) updateData.description = updates.description
    if (updates.technologies) updateData.technologies = JSON.stringify(updates.technologies)
    if (updates.category) updateData.category = updates.category
    if (updates.repositoryUrl !== undefined) updateData.repository_url = updates.repositoryUrl
    if (updates.liveUrl !== undefined) updateData.live_url = updates.liveUrl
    if (updates.images) updateData.images = JSON.stringify(updates.images)
    if (updates.tags) updateData.tags = JSON.stringify(updates.tags)
    if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic
    if (updates.collaborators) updateData.collaborators = JSON.stringify(updates.collaborators)

    await db('projects').where({ id }).update(updateData)

    const updatedProject = await db('projects').where({ id }).first()

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// Delete project
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Check if project exists and user owns it
    const project = await db('projects').where({ id }).first()
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    if (project.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Delete project and related data
    await db.transaction(async (trx) => {
      await trx('project_analytics').where({ project_id: id }).del()
      await trx('matches').where({ project_id: id }).del()
      await trx('projects').where({ id }).del()
    })

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

// Analyze project (re-run AI analysis)
router.post('/:id/analyze', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const project = await db('projects').where({ id }).first()
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    if (project.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Call AI service for analysis
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze-project`, {
      title: project.title,
      description: project.description,
      technologies: JSON.parse(project.technologies || '[]'),
      category: project.category
    })

    // Update project with new analysis
    await db('projects')
      .where({ id })
      .update({
        ai_analysis: JSON.stringify(aiResponse.data),
        innovation_score: aiResponse.data.innovation_score || project.innovation_score,
        complexity_level: aiResponse.data.complexity_level || project.complexity_level,
        skill_level: aiResponse.data.skill_level || project.skill_level,
        professional_story: aiResponse.data.professional_story || project.professional_story,
        status: 'analyzed',
        updated_at: new Date()
      })

    const updatedProject = await db('projects').where({ id }).first()

    res.json({
      message: 'Project analysis completed',
      project: updatedProject,
      analysis: aiResponse.data
    })
  } catch (error) {
    console.error('Analyze project error:', error)
    res.status(500).json({ error: 'Failed to analyze project' })
  }
})

// Project actions (like, bookmark, share)
router.post('/:id/action', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { action } = req.body

    if (!['like', 'bookmark', 'share'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' })
    }

    const project = await db('projects').where({ id }).first()
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Record the action
    await db('project_analytics')
      .insert({
        id: uuidv4(),
        project_id: id,
        user_id: req.user!.id,
        action,
        created_at: new Date()
      })
      .onConflict(['project_id', 'user_id', 'action'])
      .merge({ created_at: new Date() })

    res.json({ message: `Project ${action}d successfully` })
  } catch (error) {
    console.error('Project action error:', error)
    res.status(500).json({ error: `Failed to ${req.body.action} project` })
  }
})

export default router