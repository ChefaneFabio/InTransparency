const { Model } = require('objection')

class Company extends Model {
  static get tableName() {
    return 'companies'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'slug'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        slug: { type: 'string', minLength: 1, maxLength: 100 },
        logo: { type: ['string', 'null'] },
        tagline: { type: ['string', 'null'] },
        description: { type: ['string', 'null'] },
        industry: { type: ['string', 'null'] },
        founded: { type: ['integer', 'null'] },
        size: { type: ['string', 'null'] },
        headquarters: { type: ['string', 'null'] },
        website: { type: ['string', 'null'] },

        // Stats
        employees: { type: ['integer', 'null'] },
        openJobs: { type: ['integer', 'null'] },
        rating: { type: ['number', 'null'] },
        reviews: { type: ['integer', 'null'] },
        averageSalary: { type: ['string', 'null'] },

        // JSON fields
        locations: { type: ['array', 'null'] },
        values: { type: ['array', 'null'] },
        benefits: { type: ['array', 'null'] },
        techStack: { type: ['array', 'null'] },
        contact: { type: ['object', 'null'] },
        socialMedia: { type: ['object', 'null'] },
        workCulture: { type: ['object', 'null'] },
        recentNews: { type: ['array', 'null'] },

        // Timestamps
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    const Job = require('./Job')

    return {
      jobs: {
        relation: Model.HasManyRelation,
        modelClass: Job,
        join: {
          from: 'companies.id',
          to: 'jobs.companyId'
        }
      }
    }
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }

  // Helper method to get formatted company data
  toJSON() {
    const json = super.toJSON()

    // Format the response to match frontend expectations
    if (json.employees) {
      json.stats = {
        employees: json.employees,
        openJobs: json.openJobs || 0,
        rating: json.rating || 0,
        reviews: json.reviews || 0
      }
    }

    // Ensure workCulture has default values
    if (!json.workCulture) {
      json.workCulture = {
        remote: false,
        diversity: 0,
        workLifeBalance: 0,
        careerGrowth: 0
      }
    }

    return json
  }
}

module.exports = Company