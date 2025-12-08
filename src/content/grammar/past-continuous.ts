import type { InteractiveGuideContent } from "@/types/activity";

export const pastContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Welcome! Let's Learn Past Continuous Together",
            icon: "📚",
            explanation: `
                <p>We're going to learn Past Continuous step by step. Don't worry - we'll practice each part before moving to the next!</p>
                <p><strong>What is Past Continuous?</strong> Actions that were in progress at a specific time in the past.</p>
            `,
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Past Continuous?",
            icon: "⭐",
            usageMeanings: [
                {
                    title: "⏸️ 1. Action in Progress in the Past",
                    description: "Something was happening at a specific past time",
                    examples: [
                        { sentence: "I <strong>was studying</strong> at 8pm last night.", explanation: "✓ In progress at specific past time" },
                        { sentence: "They <strong>were watching</strong> TV when I called.", explanation: "✓ Ongoing past action" },
                    ],
                },
                {
                    title: "⚡ 2. Interrupted Actions",
                    description: "Longer action interrupted by shorter action",
                    examples: [
                        { sentence: "I <strong>was eating</strong> when the phone rang.", explanation: "✓ Eating (longer) interrupted by phone (shorter)" },
                    ],
                },
            ],
            tipBox: { title: "💡 Remember", content: "Past Continuous = action IN PROGRESS in the past. Past Simple = completed action." },
        },
        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `<p>Formula: <strong>was/were + verb-ing</strong></p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "was/were", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: ["I was working.", "You were studying.", "She was eating.", "They were playing."],
            exercises: [{
                id: "ex-1",
                title: "Exercise 1",
                instructions: "Complete with was/were + verb-ing",
                items: [
                    { type: "text", label: "1. I ___ (study) at 9pm.", placeholder: "was/were + ing", expectedAnswer: "was studying" },
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
                { text: "wasn't/weren't", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: ["I wasn't working.", "They weren't playing."],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            formula: [
                { text: "Was/Were", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: ["Were you working?", "Was she eating?"],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `<ul class="list-disc pl-6"><li><strong>Use:</strong> Actions in progress at specific past time</li><li><strong>Form:</strong> was/were + verb-ing</li></ul>`,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which is correct?",
            options: [
                { value: "a", label: "I was study at 8pm." },
                { value: "b", label: "I was studying at 8pm." },
            ],
            correctAnswer: "b",
            explanation: "Use was/were + verb-ing.",
        },
    ],
};
