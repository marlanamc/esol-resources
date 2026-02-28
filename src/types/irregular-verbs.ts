/**
 * Type definitions for the Irregular Verbs Pattern Learning Game
 * Organizes verbs by pattern groups for efficient learning through pattern recognition
 */

export interface IrregularVerb {
  base: string;
  past: string;
  pastParticiple: string;
}

export interface VerbGroup {
  id: string; // e.g., "group-1", "group-2a"
  title: string; // e.g., "No change (cost-cost-cost)"
  pattern: string; // Pattern explanation for learning
  patternExample: string; // Visual example "cut → cut → cut"
  colorClass: string; // Tailwind color classes for visual coding
  difficulty: 1 | 2 | 3; // 1=easy, 2=medium, 3=hard
  prerequisite: string | null; // ID of prerequisite group (null for first group)
  verbs: IrregularVerb[]; // Array of verbs following this pattern
}

export type ExerciseType =
  | 'fill-in-blank'
  | 'multiple-choice'
  | 'sentence-completion'
  | 'pattern-sorting'
  | 'speed-matching';

export interface VerbExercise {
  id: string;
  type: ExerciseType;
  groupId: string;
  prompt: string; // Question text or sentence
  verb: IrregularVerb; // The verb being tested
  correctAnswer: string | string[]; // Answer(s) the student should provide
  options?: string[]; // For multiple choice exercises
  sentenceContext?: string; // For sentence completion exercises
  showPattern: boolean; // Whether to show pattern hint
}

export interface GroupProgress {
  completed: boolean;
  accuracy: number; // 0-100
  exercisesCompleted?: number; // Total exercises done in this group
  correctAnswers?: number; // Correct answers in last attempt
  lastAttemptDate?: string; // ISO timestamp
  attempts: number; // How many times they've attempted this group
  unlockedAt?: string; // ISO timestamp when group was unlocked
  locked?: boolean; // true if prerequisites not met
  streak?: number; // Correct in a row
  unlocked?: boolean; // Flag for newly unlocked
}

export interface UserVerbPreferences {
  userId: string;
  hideVerbExplanations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IrregularVerbsContent {
  type: 'irregular-verbs';
  groupId?: string; // Optional: specific group, or null for all groups
  exerciseTypes?: ExerciseType[]; // Optional: limit exercise types
  roundSize?: number; // Number of exercises per round (default: 10)
}

export interface VerbExerciseAnswer {
  exerciseId: string;
  userAnswer: string | string[];
  correct: boolean;
  timestamp: number; // milliseconds
}

export interface VerbGameState {
  phase: 'selection' | 'exercise' | 'results';
  currentGroup: VerbGroup | null;
  exercises: VerbExercise[];
  currentIndex: number;
  answers: VerbExerciseAnswer[];
  categoryData: Record<string, GroupProgress>;
  hideExplanations: boolean;
  streak: number;
  totalPoints: number;
}

export interface VerbGameRoundResults {
  groupId: string;
  exercisesCompleted: number;
  correctAnswers: number;
  accuracy: number; // 0-100
  completed: boolean; // true if accuracy >= 80%
  streak: number;
  pointsAwarded: number;
  unlocked?: boolean; // true if group unlocked (prerequisite for next)
  newAchievements?: string[]; // Achievement IDs earned
}
