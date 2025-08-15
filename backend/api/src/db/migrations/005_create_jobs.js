/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('jobs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('created_by').notNullable()
    table.foreign('created_by').references('id').inTable('users')
    
    // Basic job information
    table.string('title', 200).notNullable()
    table.text('description').notNullable()
    table.string('company', 100).notNullable()
    table.string('location', 100).notNullable()
    table.enum('employment_type', ['full-time', 'part-time', 'contract', 'internship']).notNullable()
    table.enum('experience_level', ['entry', 'junior', 'mid', 'senior', 'lead', 'executive']).notNullable()
    
    // Salary information
    table.integer('salary_min')
    table.integer('salary_max')
    table.string('currency', 3).defaultTo('USD')
    
    // Skills and requirements
    table.json('required_skills').notNullable()
    table.json('preferred_skills').defaultTo('[]')
    table.json('benefits').defaultTo('[]')
    table.json('requirements').defaultTo('[]')
    
    // Remote work and targeting
    table.boolean('is_remote').defaultTo(false)
    table.json('target_universities').defaultTo('[]')
    
    // Application details
    table.timestamp('application_deadline')
    table.enum('status', ['draft', 'published', 'paused', 'closed', 'deleted']).defaultTo('draft')
    
    // Metrics
    table.integer('views_count').defaultTo(0)
    table.integer('applications_count').defaultTo(0)
    
    // Meta
    table.boolean('is_active').defaultTo(true)
    table.timestamps(true, true)
    
    // Indexes
    table.index(['created_by'])
    table.index(['status'])
    table.index(['employment_type'])
    table.index(['experience_level'])
    table.index(['company'])
    table.index(['location'])
    table.index(['is_remote'])
    table.index(['created_at'])
    table.index(['application_deadline'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('jobs')
}