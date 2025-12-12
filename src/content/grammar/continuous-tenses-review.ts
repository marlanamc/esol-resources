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
                            sentence: "I <strong>am watching</strong> TV while my dinner cooks.",
                            explanation: "✓ In-progress action this exact moment",
                        },
                        {
                            sentence: "She <strong>is talking</strong> on the phone, and her kid <strong>is yelling</strong> in the background.",
                            explanation: "✓ Multiple ongoing actions right now",
                        },
                        {
                            sentence: "They <strong>are waiting</strong> for the bus that's late again.",
                            explanation: "✓ Still happening as we speak",
                        },
                    ],
                },
                {
                    title: "⏳ Present Continuous: Temporary Situations",
                    description: "For short-term arrangements that aren't permanent",
                    examples: [
                        {
                            sentence: "I'm <strong>staying</strong> with my sister this month while my apartment gets painted.",
                            explanation: "✓ Temporary living situation",
                        },
                        {
                            sentence: "He <strong>is working</strong> the closing shift this week.",
                            explanation: "✓ Short-term schedule change",
                        },
                        {
                            sentence: "We <strong>are trying</strong> a new recipe for dinner tonight.",
                            explanation: "✓ Temporary experiment",
                        },
                    ],
                },
                {
                    title: "🤝 Present Continuous: Near Future Plans",
                    description: "For arranged future activities (like 'going to')",
                    examples: [
                        {
                            sentence: "I'm <strong>meeting</strong> my friend for coffee at 3 PM.",
                            explanation: "✓ Scheduled soon - confirmed plan",
                        },
                        {
                            sentence: "They're <strong>going</strong> to the movies tonight.",
                            explanation: "✓ Near-future arrangement",
                        },
                    ],
                },
                {
                    title: "📅 Past Continuous: Ongoing Past Actions",
                    description: "For actions in progress at a specific past time",
                    examples: [
                        {
                            sentence: "I <strong>was walking</strong> home when it started raining.",
                            explanation: "✓ Ongoing action interrupted by another",
                        },
                        {
                            sentence: "She <strong>was studying</strong> when her phone rang.",
                            explanation: "✓ Background action at specific past moment",
                        },
                        {
                            sentence: "They <strong>were playing</strong> soccer at 3 PM yesterday.",
                            explanation: "✓ In progress during a past time period",
                        },
                    ],
                },
                {
                    title: "🔮 Future Continuous: Future Ongoing Actions",
                    description: "For actions that will be in progress at a future time",
                    examples: [
                        {
                            sentence: "I'll <strong>be sleeping</strong> when you arrive at midnight.",
                            explanation: "✓ Action in progress during another future event",
                        },
                        {
                            sentence: "She <strong>will be working</strong> from 9 to 5 tomorrow.",
                            explanation: "✓ Ongoing future time period",
                        },
                        {
                            sentence: "They <strong>will be traveling</strong> during the holidays.",
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
                            label: '"I am watching TV right now while cooking dinner."',
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
                            label: '"I\'m staying with my parents this week."',
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
                            label: '"I was driving when the accident happened."',
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
                            label: '"I\'ll be working when you call tonight."',
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
                            label: '"She ___ (work) late when I called her." (past ongoing)',
                            options: [
                                { value: "is working", label: "is working" },
                                { value: "was working", label: "was working" },
                                { value: "will be working", label: "will be working" },
                            ],
                            expectedAnswer: "was working",
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
            id: "present-forms",
            stepNumber: 2,
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
                        { type: "text", label: "1. I ___ (clean) my room at the moment.", expectedAnswer: "am cleaning" },
                        { type: "text", label: "2. She ___ (cook) dinner for everyone.", expectedAnswer: "is cooking" },
                        { type: "text", label: "3. They ___ (wait) for the bus that's late.", expectedAnswer: "are waiting" },
                        { type: "text", label: "4. He ___ (fix) his computer right now.", expectedAnswer: "is fixing" },
                        { type: "text", label: "5. We ___ (watch) a movie together.", expectedAnswer: "are watching" },
                    ],
                },
                {
                    id: "ex-present-forms-2",
                    title: "Present Continuous: Negative & Questions",
                    instructions: "Complete with the correct negative or question form.",
                    items: [
                        { type: "text", label: "1. I ___ (not study) right now - I'm too tired.", expectedAnswer: "am not studying" },
                        { type: "text", label: "2. ___ you ___ (listen) to music?", expectedAnswer: "Are you listening" },
                        { type: "text", label: "3. She ___ (not work) today - it's her day off.", expectedAnswer: "is not working" },
                        { type: "text", label: "4. ___ they ___ (play) soccer now?", expectedAnswer: "Are they playing" },
                    ],
                },
            ],
        },
        {
            id: "past-forms",
            stepNumber: 3,
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
            stepNumber: 4,
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
            stepNumber: 5,
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
                {
                    id: "ex-mixed-3",
                    title: "Write About Your Life",
                    instructions: "Write complete sentences about your actual life using continuous tenses.",
                    items: [
                        { type: "text", label: "1. What's something you're doing right now? (Present Continuous)", expectedAnswer: "I am sitting at my desk right now" },
                        { type: "text", label: "2. What were you doing at a specific time yesterday? (Past Continuous)", expectedAnswer: "I was eating dinner at 7 PM yesterday" },
                        { type: "text", label: "3. What will you be doing at a specific future time? (Future Continuous)", expectedAnswer: "I will be sleeping at midnight tomorrow" },
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
                content: `
                    <ul class="space-y-1">
                        <li>❌ I am work → ✅ I am working (must add -ing)</li>
                        <li>❌ I was ran → ✅ I was running (verb-ing, not past form)</li>
                        <li>❌ I will working → ✅ I will be working (will be + verb-ing)</li>
                        <li>❌ She was study → ✅ She was studying (-ying for study)</li>
                        <li>❌ They are run → ✅ They are running (double consonant + -ing)</li>
                    </ul>
                `,
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
