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
  courseMapDirections: "Start here: learn verbs first. This version is already set up for you.",
  groupId: "pos-1-verbs",
  roundMode: "round1",
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

export const numbersThroughTrillionsContent = {
  type: "numbers-game",
  courseMapPreset: true,
  courseMapTitle: "Numbers Through Trillions",
  courseMapDirections: "Practice big round numbers. The category is already chosen for this level.",
  category: "Round Numbers (1,000 | 5 million | 1 billion)",
};
