const axios = require('axios')

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

class AIService {
  // Analyze project for skills, complexity, and insights
  async analyzeProject(projectData) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/analyze-project`, {
        title: projectData.title,
        description: projectData.description,
        technologies: projectData.technologies,
        collaborators: projectData.collaborators || [],
        achievements: projectData.achievements || []
      }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI project analysis error:', error.message)
      // Return fallback analysis if AI service fails
      return this.generateFallbackAnalysis(projectData)
    }
  }

  // Generate story for project
  async generateProjectStory(projectData) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/generate-story`, {
        title: projectData.title,
        description: projectData.description,
        technologies: projectData.technologies,
        achievements: projectData.achievements || [],
        tone: projectData.tone || 'professional'
      }, {
        timeout: 45000, // 45 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI story generation error:', error.message)
      throw new Error('Failed to generate project story')
    }
  }

  // Match candidates to job requirements
  async matchCandidates(jobRequirements, candidates) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/match-candidates`, {
        job_requirements: jobRequirements,
        candidates: candidates,
        max_results: 50
      }, {
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI candidate matching error:', error.message)
      throw new Error('Failed to match candidates')
    }
  }

  // Assess skill proficiency from project portfolio
  async assessSkills(projects, targetSkills) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/assess-skills`, {
        projects: projects,
        target_skills: targetSkills
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI skill assessment error:', error.message)
      throw new Error('Failed to assess skills')
    }
  }

  // Generate resume suggestions
  async generateResumeSuggestions(userProfile, targetRole) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/resume-suggestions`, {
        profile: userProfile,
        target_role: targetRole
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI resume suggestions error:', error.message)
      throw new Error('Failed to generate resume suggestions')
    }
  }

  // Analyze market trends and skills demand
  async analyzeMarketTrends(industry, location) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/market-trends`, {
        industry: industry,
        location: location
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI market trends error:', error.message)
      throw new Error('Failed to analyze market trends')
    }
  }

  // Generate interview questions based on project portfolio
  async generateInterviewQuestions(projects, role) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/interview-questions`, {
        projects: projects,
        role: role
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI interview questions error:', error.message)
      throw new Error('Failed to generate interview questions')
    }
  }

  // Generate project recommendations for skill development
  async generateProjectRecommendations(currentSkills, targetSkills, experience) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/project-recommendations`, {
        current_skills: currentSkills,
        target_skills: targetSkills,
        experience_level: experience
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI project recommendations error:', error.message)
      throw new Error('Failed to generate project recommendations')
    }
  }

  // Check AI service health
  async checkHealth() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/health`, {
        timeout: 5000
      })
      return response.data
    } catch (error) {
      console.error('AI service health check failed:', error.message)
      return { status: 'unhealthy', error: error.message }
    }
  }

  // Generate fallback analysis when AI service is unavailable
  generateFallbackAnalysis(projectData) {
    const technologies = projectData.technologies || []
    const description = projectData.description || ''
    
    // Basic complexity assessment based on technology count and description length
    let complexity = 'beginner'
    if (technologies.length > 5 || description.length > 500) {
      complexity = 'intermediate'
    }
    if (technologies.length > 10 || description.length > 1000) {
      complexity = 'advanced'
    }

    // Extract basic skills from technologies
    const skills = technologies.map(tech => ({
      name: tech,
      proficiency: 'intermediate',
      confidence: 0.7
    }))

    // Generate basic categories
    const categories = []
    if (technologies.some(tech => 
      ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'].includes(tech.toLowerCase())
    )) {
      categories.push('frontend')
    }
    if (technologies.some(tech => 
      ['node', 'python', 'java', 'go', 'php', 'ruby', 'django', 'express'].includes(tech.toLowerCase())
    )) {
      categories.push('backend')
    }
    if (technologies.some(tech => 
      ['mobile', 'react-native', 'flutter', 'swift', 'kotlin', 'ios', 'android'].includes(tech.toLowerCase())
    )) {
      categories.push('mobile')
    }

    return {
      complexity,
      skills,
      categories,
      score: Math.min(85, 60 + technologies.length * 2),
      insights: [
        `This project demonstrates proficiency in ${technologies.length} technologies`,
        `The project appears to be at ${complexity} level`,
        `Key focus areas: ${categories.join(', ') || 'general development'}`
      ],
      generated_at: new Date().toISOString(),
      source: 'fallback'
    }
  }

  // Batch process multiple requests
  async batchProcess(requests) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/batch-process`, {
        requests: requests
      }, {
        timeout: 120000, // 2 minute timeout for batch processing
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      })

      return response.data
    } catch (error) {
      console.error('AI batch processing error:', error.message)
      throw new Error('Failed to process batch requests')
    }
  }
}

// Create singleton instance
const aiService = new AIService()

module.exports = {
  analyzeProject: aiService.analyzeProject.bind(aiService),
  generateProjectStory: aiService.generateProjectStory.bind(aiService),
  matchCandidates: aiService.matchCandidates.bind(aiService),
  assessSkills: aiService.assessSkills.bind(aiService),
  generateResumeSuggestions: aiService.generateResumeSuggestions.bind(aiService),
  analyzeMarketTrends: aiService.analyzeMarketTrends.bind(aiService),
  generateInterviewQuestions: aiService.generateInterviewQuestions.bind(aiService),
  generateProjectRecommendations: aiService.generateProjectRecommendations.bind(aiService),
  checkHealth: aiService.checkHealth.bind(aiService),
  batchProcess: aiService.batchProcess.bind(aiService)
}