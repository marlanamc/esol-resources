import type {
    InteractiveGuideContent,
    InteractiveGuideSection,
    MiniQuizQuestion,
} from "@/types/activity";
import { presentPerfectContinuousContent } from "@/content/grammar/present-perfect-continuous";
import { presentPerfectContent } from "@/content/grammar/present-perfect";

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

const simpleSections = presentPerfectContent.sections?.map((section, index) =>
    cloneSection("simple", section, index)
) ?? [];

const continuousSections = presentPerfectContinuousContent.sections?.map((section, index) =>
    cloneSection("continuous", section, index)
) ?? [];

const combinedMiniQuiz: MiniQuizQuestion[] = [
    ...(presentPerfectContent.miniQuiz?.map((quiz, index) => cloneQuiz("simple", quiz, index)) ?? []),
    ...(presentPerfectContinuousContent.miniQuiz?.map((quiz, index) => cloneQuiz("continuous", quiz, index)) ?? []),
];

export const presentPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "family-intro",
            title: "Present Perfect Family",
            icon: "🧩",
            explanation: `
                <p>Use the Present Perfect Family to link the past and the present. The simple form shows the result or experience, while the continuous form highlights how long an activity has been happening.</p>
                <p>Start with the complete Present Perfect review, then continue through the Present Perfect Continuous activities at the end.</p>
            `,
        },
        ...simpleSections,
        ...continuousSections,
        {
            id: "family-comparison",
            title: "Comparison: Result vs Duration",
            icon: "⚖️",
            explanation: `
                <p>Ask: “What result?” → simple. “How long?” → continuous.</p>
            `,
            comparison: {
                title: "Present Perfect Simple vs Continuous",
                leftLabel: "Simple",
                rightLabel: "Continuous",
                rows: [
                    {
                        label: "Focus",
                        left: "Result, completion, experience",
                        right: "Duration, ongoing action",
                    },
                    {
                        label: "Question",
                        left: "What have you done?",
                        right: "How long have you been doing it?",
                    },
                    {
                        label: "Time words",
                        left: "already, yet, ever, never",
                        right: "for, since, lately",
                    },
                ],
            },
        },
        {
            id: "family-mixed",
            title: "Mixed Practice",
            icon: "🧠",
            explanation: "<p>Use both forms with the clues you learned.</p>",
            exercises: [
                {
                    title: "Select the Right Form",
                    items: [
                        {
                            type: "radio",
                            label: "You have been finishing the report for two hours.",
                            options: [
                                { value: "simple", label: "Present Perfect Simple" },
                                { value: "continuous", label: "Present Perfect Continuous" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "She has already submitted the checklist.",
                            options: [
                                { value: "simple", label: "Present Perfect Simple" },
                                { value: "continuous", label: "Present Perfect Continuous" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: combinedMiniQuiz.slice(0, 15),
};
