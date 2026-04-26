-- Institutional Premium subscription state on Institution. Populated by
-- /api/checkout/institutional-premium and the Stripe webhook handler.
-- Institution.plan flips to PREMIUM on checkout.session.completed (with
-- type=institutional_premium) and back to CORE on subscription.deleted.
--
-- All columns are nullable with safe defaults — additive, no data loss.

ALTER TABLE "Institution"
  ADD COLUMN IF NOT EXISTS "stripeCustomerId"     TEXT,
  ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT,
  ADD COLUMN IF NOT EXISTS "subscriptionStatus"   "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
  ADD COLUMN IF NOT EXISTS "premiumUntil"         TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "Institution_stripeCustomerId_key"
  ON "Institution" ("stripeCustomerId");

CREATE UNIQUE INDEX IF NOT EXISTS "Institution_stripeSubscriptionId_key"
  ON "Institution" ("stripeSubscriptionId");

CREATE INDEX IF NOT EXISTS "Institution_stripeSubscriptionId_idx"
  ON "Institution" ("stripeSubscriptionId");
