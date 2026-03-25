export type ActivityType =
    | "quiz"
    | "worksheet"
    | "slides"
    | "guide"
    | "game"
    | "resource"
    | "speaking";

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
    }>;
    [key: string]: unknown;
}

export interface VocabularyContent {
    type: "vocabulary";
    wordList?: Record<string, unknown>;
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
}

export interface MinimalPairsContent {
    type: "minimal-pairs";
    contrastId?: "mixed" | "short-i-long-e" | "b-v" | "r-l" | "sh-ch";
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    roundSize?: number;
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
    | TimelineTensesContent
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

/** Tense categories for filtering practice */
export type TenseCategory =
    | "simple"
    | "continuous"
    | "perfect"
    | "perfect-continuous"
    | "mixed";

/** Sentence forms for filtering practice */
export type SentenceForm = "affirmative" | "negative" | "question";

/** Type 1: Student draws timeline from sentence */
export interface SentenceToTimelineQuestion {
    type: "sentence-to-timeline";
    id: string;
    /** The sentence to represent, e.g., "She cooks breakfast every day" */
    sentence: string;
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
    difficulty: 1 | 2 | 3;
    tenseCategory: TenseCategory;
    /** Sentence form: affirmative, negative, or question */
    sentenceForm: SentenceForm;
}

/** Union type for timeline tenses questions */
export type TimelineTensesQuestion =
    | SentenceToTimelineQuestion
    | TimelineToVerbQuestion;

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
