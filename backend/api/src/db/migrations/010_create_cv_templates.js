exports.up = function(knex) {
  return knex.schema
    // CV templates and configurations
    .createTable('cv_templates', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.string('name').notNullable();
      table.enu('template_type', [
        'academic',
        'professional',
        'technical',
        'creative',
        'executive',
        'research',
        'internship',
        'custom'
      ]).defaultTo('academic');
      table.boolean('is_default').defaultTo(false);
      table.boolean('is_active').defaultTo(true);

      // Layout configuration
      table.json('layout_config').defaultTo('{}');
      table.json('color_scheme').defaultTo('{}');
      table.string('font_family').defaultTo('Inter');
      table.integer('font_size').defaultTo(11);

      // Sections configuration
      table.json('sections_order').defaultTo('[]');
      table.json('sections_visibility').defaultTo('{}');
      table.json('sections_config').defaultTo('{}');

      // Content preferences
      table.integer('max_projects').defaultTo(5);
      table.integer('max_experiences').defaultTo(3);
      table.integer('max_achievements').defaultTo(5);
      table.integer('max_skills').defaultTo(15);
      table.boolean('include_photo').defaultTo(false);
      table.boolean('include_references').defaultTo(false);
      table.boolean('include_gpa').defaultTo(true);
      table.boolean('include_coursework').defaultTo(true);

      // Auto-generation rules
      table.json('project_filter_rules').defaultTo('{}');
      table.decimal('min_innovation_score', 3, 0).defaultTo(70);
      table.json('skill_categories').defaultTo('[]');
      table.json('excluded_experiences').defaultTo('[]');

      // Metadata
      table.timestamp('last_generated');
      table.integer('generation_count').defaultTo(0);

      table.timestamps(true, true);

      // Foreign key
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      // Indexes
      table.index(['user_id']);
      table.index(['is_default']);
      table.index(['template_type']);
    })

    // Generated CVs history
    .createTable('generated_cvs', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.uuid('template_id');
      table.string('filename').notNullable();
      table.enu('format', ['pdf', 'docx', 'json', 'html']).notNullable();
      table.string('version').notNullable();

      // Content snapshot
      table.json('content').notNullable();
      table.json('metadata').defaultTo('{}');

      // Generation details
      table.enu('generation_method', ['manual', 'auto', 'ai_optimized']).defaultTo('manual');
      table.json('ai_suggestions').defaultTo('{}');
      table.decimal('ats_score', 3, 0);
      table.json('keyword_analysis').defaultTo('{}');

      // File storage
      table.string('file_url');
      table.integer('file_size');
      table.string('storage_path');

      // Usage tracking
      table.integer('download_count').defaultTo(0);
      table.timestamp('last_downloaded');
      table.json('shared_with').defaultTo('[]');

      // Job application tracking
      table.json('applied_jobs').defaultTo('[]');
      table.integer('application_count').defaultTo(0);

      table.timestamps(true, true);

      // Foreign keys
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.foreign('template_id').references('cv_templates.id').onDelete('SET NULL');

      // Indexes
      table.index(['user_id']);
      table.index(['template_id']);
      table.index(['format']);
      table.index(['created_at']);
    })

    // CV sections customization
    .createTable('cv_custom_sections', function(table) {
      table.uuid('id').primary();
      table.uuid('template_id').notNullable();
      table.string('section_name').notNullable();
      table.string('section_title').notNullable();
      table.enu('section_type', [
        'text',
        'list',
        'timeline',
        'grid',
        'custom'
      ]).defaultTo('text');
      table.json('content').defaultTo('{}');
      table.integer('order_index').defaultTo(0);
      table.boolean('is_visible').defaultTo(true);
      table.json('styling').defaultTo('{}');

      table.timestamps(true, true);

      // Foreign key
      table.foreign('template_id').references('cv_templates.id').onDelete('CASCADE');

      // Indexes
      table.index(['template_id']);
      table.index(['order_index']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('cv_custom_sections')
    .dropTableIfExists('generated_cvs')
    .dropTableIfExists('cv_templates');
};