import { describe, expect, it } from "vitest";
import { QUIZ_VERB_SETS } from "@/data/verb-quiz-sets";
import { getWeekVerbs } from "@/lib/week-verbs";

describe("getWeekVerbs", () => {
    it("has V2 and V3 forms for every quiz verb", () => {
        const ids = QUIZ_VERB_SETS.map((_, index) => `verb-quiz-${index + 1}`);
        for (const id of ids) {
            for (const verb of getWeekVerbs([id])) {
                expect(verb.v2, `${verb.v1} V2`).not.toBe("");
                expect(verb.v3, `${verb.v1} V3`).not.toBe("");
            }
        }
    });

    it("lists new verbs first and marks the review verb", () => {
        const verbs = getWeekVerbs(["word-lab", "verb-quiz-16"]);
        expect(verbs.map((verb) => [verb.v1, verb.isReview])).toEqual([
            ["become", false],
            ["lead", false],
            ["go", true],
        ]);
        expect(verbs[0]).toMatchObject({ v2: "became", v3: "become" });
    });

    it("returns nothing for a week without a verb quiz", () => {
        expect(getWeekVerbs(["word-lab"])).toEqual([]);
    });
});
