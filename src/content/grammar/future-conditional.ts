import type { InteractiveGuideContent } from "@/types/activity";

export const futureConditionalContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Conditional: Planning for Wellness",
            icon: "🔮",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"If I exercise every day, I will feel better." "If I reduce stress, my headaches will go away." The future conditional (first conditional) helps you plan for real future possibilities and connect causes to effects. Perfect for setting wellness goals, managing stress, and building healthy habits.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>The future conditional is essential for:</p>
                <ul>
                    <li><strong>Goal setting:</strong> "If I walk 30 minutes daily, I will lose weight."</li>
                    <li><strong>Health planning:</strong> "If I sleep 8 hours, I'll have more energy."</li>
                    <li><strong>Stress management:</strong> "If I take breaks, I won't feel so overwhelmed."</li>
                    <li><strong>Cause & effect thinking:</strong> "If I eat breakfast, I'll concentrate better at work."</li>
                </ul>
            `,
        },

        {
            id: "first-conditional-basics",
            stepNumber: 1,
            title: "What Is the First Conditional?",
            icon: "❓",
            explanation: `
                <h3>The First Conditional (Future Real Conditional)</h3>
                <p>Used for <strong>real future possibilities</strong> - things that are likely to happen if a condition is met.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem; border: 2px solid #7ba884;">
                    <h4 style="color: #7ba884;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #7ba884; text-align: center; margin: 1rem 0;">If + present simple, will + base verb</p>
                    <p style="text-align: center; font-style: italic;">(condition clause) , (result clause)</p>
                </div>

                <h3>Structure Breakdown</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold; color: #7ba884;">IF clause (condition):</p>
                    <p>If + subject + present simple verb</p>
                    <ul>
                        <li>If I <strong>exercise</strong></li>
                        <li>If she <strong>reduces</strong> stress</li>
                        <li>If we <strong>eat</strong> healthy</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d97757;">WILL clause (result):</p>
                    <p>subject + will + base verb</p>
                    <ul>
                        <li>I <strong>will feel</strong> better</li>
                        <li>she <strong>will be</strong> healthier</li>
                        <li>we <strong>will lose</strong> weight</li>
                    </ul>
                </div>

                <h3>Complete Examples</h3>
                <ul>
                    <li><strong>If I exercise every day</strong>, <strong>I will feel better</strong>.</li>
                    <li><strong>If she reduces stress</strong>, <strong>her headaches will go away</strong>.</li>
                    <li><strong>If we eat breakfast</strong>, <strong>we will have more energy</strong>.</li>
                    <li><strong>If he gets enough sleep</strong>, <strong>he won't be tired at work</strong>.</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "If clause = present simple (not future!). Result clause = will + base verb. DON'T say 'If I will exercise...'",
            },
        },

        {
            id: "word-order",
            stepNumber: 2,
            title: "Word Order: If First or Second?",
            icon: "🔄",
            explanation: `
                <h3>You Can Switch the Order!</h3>
                <p>The IF clause can come first OR second. The meaning is the same.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>IF clause FIRST (use comma):</h4>
                    <p style="font-size: 1.125rem; font-weight: bold;">If + condition, subject + will + verb</p>
                    <ul>
                        <li><strong>If I walk 30 minutes daily</strong>, <strong>I will lose weight</strong>.</li>
                        <li><strong>If you drink more water</strong>, <strong>you'll feel better</strong>.</li>
                        <li><strong>If we manage stress</strong>, <strong>we'll sleep better</strong>.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ Use a comma after the IF clause!</p>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>RESULT clause FIRST (no comma):</h4>
                    <p style="font-size: 1.125rem; font-weight: bold;">Subject + will + verb + if + condition</p>
                    <ul>
                        <li><strong>I will lose weight</strong> <strong>if I walk 30 minutes daily</strong>.</li>
                        <li><strong>You'll feel better</strong> <strong>if you drink more water</strong>.</li>
                        <li><strong>We'll sleep better</strong> <strong>if we manage stress</strong>.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ NO comma when IF clause is second!</p>
                </div>

                <p style="margin-top: 1.5rem; font-weight: bold;">Both sentences mean exactly the same thing!</p>
            `,
        },

        {
            id: "negatives",
            stepNumber: 3,
            title: "Negative Forms",
            icon: "🚫",
            explanation: `
                <h3>Making Negatives in First Conditional</h3>
                <p>You can make either the IF clause or the WILL clause (or both) negative.</p>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Negative IF clause:</h4>
                    <p style="font-weight: bold;">If + don't/doesn't + verb, will + verb</p>
                    <ul>
                        <li>If I <strong>don't exercise</strong>, I will gain weight.</li>
                        <li>If she <strong>doesn't sleep</strong> enough, she'll be tired.</li>
                        <li>If we <strong>don't eat</strong> breakfast, we won't have energy.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Negative WILL clause:</h4>
                    <p style="font-weight: bold;">If + present simple, won't + verb</p>
                    <ul>
                        <li>If I exercise, I <strong>won't</strong> gain weight.</li>
                        <li>If she sleeps enough, she <strong>won't be</strong> tired.</li>
                        <li>If we eat breakfast, we <strong>won't feel</strong> hungry at 10am.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Both negative:</h4>
                    <ul>
                        <li>If I <strong>don't reduce</strong> stress, my headaches <strong>won't go away</strong>.</li>
                        <li>If you <strong>don't take</strong> breaks, you <strong>won't feel</strong> better.</li>
                    </ul>
                </div>
            `,
        },

        {
            id: "wellness-contexts",
            stepNumber: 4,
            title: "Wellness & Health Contexts",
            icon: "🏥",
            explanation: `
                <h3>Exercise & Physical Health</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I walk 30 minutes daily, <strong>I will lose weight</strong>.</li>
                        <li>If I take the stairs, <strong>I'll get stronger</strong>.</li>
                        <li>If I stretch every morning, <strong>my back pain will improve</strong>.</li>
                        <li>If I don't exercise, <strong>I'll feel sluggish</strong>.</li>
                    </ul>
                </div>

                <h3>Sleep & Rest</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I sleep 8 hours, <strong>I will have more energy</strong>.</li>
                        <li>If I go to bed early, <strong>I won't be tired at work</strong>.</li>
                        <li>If I avoid caffeine after 3pm, <strong>I'll sleep better</strong>.</li>
                        <li>If I don't rest enough, <strong>I'll get sick</strong>.</li>
                    </ul>
                </div>

                <h3>Nutrition & Diet</h3>
                <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I eat breakfast, <strong>I'll concentrate better</strong>.</li>
                        <li>If I drink more water, <strong>I'll feel less tired</strong>.</li>
                        <li>If I cook at home, <strong>I'll save money and be healthier</strong>.</li>
                        <li>If I don't eat vegetables, <strong>I won't get enough vitamins</strong>.</li>
                    </ul>
                </div>

                <h3>Stress Management</h3>
                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I take breaks, <strong>I won't feel overwhelmed</strong>.</li>
                        <li>If I practice deep breathing, <strong>my anxiety will decrease</strong>.</li>
                        <li>If I say "no" more often, <strong>I'll have less stress</strong>.</li>
                        <li>If I don't manage stress, <strong>my health will suffer</strong>.</li>
                    </ul>
                </div>

                <h3>Work-Life Balance</h3>
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I leave work on time, <strong>I'll have more time with family</strong>.</li>
                        <li>If I don't check email after 6pm, <strong>I'll relax more</strong>.</li>
                        <li>If I take my vacation days, <strong>I won't burn out</strong>.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Wellness Tip",
                content: "Use first conditional to set SMART goals: 'If I exercise 3x/week, I'll lose 10 pounds in 3 months.' Make your conditions specific and measurable!",
            },
        },

        {
            id: "modals-instead-of-will",
            stepNumber: 5,
            title: "Using Other Modals (Not Just 'Will')",
            icon: "🔧",
            explanation: `
                <h3>You Can Use Other Modals Instead of "Will"</h3>
                <p>While "will" is most common, you can also use can, may, might, should, or imperatives in the result clause.</p>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Can (ability/possibility):</h4>
                    <ul>
                        <li>If I manage my time better, <strong>I can finish my work early</strong>.</li>
                        <li>If you stretch, <strong>you can reduce back pain</strong>.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>May/Might (less certain):</h4>
                    <ul>
                        <li>If I eat less sugar, <strong>I may lose weight</strong>. (less certain than "will")</li>
                        <li>If I try meditation, <strong>it might help</strong> with stress.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Should (advice):</h4>
                    <ul>
                        <li>If you have chest pain, <strong>you should see a doctor</strong>.</li>
                        <li>If I feel dizzy, <strong>I should sit down</strong>.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Imperative (command/suggestion):</h4>
                    <ul>
                        <li>If you feel tired, <strong>take a break</strong>.</li>
                        <li>If your symptoms get worse, <strong>call the doctor</strong>.</li>
                    </ul>
                </div>
            `,
        },

        {
            id: "common-mistakes",
            stepNumber: 6,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Using "will" in the IF clause</h3>
                <ul>
                    <li>❌ "If I <strong>will exercise</strong>, I will feel better." → ✅ "If I <strong>exercise</strong>, I will feel better."</li>
                    <li>❌ "If it <strong>will rain</strong>, I won't go." → ✅ "If it <strong>rains</strong>, I won't go."</li>
                </ul>

                <h3>Mistake #2: Forgetting the comma (when IF is first)</h3>
                <ul>
                    <li>❌ "If I exercise I will feel better." → ✅ "If I exercise<strong>,</strong> I will feel better."</li>
                </ul>

                <h3>Mistake #3: Using present tense in BOTH clauses</h3>
                <ul>
                    <li>❌ "If I exercise, I <strong>feel</strong> better." → ✅ "If I exercise, I <strong>will feel</strong> better."</li>
                    <li>(First sentence = zero conditional for general truths. Second = first conditional for future.)</li>
                </ul>

                <h3>Mistake #4: Wrong modal/tense in result clause</h3>
                <ul>
                    <li>❌ "If I walk, I <strong>walked</strong>..." → ✅ "If I walk, I <strong>will walk</strong>..."</li>
                </ul>
            `,
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "future-conditional-ex-1",
                    title: "Exercise 1: IF Clause (Present Simple)",
                    instructions: "Complete the sentence with the correct verb form.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (exercise) every day, I will feel better.",
                            expectedAnswer: "exercise",
                        },
                    ],
                },
                {
                    id: "future-conditional-ex-2",
                    title: "Exercise 2: Result Clause (Will + Base Verb)",
                    instructions: 'Choose the correct form with "will".',
                    items: [
                        {
                            type: "select",
                            label: "If I sleep 8 hours, I _____ more energy.",
                            options: ["have", "will have", "would have", "am having"],
                            expectedAnswer: "will have",
                        },
                    ],
                },
                {
                    id: "future-conditional-ex-3",
                    title: "Exercise 3: Fix the Common Mistake",
                    instructions: "Choose the correct sentence (no 'will' in the IF clause).",
                    items: [
                        {
                            type: "radio",
                            label: "Fix this: If I will eat breakfast, I will concentrate better.",
                            options: [
                                { value: "a", label: "If I eat breakfast, I will concentrate better." },
                                { value: "b", label: "If I will eat breakfast, I concentrate better." },
                                { value: "c", label: "If I ate breakfast, I will concentrate better." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "future-conditional-ex-4",
                    title: "Exercise 4: Negative Result",
                    instructions: 'Choose the correct "will" form.',
                    items: [
                        {
                            type: "select",
                            label: "If I don't take breaks, I _____ overwhelmed.",
                            options: ["feel", "will feel", "felt", "am feeling"],
                            expectedAnswer: "will feel",
                        },
                    ],
                },
                {
                    id: "future-conditional-ex-5",
                    title: "Exercise 5: Word Order + Comma",
                    instructions: "Choose the version with IF first (and the comma).",
                    items: [
                        {
                            type: "radio",
                            label: "Rewrite: I will lose weight if I walk 30 minutes daily.",
                            options: [
                                { value: "a", label: "If I walk 30 minutes daily, I will lose weight." },
                                { value: "b", label: "If I walk 30 minutes daily I will lose weight." },
                                { value: "c", label: "If I will walk 30 minutes daily, I will lose weight." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "future-conditional-ex-6",
                    title: "Exercise 6: Another IF Clause",
                    instructions: "Complete the sentence with the correct verb form.",
                    items: [
                        {
                            type: "text",
                            label: "If you _____ (reduce) stress, your headaches will go away.",
                            expectedAnswer: "reduce",
                        },
                    ],
                },
                {
                    id: "future-conditional-ex-7",
                    title: "Exercise 7: Make the Result Negative",
                    instructions: "Choose the best negative result.",
                    items: [
                        {
                            type: "radio",
                            label: "Make the result negative: If I exercise, I will gain weight.",
                            options: [
                                { value: "a", label: "If I exercise, I won't gain weight." },
                                { value: "b", label: "If I will exercise, I won't gain weight." },
                                { value: "c", label: "If I exercise, I didn't gain weight." },
                                { value: "d", label: "If I exercise, I don't gain weight." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "future-conditional-ex-8",
                    title: "Exercise 8: Modal in the Result",
                    instructions: "Choose the best completion.",
                    items: [
                        {
                            type: "select",
                            label: "If I manage my time better, I _____ work early.",
                            options: ["finish", "can finish", "am finish", "finishing"],
                            expectedAnswer: "can finish",
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
                <h3>First Conditional Formula</h3>
                <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">If + present simple, will + base verb</p>

                <h3>Word Order Options</h3>
                <ul>
                    <li><strong>IF first:</strong> If I exercise<strong>,</strong> I will feel better. (use comma!)</li>
                    <li><strong>WILL first:</strong> I will feel better if I exercise. (no comma!)</li>
                </ul>

                <h3>Common Uses</h3>
                <ul>
                    <li><strong>Future possibilities:</strong> "If I walk daily, I'll lose weight."</li>
                    <li><strong>Cause & effect:</strong> "If I sleep 8 hours, I'll have energy."</li>
                    <li><strong>Warnings:</strong> "If you don't rest, you'll get sick."</li>
                    <li><strong>Promises:</strong> "If I feel better, I'll go to work."</li>
                </ul>

                <h3>Negative Forms</h3>
                <ul>
                    <li><strong>Negative IF:</strong> If I <strong>don't</strong> exercise, I will gain weight.</li>
                    <li><strong>Negative WILL:</strong> If I exercise, I <strong>won't</strong> gain weight.</li>
                </ul>

                <h3>Other Modals (Instead of Will)</h3>
                <ul>
                    <li><strong>Can:</strong> If I exercise, I <strong>can</strong> lose weight.</li>
                    <li><strong>May/Might:</strong> If I eat less sugar, I <strong>may</strong> feel better.</li>
                    <li><strong>Should:</strong> If you have pain, you <strong>should</strong> call the doctor.</li>
                    <li><strong>Imperative:</strong> If you feel tired, <strong>take a break</strong>.</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Critical Rule",
                content: "NEVER use 'will' in the IF clause! Use present simple: 'If I exercise' (NOT 'If I will exercise').",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which is correct?",
            options: [
                { value: "a", label: "If I will exercise, I will feel better." },
                { value: "b", label: "If I exercise, I will feel better." },
                { value: "c", label: "If I exercise, I feel better." },
            ],
            correctAnswer: "b",
            explanation: "Use present simple in the IF clause, not 'will'. The formula is: If + present, will + verb.",
        },
        {
            id: "quiz-2",
            question: "Complete: If I sleep 8 hours, I _____ more energy.",
            options: [
                { value: "a", label: "have" },
                { value: "b", label: "will have" },
                { value: "c", label: "had" },
            ],
            correctAnswer: "b",
            explanation: "The result clause uses 'will + base verb': 'I will have more energy.'",
        },
        {
            id: "quiz-3",
            question: "Where should the comma go? 'If I walk daily I will lose weight.'",
            options: [
                { value: "a", label: "No comma needed" },
                { value: "b", label: "After 'daily'" },
                { value: "c", label: "After 'walk'" },
            ],
            correctAnswer: "b",
            explanation: "When the IF clause comes first, use a comma after it: 'If I walk daily, I will lose weight.'",
        },
        {
            id: "quiz-4",
            question: "Which is the negative form?",
            options: [
                { value: "a", label: "If I don't exercise, I will gain weight." },
                { value: "b", label: "If I won't exercise, I will gain weight." },
                { value: "c", label: "If I not exercise, I will gain weight." },
            ],
            correctAnswer: "a",
            explanation: "Negative IF clause uses 'don't/doesn't + verb': 'If I don't exercise...'",
        },
        {
            id: "quiz-5",
            question: "Can you use modals other than 'will' in the result clause?",
            options: [
                { value: "a", label: "No, only 'will' is allowed" },
                { value: "b", label: "Yes, you can use can, may, might, should" },
                { value: "c", label: "Only in negative sentences" },
            ],
            correctAnswer: "b",
            explanation: "You can use other modals like can, may, might, should, or even imperatives in the result clause.",
        },
        {
            id: "quiz-6",
            question: "What does first conditional express?",
            options: [
                { value: "a", label: "Impossible situations" },
                { value: "b", label: "Real future possibilities" },
                { value: "c", label: "Past regrets" },
            ],
            correctAnswer: "b",
            explanation: "First conditional expresses real future possibilities and their likely results.",
        },
    ],
};
