// Quiz, worksheet, and slides content types.

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
