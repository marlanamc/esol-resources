import type { Prisma } from "@prisma/client";

/**
 * Usernames to exclude from leaderboard rankings (test accounts, admins, etc.)
 * Configure via EXCLUDED_LEADERBOARD_USERNAMES env var (comma-separated)
 * Falls back to empty array if not set
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
    username: { notIn: EXCLUDED_LEADERBOARD_USERNAMES },
    ...(extraWhere || {}),
  };
}

export function isLeaderboardExcludedUser(user: {
  username: string;
  isSystemAccount: boolean;
}) {
  return user.isSystemAccount || EXCLUDED_LEADERBOARD_USERNAMES.includes(user.username);
}
