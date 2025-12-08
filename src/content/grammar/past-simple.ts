import type { InteractiveGuideContent } from "@/types/activity";

export const pastSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Welcome! Let's Learn Past Simple Together",
            icon: "📚",
            explanation: `
                <p>We're going to learn Past Simple step by step. Don't worry - we'll practice each part before moving to the next!</p>
                <p><strong>What is Past Simple?</strong> It's used to talk about finished actions in the past.</p>
            `,
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Past Simple?",
            icon: "⭐",
            explanation: `
                <p>Past Simple is for actions that started and finished in the past.</p>
            `,
            usageMeanings: [
                {
                    title: "✅ 1. Completed Actions in the Past",
                    description: "Actions that happened and finished at a specific time in the past",
                    examples: [
                        {
                            sentence: "I <strong>visited</strong> Paris last year.",
                            explanation: "✓ The visit is finished",
                        },
                        {
                            sentence: "She <strong>worked</strong> at that company for 5 years.",
                            explanation: "✓ She doesn't work there anymore",
                        },
                    ],
                },
                {
                    title: "📅 2. Specific Past Time",
                    description: "Use with time expressions like yesterday, last week, in 2020, ago",
                    examples: [
                        {
                            sentence: "They <strong>moved</strong> to Boston in 2019.",
                            explanation: "✓ Specific year in the past",
                        },
                        {
                            sentence: "I <strong>saw</strong> him yesterday.",
                            explanation: "✓ Specific day in the past",
                        },
                    ],
                },
                {
                    title: "📖 3. Past Stories & Narratives",
                    description: "Describing past events in sequence",
                    examples: [
                        {
                            sentence: "First, I <strong>woke up</strong>. Then I <strong>had</strong> breakfast. Finally, I <strong>went</strong> to work.",
                            explanation: "✓ Sequence of past events",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Key Point",
                content: "Past Simple = action started AND finished in the past. If it continues to now, use Present Perfect!",
            },
        },

        // Regular vs Irregular Verbs
        {
            id: "regular-irregular",
            stepNumber: 2,
            title: "Regular vs Irregular Verbs",
            explanation: `
                <h3>Two Types of Past Simple Verbs</h3>
                <p><strong>Regular verbs:</strong> Add -ed to the base form</p>
                <p><strong>Irregular verbs:</strong> Change form completely (must memorize!)</p>
            `,
            verbTable: {
                title: "Common Irregular Past Simple Verbs",
                headers: ["Infinitive", "Past Simple"],
                rows: [
                    ["go", "went"],
                    ["come", "came"],
                    ["see", "saw"],
                    ["do", "did"],
                    ["make", "made"],
                    ["take", "took"],
                    ["get", "got"],
                    ["have", "had"],
                    ["be", "was/were"],
                    ["eat", "ate"],
                    ["drink", "drank"],
                    ["give", "gave"],
                    ["buy", "bought"],
                    ["think", "thought"],
                    ["say", "said"],
                ],
            },
            tipBox: {
                title: "📝 Spelling Rules for Regular Verbs",
                content: "Most verbs: add -ed (walk → walked). Verbs ending in -e: add -d (live → lived). Verbs ending in consonant + y: change y to i, add -ed (study → studied).",
            },
        },

        // Positive Form
        {
            id: "step-positive",
            stepNumber: 3,
            title: "Positive Form",
            explanation: `
                <h3>How to Form Past Simple (Positive)</h3>
                <p>Use the past form of the verb (same for all subjects!)</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "past verb", type: "verb" },
            ],
            examples: [
                "I worked yesterday.",
                "You studied English.",
                "He went to the store.",
                "She lived in Paris.",
                "It rained last night.",
                "We visited our family.",
                "They bought a car.",
            ],
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Change to Past Simple",
                    instructions: "Write the past simple form.",
                    items: [
                        {
                            type: "text",
                            label: "1. I (work) ___ late last night.",
                            placeholder: "past simple",
                            expectedAnswer: "worked",
                        },
                        {
                            type: "text",
                            label: "2. She (go) ___ to the gym yesterday.",
                            placeholder: "past simple",
                            expectedAnswer: "went",
                        },
                        {
                            type: "text",
                            label: "3. They (have) ___ dinner at 7pm.",
                            placeholder: "past simple",
                            expectedAnswer: "had",
                        },
                        {
                            type: "text",
                            label: "4. We (see) ___ a movie last weekend.",
                            placeholder: "past simple",
                            expectedAnswer: "saw",
                        },
                    ],
                },
            ],
        },

        // Negative Form
        {
            id: "step-negative",
            stepNumber: 4,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>did not (didn't)</strong> + base verb</p>
                <p><strong>Important:</strong> The main verb returns to base form!</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "didn't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I didn't work yesterday.",
                "She didn't go to the party.",
                "They didn't have time.",
                "We didn't see the movie.",
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make Negative",
                    instructions: "Change to negative using didn't.",
                    items: [
                        {
                            type: "text",
                            label: "1. I (not go) ___ to school yesterday.",
                            placeholder: "didn't + base verb",
                            expectedAnswer: "didn't go",
                        },
                        {
                            type: "text",
                            label: "2. She (not like) ___ the movie.",
                            placeholder: "didn't + base verb",
                            expectedAnswer: "didn't like",
                        },
                        {
                            type: "text",
                            label: "3. They (not have) ___ breakfast.",
                            placeholder: "didn't + base verb",
                            expectedAnswer: "didn't have",
                        },
                    ],
                },
            ],
        },

        // Question Form
        {
            id: "step-questions",
            stepNumber: 5,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Did</strong> at the beginning, then subject + base verb</p>
            `,
            formula: [
                { text: "Did", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Did you work yesterday?",
                "Did she go to the party?",
                "Did they have dinner?",
                "Did he see the movie?",
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Make Questions",
                    instructions: "Write questions in Past Simple.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ you (go) to the store?",
                            placeholder: "Did + subject + base verb",
                            expectedAnswer: "Did you go",
                        },
                        {
                            type: "text",
                            label: "2. ___ she (like) the food?",
                            placeholder: "Did + subject + base verb",
                            expectedAnswer: "Did she like",
                        },
                        {
                            type: "text",
                            label: "3. ___ they (have) a good time?",
                            placeholder: "Did + subject + base verb",
                            expectedAnswer: "Did they have",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Finished actions in the past with specific time</li>
                    <li><strong>Regular Verbs:</strong> Add -ed (work → worked)</li>
                    <li><strong>Irregular Verbs:</strong> Must memorize (go → went, see → saw)</li>
                    <li><strong>Positive:</strong> Subject + past verb</li>
                    <li><strong>Negative:</strong> Subject + didn't + base verb</li>
                    <li><strong>Questions:</strong> Did + subject + base verb?</li>
                    <li><strong>Time Words:</strong> yesterday, last week, ago, in 2020</li>
                </ul>
            `,
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "I goed to the store yesterday." },
                { value: "b", label: "I went to the store yesterday." },
                { value: "c", label: "I go to the store yesterday." },
            ],
            correctAnswer: "b",
            explanation: "'Go' is irregular: go → went. We use Past Simple with 'yesterday'.",
        },
        {
            id: "quiz-2",
            question: "Which negative sentence is correct?",
            options: [
                { value: "a", label: "She didn't went to the party." },
                { value: "b", label: "She didn't go to the party." },
                { value: "c", label: "She not went to the party." },
            ],
            correctAnswer: "b",
            explanation: "After 'didn't', use the base verb (go, not went).",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Did you saw the movie?" },
                { value: "b", label: "Did you see the movie?" },
                { value: "c", label: "You saw the movie?" },
            ],
            correctAnswer: "b",
            explanation: "Questions: Did + subject + base verb (see, not saw).",
        },
    ],
};
