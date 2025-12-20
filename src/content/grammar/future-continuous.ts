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
                    <p style="margin: 0; font-size: 1.05rem;">Future Continuous is for actions that will be <strong>in progress</strong> at a specific moment later. Picture yourself tomorrow: "At 9 PM, I'll be watching my favorite show."</p>
                </div>
            `,
            exercises: [
                {
                    id: "future-continuous-intro-1",
                    title: "Practice: Understanding Future Continuous",
                    instructions: "Identify what Future Continuous describes.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Future Continuous describe?",
                            options: [
                                { value: "a", label: "Actions that will be in progress at a specific future moment" },
                                { value: "b", label: "Completed past actions" },
                                { value: "c", label: "Current habits" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"At 9 PM, I\'ll be watching my favorite show." What does this describe?',
                            options: [
                                { value: "a", label: "An action in progress at a specific future time" },
                                { value: "b", label: "A completed action" },
                                { value: "c", label: "A habit" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do we use Future Continuous?",
                            options: [
                                { value: "a", label: "To describe actions that will be happening at a specific future moment" },
                                { value: "b", label: "To describe past actions" },
                                { value: "c", label: "To describe current habits" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
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
                        { sentence: "I <strong>will be sleeping</strong> at midnight.", explanation: "✓ Ongoing at a future clock time" },
                        { sentence: "She <strong>will be cooking</strong> when you arrive.", explanation: "✓ In progress during another future action" },
                        { sentence: "They <strong>will be playing</strong> soccer this afternoon.", explanation: "✓ Activity in progress in a future period" },
                    ],
                },
                {
                    title: "🎢 2. Setting Expectations Politely",
                    description: "Explain you’re busy at a future time (without saying no directly)",
                    examples: [
                        { sentence: "I <strong>will be visiting</strong> family then, so can we reschedule?", explanation: "✓ Soft way to decline" },
                        { sentence: "We <strong>will be on vacation</strong> next week.", explanation: "✓ Gives context for future availability" },
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
                            label: "\"I'll be sleeping at midnight.\"",
                            options: [
                                { value: "in-progress-future", label: "In progress at a future time" },
                                { value: "promise", label: "Promise" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "in-progress-future",
                        },
                        {
                            type: "radio",
                            label: "\"She'll be cooking when you arrive.\"",
                            options: [
                                { value: "overlap", label: "Overlapping future action" },
                                { value: "decision-now", label: "Decision made now" },
                                { value: "finished", label: "Finished action" },
                            ],
                            expectedAnswer: "overlap",
                        },
                        {
                            type: "radio",
                            label: "\"We'll be on vacation next week.\"",
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
            explanation: `
                <p>Formula: <strong>will be + verb-ing</strong>. Same for every subject.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">will be sleeping</span> at 10 PM.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">will be driving</span> when you call.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">will be watching</span> the game tonight.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [{
                id: "ex-1",
                title: "Exercise 1: Picture the Future",
                instructions: "Complete with will be + verb-ing.",
                items: [
                    { type: "text", label: "1. The volunteers ___ (serve) meals at the shelter all day Saturday.", expectedAnswer: "will be serving" },
                    { type: "text", label: "2. My sister ___ (perform) in the theater production this time tomorrow.", expectedAnswer: "will be performing" },
                ],
            }],
        },
        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `
                <p>Use <strong>won't be + verb-ing</strong> to show what will NOT be happening.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">won't be answering</span> my phone during the movie.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">won't be</span> home this weekend.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "future-continuous-negative-1",
                    title: "Practice: Future Continuous Negative Form",
                    instructions: "Choose the correct negative form of future continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the negative form of future continuous?",
                            options: [
                                { value: "a", label: "won't be + verb-ing (won't be + present participle)" },
                                { value: "b", label: "will not + verb (wrong form)" },
                                { value: "c", label: "won't + verb-ing (missing 'be')" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I won't be answering my phone during the movie. (correct negative form)" },
                                { value: "b", label: "I won't answer my phone during the movie. (wrong - this is future simple)" },
                                { value: "c", label: "I won't be answer my phone during the movie. (missing -ing)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly shows what will NOT be happening?",
                            options: [
                                { value: "a", label: "They won't be home this weekend. (won't be + verb-ing)" },
                                { value: "b", label: "They won't home this weekend. (missing 'be')" },
                                { value: "c", label: "They will not home this weekend. (wrong structure)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `
                <p>Flip 'Will' to the front: <strong>Will + subject + be + verb-ing?</strong></p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> you <span style="color: #06b6d4; font-weight: 600;">be coming</span> to dinner tomorrow?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> she <span style="color: #06b6d4; font-weight: 600;">be sleeping</span> at midnight?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "be + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 1: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'work' with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ be working", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ be working", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I be working?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-practice-1",
                    title: "Exercise 2: Future Actions in Progress",
                    instructions: "Complete the sentences with Future Continuous.",
                    items: [
                        { type: "text", label: "1. At 9 PM tonight, I ___ (watch) my favorite show.", expectedAnswer: "will be watching" },
                        { type: "text", label: "2. This time tomorrow, she ___ (fly) to Paris.", expectedAnswer: "will be flying" },
                        { type: "text", label: "3. They ___ (not work) during the holidays.", expectedAnswer: "won't be working" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 3: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "1. I will be sleep at midnight.", expectedAnswer: "I will be sleeping at midnight" },
                        { type: "text", label: "2. She won't be come to the party.", expectedAnswer: "She won't be coming to the party" },
                        { type: "text", label: "3. Will you be work tomorrow at 5 PM?", expectedAnswer: "Will you be working tomorrow at 5 PM" },
                    ],
                },
            ],
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
                { value: "a", label: "She will cook when you arrive." },
                { value: "b", label: "She will be cooking when you arrive." },
                { value: "c", label: "She cooks when you arrive." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous shows an ongoing action overlapping another future event.",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Will you be sleeping at midnight?" },
                { value: "b", label: "Will you sleeping at midnight?" },
                { value: "c", label: "You will be sleeping at midnight?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Will + subject + be + verb-ing.",
        },
        {
            id: "quiz-4",
            question: "Choose the sentence that politely sets future availability.",
            options: [
                { value: "a", label: "I visit family when you call tomorrow." },
                { value: "b", label: "I'll visit family when you call tomorrow." },
                { value: "c", label: "I'll be visiting family tomorrow, so I can't meet." },
            ],
            correctAnswer: "c",
            explanation: "Future Continuous is often used to set expectations/availability politely.",
        },
    ],
};
