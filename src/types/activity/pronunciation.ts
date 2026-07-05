// Pronunciation activity content types (-ed endings, minimal pairs, sentence listening).

import type { MinimalPairContrastId } from "@/lib/minimal-pairs-data";
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
