import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Conditionals Review: All Types Compared",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">You've learned three types of conditionals! Now let's review and compare them all so you can choose the right one in any situation. Each conditional has a different purpose and meaning.</p>
                </div>

                <h3>The Three Conditionals We've Learned</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e;">
                        <h4 style="color: #d97757; margin-top: 0;">Zero</h4>
                        <p><strong>Always true</strong></p>
                        <p style="font-weight: bold; font-size: 0.9rem;">present + present</p>
                        <p style="margin: 0; font-size: 0.9rem;">"If you heat water, it boils."</p>
                    </div>
                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                        <h4 style="color: #7ba884; margin-top: 0;">First</h4>
                        <p><strong>Real future</strong></p>
                        <p style="font-weight: bold; font-size: 0.9rem;">present + will</p>
                        <p style="margin: 0; font-size: 0.9rem;">"If the bus is late, I will text my supervisor."</p>
                    </div>
                    <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                        <h4 style="color: #a855f7; margin-top: 0;">Second</h4>
                        <p><strong>Unreal/unlikely</strong></p>
                        <p style="font-weight: bold; font-size: 0.9rem;">past + would</p>
                        <p style="margin: 0; font-size: 0.9rem;">"If I got a huge raise, I would pay off my bills."</p>
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
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🎯 Master all three conditionals and you'll sound like a native speaker!</p>
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
                <h3>All Three Conditionals at a Glance</h3>
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
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If the bus is late, I <strong>will text</strong> my supervisor.<br/><br/>If I study tonight, I <strong>will pass</strong>.</td>
                        </tr>
                        <tr style="background: rgba(168, 85, 247, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: #a855f7;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + <strong>past</strong>,<br/><strong>would</strong> + verb</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unreal/unlikely<br/>Imaginary<br/>Impossible<br/>Advice (If I were you)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I got a huge raise, I <strong>would pay off</strong> my bills.<br/><br/>If I <strong>were</strong> you, I would apply.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Key Patterns to Remember</h3>
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold;">Notice the pattern:</p>
                    <ul>
                        <li><strong>Zero & First:</strong> Both use <strong>present simple</strong> in IF clause</li>
                        <li><strong>The difference:</strong> Result clause is <strong>present</strong> (zero) or <strong>will</strong> (first)</li>
                        <li><strong>Second is different:</strong> Uses <strong>past</strong> in IF clause + <strong>would</strong> in result</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "comparison-1",
                    title: "Practice: Match the Formula",
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

                <h4 style="margin-top: 2rem;">Example 2: Job Applications</h4>
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
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I apply for jobs, I <strong>get</strong> interviews.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">General truth - this always happens when I apply</td>
                        </tr>
                        <tr style="background: rgba(122, 143, 124, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">First</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I apply for this job, I <strong>will get</strong> an interview.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real plan - I'm going to apply for this specific job</td>
                        </tr>
                        <tr style="background: rgba(168, 85, 247, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I spoke better English, I <strong>would apply</strong>.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unreal - my English isn't good enough (I think), so I won't apply</td>
                        </tr>
                    </tbody>
                </table>

                <h4 style="margin-top: 2rem;">Example 3: Saving Money</h4>
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
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I cook at home, I <strong>save</strong> money.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true - cooking at home always saves me money</td>
                        </tr>
                        <tr style="background: rgba(122, 143, 124, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">First</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I cook at home this week, I <strong>will save</strong> $50.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Specific future plan - planning to cook this week</td>
                        </tr>
                        <tr style="background: rgba(168, 85, 247, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I had time to cook, I <strong>would save</strong> money.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unreal - I don't have time, so I can't cook</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "same-situation-1",
                    title: "Practice: Choose the Right Meaning",
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
                        {
                            type: "radio",
                            label: "You're dreaming about something unlikely:",
                            options: [
                                { value: "zero", label: "Zero: 'If I get a huge raise, I pay off my bills.'" },
                                { value: "first", label: "First: 'If I get a huge raise, I will pay off my bills.'" },
                                { value: "second", label: "Second: 'If I got a huge raise, I would pay off my bills.'" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
            ],
        },

        {
            id: "decision-flowchart",
            stepNumber: 3,
            title: "Decision Tool: Which Conditional?",
            icon: "🎯",
            explanation: `
                <h3>How to Choose the Right Conditional</h3>
                <p>Ask yourself these questions in order:</p>

                <div style="background: white; padding: 2rem; border-radius: 0.5rem; border: 2px solid rgba(200, 107, 81, 0.3); margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #f4d35e;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">STEP 1: Is it ALWAYS true? (Scientific fact, habit, general truth)</p>
                        <p style="margin: 0;">✓ YES → Use <strong>ZERO conditional</strong> (present + present)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If you heat water, it boils."</p>
                    </div>

                    <p style="text-align: center; font-weight: bold; margin: 1rem 0;">↓ NO? Keep going...</p>

                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #7ba884;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">STEP 2: Is it a REALISTIC future possibility?</p>
                        <p style="margin: 0;">✓ YES → Use <strong>FIRST conditional</strong> (present + will)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If the bus is late tomorrow, I will text my supervisor."</p>
                    </div>

                    <p style="text-align: center; font-weight: bold; margin: 1rem 0;">↓ NO? It must be...</p>

                    <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">STEP 3: It's UNLIKELY, IMAGINARY, or IMPOSSIBLE</p>
                        <p style="margin: 0;">✓ Use <strong>SECOND conditional</strong> (past + would)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If I got a huge raise, I would pay off my bills."</p>
                    </div>
                </div>

                <h3>Quick Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Situation</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Question to Ask</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Answer → Conditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Water boiling at 100°C</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → Zero</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Planning to meet your supervisor tomorrow</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Realistic future?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → First</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Daydreaming about a huge raise</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unlikely/imaginary?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → Second</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "decision-1",
                    title: "Practice: Use the Decision Tool",
                    instructions: "Use the flowchart to choose the right conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "Scientific fact about ice melting:",
                            options: [
                                { value: "zero", label: "Zero (always true)" },
                                { value: "first", label: "First (realistic future)" },
                                { value: "second", label: "Second (unlikely)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "Your real plan to apply for a job next week:",
                            options: [
                                { value: "zero", label: "Zero (always true)" },
                                { value: "first", label: "First (realistic future)" },
                                { value: "second", label: "Second (unlikely)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "Dreaming about being the CEO:",
                            options: [
                                { value: "zero", label: "Zero (always true)" },
                                { value: "first", label: "First (realistic future)" },
                                { value: "second", label: "Second (unlikely/imaginary)" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Mixed Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "review-ex-1",
                    title: "Exercise 1: Identify the Type",
                    instructions: "What type of conditional is each sentence?",
                    items: [
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>cook</span> at home, I <span class=\'eg-verb\'>save</span> money."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>cook</span> at home tonight, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>save</span> $20."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>had</span> more time, I <span class=\'eg-helper\'>would</span> <span class=\'eg-verb\'>cook</span> at home."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
                {
                    id: "review-ex-2",
                    title: "Exercise 2: Complete with the Right Form",
                    instructions: "Choose the correct verb form based on the conditional type.",
                    items: [
                        {
                            type: "select",
                            label: "Zero: 'If you heat ice, it _____.'",
                            options: ["melt", "melts", "will melt", "would melt"],
                            expectedAnswer: "melts",
                        },
                        {
                            type: "select",
                            label: "First: 'If the bus is late tomorrow, I _____ my supervisor.'",
                            options: ["text", "will text", "would text", "texted"],
                            expectedAnswer: "will text",
                        },
                        {
                            type: "select",
                            label: "Second: 'If I _____ the boss, I would change the schedule.'",
                            options: ["am", "will be", "were", "would be"],
                            expectedAnswer: "were",
                        },
                    ],
                },
                {
                    id: "review-ex-3",
                    title: "Exercise 3: Choose the Right Conditional",
                    instructions: "Based on the meaning, choose which conditional to use.",
                    items: [
                        {
                            type: "radio",
                            label: "To express a habit that's always true for you:",
                            options: [
                                { value: "zero", label: "If I exercise, I feel better. (zero)" },
                                { value: "first", label: "If I exercise, I will feel better. (first)" },
                                { value: "second", label: "If I exercised, I would feel better. (second)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "To make a realistic plan for next week:",
                            options: [
                                { value: "zero", label: "If I study next week, I pass. (zero)" },
                                { value: "first", label: "If I study next week, I will pass. (first)" },
                                { value: "second", label: "If I studied next week, I would pass. (second)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "To give advice using 'If I were you':",
                            options: [
                                { value: "zero", label: "If I am you, I talk to the manager. (zero)" },
                                { value: "first", label: "If I am you, I will talk to the manager. (first)" },
                                { value: "second", label: "If I were you, I would talk to the manager. (second)" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
                {
                    id: "review-ex-4",
                    title: "Exercise 4: Fix the Mistakes",
                    instructions: "Choose the correct version of each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix this zero conditional:",
                            options: [
                                { value: "a", label: "If you heat water, it will boil." },
                                { value: "b", label: "If you heat water, it boils." },
                                { value: "c", label: "If you will heat water, it boils." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Fix this first conditional:",
                            options: [
                                { value: "a", label: "If I will study, I will pass." },
                                { value: "b", label: "If I study, I pass." },
                                { value: "c", label: "If I study, I will pass." },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "Fix this second conditional with 'to be':",
                            options: [
                                { value: "a", label: "If I was the boss, I would change things." },
                                { value: "b", label: "If I were the boss, I would change things." },
                                { value: "c", label: "If I am the boss, I would change things." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Complete Reference Guide",
            icon: "📋",
            explanation: `
                <h3>All Three Conditionals - Final Summary</h3>

                <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #f4d35e;">
                    <h4 style="color: #d97757; margin-top: 0;">Zero Conditional</h4>
                    <p><strong>Formula:</strong> If + present, present</p>
                    <p><strong>Use for:</strong> Always true, habits, scientific facts</p>
                    <p><strong>Example:</strong> If you heat water to 100°C, it boils.</p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #7ba884;">
                    <h4 style="color: #7ba884; margin-top: 0;">First Conditional</h4>
                    <p><strong>Formula:</strong> If + present, will + base verb</p>
                    <p><strong>Use for:</strong> Real future possibilities, plans, predictions</p>
                    <p><strong>Example:</strong> If I study tonight, I will pass the test.</p>
                </div>

                <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #a855f7;">
                    <h4 style="color: #a855f7; margin-top: 0;">Second Conditional</h4>
                    <p><strong>Formula:</strong> If + past, would + base verb</p>
                    <p><strong>Use for:</strong> Unlikely/imaginary situations, advice</p>
                    <p><strong>Example:</strong> If I got a huge raise, I would pay off my bills.</p>
                    <p><strong>Special:</strong> Use "were" for all subjects with "to be"</p>
                </div>

                <h3>Common Mistakes to Avoid</h3>
                <ul>
                    <li>❌ "If I <strong>will</strong> study..." → ✅ "If I <strong>study</strong>..." (never 'will' in IF clause!)</li>
                    <li>❌ "If you heat water, it <strong>will boil</strong>." → ✅ "If you heat water, it <strong>boils</strong>." (use zero for facts)</li>
                    <li>❌ "If I <strong>was</strong> you..." → ✅ "If I <strong>were</strong> you..." (use 'were' in second conditional)</li>
                </ul>

                <h3>Quick Decision Guide</h3>
                <p><strong>Always true?</strong> → Zero (present + present)</p>
                <p><strong>Realistic future?</strong> → First (present + will)</p>
                <p><strong>Unlikely/imaginary?</strong> → Second (past + would)</p>
            `,
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which conditional uses 'If + present, present'?",
            options: [
                { value: "a", label: "Zero conditional" },
                { value: "b", label: "First conditional" },
                { value: "c", label: "Second conditional" },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional uses present simple in both clauses for things that are always true.",
        },
        {
            id: "quiz-2",
            question: "Which is correct first conditional?",
            options: [
                { value: "a", label: "If I will leave early, I will catch the bus." },
                { value: "b", label: "If I leave early, I will catch the bus." },
                { value: "c", label: "If I left early, I will catch the bus." },
            ],
            correctAnswer: "b",
            explanation: "First conditional: If + present simple, will + base verb. Don’t use will in the IF clause.",
        },
        {
            id: "quiz-3",
            question: "For advice, which is correct?",
            options: [
                { value: "a", label: "If I am you, I will talk to the manager." },
                { value: "b", label: "If I was you, I would talk to the manager." },
                { value: "c", label: "If I were you, I would talk to the manager." },
            ],
            correctAnswer: "c",
            explanation: "Use second conditional for advice: If I were you, I would…",
        },
        {
            id: "quiz-4",
            question: "Which sentence describes a habit (always true)?",
            options: [
                { value: "a", label: "If I skip lunch, I get a headache by the afternoon." },
                { value: "b", label: "If I skip lunch tomorrow, I will get a headache." },
                { value: "c", label: "If I skipped lunch, I would get a headache." },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional describes habits/patterns: present + present.",
        },
        {
            id: "quiz-5",
            question: "Which sentence is about an unlikely/imaginary situation?",
            options: [
                { value: "a", label: "If I save $10 this week, I will buy groceries." },
                { value: "b", label: "If I saved $10 this week, I would buy groceries." },
                { value: "c", label: "If I save $10 this week, I buy groceries." },
            ],
            correctAnswer: "b",
            explanation: "Second conditional uses past + would to show a hypothetical/imaginary situation.",
        },
        {
            id: "quiz-6",
            question: "What's wrong with: 'If you heat water, it will boil'?",
            options: [
                { value: "a", label: "Nothing - it's correct" },
                { value: "b", label: "For a scientific fact, use zero conditional: it boils" },
                { value: "c", label: "It should be: If you heated water, it would boil" },
            ],
            correctAnswer: "b",
            explanation: "For scientific facts that are always true, use zero conditional: If you heat water, it boils.",
        },
        {
            id: "quiz-7",
            question: "Which sentence is correct second conditional with 'to be'?",
            options: [
                { value: "a", label: "If he was the supervisor, he would change the schedule." },
                { value: "b", label: "If he were the supervisor, he would change the schedule." },
                { value: "c", label: "If he is the supervisor, he would change the schedule." },
            ],
            correctAnswer: "b",
            explanation: "Traditional second conditional uses were for all subjects: If he were…",
        },
        {
            id: "quiz-8",
            question: "Which sentence is a realistic future plan (first conditional)?",
            options: [
                { value: "a", label: "If the bus is late tomorrow, I will text my supervisor." },
                { value: "b", label: "If the bus was late tomorrow, I would text my supervisor." },
                { value: "c", label: "If the bus is late tomorrow, I text my supervisor." },
            ],
            correctAnswer: "a",
            explanation: "First conditional talks about a real future possibility: present + will.",
        },
        {
            id: "quiz-9",
            question: "Which sentence is incorrect because it uses 'will' in the IF clause?",
            options: [
                { value: "a", label: "If I will call the office, I will ask about my case." },
                { value: "b", label: "If I call the office, I will ask about my case." },
                { value: "c", label: "If I call the office, I ask about my case. (habit)" },
            ],
            correctAnswer: "a",
            explanation: "Don’t use will in the IF clause in first conditional. Use present simple: If I call…",
        },
        {
            id: "quiz-10",
            question: "Choose the correct first conditional negative.",
            options: [
                { value: "a", label: "If I don't set an alarm, I will be late." },
                { value: "b", label: "If I won't set an alarm, I will be late." },
                { value: "c", label: "If I didn't set an alarm, I would be late." },
            ],
            correctAnswer: "a",
            explanation: "First conditional uses present simple in IF clause (don’t set) and will in the result.",
        },
        {
            id: "quiz-11",
            question: "Which sentence is a general truth (zero conditional)?",
            options: [
                { value: "a", label: "If you don't sleep enough, you feel tired." },
                { value: "b", label: "If you don't sleep enough tonight, you will feel tired." },
                { value: "c", label: "If you didn't sleep enough, you would feel tired." },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional describes general truths and patterns: present + present.",
        },
        {
            id: "quiz-12",
            question: "Which sentence is second conditional (imaginary)?",
            options: [
                { value: "a", label: "If I have more hours, I will pay off my bills faster." },
                { value: "b", label: "If I had more hours, I would pay off my bills faster." },
                { value: "c", label: "If I had more hours, I will pay off my bills faster." },
            ],
            correctAnswer: "b",
            explanation: "Second conditional: If + past, would + base verb.",
        },
        {
            id: "quiz-13",
            question: "Which sentence best matches this meaning: 'I’m not cooking at home, but I think it would help.'",
            options: [
                { value: "a", label: "If I cook at home, I save money." },
                { value: "b", label: "If I cook at home this week, I will save money." },
                { value: "c", label: "If I cooked at home more, I would save money." },
            ],
            correctAnswer: "c",
            explanation: "Second conditional expresses an unreal/hypothetical situation: cooked… would save…",
        },
        {
            id: "quiz-14",
            question: "Which pair correctly shows first vs second conditional?",
            options: [
                { value: "a", label: "First: If I save money, I will buy a used laptop. | Second: If I saved money, I would buy a used laptop." },
                { value: "b", label: "First: If I save money, I would buy a used laptop. | Second: If I saved money, I will buy a used laptop." },
                { value: "c", label: "First: If I will save money, I will buy a used laptop. | Second: If I would save money, I would buy a used laptop." },
            ],
            correctAnswer: "a",
            explanation: "First is realistic (present + will). Second is hypothetical (past + would).",
        },
        {
            id: "quiz-15",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "If I was you, I would talk to the manager." },
                { value: "b", label: "If I were you, I would talk to the manager." },
                { value: "c", label: "If I were you, I will talk to the manager." },
            ],
            correctAnswer: "b",
            explanation: "Advice uses second conditional: If I were you, I would…",
        },
    ],
};
