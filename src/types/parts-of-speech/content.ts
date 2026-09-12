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

// ─── Constants ────────────────────────────────────────────────────────────────
