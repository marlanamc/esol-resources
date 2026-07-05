// Standalone game content types (Emotion Spin Wheel, Cafe Catch-Up, Trivia, Grammar Hospital).

export interface EmotionSpinWheelContent {
    type: "emotion-spin-wheel";
}

export function isEmotionSpinWheelContent(value: unknown): value is EmotionSpinWheelContent {
    if (!value || typeof value !== "object") return false;
    return (value as Record<string, unknown>)["type"] === "emotion-spin-wheel";
}

// ============================================================================
// Café Catch-Up Discussion Game
// ============================================================================

/** A single discussion card in a Café Catch-Up deck. */
export interface CafeCatchUpPrompt {
    /** Stable numeric id (unique within a deck). */
    id: number;
    /** Topic group id, e.g. 'tea' | 'advice' | 'wellness' | 'sip'.
     *  The reserved value 'sip' marks the closing wrap-up card and is excluded
     *  from the regular rotation. */
    deck: string;
    /** Optional human-readable section label shown on print/teacher views. */
    sectionLabel?: string;
    /** The big discussion question shown to learners. */
    stem: string;
    /** Optional gentle follow-up to deepen the conversation. */
    followUp?: string;
}

/** A topic shown as a filter chip ("The Tea", "Friend advice", etc.). */
export interface CafeCatchUpDeck {
    /** Matches `CafeCatchUpPrompt.deck` (never 'sip' — sip is the closer). */
    id: string;
    /** Display label for the chip. */
    label: string;
}

/** Optional listener-phrase scaffolding shown in the side rail. */
export interface CafeCatchUpListenerPhrases {
    /** Phrases shown by default. */
    primary: string[];
    /** Phrases hidden under a "More phrases" toggle. */
    more?: string[];
}

/** Full content payload for one themed Café Catch-Up deck. */
export interface CafeCatchUpContent {
    type: "cafe-catch-up";
    /** Activity-level title (used in the catalog). */
    title: string;
    /** Optional short description shown in the catalog tile and game header. */
    description?: string;
    /** Theme label shown under the title, e.g. "Boston Healthcare". */
    theme?: string;
    /** Topic chips, in display order. Order is preserved in the UI. */
    decks: CafeCatchUpDeck[];
    /** All prompts including the closing 'sip' card. */
    prompts: CafeCatchUpPrompt[];
    /** "Who shares first?" cues; one is shown with each new card draw. */
    starters?: string[];
    /** Optional listener-phrase scaffolding. */
    listenerPhrases?: CafeCatchUpListenerPhrases;
    /** Standard release flag (omit to default-visible). */
    released?: boolean;
    /** Points awarded when the learner completes via Last Sip. Default: 5. */
    participationPoints?: number;
}

export function isCafeCatchUpContent(value: unknown): value is CafeCatchUpContent {
    if (!value || typeof value !== "object") return false;
    const c = value as Record<string, unknown>;
    return c["type"] === "cafe-catch-up" && Array.isArray(c["prompts"]) && Array.isArray(c["decks"]);
}

// ============================================================================
// Group Trivia Game (teacher-led, round-based)
// ============================================================================

export type TriviaQuestionKind =
    | "write-in"
    | "multiple-choice"
    | "error-correction"
    | "unscramble";

export interface TriviaQuestion {
    /** Stable id, e.g. "r1-q1". */
    id: string;
    /** Sentence / stem shown to the group. */
    prompt: string;
    kind: TriviaQuestionKind;
    /** Optional per-question instruction label (overrides the default for the kind). */
    label?: string;
    /** Lettered options for multiple-choice. */
    choices?: string[];
    /** For unscramble — the words to display as draggable/visible tiles. */
    tiles?: string[];
    /** Canonical answer string shown on reveal. */
    answer: string;
    /** Optional alternate accepted phrasings, shown to teacher as a reference. */
    acceptable?: string[];
    /** Optional teacher-facing explanation shown on reveal. */
    note?: string;
}

export interface TriviaRound {
    /** Stable id, e.g. "r1". */
    id: string;
    /** Round title shown in the header, e.g. "Round 1 — Parts of Speech Detective". */
    title: string;
    /** Optional 1-line tip shown above the questions. */
    blurb?: string;
    /** Optional reference list shown as prominent chips (e.g. connectors, word box). */
    wordBank?: string[];
    questions: TriviaQuestion[];
}

