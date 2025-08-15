/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    // Notifications table
    knex.schema.createTable('notifications', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      
      // Notification content
      table.enum('type', [
        'job_application',
        'application_update',
        'new_job_match',
        'project_interaction',
        'system_update',
        'marketing',
        'message',
        'reminder'
      ]).notNullable()
      
      table.string('title', 200).notNullable()
      table.text('message').notNullable()
      table.json('data') // Additional structured data
      
      // Status
      table.boolean('is_read').defaultTo(false)
      table.timestamp('read_at')
      
      // Meta
      table.timestamps(true, true)
      
      // Indexes
      table.index(['user_id'])
      table.index(['type'])
      table.index(['is_read'])
      table.index(['created_at'])
      table.index(['user_id', 'is_read'])
    }),
    
    // Notification preferences table
    knex.schema.createTable('notification_preferences', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      
      // Email preferences
      table.boolean('email_enabled').defaultTo(true)
      table.boolean('push_enabled').defaultTo(true)
      
      // Notification type preferences
      table.boolean('job_applications').defaultTo(true)
      table.boolean('application_updates').defaultTo(true)
      table.boolean('new_job_matches').defaultTo(true)
      table.boolean('project_interactions').defaultTo(true)
      table.boolean('system_updates').defaultTo(false)
      table.boolean('marketing').defaultTo(false)
      
      // Meta
      table.timestamps(true, true)
      
      // Constraints
      table.unique(['user_id'])
    })
  ])
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('notification_preferences'),
    knex.schema.dropTable('notifications')
  ])
}