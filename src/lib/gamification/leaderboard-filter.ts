import type { Prisma } from "@prisma/client";
import { buildIndependentLearnerWhere } from "@/lib/learner-mode";

/**
 * Usernames to exclude from leaderboard rankings (test accounts, admins, etc.)
 * Configure via EXCLUDED_LEADERBOARD_USERNAMES env var (comma-separated)
 * Falls back to an empty array if not set.
 *
 * Note: The excludeFromLeaderboard field on User model takes precedence.
 * This env var list is kept for backward compatibility.
 */
export function parseExcludedLeaderboardUsernames(rawValue?: string): string[] {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((username) => username.trim().toLowerCase())
    .filter(Boolean);
}

export function getExcludedLeaderboardUsernames(): string[] {
  return parseExcludedLeaderboardUsernames(process.env.EXCLUDED_LEADERBOARD_USERNAMES);
}

export function buildLeaderboardEligibleUserWhere(
  extraWhere?: Prisma.UserWhereInput
): Prisma.UserWhereInput {
  const excludedUsernames = getExcludedLeaderboardUsernames();

  return {
    role: "student",
    isSystemAccount: false,
    excludeFromLeaderboard: false,
    username: { notIn: excludedUsernames },
    ...(extraWhere || {}),
  };
}

export function isLeaderboardExcludedUser(
  user: {
    username: string;
    isSystemAccount: boolean;
    excludeFromLeaderboard?: boolean;
  },
  excludedUsernames = getExcludedLeaderboardUsernames()
) {
  return (
    user.isSystemAccount ||
    user.excludeFromLeaderboard === true ||
    excludedUsernames.includes(user.username.toLowerCase())
  );
}

export function buildIndependentLeaderboardUserWhere(): Prisma.UserWhereInput {
  return buildLeaderboardEligibleUserWhere(buildIndependentLearnerWhere());
}
