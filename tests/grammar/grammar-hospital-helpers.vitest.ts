import { describe, expect, it } from "vitest";
import type { GrammarHospitalCase } from "@/types/activity";
import {
    formatHelperOptionLabel,
    helperAtSentenceStart,
} from "@/lib/grammar-hospital/helpers";

function caseStub(overrides: Partial<GrammarHospitalCase>): GrammarHospitalCase {
    return {
        id: "test",
        sentenceType: "question",
        pattern: "action",
        unhealthy: "They work here?",
        errorTags: ["missing-word"],
        correctHelper: "do",
        healthy: "Do they work here?",
        explanation: "Use DO for actions.",
        ...overrides,
    };
}

describe("grammar-hospital helpers", () => {
    it("detects helpers at the start of the fixed sentence", () => {
        expect(helperAtSentenceStart(caseStub({ healthy: "Do they work here?" }))).toBe(true);
        expect(helperAtSentenceStart(caseStub({ healthy: "She doesn't like coffee." }))).toBe(false);
    });

    it("capitalizes labels only for sentence-start helpers", () => {
        expect(formatHelperOptionLabel("do", true)).toBe("Do");
        expect(formatHelperOptionLabel("is", true)).toBe("Is");
        expect(formatHelperOptionLabel("does", false)).toBe("does");
    });
});
