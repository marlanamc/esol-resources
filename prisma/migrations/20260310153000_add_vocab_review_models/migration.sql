-- CreateTable
CREATE TABLE "VocabCard" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "normalizedTerm" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "example" TEXT,
    "audioPath" TEXT,
    "sourceKeys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "sourceLabels" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "unitNumbers" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
    "topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVocabReviewState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabCardId" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "lastReviewedAt" TIMESTAMP(3),
    "lastRating" TEXT,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVocabReviewState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VocabCard_normalizedTerm_key" ON "VocabCard"("normalizedTerm");

-- CreateIndex
CREATE INDEX "VocabCard_sortOrder_idx" ON "VocabCard"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "UserVocabReviewState_userId_vocabCardId_key" ON "UserVocabReviewState"("userId", "vocabCardId");

-- CreateIndex
CREATE INDEX "UserVocabReviewState_userId_dueAt_idx" ON "UserVocabReviewState"("userId", "dueAt");

-- CreateIndex
CREATE INDEX "UserVocabReviewState_userId_updatedAt_idx" ON "UserVocabReviewState"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "UserVocabReviewState" ADD CONSTRAINT "UserVocabReviewState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVocabReviewState" ADD CONSTRAINT "UserVocabReviewState_vocabCardId_fkey" FOREIGN KEY ("vocabCardId") REFERENCES "VocabCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
