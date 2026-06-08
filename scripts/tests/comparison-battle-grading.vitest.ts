import { describe, expect, it } from "vitest";
import { gradeErrorRepair, gradeFillInBlank } from "@/lib/comparison-battle/grading";

const elephantRepair = {
    answer: "bigger",
    correct: "The elephant is bigger than the dog.",
};

describe("comparison-battle grading", () => {
    describe("gradeErrorRepair", () => {
        it("accepts the repair fragment", () => {
            expect(gradeErrorRepair("bigger", elephantRepair)).toBe(true);
        });

        it("accepts the full corrected sentence", () => {
            expect(gradeErrorRepair("The elephant is bigger than the dog.", elephantRepair)).toBe(true);
        });

        it("accepts optional acceptable answers", () => {
            expect(
                gradeErrorRepair("the biggest", {
                    answer: "biggest",
                    correct: "The elephant is the biggest.",
                    acceptableAnswers: ["the biggest"],
                })
            ).toBe(true);
        });

        it("rejects incorrect repairs", () => {
            expect(gradeErrorRepair("taller", elephantRepair)).toBe(false);
            expect(gradeErrorRepair("more bigger", elephantRepair)).toBe(false);
        });

        it("rejects empty input", () => {
            expect(gradeErrorRepair("   ", elephantRepair)).toBe(false);
        });
    });

    describe("gradeFillInBlank", () => {
        it("accepts valid comparative phrases", () => {
            expect(gradeFillInBlank("taller than", ["taller than"])).toBe(true);
            expect(gradeFillInBlank("stronger than", ["stronger than"])).toBe(true);
        });

        it("accepts valid superlative phrases", () => {
            expect(gradeFillInBlank("the fastest", ["the fastest"])).toBe(true);
            expect(gradeFillInBlank("the most difficult", ["the most difficult"])).toBe(true);
            expect(gradeFillInBlank("the biggest", ["the biggest"])).toBe(true);
        });

        it("rejects keyword-style false positives from the old validator", () => {
            expect(gradeFillInBlank("more taller than", ["taller than"])).toBe(false);
            expect(gradeFillInBlank("the most harder", ["the most difficult"])).toBe(false);
            expect(gradeFillInBlank("anything than anything", ["taller than"])).toBe(false);
        });

        it("rejects empty input", () => {
            expect(gradeFillInBlank("", ["taller than"])).toBe(false);
        });
    });
});
