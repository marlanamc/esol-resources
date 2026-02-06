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
            exercises: [
                {
                    id: "ps-intro-1",
                    title: "Quick Check: Habit or Right Now?",
                    instructions: "Choose the best tense for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "My phone ______ every afternoon.",
                            options: [
                                { value: "present-simple", label: "Present Simple: dies" },
                                { value: "present-continuous", label: "Present Continuous: is dying" },
                            ],
                            expectedAnswer: "present-simple",
                        },
                        {
                            type: "radio",
                            label: "Shh! The baby ______ right now.",
                            options: [
                                { value: "present-simple", label: "Present Simple: sleeps" },
                                { value: "present-continuous", label: "Present Continuous: is sleeping" },
                            ],
                            expectedAnswer: "present-continuous",
                        },
                    ],
                },
            ],
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
                            sentence: "I <strong>set</strong> my alarm for 5 AM every workday.",
                            explanation:
                                "✓ That early morning routine we all know",
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
                            sentence: "The bus <strong>comes</strong> late when you need it most.",
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
                            sentence: "I <strong>work</strong> at the food processing plant on the night shift.",
                            explanation:
                                "✓ Your job and where you work",
                        },
                        {
                            sentence: "She <strong>supervises</strong> the kitchen staff at the restaurant downtown.",
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
                            sentence: "My shift <strong>ends</strong> at 6, but sometimes we <strong>stay</strong> late to finish orders.",
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
                            sentence: "I <strong>hate</strong> when the break room microwave smells like fish.",
                            explanation:
                                "✓ Strong feelings that are consistently true",
                        },
                        {
                            sentence: "She <strong>loves</strong> true crime podcasts but <strong>refuses</strong> to listen before bed.",
                            explanation: "✓ Personal preferences and boundaries",
                        },
                        {
                            sentence: "We <strong>prefer</strong> the day shift. The night shift is too tiring.",
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
                            label: '"My daughter <span class=\'eg-verb\'>practices</span> violin for an hour every afternoon."',
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
                            label: '"Ice <span class=\'eg-verb\'>melts</span> faster when you <span class=\'eg-verb\'>add</span> salt to it."',
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
                            label: '"The museum <span class=\'eg-verb\'>opens</span> at 10 AM on Saturdays."',
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
                            label: '"I absolutely <span class=\'eg-verb\'>love</span> hiking in the mountains, but I <span class=\'eg-verb\'>hate</span> camping."',
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

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            I <span style="color: #8b5cf6; font-weight: 600;">work</span> double shifts on weekends.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            You <span style="color: #8b5cf6; font-weight: 600;">sound</span> exactly like my manager.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            He <span style="color: #8b5cf6; font-weight: 600;">commutes</span> two hours each day. <em style="color: #d97757;">(note the -s)</em>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            She <span style="color: #8b5cf6; font-weight: 600;">checks</span> the equipment every morning before we start. <em style="color: #d97757;">(note the -s)</em>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            It <span style="color: #8b5cf6; font-weight: 600;">takes</span> forever to get through security.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            We <span style="color: #8b5cf6; font-weight: 600;">finish</span> our orders before the lunch rush.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            They <span style="color: #8b5cf6; font-weight: 600;">clean</span> the kitchen at the end of every shift.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "(+s/es for he/she/it only!)", type: "other" },
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
                            label: "The bakery down the street ___ (supply) fresh bread to local restaurants.",
                            expectedAnswer: "supplies",
                        },
                        {
                            type: "text",
                            label: "My neighbor's cat ___ (scratch) anyone who tries to pet it.",
                            expectedAnswer: "scratches",
                        },
                        {
                            type: "text",
                            label: "The museum ___ (display) ancient artifacts from Egypt.",
                            expectedAnswer: "displays",
                        },
                        {
                            type: "text",
                            label: "He ___ (carry) his grandmother's photo everywhere he goes.",
                            expectedAnswer: "carries",
                        },
                        {
                            type: "text",
                            label: "This brand of chocolate ___ (have) the best reputation in Europe.",
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
                            label: "We ___ (recycle) all our glass bottles and cardboard boxes.",
                            expectedAnswer: "recycle",
                        },
                        {
                            type: "text",
                            label: "The library ___ (lend) up to 10 books per person at a time.",
                            expectedAnswer: "lends",
                        },
                        {
                            type: "text",
                            label: "My kids ___ (play) soccer at the park every Saturday morning.",
                            expectedAnswer: "play",
                        },
                        {
                            type: "text",
                            label: "She ___ (volunteer) at the animal shelter twice a month.",
                            expectedAnswer: "volunteers",
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

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            I <span style="color: #8b5cf6; font-weight: 600;">don't work</span> on Sundays—that's my day off.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            You <span style="color: #8b5cf6; font-weight: 600;">don't need</span> to clock in until 7 AM.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            He <span style="color: #8b5cf6; font-weight: 600;">doesn't drink</span> coffee, only energy drinks.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            She <span style="color: #8b5cf6; font-weight: 600;">doesn't take</span> breaks during the busy hours.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            It <span style="color: #8b5cf6; font-weight: 600;">doesn't matter</span> if you send it today or tomorrow.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            We <span style="color: #8b5cf6; font-weight: 600;">don't get</span> overtime pay on holidays.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            They <span style="color: #8b5cf6; font-weight: 600;">don't allow</span> cell phones on the factory floor.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "don't/doesn't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb (no -s!)", type: "verb" },
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
                            label: "My brother ___ (eat) vegetables unless I hide them in the sauce.",
                            expectedAnswer: "doesn't eat",
                        },
                        {
                            type: "text",
                            label: "We ___ (travel) internationally because of our dog's health issues.",
                            expectedAnswer: "don't travel",
                        },
                        {
                            type: "text",
                            label: "The local pool ___ (open) during winter months.",
                            expectedAnswer: "doesn't open",
                        },
                        {
                            type: "text",
                            label: "I ___ (remember) names very well, but I never forget a face.",
                            expectedAnswer: "don't remember",
                        },
                        {
                            type: "text",
                            label: "They ___ (allow) photography inside the temple.",
                            expectedAnswer: "don't allow",
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

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Do</span> you <span style="color: #8b5cf6; font-weight: 600;">work</span> the morning shift or the evening shift?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Do</span> they <span style="color: #8b5cf6; font-weight: 600;">provide</span> uniforms at your job?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Does</span> he <span style="color: #8b5cf6; font-weight: 600;">work</span> in the kitchen or on the production line?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Does</span> she <span style="color: #8b5cf6; font-weight: 600;">know</span> how to operate the forklift?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Does</span> it <span style="color: #8b5cf6; font-weight: 600;">take</span> long to learn the safety procedures?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Do</span> we <span style="color: #8b5cf6; font-weight: 600;">get</span> a break before the dinner rush?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Do/Does", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb (no -s!)", type: "verb" },
                { text: "?", type: "other" },
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
                            label: "___ your parents ___ (celebrate) their anniversary in June?",
                            expectedAnswer: "Do your parents celebrate",
                        },
                        {
                            type: "text",
                            label: "___ this train ___ (stop) at Central Station?",
                            expectedAnswer: "Does this train stop",
                        },
                        {
                            type: "text",
                            label: "___ you ___ (belong) to any sports clubs or fitness centers?",
                            expectedAnswer: "Do you belong",
                        },
                        {
                            type: "text",
                            label: "___ the restaurant ___ (serve) vegetarian options?",
                            expectedAnswer: "Does the restaurant serve",
                        },
                        {
                            type: "text",
                            label: "___ it ___ (rain) a lot during springtime in your country?",
                            expectedAnswer: "Does it rain",
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
                        "We have safety training twice a week.",
                        "She visits her family once a month.",
                        "The system backs up every night at midnight.",
                    ],
                },
                {
                    word: "Specific Times",
                    usage: "on Mondays, in the morning/afternoon/evening, at night, on weekends",
                    examples: [
                        "I work overtime on Wednesdays.",
                        "He goes to the gym in the morning before work.",
                        "They do inventory on weekends.",
                        "The cleaning crew comes in at night.",
                    ],
                },
            ],
            tipBox: {
                title: "📍 Where to Put Frequency Adverbs",
                content:
                    "Put frequency adverbs (always, usually, etc.) BEFORE the main verb: 'I always check the schedule first.' BUT after 'be': 'I am always early for my shift.'",
            },
            exercises: [
                {
                    id: "ex-time-1",
                    title: "Practice: Using Time Expressions",
                    instructions: "Rewrite the sentence with the time expression in the correct position.",
                    items: [
                        {
                            type: "text",
                            label: "My grandmother calls me on Sunday evenings. (always) → My grandmother ___",
                            expectedAnswer: "always calls me on Sunday evenings",
                        },
                        {
                            type: "text",
                            label: "The farmers market sets up in the town square. (twice a week) → The farmers market ___",
                            expectedAnswer: "sets up in the town square twice a week",
                        },
                        {
                            type: "text",
                            label: "We go to the park when the weather is nice. (often) → We ___",
                            expectedAnswer: "often go to the park when the weather is nice",
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
                            label: "The corner pharmacy ___ (deliver) medications to elderly patients. (positive)",
                            expectedAnswer: "delivers",
                        },
                        {
                            type: "text",
                            label: "My son ___ (not eat) anything green unless it's candy. (negative)",
                            expectedAnswer: "doesn't eat",
                        },
                        {
                            type: "text",
                            label: "___ the hotel ___ (include) breakfast in the room rate? (question)",
                            expectedAnswer: "Does the hotel include",
                        },
                        {
                            type: "text",
                            label: "We ___ (not celebrate) Halloween because of our religious beliefs. (negative)",
                            expectedAnswer: "don't celebrate",
                        },
                        {
                            type: "text",
                            label: "___ your neighbor ___ (take) care of your plants when you travel? (question)",
                            expectedAnswer: "Does your neighbor take",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 6: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'live' with the subject 'she'.",
                    items: [
                        { type: "text", label: "Affirmative: She ___", expectedAnswer: "lives" },
                        { type: "text", label: "Negative: She ___ live", expectedAnswer: "doesn't" },
                        { type: "text", label: "Question: ___ she live?", expectedAnswer: "Does" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 7: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "She go to the gym every Monday.", expectedAnswer: "She goes to the gym every Monday" },
                        { type: "text", label: "They doesn't live in the city.", expectedAnswer: "They don't live in the city" },
                        { type: "text", label: "Do he work from home?", expectedAnswer: "Does he work from home" },
                        { type: "text", label: "My brother study engineering at university.", expectedAnswer: "My brother studies engineering at university" },
                        { type: "text", label: "We doesn't have time for breakfast.", expectedAnswer: "We don't have time for breakfast" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 8: Transformation Practice",
                    instructions: "Change each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "Make negative: The store opens at 9 AM.", expectedAnswer: "The store doesn't open at 9 AM" },
                        { type: "text", label: "Make a question: Your sister teaches math.", expectedAnswer: "Does your sister teach math" },
                        { type: "text", label: "Make affirmative: They don't speak French.", expectedAnswer: "They speak French" },
                        { type: "text", label: "Make negative: I drink coffee every morning.", expectedAnswer: "I don't drink coffee every morning" },
                    ],
                },
                {
                    id: "ex-contextual-1",
                    title: "Exercise 9: Real-Life Context",
                    instructions: "Complete this paragraph about Maria's daily routine. Use Present Simple!",
                    items: [
                        { type: "text", label: "Maria ___ (work) as a nurse at the hospital.", expectedAnswer: "works" },
                        { type: "text", label: "She ___ (start) her shift at 7 AM every day.", expectedAnswer: "starts" },
                        { type: "text", label: "During lunch, she usually ___ (eat) in the cafeteria.", expectedAnswer: "eats" },
                        { type: "text", label: "She ___ (not drive) to work—she takes the bus.", expectedAnswer: "doesn't drive" },
                        { type: "text", label: "___ Maria ___ (enjoy) her job? Yes, very much!", expectedAnswer: "Does Maria enjoy" },
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
            exercises: [
                {
                    id: "ps-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "She work on Mondays." },
                                { value: "b", label: "She works on Mondays." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which question is correct?",
                            options: [
                                { value: "a", label: "Does she work here?" },
                                { value: "b", label: "Does she works here?" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz - Diagnostic Assessment (18 questions)
    miniQuiz: [
        // FORM - POSITIVE (Questions 1-4)
        {
            id: "quiz-1",
            question: "My coworker ___ the bus to work every morning.",
            options: [
                { value: "a", label: "take" },
                { value: "b", label: "takes" },
                { value: "c", label: "is taking" },
            ],
            correctAnswer: "b",
            explanation: "With he/she/it subjects, add -s to the verb in Present Simple: takes.",
            skillTag: "form-positive-he-she-it",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "The washing machine ___ a strange noise when it finishes.",
            options: [
                { value: "a", label: "make" },
                { value: "b", label: "makes" },
                { value: "c", label: "makees" },
            ],
            correctAnswer: "b",
            explanation: "For he/she/it, most verbs just add -s: makes (not makees).",
            skillTag: "form-positive-he-she-it",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "We ___ groceries at the market near our house.",
            options: [
                { value: "a", label: "buys" },
                { value: "b", label: "buy" },
                { value: "c", label: "buying" },
            ],
            correctAnswer: "b",
            explanation: "With we/they/I/you, use the base verb with no -s: We buy.",
            skillTag: "form-positive-i-you-we-they",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "My daughter ___ piano lessons every Tuesday afternoon.",
            options: [
                { value: "a", label: "studys" },
                { value: "b", label: "studies" },
                { value: "c", label: "study" },
            ],
            correctAnswer: "b",
            explanation: "Verbs ending in consonant + y change to -ies for he/she/it: study → studies.",
            skillTag: "form-positive-he-she-it",
            difficulty: "medium",
        },

        // FORM - NEGATIVE (Questions 5-7)
        {
            id: "quiz-5",
            question: "He ___ overtime on weekends because he needs family time.",
            options: [
                { value: "a", label: "doesn't work" },
                { value: "b", label: "don't work" },
                { value: "c", label: "doesn't works" },
            ],
            correctAnswer: "a",
            explanation: "Use doesn't + base verb for he/she/it negatives. No -s on the main verb!",
            skillTag: "form-negative-doesnt-base-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "The children ___ vegetables unless I hide them in the pasta sauce.",
            options: [
                { value: "a", label: "doesn't eat" },
                { value: "b", label: "don't eat" },
                { value: "c", label: "don't eats" },
            ],
            correctAnswer: "b",
            explanation: "The children is plural (they), so use don't + base verb: don't eat.",
            skillTag: "form-negative-dont-base-verb",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: "Which negative sentence is correct?",
            options: [
                { value: "a", label: "The restaurant doesn't opens before noon." },
                { value: "b", label: "The restaurant don't open before noon." },
                { value: "c", label: "The restaurant doesn't open before noon." },
            ],
            correctAnswer: "c",
            explanation: "Restaurant is singular (it), so use doesn't + base verb (open, not opens).",
            skillTag: "form-negative-doesnt-base-verb",
            difficulty: "medium",
        },

        // FORM - QUESTIONS (Questions 8-9)
        {
            id: "quiz-8",
            question: "___ your sister ___ at the hospital?",
            options: [
                { value: "a", label: "Does … work" },
                { value: "b", label: "Does … works" },
                { value: "c", label: "Do … works" },
            ],
            correctAnswer: "a",
            explanation: "For questions with he/she/it, use Does + base verb: Does she work?",
            skillTag: "form-question-does-subject-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "___ your parents ___ nearby or in another city?",
            options: [
                { value: "a", label: "Does … lives" },
                { value: "b", label: "Do … live" },
                { value: "c", label: "Do … lives" },
            ],
            correctAnswer: "b",
            explanation: "Parents is plural (they), so use Do + base verb: Do they live?",
            skillTag: "form-question-do-subject-verb",
            difficulty: "medium",
        },

        // WORD ORDER - FREQUENCY ADVERBS (Questions 10-11)
        {
            id: "quiz-10",
            question: "Which sentence has the frequency adverb in the correct position?",
            options: [
                { value: "a", label: "She usually checks her emails before breakfast." },
                { value: "b", label: "She checks usually her emails before breakfast." },
                { value: "c", label: "Usually she checks her emails before breakfast." },
            ],
            correctAnswer: "a",
            explanation: "Frequency adverbs (usually, always, often) go BEFORE the main verb: usually checks.",
            skillTag: "word-order-frequency-adverbs",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "Which sentence is correct with the word 'always'?",
            options: [
                { value: "a", label: "He always is tired after work." },
                { value: "b", label: "He is always tired after work." },
                { value: "c", label: "Always he is tired after work." },
            ],
            correctAnswer: "b",
            explanation: "With the verb 'be', frequency adverbs go AFTER: is always (not always is).",
            skillTag: "word-order-frequency-adverbs",
            difficulty: "medium",
        },

        // MEANING - HABIT VS NOW (Questions 12-13)
        {
            id: "quiz-12",
            question: "Which sentence is correct for a regular habit?",
            options: [
                { value: "a", label: "I am cooking dinner every Sunday." },
                { value: "b", label: "I cook dinner every Sunday." },
                { value: "c", label: "I cooked dinner every Sunday." },
            ],
            correctAnswer: "b",
            explanation: "For habits and routines, use Present Simple: I cook. Present Continuous (am cooking) is for right now.",
            skillTag: "meaning-habit-vs-now",
            difficulty: "easy",
        },
        {
            id: "quiz-13",
            question: "Choose the correct pair of sentences.",
            options: [
                { value: "a", label: "Habit: She drinks coffee every morning. / Right now: She is drinking coffee." },
                { value: "b", label: "Habit: She is drinking coffee every morning. / Right now: She drinks coffee." },
                { value: "c", label: "Habit: She drinking coffee every morning. / Right now: She drink coffee." },
            ],
            correctAnswer: "a",
            explanation: "Present Simple for habits (drinks every morning). Present Continuous for right now (is drinking).",
            skillTag: "meaning-habit-vs-now",
            difficulty: "hard",
        },

        // MEANING - FACTS, SCHEDULES, LIFE SITUATION (Questions 14-16)
        {
            id: "quiz-14",
            question: "The train ___ at 7:45 every morning. (fixed schedule)",
            options: [
                { value: "a", label: "is leaving" },
                { value: "b", label: "leaves" },
                { value: "c", label: "leave" },
            ],
            correctAnswer: "b",
            explanation: "Use Present Simple for schedules and timetables: The train leaves at 7:45.",
            skillTag: "meaning-facts-and-schedules",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "Water ___ at 100 degrees Celsius. (scientific fact)",
            options: [
                { value: "a", label: "is boiling" },
                { value: "b", label: "boil" },
                { value: "c", label: "boils" },
            ],
            correctAnswer: "c",
            explanation: "Use Present Simple for facts and universal truths: Water boils at 100°C.",
            skillTag: "meaning-facts-and-schedules",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question: "Which sentence correctly describes someone's job (permanent situation)?",
            options: [
                { value: "a", label: "My brother is working as a nurse at the hospital." },
                { value: "b", label: "My brother works as a nurse at the hospital." },
                { value: "c", label: "My brother work as a nurse at the hospital." },
            ],
            correctAnswer: "b",
            explanation: "Use Present Simple for life situations like jobs: He works as a nurse. (Present Continuous suggests temporary.)",
            skillTag: "meaning-life-situation",
            difficulty: "hard",
        },

        // ERROR DETECTION (Questions 17-18)
        {
            id: "quiz-17",
            question: "Which sentence has an ERROR?",
            options: [
                { value: "a", label: "She works at the supermarket." },
                { value: "b", label: "She work at the supermarket." },
                { value: "c", label: "She doesn't work at the supermarket." },
            ],
            correctAnswer: "b",
            explanation: "Error: 'She work' is missing the -s. Correct: She works at the supermarket.",
            skillTag: "error-detection-subject-verb-agreement",
            difficulty: "easy",
        },
        {
            id: "quiz-18",
            question: "Which sentence has an ERROR?",
            options: [
                { value: "a", label: "He doesn't like spicy food." },
                { value: "b", label: "He doesn't likes spicy food." },
                { value: "c", label: "They don't like spicy food." },
            ],
            correctAnswer: "b",
            explanation: "Error: 'doesn't likes' is wrong. After doesn't, use the base verb: doesn't like.",
            skillTag: "error-detection-negative-form",
            difficulty: "medium",
        },
    ],

    /*
    TEACHER DIAGNOSTIC NOTES - Present Simple Mini Quiz

    This 18-question diagnostic quiz assesses student understanding of Present Simple
    across form, meaning, and error recognition. Use the skillTags to identify
    specific areas where students need more practice.

    ═══════════════════════════════════════════════════════════════════════════════
    SKILL MAP BY QUESTION
    ═══════════════════════════════════════════════════════════════════════════════

    FORM - POSITIVE SENTENCES
    • form-positive-he-she-it: Q1, Q2, Q4
      Tests: Adding -s/-es for he/she/it subjects
    • form-positive-i-you-we-they: Q3
      Tests: Using base verb (no -s) for I/you/we/they

    FORM - NEGATIVE SENTENCES
    • form-negative-doesnt-base-verb: Q5, Q7
      Tests: doesn't + base verb (no -s on main verb)
    • form-negative-dont-base-verb: Q6
      Tests: don't + base verb for plural subjects

    FORM - QUESTIONS
    • form-question-does-subject-verb: Q8
      Tests: Does + subject + base verb
    • form-question-do-subject-verb: Q9
      Tests: Do + subject + base verb for plural subjects

    WORD ORDER
    • word-order-frequency-adverbs: Q10, Q11
      Tests: Adverb position (before main verb, after 'be')

    MEANING & USE
    • meaning-habit-vs-now: Q12, Q13
      Tests: Present Simple for habits vs Present Continuous for now
    • meaning-facts-and-schedules: Q14, Q15
      Tests: Present Simple for facts, truths, and timetables
    • meaning-life-situation: Q16
      Tests: Present Simple for jobs and permanent situations

    ERROR DETECTION
    • error-detection-subject-verb-agreement: Q17
      Tests: Recognizing missing -s with he/she/it
    • error-detection-negative-form: Q18
      Tests: Recognizing incorrect "doesn't + verb-s" pattern

    ═══════════════════════════════════════════════════════════════════════════════
    DIFFICULTY DISTRIBUTION
    ═══════════════════════════════════════════════════════════════════════════════
    Easy (6):    Q1, Q2, Q3, Q5, Q8, Q12, Q17
    Medium (10): Q4, Q6, Q7, Q9, Q10, Q11, Q14, Q15, Q18
    Hard (2):    Q13, Q16

    ═══════════════════════════════════════════════════════════════════════════════
    INTERPRETATION GUIDE
    ═══════════════════════════════════════════════════════════════════════════════

    If students struggle with form-positive-he-she-it (Q1, Q2, Q4):
    → Review the -s/-es rules in the "Positive Form" section
    → Practice conjugation drills with he/she/it subjects
    → Use gap-fill exercises with third-person singular subjects
    → Pay special attention to -ies spelling (study → studies)

    If students struggle with form-negative (Q5, Q6, Q7):
    → Emphasize that doesn't/don't "takes the -s" so the main verb doesn't
    → Practice transformation: positive → negative
    → Drill: "He works" → "He doesn't work" (verb loses -s)

    If students struggle with form-question (Q8, Q9):
    → Practice question formation with word cards
    → Emphasize: Do/Does already shows the tense, main verb stays base form
    → Drill transformations: statement → question

    If students struggle with word-order-frequency-adverbs (Q10, Q11):
    → Review the rule: before main verbs, after 'be'
    → Practice with sentence reordering activities
    → Create personalized sentences using frequency adverbs

    If students struggle with meaning-habit-vs-now (Q12, Q13):
    → Contrast activities: "What do you do every morning?" vs "What are you doing now?"
    → Use time expressions as clues (every day = Simple, right now = Continuous)
    → Create scenarios that require choosing the right tense

    If students struggle with meaning-facts-and-schedules (Q14, Q15, Q16):
    → Practice with real schedules (bus times, store hours, class timetables)
    → Discuss scientific facts and general truths
    → Clarify: permanent jobs use Simple, temporary projects use Continuous

    If students struggle with error-detection (Q17, Q18):
    → Do more proofreading activities with common errors
    → Have students correct their own previous writing
    → Create "spot the mistake" games with peer correction

    ═══════════════════════════════════════════════════════════════════════════════
    QUICK REFERENCE: COMMON ERROR PATTERNS
    ═══════════════════════════════════════════════════════════════════════════════

    Pattern 1: Missing -s with he/she/it
    ❌ She work every day.
    ✓ She works every day.
    → Tested in: Q1, Q2, Q4, Q17

    Pattern 2: Adding -s after doesn't
    ❌ He doesn't works here.
    ✓ He doesn't work here.
    → Tested in: Q5, Q7, Q18

    Pattern 3: Wrong auxiliary (don't vs doesn't)
    ❌ The shop don't open on Sundays.
    ✓ The shop doesn't open on Sundays.
    → Tested in: Q6, Q7

    Pattern 4: Using Present Continuous for habits
    ❌ I am going to the gym every Monday.
    ✓ I go to the gym every Monday.
    → Tested in: Q12, Q13, Q16

    Pattern 5: Wrong adverb position
    ❌ She checks usually her email.
    ✓ She usually checks her email.
    → Tested in: Q10, Q11
    */
};
