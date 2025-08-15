exports.up = function(knex) {
  return knex.schema.createTable('project_analytics', function(table) {
    table.uuid('id').primary();
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Analytics data
    table.enu('action', ['view', 'like', 'share', 'bookmark', 'contact']).notNullable();
    table.json('metadata').defaultTo('{}');
    table.string('session_id');
    table.string('user_agent');
    table.string('ip_address');
    table.string('referrer');
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index(['project_id']);
    table.index(['user_id']);
    table.index(['action']);
    table.index(['created_at']);
    
    // Unique constraint for certain actions per user per project
    table.unique(['project_id', 'user_id', 'action']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('project_analytics');
};