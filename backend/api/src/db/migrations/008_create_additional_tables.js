/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    // Project likes table
    knex.schema.createTable('project_likes', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('project_id').notNullable()
      table.uuid('user_id').notNullable()
      
      table.foreign('project_id').references('id').inTable('projects').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      
      table.timestamp('created_at').defaultTo(knex.fn.now())
      
      // Constraints
      table.unique(['project_id', 'user_id'])
      
      // Indexes
      table.index(['project_id'])
      table.index(['user_id'])
      table.index(['created_at'])
    }),
    
    // Refresh tokens table
    knex.schema.createTable('refresh_tokens', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      
      table.text('token').notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      
      // Indexes
      table.index(['user_id'])
      table.index(['token'])
      table.index(['expires_at'])
    }),
    
    // Password reset tokens table
    knex.schema.createTable('password_resets', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      
      table.string('token').notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      
      // Indexes
      table.index(['user_id'])
      table.index(['token'])
      table.index(['expires_at'])
    }),
    
    // User sessions table (for tracking active sessions)
    knex.schema.createTable('user_sessions', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      
      table.string('session_token').notNullable()
      table.string('ip_address', 45) // IPv6 max length
      table.text('user_agent')
      table.json('device_info')
      table.timestamp('last_activity').defaultTo(knex.fn.now())
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      
      // Indexes
      table.index(['user_id'])
      table.index(['session_token'])
      table.index(['expires_at'])
      table.index(['last_activity'])
    }),
    
    // Activity log table
    knex.schema.createTable('activity_logs', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('user_id')
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
      
      table.enum('action', [
        'user_register',
        'user_login',
        'user_logout',
        'project_create',
        'project_update',
        'project_delete',
        'job_create',
        'job_update',
        'job_delete',
        'job_apply',
        'application_update',
        'profile_update',
        'password_change',
        'email_verify'
      ]).notNullable()
      
      table.string('entity_type', 50) // e.g., 'project', 'job', 'user'
      table.uuid('entity_id')
      table.json('metadata') // Additional context data
      table.string('ip_address', 45)
      table.text('user_agent')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      
      // Indexes
      table.index(['user_id'])
      table.index(['action'])
      table.index(['entity_type', 'entity_id'])
      table.index(['created_at'])
      table.index(['user_id', 'created_at'])
    }),
    
    // System settings table
    knex.schema.createTable('system_settings', function(table) {
      table.string('key').primary()
      table.json('value').notNullable()
      table.text('description')
      table.enum('type', ['string', 'number', 'boolean', 'json', 'array']).defaultTo('string')
      table.boolean('is_public').defaultTo(false) // Whether setting can be read by non-admins
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      table.uuid('updated_by')
      table.foreign('updated_by').references('id').inTable('users')
      
      // Indexes
      table.index(['is_public'])
      table.index(['updated_at'])
    })
  ])
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('system_settings'),
    knex.schema.dropTable('activity_logs'),
    knex.schema.dropTable('user_sessions'),
    knex.schema.dropTable('password_resets'),
    knex.schema.dropTable('refresh_tokens'),
    knex.schema.dropTable('project_likes')
  ])
}