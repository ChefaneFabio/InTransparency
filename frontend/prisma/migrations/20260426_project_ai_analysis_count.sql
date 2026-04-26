-- Per-project AI analysis counter. Backs the Free-tier "3 analyses per
-- project" cap on Student Premium. Free students get 3 per project,
-- Premium = unlimited. Incremented in lib/run-ai-analysis.ts on success;
-- gated in /api/projects/[id]/analyze.

ALTER TABLE "Project"
  ADD COLUMN IF NOT EXISTS "aiAnalysisCount" INTEGER NOT NULL DEFAULT 0;

-- Backfill: any project that already has aiAnalyzed=true presumably ran
-- analysis at least once. Set count=1 so existing premium-graced projects
-- don't appear "fresh" (would be misleading in the dashboard) without
-- punishing users by retroactively counting an unknown number.
UPDATE "Project" SET "aiAnalysisCount" = 1
  WHERE "aiAnalyzed" = true AND "aiAnalysisCount" = 0;
