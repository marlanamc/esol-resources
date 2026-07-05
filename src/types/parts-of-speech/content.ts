// Activity.content payload for the Parts of Speech game.


import type { POSExerciseType } from "./exercises";
import type { POSPhaseRoundOverridesMap, POSRoundModeOverride } from "./progression";
export interface PartsOfSpeechContent {
  type: 'parts-of-speech';
  groupId?: string;
  roundMode?: POSRoundModeOverride;
  courseMapPreset?: boolean;
  courseMapTitle?: string;
  courseMapDirections?: string;
  exerciseTypes?: POSExerciseType[];
  roundSize?: number;
  roundOverrides?: POSPhaseRoundOverridesMap;
}

// ─── Constants ────────────────────────────────────────────────────────────────
