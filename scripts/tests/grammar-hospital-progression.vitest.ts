import { describe, expect, it } from "vitest";
import type { GrammarHospitalCase } from "@/types/activity";
import {
    getDiagnoseConfig,
    getInitialCasePhase,
    shouldSkipDiagnose,
    sortCasesProgressively,
} from "@/lib/grammar-hospital/progression";

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

describe("grammar-hospital progression", () => {
    it("skips diagnose for the gentlest wrong-helper cases", () => {
        const gentle = caseStub({ complexity: 1, errorTags: ["wrong-helper"] });
        expect(shouldSkipDiagnose(gentle)).toBe(true);
        expect(getInitialCasePhase(gentle)).toBe("helper");
        expect(getDiagnoseConfig(gentle).tags).toEqual([]);
    });

    it("skips diagnose when a word is missing and the fix is do/does/be", () => {
        const missing = caseStub({
            complexity: 2,
            errorTags: ["missing-word"],
            correctHelper: "does",
            unhealthy: "She not like coffee.",
        });
        expect(shouldSkipDiagnose(missing)).toBe(true);
        expect(getInitialCasePhase(missing)).toBe("helper");
    });

    it("skips diagnose when blanks telegraph the answer", () => {
        const blank = caseStub({
            errorTags: ["missing-word"],
            correctHelper: "does",
            unhealthy: "She ___ not like coffee.",
        });
        expect(shouldSkipDiagnose(blank)).toBe(true);
    });

    it("shows two options early and grows with complexity", () => {
        const easy = caseStub({ complexity: 2, errorTags: ["verb-form"] });
        expect(getDiagnoseConfig(easy).tags).toHaveLength(2);
        expect(getDiagnoseConfig(easy).multiSelect).toBe(false);

        const standard = caseStub({ complexity: 3, errorTags: ["verb-form"] });
        expect(getDiagnoseConfig(standard).tags).toHaveLength(3);

        const tricky = caseStub({ complexity: 4, errorTags: ["wrong-helper", "extra-word"] });
        expect(getDiagnoseConfig(tricky).tags).toHaveLength(4);
        expect(getDiagnoseConfig(tricky).multiSelect).toBe(true);
    });

    it("sorts patients from easiest to hardest", () => {
        const deck = sortCasesProgressively([
            caseStub({ id: "hard", complexity: 4 }),
            caseStub({ id: "easy", complexity: 1 }),
            caseStub({ id: "mid", complexity: 2 }),
        ]);
        expect(deck.map((c) => c.id)).toEqual(["easy", "mid", "hard"]);
    });
});
