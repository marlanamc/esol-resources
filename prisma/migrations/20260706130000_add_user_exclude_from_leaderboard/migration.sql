-- User.excludeFromLeaderboard was added in schema without a migration.
-- Required for CI seed (prisma.user.upsert) on fresh databases.

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "excludeFromLeaderboard" BOOLEAN NOT NULL DEFAULT false;
