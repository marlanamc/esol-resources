import type { InteractiveGuideContent } from "@/types/activity";

export const futureContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Continuous: What You'll Be Doing",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(80, 170, 245, 0.12) 0%, rgba(255, 220, 140, 0.12) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem;">
                    <p style="margin: 0; font-size: 1.05rem;">Future Continuous is for actions that will be <strong>in progress</strong> at a specific moment later. Picture yourself tomorrow: “At 9 PM, I’ll be answering emails… again.”</p>
                </div>
            `,
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Continuous",
            icon: "⭐",
            usageMeanings: [
                {
                    title: "⏩ 1. Action In Progress at a Future Time",
                    description: "Describe what will be happening at a set time",
                    examples: [
                        { sentence: "I <strong>will be commuting</strong> at 7 AM tomorrow.", explanation: "✓ Ongoing at a future clock time" },
                        { sentence: "She <strong>will be presenting</strong> when you join the call.", explanation: "✓ In progress during another future action" },
                        { sentence: "They <strong>will be testing</strong> the new feature this afternoon.", explanation: "✓ Activity in progress in a future period" },
                    ],
                },
                {
                    title: "🎢 2. Setting Expectations Politely",
                    description: "Explain you’re busy at a future time (without saying no directly)",
                    examples: [
                        { sentence: "I <strong>will be meeting</strong> with a client then, so can we move it?", explanation: "✓ Soft way to decline" },
                        { sentence: "We <strong>will be traveling</strong> next week, so responses may be slow.", explanation: "✓ Gives context for future availability" },
                    ],
                },
            ],
            tipBox: { title: "💡 Remember", content: "Future Continuous = action in progress at a future moment. Future Simple = one-off decision or promise." },
            exercises: [
                {
                    id: "ex-usage-fc-1",
                    title: "Will It Be In Progress?",
                    instructions: "Choose when Future Continuous is the best choice.",
                    items: [
                        {
                            type: "radio",
                            label: '"I’ll be commuting at 7 AM tomorrow."',
                            options: [
                                { value: "in-progress-future", label: "In progress at a future time" },
                                { value: "promise", label: "Promise" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "in-progress-future",
                        },
                        {
                            type: "radio",
                            label: '"She’ll be presenting when you join the call."',
                            options: [
                                { value: "overlap", label: "Overlapping future action" },
                                { value: "decision-now", label: "Decision made now" },
                                { value: "finished", label: "Finished action" },
                            ],
                            expectedAnswer: "overlap",
                        },
                        {
                            type: "radio",
                            label: '"We’ll be traveling next week, so responses may be slow."',
                            options: [
                                { value: "availability", label: "Setting future availability/context" },
                                { value: "habit", label: "Routine" },
                                { value: "past", label: "Past action" },
                            ],
                            expectedAnswer: "availability",
                        },
                    ],
                },
            ],
        },
        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `<p>Formula: <strong>will be + verb-ing</strong>. Same for every subject.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I will be finishing the report at 10 PM.",
                "She will be flying during the team sync.",
                "They will be running load tests tonight.",
            ],
            exercises: [{
                id: "ex-1",
                title: "Exercise 1: Picture the Future",
                instructions: "Complete with will be + verb-ing.",
                items: [
                    { type: "text", label: "1. I ___ (review) resumes all afternoon.", placeholder: "will be + ing", expectedAnswer: "will be reviewing" },
                    { type: "text", label: "2. They ___ (travel) at this time next week.", placeholder: "will be + ing", expectedAnswer: "will be traveling" },
                ],
            }],
        },
        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `<p>Use <strong>won't be + verb-ing</strong> to show what will NOT be happening.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: ["I won't be checking email on vacation.", "They won't be working this weekend."],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `<p>Flip 'Will' to the front: <strong>Will + subject + be + verb-ing?</strong></p>`,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "be + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: ["Will you be driving to the office tomorrow?", "Will she be using the conference room at 2?"],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `<ul class="list-disc pl-6 space-y-1"><li><strong>Use:</strong> Actions in progress at a specific future time; polite availability notes</li><li><strong>Form:</strong> will be + verb-ing (or won't be + verb-ing for negatives)</li><li><strong>Signal words:</strong> at 8pm tomorrow, this time next week, when you join, during</li></ul>`,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence uses Future Continuous correctly?",
            options: [
                { value: "a", label: "I will be study at 8pm." },
                { value: "b", label: "I will be studying at 8pm." },
                { value: "c", label: "I am studying at 8pm tomorrow." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous: will be + verb-ing for an action in progress at a future time.",
        },
        {
            id: "quiz-2",
            question: "Pick the best use of Future Continuous vs Future Simple.",
            options: [
                { value: "a", label: "She will present when you join the call." },
                { value: "b", label: "She will be presenting when you join the call." },
                { value: "c", label: "She presents when you join the call." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous shows an ongoing action overlapping another future event.",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Will you be working late tonight?" },
                { value: "b", label: "Will you working late tonight?" },
                { value: "c", label: "You will be working late tonight?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Will + subject + be + verb-ing.",
        },
        {
            id: "quiz-4",
            question: "Choose the sentence that politely sets future availability.",
            options: [
                { value: "a", label: "I work when you email tomorrow." },
                { value: "b", label: "I'll work when you email tomorrow." },
                { value: "c", label: "I'll be traveling tomorrow, so responses may be slow." },
            ],
            correctAnswer: "c",
            explanation: "Future Continuous is often used to set expectations/availability politely.",
        },
    ],
};
