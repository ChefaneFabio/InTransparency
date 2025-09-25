const { Model } = require('objection')

class Job extends Model {
  static get tableName() {
    return 'jobs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'companyId'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        companyId: { type: 'integer' },

        // Location and type
        location: { type: ['string', 'null'] },
        type: { type: ['string', 'null'] }, // Full-time, Part-time, etc
        contractType: { type: ['string', 'null'] }, // Permanent, Fixed-term, etc
        level: { type: ['string', 'null'] }, // Entry, Mid, Senior, etc
        department: { type: ['string', 'null'] },

        // Remote work
        remote: { type: ['boolean', 'null'], default: false },
        hybrid: { type: ['boolean', 'null'], default: false },
        visa: { type: ['boolean', 'null'], default: false },

        // Description
        description: { type: ['string', 'null'] },
        fullDescription: { type: ['string', 'null'] },

        // Dates
        posted: { type: ['string', 'null'] },
        deadline: { type: ['string', 'null'] },

        // Stats
        applicants: { type: ['integer', 'null'], default: 0 },
        views: { type: ['integer', 'null'], default: 0 },
        matchScore: { type: ['integer', 'null'], default: 0 },

        // Application
        applicationUrl: { type: ['string', 'null'] },
        isExternal: { type: ['boolean', 'null'], default: false },

        // JSON fields
        salary: { type: ['object', 'null'] }, // {min, max, currency, period}
        requirements: { type: ['array', 'null'] },
        niceToHave: { type: ['array', 'null'] },
        responsibilities: { type: ['array', 'null'] },
        benefits: { type: ['array', 'null'] },
        skills: { type: ['array', 'null'] },
        applicationRequirements: { type: ['object', 'null'] },

        // Status
        status: { type: 'string', default: 'active' }, // active, closed, draft

        // Timestamps
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    const Company = require('./Company')

    return {
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'jobs.companyId',
          to: 'companies.id'
        }
      }
    }
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()

    // Set default posted date if not provided
    if (!this.posted) {
      this.posted = new Date().toISOString()
    }

    // Set default deadline if not provided (30 days from now)
    if (!this.deadline) {
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 30)
      this.deadline = deadline.toISOString()
    }
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }

  // Helper to format the job for API response
  async toFullJSON() {
    const json = this.toJSON()

    // Eager load company if not already loaded
    if (this.companyId && !json.company) {
      const Company = require('./Company')
      const company = await Company.query().findById(this.companyId)
      if (company) {
        json.company = {
          id: company.id,
          name: company.name,
          slug: company.slug,
          logo: company.logo,
          industry: company.industry,
          size: company.size,
          website: company.website,
          location: company.headquarters
        }
      }
    }

    return json
  }
}

module.exports = Job