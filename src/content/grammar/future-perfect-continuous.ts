import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Future Perfect Continuous: How Long Will You Have Been Doing That?",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #06b6d4; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Future Perfect Continuous shows <strong style="color: #06b6d4;">how long</strong> an action will have been happening <strong style="color: #a855f7;">by a future point</strong>. It's the rarest tense, but useful for milestones!</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Duration up to a future point</strong>: "By June, I will have been working here for 10 years."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Cause of a future situation</strong>: "She will be tired because she will have been traveling all day."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #06b6d4; font-size: 1.125rem;">will have been + verb-ing</span></p>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; font-size: 0.9rem;"><strong>📌 Note:</strong> This is the least common tense in English. You'll hear it occasionally, but don't worry if it feels advanced—focus on understanding it when you hear it!</p>
                </div>
            `,
            exercises: [
                {
                    id: "future-perfect-continuous-intro-1",
                    title: "Practice: Understanding Future Perfect Continuous",
                    instructions: "Identify what Future Perfect Continuous shows.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Future Perfect Continuous show?",
                            options: [
                                { value: "a", label: "How long an action will have been happening by a future point" },
                                { value: "b", label: "Current ongoing actions" },
                                { value: "c", label: "Completed past actions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"By June, I will have been working here for 10 years." What does this show?',
                            options: [
                                { value: "a", label: "Duration (10 years) up to a future point (June)" },
                                { value: "b", label: "A current action" },
                                { value: "c", label: "A past action" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Future Perfect Continuous?",
                            options: [
                                { value: "a", label: "will have been + verb-ing" },
                                { value: "b", label: "have/has been + verb-ing" },
                                { value: "c", label: "had been + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Perfect Continuous",
            icon: "⭐",
            explanation: `
                <h3>The Key Question: "How long will this have been happening by then?"</h3>
                <p>This tense combines <strong>duration</strong> (continuous) with <strong>completion by a future point</strong> (perfect). It's perfect for work anniversaries and milestones!</p>
            `,
            usageMeanings: [
                {
                    title: "⏱️ 1. Duration Up to a Future Point",
                    description: "How long something will have been happening by a specific future time",
                    examples: [
                        {
                            sentence: "By next month, I <strong>will have been working</strong> here <strong>for 5 years</strong>.",
                            explanation: "✓ Duration (5 years) reaching a future milestone",
                        },
                        {
                            sentence: "By December, she <strong>will have been studying</strong> English <strong>for 3 years</strong>.",
                            explanation: "✓ Duration up to a future point",
                        },
                        {
                            sentence: "By the time you arrive, I <strong>will have been waiting</strong> <strong>for 2 hours</strong>.",
                            explanation: "✓ Duration before a future event",
                        },
                    ],
                },
                {
                    title: "💡 2. Explaining a Future Situation",
                    description: "Why something will be the way it is at a future time",
                    examples: [
                        {
                            sentence: "She'll be exhausted because she <strong>will have been traveling</strong> all day.",
                            explanation: "✓ Future state explained by ongoing action",
                        },
                        {
                            sentence: "He'll need a break—he <strong>will have been driving</strong> for 8 hours.",
                            explanation: "✓ Future need explained by duration",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 When to Use This Tense",
                content: "Use Future Perfect Continuous for work anniversaries, study milestones, or any time you want to emphasize HOW LONG something will have been happening BY a future date.",
            },
            exercises: [
                {
                    id: "ex-usage-fpc-1",
                    title: "Practice: Why Future Perfect Continuous Here?",
                    instructions: "Choose the best reason we use Future Perfect Continuous in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"By next year, I will have been working here for 10 years."',
                            options: [
                                { value: "duration", label: "Duration up to a future point" },
                                { value: "prediction", label: "Simple prediction" },
                                { value: "habit", label: "Regular habit" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: '"She will be tired because she will have been traveling all day."',
                            options: [
                                { value: "duration", label: "Duration up to a future point" },
                                { value: "cause", label: "Explaining a future situation" },
                                { value: "past", label: "Past action" },
                            ],
                            expectedAnswer: "cause",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization
        {
            id: "timeline",
            stepNumber: 2,
            title: "Timeline: Duration Up to a Future Point",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Timeline Visually</h3>
                <p>Future Perfect Continuous shows an action that <strong>started before</strong> and <strong>continues up to a future point</strong>.</p>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Duration Up to Future Point</h4>

                    <div style="position: relative; margin: 2rem auto; max-width: 650px; padding: 2rem 0;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 50px; background: linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(6, 182, 212, 0.9)); border-radius: 25px; border: 3px solid #06b6d4; display: flex; align-items: center; padding: 0 2rem;">
                            <span style="color: #0e7490; font-weight: 600; font-size: 0.875rem;">will have been working...</span>
                            <!-- Start dot -->
                            <div style="position: absolute; left: 0; top: 50%; width: 10px; height: 10px; background: #06b6d4; border-radius: 50%; transform: translate(-5px, -50%);"></div>
                            <!-- End dot -->
                            <div style="position: absolute; right: 0; top: 50%; width: 10px; height: 10px; background: #06b6d4; border-radius: 50%; transform: translate(5px, -50%);"></div>
                        </div>

                        <!-- NOW marker -->
                        <div style="position: absolute; top: 50%; left: 30%; transform: translate(-50%, -50%);">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 600; color: #475569; border: 2px solid white;">NOW</div>
                        </div>

                        <!-- Future point marker -->
                        <div style="position: absolute; top: -15px; right: 0; transform: translateX(50%);">
                            <div style="width: 60px; height: 60px; border-radius: 50%; background: #a855f7; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: white; border: 3px solid white; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3); text-align: center;">BY<br/>JUNE</div>
                        </div>

                        <!-- Labels -->
                        <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; padding: 0 0.5rem;">
                            <div style="text-align: left;">
                                <div style="font-size: 0.75rem; color: #06b6d4; font-weight: 600;">Started</div>
                                <div style="font-size: 0.7rem; color: #64748b;">5 years ago</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.875rem; color: #06b6d4; font-weight: 700;">← FOR 5 YEARS →</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.75rem; color: #a855f7; font-weight: 600;">Future Point</div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #f0fdfa; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> By June, I <span style="color: #06b6d4; font-weight: 600;">will have been working</span> here <span style="color: #a855f7; font-weight: 600;">for 5 years</span>.</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Future Perfect vs Future Perfect Continuous",
                content: "Future Perfect = action COMPLETE by then. Future Perfect Continuous = action ONGOING for a duration by then. Compare: 'I will have finished' (done) vs 'I will have been working for 5 years' (duration).",
            },
            exercises: [
                {
                    id: "future-perfect-continuous-timeline-1",
                    title: "Practice: Duration Up to a Future Point",
                    instructions: "Choose Future Perfect Continuous when the focus is on how long by a future time.",
                    items: [
                        {
                            type: "radio",
                            label: '"By 6 PM, I ___ for 8 hours."',
                            options: [
                                { value: "will have been working", label: "will have been working" },
                                { value: "will be working", label: "will be working" },
                                { value: "have been working", label: "have been working" },
                            ],
                            expectedAnswer: "will have been working",
                        },
                        {
                            type: "radio",
                            label: "Future Perfect Continuous connects which two ideas?",
                            options: [
                                { value: "a", label: "Duration + a future point (by then)" },
                                { value: "b", label: "A habit + every day" },
                                { value: "c", label: "A finished past action + yesterday" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Complete: By next month, she ___ (study) English for two years.",
                            expectedAnswer: "will have been studying",
                        },
                    ],
                },
            ],
        },

        // Positive Form
        {
            id: "step-positive",
            stepNumber: 3,
            title: "Positive Form",
            explanation: `
                <h3>The Formula</h3>
                <p>Future Perfect Continuous is formed with: <strong>will have been + verb-ing</strong></p>
                <p>Same for all subjects—no changes needed!</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By next month, I <span style="color: #06b6d4; font-weight: 600;">will have been working</span> here for 10 years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By December, she <span style="color: #06b6d4; font-weight: 600;">will have been studying</span> English for 3 years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By the time you arrive, they <span style="color: #06b6d4; font-weight: 600;">will have been waiting</span> for 2 hours.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will have been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Complete with Future Perfect Continuous",
                    instructions: "Use will have been + verb-ing to show duration up to a future point.",
                    items: [
                        {
                            type: "text",
                            label: "1. By next year, I ___ (work) at this company for 5 years.",
                            expectedAnswer: "will have been working",
                        },
                        {
                            type: "text",
                            label: "2. By the time she graduates, she ___ (study) for 4 years.",
                            expectedAnswer: "will have been studying",
                        },
                        {
                            type: "text",
                            label: "3. By midnight, they ___ (drive) for 10 hours.",
                            expectedAnswer: "will have been driving",
                        },
                        {
                            type: "text",
                            label: "4. By June, we ___ (live) in this city for a decade.",
                            expectedAnswer: "will have been living",
                        },
                    ],
                },
            ],
        },

        // Negative Form
        {
            id: "step-negative",
            stepNumber: 4,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>will not have been (won't have been)</strong> + verb-ing.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By next month, I <span style="color: #06b6d4; font-weight: 600;">won't have been working</span> here long enough to qualify.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">won't have been studying</span> long enough to pass the advanced exam.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't have been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use won't have been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "1. By next month, I ___ (not work) here long enough for a promotion.",
                            expectedAnswer: "won't have been working",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (not study) long enough to take the advanced test.",
                            expectedAnswer: "won't have been studying",
                        },
                    ],
                },
            ],
        },

        // Question Form
        {
            id: "step-questions",
            stepNumber: 5,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Will</strong> at the beginning: Will + subject + have been + verb-ing?</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            How long <span style="color: #06b6d4; font-weight: 600;">will</span> you <span style="color: #06b6d4; font-weight: 600;">have been working</span> here by next year?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> she <span style="color: #06b6d4; font-weight: 600;">have been studying</span> long enough by the exam date?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have been + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Future Duration",
                    instructions: "Form questions with Will + subject + have been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "1. How long ___ you ___ (work) here by next June?",
                            expectedAnswer: "will you have been working",
                        },
                        {
                            type: "text",
                            label: "2. ___ she ___ (study) long enough by the exam?",
                            expectedAnswer: "Will she have been studying",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'work' with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ have been working", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ have been working", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I have been working?", expectedAnswer: "Will" },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Duration of an action up to a future point (milestones, anniversaries)</li>
                    <li><strong>Key Questions:</strong> "How long will you have been...?"</li>
                    <li><strong>Positive:</strong> Subject + will have been + verb-ing</li>
                    <li><strong>Negative:</strong> Subject + won't have been + verb-ing</li>
                    <li><strong>Questions:</strong> Will + subject + have been + verb-ing?</li>
                    <li><strong>Time Words:</strong> by next year, by the time, for (duration)</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "This is the rarest tense! Use it for milestones: 'By next year, I will have been working here for 10 years.' Focus on understanding it when you hear it.",
            },
            exercises: [
                {
                    id: "future-perfect-continuous-summary-1",
                    title: "Practice: Key Points Check",
                    instructions: "Review the form and the meaning (how long by a future point).",
                    items: [
                        {
                            type: "select",
                            label: "Choose the missing word: By June, I will ___ been working here for 5 years.",
                            options: ["have", "has", "had"],
                            expectedAnswer: "have",
                        },
                        {
                            type: "radio",
                            label: "Which sentence focuses on duration up to a future time?",
                            options: [
                                { value: "a", label: "By Friday, I will have been training for two weeks." },
                                { value: "b", label: "Right now, I am training for a race." },
                                { value: "c", label: "Yesterday, I trained at the gym." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which time words often appear with Future Perfect Continuous?",
                            options: [
                                { value: "a", label: "by + future time, for + duration" },
                                { value: "b", label: "every day, usually" },
                                { value: "c", label: "yesterday, last week" },
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
            question: "Which sentence correctly uses Future Perfect Continuous?",
            options: [
                { value: "a", label: "By next year, I will have been work here for 5 years." },
                { value: "b", label: "By next year, I will have been working here for 5 years." },
                { value: "c", label: "By next year, I will been working here for 5 years." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous: will have been + verb-ing.",
        },
        {
            id: "quiz-2",
            question: "When do we use Future Perfect Continuous?",
            options: [
                { value: "a", label: "For actions happening right now" },
                { value: "b", label: "For duration of an action up to a future point" },
                { value: "c", label: "For finished past actions" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous = duration up to a future point.",
        },
        {
            id: "quiz-3",
            question: "Choose the correct negative form.",
            options: [
                { value: "a", label: "I won't have been working long enough." },
                { value: "b", label: "I won't have being working long enough." },
                { value: "c", label: "I will haven't been working long enough." },
            ],
            correctAnswer: "a",
            explanation: "Negative: won't have been + verb-ing.",
        },
        {
            id: "quiz-4",
            question: "Which is a good use of Future Perfect Continuous?",
            options: [
                { value: "a", label: "Talking about what you did yesterday" },
                { value: "b", label: "Celebrating a work anniversary milestone" },
                { value: "c", label: "Describing your daily routine" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous is perfect for milestones: 'By June, I will have been working here for 10 years.'",
        },
    ],
};
