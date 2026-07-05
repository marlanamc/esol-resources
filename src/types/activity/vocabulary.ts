// Vocabulary, flashcard, matching, and fill-in-blank content types.

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

export function isVocabularyContent(value: unknown): value is VocabularyContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "vocabulary";
}
