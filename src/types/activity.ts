export type ActivityType =
    | "quiz"
    | "worksheet"
    | "slides"
    | "guide"
    | "game"
    | "resource"
    | "speaking"
    | "writing";

export type FormulaPartType = "subject" | "verb" | "object" | "other";

export interface FormulaPart {
    text: string;
    type?: FormulaPartType;
}

export type ExerciseItem =
    | {
        type: "text";
        label: string;
        placeholder?: string;
        correctAnswer?: string;
        expectedAnswer?: string;
        expectedAnswers?: string[];
        /** When true, any non-empty attempt counts as correct (for open-ended questions). */
        acceptAnyAttempt?: boolean;
    }
    | {
        type: "select";
        label: string;
        options: string[];
        expectedAnswer?: string;
        expectedAnswers?: string[];
    }
    | {
        type: "radio";
        label: string;
        options: Array<{ value: string; label: string }>;
        expectedAnswer?: string;
        expectedAnswers?: string[];
    }
    | {
        type: "checkbox";
        label: string;
        options: Array<{ value: string; label: string }>;
        /** Array of correct option values - user must select all and only these */
        expectedAnswers: string[];
    }
    | {
        type: "word-select";
        label: string;
        selectWhat?: string; // e.g. "nouns and pronouns"
        tokens: Array<{
            text: string;
            after?: string; // defaults to " "
            isTarget?: boolean;
        }>;
    }
    | {
        type: "word-scramble";
        label: string;
        words: string[];
        correctAnswer: string;
        correctAnswers?: string[];
        hint?: string;
    };

export interface Exercise {
    title: string;
    instructions?: string;
    /** Explicitly declare whether learners should type missing words or a full sentence. */
    answerExpectation?: "missing-words" | "full-sentence";
    items: ExerciseItem[];
    id?: string; // For tracking completion
}

export interface UsageMeaning {
    title: string;
    description: string;
    examples: Array<{
        sentence: string;
        explanation?: string;
    }>;
}

export interface ComparisonRow {
    label: string;
    left: string;
    right: string;
}

export interface TimeExpression {
    word: string;
    usage: string;
    examples: string[];
}

export interface VerbTable {
    title: string;
    headers: string[];
    rows: string[][];
}

export interface InteractiveGuideSection {
    id?: string; // For tracking progress
    stepNumber?: number;
    title: string;
    icon?: string; // Emoji or icon name
    explanation?: string;
    formula?: FormulaPart[];
    examples?: string[];
    exercises?: Exercise[];
    usageMeanings?: UsageMeaning[]; // For meaning sections
    comparison?: {
        title: string;
        leftLabel: string;
        rightLabel: string;
        rows: ComparisonRow[];
        /** When false, hide the first column (row labels). Use when left column already shows the same info. */
        showLabelColumn?: boolean;
    };
    timeExpressions?: TimeExpression[];
    verbTable?: VerbTable;
    tipBox?: {
        title: string;
        content: string;
    };
    timeline?: {
        title: string;
        description: string;
        events: Array<{
            label: string;
            order: number;
            tenseLabel: string;
        }>;
    };
    futureChoiceFlow?: {
        title?: string;
        description?: string;
        options: Array<{
            form: "will" | "going-to" | "present-continuous" | "future-continuous";
            trigger: string;
            example: string;
            color: string; // e.g. "cyan", "green", "violet", "amber"
        }>;
    };
    postExplanation?: string;
}

export interface LegacyGuideMetadata {
    source: "legacy";
    originalFile: string;
    [key: string]: unknown;
}

export interface MiniQuizQuestion {
    id: string;
    question: string;
    options: Array<{ value: string; label: string }>;
    correctAnswer: string;
    explanation?: string;
    /** Topic tag for diagnostic reports (e.g., "present-simple", "time-expressions") */
    topic?: string;
    /** Skill category being tested (e.g., "recognition", "formation", "usage", "error-detection", "production") */
    skill?: string;
    /** Specific skill tag for granular diagnostic tracking (e.g., "form-positive-he-she-it", "meaning-habit-vs-now") */
    skillTag?: string;
    /** Difficulty level for adaptive learning and reporting */
    difficulty?: "easy" | "medium" | "hard";
}

/** Individual question response for diagnostic tracking */
export interface QuestionResponse {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    skillTag?: string;
    difficulty?: string;
    topic?: string;
}

export interface SpeakingPrompt {
    id: string;
    text: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    context?: string;

    // For warmup mode: Instructions for solo vs partnered practice
    soloInstructions?: string;
    partnerInstructions?: string;
}

export interface KeyPhrase {
    phrase: string;
    example?: string;
}

