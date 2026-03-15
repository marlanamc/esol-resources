// Gamification domain barrel exports

// Main gamification functions
export {
  trackLogin,
  awardPoints,
  updateStreak,
  checkAndAwardAchievements,
  getUserGamificationStats,
  getTimeframedLeaderboard,
  getWeeklyLeaderboard,
  resetWeeklyPoints,
  calculateQuizPoints,
  POINTS,
  getActivityPoints,
  resolveActivityGameUi,
  EXCLUDED_LEADERBOARD_USERNAMES,
  type LeaderboardRange,
} from "./gamification";

// Award chain helper
export {
  applyAwardChain,
  type AwardChainResult,
} from "./award-chain";

// Constants
export { POINTS as GAMIFICATION_POINTS } from "./constants";

// Streak utilities
export {
  shouldAwardStreak,
  getEffectiveStreak,
  getNextStreakState,
} from "./streak-utils";

// Activity points
export {
  getActivityPoints as getActivityPointsValue,
  resolveActivityGameUi as resolveGameUi,
  type GameUi,
} from "./activity-points";

// Grammar points
export { determineGrammarCompletionPoints } from "./grammar-points";

// Leaderboard filter
export {
  buildLeaderboardEligibleUserWhere,
  isLeaderboardExcludedUser,
} from "./leaderboard-filter";
