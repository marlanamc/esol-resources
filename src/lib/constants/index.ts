/**
 * Application-wide constants
 * Centralizes magic values for maintainability and consistency
 * @module constants
 */

/**
 * Session configuration
 */
export const SESSION = {
  /** Mobile session duration in days */
  MOBILE_DAYS: 30,
  /** Desktop session duration in hours */
  DESKTOP_HOURS: 12,
} as const;

/**
 * Leaderboard configuration
 */
export const LEADERBOARD = {
  /** Default number of entries to show */
  DEFAULT_LIMIT: 10,
  /** Maximum entries allowed */
  MAX_LIMIT: 100,
  /** Minimum entries allowed */
  MIN_LIMIT: 1,
  /** Weekly leaderboard default limit */
  WEEKLY_DEFAULT_LIMIT: 20,
} as const;

/**
 * Search configuration
 */
export const SEARCH = {
  /** Quick open search result limit */
  QUICK_OPEN_LIMIT: 8,
  /** Full search result limit */
  FULL_SEARCH_LIMIT: 24,
} as const;

/**
 * Activity timeline configuration
 */
export const TIMELINE = {
  /** Default number of activities to show */
  DEFAULT_LIMIT: 10,
} as const;

/**
 * Verb forms game configuration
 */
export const VERB_FORMS_GAME = {
  /** Default question limit */
  DEFAULT_LIMIT: 10,
  /** Minimum questions with multiple forms selected */
  MIN_MULTI_FORM: 4,
  /** Base limit for difficulty reduction */
  MULTI_FORM_BASE: 12,
  /** Reduction per additional form */
  MULTI_FORM_REDUCTION: 2,
} as const;

/**
 * Clamp a leaderboard limit to valid range
 */
export function clampLeaderboardLimit(limit: number): number {
  return Math.min(Math.max(LEADERBOARD.MIN_LIMIT, Math.floor(limit)), LEADERBOARD.MAX_LIMIT);
}
