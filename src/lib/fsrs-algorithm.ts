import type { VocabReviewRating } from "@/types/vocab-review";

// FSRS-inspired constants
const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 5.0;
const INITIAL_EASE_FACTOR = 2.5;
const INITIAL_DIFFICULTY = 0.0;
const INITIAL_STABILITY = 0.0;

// Performance weights for recent vs older reviews
const RECENT_WEIGHT = 0.7;
const HISTORICAL_WEIGHT = 0.3;

// Rating to performance score mapping
const RATING_PERFORMANCE = {
  again: 0.0,
  hard: 0.5,
  good: 0.8,
  easy: 1.0,
} as const;

// Base intervals for different steps (in days)
const BASE_INTERVALS = [1, 3, 7, 14, 30, 60, 120];

export interface FSRSState {
  easeFactor: number;
  difficulty: number;
  stability: number;
  lastInterval: number;
  performanceHistory: number[];
}

export interface FSRSResult {
  step: number;
  dueAt: Date;
  easeFactor: number;
  difficulty: number;
  stability: number;
  lastInterval: number;
  totalReviews: number;
  lapses: number;
  lastRating: VocabReviewRating;
  lastReviewedAt: Date;
  shouldRepeatInSession: boolean;
  performanceHistory: number[];
}

/**
 * Calculate weighted performance score from history
 */
function calculateWeightedPerformance(history: number[]): number {
  if (history.length === 0) return 0.5;
  
  const recentReviews = history.slice(-3); // Last 3 reviews
  const olderReviews = history.slice(0, -3);
  
  const recentAvg = recentReviews.length > 0 
    ? recentReviews.reduce((sum, score) => sum + score, 0) / recentReviews.length 
    : 0.5;
  
  const olderAvg = olderReviews.length > 0
    ? olderReviews.reduce((sum, score) => sum + score, 0) / olderReviews.length
    : 0.5;
  
  return (recentAvg * RECENT_WEIGHT) + (olderAvg * HISTORICAL_WEIGHT);
}

/**
 * Update difficulty based on performance
 */
function updateDifficulty(currentDifficulty: number, performance: number): number {
  // Difficulty moves toward performance value with damping
  const targetDifficulty = performance;
  const dampingFactor = 0.3;
  return currentDifficulty + (targetDifficulty - currentDifficulty) * dampingFactor;
}

/**
 * Update ease factor based on performance and current ease
 */
function updateEaseFactor(currentEaseFactor: number, performance: number, difficulty: number): number {
  let newEaseFactor = currentEaseFactor;
  
  if (performance === 0) { // "again" rating
    newEaseFactor = Math.max(MIN_EASE_FACTOR, currentEaseFactor - 0.2);
  } else if (performance <= 0.5) { // "hard" rating
    newEaseFactor = Math.max(MIN_EASE_FACTOR, currentEaseFactor - 0.15);
  } else if (performance >= 1.0) { // "easy" rating
    newEaseFactor = Math.min(MAX_EASE_FACTOR, currentEaseFactor + 0.15);
  } else { // "good" rating
    newEaseFactor = Math.min(MAX_EASE_FACTOR, currentEaseFactor + 0.1);
  }
  
  // Adjust for card difficulty
  const difficultyAdjustment = (1 - difficulty) * 0.1;
  newEaseFactor += difficultyAdjustment;
  
  return Math.max(MIN_EASE_FACTOR, Math.min(MAX_EASE_FACTOR, newEaseFactor));
}

/**
 * Update stability based on performance and current stability
 */
function updateStability(currentStability: number, performance: number, easeFactor: number): number {
  if (performance === 0) { // "again" rating
    return Math.max(0, currentStability * 0.5);
  }
  
  const stabilityIncrease = easeFactor * performance * 0.3;
  return currentStability + stabilityIncrease;
}

/**
 * Calculate next interval using FSRS-inspired formula
 */
function calculateNextInterval(
  step: number,
  easeFactor: number,
  difficulty: number,
  stability: number,
  performance: number
): number {
  if (performance === 0) { // "again" rating
    return 1; // Review again tomorrow
  }

  // "Hard" = always 1 day — "see again soon" without a 4th button (reduces cognitive load for ESOL learners)
  if (performance === 0.5) {
    return 1;
  }
  
  // Use base intervals for early steps
  if (step < BASE_INTERVALS.length) {
    const baseInterval = BASE_INTERVALS[step];
    const difficultyMultiplier = 1 + (1 - difficulty) * 0.5;
    const stabilityMultiplier = 1 + stability * 0.2;
    return Math.round(baseInterval * difficultyMultiplier * stabilityMultiplier);
  }
  
  // For advanced steps, use exponential growth with modifiers
  const lastInterval = BASE_INTERVALS[BASE_INTERVALS.length - 1];
  const exponentialGrowth = Math.pow(easeFactor, step - BASE_INTERVALS.length + 1);
  const difficultyMultiplier = 1 + (1 - difficulty) * 0.3;
  const stabilityMultiplier = 1 + stability * 0.1;
  
  return Math.round(lastInterval * exponentialGrowth * difficultyMultiplier * stabilityMultiplier);
}

