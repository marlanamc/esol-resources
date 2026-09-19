import { describe, expect, it } from "vitest";
import { beginnerCases, cases } from "../../prisma/grammar-hospital-cases";
import { filterDeck, shouldSkipHelper } from "@/lib/grammar-hospital/progression";
import { getHelperOptions, resolveCorrectHelper } from "@/lib/grammar-hospital/helpers";
import { sampleRound, toWordTiles } from "@/lib/grammar-hospital/progression";
import {
    GRAMMAR_HOSPITAL_FIRST_AID_SETTINGS,
    GRAMMAR_HOSPITAL_HELPER_REPAIR_SETTINGS,
} from "../../scripts/import/guided-course-map-content";

/**
 * Guards the shipped deck, not the engine.
 *
 * The Course Map presets narrow the deck by tier + complexity + focus. If a
 * preset's filter matches too little, filterDeck silently widens back to the
 * whole tier and the learner gets a grab bag instead of the focused round the
 * preset promised — with nothing in the UI to signal it.
 */
// Imported, not restated: a local copy of these filters keeps passing while
// the shipped wrapper drifts away from it.
const WEEK_1_FIRST_AID = GRAMMAR_HOSPITAL_FIRST_AID_SETTINGS;
const HELPER_REPAIR = GRAMMAR_HOSPITAL_HELPER_REPAIR_SETTINGS;
const FIRST_AID_ROUND_SIZE = 5;

