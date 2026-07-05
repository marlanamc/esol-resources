// Interactive and legacy grammar guide content types.

import type { TimelineElement } from "./timeline";
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
    tenseDiagram?: {
        title?: string;
        elements: TimelineElement[];
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

interface MiniQuizQuestionBase {
    id: string;
    question: string;
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

export type MiniQuizQuestion =
    | (MiniQuizQuestionBase & {
        type?: "radio";
        options: Array<{ value: string; label: string }>;
        correctAnswer: string;
    })
    | (MiniQuizQuestionBase & {
        type: "fill-blank";
        /** The question text. Use ___ to indicate where the blank falls in context if helpful. */
        correctAnswer: string;
        acceptedAnswers?: string[];
    })
    | (MiniQuizQuestionBase & {
        type: "word-scramble";
        words: string[];
        correctAnswer: string;
        correctAnswers?: string[];
        hint?: string;
    });

/** Individual question response for diagnostic tracking */
export interface QuestionResponse {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    skillTag?: string;
    difficulty?: string;
    topic?: string;
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

export interface LegacyGuideResponse {
    html: string;
    styles: string[];
    scripts: string[];
    source: string;
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