export interface TriviaGameContent {
    type: "trivia-game";
    title: string;
    description?: string;
    /** Standard release flag (omit to default-visible). */
    released?: boolean;
    /** Points awarded to logged-in students who open the activity. Default: 5. */
    participationPoints?: number;
    /** Seconds per round before the timer reaches 0. Default: 300 (5 min). */
    roundSeconds?: number;
    rounds: TriviaRound[];
}

export function isTriviaGameContent(value: unknown): value is TriviaGameContent {
    if (!value || typeof value !== "object") return false;
    const c = value as Record<string, unknown>;
    return c["type"] === "trivia-game" && Array.isArray(c["rounds"]);
}

// =====================================================================
// Grammar Hospital — diagnose / choose helper / repair drill.
// Targets adult ESOL learners who default to BE as a universal helper.
// =====================================================================

export type GrammarHospitalErrorTag =
    | "wrong-helper"
    | "verb-form"
    | "extra-word"
    | "missing-word"
    | "word-order";

export type GrammarHospitalPattern = "action" | "state";

export type GrammarHospitalHelper =
    | "do"
    | "does"
    | "be"
    | "am"
    | "is"
    | "are"
    | "did"
    | "was"
    | "were"
    | "have"
    | "has"
    | "had"
    | "can"
    | "could"
    | "should"
    | "would"
    | "will";

export type GrammarHospitalTier = "beginner" | "intermediate" | "advanced";

export type GrammarHospitalFocus =
    | "do-does"
    | "be-vs-do"
    | "past-simple"
    | "present-perfect"
    | "subject-verb-agreement"
    | "modals"
    | "embedded-question"
    | "question-tag"
    | "past-perfect"
    | "future-simple"
    | "future-perfect"
    | "present-perfect-continuous"
    | "past-perfect-continuous"
    | "mixed-helper";

export interface GrammarHospitalCase {
    id: string;
    sentenceType: "question" | "negative" | "statement" | "short-answer";
    /** action → do/does helper; state → be helper. */
    pattern: GrammarHospitalPattern;
    /** The "sick" sentence the learner sees first. */
    unhealthy: string;
    /** Optional [start, end) char range to mark in terracotta on the unhealthy sentence. */
    highlightSpan?: [number, number];
    /** Primary error(s) — used to score the diagnose step (multi-select). */
    errorTags: GrammarHospitalErrorTag[];
    /** Correct helper for this sentence. */
    correctHelper: GrammarHospitalHelper;
    /** The healed sentence (canonical correct answer). */
    healthy: string;
    /** Optional alternate accepted spellings/contractions for the repair step. */
    acceptable?: string[];
    /** Optional tap-to-build tiles. When present, repair uses build mode. */
    wordBank?: string[];
    /** Subject phrase ("they", "she") — used in hint copy. */
    subject?: string;
    /** Base verb ("work") — used in hint copy. */
    baseVerb?: string;
    /** Short, learner-facing explanation shown on feedback. */
    explanation: string;
    /** Optional scaffolded hint shown on "Need a hint?" tap. */
    hint?: string;
    /** Difficulty tier — defaults to "beginner" when absent. */
    tier?: GrammarHospitalTier;
    /** Within-tier complexity 1 (easiest) … 5 (hardest). Defaults to 3. */
    complexity?: number;
    /** Primary grammar focus tag — used by the settings filter. */
    grammarFocus?: GrammarHospitalFocus;
}

export interface GrammarHospitalContent {
    type: "grammar-hospital";
    title: string;
    description?: string;
    level?: "beginner" | "intermediate" | "advanced";
    courseMapPreset?: boolean;
    courseMapTitle?: string;
    courseMapDirections?: string;
    defaultSettings?: {
        tier?: GrammarHospitalTier;
        complexity?: number;
        focuses?: GrammarHospitalFocus[];
    };
    cases: GrammarHospitalCase[];
    /** Default 5 — awarded once on full completion. */
    participationPoints?: number;
    released?: boolean;
}

export function isGrammarHospitalContent(value: unknown): value is GrammarHospitalContent {
    if (!value || typeof value !== "object") return false;
    const c = value as Record<string, unknown>;
    return c["type"] === "grammar-hospital" && Array.isArray(c["cases"]);
}
