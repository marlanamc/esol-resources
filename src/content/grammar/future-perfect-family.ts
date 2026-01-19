import type {
    InteractiveGuideContent,
    InteractiveGuideSection,
    MiniQuizQuestion,
} from "@/types/activity";
import { futurePerfectContinuousContent } from "@/content/grammar/future-perfect-continuous";
import { futurePerfectContent } from "@/content/grammar/future-perfect";

const cloneSection = (
    prefix: string,
    section: InteractiveGuideSection,
    index: number
): InteractiveGuideSection => {
    const clonedExercises = section.exercises?.map((exercise, i) => ({
        ...exercise,
        id: exercise.id ? `${prefix}-${exercise.id}` : `${prefix}-ex-${index}-${i}`,
    }));

    return {
        ...section,
        id: section.id ? `${prefix}-${section.id}` : undefined,
        exercises: clonedExercises ?? section.exercises,
    };
};

const cloneQuiz = (prefix: string, question: MiniQuizQuestion, index: number): MiniQuizQuestion => ({
    ...question,
    id: question.id ? `${prefix}-${question.id}` : `${prefix}-quiz-${index}`,
});

const simpleSections = futurePerfectContent.sections?.map((section, index) =>
    cloneSection("simple", section, index)
) ?? [];

const continuousSections = futurePerfectContinuousContent.sections?.map((section, index) =>
    cloneSection("continuous", section, index)
) ?? [];

const combinedMiniQuiz: MiniQuizQuestion[] = [
    ...(futurePerfectContent.miniQuiz?.map((quiz, index) => cloneQuiz("simple", quiz, index)) ?? []),
    ...(futurePerfectContinuousContent.miniQuiz?.map((quiz, index) => cloneQuiz("continuous", quiz, index)) ?? []),
];

export const futurePerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "family-intro",
            title: "Future Perfect Family",
            icon: "🔮",
            explanation: `
                <p>Future Perfect tenses let us picture a future moment and look back. Start with the Future Perfect guide and continue straight into the Future Perfect Continuous review.</p>
            `,
        },
        ...simpleSections,
        ...continuousSections,
        {
            id: "family-comparison",
            title: "Comparison: Done vs Duration",
            icon: "⚖️",
            explanation: "<p>Simple = What will be done? Continuous = How long will it have been happening?</p>",
            comparison: {
                title: "Future Perfect Simple vs Continuous",
                leftLabel: "Simple",
                rightLabel: "Continuous",
                rows: [
                    { label: "Focus", left: "Completed action by future point", right: "Duration leading to future point" },
                    { label: "Question", left: "What will have happened?", right: "How long will it have been happening?" },
                    { label: "Words", left: "by, before, in", right: "for, by + duration" },
                ],
            },
        },
        {
            id: "family-summary",
            title: "Summary",
            icon: "📌",
            explanation: `
                <ul class="list-disc pl-6 space-y-1">
                    <li>Future Perfect Simple = will have + past participle</li>
                    <li>Future Perfect Continuous = will have been + verb-ing</li>
                    <li>Simple talks about deadlines; Continuous talks about the length of an ongoing effort.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: combinedMiniQuiz.slice(0, 15),
};
