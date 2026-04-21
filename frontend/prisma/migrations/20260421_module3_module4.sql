-- Module 3 (Company Pipeline CRM) + Module 4 (Placement lifecycle) schema.
-- Applied 2026-04-21. Idempotent.

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PipelineStageType') THEN
    CREATE TYPE "PipelineStageType" AS ENUM ('LEAD','CONTACTED','MEETING','PROPOSAL','SIGNED','ACTIVE','RENEWAL','LOST');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ActivityType') THEN
    CREATE TYPE "ActivityType" AS ENUM ('NOTE','EMAIL','CALL','MEETING','DOCUMENT','STAGE_CHANGE');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PlacementStageType') THEN
    CREATE TYPE "PlacementStageType" AS ENUM ('APPLICATION','INTERVIEW','MATCHED','CONVENTION_SIGNED','IN_PROGRESS','MID_EVALUATION','FINAL_EVALUATION','COMPLETED','FOLLOW_UP','DROPPED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PlacementOutcome') THEN
    CREATE TYPE "PlacementOutcome" AS ENUM ('COMPLETED','HIRED','DROPPED','EXTENDED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PlacementOfferType') THEN
    CREATE TYPE "PlacementOfferType" AS ENUM ('TIROCINIO_CURRICULARE','TIROCINIO_EXTRA','APPRENDISTATO','PLACEMENT','PART_TIME');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EvaluationKind') THEN
    CREATE TYPE "EvaluationKind" AS ENUM ('MID','FINAL','INCIDENT');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DeadlineType') THEN
    CREATE TYPE "DeadlineType" AS ENUM ('DOCUMENT','EVALUATION','HOUR_CHECKPOINT','CUSTOM');
  END IF;
END$$;