export type ActivityProgressStatus = "in_progress" | "completed" | "submitted";

export interface SoloStep {
    id: string;
    text: string;
    required?: boolean;
}

export interface SpeakingStep {
    id: string;
    text: string;
    required?: boolean;
}

export interface SoloModeConfig {
    title: string;
    subtitle: string;
    checklist: Array<{
        id: string;
        text: string;
        required: boolean;
    }>;
    inputs: Array<{
        id: string;
        label: string;
        type: "text" | "textarea";
        required: boolean;
    }>;
    help: {
        sentenceFrames: string[];
        questionStems: string[];
        wordBank: string[];
    };
}

export interface SpeakingModeConfig {
    title: string;
    subtitle: string;
    checklist: Array<{
        id: string;
        text: string;
        required: boolean;
    }>;
    inputs: Array<{
        id: string;
        label: string;
        type: "text" | "textarea";
        required: boolean;
    }>;
    noPartnerNote?: string;
}

export interface SpeakingSubmission {
    activityId: string;
    assignmentId?: string | null;
    userId: string;
    selectedPromptIds: string[];
    solo: {
        sentences: [string, string, string];
        followUpQuestions: [string, string];
        completedStepIds: string[];
    };
    speaking: {
        bestSentence: string;
        completedStepIds: string[];
    };
    submittedAt: string;
    status: "submitted";
}

export interface SpeakingActivityContent {
    type: "speaking";
    title: string;
    description?: string;
    keyPhrases?: KeyPhrase[];
    prompts: SpeakingPrompt[];
    reflectionPrompt?: string;
    reflectionMinLength?: number;
    minPromptsRequired?: number;
    released?: boolean; // Control visibility like quiz releases

    // NEW: Enable simple warmup mode
    warmupMode?: boolean;  // When true, use simple participation tracking

    // Warmup-specific settings
    participationPoints?: number;  // Default: 3 points

    // New two-phase warm-up structure
    soloMode?: SoloModeConfig;
    speakingMode?: SpeakingModeConfig;

    // Legacy structure (for backward compatibility)
    soloSteps?: SoloStep[];
    speakingSteps?: SpeakingStep[];
    soloHelp?: {
        sentenceFrames: string[];
        questionStems: string[];
        wordBank: string[];
    };
}

export interface InteractiveGuideContent {
    type: "interactive-guide";
    sections: InteractiveGuideSection[];
    miniQuiz?: MiniQuizQuestion[]; // Optional final comprehension check
    tableOfContents?: boolean; // Show TOC
    metadata?: LegacyGuideMetadata;
}

export type LegacyGuideContent = InteractiveGuideContent & {
    metadata: LegacyGuideMetadata;
};

export interface QuizQuestion {
    id?: string | number;
    question: string;
    type?: "text" | "multiple" | "single" | "radio" | "checkbox";
    options?: string[];
}

export interface QuizContent {
    questions: QuizQuestion[];
}

export interface WorksheetSection {
    title?: string;
    instructions?: string;
    content?: string;
}

export interface WorksheetContent {
    sections?: WorksheetSection[];
    content?: string;
}

export interface SlidesContent {
    slides?: unknown[];
}

export interface GuideSection {
    heading: string;
    content: string;
}

import type { MinimalPairContrastId } from "@/lib/minimal-pairs-data";

export interface GuideContent {
    title?: string;
    sections?: GuideSection[];
    content?: string;
    metadata?: LegacyGuideMetadata;
}

export interface FlashcardContent {
    cards?: Array<{
        term: string;
        definition: string;
        example?: string;
        pos?: string;
    }>;
    [key: string]: unknown;
}

export interface VocabularyWordListGroup {
    id: string;
    label: string;
    cards: Array<{
        term: string;
        definition: string;
        example?: string;
        pos?: string;
    }>;
}

export interface VocabularyWordListContent {
    cards?: Array<{
        term: string;
        definition: string;
        example?: string;
        pos?: string;
    }>;
    groups?: VocabularyWordListGroup[];
    [key: string]: unknown;
}

export interface MatchingContent {
    pairs?: Array<{
        id: number;
        term: string;
        definition: string;
    }>;
    [key: string]: unknown;
}

export interface FillInBlankContent {
    sentences?: Array<{
        id: string;
        text: string;
        blanks: string[];
        correctAnswers: string[];
        options?: string[];
        explanation?: string;
    }>;
    [key: string]: unknown;
}

export interface VocabularyContent {
    type: "vocabulary";
    wordList?: VocabularyWordListContent;
    flashcards?: FlashcardContent;
    matching?: MatchingContent;
    fillInBlank?: FillInBlankContent;
}

