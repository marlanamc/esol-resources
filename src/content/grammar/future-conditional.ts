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
                    <li><strong>Goal setting:</strong> "If I walk on the Harborwalk after class, I will sleep better."</li>
                    <li><strong>Health planning:</strong> "If I sleep 8 hours, I'll have more energy."</li>
                    <li><strong>Stress management:</strong> "If I take breaks, I won't feel so overwhelmed."</li>
                    <li><strong>Cause & effect thinking:</strong> "If I eat breakfast, I'll concentrate better at work."</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Explaining home remedies ("If you drink ginger tea, your stomach will feel better")</li>
                        <li>Discussing stress solutions ("If I exercise, I'll sleep better")</li>
                        <li>Making wellness action plans ("If I reduce sugar, I'll have more energy")</li>
                        <li>Roundtable discussion: sharing what works for stress</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🎯 Conditionals turn ideas into action plans - they help you reach your goals!</p>
                </div>
            `,
            exercises: [
                {
                    id: "future-conditional-intro-1",
                    title: "Practice: Understanding Cause and Effect",
                    instructions: "Read each sentence and identify what type of future situation it describes.",
                    items: [
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>walk</span> on the Harborwalk after class, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>sleep</span> better."',
                            options: [
                                { value: "goal-setting", label: "Goal setting - planning a future outcome" },
                                { value: "past-action", label: "Past action - something that already happened" },
                                { value: "current-habit", label: "Current habit - something happening now" },
                            ],
                            expectedAnswer: "goal-setting",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>sleep</span> 8 hours, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>have</span> more energy."',
                            options: [
                                { value: "health-planning", label: "Health planning - connecting action to future result" },
                                { value: "past-experience", label: "Past experience - something that happened before" },
                                { value: "general-truth", label: "General truth - always true statement" },
                            ],
                            expectedAnswer: "health-planning",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>take</span> breaks, I <span class=\'eg-helper\'>won\'t</span> <span class=\'eg-verb\'>feel</span> so overwhelmed."',
                            options: [
                                { value: "stress-management", label: "Stress management - preventing a future problem" },
                                { value: "past-action", label: "Past action - something that already happened" },
                                { value: "current-feeling", label: "Current feeling - how I feel right now" },
                            ],
                            expectedAnswer: "stress-management",
                        },
                    ],
                },
            ],
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
	                        <li>If I <strong>leave</strong> early</li>
	                        <li>If she <strong>calls</strong> the clinic</li>
	                        <li>If we <strong>pack</strong> lunch</li>
	                    </ul>
	                </div>

	                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
	                    <p style="font-weight: bold; color: #d97757;">WILL clause (result):</p>
	                    <p>subject + will + base verb</p>
	                    <ul>
	                        <li>I <strong>will arrive</strong> on time</li>
	                        <li>she <strong>will get</strong> an appointment</li>
	                        <li>we <strong>will save</strong> money</li>
	                    </ul>
	                </div>

	                <h3>Complete Examples</h3>
	                <ul>
	                    <li><strong>If I leave early</strong>, <strong>I will catch the Blue Line</strong>.</li>
	                    <li><strong>If she calls the clinic</strong>, <strong>they will give her a new appointment time</strong>.</li>
	                    <li><strong>If we pack lunch</strong>, <strong>we will save money</strong>.</li>
	                    <li><strong>If he goes to bed early</strong>, <strong>he won't be tired at work</strong>.</li>
	                </ul>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "If clause = present simple (not future!). Result clause = will + base verb. DON'T say 'If I will exercise...'",
            },
            exercises: [
                {
                    id: "first-conditional-basics-1",
                    title: "Practice: Identify the Formula Parts",
                    instructions: "For each sentence, identify which part is the IF clause (condition) and which is the WILL clause (result).",
	                    items: [
	                        {
	                            type: "radio",
	                            label: '"If I <span class=\'eg-verb\'>leave</span> early, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>catch</span> the Blue Line."',
	                            options: [
	                                { value: "if-exercise", label: "IF clause: 'If I leave early' | WILL clause: 'I will catch the Blue Line'" },
	                                { value: "if-feel", label: "IF clause: 'I will catch the Blue Line' | WILL clause: 'If I leave early'" },
	                                { value: "both-if", label: "Both clauses use 'if'" },
	                            ],
	                            expectedAnswer: "if-exercise",
	                        },
	                        {
	                            type: "radio",
	                            label: '"If she <span class=\'eg-verb\'>calls</span> the clinic, they <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>give</span> her a new appointment time."',
	                            options: [
	                                {
	                                    value: "if-reduces",
	                                    label: "IF clause: 'If she calls the clinic' | WILL clause: 'they will give her a new appointment time'",
	                                },
	                                {
	                                    value: "if-go-away",
	                                    label: "IF clause: 'they will give her a new appointment time' | WILL clause: 'If she calls the clinic'",
	                                },
	                                { value: "no-if", label: "Neither clause uses 'if'" },
	                            ],
	                            expectedAnswer: "if-reduces",
	                        },
                        {
                            type: "radio",
                            label: "What verb form goes in the IF clause?",
                            options: [
                                { value: "present-simple", label: "Present simple (exercise, reduces, eat)" },
                                { value: "will-verb", label: "Will + base verb (will exercise, will reduce)" },
                                { value: "past-simple", label: "Past simple (exercised, reduced, ate)" },
                            ],
                            expectedAnswer: "present-simple",
                        },
                    ],
                },
            ],
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
                        <li><strong>If I leave early</strong>, <strong>I will catch the Blue Line</strong>.</li>
                        <li><strong>If you drink more water</strong>, <strong>you'll feel better</strong>.</li>
                        <li><strong>If we pack lunch</strong>, <strong>we'll save money</strong>.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ Use a comma after the IF clause!</p>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>RESULT clause FIRST (no comma):</h4>
                    <p style="font-size: 1.125rem; font-weight: bold;">Subject + will + verb + if + condition</p>
                    <ul>
                        <li><strong>I will catch the Blue Line</strong> <strong>if I leave early</strong>.</li>
                        <li><strong>You'll feel better</strong> <strong>if you drink more water</strong>.</li>
                        <li><strong>We'll save money</strong> <strong>if we pack lunch</strong>.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ NO comma when IF clause is second!</p>
                </div>

                <p style="margin-top: 1.5rem; font-weight: bold;">Both sentences mean exactly the same thing!</p>
            `,
            exercises: [
                {
                    id: "word-order-1",
                    title: "Practice: Word Order and Commas",
                    instructions: "Choose the correct sentence with proper word order and punctuation.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence has IF first with the correct comma?",
                            options: [
                                {
                                    value: "a",
                                    label: "If I <span class='eg-verb'>leave</span> early<span class='eg-punctuation'>,</span> I <span class='eg-helper'>will</span> <span class='eg-verb'>catch</span> the Blue Line<span class='eg-punctuation'>.</span>",
                                },
                                { value: "b", label: "If I leave early I will catch the Blue Line." },
                                { value: "c", label: "If I leave early. I will catch the Blue Line." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence has the result clause first (no comma needed)?",
                            options: [
                                { value: "a", label: "I will catch the Blue Line, if I leave early." },
                                { value: "b", label: "I will catch the Blue Line if I leave early." },
                                { value: "c", label: "I will catch the Blue Line. If I leave early." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Rewrite with IF first: 'You'll feel better if you walk on the Harborwalk.'",
                            options: [
                                { value: "a", label: "If you walk on the Harborwalk, you'll feel better." },
                                { value: "b", label: "If you walk on the Harborwalk you'll feel better." },
                                { value: "c", label: "If you'll walk on the Harborwalk, you feel better." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
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
	                        <li>If I <strong>don't set</strong> an alarm, I will miss the bus.</li>
	                        <li>If she <strong>doesn't sleep</strong> enough, she'll be tired.</li>
	                        <li>If we <strong>don't pack</strong> lunch, we won't save money.</li>
	                    </ul>
	                </div>

	                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
	                    <h4>Negative WILL clause:</h4>
	                    <p style="font-weight: bold;">If + present simple, won't + verb</p>
	                    <ul>
	                        <li>If I take breaks, I <strong>won't</strong> feel so overwhelmed.</li>
	                        <li>If she sleeps enough, she <strong>won't be</strong> tired.</li>
	                        <li>If we eat breakfast, we <strong>won't feel</strong> hungry at 10am.</li>
	                    </ul>
	                </div>

	                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
	                    <h4>Both negative:</h4>
	                    <ul>
	                        <li>If I <strong>don't call</strong> the clinic, my appointment <strong>won't change</strong>.</li>
	                        <li>If you <strong>don't take</strong> breaks, you <strong>won't feel</strong> better.</li>
	                    </ul>
	                </div>
            `,
            exercises: [
                {
                    id: "negatives-1",
                    title: "Practice: Making Negatives",
                    instructions: "Choose the correct negative form for each sentence.",
	                    items: [
	                        {
	                            type: "radio",
	                            label: "Make the IF clause negative: 'If I pack lunch, I will buy snacks.'",
	                            options: [
	                                { value: "a", label: "If I don't pack lunch, I will buy snacks." },
	                                { value: "b", label: "If I won't pack lunch, I will buy snacks." },
	                                { value: "c", label: "If I not pack lunch, I will buy snacks." },
	                            ],
	                            expectedAnswer: "a",
	                        },
	                        {
	                            type: "radio",
	                            label: "Make the WILL clause negative: 'If I pack lunch, I will buy snacks.'",
	                            options: [
	                                { value: "a", label: "If I pack lunch, I won't buy snacks." },
	                                { value: "b", label: "If I pack lunch, I will not buy snacks." },
	                                { value: "c", label: "Both a and b are correct" },
	                            ],
	                            expectedAnswer: "c",
	                        },
	                        {
	                            type: "radio",
	                            label: "Make both clauses negative: 'If I call the clinic, my appointment will change.'",
	                            options: [
	                                { value: "a", label: "If I don't call the clinic, my appointment won't change." },
	                                { value: "b", label: "If I won't call the clinic, my appointment doesn't change." },
	                                { value: "c", label: "If I not call the clinic, my appointment will not change." },
	                            ],
	                            expectedAnswer: "a",
	                        },
	                    ],
	                },
            ],
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
	                        <li>If I walk from Maverick Station to the Harborwalk, <strong>I will get more steps</strong>.</li>
	                        <li>If I take the stairs, <strong>I'll get stronger</strong>.</li>
	                        <li>If I stretch every morning, <strong>my back pain will improve</strong>.</li>
	                        <li>If I don't move much, <strong>I will feel stiff</strong>.</li>
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
	                        <li>If I pack lunch, <strong>I'll save money</strong>.</li>
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
	                content: "Use first conditional to set SMART goals: 'If I walk after class three times a week, I'll sleep better.' Make your conditions specific and measurable!",
	            },
            exercises: [
                {
                    id: "wellness-contexts-1",
                    title: "Practice: Wellness Contexts",
                    instructions: "Match each wellness situation with the best first conditional sentence.",
                    items: [
	                        {
	                            type: "radio",
	                            label: "You want to set a goal about exercise:",
	                            options: [
	                                { value: "a", label: "If I walk on the Harborwalk after class, I will sleep better." },
	                                { value: "b", label: "I walked on the Harborwalk yesterday." },
	                                { value: "c", label: "I walk on the Harborwalk every day." },
	                            ],
	                            expectedAnswer: "a",
	                        },
	                        {
	                            type: "radio",
	                            label: "You want to plan for better sleep:",
	                            options: [
	                                { value: "a", label: "If I sleep 8 hours, I will have more energy." },
	                                { value: "b", label: "I slept 8 hours last night." },
	                                { value: "c", label: "I sleep 8 hours every night." },
	                            ],
	                            expectedAnswer: "a",
	                        },
	                        {
	                            type: "radio",
	                            label: "You want to prevent stress:",
	                            options: [
	                                { value: "a", label: "If I take breaks, I won't feel overwhelmed." },
	                                { value: "b", label: "I took breaks yesterday." },
	                                { value: "c", label: "I take breaks every hour." },
	                            ],
	                            expectedAnswer: "a",
	                        },
                    ],
                },
            ],
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
	                        <li>If I drink water instead of soda, <strong>I may feel less tired</strong>. (less certain than "will")</li>
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
            exercises: [
                {
                    id: "modals-instead-of-will-1",
                    title: "Practice: Other Modals in the Result",
                    instructions: "Choose the best modal or form for the result clause.",
                    items: [
                        {
                            type: "radio",
                            label: "Complete: 'If I manage my time better, I _____ finish my work early.'",
                            options: [
                                { value: "a", label: "can finish (ability/possibility)" },
                                { value: "b", label: "will finish (only 'will' is allowed)" },
                                { value: "c", label: "finish (no modal needed)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Complete: 'If you have chest pain, you _____ see a doctor.'",
                            options: [
                                { value: "a", label: "should see (advice)" },
                                { value: "b", label: "will see (future certainty)" },
                                { value: "c", label: "see (no modal)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Complete: 'If you feel tired, _____ a break.'",
                            options: [
                                { value: "a", label: "take (imperative/command)" },
                                { value: "b", label: "you will take (will + verb)" },
                                { value: "c", label: "you take (present simple)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
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
            exercises: [
                {
                    id: "common-mistakes-1",
                    title: "Practice: Fix Common Mistakes",
                    instructions: "Choose the correct sentence that fixes the common mistake.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'If I will exercise, I will feel better.'",
                            options: [
                                { value: "a", label: "If I exercise, I will feel better." },
                                { value: "b", label: "If I will exercise, I feel better." },
                                { value: "c", label: "If I exercised, I will feel better." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix the comma: 'If I exercise I will feel better.'",
                            options: [
                                { value: "a", label: "If I exercise, I will feel better." },
                                { value: "b", label: "If I exercise I will feel better." },
                                { value: "c", label: "I will feel better if I exercise." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix the result clause: 'If I walk, I feel better.'",
                            options: [
                                { value: "a", label: "If I walk, I will feel better." },
                                { value: "b", label: "If I walked, I feel better." },
                                { value: "c", label: "If I walk, I felt better." },
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
	                            label: "Rewrite: I will catch the Blue Line if I leave early.",
	                            options: [
	                                {
	                                    value: "a",
	                                    label: "If I <span class='eg-verb'>leave</span> early<span class='eg-punctuation'>,</span> I <span class='eg-helper'>will</span> <span class='eg-verb'>catch</span> the Blue Line<span class='eg-punctuation'>.</span>",
	                                },
	                                { value: "b", label: "If I leave early I will catch the Blue Line." },
	                                { value: "c", label: "If I will leave early, I will catch the Blue Line." },
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
	                    <li><strong>IF first:</strong> If I leave early<strong>,</strong> I will catch the Blue Line. (use comma!)</li>
	                    <li><strong>WILL first:</strong> I will catch the Blue Line if I leave early. (no comma!)</li>
	                </ul>

	                <h3>Common Uses</h3>
	                <ul>
	                    <li><strong>Future possibilities:</strong> "If I leave early, I'll catch the Blue Line."</li>
	                    <li><strong>Cause & effect:</strong> "If I sleep 8 hours, I'll have more energy."</li>
	                    <li><strong>Warnings:</strong> "If you don't rest, you'll get sick."</li>
	                    <li><strong>Promises:</strong> "If I finish early, I'll help you."</li>
	                </ul>

	                <h3>Negative Forms</h3>
	                <ul>
	                    <li><strong>Negative IF:</strong> If I <strong>don't</strong> set an alarm, I will miss the bus.</li>
	                    <li><strong>Negative WILL:</strong> If I take breaks, I <strong>won't</strong> feel so overwhelmed.</li>
	                </ul>

	                <h3>Other Modals (Instead of Will)</h3>
	                <ul>
	                    <li><strong>Can:</strong> If I manage my time, I <strong>can</strong> finish early.</li>
	                    <li><strong>May/Might:</strong> If I drink water, I <strong>may</strong> feel better.</li>
	                    <li><strong>Should:</strong> If you have pain, you <strong>should</strong> call the doctor.</li>
	                    <li><strong>Imperative:</strong> If you feel tired, <strong>take a break</strong>.</li>
	                </ul>
            `,
            tipBox: {
                title: "⚠️ Critical Rule",
                content: "NEVER use 'will' in the IF clause! Use present simple: 'If I exercise' (NOT 'If I will exercise').",
            },
            exercises: [
                {
                    id: "future-conditional-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for first conditional?",
                            options: [
                                { value: "a", label: "If + present simple, will + base verb" },
                                { value: "b", label: "If + will + base verb, present simple" },
                                { value: "c", label: "If + past simple, would + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "If I exercise, I will feel better." },
                                { value: "b", label: "If I will exercise, I will feel better." },
                                { value: "c", label: "If I exercise, I feel better." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Where should the comma go when IF comes first?",
                            options: [
                                { value: "a", label: "After the IF clause: 'If I exercise, I will feel better.'" },
                                { value: "b", label: "No comma needed" },
                                { value: "c", label: "After 'will'" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What does first conditional express?",
                            options: [
                                { value: "a", label: "Real future possibilities and their likely results" },
                                { value: "b", label: "Impossible situations" },
                                { value: "c", label: "Past regrets" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Can you use modals other than 'will' in the result clause?",
                            options: [
                                { value: "a", label: "Yes, you can use can, may, might, should, or imperatives" },
                                { value: "b", label: "No, only 'will' is allowed" },
                                { value: "c", label: "Only in negative sentences" },
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
	            question: "Which is correct?",
	            options: [
	                { value: "a", label: "If I will leave early, I will catch the Blue Line." },
	                { value: "b", label: "If I leave early, I will catch the Blue Line." },
	                { value: "c", label: "If I leave early, I catch the Blue Line." },
	            ],
	            correctAnswer: "b",
	            explanation: "Use present simple in the IF clause (leave), not 'will'. The formula is: If + present, will + verb.",
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
	            question: "Where should the comma go? 'If I leave early I will catch the Blue Line.'",
	            options: [
	                { value: "a", label: "No comma needed" },
	                { value: "b", label: "After 'early'" },
	                { value: "c", label: "After 'leave'" },
	            ],
	            correctAnswer: "b",
	            explanation: "When the IF clause comes first, use a comma after it: 'If I leave early, I will catch the Blue Line.'",
	        },
	        {
	            id: "quiz-4",
	            question: "Which is the correct negative IF clause?",
	            options: [
	                { value: "a", label: "If I don't pack lunch, I will buy snacks." },
	                { value: "b", label: "If I won't pack lunch, I will buy snacks." },
	                { value: "c", label: "If I not pack lunch, I will buy snacks." },
	            ],
	            correctAnswer: "a",
	            explanation: "Negative IF clause uses 'don't/doesn't + verb': 'If I don't pack lunch...'",
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
	        {
	            id: "quiz-7",
	            question: "Which sentence is correct (IF clause second = no comma)?",
	            options: [
	                { value: "a", label: "I will call the clinic, if I need to reschedule." },
	                { value: "b", label: "I will call the clinic if I need to reschedule." },
	                { value: "c", label: "I will call the clinic. if I need to reschedule." },
	            ],
	            correctAnswer: "b",
	            explanation: "No comma when the IF clause comes second: result + if + condition.",
	        },
	        {
	            id: "quiz-8",
	            question: "Complete: If I manage my time better, I _____ finish early.",
	            options: [
	                { value: "a", label: "can" },
	                { value: "b", label: "will" },
	                { value: "c", label: "did" },
	            ],
	            correctAnswer: "a",
	            explanation: "Use 'can' in the result clause to talk about ability/possibility.",
	        },
	        {
	            id: "quiz-9",
	            question: "Complete: If I drink water instead of soda, I _____ feel better.",
	            options: [
	                { value: "a", label: "might" },
	                { value: "b", label: "will" },
	                { value: "c", label: "am" },
	            ],
	            correctAnswer: "a",
	            explanation: "Use may/might when you are less certain about the result.",
	        },
	        {
	            id: "quiz-10",
	            question: "Complete: If you have chest pain, you _____ see a doctor.",
	            options: [
	                { value: "a", label: "should" },
	                { value: "b", label: "will" },
	                { value: "c", label: "are" },
	            ],
	            correctAnswer: "a",
	            explanation: "Use 'should' for advice in the result clause.",
	        },
	        {
	            id: "quiz-11",
	            question: "Complete: If you feel dizzy, _____ down.",
	            options: [
	                { value: "a", label: "sit" },
	                { value: "b", label: "you will sit" },
	                { value: "c", label: "sitting" },
	            ],
	            correctAnswer: "a",
	            explanation: "An imperative (command/suggestion) can be the result clause: 'If..., sit down.'",
	        },
	        {
	            id: "quiz-12",
	            question: "Complete: If it rains, I _____ an umbrella.",
	            options: [
	                { value: "a", label: "bring" },
	                { value: "b", label: "will bring" },
	                { value: "c", label: "brought" },
	            ],
	            correctAnswer: "b",
	            explanation: "Use 'will + base verb' in the result clause: will bring.",
	        },
	        {
	            id: "quiz-13",
	            question: "Fix the mistake: 'If I will call the clinic, they will reschedule my appointment.'",
	            options: [
	                { value: "a", label: "If I call the clinic, they will reschedule my appointment." },
	                { value: "b", label: "If I will call the clinic, they reschedule my appointment." },
	                { value: "c", label: "If I called the clinic, they will reschedule my appointment." },
	            ],
	            correctAnswer: "a",
	            explanation: "Don't use 'will' in the IF clause. Use present simple: If I call...",
	        },
	        {
	            id: "quiz-14",
	            question: "Which sentence uses first conditional (future plan), not past simple or present simple?",
	            options: [
	                { value: "a", label: "If I walk on the Harborwalk after class, I will sleep better." },
	                { value: "b", label: "I walked on the Harborwalk after class yesterday." },
	                { value: "c", label: "I walk on the Harborwalk after class every day." },
	            ],
	            correctAnswer: "a",
	            explanation: "First conditional uses IF + present simple and a future result (will).",
	        },
	        {
	            id: "quiz-15",
	            question: "Which result is correct?",
	            options: [
	                { value: "a", label: "If I take breaks, I don't feel so overwhelmed." },
	                { value: "b", label: "If I take breaks, I won't feel so overwhelmed." },
	                { value: "c", label: "If I took breaks, I won't feel so overwhelmed." },
	            ],
	            correctAnswer: "b",
	            explanation: "Use 'will/won't' in the result clause for future possibilities: If I take breaks, I won't feel so overwhelmed.",
	        },
	    ],
};
