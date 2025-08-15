exports.up = function(knex) {
  return knex.schema.createTable('matches', function(table) {
    table.uuid('id').primary();
    
    // Match participants
    table.uuid('requester_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('target_user_id').references('id').inTable('users').onDelete('CASCADE').nullable();
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE').nullable();
    
    // Match details
    table.enu('match_type', ['user_to_user', 'user_to_project', 'project_to_user']).notNullable();
    table.float('confidence_score').notNullable(); // 0-1
    table.json('matching_criteria').notNullable();
    table.json('shared_skills').defaultTo('[]');
    table.json('complementary_skills').defaultTo('[]');
    
    // Match status
    table.enu('status', ['pending', 'accepted', 'rejected', 'expired']).defaultTo('pending');
    table.text('requester_message');
    table.text('response_message');
    table.timestamp('responded_at');
    table.timestamp('expires_at');
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index(['requester_id']);
    table.index(['target_user_id']);
    table.index(['project_id']);
    table.index(['match_type']);
    table.index(['status']);
    table.index(['confidence_score']);
    table.index(['created_at']);
    table.index(['expires_at']);
    
    // Unique constraints
    table.unique(['requester_id', 'target_user_id', 'project_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('matches');
};