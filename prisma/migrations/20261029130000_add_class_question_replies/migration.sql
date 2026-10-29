-- Teacher replies on class questions, and when the learner saw the answer. Nullable columns only.
-- AlterTable
ALTER TABLE "ClassQuestion" ADD COLUMN "replyText" TEXT,
ADD COLUMN "answerSeenAt" TIMESTAMP(3);
