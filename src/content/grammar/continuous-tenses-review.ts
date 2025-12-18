import type { InteractiveGuideContent } from "@/types/activity";

export const continuousTensesReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Continuous Tenses Review: The -ing Action Tenses",
            icon: "📚",
            explanation: `
                <p>All the “-ing” tenses in one place: what's happening now, what was happening then, and what will be happening later.</p>
                <p><strong>Continuous Tenses:</strong> Present (now/temporary), Past (in progress in the past), Future (in progress at a future time)</p>
            `,
        },
        {
            id: "comparison",
            stepNumber: 1,
            title: "When Real Life Needs Continuous Tenses",
            icon: "⭐",
            explanation: `
                <h3>The "Why" Matters More Than the "How"</h3>
                <p>Continuous tenses show actions in motion. They answer: "What's happening right now?" or "What was going on then?"</p>
            `,
            usageMeanings: [
                {
                    title: "▶️ Present Continuous: Actions Happening RIGHT NOW",
                    description: "For actions in progress as you speak",
                    examples: [
                        {
                            sentence: "I <span style=\"color: #f0b45a; font-weight: 600;\">am watching</span> TV while my dinner cooks.",
                            explanation: "✓ In-progress action this exact moment",
                        },
                        {
                            sentence: "She <span style=\"color: #f0b45a; font-weight: 600;\">is talking</span> on the phone, and her kid <span style=\"color: #f0b45a; font-weight: 600;\">is yelling</span> in the background.",
                            explanation: "✓ Multiple ongoing actions right now",
                        },
                        {
                            sentence: "They <span style=\"color: #f0b45a; font-weight: 600;\">are waiting</span> for the bus that's late again.",
                            explanation: "✓ Still happening as we speak",
                        },
                    ],
                },
                {
                    title: "⏳ Present Continuous: Temporary Situations",
                    description: "For short-term arrangements that aren't permanent",
                    examples: [
                        {
                            sentence: "I'm <span style=\"color: #f0b45a; font-weight: 600;\">staying</span> with my sister this month while my apartment gets painted.",
                            explanation: "✓ Temporary living situation",
                        },
                        {
                            sentence: "He <span style=\"color: #f0b45a; font-weight: 600;\">is working</span> the closing shift this week.",
                            explanation: "✓ Short-term schedule change",
                        },
                        {
                            sentence: "We <span style=\"color: #f0b45a; font-weight: 600;\">are trying</span> a new recipe for dinner tonight.",
                            explanation: "✓ Temporary experiment",
                        },
                    ],
                },
                {
                    title: "🤝 Present Continuous: Near Future Plans",
                    description: "For arranged future activities (like 'going to')",
                    examples: [
                        {
                            sentence: "I'm <span style=\"color: #f0b45a; font-weight: 600;\">meeting</span> my friend for coffee at 3 PM.",
                            explanation: "✓ Scheduled soon - confirmed plan",
                        },
                        {
                            sentence: "They're <span style=\"color: #f0b45a; font-weight: 600;\">going</span> to the movies tonight.",
                            explanation: "✓ Near-future arrangement",
                        },
                    ],
                },
                {
                    title: "📅 Past Continuous: Ongoing Past Actions",
                    description: "For actions in progress at a specific past time",
                    examples: [
                        {
                            sentence: "I <span style=\"color: #8b5cf6; font-weight: 600;\">was walking</span> home when it started raining.",
                            explanation: "✓ Ongoing action interrupted by another",
                        },
                        {
                            sentence: "She <span style=\"color: #8b5cf6; font-weight: 600;\">was studying</span> when her phone rang.",
                            explanation: "✓ Background action at specific past moment",
                        },
                        {
                            sentence: "They <span style=\"color: #8b5cf6; font-weight: 600;\">were playing</span> soccer at 3 PM yesterday.",
                            explanation: "✓ In progress during a past time period",
                        },
                    ],
                },
                {
                    title: "🔮 Future Continuous: Future Ongoing Actions",
                    description: "For actions that will be in progress at a future time",
                    examples: [
                        {
                            sentence: "I'll <span style=\"color: #06b6d4; font-weight: 600;\">be sleeping</span> when you arrive at midnight.",
                            explanation: "✓ Action in progress during another future event",
                        },
                        {
                            sentence: "She <span style=\"color: #06b6d4; font-weight: 600;\">will be working</span> from 9 to 5 tomorrow.",
                            explanation: "✓ Ongoing future time period",
                        },
                        {
                            sentence: "They <span style=\"color: #06b6d4; font-weight: 600;\">will be traveling</span> during the holidays.",
                            explanation: "✓ Future duration of action",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 The Key Pattern",
                content: "All continuous tenses use: be + verb-ing. Only the time changes: am/is/are (now), was/were (past), will be (future).",
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Why This Continuous Tense? Think About Meaning",
                    instructions: "Read each situation and identify WHY we use continuous tense. Think about the timing!",
                    items: [
                        {
                            type: "radio",
                            label: '"The baby is sleeping in the nursery while I prepare her bottle."',
                            options: [
                                { value: "now", label: "Action happening right now" },
                                { value: "temporary", label: "Temporary situation" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                            ],
                            expectedAnswer: "now",
                        },
                        {
                            type: "radio",
                            label: '"My uncle is renting an apartment while his house is being renovated."',
                            options: [
                                { value: "now", label: "Action happening right now" },
                                { value: "temporary", label: "Temporary situation" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                            ],
                            expectedAnswer: "temporary",
                        },
                        {
                            type: "radio",
                            label: '"The hikers were climbing the trail when the thunderstorm started."',
                            options: [
                                { value: "now", label: "Action happening right now" },
                                { value: "temporary", label: "Temporary situation" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                            ],
                            expectedAnswer: "past-ongoing",
                        },
                        {
                            type: "radio",
                            label: '"The volunteers will be serving lunch when the guests arrive."',
                            options: [
                                { value: "now", label: "Action happening right now" },
                                { value: "temporary", label: "Temporary situation" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                            ],
                            expectedAnswer: "future-ongoing",
                        },
                    ],
                },
                {
                    id: "ex-comparison-2",
                    title: "Real-Life Continuous Situations",
                    instructions: "Choose the continuous tense that fits each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: '"The kids ___ (play) in the park right now." (action in progress)',
                            options: [
                                { value: "are playing", label: "are playing" },
                                { value: "were playing", label: "were playing" },
                                { value: "will be playing", label: "will be playing" },
                            ],
                            expectedAnswer: "are playing",
                        },
                        {
                            type: "radio",
                            label: '"My sister ___ (practice) piano when the power went out." (past ongoing)',
                            options: [
                                { value: "is practicing", label: "is practicing" },
                                { value: "was practicing", label: "was practicing" },
                                { value: "will be practicing", label: "will be practicing" },
                            ],
                            expectedAnswer: "was practicing",
                        },
                        {
                            type: "radio",
                            label: '"They ___ (travel) next month." (future ongoing)',
                            options: [
                                { value: "are traveling", label: "are traveling" },
                                { value: "were traveling", label: "were traveling" },
                                { value: "will be traveling", label: "will be traveling" },
                            ],
                            expectedAnswer: "will be traveling",
                        },
                    ],
                },
            ],
        },
        {
            id: "timeline-visualization",
            stepNumber: 2,
            title: "Timeline: Duration Across All Three Times",
            icon: "⏰",
            explanation: `
                <div style="max-width: 700px; margin: 2rem auto; padding: 2rem; background: linear-gradient(135deg, rgba(240, 180, 90, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%); border-radius: 12px; border: 2px solid rgba(139, 92, 246, 0.2);">
                    <p style="text-align: center; font-size: 1.125rem; margin-bottom: 2rem; color: #2b3a4a; font-weight: 600;">
                        Continuous tenses emphasize DURATION—actions happening over time
                    </p>

                    <!-- Timeline with three horizontal duration bars stacked vertically -->
                    <div style="display: flex; flex-direction: column; gap: 2rem; margin: 2rem 0;">

                        <!-- Past Continuous bar -->
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="flex: 1; position: relative; height: 50px; background: linear-gradient(90deg, rgba(240, 180, 90, 0) 0%, rgba(240, 180, 90, 0.9) 10%, rgba(240, 180, 90, 1) 50%, rgba(240, 180, 90, 0.9) 90%, rgba(240, 180, 90, 0) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(240, 180, 90, 0.3);">
                                <!-- Dots at both ends -->
                                <div style="position: absolute; left: 10%; width: 8px; height: 8px; border-radius: 50%; background: #f0b45a; border: 2px solid white;"></div>
                                <div style="position: absolute; right: 10%; width: 8px; height: 8px; border-radius: 50%; background: #f0b45a; border: 2px solid white;"></div>
                                <!-- Formula inside bar -->
                                <div style="color: white; font-weight: 700; font-size: 0.875rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                                    was/were + verb-ing
                                </div>
                            </div>
                            <div style="min-width: 200px; text-align: left;">
                                <div style="font-weight: 700; color: #f0b45a; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                    PAST CONTINUOUS
                                </div>
                                <div style="color: #2b3a4a; font-size: 0.85rem;">
                                    I <span style="color: #f0b45a; font-weight: 700;">was walking</span> home
                                </div>
                            </div>
                        </div>

                        <!-- Present Continuous bar -->
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="flex: 1; position: relative; height: 50px; background: linear-gradient(90deg, rgba(139, 92, 246, 0) 0%, rgba(139, 92, 246, 0.9) 10%, rgba(139, 92, 246, 1) 50%, rgba(139, 92, 246, 0.9) 90%, rgba(139, 92, 246, 0) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);">
                                <!-- Dots at both ends -->
                                <div style="position: absolute; left: 10%; width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; border: 2px solid white;"></div>
                                <div style="position: absolute; right: 10%; width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; border: 2px solid white;"></div>
                                <!-- Formula inside bar -->
                                <div style="color: white; font-weight: 700; font-size: 0.875rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                                    am/is/are + verb-ing
                                </div>
                            </div>
                            <div style="min-width: 200px; text-align: left;">
                                <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                    PRESENT CONTINUOUS
                                </div>
                                <div style="color: #2b3a4a; font-size: 0.85rem;">
                                    I <span style="color: #8b5cf6; font-weight: 700;">am walking</span> home
                                </div>
                            </div>
                        </div>

                        <!-- Future Continuous bar -->
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="flex: 1; position: relative; height: 50px; background: linear-gradient(90deg, rgba(6, 182, 212, 0) 0%, rgba(6, 182, 212, 0.9) 10%, rgba(6, 182, 212, 1) 50%, rgba(6, 182, 212, 0.9) 90%, rgba(6, 182, 212, 0) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);">
                                <!-- Dots at both ends -->
                                <div style="position: absolute; left: 10%; width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; border: 2px solid white;"></div>
                                <div style="position: absolute; right: 10%; width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; border: 2px solid white;"></div>
                                <!-- Formula inside bar -->
                                <div style="color: white; font-weight: 700; font-size: 0.875rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                                    will be + verb-ing
                                </div>
                            </div>
                            <div style="min-width: 200px; text-align: left;">
                                <div style="font-weight: 700; color: #06b6d4; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                    FUTURE CONTINUOUS
                                </div>
                                <div style="color: #2b3a4a; font-size: 0.85rem;">
                                    I <span style="color: #06b6d4; font-weight: 700;">will be walking</span> home
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Pattern",
                content: "All three use the SAME -ing verb. Only 'be' changes across time: was/were (past), am/is/are (now), will be (future). The bars show DURATION—these actions happen over a period of time, not just at one moment.",
            },
        },
        {
            id: "present-forms",
            stepNumber: 3,
            title: "Present Continuous Forms",
            explanation: `
                <h3>The Formula for Right Now</h3>
                <p>Present Continuous shows what's happening this moment. The formula is simple: swap 'be' for the time.</p>
            `,
            formula: [
                { text: "Present Continuous", type: "other" },
                { text: "=", type: "other" },
                { text: "am/is/are", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I am washing the dishes right now.",
                "You are listening to music on your headphones.",
                "He is fixing his car in the driveway.",
                "She is making dinner for the family.",
                "We are watching the game on TV.",
                "They are playing soccer in the park.",
            ],
            verbTable: {
                title: "Spelling Rules for -ing Forms",
                headers: ["Rule", "Examples"],
                rows: [
                    ["Most verbs: just add -ing", "work → working, email → emailing, call → calling"],
                    ["Ends in -e: drop -e, add -ing", "write → writing, give → giving, decide → deciding"],
                    ["One syllable CVC: double consonant", "run → running, sit → sitting, stop → stopping"],
                    ["Special cases", "lie → lying, die → dying (but tie → tying)"],
                ],
            },
            tipBox: {
                title: "💡 Quick Formation Check",
                content: "am/is/are + verb-ing. That's it! Say: 'I'm working' ✓ NOT 'I'm work' ✗",
            },
            exercises: [
                {
                    id: "ex-present-forms-1",
                    title: "Present Continuous: What Are They Doing?",
                    instructions: "Use am/is/are + verb-ing to show actions in progress right now.",
                    items: [
                        { type: "text", label: "1. The gardener ___ (trim) the hedges at the moment.", expectedAnswer: "is trimming" },
                        { type: "text", label: "2. My grandchildren ___ (build) a fort with blankets and pillows.", expectedAnswer: "are building" },
                        { type: "text", label: "3. The neighbors ___ (host) a barbecue in their backyard right now.", expectedAnswer: "are hosting" },
                        { type: "text", label: "4. The artist ___ (paint) a mural on the community center wall.", expectedAnswer: "is painting" },
                        { type: "text", label: "5. We ___ (explore) the historic district with a tour guide.", expectedAnswer: "are exploring" },
                    ],
                },
                {
                    id: "ex-present-forms-2",
                    title: "Present Continuous: Negative & Questions",
                    instructions: "Complete with the correct negative or question form.",
                    items: [
                        { type: "text", label: "1. The library ___ (not offer) late hours during summer break.", expectedAnswer: "is not offering" },
                        { type: "text", label: "2. ___ your daughter ___ (apply) to graduate schools this semester?", expectedAnswer: "Is your daughter applying" },
                        { type: "text", label: "3. The museum ___ (not charge) admission this weekend for the anniversary.", expectedAnswer: "is not charging" },
                        { type: "text", label: "4. ___ the neighbors ___ (renovate) their kitchen right now?", expectedAnswer: "Are the neighbors renovating" },
                    ],
                },
            ],
        },
        {
            id: "past-forms",
            stepNumber: 4,
            title: "Past Continuous Forms",
            explanation: `
                <h3>The Formula for Past Ongoing Actions</h3>
                <p>Past Continuous shows what was happening at a specific past time. Same pattern, just past 'be'.</p>
            `,
            formula: [
                { text: "Past Continuous", type: "other" },
                { text: "=", type: "other" },
                { text: "was/were", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I was walking home when it started raining.",
                "She was studying when her phone rang.",
                "They were playing soccer at 3 PM yesterday.",
                "He was cooking dinner when I arrived.",
            ],
            tipBox: {
                title: "⚠️ Subject-Verb Agreement",
                content: "was = I/he/she/it. were = you/we/they. Say: 'I was running' ✓ 'They were running' ✓",
            },
            exercises: [
                {
                    id: "ex-past-forms-1",
                    title: "Past Continuous: What Was Happening?",
                    instructions: "Use was/were + verb-ing to show past ongoing actions.",
                    items: [
                        { type: "text", label: "1. I ___ (walk) home when it started raining.", expectedAnswer: "was walking" },
                        { type: "text", label: "2. She ___ (study) when her phone rang.", expectedAnswer: "was studying" },
                        { type: "text", label: "3. They ___ (play) soccer at 3 PM yesterday.", expectedAnswer: "were playing" },
                        { type: "text", label: "4. He ___ (cook) dinner when I arrived.", expectedAnswer: "was cooking" },
                        { type: "text", label: "5. We ___ (wait) for the bus when it finally came.", expectedAnswer: "were waiting" },
                    ],
                },
                {
                    id: "ex-past-forms-2",
                    title: "Past Continuous: Negative & Questions",
                    instructions: "Complete with the correct negative or question form.",
                    items: [
                        { type: "text", label: "1. I ___ (not sleep) when the alarm went off.", expectedAnswer: "was not sleeping" },
                        { type: "text", label: "2. ___ you ___ (work) late last night?", expectedAnswer: "Were you working" },
                        { type: "text", label: "3. She ___ (not listen) to music while studying.", expectedAnswer: "was not listening" },
                        { type: "text", label: "4. ___ they ___ (watch) TV when you called?", expectedAnswer: "Were they watching" },
                    ],
                },
            ],
        },
        {
            id: "future-forms",
            stepNumber: 5,
            title: "Future Continuous Forms",
            explanation: `
                <h3>The Formula for Future Ongoing Actions</h3>
                <p>Future Continuous shows what will be happening at a future time. will + be + verb-ing.</p>
            `,
            formula: [
                { text: "Future Continuous", type: "other" },
                { text: "=", type: "other" },
                { text: "will be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I'll be sleeping when you arrive at midnight.",
                "She will be working from 9 to 5 tomorrow.",
                "They will be traveling during the holidays.",
                "He will be waiting for us at the airport.",
            ],
            tipBox: {
                title: "💡 Will Be + Verb-ing",
                content: "All subjects use 'will be' - no changing! Say: 'I will be running' ✓ 'They will be running' ✓",
            },
            exercises: [
                {
                    id: "ex-future-forms-1",
                    title: "Future Continuous: What Will Be Happening?",
                    instructions: "Use will be + verb-ing to show future ongoing actions.",
                    items: [
                        { type: "text", label: "1. I ___ (sleep) when you arrive tonight.", expectedAnswer: "will be sleeping" },
                        { type: "text", label: "2. She ___ (work) late tomorrow.", expectedAnswer: "will be working" },
                        { type: "text", label: "3. They ___ (travel) next month.", expectedAnswer: "will be traveling" },
                        { type: "text", label: "4. He ___ (wait) for us at the station.", expectedAnswer: "will be waiting" },
                        { type: "text", label: "5. We ___ (study) when you call.", expectedAnswer: "will be studying" },
                    ],
                },
                {
                    id: "ex-future-forms-2",
                    title: "Future Continuous: Negative & Questions",
                    instructions: "Complete with the correct negative or question form.",
                    items: [
                        { type: "text", label: "1. I ___ (not work) tomorrow - it's Saturday.", expectedAnswer: "won't be working" },
                        { type: "text", label: "2. ___ you ___ (sleep) when I call?", expectedAnswer: "Will you be sleeping" },
                        { type: "text", label: "3. She ___ (not travel) during the summer.", expectedAnswer: "won't be traveling" },
                        { type: "text", label: "4. ___ they ___ (wait) for us?", expectedAnswer: "Will they be waiting" },
                    ],
                },
            ],
        },
        {
            id: "practice",
            stepNumber: 6,
            title: "Mixed Practice: All Continuous Tenses",
            explanation: `
                <h3>Put It All Together</h3>
                <p>Time to mix all three continuous tenses - present, past, and future!</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-1",
                    title: "Complete the Sentences",
                    instructions: "Fill in the correct continuous tense form.",
                    items: [
                        { type: "text", label: "1. I ___ (not work) right now - I'm on break. (present negative)", expectedAnswer: "am not working" },
                        { type: "text", label: "2. She ___ (study) when the power went out. (past positive)", expectedAnswer: "was studying" },
                        { type: "text", label: "3. ___ you ___ (sleep) when I call tonight? (future question)", expectedAnswer: "Will you be sleeping" },
                        { type: "text", label: "4. They ___ (not travel) during the holidays this year. (future negative)", expectedAnswer: "won't be traveling" },
                        { type: "text", label: "5. He ___ (cook) dinner when I arrived home. (past positive)", expectedAnswer: "was cooking" },
                        { type: "text", label: "6. We ___ (watch) a movie right now. (present positive)", expectedAnswer: "are watching" },
                    ],
                },
                {
                    id: "ex-mixed-2",
                    title: "Real-Life Conversations",
                    instructions: "Complete these natural English conversations using continuous tenses.",
                    items: [
                        { type: "text", label: "1a. \"What ___ (you/do) right now?\"", expectedAnswer: "are you doing" },
                        { type: "text", label: "1b. \"I ___ (clean) the kitchen.\"", expectedAnswer: "am cleaning" },
                        { type: "text", label: "2. \"Where were you yesterday?\" \"I ___ (shop) when you called.\"", expectedAnswer: "was shopping" },
                        { type: "text", label: "3. \"Will you be home tonight?\" \"Yes, I ___ (work) from home.\"", expectedAnswer: "will be working" },
                        { type: "text", label: "4. \"Why is she so tired?\" \"She ___ (study) all night for the exam.\"", expectedAnswer: "was studying" },
                    ],
                },
            ],
        },
        {
            id: "verb-conjugation",
            stepNumber: 4,
            title: "Verb Conjugation Practice: Master All Continuous Forms",
            icon: "📊",
            explanation: `
                <h3>Complete Continuous Tense Conjugation Charts</h3>
                <p>Practice conjugating verbs across all three continuous tenses and all three forms (affirmative, negative, question). Remember: all continuous tenses use be + verb-ing!</p>

                <div style="background: rgba(240, 180, 90, 0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid rgba(240, 180, 90, 0.3);">
                    <p style="margin: 0;"><strong>💡 Pattern:</strong> Present (am/is/are + -ing) → Past (was/were + -ing) → Future (will be + -ing)</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-conjugation-present-cont",
                    title: "Present Continuous Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'eat' in Present Continuous with the subject 'she'.",
                    items: [
                        { type: "text", label: "Affirmative: She ___ eating", expectedAnswer: "is" },
                        { type: "text", label: "Negative: She ___ eating", expectedAnswer: "isn't" },
                        { type: "text", label: "Question: ___ she eating?", expectedAnswer: "Is" },
                    ],
                },
                {
                    id: "ex-conjugation-past-cont",
                    title: "Past Continuous Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'sleep' in Past Continuous with the subject 'they'.",
                    items: [
                        { type: "text", label: "Affirmative: They ___ sleeping", expectedAnswer: "were" },
                        { type: "text", label: "Negative: They ___ sleeping", expectedAnswer: "weren't" },
                        { type: "text", label: "Question: ___ they sleeping?", expectedAnswer: "Were" },
                    ],
                },
                {
                    id: "ex-conjugation-future-cont",
                    title: "Future Continuous Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'work' in Future Continuous with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ be working", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ be working", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I be working?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-conjugation-ing-forms",
                    title: "Spelling Practice: -ing Forms",
                    instructions: "Write the -ing form of each verb. Watch out for spelling rules!",
                    items: [
                        { type: "text", label: "run → ___", expectedAnswer: "running" },
                        { type: "text", label: "write → ___", expectedAnswer: "writing" },
                        { type: "text", label: "study → ___", expectedAnswer: "studying" },
                        { type: "text", label: "swim → ___", expectedAnswer: "swimming" },
                        { type: "text", label: "make → ___", expectedAnswer: "making" },
                    ],
                },
                {
                    id: "ex-conjugation-mixed-cont-1",
                    title: "Mixed Tenses: Verb 'read'",
                    instructions: "Conjugate the verb 'read' with the subject 'he' in all three continuous tenses (affirmative form only).",
                    items: [
                        { type: "text", label: "Present Continuous: He ___ reading", expectedAnswer: "is" },
                        { type: "text", label: "Past Continuous: He ___ reading", expectedAnswer: "was" },
                        { type: "text", label: "Future Continuous: He ___ be reading", expectedAnswer: "will" },
                    ],
                },
                {
                    id: "ex-conjugation-mixed-cont-2",
                    title: "Mixed Forms: Verb 'drive'",
                    instructions: "Conjugate the verb 'drive' with the subject 'we' in all three forms of Present Continuous.",
                    items: [
                        { type: "text", label: "Affirmative: We ___ driving", expectedAnswer: "are" },
                        { type: "text", label: "Negative: We ___ driving", expectedAnswer: "aren't" },
                        { type: "text", label: "Question: ___ we driving?", expectedAnswer: "Are" },
                    ],
                },
                {
                    id: "ex-conjugation-challenge-cont",
                    title: "Full Conjugation Challenge: Verb 'travel'",
                    instructions: "Complete the full conjugation chart for 'travel' with subject 'you' across all continuous tenses and forms.",
                    items: [
                        { type: "text", label: "Present Continuous - Affirmative: You ___ traveling", expectedAnswer: "are" },
                        { type: "text", label: "Present Continuous - Negative: You ___ traveling", expectedAnswer: "aren't" },
                        { type: "text", label: "Present Continuous - Question: ___ you traveling?", expectedAnswer: "Are" },
                        { type: "text", label: "Past Continuous - Affirmative: You ___ traveling", expectedAnswer: "were" },
                        { type: "text", label: "Past Continuous - Negative: You ___ traveling", expectedAnswer: "weren't" },
                        { type: "text", label: "Past Continuous - Question: ___ you traveling?", expectedAnswer: "Were" },
                        { type: "text", label: "Future Continuous - Affirmative: You ___ be traveling", expectedAnswer: "will" },
                        { type: "text", label: "Future Continuous - Negative: You ___ be traveling", expectedAnswer: "won't" },
                        { type: "text", label: "Future Continuous - Question: ___ you be traveling?", expectedAnswer: "Will" },
                    ],
                },
            ],
        },
        {
            id: "advanced-practice",
            stepNumber: 5,
            title: "Advanced Practice: Mastering Continuous Tenses",
            icon: "🎯",
            explanation: `
                <h3>Real-World Challenges</h3>
                <p>These exercises test your ability to choose the right continuous tense in authentic scenarios. Can you think like a native speaker?</p>
            `,
            exercises: [
                {
                    id: "ex-error-correction",
                    title: "Error Correction: Fix the Continuous Tense Mistakes",
                    instructions: "Each sentence has ONE grammar mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "1. She is study for her exam right now.", expectedAnswer: "She is studying for her exam right now" },
                        { type: "text", label: "2. They was watching TV when I arrived.", expectedAnswer: "They were watching TV when I arrived" },
                        { type: "text", label: "3. I will be travel to Europe next month.", expectedAnswer: "I will be traveling to Europe next month" },
                        { type: "text", label: "4. Are you come to the party tonight?", expectedAnswer: "Are you coming to the party tonight" },
                        { type: "text", label: "5. He were sleeping when the phone rang.", expectedAnswer: "He was sleeping when the phone rang" },
                    ],
                },
                {
                    id: "ex-stative-verbs",
                    title: "Common Mistakes: Stative Verbs",
                    instructions: "Choose the correct sentence. Some verbs can't be continuous!",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I'm knowing the answer." },
                                { value: "b", label: "I know the answer." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "She is having two cats." },
                                { value: "b", label: "She has two cats." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "They are understanding the concept now." },
                                { value: "b", label: "They understand the concept now." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "ex-continuous-vs-simple",
                    title: "Continuous vs Simple: Choose Wisely",
                    instructions: "Decide whether to use continuous or simple tense based on the context.",
                    items: [
                        {
                            type: "radio",
                            label: "Right now, at this exact moment:",
                            options: [
                                { value: "a", label: "I eat lunch." },
                                { value: "b", label: "I'm eating lunch." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "A general fact about your routine:",
                            options: [
                                { value: "a", label: "I work from 9 to 5." },
                                { value: "b", label: "I'm working from 9 to 5." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Describing background action when something else happened:",
                            options: [
                                { value: "a", label: "I walked home when it rained." },
                                { value: "b", label: "I was walking home when it started raining." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "ex-transformation-continuous",
                    title: "Transformation: Change the Tense",
                    instructions: "Transform each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "1. Change to negative: She is working on the project.", expectedAnswer: "She isn't working on the project" },
                        { type: "text", label: "2. Change to question: They were having dinner at 8 PM.", expectedAnswer: "Were they having dinner at 8 PM" },
                        { type: "text", label: "3. Change to Past Continuous: I am reading a book.", expectedAnswer: "I was reading a book" },
                        { type: "text", label: "4. Change to Future Continuous: We are traveling to Spain.", expectedAnswer: "We will be traveling to Spain" },
                    ],
                },
                {
                    id: "ex-contextual-story",
                    title: "Story Time: Complete with Continuous Tenses",
                    instructions: "Fill in the blanks with the correct continuous tense form.",
                    items: [
                        { type: "text", label: "1. Right now, I ___ (sit) in a café and writing this message.", expectedAnswer: "am sitting" },
                        { type: "text", label: "2. Yesterday at 3 PM, I ___ (work) on my laptop at the library.", expectedAnswer: "was working" },
                        { type: "text", label: "3. Tomorrow at noon, I ___ (meet) my friend for lunch.", expectedAnswer: "will be meeting" },
                        { type: "text", label: "4. While I ___ (walk) to work this morning, I saw a rainbow.", expectedAnswer: "was walking" },
                        { type: "text", label: "5. Next week at this time, I ___ (fly) to New York.", expectedAnswer: "will be flying" },
                        { type: "text", label: "6. The kids ___ (play) in the yard when it started raining.", expectedAnswer: "were playing" },
                    ],
                },
                {
                    id: "ex-dialogue-completion",
                    title: "Real Conversation: Fill in the Blanks",
                    instructions: "Complete this phone conversation with the correct continuous forms.",
                    items: [
                        { type: "text", label: "A: Hey! What ___ you ___ (do) right now?", expectedAnswer: "are you doing" },
                        { type: "text", label: "B: I ___ (cook) dinner. What about you?", expectedAnswer: "am cooking" },
                        { type: "text", label: "A: I ___ (drive) home from work. ___ you ___ (make) pasta?", expectedAnswer: "am driving" },
                        { type: "text", label: "B: No, I ___ (try) a new recipe for chicken.", expectedAnswer: "am trying" },
                        { type: "text", label: "A: Great! I ___ (join) you for dinner tomorrow?", expectedAnswer: "will be joining" },
                    ],
                },
                {
                    id: "ex-timeline-practice",
                    title: "Timeline Practice: When Was It Happening?",
                    instructions: "Choose the continuous tense that matches the timeline.",
                    items: [
                        {
                            type: "radio",
                            label: "Action happening RIGHT NOW as you speak:",
                            options: [
                                { value: "a", label: "She was writing an email." },
                                { value: "b", label: "She is writing an email." },
                                { value: "c", label: "She will be writing an email." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Action that was in progress yesterday at 5 PM:",
                            options: [
                                { value: "a", label: "They are having dinner." },
                                { value: "b", label: "They were having dinner." },
                                { value: "c", label: "They will be having dinner." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Action that will be in progress tomorrow at noon:",
                            options: [
                                { value: "a", label: "I am working on the project." },
                                { value: "b", label: "I was working on the project." },
                                { value: "c", label: "I will be working on the project." },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
                {
                    id: "ex-interrupted-actions",
                    title: "Interrupted Actions: Two Things Happening",
                    instructions: "Combine the two actions. Use Past Continuous for the ongoing action and Past Simple for the interruption.",
                    items: [
                        { type: "text", label: "1. I / watch TV + the phone / ring → ___ when ___", expectedAnswer: "I was watching TV when the phone rang" },
                        { type: "text", label: "2. She / study + her friend / arrive → ___ when ___", expectedAnswer: "She was studying when her friend arrived" },
                        { type: "text", label: "3. They / have dinner + the lights / go out → ___ when ___", expectedAnswer: "They were having dinner when the lights went out" },
                        { type: "text", label: "4. We / drive home + we / see the accident → ___ when ___", expectedAnswer: "We were driving home when we saw the accident" },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Quick Reference: Everything You Need",
            icon: "✓",
            explanation: `
                <h3>Your Continuous Tenses Cheat Sheet</h3>
                <p>Here's everything in one place for quick review:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Present Continuous:</strong> Actions happening now or temporary situations
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: am/is/are + verb-ing → "I'm working, She's eating"</li>
                            <li>Negative: am/is/are not + verb-ing → "I'm not working"</li>
                            <li>Question: Am/Is/Are + subject + verb-ing? → "Are you working?"</li>
                            <li>When to use: Right now, temporary arrangements, near-future plans</li>
                        </ul>
                    </li>
                    <li><strong>Past Continuous:</strong> Actions in progress at a specific past time
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: was/were + verb-ing → "I was working, They were eating"</li>
                            <li>Negative: was/were not + verb-ing → "I wasn't working"</li>
                            <li>Question: Was/Were + subject + verb-ing? → "Were you working?"</li>
                            <li>When to use: Ongoing past actions, especially when interrupted</li>
                        </ul>
                    </li>
                    <li><strong>Future Continuous:</strong> Actions that will be in progress at a future time
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: will be + verb-ing → "I'll be working, They'll be eating"</li>
                            <li>Negative: won't be + verb-ing → "I won't be working"</li>
                            <li>Question: Will + subject + be + verb-ing? → "Will you be working?"</li>
                            <li>When to use: Future ongoing actions, overlapping with other future events</li>
                        </ul>
                    </li>
                </ul>
            `,
            tipBox: {
                title: "🚨 Common Continuous Mistakes to Avoid",
                content: "❌ I am work → ✅ I am working (must add -ing). ❌ I was ran → ✅ I was running (verb-ing, not past form). ❌ I will working → ✅ I will be working (will be + verb-ing). ❌ She was study → ✅ She was studying (-ying for study). ❌ They are run → ✅ They are running (double consonant + -ing).",
            },
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly shows an action happening right now?",
            options: [
                { value: "a", label: "I am eating lunch at the moment." },
                { value: "b", label: "I was eating lunch at the moment." },
                { value: "c", label: "I will be eating lunch at the moment." },
            ],
            correctAnswer: "a",
            explanation: "Present Continuous (am eating) for actions happening right now.",
        },
        {
            id: "quiz-2",
            question: "Choose the correct continuous form for: 'She ___ (not work) today.'",
            options: [
                { value: "a", label: "is not working" },
                { value: "b", label: "was not working" },
                { value: "c", label: "will not be working" },
            ],
            correctAnswer: "a",
            explanation: "Present Continuous negative: is not + verb-ing for current situations.",
        },
        {
            id: "quiz-3",
            question: "Which tense fits: 'I ___ (sleep) when the phone rang.'",
            options: [
                { value: "a", label: "am sleeping" },
                { value: "b", label: "was sleeping" },
                { value: "c", label: "will be sleeping" },
            ],
            correctAnswer: "b",
            explanation: "Past Continuous (was sleeping) for ongoing past action that was interrupted.",
        },
        {
            id: "quiz-4",
            question: "Pick the correct question: '___ you ___ (wait) long?'",
            options: [
                { value: "a", label: "Are you waiting" },
                { value: "b", label: "Were you waiting" },
                { value: "c", label: "Will you be waiting" },
            ],
            correctAnswer: "b",
            explanation: "Past Continuous question: Were + subject + verb-ing for past ongoing actions.",
        },
        {
            id: "quiz-5",
            question: "Which shows a temporary situation (not permanent)?",
            options: [
                { value: "a", label: "I'm living with my parents this month." },
                { value: "b", label: "I live with my parents." },
                { value: "c", label: "I lived with my parents." },
            ],
            correctAnswer: "a",
            explanation: "Present Continuous (am living) for temporary situations that aren't permanent.",
        },
        {
            id: "quiz-6",
            question: "Which fits a future ongoing action: 'At 8 PM tomorrow, I ___ (work).'",
            options: [
                { value: "a", label: "am working" },
                { value: "b", label: "was working" },
                { value: "c", label: "will be working" },
            ],
            correctAnswer: "c",
            explanation: "Future Continuous (will be working) for actions in progress at a future time.",
        },
    ],
};
