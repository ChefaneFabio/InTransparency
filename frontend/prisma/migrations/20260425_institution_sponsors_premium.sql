-- Institution-sponsored Student Premium. When sponsorsPremium=true, every
-- student affiliated with the institution gets Premium features unlocked
-- without a personal subscription. Sold as an optional add-on.

ALTER TABLE "Institution"
  ADD COLUMN IF NOT EXISTS "sponsorsPremium" BOOLEAN NOT NULL DEFAULT false;
