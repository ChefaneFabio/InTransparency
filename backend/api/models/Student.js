const { Model } = require('objection')

class Student extends Model {
  static get tableName() {
    return 'students'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email'],

      properties: {
        id: { type: 'integer' },
        userId: { type: ['integer', 'null'] }, // Link to User model if exists
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', format: 'email' },
        avatar: { type: ['string', 'null'] },
        title: { type: ['string', 'null'] },

        // University info
        universityId: { type: ['integer', 'null'] },
        university: { type: ['string', 'null'] },
        major: { type: ['string', 'null'] },
        minor: { type: ['string', 'null'] },
        year: { type: ['string', 'null'] }, // Freshman, Sophomore, Junior, Senior
        graduation: { type: ['string', 'null'] },
        gpa: { type: ['number', 'null'] },

        // Location and contact
        location: { type: ['string', 'null'] },
        phone: { type: ['string', 'null'] },
        website: { type: ['string', 'null'] },
        linkedin: { type: ['string', 'null'] },
        github: { type: ['string', 'null'] },

        // Profile
        bio: { type: ['string', 'null'] },
        aiScore: { type: ['integer', 'null'], default: 0 },

        // Career
        availability: { type: ['string', 'null'] },
        salaryExpectation: { type: ['string', 'null'] },
        workPreference: { type: ['string', 'null'] }, // Remote, Hybrid, On-site
        visaStatus: { type: ['string', 'null'] },

        // Stats
        profileViews: { type: ['integer', 'null'], default: 0 },
        connections: { type: ['integer', 'null'], default: 0 },
        applicationsSent: { type: ['integer', 'null'], default: 0 },
        interviewsScheduled: { type: ['integer', 'null'], default: 0 },

        // JSON fields
        skills: { type: ['array', 'null'] },
        projects: { type: ['array', 'null'] },
        experience: { type: ['array', 'null'] },
        achievements: { type: ['array', 'null'] },
        coursework: { type: ['array', 'null'] },
        languages: { type: ['array', 'null'] },
        interests: { type: ['array', 'null'] },
        preferredRoles: { type: ['array', 'null'] },
        contact: { type: ['object', 'null'] },
        stats: { type: ['object', 'null'] },
        careerPreferences: { type: ['object', 'null'] },

        // Timestamps
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    const University = require('./University')
    const User = require('./User')
    const Project = require('./Project')

    return {
      university: {
        relation: Model.BelongsToOneRelation,
        modelClass: University,
        join: {
          from: 'students.universityId',
          to: 'universities.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'students.userId',
          to: 'users.id'
        }
      },
      projectRecords: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: 'students.userId',
          to: 'projects.userId'
        }
      }
    }
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()

    // Initialize default stats if not provided
    if (!this.stats) {
      this.stats = {
        projectsCompleted: 0,
        githubContributions: 0,
        profileViews: this.profileViews || 0,
        applicationsSent: this.applicationsSent || 0,
        interviewsScheduled: this.interviewsScheduled || 0
      }
    }
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }

  // Helper to format student data with full contact info
  toJSON() {
    const json = super.toJSON()

    // Ensure contact object is properly formatted
    if (!json.contact) {
      json.contact = {
        email: json.email,
        phone: json.phone || '',
        linkedin: json.linkedin || '',
        github: json.github || '',
        website: json.website || ''
      }
    }

    // Format career preferences
    if (!json.careerPreferences) {
      json.careerPreferences = {
        roles: json.preferredRoles || [],
        industries: [],
        locations: [],
        salaryExpectation: json.salaryExpectation || '',
        workType: json.workPreference || '',
        startDate: json.availability || ''
      }
    }

    return json
  }
}

module.exports = Student