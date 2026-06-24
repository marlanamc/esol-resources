import { describe, expect, it } from "vitest";
import { runAnswerIntegrityRules } from "@/lib/grammar-guide-audit/rules-answer-integrity";
import type { LoadedGuide } from "@/lib/grammar-guide-audit/types";
import type { InteractiveGuideContent } from "@/types/activity";

function makeGuide(content: InteractiveGuideContent): LoadedGuide {
    return {
        slug: "test-guide",
        scope: {
            slug: "test-guide",
            title: "Test Guide",
            weekNumber: 1,
            itemId: "test",
            href: "/grammar-reader/test-guide",
        },
        content,
        contentPath: "test-guide.ts",
        contentSource: "",
        pagePath: null,
        pageSource: null,
        imageModulePath: null,
        exportName: "testGuideContent",
    };
}

describe("runAnswerIntegrityRules", () => {
    it("flags a word-scramble whose stem states the full answer", () => {
        const guide = makeGuide({
            type: "interactive-guide",
            sections: [],
            miniQuiz: [
                {
                    id: "q1",
                    type: "word-scramble",
                    question:
                        "Rosa was cooking when her phone rang. Put the words in order to tell what happened.",
                    words: ["Rosa", "was", "cooking", "when", "her", "phone", "rang"],
                    correctAnswer: "Rosa was cooking when her phone rang",
                },
            ],
        });

        const findings = runAnswerIntegrityRules(guide);
        expect(
            findings.some((finding) => finding.ruleId === "answer-leaked-in-question-stem"),
        ).toBe(true);
    });

    it("flags answers recycled from section explanation HTML", () => {
        const guide = makeGuide({
            type: "interactive-guide",
            sections: [
                {
                    title: "Background actions",
                    explanation:
                        "<p>The classic pair: <strong>I was cooking dinner when my phone rang.</strong></p>",
                },
            ],
            miniQuiz: [
                {
                    id: "q1",
                    type: "fill-blank",
                    question: "Complete: ___ (build the sentence about last night).",
                    correctAnswer: "I was cooking dinner when my phone rang",
                },
            ],
        });

        const findings = runAnswerIntegrityRules(guide);
        const recycled = findings.find(
            (finding) => finding.ruleId === "answer-recycled-from-explanation-text",
        );
        expect(recycled).toBeDefined();
        expect(recycled?.message).toContain("sections[0].explanation");
    });

    it("flags answers recycled from section titles", () => {
        const guide = makeGuide({
            type: "interactive-guide",
            sections: [
                {
                    title: "If I had day shifts, I would sleep more",
                    exercises: [
                        {
                            title: "Practice",
                            items: [
                                {
                                    type: "word-scramble",
                                    label: "Build the sentence about Yemi's wish.",
                                    words: ["If", "I", "had", "day", "shifts", "I", "would", "sleep", "more"],
                                    correctAnswer: "If I had day shifts, I would sleep more",
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        const findings = runAnswerIntegrityRules(guide);
        const recycled = findings.find(
            (finding) => finding.ruleId === "answer-recycled-from-explanation-text",
        );
        expect(recycled).toBeDefined();
        expect(recycled?.message).toContain("sections[0].title");
    });

    it("resolves radio correctAnswer values to option labels before comparing", () => {
        const guide = makeGuide({
            type: "interactive-guide",
            sections: [
                {
                    title: "Choosing forms",
                    explanation: "<p>She has worked at the hotel since 2022.</p>",
                },
            ],
            miniQuiz: [
                {
                    id: "q1",
                    question: "Which sentence is correct?",
                    options: [
                        { value: "a", label: "She has worked at the hotel since 2022." },
                        { value: "b", label: "She works at the hotel since 2022." },
                    ],
                    correctAnswer: "a",
                },
            ],
        });

        const findings = runAnswerIntegrityRules(guide);
        expect(
            findings.some(
                (finding) => finding.ruleId === "answer-recycled-from-explanation-text",
            ),
        ).toBe(true);
    });

    it("ignores short answers below the sentence threshold", () => {
        const guide = makeGuide({
            type: "interactive-guide",
            sections: [
                {
                    title: "Short answers",
                    explanation: "<p>Use 'has worked' for present perfect.</p>",
                },
            ],
            miniQuiz: [
                {
                    id: "q1",
                    type: "fill-blank",
                    question: "She ___ (work) here since 2022. She has worked here a long time.",
                    correctAnswer: "has worked",
                },
            ],
        });

        expect(runAnswerIntegrityRules(guide)).toEqual([]);
    });
});
