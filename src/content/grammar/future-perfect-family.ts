import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // -------------------------------------------------------------------------
        // 1. Introduction: The Future Perfect Family
        // -------------------------------------------------------------------------
        {
            id: "family-intro",
            title: "The Future Perfect Family",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; border-left: 5px solid #06b6d4;">
                    <h3 style="margin-top: 0; color: #06b6d4; font-size: 1.4rem;">Looking Back from the Future</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6;">
                        The <strong>Future Perfect Family</strong> helps you talk about achievements and milestones. Imagine standing at a future point and looking back at what will be <strong>done</strong> or how long something will have been <strong>happening</strong>.
                    </p>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 250px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #06b6d4; margin-top: 0;">1. The Goal Setter (Simple)</h4>
                            <p style="font-size: 0.95rem; color: #4b5563;">"By June, I <strong>will have graduated</strong>."</p>
                            <span style="display: inline-block; background: #cffafe; color: #0e7490; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: 600;">Focus: COMPLETED BY DEADLINE</span>
                        </div>
                        <div style="flex: 1; min-width: 250px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #a855f7; margin-top: 0;">2. The Journey Tracker (Continuous)</h4>
                            <p style="font-size: 0.95rem; color: #4b5563;">"By June, I <strong>will have been studying</strong> for 4 years."</p>
                            <span style="display: inline-block; background: #f3e8ff; color: #7c3aed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: 600;">Focus: DURATION UP TO THAT POINT</span>
                        </div>
                    </div>
                </div>
                <div style="background: #ecfdf5; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #10b981;">
                    <p style="margin: 0; font-weight: 600;">💡 When to use: Deadlines, milestones, anniversaries, and predictions!</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Common contexts: graduation, work anniversaries, project completions, life goals.</p>
                </div>
            `,
        },

        // -------------------------------------------------------------------------
        // 2. Side-by-Side Timeline Comparison
        // -------------------------------------------------------------------------
        {
            id: "timeline-comparison",
            title: "Visual Comparison: Two Timelines",
            icon: "📊",
            explanation: `
                <h3>See the Difference</h3>
                <p>Both forms look forward to a future moment, but they show different things:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <!-- Simple Timeline -->
                    <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #0e7490;">Simple: Done by the Deadline</h4>
                        <div style="position: relative; height: 80px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 3px; background: linear-gradient(to right, #94a3b8, #06b6d4, #22c55e); transform: translateY(-50%);"></div>
                            <!-- NOW -->
                            <div style="position: absolute; left: 10%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 40px; height: 40px; background: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem;">NOW</div>
                            </div>
                            <!-- Action complete point -->
                            <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 20px; height: 20px; background: #06b6d4; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #06b6d4;"></div>
                                <div style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #06b6d4; font-weight: 600;">will have done ✓</div>
                            </div>
                            <!-- Future point -->
                            <div style="position: absolute; right: 10%; top: 50%; transform: translate(0, -50%);">
                                <div style="background: #dcfce7; border: 2px solid #22c55e; padding: 0.35rem 0.6rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; color: #16a34a;">BY JUNE</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 1rem 0 0 0; font-size: 0.85rem; color: #4b5563;">"By June, I <strong>will have graduated</strong>."</p>
                    </div>

                    <!-- Continuous Timeline -->
                    <div style="background: white; border: 2px solid #a855f7; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #7c3aed;">Continuous: Duration Up to That Point</h4>
                        <div style="position: relative; height: 80px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 3px; background: #e5e7eb; transform: translateY(-50%);"></div>
                            <!-- Duration bar -->
                            <div style="position: absolute; top: 50%; left: 15%; right: 20%; height: 24px; background: linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.8)); border-radius: 12px; transform: translateY(-50%); border: 2px solid #a855f7;">
                                <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: #581c87; font-weight: 600;">will have been studying</span>
                            </div>
                            <!-- NOW marker -->
                            <div style="position: absolute; left: 15%; top: 15%; transform: translateX(-50%);">
                                <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">NOW</div>
                            </div>
                            <!-- Future point -->
                            <div style="position: absolute; right: 10%; top: 50%; transform: translate(0, -50%);">
                                <div style="background: #f3e8ff; border: 2px solid #a855f7; padding: 0.35rem 0.6rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; color: #7c3aed;">BY JUNE</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 1rem 0 0 0; font-size: 0.85rem; color: #4b5563;">"By June, I <strong>will have been studying</strong> for 4 years."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-fp-timeline",
                    title: "Which Timeline?",
                    instructions: "Match each sentence to the correct focus.",
                    items: [
                        {
                            type: "radio",
                            label: "\"By December, I will have saved $5,000.\"",
                            options: [
                                { value: "completion", label: "Completion: Goal achieved by deadline ($5,000 saved)" },
                                { value: "duration", label: "Duration: How long I've been saving" },
                            ],
                            expectedAnswer: "completion",
                        },
                        {
                            type: "radio",
                            label: "\"By next year, she will have been working here for 10 years.\"",
                            options: [
                                { value: "completion", label: "Completion: Work finished" },
                                { value: "duration", label: "Duration: 10-year anniversary milestone" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: "\"The project will have been completed by Friday.\"",
                            options: [
                                { value: "completion", label: "Completion: Project done by deadline" },
                                { value: "duration", label: "Duration: How long the project took" },
                            ],
                            expectedAnswer: "completion",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 3. Focus on Goals (Simple)
        // -------------------------------------------------------------------------
        {
            id: "focus-goals",
            title: "Focus on Goals & Deadlines (Simple)",
            icon: "🏆",
            stepNumber: 1,
            explanation: `
                <h3>What Will Be Done By Then?</h3>
                <p>Use <strong>Future Perfect Simple</strong> (will have + past participle) to talk about actions that will be <strong>completed before</strong> a future deadline or moment.</p>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #0e7490;">The Goal Setter's Formula</h4>
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0;">
                        <span style="background: #fef3c7; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600;">By + future time</span>
                        <span>+</span>
                        <span style="background: #dbeafe; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                        <span>+</span>
                        <span style="background: #cffafe; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #06b6d4;">will have</span>
                        <span>+</span>
                        <span style="background: #a5f3fc; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: #64748b;">Example: <strong>By December</strong>, I <strong>will have finished</strong> my course.</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🎯 Completing Goals by a Deadline",
                    description: "Things you plan to finish before a specific future time",
                    examples: [
                        {
                            sentence: "By next Friday, I <strong>will have completed</strong> all my assignments.",
                            explanation: "Goal: finish assignments → Deadline: Friday",
                        },
                        {
                            sentence: "She <strong>will have graduated</strong> by June.",
                            explanation: "Goal: graduate → Deadline: June",
                        },
                    ],
                },
                {
                    title: "📊 Making Predictions About the Future",
                    description: "What will be true by a certain point",
                    examples: [
                        {
                            sentence: "By 2030, technology <strong>will have changed</strong> dramatically.",
                            explanation: "Prediction about completion/change by 2030",
                        },
                        {
                            sentence: "The package <strong>will have arrived</strong> by tomorrow morning.",
                            explanation: "Prediction about delivery completion",
                        },
                    ],
                },
                {
                    title: "🏅 Milestones and Achievements",
                    description: "Counting accomplishments by a future point",
                    examples: [
                        {
                            sentence: "By my 30th birthday, I <strong>will have visited</strong> 20 countries.",
                            explanation: "Achievement count by milestone",
                        },
                        {
                            sentence: "By the end of the year, we <strong>will have helped</strong> 1,000 students.",
                            explanation: "Organizational milestone",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-fp-simple-goals",
                    title: "Goals and Deadlines",
                    instructions: "Complete with Future Perfect Simple (will have + past participle).",
                    items: [
                        {
                            type: "text",
                            label: "By next month, I ___ (save) enough money for my vacation.",
                            expectedAnswer: "will have saved",
                            placeholder: "will have saved",
                        },
                        {
                            type: "text",
                            label: "She ___ (finish) her degree by December.",
                            expectedAnswer: "will have finished",
                            placeholder: "will have finished",
                        },
                        {
                            type: "text",
                            label: "By Friday, we ___ (complete) the project.",
                            expectedAnswer: "will have completed",
                            placeholder: "will have completed",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 4. Focus on Duration (Continuous)
        // -------------------------------------------------------------------------
        {
            id: "focus-duration",
            title: "Focus on Duration & Milestones (Continuous)",
            icon: "📅",
            stepNumber: 2,
            explanation: `
                <h3>How Long Will It Have Been Happening?</h3>
                <p>Use <strong>Future Perfect Continuous</strong> (will have been + verb-ing) to emphasize <strong>how long</strong> an activity will have been going on by a future point. This is perfect for anniversaries and milestones!</p>

                <div style="background: white; border: 2px solid #a855f7; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #7c3aed;">The Journey Tracker's Formula</h4>
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0;">
                        <span style="background: #fef3c7; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600;">By + future time</span>
                        <span>+</span>
                        <span style="background: #dbeafe; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                        <span>+</span>
                        <span style="background: #f3e8ff; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #a855f7;">will have been</span>
                        <span>+</span>
                        <span style="background: #e9d5ff; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600;">verb-ing</span>
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: #64748b;">Example: <strong>By December</strong>, I <strong>will have been working</strong> here for 5 years.</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🎂 Work Anniversaries",
                    description: "Celebrating how long you've been at a job",
                    examples: [
                        {
                            sentence: "By March, she <strong>will have been working</strong> at the company for 10 years.",
                            explanation: "10-year work anniversary in March",
                        },
                        {
                            sentence: "Next month, I <strong>will have been teaching</strong> for 20 years.",
                            explanation: "Career milestone",
                        },
                    ],
                },
                {
                    title: "📚 Study Duration",
                    description: "How long you'll have been studying by graduation",
                    examples: [
                        {
                            sentence: "By the time I graduate, I <strong>will have been studying</strong> English for 6 years.",
                            explanation: "Duration of English study at graduation",
                        },
                        {
                            sentence: "By December, they <strong>will have been learning</strong> programming for 2 years.",
                            explanation: "Learning duration milestone",
                        },
                    ],
                },
                {
                    title: "🏠 Living Situations",
                    description: "How long you'll have been living somewhere",
                    examples: [
                        {
                            sentence: "By next year, we <strong>will have been living</strong> in this apartment for 5 years.",
                            explanation: "Housing duration milestone",
                        },
                        {
                            sentence: "By 2025, she <strong>will have been living</strong> in the US for a decade.",
                            explanation: "Immigration milestone",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-fp-continuous-duration",
                    title: "Duration and Milestones",
                    instructions: "Complete with Future Perfect Continuous (will have been + -ing).",
                    items: [
                        {
                            type: "text",
                            label: "By next month, I ___ (work) here for exactly 5 years.",
                            expectedAnswer: "will have been working",
                            placeholder: "will have been working",
                        },
                        {
                            type: "text",
                            label: "By graduation, she ___ (study) medicine for 8 years.",
                            expectedAnswer: "will have been studying",
                            placeholder: "will have been studying",
                        },
                        {
                            type: "text",
                            label: "By December, they ___ (live) in that house for 10 years.",
                            expectedAnswer: "will have been living",
                            placeholder: "will have been living",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 5. Positive Forms
        // -------------------------------------------------------------------------
        {
            id: "positive-forms",
            title: "Positive Forms: Side by Side",
            icon: "✓",
            stepNumber: 3,
            explanation: `
                <h3>Building Positive Sentences</h3>
                <p>Both forms use <strong>will have</strong> for all subjects (I, you, he, she, it, we, they).</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #cffafe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #0e7490;">Simple</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #06b6d4;">will have</span>
                            <span>+</span>
                            <span style="background: #a5f3fc; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>will have finished</strong> by Friday.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">She <strong>will have graduated</strong> by June.</p>
                    </div>

                    <div style="background: #f3e8ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #a855f7;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #7c3aed;">Continuous</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #a855f7;">will have been</span>
                            <span>+</span>
                            <span style="background: #e9d5ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">verb-ing</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>will have been working</strong> for 5 years.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">She <strong>will have been studying</strong> all day.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-fp-positive",
                    title: "Complete with the Correct Form",
                    instructions: "Use Simple (completion) or Continuous (duration) based on context.",
                    items: [
                        {
                            type: "text",
                            label: "By next year, I ___ (graduate) from college. [completion]",
                            expectedAnswer: "will have graduated",
                            placeholder: "will have graduated",
                        },
                        {
                            type: "text",
                            label: "By December, she ___ (work) here for 3 years. [duration]",
                            expectedAnswer: "will have been working",
                            placeholder: "will have been working",
                        },
                        {
                            type: "text",
                            label: "The package ___ (arrive) by tomorrow. [completion]",
                            expectedAnswer: "will have arrived",
                            placeholder: "will have arrived",
                        },
                        {
                            type: "text",
                            label: "By 6 PM, I ___ (drive) for 8 hours straight. [duration]",
                            expectedAnswer: "will have been driving",
                            placeholder: "will have been driving",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 6. Negative Forms
        // -------------------------------------------------------------------------
        {
            id: "negative-forms",
            title: "Negative Forms: Side by Side",
            icon: "✗",
            stepNumber: 4,
            explanation: `
                <h3>Making Negatives</h3>
                <p>Add <strong>not</strong> after <strong>will</strong>. Use the contraction <strong>won't</strong> in conversation.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #cffafe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #0e7490;">Simple Negative</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fee2e2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #ef4444;">won't have</span>
                            <span>+</span>
                            <span style="background: #a5f3fc; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>won't have finished</strong> by then.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">She <strong>won't have graduated</strong> yet.</p>
                    </div>

                    <div style="background: #f3e8ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #a855f7;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #7c3aed;">Continuous Negative</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fee2e2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #ef4444;">won't have been</span>
                            <span>+</span>
                            <span style="background: #e9d5ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">verb-ing</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>won't have been working</strong> long.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">They <strong>won't have been waiting</strong> very long.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-fp-negative",
                    title: "Make It Negative",
                    instructions: "Complete with the negative form.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (not / finish) the report by Monday. [Simple]",
                            expectedAnswer: "won't have finished",
                            placeholder: "won't have finished",
                        },
                        {
                            type: "text",
                            label: "She ___ (not / work) here very long by then. [Continuous]",
                            expectedAnswer: "won't have been working",
                            placeholder: "won't have been working",
                        },
                        {
                            type: "text",
                            label: "The project ___ (not / complete) by the deadline. [Simple]",
                            expectedAnswer: "won't have been completed",
                            placeholder: "won't have been completed",
                        },
                        {
                            type: "text",
                            label: "They ___ (not / live) there for a full year yet. [Continuous]",
                            expectedAnswer: "won't have been living",
                            placeholder: "won't have been living",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 7. Question Forms
        // -------------------------------------------------------------------------
        {
            id: "question-forms",
            title: "Question Forms: Side by Side",
            icon: "❓",
            stepNumber: 5,
            explanation: `
                <h3>Asking Questions</h3>
                <p>Put <strong>Will</strong> at the beginning of the sentence.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #cffafe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #0e7490;">Simple Questions</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #06b6d4;">Will</span>
                            <span>+</span>
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                            <span>+</span>
                            <span style="background: #a5f3fc; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">have + past participle</span>
                            <span>?</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem;"><strong style="color: #0e7490;">What will you have done by then?</strong></p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">Will she have finished by Friday?</p>
                    </div>

                    <div style="background: #f3e8ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #a855f7;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #7c3aed;">Continuous Questions</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #a855f7;">Will</span>
                            <span>+</span>
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                            <span>+</span>
                            <span style="background: #e9d5ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">have been + -ing</span>
                            <span>?</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem;"><strong style="color: #7c3aed;">How long will you have been working?</strong></p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">Will they have been waiting long?</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-fp-questions",
                    title: "Form Questions",
                    instructions: "Complete the questions.",
                    items: [
                        {
                            type: "text",
                            label: "___ you ___ (finish) the project by Friday? [Simple]",
                            expectedAnswer: "Will you have finished",
                            placeholder: "Will you have finished",
                        },
                        {
                            type: "text",
                            label: "How long ___ she ___ (work) here by December? [Continuous]",
                            expectedAnswer: "will she have been working",
                            placeholder: "will she have been working",
                        },
                        {
                            type: "text",
                            label: "___ the package ___ (arrive) by tomorrow? [Simple]",
                            expectedAnswer: "Will the package have arrived",
                            placeholder: "Will the package have arrived",
                        },
                        {
                            type: "text",
                            label: "___ they ___ (live) there for 5 years by next month? [Continuous]",
                            expectedAnswer: "Will they have been living",
                            placeholder: "Will they have been living",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 8. Time Expressions
        // -------------------------------------------------------------------------
        {
            id: "time-expressions",
            title: "Time Expressions & Signal Words",
            icon: "⏰",
            stepNumber: 6,
            explanation: `
                <h3>Key Time Words</h3>
                <p>These words signal Future Perfect usage and help you choose between Simple and Continuous.</p>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #f59e0b;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Future Perfect Markers</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">by + time</span>
                        <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">by the time</span>
                        <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">before</span>
                        <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">by then</span>
                        <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">in + time period</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #cffafe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #0e7490;">Simple Signal Words</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">already</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">yet</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">how many</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">completion verbs</span>
                        </div>
                    </div>

                    <div style="background: #f3e8ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #7c3aed;">Continuous Signal Words</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">for + duration</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">how long</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">all day/week</span>
                        </div>
                    </div>
                </div>

                <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">Quick Rule</h4>
                    <p style="margin: 0;"><strong>"By" + future time</strong> → Usually Future Perfect</p>
                    <p style="margin: 0.5rem 0 0 0;"><strong>"For" + duration</strong> → Usually Continuous (emphasizing time)</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-fp-time-words",
                    title: "Which Form?",
                    instructions: "Choose Simple or Continuous based on context.",
                    items: [
                        {
                            type: "radio",
                            label: "By next year, I will have ___ my degree. (completion)",
                            options: [
                                { value: "simple", label: "Simple: will have completed" },
                                { value: "continuous", label: "Continuous: will have been completing" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "By December, she will have ___ here for 5 years. (duration)",
                            options: [
                                { value: "simple", label: "Simple: will have worked" },
                                { value: "continuous", label: "Continuous: will have been working" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "How many countries will you have ___ by age 30? (count)",
                            options: [
                                { value: "simple", label: "Simple: will have visited" },
                                { value: "continuous", label: "Continuous: will have been visiting" },
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
            title: "Common Mistakes & Comparisons",
            icon: "⚠️",
            stepNumber: 7,
            explanation: `
                <h3>Avoid These Errors!</h3>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 1: Forgetting "BY" + Future Time</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> I will have finished next week.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> I will have finished <strong>by</strong> next week.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Future Perfect needs a deadline marker like "by", "before", or "by the time".</p>
                </div>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 2: Using Simple Future Instead</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> By 2025, I will work here for 10 years.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> By 2025, I will have been working here for 10 years.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Use Future Perfect for looking back from a future point, not Simple Future.</p>
                </div>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 3: Confusing Completion vs Duration</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> I will have been finishing by Friday.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> I will have finished by Friday.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">"Finish" is a completion verb - use Simple. Continuous is for ongoing activities with duration.</p>
                </div>
            `,
            comparison: {
                title: "Future Perfect vs Simple Future",
                leftLabel: "Future Perfect",
                rightLabel: "Simple Future",
                rows: [
                    {
                        label: "Perspective",
                        left: "Looking back from a future point",
                        right: "Looking forward to a future event",
                    },
                    {
                        label: "Time marker",
                        left: "by, before, by the time",
                        right: "tomorrow, next week, soon",
                    },
                    {
                        label: "Example",
                        left: "By Friday, I will have finished.",
                        right: "I will finish on Friday.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-fp-mistakes",
                    title: "Fix the Mistakes",
                    instructions: "Choose the CORRECT version.",
                    items: [
                        {
                            type: "radio",
                            label: "Talking about a deadline:",
                            options: [
                                { value: "wrong", label: "I will finish the report next Friday." },
                                { value: "correct", label: "I will have finished the report by next Friday." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Work anniversary (duration):",
                            options: [
                                { value: "wrong", label: "By December, she will work here for 5 years." },
                                { value: "correct", label: "By December, she will have been working here for 5 years." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Completion verb (finish):",
                            options: [
                                { value: "wrong", label: "I will have been finishing by then." },
                                { value: "correct", label: "I will have finished by then." },
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
            id: "mixed-practice",
            title: "Mixed Practice: Life Goals & Milestones",
            icon: "🎯",
            stepNumber: 8,
            explanation: `
                <h3>Put It All Together!</h3>
                <p>The Future Perfect Family is perfect for talking about your goals, plans, and milestones.</p>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #64748b;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #475569;">Example: Career Goals</h4>
                    <p style="margin: 0; line-height: 1.8;">
                        "By next December, I <span style="color: #06b6d4; font-weight: 600;">will have completed</span> my ESOL certification.
                        I <span style="color: #a855f7; font-weight: 600;">will have been studying</span> English for 4 years by then.
                        By the end of the year, I <span style="color: #06b6d4; font-weight: 600;">will have applied</span> to at least 10 jobs."
                    </p>
                </div>

                <h4>Decision Guide:</h4>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li><strong>Completion/Goal achieved?</strong> → Simple (will have + past participle)</li>
                    <li><strong>Duration/Anniversary?</strong> → Continuous (will have been + -ing)</li>
                    <li><strong>Counting things?</strong> → Simple (10 countries, 5 books)</li>
                    <li><strong>How long?</strong> → Continuous (for 5 years, all day)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-fp-mixed",
                    title: "Goals and Milestones",
                    instructions: "Choose Simple or Continuous based on context.",
                    items: [
                        {
                            type: "radio",
                            label: "By my birthday, I ___ 50 books this year.",
                            options: [
                                { value: "simple", label: "will have read (count: 50 books)" },
                                { value: "continuous", label: "will have been reading (duration)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "By December, we ___ in this apartment for exactly 3 years.",
                            options: [
                                { value: "simple", label: "will have lived (completion)" },
                                { value: "continuous", label: "will have been living (duration/anniversary)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "The project ___ by the time you arrive.",
                            options: [
                                { value: "simple", label: "will have been completed (finished)" },
                                { value: "continuous", label: "will have been completing (in progress)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "By 6 PM, I ___ for 8 hours without a break.",
                            options: [
                                { value: "simple", label: "will have worked (completed)" },
                                { value: "continuous", label: "will have been working (duration emphasis)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
                {
                    id: "ex-fp-fill-goals",
                    title: "Your Turn: Complete the Sentences",
                    instructions: "Fill in with the correct form.",
                    items: [
                        {
                            type: "text",
                            label: "By next year, I ___ (graduate) from this program.",
                            expectedAnswer: "will have graduated",
                            placeholder: "will have graduated",
                        },
                        {
                            type: "text",
                            label: "By my 5-year work anniversary, I ___ (work) here since 2020.",
                            expectedAnswer: "will have been working",
                            placeholder: "will have been working",
                        },
                        {
                            type: "text",
                            label: "By December, she ___ (visit) 15 countries in total.",
                            expectedAnswer: "will have visited",
                            placeholder: "will have visited",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // Summary
        // -------------------------------------------------------------------------
        {
            id: "family-summary",
            title: "Summary: The Future Perfect Family",
            icon: "📋",
            stepNumber: 9,
            explanation: `
                <h3>What You've Learned</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #cffafe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #0e7490;">The Goal Setter (Simple)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> will have + past participle</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> Completed BY deadline</p>
                        <p style="margin: 0;"><strong>Key words:</strong> by, before, by the time, already, how many</p>
                    </div>
                    <div style="background: #f3e8ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #a855f7;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #7c3aed;">The Journey Tracker (Continuous)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> will have been + verb-ing</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> Duration UP TO that point</p>
                        <p style="margin: 0;"><strong>Key words:</strong> for, how long, all day/week</p>
                    </div>
                </div>

                <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">🎯 The Golden Question</h4>
                    <p style="margin: 0; font-size: 1.1rem;">Ask yourself: <strong>"Do I care about COMPLETION (goal achieved) or DURATION (how long by then)?"</strong></p>
                </div>

                <h4>Real-Life Uses:</h4>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li><strong>Work anniversaries:</strong> "By June, I will have been working here for 5 years."</li>
                    <li><strong>Graduation:</strong> "By May, I will have graduated."</li>
                    <li><strong>Project deadlines:</strong> "By Friday, we will have finished the report."</li>
                    <li><strong>Life milestones:</strong> "By age 30, I will have visited 20 countries."</li>
                </ul>
            `,
            tipBox: {
                title: "🚀 Keep Practicing!",
                content: "Think about your own life goals and milestones. What will you have accomplished by this time next year? How long will you have been doing certain activities? Practice making sentences about your future!"
            },
        },
    ],

    // -------------------------------------------------------------------------
    // Mini Quiz: 15 Questions
    // -------------------------------------------------------------------------
    miniQuiz: [
        // Concepts & Usage (1-5)
        {
            id: "fpf-q1",
            question: "When do we use Future Perfect Simple?",
            options: [
                { value: "a", label: "To show how long something will have been happening" },
                { value: "b", label: "To show what will be COMPLETED by a future deadline" },
                { value: "c", label: "To describe what is happening now" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Simple shows completion by a deadline - looking back from a future point at what will be done.",
        },
        {
            id: "fpf-q2",
            question: "When do we use Future Perfect Continuous?",
            options: [
                { value: "a", label: "To show DURATION up to a future point" },
                { value: "b", label: "To count completed actions" },
                { value: "c", label: "To describe past events" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect Continuous emphasizes how long something will have been happening by a future moment.",
        },
        {
            id: "fpf-q3",
            question: "Which sentence talks about a WORK ANNIVERSARY?",
            options: [
                { value: "a", label: "By December, I will have finished my project." },
                { value: "b", label: "By December, I will have been working here for 5 years." },
            ],
            correctAnswer: "b",
            explanation: "Work anniversaries focus on duration ('for 5 years'), so we use Continuous.",
        },
        {
            id: "fpf-q4",
            question: "What time marker is REQUIRED with Future Perfect?",
            options: [
                { value: "a", label: "yesterday" },
                { value: "b", label: "by, before, or by the time" },
                { value: "c", label: "now" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect needs a deadline marker like 'by', 'before', or 'by the time' to show the future reference point.",
        },
        {
            id: "fpf-q5",
            question: "\"By graduation, I will have been studying English for 6 years.\" What's the focus?",
            options: [
                { value: "a", label: "The completion of English study" },
                { value: "b", label: "The duration of English study (6 years)" },
                { value: "c", label: "Starting to study English" },
            ],
            correctAnswer: "b",
            explanation: "\"For 6 years\" emphasizes duration, so we use Continuous to track the journey.",
        },

        // Sentence Completion (6-10)
        {
            id: "fpf-q6",
            question: "By next Friday, I ___ the report.",
            options: [
                { value: "a", label: "will have completed" },
                { value: "b", label: "will complete" },
                { value: "c", label: "have completed" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect Simple (will have completed) shows the report will be done BY the deadline.",
        },
        {
            id: "fpf-q7",
            question: "By December, she ___ here for exactly 10 years.",
            options: [
                { value: "a", label: "will work" },
                { value: "b", label: "will have been working" },
                { value: "c", label: "has been working" },
            ],
            correctAnswer: "b",
            explanation: "\"For 10 years\" emphasizes duration (work anniversary), so we use Continuous.",
        },
        {
            id: "fpf-q8",
            question: "By the time you arrive, the meeting ___.",
            options: [
                { value: "a", label: "will have started" },
                { value: "b", label: "will start" },
                { value: "c", label: "started" },
            ],
            correctAnswer: "a",
            explanation: "\"By the time\" signals Future Perfect - the meeting will be in progress when you arrive.",
        },
        {
            id: "fpf-q9",
            question: "How many countries ___ you ___ by age 30?",
            options: [
                { value: "a", label: "will / have visited" },
                { value: "b", label: "will / have been visiting" },
                { value: "c", label: "did / visit" },
            ],
            correctAnswer: "a",
            explanation: "Counting countries (how many) = Simple, not Continuous.",
        },
        {
            id: "fpf-q10",
            question: "By 6 PM, I ___ for 8 hours straight.",
            options: [
                { value: "a", label: "will work" },
                { value: "b", label: "will have been working" },
                { value: "c", label: "worked" },
            ],
            correctAnswer: "b",
            explanation: "\"For 8 hours\" emphasizes the duration of working, so we use Continuous.",
        },

        // Form Accuracy (11-13)
        {
            id: "fpf-q11",
            question: "What is the correct negative form of \"She will have finished\"?",
            options: [
                { value: "a", label: "She won't have finished" },
                { value: "b", label: "She hasn't finished" },
                { value: "c", label: "She didn't have finished" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect negative: will not (won't) have + past participle.",
        },
        {
            id: "fpf-q12",
            question: "Which question form is correct?",
            options: [
                { value: "a", label: "Will you have been working here long?" },
                { value: "b", label: "Have you will been working here long?" },
                { value: "c", label: "Are you will have been working here long?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Will + subject + have been + verb-ing?",
        },
        {
            id: "fpf-q13",
            question: "Choose the correct structure for Future Perfect Continuous:",
            options: [
                { value: "a", label: "will have + past participle" },
                { value: "b", label: "will have been + verb-ing" },
                { value: "c", label: "have been + verb-ing" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous: will have been + verb-ing (e.g., will have been working).",
        },

        // Error Identification (14-15)
        {
            id: "fpf-q14",
            question: "Is this correct? \"I will have been finishing by Friday.\"",
            options: [
                { value: "a", label: "Yes, it's correct" },
                { value: "b", label: "No - 'finish' is a completion verb, use Simple" },
            ],
            correctAnswer: "b",
            explanation: "\"Finish\" is a completion verb. Correct: \"I will have finished by Friday.\"",
        },
        {
            id: "fpf-q15",
            question: "Choose the best summary of the Future Perfect Family:",
            options: [
                { value: "a", label: "Simple shows completion by deadline; Continuous shows duration up to that point" },
                { value: "b", label: "Both forms are exactly the same" },
                { value: "c", label: "Simple is for past; Continuous is for present" },
            ],
            correctAnswer: "a",
            explanation: "This is the core distinction: Simple = goal achieved; Continuous = journey tracked.",
        },
    ],
};
