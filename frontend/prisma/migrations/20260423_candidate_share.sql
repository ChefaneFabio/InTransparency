-- Signed share links for candidate profiles — recruiter shares one candidate
-- with a hiring manager who has no account.

CREATE TABLE IF NOT EXISTS "CandidateShare" (
  "id"             TEXT            PRIMARY KEY,
  "token"          VARCHAR(64)     NOT NULL UNIQUE,
  "candidateId"    TEXT            NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "sharedByUserId" TEXT            NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "note"           TEXT,
  "recipientEmail" TEXT,
  "expiresAt"      TIMESTAMP(3)    NOT NULL,
  "revokedAt"      TIMESTAMP(3),
  "firstViewedAt"  TIMESTAMP(3),
  "lastViewedAt"   TIMESTAMP(3),
  "viewCount"      INTEGER         NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "CandidateShare_token_idx"
  ON "CandidateShare"("token");
CREATE INDEX IF NOT EXISTS "CandidateShare_sharedByUserId_createdAt_idx"
  ON "CandidateShare"("sharedByUserId", "createdAt");
CREATE INDEX IF NOT EXISTS "CandidateShare_candidateId_idx"
  ON "CandidateShare"("candidateId");
CREATE INDEX IF NOT EXISTS "CandidateShare_expiresAt_idx"
  ON "CandidateShare"("expiresAt");
