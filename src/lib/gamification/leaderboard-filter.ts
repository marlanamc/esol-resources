import type { Prisma } from "@prisma/client";

export const EXCLUDED_LEADERBOARD_USERNAMES = ["marlie", "daniel", "leah"];

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
