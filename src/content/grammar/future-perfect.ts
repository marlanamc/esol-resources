import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Future Perfect: What Will Be Done By Then",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #06b6d4; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Future Perfect looks ahead to a point in the future and says: <strong style="color: #06b6d4;">"By then, this action will be complete."</strong> It's like standing in the future and looking back at what's done.</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Deadlines</strong>: "I will have finished the order by 5 PM."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Milestones</strong>: "By next year, she will have worked here for 10 years."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Predictions about completion</strong>: "They will have left by the time we arrive."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #06b6d4; font-size: 1.125rem;">will have + past participle</span></p>
                </div>
            `,
            exercises: [
                {
                    id: "future-perfect-intro-1",
                    title: "Practice: Understanding Future Perfect",
                    instructions: "Identify what Future Perfect describes.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Future Perfect describe?",
                            options: [
                                { value: "a", label: "Actions that will be complete by a future point" },
                                { value: "b", label: "Current ongoing actions" },
                                { value: "c", label: "Past completed actions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I will have finished the order by 5 PM." What does this show?',
                            options: [
                                { value: "a", label: "Action complete before a deadline (5 PM)" },
                                { value: "b", label: "A current action" },
                                { value: "c", label: "A past action" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Future Perfect?",
                            options: [
                                { value: "a", label: "will have + past participle" },
                                { value: "b", label: "have/has + past participle" },
                                { value: "c", label: "had + past participle" },
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
            title: "When Real Life Needs Future Perfect",
            icon: "⭐",
            explanation: `
                <h3>The Key Question: "Will it be done BY THEN?"</h3>
                <p>Future Perfect always involves a <strong>deadline</strong> or <strong>future reference point</strong>. You're saying an action will be complete before that point.</p>
            `,
            usageMeanings: [
                {
                    title: "⏰ 1. Actions Complete Before a Deadline",
                    description: "Something will be finished before a specific future time",
                    examples: [
                        {
                            sentence: "I <strong>will have finished</strong> my shift <strong>by 6 PM</strong>.",
                            explanation: "✓ Deadline: 6 PM. Action complete before then.",
                        },
                        {
                            sentence: "She <strong>will have cleaned</strong> the kitchen <strong>before the manager arrives</strong>.",
                            explanation: "✓ Deadline: manager's arrival. Kitchen done first.",
                        },
                        {
                            sentence: "They <strong>will have prepared</strong> all the orders <strong>by lunchtime</strong>.",
                            explanation: "✓ Deadline: lunchtime. Orders ready before.",
                        },
                    ],
                },
                {
                    title: "📅 2. Duration Up to a Future Point",
                    description: "How long something will have lasted by a future time",
                    examples: [
                        {
                            sentence: "By next month, I <strong>will have worked</strong> here <strong>for five years</strong>.",
                            explanation: "✓ Duration reaching a milestone",
                        },
                        {
                            sentence: "By December, she <strong>will have lived</strong> in this city <strong>for a decade</strong>.",
                            explanation: "✓ Length of time up to a future point",
                        },
                    ],
                },
                {
                    title: "🔮 3. Predictions About Completion",
                    description: "Guessing what will be done by a certain time",
                    examples: [
                        {
                            sentence: "The bus <strong>will have left</strong> by the time you get there.",
                            explanation: "✓ Prediction: bus gone before you arrive",
                        },
                        {
                            sentence: "Don't worry—they <strong>will have eaten</strong> by now.",
                            explanation: "✓ Assumption about what's already done",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 The 'By' Clue",
                content: "Future Perfect almost always uses 'by' (by tomorrow, by next week, by the time...). If you see 'by + future time,' think Future Perfect!",
            },
            exercises: [
                {
                    id: "ex-usage-fp-1",
                    title: "Practice: Why Future Perfect Here?",
                    instructions: "Choose the best reason we use Future Perfect in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"I <span class=\'eg-helper\'>will have</span> <span class=\'eg-verb\'>finished</span> the report by Friday."',
                            options: [
                                { value: "deadline", label: "Action complete before a deadline" },
                                { value: "habit", label: "Regular habit" },
                                { value: "now", label: "Happening right now" },
                            ],
                            expectedAnswer: "deadline",
                        },
                        {
                            type: "radio",
                            label: '"By next year, she <span class=\'eg-helper\'>will have</span> <span class=\'eg-verb\'>worked</span> here for 20 years."',
                            options: [
                                { value: "duration", label: "Duration up to a future point" },
                                { value: "prediction", label: "Simple prediction" },
                                { value: "past", label: "Past action" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: '"The store <span class=\'eg-helper\'>will have</span> <span class=\'eg-verb\'>closed</span> by the time we get there."',
                            options: [
                                { value: "prediction", label: "Prediction about completion" },
                                { value: "schedule", label: "Fixed schedule" },
                                { value: "habit", label: "Daily routine" },
                            ],
                            expectedAnswer: "prediction",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization
        {
            id: "timeline",
            stepNumber: 2,
            title: "Timeline: Looking Back from the Future",
            icon: "⏰",
            explanation: `
                <h3>Understanding Future Perfect Visually</h3>
                <p>Imagine standing at a future point and looking back. The action is already complete from that perspective.</p>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Action Complete Before Future Point</h4>

                    <div style="display: flex; align-items: center; justify-content: space-around; position: relative; margin: 2rem 0;">
                        <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 4px; background: linear-gradient(to right, #cbd5e1, #06b6d4, #a855f7); transform: translateY(-50%); z-index: 0;"></div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 70px; height: 70px; border-radius: 50%; background: #cbd5e1; color: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; border: 4px solid white; margin: 0 auto;">
                                NOW
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">Present</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: #06b6d4; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3); margin: 0 auto; text-align: center; padding: 0.25rem;">
                                ACTION<br/>DONE
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #06b6d4; font-weight: 600;">Completed</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 90px; height: 90px; border-radius: 50%; background: #a855f7; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3); margin: 0 auto; text-align: center; padding: 0.25rem;">
                                BY<br/>THEN
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #a855f7; font-weight: 600;">Future Point</div>
                        </div>
                    </div>

                    <div style="background: #f0fdfa; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> I <span style="color: #06b6d4; font-weight: 600;">will have finished</span> my shift <span style="color: #a855f7; font-weight: 600;">by 6 PM</span>.</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Key Difference",
                content: "Future Simple (will finish) = action happens at future time. Future Perfect (will have finished) = action COMPLETE BEFORE future time.",
            },
            exercises: [
                {
                    id: "future-perfect-timeline-1",
                    title: "Practice: Reading the Timeline",
                    instructions: "Use Future Perfect when something will be done before a future point.",
                    items: [
                        {
                            type: "text",
                            label: "Complete: By 5 PM, I ___ (finish) my shift.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "radio",
                            label: 'Which sentence matches the timeline idea "done before we arrive"?',
                            options: [
                                { value: "a", label: "By the time we arrive, they will have left." },
                                { value: "b", label: "By the time we arrive, they will leave." },
                                { value: "c", label: "By the time we arrive, they have left." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Future Perfect answers which question?",
                            options: [
                                { value: "a", label: "Will it be done by then?" },
                                { value: "b", label: "Is it happening right now?" },
                                { value: "c", label: "Is it a daily habit?" },
                            ],
                            expectedAnswer: "a",
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
                <p>Future Perfect is formed with: <strong>will have + past participle</strong></p>
                <p>Same for all subjects—no changes needed!</p>

                <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; padding: 1.5rem; margin: 1.5rem 0; background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border-radius: 0.75rem; border: 2px solid rgba(6, 182, 212, 0.3);">
                    <span style="background: #e0f2fe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">Subject</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #dbeafe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">will have</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #bae6fd; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">past participle</span>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">will have finished</span> my shift by 6 PM.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">will have cleaned</span> the equipment before the next shift.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">will have completed</span> the order by noon.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By next year, we <span style="color: #06b6d4; font-weight: 600;">will have saved</span> enough for a vacation.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will have", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            tipBox: {
                title: "💡 Contraction",
                content: "In speech, we often contract: I'll have, you'll have, she'll have, etc.",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Complete with Future Perfect",
                    instructions: "Use will have + past participle to show actions complete before a deadline.",
                    items: [
                        {
                            type: "text",
                            label: "By the time you arrive, I ___ (cook) dinner.",
                            expectedAnswer: "will have cooked",
                        },
                        {
                            type: "text",
                            label: "She ___ (finish) her training by next month.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "They ___ (leave) by the time we get there.",
                            expectedAnswer: "will have left",
                        },
                        {
                            type: "text",
                            label: "By December, he ___ (work) here for 5 years.",
                            expectedAnswer: "will have worked",
                        },
                        {
                            type: "text",
                            label: "The factory ___ (produce) 1000 units by Friday.",
                            expectedAnswer: "will have produced",
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
                <p>Use <strong>will not have (won't have)</strong> + past participle.</p>

                <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; padding: 1.5rem; margin: 1.5rem 0; background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border-radius: 0.75rem; border: 2px solid rgba(6, 182, 212, 0.3);">
                    <span style="background: #e0f2fe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">Subject</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #dbeafe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">won't have</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #bae6fd; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">past participle</span>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">won't have finished</span> by 5 PM—there's too much work.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">won't have arrived</span> by the time the meeting starts.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">won't have completed</span> the repairs by Monday.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't have", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use won't have + past participle.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (not finish) the order by closing time.",
                            expectedAnswer: "won't have finished",
                        },
                        {
                            type: "text",
                            label: "She ___ (not arrive) before the bus leaves.",
                            expectedAnswer: "won't have arrived",
                        },
                        {
                            type: "text",
                            label: "They ___ (not save) enough money by summer.",
                            expectedAnswer: "won't have saved",
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
                <p>Put <strong>Will</strong> at the beginning: Will + subject + have + past participle?</p>

                <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; padding: 1.5rem; margin: 1.5rem 0; background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border-radius: 0.75rem; border: 2px solid rgba(6, 182, 212, 0.3);">
                    <span style="background: #dbeafe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">Will</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #e0f2fe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">subject</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #dbeafe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">have</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #bae6fd; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">past participle</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">?</span>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> you <span style="color: #06b6d4; font-weight: 600;">have finished</span> by 6 PM?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> she <span style="color: #06b6d4; font-weight: 600;">have completed</span> the training by next week?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> they <span style="color: #06b6d4; font-weight: 600;">have left</span> by the time we arrive?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have + past participle", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Completion",
                    instructions: "Form questions with Will + subject + have + past participle.",
                    items: [
                        {
                            type: "text",
                            label: "___ you ___ (finish) by the time I get back?",
                            expectedAnswer: "Will you have finished",
                        },
                        {
                            type: "text",
                            label: "___ she ___ (complete) the order by noon?",
                            expectedAnswer: "Will she have completed",
                        },
                        {
                            type: "text",
                            label: "___ they ___ (arrive) before the store closes?",
                            expectedAnswer: "Will they have arrived",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'finish' with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ have finished", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ have finished", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I have finished?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 5: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "I will have finish the work by tomorrow.", expectedAnswer: "I will have finished the work by tomorrow" },
                        { type: "text", label: "She will has completed the training by Friday.", expectedAnswer: "She will have completed the training by Friday" },
                        { type: "text", label: "They won't have arrive by 6 PM.", expectedAnswer: "They won't have arrived by 6 PM" },
                    ],
                },
            ],
        },

        // Common Mistakes Section
        {
            id: "common-mistakes",
            title: "Common Mistakes: Future Perfect vs Other Tenses",
            icon: "⚠️",
            explanation: `
                <h3>Don't Confuse These!</h3>
                <p>Future Perfect is often confused with Future Simple and Present Perfect. Here's how to tell them apart:</p>
            `,
            comparison: {
                title: "Future Perfect vs Future Simple",
                leftLabel: "Future Perfect",
                rightLabel: "Future Simple",
                rows: [
                    {
                        label: "Meaning",
                        left: "Action COMPLETE before a future point",
                        right: "Action happens at a future time",
                    },
                    {
                        label: "Time Focus",
                        left: "BY a deadline (before)",
                        right: "AT a time (when)",
                    },
                    {
                        label: "Example",
                        left: "I will have finished BY 6 PM. (done before 6)",
                        right: "I will finish AT 6 PM. (finish happens at 6)",
                    },
                    {
                        label: "Example",
                        left: "She will have left by the time you arrive.",
                        right: "She will leave when you arrive.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Practice: Future Perfect or Future Simple?",
                    instructions: "Choose the correct tense based on the meaning.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ the report BY Friday." (complete before Friday)',
                            options: [
                                { value: "will have finished", label: "will have finished" },
                                { value: "will finish", label: "will finish" },
                            ],
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "radio",
                            label: '"I ___ the report ON Friday." (action happens Friday)',
                            options: [
                                { value: "will have finished", label: "will have finished" },
                                { value: "will finish", label: "will finish" },
                            ],
                            expectedAnswer: "will finish",
                        },
                        {
                            type: "radio",
                            label: '"The bus ___ by the time we get there." (already gone)',
                            options: [
                                { value: "will have left", label: "will have left" },
                                { value: "will leave", label: "will leave" },
                            ],
                            expectedAnswer: "will have left",
                        },
                        {
                            type: "radio",
                            label: '"The bus ___ at 3 PM." (scheduled departure)',
                            options: [
                                { value: "will have left", label: "will have left" },
                                { value: "will leave", label: "will leave" },
                            ],
                            expectedAnswer: "will leave",
                        },
                    ],
                },
            ],
        },

        // Consumer Finance Context Section
        {
            id: "consumer-finance-context",
            stepNumber: 6,
            title: "💳 Consumer & Finance Context",
            icon: "💳",
            explanation: `
                <h3>Future Perfect in Money & Shopping Situations</h3>
                <p>When talking about financial goals, shopping plans, and budget deadlines, Future Perfect helps you explain what will be completed by when.</p>

                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #06b6d4;">🎯 Real Finance Examples</h4>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #06b6d4;">
                            <strong>By December 31st, I <span style="color: #06b6d4;">will have saved</span> $1,000 for emergencies.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">Deadline: Dec 31st → Action complete before then</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #06b6d4;">
                            <strong>Before next course starts, I <span style="color: #06b6d4;">will have paid off</span> my credit card debt.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">Deadline: next course → Action complete before then</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #06b6d4;">
                            <strong>By the end of this month, I <span style="color: #06b6d4;">will have compared</span> all the best laptop options.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">Deadline: end of month → Research complete before then</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #06b6d4;">
                            <strong>Before the return period ends, I <span style="color: #06b6d4;">will have decided</span> whether to keep this item.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">Deadline: return period ends → Decision made before then</span>
                        </div>
                    </div>
                </div>

                <h4>Common Finance Scenarios</h4>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        ✅ <strong>Savings Goals:</strong> "By this time next year, I <strong>will have saved</strong> enough for a down payment."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        ✅ <strong>Shopping Research:</strong> "Before I buy the car, I <strong>will have read</strong> all the reviews."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        ✅ <strong>Bill Payments:</strong> "By the 15th, I <strong>will have paid</strong> all my utility bills."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        ✅ <strong>Consumer Actions:</strong> "By next month, I <strong>will have filed</strong> the warranty claim for my phone."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        ✅ <strong>Bills & Deadlines:</strong> "Before the rent is due, I <strong>will have deposited</strong> my paycheck."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        ✅ <strong>Budget Planning:</strong> "By next week, I <strong>will have contacted</strong> the company about the billing error."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        ✅ <strong>Expense Reduction:</strong> "By this time next year, I <strong>will have reduced</strong> my monthly expenses by 20%."
                    </li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #06b6d4; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #06b6d4;">💬 Speaking Practice</h4>
                    <p style="margin-bottom: 0.75rem; font-weight: 600;">Use these prompts to practice future perfect:</p>
                    <ul style="margin: 0; padding-left: 1.25rem;">
                        <li style="margin-bottom: 0.5rem;">"What financial goals will you have accomplished by the end of this month?"</li>
                        <li style="margin-bottom: 0.5rem;">"Tell me about a big purchase you're planning. What research will you have completed before buying?"</li>
                        <li style="margin-bottom: 0.5rem;">"Describe your budget for next month. What will you have paid off by then?"</li>
                    </ul>
                </div>

                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #a855f7;">📅 Key Time Expressions for Finance Context</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; margin-top: 0.75rem;">
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by tomorrow</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by next week</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by the 15th</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">before payday</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by end of month</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by this time next year</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">before class starts</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by then</span>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #06b6d4;">🎯 Real-Life Applications</h4>
                    <div style="display: grid; gap: 1rem; margin-top: 0.75rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #06b6d4;">
                            <h5 style="margin-top: 0; color: #06b6d4;">Budget Planning</h5>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
                                <li>"By the 1st of next month, I will have created my new budget."</li>
                                <li>"Before winter comes, I will have bought warmer clothes on sale."</li>
                            </ul>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #a855f7;">
                            <h5 style="margin-top: 0; color: #a855f7;">Smart Shopping</h5>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
                                <li>"By this weekend, I will have read all the product reviews."</li>
                                <li>"Before making the purchase, I will have checked for discount codes."</li>
                            </ul>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #06b6d4;">
                            <h5 style="margin-top: 0; color: #06b6d4;">Financial Responsibility</h5>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
                                <li>"By graduation, I will have paid off my student loan interest."</li>
                                <li>"Before moving out, I will have saved enough for first month's rent and deposit."</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: #fee2e2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #ef4444;">❌ Common Mistakes to Avoid</h4>
                    <div style="margin-top: 0.75rem;">
                        <div style="background: white; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 0.75rem;">
                            <p style="margin: 0; color: #ef4444; font-weight: 600;">❌ "I will saved $500 by December."</p>
                            <p style="margin: 0.5rem 0 0 0; color: #059669; font-weight: 600;">✅ "I <strong>will have saved</strong> $500 by December."</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Future perfect requires "will have" + past participle, not "will" + past tense.</p>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 0.75rem;">
                            <p style="margin: 0; color: #ef4444; font-weight: 600;">❌ "By next month, I will finish paying my credit card."</p>
                            <p style="margin: 0.5rem 0 0 0; color: #059669; font-weight: 600;">✅ "By next month, I <strong>will have finished paying</strong> my credit card."</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Use future perfect when you have a specific deadline (by next month).</p>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 0.25rem;">
                            <p style="margin: 0; color: #ef4444; font-weight: 600;">❌ "Before Friday, I will decided about the car purchase."</p>
                            <p style="margin: 0.5rem 0 0 0; color: #059669; font-weight: 600;">✅ "Before Friday, I <strong>will have decided</strong> about the car purchase."</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Don't mix future "will" with past tense - use "will have" + past participle.</p>
                        </div>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-finance-1",
                    title: "Practice: Consumer & Finance Context",
                    instructions: "Complete these finance-related sentences with Future Perfect.",
                    items: [
                        {
                            type: "text",
                            label: "By the end of this year, I ___ (save) $500 for holiday gifts.",
                            expectedAnswer: "will have saved",
                        },
                        {
                            type: "text",
                            label: "Before my next payday, I ___ (spend) my grocery budget carefully.",
                            expectedAnswer: "will have spent",
                        },
                        {
                            type: "text",
                            label: "By this time tomorrow, I ___ (compare) all the insurance options.",
                            expectedAnswer: "will have compared",
                        },
                        {
                            type: "text",
                            label: "Before the sale ends, I ___ (decide) whether to buy the new TV.",
                            expectedAnswer: "will have decided",
                        },
                        {
                            type: "text",
                            label: "By next Monday, I ___ (pay) all the monthly bills.",
                            expectedAnswer: "will have paid",
                        },
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
                    <li><strong>When to Use:</strong> Actions complete BEFORE a future deadline or point</li>
                    <li><strong>Key Signal:</strong> "by" (by tomorrow, by next week, by the time...)</li>
                    <li><strong>Positive:</strong> Subject + will have + past participle</li>
                    <li><strong>Negative:</strong> Subject + won't have + past participle</li>
                    <li><strong>Questions:</strong> Will + subject + have + past participle?</li>
                    <li><strong>Common Time Words:</strong> by tomorrow, by next week, by the time, by then, before</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "Future Perfect = looking back from a future point. Ask: 'Will it be DONE by then?' If yes, use Future Perfect!",
            },
            exercises: [
                {
                    id: "future-perfect-summary-1",
                    title: "Practice: Key Points Check",
                    instructions: "Check the form and meaning of Future Perfect.",
                    items: [
                        {
                            type: "radio",
                            label: "Which time word strongly signals Future Perfect?",
                            options: [
                                { value: "a", label: "by (by tomorrow, by next week, by the time...)" },
                                { value: "b", label: "every day" },
                                { value: "c", label: "yesterday" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "select",
                            label: "Choose the missing word: Will you ___ finished by 6 PM?",
                            options: ["have", "has", "had"],
                            expectedAnswer: "have",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "She will have cleaned the kitchen before the next shift." },
                                { value: "b", label: "She will has cleaned the kitchen before the next shift." },
                                { value: "c", label: "She will have clean the kitchen before the next shift." },
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
            question: "Which sentence correctly uses Future Perfect?",
            options: [
                { value: "a", label: "I will have finish the work by tomorrow." },
                { value: "b", label: "I will have finished the work by tomorrow." },
                { value: "c", label: "I will finished the work by tomorrow." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect: will have + past participle (finished). The verb must be in past participle form.",
        },
        {
            id: "quiz-2",
            question: "Choose the correct negative form.",
            options: [
                { value: "a", label: "She won't have arrived by 6 PM." },
                { value: "b", label: "She will haven't arrived by 6 PM." },
                { value: "c", label: "She won't has arrived by 6 PM." },
            ],
            correctAnswer: "a",
            explanation: "Negative: won't have + past participle. 'Have' never changes.",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Will you have finished by tomorrow?" },
                { value: "b", label: "Will you has finished by tomorrow?" },
                { value: "c", label: "Have you will finished by tomorrow?" },
            ],
            correctAnswer: "a",
            explanation: "Question: Will + subject + have + past participle? 'Will' comes first.",
        },
        {
            id: "quiz-4",
            question: "When do we use Future Perfect instead of Future Simple?",
            options: [
                { value: "a", label: "When the action happens AT a specific time" },
                { value: "b", label: "When the action is complete BEFORE a deadline" },
                { value: "c", label: "When talking about habits" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect = action complete BEFORE a future point. Future Simple = action happens AT a future time.",
        },
        {
            id: "quiz-5",
            question: "Choose the best sentence for: 'complete before the deadline'",
            options: [
                { value: "a", label: "I will finish the order by 5 PM." },
                { value: "b", label: "I will have finished the order by 5 PM." },
                { value: "c", label: "I finished the order by 5 PM." },
            ],
            correctAnswer: "b",
            explanation: "'By 5 PM' signals a deadline → Future Perfect shows completion before that point.",
        },
        {
            id: "quiz-6",
            question: "What's the formula for Future Perfect?",
            options: [
                { value: "a", label: "will have + past participle" },
                { value: "b", label: "have + past participle" },
                { value: "c", label: "will + verb" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect = will have + past participle (V3). Same for all subjects.",
        },
        {
            id: "quiz-7",
            question: "Which word strongly signals Future Perfect?",
            options: [
                { value: "a", label: "by (by tomorrow, by next week)" },
                { value: "b", label: "yesterday" },
                { value: "c", label: "now" },
            ],
            correctAnswer: "a",
            explanation: "'By' + future time signals a deadline—use Future Perfect to show completion before then.",
        },
        {
            id: "quiz-8",
            question: "Fill in: 'By the time you arrive, I ___ (cook) dinner.'",
            options: [
                { value: "a", label: "will have cooked" },
                { value: "b", label: "will cook" },
                { value: "c", label: "am cooking" },
            ],
            correctAnswer: "a",
            explanation: "'By the time you arrive' = future deadline. Cooking will be DONE before you arrive.",
        },
        {
            id: "quiz-9",
            question: "Which is a work milestone example?",
            options: [
                { value: "a", label: "By next month, I will have worked here for 5 years." },
                { value: "b", label: "I work here every day." },
                { value: "c", label: "I worked here last year." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect is perfect for milestones: duration UP TO a future point.",
        },
        {
            id: "quiz-10",
            question: "Fix the error: 'They will have arrive by 6 PM.'",
            options: [
                { value: "a", label: "They will have arrived by 6 PM." },
                { value: "b", label: "They will arrive by 6 PM." },
                { value: "c", label: "They have arrived by 6 PM." },
            ],
            correctAnswer: "a",
            explanation: "After 'will have', use the past participle: 'arrived' not 'arrive'.",
        },
        {
            id: "quiz-11",
            question: "Which sentence looks BACK from a future point?",
            options: [
                { value: "a", label: "By Friday, she will have cleaned the kitchen." },
                { value: "b", label: "She is cleaning the kitchen now." },
                { value: "c", label: "She cleaned the kitchen yesterday." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect = standing at a future point (Friday) and looking back at a completed action.",
        },
        {
            id: "quiz-12",
            question: "Complete: 'Before the meeting starts, I ___ (send) the email.'",
            options: [
                { value: "a", label: "will have sent" },
                { value: "b", label: "send" },
                { value: "c", label: "sent" },
            ],
            correctAnswer: "a",
            explanation: "'Before the meeting starts' = deadline. Email will be DONE before that point.",
        },
        {
            id: "quiz-13",
            question: "Which is correct for a savings goal?",
            options: [
                { value: "a", label: "By December, I will have saved $1,000." },
                { value: "b", label: "By December, I will save $1,000." },
                { value: "c", label: "By December, I saved $1,000." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect emphasizes the savings will be ACCUMULATED by that deadline.",
        },
        {
            id: "quiz-14",
            question: "What's the difference: 'I will finish AT 6' vs 'I will have finished BY 6'?",
            options: [
                { value: "a", label: "AT 6 = action happens at that time; BY 6 = action complete before that time" },
                { value: "b", label: "They mean the same thing" },
                { value: "c", label: "BY 6 is past tense" },
            ],
            correctAnswer: "a",
            explanation: "AT = when it happens. BY = when it's already done. That's the key difference!",
        },
        {
            id: "quiz-15",
            question: "Which prediction uses Future Perfect correctly?",
            options: [
                { value: "a", label: "The bus will have left by the time you get there." },
                { value: "b", label: "The bus left by the time you get there." },
                { value: "c", label: "The bus will leaving by the time you get there." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect makes predictions about what will be COMPLETE by a future moment.",
        },
    ],
};
