-- Activity fields that landed in schema via db push without a CREATE/ALTER
-- migration. Required for CI seed (prisma.activity.findUnique) on fresh DBs.

-- AlterTable
ALTER TABLE "Activity"
ADD COLUMN IF NOT EXISTS "isFeaturedForIndependent" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Activity"
ADD COLUMN IF NOT EXISTS "contentKind" TEXT NOT NULL DEFAULT 'practice';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Activity_contentKind_idx" ON "Activity"("contentKind");
CREATE INDEX IF NOT EXISTS "Activity_isFeaturedForIndependent_idx" ON "Activity"("isFeaturedForIndependent");
