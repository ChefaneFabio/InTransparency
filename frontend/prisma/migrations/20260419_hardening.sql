-- Hardening migration — applied 2026-04-19 to Neon production
-- Covers: AuditLog, 2FA user fields, Organization billing/seat fields
-- Safe to re-run (all operations use IF NOT EXISTS).

-- 2FA on User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "totpEnrolledAt"   TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "totpBackupCodes"  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Seat-based billing on Organization
ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "seatLimit"   INTEGER,
  ADD COLUMN IF NOT EXISTS "billingPlan" TEXT,
  ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);

-- AuditLog — GDPR Art. 5(2) + AI Act Art. 12
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id"         TEXT PRIMARY KEY,
  "actorId"    TEXT,
  "actorEmail" TEXT,
  "actorRole"  TEXT,
  "action"     TEXT NOT NULL,
  "targetType" TEXT,
  "targetId"   TEXT,
  "context"    JSONB,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "AuditLog_actorId_createdAt_idx"
  ON "AuditLog"("actorId", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_action_createdAt_idx"
  ON "AuditLog"("action", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_targetType_targetId_idx"
  ON "AuditLog"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx"
  ON "AuditLog"("createdAt");
