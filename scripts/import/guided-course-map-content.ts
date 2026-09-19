import type { PartsOfSpeechContent } from "@/types/parts-of-speech";

// Content payloads for the guided Course Map wrapper activities.
//
// Split out of sync-guided-course-map-wrappers.ts so these can be imported and
// checked by tests: that script calls main() at module scope, so importing it
// would run a write against whatever DATABASE_URL points at.

export const partsOfSpeechDiscoveryContent: PartsOfSpeechContent = {
  type: "parts-of-speech",
  courseMapPreset: true,
  courseMapTitle: "Parts of Speech Discovery Game",
  courseMapDirections: "Start with verbs. Picks up where you left off each time you come back.",
  // A floor, not a pin: resumeFromProgress advances the learner through the
  // group sequence instead of restarting them at verbs on every visit.
  groupId: "pos-1-verbs",
  resumeFromProgress: true,
  // No roundMode here on purpose — getDefaultRoundMode then advances the
  // learner through rounds within a group as they pass them.
  roundOverrides: {
    foundation: {
      rounds: {
        round1: {
          roundSize: 6,
          exerciseTypes: ["photo-sort", "pattern-choice", "swipe-sort"],
        },
      },
    },
  },
};

// Week 2 sorting games. Week 2 meets once (Sept 24 is a closure), so these run
// as independent work: one mechanic, two buckets, no settings to choose.
//
// roundSize and exerciseTypes live under roundOverrides rather than at the top
// level on purpose -- usePartsOfSpeechGameState only forwards roundOverrides and
// exerciseTypes into the generator, so a top-level roundSize is dropped silently.
//
// resumeFromProgress is deliberately absent: that makes groupId a pin rather
// than a floor, so every visit replays the same short sort instead of walking
// the learner into harder groups.
export const partsOfSpeechWordSortVerbsContent: PartsOfSpeechContent = {
  type: "parts-of-speech",
  courseMapPreset: true,
  courseMapTitle: "Word Sort: Verbs",
  courseMapDirections: "Swipe each word into the right box. Is it a verb, or not?",
  groupId: "pos-1-verbs",
  roundMode: "round1",
  roundOverrides: {
    foundation: {
      rounds: {
        round1: {
          roundSize: 3,
          exerciseTypes: ["swipe-sort"],
        },
      },
    },
  },
};

export const partsOfSpeechWordSortNounsContent: PartsOfSpeechContent = {
  type: "parts-of-speech",
  courseMapPreset: true,
  courseMapTitle: "Word Sort: Nouns",
  courseMapDirections: "Swipe each word into the right box. Is it a noun, or not?",
  groupId: "pos-2-nouns",
  roundMode: "round1",
  roundOverrides: {
    foundation: {
      rounds: {
        round1: {
          roundSize: 3,
          exerciseTypes: ["swipe-sort"],
        },
      },
    },
  },
};

export const numbersThroughTrillionsContent = {
  type: "numbers-game",
  courseMapPreset: true,
  courseMapTitle: "Numbers Through Trillions",
  courseMapDirections: "Practice big round numbers. The category is already chosen for this level.",
  category: "Round Numbers (1,000 | 5 million | 1 billion)",
};
