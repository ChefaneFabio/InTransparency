-- 2026-04-22: premium-gating landed; upgrade all currently-seeded demo
-- institutions to PREMIUM so the workspace (M1-M4) works end-to-end
-- without friction. Production institutions should be CORE by default.
-- This migration is a no-op in prod — it only matches institutions
-- created from the UniversitySettings backfill in bc9d4ea.
UPDATE "Institution"
SET "plan" = 'PREMIUM',
    "mediationEnabled" = TRUE,
    "requireOfferApproval" = TRUE
WHERE "id" IN (SELECT "id" FROM "UniversitySettings")
  AND "plan" = 'CORE';
