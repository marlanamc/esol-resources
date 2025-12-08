import type { InteractiveGuideContent } from "@/types/activity";

export const futureSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Welcome! Let's Learn Future Simple Together",
            icon: "📚",
            explanation: `
                <p>We're going to learn Future Simple step by step. Don't worry - we'll practice each part before moving to the next!</p>
                <p><strong>What is Future Simple?</strong> It's used to talk about actions that will happen in the future.</p>
            `,
        },

        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Future Simple?",
            icon: "⭐",
            explanation: `
                <p>Future Simple (with 'will') is for predictions, promises, and spontaneous decisions about the future.</p>
            `,
            usageMeanings: [
                {
                    title: "🔮 1. Predictions",
                    description: "What we think will happen in the future",
                    examples: [
                        {
                            sentence: "It <strong>will rain</strong> tomorrow.",
                            explanation: "✓ Prediction about the weather",
                        },
                        {
                            sentence: "She <strong>will pass</strong> the test.",
                            explanation: "✓ Prediction about future result",
                        },
                    ],
                },
                {
                    title: "🤝 2. Promises & Offers",
                    description: "Making promises or offering to help",
                    examples: [
                        {
                            sentence: "I <strong>will help</strong> you.",
                            explanation: "✓ Offering to help",
                        },
                        {
                            sentence: "I <strong>will call</strong> you later.",
                            explanation: "✓ Promise",
                        },
                    ],
                },
                {
                    title: "💡 3. Spontaneous Decisions",
                    description: "Deciding something at the moment of speaking",
                    examples: [
                        {
                            sentence: "I'm hungry. I <strong>will make</strong> a sandwich.",
                            explanation: "✓ Decided right now",
                        },
                        {
                            sentence: "The phone is ringing. I <strong>will answer</strong> it.",
                            explanation: "✓ Spontaneous decision",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Will vs Going To",
                content: "Use 'will' for predictions and spontaneous decisions. Use 'going to' for plans you already made.",
            },
        },

        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `
                <h3>How to Form Future Simple (Positive)</h3>
                <p>Use <strong>will + base verb</strong> (same for all subjects!)</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I will work tomorrow.",
                "You will see him soon.",
                "He will call you later.",
                "She will arrive at 3pm.",
                "It will be sunny.",
                "We will help you.",
                "They will come to the party.",
            ],
            tipBox: {
                title: "✏️ Contractions",
                content: "We often use contractions: I'll, you'll, he'll, she'll, it'll, we'll, they'll",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Future Simple",
                    instructions: "Complete with will + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (call) you tomorrow.",
                            placeholder: "will + verb",
                            expectedAnswer: "will call",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (arrive) at 5pm.",
                            placeholder: "will + verb",
                            expectedAnswer: "will arrive",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (help) us move.",
                            placeholder: "will + verb",
                            expectedAnswer: "will help",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>will not (won't)</strong> + base verb</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I won't work tomorrow.",
                "She won't be late.",
                "They won't come.",
                "It won't rain.",
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Negative Form",
                    instructions: "Make negative sentences with won't.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (not go) to the party.",
                            placeholder: "won't + verb",
                            expectedAnswer: "won't go",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (not call) you.",
                            placeholder: "won't + verb",
                            expectedAnswer: "won't call",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (not help) us.",
                            placeholder: "won't + verb",
                            expectedAnswer: "won't help",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Will</strong> at the beginning</p>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Will you come to the party?",
                "Will she call me?",
                "Will it rain tomorrow?",
                "Will they help us?",
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Questions",
                    instructions: "Make questions with will.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ you ___ (come) tomorrow?",
                            placeholder: "Will + subject + verb",
                            expectedAnswer: "Will you come",
                        },
                        {
                            type: "text",
                            label: "2. ___ she ___ (be) there?",
                            placeholder: "Will + subject + verb",
                            expectedAnswer: "Will she be",
                        },
                        {
                            type: "text",
                            label: "3. ___ they ___ (help) us?",
                            placeholder: "Will + subject + verb",
                            expectedAnswer: "Will they help",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Predictions, promises, spontaneous decisions</li>
                    <li><strong>Positive:</strong> Subject + will + base verb</li>
                    <li><strong>Negative:</strong> Subject + won't + base verb</li>
                    <li><strong>Questions:</strong> Will + subject + base verb?</li>
                    <li><strong>Contractions:</strong> I'll, you'll, he'll, she'll, won't</li>
                    <li><strong>Time Words:</strong> tomorrow, next week, soon, later, in the future</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "Will = same form for all subjects. Very easy to use!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "I will to help you." },
                { value: "b", label: "I will help you." },
                { value: "c", label: "I will helps you." },
            ],
            correctAnswer: "b",
            explanation: "After 'will', use the base verb (help, not 'to help' or 'helps').",
        },
        {
            id: "quiz-2",
            question: "Which negative is correct?",
            options: [
                { value: "a", label: "She won't comes." },
                { value: "b", label: "She won't come." },
                { value: "c", label: "She will not comes." },
            ],
            correctAnswer: "b",
            explanation: "Won't + base verb (come, not comes).",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Will you helps me?" },
                { value: "b", label: "Will you help me?" },
                { value: "c", label: "You will help me?" },
            ],
            correctAnswer: "b",
            explanation: "Will + subject + base verb (help, not helps).",
        },
    ],
};
