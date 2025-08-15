exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.enu('role', ['student', 'professional', 'recruiter']).defaultTo('student');
    
    // Profile information
    table.string('university');
    table.string('major');
    table.integer('graduation_year');
    table.string('company');
    table.string('position');
    table.text('bio');
    table.string('avatar_url');
    table.json('skills').defaultTo('[]');
    table.json('interests').defaultTo('[]');
    table.string('location');
    table.string('linkedin_url');
    table.string('github_url');
    table.string('portfolio_url');
    
    // Account status
    table.boolean('is_active').defaultTo(true);
    table.boolean('email_verified').defaultTo(false);
    table.string('email_verification_token');
    table.timestamp('email_verified_at');
    table.timestamp('last_login');
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['role']);
    table.index(['university']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};