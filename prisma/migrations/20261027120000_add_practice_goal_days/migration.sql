-- Practice log goal: days a week each learner wants to practice. Existing users get the default of 3.
-- AlterTable
ALTER TABLE "User" ADD COLUMN "practiceGoalDays" INTEGER NOT NULL DEFAULT 3;
