-- Add value column to TrackingEvent for numeric event payloads
-- (scroll depth thresholds, etc.). Safe to re-run.

ALTER TABLE "TrackingEvent"
  ADD COLUMN IF NOT EXISTS "value" INTEGER;
