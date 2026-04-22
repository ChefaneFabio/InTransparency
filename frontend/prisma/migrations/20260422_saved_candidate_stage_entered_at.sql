-- 2026-04-22: track when a saved candidate entered its current stage
-- (folder) so the recruiter pipeline can show accurate "days in stage"
-- aging per card, not just "saved X days ago".
-- Idempotent; backfills existing rows with createdAt.

DO $$ BEGIN
  ALTER TABLE "SavedCandidate" ADD COLUMN "stageEnteredAt" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Backfill: for rows that never had a stage transition, treat the
-- creation time as the entry time.
UPDATE "SavedCandidate"
SET "stageEnteredAt" = "createdAt"
WHERE "stageEnteredAt" IS NULL;
