export const WORD_RESCUE_ID = 'word-rescue';
export const WORD_RESCUE_POINTS = 2;
export type HelpLanguage = 'es' | 'pt-BR';
export type Confidence = 'easier' | 'again';
export type ClipKind = 'word' | 'phrase' | 'sentence';
export interface LanguageHint { sounds?: string; tips: string[] }
export interface RescueWord {
  id: string;
  term: string;
  definition: string;
  phrase: string;
  sentence: string;
  clue?: string;
  highlight?: string;
  help?: Record<HelpLanguage, LanguageHint>;
}
export interface RescueCollection { id: string; label: string; sourceActivityId?: string; wordIds: string[] }
export interface RescueSession {
  id: string;
  collectionId: string;
  wordIds: string[];
  index: number;
  heard: ClipKind[];
  said: boolean;
  finished: Record<string, Confidence>;
}
export interface RescueProgress {
  version: 1;
  language: HelpLanguage;
  words: Record<string, { confidence: Confidence; attempts: number }>;
  session: RescueSession | null;
  savedSessions?: Record<string, RescueSession>;
}
export type RescueAction =
  | { type: 'start'; id: string; collectionId: string }
  | { type: 'language'; language: HelpLanguage }
  | { type: 'heard'; sessionId: string; wordId: string; clip: ClipKind }
  | { type: 'said'; sessionId: string; wordId: string }
  | { type: 'finish'; sessionId: string; wordId: string; confidence: Confidence };
export interface RescueResult { state: RescueProgress; pointsAwarded: number; credited: boolean }
