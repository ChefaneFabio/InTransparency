-- 2026-04-22: Notification and ContactUsage tables + User billing columns
-- exist in schema.prisma but were never put into a migration file. On the
-- dev DB they were previously created via `prisma db push`; on production
-- they are missing, causing /api/notifications and /api/dashboard/recruiter/stats
-- to 500. This migration is fully idempotent: safe on dev (no-op) and on prod
-- (creates the missing objects).

-- ---------- SubscriptionTier enum ----------
DO $$ BEGIN
  CREATE TYPE "SubscriptionTier" AS ENUM (
    'FREE',
    'STUDENT_PREMIUM',
    'RECRUITER_FREE',
    'RECRUITER_PAY_PER_CONTACT',
    'RECRUITER_ENTERPRISE',
    'INSTITUTION_ENTERPRISE'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------- User billing columns ----------
DO $$ BEGIN
  ALTER TABLE "User"
    ADD COLUMN "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "User"
    ADD COLUMN "contactBalance" INTEGER NOT NULL DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "User_subscriptionTier_idx" ON "User" ("subscriptionTier");

-- ---------- ContactUsage (recruiter pay-per-contact billing) ----------
CREATE TABLE IF NOT EXISTS "ContactUsage" (
  "id" TEXT NOT NULL,
  "recruiterId" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "billingPeriodStart" TIMESTAMP(3) NOT NULL,
  "billingPeriodEnd" TIMESTAMP(3) NOT NULL,
  "firstContactAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "messageId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "outcome" TEXT,
  "outcomeNote" TEXT,
  "outcomeAt" TIMESTAMP(3),
  "hiringPosition" TEXT,
  "responseTimeHours" INTEGER,
  CONSTRAINT "ContactUsage_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  CREATE UNIQUE INDEX "ContactUsage_recruiterId_recipientId_billingPeriodStart_key"
    ON "ContactUsage" ("recruiterId", "recipientId", "billingPeriodStart");
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "ContactUsage_recruiterId_billingPeriodStart_idx"
  ON "ContactUsage" ("recruiterId", "billingPeriodStart");
CREATE INDEX IF NOT EXISTS "ContactUsage_outcome_idx" ON "ContactUsage" ("outcome");

DO $$ BEGIN
  ALTER TABLE "ContactUsage"
    ADD CONSTRAINT "ContactUsage_recruiterId_fkey"
    FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ContactUsage"
    ADD CONSTRAINT "ContactUsage_recipientId_fkey"
    FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------- Notification (bell / notification center) ----------
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "link" TEXT,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "dismissed" BOOLEAN NOT NULL DEFAULT false,
  "groupKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_userId_read_idx" ON "Notification" ("userId", "read");
CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification" ("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Notification_type_idx" ON "Notification" ("type");
CREATE INDEX IF NOT EXISTS "Notification_groupKey_idx" ON "Notification" ("groupKey");

DO $$ BEGIN
  ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
