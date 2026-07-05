// Timeline Tenses game content types.

// ============================================================================
// Timeline Tenses Game Types
// ============================================================================

/**
 * Visual element types for timeline representation
 *
 * Simplified to 5 core shapes - the ZONE determines timing context:
 * - Moment: one specific event/point
 * - Habit: repeated actions
 * - Duration: action happening over time
 * - Connection: links to another point (NOW or past reference)
 * - Duration + Connection: ongoing that also connects
 *
 * Legacy types (dashed-line, arc-dashed, solid-to-point) are kept for
 * backwards compatibility but map to the core types visually.
 */
export type TimelineElementType =
    | "single-dot"     // Moment - one point in time
    | "multiple-dots"  // Habit - repeated actions
    | "solid-line"     // Duration - ongoing action
    | "arc"            // Connection - links to endpoint
    | "solid-to-now"   // Duration + Connection - ongoing that connects
    // Legacy types (kept for backwards compatibility, render same as above)
    | "dashed-line"    // → renders as solid-line (zone determines style)
    | "arc-dashed"     // → renders as arc (zone determines direction)
    | "solid-to-point"; // → renders as solid-to-now (auto-detects target)

/**
 * Timeline zones relative to NOW marker.
 * `past-earlier` / `past-later` split the past band (used for perfect tenses that
 * need “before another past moment”); plain `past` is one band for other tenses.
 */
export type TimelineZone =
    | "past"
    | "past-earlier"
    | "past-later"
    | "present"
    | "future";

/** Individual timeline element with placement */
export interface TimelineElement {
    id: string;
    type: TimelineElementType;
    zone: TimelineZone;
    /** Position within zone (0-100) */
    position: number;
    /** Base verb label for Type 2 questions */
    verbLabel?: string;
    /** ID of connected element (for arcs) */
    connectedTo?: string;
}

/** Valid answer for verb conjugation with explanation */
export interface ValidVerbAnswer {
    /** The conjugated verb form, e.g., "was working" */
    answer: string;
    /** The tense name, e.g., "Past Continuous" */
    tenseName: string;
    /** Optional nuance explanation, e.g., "Emphasizes the ongoing action" */
    nuance?: string;
}

/** Short A/B exchange showing the target tense in real conversation */
export interface RealLifeDialogue {
    lineA: string;
    lineB: string;
}

/** Tense categories for filtering practice */
export type TenseCategory =
    | "simple"
    | "continuous"
    | "perfect"
    | "perfect-continuous"
    | "mixed"
    | "used-to";

/** Sentence forms for filtering practice */
export type SentenceForm = "affirmative" | "negative" | "question";

/** Main timeline reference point for filtering practice */
export type TimelineTimeFrame = "past" | "present" | "future";

/** Type 1: Student draws timeline from sentence */
export interface SentenceToTimelineQuestion {
    type: "sentence-to-timeline";
    id: string;
    /** The sentence to represent, e.g., "She cooks breakfast every day" */
    sentence: string;
    /** The verb phrase to bold in the sentence display, e.g., "has been cooking" */
    verbPhrase?: string;
    /** Second verb phrase to underline (for two-verb mixed sentences) */
    verbPhrase2?: string;
    /** Optional per-question dialogue shown in the "In real life" card */
    realLifeDialogue?: RealLifeDialogue;
    /** Expected timeline elements for correct answer */
    correctElements: TimelineElement[];
    /** The tense name to reveal after submission */
    tenseName: string;
    /** Detailed explanation of why this representation is correct */
    explanation: string;
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
    /** Sentence form: affirmative, negative, or question */
    sentenceForm: SentenceForm;
}

/** Type 2: Student fills in verbs from timeline */
export interface TimelineToVerbQuestion {
    type: "timeline-to-verb";
    id: string;
    /** Pre-drawn timeline elements with verb labels */
    timelineElements: TimelineElement[];
    /** Sentence template with blanks, e.g., "He ___[work]___ when the power ___[go]___ off." */
    sentenceTemplate: string;
    /** Blank definitions with multiple valid answers */
    blanks: Array<{
        /** Stable blank ID used for rendering, refs, and answer state */
        id: string;
        /** Base verb shown on timeline, e.g., "work" */
        baseVerb: string;
        /** All grammatically valid answers with explanations */
        validAnswers: ValidVerbAnswer[];
    }>;
    /** Optional scenario context */
    scenario?: string;
    /** Optional per-question dialogue shown in the "In real life" card */
    realLifeDialogue?: RealLifeDialogue;
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
    /** Sentence form: affirmative, negative, or question */
    sentenceForm: SentenceForm;
}

/** Tense comparison question: student identifies which timeline matches a sentence, or explains the difference */
export type TenseComparisonPromptType =
    | 'sentence-to-timeline'
    | 'timeline-to-sentence'
    | 'clue-to-timeline';

