-- ============================================================================
-- wipe-demo.sql
-- ----------------------------------------------------------------------------
-- Removes every demo record (User.isDemo = true, Institution.isDemo = true)
-- and everything they own. Designed for the one-time cleanup of a freshly
-- created Neon `prod-clean` branch so real users land in an empty DB while
-- the parent `production` branch keeps demo data for screenshots and previews.
--
-- Usage:
--   psql "<branch-direct-or-pooled-connection-string>" -f prisma/wipe-demo.sql
--
-- The script wraps everything in a single transaction. If the verification
-- counts at the end look wrong, abort with ROLLBACK; nothing is persisted
-- until COMMIT.
--
-- Idempotent — running it on an already-clean DB is a no-op.
-- ============================================================================

\set ON_ERROR_STOP on
BEGIN;

-- Snapshot before deletion (visible in psql output).
SELECT COUNT(*) AS demo_users_before        FROM "User"        WHERE "isDemo";
SELECT COUNT(*) AS demo_institutions_before FROM "Institution" WHERE "isDemo";

-- ---------------------------------------------------------------------------
-- Stage 1: Tables with onDelete: RESTRICT pointing at User.
-- These block the User delete unless cleared first. Each holds rows authored
-- by demo users; wiping those rows is correct since the author is going away.
-- ---------------------------------------------------------------------------
DELETE FROM "MediationMessage"     WHERE "authorUserId"      IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "MediationStaffNote"   WHERE "staffId"           IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "MediationThread"      WHERE "companyUserId"     IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "CompanyDocument"      WHERE "uploadedBy"        IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "UniversityDocument"   WHERE "uploadedBy"        IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "Organization"         WHERE "ownerId"           IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "PipelineActivity"     WHERE "staffId"           IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "PlacementEvaluation"  WHERE "submittedByUserId" IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "PlacementHoursLog"    WHERE "loggedByUserId"    IN (SELECT id FROM "User" WHERE "isDemo");
DELETE FROM "StageTransition"      WHERE "staffId"           IN (SELECT id FROM "User" WHERE "isDemo");

-- ---------------------------------------------------------------------------
-- Stage 2: Placement.institutionId and Job.institutionId are nullable foreign
-- keys with no CASCADE rule (default NoAction). Delete demo-tied rows up front
-- so the User / Institution deletes don't trip an FK violation.
-- ---------------------------------------------------------------------------
DELETE FROM "Placement"
 WHERE "studentId"     IN (SELECT id FROM "User"        WHERE "isDemo")
    OR "institutionId" IN (SELECT id FROM "Institution" WHERE "isDemo");

DELETE FROM "Job"
 WHERE "recruiterId"   IN (SELECT id FROM "User"        WHERE "isDemo")
    OR "institutionId" IN (SELECT id FROM "Institution" WHERE "isDemo");

-- ---------------------------------------------------------------------------
-- Stage 3: User and Institution have onDelete: Cascade on every remaining
-- child relation (projects, certifications, affiliations, staff, hours logs,
-- access grants, notifications, etc.), so these two deletes drag the rest of
-- the demo graph with them.
-- ---------------------------------------------------------------------------
DELETE FROM "User"        WHERE "isDemo";
DELETE FROM "Institution" WHERE "isDemo";

-- Post-deletion verification.
SELECT COUNT(*) AS demo_users_remaining        FROM "User"        WHERE "isDemo";
SELECT COUNT(*) AS demo_institutions_remaining FROM "Institution" WHERE "isDemo";
SELECT COUNT(*) AS total_users                 FROM "User";
SELECT COUNT(*) AS total_institutions          FROM "Institution";

-- If the four numbers above look right (zeros for "remaining", real-only
-- counts for "total"), commit. Otherwise replace with `ROLLBACK;`.
COMMIT;
