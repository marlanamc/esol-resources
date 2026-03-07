-- Add isReleased column for grammar guide release workflow
ALTER TABLE "Activity"
ADD COLUMN IF NOT EXISTS "isReleased" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex (only if not exists - Prisma may have created these)
CREATE INDEX IF NOT EXISTS "Activity_isReleased_idx" ON "Activity"("isReleased");
CREATE INDEX IF NOT EXISTS "Activity_type_category_isReleased_idx" ON "Activity"("type", "category", "isReleased");
