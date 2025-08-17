class Project {
  constructor({
    id = null,
    userId,
    courseId = null,
    title,
    description,
    technologies = [],
    category,
    repositoryUrl = null,
    liveUrl = null,
    status = 'draft',
    isPublic = false,
    innovationScore = null,
    complexityLevel = 'Beginner',
    skills = [],
    tags = [],
    files = [],
    collaborators = [],
    startDate = null,
    endDate = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id
    this.userId = userId
    this.courseId = courseId
    this.title = title
    this.description = description
    this.technologies = technologies
    this.category = category
    this.repositoryUrl = repositoryUrl
    this.liveUrl = liveUrl
    this.status = status
    this.isPublic = isPublic
    this.innovationScore = innovationScore
    this.complexityLevel = complexityLevel
    this.skills = skills
    this.tags = tags
    this.files = files
    this.collaborators = collaborators
    this.startDate = startDate
    this.endDate = endDate
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  // Validate project data
  validate() {
    const errors = []

    if (!this.userId) {
      errors.push('User ID is required')
    }

    if (!this.title || this.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters')
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters')
    }

    if (!this.category) {
      errors.push('Category is required')
    }

    if (!['draft', 'published', 'archived'].includes(this.status)) {
      errors.push('Valid status is required')
    }

    if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(this.complexityLevel)) {
      errors.push('Valid complexity level is required')
    }

    if (this.repositoryUrl && !this.isValidUrl(this.repositoryUrl)) {
      errors.push('Repository URL must be valid')
    }

    if (this.liveUrl && !this.isValidUrl(this.liveUrl)) {
      errors.push('Live URL must be valid')
    }

    return errors
  }

  // Validate URL format
  isValidUrl(string) {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Calculate project metrics
  getMetrics() {
    return {
      techCount: this.technologies.length,
      skillCount: this.skills.length,
      tagCount: this.tags.length,
      fileCount: this.files.length,
      collaboratorCount: this.collaborators.length,
      hasRepository: !!this.repositoryUrl,
      hasLiveDemo: !!this.liveUrl,
      isCourseBased: !!this.courseId,
      daysSinceCreated: Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24))
    }
  }
}

module.exports = Project