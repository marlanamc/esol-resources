import type { InteractiveGuideContent } from "@/types/activity";

export const usedToWouldRatherContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Used To & Would Rather: Talking About Past Habits and Preferences",
            icon: "🕰️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"I used to smoke, but I quit." "I'd rather walk than drive." These structures help you talk about how things were different in the past and what you prefer now. Essential for discussing health changes, work habits, and lifestyle improvements.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>These structures are critical for:</p>
                <ul>
                    <li><strong>Doctor visits:</strong> "I used to have headaches every day." "I'd rather try exercise before medication."</li>
                    <li><strong>Job interviews:</strong> "I used to work in retail." "I'd rather have flexible hours."</li>
                    <li><strong>Goal setting:</strong> "I used to skip breakfast, but now I eat healthy." "I'd rather save money than eat out."</li>
                </ul>
            `,
        },

        {
            id: "used-to-basics",
            stepNumber: 1,
            title: "Used To: Past Habits That Are No Longer True",
            icon: "⏮️",
            explanation: `
                <h3>What Is "Used To"?</h3>
                <p><strong>Used to</strong> describes habits or states that were true in the past but are NOT true now.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">Subject + used to + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>I <strong>used to smoke</strong>. (I don't smoke now)</li>
                        <li>She <strong>used to work</strong> nights. (She doesn't work nights now)</li>
                        <li>We <strong>used to live</strong> in Mexico. (We don't live there now)</li>
                        <li>He <strong>used to drink</strong> soda every day. (He doesn't anymore)</li>
                    </ul>
                </div>

                <h3>Negative Form</h3>
                <p style="font-weight: bold; color: #d97757;">Subject + didn't use to + base verb</p>
                <p style="font-style: italic;">⚠️ Notice: "didn't <strong>use</strong> to" (no d!)</p>
                <ul>
                    <li>I <strong>didn't use to</strong> exercise. (Now I do)</li>
                    <li>She <strong>didn't use to</strong> eat vegetables. (Now she does)</li>
                </ul>

                <h3>Question Form</h3>
                <p style="font-weight: bold; color: #d97757;">Did + subject + use to + base verb?</p>
                <ul>
                    <li><strong>Did you use to</strong> smoke?</li>
                    <li><strong>Did he use to</strong> work here?</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Common Mistake",
                content: "DON'T say: \"I am used to exercise\" or \"I used to exercising.\" ✅ SAY: \"I used to exercise.\" (base verb, no -ing!)",
            },
        },

        {
            id: "would-past-habits",
            stepNumber: 2,
            title: "Would: Repeated Past Actions",
            icon: "🔁",
            explanation: `
                <h3>Would for Past Habits</h3>
                <p><strong>Would</strong> can also describe repeated actions in the past. It's more formal and literary than "used to."</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">Subject + would + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>Every morning, I <strong>would</strong> go for a run. (= I used to go for a run)</li>
                        <li>My grandmother <strong>would</strong> make us breakfast. (= She used to make us breakfast)</li>
                        <li>We <strong>would</strong> walk to work together. (= We used to walk to work)</li>
                    </ul>
                </div>

                <h3>Used To vs Would: What's the Difference?</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Used To</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Would</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Habits AND states</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Only repeated actions (NOT states)</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">✅ "I used to be shy."</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">❌ "I would be shy." (WRONG)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">More common in everyday speech</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">More formal/literary</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">✅ "I used to smoke."</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">✅ "I would smoke a pack a day."</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Key Difference",
                content: "Use 'would' only for repeated ACTIONS. For states (be, have, live, know), use 'used to' only.",
            },
        },

        {
            id: "would-rather",
            stepNumber: 3,
            title: "Would Rather: Expressing Preferences",
            icon: "⚖️",
            explanation: `
                <h3>What Is "Would Rather"?</h3>
                <p><strong>Would rather</strong> = I prefer (one thing over another). This is about what you WANT, not what you did in the past.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d4a843;">Subject + would rather + base verb</p>
                    <p style="font-style: italic; margin-top: 0.5rem;">(Contraction: I'd rather, She'd rather, etc.)</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>I <strong>would rather walk</strong> than drive. (= I prefer walking)</li>
                        <li>She <strong>'d rather work</strong> from home. (= She prefers working from home)</li>
                        <li>We <strong>'d rather eat</strong> healthy food. (= We prefer healthy food)</li>
                        <li>He <strong>'d rather not smoke</strong>. (= He prefers not to smoke)</li>
                    </ul>
                </div>

                <h3>Comparing Two Options</h3>
                <p>Use <strong>would rather... than...</strong> to compare preferences:</p>
                <ul>
                    <li>I'd rather <strong>cook at home</strong> than <strong>eat out</strong>.</li>
                    <li>She'd rather <strong>take the stairs</strong> than <strong>use the elevator</strong>.</li>
                    <li>I'd rather <strong>have flexible hours</strong> than <strong>work 9-5</strong>.</li>
                </ul>

                <h3>Negative Form</h3>
                <p style="font-weight: bold; color: #d97757;">would rather not + base verb</p>
                <ul>
                    <li>I'd <strong>rather not</strong> work overtime.</li>
                    <li>She'd <strong>rather not</strong> take the bus.</li>
                </ul>
            `,
        },

        {
            id: "real-world-contexts",
            stepNumber: 4,
            title: "Real-World Contexts: Health & Work",
            icon: "🏥",
            explanation: `
                <h3>Health & Wellness Contexts</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #7ba884;">Talking to Your Doctor</h4>
                    <p><strong>Used to:</strong></p>
                    <ul>
                        <li>"I <strong>used to</strong> have headaches every day, but now they're rare."</li>
                        <li>"I <strong>didn't use to</strong> exercise, but now I walk 30 minutes daily."</li>
                        <li>"I <strong>used to</strong> eat fast food for every meal."</li>
                    </ul>
                    <p><strong>Would rather (preferences):</strong></p>
                    <ul>
                        <li>"I'd <strong>rather</strong> try physical therapy than take pills."</li>
                        <li>"I'd <strong>rather</strong> see a specialist if possible."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d97757;">Work & Career Discussions</h4>
                    <p><strong>Used to:</strong></p>
                    <ul>
                        <li>"I <strong>used to</strong> work in construction."</li>
                        <li>"I <strong>didn't use to</strong> have benefits at my old job."</li>
                        <li>"I <strong>used to</strong> commute two hours each way."</li>
                    </ul>
                    <p><strong>Would rather (preferences):</strong></p>
                    <ul>
                        <li>"I'd <strong>rather</strong> work day shifts than nights."</li>
                        <li>"I'd <strong>rather</strong> have weekends off."</li>
                        <li>"I'd <strong>rather</strong> start at $18/hour than accept $15."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d4a843;">Goal Setting & Progress</h4>
                    <p><strong>Contrasting then vs now:</strong></p>
                    <ul>
                        <li>"I <strong>used to</strong> skip breakfast, but now I eat oatmeal every morning."</li>
                        <li>"I <strong>used to</strong> stay up late, but now I sleep 8 hours."</li>
                        <li>"I <strong>didn't use to</strong> save money, but now I save $200/month."</li>
                    </ul>
                </div>
            `,
        },

        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Wrong Verb Form</h3>
                <ul>
                    <li>❌ "I used to <strong>smoking</strong>." → ✅ "I used to <strong>smoke</strong>."</li>
                    <li>❌ "I'd rather <strong>working</strong> from home." → ✅ "I'd rather <strong>work</strong> from home."</li>
                </ul>

                <h3>Mistake #2: Using "d" in Negative</h3>
                <ul>
                    <li>❌ "I didn't <strong>used</strong> to exercise." → ✅ "I didn't <strong>use</strong> to exercise."</li>
                    <li>❌ "Did you <strong>used</strong> to smoke?" → ✅ "Did you <strong>use</strong> to smoke?"</li>
                </ul>

                <h3>Mistake #3: Using "Would" for States</h3>
                <ul>
                    <li>❌ "I <strong>would</strong> be shy." → ✅ "I <strong>used to</strong> be shy."</li>
                    <li>❌ "She <strong>would</strong> have long hair." → ✅ "She <strong>used to</strong> have long hair."</li>
                </ul>

                <h3>Mistake #4: Confusing "Used To" with "Be Used To"</h3>
                <ul>
                    <li><strong>Used to</strong> = past habit: "I <strong>used to</strong> smoke." (I smoked before, not now)</li>
                    <li><strong>Be used to</strong> = be accustomed to: "I <strong>am used to</strong> waking up early." (I'm comfortable with it)</li>
                </ul>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                    <p style="font-weight: bold; margin: 0;">These are DIFFERENT structures with DIFFERENT meanings!</p>
                </div>
            `,
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "used-to-would-rather-ex-1",
                    title: "Exercise 1: Used To (Past Habit)",
                    instructions: "Choose the best completion.",
                    items: [
                        {
                            type: "select",
                            label: "I _____, but I quit 5 years ago.",
                            options: ["used to smoke", "am used to smoking", "use to smoke", "used to smoking"],
                            expectedAnswer: "used to smoke",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-2",
                    title: "Exercise 2: Would Rather",
                    instructions: "Choose the correct phrase.",
                    items: [
                        {
                            type: "select",
                            label: "I'd _____ than drive to work.",
                            options: ["rather walk", "used to walk", "would walking", "rather to walk"],
                            expectedAnswer: "rather walk",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-3",
                    title: "Exercise 3: Negative Used To",
                    instructions: "Choose the correct form.",
                    items: [
                        {
                            type: "select",
                            label: "She _____ before, but now she goes to the gym daily.",
                            options: ["didn't use to exercise", "doesn't use to exercise", "didn't used to exercise", "wouldn't exercise"],
                            expectedAnswer: "didn't use to exercise",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-4",
                    title: "Exercise 4: Would (Repeated Past Action)",
                    instructions: "Choose the best completion.",
                    items: [
                        {
                            type: "select",
                            label: "Every summer, we _____ to the beach.",
                            options: ["would go", "used to going", "would to go", "are used to go"],
                            expectedAnswer: "would go",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-5",
                    title: "Exercise 5: Two Blanks",
                    instructions: "Complete both blanks.",
                    items: [
                        {
                            type: "select",
                            label: "I'd rather _____ the bus than walk 2 hours.",
                            options: ["take", "taking", "to take", "took"],
                            expectedAnswer: "take",
                        },
                        {
                            type: "select",
                            label: "I'd rather take the bus than _____ 2 hours.",
                            options: ["walk", "walking", "to walk", "walked"],
                            expectedAnswer: "walk",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-6",
                    title: "Exercise 6: Fix the Error",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: "I used to smoking a lot."',
                            options: [
                                { value: "a", label: "I used to smoke a lot." },
                                { value: "b", label: "I used to smoking a lot." },
                                { value: "c", label: "I use to smoked a lot." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-7",
                    title: "Exercise 7: Question Form",
                    instructions: "Complete both blanks.",
                    items: [
                        {
                            type: "select",
                            label: "_____ you _____ in Mexico?",
                            options: ["Did", "Do", "Were", "Are"],
                            expectedAnswer: "Did",
                        },
                        {
                            type: "select",
                            label: "Did you _____ in Mexico?",
                            options: ["use to live", "used to live", "to live", "living"],
                            expectedAnswer: "use to live",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-8",
                    title: "Exercise 8: Negative Would Rather",
                    instructions: "Choose the correct completion.",
                    items: [
                        {
                            type: "select",
                            label: "He'd rather _____ overtime.",
                            options: ["not work", "don't work", "not to work", "doesn't work"],
                            expectedAnswer: "not work",
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
                <h3>Used To (Past Habits)</h3>
                <ul>
                    <li><strong>Positive:</strong> Subject + used to + base verb</li>
                    <li><strong>Negative:</strong> Subject + didn't use to + base verb</li>
                    <li><strong>Question:</strong> Did + subject + use to + base verb?</li>
                    <li><strong>Example:</strong> "I used to smoke." / "I didn't use to exercise." / "Did you use to work here?"</li>
                </ul>

                <h3>Would (Repeated Past Actions)</h3>
                <ul>
                    <li><strong>Formula:</strong> Subject + would + base verb</li>
                    <li><strong>Example:</strong> "Every morning, I would go for a run."</li>
                    <li><strong>Remember:</strong> Only for ACTIONS, not states!</li>
                </ul>

                <h3>Would Rather (Preferences)</h3>
                <ul>
                    <li><strong>Positive:</strong> Subject + would rather + base verb</li>
                    <li><strong>Comparison:</strong> would rather... than...</li>
                    <li><strong>Negative:</strong> would rather not + base verb</li>
                    <li><strong>Example:</strong> "I'd rather walk than drive." / "I'd rather not smoke."</li>
                </ul>

                <h3>Key Differences</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Structure</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Meaning</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Used to</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Past habit (not now)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I used to smoke.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Would</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Repeated past action</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I would smoke after meals.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Would rather</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Preference (present/future)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I'd rather not smoke.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Used to = past (then). Would rather = preference (now). Don't confuse them!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Complete: I _____ eat fast food every day, but now I cook at home.",
            options: [
                { value: "a", label: "use to" },
                { value: "b", label: "used to" },
                { value: "c", label: "would rather" },
            ],
            correctAnswer: "b",
            explanation: "'Used to' describes a past habit that is no longer true.",
        },
        {
            id: "quiz-2",
            question: "Which is correct for expressing a preference?",
            options: [
                { value: "a", label: "I'd rather walk than drive." },
                { value: "b", label: "I'd rather to walk than drive." },
                { value: "c", label: "I'd rather walking than driving." },
            ],
            correctAnswer: "a",
            explanation: "'Would rather' is followed by the base verb (no 'to', no '-ing').",
        },
        {
            id: "quiz-3",
            question: "Complete the negative: She _____ exercise, but now she does.",
            options: [
                { value: "a", label: "didn't used to" },
                { value: "b", label: "didn't use to" },
                { value: "c", label: "wouldn't" },
            ],
            correctAnswer: "b",
            explanation: "In negatives, use 'didn't use to' (no 'd' on 'use').",
        },
        {
            id: "quiz-4",
            question: "Which sentence is INCORRECT?",
            options: [
                { value: "a", label: "I used to be shy." },
                { value: "b", label: "I would be shy." },
                { value: "c", label: "I used to work nights." },
            ],
            correctAnswer: "b",
            explanation: "'Would' cannot be used for states like 'be'. Use 'used to' instead.",
        },
        {
            id: "quiz-5",
            question: "Complete: Every morning, I _____ go for a run.",
            options: [
                { value: "a", label: "used to" },
                { value: "b", label: "would" },
                { value: "c", label: "Both A and B are correct" },
            ],
            correctAnswer: "c",
            explanation: "Both 'used to' and 'would' can describe repeated past actions.",
        },
        {
            id: "quiz-6",
            question: "What does 'I'd rather work from home' mean?",
            options: [
                { value: "a", label: "I worked from home in the past." },
                { value: "b", label: "I prefer to work from home." },
                { value: "c", label: "I will work from home." },
            ],
            correctAnswer: "b",
            explanation: "'Would rather' expresses a preference, not a past action or future plan.",
        },
    ],
};
