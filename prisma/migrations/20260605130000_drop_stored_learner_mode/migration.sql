UPDATE "ClassEnrollment"
SET
  "status" = 'graduated',
  "statusChangedAt" = COALESCE("statusChangedAt", NOW()),
  "statusNote" = COALESCE("statusNote", 'Moved to independent learner mode before learnerMode consolidation')
WHERE "status" = 'active'
  AND "studentId" IN (
    SELECT "userId"
    FROM "UserPreferences"
    WHERE "learnerMode" = 'independent'
  );

DROP INDEX IF EXISTS "UserPreferences_learnerMode_idx";

ALTER TABLE "UserPreferences"
DROP COLUMN IF EXISTS "learnerMode";

ALTER TABLE "User"
DROP COLUMN IF EXISTS "learnerMode";
