import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "The Future Perfect Family",
            icon: "🔮",
            explanation: `
                <p>Future Perfect tenses let us imagine a future moment and look back. The simple form describes what <strong>will have happened</strong> by then, and the continuous form shows how long an activity <strong>will have been happening</strong> by that future point.</p>
                <p>Think: In the future, we ask <strong>What will be done?</strong> (simple) or <strong>How long will it have been happening?</strong> (continuous).</p>
            `,
            exercises: [
                {
                    id: "intro-fpf",
                    title: "Future Snapshot",
                    instructions:
                        "Read each prediction and decide whether it focuses on the future result (Simple) or on the duration up to that future moment (Continuous).",
                    items: [
                        {
                            type: "radio",
                            label: "By 5 PM, I will have finished the report.",
                            options: [
                                { value: "simple", label: "Future Perfect Simple" },
                                { value: "continuous", label: "Future Perfect Continuous" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "By next month, she will have been studying this topic for a year.",
                            options: [
                                { value: "simple", label: "Future Perfect Simple" },
                                { value: "continuous", label: "Future Perfect Continuous" },
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
            title: "Part A: Future Perfect Simple",
            icon: "✅",
            explanation: `
                <p>Use <strong>will have + past participle</strong> to describe what will be complete by a future time or deadline.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will have", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            usageMeanings: [
                {
                    title: "Deadlines and milestones",
                    description: "Talk about what will be complete by a specific future time.",
                    examples: [
                        {
                            sentence: "We <strong>will have submitted</strong> the grant by Friday.",
                        },
                        {
                            sentence: "He <strong>will have finished</strong> his apprenticeship in two months.",
                        },
                    ],
                },
                {
                    title: "Predictions with evidence",
                    description: "Use it when you can imagine the result from clues.",
                    examples: [
                        {
                            sentence: "By the time she arrives, the room <strong>will have been cleaned</strong> (we know the volunteers work fast).",
                        },
                    ],
                },
                {
                    title: "Experiences from the future",
                    description: "Describe a future moment as if looking back.",
                    examples: [
                        {
                            sentence: "You <strong>will have grown</strong> more confident after teaching that class.",
                        },
                    ],
                },
            ],
            timeExpressions: [
                {
                    word: "by / before",
                    usage: "Deadline or future reference point",
                    examples: ["by tomorrow", "before the meeting"],
                },
                {
                    word: "in + time",
                    usage: "Prediction about a future time",
                    examples: ["in two weeks", "in three classes"],
                },
            ],
            exercises: [
                {
                    id: "ex-future-simple-1",
                    title: "Future Deadlines",
                    instructions: "Complete the sentences with Future Perfect Simple.",
                    items: [
                        {
                            type: "text",
                            label: "By next week, the committee ___ (approve) the budget.",
                            expectedAnswer: "will have approved",
                        },
                        {
                            type: "text",
                            label: "He ___ (finish) the course before the summer break.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "They ___ (clean) the office by Monday morning.",
                            expectedAnswer: "will have cleaned",
                        },
                        {
                            type: "text",
                            label: "I ___ (send) the reminders before the workshop starts.",
                            expectedAnswer: "will have sent",
                        },
                        {
                            type: "text",
                            label: "You ___ (prepare) the agenda by the time everyone joins.",
                            expectedAnswer: "will have prepared",
                        },
                    ],
                },
            ],
        },
        {
            id: "part-b-continuous",
            stepNumber: 2,
            title: "Part B: Future Perfect Continuous",
            icon: "⏳",
            explanation: `
                <p>Use <strong>will have been + verb-ing</strong> to describe how long an action will have been in progress by a future time.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will have been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            usageMeanings: [
                {
                    title: "Duration up to a future point",
                    description: "Emphasize how long the action will have gone on by the point you mention.",
                    examples: [
                        {
                            sentence: "By next semester, she <strong>will have been teaching</strong> here for five years.",
                        },
                        {
                            sentence: "They <strong>will have been training</strong> for the safety drills for three weeks by then.",
                        },
                    ],
                },
                {
                    title: "Continuous efforts before a future change",
                    description: "Use it when you want to stress the ongoing effort up to that future moment.",
                    examples: [
                        {
                            sentence: "We <strong>will have been checking</strong> the translations for hours when the presentation starts.",
                        },
                    ],
                },
            ],
            timeExpressions: [
                {
                    word: "for",
                    usage: "Duration leading to future milestone",
                    examples: ["for two hours", "for several months"],
                },
                {
                    word: "by",
                    usage: "Future checkpoint",
                    examples: ["by six o'clock", "by next quarter"],
                },
            ],
            exercises: [
                {
                    id: "ex-future-continuous-1",
                    title: "Duration in the Future",
                    instructions: "Write the Future Perfect Continuous form for each sentence.",
                    items: [
                        {
                            type: "text",
                            label: "By Friday, I ___ (work) on the project for a week.",
                            expectedAnswer: "will have been working",
                        },
                        {
                            type: "text",
                            label: "By the time the concert opens, she ___ (practice) for months.",
                            expectedAnswer: "will have been practicing",
                        },
                        {
                            type: "text",
                            label: "They ___ (drive) for ten hours before they stop to rest.",
                            expectedAnswer: "will have been driving",
                        },
                        {
                            type: "text",
                            label: "He ___ (read) the manual for two days when the course starts.",
                            expectedAnswer: "will have been reading",
                        },
                        {
                            type: "text",
                            label: "We ___ (study) the policy for three sessions by next Wednesday.",
                            expectedAnswer: "will have been studying",
                        },
                    ],
                },
            ],
        },
        {
            id: "comparison",
            stepNumber: 3,
            title: "Comparison: What Will Be Done vs How Long",
            icon: "⚖️",
            explanation: `
                <p>Answer: "What will have happened?" for simple, and "How long will it have been happening?" for continuous.</p>
            `,
            comparison: {
                title: "Future Perfect Simple vs Continuous",
                leftLabel: "Simple",
                rightLabel: "Continuous",
                rows: [
                    {
                        label: "Focus",
                        left: "The completed action or result by that future time",
                        right: "The duration leading up to that future time",
                    },
                    {
                        label: "Key question",
                        left: "What will have been done?",
                        right: "How long will it have been happening?",
                    },
                    {
                        label: "Time clues",
                        left: "by tomorrow, before noon, in two weeks",
                        right: "for two years by then, for hours when, by next month",
                    },
                    {
                        label: "Example",
                        left: "You will have finished the course by June.",
                        right: "You will have been learning for a year by June.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-fpf",
                    title: "Future Focus",
                    instructions: "Choose the form that matches the focus of each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "I will have made the reservation before the end of the week.",
                            options: [
                                { value: "simple", label: "Simple" },
                                { value: "continuous", label: "Continuous" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "By 10 PM, we will have been reviewing the agenda for three hours.",
                            options: [
                                { value: "simple", label: "Simple" },
                                { value: "continuous", label: "Continuous" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "She will have been leading classes for two years when the new cohort starts.",
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
                <p>Mix the forms depending on whether the sentence needs a future result or a duration.</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-fpf",
                    title: "Future Mix",
                    instructions: "Complete each sentence with the correct Future Perfect form.",
                    items: [
                        {
                            type: "text",
                            label: "By Monday, they ___ (complete) the pilot project.",
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "She ___ (train) for five weeks by the conference.",
                            expectedAnswer: "will have been training",
                        },
                        {
                            type: "text",
                            label: "We ___ (package) all orders before the holiday rush begins.",
                            expectedAnswer: "will have packaged",
                        },
                        {
                            type: "text",
                            label: "He ___ (answer) every email for the past week by Friday.",
                            expectedAnswer: "will have been answering",
                        },
                        {
                            type: "text",
                            label: "You ___ (learn) the new vocabulary before the class meets again.",
                            expectedAnswer: "will have learned",
                        },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Summary: Future Perfect Reminders",
            icon: "📌",
            explanation: `
                <ul class="list-disc pl-6 space-y-1">
                    <li><strong>Simple:</strong> will have + past participle = focus on the future result or completion.</li>
                    <li><strong>Continuous:</strong> will have been + verb-ing = focus on how long the action will last before that point.</li>
                    <li>The question to ask: 'What will be done?' vs 'How long will it have been happening?'</li>
                    <li>Use <code>by</code>, <code>before</code>, <code>in</code> with the simple form and <code>for</code>, <code>by</code> + duration with the continuous form.</li>
                </ul>
            `,
            tipBox: {
                title: "Quick Tip",
                content: "Picture the future moment and decide: do I want the result or the length of time before it arrives?",
            },
        },
    ],
    miniQuiz: [
        {
            id: "quiz-fpf-1",
            question: "Which one looks back at a future result?",
            options: [
                { value: "a", label: "By noon, I will have eaten lunch." },
                { value: "b", label: "By noon, I will have been trying new recipes." },
                { value: "c", label: "I eat lunch at noon." },
            ],
            correctAnswer: "a",
            explanation: "The simple form describes the result at the future point (lunch will be eaten).",
        },
        {
            id: "quiz-fpf-2",
            question: "Which sentence emphasizes duration?",
            options: [
                { value: "a", label: "They will have finished the mural by Friday." },
                { value: "b", label: "They will have been painting the mural for three days by Friday." },
                { value: "c", label: "They paint murals." },
            ],
            correctAnswer: "b",
            explanation: "The continuous form plus 'for three days' emphasizes duration leading to Friday.",
        },
        {
            id: "quiz-fpf-3",
            question: "We will have been traveling ___ the conference starts.",
            options: [
                { value: "a", label: "for" },
                { value: "b", label: "by" },
                { value: "c", label: "after" },
            ],
            correctAnswer: "a",
            explanation: "'For' introduces the duration with Future Perfect Continuous.",
        },
        {
            id: "quiz-fpf-4",
            question: "Which signal words match Future Perfect Simple?",
            options: [
                { value: "a", label: "By the time" },
                { value: "b", label: "For three weeks" },
                { value: "c", label: "Since" },
            ],
            correctAnswer: "a",
            explanation: "'By the time' sets a future deadline for the result.",
        },
        {
            id: "quiz-fpf-5",
            question: "By Monday, she ___ (receive) the feedback.",
            options: [
                { value: "a", label: "will have received" },
                { value: "b", label: "will have been receiving" },
                { value: "c", label: "received" },
            ],
            correctAnswer: "a",
            explanation: "We care about the result (feedback received) by Monday.",
        },
        {
            id: "quiz-fpf-6",
            question: "They ___ (coach) the team for months when the tournament opens.",
            options: [
                { value: "a", label: "will have coached" },
                { value: "b", label: "will have been coaching" },
                { value: "c", label: "coached" },
            ],
            correctAnswer: "b",
            explanation: "Duration before the future moment (tournament opening) uses the continuous form.",
        },
        {
            id: "quiz-fpf-7",
            question: "Pick the purpose of Future Perfect Simple.",
            options: [
                { value: "a", label: "Describe future duration" },
                { value: "b", label: "Describe a future completion or result" },
                { value: "c", label: "Describe past habits" },
            ],
            correctAnswer: "b",
            explanation: "It places a completed action before a future reference point.",
        },
        {
            id: "quiz-fpf-8",
            question: "How would you rewrite: 'I will work for five hours before checkout' with Future Perfect Continuous?",
            options: [
                { value: "a", label: "I will have worked for five hours before checkout." },
                { value: "b", label: "I will have been working for five hours before checkout." },
                { value: "c", label: "I will work for five hours before checkout." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous shows the ongoing activity lasting five hours before checkout.",
        },
        {
            id: "quiz-fpf-9",
            question: "Which sentence uses the Family comparison correctly?",
            options: [
                { value: "a", label: "I will have been arriving by 6 PM." },
                { value: "b", label: "I will have arrived by 6 PM." },
                { value: "c", label: "I will arrive by 6 PM." },
            ],
            correctAnswer: "b",
            explanation: "To describe the completed arrival by 6 PM, we use Future Perfect Simple.",
        },
        {
            id: "quiz-fpf-10",
            question: "Which clue tells you to ask 'How long will it have been happening?'",
            options: [
                { value: "a", label: "By the end of the week" },
                { value: "b", label: "For two weeks" },
                { value: "c", label: "Before the meeting" },
            ],
            correctAnswer: "b",
            explanation: "'For two weeks' asks for the duration before the future point, so choose the continuous form.",
        },
    ],
};
