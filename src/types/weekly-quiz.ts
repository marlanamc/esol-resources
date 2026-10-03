export type WeeklyQuizSection = 'forms' | 'apply' | 'vocabulary' | 'grammar';
export interface WeeklyQuizQuestion {
  id: string;
  section: WeeklyQuizSection;
  prompt: string;
  options?: string[];
  answers: string[];
  explanation: string;
  source?: string;
}
export interface WeeklyQuizContent {
  type: 'weekly-quiz';
  version: 1;
  weekNumber: number;
  title: string;
  focusVerbs: string[];
  guided?: boolean;
  estimatedMinutes: '5–10';
  questions: WeeklyQuizQuestion[];
}
export interface WeeklyQuizSubmission {
  type: 'weekly-quiz';
  version: 1;
  answers: Record<string, string>;
  score: number;
  correctCount: number;
  totalQuestions: number;
  results: { id: string; correct: boolean; expected: string; explanation: string }[];
}
