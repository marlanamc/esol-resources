import type { InteractiveGuideContent } from "@/types/activity";

export const futureContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Welcome! Let's Learn Future Continuous Together",
            icon: "📚",
            explanation: `
                <p>We're going to learn Future Continuous step by step. Don't worry - we'll practice each part before moving to the next!</p>
                <p><strong>What is Future Continuous?</strong> Actions that will be in progress at a specific time in the future.</p>
            `,
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Future Continuous?",
            icon: "⭐",
            usageMeanings: [
                {
                    title: "⏩ 1. Action in Progress at Future Time",
                    description: "Something will be happening at a specific future time",
                    examples: [
                        { sentence: "I <strong>will be studying</strong> at 8pm tonight.", explanation: "✓ In progress at specific future time" },
                        { sentence: "She <strong>will be working</strong> tomorrow at noon.", explanation: "✓ Future ongoing action" },
                    ],
                },
            ],
            tipBox: { title: "💡 Remember", content: "Future Continuous = action IN PROGRESS at specific future time. Future Simple = general future action." },
        },
        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `<p>Formula: <strong>will be + verb-ing</strong></p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: ["I will be working.", "She will be studying.", "They will be playing."],
            exercises: [{
                id: "ex-1",
                title: "Exercise 1",
                instructions: "Complete with will be + verb-ing",
                items: [
                    { type: "text", label: "1. I ___ (study) at 9pm.", placeholder: "will be + ing", expectedAnswer: "will be studying" },
                ],
            }],
        },
        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: ["I won't be working.", "They won't be playing."],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "be + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: ["Will you be working?", "Will she be studying?"],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `<ul class="list-disc pl-6"><li><strong>Use:</strong> Actions in progress at specific future time</li><li><strong>Form:</strong> will be + verb-ing</li></ul>`,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which is correct?",
            options: [
                { value: "a", label: "I will be study at 8pm." },
                { value: "b", label: "I will be studying at 8pm." },
            ],
            correctAnswer: "b",
            explanation: "Use will be + verb-ing.",
        },
    ],
};
