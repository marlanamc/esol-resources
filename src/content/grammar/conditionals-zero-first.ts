import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsZeroFirstContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Zero & First Conditionals: Facts vs Future",
            icon: "🔀",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">English has TWO types of conditionals for REAL situations: <strong>Zero Conditional</strong> for general truths that are always true, and <strong>First Conditional</strong> for real future possibilities. Knowing which to use helps you sound natural and confident!</p>
                </div>

                <h3>The Big Difference</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e;">
                        <h4 style="color: #d97757; margin-top: 0;">Zero Conditional</h4>
                        <p><strong>Always true</strong> (habits, facts, scientific truths)</p>
                        <p style="font-weight: bold; color: #7ba884;">If + present, present</p>
                        <p style="margin: 0;">"If you heat water to 100°C, it <strong>boils</strong>."</p>
                    </div>
                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                        <h4 style="color: #7ba884; margin-top: 0;">First Conditional</h4>
                        <p><strong>Future possibility</strong> (plans, predictions, warnings)</p>
                        <p style="font-weight: bold; color: #7ba884;">If + present, will + verb</p>
                        <p style="margin: 0;">"If it rains tomorrow, I <strong>will stay</strong> home."</p>
                    </div>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Explaining health facts and home remedies (zero conditional)</li>
                        <li>Making wellness goals and action plans (first conditional)</li>
                        <li>Discussing stress solutions and prevention strategies</li>
                        <li>Sharing what works: "If I drink ginger tea, my stomach feels better"</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Zero = always works. First = will work in the future if you try it!</p>
                </div>
            `,
            exercises: [
                {
                    id: "conditionals-intro-1",
                    title: "Practice: Zero vs First - Can You Tell the Difference?",
                    instructions: "Is each sentence talking about something always true (zero) or a future possibility (first)?",
                    items: [
                        {
                            type: "radio",
                            label: '"If you heat water to 100°C, it boils."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true (scientific fact)" },
                                { value: "first", label: "First conditional - future possibility" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If it rains tomorrow, I will stay home."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true" },
                                { value: "first", label: "First conditional - future possibility (might rain tomorrow)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If I eat breakfast, I feel better at work."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true (my regular habit/pattern)" },
                                { value: "first", label: "First conditional - future possibility" },
                            ],
                            expectedAnswer: "zero",
                        },
                    ],
                },
            ],
        },

        {
            id: "zero-conditional",
            stepNumber: 1,
            title: "Zero Conditional: Always True",
            icon: "⚗️",
            explanation: `
                <h3>When to Use Zero Conditional</h3>
                <p>Use zero conditional for things that are <strong>always true</strong> or <strong>generally true</strong>:</p>
                <ul>
                    <li><strong>Scientific facts:</strong> "If you heat water to 100°C, it boils."</li>
                    <li><strong>General truths:</strong> "If you don't sleep enough, you feel tired."</li>
                    <li><strong>Habits:</strong> "If I drink coffee at night, I can't sleep."</li>
                    <li><strong>Cause & effect (always happens):</strong> "If I skip breakfast, I get hungry by 10am."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #f4d35e;">
                    <h4 style="color: #d97757;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #d97757; text-align: center; margin: 1rem 0;">If + present simple, present simple</p>
                    <p style="text-align: center; font-style: italic;">(Both clauses use present simple!)</p>
                </div>

                <h3>Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Scientific facts:</p>
                    <ul>
                        <li>If you <strong>heat</strong> water to 100°C, it <strong>boils</strong>.</li>
                        <li>If you <strong>freeze</strong> water, it <strong>becomes</strong> ice.</li>
                        <li>If you <strong>mix</strong> red and blue, you <strong>get</strong> purple.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">General truths / habits:</p>
                    <ul>
                        <li>If I <strong>eat</strong> breakfast, I <strong>feel</strong> better at work.</li>
                        <li>If she <strong>drinks</strong> coffee at night, she <strong>can't sleep</strong>.</li>
                        <li>If we <strong>don't exercise</strong>, we <strong>feel</strong> sluggish.</li>
                        <li>If you <strong>skip</strong> meals, you <strong>get</strong> hungry and tired.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Health & wellness truths:</p>
                    <ul>
                        <li>If I <strong>drink</strong> ginger tea, my stomach <strong>feels</strong> better.</li>
                        <li>If you <strong>stretch</strong> before bed, your muscles <strong>relax</strong>.</li>
                        <li>If people <strong>don't sleep</strong> enough, they <strong>get</strong> sick more often.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Zero conditional uses present simple in BOTH clauses. No 'will'! This shows the result ALWAYS happens, not just in the future.",
            },
            exercises: [
                {
                    id: "zero-conditional-1",
                    title: "Practice: Build Zero Conditional Sentences",
                    instructions: "Complete each zero conditional sentence with the correct present simple form.",
                    items: [
                        {
                            type: "text",
                            label: "If you heat water to 100°C, it _____ (boil).",
                            expectedAnswer: "boils",
                        },
                        {
                            type: "text",
                            label: "If I drink coffee at night, I _____ (can't sleep / cannot sleep).",
                            expectedAnswer: "can't sleep|cannot sleep",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct zero conditional:",
                            options: [
                                { value: "a", label: "If you don't sleep enough, you feel tired." },
                                { value: "b", label: "If you don't sleep enough, you will feel tired." },
                                { value: "c", label: "If you won't sleep enough, you feel tired." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "first-conditional",
            stepNumber: 2,
            title: "First Conditional: Future Possibilities",
            icon: "🔮",
            explanation: `
                <h3>When to Use First Conditional</h3>
                <p>Use first conditional for <strong>real future possibilities</strong>:</p>
                <ul>
                    <li><strong>Future plans:</strong> "If I exercise tomorrow, I will feel better."</li>
                    <li><strong>Predictions:</strong> "If it rains tonight, the streets will be wet."</li>
                    <li><strong>Warnings:</strong> "If you don't study, you won't pass the test."</li>
                    <li><strong>Promises:</strong> "If I finish my work, I will call you."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem; border: 2px solid #7ba884;">
                    <h4 style="color: #7ba884;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #7ba884; text-align: center; margin: 1rem 0;">If + present simple, will + base verb</p>
                    <p style="text-align: center; font-style: italic;">(IF clause = present, RESULT clause = will + verb)</p>
                </div>

                <h3>Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Future plans & goals:</p>
                    <ul>
                        <li>If I <strong>exercise</strong> tomorrow, I <strong>will feel</strong> better.</li>
                        <li>If she <strong>applies</strong> for the job, she <strong>will get</strong> an interview.</li>
                        <li>If we <strong>save</strong> money, we <strong>will buy</strong> a car next year.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Predictions & warnings:</p>
                    <ul>
                        <li>If it <strong>rains</strong> tomorrow, I <strong>will stay</strong> home.</li>
                        <li>If you <strong>don't study</strong>, you <strong>won't pass</strong> the test.</li>
                        <li>If he <strong>doesn't leave</strong> now, he <strong>will be</strong> late.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Wellness goals:</p>
                    <ul>
                        <li>If I <strong>walk</strong> 30 minutes daily, I <strong>will lose</strong> weight.</li>
                        <li>If you <strong>reduce</strong> stress, your headaches <strong>will go away</strong>.</li>
                        <li>If we <strong>eat</strong> breakfast, we <strong>will have</strong> more energy.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "First conditional uses will + verb in the result clause (not present simple). This shows it's a FUTURE possibility, not something that always happens.",
            },
            exercises: [
                {
                    id: "first-conditional-1",
                    title: "Practice: Build First Conditional Sentences",
                    instructions: "Complete each first conditional sentence with will + base verb.",
                    items: [
                        {
                            type: "select",
                            label: "If it rains tomorrow, I _____ home.",
                            options: ["stay", "will stay", "stayed", "am staying"],
                            expectedAnswer: "will stay",
                        },
                        {
                            type: "text",
                            label: "If I exercise daily, I _____ (will feel) better.",
                            expectedAnswer: "will feel",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct first conditional:",
                            options: [
                                { value: "a", label: "If you don't study, you won't pass the test." },
                                { value: "b", label: "If you don't study, you don't pass the test." },
                                { value: "c", label: "If you won't study, you won't pass the test." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "comparison",
            stepNumber: 3,
            title: "Zero vs First: When to Use Which?",
            icon: "🔄",
            explanation: `
                <h3>The Key Difference</h3>
                <p>Sometimes the same situation can use EITHER zero or first conditional, depending on what you mean:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #d97757;">Zero Conditional (Always True)</h4>
                        <p style="font-weight: bold;">"If I eat breakfast, I feel better."</p>
                        <p style="margin: 0;">Meaning: This is my habit. Every time I eat breakfast, I feel better. It's always true for me.</p>
                    </div>
                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #7ba884;">First Conditional (Future Plan)</h4>
                        <p style="font-weight: bold;">"If I eat breakfast tomorrow, I will feel better."</p>
                        <p style="margin: 0;">Meaning: This is a future plan/prediction. Tomorrow specifically, if I eat breakfast, the result will be that I feel better.</p>
                    </div>
                </div>

                <h3>More Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">Zero (Always/Habit)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">First (Future Possibility)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I drink coffee at night, I <strong>can't sleep</strong>.<br/><em>(my habit/pattern)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I drink coffee tonight, I <strong>won't sleep</strong>.<br/><em>(specific future prediction)</em></td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you heat water, it <strong>boils</strong>.<br/><em>(scientific fact - always)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you heat the water, it <strong>will boil</strong>.<br/><em>(specific situation - that pot of water)</em></td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I exercise, I <strong>feel</strong> energized.<br/><em>(general pattern for me)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I exercise tomorrow, I <strong>will feel</strong> energized.<br/><em>(specific future plan)</em></td>
                        </tr>
                    </tbody>
                </table>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #3b82f6;">Quick Decision Tool</h4>
                    <p><strong>Ask yourself:</strong> Am I talking about something that ALWAYS happens, or something SPECIFIC in the future?</p>
                    <ul>
                        <li><strong>Always happens →</strong> Zero conditional (present, present)</li>
                        <li><strong>Specific future →</strong> First conditional (present, will + verb)</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "comparison-1",
                    title: "Practice: Choose Zero or First",
                    instructions: "Decide whether each situation needs zero or first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to state a scientific fact about water boiling:",
                            options: [
                                { value: "zero", label: "Zero: 'If you heat water to 100°C, it boils.'" },
                                { value: "first", label: "First: 'If you heat water to 100°C, it will boil.'" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "You're making a plan for tomorrow:",
                            options: [
                                { value: "zero", label: "Zero: 'If I exercise tomorrow, I feel better.'" },
                                { value: "first", label: "First: 'If I exercise tomorrow, I will feel better.'" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "You're describing your regular habit:",
                            options: [
                                { value: "zero", label: "Zero: 'If I drink coffee at night, I can't sleep.'" },
                                { value: "first", label: "First: 'If I drink coffee at night, I won't sleep.'" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "You're warning someone about a specific situation:",
                            options: [
                                { value: "zero", label: "Zero: 'If you don't leave now, you're late.'" },
                                { value: "first", label: "First: 'If you don't leave now, you will be late.'" },
                            ],
                            expectedAnswer: "first",
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "conditionals-zf-ex-1",
                    title: "Exercise 1: Complete Zero Conditional",
                    instructions: "Use present simple in both clauses.",
                    items: [
                        {
                            type: "text",
                            label: "If you _____ (heat) ice, it _____ (melt).",
                            expectedAnswer: "heat, melts|heat,melts",
                        },
                        {
                            type: "select",
                            label: "If I eat breakfast, I _____ better at work.",
                            options: ["will feel", "feel", "felt", "am feeling"],
                            expectedAnswer: "feel",
                        },
                    ],
                },
                {
                    id: "conditionals-zf-ex-2",
                    title: "Exercise 2: Complete First Conditional",
                    instructions: "Use will + base verb in the result clause.",
                    items: [
                        {
                            type: "select",
                            label: "If it rains tomorrow, I _____ home.",
                            options: ["stay", "will stay", "stayed", "staying"],
                            expectedAnswer: "will stay",
                        },
                        {
                            type: "text",
                            label: "If I exercise daily, I _____ (will lose) weight.",
                            expectedAnswer: "will lose",
                        },
                    ],
                },
                {
                    id: "conditionals-zf-ex-3",
                    title: "Exercise 3: Choose the Right Conditional",
                    instructions: "Decide if each sentence should use zero or first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "Scientific fact: 'If you freeze water, it _____ ice.'",
                            options: [
                                { value: "becomes", label: "becomes (zero - always true)" },
                                { value: "will-become", label: "will become (first - future)" },
                            ],
                            expectedAnswer: "becomes",
                        },
                        {
                            type: "radio",
                            label: "Future plan: 'If I study tonight, I _____ the test.'",
                            options: [
                                { value: "pass", label: "pass (zero - always)" },
                                { value: "will-pass", label: "will pass (first - future)" },
                            ],
                            expectedAnswer: "will-pass",
                        },
                        {
                            type: "radio",
                            label: "Your habit: 'If I drink coffee at night, I _____.'",
                            options: [
                                { value: "cant-sleep", label: "can't sleep (zero - my habit)" },
                                { value: "wont-sleep", label: "won't sleep (first - future)" },
                            ],
                            expectedAnswer: "cant-sleep",
                        },
                    ],
                },
                {
                    id: "conditionals-zf-ex-4",
                    title: "Exercise 4: Mixed Practice",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct for a wellness goal?",
                            options: [
                                { value: "a", label: "If I walk 30 minutes daily, I will lose weight." },
                                { value: "b", label: "If I walk 30 minutes daily, I lose weight." },
                                { value: "c", label: "Both are correct (different meanings)" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "Which expresses a general truth?",
                            options: [
                                { value: "a", label: "If you don't sleep enough, you feel tired." },
                                { value: "b", label: "If you don't sleep enough, you will feel tired." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference Guide",
            icon: "📋",
            explanation: `
                <h3>Side-by-Side Comparison</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1);"></th>
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1);">Zero Conditional</th>
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1);">First Conditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Formula</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + present, <strong>present</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + present, <strong>will + verb</strong></td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">When</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true, habits, facts</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real future possibilities</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Example</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I eat breakfast, I <strong>feel</strong> better.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I eat breakfast tomorrow, I <strong>will feel</strong> better.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Time</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Any time / all the time</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Specific future time</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Uses</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div>
                        <h4 style="color: #d97757;">Zero Conditional For:</h4>
                        <ul>
                            <li>Scientific facts</li>
                            <li>General truths</li>
                            <li>Habits and routines</li>
                            <li>Natural consequences</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: #7ba884;">First Conditional For:</h4>
                        <ul>
                            <li>Future plans</li>
                            <li>Predictions</li>
                            <li>Warnings</li>
                            <li>Promises</li>
                        </ul>
                    </div>
                </div>
            `,
            tipBox: {
                title: "⚠️ Remember",
                content: "Both use present simple in the IF clause! The difference is in the result clause: present simple (zero) vs will + verb (first).",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What is the formula for zero conditional?",
            options: [
                { value: "a", label: "If + present, present" },
                { value: "b", label: "If + present, will + verb" },
                { value: "c", label: "If + past, would + verb" },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional uses present simple in both clauses for things that are always true.",
        },
        {
            id: "quiz-2",
            question: "Which sentence uses first conditional correctly?",
            options: [
                { value: "a", label: "If it rains tomorrow, I will stay home." },
                { value: "b", label: "If it rains tomorrow, I stay home." },
                { value: "c", label: "If it will rain tomorrow, I will stay home." },
            ],
            correctAnswer: "a",
            explanation: "First conditional: If + present simple, will + base verb. Never use 'will' in the IF clause!",
        },
        {
            id: "quiz-3",
            question: "Which is a zero conditional sentence?",
            options: [
                { value: "a", label: "If you heat water to 100°C, it boils." },
                { value: "b", label: "If you heat water tomorrow, it will boil." },
                { value: "c", label: "If you heated water, it would boil." },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional (present, present) is used for scientific facts and things that are always true.",
        },
        {
            id: "quiz-4",
            question: "Complete: 'If I exercise tomorrow, I _____ better.'",
            options: [
                { value: "a", label: "feel" },
                { value: "b", label: "will feel" },
                { value: "c", label: "felt" },
            ],
            correctAnswer: "b",
            explanation: "This is a future plan, so use first conditional: will + base verb.",
        },
        {
            id: "quiz-5",
            question: "Complete: 'If I drink coffee at night, I _____ sleep.' (Your habit)",
            options: [
                { value: "a", label: "can't" },
                { value: "b", label: "won't" },
                { value: "c", label: "wouldn't" },
            ],
            correctAnswer: "a",
            explanation: "For a habit that's always true, use zero conditional (present simple in both clauses).",
        },
        {
            id: "quiz-6",
            question: "When do you use first conditional?",
            options: [
                { value: "a", label: "For things that are always true" },
                { value: "b", label: "For real future possibilities" },
                { value: "c", label: "For impossible situations" },
            ],
            correctAnswer: "b",
            explanation: "First conditional is for real future possibilities - things that might happen in the future.",
        },
    ],
};