export interface EdPronunciationContent {
    type: "ed-pronunciation";
    mode: "sorting" | "minimal-pairs" | "mixed";
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    /** Optional list of specific verbs to use (base forms). If omitted, uses built-in list. */
    verbs?: string[];
    /** Number of verbs per round (default: 15) */
    roundSize?: number;
    meta?: PronunciationActivityMetadata;
}

export type PronunciationSkillFamily =
    | "minimal-pairs"
    | "ed-endings"
    | "sentence-listening"
    | "mixed-review";

export type PronunciationPracticeMode = "listening" | "sentence-context" | "mixed-review";

export interface PronunciationActivityMetadata {
    skillFamily: PronunciationSkillFamily;
    practiceMode: PronunciationPracticeMode;
    targetLabel: string;
    targetDescription?: string;
    recommendedOrder?: number;
}

export interface MinimalPairsContent {
    type: "minimal-pairs";
    contrastId?: MinimalPairContrastId | "mixed";
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    roundSize?: number;
    meta?: PronunciationActivityMetadata;
}

export interface PronunciationSentenceListeningQuestion {
    id: string;
    audioPrompt: string;
    prompt?: string;
    choices: Array<{
        label: string;
        cue?: string;
    }>;
    correctChoiceIndex: number;
    transcript: string;
    revealFocus?: string;
    coachingTip?: string;
}

export interface SoundExplainerItem {
    label: string;    // e.g. "Short i /ɪ/"
    tip: string;      // e.g. "Tongue relaxed in the middle of your mouth"
    examples: string; // e.g. "sit, ship, bit"
}

export interface SoundExplainer {
    sounds: [SoundExplainerItem, SoundExplainerItem];
    commonMistake: string;
}

export interface PronunciationSentenceListeningContent {
    type: "pronunciation-listening";
    targetSound: string;
    instructions?: string;
    roundSize?: number;
    sentences: PronunciationSentenceListeningQuestion[];
    setKeys?: string[];
    meta?: PronunciationActivityMetadata;
    soundExplainer?: SoundExplainer;
}

export interface WritingPrompt {
    text: string;
    imageUrl?: string;
    suggestions?: {
        starters: string[];
        vocab: string[];
    };
}

export interface TimedWritingContent {
    type: "writing";
    prompts: WritingPrompt[];
    timerSeconds: number;
    showWordCount?: boolean;
}

export function isTimedWritingContent(value: unknown): value is TimedWritingContent {
    if (!value || typeof value !== "object") return false;
    const c = value as Record<string, unknown>;
    return c["type"] === "writing" && Array.isArray(c["prompts"]) && typeof c["timerSeconds"] === "number";
}

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

export type ActivityContent =
    | QuizContent
    | WorksheetContent
    | GuideContent
    | InteractiveGuideContent
    | LegacyGuideContent
    | SlidesContent
    | SpeakingActivityContent
    | VocabularyContent
    | EdPronunciationContent
    | MinimalPairsContent
    | PronunciationSentenceListeningContent
    | TimelineTensesContent
    | TimedWritingContent
    | EmotionSpinWheelContent
    | CafeCatchUpContent
    | TriviaGameContent
    | Record<string, unknown>;

export interface LegacyGuideResponse {
    html: string;
    styles: string[];
    scripts: string[];
    source: string;
}

export function parseActivityContent(raw: string): ActivityContent | null {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            return parsed as ActivityContent;
        }
    } catch {
        // ignore
    }
    return null;
}

export function isInteractiveGuideContent(value: unknown): value is InteractiveGuideContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "interactive-guide" && Array.isArray(candidate["sections"]);
}

export function isLegacyGuideContent(value: unknown): value is LegacyGuideContent {
    if (!isInteractiveGuideContent(value)) return false;
    const candidate = value as InteractiveGuideContent;
    const meta = candidate.metadata;
    return !!meta && meta.source === "legacy" && typeof meta.originalFile === "string";
}

export function isSpeakingActivityContent(value: unknown): value is SpeakingActivityContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "speaking" && Array.isArray(candidate["prompts"]);
}

export function isVocabularyContent(value: unknown): value is VocabularyContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "vocabulary";
}

export function isEdPronunciationContent(value: unknown): value is EdPronunciationContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "ed-pronunciation";
}

export function isMinimalPairsContent(value: unknown): value is MinimalPairsContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "minimal-pairs";
}

export function isPronunciationSentenceListeningContent(value: unknown): value is PronunciationSentenceListeningContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "pronunciation-listening" && Array.isArray(candidate["sentences"]);
}

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
