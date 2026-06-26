// Gamification domain barrel exports

// Main gamification functions
export {
  trackLogin,
  awardPoints,
  updateStreak,
  checkAndAwardAchievements,
  invalidateAchievementDefinitions,
  getUserGamificationStats,
  getTimeframedLeaderboard,
  getWeeklyLeaderboard,
  resetWeeklyPoints,
  calculateQuizPoints,
  POINTS,
  getActivityPoints,
  resolveActivityGameUi,
  getExcludedLeaderboardUsernames,
  parseExcludedLeaderboardUsernames,
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

// Calendar week (Monday–Sunday)
export {
  CALENDAR_WEEK_DAY_LABELS,
  getCalendarWeekStart,
  getCalendarWeekTodayIndex,
  getCalendarWeekDayLabel,
  buildCalendarWeekActivity,
  getLearnerDayKey,
} from "./calendar-week";

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
