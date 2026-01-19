import type { InteractiveGuideContent } from "@/types/activity";

export const presentPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "The Present Perfect Family",
            icon: "🧩",
            explanation: `
                <p>We use <strong>Present Perfect</strong> when the past <em>touches the present</em>. The simple form shows the <strong>result, experience, or completion</strong>. The continuous form lets us focus on <strong>how long</strong> the activity has been happening.</p>
                <div style="background: rgba(16, 185, 129, 0.05); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; border: 1px solid rgba(16, 185, 129, 0.4);">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Present Perfect Simple:</strong> have/has + past participle → result/experience.</p>
                    <p style="margin: 0;"><strong>Present Perfect Continuous:</strong> have/has been + verb-ing → duration/emphasis on the activity.</p>
                </div>
            `,
            exercises: [
                {
                    id: "intro-pp-family",
                    title: "Spot the Focus",
                    instructions:
                        "Read each sentence and choose whether the focus is on the result/experience (Simple) or on duration (Continuous).",
                    items: [
                        {
                            type: "radio",
                            label: "I have written three lesson plans this morning.",
                            options: [
                                { value: "simple", label: "Present Perfect Simple (result/experience)" },
                                { value: "continuous", label: "Present Perfect Continuous (duration)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label:
                                "She has been writing the grant application for two hours.",
                            options: [
                                { value: "simple", label: "Present Perfect Simple (result)" },
                                { value: "continuous", label: "Present Perfect Continuous (how long)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
            ],
        },
        {
            id: "part-a-simple",
            stepNumber: 1,
            title: "Part A: Present Perfect Simple",
            icon: "✨",
            explanation: `
                <p>The simple form gives us a <strong>snapshot of a completed action</strong> that still matters now. It often answers "<strong>What result?</strong>" or "<strong>What experience?</strong>"</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have/has", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            usageMeanings: [
                {
                    title: "Result or change",
                    description: "The action happened before now and the result is still true.",
                    examples: [
                        {
                            sentence: "I <strong>have mailed</strong> the report, so the team can review it.",
                        },
                        {
                            sentence: "He <strong>has moved</strong> his schedule to afternoons, so he is available now.",
                        },
                    ],
                },
                {
                    title: "Experience",
                    description: "Talk about things we have done in our lives (no specific time).",
                    examples: [
                        {
                            sentence: "We <strong>have visited</strong> three city museums this term.",
                        },
                        {
                            sentence: "She <strong>has never driven</strong> on the highway alone.",
                        },
                    ],
                },
                {
                    title: "Completed action with current evidence",
                    description: "Use words like <strong>already, yet, just</strong> to show the connection to now.",
                    examples: [
                        {
                            sentence: "They <strong>have already finished</strong> the script for the video.",
                        },
                        {
                            sentence: "I <strong>have just heard</strong> the news from the office.",
                        },
                    ],
                },
            ],
            timeExpressions: [
                {
                    word: "since",
                    usage: "Start point, not duration",
                    examples: ["since this morning", "since 2018"],
                },
                {
                    word: "just / already / yet",
                    usage: "Show the action connects to now",
                    examples: ["just finished", "already read", "not yet heard"],
                },
                {
                    word: "ever / never",
                    usage: "Show experience up to now",
                    examples: ["Have you ever visited?", "I have never tried it."],
                },
            ],
            exercises: [
                {
                    id: "ex-pp-simple-1",
                    title: "Complete the Result",
                    instructions: "Fill in the blanks with Present Perfect Simple (have/has + past participle).",
                    items: [
                        {
                            type: "text",
                            label: "She ___ (submit) her materials already.",
                            expectedAnswer: "has submitted",
                        },
                        {
                            type: "text",
                            label: "Our class ___ (visit) the museum twice this semester.",
                            expectedAnswer: "has visited",
                        },
                        {
                            type: "text",
                            label: "I ___ (read) that policy just now.",
                            expectedAnswer: "have read",
                        },
                        {
                            type: "text",
                            label: "You ___ (never / try) the new community schedule yet.",
                            expectedAnswer: "have never tried",
                        },
                        {
                            type: "text",
                            label: "The program ___ (change) its hours since last month.",
                            expectedAnswer: "has changed",
                        },
                    ],
                },
            ],
        },
        {
            id: "part-b-continuous",
            stepNumber: 2,
            title: "Part B: Present Perfect Continuous",
            icon: "⏳",
            explanation: `
                <p>This form answers "<strong>How long?</strong>" Use it when the activity started before now and is still happening (or just stopped) with a focus on the duration.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have/has", type: "verb" },
                { text: "+", type: "other" },
                { text: "been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            usageMeanings: [
                {
                    title: "Duration continuing now",
                    description: "We focus on the length of the activity that reaches the present.",
                    examples: [
                        {
                            sentence: "I <strong>have been teaching</strong> at the center for three years.",
                        },
                        {
                            sentence: "They <strong>have been renovating</strong> the cafeteria since January.",
                        },
                    ],
                },
                {
                    title: "Repeated or temporary activity",
                    description: "The action feels temporary but long enough to mention how long it has been happening.",
                    examples: [
                        {
                            sentence: "We <strong>have been practicing</strong> speaking with partners all morning.",
                        },
                        {
                            sentence: "She <strong>has been using</strong> the new app for two weeks to track attendance.",
                        },
                    ],
                },
            ],
            timeExpressions: [
                {
                    word: "for",
                    usage: "Length of time",
                    examples: ["for two hours", "for three weeks"],
                },
                {
                    word: "since",
                    usage: "Starting point that continues to now",
                    examples: ["since Monday", "since last summer"],
                },
                {
                    word: "lately / recently",
                    usage: "Focus on ongoing activity",
                    examples: ["lately I have been writing notes", "recently she has been feeling tired"],
                },
            ],
            exercises: [
                {
                    id: "ex-pp-continuous-1",
                    title: "How Long?",
                    instructions: "Complete each sentence with Present Perfect Continuous. Pay attention to the time word.",
                    items: [
                        {
                            type: "text",
                            label: "We ___ (practice) dialogues for forty minutes.",
                            expectedAnswer: "have been practicing",
                        },
                        {
                            type: "text",
                            label: "She ___ (work) on the budget since last week.",
                            expectedAnswer: "has been working",
                        },
                        {
                            type: "text",
                            label: "I ___ (look) for a cheaper bus pass recently.",
                            expectedAnswer: "have been looking",
                        },
                        {
                            type: "text",
                            label: "He ___ (teach) three classes every day this month.",
                            expectedAnswer: "has been teaching",
                        },
                        {
                            type: "text",
                            label: "You ___ (talk) about the deadline for hours.",
                            expectedAnswer: "have been talking",
                        },
                    ],
                },
            ],
        },
        {
            id: "comparison",
            stepNumber: 3,
            title: "Comparison: Result vs Duration",
            icon: "⚖️",
            explanation: `
                <p>Ask yourself: "<strong>What result?</strong> or "<strong>How long?</strong>" It helps decide which form to use.</p>
            `,
            comparison: {
                title: "Simple vs Continuous",
                leftLabel: "Present Perfect Simple",
                rightLabel: "Present Perfect Continuous",
                rows: [
                    {
                        label: "Key question",
                        left: "What happened and why does it matter now?",
                        right: "How long has it been happening?",
                    },
                    {
                        label: "Focus",
                        left: "Result, experience, completion",
                        right: "Duration, ongoing activity",
                    },
                    {
                        label: "Triggers",
                        left: "already, yet, ever, never, just",
                        right: "for, since, lately, how long",
                    },
                    {
                        label: "Example question",
                        left: "Have you finished the form?",
                        right: "How long have you been filling it out?",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-pp",
                    title: "Choose the Right Tense",
                    instructions:
                        "Pick the tense that matches the question focus. Use Simple for results and Continuous for duration.",
                    items: [
                        {
                            type: "radio",
                            label: '"I have been on the phone with housing services for an hour." (How long?)',
                            options: [
                                { value: "simple", label: "Simple" },
                                { value: "continuous", label: "Continuous" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: '"The manager has already confirmed the meeting time." (Result?)',
                            options: [
                                { value: "simple", label: "Simple" },
                                { value: "continuous", label: "Continuous" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label:
                                '"How long have you been looking for a shorter commute?" (Duration)',
                            options: [
                                { value: "simple", label: "Simple" },
                                { value: "continuous", label: "Continuous" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
            ],
        },
        {
            id: "mixed-practice",
            stepNumber: 4,
            title: "Mixed Practice",
            icon: "🧠",
            explanation: `
                <p>Now we use both tenses. Notice the signal words to help you decide.</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-pp-family",
                    title: "Mix and Match",
                    instructions: "Write the correct form (simple or continuous) in each sentence.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (finish) the application, so I can submit it now.",
                            expectedAnswer: "have finished",
                        },
                        {
                            type: "text",
                            label: "We ___ (talk) about the budget for two afternoons.",
                            expectedAnswer: "have been talking",
                        },
                        {
                            type: "text",
                            label: "She ___ (visit) every partner agency this quarter.",
                            expectedAnswer: "has visited",
                        },
                        {
                            type: "text",
                            label: "They ___ (repair) the oven since Monday.",
                            expectedAnswer: "have been repairing",
                        },
                        {
                            type: "text",
                            label: "He ___ (sell) five tickets today already.",
                            expectedAnswer: "has sold",
                        },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Summary: Remember the Family",
            icon: "🧾",
            explanation: `
                <ul class="list-disc pl-6 space-y-1">
                    <li><strong>Simple</strong> = have/has + past participle (result, experience, completion)</li>
                    <li><strong>Continuous</strong> = have/has been + verb-ing (duration, still happening, near-future focus)</li>
                    <li>Ask: "What result?" → Simple. "How long?" → Continuous.</li>
                    <li>Simple uses <code>already</code>, <code>just</code>, <code>yet</code>, <code>ever</code>, <code>never</code>.</li>
                    <li>Continuous uses <code>for</code>, <code>since</code>, <code>how long</code>, <code>lately</code>.</li>
                </ul>
            `,
            tipBox: {
                title: "Quick Tip",
                content:
                    "Use the time expression to hear the question in your mind: 'How long have you been...' or 'Have you already...'",
            },
            exercises: [
                {
                    title: "Summary Check",
                    items: [
                        {
                            type: "select",
                            label: "I ___ (you / study) English for five years.",
                            options: ["have studied", "have been studying", "studied"],
                            expectedAnswer: "have been studying",
                        },
                        {
                            type: "select",
                            label: "They ___ (complete) the training, so now they can lead meetings.",
                            options: ["have completed", "have been completing", "completed"],
                            expectedAnswer: "have completed",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "quiz-ppf-1",
            question: "Which sentence focuses on a result?",
            options: [
                { value: "a", label: "I have been waiting for the bus for 30 minutes." },
                { value: "b", label: "They have booked the space for tomorrow." },
                { value: "c", label: "She has been organizing the schedule since Monday." },
            ],
            correctAnswer: "b",
            explanation: "Booking the space is a completed action with a result, so the simple form is correct.",
        },
        {
            id: "quiz-ppf-2",
            question: "Choose the example that shows duration up to now.",
            options: [
                { value: "a", label: "He has delivered the package." },
                { value: "b", label: "He has been delivering packages for two hours." },
                { value: "c", label: "He delivered the package yesterday." },
            ],
            correctAnswer: "b",
            explanation: "The continuous form plus 'for two hours' emphasizes duration up to now.",
        },
        {
            id: "quiz-ppf-3",
            question: "Which time expression is usually with Present Perfect Simple?",
            options: [
                { value: "a", label: "for" },
                { value: "b", label: "since" },
                { value: "c", label: "already" },
            ],
            correctAnswer: "c",
            explanation: "'Already' shows completion and is commonly used with the simple form.",
        },
        {
            id: "quiz-ppf-4",
            question: "How do we ask about duration?",
            options: [
                { value: "a", label: "What have you done?" },
                { value: "b", label: "How long have you been doing it?" },
                { value: "c", label: "Have you done it yet?" },
            ],
            correctAnswer: "b",
            explanation: "'How long' asks for duration—a job for the continuous form.",
        },
        {
            id: "quiz-ppf-5",
            question: "The manager asks, 'Have you finished the report?' Which form is correct?",
            options: [
                { value: "a", label: "Present Perfect Simple" },
                { value: "b", label: "Present Perfect Continuous" },
                { value: "c", label: "Past Simple" },
            ],
            correctAnswer: "a",
            explanation: "The manager wants to know the result (finished) now, so the simple form is right.",
        },
        {
            id: "quiz-ppf-6",
            question: "She ___ (practice) this song since last rehearsal.",
            options: [
                { value: "a", label: "has practiced" },
                { value: "b", label: "has been practicing" },
                { value: "c", label: "practiced" },
            ],
            correctAnswer: "b",
            explanation: "'Since last rehearsal' + focus on how long = continuous form.",
        },
        {
            id: "quiz-ppf-7",
            question: "Pick the sentence that shows an experience with no time.",
            options: [
                { value: "a", label: "I have seen that movie twice." },
                { value: "b", label: "I have been watching that movie for two hours." },
                { value: "c", label: "I saw that movie last night." },
            ],
            correctAnswer: "a",
            explanation: "Experience about the number of times (twice) uses Present Perfect Simple.",
        },
        {
            id: "quiz-ppf-8",
            question: "After we finish writing, we will state: 'We ___ (finish) the report.'",
            options: [
                { value: "a", label: "have finished" },
                { value: "b", label: "have been finishing" },
                { value: "c", label: "finished" },
            ],
            correctAnswer: "a",
            explanation: "The action is complete and the result matters now—simple form.",
        },
        {
            id: "quiz-ppf-9",
            question: "'They have been talking for 15 minutes.' What does it focus on?",
            options: [
                { value: "a", label: "Number of talks" },
                { value: "b", label: "Duration of the talk" },
                { value: "c", label: "Result of talk" },
            ],
            correctAnswer: "b",
            explanation: "Continuous form + 'for 15 minutes' focuses on duration.",
        },
        {
            id: "quiz-ppf-10",
            question: "Which question should you ask to choose the Simple form?",
            options: [
                { value: "a", label: "How long have you been waiting?" },
                { value: "b", label: "What have you built?" },
                { value: "c", label: "How long have you been learning?" },
            ],
            correctAnswer: "b",
            explanation: "'What have you built?' asks for the result—use simple form.",
        },
    ],
};
