-- Link Subscription rows to Institution for revenue analytics on
-- Institutional Premium (€39/mo · €390/yr). userId continues to point at
-- the human who clicked checkout (the primary admin); institutionId names
-- the org being billed. Filtering Subscription WHERE institutionId IS NOT NULL
-- isolates institutional revenue from per-user revenue.
--
-- Additive, idempotent.

ALTER TABLE "Subscription"
  ADD COLUMN IF NOT EXISTS "institutionId" TEXT;

CREATE INDEX IF NOT EXISTS "Subscription_institutionId_idx"
  ON "Subscription" ("institutionId");
