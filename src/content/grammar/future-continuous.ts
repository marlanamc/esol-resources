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
                            label: "\"I<span class='eg-helper'>'ll be</span> <span class='eg-verb'>sleeping</span> at midnight.\"",
                            options: [
                                { value: "in-progress-future", label: "In progress at a future time" },
                                { value: "promise", label: "Promise" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "in-progress-future",
                        },
                        {
                            type: "radio",
                            label: "\"She<span class='eg-helper'>'ll be</span> <span class='eg-verb'>cooking</span> when you arrive.\"",
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
                    { type: "text", label: "The volunteers ___ (serve) meals at the shelter all day Saturday.", expectedAnswer: "will be serving" },
                    { type: "text", label: "My sister ___ (perform) in the theater production this time tomorrow.", expectedAnswer: "will be performing" },
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
                                { value: "a", label: "won't be + verb-ing" },
                                { value: "b", label: "will not + verb" },
                                { value: "c", label: "won't + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I won't be answering my phone during the movie." },
                                { value: "b", label: "I won't answer my phone during the movie." },
                                { value: "c", label: "I won't be answer my phone during the movie." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly shows what will NOT be happening?",
                            options: [
                                { value: "a", label: "They won't be home this weekend." },
                                { value: "b", label: "They won't home this weekend." },
                                { value: "c", label: "They will not home this weekend." },
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
                        { type: "text", label: "At 9 PM tonight, I ___ (watch) my favorite show.", expectedAnswer: "will be watching" },
                        { type: "text", label: "This time tomorrow, she ___ (fly) to Paris.", expectedAnswer: "will be flying" },
                        { type: "text", label: "They ___ (not work) during the holidays.", expectedAnswer: "won't be working" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 3: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "I will be sleep at midnight.", expectedAnswer: "I will be sleeping at midnight" },
                        { type: "text", label: "She won't be come to the party.", expectedAnswer: "She won't be coming to the party" },
                        { type: "text", label: "Will you be work tomorrow at 5 PM?", expectedAnswer: "Will you be working tomorrow at 5 PM" },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `<ul class="list-disc pl-6 space-y-1"><li><strong>Use:</strong> Actions in progress at a specific future time; polite availability notes</li><li><strong>Form:</strong> will be + verb-ing (or won't be + verb-ing for negatives)</li><li><strong>Signal words:</strong> at 8pm tomorrow, this time next week, when you join, during</li></ul>`,
            exercises: [
                {
                    id: "future-continuous-summary-1",
                    title: "Practice: Future Continuous Review",
                    instructions: "Test your understanding of future continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for Future Continuous?",
                            options: [
                                { value: "a", label: "will be + verb-ing" },
                                { value: "b", label: "am/is/are + verb-ing" },
                                { value: "c", label: "was/were + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do you use Future Continuous?",
                            options: [
                                { value: "a", label: "Actions in progress at a specific future time; polite availability notes" },
                                { value: "b", label: "Actions happening right now" },
                                { value: "c", label: "Past actions in progress" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What are signal words for Future Continuous?",
                            options: [
                                { value: "a", label: "at 8pm tomorrow, this time next week, when you join, during" },
                                { value: "b", label: "yesterday, last week, ago" },
                                { value: "c", label: "now, at the moment" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I will be studying at 8pm tomorrow." },
                                { value: "b", label: "I will study at 8pm tomorrow." },
                                { value: "c", label: "I am studying at 8pm tomorrow." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses Future Continuous for polite availability?",
                            options: [
                                { value: "a", label: "I'll be visiting family tomorrow, so I can't meet." },
                                { value: "b", label: "I visit family tomorrow." },
                                { value: "c", label: "I'll visit family tomorrow." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
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
            explanation: "Future Continuous: will be + verb-ing. The -ing form is required after 'will be'.",
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
            explanation: "Future Continuous shows an ongoing action overlapping another future event. She starts cooking BEFORE you arrive.",
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
            explanation: "Question form: Will + subject + be + verb-ing? All three parts (will, be, -ing) are needed.",
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
            explanation: "Future Continuous is often used to set expectations/availability politely—it's softer than saying 'I can't'.",
        },
        {
            id: "quiz-5",
            question: "What is the negative form of 'I will be working'?",
            options: [
                { value: "a", label: "I won't be working" },
                { value: "b", label: "I will not working" },
                { value: "c", label: "I won't working" },
            ],
            correctAnswer: "a",
            explanation: "Negative: won't be + verb-ing. 'Be' is required in the negative form too.",
        },
        {
            id: "quiz-6",
            question: "Which time expression fits Future Continuous?",
            options: [
                { value: "a", label: "at 8 PM tomorrow" },
                { value: "b", label: "yesterday at noon" },
                { value: "c", label: "right now" },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous uses future time expressions like 'at 8 PM tomorrow' or 'this time next week'.",
        },
        {
            id: "quiz-7",
            question: "Fill in: 'This time next week, I ___ (travel) to Spain.'",
            options: [
                { value: "a", label: "will be traveling" },
                { value: "b", label: "was traveling" },
                { value: "c", label: "am traveling" },
            ],
            correctAnswer: "a",
            explanation: "'This time next week' signals a future point in time—use Future Continuous for an ongoing action then.",
        },
        {
            id: "quiz-8",
            question: "What's the formula for Future Continuous?",
            options: [
                { value: "a", label: "will be + verb-ing" },
                { value: "b", label: "will + verb" },
                { value: "c", label: "be going to + verb" },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous = will be + verb-ing. It's the same for ALL subjects (I/you/he/she/we/they).",
        },
        {
            id: "quiz-9",
            question: "Which sentence shows TWO overlapping future actions?",
            options: [
                { value: "a", label: "I'll call you at 6 PM." },
                { value: "b", label: "I'll be driving when you call." },
                { value: "c", label: "I drive to work every day." },
            ],
            correctAnswer: "b",
            explanation: "'I'll be driving when you call' shows driving (ongoing) overlapping with your call (point in time).",
        },
        {
            id: "quiz-10",
            question: "Fix the error: 'She will be work late tonight.'",
            options: [
                { value: "a", label: "She will be working late tonight." },
                { value: "b", label: "She will work late tonight." },
                { value: "c", label: "She is working late tonight." },
            ],
            correctAnswer: "a",
            explanation: "After 'will be', you must use the -ing form: 'will be working'—not 'will be work'.",
        },
        {
            id: "quiz-11",
            question: "Which question asks about an ongoing future action?",
            options: [
                { value: "a", label: "Will you be studying at 9 PM?" },
                { value: "b", label: "Did you study for the test?" },
                { value: "c", label: "Do you study every day?" },
            ],
            correctAnswer: "a",
            explanation: "'Will you be studying' asks about an action in progress at a specific future time (9 PM).",
        },
        {
            id: "quiz-12",
            question: "When do you use Future Continuous instead of Future Simple?",
            options: [
                { value: "a", label: "To emphasize the action will be IN PROGRESS at a specific future time" },
                { value: "b", label: "To describe a quick decision made now" },
                { value: "c", label: "To describe a completed action" },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous = action in progress. Future Simple = one-off event or decision.",
        },
        {
            id: "quiz-13",
            question: "Complete: 'At midnight, the whole family ___ (sleep).'",
            options: [
                { value: "a", label: "will be sleeping" },
                { value: "b", label: "will sleep" },
                { value: "c", label: "sleeps" },
            ],
            correctAnswer: "a",
            explanation: "'At midnight' specifies a future point when the action will be IN PROGRESS—use Future Continuous.",
        },
        {
            id: "quiz-14",
            question: "Which is a polite way to decline an invitation?",
            options: [
                { value: "a", label: "I can't come." },
                { value: "b", label: "I'll be working that day, unfortunately." },
                { value: "c", label: "I won't come." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous ('I'll be working') sounds softer and more polite than a flat refusal.",
        },
        {
            id: "quiz-15",
            question: "How is Future Continuous different from Present Continuous for future?",
            options: [
                { value: "a", label: "Future Continuous uses 'will be', Present Continuous uses 'am/is/are'" },
                { value: "b", label: "They are exactly the same" },
                { value: "c", label: "Future Continuous uses 'was/were'" },
            ],
            correctAnswer: "a",
            explanation: "Both can express future actions, but Future Continuous uses 'will be + -ing' while Present Continuous uses 'am/is/are + -ing'.",
        },
    ],
};
