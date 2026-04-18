-- Migration: Vision Wire-Up — P1 through P7
-- Adds ESCO mapping, SkillDelta, MatchExplanation, SkillGapTrend,
-- VerifiableCredential, CompanyProfile, CompanyFollow, SelfDiscoveryProfile.
--
-- Safe to run on an existing production DB: all ALTERs are additive,
-- all new tables and enums use IF NOT EXISTS or are brand-new names.

-- ============================================
-- P1 — ESCO mapping on SkillMapping
-- ============================================
ALTER TABLE "SkillMapping"
  ADD COLUMN IF NOT EXISTS "escoUri" TEXT,
  ADD COLUMN IF NOT EXISTS "escoConceptUri" TEXT,
  ADD COLUMN IF NOT EXISTS "escoPreferred" TEXT,
  ADD COLUMN IF NOT EXISTS "escoVersion" TEXT;

CREATE INDEX IF NOT EXISTS "SkillMapping_escoUri_idx" ON "SkillMapping"("escoUri");

-- ============================================
-- P1 — SkillDelta
-- ============================================
DO $$ BEGIN
  CREATE TYPE "SkillDeltaSource" AS ENUM ('STAGE', 'PROJECT', 'COURSE', 'THESIS', 'ENDORSEMENT', 'SELF_ASSESSMENT', 'EXCHANGE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "SkillDelta" (
  "id"              TEXT PRIMARY KEY,
  "studentId"       TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "skillTerm"       TEXT NOT NULL,
  "skillMappingId"  TEXT,
  "escoUri"         TEXT,
  "source"          "SkillDeltaSource" NOT NULL,
  "sourceId"        TEXT NOT NULL,
  "sourceName"      TEXT,
  "beforeLevel"     INTEGER,
  "afterLevel"      INTEGER NOT NULL,
  "confidence"      DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "evaluatorType"   TEXT,
  "evaluatorId"     TEXT,
  "evaluatorName"   TEXT,
  "evidence"        JSONB,
  "occurredAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "SkillDelta_studentId_idx"         ON "SkillDelta"("studentId");
CREATE INDEX IF NOT EXISTS "SkillDelta_skillTerm_idx"         ON "SkillDelta"("skillTerm");
CREATE INDEX IF NOT EXISTS "SkillDelta_escoUri_idx"           ON "SkillDelta"("escoUri");
CREATE INDEX IF NOT EXISTS "SkillDelta_source_sourceId_idx"   ON "SkillDelta"("source", "sourceId");
CREATE INDEX IF NOT EXISTS "SkillDelta_occurredAt_idx"        ON "SkillDelta"("occurredAt");

-- ============================================
-- P2 — MatchExplanation
-- ============================================
CREATE TABLE IF NOT EXISTS "MatchExplanation" (
  "id"               TEXT PRIMARY KEY,
  "subjectId"        TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "subjectType"      TEXT NOT NULL,
  "counterpartyId"   TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "counterpartyType" TEXT NOT NULL,
  "contextType"      TEXT,
  "contextId"        TEXT,
  "matchScore"       DOUBLE PRECISION NOT NULL,
  "decisionLabel"    TEXT,
  "factors"          JSONB NOT NULL,
  "modelVersion"     TEXT NOT NULL,
  "modelType"        TEXT NOT NULL,
  "inputSnapshot"    JSONB,
  "reviewed"         BOOLEAN NOT NULL DEFAULT FALSE,
  "reviewedBy"       TEXT,
  "reviewedAt"       TIMESTAMP(3),
  "reviewOutcome"    TEXT,
  "reviewNotes"      TEXT,
  "subjectViewed"    BOOLEAN NOT NULL DEFAULT FALSE,
  "subjectViewedAt"  TIMESTAMP(3),
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "MatchExplanation_subjectId_idx"            ON "MatchExplanation"("subjectId");
CREATE INDEX IF NOT EXISTS "MatchExplanation_counterpartyId_idx"       ON "MatchExplanation"("counterpartyId");
CREATE INDEX IF NOT EXISTS "MatchExplanation_contextType_contextId_idx" ON "MatchExplanation"("contextType", "contextId");
CREATE INDEX IF NOT EXISTS "MatchExplanation_createdAt_idx"            ON "MatchExplanation"("createdAt");

-- ============================================
-- P3 — SkillGapTrend
-- ============================================
CREATE TABLE IF NOT EXISTS "SkillGapTrend" (
  "id"             TEXT PRIMARY KEY,
  "universityName" TEXT NOT NULL,
  "programName"    TEXT,
  "programLevel"   TEXT,
  "snapshotMonth"  TIMESTAMP(3) NOT NULL,
  "topSkills"      JSONB NOT NULL,
  "gaps"           JSONB NOT NULL,
  "strengths"      JSONB NOT NULL,
  "studentCount"   INTEGER NOT NULL,
  "jobCount"       INTEGER NOT NULL,
  "gapIndex"       DOUBLE PRECISION NOT NULL,
  "alignmentIndex" DOUBLE PRECISION NOT NULL,
  "recommendations" JSONB,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "SkillGapTrend_unique_university_program_month"
  ON "SkillGapTrend"("universityName", "programName", "snapshotMonth");
CREATE INDEX IF NOT EXISTS "SkillGapTrend_universityName_snapshotMonth_idx"
  ON "SkillGapTrend"("universityName", "snapshotMonth");
CREATE INDEX IF NOT EXISTS "SkillGapTrend_programName_idx" ON "SkillGapTrend"("programName");

-- ============================================
-- P4 — VerifiableCredential
-- ============================================
DO $$ BEGIN
  CREATE TYPE "VCStatus" AS ENUM ('ISSUED', 'REVOKED', 'EXPIRED', 'SUPERSEDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "VerifiableCredential" (
  "id"                  TEXT PRIMARY KEY,
  "subjectId"           TEXT NOT NULL,
  "subjectName"         TEXT NOT NULL,
  "issuerType"          TEXT NOT NULL,
  "issuerId"            TEXT NOT NULL,
  "issuerName"          TEXT NOT NULL,
  "credentialType"      TEXT NOT NULL,
  "schema"              TEXT NOT NULL DEFAULT 'https://www.w3.org/2018/credentials/v1',
  "payload"             JSONB NOT NULL,
  "sourceType"          TEXT NOT NULL,
  "sourceId"            TEXT NOT NULL,
  "proofType"           TEXT,
  "proofCreated"        TIMESTAMP(3),
  "proofValue"          TEXT,
  "verificationMethod"  TEXT,
  "status"              "VCStatus" NOT NULL DEFAULT 'ISSUED',
  "revokedAt"           TIMESTAMP(3),
  "revokedReason"       TEXT,
  "shareToken"          TEXT UNIQUE,
  "viewCount"           INTEGER NOT NULL DEFAULT 0,
  "issuedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt"           TIMESTAMP(3),
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "VerifiableCredential_subjectId_idx"            ON "VerifiableCredential"("subjectId");
CREATE INDEX IF NOT EXISTS "VerifiableCredential_issuerId_idx"             ON "VerifiableCredential"("issuerId");
CREATE INDEX IF NOT EXISTS "VerifiableCredential_sourceType_sourceId_idx"  ON "VerifiableCredential"("sourceType", "sourceId");
CREATE INDEX IF NOT EXISTS "VerifiableCredential_shareToken_idx"           ON "VerifiableCredential"("shareToken");

-- ============================================
-- P6 — CompanyProfile + CompanyFollow
-- ============================================
CREATE TABLE IF NOT EXISTS "CompanyProfile" (
  "id"              TEXT PRIMARY KEY,
  "companyName"     TEXT NOT NULL UNIQUE,
  "slug"            TEXT NOT NULL UNIQUE,
  "logoUrl"         TEXT,
  "coverUrl"        TEXT,
  "tagline"         TEXT,
  "description"     TEXT,
  "foundedYear"     INTEGER,
  "headquarters"    TEXT,
  "industries"      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "sizeCategory"    TEXT,
  "websiteUrl"      TEXT,
  "linkedinUrl"     TEXT,
  "mission"         TEXT,
  "vision"          TEXT,
  "values"          JSONB,
  "cultureTags"     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "countries"       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "officeLocations" JSONB,
  "heroVideoUrl"    TEXT,
  "gallery"         JSONB,
  "faqs"            JSONB,
  "claimedBy"       TEXT,
  "claimedAt"       TIMESTAMP(3),
  "verified"        BOOLEAN NOT NULL DEFAULT FALSE,
  "followerCount"   INTEGER NOT NULL DEFAULT 0,
  "published"       BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "CompanyProfile_slug_idx"      ON "CompanyProfile"("slug");
CREATE INDEX IF NOT EXISTS "CompanyProfile_verified_idx"  ON "CompanyProfile"("verified");
CREATE INDEX IF NOT EXISTS "CompanyProfile_published_idx" ON "CompanyProfile"("published");

CREATE TABLE IF NOT EXISTS "CompanyFollow" (
  "id"               TEXT PRIMARY KEY,
  "companyProfileId" TEXT NOT NULL REFERENCES "CompanyProfile"("id") ON DELETE CASCADE,
  "userId"           TEXT NOT NULL,
  "followedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("companyProfileId", "userId")
);

CREATE INDEX IF NOT EXISTS "CompanyFollow_userId_idx" ON "CompanyFollow"("userId");

-- ============================================
-- P7 — SelfDiscoveryProfile
-- ============================================
CREATE TABLE IF NOT EXISTS "SelfDiscoveryProfile" (
  "id"                   TEXT PRIMARY KEY,
  "studentId"            TEXT NOT NULL UNIQUE,
  "coreValues"           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "valueRankings"        JSONB,
  "strengths"            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "strengthStories"      JSONB,
  "energizingActivities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "drainingActivities"   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "projectTags"          JSONB,
  "motivations"          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "dealbreakers"         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "idealDayNarrative"    TEXT,
  "fiveYearNarrative"    TEXT,
  "selfAssessedSkills"   JSONB,
  "discoveryInsights"    JSONB,
  "insightsAcknowledged" BOOLEAN NOT NULL DEFAULT FALSE,
  "stepsCompleted"       INTEGER NOT NULL DEFAULT 0,
  "completedAt"          TIMESTAMP(3),
  "lastRegeneratedAt"    TIMESTAMP(3),
  "regenerationCount"    INTEGER NOT NULL DEFAULT 0,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "SelfDiscoveryProfile_studentId_idx" ON "SelfDiscoveryProfile"("studentId");
