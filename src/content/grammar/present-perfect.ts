import type { InteractiveGuideContent } from "@/types/activity";

export const presentPerfectContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Present Perfect: Past Meets Right Now",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(255, 165, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #6366f1; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Present Perfect <strong style="color: #c86b51;">connects your past experiences to right now</strong>: places you've been, things you've done, changes that happened and you can still see the results.</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Experiences</strong> (no specific time): "I've been to Paris three times."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Actions that continue</strong> to now: "She has lived here since 2021."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Recent actions with present results</strong>: "I've just finished my homework—finally!"</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #c86b51; font-size: 1.125rem;">have/has + past participle</span></p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-intro-pp-1",
                    title: "Quick Check: Connected to Now?",
                    instructions: "Choose the sentences that fit Present Perfect because they connect to now.",
                    items: [
                        {
                            type: "radio",
                            label: '"I have just finished my homework, so I can go out now."',
                            options: [
                                { value: "yes", label: "Yes, present result" },
                                { value: "no", label: "No, finished past with time" },
                            ],
                            expectedAnswer: "yes",
                        },
                        {
                            type: "radio",
                            label: '"I visited Madrid in 2019."',
                            options: [
                                { value: "yes", label: "Yes, connected to now" },
                                { value: "no", label: "No, specific finished past time" },
                            ],
                            expectedAnswer: "no",
                        },
                        {
                            type: "radio",
                            label: '"We have lived here since 2020."',
                            options: [
                                { value: "yes", label: "Yes, started in past, continues now" },
                                { value: "no", label: "No, only past" },
                            ],
                            expectedAnswer: "yes",
                        },
                    ],
                },
            ],
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Present Perfect?",
            icon: "⭐",
            explanation: `
                <p><strong>The key question:</strong> "Is this connected to NOW?"</p>
                <p>If YES → use Present Perfect! ✓</p>
            `,
            usageMeanings: [
                {
                    title: "🌍 1. Life Experiences",
                    description: "Things you've done at some point in life (no exact time given)",
                    examples: [
                        {
                            sentence: "I <strong>have been</strong> to Paris three times.",
                            explanation: "✓ Experience without a specific date",
                        },
                        {
                            sentence: "She <strong>has never tried</strong> sushi, but she <strong>has eaten</strong> pizza 100 times.",
                            explanation: "✓ 'Never' shows zero experience up to now",
                        },
                    ],
                },
                {
                    title: "⏰ 2. Actions That Continue NOW",
                    description: "Started before now and still true (use 'for' or 'since')",
                    examples: [
                        {
                            sentence: "I <strong>have lived</strong> in this apartment <strong>since 2021</strong>.",
                            explanation: "✓ Started in 2021 and still living there",
                        },
                        {
                            sentence: "He <strong>has studied</strong> English <strong>for five years</strong>.",
                            explanation: "✓ Duration that reaches now",
                        },
                    ],
                },
                {
                    title: "🆕 3. Recent Actions",
                    description: "Just happened and we see the result now (use 'just', 'already', 'yet')",
                    examples: [
                        {
                            sentence: "I <strong>have just finished</strong> my homework—finally!",
                            explanation: "✓ Result is visible now",
                        },
                        {
                            sentence: "She <strong>has already eaten</strong> all the cookies.",
                            explanation: "✓ Done earlier than expected",
                        },
                    ],
                },
                {
                    title: "🔢 4. Multiple Times",
                    description: "Repeated actions up to now",
                    examples: [
                        {
                            sentence: "I <strong>have watched</strong> that show <strong>five times</strong> and I still cry at the ending.",
                            explanation: "✓ Many times in the current time period",
                        },
                    ],
                },
                {
                    title: "➡️ 5. Past Action → Present Result",
                    description: "Something happened → we see the result NOW",
                    examples: [
                        {
                            sentence: "I <strong>have lost</strong> my keys again—third time this month!",
                            explanation: "PAST: lost keys → NOW: can't find them",
                        },
                        {
                            sentence: "Someone <strong>has eaten</strong> my leftovers, and now I have nothing for lunch.",
                            explanation: "PAST: ate the food → NOW: hungry with no lunch",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Ask yourself: 'Is this connected to NOW?' If YES → Present Perfect!",
            },
            exercises: [
                {
                    id: "ex-meaning-1",
                    title: "Practice: Why Do We Use Present Perfect Here?",
                    instructions:
                        "Read each sentence and choose why we use Present Perfect. Think about the meaning!",
                    items: [
                        {
                            type: "radio",
                            label: '1. "I have been to Paris three times."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience (no specific time)",
                                },
                                {
                                    value: "unfinished",
                                    label: "Unfinished action (continues to now)",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action",
                                },
                            ],
                            expectedAnswer: "life-experience",
                        },
                        {
                            type: "radio",
                            label: '2. "I have lived in Boston for 5 years."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience",
                                },
                                {
                                    value: "unfinished",
                                    label: "Unfinished action (started in past, continues to now)",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action",
                                },
                            ],
                            expectedAnswer: "unfinished",
                        },
                        {
                            type: "radio",
                            label: '3. "I have just finished my homework."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience",
                                },
                                {
                                    value: "unfinished",
                                    label: "Unfinished action",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action (just now)",
                                },
                            ],
                            expectedAnswer: "recent",
                        },
                        {
                            type: "radio",
                            label: '4. "I have lost my keys."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience",
                                },
                                {
                                    value: "present-result",
                                    label: "Past action with present result (can't find them now)",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action",
                                },
                            ],
                            expectedAnswer: "present-result",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization Section
        {
            id: "timeline-visualization",
            stepNumber: 2,
            title: "Timeline: Past → Present Connection",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Connection</h3>
                <p>Present Perfect is all about how a <strong>past action</strong> connects to the <strong>present moment</strong>. Let's see it visually:</p>

                <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Past Action → Present Connection</h4>

                    <div style="display: flex; align-items: center; justify-content: space-between; position: relative; margin: 2rem 0; padding: 0 2rem;">
                        <div style="position: absolute; top: 50%; left: 15%; right: 15%; height: 4px; background: linear-gradient(to right, #6366f1, #8b5cf6); transform: translateY(-50%); z-index: 0;">
                            <div style="position: absolute; right: -8px; top: -6px; width: 0; height: 0; border-left: 10px solid #8b5cf6; border-top: 7px solid transparent; border-bottom: 7px solid transparent;"></div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center; flex: 1;">
                            <div style="width: 90px; height: 90px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.125rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); margin: 0 auto;">
                                PAST
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #6366f1;">Past Action</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Lost keys</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center; flex: 1;">
                            <div style="width: 110px; height: 110px; border-radius: 50%; background: #8b5cf6; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; border: 5px solid white; box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4); margin: 0 auto;">
                                <div>NOW</div>
                                <div style="font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem;">Present Result</div>
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #8b5cf6;">Still Can't Find Them</div>
                        </div>
                    </div>

                    <div style="background: #f5f3ff; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> I <span style="color: #6366f1; font-weight: 600;">have lost</span> my keys → <span style="color: #8b5cf6; font-weight: 600;">I can't open the door NOW</span></p>
                    </div>

                    <div style="margin-top: 1rem; padding: 1rem; background: #fef9f3; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        <p style="margin: 0; font-size: 0.875rem;"><strong>📍 Key Idea:</strong> The past action creates a situation that exists NOW. The exact time doesn't matter—what matters is the present connection!</p>
                    </div>
                </div>

                <h3>More Visual Examples</h3>
                <div style="margin: 1rem 0;">
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem; border-left: 4px solid #6366f1;">
                        <p style="margin: 0;"><strong>Example 1:</strong> She <span style="color: #6366f1; font-weight: 600;">has broken</span> her arm (past) → <span style="color: #8b5cf6; font-weight: 600;">She can't write NOW</span> (present result)</p>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <p style="margin: 0;"><strong>Example 2:</strong> They <span style="color: #6366f1; font-weight: 600;">have moved</span> to Boston (past) → <span style="color: #8b5cf6; font-weight: 600;">They live in Boston NOW</span> (present state)</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Why This Matters",
                content: "Present Perfect is unique because it CONNECTS past to present. Unlike Past Simple (which is just 'finished and done'), Present Perfect shows how the past still affects NOW.",
            },
            exercises: [
                {
                    id: "ex-timeline-pp-1",
                    title: "Practice: Identify the Present Connection",
                    instructions: "For each Present Perfect sentence, identify the present result/relevance.",
                    items: [
                        {
                            type: "radio",
                            label: "I have lost my wallet.",
                            options: [
                                { value: "a", label: "I can't pay for lunch NOW" },
                                { value: "b", label: "I lost it yesterday" },
                                { value: "c", label: "I will find it tomorrow" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "She has broken her arm.",
                            options: [
                                { value: "a", label: "She broke it last week" },
                                { value: "b", label: "She can't write NOW" },
                                { value: "c", label: "She will heal soon" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "They have moved to Boston.",
                            options: [
                                { value: "a", label: "They moved last month" },
                                { value: "b", label: "They will live in Boston" },
                                { value: "c", label: "They live in Boston NOW" },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
            ],
        },

        // Past Participle Section
        {
            id: "past-participle",
            title: "Understanding Past Participles",
            icon: "📝",
            explanation: `
                <h3>What is a Past Participle?</h3>
                <p>The past participle is the special form of the verb we use with Present Perfect. For regular verbs, it's the same as the past simple (add -ed). For irregular verbs, you need to memorize them!</p>
            `,
            verbTable: {
                title: "Common Irregular Past Participles",
                headers: ["Infinitive", "Past Simple", "Past Participle"],
                rows: [
                    ["be", "was/were", "been"],
                    ["do", "did", "done"],
                    ["go", "went", "gone"],
                    ["see", "saw", "seen"],
                    ["eat", "ate", "eaten"],
                    ["take", "took", "taken"],
                    ["write", "wrote", "written"],
                    ["speak", "spoke", "spoken"],
                    ["break", "broke", "broken"],
                    ["know", "knew", "known"],
                    ["give", "gave", "given"],
                    ["make", "made", "made"],
                    ["have", "had", "had"],
                    ["leave", "left", "left"],
                    ["lose", "lost", "lost"],
                ],
            },
            tipBox: {
                title: "💡 Remember",
                content:
                    "Regular verbs: add -ed (work → worked, play → played). Irregular verbs: memorize them! There are about 200 common irregular verbs in English.",
            },
            exercises: [
                {
                    id: "ex-past-participle-1",
                    title: "📝 Practice: Complete the Past Participles",
                    instructions: "Fill in the missing past participle forms. Use the table above to help you!",
                    items: [
                        {
                            type: "text",
                            label: "1. be → was/were → ___",
                            expectedAnswer: "been",
                        },
                        {
                            type: "text",
                            label: "2. go → went → ___",
                            expectedAnswer: "gone",
                        },
                        {
                            type: "text",
                            label: "3. see → saw → ___",
                            expectedAnswer: "seen",
                        },
                        {
                            type: "text",
                            label: "4. eat → ate → ___",
                            expectedAnswer: "eaten",
                        },
                        {
                            type: "text",
                            label: "5. write → wrote → ___",
                            expectedAnswer: "written",
                        },
                    ],
                },
                {
                    id: "ex-past-participle-2",
                    title: "✓ Quick Check: Understanding",
                    instructions: "Answer these questions about past participles.",
                    items: [
                        {
                            type: "radio",
                            label: "1. What do we use past participles for?",
                            options: [
                                { value: "a", label: "To form Present Perfect tense" },
                                { value: "b", label: "To talk about yesterday" },
                                { value: "c", label: "To make questions only" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "2. How do you make the past participle of regular verbs?",
                            options: [
                                { value: "a", label: "Add -ing" },
                                { value: "b", label: "Add -ed" },
                                { value: "c", label: "No change" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "3. Which is an irregular past participle?",
                            options: [
                                { value: "a", label: "worked" },
                                { value: "b", label: "played" },
                                { value: "c", label: "eaten" },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
            ],
        },

        // Present Perfect vs Past Simple
        {
            id: "present-perfect-vs-past-simple",
            title: "Present Perfect vs. Past Simple",
            icon: "⚖️",
            explanation: `
                <h3>What's the Difference?</h3>
                <p>This is one of the most confusing parts for English learners! Both tenses talk about the past, but they have different meanings.</p>
            `,
            comparison: {
                title: "Side-by-Side Comparison",
                leftLabel: "Present Perfect",
                rightLabel: "Past Simple",
                rows: [
                    {
                        label: "Time Focus",
                        left: "Connects past to PRESENT - time is NOT specific",
                        right: "Finished action in the PAST - time IS specific",
                    },
                    {
                        label: "Time Words",
                        left: "ever, never, already, yet, just, still, for, since",
                        right: "yesterday, last week, in 2020, ago, when I was young",
                    },
                    {
                        label: "Example",
                        left: "I have visited Paris. (Sometime in my life - when is not important)",
                        right: "I visited Paris in 2019. (Specific time - finished action)",
                    },
                    {
                        label: "Example",
                        left: "She has lived here for 5 years. (Started in past, STILL lives here now)",
                        right: "She lived here for 5 years. (Doesn't live here anymore - finished)",
                    },
                    {
                        label: "Example",
                        left: "Have you seen this movie? (Ever in your life?)",
                        right: "Did you see this movie last night? (Specific time)",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Practice: Present Perfect or Past Simple?",
                    instructions: "Choose the correct tense based on the meaning.",
                    items: [
                        {
                            type: "radio",
                            label: '1. I ___ to Japan three times in my life.',
                            options: [
                                { value: "have-been", label: "have been" },
                                { value: "went", label: "went" },
                            ],
                            expectedAnswer: "have-been",
                        },
                        {
                            type: "radio",
                            label: "2. I ___ to Japan last year.",
                            options: [
                                { value: "have-been", label: "have been" },
                                { value: "went", label: "went" },
                            ],
                            expectedAnswer: "went",
                        },
                        {
                            type: "radio",
                            label: "3. She ___ in this city for 10 years. (She still lives here.)",
                            options: [
                                { value: "has-lived", label: "has lived" },
                                { value: "lived", label: "lived" },
                            ],
                            expectedAnswer: "has-lived",
                        },
                        {
                            type: "radio",
                            label: "4. She ___ in this city for 10 years. (She doesn't live here now.)",
                            options: [
                                { value: "has-lived", label: "has lived" },
                                { value: "lived", label: "lived" },
                            ],
                            expectedAnswer: "lived",
                        },
                    ],
                },
            ],
        },

        // STEP 1: Positive Form
        {
            id: "step-1-positive",
            stepNumber: 1,
            title: "How to Form Present Perfect (Positive)",
            explanation: `
                <h3>The Formula</h3>
                <p>Present Perfect is formed with: <strong>have/has + past participle</strong></p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">have finished</span> my homework.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">has been</span> to Paris.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">have lived</span> here for 5 years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            He <span style="color: #f59e0b; font-weight: 600;">has seen</span> that movie.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            We <span style="color: #f59e0b; font-weight: 600;">have studied</span> English.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have/has", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Use 'have' with I, you, we, they. Use 'has' with he, she, it.",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Forming Present Perfect",
                    instructions:
                        "Complete each sentence with the correct form of Present Perfect. Use 'have/has' + the past participle.",
                    items: [
                        {
                            type: "text",
                            label: "1. The museum ___ (win) several international awards for its architecture.",
                            expectedAnswer: "has won",
                        },
                        {
                            type: "text",
                            label: "2. My grandparents ___ (own) this house since 1985.",
                            expectedAnswer: "have owned",
                        },
                        {
                            type: "text",
                            label: "3. We ___ (adopt) three rescue animals over the years.",
                            expectedAnswer: "have adopted",
                        },
                        {
                            type: "text",
                            label: "4. She ___ (climb) Mount Everest—it's on her bucket list.",
                            expectedAnswer: "has climbed",
                        },
                        {
                            type: "text",
                            label: "5. The neighbors ___ (plant) a cherry tree that blooms beautifully every spring.",
                            expectedAnswer: "have planted",
                        },
                    ],
                },
                {
                    id: "ex-positive-1b",
                    title: "Exercise 1b: More Practice (Bonus)",
                    instructions:
                        "Complete these sentences with Present Perfect. Remember to use the past participle!",
                    items: [
                        {
                            type: "text",
                            label: "1. The local bakery ___ (serve) fresh croissants since it opened in 2015.",
                            expectedAnswer: "has served",
                        },
                        {
                            type: "text",
                            label: "2. My son ___ (break) his arm twice playing football.",
                            expectedAnswer: "has broken",
                        },
                        {
                            type: "text",
                            label: "3. We ___ (volunteer) at the animal shelter for several months now.",
                            expectedAnswer: "have volunteered",
                        },
                    ],
                },
            ],
        },

        // STEP 2: Negative Form
        {
            id: "step-2-negative",
            stepNumber: 2,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>To make Present Perfect negative, add <strong>'not'</strong> after 'have/has':</p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">have not</span> (haven't) <span style="color: #f59e0b; font-weight: 600;">finished</span> my homework.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">has not</span> (hasn't) <span style="color: #f59e0b; font-weight: 600;">been</span> to Paris.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">have not</span> (haven't) <span style="color: #f59e0b; font-weight: 600;">seen</span> that movie.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have/has", type: "verb" },
                { text: "+", type: "other" },
                { text: "not", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            tipBox: {
                title: "💡 Short Forms",
                content:
                    "We usually use contractions: haven't = have not, hasn't = has not",
            },
            exercises: [
                {
                    id: "ex-negative-2",
                    title: "Exercise 2: Negative Sentences",
                    instructions: "Make these sentences negative. Use haven't or hasn't.",
                    items: [
                        {
                            type: "text",
                            label: "1. The city ___ (not repair) the potholes on our street yet.",
                            expectedAnswer: "hasn't repaired",
                        },
                        {
                            type: "text",
                            label: "2. My daughter ___ (not decide) which university to attend.",
                            expectedAnswer: "hasn't decided",
                        },
                        {
                            type: "text",
                            label: "3. We ___ (not hear) back from the insurance company.",
                            expectedAnswer: "haven't heard",
                        },
                        {
                            type: "text",
                            label: "4. The landlord ___ (not fix) the heating system yet.",
                            expectedAnswer: "hasn't fixed",
                        },
                        {
                            type: "text",
                            label: "5. They ___ (not announce) the winner of the competition.",
                            expectedAnswer: "haven't announced",
                        },
                    ],
                },
            ],
        },

        // STEP 3: Question Form
        {
            id: "step-3-questions",
            stepNumber: 3,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>To make questions, put <strong>'Have/Has'</strong> before the subject:</p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Have</span> you <span style="color: #f59e0b; font-weight: 600;">finished</span> your homework?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Has</span> she <span style="color: #f59e0b; font-weight: 600;">been</span> to Paris?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Have</span> they <span style="color: #f59e0b; font-weight: 600;">seen</span> that movie?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Has</span> he <span style="color: #f59e0b; font-weight: 600;">eaten</span> lunch?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Have/Has", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-3",
                    title: "Exercise 3: Making Questions",
                    instructions:
                        "Write questions in Present Perfect. Start with Have or Has.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ the plumber (arrive) to fix the leak?",
                            expectedAnswer: "Has the plumber arrived",
                        },
                        {
                            type: "text",
                            label: "2. ___ your parents (celebrate) their golden anniversary yet?",
                            expectedAnswer: "Have your parents celebrated",
                        },
                        {
                            type: "text",
                            label: "3. ___ the neighbors (complain) about the noise?",
                            expectedAnswer: "Have the neighbors complained",
                        },
                        {
                            type: "text",
                            label: "4. ___ she ever (ride) a motorcycle?",
                            expectedAnswer: "Has she ever ridden",
                        },
                        {
                            type: "text",
                            label: "5. ___ you (donate) to any charities this year?",
                            expectedAnswer: "Have you donated",
                        },
                    ],
                },
            ],
        },

        // Time Expressions (For vs Since)
        {
            id: "time-for-since",
            title: "For vs Since",
            icon: "⏳",
            explanation: `
                <h3>Talking About Time</h3>
                <p>Use <strong>for</strong> to show a duration and <strong>since</strong> to show the starting point.</p>
                <p><strong>Placement:</strong> usually after the verb phrase: "have/has + past participle + for/since + time".</p>
                <p><strong>Sentence types:</strong> works in affirmatives, negatives, and questions.</p>
            `,
            timeExpressions: [
                {
                    word: "For",
                    usage: "Duration of time (for 5 years, for a week, for a long time)",
                    examples: [
                        "I have studied English for 3 years.",
                        "They have been friends for a long time.",
                    ],
                },
                {
                    word: "Since",
                    usage: "Starting point in time (since 2020, since Monday, since I was a child)",
                    examples: [
                        "I have lived here since 2020.",
                        "She has worked here since Monday.",
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-time-for-since-1",
                    title: "Practice: For or Since?",
                    instructions: "Choose 'for' or 'since' for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "1. I have lived here ___ 5 years.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "for",
                        },
                        {
                            type: "select",
                            label: "2. I have lived here ___ 2020.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "3. She has worked here ___ last Monday.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "4. They have been friends ___ a long time.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "for",
                        },
                        {
                            type: "select",
                            label: "5. I have studied English ___ I was 10 years old.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "since",
                        },
                    ],
                },
            ],
        },

        // Time Expressions (Already / Just / Yet / Still)
        {
            id: "time-already-just-yet",
            title: "Already, Just, Yet, or Still?",
            icon: "⏰",
            explanation: `
                <h3>Time Words: Already, Just, Yet, Still</h3>
                <p>These four words help you express timing and expectations with Present Perfect. Each one has a specific meaning and placement in the sentence.</p>
            `,
            verbTable: {
                title: "Quick Reference Guide",
                headers: ["Word", "Meaning", "Placement in Sentence", "Used In"],
                rows: [
                    ["already", "Earlier than expected; sooner than you thought", "Between have/has and past participle → I have already finished", "✓ Positive statements\n✓ Sometimes questions"],
                    ["just", "A moment ago; very recently", "Between have/has and past participle → She has just arrived", "✓ Positive statements"],
                    ["yet", "Expected to happen but hasn't (or asking if it happened)", "At the end of the sentence → I haven't eaten yet / Have you finished yet?", "✓ Questions\n✓ Negatives"],
                    ["still", "Continues to not happen; emphasizes the ongoing negative", "Before haven't/hasn't → I still haven't finished", "✓ Negatives only\n(emphasizes frustration)"],
                ],
            },
            timeExpressions: [
                {
                    word: "Already",
                    usage: "Happened sooner than expected (positive sentences)",
                    examples: [
                        "I have already finished my homework.",
                        "She has already eaten lunch.",
                    ],
                },
                {
                    word: "Just",
                    usage: "Very recently - a short time ago",
                    examples: [
                        "I have just arrived home.",
                        "He has just started the test.",
                    ],
                },
                {
                    word: "Yet",
                    usage: "Expected to happen but hasn't (questions and negatives)",
                    examples: [
                        "Have you finished yet?",
                        "I haven't eaten lunch yet.",
                    ],
                },
                {
                    word: "Still",
                    usage: "Emphasizes that something continues to not happen (used with negatives)",
                    examples: [
                        "I still haven't finished my Christmas shopping.",
                        "She still hasn't called me back.",
                        "They still haven't decided where to go.",
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-time-already-just-yet-1",
                    title: "Choose: already / just / yet / still",
                    instructions: "Select the best time word for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "1. I have ___ finished my homework.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "already",
                        },
                        {
                            type: "select",
                            label: "2. She hasn't eaten lunch ___.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "yet",
                        },
                        {
                            type: "select",
                            label: "3. We have ___ arrived, so we can start.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "just",
                        },
                        {
                            type: "select",
                            label: "4. Have you finished your project ___?",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "yet",
                        },
                        {
                            type: "select",
                            label: "5. He has ___ taken the test and is waiting outside.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "already",
                        },
                        {
                            type: "select",
                            label: "6. I ___ haven't finished my Christmas shopping.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "still",
                        },
                        {
                            type: "select",
                            label: "7. She ___ hasn't called me back about the job.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "still",
                        },
                    ],
                },
            ],
        },

        // Time Expressions (Ever / Never)
        {
            id: "time-ever-never",
            title: "Ever vs Never",
            icon: "🌟",
            explanation: `
                <h3>Life Experiences</h3>
                <p><strong>Ever</strong> = at any time in your life (usually in questions). <strong>Never</strong> = not at any time.</p>
                <p><strong>Placement:</strong> "ever/never" go between have/has and the past participle (Have you <strong>ever been</strong>… / I have <strong>never seen</strong>…).</p>
                <p><strong>Sentence types:</strong> "ever" mainly in questions; "never" in affirmative structure but negative meaning.</p>
            `,
            timeExpressions: [
                {
                    word: "Ever",
                    usage: "In your life up to now (usually in questions)",
                    examples: [
                        "Have you ever been to Paris?",
                        "Have you ever tried sushi?",
                    ],
                },
                {
                    word: "Never",
                    usage: "Not at any time in your life",
                    examples: [
                        "I have never seen snow.",
                        "She has never eaten Thai food.",
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-time-ever-never-1",
                    title: "Choose: ever / never",
                    instructions: "Pick the correct word to complete each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "1. Have you ___ visited London?",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "ever",
                        },
                        {
                            type: "select",
                            label: "2. I have ___ ridden a horse.",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "never",
                        },
                        {
                            type: "select",
                            label: "3. Has she ___ tried sushi?",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "ever",
                        },
                        {
                            type: "select",
                            label: "4. They have ___ been to Spain.",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "never",
                        },
                    ],
                },
            ],
        },

        // STEP 4: Mixed Practice with Word Scrambles
        {
            id: "step-4-mixed",
            stepNumber: 4,
            title: "Mixed Practice: All Forms Together",
            explanation: `
                <h3>Put It All Together!</h3>
                <p>Now let's practice positive, negative, and question forms. Pay attention to the meaning!</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-4a",
                    title: "Exercise 4a: Word Scramble",
                    instructions:
                        "Put the words in the correct order to make Present Perfect sentences.",
                    items: [
                        {
                            type: "word-scramble",
                            label: "1. Make a sentence:",
                            words: ["I", "have", "visited", "many", "countries"],
                            correctAnswer: "I have visited many countries",
                            hint: "Life experience - where you've been",
                        },
                        {
                            type: "word-scramble",
                            label: "2. Make a sentence:",
                            words: ["She", "has", "lived", "here", "for", "5", "years"],
                            correctAnswer: "She has lived here for 5 years",
                            hint: "Unfinished action - started in past, continues to now",
                        },
                        {
                            type: "word-scramble",
                            label: "3. Make a question:",
                            words: ["Have", "you", "ever", "eaten", "sushi", "?"],
                            correctAnswer: "Have you ever eaten sushi?",
                            hint: "Question about life experience",
                        },
                    ],
                },
                {
                    id: "ex-mixed-4b",
                    title: "Exercise 4b: Complete Practice",
                    instructions:
                        "Choose the correct form (positive, negative, or question).",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (see) that movie three times. (positive)",
                            expectedAnswer: "have seen",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (not finish) her work yet. (negative)",
                            expectedAnswer: "hasn't finished",
                        },
                        {
                            type: "text",
                            label: "3. ___ they ___ (be) to Paris? (question)",
                            expectedAnswer: "Have they been",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Summary: Key Points to Remember",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Form:</strong> Present Perfect = <strong>have/has + past participle</strong></li>
                    <li><strong>Meaning:</strong> Connects the PAST to the PRESENT (not finished, or important now)</li>
                    <li><strong>5 Main Uses:</strong>
                        <ol class="list-decimal pl-6 mt-2">
                            <li>Life experiences (no specific time)</li>
                            <li>Unfinished actions (started in past, continue to now)</li>
                            <li>Recent actions (just, already, yet)</li>
                            <li>Multiple times in life</li>
                            <li>Past actions with present results</li>
                        </ol>
                    </li>
                    <li><strong>Time Expressions:</strong> for, since, already, yet, just, still, ever, never</li>
                    <li><strong>Negative:</strong> haven't/hasn't + past participle</li>
                    <li><strong>Questions:</strong> Have/Has + subject + past participle?</li>
                    <li><strong>vs Past Simple:</strong> Present Perfect = connection to NOW. Past Simple = finished action with specific time.</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Final Tip",
                content:
                    "Always ask yourself: 'Is this connected to the present?' If yes, use Present Perfect!",
            },
        },
    ],

    // Mini Quiz for comprehension
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence uses Present Perfect correctly?",
            options: [
                {
                    value: "a",
                    label: "I have visited Paris last year.",
                },
                {
                    value: "b",
                    label: "I have visited Paris three times.",
                },
                {
                    value: "c",
                    label: "I have visited Paris yesterday.",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Present Perfect doesn't use specific past times like 'last year' or 'yesterday'. It's used for life experiences without mentioning when exactly.",
        },
        {
            id: "quiz-2",
            question: "When do we use 'since' with Present Perfect?",
            options: [
                {
                    value: "a",
                    label: "For a duration of time (5 years, a long time)",
                },
                {
                    value: "b",
                    label: "For a starting point in time (2020, Monday)",
                },
                {
                    value: "c",
                    label: "For recent actions",
                },
            ],
            correctAnswer: "b",
            explanation:
                "'Since' is used with a starting point in time (since 2020, since Monday). 'For' is used for duration (for 5 years).",
        },
        {
            id: "quiz-3",
            question:
                'What is the difference between "She has lived here for 5 years" and "She lived here for 5 years"?',
            options: [
                {
                    value: "a",
                    label: "No difference - they mean the same thing",
                },
                {
                    value: "b",
                    label: "Present Perfect = she still lives here. Past Simple = she doesn't live here anymore.",
                },
                {
                    value: "c",
                    label: "Past Simple = she still lives here. Present Perfect = she doesn't live here anymore.",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Present Perfect (has lived) means the action continues to the present - she still lives there. Past Simple (lived) means it's finished - she doesn't live there anymore.",
        },
        {
            id: "quiz-4",
            question: "Which time expression is NOT used with Present Perfect?",
            options: [
                { value: "a", label: "already" },
                { value: "b", label: "yesterday" },
                { value: "c", label: "just" },
            ],
            correctAnswer: "b",
            explanation:
                "'Yesterday' is a specific past time, so we use Past Simple. Present Perfect uses words like 'already', 'just', 'yet', 'still', 'ever', 'never', 'for', 'since'.",
        },
        {
            id: "quiz-5",
            question:
                "What is the correct negative form of 'She has finished her homework'?",
            options: [
                { value: "a", label: "She hasn't finished her homework." },
                { value: "b", label: "She doesn't have finished her homework." },
                { value: "c", label: "She haven't finished her homework." },
            ],
            correctAnswer: "a",
            explanation:
                "The correct negative form is 'hasn't' (has not) + past participle. We use 'hasn't' with 'she' (third person singular).",
        },
        {
            id: "quiz-6",
            question: "Which question is best for asking about life experience (no time given)?",
            options: [
                { value: "a", label: "Did you ever visit Japan?" },
                { value: "b", label: "Have you ever visited Japan?" },
                { value: "c", label: "Are you ever visiting Japan?" },
            ],
            correctAnswer: "b",
            explanation: "Life experience with no time uses Present Perfect: Have you ever visited…?",
        },
    ],
};
