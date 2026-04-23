-- Fit profile (student) + role offering (job) + cached fit score (application).
-- Drives the non-skills matching dimensions: motivation, culture, position,
-- company dimension, goal alignment. Skills remain in the existing pipeline.

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "fitProfile"          JSONB,
  ADD COLUMN IF NOT EXISTS "fitProfileUpdatedAt" TIMESTAMP(3);

ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "roleOffering" JSONB;

ALTER TABLE "Application"
  ADD COLUMN IF NOT EXISTS "fitScore"           JSONB,
  ADD COLUMN IF NOT EXISTS "fitScoreComputedAt" TIMESTAMP(3);

-- Query helpers:
-- Recruiter "applicants sorted by fit" uses the generated column on read;
-- no index needed until we see slow queries. Add a partial index on
-- (jobId, ((fitScore->>'composite')::int)) if that becomes a hotspot.
