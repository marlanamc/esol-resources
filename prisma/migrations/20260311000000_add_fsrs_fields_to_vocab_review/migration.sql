-- Migration: Add FSRS fields to UserVocabReviewState
-- Created: 2026-03-11

-- Add new columns to UserVocabReviewState table
ALTER TABLE "UserVocabReviewState" 
ADD COLUMN "easeFactor" REAL NOT NULL DEFAULT 2.5,
ADD COLUMN "difficulty" REAL NOT NULL DEFAULT 0.0,
ADD COLUMN "stability" REAL NOT NULL DEFAULT 0.0,
ADD COLUMN "lastInterval" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "performanceHistory" DOUBLE PRECISION[] NOT NULL DEFAULT '{}';

-- Create index for difficulty-based queries
CREATE INDEX "UserVocabReviewState_userId_difficulty_idx" ON "UserVocabReviewState"("userId", "difficulty");

-- Add comments for documentation
COMMENT ON COLUMN "UserVocabReviewState"."easeFactor" IS 'FSRS ease factor (1.3-5.0) for interval calculation';
COMMENT ON COLUMN "UserVocabReviewState"."difficulty" IS 'Card difficulty (0.0-1.0) based on performance';
COMMENT ON COLUMN "UserVocabReviewState"."stability" IS 'Memory stability (0.0+) for retention modeling';
COMMENT ON COLUMN "UserVocabReviewState"."lastInterval" IS 'Last interval in days used for scheduling';
COMMENT ON COLUMN "UserVocabReviewState"."performanceHistory" IS 'Array of last 10 performance scores (0.0-1.0)';
