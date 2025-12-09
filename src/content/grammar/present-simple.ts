import type { InteractiveGuideContent } from "@/types/activity";

export const presentSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Present Simple: The Grammar You Use Every Day",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Think about how you describe your daily life. "I work downtown." "Coffee costs too much." "My phone dies every afternoon." That's Present Simple! You already use it - now let's master it.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Present Simple is your go-to tense for talking about reality: your job, your habits, things that drive you crazy, things you love. It's the backbone of everyday English.</p>
            `,
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Present Simple",
            icon: "⭐",
            explanation: `
                <h3>The "Why" Matters More Than the "How"</h3>
                <p>Grammar rules are boring. But understanding <strong>when</strong> native speakers use Present Simple? That's the difference between sounding fluent and sounding like a textbook.</p>
            `,
            usageMeanings: [
                {
                    title: "🔄 1. Habits & Routines (The Real Ones)",
                    description:
                        "Things you actually do regularly, not the gym membership you never use",
                    examples: [
                        {
                            sentence: "I <strong>check</strong> my phone the second I wake up.",
                            explanation:
                                "✓ That habit you won't admit to your therapist",
                        },
                        {
                            sentence: "My neighbor's dog <strong>barks</strong> at exactly 6 AM. Every. Single. Morning.",
                            explanation: "✓ Annoying repeated actions (unfortunately also Present Simple!)",
                        },
                        {
                            sentence: "She <strong>drinks</strong> three cups of coffee before noon.",
                            explanation: "✓ Daily survival tactics",
                        },
                    ],
                },
                {
                    title: "🌍 2. Facts & Universal Truths",
                    description:
                        "Things everyone agrees on (unlike politics)",
                    examples: [
                        {
                            sentence: "Coffee <strong>tastes</strong> better at 185°F, ask any barista.",
                            explanation:
                                "✓ Professional wisdom that's universally true",
                        },
                        {
                            sentence: "The last slice of pizza always <strong>tastes</strong> the best.",
                            explanation:
                                "✓ Universal truths we can all relate to",
                        },
                        {
                            sentence: "Wi-Fi <strong>stops</strong> working the moment you need it most.",
                            explanation: "✓ Modern life facts",
                        },
                    ],
                },
                {
                    title: "💼 3. Your Life Situation",
                    description:
                        "The basics: where you live, what you do, who you are",
                    examples: [
                        {
                            sentence: "I <strong>work</strong> in IT support. Yes, I've tried turning it off and on again.",
                            explanation:
                                "✓ Your job (even if you're already updating your resume)",
                        },
                        {
                            sentence: "She <strong>manages</strong> a team of fifteen people who all need \"just five minutes.\"",
                            explanation: "✓ Work situations that aren't temporary",
                        },
                        {
                            sentence: "My commute <strong>takes</strong> an hour each way.",
                            explanation:
                                "✓ Life circumstances that feel permanent",
                        },
                    ],
                },
                {
                    title: "📅 4. Schedules & Timetables",
                    description: "Fixed times that won't change (usually)",
                    examples: [
                        {
                            sentence: "The team meeting <strong>starts</strong> at 9 AM sharp.",
                            explanation:
                                "✓ Scheduled events - time to grab coffee first",
                        },
                        {
                            sentence: "My shift <strong>ends</strong> at 6, but my inbox <strong>doesn't</strong> know that.",
                            explanation:
                                "✓ Official schedules vs. reality",
                        },
                        {
                            sentence: "The grocery store <strong>closes</strong> at 10 PM, right when I remember I need milk.",
                            explanation: "✓ Fixed business hours that impact your life",
                        },
                    ],
                },
                {
                    title: "❤️ 5. Feelings, Opinions & Preferences",
                    description: "What you think, feel, love, or can't stand",
                    examples: [
                        {
                            sentence: "I <strong>hate</strong> when people reply-all to company-wide emails.",
                            explanation:
                                "✓ Strong feelings that are consistently true",
                        },
                        {
                            sentence: "She <strong>loves</strong> true crime podcasts but <strong>refuses</strong> to listen before bed.",
                            explanation: "✓ Personal preferences and boundaries",
                        },
                        {
                            sentence: "We <strong>prefer</strong> remote work. The commute is just too much.",
                            explanation: "✓ Opinions that shape your decisions",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 The Real Difference",
                content:
                    "Present Simple = general truth or habit. NOT for what's happening right this second (that's Present Continuous). Think: 'I work downtown' (job) vs 'I'm working on a project' (right now).",
            },
            exercises: [
                {
                    id: "ex-meaning-1",
                    title: "Practice: Why Present Simple Here?",
                    instructions:
                        "Read each real-life sentence and identify WHY we use Present Simple. Think about the meaning!",
                    items: [
                        {
                            type: "radio",
                            label: '"I grab coffee on my way to work every morning."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/Universal Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Life Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Schedule/Timetable",
                                },
                                {
                                    value: "preference",
                                    label: "Feeling/Opinion/Preference",
                                },
                            ],
                            expectedAnswer: "habit",
                        },
                        {
                            type: "radio",
                            label: '"Traffic always gets worse after 4 PM."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/Universal Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Life Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Schedule/Timetable",
                                },
                                {
                                    value: "preference",
                                    label: "Feeling/Opinion/Preference",
                                },
                            ],
                            expectedAnswer: "fact",
                        },
                        {
                            type: "radio",
                            label: '"The last train leaves at 11:45 PM."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/Universal Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Life Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Schedule/Timetable",
                                },
                                {
                                    value: "preference",
                                    label: "Feeling/Opinion/Preference",
                                },
                            ],
                            expectedAnswer: "scheduled",
                        },
                        {
                            type: "radio",
                            label: '"I can\'t stand crowded subways during rush hour."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/Universal Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Life Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Schedule/Timetable",
                                },
                                {
                                    value: "preference",
                                    label: "Feeling/Opinion/Preference",
                                },
                            ],
                            expectedAnswer: "preference",
                        },
                    ],
                },
            ],
        },

        // STEP 1: Positive Form
        {
            id: "step-1-positive",
            stepNumber: 2,
            title: "How to Form It: Positive Sentences",
            explanation: `
                <h3>The Pattern Everyone Uses</h3>
                <p>Good news: Present Simple is straightforward. Just watch out for one tricky part - that <strong>-s ending</strong> for he/she/it.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "(+s/es for he/she/it only!)", type: "other" },
            ],
            examples: [
                "I work from home three days a week.",
                "You sound exactly like my manager.",
                "He commutes two hours each day. (note the -s)",
                "She runs the weekly team meeting. (note the -s)",
                "It takes forever to get through security.",
                "We meet deadlines... sometimes.",
                "They share an office that's way too small.",
            ],
            tipBox: {
                title: "💡 The One Rule Everyone Forgets",
                content:
                    "Add -s or -es ONLY for he, she, it! Not for I, you, we, they. Native speakers mess this up all the time too - you're not alone.",
            },
            verbTable: {
                title: "That Annoying -s/-es Ending: The Rules",
                headers: ["When", "Examples"],
                rows: [
                    ["Most verbs: just add -s", "work → works, need → needs, drive → drives"],
                    ["Ends in -s, -sh, -ch, -x, -o: add -es", "miss → misses, push → pushes, teach → teaches, fix → fixes, go → goes"],
                    ["Ends in consonant + y: change to -ies", "try → tries, study → studies, worry → worries"],
                    ["Ends in vowel + y: just add -s", "pay → pays, enjoy → enjoys, say → says"],
                    ["The weird one: have → has", "He has three meetings today. She has my login info."],
                ],
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Add the Right Ending",
                    instructions:
                        "Complete each sentence with the correct form for he/she/it. Think about the -s/-es rules!",
                    items: [
                        {
                            type: "text",
                            label: "1. My boss ___ (reply) to emails at midnight.",
                            placeholder: "verb + s/es/ies",
                            expectedAnswer: "replies",
                        },
                        {
                            type: "text",
                            label: "2. The printer ___ (jam) at least once a day.",
                            placeholder: "verb + s/es",
                            expectedAnswer: "jams",
                        },
                        {
                            type: "text",
                            label: "3. She ___ (teach) English to new employees.",
                            placeholder: "verb + s/es",
                            expectedAnswer: "teaches",
                        },
                        {
                            type: "text",
                            label: "4. He ___ (worry) too much about deadlines.",
                            placeholder: "verb + s/es/ies",
                            expectedAnswer: "worries",
                        },
                        {
                            type: "text",
                            label: "5. My coworker ___ (have) all the office gossip.",
                            placeholder: "irregular!",
                            expectedAnswer: "has",
                        },
                    ],
                },
                {
                    id: "ex-positive-2",
                    title: "Exercise 2: Real-Life Sentences",
                    instructions:
                        "Complete these sentences about everyday life. Watch for he/she/it!",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (need) more coffee before meetings.",
                            placeholder: "I, you, we, they = no -s",
                            expectedAnswer: "need",
                        },
                        {
                            type: "text",
                            label: "2. The office ___ (close) at 6 PM on Fridays.",
                            placeholder: "he/she/it = add -s or -es",
                            expectedAnswer: "closes",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (order) lunch from the same place every Tuesday.",
                            placeholder: "I, you, we, they = no -s",
                            expectedAnswer: "order",
                        },
                        {
                            type: "text",
                            label: "4. She ___ (manage) the whole department by herself.",
                            placeholder: "he/she/it = add -s or -es",
                            expectedAnswer: "manages",
                        },
                    ],
                },
            ],
        },

        // STEP 2: Negative Form
        {
            id: "step-2-negative",
            stepNumber: 3,
            title: "Negative Form: When You Don't",
            explanation: `
                <h3>Saying "No" in English</h3>
                <p>To make Present Simple negative, use <strong>don't</strong> or <strong>doesn't</strong>. Pick the right one and you're golden:</p>
                <ul>
                    <li><strong>don't</strong> = I, you, we, they</li>
                    <li><strong>doesn't</strong> = he, she, it</li>
                </ul>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "don't/doesn't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb (no -s!)", type: "verb" },
            ],
            examples: [
                "I don't answer work emails after 7 PM.",
                "You don't need to CC everyone on that.",
                "He doesn't drink coffee, only energy drinks.",
                "She doesn't tolerate being late to meetings.",
                "It doesn't matter if you send it today or tomorrow.",
                "We don't have meetings on Fridays.",
                "They don't offer remote work at that company.",
            ],
            tipBox: {
                title: "⚠️ Critical Mistake to Avoid",
                content:
                    "When you use doesn't, the main verb goes back to the base form. Say: 'She doesn't work' NOT 'She doesn't works'. The -s is in 'doesn't' already!",
            },
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 3: Making It Negative",
                    instructions: "Complete the negative sentences. Use don't or doesn't + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (understand) half of what my boss says in meetings.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "don't understand",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (check) her email on weekends.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "doesn't check",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (have) a dress code at that office.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "don't have",
                        },
                        {
                            type: "text",
                            label: "4. The Wi-Fi ___ (work) in the conference room.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "doesn't work",
                        },
                        {
                            type: "text",
                            label: "5. We ___ (start) projects without a clear deadline.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "don't start",
                        },
                    ],
                },
            ],
        },

        // STEP 3: Question Form
        {
            id: "step-3-questions",
            stepNumber: 4,
            title: "Question Form: How to Ask",
            explanation: `
                <h3>Asking Questions</h3>
                <p>Put <strong>Do</strong> or <strong>Does</strong> at the beginning to make a question:</p>
                <ul>
                    <li><strong>Do</strong> = I, you, we, they</li>
                    <li><strong>Does</strong> = he, she, it</li>
                </ul>
            `,
            formula: [
                { text: "Do/Does", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb (no -s!)", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Do you work remotely or in the office?",
                "Do they allow dogs in the workplace?",
                "Does he report directly to the CEO?",
                "Does she know about the budget cuts?",
                "Does it really take that long to approve?",
                "Do we have a meeting this afternoon?",
            ],
            tipBox: {
                title: "💡 Same Rule as Negatives",
                content:
                    "In questions, use the base verb - no -s! Say: 'Does she work?' NOT 'Does she works?' The 'does' already shows it's he/she/it.",
            },
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 4: Asking Questions",
                    instructions:
                        "Form questions using Do or Does. Remember: base verb only!",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ you ___ (prefer) morning or afternoon shifts?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Do you prefer",
                        },
                        {
                            type: "text",
                            label: "2. ___ she ___ (know) about the new policy?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Does she know",
                        },
                        {
                            type: "text",
                            label: "3. ___ they ___ (offer) health insurance?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Do they offer",
                        },
                        {
                            type: "text",
                            label: "4. ___ he ___ (commute) from Boston?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Does he commute",
                        },
                        {
                            type: "text",
                            label: "5. ___ it ___ (make) sense to wait until Monday?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Does it make",
                        },
                    ],
                },
            ],
        },

        // Time Expressions
        {
            id: "time-expressions",
            title: "Time Words That Signal Present Simple",
            icon: "⏰",
            explanation: `
                <h3>Your Clue Words</h3>
                <p>When you hear these words and phrases, you know Present Simple is coming. They tell you how often something happens:</p>
            `,
            timeExpressions: [
                {
                    word: "Frequency Adverbs",
                    usage: "always, usually, often, sometimes, rarely, never, hardly ever",
                    examples: [
                        "My alarm always goes off at 6:30 AM.",
                        "She usually takes the 8:05 train.",
                        "They rarely finish on time.",
                        "I never answer unknown numbers.",
                    ],
                },
                {
                    word: "Time Phrases",
                    usage: "every day/week/month/year, once/twice a week, three times a day",
                    examples: [
                        "I grab coffee every morning on my way in.",
                        "We have stand-up meetings twice a week.",
                        "She visits her family once a month.",
                        "The system backs up every night at midnight.",
                    ],
                },
                {
                    word: "Specific Times",
                    usage: "on Mondays, in the morning/afternoon/evening, at night, on weekends",
                    examples: [
                        "I work from home on Wednesdays.",
                        "He goes to the gym in the morning before work.",
                        "They do inventory on weekends.",
                        "The cleaning crew comes in at night.",
                    ],
                },
            ],
            tipBox: {
                title: "📍 Where to Put Frequency Adverbs",
                content:
                    "Put frequency adverbs (always, usually, etc.) BEFORE the main verb: 'I always check my calendar first.' BUT after 'be': 'I am always early to meetings.'",
            },
            exercises: [
                {
                    id: "ex-time-1",
                    title: "Practice: Using Time Expressions",
                    instructions: "Put the time expression in the correct place in the sentence.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ forget to mute myself on video calls. (always)",
                            placeholder: "where does 'always' go?",
                            expectedAnswer: "always",
                        },
                        {
                            type: "text",
                            label: "2. She checks her inbox ___ . (every 10 minutes)",
                            placeholder: "where does the time phrase go?",
                            expectedAnswer: "every 10 minutes",
                        },
                        {
                            type: "text",
                            label: "3. They ___ order lunch from the same restaurant. (usually)",
                            placeholder: "where does 'usually' go?",
                            expectedAnswer: "usually",
                        },
                    ],
                },
            ],
        },

        // STEP 4: Mixed Practice
        {
            id: "step-4-mixed",
            stepNumber: 5,
            title: "Put It All Together: Mixed Practice",
            explanation: `
                <h3>Real-World Application</h3>
                <p>Now let's mix positive, negative, and question forms. This is how you'll use it in actual conversations!</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-1",
                    title: "Exercise 5: Mix of All Forms",
                    instructions:
                        "Complete these sentences with the correct form of Present Simple.",
                    items: [
                        {
                            type: "text",
                            label: "1. My manager ___ (send) emails at 11 PM. (positive)",
                            placeholder: "think about the subject",
                            expectedAnswer: "sends",
                        },
                        {
                            type: "text",
                            label: "2. I ___ (not drink) coffee after 3 PM. (negative)",
                            placeholder: "use don't/doesn't",
                            expectedAnswer: "don't drink",
                        },
                        {
                            type: "text",
                            label: "3. ___ you ___ (commute) by train? (question)",
                            placeholder: "start with Do/Does",
                            expectedAnswer: "Do you commute",
                        },
                        {
                            type: "text",
                            label: "4. The system ___ (not save) automatically. (negative)",
                            placeholder: "use don't/doesn't",
                            expectedAnswer: "doesn't save",
                        },
                        {
                            type: "text",
                            label: "5. ___ she ___ (handle) client complaints? (question)",
                            placeholder: "start with Do/Does",
                            expectedAnswer: "Does she handle",
                        },
                    ],
                },
                {
                    id: "ex-mixed-2",
                    title: "Exercise 6: Write About Your Life",
                    instructions:
                        "Write complete sentences about your actual daily life using Present Simple.",
                    items: [
                        {
                            type: "text",
                            label: "1. What's one thing you do every single day? (positive)",
                            placeholder: "I always...",
                            expectedAnswer: "I check my phone first thing",
                        },
                        {
                            type: "text",
                            label: "2. What's something you absolutely don't do? (negative)",
                            placeholder: "I don't...",
                            expectedAnswer: "I don't cook on weekdays",
                        },
                        {
                            type: "text",
                            label: "3. Ask about someone's routine: (question)",
                            placeholder: "Do you...? or Does he/she...?",
                            expectedAnswer: "Do you work from home",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Quick Reference: Everything You Need",
            icon: "✓",
            explanation: `
                <h3>Bookmark This Page</h3>
                <p>Here's your cheat sheet for Present Simple:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Habits, routines, facts, your job/life situation, schedules, opinions</li>
                    <li><strong>Positive Form:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>I/You/We/They + base verb → "I work, They drive"</li>
                            <li>He/She/It + verb + s/es → "She works, He watches"</li>
                        </ul>
                    </li>
                    <li><strong>Negative Form:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>I/You/We/They + don't + base verb → "I don't work"</li>
                            <li>He/She/It + doesn't + base verb → "She doesn't work"</li>
                        </ul>
                    </li>
                    <li><strong>Question Form:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>Do + I/you/we/they + base verb? → "Do you work?"</li>
                            <li>Does + he/she/it + base verb? → "Does she work?"</li>
                        </ul>
                    </li>
                    <li><strong>Time Clues:</strong> always, usually, every day, twice a week, on Mondays, in the morning</li>
                    <li><strong>Common Mistakes:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>❌ She work → ✅ She works (add -s for he/she/it)</li>
                            <li>❌ He don't → ✅ He doesn't (use doesn't with he/she/it)</li>
                            <li>❌ Does she works? → ✅ Does she work? (base verb in questions)</li>
                            <li>❌ She doesn't works → ✅ She doesn't work (base verb after doesn't)</li>
                        </ul>
                    </li>
                </ul>
            `,
            tipBox: {
                title: "💡 Your Homework",
                content:
                    "Listen for Present Simple in real conversations today. Notice when people add -s and when they use do/don't/does/doesn't. You'll start hearing the patterns everywhere!",
            },
        },
    ],

    // Mini Quiz
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
            explanation: "He/She/It needs -s on the main verb in Present Simple: works, answers.",
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
            explanation: "Use doesn't + base verb (no -s on the main verb).",
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
            explanation: "'Team' is singular here, so use Does + base verb: Does your team have…?",
        },
        {
            id: "quiz-4",
            question: "Which sentence correctly places the frequency adverb?",
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
            question: "Which sentence uses the right tense for a habit (not now)?",
            options: [
                { value: "a", label: "I'm answering email every morning at 7." },
                { value: "b", label: "I answer email every morning at 7." },
                { value: "c", label: "I answered email every morning at 7." },
            ],
            correctAnswer: "b",
            explanation: "Habits/routines use Present Simple: I answer…; not continuous or past.",
        },
    ],
};
