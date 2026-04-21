-- Saved jobs (student bookmarks) + active job-seeking signal on User.
-- Applied 2026-04-21. Idempotent.

-- Enum: JobSearchStatus
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'JobSearchStatus') THEN
    CREATE TYPE "JobSearchStatus" AS ENUM ('NOT_LOOKING','OPEN','ACTIVELY_LOOKING');
  END IF;
END$$;

-- Add columns on User
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'jobSearchStatus') THEN
    ALTER TABLE "User" ADD COLUMN "jobSearchStatus" "JobSearchStatus" NOT NULL DEFAULT 'NOT_LOOKING';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'availabilityFrom') THEN
    ALTER TABLE "User" ADD COLUMN "availabilityFrom" TIMESTAMP(3);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'jobSearchUpdatedAt') THEN
    ALTER TABLE "User" ADD COLUMN "jobSearchUpdatedAt" TIMESTAMP(3);
  END IF;
END$$;

-- SavedJob table
CREATE TABLE IF NOT EXISTS "SavedJob" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL,
  "jobId"     TEXT NOT NULL,
  "notes"     TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedJob_userId_fkey') THEN
    ALTER TABLE "SavedJob"
      ADD CONSTRAINT "SavedJob_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedJob_jobId_fkey') THEN
    ALTER TABLE "SavedJob"
      ADD CONSTRAINT "SavedJob_jobId_fkey"
      FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

CREATE UNIQUE INDEX IF NOT EXISTS "SavedJob_userId_jobId_key" ON "SavedJob"("userId", "jobId");
CREATE INDEX IF NOT EXISTS "SavedJob_userId_idx" ON "SavedJob"("userId");
CREATE INDEX IF NOT EXISTS "SavedJob_jobId_idx" ON "SavedJob"("jobId");
