import type { Prisma } from "@prisma/client";
import { buildIndependentLearnerWhere } from "@/lib/learner-mode";

/**
 * Usernames to exclude from leaderboard rankings (test accounts, admins, etc.)
 * Configure via EXCLUDED_LEADERBOARD_USERNAMES env var (comma-separated)
 * Falls back to empty array if not set
 *
 * Note: The excludeFromLeaderboard field on User model takes precedence.
 * This env var list is kept for backward compatibility.
 */
export const EXCLUDED_LEADERBOARD_USERNAMES: string[] = process.env.EXCLUDED_LEADERBOARD_USERNAMES
  ? process.env.EXCLUDED_LEADERBOARD_USERNAMES.split(",").map((u) => u.trim().toLowerCase())
  : [];

export function buildLeaderboardEligibleUserWhere(
  extraWhere?: Prisma.UserWhereInput
): Prisma.UserWhereInput {
  return {
    role: "student",
    isSystemAccount: false,
    excludeFromLeaderboard: false,
    username: { notIn: EXCLUDED_LEADERBOARD_USERNAMES },
    ...(extraWhere || {}),
  };
}

export function isLeaderboardExcludedUser(user: {
  username: string;
  isSystemAccount: boolean;
  excludeFromLeaderboard?: boolean;
}) {
  return (
    user.isSystemAccount ||
    user.excludeFromLeaderboard === true ||
    EXCLUDED_LEADERBOARD_USERNAMES.includes(user.username.toLowerCase())
  );
}

export function buildIndependentLeaderboardUserWhere(): Prisma.UserWhereInput {
  return buildLeaderboardEligibleUserWhere(buildIndependentLearnerWhere());
}
