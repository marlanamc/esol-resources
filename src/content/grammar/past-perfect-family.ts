import type { InteractiveGuideContent } from "@/types/activity";

export const pastPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // -------------------------------------------------------------------------
        // 1. Introduction: The Past Perfect Family
        // -------------------------------------------------------------------------
        {
            id: "family-intro",
            title: "The Past Perfect Family",
            icon: "🕰️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; border-left: 5px solid #f59e0b;">
                    <h3 style="margin-top: 0; color: #f59e0b; font-size: 1.4rem;">Looking Back at Two Past Events</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6;">
                        The <strong>Past Perfect Family</strong> helps you tell stories about the past by showing the <strong>order</strong> of events or the <strong>duration</strong> before something happened.
                    </p>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 250px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #f59e0b; margin-top: 0;">1. The Time Traveler (Simple)</h4>
                            <p style="font-size: 0.95rem; color: #4b5563;">"When I arrived, she <strong>had already left</strong>."</p>
                            <span style="display: inline-block; background: #fef3c7; color: #b45309; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: 600;">Focus: WHAT HAPPENED FIRST</span>
                        </div>
                        <div style="flex: 1; min-width: 250px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #8b5cf6; margin-top: 0;">2. The Background Painter (Continuous)</h4>
                            <p style="font-size: 0.95rem; color: #4b5563;">"I was tired because I <strong>had been working</strong> all day."</p>
                            <span style="display: inline-block; background: #ede9fe; color: #6d28d9; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: 600;">Focus: HOW LONG BEFORE</span>
                        </div>
                    </div>
                </div>
                <div style="background: #fef9c3; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #eab308;">
                    <p style="margin: 0; font-weight: 600;">⚠️ Important: Both forms need TWO past references!</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Past Perfect always works with another past action or time marker.</p>
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
                <p>Both forms look backward from a past moment, but they focus on different things:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <!-- Simple Timeline -->
                    <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #b45309;">Simple: Which Happened First?</h4>
                        <div style="position: relative; height: 80px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 3px; background: linear-gradient(to right, #f59e0b, #14b8a6, #94a3b8); transform: translateY(-50%);"></div>
                            <!-- 1st action -->
                            <div style="position: absolute; left: 15%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 50px; height: 50px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9rem; border: 3px solid white; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);">1st</div>
                                <div style="position: absolute; top: 55px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #f59e0b; font-weight: 600;">had left</div>
                            </div>
                            <!-- 2nd action -->
                            <div style="position: absolute; left: 55%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 50px; height: 50px; background: #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9rem; border: 3px solid white; box-shadow: 0 2px 8px rgba(20, 184, 166, 0.4);">2nd</div>
                                <div style="position: absolute; top: 55px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #14b8a6; font-weight: 600;">arrived</div>
                            </div>
                            <!-- NOW -->
                            <div style="position: absolute; right: 5%; top: 50%; transform: translate(0, -50%);">
                                <div style="width: 40px; height: 40px; background: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem;">NOW</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 1.5rem 0 0 0; font-size: 0.85rem; color: #4b5563;">"When I <strong>arrived</strong>, she <strong>had already left</strong>."</p>
                    </div>

                    <!-- Continuous Timeline -->
                    <div style="background: white; border: 2px solid #8b5cf6; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #6d28d9;">Continuous: How Long Before?</h4>
                        <div style="position: relative; height: 80px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 3px; background: #e5e7eb; transform: translateY(-50%);"></div>
                            <!-- Duration bar -->
                            <div style="position: absolute; top: 50%; left: 15%; width: 40%; height: 24px; background: linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.8)); border-radius: 12px; transform: translateY(-50%); border: 2px solid #8b5cf6;">
                                <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: #4c1d95; font-weight: 600;">had been working</span>
                            </div>
                            <!-- Past event marker -->
                            <div style="position: absolute; left: 60%; top: 15%; transform: translateX(-50%);">
                                <div style="width: 3px; height: 55px; background: #14b8a6;"></div>
                                <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #14b8a6; font-weight: 600; background: white; padding: 0 0.25rem;">arrived</div>
                            </div>
                            <!-- NOW -->
                            <div style="position: absolute; right: 5%; top: 50%; transform: translate(0, -50%);">
                                <div style="width: 40px; height: 40px; background: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem;">NOW</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 1.5rem 0 0 0; font-size: 0.85rem; color: #4b5563;">"I was tired because I <strong>had been working</strong> all day."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-timeline",
                    title: "Which Timeline?",
                    instructions: "Match each sentence to the correct focus.",
                    items: [
                        {
                            type: "radio",
                            label: "\"When the police arrived, the thief had escaped.\"",
                            options: [
                                { value: "order", label: "Order: What happened first (thief escaped first)" },
                                { value: "duration", label: "Duration: How long something took" },
                            ],
                            expectedAnswer: "order",
                        },
                        {
                            type: "radio",
                            label: "\"She was exhausted because she had been studying for 8 hours.\"",
                            options: [
                                { value: "order", label: "Order: What happened first" },
                                { value: "duration", label: "Duration: How long before (8 hours)" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: "\"By the time we got there, the movie had started.\"",
                            options: [
                                { value: "order", label: "Order: The movie started before we arrived" },
                                { value: "duration", label: "Duration: How long the movie played" },
                            ],
                            expectedAnswer: "order",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 3. Focus on Order (Simple)
        // -------------------------------------------------------------------------
        {
            id: "focus-order",
            title: "Focus on Order (Simple)",
            icon: "🔢",
            stepNumber: 1,
            explanation: `
                <h3>What Happened First?</h3>
                <p>Use <strong>Past Perfect Simple</strong> (had + past participle) to show which action happened <strong>FIRST</strong> when telling a story about two past events.</p>

                <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #b45309;">The Two-Verb Rule</h4>
                    <p style="margin: 0.5rem 0;">Past Perfect Simple almost ALWAYS needs TWO past events:</p>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 180px; background: #fef3c7; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0; font-weight: 600; color: #b45309;">Past Perfect = FIRST action</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem;">had + past participle</p>
                        </div>
                        <div style="flex: 1; min-width: 180px; background: #ccfbf1; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #14b8a6;">
                            <p style="margin: 0; font-weight: 600; color: #0f766e;">Past Simple = SECOND action</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem;">regular past tense</p>
                        </div>
                    </div>
                </div>

                <h4>Common Patterns</h4>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li><strong>When</strong> + Past Simple, Past Perfect → "When I <span style="color: #14b8a6;">arrived</span>, she <span style="color: #f59e0b;">had left</span>."</li>
                    <li>Past Perfect + <strong>before</strong> + Past Simple → "She <span style="color: #f59e0b;">had finished</span> before she <span style="color: #14b8a6;">went</span> home."</li>
                    <li><strong>After</strong> + Past Perfect, Past Simple → "After he <span style="color: #f59e0b;">had eaten</span>, he <span style="color: #14b8a6;">watched</span> TV."</li>
                    <li><strong>By the time</strong> + Past Simple, Past Perfect → "By the time we <span style="color: #14b8a6;">arrived</span>, the show <span style="color: #f59e0b;">had ended</span>."</li>
                </ul>
            `,
            usageMeanings: [
                {
                    title: "📍 Sequence in Stories",
                    description: "Showing the order of events when telling a story",
                    examples: [
                        {
                            sentence: "When I <strong style='color: #14b8a6;'>got</strong> home, my roommate <strong style='color: #f59e0b;'>had cooked</strong> dinner.",
                            explanation: "First: cooked → Second: got home",
                        },
                        {
                            sentence: "The bus <strong style='color: #f59e0b;'>had already left</strong> when we <strong style='color: #14b8a6;'>arrived</strong> at the stop.",
                            explanation: "First: bus left → Second: we arrived",
                        },
                    ],
                },
                {
                    title: "📍 Explaining Past Situations",
                    description: "Giving background to why something was a certain way",
                    examples: [
                        {
                            sentence: "She was nervous because she <strong style='color: #f59e0b;'>hadn't flown</strong> before.",
                            explanation: "The lack of flying experience came first",
                        },
                        {
                            sentence: "I knew the city well because I <strong style='color: #f59e0b;'>had visited</strong> many times.",
                            explanation: "The visits happened before knowing the city",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-pp-simple-order",
                    title: "Identify the First Action",
                    instructions: "Which action happened FIRST?",
                    items: [
                        {
                            type: "radio",
                            label: "When the teacher came in, the students had finished the test.",
                            options: [
                                { value: "teacher", label: "The teacher came in" },
                                { value: "students", label: "The students finished the test" },
                            ],
                            expectedAnswer: "students",
                        },
                        {
                            type: "radio",
                            label: "She had saved money before she bought the car.",
                            options: [
                                { value: "saved", label: "She saved money" },
                                { value: "bought", label: "She bought the car" },
                            ],
                            expectedAnswer: "saved",
                        },
                        {
                            type: "radio",
                            label: "By the time I called, they had already left.",
                            options: [
                                { value: "called", label: "I called" },
                                { value: "left", label: "They left" },
                            ],
                            expectedAnswer: "left",
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
            title: "Focus on Duration (Continuous)",
            icon: "⏱️",
            stepNumber: 2,
            explanation: `
                <h3>How Long Before That Moment?</h3>
                <p>Use <strong>Past Perfect Continuous</strong> (had been + verb-ing) to show <strong>how long</strong> something was happening before another past event, or to paint background for your story.</p>

                <div style="background: white; border: 2px solid #8b5cf6; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #6d28d9;">Duration Before a Past Moment</h4>
                    <div style="position: relative; margin: 1.5rem auto; max-width: 450px;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 36px; background: linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.8)); border-radius: 18px; border: 2px solid #8b5cf6;">
                            <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.85rem; color: #4c1d95; font-weight: 600;">had been waiting for 2 hours</span>
                        </div>
                        <!-- Labels -->
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">
                            <span>Started waiting</span>
                            <span style="color: #8b5cf6; font-weight: 600;">→ bus arrived</span>
                        </div>
                    </div>
                    <p style="text-align: center; margin: 0; font-size: 0.9rem;">"I <strong>had been waiting</strong> for 2 hours when the bus <strong>finally arrived</strong>."</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "⏱️ Duration Before a Past Event",
                    description: "Emphasizing how long something was happening",
                    examples: [
                        {
                            sentence: "She <strong>had been working</strong> at the company for 5 years when she got promoted.",
                            explanation: "Duration (5 years) before the promotion",
                        },
                        {
                            sentence: "We <strong>had been driving</strong> for hours when we finally saw the ocean.",
                            explanation: "Duration before seeing the ocean",
                        },
                    ],
                },
                {
                    title: "🎨 Painting Background (Explaining Why)",
                    description: "Explaining past situations with prior activity",
                    examples: [
                        {
                            sentence: "He was exhausted because he <strong>had been running</strong> all morning.",
                            explanation: "The running explains why he was exhausted",
                        },
                        {
                            sentence: "The ground was wet. It <strong>had been raining</strong>.",
                            explanation: "Recent activity explains the wet ground",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-pp-continuous-duration",
                    title: "Duration Focus",
                    instructions: "Complete with Past Perfect Continuous (had been + -ing).",
                    items: [
                        {
                            type: "text",
                            label: "She was tired because she ___ (study) all night.",
                            expectedAnswer: "had been studying",
                            placeholder: "had been studying",
                        },
                        {
                            type: "text",
                            label: "They ___ (wait) for an hour when the doors finally opened.",
                            expectedAnswer: "had been waiting",
                            placeholder: "had been waiting",
                        },
                        {
                            type: "text",
                            label: "I ___ (live) in Boston for 3 years before I moved to New York.",
                            expectedAnswer: "had been living",
                            placeholder: "had been living",
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
                <p>Both forms use <strong>had</strong> for all subjects (I, you, he, she, it, we, they).</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Simple</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #f59e0b;">had</span>
                            <span>+</span>
                            <span style="background: #fed7aa; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">She <strong>had finished</strong> her work.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">They <strong>had left</strong> early.</p>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Continuous</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #ede9fe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #8b5cf6;">had been</span>
                            <span>+</span>
                            <span style="background: #c4b5fd; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">verb-ing</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">She <strong>had been working</strong> all day.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">They <strong>had been waiting</strong> for hours.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-positive",
                    title: "Complete with the Correct Form",
                    instructions: "Use Simple (had + past participle) or Continuous (had been + -ing) based on context.",
                    items: [
                        {
                            type: "text",
                            label: "When I arrived, the meeting ___ (already / start). [order]",
                            expectedAnswer: "had already started",
                            placeholder: "had already started",
                        },
                        {
                            type: "text",
                            label: "She was exhausted because she ___ (work) for 12 hours. [duration]",
                            expectedAnswer: "had been working",
                            placeholder: "had been working",
                        },
                        {
                            type: "text",
                            label: "Before he moved to the US, he ___ (never / see) snow. [order]",
                            expectedAnswer: "had never seen",
                            placeholder: "had never seen",
                        },
                        {
                            type: "text",
                            label: "They ___ (drive) all day, so they were tired. [duration]",
                            expectedAnswer: "had been driving",
                            placeholder: "had been driving",
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
                <p>Add <strong>not</strong> after <strong>had</strong>. Use the contraction <strong>hadn't</strong> in conversation.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Simple Negative</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fee2e2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #ef4444;">hadn't</span>
                            <span>+</span>
                            <span style="background: #fed7aa; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>hadn't finished</strong> when he called.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">She <strong>hadn't seen</strong> the movie before.</p>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Continuous Negative</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fee2e2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #ef4444;">hadn't been</span>
                            <span>+</span>
                            <span style="background: #c4b5fd; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">verb-ing</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>hadn't been sleeping</strong> well.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">They <strong>hadn't been waiting</strong> long.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-negative",
                    title: "Make It Negative",
                    instructions: "Complete with the negative form.",
                    items: [
                        {
                            type: "text",
                            label: "She was nervous because she ___ (not / fly) before. [Simple]",
                            expectedAnswer: "hadn't flown",
                            placeholder: "hadn't flown",
                        },
                        {
                            type: "text",
                            label: "He ___ (not / work) there long when he got promoted. [Continuous]",
                            expectedAnswer: "hadn't been working",
                            placeholder: "hadn't been working",
                        },
                        {
                            type: "text",
                            label: "We ___ (not / meet) before that day. [Simple]",
                            expectedAnswer: "hadn't met",
                            placeholder: "hadn't met",
                        },
                        {
                            type: "text",
                            label: "I ___ (not / feel) well lately. [Continuous]",
                            expectedAnswer: "hadn't been feeling",
                            placeholder: "hadn't been feeling",
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
                <p>Put <strong>Had</strong> at the beginning of the sentence.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Simple Questions</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #f59e0b;">Had</span>
                            <span>+</span>
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                            <span>+</span>
                            <span style="background: #fed7aa; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                            <span>?</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem;"><strong style="color: #b45309;">What had happened?</strong></p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">Had she finished before you left?</p>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Continuous Questions</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #ede9fe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #8b5cf6;">Had</span>
                            <span>+</span>
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                            <span>+</span>
                            <span style="background: #c4b5fd; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">been + -ing</span>
                            <span>?</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem;"><strong style="color: #6d28d9;">How long had it been going on?</strong></p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">Had you been waiting long?</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-questions",
                    title: "Form Questions",
                    instructions: "Complete the questions.",
                    items: [
                        {
                            type: "text",
                            label: "___ you ___ (see) the movie before? [Simple]",
                            expectedAnswer: "Had you seen",
                            placeholder: "Had you seen",
                        },
                        {
                            type: "text",
                            label: "How long ___ she ___ (work) there before she quit? [Continuous]",
                            expectedAnswer: "had she been working",
                            placeholder: "had she been working",
                        },
                        {
                            type: "text",
                            label: "___ they ___ (meet) before the wedding? [Simple]",
                            expectedAnswer: "Had they met",
                            placeholder: "Had they met",
                        },
                        {
                            type: "text",
                            label: "___ you ___ (wait) long when the bus came? [Continuous]",
                            expectedAnswer: "Had you been waiting",
                            placeholder: "Had you been waiting",
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
            icon: "📅",
            stepNumber: 6,
            explanation: `
                <h3>Key Time Words</h3>
                <p>These words help signal which form to use.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Simple Signal Words</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">already</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">just</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">never</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">before</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">after</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">by the time</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">when</span>
                        </div>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Continuous Signal Words</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">for + duration</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">since</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">all day/morning</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">how long</span>
                        </div>
                    </div>
                </div>

                <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">Quick Rule</h4>
                    <p style="margin: 0;"><strong>For/Since + duration</strong> before another past event → usually Continuous</p>
                    <p style="margin: 0.5rem 0 0 0;"><strong>Already/just/before + result</strong> → usually Simple</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-time-words",
                    title: "Which Form?",
                    instructions: "Choose Simple or Continuous based on the signal words.",
                    items: [
                        {
                            type: "radio",
                            label: "She had ___ finished when I arrived. (already)",
                            options: [
                                { value: "simple", label: "Simple: had already finished" },
                                { value: "continuous", label: "Continuous: had been already finishing" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "They had ___ for 3 hours when the rain stopped. (for + duration)",
                            options: [
                                { value: "simple", label: "Simple: had waited" },
                                { value: "continuous", label: "Continuous: had been waiting" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "I had ___ seen snow before that day. (never)",
                            options: [
                                { value: "simple", label: "Simple: had never seen" },
                                { value: "continuous", label: "Continuous: had never been seeing" },
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
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 1: Using Past Perfect with Only ONE Action</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> I had eaten lunch yesterday.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> I ate lunch yesterday.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Past Perfect needs TWO past references. For single past actions, use Past Simple.</p>
                </div>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 2: Using Past Perfect for BOTH Actions</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> She had finished before she had left.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> She had finished before she left.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Only the FIRST action uses Past Perfect. The second uses Past Simple.</p>
                </div>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #dc2626;">❌ Mistake 3: Confusing with Present Perfect</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626;"><strong>Wrong:</strong> When I arrived, she has left.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a;"><strong>Correct:</strong> When I arrived, she had left.</p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Past Perfect (had) looks back from a past moment. Present Perfect (have/has) connects to NOW.</p>
                </div>
            `,
            comparison: {
                title: "Past Perfect vs Past Simple",
                leftLabel: "Past Perfect (First Action)",
                rightLabel: "Past Simple (Second/Single Action)",
                rows: [
                    {
                        label: "Purpose",
                        left: "Shows which of TWO past actions happened FIRST",
                        right: "Describes a completed past action (can stand alone)",
                    },
                    {
                        label: "Formula",
                        left: "had + past participle",
                        right: "verb + -ed or irregular past",
                    },
                    {
                        label: "Example",
                        left: "When I arrived, she had left.",
                        right: "She left at 5pm.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-pp-mistakes",
                    title: "Fix the Mistakes",
                    instructions: "Choose the CORRECT version.",
                    items: [
                        {
                            type: "radio",
                            label: "Single past action:",
                            options: [
                                { value: "wrong", label: "I had visited Paris last year." },
                                { value: "correct", label: "I visited Paris last year." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Two past actions:",
                            options: [
                                { value: "wrong", label: "When I arrived, she already left." },
                                { value: "correct", label: "When I arrived, she had already left." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Past Perfect for first action only:",
                            options: [
                                { value: "wrong", label: "After he had eaten, he had watched TV." },
                                { value: "correct", label: "After he had eaten, he watched TV." },
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
            title: "Mixed Practice: Storytelling",
            icon: "📖",
            stepNumber: 8,
            explanation: `
                <h3>Put It All Together!</h3>
                <p>In real storytelling, we use both forms to paint a complete picture of the past.</p>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #64748b;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #475569;">Example Story</h4>
                    <p style="margin: 0; line-height: 1.8;">
                        "When Maria <span style="color: #14b8a6; font-weight: 600;">arrived</span> at the job interview,
                        she was nervous. She <span style="color: #8b5cf6; font-weight: 600;">had been preparing</span> for weeks,
                        but she <span style="color: #f59e0b; font-weight: 600;">had never done</span> an interview in English before.
                        Luckily, she <span style="color: #f59e0b; font-weight: 600;">had practiced</span> her answers with a friend."
                    </p>
                </div>

                <h4>Decision Guide:</h4>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li><strong>What happened first?</strong> → Simple (had + past participle)</li>
                    <li><strong>How long before?</strong> → Continuous (had been + -ing)</li>
                    <li><strong>Background/cause?</strong> → Usually Continuous</li>
                    <li><strong>Result/completion?</strong> → Usually Simple</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-pp-mixed",
                    title: "Complete the Story",
                    instructions: "Choose Simple or Continuous based on context.",
                    items: [
                        {
                            type: "radio",
                            label: "By the time I got to the station, the train ___ .",
                            options: [
                                { value: "simple", label: "had already left (result: train is gone)" },
                                { value: "continuous", label: "had been leaving (duration)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "She was exhausted because she ___ all night for the exam.",
                            options: [
                                { value: "simple", label: "had studied (completed action)" },
                                { value: "continuous", label: "had been studying (duration: all night)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "He couldn't pay the rent because he ___ his job.",
                            options: [
                                { value: "simple", label: "had lost (result: no job now)" },
                                { value: "continuous", label: "had been losing (ongoing loss)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "The road was wet. It ___ earlier.",
                            options: [
                                { value: "simple", label: "had rained (it rained and stopped)" },
                                { value: "continuous", label: "had been raining (evidence of recent activity)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
                {
                    id: "ex-pp-fill-story",
                    title: "Your Turn: Complete the Sentences",
                    instructions: "Fill in with the correct form.",
                    items: [
                        {
                            type: "text",
                            label: "When the landlord inspected the apartment, we ___ (already / clean) everything.",
                            expectedAnswer: "had already cleaned",
                            placeholder: "had already cleaned",
                        },
                        {
                            type: "text",
                            label: "They ___ (live) in that neighborhood for 5 years before they moved.",
                            expectedAnswer: "had been living",
                            placeholder: "had been living",
                        },
                        {
                            type: "text",
                            label: "I got the job because I ___ (prepare) well for the interview.",
                            expectedAnswer: "had prepared",
                            placeholder: "had prepared",
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
            title: "Summary: The Past Perfect Family",
            icon: "📋",
            stepNumber: 9,
            explanation: `
                <h3>What You've Learned</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #b45309;">The Time Traveler (Simple)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> had + past participle</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> What happened FIRST</p>
                        <p style="margin: 0;"><strong>Key words:</strong> already, just, before, after, by the time, when, never</p>
                    </div>
                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6d28d9;">The Background Painter (Continuous)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> had been + verb-ing</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> How LONG before</p>
                        <p style="margin: 0;"><strong>Key words:</strong> for, since, all day/morning, how long</p>
                    </div>
                </div>

                <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">🎯 The Golden Rules</h4>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>Both forms need <strong>TWO past references</strong></li>
                        <li>Past Perfect = FIRST action; Past Simple = SECOND action</li>
                        <li>Simple for <strong>sequence/result</strong>; Continuous for <strong>duration/background</strong></li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "🚀 Keep Practicing!",
                content: "The Past Perfect Family is essential for storytelling. Practice by retelling events from your day or week, emphasizing what happened first and how long things took!"
            },
        },
    ],

    // -------------------------------------------------------------------------
    // Mini Quiz: 15 Questions
    // -------------------------------------------------------------------------
    miniQuiz: [
        // Concepts & Usage (1-5)
        {
            id: "ppf-q1",
            question: "When do we use Past Perfect Simple?",
            options: [
                { value: "a", label: "To show how long something took" },
                { value: "b", label: "To show which of two past actions happened FIRST" },
                { value: "c", label: "To describe current situations" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Simple shows sequence - which action happened first in a story about the past.",
        },
        {
            id: "ppf-q2",
            question: "When do we use Past Perfect Continuous?",
            options: [
                { value: "a", label: "To show duration BEFORE another past event" },
                { value: "b", label: "To count completed actions" },
                { value: "c", label: "To talk about future plans" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect Continuous shows how long something had been happening before another past moment.",
        },
        {
            id: "ppf-q3",
            question: "\"When I arrived, the movie had started.\" Which action happened first?",
            options: [
                { value: "a", label: "I arrived" },
                { value: "b", label: "The movie started" },
            ],
            correctAnswer: "b",
            explanation: "The action with Past Perfect (had started) happened FIRST.",
        },
        {
            id: "ppf-q4",
            question: "Why is this sentence wrong? \"I had eaten lunch yesterday.\"",
            options: [
                { value: "a", label: "The verb form is wrong" },
                { value: "b", label: "Past Perfect needs TWO past references, not just one" },
                { value: "c", label: "\"Lunch\" should be \"dinner\"" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect needs two past actions or times. For a single past action, use Past Simple: \"I ate lunch yesterday.\"",
        },
        {
            id: "ppf-q5",
            question: "\"She was exhausted because she had been working all day.\" What's the focus?",
            options: [
                { value: "a", label: "The result of finishing work" },
                { value: "b", label: "The duration of working (all day)" },
                { value: "c", label: "What she will do tomorrow" },
            ],
            correctAnswer: "b",
            explanation: "\"All day\" emphasizes duration, so we use Continuous to paint the background for why she was exhausted.",
        },

        // Sentence Completion (6-10)
        {
            id: "ppf-q6",
            question: "By the time the ambulance arrived, the patient ___ .",
            options: [
                { value: "a", label: "had already died" },
                { value: "b", label: "has already died" },
                { value: "c", label: "already died" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect Simple shows the first action (dying) happened before the second (ambulance arrived).",
        },
        {
            id: "ppf-q7",
            question: "She was nervous because she ___ an interview before.",
            options: [
                { value: "a", label: "had never done" },
                { value: "b", label: "had never been doing" },
                { value: "c", label: "never did" },
            ],
            correctAnswer: "a",
            explanation: "\"Never\" + completion = Simple. She had no interview experience before that moment.",
        },
        {
            id: "ppf-q8",
            question: "They ___ in that apartment for 10 years when they decided to move.",
            options: [
                { value: "a", label: "lived" },
                { value: "b", label: "had been living" },
                { value: "c", label: "have been living" },
            ],
            correctAnswer: "b",
            explanation: "\"For 10 years\" emphasizes duration before the decision, so we use Continuous.",
        },
        {
            id: "ppf-q9",
            question: "After she ___ her homework, she watched TV.",
            options: [
                { value: "a", label: "had finished" },
                { value: "b", label: "had been finishing" },
                { value: "c", label: "has finished" },
            ],
            correctAnswer: "a",
            explanation: "\"After\" shows sequence. The first action (finish) uses Past Perfect Simple.",
        },
        {
            id: "ppf-q10",
            question: "How long ___ you ___ before the bus came?",
            options: [
                { value: "a", label: "had / waited" },
                { value: "b", label: "had / been waiting" },
                { value: "c", label: "have / been waiting" },
            ],
            correctAnswer: "b",
            explanation: "\"How long\" asks about duration, so we use Continuous.",
        },

        // Form Accuracy (11-13)
        {
            id: "ppf-q11",
            question: "What is the correct negative form of \"She had finished\"?",
            options: [
                { value: "a", label: "She hadn't finished" },
                { value: "b", label: "She hasn't finished" },
                { value: "c", label: "She didn't finished" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect negative: had not (hadn't) + past participle.",
        },
        {
            id: "ppf-q12",
            question: "Which question form is correct?",
            options: [
                { value: "a", label: "Had they been working all day?" },
                { value: "b", label: "Did they had been working all day?" },
                { value: "c", label: "Were they had been working all day?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Had + subject + been + verb-ing?",
        },
        {
            id: "ppf-q13",
            question: "Choose the correct structure for Past Perfect Continuous:",
            options: [
                { value: "a", label: "had + past participle" },
                { value: "b", label: "had been + verb-ing" },
                { value: "c", label: "have been + verb-ing" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Continuous: had been + verb-ing (e.g., had been working).",
        },

        // Error Identification (14-15)
        {
            id: "ppf-q14",
            question: "Is this correct? \"She had finished her work before she had gone home.\"",
            options: [
                { value: "a", label: "Yes, it's correct" },
                { value: "b", label: "No - only the FIRST action should use Past Perfect" },
            ],
            correctAnswer: "b",
            explanation: "Only the first action uses Past Perfect. Correct: \"She had finished her work before she went home.\"",
        },
        {
            id: "ppf-q15",
            question: "Choose the best summary of the Past Perfect Family:",
            options: [
                { value: "a", label: "Simple shows sequence (first action); Continuous shows duration before" },
                { value: "b", label: "Both forms are exactly the same" },
                { value: "c", label: "Simple is for present; Continuous is for past" },
            ],
            correctAnswer: "a",
            explanation: "This is the core distinction: Simple = what happened first; Continuous = how long before.",
        },
    ],
};
