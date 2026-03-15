// Re-export from new location for backward compatibility
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
} from "./gamification/gamification";
