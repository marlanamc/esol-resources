import { normalizeExerciseAnswer } from "@/lib/exercise-answer-normalization";
import type { ExerciseItem } from "@/types/activity";

type TextExerciseItem = Extract<ExerciseItem, { type: "text" }>;

export function getSafeExercisePlaceholder(
    item: Pick<TextExerciseItem, "placeholder" | "correctAnswer" | "expectedAnswer" | "expectedAnswers">,
    fallback = "Type your answer..."
): string {
    const placeholder = item.placeholder?.trim();

    if (!placeholder) {
        return fallback;
    }

    const normalizedPlaceholder = normalizeExerciseAnswer(placeholder);
    const normalizedAnswers = [
        item.correctAnswer,
        item.expectedAnswer,
        ...(item.expectedAnswers || []),
    ]
        .filter((answer): answer is string => Boolean(answer?.trim()))
        .map((answer) => normalizeExerciseAnswer(answer));

    if (normalizedAnswers.includes(normalizedPlaceholder)) {
        return fallback;
    }

    return item.placeholder ?? fallback;
}
