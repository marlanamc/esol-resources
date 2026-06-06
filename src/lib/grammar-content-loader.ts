import type { InteractiveGuideContent } from "@/types/activity";

export type GrammarContentModuleLoader = () => Promise<{
    default?: InteractiveGuideContent;
    [key: string]: InteractiveGuideContent | unknown;
}>;

export interface GrammarContentRegistryEntry {
    sourceFile: string;
    loader: GrammarContentModuleLoader;
}

export const grammarContentRegistry: Record<string, GrammarContentRegistryEntry> = {
    "all-verb-tenses-overview": {
        sourceFile: "src/content/grammar/all-verb-tenses-overview.ts",
        loader: () => import("@/content/grammar/all-verb-tenses-overview"),
    },
    "conditionals-zero-first": {
        sourceFile: "src/content/grammar/conditionals-zero-first.ts",
        loader: () => import("@/content/grammar/conditionals-zero-first"),
    },
    "conditionals-second-third": {
        sourceFile: "src/content/grammar/conditionals-second-third.ts",
        loader: () => import("@/content/grammar/conditionals-second-third"),
    },
    "continuous-tenses-review": {
        sourceFile: "src/content/grammar/continuous-tenses-review.ts",
        loader: () => import("@/content/grammar/continuous-tenses-review"),
    },
    "future-continuous": {
        sourceFile: "src/content/grammar/future-continuous.ts",
        loader: () => import("@/content/grammar/future-continuous"),
    },
    "future-perfect-continuous": {
        sourceFile: "src/content/grammar/future-perfect-continuous.ts",
        loader: () => import("@/content/grammar/future-perfect-continuous"),
    },
    "future-perfect-family": {
        sourceFile: "src/content/grammar/future-perfect-family.ts",
        loader: () => import("@/content/grammar/future-perfect-family"),
    },
    "future-perfect": {
        sourceFile: "src/content/grammar/future-perfect.ts",
        loader: () => import("@/content/grammar/future-perfect"),
    },
    "future-simple": {
        sourceFile: "src/content/grammar/future-simple.ts",
        loader: () => import("@/content/grammar/future-simple"),
    },
    "gerunds-infinitives": {
        sourceFile: "src/content/grammar/gerunds-infinitives.ts",
        loader: () => import("@/content/grammar/gerunds-infinitives"),
    },
    "getting-there-directions": {
        sourceFile: "src/content/grammar/getting-there-directions.ts",
        loader: () => import("@/content/grammar/getting-there-directions"),
    },
    "need-to-find-a-place-infinitives": {
        sourceFile: "src/content/grammar/need-to-find-a-place-infinitives.ts",
        loader: () => import("@/content/grammar/need-to-find-a-place-infinitives"),
    },
    "imperatives-declaratives": {
        sourceFile: "src/content/grammar/imperatives-declaratives.ts",
        loader: () => import("@/content/grammar/imperatives-declaratives"),
    },
    "information-questions": {
        sourceFile: "src/content/grammar/information-questions.ts",
        loader: () => import("@/content/grammar/information-questions"),
    },
    "medical-instructions-complete": {
        sourceFile: "src/content/grammar/medical-instructions-complete.ts",
        loader: () => import("@/content/grammar/medical-instructions-complete"),
    },
    "medicine-labels-insurance": {
        sourceFile: "src/content/grammar/medicine-labels-insurance.ts",
        loader: () => import("@/content/grammar/medicine-labels-insurance"),
    },
    "modals-obligation-permission": {
        sourceFile: "src/content/grammar/modals-obligation-permission.ts",
        loader: () => import("@/content/grammar/modals-obligation-permission"),
    },
    "modals-health-advice-caution-consent": {
        sourceFile: "src/content/grammar/modals-health-advice-caution-consent.ts",
        loader: () => import("@/content/grammar/modals-health-advice-caution-consent"),
    },
    "asking-right-questions-housing": {
        sourceFile: "src/content/grammar/asking-right-questions-housing.ts",
        loader: () => import("@/content/grammar/asking-right-questions-housing"),
    },
    "can-should-must": {
        sourceFile: "src/content/grammar/can-should-must.ts",
        loader: () => import("@/content/grammar/can-should-must"),
    },
    "have-to-dont-have-to-cant": {
        sourceFile: "src/content/grammar/have-to-dont-have-to-cant.ts",
        loader: () => import("@/content/grammar/have-to-dont-have-to-cant"),
    },
    "have-you-ever": {
        sourceFile: "src/content/grammar/have-you-ever.ts",
        loader: () => import("@/content/grammar/have-you-ever"),
    },
    "how-long-for-since": {
        sourceFile: "src/content/grammar/how-long-for-since.ts",
        loader: () => import("@/content/grammar/how-long-for-since"),
    },
    "how-much-how-many": {
        sourceFile: "src/content/grammar/how-much-how-many.ts",
        loader: () => import("@/content/grammar/how-much-how-many"),
    },
    "just-already-yet": {
        sourceFile: "src/content/grammar/just-already-yet.ts",
        loader: () => import("@/content/grammar/just-already-yet"),
    },
    "lets-make-a-suggestion": {
        sourceFile: "src/content/grammar/lets-make-a-suggestion.ts",
        loader: () => import("@/content/grammar/lets-make-a-suggestion"),
    },
    "more-less-the-most": {
        sourceFile: "src/content/grammar/more-less-the-most.ts",
        loader: () => import("@/content/grammar/more-less-the-most"),
    },
    "past-simple-past-continuous": {
        sourceFile: "src/content/grammar/past-simple-past-continuous.ts",
        loader: () => import("@/content/grammar/past-simple-past-continuous"),
    },
    "questions-real-answers": {
        sourceFile: "src/content/grammar/questions-real-answers.ts",
        loader: () => import("@/content/grammar/questions-real-answers"),
    },
    "welcome-back-tenses-review": {
        sourceFile: "src/content/grammar/welcome-back-tenses-review.ts",
        loader: () => import("@/content/grammar/welcome-back-tenses-review"),
    },
    "what-are-you-good-at": {
        sourceFile: "src/content/grammar/what-are-you-good-at.ts",
        loader: () => import("@/content/grammar/what-are-you-good-at"),
    },
    "your-week-in-english": {
        sourceFile: "src/content/grammar/your-week-in-english.ts",
        loader: () => import("@/content/grammar/your-week-in-english"),
    },
    "zero-first-conditional": {
        sourceFile: "src/content/grammar/zero-first-conditional.ts",
        loader: () => import("@/content/grammar/zero-first-conditional"),
    },
    "articles-community-resources": {
        sourceFile: "src/content/grammar/articles-community-resources.ts",
        loader: () => import("@/content/grammar/articles-community-resources"),
    },
    "prepositions-time-place": {
        sourceFile: "src/content/grammar/prepositions-time-place.ts",
        loader: () => import("@/content/grammar/prepositions-time-place"),
    },
    "paragraph-format": {
        sourceFile: "src/content/grammar/paragraph-format.ts",
        loader: () => import("@/content/grammar/paragraph-format"),
    },
    "parts-of-speech": {
        sourceFile: "src/content/grammar/parts-of-speech.ts",
        loader: () => import("@/content/grammar/parts-of-speech"),
    },
    "passive-voice": {
        sourceFile: "src/content/grammar/passive-voice.ts",
        loader: () => import("@/content/grammar/passive-voice"),
    },
    "past-continuous": {
        sourceFile: "src/content/grammar/past-continuous.ts",
        loader: () => import("@/content/grammar/past-continuous"),
    },
    "past-perfect-continuous": {
        sourceFile: "src/content/grammar/past-perfect-continuous.ts",
        loader: () => import("@/content/grammar/past-perfect-continuous"),
    },
    "past-perfect-family": {
        sourceFile: "src/content/grammar/past-perfect-family.ts",
        loader: () => import("@/content/grammar/past-perfect-family"),
    },
    "past-perfect": {
        sourceFile: "src/content/grammar/past-perfect.ts",
        loader: () => import("@/content/grammar/past-perfect"),
    },
    "past-simple": {
        sourceFile: "src/content/grammar/past-simple.ts",
        loader: () => import("@/content/grammar/past-simple"),
    },
    "perfect-continuous-tenses-review": {
        sourceFile: "src/content/grammar/perfect-continuous-tenses-review.ts",
        loader: () => import("@/content/grammar/perfect-continuous-tenses-review"),
    },
    "perfect-tenses-review": {
        sourceFile: "src/content/grammar/perfect-tenses-review.ts",
        loader: () => import("@/content/grammar/perfect-tenses-review"),
    },
    "present-continuous": {
        sourceFile: "src/content/grammar/present-continuous.ts",
        loader: () => import("@/content/grammar/present-continuous"),
    },
    "present-perfect-continuous": {
        sourceFile: "src/content/grammar/present-perfect-continuous.ts",
        loader: () => import("@/content/grammar/present-perfect-continuous"),
    },
    "present-perfect-family": {
        sourceFile: "src/content/grammar/present-perfect-family.ts",
        loader: () => import("@/content/grammar/present-perfect-family"),
    },
    "present-perfect": {
        sourceFile: "src/content/grammar/present-perfect.ts",
        loader: () => import("@/content/grammar/present-perfect"),
    },
    "present-simple": {
        sourceFile: "src/content/grammar/present-simple.ts",
        loader: () => import("@/content/grammar/present-simple"),
    },
    "punctuation-capitalization": {
        sourceFile: "src/content/grammar/punctuation-capitalization.ts",
        loader: () => import("@/content/grammar/punctuation-capitalization"),
    },
    "reported-speech": {
        sourceFile: "src/content/grammar/reported-speech.ts",
        loader: () => import("@/content/grammar/reported-speech"),
    },
    "simple-tenses-review": {
        sourceFile: "src/content/grammar/simple-tenses-review.ts",
        loader: () => import("@/content/grammar/simple-tenses-review"),
    },
    "superlatives-quantifiers": {
        sourceFile: "src/content/grammar/superlatives-quantifiers.ts",
        loader: () => import("@/content/grammar/superlatives-quantifiers"),
    },
    "used-to-would-rather": {
        sourceFile: "src/content/grammar/used-to-would-rather.ts",
        loader: () => import("@/content/grammar/used-to-would-rather"),
    },
    "verb-forms-overview": {
        sourceFile: "src/content/grammar/verb-forms-overview.ts",
        loader: () => import("@/content/grammar/verb-forms-overview"),
    },
    "workplace-phrasal-verbs": {
        sourceFile: "src/content/grammar/workplace-phrasal-verbs.ts",
        loader: () => import("@/content/grammar/workplace-phrasal-verbs"),
    },
    "cycle-1-review": {
        sourceFile: "src/content/grammar/cycle-1-review.ts",
        loader: () => import("@/content/grammar/cycle-1-review"),
    },
};