/**
 * Apply FSRS-inspired rating to update card state
 */
export function applyFSRSRating(
  currentState: {
    step?: number;
    easeFactor?: number;
    difficulty?: number;
    stability?: number;
    lastInterval?: number;
    totalReviews?: number;
    lapses?: number;
    performanceHistory?: number[];
  } | null,
  rating: VocabReviewRating,
  now = new Date()
): FSRSResult {
  const performance = RATING_PERFORMANCE[rating];
  const currentStep = currentState?.step ?? -1;
  const currentEaseFactor = currentState?.easeFactor ?? INITIAL_EASE_FACTOR;
  const currentDifficulty = currentState?.difficulty ?? INITIAL_DIFFICULTY;
  const currentStability = currentState?.stability ?? INITIAL_STABILITY;
  const currentLastInterval = currentState?.lastInterval ?? 0;
  const currentTotalReviews = currentState?.totalReviews ?? 0;
  const currentLapses = currentState?.lapses ?? 0;
  const currentHistory = currentState?.performanceHistory ?? [];

  // Update FSRS parameters
  const newDifficulty = updateDifficulty(currentDifficulty, performance);
  const newEaseFactor = updateEaseFactor(currentEaseFactor, performance, newDifficulty);
  const newStability = updateStability(currentStability, performance, newEaseFactor);
  
  // Calculate next step and interval
  let nextStep = currentStep;
  if (rating === "again") {
    nextStep = 0;
  } else if (rating === "hard") {
    nextStep = Math.max(1, currentStep);
  } else if (rating === "good") {
    nextStep = currentStep + 1;
  } else { // "easy"
    nextStep = currentStep + 2;
  }
  
  const nextInterval = calculateNextInterval(
    nextStep,
    newEaseFactor,
    newDifficulty,
    newStability,
    performance
  );
  
  // Update performance history
  const newHistory = [...currentHistory, performance].slice(-10); // Keep last 10 reviews
  
  // Calculate due date
  const dueAt = new Date(now);
  dueAt.setUTCDate(dueAt.getUTCDate() + nextInterval);
  
  // Update lapses
  const newLapses = rating === "again" ? currentLapses + 1 : currentLapses;
  
  return {
    step: nextStep,
    dueAt,
    easeFactor: newEaseFactor,
    difficulty: newDifficulty,
    stability: newStability,
    lastInterval: nextInterval,
    totalReviews: currentTotalReviews + 1,
    lapses: newLapses,
    lastRating: rating,
    lastReviewedAt: now,
    shouldRepeatInSession: rating === "again",
    performanceHistory: newHistory,
  };
}

/**
 * Calculate card priority for queue ordering (optimized for 6-card daily limit)
 */
export function calculateCardPriority(
  state: {
    dueAt: Date;
    difficulty: number;
    easeFactor: number;
    isNew: boolean;
    performanceHistory: number[];
  },
  now: Date
): number {
  const { dueAt, difficulty, easeFactor, isNew, performanceHistory } = state;
  
  // Overdue cards get highest priority
  const overdueHours = (now.getTime() - dueAt.getTime()) / (1000 * 60 * 60);
  if (overdueHours > 0) {
    return 1000 + overdueHours; // Higher priority for more overdue
  }
  
  // New cards get medium-high priority
  if (isNew) {
    return 500 + (1 - difficulty) * 100; // Easier new cards first
  }
  
  // For due cards today, prioritize by difficulty and performance
  const hoursUntilDue = (dueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilDue <= 24) {
    const weightedPerformance = calculateWeightedPerformance(performanceHistory);
    const difficultyScore = (1 - difficulty) * 50;
    const performanceScore = (1 - weightedPerformance) * 30; // Lower performance = higher priority
    const easeScore = (3 - easeFactor) * 20; // Lower ease = higher priority
    
    return 100 + difficultyScore + performanceScore + easeScore;
  }
  
  // Future cards get lowest priority
  return 0;
}

/**
 * Estimate optimal daily limit based on card difficulty distribution
 */
export function estimateOptimalDailyLimit(
  cards: Array<{
    difficulty: number;
    isDue: boolean;
    isNew: boolean;
  }>
): number {
  const dueCards = cards.filter(card => card.isDue);
  const newCards = cards.filter(card => card.isNew);
  
  // Calculate total difficulty load
  const difficultyLoad = dueCards.reduce((sum, card) => sum + (1 - card.difficulty), 0);
  const newCardLoad = newCards.length * 0.8; // New cards require more mental energy
  
  // Base limit of 6 cards, adjusted by difficulty load
  const baseLimit = 6;
  const loadFactor = Math.max(0.5, Math.min(2.0, 1 - (difficultyLoad + newCardLoad) / 20));
  
  return Math.round(baseLimit * loadFactor);
}
