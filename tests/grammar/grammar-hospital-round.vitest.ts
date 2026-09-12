import { describe, expect, it } from "vitest";
import type { GrammarHospitalCase } from "@/types/activity";
import {
    getCaseStepInfo,
    getInitialCasePhase,
    sampleRound,
    shouldSkipHelper,
} from "@/lib/grammar-hospital/progression";
import { getHelperOptions, resolveCorrectHelper } from "@/lib/grammar-hospital/helpers";

function caseStub(overrides: Partial<GrammarHospitalCase>): GrammarHospitalCase {
    return {
        id: "test",
        sentenceType: "question",
        pattern: "action",
        unhealthy: "Are they work?",
        errorTags: ["wrong-helper"],
        correctHelper: "do",
        healthy: "Do they work?",
        explanation: "Use DO for actions.",
        ...overrides,
    };
}

describe("shouldSkipHelper", () => {
    it("skips the helper step when the case has no helper verb", () => {
        // A dropped third-person -s has no helper to choose; asking for one
        // would teach the wrong lesson about the actual error.
        const noHelper = caseStub({
            correctHelper: undefined,
            sentenceType: "statement",
            unhealthy: "She work here.",
            healthy: "She works here.",
            errorTags: ["verb-form"],
            complexity: 2,
        });
        expect(shouldSkipHelper(noHelper)).toBe(true);
        // Diagnose still runs — a -s error is worth naming before fixing.
        expect(getInitialCasePhase(noHelper)).toBe("diagnose");
    });

    it("opens straight on repair when both earlier steps are skipped", () => {
        const gapped = caseStub({
            correctHelper: undefined,
            errorTags: ["verb-form"],
            unhealthy: "She ___ here.",
            healthy: "She works here.",
        });
        expect(getInitialCasePhase(gapped)).toBe("repair");
        expect(getCaseStepInfo(gapped, "repair")).toEqual({ stepNumber: 1, totalSteps: 1 });
    });

    it("keeps the helper step when a helper is specified", () => {
        expect(shouldSkipHelper(caseStub({ complexity: 3 }))).toBe(false);
    });

    it("counts steps without the skipped helper", () => {
        const noHelper = caseStub({
            correctHelper: undefined,
            errorTags: ["verb-form"],
            complexity: 3,
            unhealthy: "She work here.",
            healthy: "She works here.",
        });
        // diagnose + repair, no helper.
        expect(getCaseStepInfo(noHelper, "diagnose")).toEqual({ stepNumber: 1, totalSteps: 2 });
        expect(getCaseStepInfo(noHelper, "repair")).toEqual({ stepNumber: 2, totalSteps: 2 });
        // Feedback shares the repair step rather than inventing a fourth.
        expect(getCaseStepInfo(noHelper, "feedback")).toEqual({ stepNumber: 2, totalSteps: 2 });
    });

    it("still reports three steps when nothing is skipped", () => {
        const full = caseStub({ complexity: 3, errorTags: ["wrong-helper", "verb-form"] });
        expect(getCaseStepInfo(full, "helper")).toEqual({ stepNumber: 2, totalSteps: 3 });
        expect(getCaseStepInfo(full, "repair")).toEqual({ stepNumber: 3, totalSteps: 3 });
    });
});

describe("getHelperOptions", () => {
    // The picker used to render the beginner five for every case, so any case
    // needing did/were/have/had/will could not be answered at all.
    it.each(["did", "were", "have", "had", "will", "could"] as const)(
        "always offers the correct helper (%s)",
        (helper) => {
            const item = caseStub({ correctHelper: helper, tier: "advanced" });
            expect(getHelperOptions(item)).toContain(helper);
        }
    );

    it("offers the correct helper for every beginner case", () => {
        for (const helper of ["do", "does", "am", "is", "are", "be"] as const) {
            const item = caseStub({ correctHelper: helper, tier: "beginner" });
            expect(getHelperOptions(item)).toContain(resolveCorrectHelper(helper));
        }
    });

    it("returns plausible distractors, not the whole helper list", () => {
        const options = getHelperOptions(caseStub({ correctHelper: "did", tier: "intermediate" }));
        expect(options.length).toBeGreaterThan(1);
        expect(options.length).toBeLessThanOrEqual(5);
        expect(new Set(options).size).toBe(options.length);
    });

    it("returns nothing when the case has no helper", () => {
        expect(getHelperOptions(caseStub({ correctHelper: undefined }))).toEqual([]);
    });
});

describe("sampleRound", () => {
    const deck = Array.from({ length: 20 }, (_, i) =>
        caseStub({ id: `c${i}`, complexity: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5 })
    );

    it("returns exactly roundSize cases drawn from the deck", () => {
        const round = sampleRound(deck, 5);
        expect(round).toHaveLength(5);
        const ids = new Set(deck.map((c) => c.id));
        for (const c of round) expect(ids.has(c.id)).toBe(true);
        expect(new Set(round.map((c) => c.id)).size).toBe(5);
    });

    it("orders the sampled round easiest-first", () => {
        const complexities = sampleRound(deck, 6).map((c) => c.complexity ?? 3);
        expect([...complexities].sort((a, b) => a - b)).toEqual(complexities);
    });

    it("returns the whole deck when no round size is set", () => {
        expect(sampleRound(deck)).toHaveLength(deck.length);
    });

    it("returns the whole deck when it is smaller than the round", () => {
        expect(sampleRound(deck.slice(0, 3), 5)).toHaveLength(3);
    });

    it("varies which cases appear across replays", () => {
        // Guards the reason sampling happens before sorting: an optional
        // practice item a learner replays should not be the same five every time.
        const seen = new Set<string>();
        for (let i = 0; i < 25; i++) {
            seen.add(sampleRound(deck, 5).map((c) => c.id).join(","));
        }
        expect(seen.size).toBeGreaterThan(1);
    });
});
