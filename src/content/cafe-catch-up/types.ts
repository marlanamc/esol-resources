/**
 * Café Catch-Up content type re-exports.
 *
 * Each themed deck (e.g. Boston Healthcare, Work Life, Family) lives in its
 * own file next to this one and exports a `CafeCatchUpContent` object.
 * The manifest in `./index.ts` wires them into the import script that seeds
 * one Activity row per deck.
 */

export type {
    CafeCatchUpContent,
    CafeCatchUpDeck,
    CafeCatchUpListenerPhrases,
    CafeCatchUpPrompt,
} from "@/types/activity";

export { isCafeCatchUpContent } from "@/types/activity";
