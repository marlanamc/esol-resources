ALTER TABLE "UserPreferences"
ADD COLUMN "learnerMode" TEXT NOT NULL DEFAULT 'classroom';

CREATE INDEX "UserPreferences_learnerMode_idx" ON "UserPreferences"("learnerMode");
