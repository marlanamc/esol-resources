import type { InteractiveGuideContent } from "@/types/activity";

export const presentSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Welcome! Let's Learn Present Simple Together",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">We're going to learn Present Simple step by step. Don't worry - we'll practice each part before moving to the next!</p>
                </div>

                <h3>What is Present Simple?</h3>
                <p>It's used to talk about habits, routines, facts, and things that are always true.</p>
            `,
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Present Simple? Understanding the Meaning",
            icon: "⭐",
            explanation: `
                <h3>Why is meaning important?</h3>
                <p>Knowing the <strong>structure</strong> (how to form sentences) is important, but understanding the <strong>meaning</strong> (when and why to use Present Simple) helps you use it correctly in real life!</p>
            `,
            usageMeanings: [
                {
                    title: "🔄 1. Habits & Routines",
                    description:
                        "Things you do regularly or repeatedly",
                    examples: [
                        {
                            sentence: "I <strong>wake up</strong> at 7 AM every day.",
                            explanation:
                                "✓ Actions that happen regularly, not just once",
                        },
                        {
                            sentence: "She <strong>goes</strong> to the gym three times a week.",
                            explanation: "✓ Regular repeated actions",
                        },
                        {
                            sentence: "They <strong>have</strong> dinner together every evening.",
                            explanation: "✓ Daily routines",
                        },
                    ],
                },
                {
                    title: "🌍 2. Facts & General Truths",
                    description:
                        "Things that are always true",
                    examples: [
                        {
                            sentence: "Water <strong>boils</strong> at 100 degrees Celsius.",
                            explanation:
                                "✓ Scientific facts",
                        },
                        {
                            sentence: "The sun <strong>rises</strong> in the east.",
                            explanation:
                                "✓ Universal truths that don't change",
                        },
                        {
                            sentence: "Birds <strong>fly</strong>.",
                            explanation: "✓ General facts about the world",
                        },
                    ],
                },
                {
                    title: "🏠 3. Permanent Situations",
                    description:
                        "Things that are true for a long time",
                    examples: [
                        {
                            sentence: "I <strong>live</strong> in Boston.",
                            explanation:
                                "✓ Situations that don't change often",
                        },
                        {
                            sentence: "She <strong>works</strong> as a teacher.",
                            explanation: "✓ Jobs and professions",
                        },
                        {
                            sentence: "He <strong>speaks</strong> three languages.",
                            explanation:
                                "✓ Abilities and skills",
                        },
                    ],
                },
                {
                    title: "📅 4. Scheduled Events (Timetables)",
                    description: "Fixed schedules",
                    examples: [
                        {
                            sentence: "The train <strong>leaves</strong> at 8:30 AM.",
                            explanation:
                                "✓ Fixed times on timetables",
                        },
                        {
                            sentence: "Class <strong>starts</strong> at 9:00.",
                            explanation:
                                "✓ Scheduled start times",
                        },
                        {
                            sentence: "The store <strong>opens</strong> at 10 AM.",
                            explanation: "✓ Regular opening times",
                        },
                    ],
                },
                {
                    title: "❤️ 5. Likes, Dislikes & Opinions",
                    description: "What you think or feel",
                    examples: [
                        {
                            sentence: "I <strong>like</strong> chocolate.",
                            explanation:
                                "✓ Preferences that are generally true",
                        },
                        {
                            sentence: "She <strong>hates</strong> vegetables.",
                            explanation: "✓ Feelings and opinions",
                        },
                        {
                            sentence: "We <strong>prefer</strong> tea to coffee.",
                            explanation: "✓ Personal preferences",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Key Point",
                content:
                    "Present Simple describes things that are general, repeated, or always true. It's NOT for actions happening right now (that's Present Continuous).",
            },
            exercises: [
                {
                    id: "ex-meaning-1",
                    title: "Practice: Why Do We Use Present Simple Here?",
                    instructions:
                        "Read each sentence and choose why we use Present Simple. Think about the meaning!",
                    items: [
                        {
                            type: "radio",
                            label: '1. "I drink coffee every morning."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/General Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Permanent Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Scheduled Event",
                                },
                                {
                                    value: "preference",
                                    label: "Likes/Dislikes/Preferences",
                                },
                            ],
                            expectedAnswer: "habit",
                        },
                        {
                            type: "radio",
                            label: '2. "The Earth revolves around the sun."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/General Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Permanent Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Scheduled Event",
                                },
                                {
                                    value: "preference",
                                    label: "Likes/Dislikes/Preferences",
                                },
                            ],
                            expectedAnswer: "fact",
                        },
                        {
                            type: "radio",
                            label: '3. "The bus leaves at 6:00 PM."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/General Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Permanent Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Scheduled Event",
                                },
                                {
                                    value: "preference",
                                    label: "Likes/Dislikes/Preferences",
                                },
                            ],
                            expectedAnswer: "scheduled",
                        },
                        {
                            type: "radio",
                            label: '4. "I love pizza."',
                            options: [
                                {
                                    value: "habit",
                                    label: "Habit/Routine",
                                },
                                {
                                    value: "fact",
                                    label: "Fact/General Truth",
                                },
                                {
                                    value: "permanent",
                                    label: "Permanent Situation",
                                },
                                {
                                    value: "scheduled",
                                    label: "Scheduled Event",
                                },
                                {
                                    value: "preference",
                                    label: "Likes/Dislikes/Preferences",
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
            title: "How to Form Present Simple (Positive Sentences)",
            explanation: `
                <h3>The Formula</h3>
                <p>Present Simple has <strong>different forms</strong> depending on the subject!</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "(+s/es for he/she/it)", type: "other" },
            ],
            examples: [
                "I work at a school.",
                "You study English.",
                "He works at a hospital. (add -s)",
                "She teaches math. (add -es)",
                "It rains a lot here.",
                "We live in Boston.",
                "They play soccer.",
            ],
            tipBox: {
                title: "💡 The -s Rule",
                content:
                    "Add -s or -es ONLY for he, she, it! Not for I, you, we, they.",
            },
            verbTable: {
                title: "Adding -s or -es: The Rules",
                headers: ["Rule", "Examples"],
                rows: [
                    ["Most verbs: add -s", "work → works, play → plays, eat → eats"],
                    ["Verbs ending in -s, -sh, -ch, -x, -o: add -es", "go → goes, watch → watches, wash → washes"],
                    ["Verbs ending in consonant + y: change y to i, add -es", "study → studies, try → tries, fly → flies"],
                    ["Verbs ending in vowel + y: just add -s", "play → plays, enjoy → enjoys, say → says"],
                    ["Irregular: have → has", "He has a car. She has two cats."],
                ],
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Add -s or -es?",
                    instructions:
                        "Complete each sentence with the correct form of the verb for he/she/it.",
                    items: [
                        {
                            type: "text",
                            label: "1. She ___ (work) at a hospital.",
                            placeholder: "verb + s/es",
                            expectedAnswer: "works",
                        },
                        {
                            type: "text",
                            label: "2. He ___ (watch) TV every night.",
                            placeholder: "verb + s/es",
                            expectedAnswer: "watches",
                        },
                        {
                            type: "text",
                            label: "3. It ___ (rain) a lot in April.",
                            placeholder: "verb + s/es",
                            expectedAnswer: "rains",
                        },
                        {
                            type: "text",
                            label: "4. She ___ (study) English.",
                            placeholder: "verb + s/es",
                            expectedAnswer: "studies",
                        },
                        {
                            type: "text",
                            label: "5. He ___ (have) a dog.",
                            placeholder: "verb + s/es",
                            expectedAnswer: "has",
                        },
                    ],
                },
                {
                    id: "ex-positive-2",
                    title: "Exercise 2: Write Complete Sentences",
                    instructions:
                        "Write sentences in Present Simple. Remember to add -s/es for he/she/it!",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (like) chocolate.",
                            placeholder: "complete the sentence",
                            expectedAnswer: "like",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (go) to school every day.",
                            placeholder: "complete the sentence",
                            expectedAnswer: "goes",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (play) soccer on weekends.",
                            placeholder: "complete the sentence",
                            expectedAnswer: "play",
                        },
                        {
                            type: "text",
                            label: "4. He ___ (teach) math.",
                            placeholder: "complete the sentence",
                            expectedAnswer: "teaches",
                        },
                    ],
                },
            ],
        },

        // STEP 2: Negative Form
        {
            id: "step-2-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>To make Present Simple negative, we use <strong>do not (don't)</strong> or <strong>does not (doesn't)</strong>:</p>
                <ul>
                    <li>Use <strong>don't</strong> with I, you, we, they</li>
                    <li>Use <strong>doesn't</strong> with he, she, it</li>
                </ul>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "don't/doesn't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I don't like coffee.",
                "You don't work here.",
                "He doesn't eat meat.",
                "She doesn't speak French.",
                "It doesn't rain much here.",
                "We don't have a car.",
                "They don't play tennis.",
            ],
            tipBox: {
                title: "⚠️ Important!",
                content:
                    "When you use doesn't, the main verb goes back to the base form (NO -s). Example: She doesn't work (NOT doesn't works)",
            },
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 3: Negative Sentences",
                    instructions: "Make these sentences negative. Use don't or doesn't.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (not like) vegetables.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "don't like",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (not work) on Sundays.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "doesn't work",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (not have) a car.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "don't have",
                        },
                        {
                            type: "text",
                            label: "4. He ___ (not speak) Spanish.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "doesn't speak",
                        },
                        {
                            type: "text",
                            label: "5. We ___ (not watch) TV in the morning.",
                            placeholder: "don't/doesn't + base verb",
                            expectedAnswer: "don't watch",
                        },
                    ],
                },
            ],
        },

        // STEP 3: Question Form
        {
            id: "step-3-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>To make questions in Present Simple, put <strong>Do</strong> or <strong>Does</strong> at the beginning:</p>
                <ul>
                    <li>Use <strong>Do</strong> with I, you, we, they</li>
                    <li>Use <strong>Does</strong> with he, she, it</li>
                </ul>
            `,
            formula: [
                { text: "Do/Does", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Do you like coffee?",
                "Do they work here?",
                "Does he speak English?",
                "Does she live in Boston?",
                "Does it rain a lot?",
                "Do we have time?",
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Use the base verb in questions - NO -s! Example: Does she work? (NOT Does she works?)",
            },
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 4: Making Questions",
                    instructions:
                        "Write questions in Present Simple. Start with Do or Does.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ you ___ (like) pizza?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Do you like",
                        },
                        {
                            type: "text",
                            label: "2. ___ she ___ (work) here?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Does she work",
                        },
                        {
                            type: "text",
                            label: "3. ___ they ___ (speak) English?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Do they speak",
                        },
                        {
                            type: "text",
                            label: "4. ___ he ___ (have) a car?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Does he have",
                        },
                        {
                            type: "text",
                            label: "5. ___ it ___ (rain) a lot here?",
                            placeholder: "Do/Does + subject + base verb",
                            expectedAnswer: "Does it rain",
                        },
                    ],
                },
            ],
        },

        // Time Expressions
        {
            id: "time-expressions",
            title: "Time Expressions with Present Simple",
            icon: "⏰",
            explanation: `
                <h3>Common Time Words</h3>
                <p>These words and phrases are often used with Present Simple to show how often something happens:</p>
            `,
            timeExpressions: [
                {
                    word: "Frequency Adverbs",
                    usage: "always, usually, often, sometimes, rarely, never",
                    examples: [
                        "I always wake up at 7 AM.",
                        "She usually drinks coffee.",
                        "They sometimes eat out.",
                        "He never smokes.",
                    ],
                },
                {
                    word: "Time Phrases",
                    usage: "every day/week/month/year, once/twice a week, three times a month",
                    examples: [
                        "I go to the gym every day.",
                        "We have meetings twice a week.",
                        "She visits her parents once a month.",
                    ],
                },
                {
                    word: "Days & Times",
                    usage: "on Mondays, in the morning, at night, on weekends",
                    examples: [
                        "I work on Mondays.",
                        "He exercises in the morning.",
                        "They go out on weekends.",
                    ],
                },
            ],
            tipBox: {
                title: "📍 Word Order",
                content:
                    "Frequency adverbs (always, usually, etc.) usually go BEFORE the main verb but AFTER the verb 'to be'. Example: I always eat breakfast. / I am always hungry.",
            },
            exercises: [
                {
                    id: "ex-time-1",
                    title: "Practice: Using Time Expressions",
                    instructions: "Complete the sentences with the time expression in the correct position.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ drink coffee in the morning. (always)",
                            placeholder: "place 'always' correctly",
                            expectedAnswer: "always",
                        },
                        {
                            type: "text",
                            label: "2. She goes to the gym ___ . (twice a week)",
                            placeholder: "place 'twice a week' correctly",
                            expectedAnswer: "twice a week",
                        },
                        {
                            type: "text",
                            label: "3. They ___ eat out on weekends. (usually)",
                            placeholder: "place 'usually' correctly",
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
            title: "Mixed Practice: All Forms Together",
            explanation: `
                <h3>Put It All Together!</h3>
                <p>Now let's practice positive, negative, and question forms. Pay attention to whether you need to add -s, use don't/doesn't, or do/does!</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-1",
                    title: "Exercise 5: Mixed Forms",
                    instructions:
                        "Complete the sentences with the correct form of Present Simple.",
                    items: [
                        {
                            type: "text",
                            label: "1. She ___ (work) at a hospital. (positive)",
                            placeholder: "Present Simple positive",
                            expectedAnswer: "works",
                        },
                        {
                            type: "text",
                            label: "2. They ___ (not like) coffee. (negative)",
                            placeholder: "Present Simple negative",
                            expectedAnswer: "don't like",
                        },
                        {
                            type: "text",
                            label: "3. ___ you ___ (speak) English? (question)",
                            placeholder: "Present Simple question",
                            expectedAnswer: "Do you speak",
                        },
                        {
                            type: "text",
                            label: "4. He ___ (not have) a car. (negative)",
                            placeholder: "Present Simple negative",
                            expectedAnswer: "doesn't have",
                        },
                        {
                            type: "text",
                            label: "5. ___ she ___ (live) in Boston? (question)",
                            placeholder: "Present Simple question",
                            expectedAnswer: "Does she live",
                        },
                    ],
                },
                {
                    id: "ex-mixed-2",
                    title: "Exercise 6: Write Your Own Sentences",
                    instructions:
                        "Write complete sentences about yourself using Present Simple.",
                    items: [
                        {
                            type: "text",
                            label: "1. Write a positive sentence about your daily routine:",
                            placeholder: "I usually...",
                            expectedAnswer: "I usually wake up at 7 AM",
                        },
                        {
                            type: "text",
                            label: "2. Write a negative sentence about something you don't like:",
                            placeholder: "I don't...",
                            expectedAnswer: "I don't like vegetables",
                        },
                        {
                            type: "text",
                            label: "3. Write a question about someone's habits:",
                            placeholder: "Do you...?",
                            expectedAnswer: "Do you exercise every day",
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
                    <li><strong>When to Use:</strong> Habits, routines, facts, permanent situations, scheduled events, likes/dislikes</li>
                    <li><strong>Positive Form:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>I/You/We/They + base verb (I work, They play)</li>
                            <li>He/She/It + verb + s/es (She works, He watches)</li>
                        </ul>
                    </li>
                    <li><strong>Negative Form:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>I/You/We/They + don't + base verb (I don't work)</li>
                            <li>He/She/It + doesn't + base verb (She doesn't work)</li>
                        </ul>
                    </li>
                    <li><strong>Question Form:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>Do + I/you/we/they + base verb? (Do you work?)</li>
                            <li>Does + he/she/it + base verb? (Does she work?)</li>
                        </ul>
                    </li>
                    <li><strong>Time Expressions:</strong> always, usually, often, sometimes, never, every day, twice a week, on Mondays, etc.</li>
                    <li><strong>Important Rules:</strong>
                        <ul class="list-disc pl-6 mt-2">
                            <li>Only add -s/es for he/she/it in positive sentences</li>
                            <li>Use base verb (no -s) in negatives and questions</li>
                            <li>have → has (irregular for he/she/it)</li>
                        </ul>
                    </li>
                </ul>
            `,
            tipBox: {
                title: "💡 Final Tip",
                content:
                    "Practice makes perfect! Try to notice when people use Present Simple in everyday conversations. Pay attention to the -s ending and when they use do/does/don't/doesn't.",
            },
        },
    ],

    // Mini Quiz for comprehension
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence is correct?",
            options: [
                {
                    value: "a",
                    label: "She work at a hospital.",
                },
                {
                    value: "b",
                    label: "She works at a hospital.",
                },
                {
                    value: "c",
                    label: "She working at a hospital.",
                },
            ],
            correctAnswer: "b",
            explanation:
                "We add -s for he/she/it in Present Simple positive sentences. 'She works' is correct.",
        },
        {
            id: "quiz-2",
            question: "Which negative sentence is correct?",
            options: [
                {
                    value: "a",
                    label: "He don't like coffee.",
                },
                {
                    value: "b",
                    label: "He doesn't likes coffee.",
                },
                {
                    value: "c",
                    label: "He doesn't like coffee.",
                },
            ],
            correctAnswer: "c",
            explanation:
                "Use 'doesn't' with he/she/it, and the main verb stays in base form (like, not likes). 'He doesn't like coffee' is correct.",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                {
                    value: "a",
                    label: "Do she speak English?",
                },
                {
                    value: "b",
                    label: "Does she speaks English?",
                },
                {
                    value: "c",
                    label: "Does she speak English?",
                },
            ],
            correctAnswer: "c",
            explanation:
                "Use 'Does' with he/she/it, and the main verb stays in base form (speak, not speaks). 'Does she speak English?' is correct.",
        },
        {
            id: "quiz-4",
            question: "When do we use Present Simple?",
            options: [
                {
                    value: "a",
                    label: "For actions happening right now",
                },
                {
                    value: "b",
                    label: "For habits, routines, and facts",
                },
                {
                    value: "c",
                    label: "For actions that happened yesterday",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Present Simple is used for habits, routines, facts, and things that are generally true - not for actions happening at this moment.",
        },
        {
            id: "quiz-5",
            question: "Which time expression is commonly used with Present Simple?",
            options: [
                { value: "a", label: "yesterday" },
                { value: "b", label: "now" },
                { value: "c", label: "every day" },
            ],
            correctAnswer: "c",
            explanation:
                "'Every day' is a time expression that shows regular habits, which is perfect for Present Simple. 'Yesterday' is for Past Simple, and 'now' is for Present Continuous.",
        },
    ],
};
