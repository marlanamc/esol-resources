import type { InteractiveGuideContent } from "@/types/activity";

export const presentContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Welcome! Let's Learn Present Continuous Together",
            icon: "📚",
            explanation: `
                <p>We're going to learn Present Continuous step by step. Don't worry - we'll practice each part before moving to the next!</p>
                <p><strong>What is Present Continuous?</strong> It's used for actions happening RIGHT NOW or temporary situations.</p>
            `,
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Present Continuous?",
            icon: "⭐",
            usageMeanings: [
                {
                    title: "▶️ 1. Actions Happening NOW",
                    description: "Something happening at this exact moment",
                    examples: [
                        { sentence: "I <strong>am studying</strong> right now.", explanation: "✓ Happening at this moment" },
                        { sentence: "She <strong>is eating</strong> lunch.", explanation: "✓ Currently happening" },
                    ],
                },
                {
                    title: "⏳ 2. Temporary Situations",
                    description: "Situations that are temporary, not permanent",
                    examples: [
                        { sentence: "I <strong>am living</strong> with my parents this month.", explanation: "✓ Temporary situation" },
                        { sentence: "She <strong>is working</strong> at a cafe this summer.", explanation: "✓ Not permanent" },
                    ],
                },
            ],
            tipBox: { title: "💡 Key Difference", content: "Present Simple = general/habitual. Present Continuous = happening NOW or temporarily." },
        },
        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `<p>Formula: <strong>am/is/are + verb-ing</strong></p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "am/is/are", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I am working.",
                "You are studying.",
                "He is eating.",
                "She is reading.",
                "We are playing.",
                "They are watching TV.",
            ],
            verbTable: {
                title: "Spelling Rules for -ing",
                headers: ["Rule", "Examples"],
                rows: [
                    ["Most verbs: add -ing", "work → working, play → playing"],
                    ["Verbs ending in -e: drop -e, add -ing", "make → making, write → writing"],
                    ["One syllable, consonant-vowel-consonant: double last letter", "run → running, sit → sitting"],
                ],
            },
            exercises: [{
                id: "ex-pos-1",
                title: "Exercise 1",
                instructions: "Complete with am/is/are + verb-ing",
                items: [
                    { type: "text", label: "1. I ___ (study) now.", placeholder: "am/is/are + ing", expectedAnswer: "am studying" },
                    { type: "text", label: "2. She ___ (eat) lunch.", placeholder: "am/is/are + ing", expectedAnswer: "is eating" },
                ],
            }],
        },
        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `<p>Add <strong>not</strong> after am/is/are</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "am/is/are not", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: ["I'm not working.", "She isn't eating.", "They aren't playing."],
            exercises: [{
                id: "ex-neg-1",
                title: "Exercise 2",
                instructions: "Make negative",
                items: [
                    { type: "text", label: "1. I ___ (not work).", placeholder: "am/is/are not + ing", expectedAnswer: "am not working" },
                ],
            }],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `<p>Put <strong>am/is/are</strong> before the subject</p>`,
            formula: [
                { text: "Am/Is/Are", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: ["Are you working?", "Is she eating?", "Are they playing?"],
            exercises: [{
                id: "ex-q-1",
                title: "Exercise 3",
                instructions: "Make questions",
                items: [
                    { type: "text", label: "1. ___ you ___ (study)?", placeholder: "Am/Is/Are + subject + ing", expectedAnswer: "Are you studying" },
                ],
            }],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `<ul class="list-disc pl-6"><li><strong>Use:</strong> Actions NOW, temporary situations</li><li><strong>Form:</strong> am/is/are + verb-ing</li></ul>`,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which is correct?",
            options: [
                { value: "a", label: "I am study now." },
                { value: "b", label: "I am studying now." },
            ],
            correctAnswer: "b",
            explanation: "Use am/is/are + verb-ing.",
        },
    ],
};
