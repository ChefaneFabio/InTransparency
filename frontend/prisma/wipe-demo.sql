-- ============================================================================
-- wipe-demo.sql
-- ----------------------------------------------------------------------------
-- Removes every demo record (User.isDemo = true, Institution.isDemo = true)
-- and everything they own. Designed for the one-time cleanup of a freshly
-- created Neon `production` branch so real users land in an empty DB while
-- the `main` branch keeps demo data for screenshots and previews.
--
-- Usage:
--   psql "<production-direct-connection-string>" -f prisma/wipe-demo.sql
--
-- The script wraps everything in a single transaction. If the verification
-- counts at the end look wrong, abort with ROLLBACK; nothing is persisted
-- until COMMIT.
--
-- Idempotent — running it on an already-clean DB is a no-op.
-- ============================================================================

BEGIN;

-- Snapshot before deletion (visible in psql output).
SELECT COUNT(*) AS demo_users_before        FROM "User"        WHERE "isDemo" = true;
SELECT COUNT(*) AS demo_institutions_before FROM "Institution" WHERE "isDemo" = true;

-- Placement.institutionId and Job.institutionId are nullable foreign keys
-- with no CASCADE rule (default NoAction). We delete demo-tied placements
-- and jobs up front so the User / Institution deletes don't trip an FK
-- violation.
DELETE FROM "Placement"
 WHERE "studentId"     IN (SELECT "id" FROM "User"        WHERE "isDemo" = true)
    OR "institutionId" IN (SELECT "id" FROM "Institution" WHERE "isDemo" = true);

DELETE FROM "Job"
 WHERE "recruiterId"   IN (SELECT "id" FROM "User"        WHERE "isDemo" = true)
    OR "institutionId" IN (SELECT "id" FROM "Institution" WHERE "isDemo" = true);

-- User and Institution have onDelete: Cascade on every child relation
-- (projects, certifications, affiliations, staff, evaluations, hours logs,
-- access grants, notifications, etc.), so these two deletes drag the rest
-- of the demo graph with them.
DELETE FROM "User"        WHERE "isDemo" = true;
DELETE FROM "Institution" WHERE "isDemo" = true;

-- Post-deletion verification.
SELECT COUNT(*) AS demo_users_remaining        FROM "User"        WHERE "isDemo" = true;
SELECT COUNT(*) AS demo_institutions_remaining FROM "Institution" WHERE "isDemo" = true;
SELECT COUNT(*) AS total_users                 FROM "User";
SELECT COUNT(*) AS total_institutions          FROM "Institution";

-- If the four numbers above look right (zeros for "remaining", real-only
-- counts for "total"), commit. Otherwise replace with `ROLLBACK;`.
COMMIT;
