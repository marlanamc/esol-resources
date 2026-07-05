// Speaking activity content types (solo + partner modes).

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

export function isSpeakingActivityContent(value: unknown): value is SpeakingActivityContent {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate["type"] === "speaking" && Array.isArray(candidate["prompts"]);
}
