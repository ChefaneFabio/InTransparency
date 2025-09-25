exports.up = function(knex) {
  return knex.schema
    // Survey responses table
    .createTable('survey_responses', function(table) {
      table.uuid('id').primary();
      table.enu('survey_type', ['student', 'company', 'university']).notNullable();
      table.json('responses').notNullable();
      table.json('metadata').defaultTo('{}');
      table.boolean('is_complete').defaultTo(false);
      table.timestamp('submitted_at').defaultTo(knex.fn.now());
      table.string('ip_address');
      table.text('user_agent');
      table.string('session_id');
      table.uuid('user_id').nullable();

      // Analytics fields
      table.integer('completion_time_seconds');
      table.string('referrer_url');
      table.string('utm_source');
      table.string('utm_medium');
      table.string('utm_campaign');

      table.timestamps(true, true);

      // Foreign key (optional)
      table.foreign('user_id').references('users.id').onDelete('SET NULL');

      // Indexes
      table.index(['survey_type']);
      table.index(['submitted_at']);
      table.index(['is_complete']);
      table.index(['user_id']);
    })

    // Survey invitations table
    .createTable('survey_invitations', function(table) {
      table.uuid('id').primary();
      table.string('email').notNullable();
      table.enu('survey_type', ['student', 'company', 'university']).notNullable();
      table.text('message');
      table.enu('status', ['sent', 'opened', 'started', 'completed', 'bounced']).defaultTo('sent');
      table.timestamp('sent_at').defaultTo(knex.fn.now());
      table.timestamp('opened_at');
      table.timestamp('started_at');
      table.timestamp('completed_at');
      table.uuid('sent_by').notNullable();
      table.string('invitation_token').unique();
      table.integer('reminder_count').defaultTo(0);

      table.timestamps(true, true);

      // Foreign key
      table.foreign('sent_by').references('users.id').onDelete('CASCADE');

      // Indexes
      table.index(['email']);
      table.index(['survey_type']);
      table.index(['status']);
      table.index(['sent_at']);
      table.index(['invitation_token']);
    })

    // Survey analytics cache table (for performance)
    .createTable('survey_analytics_cache', function(table) {
      table.uuid('id').primary();
      table.string('metric_type').notNullable();
      table.string('metric_key').notNullable();
      table.json('metric_value').notNullable();
      table.date('date_calculated').notNullable();
      table.timestamp('expires_at');

      table.timestamps(true, true);

      // Indexes
      table.index(['metric_type', 'metric_key']);
      table.index(['date_calculated']);
      table.index(['expires_at']);
      table.unique(['metric_type', 'metric_key', 'date_calculated']);
    })

    // Survey feedback and follow-ups
    .createTable('survey_feedback', function(table) {
      table.uuid('id').primary();
      table.uuid('survey_response_id').notNullable();
      table.enu('feedback_type', ['follow_up_request', 'clarification', 'additional_info']).notNullable();
      table.text('feedback_content').notNullable();
      table.boolean('is_addressed').defaultTo(false);
      table.timestamp('addressed_at');
      table.uuid('addressed_by');

      table.timestamps(true, true);

      // Foreign keys
      table.foreign('survey_response_id').references('survey_responses.id').onDelete('CASCADE');
      table.foreign('addressed_by').references('users.id').onDelete('SET NULL');

      // Indexes
      table.index(['survey_response_id']);
      table.index(['feedback_type']);
      table.index(['is_addressed']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('survey_feedback')
    .dropTableIfExists('survey_analytics_cache')
    .dropTableIfExists('survey_invitations')
    .dropTableIfExists('survey_responses');
};