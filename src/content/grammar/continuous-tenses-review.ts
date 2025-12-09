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
                    ["Present Continuous", "Happening now / temporary", "I'm troubleshooting the Wi‑Fi right now."],
                    ["Past Continuous", "In progress at a past time", "I was commuting when the train stopped."],
                    ["Future Continuous", "In progress at a future time", "I'll be presenting when you join the call."],
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
                            label: '"I ___ (fix) the printer right now."',
                            options: [
                                { value: "present", label: "Present Continuous" },
                                { value: "past", label: "Past Continuous" },
                                { value: "future", label: "Future Continuous" },
                            ],
                            expectedAnswer: "present",
                        },
                        {
                            type: "radio",
                            label: '"She ___ (drive) when the alert popped up."',
                            options: [
                                { value: "present", label: "Present Continuous" },
                                { value: "past", label: "Past Continuous" },
                                { value: "future", label: "Future Continuous" },
                            ],
                            expectedAnswer: "past",
                        },
                        {
                            type: "radio",
                            label: '"They ___ (present) at 2 PM tomorrow."',
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
                            label: "Present Continuous (negative): I ___ (not join) the call right now.",
                            placeholder: "am/is/are + not + verb-ing",
                            expectedAnswer: "am not joining the call right now",
                        },
                        {
                            type: "text",
                            label: "Past Continuous (question): ___ you ___ (wait) when the bus arrived?",
                            placeholder: "Was/Were + subject + verb-ing",
                            expectedAnswer: "Were you waiting when the bus arrived?",
                        },
                        {
                            type: "text",
                            label: "Future Continuous (positive): They ___ (work) during the outage window.",
                            placeholder: "will be + verb-ing",
                            expectedAnswer: "will be working during the outage window",
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
                    { type: "text", label: "1. I ___ (restart) the router right now.", placeholder: "continuous tense", expectedAnswer: "am restarting" },
                    { type: "text", label: "2. She ___ (drive) when the alert popped up.", placeholder: "continuous tense", expectedAnswer: "was driving" },
                    { type: "text", label: "3. They ___ (present) at 2 PM tomorrow.", placeholder: "continuous tense", expectedAnswer: "will be presenting" },
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
                { value: "a", label: "I was drafting the email when my laptop died." },
                { value: "b", label: "I draft the email when my laptop died." },
                { value: "c", label: "I will be drafting the email when my laptop died." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous for the ongoing action; Past Simple for the interruption.",
        },
        {
            id: "quiz-3",
            question: "Which is the best choice to show overlap with a future event?",
            options: [
                { value: "a", label: "She will present when you join." },
                { value: "b", label: "She will be presenting when you join." },
                { value: "c", label: "She presents when you join." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous shows the action in progress during another future event.",
        },
    ],
};
