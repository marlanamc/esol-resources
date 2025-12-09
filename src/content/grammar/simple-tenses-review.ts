import type { InteractiveGuideContent } from "@/types/activity";

export const simpleTensesReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Simple Tenses Review",
            icon: "📚",
            explanation: `
                <p>Three simple tenses, three different vibes: your routines, what already happened, and what you'll do next. Let's make them practical, not textbook-y.</p>
                <p><strong>Simple Tenses:</strong> Present Simple (habits), Past Simple (finished), Future Simple (promises/decisions)</p>
            `,
        },
        {
            id: "comparison",
            stepNumber: 1,
            title: "Comparing the Simple Tenses",
            icon: "🔄",
            verbTable: {
                title: "Simple Tenses: When to Use Each",
                headers: ["Tense", "When to Use", "Example"],
                rows: [
                    ["Present Simple", "Habits, facts, your job/life situation", "I start my shift at 7 AM."],
                    ["Past Simple", "Finished actions in a finished time", "I submitted the report yesterday."],
                    ["Future Simple", "Quick decisions, promises, predictions", "I'll send the deck tonight."],
                ],
            },
            explanation: `
                <h3>Key Differences</h3>
                <p><strong>Present Simple:</strong> Routines and realities that stick (your job, your commute, your opinions).</p>
                <p><strong>Past Simple:</strong> Finished actions with a time stamp (yesterday, last week, in 2022).</p>
                <p><strong>Future Simple:</strong> Quick calls about the future (I'll help, it'll rain, we'll see).</p>
            `,
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Pick the Right Simple Tense",
                    instructions: "Choose the tense that fits each situation.",
                    items: [
                        {
                            type: "radio",
                            label: '"She submits the report every Friday."',
                            options: [
                                { value: "present", label: "Present Simple" },
                                { value: "past", label: "Past Simple" },
                                { value: "future", label: "Future Simple" },
                            ],
                            expectedAnswer: "present",
                        },
                        {
                            type: "radio",
                            label: '"They launched the app last night."',
                            options: [
                                { value: "present", label: "Present Simple" },
                                { value: "past", label: "Past Simple" },
                                { value: "future", label: "Future Simple" },
                            ],
                            expectedAnswer: "past",
                        },
                        {
                            type: "radio",
                            label: '"I’ll cover the morning shift tomorrow."',
                            options: [
                                { value: "present", label: "Present Simple" },
                                { value: "past", label: "Past Simple" },
                                { value: "future", label: "Future Simple" },
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
                title: "Simple Tenses: All Forms",
                headers: ["Tense", "Positive", "Negative", "Question"],
                rows: [
                    ["Present Simple", "I work / She works", "I don't work / She doesn't work", "Do you work? / Does she work?"],
                    ["Past Simple", "I finished", "I didn't finish", "Did you finish?"],
                    ["Future Simple", "I will join", "I won't join", "Will you join?"],
                ],
            },
            exercises: [
                {
                    id: "ex-forms-1",
                    title: "Quick Form Check",
                    instructions: "Rewrite using the form shown.",
                    items: [
                        {
                            type: "text",
                            label: "Present Simple (question): ___ she work on weekends?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Does she work on weekends?",
                        },
                        {
                            type: "text",
                            label: "Past Simple (negative): I ___ finish the task.",
                            placeholder: "didn't + base verb",
                            expectedAnswer: "didn't finish the task",
                        },
                        {
                            type: "text",
                            label: "Future Simple (positive): They ___ send the invite.",
                            placeholder: "will + base verb",
                            expectedAnswer: "will send the invite",
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
                instructions: "Pick the right tense for the meaning and time clue.",
                items: [
                    { type: "text", label: "1. I ___ (grab) coffee before every meeting.", placeholder: "which tense?", expectedAnswer: "grab" },
                    { type: "text", label: "2. She ___ (lose) Wi‑Fi during yesterday's call.", placeholder: "which tense?", expectedAnswer: "lost" },
                    { type: "text", label: "3. They ___ (send) the slides tonight.", placeholder: "which tense?", expectedAnswer: "will send" },
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
                    <li><strong>Present Simple:</strong> Habits & facts (I start, she works)</li>
                    <li><strong>Past Simple:</strong> Finished past (I shipped, they tested)</li>
                    <li><strong>Future Simple:</strong> Decisions/promises (I'll join, we'll fix it)</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which tense fits: 'The train ___ at 7:05 AM tomorrow (timetable)'?",
            options: [
                { value: "a", label: "Present Simple: leaves" },
                { value: "b", label: "Past Simple: left" },
                { value: "c", label: "Future Simple: will leave" },
            ],
            correctAnswer: "a",
            explanation: "Fixed schedules often use Present Simple: leaves at 7:05 AM.",
        },
        {
            id: "quiz-2",
            question: "Which tense fits: 'I ___ the slides last night.'",
            options: [
                { value: "a", label: "finish" },
                { value: "b", label: "will finish" },
                { value: "c", label: "finished" },
            ],
            correctAnswer: "c",
            explanation: "Specific finished past time → Past Simple: finished.",
        },
        {
            id: "quiz-3",
            question: "Which tense fits: 'I ___ cover the morning shift. Want to swap?'",
            options: [
                { value: "a", label: "will" },
                { value: "b", label: "cover" },
                { value: "c", label: "covered" },
            ],
            correctAnswer: "a",
            explanation: "Spontaneous decision/promise → Future Simple with will.",
        },
    ],
};
