import type { InteractiveGuideContent } from "@/types/activity";

export const simpleTensesReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Simple Tenses Review: Your Real-Life Grammar",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Think about your life: you wake up, you do your thing, you plan ahead. That's the simple tenses! They cover your habits, your history, and your future plans—all in straightforward, no-nonsense English.</p>
                </div>

                <h3>The Three Simple Tenses You Actually Use</h3>
                <p><strong>Present Simple:</strong> Your daily reality and routines (habits, facts, schedules)</p>
                <p><strong>Past Simple:</strong> Finished actions with a clear time stamp (yesterday, last week, in 2020)</p>
                <p><strong>Future Simple:</strong> Quick decisions and promises about tomorrow (I'll help, we'll meet)</p>
            `,
        },
        {
            id: "comparison",
            stepNumber: 1,
            title: "When Real Life Needs Each Simple Tense",
            icon: "⭐",
            explanation: `
                <h3>The "Why" Matters More Than the "How"</h3>
                <p>Grammar rules are boring. But understanding <strong>when</strong> native speakers use each simple tense? That's the difference between sounding fluent and sounding like a textbook.</p>
            `,
            usageMeanings: [
                {
                    title: "🕐 Present Simple: Your Daily Reality",
                    description: "For habits, facts, and things that don't change much",
                    examples: [
                        {
                            sentence: "I <strong>start</strong> work at 8 AM every day.",
                            explanation: "✓ Your regular schedule (not 'I'm starting work')",
                        },
                        {
                            sentence: "She <strong>loves</strong> coffee more than meetings.",
                            explanation: "✓ Feelings and preferences that stay true",
                        },
                        {
                            sentence: "The store <strong>closes</strong> at 9 PM on weekdays.",
                            explanation: "✓ Fixed timetables and schedules",
                        },
                    ],
                },
                {
                    title: "📅 Past Simple: Finished Business",
                    description: "For completed actions with a clear time reference",
                    examples: [
                        {
                            sentence: "I <strong>called</strong> my mom yesterday afternoon.",
                            explanation: "✓ Specific finished time + finished action",
                        },
                        {
                            sentence: "They <strong>visited</strong> Paris last summer.",
                            explanation: "✓ Completed trips and experiences",
                        },
                        {
                            sentence: "She <strong>finished</strong> the project on Friday.",
                            explanation: "✓ Done and dusted with a time stamp",
                        },
                    ],
                },
                {
                    title: "🔮 Future Simple: Quick Future Decisions",
                    description: "For spontaneous plans, promises, and predictions",
                    examples: [
                        {
                            sentence: "I<strong>'ll bring</strong> the snacks tonight.",
                            explanation: "✓ Spontaneous offer (not 'I'm bringing')",
                        },
                        {
                            sentence: "It <strong>will rain</strong> tomorrow, I can feel it.",
                            explanation: "✓ Quick predictions based on current evidence",
                        },
                        {
                            sentence: "We <strong>won't finish</strong> until next week.",
                            explanation: "✓ Negative predictions about the future",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 The Big Picture",
                content: "Present Simple = general truths. Past Simple = finished with a time stamp. Future Simple = quick calls about tomorrow. NOT for detailed future plans (that's 'going to' or Present Continuous).",
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Why This Tense? Think About Meaning",
                    instructions: "Read each real-life sentence and identify WHY we use that simple tense. Think about the meaning!",
                    items: [
                        {
                            type: "radio",
                            label: '"I check my phone first thing every morning."',
                            options: [
                                { value: "present", label: "Present Simple - Habit/Routine" },
                                { value: "past", label: "Past Simple - Finished action" },
                                { value: "future", label: "Future Simple - Future decision" },
                            ],
                            expectedAnswer: "present",
                        },
                        {
                            type: "radio",
                            label: '"They moved to Boston last year."',
                            options: [
                                { value: "present", label: "Present Simple - Habit/Routine" },
                                { value: "past", label: "Past Simple - Finished action" },
                                { value: "future", label: "Future Simple - Future decision" },
                            ],
                            expectedAnswer: "past",
                        },
                        {
                            type: "radio",
                            label: '"I\'ll pick up coffee on my way in."',
                            options: [
                                { value: "present", label: "Present Simple - Habit/Routine" },
                                { value: "past", label: "Past Simple - Finished action" },
                                { value: "future", label: "Future Simple - Future decision" },
                            ],
                            expectedAnswer: "future",
                        },
                    ],
                },
                {
                    id: "ex-comparison-2",
                    title: "Real-Life Situations",
                    instructions: "Choose the tense that fits each real scenario.",
                    items: [
                        {
                            type: "radio",
                            label: '"The meeting ___ at 2 PM every Tuesday." (fixed schedule)',
                            options: [
                                { value: "starts", label: "starts" },
                                { value: "started", label: "started" },
                                { value: "will start", label: "will start" },
                            ],
                            expectedAnswer: "starts",
                        },
                        {
                            type: "radio",
                            label: '"She ___ her keys in the office yesterday." (finished action)',
                            options: [
                                { value: "leaves", label: "leaves" },
                                { value: "left", label: "left" },
                                { value: "will leave", label: "will leave" },
                            ],
                            expectedAnswer: "left",
                        },
                        {
                            type: "radio",
                            label: '"___ you ___ the report by Friday?" (promise about future)',
                            options: [
                                { value: "Will you finish", label: "Will you finish" },
                                { value: "Do you finish", label: "Do you finish" },
                                { value: "Did you finish", label: "Did you finish" },
                            ],
                            expectedAnswer: "Will you finish",
                        },
                    ],
                },
            ],
        },
        {
            id: "forms",
            stepNumber: 2,
            title: "How to Form Each Simple Tense",
            explanation: `
                <h3>The Patterns You Need to Know</h3>
                <p>Each simple tense has its own formula. The good news: they're all straightforward once you know the rules!</p>
            `,
            formula: [
                { text: "Present Simple", type: "other" },
                { text: "=", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb (+s for he/she/it)", type: "verb" },
            ],
            examples: [
                "I work from home.",
                "She works downtown.",
                "They work everywhere.",
            ],
            verbTable: {
                title: "Present Simple: The Tricky -s/-es Ending",
                headers: ["Rule", "Examples"],
                rows: [
                    ["Most verbs: add -s", "work → works, need → needs, drive → drives"],
                    ["Ends in -s, -sh, -ch, -x, -o: add -es", "miss → misses, push → pushes, teach → teaches, fix → fixes, go → goes"],
                    ["Ends in consonant + y: change y to i + es", "try → tries, study → studies, worry → worries"],
                    ["Ends in vowel + y: just add -s", "pay → pays, enjoy → enjoys, say → says"],
                    ["Irregular: have → has", "He has three meetings today."],
                ],
            },
            tipBox: {
                title: "⚠️ Present Simple Mistake Alert",
                content: "Only he/she/it gets -s! I/you/we/they stay with base verb. Say: 'She works' ✓ NOT 'She work' ✗",
            },
            exercises: [
                {
                    id: "ex-forms-present",
                    title: "Present Simple: Add the Right Ending",
                    instructions: "Complete with the correct form for he/she/it. Watch those spelling rules!",
                    items: [
                        {
                            type: "text",
                            label: "1. My boss ___ (reply) to emails at midnight.",
                            expectedAnswer: "replies",
                        },
                        {
                            type: "text",
                            label: "2. The printer ___ (jam) at least once a day.",
                            expectedAnswer: "jams",
                        },
                        {
                            type: "text",
                            label: "3. She ___ (teach) English to new employees.",
                            expectedAnswer: "teaches",
                        },
                        {
                            type: "text",
                            label: "4. He ___ (worry) too much about deadlines.",
                            expectedAnswer: "worries",
                        },
                        {
                            type: "text",
                            label: "5. My coworker ___ (have) all the office gossip.",
                            expectedAnswer: "has",
                        },
                    ],
                },
            ],
        },
        {
            id: "past-forms",
            stepNumber: 3,
            title: "Past Simple Forms",
            formula: [
                { text: "Past Simple", type: "other" },
                { text: "=", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ed (or irregular)", type: "verb" },
            ],
            examples: [
                "I worked late yesterday.",
                "She called her mom.",
                "They visited Paris.",
            ],
            verbTable: {
                title: "Past Simple: Regular vs Irregular",
                headers: ["Type", "How to Form", "Examples"],
                rows: [
                    ["Regular verbs", "Add -ed", "work → worked, clean → cleaned, start → started"],
                    ["Irregular verbs", "Change completely", "go → went, have → had, see → saw"],
                    ["Special -ed endings", "-ed after t/d = /id/", "need → needed, want → wanted, decide → decided"],
                ],
            },
            tipBox: {
                title: "💡 Past Simple Memory Trick",
                content: "All subjects use the same form! 'I worked', 'She worked', 'They worked' - no changing endings like Present Simple.",
            },
            exercises: [
                {
                    id: "ex-forms-past",
                    title: "Past Simple: Regular or Irregular?",
                    instructions: "Complete with the correct past form.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (finish) the report last night.",
                            expectedAnswer: "finished",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (go) to the store yesterday.",
                            expectedAnswer: "went",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (decide) to leave early.",
                            expectedAnswer: "decided",
                        },
                        {
                            type: "text",
                            label: "4. He ___ (see) the movie twice.",
                            expectedAnswer: "saw",
                        },
                        {
                            type: "text",
                            label: "5. We ___ (start) the meeting at 9 AM.",
                            expectedAnswer: "started",
                        },
                    ],
                },
            ],
        },
        {
            id: "future-forms",
            stepNumber: 4,
            title: "Future Simple Forms",
            formula: [
                { text: "Future Simple", type: "other" },
                { text: "=", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will + base verb", type: "verb" },
            ],
            examples: [
                "I will help you tomorrow.",
                "She will bring dessert.",
                "They will finish next week.",
            ],
            tipBox: {
                title: "💡 Will vs Going to",
                content: "'Will' = spontaneous decisions. 'Going to' = planned arrangements. Say: 'I'll help you now' ✓ (spontaneous) vs 'I'm going to help' ✓ (planned).",
            },
            exercises: [
                {
                    id: "ex-forms-future",
                    title: "Future Simple: Will + Base Verb",
                    instructions: "Complete with will + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (call) you when I get home.",
                            expectedAnswer: "will call",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (bring) coffee to the meeting.",
                            expectedAnswer: "will bring",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (not finish) until next week.",
                            expectedAnswer: "won't finish",
                        },
                        {
                            type: "text",
                            label: "4. ___ you ___ (help) me with this?",
                            expectedAnswer: "Will you help",
                        },
                    ],
                },
            ],
        },
        {
            id: "time-expressions",
            title: "Time Words That Signal Simple Tenses",
            icon: "⏰",
            explanation: `
                <h3>Your Clue Words for Simple Tenses</h3>
                <p>Certain words and phrases tell you which simple tense to use. They're like road signs!</p>
            `,
            timeExpressions: [
                {
                    word: "Present Simple Signals",
                    usage: "every day/week/month, usually, always, never, sometimes, on Mondays, at night",
                    examples: [
                        "I always check my email first thing.",
                        "She never arrives late to meetings.",
                        "We meet every Tuesday at 10 AM.",
                    ],
                },
                {
                    word: "Past Simple Signals",
                    usage: "yesterday, last week/month/year, ago, in 2020, when I was young",
                    examples: [
                        "I called my mom yesterday.",
                        "They moved here last year.",
                        "She finished the project three days ago.",
                    ],
                },
                {
                    word: "Future Simple Signals",
                    usage: "tomorrow, next week, tonight, soon, in two days",
                    examples: [
                        "I'll bring snacks tomorrow.",
                        "She will call you tonight.",
                        "We won't finish until next week.",
                    ],
                },
            ],
            tipBox: {
                title: "📍 Time Expression Placement",
                content: "Time words usually go at the END of the sentence: 'I work on Mondays.' NOT 'On Mondays I work.'",
            },
            exercises: [
                {
                    id: "ex-time-1",
                    title: "Match Time Expressions to Tenses",
                    instructions: "Choose which tense fits with each time expression.",
                    items: [
                        {
                            type: "radio",
                            label: '"every morning"',
                            options: [
                                { value: "present", label: "Present Simple (habits)" },
                                { value: "past", label: "Past Simple (finished)" },
                                { value: "future", label: "Future Simple (decisions)" },
                            ],
                            expectedAnswer: "present",
                        },
                        {
                            type: "radio",
                            label: '"last night"',
                            options: [
                                { value: "present", label: "Present Simple (habits)" },
                                { value: "past", label: "Past Simple (finished)" },
                                { value: "future", label: "Future Simple (decisions)" },
                            ],
                            expectedAnswer: "past",
                        },
                        {
                            type: "radio",
                            label: '"next week"',
                            options: [
                                { value: "present", label: "Present Simple (habits)" },
                                { value: "past", label: "Past Simple (finished)" },
                                { value: "future", label: "Future Simple (decisions)" },
                            ],
                            expectedAnswer: "future",
                        },
                    ],
                },
            ],
        },
        {
            id: "practice",
            stepNumber: 5,
            title: "Mixed Practice: All Simple Tenses",
            explanation: `
                <h3>Put It All Together</h3>
                <p>Time to mix positive, negative, and question forms across all three simple tenses!</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-1",
                    title: "Complete the Sentences",
                    instructions: "Fill in the correct simple tense form.",
                    items: [
                    ],
                },
                {
                    id: "ex-mixed-2",
                    title: "Real-Life Conversations",
                    instructions: "Complete these natural English conversations.",
                    items: [
                    ],
                },
                {
                    id: "ex-mixed-3",
                    title: "Write About Your Week",
                    instructions: "Write complete sentences about your actual routine using different simple tenses.",
                    items: [
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Quick Reference: Everything You Need",
            icon: "✓",
            explanation: `
                <h3>Your Simple Tenses Cheat Sheet</h3>
                <p>Here's everything in one place for quick review:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Present Simple:</strong> Habits, facts, schedules, feelings
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: I/you/we/they + base verb, he/she/it + verb + s/es</li>
                            <li>Negative: don't/doesn't + base verb</li>
                            <li>Question: Do/Does + subject + base verb?</li>
                            <li>Time words: every day, usually, always, never, on Mondays</li>
                        </ul>
                    </li>
                    <li><strong>Past Simple:</strong> Finished actions with time stamps
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: subject + verb-ed (regular) or irregular form</li>
                            <li>Negative: didn't + base verb</li>
                            <li>Question: Did + subject + base verb?</li>
                            <li>Time words: yesterday, last week, ago, in 2020</li>
                        </ul>
                    </li>
                    <li><strong>Future Simple:</strong> Spontaneous decisions and promises
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: subject + will + base verb</li>
                            <li>Negative: subject + won't + base verb</li>
                            <li>Question: Will + subject + base verb?</li>
                            <li>Time words: tomorrow, next week, tonight, soon</li>
                        </ul>
                    </li>
                </ul>
            `,
            tipBox: {
                title: "🚨 Common Mistakes to Avoid",
                content: `
                    <ul class="space-y-1">
                        <li>❌ She work downtown → ✅ She works downtown (add -s for he/she/it)</li>
                        <li>❌ He don't like coffee → ✅ He doesn't like coffee (doesn't with he/she/it)</li>
                        <li>❌ Does she works? → ✅ Does she work? (base verb in questions)</li>
                        <li>❌ She didn't worked → ✅ She didn't work (base verb after didn't)</li>
                        <li>❌ I will going → ✅ I will go (no -ing with will)</li>
                    </ul>
                `,
            },
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence is correct (subject-verb agreement + tense)?",
            options: [
                { value: "a", label: "She work downtown and answer emails at midnight." },
                { value: "b", label: "She works downtown and answers emails at midnight." },
                { value: "c", label: "She is work downtown and answer emails at midnight." },
            ],
            correctAnswer: "b",
            explanation: "Present Simple: he/she/it needs -s ending on main verbs: works, answers.",
        },
        {
            id: "quiz-2",
            question: "Choose the correct negative sentence.",
            options: [
                { value: "a", label: "The office don't close early on Fridays." },
                { value: "b", label: "The office doesn't closes early on Fridays." },
                { value: "c", label: "The office doesn't close early on Fridays." },
            ],
            correctAnswer: "c",
            explanation: "Present Simple negative: doesn't + base verb (no -s on main verb).",
        },
        {
            id: "quiz-3",
            question: "Pick the correct question form.",
            options: [
                { value: "a", label: "Does your team have stand-up at 9?" },
                { value: "b", label: "Do your team has stand-up at 9?" },
                { value: "c", label: "Do your team have stand-up at 9?" },
            ],
            correctAnswer: "a",
            explanation: "'Team' is singular, so Does + base verb: Does your team have…?",
        },
        {
            id: "quiz-4",
            question: "Which sentence correctly places the time expression?",
            options: [
                { value: "a", label: "I check always my calendar first." },
                { value: "b", label: "I always check my calendar first." },
                { value: "c", label: "Always I check my calendar first." },
            ],
            correctAnswer: "b",
            explanation: "Frequency adverbs go before the main verb: I always check…",
        },
        {
            id: "quiz-5",
            question: "Which tense fits a daily habit (not right now)?",
            options: [
                { value: "a", label: "I drink coffee every morning at 7." },
                { value: "b", label: "I am drinking coffee every morning at 7." },
                { value: "c", label: "I will drink coffee every morning at 7." },
            ],
            correctAnswer: "a",
            explanation: "Habits/routines use Present Simple: I drink…; not continuous or future.",
        },
        {
            id: "quiz-6",
            question: "Which tense fits: 'She promised she'd help, so she ___ tomorrow.'",
            options: [
                { value: "a", label: "helps" },
                { value: "b", label: "will help" },
                { value: "c", label: "helped" },
            ],
            correctAnswer: "b",
            explanation: "Future promises/decisions use Future Simple: will help.",
        },
    ],
};
