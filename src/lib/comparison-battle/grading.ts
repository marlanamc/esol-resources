import { areExerciseAnswersEquivalent } from "@/lib/exercise-answer-normalization";

export interface ErrorRepairItem {
    answer: string;
    correct: string;
    acceptableAnswers?: string[];
}

export function gradeErrorRepair(input: string, item: ErrorRepairItem): boolean {
    const trimmed = input.trim();
    if (!trimmed) return false;

    const candidates = [item.answer, item.correct, ...(item.acceptableAnswers ?? [])];
    return candidates.some((candidate) => areExerciseAnswersEquivalent(trimmed, candidate));
}

export function gradeFillInBlank(input: string, validAnswers: readonly string[]): boolean {
    const trimmed = input.trim();
    if (!trimmed) return false;
    return validAnswers.some((candidate) => areExerciseAnswersEquivalent(trimmed, candidate));
}
