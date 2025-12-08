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
                <p>Let's review all three Continuous Tenses together!</p>
                <p><strong>Continuous Tenses:</strong> Present Continuous, Past Continuous, Future Continuous</p>
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
                    ["Present Continuous", "Happening NOW or temporary", "I am working now."],
                    ["Past Continuous", "In progress at past time", "I was working at 8pm."],
                    ["Future Continuous", "In progress at future time", "I will be working at 8pm tomorrow."],
                ],
            },
            explanation: `
                <h3>Key Pattern</h3>
                <p>All continuous tenses use <strong>be + verb-ing</strong></p>
                <p>The difference is in the time: NOW, PAST, or FUTURE</p>
            `,
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
        },
        {
            id: "practice",
            stepNumber: 3,
            title: "Mixed Practice",
            exercises: [{
                id: "ex-mixed",
                title: "Choose the Correct Tense",
                instructions: "Complete with the correct continuous tense",
                items: [
                    { type: "text", label: "1. I ___ (study) right now.", placeholder: "continuous tense", expectedAnswer: "am studying" },
                    { type: "text", label: "2. She ___ (cook) when I arrived.", placeholder: "continuous tense", expectedAnswer: "was cooking" },
                    { type: "text", label: "3. They ___ (play) at 3pm tomorrow.", placeholder: "continuous tense", expectedAnswer: "will be playing" },
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
                    <li><strong>Present Continuous:</strong> am/is/are + verb-ing</li>
                    <li><strong>Past Continuous:</strong> was/were + verb-ing</li>
                    <li><strong>Future Continuous:</strong> will be + verb-ing</li>
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
    ],
};