-- PipelineStage
CREATE TABLE IF NOT EXISTS "PipelineStage" (
  "id"            TEXT PRIMARY KEY,
  "institutionId" TEXT NOT NULL,
  "name"          TEXT NOT NULL,
  "order"         INTEGER NOT NULL,
  "type"          "PipelineStageType" NOT NULL,
  "archived"      BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PipelineStage_institutionId_fkey') THEN
    ALTER TABLE "PipelineStage" ADD CONSTRAINT "PipelineStage_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
CREATE UNIQUE INDEX IF NOT EXISTS "PipelineStage_institutionId_order_key" ON "PipelineStage"("institutionId","order");
CREATE INDEX IF NOT EXISTS "PipelineStage_institutionId_idx" ON "PipelineStage"("institutionId");

-- CompanyLead
CREATE TABLE IF NOT EXISTS "CompanyLead" (
  "id"                  TEXT PRIMARY KEY,
  "institutionId"       TEXT NOT NULL,
  "companyId"           TEXT,
  "externalName"        TEXT,
  "externalDomain"      TEXT,
  "sector"              TEXT,
  "sizeRange"           TEXT,
  "region"              TEXT,
  "city"                TEXT,
  "ownerStaffId"        TEXT,
  "currentStageId"      TEXT NOT NULL,
  "stageEnteredAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "source"              TEXT,
  "lostReason"          TEXT,
  "nextActionAt"        TIMESTAMP(3),
  "primaryContactName"  TEXT,
  "primaryContactEmail" TEXT,
  "primaryContactPhone" TEXT,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CompanyLead_institutionId_fkey') THEN
    ALTER TABLE "CompanyLead" ADD CONSTRAINT "CompanyLead_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CompanyLead_ownerStaffId_fkey') THEN
    ALTER TABLE "CompanyLead" ADD CONSTRAINT "CompanyLead_ownerStaffId_fkey"
      FOREIGN KEY ("ownerStaffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CompanyLead_currentStageId_fkey') THEN
    ALTER TABLE "CompanyLead" ADD CONSTRAINT "CompanyLead_currentStageId_fkey"
      FOREIGN KEY ("currentStageId") REFERENCES "PipelineStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "CompanyLead_institutionId_currentStageId_idx" ON "CompanyLead"("institutionId","currentStageId");
CREATE INDEX IF NOT EXISTS "CompanyLead_ownerStaffId_idx" ON "CompanyLead"("ownerStaffId");
CREATE INDEX IF NOT EXISTS "CompanyLead_nextActionAt_idx" ON "CompanyLead"("nextActionAt");

-- PipelineActivity
CREATE TABLE IF NOT EXISTS "PipelineActivity" (
  "id"          TEXT PRIMARY KEY,
  "leadId"      TEXT NOT NULL,
  "staffId"     TEXT NOT NULL,
  "type"        "ActivityType" NOT NULL,
  "content"     TEXT NOT NULL,
  "attachments" JSONB,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PipelineActivity_leadId_fkey') THEN
    ALTER TABLE "PipelineActivity" ADD CONSTRAINT "PipelineActivity_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "CompanyLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PipelineActivity_staffId_fkey') THEN
    ALTER TABLE "PipelineActivity" ADD CONSTRAINT "PipelineActivity_staffId_fkey"
      FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "PipelineActivity_leadId_createdAt_idx" ON "PipelineActivity"("leadId","createdAt");

-- StageTransition
CREATE TABLE IF NOT EXISTS "StageTransition" (
  "id"          TEXT PRIMARY KEY,
  "leadId"      TEXT NOT NULL,
  "fromStageId" TEXT,
  "toStageId"   TEXT NOT NULL,
  "staffId"     TEXT NOT NULL,
  "note"        TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StageTransition_leadId_fkey') THEN
    ALTER TABLE "StageTransition" ADD CONSTRAINT "StageTransition_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "CompanyLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StageTransition_fromStageId_fkey') THEN
    ALTER TABLE "StageTransition" ADD CONSTRAINT "StageTransition_fromStageId_fkey"
      FOREIGN KEY ("fromStageId") REFERENCES "PipelineStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StageTransition_toStageId_fkey') THEN
    ALTER TABLE "StageTransition" ADD CONSTRAINT "StageTransition_toStageId_fkey"
      FOREIGN KEY ("toStageId") REFERENCES "PipelineStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StageTransition_staffId_fkey') THEN
    ALTER TABLE "StageTransition" ADD CONSTRAINT "StageTransition_staffId_fkey"
      FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "StageTransition_leadId_createdAt_idx" ON "StageTransition"("leadId","createdAt");

-- Extend Placement
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'institutionId') THEN
    ALTER TABLE "Placement" ADD COLUMN "institutionId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'offerType') THEN
    ALTER TABLE "Placement" ADD COLUMN "offerType" "PlacementOfferType" NOT NULL DEFAULT 'TIROCINIO_CURRICULARE';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'currentStageId') THEN
    ALTER TABLE "Placement" ADD COLUMN "currentStageId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'stageEnteredAt') THEN
    ALTER TABLE "Placement" ADD COLUMN "stageEnteredAt" TIMESTAMP(3);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'plannedHours') THEN
    ALTER TABLE "Placement" ADD COLUMN "plannedHours" INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'completedHours') THEN
    ALTER TABLE "Placement" ADD COLUMN "completedHours" INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'lastHoursLoggedAt') THEN
    ALTER TABLE "Placement" ADD COLUMN "lastHoursLoggedAt" TIMESTAMP(3);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'academicTutorId') THEN
    ALTER TABLE "Placement" ADD COLUMN "academicTutorId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'companyTutorUserId') THEN
    ALTER TABLE "Placement" ADD COLUMN "companyTutorUserId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'conventionId') THEN
    ALTER TABLE "Placement" ADD COLUMN "conventionId" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'outcome') THEN
    ALTER TABLE "Placement" ADD COLUMN "outcome" "PlacementOutcome";
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Placement' AND column_name = 'outcomeNotes') THEN
    ALTER TABLE "Placement" ADD COLUMN "outcomeNotes" TEXT;
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Placement_institutionId_fkey') THEN
    ALTER TABLE "Placement" ADD CONSTRAINT "Placement_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Placement_academicTutorId_fkey') THEN
    ALTER TABLE "Placement" ADD CONSTRAINT "Placement_academicTutorId_fkey"
      FOREIGN KEY ("academicTutorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Placement_companyTutorUserId_fkey') THEN
    ALTER TABLE "Placement" ADD CONSTRAINT "Placement_companyTutorUserId_fkey"
      FOREIGN KEY ("companyTutorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Placement_conventionId_fkey') THEN
    ALTER TABLE "Placement" ADD CONSTRAINT "Placement_conventionId_fkey"
      FOREIGN KEY ("conventionId") REFERENCES "Convention"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "Placement_institutionId_currentStageId_idx" ON "Placement"("institutionId","currentStageId");
CREATE INDEX IF NOT EXISTS "Placement_academicTutorId_idx" ON "Placement"("academicTutorId");
CREATE INDEX IF NOT EXISTS "Placement_companyTutorUserId_idx" ON "Placement"("companyTutorUserId");

-- PlacementStage
CREATE TABLE IF NOT EXISTS "PlacementStage" (
  "id"            TEXT PRIMARY KEY,
  "institutionId" TEXT NOT NULL,
  "name"          TEXT NOT NULL,
  "order"         INTEGER NOT NULL,
  "type"          "PlacementStageType" NOT NULL,
  "appliesTo"     "PlacementOfferType"[] DEFAULT ARRAY[]::"PlacementOfferType"[],
  "archived"      BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PlacementStage_institutionId_fkey') THEN
    ALTER TABLE "PlacementStage" ADD CONSTRAINT "PlacementStage_institutionId_fkey"
      FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Placement_currentStageId_fkey') THEN
    ALTER TABLE "Placement" ADD CONSTRAINT "Placement_currentStageId_fkey"
      FOREIGN KEY ("currentStageId") REFERENCES "PlacementStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
CREATE UNIQUE INDEX IF NOT EXISTS "PlacementStage_institutionId_order_key" ON "PlacementStage"("institutionId","order");
CREATE INDEX IF NOT EXISTS "PlacementStage_institutionId_idx" ON "PlacementStage"("institutionId");

-- PlacementEvaluation
CREATE TABLE IF NOT EXISTS "PlacementEvaluation" (
  "id"                TEXT PRIMARY KEY,
  "placementId"       TEXT NOT NULL,
  "kind"              "EvaluationKind" NOT NULL,
  "submittedByUserId" TEXT NOT NULL,
  "submitterRole"     TEXT NOT NULL,
  "scores"            JSONB,
  "comments"          TEXT,
  "submittedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PlacementEvaluation_placementId_fkey') THEN
    ALTER TABLE "PlacementEvaluation" ADD CONSTRAINT "PlacementEvaluation_placementId_fkey"
      FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PlacementEvaluation_submittedByUserId_fkey') THEN
    ALTER TABLE "PlacementEvaluation" ADD CONSTRAINT "PlacementEvaluation_submittedByUserId_fkey"
      FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "PlacementEvaluation_placementId_kind_idx" ON "PlacementEvaluation"("placementId","kind");

-- PlacementDeadline
CREATE TABLE IF NOT EXISTS "PlacementDeadline" (
  "id"          TEXT PRIMARY KEY,
  "placementId" TEXT NOT NULL,
  "label"       TEXT NOT NULL,
  "dueAt"       TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "type"        "DeadlineType" NOT NULL,
  "notifyRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PlacementDeadline_placementId_fkey') THEN
    ALTER TABLE "PlacementDeadline" ADD CONSTRAINT "PlacementDeadline_placementId_fkey"
      FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "PlacementDeadline_placementId_dueAt_idx" ON "PlacementDeadline"("placementId","dueAt");
CREATE INDEX IF NOT EXISTS "PlacementDeadline_dueAt_completedAt_idx" ON "PlacementDeadline"("dueAt","completedAt");

-- PlacementHoursLog
CREATE TABLE IF NOT EXISTS "PlacementHoursLog" (
  "id"               TEXT PRIMARY KEY,
  "placementId"      TEXT NOT NULL,
  "loggedByUserId"   TEXT NOT NULL,
  "loggedByRole"     TEXT NOT NULL,
  "periodStart"      TIMESTAMP(3) NOT NULL,
  "periodEnd"        TIMESTAMP(3) NOT NULL,
  "hours"            INTEGER NOT NULL,
  "source"           TEXT,
  "confirmedByTutor" BOOLEAN NOT NULL DEFAULT FALSE,
  "notes"            TEXT,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PlacementHoursLog_placementId_fkey') THEN
    ALTER TABLE "PlacementHoursLog" ADD CONSTRAINT "PlacementHoursLog_placementId_fkey"
      FOREIGN KEY ("placementId") REFERENCES "Placement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PlacementHoursLog_loggedByUserId_fkey') THEN
    ALTER TABLE "PlacementHoursLog" ADD CONSTRAINT "PlacementHoursLog_loggedByUserId_fkey"
      FOREIGN KEY ("loggedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS "PlacementHoursLog_placementId_periodStart_idx" ON "PlacementHoursLog"("placementId","periodStart");
CREATE INDEX IF NOT EXISTS "PlacementHoursLog_loggedByUserId_idx" ON "PlacementHoursLog"("loggedByUserId");

-- Seed default pipeline stages (Module 3) for every existing institution
INSERT INTO "PipelineStage" ("id", "institutionId", "name", "order", "type")
SELECT
  'ps_' || i."id" || '_' || s."order",
  i."id",
  s."name",
  s."order",
  s."type"::"PipelineStageType"
FROM "Institution" i
CROSS JOIN (VALUES
  (1, 'Lead', 'LEAD'),
  (2, 'Primo contatto', 'CONTACTED'),
  (3, 'Meeting fissato', 'MEETING'),
  (4, 'Proposta inviata', 'PROPOSAL'),
  (5, 'Convenzione firmata', 'SIGNED'),
  (6, 'Convenzione attiva', 'ACTIVE'),
  (7, 'Rinnovo', 'RENEWAL'),
  (8, 'Perso', 'LOST')
) AS s("order", "name", "type")
WHERE NOT EXISTS (
  SELECT 1 FROM "PipelineStage" ps WHERE ps."institutionId" = i."id" AND ps."order" = s."order"
);

-- Seed default placement stages (Module 4) for every existing institution
INSERT INTO "PlacementStage" ("id", "institutionId", "name", "order", "type", "appliesTo")
SELECT
  'pms_' || i."id" || '_' || s."order",
  i."id",
  s."name",
  s."order",
  s."type"::"PlacementStageType",
  ARRAY['TIROCINIO_CURRICULARE','TIROCINIO_EXTRA','APPRENDISTATO','PLACEMENT']::"PlacementOfferType"[]
FROM "Institution" i
CROSS JOIN (VALUES
  (1, 'Candidatura', 'APPLICATION'),
  (2, 'Colloquio azienda', 'INTERVIEW'),
  (3, 'Matching approvato', 'MATCHED'),
  (4, 'Convenzione firmata', 'CONVENTION_SIGNED'),
  (5, 'Tirocinio in corso', 'IN_PROGRESS'),
  (6, 'Valutazione intermedia', 'MID_EVALUATION'),
  (7, 'Valutazione finale', 'FINAL_EVALUATION'),
  (8, 'Conclusione', 'COMPLETED'),
  (9, 'Esito occupazionale', 'FOLLOW_UP')
) AS s("order", "name", "type")
WHERE NOT EXISTS (
  SELECT 1 FROM "PlacementStage" ps WHERE ps."institutionId" = i."id" AND ps."order" = s."order"
);
