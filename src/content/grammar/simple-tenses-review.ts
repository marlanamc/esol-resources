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
                <p>Let's review all three Simple Tenses together and learn when to use each one!</p>
                <p><strong>Simple Tenses:</strong> Present Simple, Past Simple, Future Simple</p>
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
                    ["Present Simple", "Habits, facts, general truths", "I work every day."],
                    ["Past Simple", "Finished actions in the past", "I worked yesterday."],
                    ["Future Simple", "Predictions, promises, decisions", "I will work tomorrow."],
                ],
            },
            explanation: `
                <h3>Key Differences</h3>
                <p><strong>Present Simple:</strong> Things that are generally true or happen regularly</p>
                <p><strong>Past Simple:</strong> Things that happened and finished in the past</p>
                <p><strong>Future Simple:</strong> Things that will happen in the future</p>
            `,
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
                    ["Past Simple", "I worked", "I didn't work", "Did you work?"],
                    ["Future Simple", "I will work", "I won't work", "Will you work?"],
                ],
            },
        },
        {
            id: "practice",
            stepNumber: 3,
            title: "Mixed Practice",
            exercises: [{
                id: "ex-mixed",
                title: "Choose the Correct Tense",
                instructions: "Select Present Simple, Past Simple, or Future Simple",
                items: [
                    { type: "text", label: "1. I ___ (go) to school every day.", placeholder: "which tense?", expectedAnswer: "go" },
                    { type: "text", label: "2. She ___ (visit) Paris last year.", placeholder: "which tense?", expectedAnswer: "visited" },
                    { type: "text", label: "3. They ___ (help) us tomorrow.", placeholder: "which tense?", expectedAnswer: "will help" },
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
                    <li><strong>Present Simple:</strong> Habits & facts (work/works)</li>
                    <li><strong>Past Simple:</strong> Finished past (worked)</li>
                    <li><strong>Future Simple:</strong> Future actions (will work)</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which tense for habits?",
            options: [
                { value: "a", label: "Present Simple" },
                { value: "b", label: "Past Simple" },
                { value: "c", label: "Future Simple" },
            ],
            correctAnswer: "a",
            explanation: "Present Simple is for habits and routines.",
        },
    ],
};
