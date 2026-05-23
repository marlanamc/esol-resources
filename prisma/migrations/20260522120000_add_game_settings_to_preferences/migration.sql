-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN "gameSettings" JSONB NOT NULL DEFAULT '{}'::jsonb;
