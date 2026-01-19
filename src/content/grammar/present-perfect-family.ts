import type {
    InteractiveGuideContent,
    InteractiveGuideSection,
    MiniQuizQuestion,
} from "@/types/activity";

export const presentPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // -------------------------------------------------------------------------
        // 1. Introduction: The Two Sides of the Same Coin
        // -------------------------------------------------------------------------
        {
            id: "family-intro",
            title: "The Present Perfect Family",
            icon: "👨‍👩‍👧‍👦",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(255, 165, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; border-left: 5px solid #6366f1;">
                    <h3 style="margin-top: 0; color: #6366f1; font-size: 1.4rem;">Connecting Past & Present</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6;">
                        The <strong>Present Perfect Family</strong> tells the story of how the past affects the present.
                        They are like two siblings with different personalities:
                    </p>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 250px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #c86b51; margin-top: 0;">1. The Finisher (Simple)</h4>
                            <p style="font-size: 0.95rem; color: #4b5563;">"I <strong>have finished</strong> my work."</p>
                            <span style="display: inline-block; background: #fff7ed; color: #c2410c; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: 600;">Focus: RESULT / COMPLETION</span>
                        </div>
                        <div style="flex: 1; min-width: 250px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #6366f1; margin-top: 0;">2. The Worker (Continuous)</h4>
                            <p style="font-size: 0.95rem; color: #4b5563;">"I <strong>have been working</strong> all day."</p>
                            <span style="display: inline-block; background: #eef2ff; color: #4338ca; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: 600;">Focus: DURATION / ACTIVITY</span>
                        </div>
                    </div>
                </div>
                <p>We use them together all the time! Let's learn to mix and match them naturally.</p>
            `,
        },

        // -------------------------------------------------------------------------
        // 2. The Simple Side (Result - Positive)
        // -------------------------------------------------------------------------
        {
            id: "focus-result",
            title: "Focus on Result (Simple)",
            icon: "✅",
            stepNumber: 1,
            explanation: `
                <h3>When "Done" Matters</h3>
                <p>Use <strong>Present Perfect Simple</strong> (have + <strong>past participle</strong>) when the most important thing is that the action is <strong>FINISHED</strong> or when you can <strong>COUNT</strong> how many times it happened.</p>
                
                <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                     <h4 style="text-align: center; margin-top: 0; color: #d97706;">Timeline: The Completed Action</h4>
                     <div style="display: flex; align-items: center; justify-content: space-between; position: relative; margin: 2rem 0; padding: 0 1rem;">
                        <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 4px; background: #e5e7eb; transform: translateY(-50%); z-index: 0;"></div>
                        
                        <!-- Past point -->
                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #f59e0b; margin: 0 auto;"></div>
                            <div style="margin-top: 0.5rem; font-size: 0.8rem; font-weight: 600; color: #d97706;">Action Done</div>
                        </div>

                         <!-- Arrow connecting -->
                        <div style="position: absolute; top: 50%; left: 20%; right: 20%; height: 0; border-top: 2px dashed #f59e0b; transform: translateY(-50%); z-index: 0;"></div>

                        <!-- Present Result -->
                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="background: #fffbeb; border: 2px solid #f59e0b; color: #b45309; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: bold; font-size: 0.9rem;">
                                NOW: Result
                            </div>
                        </div>
                     </div>
                     <p style="text-align: center; margin: 0;">"I <strong>have eaten</strong> lunch." → <span style="color: #64748b;">(Result: I am not hungry now.)</span></p>
                     <p style="text-align: center; margin-top: 0.5rem;">"She <strong>has written</strong> 5 emails." → <span style="color: #64748b;">(Result: 5 completed items.)</span></p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-simple-focus",
                    title: "Check: Is it a Result?",
                    instructions: "Choose the sentence that focuses on a COMPLETED result.",
                    items: [
                        {
                            type: "radio",
                            label: "Kitchen Situation",
                            options: [
                                { value: "simple", label: "I have cleaned the kitchen. (It is clean now!)" },
                                { value: "continuous", label: "I have been cleaning the kitchen. (I'm tired/still working)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "Reading Books",
                            options: [
                                { value: "simple", label: "I have read 3 books this month. (Count: 3)" },
                                { value: "continuous", label: "I have been reading all month. (Activity)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "The empty plate",
                            options: [
                                { value: "simple", label: "I have eaten my sandwich." },
                                { value: "continuous", label: "I have been eating my sandwich." },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 3. The Continuous Side (Duration - Positive)
        // -------------------------------------------------------------------------
        {
            id: "focus-duration",
            title: "Focus on Duration (Continuous)",
            icon: "⏱️",
            stepNumber: 2,
            explanation: `
                <h3>When "Time" Matters</h3>
                <p>Use <strong>Present Perfect Continuous</strong> (have + <strong>been</strong> + <strong>-ing</strong>) when you want to show <strong>how long</strong> something has been happening, or emphasizing the <strong>activity</strong> itself (even if it's finished!).</p>

                <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #4338ca;">Timeline: The Ongoing Duration</h4>
                    <div style="position: relative; margin: 2rem auto; max-width: 500px; padding: 1rem 0;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 40px; background: linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.9)); border-radius: 25px; border: 2px solid #6366f1; display: flex; align-items: center; padding: 0 1.5rem;">
                            <!-- Start dot -->
                            <div style="position: absolute; left: 0; top: 50%; width: 12px; height: 12px; background: #6366f1; border-radius: 50%; transform: translate(-6px, -50%); border: 2px solid white;"></div>
                            
                            <!-- Middle text -->
                            <span style="color: #312e81; font-weight: 600; font-size: 0.85rem; margin-left: 10px;">...working...working...</span>

                            <!-- NOW dot (pulsing) -->
                            <div style="position: absolute; right: 0; top: 50%; width: 16px; height: 16px; background: #f0b45a; border-radius: 50%; transform: translate(8px, -50%); border: 3px solid white; box-shadow: 0 0 0 4px rgba(240, 180, 90, 0.3);"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;">
                            <span>Started in Past</span>
                            <span>NOW</span>
                        </div>
                    </div>
                    <p style="text-align: center; margin: 0;">"I <strong>have been waiting</strong> for 20 minutes."</p>
                    <p style="text-align: center; margin-top: 0.5rem; font-size: 0.9em; color: #666;">(Focus is on the 20 minutes of waiting time)</p>
                </div>
            `,
            exercises: [
                 {
                    id: "ex-continuous-focus",
                    title: "Check: Is it Duration?",
                    instructions: "Choose the sentence that focuses on TIME or the ACTIVITY itself.",
                    items: [
                        {
                            type: "radio",
                            label: "Waiting for the bus",
                            options: [
                                { value: "simple", label: "I have waited. (Done)" },
                                { value: "continuous", label: "I have been waiting for an hour! (Stress on time)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "Dirty Hands",
                            options: [
                                { value: "simple", label: "I have repaired the car." },
                                { value: "continuous", label: "I have been repairing the car. (That's why hands are dirty)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "Out of breath",
                            options: [
                                { value: "simple", label: "I have run." },
                                { value: "continuous", label: "I have been running around all morning." },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
            ]
        },

        // -------------------------------------------------------------------------
        // 4. NEGATIVES: The "Not" Logic
        // -------------------------------------------------------------------------
        {
            id: "family-negatives",
            title: "Negatives: 'Haven't' vs 'Haven't Been'",
            icon: "🚫",
            stepNumber: 3,
            explanation: `
                <h3>How to say "No"</h3>
                <p>The negative forms also have slightly different meanings.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                    <!-- Simple Negative -->
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f97316;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #c2410c;">Simple Negative</h4>
                        <div style="font-weight: bold; margin-bottom: 0.5rem;">have NOT + Past Participle</div>
                        <p style="font-style: italic; color: #4b5563;">"I <strong>haven't finished</strong> yet."</p>
                        <ul style="font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 0;">
                            <li>It is incomplete.</li>
                            <li>The count is zero.</li>
                            <li>"I haven't seen that movie."</li>
                        </ul>
                    </div>

                    <!-- Continuous Negative -->
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #4338ca;">Continuous Negative</h4>
                        <div style="font-weight: bold; margin-bottom: 0.5rem;">have NOT + BEEN + -ING</div>
                        <p style="font-style: italic; color: #4b5563;">"I <strong>haven't been sleeping</strong> well."</p>
                        <ul style="font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 0;">
                            <li>The activity has been absent lately.</li>
                            <li>"I haven't been practicing enough."</li>
                        </ul>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-negatives-mix",
                    title: "Negative Practice",
                    instructions: "Fill in the blank with the correct negative form.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (not / finish) my homework yet. Can I go out later?",
                            expectedAnswer: "haven't finished",
                            placeholder: "haven't finished"
                        },
                        {
                            type: "text",
                            label: "She looks tired. She ___ (not / sleep) well lately.",
                            expectedAnswer: "hasn't been sleeping",
                            placeholder: "hasn't been sleeping"
                        },
                        {
                            type: "text",
                            label: "We ___ (not / decide) where to go on vacation yet.",
                            expectedAnswer: "haven't decided",
                            placeholder: "haven't decided"
                        },
                        {
                            type: "text",
                            label: "You ___ (not / practice) the piano enough this week!",
                            expectedAnswer: "haven't been practicing",
                            placeholder: "haven't been practicing"
                        }
                    ]
                }
            ]
        },

        // -------------------------------------------------------------------------
        // 5. QUESTIONS: The Investigation
        // -------------------------------------------------------------------------
        {
            id: "family-questions",
            title: "Questions: 'How Much' vs 'How Long'",
            icon: "❓",
            stepNumber: 4,
            explanation: `
                <h3>Asking the Right Question</h3>
                <p>The question you ask depends on what answer you want.</p>

                <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                        <th style="padding: 0.5rem; color: #4b5563;">If you want to know...</th>
                        <th style="padding: 0.5rem; color: #4b5563;">Use...</th>
                        <th style="padding: 0.5rem; color: #4b5563;">Question Word</th>
                    </tr>
                    <tr style="background-color: #fff7ed;">
                        <td style="padding: 0.75rem; font-weight: 500;">If it is DONE</td>
                        <td style="padding: 0.75rem;">Simple</td>
                        <td style="padding: 0.75rem; color: #c2410c; font-weight: bold;">Have you finished...?</td>
                    </tr>
                    <tr style="background-color: #eef2ff;">
                        <td style="padding: 0.75rem; font-weight: 500;">The DURATION</td>
                        <td style="padding: 0.75rem;">Continuous</td>
                        <td style="padding: 0.75rem; color: #4338ca; font-weight: bold;">How long...?</td>
                    </tr>
                    <tr style="background-color: #fff7ed;">
                        <td style="padding: 0.75rem; font-weight: 500;">The QUANTITY</td>
                        <td style="padding: 0.75rem;">Simple</td>
                        <td style="padding: 0.75rem; color: #c2410c; font-weight: bold;">How many...?</td>
                    </tr>
                </table>
            `,
             exercises: [
                {
                    id: "ex-questions-match",
                    title: "Match the Question to the Logic",
                    instructions: "Which question form is best?",
                    items: [
                        {
                            type: "radio",
                            label: "You see your friend sweating in gym clothes.",
                            options: [
                                { value: "continuous", label: "Have you been exercising? (Focus on recent activity)" },
                                { value: "simple", label: "Have you exercised? (Focus on result)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "You want to know quantity.",
                            options: [
                                { value: "simple", label: "How many pages have you written?" },
                                { value: "continuous", label: "How many pages have you been writing?" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "You are waiting for someone.",
                            options: [
                                { value: "continuous", label: "How long have you been waiting?" },
                                { value: "simple", label: "How long have you waited?" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ]
                }
            ]
        },

        // -------------------------------------------------------------------------
        // 6. Side-by-Side Comparison
        // -------------------------------------------------------------------------
        {
            id: "family-comparison",
            title: "Comparison: Result vs Duration",
            stepNumber: 5,
            icon: "⚖️",
            explanation: `
                <h3>The Final Summary</h3>
                <p>The hardest part is choosing. Ask yourself: <strong>"Do I care about the result (count) or the time (activity)?"</strong></p>
            `,
            comparison: {
                title: "Present Perfect Simple vs Continuous",
                leftLabel: "Simple (Result)",
                rightLabel: "Continuous (Activity)",
                rows: [
                    {
                        label: "Core Meaning",
                        left: "Completion (It is finished)",
                        right: "Process (It might not be finished)",
                    },
                    {
                        label: "Key Question",
                        left: "<strong>How many?</strong> (Quantity)",
                        right: "<strong>How long?</strong> (Duration)",
                    },
                    {
                        label: "Evidence",
                        left: "The finished product is ready.",
                        right: "Side effects (sweat, dirt, tiredness).",
                    },
                    {
                        label: "Example",
                        left: "I have written <strong>10 emails</strong>.",
                        right: "I have been writing emails <strong>for 2 hours</strong>.",
                    }
                ],
            },
            tipBox: {
                title: "💡 State Verbs Exception",
                content: "Remember: Verbs like 'know', 'like', 'believe', 'have (possession)' usually stay SIMPLE, even for duration! <br><br>Correct: 'I have known him for 10 years.'<br>Incorrect: 'I have been knowing him...'"
            },
        },

        // -------------------------------------------------------------------------
        // 7. Structure Practice
        // -------------------------------------------------------------------------
        {
            id: "structure-review",
            title: "Structure Check",
            icon: "🏗️",
            stepNumber: 6,
            explanation: `
                 <p>Let's make sure you can build these sentences perfectly.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f97316;">
                        <h4 style="margin: 0; color: #c2410c; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">Simple</h4>
                        <div style="margin-bottom: 0.5rem;"><strong>+</strong> have + <span style="color: #c2410c;">past participle</span></div>
                        <div style="margin-bottom: 0.5rem;"><strong>-</strong> haven't + <span style="color: #c2410c;">past participle</span></div>
                        <div><strong>?</strong> Have you + <span style="color: #c2410c;">past participle</span>?</div>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #6366f1;">
                        <h4 style="margin: 0; color: #4338ca; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">Continuous</h4>
                        <div style="margin-bottom: 0.5rem;"><strong>+</strong> have <span style="color: #6366f1;">been</span> + <span style="color: #6366f1;">-ing</span></div>
                        <div style="margin-bottom: 0.5rem;"><strong>-</strong> haven't <span style="color: #6366f1;">been</span> + <span style="color: #6366f1;">-ing</span></div>
                        <div><strong>?</strong> Have you <span style="color: #6366f1;">been</span> + <span style="color: #6366f1;">-ing</span>?</div>
                    </div>
                </div>
            `,
            exercises: [
                 {
                    id: "ex-structure-mix",
                    title: "Build the Sentences",
                    instructions: "Fill in the missing parts based on the clues.",
                    items: [
                        {
                            type: "text",
                            label: "Simple: She ___ (write) three letters.",
                            expectedAnswer: "has written",
                            placeholder: "has written"
                        },
                        {
                            type: "text",
                            label: "Continuous: They ___ (play) soccer for 2 hours.",
                            expectedAnswer: "have been playing",
                            placeholder: "have been playing"
                        },
                        {
                            type: "text",
                            label: "Question: How long ___ you ___ (wait)?",
                            expectedAnswer: "have you been waiting",
                            placeholder: "have you been waiting"
                        },
                         {
                            type: "text",
                            label: "Negative: I ___ (not / see) him today.",
                            expectedAnswer: "haven't seen",
                            placeholder: "haven't seen"
                        },
                    ],
                },
            ]
        },

        // -------------------------------------------------------------------------
        // 8. Mixed Practice
        // -------------------------------------------------------------------------
        {
            id: "family-mixed",
            title: "Mixed Practice: Real Life",
            icon: "🧠",
            stepNumber: 7,
            explanation: "<p>In real conversation, we switch back and forth. Use the clues (how many, how long, evidence) to decide!</p>",
            exercises: [
                {
                    title: "Select the Right Form",
                    items: [
                        {
                            type: "radio",
                            label: "You have paint on your shirt! ___ you ___ the bedroom?",
                            options: [
                                { value: "simple", label: "Have / painted" },
                                { value: "continuous", label: "Have / been painting" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "The bedroom looks great. I ___ it.",
                            options: [
                                { value: "simple", label: "have painted" },
                                { value: "continuous", label: "have been painting" },
                            ],
                            expectedAnswer: "simple",
                        },
                         {
                            type: "radio",
                            label: "I ___ this movie three times.",
                            options: [
                                { value: "simple", label: "have seen" },
                                { value: "continuous", label: "have been seeing" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "Sorry I'm late! ___ you ___ long?",
                            options: [
                                { value: "simple", label: "Have / waited" },
                                { value: "continuous", label: "Have / been waiting" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "I ___ to Paris twice in my life.",
                            options: [
                                { value: "simple", label: "have been" },
                                { value: "continuous", label: "have been being" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        // Concepts & Usage (1-5)
        {
            id: "fq-1",
            question: "Why do we use Present Perfect Continuous here: 'I have been cooking all morning.'",
            options: [
                { value: "a", label: "To show the kitchen is messy." },
                { value: "b", label: "To emphasize the duration (how long)." },
                { value: "c", label: "To show the food is ready." },
            ],
            correctAnswer: "b",
            explanation: "Focus on 'all morning' (duration) takes Continuous.",
        },
        {
            id: "fq-2",
            question: "Why do we use Present Perfect Simple here: 'I have answered 20 emails.'",
            options: [
                { value: "a", label: "To emphasize the quantity/result." },
                { value: "b", label: "To show I am tired." },
                { value: "c", label: "To show it took a long time." },
            ],
            correctAnswer: "a",
            explanation: "Focus on the number/result (20 emails) takes Simple.",
        },
        {
            id: "fq-3",
            question: "Which question asks about DURATION?",
            options: [
                { value: "a", label: "How much have you done?" },
                { value: "b", label: "How long have you been doing it?" },
                { value: "c", label: "What have you done?" },
            ],
            correctAnswer: "b",
            explanation: "'How long' is the key question word for duration/continuous forms.",
        },
        {
            id: "fq-4",
            question: "Which form suggests the action might NOT be finished?",
            options: [
                { value: "a", label: "Present Perfect Simple" },
                { value: "b", label: "Present Perfect Continuous" },
            ],
            correctAnswer: "b",
            explanation: "Continuous suggests the activity is ongoing or just stopped, but the task might not be complete.",
        },
        {
            id: "fq-5",
            question: "What is the rule for State Verbs (like 'know', 'believe')?",
            options: [
                { value: "a", label: "Always use Continuous" },
                { value: "b", label: "Always use Simple" },
                { value: "c", label: "Use both equally" },
            ],
            correctAnswer: "b",
            explanation: "State verbs describe a state, not an action, so they take Simple forms (I have known, not I have been knowing).",
        },

        // Sentence Completion (6-10)
        {
            id: "fq-6",
            question: "Choose the correct form: 'I ___ three cups of coffee today.'",
            options: [
                { value: "a", label: "have been drinking" },
                { value: "b", label: "have drunk" },
            ],
            correctAnswer: "b",
            explanation: "Quantity (three cups) = Simple.",
        },
        {
            id: "fq-7",
            question: "Choose the correct form: 'Look at the ground! It ___.'",
            options: [
                { value: "a", label: "has rained" },
                { value: "b", label: "has been raining" },
            ],
            correctAnswer: "b",
            explanation: "Evidence of recent activity (wet ground, but maybe stopped raining now) = Continuous.",
        },
        {
            id: "fq-8",
            question: "Choose the correct form: 'I ___ for you for 45 minutes!'",
            options: [
                { value: "a", label: "have waited" },
                { value: "b", label: "have been waiting" },
            ],
            correctAnswer: "b",
            explanation: "Emphasis on duration (45 minutes) = Continuous.",
        },
        {
            id: "fq-9",
            question: "Choose the correct form: 'She ___ her keys. She can't open the door.'",
            options: [
                { value: "a", label: "has lost" },
                { value: "b", label: "has been losing" },
            ],
            correctAnswer: "a",
            explanation: "Result (lost keys = locked out) = Simple.",
        },
        {
            id: "fq-10",
            question: "Choose the correct form: 'We ___ each other since childhood.'",
            options: [
                { value: "a", label: "have been knowing" },
                { value: "b", label: "have known" },
            ],
            correctAnswer: "b",
            explanation: "State verb 'know' = Simple.",
        },

        // Forms and Negatives (11-15)
        {
            id: "fq-11",
            question: "Is this correct? ' I haven't been finishing my lunch yet.'",
            options: [
                { value: "a", label: "Yes" },
                { value: "b", label: "No" },
            ],
            correctAnswer: "b",
            explanation: "No. 'Finish' is a completion event. We say 'I haven't finished' (Simple).",
        },
        {
            id: "fq-12",
            question: "Which negative emphasizes 'lack of recent activity'?",
            options: [
                { value: "a", label: "I haven't practiced." },
                { value: "b", label: "I haven't been practicing." },
            ],
            correctAnswer: "b",
            explanation: "Continuous negative ('haven't been practicing') emphasizes how you've been spending your time lately.",
        },
        {
            id: "fq-13",
            question: "Make it a question: 'You / cry / ?' (Evidence: red eyes)",
            options: [
                { value: "a", label: "Have you cried?" },
                { value: "b", label: "Have you been crying?" },
            ],
            correctAnswer: "b",
            explanation: "Evidence of recent activity (red eyes) = Continuous question.",
        },
         {
            id: "fq-14",
            question: "Make it a question: 'How many times / you / visit / New York / ?'",
            options: [
                { value: "a", label: "How many times have you visited New York?" },
                { value: "b", label: "How many times have you been visiting New York?" },
            ],
            correctAnswer: "a",
            explanation: "Frequency/Quantity (how many times) = Simple question.",
        },
        {
            id: "fq-15",
            question: "Choose the best summary of the Difference:",
            options: [
                { value: "a", label: "Simple is for the past, Continuous is for the present." },
                { value: "b", label: "Simple is for Completed Result/Count; Continuous is for Activity Duration." },
                { value: "c", label: "There is no difference." },
            ],
            correctAnswer: "b",
            explanation: "This is the core rule of the Present Perfect Family.",
        },
    ]
};
