import type { PartsOfSpeechContent } from "@/types/parts-of-speech";
import type { DeckFilter } from "@/lib/grammar-hospital/progression";

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

// Word Sort uses its dedicated three-level flow. The beginner-only round
// fields remain as a compatible fallback for older app deployments.
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
  wordSort: { target: "verb" },
  courseMapDirections: "Pass Words to complete this activity, then unlock Sentences and Challenge. Tap a box or swipe to sort.",
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
  wordSort: { target: "noun" },
  courseMapDirections: "Pass Words to complete this activity, then unlock Sentences and Challenge. Tap a box or swipe to sort.",
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

export const partsOfSpeechWordSortPronounsContent: PartsOfSpeechContent = {
  type: "parts-of-speech",
  courseMapPreset: true,
  courseMapTitle: "Word Sort: Pronouns",
  wordSort: { target: "pronoun" },
  courseMapDirections: "Pass Words to complete this activity, then unlock Sentences and Challenge. Tap a box or swipe to sort.",
  groupId: "pos-3-pronouns",
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

export const partsOfSpeechWordSortArticlesContent: PartsOfSpeechContent = {
  type: "parts-of-speech",
  courseMapPreset: true,
  courseMapTitle: "Word Sort: Articles",
  wordSort: { target: "article" },
  courseMapDirections: "Pass Words to complete this activity, then unlock Sentences and Challenge. Tap a box or swipe to sort.",
  groupId: "pos-4-articles",
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

// Grammar Hospital deck filters for the Course Map wrappers.
//
// The wrappers themselves are assembled in sync-guided-course-map-wrappers.ts
// by spreading the seeded activity's content, so only these filters are
// literal -- and they are what decides which cases a learner actually sees.
// They live here so tests read the same values that ship; a private copy in
// the test file passes happily while production drifts away from it.

/**
 * Week 1 / Week 2 extra practice. complexity is a ceiling, not a target:
 * sampleRound deals across every level in the deck and sorts easiest-first, so
 * 3 keeps the gentle opening and adds a step up at the end of the round.
 */
export const GRAMMAR_HOSPITAL_FIRST_AID_SETTINGS: DeckFilter = {
  tier: "beginner",
  complexity: 3,
  focuses: ["subject-verb-agreement", "be-vs-do"],
};

/** Week 3: helper-verb choice, do/does against be. */
export const GRAMMAR_HOSPITAL_HELPER_REPAIR_SETTINGS: DeckFilter = {
  tier: "beginner",
  complexity: 2,
  focuses: ["do-does", "be-vs-do"],
};
