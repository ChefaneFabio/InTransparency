const { Model } = require('objection')

class University extends Model {
  static get tableName() {
    return 'universities'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'slug'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        shortName: { type: 'string', maxLength: 50 },
        slug: { type: 'string', minLength: 1, maxLength: 100 },
        logo: { type: ['string', 'null'] },
        description: { type: ['string', 'null'] },
        founded: { type: ['integer', 'null'] },
        website: { type: ['string', 'null'] },

        // Location
        city: { type: ['string', 'null'] },
        state: { type: ['string', 'null'] },
        country: { type: ['string', 'null'] },
        coordinates: { type: ['object', 'null'] },

        // Rankings
        globalRanking: { type: ['integer', 'null'] },
        nationalRanking: { type: ['integer', 'null'] },
        engineeringRanking: { type: ['integer', 'null'] },

        // Stats
        totalStudents: { type: ['integer', 'null'] },
        undergradStudents: { type: ['integer', 'null'] },
        graduateStudents: { type: ['integer', 'null'] },
        faculty: { type: ['integer', 'null'] },
        internationalStudents: { type: ['integer', 'null'] },
        acceptanceRate: { type: ['number', 'null'] },
        employmentRate: { type: ['number', 'null'] },
        avgSalary: { type: ['string', 'null'] },

        // JSON fields
        programs: { type: ['array', 'null'] },
        topSkills: { type: ['array', 'null'] },
        companies: { type: ['array', 'null'] },
        contact: { type: ['object', 'null'] },
        socialMedia: { type: ['object', 'null'] },

        // Timestamps
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    const Student = require('./Student')

    return {
      students: {
        relation: Model.HasManyRelation,
        modelClass: Student,
        join: {
          from: 'universities.id',
          to: 'students.universityId'
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
}

module.exports = University