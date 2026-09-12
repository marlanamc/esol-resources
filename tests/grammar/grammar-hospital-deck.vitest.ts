import { describe, expect, it } from "vitest";
import { beginnerCases, cases } from "../../prisma/grammar-hospital-cases";
import { filterDeck, shouldSkipHelper } from "@/lib/grammar-hospital/progression";
import { getHelperOptions, resolveCorrectHelper } from "@/lib/grammar-hospital/helpers";

/**
 * Guards the shipped deck, not the engine.
 *
 * The Course Map presets narrow the deck by tier + complexity + focus. If a
 * preset's filter matches too little, filterDeck silently widens back to the
 * whole tier and the learner gets a grab bag instead of the focused round the
 * preset promised — with nothing in the UI to signal it.
 */
const WEEK_1_FIRST_AID = {
    tier: "beginner" as const,
    complexity: 2,
    focuses: ["subject-verb-agreement", "be-vs-do"] as const,
};

const HELPER_REPAIR = {
    tier: "beginner" as const,
    complexity: 2,
    focuses: ["do-does", "be-vs-do"] as const,
};

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

        it("stays at beginner tier and gentle complexity", () => {
            for (const c of deck) {
                expect(c.tier ?? "beginner").toBe("beginner");
                expect(c.complexity ?? 3).toBeLessThanOrEqual(2);
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
});