export interface TenseComparisonOption {
    sentence: string;
}

export interface TenseComparisonQuestion {
    type: 'tense-comparison';
    id: string;
    promptType: TenseComparisonPromptType;
    promptText: string;
    correctOption: 'A' | 'B';
    /** Name of the tense shown in Timeline A, e.g. "Past Continuous" */
    tenseA: string;
    /** Name of the tense shown in Timeline B, e.g. "Past Perfect Continuous" */
    tenseB: string;
    elementsA: TimelineElement[];
    elementsB: TimelineElement[];
    optionA: TenseComparisonOption;
    optionB: TenseComparisonOption;
    /** Why students commonly confuse these two tenses */
    confusionExplanation: string;
    /** The key visual/conceptual difference */
    keyDifference: string;
    /** Optional per-question dialogue shown in the "In real life" card */
    realLifeDialogue?: RealLifeDialogue;
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
}

/** Sentence transformer question: student rewrites sentence in a new tense */
export interface SentenceTransformerQuestion {
    type: 'sentence-transformer';
    id: string;
    sourceTense: string;
    targetTense: string;
    sourceSentence: string;
    /** Full correct target sentence for display after submission */
    targetSentence: string;
    sourceElements: TimelineElement[];
    targetElements: TimelineElement[];
    /** Which word positions (0-based) need to be filled — matched against split target sentence words */
    verbBlanks: { index: number; validAnswers: string[] }[];
    hint?: string;
    /** Grammar explanation shown in feedback */
    explanation: string;
    /** Optional per-question dialogue shown in the "In real life" card */
    realLifeDialogue?: RealLifeDialogue;
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
}

/** Context-based tense picker: student chooses the correct tense for a contextual scenario */
export interface ContextTenseOption {
    tenseName: string;
    conjugatedVerb: string;
    elements: TimelineElement[];
    isCorrect: boolean;
}

export interface ContextTenseQuestion {
    type: 'context-tense-picker';
    id: string;
    /** Scenario paragraph with a ___ blank for the target verb */
    scenario: string;
    /** Base form of the missing verb, e.g. "play" */
    blankVerb: string;
    options: ContextTenseOption[];
    /** Words/phrases in the scenario that signal the correct tense */
    contextClues: string[];
    explanation: string;
    /** Optional per-question dialogue shown in the "In real life" card */
    realLifeDialogue?: RealLifeDialogue;
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
}

/** Error correction question: student identifies and fixes a sentence or timeline error */
export interface ErrorCorrectionQuestion {
    type: 'error-correction';
    id: string;
    errorLocation: 'sentence' | 'timeline';
    incorrectSentence: string;
    incorrectElements: TimelineElement[];
    correctSentence: string;
    /** Optional shorter accepted correction(s), e.g. corrected verb phrase */
    acceptedCorrections?: string[];
    correctElements: TimelineElement[];
    incorrectTense: string;
    correctTense: string;
    /** Why this mistake is so common */
    commonMistakeExplanation: string;
    /** Optional per-question dialogue shown in the "In real life" card */
    realLifeDialogue?: RealLifeDialogue;
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
}

/** A single sentence slot in a Story Builder question */
export interface StorySentence {
    template: string;
    targetTense: string;
    elements: TimelineElement[];
    blanks: { index: number; validAnswers: string[] }[];
    contextHint: string;
}

/** Story builder question: student completes a multi-sentence story, one tense at a time */
export interface StoryBuilderQuestion {
    type: 'story-builder';
    id: string;
    storyTitle: string;
    storyPrompt: string;
    sentences: StorySentence[];
    /** All timeline elements combined (for the final full-timeline view) */
    fullTimelineElements: TimelineElement[];
    /** Optional per-question dialogue shown in the "In real life" card */
    realLifeDialogue?: RealLifeDialogue;
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
}

/** Union type for timeline tenses questions */
export type TimelineTensesQuestion =
    | SentenceToTimelineQuestion
    | TimelineToVerbQuestion
    | TenseComparisonQuestion
    | SentenceTransformerQuestion
    | ContextTenseQuestion
    | ErrorCorrectionQuestion
    | StoryBuilderQuestion;

/** Main content type for Timeline Tenses game */
export interface TimelineTensesContent {
    type: "timeline-tenses";
    /** Array of questions (can mix both types) */
    questions: TimelineTensesQuestion[];
    /** Optional tense category filters for practice */
    tenseFilters?: TenseCategory[];
    /** Questions per round (default: 10) */
    roundSize?: number;
}

export function isTimelineTensesContent(value: unknown): value is TimelineTensesContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "timeline-tenses" && Array.isArray(candidate["questions"]);
}
