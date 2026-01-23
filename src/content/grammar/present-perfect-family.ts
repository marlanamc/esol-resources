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

                <h3>Why Do We Need Two Forms?</h3>
                <p>Think about this situation: You've been cooking dinner. Your friend asks about it. You could answer two different ways:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f97316;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #c2410c;">Simple Answer:</p>
                        <p style="margin: 0; font-size: 1.1rem;">"I <strong>have made</strong> pasta."</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280;">→ The pasta is ready! (Result)</p>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #4338ca;">Continuous Answer:</p>
                        <p style="margin: 0; font-size: 1.1rem;">"I <strong>have been cooking</strong> for an hour."</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280;">→ That explains why you're tired! (Activity)</p>
                    </div>
                </div>

                <h3>The Key Question to Ask Yourself</h3>
                <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 1.25rem; margin: 1rem 0;">
                    <p style="margin: 0; font-size: 1.15rem; text-align: center;">
                        <strong>"Do I want to talk about the RESULT or the ACTIVITY?"</strong>
                    </p>
                </div>

                <h3>More Examples to Understand the Difference</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #e2e8f0;">Situation</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; color: #c2410c;">Simple (Result)</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #6366f1; color: #4338ca;">Continuous (Activity)</th>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">Cleaning the house</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have cleaned</strong> the kitchen."<br><span style="font-size: 0.8rem; color: #6b7280;">→ The kitchen is clean now!</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have been cleaning</strong> all morning."<br><span style="font-size: 0.8rem; color: #6b7280;">→ That's why I'm exhausted!</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">Writing emails</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have written</strong> 5 emails."<br><span style="font-size: 0.8rem; color: #6b7280;">→ 5 emails are done!</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have been writing</strong> emails for 2 hours."<br><span style="font-size: 0.8rem; color: #6b7280;">→ I've spent 2 hours on this!</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">Learning English</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have learned</strong> 500 new words."<br><span style="font-size: 0.8rem; color: #6b7280;">→ Look at my vocabulary!</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have been learning</strong> English for 2 years."<br><span style="font-size: 0.8rem; color: #6b7280;">→ It's been a long journey!</span></td>
                    </tr>
                </table>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">💡 Real-Life Tip:</p>
                    <p style="margin: 0.5rem 0 0 0;">Native speakers often use BOTH forms in the same conversation! For example: "I <strong>have been working</strong> on this project for 3 weeks, and I <strong>have completed</strong> 80% of it."</p>
                </div>

                <p style="margin-top: 1.5rem;">We use them together all the time! Let's learn to mix and match them naturally.</p>
            `,
            exercises: [
                {
                    id: "intro-understanding",
                    title: "Check Your Understanding",
                    instructions: "Based on what you just learned, choose the best answer.",
                    items: [
                        {
                            type: "radio",
                            label: "What does the SIMPLE form focus on?",
                            options: [
                                { value: "result", label: "The result or completion" },
                                { value: "duration", label: "How long something took" },
                            ],
                            expectedAnswer: "result",
                        },
                        {
                            type: "radio",
                            label: "What does the CONTINUOUS form focus on?",
                            options: [
                                { value: "result", label: "The finished product" },
                                { value: "duration", label: "The activity or duration" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: "'I have read 3 books this month.' - This emphasizes:",
                            options: [
                                { value: "simple", label: "The number/result (Simple)" },
                                { value: "continuous", label: "The time spent (Continuous)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "'I have been reading all afternoon.' - This emphasizes:",
                            options: [
                                { value: "simple", label: "How many books (Simple)" },
                                { value: "continuous", label: "The duration/activity (Continuous)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
                {
                    id: "intro-matching",
                    title: "Match the Situation",
                    instructions: "Which form would you use in each situation?",
                    items: [
                        {
                            type: "radio",
                            label: "Your hands are dirty. Someone asks why.",
                            options: [
                                { value: "continuous", label: "I have been gardening. (Shows activity)" },
                                { value: "simple", label: "I have gardened. (Shows result)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "You want to show your friend the 10 photos you took.",
                            options: [
                                { value: "simple", label: "I have taken 10 photos! (Shows count)" },
                                { value: "continuous", label: "I have been taking photos. (Shows activity)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "You're sweating because you exercised.",
                            options: [
                                { value: "continuous", label: "I have been exercising. (Explains your condition)" },
                                { value: "simple", label: "I have exercised. (Just states completion)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "You finished all your homework and want to tell your parent.",
                            options: [
                                { value: "simple", label: "I have finished my homework! (Result is ready)" },
                                { value: "continuous", label: "I have been finishing my homework. (Incorrect)" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 2. Side-by-Side Timeline Comparison
        // -------------------------------------------------------------------------
        {
            id: "timeline-comparison",
            title: "Visual Comparison: Two Timelines",
            icon: "⏱️",
            explanation: `
                <h3>See the Difference</h3>
                <p>Both forms connect past to present, but they show different things:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <!-- Simple Timeline -->
                    <div style="background: white; border: 2px solid #f97316; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #c2410c;">Simple: The Result</h4>
                        <div style="position: relative; height: 60px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 3px; background: #e5e7eb; transform: translateY(-50%);"></div>
                            <!-- Action point -->
                            <div style="position: absolute; left: 25%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 16px; height: 16px; background: #f97316; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px #f97316;"></div>
                                <div style="position: absolute; top: 22px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #f97316; font-weight: 600;">Action</div>
                            </div>
                            <!-- Arrow to result -->
                            <div style="position: absolute; top: 50%; left: 30%; right: 25%; height: 0; border-top: 2px dashed #f97316; transform: translateY(-50%);"></div>
                            <!-- Result at NOW -->
                            <div style="position: absolute; right: 10%; top: 50%; transform: translate(0, -50%);">
                                <div style="background: #fff7ed; border: 2px solid #f97316; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; color: #c2410c;">NOW: ✓</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #4b5563;">"I <strong>have finished</strong>."</p>
                        <p style="text-align: center; margin: 0; font-size: 0.8rem; color: #9ca3af;">Focus: The result is here now.</p>
                    </div>

                    <!-- Continuous Timeline -->
                    <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #4338ca;">Continuous: The Duration</h4>
                        <div style="position: relative; height: 60px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 3px; background: #e5e7eb; transform: translateY(-50%);"></div>
                            <!-- Duration bar -->
                            <div style="position: absolute; top: 50%; left: 20%; right: 15%; height: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.8)); border-radius: 10px; transform: translateY(-50%); border: 2px solid #6366f1;"></div>
                            <!-- Start dot -->
                            <div style="position: absolute; left: 20%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 10px; height: 10px; background: #6366f1; border-radius: 50%;"></div>
                                <div style="position: absolute; top: 22px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #6366f1; font-weight: 600;">Start</div>
                            </div>
                            <!-- NOW dot -->
                            <div style="position: absolute; right: 10%; top: 50%; transform: translate(0, -50%);">
                                <div style="background: #eef2ff; border: 2px solid #6366f1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; color: #4338ca;">NOW</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #4b5563;">"I <strong>have been working</strong>."</p>
                        <p style="text-align: center; margin: 0; font-size: 0.8rem; color: #9ca3af;">Focus: The duration up to now.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-timeline-concept",
                    title: "Which Timeline?",
                    instructions: "Match each sentence to the correct timeline focus.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I have written 5 emails.\" - What's the focus?",
                            options: [
                                { value: "result", label: "Result: 5 completed emails" },
                                { value: "duration", label: "Duration: time spent emailing" },
                            ],
                            expectedAnswer: "result",
                        },
                        {
                            type: "radio",
                            label: "\"I have been writing emails all morning.\" - What's the focus?",
                            options: [
                                { value: "result", label: "Result: emails are done" },
                                { value: "duration", label: "Duration: the time spent" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: "\"She has lost her keys.\" - What's the focus?",
                            options: [
                                { value: "result", label: "Result: keys are gone now" },
                                { value: "duration", label: "Duration: how long she's been looking" },
                            ],
                            expectedAnswer: "result",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 3. The Simple Side (Result - Positive)
        // -------------------------------------------------------------------------
        {
            id: "focus-result",
            title: "Focus on Result (Simple)",
            icon: "✅",
            stepNumber: 2,
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
            stepNumber: 3,
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
            stepNumber: 4,
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
            stepNumber: 5,
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
            stepNumber: 6,
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
            title: "Structure Check: Building Sentences",
            icon: "🏗️",
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
        // 8. Time Expressions
        // -------------------------------------------------------------------------
        {
            id: "time-expressions",
            title: "Time Expressions: For, Since & Signal Words",
            icon: "📅",
            stepNumber: 7,
            explanation: `
                <h3>Key Time Words for Both Forms</h3>
                <p>Both Simple and Continuous use <strong>for</strong> and <strong>since</strong>, but some words work better with one form.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">FOR = Duration</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #4b5563;">How long? A period of time.</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>for 10 minutes</li>
                            <li>for 2 hours</li>
                            <li>for 3 weeks</li>
                            <li>for 5 years</li>
                        </ul>
                    </div>
                    <div style="background: #dbeafe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #1d4ed8;">SINCE = Starting Point</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #4b5563;">From when? A specific time.</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>since Monday</li>
                            <li>since 2019</li>
                            <li>since I moved here</li>
                            <li>since breakfast</li>
                        </ul>
                    </div>
                </div>

                <h4>Signal Words by Form</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="background: #fff7ed;">
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; color: #c2410c;">Simple (Result/Count)</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #6366f1; color: #4338ca;">Continuous (Duration/Activity)</th>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; vertical-align: top;">
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">already</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">yet</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">just</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">ever</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">never</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">how many times</span>
                        </td>
                        <td style="padding: 0.5rem; vertical-align: top;">
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">all day/morning/week</span>
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">lately</span>
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">recently</span>
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">how long</span>
                        </td>
                    </tr>
                </table>
            `,
            exercises: [
                {
                    id: "ex-time-expressions",
                    title: "For or Since?",
                    instructions: "Choose the correct time expression.",
                    items: [
                        {
                            type: "select",
                            label: "I have been working here ___ 2018.",
                            options: ["for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "She has lived in Boston ___ five years.",
                            options: ["for", "since"],
                            expectedAnswer: "for",
                        },
                        {
                            type: "select",
                            label: "We have been waiting ___ the meeting started.",
                            options: ["for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "They have been studying English ___ three months.",
                            options: ["for", "since"],
                            expectedAnswer: "for",
                        },
                    ],
                },
                {
                    id: "ex-signal-words",
                    title: "Which Form Fits?",
                    instructions: "Based on the signal word, choose Simple or Continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "I have ___ finished my homework. (already)",
                            options: [
                                { value: "simple", label: "Simple: have already finished" },
                                { value: "continuous", label: "Continuous: have been already finishing" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "She has been tired ___. (lately)",
                            options: [
                                { value: "simple", label: "Simple: has felt tired lately" },
                                { value: "continuous", label: "Continuous: has been feeling tired lately" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "Have you ___ been to Japan? (ever)",
                            options: [
                                { value: "simple", label: "Simple: Have you ever been" },
                                { value: "continuous", label: "Continuous: Have you ever been being" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 9. Common Mistakes
        // -------------------------------------------------------------------------
        {
            id: "common-mistakes",
            title: "Common Mistakes & When NOT to Use",
            icon: "⚠️",
            stepNumber: 8,
            explanation: `
                <h3>Avoid These Errors!</h3>
                <p>Here are the most common mistakes students make with the Present Perfect Family.</p>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 1: Using Continuous with State Verbs</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> I have been knowing him for years.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> I have known him for years.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">State verbs (know, believe, like, love, want, need, have, own) don't use Continuous forms.</p>
                </div>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 2: Using Continuous for Counted Actions</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> I have been reading 3 books this month.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> I have read 3 books this month.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">When counting completed items, use Simple.</p>
                </div>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 3: Using Continuous with "Finish"</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> I haven't been finishing my work yet.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> I haven't finished my work yet.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">"Finish" describes completion - always use Simple.</p>
                </div>

                <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #059669;">✓ Quick Decision Guide</h4>
                    <ul style="margin: 0; padding-left: 1.2rem;">
                        <li><strong>Can you count it?</strong> → Simple (3 emails, twice, never)</li>
                        <li><strong>Is it a state verb?</strong> → Simple (know, believe, own)</li>
                        <li><strong>Is it about completion?</strong> → Simple (finish, decide, arrive)</li>
                        <li><strong>Is it about duration/how long?</strong> → Continuous (all day, for hours)</li>
                        <li><strong>Do you see evidence of activity?</strong> → Continuous (sweating, dirty hands)</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 State Verbs List",
                content: "Common state verbs that DON'T use Continuous: <br><strong>Mental:</strong> know, believe, think, understand, remember <br><strong>Emotional:</strong> like, love, hate, want, need, prefer <br><strong>Possession:</strong> have, own, belong, possess"
            },
            exercises: [
                {
                    id: "ex-common-mistakes",
                    title: "Fix the Mistakes",
                    instructions: "Choose the CORRECT version of each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Duration with a state verb:",
                            options: [
                                { value: "wrong", label: "I have been owning this car for 5 years." },
                                { value: "correct", label: "I have owned this car for 5 years." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Counting completed items:",
                            options: [
                                { value: "wrong", label: "She has been visiting Paris 4 times." },
                                { value: "correct", label: "She has visited Paris 4 times." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Talking about completion:",
                            options: [
                                { value: "wrong", label: "Have you been finishing your project yet?" },
                                { value: "correct", label: "Have you finished your project yet?" },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Emphasizing duration:",
                            options: [
                                { value: "wrong", label: "I have waited for 2 hours!" },
                                { value: "correct", label: "I have been waiting for 2 hours!" },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Evidence of recent activity (dirty hands):",
                            options: [
                                { value: "wrong", label: "Have you worked in the garden?" },
                                { value: "correct", label: "Have you been working in the garden?" },
                            ],
                            expectedAnswer: "correct",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 10. Mixed Practice
        // -------------------------------------------------------------------------
        {
            id: "family-mixed",
            title: "Mixed Practice: Real Life Scenarios",
            icon: "🧠",
            stepNumber: 9,
            explanation: `
                <h3>Put It All Together!</h3>
                <p>In real conversation, we switch back and forth between Simple and Continuous. Use your decision-making skills:</p>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li><strong>Result/Count/Completion?</strong> → Simple</li>
                    <li><strong>Duration/Activity/Evidence?</strong> → Continuous</li>
                    <li><strong>State verb?</strong> → Simple (even for duration)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-mixed-scenarios",
                    title: "Real Life Scenarios",
                    instructions: "Choose the best form for each situation.",
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
                {
                    id: "ex-mixed-fill",
                    title: "Complete the Conversations",
                    instructions: "Fill in the correct form based on context.",
                    items: [
                        {
                            type: "text",
                            label: "A: You look tired! B: I ___ (study) all night for my exam.",
                            expectedAnswer: "have been studying",
                            placeholder: "have been studying",
                        },
                        {
                            type: "text",
                            label: "A: How many apartments ___ you ___ (visit)? B: About 5 so far.",
                            expectedAnswer: "have you visited",
                            placeholder: "have you visited",
                        },
                        {
                            type: "text",
                            label: "A: I ___ (know) Maria since high school. (state verb)",
                            expectedAnswer: "have known",
                            placeholder: "have known",
                        },
                        {
                            type: "text",
                            label: "A: Why are your hands so dirty? B: I ___ (work) in the garden.",
                            expectedAnswer: "have been working",
                            placeholder: "have been working",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // Summary Section
        // -------------------------------------------------------------------------
        {
            id: "family-summary",
            title: "Summary: The Present Perfect Family",
            icon: "📋",
            stepNumber: 10,
            explanation: `
                <h3>What You've Learned</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f97316;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #c2410c;">The Finisher (Simple)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> have/has + past participle</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> Result, completion, count</p>
                        <p style="margin: 0;"><strong>Key words:</strong> already, yet, just, ever, never, how many</p>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #4338ca;">The Worker (Continuous)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> have/has been + verb-ing</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> Duration, activity, evidence</p>
                        <p style="margin: 0;"><strong>Key words:</strong> for, since, all day, lately, how long</p>
                    </div>
                </div>

                <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">🎯 The Golden Question</h4>
                    <p style="margin: 0; font-size: 1.1rem;">Ask yourself: <strong>"Do I care about the RESULT (count/completion) or the DURATION (time/activity)?"</strong></p>
                </div>

                <h4>Remember:</h4>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li>State verbs (know, believe, own) → Always Simple, even for duration</li>
                    <li>Counting completed items → Simple</li>
                    <li>Emphasizing how long/visible evidence → Continuous</li>
                    <li>Both use <strong>for</strong> (duration) and <strong>since</strong> (starting point)</li>
                </ul>
            `,
            tipBox: {
                title: "🚀 Keep Practicing!",
                content: "The more you practice choosing between Simple and Continuous, the more natural it becomes. Pay attention to how native speakers use these forms in movies, podcasts, and conversations!"
            },
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
