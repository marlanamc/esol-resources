import { PrismaClient } from "@prisma/client";
import { applyFSRSRating } from "@/lib/fsrs-algorithm";

const prisma = new PrismaClient();

async function migrateToFSRS() {
  console.log("Starting migration to FSRS algorithm...");
  
  // Get all existing vocab review states
  const states = await prisma.userVocabReviewState.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      vocabCard: {
        select: {
          id: true,
          term: true,
        },
      },
    },
  });

  console.log(`Found ${states.length} vocab review states to migrate`);

  let migrated = 0;
  let skipped = 0;

  for (const state of states) {
    try {
      // Skip if already migrated (has FSRS fields)
      if (state.easeFactor !== null && state.difficulty !== null) {
        skipped++;
        continue;
      }

      // Calculate initial FSRS values based on existing data
      let initialState = null;
      
      if (state.lastRating) {
        // Apply the last rating to establish initial FSRS state
        const rating = state.lastRating as "again" | "hard" | "good" | "easy";
        initialState = applyFSRSRating(
          {
            step: state.step,
            totalReviews: state.totalReviews,
            lapses: state.lapses,
          },
          rating,
          state.lastReviewedAt || new Date()
        );
      }

      // Update the state with FSRS values
      await prisma.userVocabReviewState.update({
        where: {
          id: state.id,
        },
        data: {
          easeFactor: initialState?.easeFactor ?? 2.5,
          difficulty: initialState?.difficulty ?? 0.0,
          stability: initialState?.stability ?? 0.0,
          lastInterval: initialState?.lastInterval ?? 0,
          performanceHistory: initialState?.performanceHistory ?? [],
        },
      });

      migrated++;
      
      if (migrated % 100 === 0) {
        console.log(`Migrated ${migrated} states...`);
      }
    } catch (error) {
      console.error(`Failed to migrate state for user ${state.user.username}, card ${state.vocabCard.term}:`, error);
    }
  }

  console.log(`Migration complete!`);
  console.log(`- Migrated: ${migrated} states`);
  console.log(`- Skipped: ${skipped} states (already had FSRS fields)`);
}

async function createDatabaseMigration() {
  console.log("Creating database migration file...");
  
  const migrationName = "add_fsrs_fields_to_vocab_review";
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '');
  
  const migrationSQL = `
-- Migration: Add FSRS fields to UserVocabReviewState
-- Created: ${new Date().toISOString()}

-- Add new columns to UserVocabReviewState table
ALTER TABLE "UserVocabReviewState" 
ADD COLUMN "easeFactor" REAL NOT NULL DEFAULT 2.5,
ADD COLUMN "difficulty" REAL NOT NULL DEFAULT 0.0,
ADD COLUMN "stability" REAL NOT NULL DEFAULT 0.0,
ADD COLUMN "lastInterval" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "performanceHistory" TEXT[] NOT NULL DEFAULT '{}';

-- Create index for difficulty-based queries
CREATE INDEX "UserVocabReviewState_userId_difficulty_idx" ON "UserVocabReviewState"("userId", "difficulty");

-- Add comments for documentation
COMMENT ON COLUMN "UserVocabReviewState"."easeFactor" IS 'FSRS ease factor (1.3-5.0) for interval calculation';
COMMENT ON COLUMN "UserVocabReviewState"."difficulty" IS 'Card difficulty (0.0-1.0) based on performance';
COMMENT ON COLUMN "UserVocabReviewState"."stability" IS 'Memory stability (0.0+) for retention modeling';
COMMENT ON COLUMN "UserVocabReviewState"."lastInterval" IS 'Last interval in days used for scheduling';
COMMENT ON COLUMN "UserVocabReviewState"."performanceHistory" IS 'Array of last 10 performance scores (0.0-1.0)';
`;

  console.log("Migration SQL generated:");
  console.log(migrationSQL);
  
  return migrationSQL;
}

async function main() {
  try {
    // First create the migration file content
    await createDatabaseMigration();
    
    // Then run the data migration
    await migrateToFSRS();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { migrateToFSRS, createDatabaseMigration };
