-- TrackingEvent — behavior analytics (page views + clicks).
-- Separate from AuditLog so audit feed stays compliance-clean while
-- behavior data lives in a high-volume optimized table.
-- Safe to re-run.

CREATE TABLE IF NOT EXISTS "TrackingEvent" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT,
  "sessionId" TEXT NOT NULL,
  "type"      TEXT NOT NULL,            -- 'page_view' | 'click'
  "pagePath"  TEXT NOT NULL,
  "selector"  TEXT,
  "text"      TEXT,
  "x"         INTEGER,
  "y"         INTEGER,
  "vw"        INTEGER,
  "vh"        INTEGER,
  "referrer"  TEXT,
  "userAgent" TEXT,
  "ip"        TEXT,
  "locale"    TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TrackingEvent_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "TrackingEvent_pagePath_type_createdAt_idx"
  ON "TrackingEvent"("pagePath", "type", "createdAt");
CREATE INDEX IF NOT EXISTS "TrackingEvent_userId_createdAt_idx"
  ON "TrackingEvent"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "TrackingEvent_sessionId_idx"
  ON "TrackingEvent"("sessionId");
CREATE INDEX IF NOT EXISTS "TrackingEvent_createdAt_idx"
  ON "TrackingEvent"("createdAt");
