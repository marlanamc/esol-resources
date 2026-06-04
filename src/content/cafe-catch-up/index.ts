import type { CafeCatchUpContent } from "./types";
import { bostonHealthcare } from "./boston-healthcare";
import { bigQuestions } from "./big-questions";

/**
 * One Café Catch-Up deck = one Activity row in the LMS catalog.
 *
 * To add a new themed deck:
 *   1. Create `src/content/cafe-catch-up/<slug>.ts` exporting a `CafeCatchUpContent`.
 *   2. Add an entry below with a stable `id` (used as the Activity row id).
 *   3. Run `npm run import:cafe-catch-up` to seed/refresh the DB.
 */
export interface CafeCatchUpDeckManifestEntry {
    /** Stable Activity row id, e.g. "cafe-catch-up-boston-healthcare". */
    id: string;
    /** Optional level for the catalog card; defaults to "intermediate". */
    level?: string;
    /** Full content payload. */
    content: CafeCatchUpContent;
}

export const CAFE_CATCH_UP_DECKS: CafeCatchUpDeckManifestEntry[] = [
    {
        id: "cafe-catch-up-boston-healthcare",
        level: "intermediate",
        content: bostonHealthcare,
    },
    {
        id: "cafe-catch-up-big-questions",
        level: "intermediate",
        content: bigQuestions,
    },
];

export { bigQuestions, bostonHealthcare };
export type { CafeCatchUpContent, CafeCatchUpDeck, CafeCatchUpListenerPhrases, CafeCatchUpPrompt } from "./types";
