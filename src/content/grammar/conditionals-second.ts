import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsSecondContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Second Conditional: Dreaming & Imagining",
            icon: "💭",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"If I won a big prize, I would pay off my bills." "If I had more time, I would cook at home more." The <strong>second conditional</strong> helps you talk about hypothetical situations - things that are unlikely, impossible, or just dreams and imagination!</p>
                </div>

                <h3>What Is Second Conditional?</h3>
                <p>Second conditional is for <strong>unreal or hypothetical situations</strong> in the present or future:</p>
                <ul>
                    <li><strong>Unlikely situations:</strong> "If I got a huge raise..." (probably won't happen)</li>
                    <li><strong>Imaginary situations:</strong> "If I were the boss..." (I'm not the boss)</li>
                    <li><strong>Dreams and wishes:</strong> "If I had more money, I would buy a house."</li>
                    <li><strong>Giving advice:</strong> "If I were you, I would talk to the manager."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border: 2px solid #a855f7;">
                    <h4 style="color: #a855f7;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #a855f7; text-align: center; margin: 1rem 0;">If + past simple, would + base verb</p>
                    <p style="text-align: center; font-style: italic;">(past form BUT future/present meaning!)</p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Discussing hypothetical wellness scenarios</li>
                        <li>Giving advice: "If I were you, I would..."</li>
                        <li>Talking about dreams and wishes</li>
                        <li>Expressing what you would do in different situations</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💭 Second conditional is perfect for dreaming, imagining, and giving advice!</p>
                </div>
            `,
            exercises: [
                {
                    id: "second-conditional-intro-1",
                    title: "Practice: Understanding Second Conditional",
                    instructions: "Read each sentence. Is it talking about a real possibility or an imaginary/unlikely situation?",
                    items: [
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>won</span> a big prize, I <span class=\'eg-helper\'>would</span> <span class=\'eg-verb\'>pay off</span> my bills."',
                            options: [
                                { value: "real", label: "Real possibility - likely to happen" },
                                { value: "unreal", label: "Unreal/unlikely - probably won't happen, just imagining" },
                            ],
                            expectedAnswer: "unreal",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>study</span> tonight, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>pass</span> the test."',
                            options: [
                                { value: "real", label: "Real possibility - can really happen" },
                                { value: "unreal", label: "Unreal/unlikely - just imagining" },
                            ],
                            expectedAnswer: "real",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>were</span> the boss, I <span class=\'eg-helper\'>would</span> <span class=\'eg-verb\'>change</span> the schedule."',
                            options: [
                                { value: "real", label: "Real possibility - I might become the boss" },
                                { value: "unreal", label: "Unreal - I'm not the boss, just imagining" },
                            ],
                            expectedAnswer: "unreal",
                        },
                    ],
                },
            ],
        },

        {
            id: "structure",
            stepNumber: 1,
            title: "Second Conditional Structure",
            icon: "🏗️",
            explanation: `
                <h3>The Formula</h3>
                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border: 2px solid #a855f7;">
                    <p style="font-size: 1.5rem; font-weight: bold; color: #a855f7; text-align: center; margin: 1rem 0;">If + past simple, would + base verb</p>
                </div>

                <h3>Breaking It Down</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold; color: #a855f7;">IF clause (use past simple):</p>
                    <ul>
                        <li>If I <strong>won</strong> a big prize</li>
                        <li>If she <strong>had</strong> more time</li>
                        <li>If we <strong>lived</strong> closer to work</li>
                        <li>If they <strong>spoke</strong> English fluently</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d97757;">WOULD clause (result):</p>
                    <ul>
                        <li>I <strong>would pay off</strong> my bills</li>
                        <li>she <strong>would cook</strong> at home more</li>
                        <li>we <strong>would save</strong> time every morning</li>
                        <li>they <strong>would get</strong> better jobs</li>
                    </ul>
                </div>

                <h3>Complete Examples</h3>
                <ul>
                    <li><strong>If I won a big prize</strong>, <strong>I would pay off my bills</strong>.</li>
                    <li><strong>If she had more time</strong>, <strong>she would cook at home more</strong>.</li>
                    <li><strong>If we lived closer to work</strong>, <strong>we would save time every morning</strong>.</li>
                    <li><strong>If they spoke English fluently</strong>, <strong>they would get better jobs</strong>.</li>
                </ul>

                <div style="background: rgba(234, 179, 8, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #eab308;">⚠️ Important!</h4>
                    <p>The IF clause uses <strong>past simple</strong>, but it's NOT talking about the past! It's talking about NOW or the FUTURE, but in an imaginary way.</p>
                    <ul>
                        <li>❌ Wrong thinking: "If I won..." = I won in the past</li>
                        <li>✅ Correct thinking: "If I won..." = imagining winning (unlikely/impossible now or future)</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Past simple in the IF clause doesn't mean past time! It shows the situation is UNREAL or UNLIKELY. Would in the result shows what WOULD happen (but probably won't).",
            },
            exercises: [
                {
                    id: "structure-1",
                    title: "Practice: Building Second Conditional",
                    instructions: "Complete each second conditional sentence.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (win) a big prize, I would pay off my bills.",
                            expectedAnswer: "won",
                        },
                        {
                            type: "select",
                            label: "If she had more time, she _____ cook at home more often.",
                            options: ["cooks", "will cook", "would cook", "cooked"],
                            expectedAnswer: "would cook",
                        },
                        {
                            type: "radio",
                            label: "Which is correct second conditional?",
                            options: [
                                { value: "a", label: "If I lived closer to work, I would walk to work more often." },
                                { value: "b", label: "If I live closer to work, I will walk to work more often." },
                                { value: "c", label: "If I would live closer to work, I would walk to work more often." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "if-i-were-you",
            stepNumber: 2,
            title: "Special Form: 'If I Were You'",
            icon: "👤",
            explanation: `
                <h3>Using "Were" for All Subjects</h3>
                <p>In second conditional with the verb "to be", we traditionally use <strong>WERE for all subjects</strong> (not "was"):</p>

                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>Formal/Traditional (Recommended)</h4>
                    <ul>
                        <li>If I <strong>were</strong> you, I would talk to the manager.</li>
                        <li>If she <strong>were</strong> taller, she would play basketball.</li>
                        <li>If he <strong>were</strong> here, he would help us.</li>
                        <li>If it <strong>were</strong> a holiday, we would stay home.</li>
                    </ul>
                </div>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>Informal/Spoken (Common but not recommended)</h4>
                    <ul>
                        <li>If I <strong>was</strong> you... (heard in casual speech)</li>
                        <li>If she <strong>was</strong> taller...</li>
                    </ul>
                    <p style="font-style: italic; margin-bottom: 0;">Note: In professional settings, workplace, or formal writing, always use "were"!</p>
                </div>

                <h3>Common "If I Were You" Advice Patterns</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Giving advice:</p>
                    <ul>
                        <li>If I were you, I <strong>would talk</strong> to the manager.</li>
                        <li>If I were you, I <strong>would ask</strong> for a raise.</li>
                        <li>If I were you, I <strong>would see</strong> a doctor.</li>
                        <li>If I were you, I <strong>would apply</strong> for that job.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Imagining being someone else:</p>
                    <ul>
                        <li>If I were the boss, I <strong>would change</strong> the schedule.</li>
                        <li>If I were rich, I <strong>would buy</strong> a big house.</li>
                        <li>If I were younger, I <strong>would go back</strong> to school.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Use 'were' for all subjects in second conditional: 'If I were', 'If he were', 'If she were', 'If it were'. This is especially important in professional contexts!",
            },
            exercises: [
                {
                    id: "if-i-were-1",
                    title: "Practice: If I Were You",
                    instructions: "Complete each sentence with the correct form.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "If I were you, I would talk to the manager." },
                                { value: "b", label: "If I was you, I would talk to the manager." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "If I _____ (be) the boss, I would change the schedule.",
                            expectedAnswer: "were",
                        },
                        {
                            type: "select",
                            label: "If she _____ taller, she would play basketball.",
                            options: ["is", "was", "were", "would be"],
                            expectedAnswer: "were",
                        },
                    ],
                },
            ],
        },

        {
            id: "first-vs-second",
            stepNumber: 3,
            title: "First vs Second Conditional",
            icon: "⚖️",
            explanation: `
                <h3>The Key Difference: Real vs Unreal</h3>
                <p>Sometimes you can use EITHER first or second conditional for the same situation, depending on how likely you think it is:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                        <h4 style="color: #7ba884; margin-top: 0;">First Conditional (Real)</h4>
                        <p style="font-weight: bold;">"If I save money, I will buy a car."</p>
                        <p style="margin: 0;">Meaning: This is realistic. I have a real plan to save money and buy a car.</p>
                    </div>
                    <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                        <h4 style="color: #a855f7; margin-top: 0;">Second Conditional (Unreal)</h4>
                        <p style="font-weight: bold;">"If I saved money, I would buy a car."</p>
                        <p style="margin: 0;">Meaning: This is unlikely or hypothetical. I'm not saving money, or I don't think I can save enough.</p>
                    </div>
                </div>

                <h3>More Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">First (Real/Likely)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">Second (Unreal/Unlikely)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>study</strong> hard, I <strong>will pass</strong>.<br/><em>(I plan to study - realistic)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>studied</strong> harder, I <strong>would pass</strong>.<br/><em>(I'm not studying enough - imagining)</em></td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If she <strong>asks</strong> for a raise, she <strong>will get</strong> it.<br/><em>(She's planning to ask - likely)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If she <strong>asked</strong> for a raise, she <strong>would get</strong> it.<br/><em>(She's not asking - just my opinion)</em></td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If we <strong>exercise</strong> daily, we <strong>will lose</strong> weight.<br/><em>(We're going to do it - real plan)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If we <strong>exercised</strong> daily, we <strong>would lose</strong> weight.<br/><em>(We're not exercising - wishful thinking)</em></td>
                        </tr>
                    </tbody>
                </table>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #3b82f6;">Quick Decision Tool</h4>
                    <p><strong>Ask yourself:</strong> Is this REALISTIC or UNLIKELY/IMAGINARY?</p>
                    <ul>
                        <li><strong>Realistic plan or possibility →</strong> First conditional (present, will)</li>
                        <li><strong>Unlikely, imaginary, or impossible →</strong> Second conditional (past, would)</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "first-vs-second-1",
                    title: "Practice: Choose First or Second",
                    instructions: "Decide whether each situation is realistic (first) or unlikely (second).",
                    items: [
                        {
                            type: "radio",
                            label: "You're making a real plan to save money for a car:",
                            options: [
                                { value: "first", label: "First: 'If I save money, I will buy a car.'" },
                                { value: "second", label: "Second: 'If I saved money, I would buy a car.'" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "You're imagining you get a huge raise this month (unlikely):",
                            options: [
                                { value: "first", label: "First: 'If I get a huge raise, I will pay off my credit card.'" },
                                { value: "second", label: "Second: 'If I got a huge raise, I would pay off my credit card.'" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: "You're not the boss, but imagining what you would do:",
                            options: [
                                { value: "first", label: "First: 'If I am the boss, I will change things.'" },
                                { value: "second", label: "Second: 'If I were the boss, I would change things.'" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
            ],
        },

        {
            id: "wellness-examples",
            stepNumber: 4,
            title: "Wellness & Work Examples",
            icon: "💼",
            explanation: `
                <h3>Wellness Scenarios</h3>
                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I had more energy, I would exercise every day.</li>
                        <li>If she weren't so stressed, she would sleep better.</li>
                        <li>If we lived near a park, we would walk more often.</li>
                        <li>If I had more time, I would cook healthy meals at home.</li>
                    </ul>
                </div>

                <h3>Work & Career Dreams</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I spoke English fluently, I would apply for that management position.</li>
                        <li>If I were the manager, I would give everyone Fridays off.</li>
                        <li>If she had more experience, she would get promoted.</li>
                        <li>If we worked from home, we would save time and money.</li>
                    </ul>
                </div>

                <h3>Giving Advice</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I were you, I would talk to HR about that problem.</li>
                        <li>If I were you, I would see a doctor about those headaches.</li>
                        <li>If I were you, I would apply for that job - you're qualified!</li>
                        <li>If I were you, I would ask for flexible hours.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "wellness-ex-1",
                    title: "Practice: Wellness & Work Scenarios",
                    instructions: "Complete each second conditional sentence.",
                    items: [
                        {
                            type: "text",
                            label: "If I had more energy, I _____ (would exercise) every day.",
                            expectedAnswer: "would exercise",
                        },
                        {
                            type: "select",
                            label: "If she _____ English fluently, she would apply for that job.",
                            options: ["speaks", "will speak", "spoke", "would speak"],
                            expectedAnswer: "spoke",
                        },
                        {
                            type: "radio",
                            label: "Which is correct advice?",
                            options: [
                                { value: "a", label: "If I were you, I would talk to HR." },
                                { value: "b", label: "If I was you, I will talk to HR." },
                                { value: "c", label: "If I am you, I would talk to HR." },
                            ],
                            expectedAnswer: "a",
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
                    id: "second-conditional-ex-1",
                    title: "Exercise 1: Complete the IF Clause",
                    instructions: "Use past simple in the IF clause.",
                    items: [
                        {
                            type: "text",
                            label: "If my manager _____ (give) me a raise, I would fix my old phone.",
                            expectedAnswer: "gave",
                        },
                        {
                            type: "text",
                            label: "If I _____ (have) an extra day off, I would rest and catch up on errands.",
                            expectedAnswer: "had",
                        },
                    ],
                },
                {
                    id: "second-conditional-ex-2",
                    title: "Exercise 2: Complete the Result Clause",
                    instructions: "Use would + base verb in the result clause.",
                    items: [
                        {
                            type: "select",
                            label: "If I lived closer to work, I _____ there most days.",
                            options: ["go", "will go", "would go", "went"],
                            expectedAnswer: "would go",
                        },
                        {
                            type: "text",
                            label: "If he spoke more confidently in interviews, he _____ (would get) that job.",
                            expectedAnswer: "would get",
                        },
                    ],
                },
                {
                    id: "second-conditional-ex-3",
                    title: "Exercise 3: If I Were You",
                    instructions: "Use 'were' for all subjects.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "If I were you, I would see a doctor." },
                                { value: "b", label: "If I was you, I would see a doctor." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "If she _____ (be) taller, she would play basketball.",
                            expectedAnswer: "were",
                        },
                    ],
                },
                {
                    id: "second-conditional-ex-4",
                    title: "Exercise 4: First vs Second",
                    instructions: "Choose the right conditional based on the situation.",
                    items: [
                        {
                            type: "radio",
                            label: "A realistic plan: 'If I save $100/month, I _____ a car next year.'",
                            options: [
                                { value: "will-buy", label: "will buy (first - real plan)" },
                                { value: "would-buy", label: "would buy (second - unlikely)" },
                            ],
                            expectedAnswer: "will-buy",
                        },
                        {
                            type: "radio",
                            label: "An unlikely dream: 'If I _____ a big prize, I would take a month off work.'",
                            options: [
                                { value: "win", label: "win (first - likely)" },
                                { value: "won", label: "won (second - unlikely)" },
                            ],
                            expectedAnswer: "won",
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
                <h3>Second Conditional Formula</h3>
                <p style="font-size: 1.25rem; font-weight: bold; color: #a855f7;">If + past simple, would + base verb</p>

                <h3>When to Use Second Conditional</h3>
                <ul>
                    <li><strong>Unlikely situations:</strong> If I got a huge raise...</li>
                    <li><strong>Impossible situations:</strong> If I were the president...</li>
                    <li><strong>Dreams and wishes:</strong> If I had more money...</li>
                    <li><strong>Giving advice:</strong> If I were you, I would...</li>
                </ul>

                <h3>Special Rule: "If I Were"</h3>
                <p>Always use <strong>WERE</strong> for all subjects with the verb "to be":</p>
                <ul>
                    <li>If I <strong>were</strong> you...</li>
                    <li>If he <strong>were</strong> here...</li>
                    <li>If she <strong>were</strong> the boss...</li>
                </ul>

                <h3>First vs Second</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">First (Real)</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Second (Unreal)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I save, I <strong>will</strong> buy</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I saved, I <strong>would</strong> buy</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Realistic possibility</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unlikely/imaginary</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "⚠️ Remember",
                content: "Past simple in second conditional doesn't mean past time! It shows the situation is UNREAL or UNLIKELY right now or in the future.",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What is the formula for second conditional?",
            options: [
                { value: "a", label: "If + past simple, would + base verb" },
                { value: "b", label: "If + present, will + base verb" },
                { value: "c", label: "If + present, present" },
            ],
            correctAnswer: "a",
            explanation: "Second conditional uses: If + past simple, would + base verb for unreal/unlikely situations.",
        },
        {
            id: "quiz-2",
            question: "Which sentence uses second conditional correctly?",
            options: [
                { value: "a", label: "If I had a quieter apartment, I would sleep better." },
                { value: "b", label: "If I have a quieter apartment, I would sleep better." },
                { value: "c", label: "If I would have a quieter apartment, I would sleep better." },
            ],
            correctAnswer: "a",
            explanation: "Second conditional: If + past simple (had), would + base verb (would sleep).",
        },
        {
            id: "quiz-3",
            question: "Which form is correct with 'to be' in second conditional?",
            options: [
                { value: "a", label: "If I was you, I would talk to the manager." },
                { value: "b", label: "If I were you, I would talk to the manager." },
                { value: "c", label: "If I am you, I would talk to the manager." },
            ],
            correctAnswer: "b",
            explanation: "In second conditional, use 'were' for all subjects: If I were, If he were, If she were.",
        },
        {
            id: "quiz-4",
            question: "Complete: 'If I _____ more time, I would cook at home more.'",
            options: [
                { value: "a", label: "have" },
                { value: "b", label: "had" },
                { value: "c", label: "would have" },
            ],
            correctAnswer: "b",
            explanation: "Use past simple in the IF clause: If I had…",
        },
        {
            id: "quiz-5",
            question: "When do you use second conditional?",
            options: [
                { value: "a", label: "For realistic plans you expect to happen" },
                { value: "b", label: "For unlikely/imaginary situations and advice" },
                { value: "c", label: "For things that are always true" },
            ],
            correctAnswer: "b",
            explanation: "Second conditional is for unreal, imaginary, or unlikely situations in the present/future.",
        },
        {
            id: "quiz-6",
            question: "Which sentence gives advice correctly?",
            options: [
                { value: "a", label: "If I were you, I would talk to HR." },
                { value: "b", label: "If I am you, I will talk to HR." },
                { value: "c", label: "If I will be you, I would talk to HR." },
            ],
            correctAnswer: "a",
            explanation: "Advice pattern: If I were you, I would…",
        },
        {
            id: "quiz-7",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "What would you do if you had a free afternoon?" },
                { value: "b", label: "What you would do if you had a free afternoon?" },
                { value: "c", label: "What would you do if you would have a free afternoon?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: WH-word + would + subject + base verb + if + past simple?",
        },
        {
            id: "quiz-8",
            question: "Complete: 'If the bus were always on time, I _____ late.'",
            options: [
                { value: "a", label: "wouldn't be" },
                { value: "b", label: "won't be" },
                { value: "c", label: "isn't" },
            ],
            correctAnswer: "a",
            explanation: "Second conditional negative uses would not (wouldn't): wouldn't be.",
        },
        {
            id: "quiz-9",
            question: "Which sentence is wrong because it uses 'would' in the IF clause?",
            options: [
                { value: "a", label: "If I had more time, I would read more." },
                { value: "b", label: "If I would have more time, I would read more." },
                { value: "c", label: "If I were you, I would ask a question." },
            ],
            correctAnswer: "b",
            explanation: "In second conditional, the IF clause is past simple (If I had…), not 'If I would have…'.",
        },
        {
            id: "quiz-10",
            question: "Which sentence is second conditional (unreal/unlikely)?",
            options: [
                { value: "a", label: "If I save money, I will buy a used car." },
                { value: "b", label: "If I saved money, I would buy a used car." },
                { value: "c", label: "If I save money, I buy a used car." },
            ],
            correctAnswer: "b",
            explanation: "Saved + would buy shows second conditional (unreal/unlikely).",
        },
        {
            id: "quiz-11",
            question: "Which sentence is correct (using 'could' for possibility/ability)?",
            options: [
                { value: "a", label: "If I had a car, I could drive to work." },
                { value: "b", label: "If I have a car, I could drive to work." },
                { value: "c", label: "If I would have a car, I could drive to work." },
            ],
            correctAnswer: "a",
            explanation: "Second conditional can use could/might in the result clause: If + past, could + base verb.",
        },
        {
            id: "quiz-12",
            question: "Choose the correct sentence with 'were'.",
            options: [
                { value: "a", label: "If he was here, he would help." },
                { value: "b", label: "If he were here, he would help." },
                { value: "c", label: "If he is here, he would help." },
            ],
            correctAnswer: "b",
            explanation: "Traditional second conditional uses were for all subjects: If he were…",
        },
        {
            id: "quiz-13",
            question: "Complete: 'If my building fixed the heat, I _____ sleep better.'",
            options: [
                { value: "a", label: "would" },
                { value: "b", label: "will" },
                { value: "c", label: "am" },
            ],
            correctAnswer: "a",
            explanation: "Second conditional result uses would + base verb: would sleep.",
        },
        {
            id: "quiz-14",
            question: "What does the past simple mean in second conditional?",
            options: [
                { value: "a", label: "It talks about the past time" },
                { value: "b", label: "It shows the situation is unreal/unlikely" },
                { value: "c", label: "It makes the sentence a question" },
            ],
            correctAnswer: "b",
            explanation: "Past form here signals unreality (imagining), not past time.",
        },
        {
            id: "quiz-15",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "If I were the manager, I would change the schedule." },
                { value: "b", label: "If I am the manager, I would change the schedule." },
                { value: "c", label: "If I would be the manager, I would change the schedule." },
            ],
            correctAnswer: "a",
            explanation: "Second conditional: If + past (were), would + base verb (would change).",
        },
    ],
};
