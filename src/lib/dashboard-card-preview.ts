import { parseActivityContent, type InteractiveGuideContent, type QuizContent, type SpeakingActivityContent, type VocabularyContent } from "@/types/activity";
import { parseFlashcards, parsePlainVocabulary } from "@/lib/vocab-parser";

type PreviewActivity = {
    title: string;
    category: string | null;
    type: string | null;
    content?: string | null;
};

export type DashboardPreviewVisual =
    | {
        kind: "timeline";
        cue: string;
        events: string[];
    }
    | {
        kind: "formula";
        cue: string;
        parts: string[];
    }
    | {
        kind: "contrast";
        cue: string;
        leftLabel: string;
        rightLabel: string;
    }
    | {
        kind: "term";
        cue: string;
        term: string;
        support: string;
    }
    | {
        kind: "steps";
        cue: string;
        steps: string[];
    };

export type DashboardPreview = {
    dashboardPreviewType: "grammar" | "vocab" | "quiz" | "game" | "speaking" | "generic";
    exampleSentence: string;
    visualPayload: DashboardPreviewVisual;
    fallbackLabel: string;
};

function stripHtml(value: string): string {
    return value
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, "\"")
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function cleanSentence(value: string | null | undefined, maxLength = 120): string | null {
    if (!value) return null;
    const cleaned = stripHtml(value).replace(/^["'“”]+|["'“”]+$/g, "").trim();
    if (!cleaned) return null;
    return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1).trim()}…` : cleaned;
}

function sentenceFromTitle(title: string): string {
    const cleanTitle = title.replace(/\s+guide$/i, "").trim();
    return `You will practice ${cleanTitle.toLowerCase()}.`;
}

function getFirstGrammarExample(parsed: InteractiveGuideContent | null): string | null {
    if (!parsed) return null;

    for (const section of parsed.sections) {
        const sectionExample = cleanSentence(section.examples?.[0]);
        if (sectionExample) return sectionExample;

        const usageExample = cleanSentence(section.usageMeanings?.[0]?.examples?.[0]?.sentence);
        if (usageExample) return usageExample;
    }

    return null;
}

function isInteractiveGuideContent(content: unknown): content is InteractiveGuideContent {
    return !!content && typeof content === "object" && (content as { type?: unknown }).type === "interactive-guide" && Array.isArray((content as { sections?: unknown }).sections);
}

function isVocabularyContent(value: unknown): value is VocabularyContent {
    return !!value && typeof value === "object" && (value as { type?: unknown }).type === "vocabulary";
}

function isQuizContent(value: unknown): value is QuizContent {
    return !!value && typeof value === "object" && Array.isArray((value as { questions?: unknown }).questions);
}

function isSpeakingContent(value: unknown): value is SpeakingActivityContent {
    return !!value && typeof value === "object" && (value as { type?: unknown }).type === "speaking" && Array.isArray((value as { prompts?: unknown }).prompts);
}

function deriveGrammarPreview(activity: PreviewActivity, parsed: InteractiveGuideContent | null): DashboardPreview {
    const sections = parsed?.sections || [];
    const sectionWithTimeline = sections.find((section) => section.timeline?.events?.length);
    if (sectionWithTimeline?.timeline) {
        return {
            dashboardPreviewType: "grammar",
            exampleSentence:
                cleanSentence(sectionWithTimeline.examples?.[0]) ||
                cleanSentence(sectionWithTimeline.usageMeanings?.[0]?.examples?.[0]?.sentence) ||
                sentenceFromTitle(activity.title),
            visualPayload: {
                kind: "timeline",
                cue: cleanSentence(sectionWithTimeline.timeline.title, 40) || "See the order",
                events: sectionWithTimeline.timeline.events
                    .sort((a, b) => a.order - b.order)
                    .slice(0, 3)
                    .map((event) => cleanSentence(event.label, 30) || `Step ${event.order}`),
            },
            fallbackLabel: "See the order",
        };
    }

    const sectionWithFormula = sections.find((section) => section.formula?.length);
    if (sectionWithFormula?.formula?.length) {
        return {
            dashboardPreviewType: "grammar",
            exampleSentence:
                cleanSentence(sectionWithFormula.examples?.[0]) ||
                cleanSentence(sectionWithFormula.usageMeanings?.[0]?.examples?.[0]?.sentence) ||
                sentenceFromTitle(activity.title),
            visualPayload: {
                kind: "formula",
                cue: cleanSentence(sectionWithFormula.title, 40) || "Use this pattern",
                parts: sectionWithFormula.formula
                    .map((part) => cleanSentence(part.text, 20))
                    .filter((part): part is string => Boolean(part))
                    .slice(0, 4),
            },
            fallbackLabel: "Use this pattern",
        };
    }

    const sectionWithComparison = sections.find((section) => section.comparison?.rows?.length);
    if (sectionWithComparison?.comparison) {
        return {
            dashboardPreviewType: "grammar",
            exampleSentence:
                cleanSentence(sectionWithComparison.examples?.[0]) ||
                cleanSentence(sectionWithComparison.usageMeanings?.[0]?.examples?.[0]?.sentence) ||
                sentenceFromTitle(activity.title),
            visualPayload: {
                kind: "contrast",
                cue: cleanSentence(sectionWithComparison.comparison.title, 40) || "Compare the forms",
                leftLabel: cleanSentence(sectionWithComparison.comparison.leftLabel, 20) || "Left",
                rightLabel: cleanSentence(sectionWithComparison.comparison.rightLabel, 20) || "Right",
            },
            fallbackLabel: "Compare the forms",
        };
    }

    return {
        dashboardPreviewType: "grammar",
        exampleSentence:
            getFirstGrammarExample(parsed) ||
            sentenceFromTitle(activity.title),
        visualPayload: {
            kind: "steps",
            cue: "How to use it",
            steps: ["Look", "Notice", "Practice"],
        },
        fallbackLabel: "How to use it",
    };
}

type RawContentShape = { raw?: unknown };

function extractVocabularyEntries(rawContent: string, parsed: VocabularyContent | null) {
    if (parsed?.flashcards?.cards?.length) {
        return parsed.flashcards.cards
            .map((card) => ({
                term: cleanSentence(card.term, 28) || "",
                definition: cleanSentence(card.definition, 44) || "",
                example: cleanSentence(card.example),
            }))
            .filter((entry) => entry.term && entry.definition);
    }

    const wordListRaw = parsed?.wordList && typeof parsed.wordList === "object"
        ? (parsed.wordList as RawContentShape).raw
        : null;

    if (typeof wordListRaw === "string") {
        return parsePlainVocabulary(wordListRaw).map((entry) => ({
            term: cleanSentence(entry.term, 28) || "",
            definition: cleanSentence(entry.definition, 44) || "",
            example: cleanSentence(entry.example),
        }));
    }

    const flashcardsFromRaw = parseFlashcards(rawContent);
    if (flashcardsFromRaw.length > 0) {
        return flashcardsFromRaw.map((entry) => ({
            term: cleanSentence(entry.term, 28) || "",
            definition: cleanSentence(entry.definition, 44) || "",
            example: cleanSentence(entry.example),
        }));
    }

    return parsePlainVocabulary(rawContent).map((entry) => ({
        term: cleanSentence(entry.term, 28) || "",
        definition: cleanSentence(entry.definition, 44) || "",
        example: cleanSentence(entry.example),
    }));
}

function deriveVocabularyPreview(activity: PreviewActivity, rawContent: string, parsed: VocabularyContent | null): DashboardPreview {
    const entries = extractVocabularyEntries(rawContent, parsed);
    const firstEntry = entries.find((entry) => entry.term && entry.definition);

    if (firstEntry) {
        return {
            dashboardPreviewType: "vocab",
            exampleSentence:
                firstEntry.example ||
                `Example: ${firstEntry.term} is important in class.`,
            visualPayload: {
                kind: "term",
                cue: "Word to know",
                term: firstEntry.term,
                support: firstEntry.definition,
            },
            fallbackLabel: "Word to know",
        };
    }

    return {
        dashboardPreviewType: "vocab",
        exampleSentence: sentenceFromTitle(activity.title),
        visualPayload: {
            kind: "steps",
            cue: "Study the words",
            steps: ["See", "Say", "Use"],
        },
        fallbackLabel: "Study the words",
    };
}

function deriveQuizPreview(activity: PreviewActivity, parsed: QuizContent | null): DashboardPreview {
    const firstQuestion = parsed?.questions?.[0];
    const exampleSentence =
        cleanSentence(firstQuestion?.question) ||
        "Choose the best answer.";

    return {
        dashboardPreviewType: "quiz",
        exampleSentence,
        visualPayload: {
            kind: "steps",
            cue: "What you will do",
            steps: ["Read", "Choose", "Check"],
        },
        fallbackLabel: "What you will do",
    };
}

function deriveSpeakingPreview(parsed: SpeakingActivityContent | null): DashboardPreview {
    const firstPrompt = parsed?.prompts?.[0];
    const exampleSentence =
        cleanSentence(firstPrompt?.text) ||
        "Talk with a partner using full sentences.";

    return {
        dashboardPreviewType: "speaking",
        exampleSentence,
        visualPayload: {
            kind: "steps",
            cue: "Speaking steps",
            steps: ["Think", "Speak", "Share"],
        },
        fallbackLabel: "Speaking steps",
    };
}

function deriveGamePreview(activity: PreviewActivity): DashboardPreview {
    const lowerTitle = activity.title.toLowerCase();
    const isMatch = lowerTitle.includes("match");
    const isFill = lowerTitle.includes("fill");
    const isChoose = lowerTitle.includes("quiz") || lowerTitle.includes("choose");

    const steps = isMatch
        ? ["Look", "Match", "Check"]
        : isFill
        ? ["Read", "Fill", "Check"]
        : isChoose
        ? ["Read", "Choose", "Check"]
        : ["Look", "Build", "Check"];

    return {
        dashboardPreviewType: "game",
        exampleSentence: sentenceFromTitle(activity.title),
        visualPayload: {
            kind: "steps",
            cue: "How you will play",
            steps,
        },
        fallbackLabel: "How you will play",
    };
}

export function deriveDashboardPreview(activity: PreviewActivity): DashboardPreview {
    const rawContent = activity.content || "";
    const parsed = rawContent ? parseActivityContent(rawContent) : null;
    const category = (activity.category || "").toLowerCase();

    if ((activity.type || "").toLowerCase() === "guide" && isInteractiveGuideContent(parsed)) {
        return deriveGrammarPreview(activity, parsed);
    }

    if (category.includes("vocab") || category.includes("vocabulary") || rawContent.includes("\"type\":\"vocabulary\"")) {
        return deriveVocabularyPreview(activity, rawContent, isVocabularyContent(parsed) ? parsed : null);
    }

    if ((activity.type || "").toLowerCase() === "quiz" || category.includes("quiz")) {
        return deriveQuizPreview(activity, isQuizContent(parsed) ? parsed : null);
    }

    if ((activity.type || "").toLowerCase() === "speaking") {
        return deriveSpeakingPreview(isSpeakingContent(parsed) ? parsed : null);
    }

    if ((activity.type || "").toLowerCase() === "game") {
        return deriveGamePreview(activity);
    }

    return {
        dashboardPreviewType: "generic",
        exampleSentence: sentenceFromTitle(activity.title),
        visualPayload: {
            kind: "steps",
            cue: "Next steps",
            steps: ["Open", "Practice", "Finish"],
        },
        fallbackLabel: "Next steps",
    };
}
