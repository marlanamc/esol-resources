import type {
    InteractiveGuideContent,
    InteractiveGuideSection,
    MiniQuizQuestion,
} from "@/types/activity";
import { pastPerfectContinuousContent } from "@/content/grammar/past-perfect-continuous";
import { pastPerfectContent } from "@/content/grammar/past-perfect";

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

const simpleSections = pastPerfectContent.sections?.map((section, index) =>
    cloneSection("simple", section, index)
) ?? [];

const continuousSections = pastPerfectContinuousContent.sections?.map((section, index) =>
    cloneSection("continuous", section, index)
) ?? [];

const combinedMiniQuiz: MiniQuizQuestion[] = [
    ...(pastPerfectContent.miniQuiz?.map((quiz, index) => cloneQuiz("simple", quiz, index)) ?? []),
    ...(pastPerfectContinuousContent.miniQuiz?.map((quiz, index) => cloneQuiz("continuous", quiz, index)) ?? []),
];

export const pastPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "family-intro",
            title: "Past Perfect Family",
            icon: "🕰️",
            explanation: `
                <p>The Past Perfect Family traces two events in the past. Start with the Past Perfect review and finish with a look at the Past Perfect Continuous pages.</p>
            `,
        },
        ...simpleSections,
        ...continuousSections,
        {
            id: "family-comparison",
            title: "Comparison: Order vs Duration",
            icon: "⚖️",
            explanation: `
                <p>Answer: "What happened first?" → simple. "How long had it been happening?" → continuous.</p>
            `,
            comparison: {
                title: "Past Perfect Simple vs Continuous",
                leftLabel: "Simple",
                rightLabel: "Continuous",
                rows: [
                    { label: "Focus", left: "Result before the later past event", right: "Duration before that event" },
                    { label: "Question", left: "What had you done?", right: "How long had you been doing it?" },
                    { label: "Words", left: "already, by the time, before", right: "for, since, when" },
                ],
            },
        },
        {
            id: "family-summary",
            title: "Summary",
            icon: "🧾",
            explanation: `
                <ul class="list-disc pl-6 space-y-1">
                    <li>Past Perfect Simple = had + past participle</li>
                    <li>Past Perfect Continuous = had been + verb-ing</li>
                    <li>Simple tells what happened first; Continuous tells how long it had been happening.</li>
                </ul>
            `,
        },
    ],
    miniQuiz: combinedMiniQuiz.slice(0, 15),
};
