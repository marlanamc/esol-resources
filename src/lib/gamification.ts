// Backward-compatible wrapper.
// Canonical implementation lives in ./gamification/*.
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
  getExcludedLeaderboardUsernames,
  parseExcludedLeaderboardUsernames,
  type LeaderboardRange,
} from "./gamification/gamification";
