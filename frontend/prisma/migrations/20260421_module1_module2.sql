-- Module 1 (Mediation Inbox) + Module 2 (Job Board convention linkage).
-- Applied 2026-04-21. Idempotent.

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MediationThreadStatus') THEN
    CREATE TYPE "MediationThreadStatus" AS ENUM ('OPEN','CLOSED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MediationDirection') THEN
    CREATE TYPE "MediationDirection" AS ENUM ('COMPANY_TO_STUDENT','STUDENT_TO_COMPANY');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MediationMessageStatus') THEN
    CREATE TYPE "MediationMessageStatus" AS ENUM ('PENDING_REVIEW','APPROVED','EDITED','REJECTED','DELIVERED','READ','REPLIED');
  END IF;
END$$;

-- Add PENDING_APPROVAL to JobStatus enum if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum WHERE enumlabel = 'PENDING_APPROVAL'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'JobStatus')
  ) THEN
    ALTER TYPE "JobStatus" ADD VALUE 'PENDING_APPROVAL' AFTER 'DRAFT';
  END IF;
END$$;

-- MediationThread
CREATE TABLE IF NOT EXISTS "MediationThread" (
  "id"            TEXT PRIMARY KEY,
  "institutionId" TEXT NOT NULL,
  "companyUserId" TEXT NOT NULL,
  "studentId"     TEXT NOT NULL,
  "subject"       TEXT NOT NULL,
  "status"        "MediationThreadStatus" NOT NULL DEFAULT 'OPEN',
  "applicationId" TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MediationThread_studentId_fkey') THEN
    ALTER TABLE "MediationThread" ADD CONSTRAINT "MediationThread_studentId_fkey"
      FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MediationThread_companyUserId_fkey') THEN
    ALTER TABLE "MediationThread" ADD CONSTRAINT "MediationThread_companyUserId_fkey"
      FOREIGN KEY ("companyUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "MediationThread_institutionId_status_idx" ON "MediationThread"("institutionId","status");
CREATE INDEX IF NOT EXISTS "MediationThread_studentId_idx" ON "MediationThread"("studentId");
CREATE INDEX IF NOT EXISTS "MediationThread_companyUserId_idx" ON "MediationThread"("companyUserId");

-- MediationMessage
CREATE TABLE IF NOT EXISTS "MediationMessage" (
  "id"                TEXT PRIMARY KEY,
  "threadId"          TEXT NOT NULL,
  "direction"         "MediationDirection" NOT NULL,
  "authorUserId"      TEXT NOT NULL,
  "bodyOriginal"      TEXT NOT NULL,
  "bodyApproved"      TEXT,
  "status"            "MediationMessageStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "reviewedByStaffId" TEXT,
  "reviewedAt"        TIMESTAMP(3),
  "rejectionReason"   TEXT,
  "deliveredAt"       TIMESTAMP(3),
  "readAt"            TIMESTAMP(3),
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MediationMessage_threadId_fkey') THEN
    ALTER TABLE "MediationMessage" ADD CONSTRAINT "MediationMessage_threadId_fkey"
      FOREIGN KEY ("threadId") REFERENCES "MediationThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MediationMessage_authorUserId_fkey') THEN
    ALTER TABLE "MediationMessage" ADD CONSTRAINT "MediationMessage_authorUserId_fkey"
      FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "MediationMessage_threadId_idx" ON "MediationMessage"("threadId");
CREATE INDEX IF NOT EXISTS "MediationMessage_status_idx" ON "MediationMessage"("status");

-- MediationStaffNote
CREATE TABLE IF NOT EXISTS "MediationStaffNote" (
  "id"        TEXT PRIMARY KEY,
  "messageId" TEXT NOT NULL,
  "staffId"   TEXT NOT NULL,
  "note"      TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MediationStaffNote_messageId_fkey') THEN
    ALTER TABLE "MediationStaffNote" ADD CONSTRAINT "MediationStaffNote_messageId_fkey"
      FOREIGN KEY ("messageId") REFERENCES "MediationMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MediationStaffNote_staffId_fkey') THEN
    ALTER TABLE "MediationStaffNote" ADD CONSTRAINT "MediationStaffNote_staffId_fkey"
      FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "MediationStaffNote_messageId_idx" ON "MediationStaffNote"("messageId");

-- Extend Job with institution / convention / approval
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'institutionId') THEN
    ALTER TABLE "Job" ADD COLUMN "institutionId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'conventionId') THEN
    ALTER TABLE "Job" ADD COLUMN "conventionId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'approvedByStaffId') THEN
    ALTER TABLE "Job" ADD COLUMN "approvedByStaffId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'approvedAt') THEN
    ALTER TABLE "Job" ADD COLUMN "approvedAt" TIMESTAMP(3);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'offerType') THEN
    ALTER TABLE "Job" ADD COLUMN "offerType" "PlacementOfferType";
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Job_institutionId_fkey') THEN
    ALTER TABLE "Job" ADD CONSTRAINT "Job_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Job_conventionId_fkey') THEN
    ALTER TABLE "Job" ADD CONSTRAINT "Job_conventionId_fkey"
      FOREIGN KEY ("conventionId") REFERENCES "Convention"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "Job_institutionId_status_idx" ON "Job"("institutionId","status");
CREATE INDEX IF NOT EXISTS "Job_conventionId_idx" ON "Job"("conventionId");
