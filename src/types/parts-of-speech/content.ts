// Activity.content payload for the Parts of Speech game.


import type { POSExerciseType } from "./exercises";
import type { POSPhaseRoundOverridesMap, POSRoundModeOverride } from "./progression";
export interface PartsOfSpeechContent {
  type: 'parts-of-speech';
  groupId?: string;
  /**
   * When true, `groupId` is a starting floor rather than a fixed pin: the game
   * resumes at the learner's first unmastered group at or after it. Lets one
   * Course Map activity carry a learner through the whole group sequence
   * instead of restarting them at the same group on every visit.
   */
  resumeFromProgress?: boolean;
  roundMode?: POSRoundModeOverride;
  courseMapPreset?: boolean;
  courseMapTitle?: string;
  courseMapDirections?: string;
  exerciseTypes?: POSExerciseType[];
  roundSize?: number;
  roundOverrides?: POSPhaseRoundOverridesMap;
}

/**
 * Runtime guard for an Activity.content payload.
 *
 * The renderer reaches this game by id or ui as well as by content type, so a
 * row can arrive with content that is plain text, a legacy shape, or another
 * game's JSON. Callers pass null on failure rather than erroring: this game
 * runs fine with no content (free-play mode), unlike games that need a deck.
 */
export function isPartsOfSpeechContent(value: unknown): value is PartsOfSpeechContent {
  if (!value || typeof value !== 'object') return false;
  return (value as Record<string, unknown>)['type'] === 'parts-of-speech';
}

// ─── Constants ────────────────────────────────────────────────────────────────
