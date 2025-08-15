exports.up = function(knex) {
  return knex.schema.createTable('projects', function(table) {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Basic project info
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.json('technologies').notNullable();
    table.enu('category', [
      'web-development',
      'mobile-development',
      'data-science', 
      'machine-learning',
      'ai',
      'blockchain',
      'game-development',
      'iot',
      'cybersecurity',
      'other'
    ]).notNullable();
    
    // URLs and media
    table.string('repository_url');
    table.string('live_url');
    table.json('images').defaultTo('[]');
    table.json('tags').defaultTo('[]');
    
    // Project settings
    table.boolean('is_public').defaultTo(true);
    table.boolean('is_featured').defaultTo(false);
    table.json('collaborators').defaultTo('[]');
    
    // AI Analysis results
    table.enu('status', ['pending_analysis', 'analyzing', 'analyzed', 'failed']).defaultTo('pending_analysis');
    table.json('ai_analysis');
    table.integer('innovation_score').defaultTo(0);
    table.enu('complexity_level', ['Beginner', 'Intermediate', 'Advanced', 'Expert']).defaultTo('Beginner');
    table.integer('skill_level').defaultTo(1);
    table.integer('technical_depth').defaultTo(1);
    table.integer('market_relevance').defaultTo(1);
    table.text('professional_story');
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['category']);
    table.index(['is_public']);
    table.index(['is_featured']);
    table.index(['status']);
    table.index(['innovation_score']);
    table.index(['complexity_level']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('projects');
};