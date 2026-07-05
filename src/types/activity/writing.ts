// Timed writing activity content types.

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
