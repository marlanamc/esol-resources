import type { InteractiveGuideContent } from "@/types/activity";

export const continuousTensesReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Continuous Tenses Review",
            icon: "📚",
            explanation: `
                <p>All the “-ing” tenses in one place: what's happening now, what was happening then, and what will be happening later.</p>
                <p><strong>Continuous Tenses:</strong> Present (now/temporary), Past (in progress in the past), Future (in progress at a future time)</p>
            `,
        },
        {
            id: "comparison",
            stepNumber: 1,
            title: "Comparing Continuous Tenses",
            icon: "🔄",
            verbTable: {
                title: "Continuous Tenses: When to Use Each",
                headers: ["Tense", "When to Use", "Example"],
                rows: [
                    ["Present Continuous", "Happening now / temporary", "I'm watching TV right now."],
                    ["Past Continuous", "In progress at a past time", "I was walking when it started raining."],
                    ["Future Continuous", "In progress at a future time", "I'll be sleeping when you arrive."],
                ],
            },
            explanation: `
                <h3>Key Pattern</h3>
                <p>All continuous tenses use <strong>be + verb-ing</strong>.</p>
                <p>Only the time changes: NOW, PAST, or FUTURE.</p>
            `,
            exercises: [
                {
                    id: "ex-cont-review-compare-1",
                    title: "Choose the Right Continuous Tense",
                    instructions: "Pick which continuous tense fits each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I ___ (make) dinner right now.\"",
                            options: [
                                { value: "present", label: "Present Continuous" },
                                { value: "past", label: "Past Continuous" },
                                { value: "future", label: "Future Continuous" },
                            ],
                            expectedAnswer: "present",
                        },
                        {
                            type: "radio",
                            label: "\"She ___ (drive) when her phone rang.\"",
                            options: [
                                { value: "present", label: "Present Continuous" },
                                { value: "past", label: "Past Continuous" },
                                { value: "future", label: "Future Continuous" },
                            ],
                            expectedAnswer: "past",
                        },
                        {
                            type: "radio",
                            label: "\"They ___ (play) soccer at 2 PM tomorrow.\"",
                            options: [
                                { value: "present", label: "Present Continuous" },
                                { value: "past", label: "Past Continuous" },
                                { value: "future", label: "Future Continuous" },
                            ],
                            expectedAnswer: "future",
                        },
                    ],
                },
            ],
        },
        {
            id: "forms",
            stepNumber: 2,
            title: "Forms Summary",
            verbTable: {
                title: "Continuous Tenses: All Forms",
                headers: ["Tense", "Positive", "Negative", "Question"],
                rows: [
                    ["Present Continuous", "I am working", "I'm not working", "Are you working?"],
                    ["Past Continuous", "I was working", "I wasn't working", "Were you working?"],
                    ["Future Continuous", "I will be working", "I won't be working", "Will you be working?"],
                ],
            },
            exercises: [
                {
                    id: "ex-cont-review-forms-1",
                    title: "Form Check",
                    instructions: "Rewrite with the correct continuous form.",
                    items: [
                        {
                            type: "text",
                            label: "Present Continuous (negative): I ___ (not watch) TV right now.",
                            placeholder: "am/is/are + not + verb-ing",
                            expectedAnswer: "am not watching TV right now",
                        },
                        {
                            type: "text",
                            label: "Past Continuous (question): ___ you ___ (wait) when the bus arrived?",
                            placeholder: "Was/Were + subject + verb-ing",
                            expectedAnswer: "Were you waiting when the bus arrived?",
                        },
                        {
                            type: "text",
                            label: "Future Continuous (positive): They ___ (travel) during the holidays.",
                            placeholder: "will be + verb-ing",
                            expectedAnswer: "will be traveling during the holidays",
                        },
                    ],
                },
            ],
        },
        {
            id: "practice",
            stepNumber: 3,
            title: "Mixed Practice",
            exercises: [{
                id: "ex-mixed",
                title: "Choose the Correct Tense",
                instructions: "Complete with the correct continuous tense (now / past / future).",
                items: [
                    { type: "text", label: "1. I ___ (cook) dinner right now.", placeholder: "continuous tense", expectedAnswer: "am cooking" },
                    { type: "text", label: "2. She ___ (drive) when her phone rang.", placeholder: "continuous tense", expectedAnswer: "was driving" },
                    { type: "text", label: "3. They ___ (play) soccer at 2 PM tomorrow.", placeholder: "continuous tense", expectedAnswer: "will be playing" },
                ],
            }],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `
                <h3>Remember</h3>
                <ul class="list-disc pl-6">
                    <li><strong>Present Continuous:</strong> am/is/are + verb-ing (now or temporary)</li>
                    <li><strong>Past Continuous:</strong> was/were + verb-ing (in progress then)</li>
                    <li><strong>Future Continuous:</strong> will be + verb-ing (in progress later)</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which form for actions happening NOW?",
            options: [
                { value: "a", label: "am/is/are + verb-ing" },
                { value: "b", label: "was/were + verb-ing" },
                { value: "c", label: "will be + verb-ing" },
            ],
            correctAnswer: "a",
            explanation: "Present Continuous (am/is/are + verb-ing) for actions happening now.",
        },
        {
            id: "quiz-2",
            question: "Which sentence shows a past action interrupted by another?",
            options: [
                { value: "a", label: "I was cooking when the fire alarm went off." },
                { value: "b", label: "I cook when the fire alarm went off." },
                { value: "c", label: "I will be cooking when the fire alarm went off." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous for the ongoing action; Past Simple for the interruption.",
        },
        {
            id: "quiz-3",
            question: "Which is the best choice to show overlap with a future event?",
            options: [
                { value: "a", label: "She will cook when you arrive." },
                { value: "b", label: "She will be cooking when you arrive." },
                { value: "c", label: "She cooks when you arrive." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous shows the action in progress during another future event.",
        },
    ],
};
