exports.up = function(knex) {
  return knex.schema
    // Courses table
    .createTable('courses', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.string('course_code').notNullable();
      table.string('course_name').notNullable();
      table.enu('semester', ['Fall', 'Spring', 'Summer', 'Winter']).notNullable();
      table.integer('year').notNullable();
      table.string('grade');
      table.decimal('credits', 3, 1).notNullable();
      table.string('instructor');
      table.text('description');
      table.enu('category', [
        'computer-science',
        'mathematics',
        'engineering',
        'business',
        'data-science',
        'design',
        'humanities',
        'sciences',
        'other'
      ]).defaultTo('other');
      table.boolean('is_completed').defaultTo(false);
      table.json('skills').defaultTo('[]');
      table.json('learning_outcomes').defaultTo('[]');
      table.timestamps(true, true);

      // Foreign key
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      // Indexes
      table.index(['user_id']);
      table.index(['semester', 'year']);
      table.index(['is_completed']);
    })

    // Academic experiences (internships, research, etc.)
    .createTable('academic_experiences', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.enu('type', [
        'internship',
        'research',
        'teaching_assistant',
        'project',
        'volunteer',
        'work_experience',
        'certification',
        'publication'
      ]).notNullable();
      table.string('title').notNullable();
      table.string('organization').notNullable();
      table.string('location');
      table.date('start_date').notNullable();
      table.date('end_date');
      table.boolean('is_current').defaultTo(false);
      table.text('description');
      table.json('responsibilities').defaultTo('[]');
      table.json('achievements').defaultTo('[]');
      table.json('skills_gained').defaultTo('[]');
      table.json('technologies_used').defaultTo('[]');
      table.string('supervisor_name');
      table.string('supervisor_email');
      table.string('reference_letter_url');

      // For publications
      table.string('publication_url');
      table.string('doi');
      table.json('co_authors').defaultTo('[]');

      // Verification
      table.boolean('is_verified').defaultTo(false);
      table.timestamp('verified_at');
      table.string('verification_method');

      table.timestamps(true, true);

      // Foreign key
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      // Indexes
      table.index(['user_id']);
      table.index(['type']);
      table.index(['is_verified']);
    })

    // Achievements and awards
    .createTable('achievements', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.enu('type', [
        'academic_award',
        'scholarship',
        'competition',
        'certification',
        'honor_society',
        'leadership',
        'publication',
        'patent',
        'other'
      ]).notNullable();
      table.string('title').notNullable();
      table.string('issuer').notNullable();
      table.date('date_received').notNullable();
      table.text('description');
      table.string('credential_id');
      table.string('credential_url');
      table.string('image_url');
      table.decimal('monetary_value', 10, 2);
      table.string('currency').defaultTo('USD');

      // Competition specific
      table.string('competition_rank');
      table.integer('total_participants');

      // Verification
      table.boolean('is_verified').defaultTo(false);
      table.timestamp('verified_at');

      table.timestamps(true, true);

      // Foreign key
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      // Indexes
      table.index(['user_id']);
      table.index(['type']);
      table.index(['date_received']);
    })

    // Extracurricular activities
    .createTable('extracurricular_activities', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.string('activity_name').notNullable();
      table.enu('type', [
        'club',
        'sport',
        'volunteer',
        'student_government',
        'professional_society',
        'hackathon',
        'conference',
        'workshop',
        'other'
      ]).notNullable();
      table.string('organization').notNullable();
      table.string('role');
      table.date('start_date').notNullable();
      table.date('end_date');
      table.boolean('is_current').defaultTo(false);
      table.text('description');
      table.json('achievements').defaultTo('[]');
      table.json('skills_developed').defaultTo('[]');
      table.integer('hours_per_week');
      table.integer('weeks_per_year');

      table.timestamps(true, true);

      // Foreign key
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      // Indexes
      table.index(['user_id']);
      table.index(['type']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('extracurricular_activities')
    .dropTableIfExists('achievements')
    .dropTableIfExists('academic_experiences')
    .dropTableIfExists('courses');
};