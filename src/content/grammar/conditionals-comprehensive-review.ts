import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsComprehensiveReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Conditionals Comprehensive Review: All Types Compared",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">You've learned all the conditional types! Now let's review and compare them all so you can choose the right one in any situation. Each conditional has a different purpose and meaning along the timeline from routine facts to imagined possibilities.</p>
                </div>

                <h3>The Conditional Continuum</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin: 1.5rem 0;">
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(251, 191, 36, 0.08); border-left: 4px solid #f59e0b;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">Zero Conditional</p>
                        <p style="margin: 0;">Facts or routines, e.g., "If I heat water, it boils."</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">First / Future</p>
                        <p style="margin: 0;">Real plans, promises, deadlines.</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(239, 68, 68, 0.08); border-left: 4px solid #dc2626;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">Second / Third</p>
                        <p style="margin: 0;">Imagined situations or reflections.</p>
                    </div>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Year-in-review: Reflecting on what worked (zero conditional for habits)</li>
                        <li>Setting future goals (first conditional for plans)</li>
                        <li>Imagining what could have been different (second conditional for wishes)</li>
                        <li>Giving each other advice for next year</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🎯 Master all conditionals and you'll sound like a native speaker!</p>
                </div>
            `,
            exercises: [
                {
                    id: "intro-review-1",
                    title: "Quick Check: Can You Identify the Type?",
                    instructions: "Identify which type of conditional each sentence uses.",
                    items: [
                        {
                            type: "radio",
                            label: '"If you <span class=\'eg-verb\'>heat</span> water to 100°C, it <span class=\'eg-verb\'>boils</span>."',
                            options: [
                                { value: "zero", label: "Zero - always true" },
                                { value: "first", label: "First - real future" },
                                { value: "second", label: "Second - unreal/unlikely" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If the bus <span class=\'eg-verb\'>is</span> late tomorrow, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>text</span> my supervisor."',
                            options: [
                                { value: "zero", label: "Zero - always true" },
                                { value: "first", label: "First - real future" },
                                { value: "second", label: "Second - unreal/unlikely" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>got</span> a huge raise, I <span class=\'eg-helper\'>would</span> <span class=\'eg-verb\'>pay off</span> my bills."',
                            options: [
                                { value: "zero", label: "Zero - always true" },
                                { value: "first", label: "First - real future" },
                                { value: "second", label: "Second - unreal/unlikely" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
            ],
        },

        {
            id: "comparison-chart",
            stepNumber: 1,
            title: "Complete Comparison Chart",
            icon: "📊",
            explanation: `
                <h3>All Conditionals at a Glance</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.15);">
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Type</th>
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Formula</th>
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">When to Use</th>
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: rgba(244, 211, 94, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: #d97757;">Zero</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + <strong>present</strong>,<br/><strong>present</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true<br/>Scientific facts<br/>Habits<br/>General truths</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you heat water, it <strong>boils</strong>.<br/><br/>If I eat breakfast, I <strong>feel</strong> better.</td>
                        </tr>
                        <tr style="background: rgba(122, 143, 124, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: #7ba884;">First</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + <strong>present</strong>,<br/><strong>will</strong> + verb</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real future possibilities<br/>Plans<br/>Predictions<br/>Warnings</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If bus is late, I <strong>will text</strong> my supervisor.<br/><br/>If I study tonight, I <strong>will pass</strong>.</td>
                        </tr>
                        <tr style="background: rgba(168, 85, 247, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: #a855f7;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + <strong>past</strong>,<br/><strong>would</strong> + verb</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unreal/unlikely<br/>Imaginary<br/>Impossible<br/>Advice (If I were you)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I got a huge raise, I <strong>would pay off</strong> my bills.<br/><br/>If I <strong>were</strong> you, I would apply.</td>
                        </tr>
                        <tr style="background: rgba(14, 165, 233, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: #0ea5e9;">Third</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + <strong>past perfect</strong>,<br/><strong>would have</strong> + verb</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Past regrets<br/>Lessons learned<br/>What didn't happen<br/>Reflections on past</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>had known</strong>, I <strong>would have come</strong> earlier.<br/><br/>If I <strong>had studied</strong>, I <strong>would have passed</strong>.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Key Patterns to Remember</h3>
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold;">Notice the pattern:</p>
                    <ul>
                        <li><strong>Zero & First:</strong> Both use <strong>present simple</strong> in IF clause</li>
                        <li><strong>The difference:</strong> Result clause is <strong>present</strong> (zero) or <strong>will</strong> (first)</li>
                        <li><strong>Second & Third:</strong> Use <strong>past</strong> forms in IF clause + <strong>would</strong> in result</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "comparison-1",
                    title: "Practice: Match Formula",
                    instructions: "Match each conditional type to its formula.",
                    items: [
                        {
                            type: "radio",
                            label: "Which formula is for first conditional?",
                            options: [
                                { value: "a", label: "If + present, present" },
                                { value: "b", label: "If + present, will + verb" },
                                { value: "c", label: "If + past, would + verb" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which formula is for zero conditional?",
                            options: [
                                { value: "a", label: "If + present, present" },
                                { value: "b", label: "If + present, will + verb" },
                                { value: "c", label: "If + past, would + verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which formula is for second conditional?",
                            options: [
                                { value: "a", label: "If + present, present" },
                                { value: "b", label: "If + present, will + verb" },
                                { value: "c", label: "If + past, would + verb" },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
            ],
        },

        {
            id: "same-situation-different-meaning",
            stepNumber: 2,
            title: "Same Situation, Different Meanings",
            icon: "🔀",
            explanation: `
                <h3>How the Same Topic Changes Meaning</h3>
                <p>You can often use different conditionals for similar situations, but the meaning changes based on which one you choose:</p>

                <h4 style="margin-top: 2rem;">Example 1: Exercise & Weight Loss</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); width: 30%;">Type</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Sentence</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Meaning</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: rgba(244, 211, 94, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Zero</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I exercise, I <strong>feel</strong> better.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">My habit - this is always true for me</td>
                        </tr>
                        <tr style="background: rgba(122, 143, 124, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">First</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I exercise tomorrow, I <strong>will feel</strong> better.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real plan - I'm planning to exercise tomorrow</td>
                        </tr>
                        <tr style="background: rgba(168, 85, 247, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I exercised more, I <strong>would feel</strong> better.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Imaginary - I'm not exercising, just wishing</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "same-situation-1",
                    title: "Practice: Choose Right Meaning",
                    instructions: "Based on what you want to express, choose the right conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to express a habit that's always true:",
                            options: [
                                { value: "zero", label: "Zero: 'If I eat breakfast, I feel better.'" },
                                { value: "first", label: "First: 'If I eat breakfast, I will feel better.'" },
                                { value: "second", label: "Second: 'If I ate breakfast, I would feel better.'" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "You're making a real plan for tomorrow:",
                            options: [
                                { value: "zero", label: "Zero: 'If I exercise tomorrow, I feel better.'" },
                                { value: "first", label: "First: 'If I exercise tomorrow, I will feel better.'" },
                                { value: "second", label: "Second: 'If I exercised tomorrow, I would feel better.'" },
                            ],
                            expectedAnswer: "first",
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
                <div style="background: rgba(59, 130, 246, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #2563eb;">
                    <p style="margin: 0; font-weight: 600;">First & Future</p>
                    <p style="margin: 0;">Pair with can/should/might to show ability, advice, or probability.</p>
                </div>
                <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #dc2626; margin-top: 0.75rem;">
                    <p style="margin: 0; font-weight: 600;">Second & Third</p>
                    <p style="margin: 0;">Use would/could/might have for imagined outcomes or reflections.</p>
                </div>
                <p style="margin-top: 0.75rem;">Practice adding modals to soften or strengthen your statements about work or community goals.</p>
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
            id: "review-checklist",
            stepNumber: 4,
            title: "Review Checklist",
            icon: "✅",
            explanation: `
                <div style="background: rgba(16, 185, 129, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #059669;">
                    <p style="margin: 0;"><strong>Checklist</strong></p>
                    <ol style="margin: 0.5rem 0 0 1.2rem; padding: 0;">
                        <li>Did we identify routine, promise, or imagined outcome?</li>
                        <li>Is the verb form correct (present simple, past simple, past perfect)?</li>
                        <li>Did we add a modal to change tone?</li>
                    </ol>
                </div>
                <p style="margin-top: 0.75rem;">Use this checklist before your next job planning conversation, health update, or community reflection.</p>
            `,
        },
        {
            id: "mini-quiz",
            title: "📝 Mini Quiz: Conditionals Mastery",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #7ba884;">Test Your Conditionals Knowledge!</h3>
                    <p style="margin-bottom: 0;">This quick quiz covers all conditional types. Choose the right conditional for each situation.</p>
                </div>
            `,
            exercises: [
                {
                    id: "conditionals-quiz-1",
                    title: "Quiz Question 1",
                    instructions: "Choose the right conditional type.",
                    items: [
                        {
                            type: "radio",
                            label: "If you heat water, it boils.",
                            options: [
                                { value: "zero", label: "Zero conditional" },
                                { value: "first", label: "First conditional" },
                                { value: "second", label: "Second conditional" },
                            ],
                            expectedAnswer: "zero",
                        },
                    ],
                },
                {
                    id: "conditionals-quiz-2",
                    title: "Quiz Question 2",
                    instructions: "Choose the right conditional type.",
                    items: [
                        {
                            type: "radio",
                            label: "If the bus is late, I will text my supervisor.",
                            options: [
                                { value: "zero", label: "Zero conditional" },
                                { value: "first", label: "First conditional" },
                                { value: "second", label: "Second conditional" },
                            ],
                            expectedAnswer: "first",
                        },
                    ],
                },
                {
                    id: "conditionals-quiz-3",
                    title: "Quiz Question 3",
                    instructions: "Choose the right conditional type.",
                    items: [
                        {
                            type: "radio",
                            label: "If I got a raise, I would buy a new car.",
                            options: [
                                { value: "zero", label: "Zero conditional" },
                                { value: "first", label: "First conditional" },
                                { value: "second", label: "Second conditional" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
                {
                    id: "conditionals-quiz-4",
                    title: "Quiz Question 4",
                    instructions: "Complete the sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "If it ___ tomorrow, I will stay home.",
                            options: [
                                { value: "rains", label: "rains" },
                                { value: "will rain", label: "will rain" },
                                { value: "is raining", label: "is raining" },
                            ],
                            expectedAnswer: "rains",
                        },
                    ],
                },
                {
                    id: "conditionals-quiz-5",
                    title: "Quiz Question 5",
                    instructions: "Complete the sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "If I ___ you, I would apply for that job.",
                            options: [
                                { value: "am", label: "am" },
                                { value: "was", label: "was" },
                                { value: "were", label: "were" },
                            ],
                            expectedAnswer: "were",
                        },
                    ],
                },
            ],
        },
    ],
};
