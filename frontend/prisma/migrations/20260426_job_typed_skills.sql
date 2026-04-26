-- Typed skill buckets on Job. Recruiters had been seeing a flat
-- "Competenze richieste" dump that mixed hard skills (Rust, Linux),
-- languages (German), and soft skills (communication) into one list.
-- The AI extractor now categorizes; these columns store the result.
--
-- requiredSkills/preferredSkills stay populated as the union of all four
-- buckets for back-compat with existing search and agents code.
--
-- Additive, idempotent.

ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "hardSkills"      TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "softSkills"      TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "designSkills"    TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "domainKnowledge" TEXT[] DEFAULT ARRAY[]::TEXT[];
