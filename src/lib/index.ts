/**
 * @fileoverview Main library barrel export
 *
 * This file documents the organized structure of src/lib/
 * Domain-specific imports are recommended over importing from here.
 *
 * DOMAIN ORGANIZATION:
 *
 * - @/lib/auth         - Authentication, authorization, policies
 * - @/lib/api          - API response helpers, schemas, rate limiting
 * - @/lib/database     - Prisma client, retry logic, database locks
 * - @/lib/gamification - Points, streaks, achievements, leaderboards
 * - @/lib/vocab        - Vocabulary parsing, review system, FSRS
 * - @/lib/verbs        - Verb definitions, irregular/gerund progress
 * - @/lib/learner      - Learner navigation, theme, search, visibility
 * - @/lib/shared       - Logger, env, validators, audit log
 *
 * BACKWARD COMPATIBILITY:
 *
 * All previous import paths continue to work via re-export files.
 * For example: import { authOptions } from "@/lib/auth" still works.
 */

// Re-export commonly used items for convenience
// Prefer importing from specific domains for better tree-shaking

export { authOptions } from "./auth";
export { prisma } from "./prisma";
export { logger } from "./logger";
export { POINTS, awardPoints, updateStreak } from "./gamification";
