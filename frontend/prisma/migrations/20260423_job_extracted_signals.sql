-- Job description → structured signals (position level, culture, motivation,
-- growth focus). Extracted via Claude once per job, cached. Fills gaps when
-- recruiter hasn't tagged roleOffering explicitly.

ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "extractedSignals" JSONB;
