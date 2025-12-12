import type { InteractiveGuideContent } from "@/types/activity";

export const futureSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Simple: Making Plans & Promises",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(133, 196, 255, 0.12) 0%, rgba(255, 189, 118, 0.12) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem;">
                    <p style="margin: 0; font-size: 1.05rem;">Future Simple is your crystal ball for quick decisions, promises, and predictions. "I'll call you later." "She'll help you." "It'll rain tomorrow."</p>
                </div>
            `,
        },

        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Simple",
            icon: "⭐",
            explanation: `
                <p>Use <strong>will</strong> for quick decisions, promises, offers, and predictions. If the plan is already set, you’re probably in “going to” land instead.</p>
            `,
            usageMeanings: [
                {
                    title: "🔮 1. Predictions",
                    description: "What we think will happen (weather, life, the future)",
                    examples: [
                        {
                            sentence: "It <strong>will rain</strong> tomorrow afternoon.",
                            explanation: "✓ Weather prediction",
                        },
                        {
                            sentence: "The bus <strong>will be</strong> late again—it always is.",
                            explanation: "✓ Life prediction based on experience",
                        },
                    ],
                },
                {
                    title: "🤝 2. Promises & Offers",
                    description: "Things you commit to do",
                    examples: [
                        {
                            sentence: "I <strong>will help</strong> you move this weekend.",
                            explanation: "✓ Offer",
                        },
                        {
                            sentence: "I <strong>will call</strong> you after work tonight.",
                            explanation: "✓ Promise",
                        },
                    ],
                },
                {
                    title: "💡 3. Spontaneous Decisions",
                    description: "Decisions made right now",
                    examples: [
                        {
                            sentence: "The phone is ringing—I <strong>will answer</strong> it.",
                            explanation: "✓ Decision at the moment",
                        },
                        {
                            sentence: "We need snacks. I <strong>will order</strong> pizza.",
                            explanation: "✓ Instant choice",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Will vs Going To",
                content: "Use 'will' for predictions or decisions made now. Use 'going to' for plans arranged before this moment.",
            },
            exercises: [
                {
                    id: "ex-usage-fs-1",
                    title: "Practice: Why Use 'Will'?",
                    instructions: "Choose the best reason to use Future Simple (will) in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I'll call you after work.\"",
                            options: [
                                { value: "promise", label: "Promise/offer" },
                                { value: "plan", label: "Pre-planned schedule" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "promise",
                        },
                        {
                            type: "radio",
                            label: "\"It will rain tomorrow.\"",
                            options: [
                                { value: "prediction", label: "Prediction" },
                                { value: "decision", label: "Decision right now" },
                                { value: "routine", label: "Routine" },
                            ],
                            expectedAnswer: "prediction",
                        },
                        {
                            type: "radio",
                            label: "\"I'm hungry. I'll make a sandwich.\"",
                            options: [
                                { value: "decision", label: "Decision made now" },
                                { value: "schedule", label: "Fixed schedule" },
                                { value: "ongoing", label: "Ongoing action" },
                            ],
                            expectedAnswer: "decision",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `
                <h3>How to Form Future Simple (Positive)</h3>
                <p>Formula: <strong>will + base verb</strong>. Same for every subject—no extra endings.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I will finish my homework before dinner.",
                "You will love this movie—it's so good.",
                "He will call you when he gets home.",
                "She will bring the cake to the party.",
                "It will take longer if the traffic is bad.",
                "We will meet at the park tomorrow.",
                "They will visit us next month.",
            ],
            tipBox: {
                title: "✏️ Contractions",
                content: "We often use contractions: I'll, you'll, he'll, she'll, it'll, we'll, they'll",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Say What You'll Do",
                    instructions: "Complete with will + base verb (everyday plans).",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (call) you tonight after dinner.",
                            expectedAnswer: "will call",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (bring) snacks to the party.",
                            expectedAnswer: "will bring",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (help) us move next weekend.",
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
                <p>Use <strong>will not (won't)</strong> + base verb.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I won't eat sugar this week—I'm trying to be healthier.",
                "She won't go to the party tonight.",
                "They won't leave before 9 PM.",
                "It won't rain tomorrow, according to the weather.",
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Say What Won't Happen",
                    instructions: "Use won't + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (not go) to bed late tonight.",
                            expectedAnswer: "won't go",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (not buy) anything expensive this month.",
                            expectedAnswer: "won't buy",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (not leave) without saying goodbye.",
                            expectedAnswer: "won't leave",
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
                <p>Put <strong>Will</strong> at the beginning.</p>
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
                "Will you come to dinner tonight?",
                "Will she bring her kids to the party?",
                "Will it be cold tomorrow?",
                "Will they visit us next week?",
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About the Future",
                    instructions: "Make questions with Will + subject + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ you ___ (come) to the party Saturday?",
                            expectedAnswer: "Will you come",
                        },
                        {
                            type: "text",
                            label: "2. ___ she ___ (help) us with the cooking?",
                            expectedAnswer: "Will she help",
                        },
                        {
                            type: "text",
                            label: "3. ___ they ___ (arrive) before 7 PM?",
                            expectedAnswer: "Will they arrive",
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
                    <li><strong>When to Use:</strong> Predictions, promises/offers, spontaneous decisions</li>
                    <li><strong>Positive:</strong> Subject + will + base verb</li>
                    <li><strong>Negative:</strong> Subject + won't + base verb</li>
                    <li><strong>Questions:</strong> Will + subject + base verb?</li>
                    <li><strong>Contractions:</strong> I'll, you'll, he'll, she'll, won't</li>
                    <li><strong>Time Words:</strong> tomorrow, next week, soon, tonight, in an hour</li>
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
            question: "Which sentence correctly uses 'will' (base verb)?",
            options: [
                { value: "a", label: "I will to call you now." },
                { value: "b", label: "I will call you now." },
                { value: "c", label: "I will calling you now." },
            ],
            correctAnswer: "b",
            explanation: "Future Simple: will + base verb (no 'to', no -ing).",
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
        {
            id: "quiz-4",
            question: "Choose 'will' vs a different tense: Which needs 'will'?",
            options: [
                { value: "a", label: "The bus leaves at 7:10 AM." },
                { value: "b", label: "I'll answer the door—someone's knocking." },
                { value: "c", label: "I'm meeting my friend at 3 PM." },
            ],
            correctAnswer: "b",
            explanation: "Spontaneous decision → will. A) timetable uses Present Simple; C) arranged plan uses Present Continuous.",
        },
        {
            id: "quiz-5",
            question: "Pick the correct use of 'will' for a promise/offer.",
            options: [
                { value: "a", label: "I will fixing it later." },
                { value: "b", label: "I fix it later." },
                { value: "c", label: "I will fix it later." },
            ],
            correctAnswer: "c",
            explanation: "Promise: will + base verb → will fix.",
        },
    ],
};
