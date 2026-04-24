-- ============================================================================
-- Combined migration — apply once in Neon to bring prod up to date with main.
-- Bundles three migrations in dependency order:
--   1) 20260423_candidate_share.sql              (new CandidateShare table)
--   2) 20260423_fit_profile_and_role_offering.sql (fit profile on User/Job/Application)
--   3) 20260423_job_extracted_signals.sql         (Job.extractedSignals JSON)
--
-- All statements are idempotent — safe to re-run.
-- ============================================================================

-- ─── 1) CandidateShare — signed share links for candidate evidence ─────────

CREATE TABLE IF NOT EXISTS "CandidateShare" (
  "id"             TEXT            PRIMARY KEY,
  "token"          VARCHAR(64)     NOT NULL UNIQUE,
  "candidateId"    TEXT            NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "sharedByUserId" TEXT            NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "note"           TEXT,
  "recipientEmail" TEXT,
  "expiresAt"      TIMESTAMP(3)    NOT NULL,
  "revokedAt"      TIMESTAMP(3),
  "firstViewedAt"  TIMESTAMP(3),
  "lastViewedAt"   TIMESTAMP(3),
  "viewCount"      INTEGER         NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "CandidateShare_token_idx"
  ON "CandidateShare"("token");
CREATE INDEX IF NOT EXISTS "CandidateShare_sharedByUserId_createdAt_idx"
  ON "CandidateShare"("sharedByUserId", "createdAt");
CREATE INDEX IF NOT EXISTS "CandidateShare_candidateId_idx"
  ON "CandidateShare"("candidateId");
CREATE INDEX IF NOT EXISTS "CandidateShare_expiresAt_idx"
  ON "CandidateShare"("expiresAt");

-- ─── 2) Fit profile + role offering + cached fit score ─────────────────────
-- This is the one currently breaking login on prod (User.fitProfile missing).

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "fitProfile"          JSONB,
  ADD COLUMN IF NOT EXISTS "fitProfileUpdatedAt" TIMESTAMP(3);

ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "roleOffering" JSONB;

ALTER TABLE "Application"
  ADD COLUMN IF NOT EXISTS "fitScore"           JSONB,
  ADD COLUMN IF NOT EXISTS "fitScoreComputedAt" TIMESTAMP(3);

-- ─── 3) Job.extractedSignals — JD-extracted signals cache ──────────────────

ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "extractedSignals" JSONB;
