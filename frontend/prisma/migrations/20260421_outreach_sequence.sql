-- Outreach sequencing — applied 2026-04-21
-- Adds OutreachSequence table + OutreachSequenceStatus enum.
-- Cron walks ACTIVE sequences with nextSendAt <= now() and delivers the next step.
-- Safe to re-run (all operations use IF NOT EXISTS / DO blocks).

-- Enum: OutreachSequenceStatus
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OutreachSequenceStatus') THEN
    CREATE TYPE "OutreachSequenceStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'REPLIED', 'BOUNCED');
  END IF;
END$$;

-- OutreachSequence table
CREATE TABLE IF NOT EXISTS "OutreachSequence" (
  "id"             TEXT PRIMARY KEY,
  "recruiterId"    TEXT NOT NULL,
  "candidateId"    TEXT NOT NULL,
  "templateId"     TEXT,
  "templateName"   TEXT NOT NULL,
  "steps"          JSONB NOT NULL,
  "currentStepIdx" INTEGER NOT NULL DEFAULT 0,
  "status"         "OutreachSequenceStatus" NOT NULL DEFAULT 'ACTIVE',
  "lastSentAt"     TIMESTAMP(3),
  "nextSendAt"     TIMESTAMP(3),
  "events"         JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Foreign keys. Cascade on user deletion matches the SavedCandidate / OutreachTemplate pattern.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'OutreachSequence_recruiterId_fkey'
  ) THEN
    ALTER TABLE "OutreachSequence"
      ADD CONSTRAINT "OutreachSequence_recruiterId_fkey"
      FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'OutreachSequence_candidateId_fkey'
  ) THEN
    ALTER TABLE "OutreachSequence"
      ADD CONSTRAINT "OutreachSequence_candidateId_fkey"
      FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'OutreachSequence_templateId_fkey'
  ) THEN
    ALTER TABLE "OutreachSequence"
      ADD CONSTRAINT "OutreachSequence_templateId_fkey"
      FOREIGN KEY ("templateId") REFERENCES "OutreachTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS "OutreachSequence_recruiterId_status_idx"
  ON "OutreachSequence"("recruiterId", "status");

CREATE INDEX IF NOT EXISTS "OutreachSequence_nextSendAt_status_idx"
  ON "OutreachSequence"("nextSendAt", "status");

CREATE INDEX IF NOT EXISTS "OutreachSequence_candidateId_idx"
  ON "OutreachSequence"("candidateId");
