-- Foundation for Modules 1-4 institutional workspace.
-- Applied 2026-04-21. Idempotent.

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionType') THEN
    CREATE TYPE "InstitutionType" AS ENUM ('UNIVERSITY_PUBLIC','UNIVERSITY_PRIVATE','ITS','SCHOOL');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionPlan') THEN
    CREATE TYPE "InstitutionPlan" AS ENUM ('CORE','PREMIUM');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AffiliationStatus') THEN
    CREATE TYPE "AffiliationStatus" AS ENUM ('PENDING','ACTIVE','ENDED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StaffRole') THEN
    CREATE TYPE "StaffRole" AS ENUM ('INSTITUTION_ADMIN','INSTITUTION_STAFF','ACADEMIC_TUTOR','COMPANY_TUTOR');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ConventionStatus') THEN
    CREATE TYPE "ConventionStatus" AS ENUM ('DRAFT','ACTIVE','EXPIRED','CANCELLED');
  END IF;
END$$;

-- Institution
CREATE TABLE IF NOT EXISTS "Institution" (
  "id"                   TEXT PRIMARY KEY,
  "name"                 TEXT NOT NULL,
  "slug"                 TEXT NOT NULL UNIQUE,
  "type"                 "InstitutionType" NOT NULL DEFAULT 'UNIVERSITY_PUBLIC',
  "plan"                 "InstitutionPlan" NOT NULL DEFAULT 'CORE',
  "mediationEnabled"     BOOLEAN NOT NULL DEFAULT FALSE,
  "requireOfferApproval" BOOLEAN NOT NULL DEFAULT FALSE,
  "primaryAdminId"       TEXT,
  "description"          TEXT,
  "website"              TEXT,
  "logo"                 TEXT,
  "city"                 TEXT,
  "region"               TEXT,
  "country"              TEXT DEFAULT 'IT',
  "legalName"            TEXT,
  "vatNumber"            TEXT,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Institution_type_idx" ON "Institution"("type");
CREATE INDEX IF NOT EXISTS "Institution_plan_idx" ON "Institution"("plan");

-- InstitutionStaff
CREATE TABLE IF NOT EXISTS "InstitutionStaff" (
  "id"            TEXT PRIMARY KEY,
  "userId"        TEXT NOT NULL,
  "institutionId" TEXT NOT NULL,
  "role"          "StaffRole" NOT NULL DEFAULT 'INSTITUTION_STAFF',
  "invitedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "activatedAt"   TIMESTAMP(3)
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InstitutionStaff_userId_fkey') THEN
    ALTER TABLE "InstitutionStaff" ADD CONSTRAINT "InstitutionStaff_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InstitutionStaff_institutionId_fkey') THEN
    ALTER TABLE "InstitutionStaff" ADD CONSTRAINT "InstitutionStaff_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
CREATE UNIQUE INDEX IF NOT EXISTS "InstitutionStaff_userId_institutionId_key" ON "InstitutionStaff"("userId","institutionId");
CREATE INDEX IF NOT EXISTS "InstitutionStaff_institutionId_role_idx" ON "InstitutionStaff"("institutionId","role");

-- InstitutionAffiliation
CREATE TABLE IF NOT EXISTS "InstitutionAffiliation" (
  "id"            TEXT PRIMARY KEY,
  "studentId"     TEXT NOT NULL,
  "institutionId" TEXT NOT NULL,
  "program"       TEXT,
  "status"        "AffiliationStatus" NOT NULL DEFAULT 'ACTIVE',
  "startDate"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endDate"       TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InstitutionAffiliation_studentId_fkey') THEN
    ALTER TABLE "InstitutionAffiliation" ADD CONSTRAINT "InstitutionAffiliation_studentId_fkey"
      FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InstitutionAffiliation_institutionId_fkey') THEN
    ALTER TABLE "InstitutionAffiliation" ADD CONSTRAINT "InstitutionAffiliation_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
-- Note: unique index with nullable program works because Postgres treats NULLs as distinct,
-- but we scope per-program uniqueness for students (dual-degree scenario)
CREATE UNIQUE INDEX IF NOT EXISTS "InstitutionAffiliation_studentId_institutionId_program_key"
  ON "InstitutionAffiliation"("studentId","institutionId", COALESCE("program", ''));
CREATE INDEX IF NOT EXISTS "InstitutionAffiliation_studentId_status_idx" ON "InstitutionAffiliation"("studentId","status");
CREATE INDEX IF NOT EXISTS "InstitutionAffiliation_institutionId_status_idx" ON "InstitutionAffiliation"("institutionId","status");

-- Convention
CREATE TABLE IF NOT EXISTS "Convention" (
  "id"            TEXT PRIMARY KEY,
  "institutionId" TEXT NOT NULL,
  "companyName"   TEXT NOT NULL,
  "companyDomain" TEXT,
  "status"        "ConventionStatus" NOT NULL DEFAULT 'DRAFT',
  "signedAt"      TIMESTAMP(3),
  "expiresAt"     TIMESTAMP(3),
  "documentUrl"   TEXT,
  "notes"         TEXT,
  "createdById"   TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Convention_institutionId_fkey') THEN
    ALTER TABLE "Convention" ADD CONSTRAINT "Convention_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Convention_createdById_fkey') THEN
    ALTER TABLE "Convention" ADD CONSTRAINT "Convention_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "Convention_institutionId_status_idx" ON "Convention"("institutionId","status");
CREATE INDEX IF NOT EXISTS "Convention_companyName_idx" ON "Convention"("companyName");

-- AuditEvent
CREATE TABLE IF NOT EXISTS "AuditEvent" (
  "id"            TEXT PRIMARY KEY,
  "actorId"       TEXT,
  "actorRole"     TEXT,
  "action"        TEXT NOT NULL,
  "entityType"    TEXT NOT NULL,
  "entityId"      TEXT NOT NULL,
  "payload"       JSONB,
  "institutionId" TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType","entityId");
CREATE INDEX IF NOT EXISTS "AuditEvent_actorId_createdAt_idx" ON "AuditEvent"("actorId","createdAt");
CREATE INDEX IF NOT EXISTS "AuditEvent_institutionId_createdAt_idx" ON "AuditEvent"("institutionId","createdAt");

-- Backfill Institution rows from existing UniversitySettings
INSERT INTO "Institution" ("id", "name", "slug", "type", "plan", "description", "website", "city", "region", "country", "primaryAdminId", "createdAt", "updatedAt")
SELECT
  us."id",
  us."name",
  LOWER(REGEXP_REPLACE(us."shortName" || '-' || us."id", '[^a-z0-9]+', '-', 'g')),
  CASE
    WHEN us."institutionType" = 'its' THEN 'ITS'::"InstitutionType"
    WHEN us."institutionType" = 'school' THEN 'SCHOOL'::"InstitutionType"
    ELSE 'UNIVERSITY_PUBLIC'::"InstitutionType"
  END,
  'CORE'::"InstitutionPlan",
  us."description",
  us."website",
  us."city",
  us."region",
  COALESCE(us."country", 'IT'),
  us."userId",
  COALESCE(us."createdAt", CURRENT_TIMESTAMP),
  COALESCE(us."updatedAt", CURRENT_TIMESTAMP)
FROM "UniversitySettings" us
WHERE NOT EXISTS (SELECT 1 FROM "Institution" i WHERE i."id" = us."id")
ON CONFLICT DO NOTHING;

-- Promote each UniversitySettings owner to INSTITUTION_ADMIN
INSERT INTO "InstitutionStaff" ("id", "userId", "institutionId", "role", "invitedAt", "activatedAt")
SELECT
  'is_' || us."id",
  us."userId",
  us."id",
  'INSTITUTION_ADMIN'::"StaffRole",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "UniversitySettings" us
WHERE NOT EXISTS (
  SELECT 1 FROM "InstitutionStaff" s WHERE s."userId" = us."userId" AND s."institutionId" = us."id"
)
ON CONFLICT DO NOTHING;
