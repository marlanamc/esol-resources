-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN "weeklyActivityGoal" INTEGER NOT NULL DEFAULT 3;
ALTER TABLE "UserPreferences" ADD COLUMN "weeklyGoalStartDay" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "UserPreferences" ADD COLUMN "skillFocus" TEXT[] DEFAULT ARRAY[]::TEXT[];
