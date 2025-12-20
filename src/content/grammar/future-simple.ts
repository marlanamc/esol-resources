import type { InteractiveGuideContent } from "@/types/activity";

export const futureSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Simple: Making Plans & Promises",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(133, 196, 255, 0.12) 0%, rgba(255, 189, 118, 0.12) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem;">
                    <p style="margin: 0; font-size: 1.05rem;">Future Simple is your crystal ball for quick decisions, promises, and predictions. "I'll call you later." "She'll help you." "It'll rain tomorrow."</p>
                </div>
            `,
            exercises: [
                {
                    id: "fs-intro-1",
                    title: "Quick Check: Choose the Best Use",
                    instructions: "Why do we use 'will' here?",
                    items: [
                        {
                            type: "radio",
                            label: "The phone is ringing — I'll answer it.",
                            options: [
                                { value: "decision", label: "Spontaneous decision, right now" },
                                { value: "past", label: "Finished past action" },
                                { value: "habit", label: "Daily routine/habit" },
                            ],
                            expectedAnswer: "decision",
                        },
                    ],
                },
            ],
        },

        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Simple",
            icon: "⭐",
            explanation: `
                <p>Use <strong>will</strong> for quick decisions, promises, offers, and predictions. If the plan is already set, you’re probably in “going to” land instead.</p>
            `,
            usageMeanings: [
                {
                    title: "🔮 1. Predictions",
                    description: "What we think will happen (weather, life, the future)",
                    examples: [
                        {
                            sentence: "It <strong>will rain</strong> tomorrow afternoon.",
                            explanation: "✓ Weather prediction",
                        },
                        {
                            sentence: "The bus <strong>will be</strong> late again—it always is.",
                            explanation: "✓ Life prediction based on experience",
                        },
                    ],
                },
                {
                    title: "🤝 2. Promises & Offers",
                    description: "Things you commit to do",
                    examples: [
                        {
                            sentence: "I <strong>will help</strong> you move this weekend.",
                            explanation: "✓ Offer",
                        },
                        {
                            sentence: "I <strong>will call</strong> you after work tonight.",
                            explanation: "✓ Promise",
                        },
                    ],
                },
                {
                    title: "💡 3. Spontaneous Decisions",
                    description: "Decisions made right now",
                    examples: [
                        {
                            sentence: "The phone is ringing—I <strong>will answer</strong> it.",
                            explanation: "✓ Decision at the moment",
                        },
                        {
                            sentence: "We need snacks. I <strong>will order</strong> pizza.",
                            explanation: "✓ Instant choice",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Will vs Going To",
                content: "Use 'will' for predictions or decisions made now. Use 'going to' for plans arranged before this moment.",
            },
            exercises: [
                {
                    id: "ex-usage-fs-1",
                    title: "Practice: Why Use 'Will'?",
                    instructions: "Choose the best reason to use Future Simple (will) in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I'll pick up your prescription from the pharmacy on my way home.\"",
                            options: [
                                { value: "promise", label: "Promise/offer" },
                                { value: "plan", label: "Pre-planned schedule" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "promise",
                        },
                        {
                            type: "radio",
                            label: "\"The cherry blossoms will bloom in early April.\"",
                            options: [
                                { value: "prediction", label: "Prediction" },
                                { value: "decision", label: "Decision right now" },
                                { value: "routine", label: "Routine" },
                            ],
                            expectedAnswer: "prediction",
                        },
                        {
                            type: "radio",
                            label: "\"Someone's at the door. I'll get it.\"",
                            options: [
                                { value: "decision", label: "Decision made now" },
                                { value: "schedule", label: "Fixed schedule" },
                                { value: "ongoing", label: "Ongoing action" },
                            ],
                            expectedAnswer: "decision",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `
                <h3>How to Form Future Simple (Positive)</h3>
                <p>Formula: <strong>will + base verb</strong>. Same for every subject—no extra endings.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">will finish</span> my homework before dinner.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            You <span style="color: #06b6d4; font-weight: 600;">will love</span> this movie—it's so good.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            He <span style="color: #06b6d4; font-weight: 600;">will call</span> you when he gets home.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">will bring</span> the cake to the party.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            It <span style="color: #06b6d4; font-weight: 600;">will take</span> longer if the traffic is bad.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            We <span style="color: #06b6d4; font-weight: 600;">will meet</span> at the park tomorrow.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">will visit</span> us next month.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            tipBox: {
                title: "✏️ Contractions",
                content: "We often use contractions: I'll, you'll, he'll, she'll, it'll, we'll, they'll",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Say What You'll Do",
                    instructions: "Complete with will + base verb (everyday plans).",
                    items: [
                        {
                            type: "text",
                            label: "1. The museum ___ (open) a new exhibit about ancient Rome next month.",
                            expectedAnswer: "will open",
                        },
                        {
                            type: "text",
                            label: "2. My parents ___ (celebrate) their 30th anniversary in Hawaii.",
                            expectedAnswer: "will celebrate",
                        },
                        {
                            type: "text",
                            label: "3. The doctor ___ (see) you in about 15 minutes.",
                            expectedAnswer: "will see",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>will not (won't)</strong> + base verb.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">won't eat</span> sugar this week—I'm trying to be healthier.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">won't go</span> to the party tonight.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">won't leave</span> before 9 PM.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            It <span style="color: #06b6d4; font-weight: 600;">won't rain</span> tomorrow, according to the weather.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Say What Won't Happen",
                    instructions: "Use won't + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. The library ___ (not accept) donations of old magazines anymore.",
                            expectedAnswer: "won't accept",
                        },
                        {
                            type: "text",
                            label: "2. My brother ___ (not lend) me his car after what happened last time.",
                            expectedAnswer: "won't lend",
                        },
                        {
                            type: "text",
                            label: "3. The flowers ___ (not survive) if we don't water them soon.",
                            expectedAnswer: "won't survive",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Will</strong> at the beginning.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> you <span style="color: #06b6d4; font-weight: 600;">come</span> to dinner tonight?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> she <span style="color: #06b6d4; font-weight: 600;">bring</span> her kids to the party?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> it <span style="color: #06b6d4; font-weight: 600;">be</span> cold tomorrow?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> they <span style="color: #06b6d4; font-weight: 600;">visit</span> us next week?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About the Future",
                    instructions: "Make questions with Will + subject + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ the store ___ (have) that toy in stock by Christmas?",
                            expectedAnswer: "Will the store have",
                        },
                        {
                            type: "text",
                            label: "2. ___ your daughter ___ (study) abroad next semester?",
                            expectedAnswer: "Will your daughter study",
                        },
                        {
                            type: "text",
                            label: "3. ___ the neighbors ___ (adopt) another rescue dog?",
                            expectedAnswer: "Will the neighbors adopt",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'help' with the subject 'she'.",
                    items: [
                        { type: "text", label: "Affirmative: She ___ help", expectedAnswer: "will" },
                        { type: "text", label: "Negative: She ___ help", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ she help?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 5: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "1. She will going to the party tomorrow.", expectedAnswer: "She will go to the party tomorrow" },
                        { type: "text", label: "2. They won't comes to the meeting.", expectedAnswer: "They won't come to the meeting" },
                        { type: "text", label: "3. Will you helps me with this project?", expectedAnswer: "Will you help me with this project" },
                        { type: "text", label: "4. I will to call you later.", expectedAnswer: "I will call you later" },
                        { type: "text", label: "5. He don't will arrive until midnight.", expectedAnswer: "He won't arrive until midnight" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 6: Transformation Practice",
                    instructions: "Change each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "1. Make negative: I will attend the conference next month.", expectedAnswer: "I won't attend the conference next month" },
                        { type: "text", label: "2. Make a question: She will finish the report by Friday.", expectedAnswer: "Will she finish the report by Friday" },
                        { type: "text", label: "3. Make affirmative: They won't travel this summer.", expectedAnswer: "They will travel this summer" },
                        { type: "text", label: "4. Make negative: The weather will be sunny tomorrow.", expectedAnswer: "The weather won't be sunny tomorrow" },
                    ],
                },
                {
                    id: "ex-contextual-1",
                    title: "Exercise 7: Making Predictions",
                    instructions: "Complete these predictions about the future. Use Future Simple!",
                    items: [
                        { type: "text", label: "1. I think it ___ (rain) later tonight.", expectedAnswer: "will rain" },
                        { type: "text", label: "2. The team ___ (not win) without their star player.", expectedAnswer: "won't win" },
                        { type: "text", label: "3. ___ the price of gas ___ (go) up next month?", expectedAnswer: "Will the price of gas go" },
                        { type: "text", label: "4. My parents ___ (visit) us during the holidays.", expectedAnswer: "will visit" },
                        { type: "text", label: "5. I'm sure you ___ (love) this restaurant!", expectedAnswer: "will love" },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Predictions, promises/offers, spontaneous decisions</li>
                    <li><strong>Positive:</strong> Subject + will + base verb</li>
                    <li><strong>Negative:</strong> Subject + won't + base verb</li>
                    <li><strong>Questions:</strong> Will + subject + base verb?</li>
                    <li><strong>Contractions:</strong> I'll, you'll, he'll, she'll, won't</li>
                    <li><strong>Time Words:</strong> tomorrow, next week, soon, tonight, in an hour</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "Will = same form for all subjects. Very easy to use!",
            },
            exercises: [
                {
                    id: "fs-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "She will comes tomorrow." },
                                { value: "b", label: "She will come tomorrow." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which negative is correct?",
                            options: [
                                { value: "a", label: "They won't go tonight." },
                                { value: "b", label: "They won't to go tonight." },
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
            question: "Which sentence correctly uses 'will' (base verb)?",
            options: [
                { value: "a", label: "I will to call you now." },
                { value: "b", label: "I will call you now." },
                { value: "c", label: "I will calling you now." },
            ],
            correctAnswer: "b",
            explanation: "Future Simple: will + base verb (no 'to', no -ing).",
        },
        {
            id: "quiz-2",
            question: "Which negative is correct?",
            options: [
                { value: "a", label: "She won't comes." },
                { value: "b", label: "She won't come." },
                { value: "c", label: "She will not comes." },
            ],
            correctAnswer: "b",
            explanation: "Won't + base verb (come, not comes).",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Will you helps me?" },
                { value: "b", label: "Will you help me?" },
                { value: "c", label: "You will help me?" },
            ],
            correctAnswer: "b",
            explanation: "Will + subject + base verb (help, not helps).",
        },
        {
            id: "quiz-4",
            question: "Choose 'will' vs a different tense: Which needs 'will'?",
            options: [
                { value: "a", label: "The bus leaves at 7:10 AM." },
                { value: "b", label: "I'll answer the door—someone's knocking." },
                { value: "c", label: "I'm meeting my friend at 3 PM." },
            ],
            correctAnswer: "b",
            explanation: "Spontaneous decision → will. A) timetable uses Present Simple; C) arranged plan uses Present Continuous.",
        },
        {
            id: "quiz-5",
            question: "Pick the correct use of 'will' for a promise/offer.",
            options: [
                { value: "a", label: "I will fixing it later." },
                { value: "b", label: "I fix it later." },
                { value: "c", label: "I will fix it later." },
            ],
            correctAnswer: "c",
            explanation: "Promise: will + base verb → will fix.",
        },
    ],
};
