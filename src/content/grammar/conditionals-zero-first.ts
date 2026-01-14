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
                            label: '"If you <span class=\'eg-verb\'>heat</span> water to 100°C, it <span class=\'eg-verb\'>boils</span>."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true (scientific fact)" },
                                { value: "first", label: "First conditional - future possibility" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If the bus <span class=\'eg-helper\'>is</span> late tomorrow, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>text</span> my supervisor."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true" },
                                { value: "first", label: "First conditional - future possibility (specific future situation)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>skip</span> lunch, I <span class=\'eg-verb\'>get</span> a headache by the afternoon."',
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
                            label: "If you leave wet clothes in a bag, they _____ (smell).",
                            expectedAnswer: "smell",
                        },
                        {
                            type: "text",
                            label: "If I skip breakfast, I _____ (get) hungry by 10 AM.",
                            expectedAnswer: "get",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct zero conditional:",
                            options: [
                                { value: "a", label: "If you don't drink enough water, you feel thirsty." },
                                { value: "b", label: "If you don't drink enough water, you will feel thirsty." },
                                { value: "c", label: "If you won't drink enough water, you feel thirsty." },
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
                            label: "If the train is delayed tomorrow, I _____ my supervisor.",
                            options: ["text", "will text", "texted", "am texting"],
                            expectedAnswer: "will text",
                        },
                        {
                            type: "text",
                            label: "If I finish my paperwork tonight, I _____ (will submit) it before class.",
                            expectedAnswer: "will submit",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct first conditional:",
                            options: [
                                { value: "a", label: "If you miss the appointment, you will need to reschedule." },
                                { value: "b", label: "If you miss the appointment, you need to reschedule." },
                                { value: "c", label: "If you will miss the appointment, you will need to reschedule." },
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
                            label: "You want to state a general fact about what always happens:",
                            options: [
                                { value: "zero", label: "Zero: 'If you press the wrong button, the screen shows an error.'" },
                                { value: "first", label: "First: 'If you press the wrong button, the screen will show an error.'" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "You're making a plan for tomorrow:",
                            options: [
                                { value: "zero", label: "Zero: 'If I bring my lunch, I save money.'" },
                                { value: "first", label: "First: 'If I bring my lunch tomorrow, I will save money.'" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "You're describing your regular habit:",
                            options: [
                                { value: "zero", label: "Zero: 'If I drink soda late at night, I can't fall asleep.'" },
                                { value: "first", label: "First: 'If I drink soda late tonight, I won't fall asleep.'" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "You're warning someone about a specific situation:",
                            options: [
                                { value: "zero", label: "Zero: 'If you don't set an alarm, you're late.'" },
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
                            label: "If you _____ (miss) the bus, you _____ (wait) longer.",
                            expectedAnswer: "miss, wait|miss,wait",
                        },
                        {
                            type: "select",
                            label: "If I check my phone in bed, I _____ asleep easily.",
                            options: ["won't fall", "don't fall", "didn't fall", "will fall"],
                            expectedAnswer: "don't fall",
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
                            label: "If my manager calls tonight, I _____ back.",
                            options: ["call", "will call", "called", "am calling"],
                            expectedAnswer: "will call",
                        },
                        {
                            type: "text",
                            label: "If the elevator breaks again, I _____ (will report) it to the building office.",
                            expectedAnswer: "will report",
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
                            label: "General truth: 'If you put ice in the sun, it _____.'",
                            options: [
                                { value: "melts", label: "melts (zero - always true)" },
                                { value: "will-melt", label: "will melt (first - future)" },
                            ],
                            expectedAnswer: "melts",
                        },
                        {
                            type: "radio",
                            label: "Future plan: 'If I leave early tomorrow, I _____ to class on time.'",
                            options: [
                                { value: "get", label: "get (zero - always)" },
                                { value: "will-get", label: "will get (first - future)" },
                            ],
                            expectedAnswer: "will-get",
                        },
                        {
                            type: "radio",
                            label: "Your habit: 'If I eat very spicy food, I _____ heartburn.'",
                            options: [
                                { value: "get", label: "get (zero - my habit)" },
                                { value: "will-get", label: "will get (first - future)" },
                            ],
                            expectedAnswer: "get",
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
                            label: "Which is correct for a goal/pattern? (Both can be correct.)",
                            options: [
                                { value: "a", label: "If I take the stairs every day, I will feel stronger." },
                                { value: "b", label: "If I take the stairs every day, I feel stronger." },
                                { value: "c", label: "Both are correct (different meanings)" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "Which expresses a general truth?",
                            options: [
                                { value: "a", label: "If you don't eat all day, you feel dizzy." },
                                { value: "b", label: "If you don't eat all day, you will feel dizzy." },
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
            question: "What is the formula for first conditional?",
            options: [
                { value: "a", label: "If + present, present" },
                { value: "b", label: "If + present, will + verb" },
                { value: "c", label: "If + past, would + verb" },
            ],
            correctAnswer: "b",
            explanation: "First conditional uses present simple in the IF clause and will + base verb in the result clause.",
        },
        {
            id: "quiz-3",
            question: "Which sentence is a zero conditional (always true / habit)?",
            options: [
                { value: "a", label: "If I skip breakfast, I get hungry by 10 AM." },
                { value: "b", label: "If I skip breakfast tomorrow, I will get hungry by 10 AM." },
                { value: "c", label: "If I skipped breakfast, I would get hungry by 10 AM." },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional uses present simple + present simple to talk about habits or things that always happen.",
        },
        {
            id: "quiz-4",
            question: "Which sentence uses first conditional correctly?",
            options: [
                { value: "a", label: "If the bus is late tomorrow, I will text my supervisor." },
                { value: "b", label: "If the bus will be late tomorrow, I will text my supervisor." },
                { value: "c", label: "If the bus is late tomorrow, I text my supervisor." },
            ],
            correctAnswer: "a",
            explanation: "First conditional: IF clause uses present simple (is), result uses will + base verb (will text).",
        },
        {
            id: "quiz-5",
            question: "Which sentence is wrong because it uses 'will' in the IF clause?",
            options: [
                { value: "a", label: "If it rains, we will cancel the picnic." },
                { value: "b", label: "If it will rain, we will cancel the picnic." },
                { value: "c", label: "If it rains, we won't go to the park." },
            ],
            correctAnswer: "b",
            explanation: "In first conditional, the IF clause is present simple (If it rains), not 'If it will rain'.",
        },
        {
            id: "quiz-6",
            question: "Complete: 'If she doesn't bring her ID, she _____ get inside.'",
            options: [
                { value: "a", label: "won't" },
                { value: "b", label: "doesn't" },
                { value: "c", label: "didn't" },
            ],
            correctAnswer: "a",
            explanation: "First conditional negative uses won't + base verb: won't get.",
        },
        {
            id: "quiz-7",
            question: "Complete the zero conditional: 'If you leave milk out, it _____ bad.'",
            options: [
                { value: "a", label: "goes" },
                { value: "b", label: "will go" },
                { value: "c", label: "went" },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional uses present simple in both clauses for general truths: it goes bad.",
        },
        {
            id: "quiz-8",
            question: 'What is the main difference between "If I take the stairs, I feel tired" and "If I take the stairs tomorrow, I will feel tired"?',
            options: [
                { value: "a", label: "No difference — they mean the same thing" },
                { value: "b", label: "Zero = habit/always true; First = a specific future situation" },
                { value: "c", label: "First = past; Zero = future" },
            ],
            correctAnswer: "b",
            explanation: "Zero conditional describes patterns; first conditional talks about a specific future possibility.",
        },
        {
            id: "quiz-9",
            question: "Which one is best for a general truth?",
            options: [
                { value: "a", label: "If you don't sleep enough, you feel tired." },
                { value: "b", label: "If you don't sleep enough tonight, you will feel tired." },
                { value: "c", label: "If you won't sleep enough, you feel tired." },
            ],
            correctAnswer: "a",
            explanation: "General truths and habits use zero conditional: present + present.",
        },
        {
            id: "quiz-10",
            question: "Choose the correct first conditional warning.",
            options: [
                { value: "a", label: "If you don't leave now, you will miss the bus." },
                { value: "b", label: "If you don't leave now, you miss the bus." },
                { value: "c", label: "If you won't leave now, you will miss the bus." },
            ],
            correctAnswer: "a",
            explanation: "A specific future warning uses first conditional: If + present, will + verb.",
        },
        {
            id: "quiz-11",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "What will you do if the train is delayed?" },
                { value: "b", label: "What do you do if the train will be delayed?" },
                { value: "c", label: "What you will do if the train is delayed?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: What will + subject + base verb + if + present simple?",
        },
        {
            id: "quiz-12",
            question: "Choose the correct contraction.",
            options: [
                { value: "a", label: "If it rains, I' ll stay home." },
                { value: "b", label: "If it rains, I'll stay home." },
                { value: "c", label: "If it rains, Ill stay home." },
            ],
            correctAnswer: "b",
            explanation: "I'll = I will. (No spaces; 'Ill' changes the meaning.)",
        },
        {
            id: "quiz-13",
            question: "When do you use first conditional?",
            options: [
                { value: "a", label: "For things that are always true" },
                { value: "b", label: "For real future possibilities" },
                { value: "c", label: "For impossible situations" },
            ],
            correctAnswer: "b",
            explanation: "First conditional is for real future possibilities — things that might happen.",
        },
        {
            id: "quiz-14",
            question: "Which sentence is a good promise using first conditional?",
            options: [
                { value: "a", label: "If you help me, I help you." },
                { value: "b", label: "If you help me, I will help you." },
                { value: "c", label: "If you will help me, I will help you." },
            ],
            correctAnswer: "b",
            explanation: "Promises about a future result use first conditional: will help.",
        },
        {
            id: "quiz-15",
            question: "Which conditional do you use for habits and routines?",
            options: [
                { value: "a", label: "Zero conditional" },
                { value: "b", label: "First conditional" },
                { value: "c", label: "Second conditional" },
            ],
            correctAnswer: "a",
            explanation: "Habits/routines use zero conditional: present simple in both clauses.",
        },
    ],
};
