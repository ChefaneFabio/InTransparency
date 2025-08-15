/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('job_applications', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('job_id').notNullable()
    table.uuid('user_id').notNullable()
    
    // Foreign keys
    table.foreign('job_id').references('id').inTable('jobs').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    
    // Application content
    table.text('cover_letter')
    table.string('resume_url')
    table.json('additional_documents').defaultTo('[]')
    
    // Application status
    table.enum('status', [
      'pending',
      'reviewing', 
      'shortlisted',
      'interviewing',
      'rejected',
      'hired',
      'withdrawn'
    ]).defaultTo('pending')
    
    // Feedback and notes
    table.text('feedback')
    table.json('interview_notes').defaultTo('[]')
    table.json('assessment_scores').defaultTo('{}')
    
    // Timeline
    table.timestamp('applied_at').defaultTo(knex.fn.now())
    table.timestamp('reviewed_at')
    table.timestamp('interview_scheduled_at')
    table.timestamp('decision_at')
    
    // Meta
    table.timestamps(true, true)
    
    // Constraints
    table.unique(['job_id', 'user_id'])
    
    // Indexes
    table.index(['job_id'])
    table.index(['user_id'])
    table.index(['status'])
    table.index(['applied_at'])
    table.index(['created_at'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('job_applications')
}