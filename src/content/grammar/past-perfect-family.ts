import type { InteractiveGuideContent } from "@/types/activity";

export const pastPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "The Past Perfect Family",
            icon: "🕰️",
            explanation: `
                <p>Past Perfect tells stories about the past by thinking <strong>two steps back</strong>. The simple form shows the earlier action/result; the continuous form highlights how long that earlier action had been happening before the next past moment.</p>
                <p>Think: <strong>Simple = What happened first?</strong> <br/> <strong>Continuous = How long had it been happening before the next past event?</strong></p>
            `,
            exercises: [
                {
                    id: "intro-ppf",
                    title: "What Came First?",
                    instructions:
                        "Read the two past actions and choose which action happened first (Past Perfect Simple) or was happening over time (Past Perfect Continuous).",
                    items: [
                        {
                            type: "radio",
                            label: "The team had already finished the plan before the coach arrived.",
                            options: [
                                { value: "simple", label: "Past Perfect Simple" },
                                { value: "continuous", label: "Past Perfect Continuous" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "She had been training for two months when the interview happened.",
                            options: [
                                { value: "simple", label: "Past Perfect Simple" },
                                { value: "continuous", label: "Past Perfect Continuous" },
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
            title: "Part A: Past Perfect Simple",
            icon: "✅",
            explanation: `
                <p>Use <strong>had + past participle</strong> to tell what happened before another past moment. The two-verb rule helps: the action that happened first gets the Past Perfect, the second action stays in Past Simple.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "had", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            usageMeanings: [
                {
                    title: "Story order",
                    description: "We name what happened first before something else in the past.",
                    examples: [
                        {
                            sentence: "She <strong>had already booked</strong> a table before her friends called.",
                        },
                        {
                            sentence: "We <strong>had finished</strong> the readings when the professor began the lecture.",
                        },
                    ],
                },
                {
                    title: "Result before another past event",
                    description: "Highlight the effect that was true before the past moment.",
                    examples: [
                        {
                            sentence: "They <strong>had locked</strong> the doors, so the building was quiet.",
                        },
                        {
                            sentence: "I <strong>had learned</strong> about the policy before the meeting started.",
                        },
                    ],
                },
            ],
            timeExpressions: [
                {
                    word: "by the time",
                    usage: "Shows the later past action",
                    examples: ["by the time she arrived", "by the time we started"],
                },
                {
                    word: "before / after",
                    usage: "Compare two past events",
                    examples: ["before the workshop", "after the interview"],
                },
                {
                    word: "already",
                    usage: "Emphasize completion before another past point",
                    examples: ["had already finished", "had already left"],
                },
            ],
            exercises: [
                {
                    id: "ex-past-simple-1",
                    title: "Two-Step Past",
                    instructions: "Write the Past Perfect Simple form of the first action.",
                    items: [
                        {
                            type: "text",
                            label: "The volunteers ___ (organize) the event before anyone asked.",
                            expectedAnswer: "had organized",
                        },
                        {
                            type: "text",
                            label: "He ___ (move) the files before the deadline arrived.",
                            expectedAnswer: "had moved",
                        },
                        {
                            type: "text",
                            label: "I ___ (meet) the landlord before signing the lease.",
                            expectedAnswer: "had met",
                        },
                        {
                            type: "text",
                            label: "They ___ (finish) the translation by the time we opened the site.",
                            expectedAnswer: "had finished",
                        },
                        {
                            type: "text",
                            label: "We ___ (prepare) the handouts before the class started.",
                            expectedAnswer: "had prepared",
                        },
                    ],
                },
            ],
        },
        {
            id: "part-b-continuous",
            stepNumber: 2,
            title: "Part B: Past Perfect Continuous",
            icon: "🌀",
            explanation: `
                <p>Use <strong>had been + verb-ing</strong> to show how long something had been happening before the next past event.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "had", type: "verb" },
                { text: "+", type: "other" },
                { text: "been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            usageMeanings: [
                {
                    title: "Duration before a past moment",
                    description: "Focus on how long the activity had been happening when something else occurred.",
                    examples: [
                        {
                            sentence: "The class <strong>had been waiting</strong> for forty minutes when the instructor arrived.",
                        },
                        {
                            sentence: "She <strong>had been looking</strong> for a replacement job before she heard about this one.",
                        },
                    ],
                },
                {
                    title: "Repeated action before another past action",
                    description: "The action happened often and continued up to the next past event.",
                    examples: [
                        {
                            sentence: "We <strong>had been visiting</strong> the site every weekend before the closure.",
                        },
                        {
                            sentence: "He <strong>had been helping</strong> clients all week before the holiday break started.",
                        },
                    ],
                },
            ],
            timeExpressions: [
                {
                    word: "for",
                    usage: "Length before the next past moment",
                    examples: ["for three days", "for months"],
                },
                {
                    word: "since",
                    usage: "Starting point earlier than the later past event",
                    examples: ["since Monday", "since the beginning of the project"],
                },
                {
                    word: "when",
                    usage: "Signals the later past action",
                    examples: ["when the meeting began", "when the building reopened"],
                },
            ],
            exercises: [
                {
                    id: "ex-past-continuous-1",
                    title: "How Long Before?",
                    instructions: "Use Past Perfect Continuous to show the duration before the second past action.",
                    items: [
                        {
                            type: "text",
                            label: "The coach ___ (talk) with staff for weeks before the announcement.",
                            expectedAnswer: "had been talking",
                        },
                        {
                            type: "text",
                            label: "I ___ (practice) the presentation for hours when the power returned.",
                            expectedAnswer: "had been practicing",
                        },
                        {
                            type: "text",
                            label: "They ___ (rebuild) the site since January before the soft launch.",
                            expectedAnswer: "had been rebuilding",
                        },
                        {
                            type: "text",
                            label: "She ___ (write) the grant proposal for three days when the deadline arrived.",
                            expectedAnswer: "had been writing",
                        },
                        {
                            type: "text",
                            label: "We ___ (help) neighbors with repairs before the storm hit.",
                            expectedAnswer: "had been helping",
                        },
                    ],
                },
            ],
        },
        {
            id: "comparison",
            stepNumber: 3,
            title: "Comparison: Completion vs Duration Before the Past",
            icon: "🧾",
            explanation: `
                <p>Compare the two forms so you can answer: <strong>Which action happened first?</strong> and <strong>How long had it been happening?</strong></p>
            `,
            comparison: {
                title: "Past Perfect Simple vs Continuous",
                leftLabel: "Simple",
                rightLabel: "Continuous",
                rows: [
                    {
                        label: "Focus",
                        left: "The first action or its result",
                        right: "The duration of the first action",
                    },
                    {
                        label: "Question",
                        left: "What happened before the second past event?",
                        right: "How long had it been happening before that event?",
                    },
                    {
                        label: "Signal words",
                        left: "already, by the time, before",
                        right: "for, since, when",
                    },
                    {
                        label: "Example",
                        left: "They had finished the class by the time we arrived.",
                        right: "They had been finishing the class for two hours when we arrived.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-ppf",
                    title: "Right Form, Right Focus",
                    instructions: "Choose whether you need Simple (result) or Continuous (duration).",
                    items: [
                        {
                            type: "radio",
                            label: "The students had already answered the survey before the teacher checked the results.",
                            options: [
                                { value: "simple", label: "Simple" },
                                { value: "continuous", label: "Continuous" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "He had been collecting signatures for weeks when the deadline came.",
                            options: [
                                { value: "simple", label: "Simple" },
                                { value: "continuous", label: "Continuous" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "The building had been vacant for months before the renovation started.",
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
            explanation: `<p>Pick the correct Past Perfect form for each sentence.</p>`,
            exercises: [
                {
                    id: "ex-mixed-ppf",
                    title: "First or Long?",
                    instructions: "Fill in the blanks using either Past Perfect Simple or Continuous.",
                    items: [
                        {
                            type: "text",
                            label: "We ___ (pack) the bags before the bus arrived.",
                            expectedAnswer: "had packed",
                        },
                        {
                            type: "text",
                            label: "She ___ (study) the new language for two months when the exam happened.",
                            expectedAnswer: "had been studying",
                        },
                        {
                            type: "text",
                            label: "The students ___ (finish) the worksheet before the bell rang.",
                            expectedAnswer: "had finished",
                        },
                        {
                            type: "text",
                            label: "He ___ (help) the organizers all week before the celebration.",
                            expectedAnswer: "had been helping",
                        },
                        {
                            type: "text",
                            label: "The committee ___ (meet) twice before they approved the plan.",
                            expectedAnswer: "had met",
                        },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Summary: Past Perfect Choices",
            icon: "📌",
            explanation: `
                <ul class="list-disc pl-6 space-y-1">
                    <li><strong>Past Perfect Simple:</strong> had + past participle → result or first action in stories.</li>
                    <li><strong>Past Perfect Continuous:</strong> had been + verb-ing → duration before another past action.</li>
                    <li>Ask: "What happened first?" → Simple. "How long had it been happening?" → Continuous.</li>
                    <li>Key words: <code>by the time</code>, <code>before</code>, <code>already</code> (Simple); <code>for</code>, <code>since</code>, <code>when</code> (Continuous).</li>
                </ul>
            `,
            tipBox: {
                title: "Quick Tip",
                content: "Map the story timeline with arrows → Past Perfect action happens before the later Past Simple event.",
            },
        },
    ],
    miniQuiz: [
        {
            id: "quiz-ppf-1",
            question: "Which sentence shows the action that happened first?",
            options: [
                { value: "a", label: "I had already left when she called." },
                { value: "b", label: "I left after she called." },
                { value: "c", label: "I had been leaving when she called." },
            ],
            correctAnswer: "a",
            explanation: "'Had already left' is the action completed before the call, so Past Perfect Simple is correct.",
        },
        {
            id: "quiz-ppf-2",
            question: "Which sentence focuses on how long?",
            options: [
                { value: "a", label: "She had written the memo." },
                { value: "b", label: "She had been writing the memo for two hours." },
                { value: "c", label: "She wrote the memo." },
            ],
            correctAnswer: "b",
            explanation: "'For two hours' + had been writing shows duration before another past event.",
        },
        {
            id: "quiz-ppf-3",
            question: "Choose the correct signal for Past Perfect Simple.",
            options: [
                { value: "a", label: "Since" },
                { value: "b", label: "By the time" },
                { value: "c", label: "How long" },
            ],
            correctAnswer: "b",
            explanation: "'By the time' signals the later past action, so the earlier action often uses Past Perfect Simple.",
        },
        {
            id: "quiz-ppf-4",
            question: "They ___ (build) the ramp before the event started.",
            options: [
                { value: "a", label: "had built" },
                { value: "b", label: "had been building" },
                { value: "c", label: "built" },
            ],
            correctAnswer: "a",
            explanation: "The completed action before the event uses Past Perfect Simple.",
        },
        {
            id: "quiz-ppf-5",
            question: "We had been waiting for the bus for 20 minutes when the driver arrived. Which tense is used?",
            options: [
                { value: "a", label: "Past Perfect Simple" },
                { value: "b", label: "Past Perfect Continuous" },
                { value: "c", label: "Past Simple" },
            ],
            correctAnswer: "b",
            explanation: "It describes duration before the past moment, so use the continuous form.",
        },
        {
            id: "quiz-ppf-6",
            question: "Which sentence is about a result before another past event?",
            options: [
                { value: "a", label: "They had been learning for months." },
                { value: "b", label: "They had learned the vocabulary before the quiz." },
                { value: "c", label: "They learned the vocabulary after the quiz." },
            ],
            correctAnswer: "b",
            explanation: "'Had learned' describes the result that happened before the quiz.",
        },
        {
            id: "quiz-ppf-7",
            question: "Which word pairs with Past Perfect Continuous?",
            options: [
                { value: "a", label: "Already" },
                { value: "b", label: "For" },
                { value: "c", label: "Before" },
            ],
            correctAnswer: "b",
            explanation: "'For' is used to describe duration with the continuous form.",
        },
        {
            id: "quiz-ppf-8",
            question: "I had been saving money ___ the conference started.",
            options: [
                { value: "a", label: "before" },
                { value: "b", label: "since" },
                { value: "c", label: "after" },
            ],
            correctAnswer: "a",
            explanation: "'Before the conference started' shows the later event, so 'had been saving' describes what was happening earlier.",
        },
        {
            id: "quiz-ppf-9",
            question: "How do you confirm two past actions?",
            options: [
                { value: "a", label: "Use Past Simple for both." },
                { value: "b", label: "Use Past Perfect for the earlier action and Past Simple for the later." },
                { value: "c", label: "Use Past Perfect Continuous for both." },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect shows the first action, and Past Simple shows the later one.",
        },
        {
            id: "quiz-ppf-10",
            question: "Choose the correct continuation: 'By the time we arrived, the team ___.'",
            options: [
                { value: "a", label: "had started" },
                { value: "b", label: "had been starting" },
                { value: "c", label: "started" },
            ],
            correctAnswer: "a",
            explanation: "'By the time' plus Past Perfect Simple describes the completed action before our arrival.",
        },
    ],
};
