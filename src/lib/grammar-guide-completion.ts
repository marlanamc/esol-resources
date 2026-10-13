import type { Exercise, InteractiveGuideContent } from "@/types/activity";

/** Exercise id saved by /api/grammar/exercise-progress; ExerciseSection reports the same value. */
export function getGuideExerciseId(exercise: Pick<Exercise, "title">, exerciseIndex: number): string {
    return exercise.title
        ? exercise.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : `exercise-${exerciseIndex}`;
}

/** Every `${sectionId}:${exerciseId}` key a learner must finish before the guide counts as done. */
export function getGuideExerciseKeys(content: InteractiveGuideContent): string[] {
    return content.sections.flatMap((section, sectionIndex) => {
        const sectionId = section.id || `section-${sectionIndex}`;
        return (section.exercises ?? []).map(
            (exercise, exerciseIndex) => `${sectionId}:${getGuideExerciseId(exercise, exerciseIndex)}`
        );
    });
}

/**
 * A guide earns its checkmark only when every practice exercise is finished
 * and the mini-quiz (if the guide has one) has been submitted.
 */
export function getGuideWorkRemaining(
    content: InteractiveGuideContent,
    finishedExerciseKeys: ReadonlySet<string>,
    quizSubmitted: boolean
): { exercisesLeft: number; quizLeft: boolean; done: boolean } {
    const exercisesLeft = getGuideExerciseKeys(content).filter((key) => !finishedExerciseKeys.has(key)).length;
    const quizLeft = Boolean(content.miniQuiz?.length) && !quizSubmitted;
    return { exercisesLeft, quizLeft, done: exercisesLeft === 0 && !quizLeft };
}
