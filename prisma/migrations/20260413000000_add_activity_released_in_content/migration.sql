ALTER TABLE "Activity"
ADD COLUMN "isReleasedInContent" BOOLEAN;

CREATE INDEX "Activity_isReleasedInContent_idx"
ON "Activity" ("isReleasedInContent");