describe("grammar hospital deck", () => {
    it("has unique case ids", () => {
        const ids = cases.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("keeps every highlightSpan inside its sentence", () => {
        for (const c of cases) {
            if (!c.highlightSpan) continue;
            const [start, end] = c.highlightSpan;
            expect(start).toBeGreaterThanOrEqual(0);
            expect(end).toBeLessThanOrEqual(c.unhealthy.length);
            expect(start).toBeLessThan(end);
        }
    });

    it("always puts the correct helper on screen", () => {
        // The old picker showed the beginner five for every case, leaving any
        // case needing did/were/have/had/will unanswerable.
        for (const c of cases) {
            if (shouldSkipHelper(c)) continue;
            const options = getHelperOptions(c);
            expect(options, `case ${c.id}`).toContain(resolveCorrectHelper(c.correctHelper!));
        }
    });

    it("never ships a case whose answer equals its error", () => {
        for (const c of cases) {
            expect(c.healthy, `case ${c.id}`).not.toBe(c.unhealthy);
        }
    });

    it("gives every word-bank case exactly the tiles its answer needs", () => {
        // Tiles are authored pre-shuffled and shuffled again at runtime, so
        // order says nothing — but the multiset must match an accepted answer,
        // or the case is unwinnable in build mode.
        const tokens = (sentence: string) =>
            (sentence.match(/[\w'\u2019]+|[.?!,]/g) ?? []).sort().join("|");

        for (const c of cases) {
            if (!c.wordBank) continue;
            const bank = [...c.wordBank].sort().join("|");
            const accepted = [c.healthy, ...(c.acceptable ?? [])].map(tokens);
            expect(accepted, `case ${c.id} tiles: ${c.wordBank.join(" ")}`).toContain(bank);
        }
    });

    it("gives build mode words to order, never bare punctuation tiles", () => {
        // A '?' tile is not a word, and leaving it in the bank keeps the Check
        // answer button disabled with nothing on screen explaining why.
        for (const c of cases) {
            if (!c.wordBank) continue;
            for (const tile of toWordTiles(c.wordBank)) {
                expect(tile, `case ${c.id} offers "${tile}" as a word tile`).toMatch(/[\p{L}\p{N}]/u);
            }
        }
    });

    it("stays winnable in build mode once punctuation tiles are dropped", () => {
        // Placing every remaining tile in the right order has to produce an
        // accepted answer, comparing the way the game does — ignoring
        // punctuation and case.
        const normalize = (v: string) =>
            v
                .toLowerCase()
                .replace(/[\u2019\u2018]/g, "'")
                .replace(/[.,!?;:"]/g, "")
                .replace(/\s+/g, " ")
                .trim();

        for (const c of cases) {
            if (!c.wordBank) continue;
            const tiles = toWordTiles(c.wordBank);
            expect(tiles.length, `case ${c.id} has no word tiles left`).toBeGreaterThan(0);

            const accepted = [c.healthy, ...(c.acceptable ?? [])].map((a) =>
                normalize(a).split(" ").sort().join("|")
            );
            const built = tiles.map((t) => normalize(t)).filter(Boolean).sort().join("|");
            expect(accepted, `case ${c.id} tiles: ${tiles.join(" ")}`).toContain(built);
        }
    });

    describe("Week 1 First Aid preset", () => {
        const deck = filterDeck(cases, {
            ...WEEK_1_FIRST_AID,
            focuses: [...WEEK_1_FIRST_AID.focuses],
        });

        it("fills a 5-case round without the widen fallback", () => {
            expect(deck.length).toBeGreaterThanOrEqual(5);
        });

        it("serves only the two errors it promises", () => {
            for (const c of deck) {
                expect(["subject-verb-agreement", "be-vs-do"]).toContain(c.grammarFocus);
            }
        });

        it("stays at beginner tier and inside the preset's ceiling", () => {
            for (const c of deck) {
                expect(c.tier ?? "beginner").toBe("beginner");
                expect(c.complexity ?? 3).toBeLessThanOrEqual(WEEK_1_FIRST_AID.complexity);
            }
        });

        it("still opens on the gentlest cases in the deck", () => {
            // Raising the ceiling must not cost beginners the easy entry: the
            // round is sorted easiest-first, so the opener stays at the floor.
            const floor = Math.min(...deck.map((c) => c.complexity ?? 3));
            for (let i = 0; i < 20; i += 1) {
                const round = sampleRound(deck, FIRST_AID_ROUND_SIZE);
                expect(round[0].complexity ?? 3).toBe(floor);
            }
        });

        it("ramps within the round instead of dealing one flat difficulty", () => {
            const ceiling = Math.max(...deck.map((c) => c.complexity ?? 3));
            for (let i = 0; i < 20; i += 1) {
                const round = sampleRound(deck, FIRST_AID_ROUND_SIZE);
                expect(round).toHaveLength(FIRST_AID_ROUND_SIZE);

                const levels = round.map((c) => c.complexity ?? 3);
                // Sorted easiest-first, and it actually reaches the hard end.
                expect([...levels].sort((a, b) => a - b)).toEqual(levels);
                expect(levels[levels.length - 1]).toBe(ceiling);
                expect(new Set(levels).size).toBeGreaterThan(1);
            }
        });

        it("includes real missing third-person -s practice", () => {
            const sva = deck.filter((c) => c.grammarFocus === "subject-verb-agreement");
            expect(sva.length).toBeGreaterThanOrEqual(3);
            // These have no helper verb, so the helper step must not appear.
            for (const c of sva) expect(shouldSkipHelper(c)).toBe(true);
        });

        it("includes is/does mix-up practice that keeps the helper step", () => {
            const beDo = deck.filter((c) => c.grammarFocus === "be-vs-do");
            expect(beDo.length).toBeGreaterThanOrEqual(3);
            for (const c of beDo) expect(shouldSkipHelper(c)).toBe(false);
        });
    });

    describe("Week 3 Helper Verb Repair preset", () => {
        it("still fills a round without the widen fallback", () => {
            const deck = filterDeck(cases, { ...HELPER_REPAIR, focuses: [...HELPER_REPAIR.focuses] });
            expect(deck.length).toBeGreaterThanOrEqual(5);
            for (const c of deck) {
                expect(["do-does", "be-vs-do"]).toContain(c.grammarFocus);
            }
        });
    });

    it("keeps the beginner tier genuinely beginner", () => {
        for (const c of beginnerCases) {
            expect(c.tier ?? "beginner", `case ${c.id}`).toBe("beginner");
        }
    });

    /**
     * Verbs whose simple past is spelled like the bare form. "It cost five
     * dollars." is a correct PAST sentence, so marking it a third-person -s
     * error fails the learner who read it that way. A present-time marker
     * ("every day", "usually") rules the past reading out; without one these
     * sentences have two right answers and only one is accepted.
     */
    const PAST_EQUALS_BASE = [
        "cost", "cut", "put", "hit", "let", "set", "shut", "read", "hurt",
        "quit", "split", "spread", "bet", "cast", "burst", "upset", "shed",
    ];
    const PRESENT_TIME_MARKERS = [
        "every", "always", "usually", "often", "sometimes", "never",
        "each", "daily", "rarely", "seldom", "now",
    ];

    it("never asks for third-person -s on a sentence that is valid past tense", () => {
        for (const c of cases) {
            if (!c.errorTags.includes("verb-form")) continue;
            const words: string[] = c.unhealthy.toLowerCase().match(/[a-z']+/g) ?? [];
            const ambiguous = words.filter((w) => PAST_EQUALS_BASE.includes(w));
            if (ambiguous.length === 0) continue;
            const hasMarker = PRESENT_TIME_MARKERS.some((m) => words.includes(m));
            expect(
                hasMarker,
                `case ${c.id} ("${c.unhealthy}") uses "${ambiguous.join(", ")}", ` +
                    `whose past tense is spelled the same. Without a present-time ` +
                    `marker the sentence is already correct as past tense, so a ` +
                    `learner who reads it that way is marked wrong.`
            ).toBe(true);
        }
    });
});
