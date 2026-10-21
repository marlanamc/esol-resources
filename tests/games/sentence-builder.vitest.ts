import { describe, expect, it } from "vitest";
import type { SentenceBuilderContent, SentenceBuilderPickRound, SentenceBuilderPlaceRound } from "@/types/activity";
import { isSentenceBuilderContent } from "@/types/activity";
import { checkPick, checkPlace, dealRounds, fillTemplate, isBlank, placeWord } from "@/lib/sentence-builder/rounds";
import { SENTENCE_BUILDER_DECKS } from "@/content/sentence-builder";

const usually: SentenceBuilderPlaceRound = {
    kind: "place",
    id: "t-usually",
    words: ["I", "drink", "coffee."],
    word: "usually",
    answer: 1,
    also: [{ slot: 0, note: "Also correct!" }],
    rule: "A",
};

describe("checkPlace", () => {
    it("accepts the main slot without a note", () => {
        expect(checkPlace(usually, 1)).toEqual({ correct: true });
    });

    it("accepts an also-correct slot with its note", () => {
        expect(checkPlace(usually, 0)).toEqual({ correct: true, note: "Also correct!" });
    });

    it("rejects other slots", () => {
        expect(checkPlace(usually, 2).correct).toBe(false);
        expect(checkPlace(usually, 3).correct).toBe(false);
    });
});

describe("placeWord", () => {
    it("inserts mid-sentence", () => {
        expect(placeWord(usually, 1).join(" ")).toBe("I usually drink coffee.");
    });

    it("capitalizes a first word and keeps I", () => {
        expect(placeWord(usually, 0).join(" ")).toBe("Usually I drink coffee.");
    });

    it("lowercases the old first word unless it is I", () => {
        const we = { ...usually, words: ["We", "eat", "dinner."], word: "sometimes" };
        expect(placeWord(we, 0).join(" ")).toBe("Sometimes we eat dinner.");
    });

    it("moves the final punctuation when placed at the end", () => {
        const we = { ...usually, words: ["We", "eat", "dinner", "together."], word: "sometimes" };
        expect(placeWord(we, 4).join(" ")).toBe("We eat dinner together sometimes.");
    });
});

describe("checkPick", () => {
    const round: SentenceBuilderPickRound = {
        kind: "pick",
        id: "t-pick",
        parts: ["We", { options: ["don't usually", "usually don't", "don't never"], answer: 0, also: [1] }, "work.", { options: ["a", "b"], answer: 1 }],
        rule: "C",
    };

    it("accepts the main answer and also-correct answers", () => {
        expect(checkPick(round, [0, 1]).correct).toBe(true);
        expect(checkPick(round, [1, 1]).correct).toBe(true);
    });

    it("reports which gaps are wrong or empty", () => {
        expect(checkPick(round, [2, 1])).toEqual({ correct: false, wrong: [0] });
        expect(checkPick(round, [0, undefined])).toEqual({ correct: false, wrong: [1] });
    });
});

describe("fillTemplate", () => {
    it("puts the choice into the sentence", () => {
        expect(fillTemplate({ kind: "true", id: "t", question: "?", choices: [], template: "I {choice} eat breakfast." }, "usually")).toBe(
            "I usually eat breakfast."
        );
    });
});

describe("dealRounds", () => {
    // Deterministic pseudo-random so the deal is repeatable.
    function seeded(seed: number) {
        return () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
    }

    for (const deck of SENTENCE_BUILDER_DECKS) {
        it(`deals 8 different rounds from ${deck.id}, ending with a make-it-true round`, () => {
            for (let s = 1; s <= 20; s++) {
                const dealt = dealRounds(deck.content.rounds, 8, seeded(s));
                expect(dealt).toHaveLength(8);
                expect(new Set(dealt.map((r) => r.id)).size).toBe(8);
                expect(dealt[dealt.length - 1].kind).toBe("true");
                expect(dealt.some((r) => r.kind === "place")).toBe(true);
                expect(dealt.some((r) => r.kind === "pick")).toBe(true);
            }
        });
    }

    it("never deals more rounds than the deck has", () => {
        expect(dealRounds([usually], 8)).toHaveLength(1);
    });
});

describe("Sentence Builder content", () => {
    for (const deck of SENTENCE_BUILDER_DECKS) {
        describe(deck.id, () => {
            const content: SentenceBuilderContent = deck.content;

            it("passes the content guard", () => {
                expect(isSentenceBuilderContent(JSON.parse(JSON.stringify(content)))).toBe(true);
            });

            it("has unique round ids", () => {
                const ids = content.rounds.map((r) => r.id);
                expect(new Set(ids).size).toBe(ids.length);
            });

            it("points every round at a rule card that exists", () => {
                for (const r of content.rounds) {
                    if (r.kind !== "true") expect(content.rules[r.rule], r.id).toBeDefined();
                }
            });

            it("keeps every answer in range", () => {
                for (const r of content.rounds) {
                    if (r.kind === "place") {
                        for (const slot of [r.answer, ...(r.also ?? []).map((a) => a.slot)]) {
                            expect(slot, r.id).toBeGreaterThanOrEqual(0);
                            expect(slot, r.id).toBeLessThanOrEqual(r.words.length);
                        }
                    }
                    if (r.kind === "pick") {
                        const blanks = r.parts.filter(isBlank);
                        expect(blanks.length, r.id).toBeGreaterThan(0);
                        for (const b of blanks) {
                            for (const i of [b.answer, ...(b.also ?? [])]) {
                                expect(b.options[i], r.id).toBeDefined();
                            }
                        }
                    }
                    if (r.kind === "true") {
                        expect(r.template, r.id).toContain("{choice}");
                        expect(r.choices.length, r.id).toBeGreaterThan(1);
                    }
                }
            });

            it("has enough of each kind for a full 8-round game", () => {
                expect(content.rounds.filter((r) => r.kind === "place").length).toBeGreaterThanOrEqual(3);
                expect(content.rounds.filter((r) => r.kind === "pick").length).toBeGreaterThanOrEqual(3);
                expect(content.rounds.filter((r) => r.kind === "true").length).toBeGreaterThanOrEqual(2);
            });
        });
    }
});
