-- Keep the existing Submission as the best-score summary. Historical results
-- are copied into QuizAttempt on the first retake, before any summary update.
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "score" INTEGER,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "QuizAttempt_submissionId_idempotencyKey_key" ON "QuizAttempt"("submissionId", "idempotencyKey");
CREATE INDEX "QuizAttempt_submissionId_completedAt_idx" ON "QuizAttempt"("submissionId", "completedAt");
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
