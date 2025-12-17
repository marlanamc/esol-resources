import type { InteractiveGuideContent } from "@/types/activity";

export const presentContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Present Continuous: What's Happening Right Now",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(92, 142, 222, 0.1) 0%, rgba(255, 207, 86, 0.1) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.1rem; margin: 0;">Look around. What's happening right this second? The TV is playing. Someone is cooking. Your phone is charging. Present Continuous is the tense for <strong>what's in motion RIGHT NOW</strong> or what's <strong>just temporary</strong> in your life.</p>
                </div>
            `,
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Present Continuous",
            icon: "⭐",
            explanation: `
                <h3>Use it when something is actively in motion</h3>
                <p>If it's happening right now or only for a short period, it's Present Continuous—not your forever habits.</p>
            `,
            usageMeanings: [
                {
                    title: "▶️ 1. Actions Happening RIGHT NOW",
                    description: "Things in progress as you speak",
                    examples: [
                        {
                            sentence: "I <strong>am watching</strong> TV while my dinner cooks.",
                            explanation: "✓ In-progress action this moment",
                        },
                        {
                            sentence: "She <strong>is talking</strong> on the phone, and her kid <strong>is yelling</strong> in the background.",
                            explanation: "✓ Ongoing action + the reality of life",
                        },
                        {
                            sentence: "They <strong>are waiting</strong> for the bus that's late again.",
                            explanation: "✓ Still happening right now",
                        },
                    ],
                },
                {
                    title: "⏳ 2. Temporary Situations (Not Forever)",
                    description: "Short-term arrangements or phases",
                    examples: [
                        {
                            sentence: "I'm <strong>staying</strong> with my sister this month while my apartment gets painted.",
                            explanation: "✓ Temporary living situation",
                        },
                        {
                            sentence: "He <strong>is working</strong> the closing shift this week.",
                            explanation: "✓ Short-term schedule",
                        },
                        {
                            sentence: "We <strong>are trying</strong> a new recipe for dinner tonight.",
                            explanation: "✓ Temporary experiment, not our usual",
                        },
                    ],
                },
                {
                    title: "🤝 3. Plans in the Near Future",
                    description: "Arranged future plans (similar to 'going to')",
                    examples: [
                        {
                            sentence: "I'm <strong>meeting</strong> my friend for coffee at 3 PM.",
                            explanation: "✓ Scheduled soon",
                        },
                        {
                            sentence: "They're <strong>going</strong> to the movies tonight.",
                            explanation: "✓ Near-future arrangement",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Contrast",
                content:
                    "Present Simple = routines and facts. Present Continuous = happening now or just for a while. 'I work nights' (general). 'I'm working the day shift this week' (temporary).",
            },
            exercises: [
                {
                    id: "ex-usage-pc-1",
                    title: "When Do We Use Present Continuous?",
                    instructions: "Choose the best reason for Present Continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "\"She is talking on the phone right now.\"",
                            options: [
                                { value: "now", label: "Action happening now" },
                                { value: "habit", label: "Habit/routine" },
                                { value: "future", label: "Future schedule" },
                            ],
                            expectedAnswer: "now",
                        },
                        {
                            type: "radio",
                            label: "\"My parents are renovating their bathroom this summer.\"",
                            options: [
                                { value: "temporary", label: "Temporary situation" },
                                { value: "fact", label: "Permanent fact" },
                                { value: "past", label: "Finished past" },
                            ],
                            expectedAnswer: "temporary",
                        },
                        {
                            type: "radio",
                            label: "\"The kids are performing in the school play tomorrow evening.\"",
                            options: [
                                { value: "near-future", label: "Arranged near-future plan" },
                                { value: "habit", label: "Habit" },
                                { value: "past", label: "Past action" },
                            ],
                            expectedAnswer: "near-future",
                        },
                    ],
                },
            ],
        },
        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `<p>Formula: <strong>am/is/are + verb-ing</strong>. Same for all subjects—just swap am/is/are.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
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
                title: "Spelling Rules for -ing",
                headers: ["Rule", "Examples"],
                rows: [
                    ["Most verbs: add -ing", "work → working, email → emailing"],
                    ["Ends in -e: drop -e, add -ing", "write → writing, give → giving"],
                    ["One syllable CVC: double last consonant", "run → running, sit → sitting"],
                ],
            },
            exercises: [
                {
                    id: "ex-pos-1",
                    title: "Exercise 1: What Are They Doing?",
                    instructions: "Use am/is/are + verb-ing to show actions in progress.",
                    items: [
                        { type: "text", label: "1. The baby ___ (sleep) peacefully in her crib right now.", expectedAnswer: "is sleeping" },
                        { type: "text", label: "2. My neighbors ___ (plant) a vegetable garden in their backyard.", expectedAnswer: "are planting" },
                        { type: "text", label: "3. I ___ (take) guitar lessons every Tuesday this semester.", expectedAnswer: "am taking" },
                    ],
                },
            ],
        },
        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `<p>Add <strong>not</strong> after am/is/are to show something is NOT happening.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "am/is/are not", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I'm not eating meat this month—I'm trying something new.",
                "He isn't taking the early shift this week.",
                "They aren't going to the party tonight.",
            ],
            exercises: [
                {
                    id: "ex-neg-1",
                    title: "Exercise 2: Say What's NOT Happening",
                    instructions: "Use am/is/are not + verb-ing.",
                    items: [
                        { type: "text", label: "1. The museum ___ (not charge) admission fees this weekend.", expectedAnswer: "is not charging" },
                        { type: "text", label: "2. We ___ (not travel) internationally this year because of budget constraints.", expectedAnswer: "are not traveling" },
                        { type: "text", label: "3. My son ___ (not listen) to my advice about his college applications.", expectedAnswer: "is not listening" },
                    ],
                },
            ],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `<p>Flip am/is/are to the front to ask about actions in progress.</p>`,
            formula: [
                { text: "Am/Is/Are", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Are you coming to dinner tonight?",
                "Is he watching the game?",
                "Are they making pizza for everyone?",
            ],
            exercises: [
                {
                    id: "ex-q-1",
                    title: "Exercise 3: Ask About Right Now",
                    instructions: "Form questions with am/is/are + subject + verb-ing.",
                    items: [
                        { type: "text", label: "1. ___ the library ___ (offer) free workshops this month?", expectedAnswer: "Is the library offering" },
                        { type: "text", label: "2. ___ your grandparents ___ (visit) from overseas next week?", expectedAnswer: "Are your grandparents visiting" },
                        { type: "text", label: "3. ___ the city ___ (repair) the sidewalks in our neighborhood?", expectedAnswer: "Is the city repairing" },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Use:</strong> Actions happening now, temporary situations, near-future plans</li>
                    <li><strong>Form:</strong> am/is/are + verb-ing (same structure for all subjects)</li>
                    <li><strong>Signal words:</strong> right now, currently, at the moment, this week, today</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly shows an action in progress?",
            options: [
                { value: "a", label: "I watch TV right now." },
                { value: "b", label: "I am watching TV right now." },
            ],
            correctAnswer: "b",
            explanation: "Use am/is/are + verb-ing for actions happening at this moment.",
        },
        {
            id: "quiz-2",
            question: "Which sentence is NOT a good use of Present Continuous?",
            options: [
                { value: "a", label: "She's staying with her cousin this week." },
                { value: "b", label: "I'm knowing the answer right now." },
                { value: "c", label: "They're testing the new feature today." },
            ],
            correctAnswer: "b",
            explanation: "Stative verbs like know rarely take -ing; use 'I know the answer.'",
        },
        {
            id: "quiz-3",
            question: "Choose the correct question form for 'you/work/from home/today'.",
            options: [
                { value: "a", label: "Do you working from home today?" },
                { value: "b", label: "Are you working from home today?" },
                { value: "c", label: "Are you work from home today?" },
            ],
            correctAnswer: "b",
            explanation: "Question: Am/Is/Are + subject + verb-ing.",
        },
        {
            id: "quiz-4",
            question: "Pick the sentence that shows a temporary situation (not permanent).",
            options: [
                { value: "a", label: "My uncle lives in Canada." },
                { value: "b", label: "My uncle is living in a hotel while his house is being renovated." },
                { value: "c", label: "My uncle lived in Canada last decade." },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous fits temporary/short-term arrangements: is living in a hotel while his house is being renovated.",
        },
    ],
};
