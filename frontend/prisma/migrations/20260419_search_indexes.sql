-- Full-text search indexes (GIN + tsvector)
-- 10-50× speedup vs LIKE/contains at scale.
-- Safe to run on live Postgres: CREATE INDEX CONCURRENTLY avoids table lock.
-- All use the "simple" config (unaccented, no stemming) for EU multilingual safety.

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Project_fts_idx"
  ON "Project"
  USING GIN (
    to_tsvector('simple',
      coalesce(title, '') || ' ' || coalesce(description, '')
    )
  );

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Job_fts_idx"
  ON "Job"
  USING GIN (
    to_tsvector('simple',
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' ||
      coalesce(array_to_string("requiredSkills", ' '), '')
    )
  );

CREATE INDEX CONCURRENTLY IF NOT EXISTS "CompanyProfile_fts_idx"
  ON "CompanyProfile"
  USING GIN (
    to_tsvector('simple',
      coalesce("companyName", '') || ' ' || coalesce(tagline, '') || ' ' ||
      coalesce(description, '')
    )
  );
