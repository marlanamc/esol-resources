import type { SentenceBuilderContent } from "@/types/activity";
import { adverbsOfFrequencySentenceBuilder } from "./adverbs-of-frequency";
import { canShouldMustSentenceBuilder } from "./can-should-must";
import { zeroFirstConditionalSentenceBuilder } from "./zero-first-conditional";

/** One Activity per deck. The id is the Activity id the Course Map links to. */
export interface SentenceBuilderDeck {
    id: string;
    week: number;
    content: SentenceBuilderContent;
}

export const SENTENCE_BUILDER_DECKS: SentenceBuilderDeck[] = [
    { id: "sentence-builder-adverbs-of-frequency", week: 6, content: adverbsOfFrequencySentenceBuilder },
    { id: "sentence-builder-zero-first-conditional", week: 7, content: zeroFirstConditionalSentenceBuilder },
    { id: "sentence-builder-can-should-must", week: 8, content: canShouldMustSentenceBuilder },
];
