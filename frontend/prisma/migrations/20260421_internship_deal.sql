-- Tirocinio pipeline deal — HubSpot-style kanban card for ITS/university
-- admins. Applied 2026-04-21. Idempotent.

-- Enum: InternshipDealStage
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InternshipDealStage') THEN
    CREATE TYPE "InternshipDealStage" AS ENUM ('LEAD','CONVENZIONE','MATCHING','ATTIVO','COMPLETATO','ASSUNTO','LOST');
  END IF;
END$$;

-- Table
CREATE TABLE IF NOT EXISTS "InternshipDeal" (
  "id"             TEXT PRIMARY KEY,
  "universityName" TEXT NOT NULL,
  "ownerId"        TEXT NOT NULL,
  "companyName"    TEXT NOT NULL,
  "contactName"    TEXT,
  "contactEmail"   TEXT,
  "role"           TEXT,
  "industry"       TEXT,
  "studentId"      TEXT,
  "stage"          "InternshipDealStage" NOT NULL DEFAULT 'LEAD',
  "stageChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startDate"      TIMESTAMP(3),
  "endDate"        TIMESTAMP(3),
  "tutorName"      TEXT,
  "tutorEmail"     TEXT,
  "salaryAmount"   INTEGER,
  "salaryCurrency" TEXT DEFAULT 'EUR',
  "notes"          TEXT,
  "sourceType"     TEXT,
  "sourceId"       TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Foreign keys
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InternshipDeal_ownerId_fkey') THEN
    ALTER TABLE "InternshipDeal"
      ADD CONSTRAINT "InternshipDeal_ownerId_fkey"
      FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InternshipDeal_studentId_fkey') THEN
    ALTER TABLE "InternshipDeal"
      ADD CONSTRAINT "InternshipDeal_studentId_fkey"
      FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS "InternshipDeal_universityName_stage_idx"
  ON "InternshipDeal"("universityName", "stage");
CREATE INDEX IF NOT EXISTS "InternshipDeal_ownerId_stage_idx"
  ON "InternshipDeal"("ownerId", "stage");
CREATE INDEX IF NOT EXISTS "InternshipDeal_studentId_idx"
  ON "InternshipDeal"("studentId");
CREATE INDEX IF NOT EXISTS "InternshipDeal_companyName_idx"
  ON "InternshipDeal"("companyName");