export const grammarContentSlugs = Object.keys(grammarContentRegistry).sort();

export async function getGrammarContent(
    slug: string
): Promise<InteractiveGuideContent | null> {
    const entry = grammarContentRegistry[slug];
    if (!entry) {
        return null;
    }

    try {
        const loadedModule = await entry.loader();
        // Try different export patterns
        if (loadedModule.default && typeof loadedModule.default === "object" && "type" in loadedModule.default) {
            return loadedModule.default as InteractiveGuideContent;
        }
        // Look for Content export (e.g., reportedSpeechContent, presentSimpleContent)
        const contentKeys = Object.keys(loadedModule).filter(
            (key) =>
                key.toLowerCase().includes("content") &&
                typeof loadedModule[key] === "object" &&
                loadedModule[key] !== null &&
                loadedModule[key] !== undefined &&
                typeof loadedModule[key] === "object" &&
                "type" in (loadedModule[key] as Record<string, unknown>)
        );
        if (contentKeys.length > 0) {
            // Prefer the one that ends with "Content"
            const preferred = contentKeys.find((k) => k.toLowerCase().endsWith("content")) || contentKeys[0];
            return loadedModule[preferred] as InteractiveGuideContent;
        }
        return null;
    } catch (error) {
        console.error(`Error loading grammar content for slug: ${slug}`, error);
        return null;
    }
}

export function getGrammarContentSourceFile(slug: string): string | null {
    return grammarContentRegistry[slug]?.sourceFile ?? null;
}
