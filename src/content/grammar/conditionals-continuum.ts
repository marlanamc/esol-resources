import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsContinuumContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "intro",
            title: "Conditionals Continuum: Routine, Plans, and Imagining Better",
            icon: "✨",
            explanation: `
                <p>Conditionals connect situations and results across the timeline of your life in East Boston. Match each conditional to routine facts, plans with a deadline, or imagination/what-if reflections.</p>
                <div style="margin-top: 1rem; padding: 1rem; border-radius: 0.75rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb;">
                    <p style="margin: 0;"><strong>Zero Conditional:</strong> facts or repeated routines. “If I heat water, it boils.”</p>
                    <p style="margin: 0;"><strong>First/Future Conditional:</strong> real plans and future possibilities. “If I study, I will pass the interview,” or “If I finish on time, I will submit the report.”</p>
                    <p style="margin: 0;"><strong>Second/Third Conditional:</strong> imagined situations and regrets. “If I had a flexible schedule, I would take more classes.” “If I had known, I would have asked sooner.”</p>
                </div>
            `,
        },
        {
            id: "zero-first",
            stepNumber: 1,
            title: "Zero, First & Future: Routine to Real Possibility",
            icon: "🔄",
            explanation: `
                <p>Build from routines to plans.</p>
                <ul>
                    <li><strong>Zero:</strong> Use present simple in both clauses for facts and habits. “If I visit the East Boston kitchen, I bring extra snacks.”</li>
                    <li><strong>First:</strong> Use present simple + will for future choices we can still make. “If I finish my resume, I will submit it by Thursday.”</li>
                    <li><strong>Future conditional:</strong> Extends first conditionals when you want to stress a deadline or promise with “will” after the main clause. “If I arrive early, I will get the front seat.”</li>
                </ul>
                <p>Zero describes data or routines; first/future talk about actions you control and expect.</p>
            `,
            exercises: [
                {
                    id: "zero-first-1",
                    title: "Match the Meaning",
                    instructions: "Choose whether the sentence is zero or first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "If water gets cold, it freezes.",
                            options: [
                                { value: "zero", label: "Zero (routine/fact)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "If I rehearse the presentation, I will feel confident.",
                            options: [
                                { value: "zero", label: "Zero (routine/fact)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "first",
                        },
                    ],
                },
                {
                    id: "zero-first-3",
                    title: "Future Conditional Check",
                    instructions: "Pick the sentence that matches a future promise with will.",
                    items: [
                        {
                            type: "radio",
                            label: "If we finish the application, we will call the employer before Friday.",
                            options: [
                                { value: "future", label: "Future conditional (will)" },
                                { value: "zero", label: "Zero conditional (routine)" },
                            ],
                            expectedAnswer: "future",
                        },
                    ],
                },
                {
                    id: "zero-first-2",
                    title: "Complete the Sentence",
                    instructions: "Fill in the blank with the correct first conditional verb.",
                    items: [
                        {
                            type: "radio",
                            label: "If I get hired, I ___ bring my ID to the meeting.",
                            options: [
                                { value: "will", label: "will" },
                                { value: "would", label: "would" },
                            ],
                            expectedAnswer: "will",
                        },
                    ],
                },
            ],
        },
                {
                    id: "second-third",
                    stepNumber: 2,
                    title: "Second & Third: Imagining and Reflecting",
                    icon: "🌠",
                    explanation: `
                        <p>Second conditionals imagine better situations using past simple + would/could/might. Third conditionals reflect on past regrets using past perfect + would have/could have/might have.</p>
                        <p>Examples:</p>
                        <ul>
                            <li>“If I spoke more English, I would apply to more jobs.” (second)</li>
                            <li>“If I had had childcare, I would have applied for the day shift sooner.” (third)</li>
                        </ul>
                        <p>Use these forms to describe dreams, community goals, or to explain lessons learned from the past.</p>
                    `,
                    exercises: [
                        {
                            id: "second-1",
                            title: "Rewrite with Would",
                            instructions: "Change the sentence to second conditional.",
                            items: [
                                {
                                    type: "radio",
                                    label: "I don’t have childcare, so I can’t apply for the day shift.",
                                    options: [
                                        { value: "If I had childcare, I would apply for the day shift.", label: "Option A" },
                                        { value: "If I have childcare, I will apply for the day shift.", label: "Option B" },
                                    ],
                                    expectedAnswer: "If I had childcare, I would apply for the day shift.",
                                },
                            ],
                        },
                        {
                            id: "third-1",
                            title: "Third Conditional Reflection",
                            instructions: "Pick the sentence that correctly uses a third conditional.",
                            items: [
                                {
                                    type: "radio",
                                    label: "If I had known about the class, I would have registered earlier.",
                                    options: [
                                        { value: "correct", label: "Correct (past perfect + would have)" },
                                        { value: "incorrect", label: "Incorrect" },
                                    ],
                                    expectedAnswer: "correct",
                                },
                            ],
                        },
                    ],
                },
        {
            id: "modals",
            stepNumber: 3,
            title: "Mixing Modals and Conditionals",
            icon: "🧩",
            explanation: `
                <p>Modals add nuance. Pair first-conditional sentences with <strong>can</strong> (ability), <strong>should</strong> (advice), or <strong>might</strong> (probability). In second conditionals, modals like <strong>would</strong>, <strong>could</strong>, and <strong>might</strong> express imagined outcomes.</p>
                <p>Example: “If I ask the employer nicely, I might get a flexible shift.” “If I knew the training schedule, I could attend every Saturday.”</p>
            `,
            exercises: [
                {
                    id: "modals-1",
                    title: "Complete the Conditional",
                    instructions: "Use the modal in parentheses.",
                    items: [
                        {
                            type: "radio",
                            label: "If I talk to the supervisor, I ___ (should) ask about night classes.",
                            options: [
                                { value: "should", label: "should" },
                                { value: "would", label: "would" },
                            ],
                            expectedAnswer: "should",
                        },
                        {
                            type: "radio",
                            label: "If I had finished the paperwork, I ___ (could) start next week.",
                            options: [
                                { value: "could", label: "could" },
                                { value: "will", label: "will" },
                            ],
                            expectedAnswer: "could",
                        },
                    ],
                },
            ],
        },
        {
            id: "review",
            stepNumber: 4,
            title: "Review Checklist",
            icon: "✅",
            explanation: `
                <p>Before you move on, run through this checklist with your partner:</p>
                <ol>
                    <li>Did we identify whether the condition is routine (zero), real future (first), or imaginary (second)?</li>
                    <li>Did we choose the correct verb form (present simple vs past simple + would)?</li>
                    <li>Did we add a modal to soften or strengthen the meaning?</li>
                </ol>
                <p>Use those connectors in your next conversations about jobs, internships, or community commitments.</p>
            `,
        },
    ],
};
