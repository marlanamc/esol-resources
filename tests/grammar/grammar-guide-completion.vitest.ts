import { describe, expect, it } from "vitest";
import type { InteractiveGuideContent } from "@/types/activity";
import { getGuideExerciseKeys, getGuideWorkRemaining } from "@/lib/grammar-guide-completion";

const content = {
    sections: [
        { id: "intro", exercises: [{ title: "Pick the Verb!", items: [] }, { items: [] }] },
        { exercises: [{ title: "Fix it", items: [] }] },
        { id: "reading" },
    ],
    miniQuiz: [{}],
} as unknown as InteractiveGuideContent;

describe("grammar guide completion", () => {
    it("uses the same keys the exercise-progress route saves", () => {
        expect(getGuideExerciseKeys(content)).toEqual([
            "intro:pick-the-verb",
            "intro:exercise-1",
            "section-1:fix-it",
        ]);
    });

    it("needs every exercise and the mini-quiz", () => {
        const all = new Set(getGuideExerciseKeys(content));
        expect(getGuideWorkRemaining(content, all, false)).toEqual({ exercisesLeft: 0, quizLeft: true, done: false });
        expect(getGuideWorkRemaining(content, new Set(["intro:pick-the-verb"]), true)).toEqual({ exercisesLeft: 2, quizLeft: false, done: false });
        expect(getGuideWorkRemaining(content, all, true).done).toBe(true);
    });

    it("does not wait on a quiz the guide does not have", () => {
        const noQuiz = { ...content, miniQuiz: undefined };
        expect(getGuideWorkRemaining(noQuiz, new Set(getGuideExerciseKeys(noQuiz)), false).done).toBe(true);
    });
});
