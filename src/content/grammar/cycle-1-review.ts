import type { InteractiveGuideContent } from "@/types/activity";

export const cycleOneReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Cycle 1 Review: A gentle grammar check-in",
            icon: "🌱",
            explanation: `
                <p>Cycle 1 asked you to notice how time and meaning play together in everyday routines. This review is a calm check-in—no frantic memorization, just reminders that your grammar toolkit already follows a rhythm.</p>
                <p>We start with the three simple tenses that describe daily life, continue into the flowing continuous forms, pause at present perfect to connect past actions to now, and then add the words that describe people, frequency, comparisons, and the connectors that keep it all moving.</p>
                <p>Think of each section as another layer on the same story. You already have the sentences; this guide simply names the pieces and lets you practice them together.</p>
            `,
            tipBox: {
                title: "✨ Reminder",
                content: "This guide is about noticing patterns. If a sentence already feels familiar, you are ready to move on to the next layer—no need to memorize every word."
            },
            exercises: [
                {
                    id: "cycle1-intro-tone",
                    title: "A quick mood check",
                    instructions: "Choose the tone that matches the kind of review we promised above.",
                    items: [
                        {
                            type: "radio",
                            label: "What feels like the best description?",
                            options: [
                                { value: "warm", label: "Warm check-in that highlights meaning" },
                                { value: "strict", label: "Strict list of rules and exceptions" },
                                { value: "silent", label: "Pure reference with no feeling" }
                            ],
                            expectedAnswer: "warm"
                        }
                    ]
                }
            ]
        },
        {
            id: "simple-tenses",
            title: "Simple Tenses and the words that pin them to time",
            icon: "🕰️",
            explanation: `
                <p>Simple tenses are the backbone of everyday stories. They each live in their own moment: present for habits, past for finished stories, and future for plans.</p>
                <p>Pairing time indicators with each tense makes them feel grounded. When you hear <strong>every day</strong> or <strong>today</strong>, your ears tune into present simple. When someone says <strong>yesterday</strong> or <strong>last week</strong>, the past simple tug appears. Future-focused words like <strong>tomorrow</strong> or <strong>next week</strong> cue the future simple.</p>
                <p>Don’t forget how to make negatives and questions: <strong>don’t/doesn’t/didn’t</strong> flip the routine upside down, and <strong>do/does/did</strong> invite conversation.</p>
            `,
            timeExpressions: [
                {
                    word: "today / every day",
                    usage: "Present Simple for habitual routines and facts",
                    examples: ["I eat breakfast at home every day.", "She takes the bus today."],
                },
                {
                    word: "yesterday / last night / in 2020",
                    usage: "Past Simple to talk about finished actions with a clear time",
                    examples: ["I visited the museum last night.", "We cleaned the kitchen in 2020."],
                },
                {
                    word: "tomorrow / next week / soon",
                    usage: "Future Simple to share quick plans or predictions",
                    examples: ["I will call you tomorrow.", "They will start the new class soon."],
                }
            ],
            usageMeanings: [
                {
                    title: "Present Simple: Habits and facts",
                    description: "Use this tense for routines, schedules, and truths you say without thinking.",
                    examples: [
                        { sentence: "I take a walk every morning.", explanation: "Daily habit" },
                        { sentence: "The library opens at 9 a.m.", explanation: "Schedule/fact" }
                    ]
                },
                {
                    title: "Past Simple: Stories with a timestamp",
                    description: "Close the story; the action finished at a specific time.",
                    examples: [
                        { sentence: "We met our mentors last week.", explanation: "Finished action" },
                        { sentence: "She cooked dinner yesterday.", explanation: "Clearly past" }
                    ]
                },
                {
                    title: "Future Simple: Promises and plans",
                    description: "Promise, plan, or quick decision for a moment that is still ahead.",
                    examples: [
                        { sentence: "I will bring the files tomorrow.", explanation: "Promise" },
                        { sentence: "He will help us next month.", explanation: "Near-future plan" }
                    ]
                }
            ],
            exercises: [
                {
                    id: "cycle1-simple-situations",
                    title: "Match the tense to the time cue",
                    instructions: "Read the cue and select the simple tense that sounds natural for that sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "\"Every morning, I ___ coffee.\"",
                            options: [
                                { value: "present-simple", label: "Present Simple" },
                                { value: "past-simple", label: "Past Simple" },
                                { value: "future-simple", label: "Future Simple" }
                            ],
                            expectedAnswer: "present-simple"
                        },
                        {
                            type: "radio",
                            label: "\"Yesterday, we ___ the homework.\"",
                            options: [
                                { value: "present-simple", label: "Present Simple" },
                                { value: "past-simple", label: "Past Simple" },
                                { value: "future-simple", label: "Future Simple" }
                            ],
                            expectedAnswer: "past-simple"
                        },
                        {
                            type: "radio",
                            label: "\"Tomorrow, I ___ you.\"",
                            options: [
                                { value: "present-simple", label: "Present Simple" },
                                { value: "past-simple", label: "Past Simple" },
                                { value: "future-simple", label: "Future Simple" }
                            ],
                            expectedAnswer: "future-simple"
                        }
                    ]
                },
                {
                    id: "cycle1-simple-time-select",
                    title: "Pick the time anchor",
                    instructions: "Choose the time word that matches the tense in each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "\"She will finish the test.\"",
                            options: ["yesterday", "tomorrow", "today"],
                            expectedAnswer: "tomorrow"
                        },
                        {
                            type: "select",
                            label: "\"They talked about the trip ___.\"",
                            options: ["next week", "last night", "right now"],
                            expectedAnswer: "last night"
                        }
                    ]
                }
            ]
        },
        {
            id: "questions-negatives",
            title: "Questions & Negatives that keep you honest",
            icon: "❓",
            explanation: `
                <p>Every tense can be positive, negative, or a question. Helpers move the same way: do/does/did for simple forms, will for future, and be for continuous ones.</p>
                <p>Listening for helpers lets you feel if the sentence is routine, a past report, or a curious question.</p>
            `,
            usageMeanings: [
                {
                    title: "Present Simple helpers",
                    description: "Use don't/doesn't for negatives and do/does for questions around habits.",
                    examples: [
                        { sentence: "I don't drink coffee after 5 p.m.", explanation: "Negative routine" },
                        { sentence: "Do you take the train every morning?", explanation: "Question about habit" }
                    ]
                },
                {
                    title: "Past Simple helpers",
                    description: "Past questions and negatives stay with did—it carries the past time at the front of the sentence.",
                    examples: [
                        { sentence: "He didn't finish the work yesterday.", explanation: "Negative past action" },
                        { sentence: "Did she call when the class ended?", explanation: "Past yes/no question" }
                    ]
                },
                {
                    title: "Future Simple helpers",
                    description: "Future negatives use won't; questions swap will to the front.",
                    examples: [
                        { sentence: "I won't forget to send the email.", explanation: "Future negative promise" },
                        { sentence: "Will you join the conversation tomorrow?", explanation: "Future invitation" }
                    ]
                },
                {
                    title: "Continuous helpers stay close",
                    description: "Continuous negatives/questions keep the be helper in place (am/is/are/was/were/will be).",
                    examples: [
                        { sentence: "She isn't sleeping; she's studying instead.", explanation: "Negative present continuous" },
                        { sentence: "Are they arriving while the class starts?", explanation: "Present continuous question" }
                    ]
                }
            ],
            tipBox: {
                title: "🧭 Helper check",
                content: "Ask yourself: 'What helper verb do I hear?' That helper tells you whether it's simple or continuous and whether you're in a negative or question mood."
            },
            exercises: [
                {
                    id: "cycle1-helper-identify",
                    title: "Helper hunt",
                    instructions: "Choose whether each sentence is positive, negative, or a question.",
                    items: [
                        {
                            type: "radio",
                            label: "\"Do you practice every week?\"",
                            options: [
                                { value: "question", label: "Question" },
                                { value: "negative", label: "Negative" },
                                { value: "positive", label: "Positive" }
                            ],
                            expectedAnswer: "question"
                        },
                        {
                            type: "radio",
                            label: "\"She doesn't come on Saturdays.\"",
                            options: [
                                { value: "question", label: "Question" },
                                { value: "negative", label: "Negative" },
                                { value: "positive", label: "Positive" }
                            ],
                            expectedAnswer: "negative"
                        },
                        {
                            type: "radio",
                            label: "\"We will not miss the train.\"",
                            options: [
                                { value: "question", label: "Question" },
                                { value: "negative", label: "Negative" },
                                { value: "positive", label: "Positive" }
                            ],
                            expectedAnswer: "negative"
                        }
                    ]
                },
                {
                    id: "cycle1-helper-rewrite",
                    title: "Shift the helper",
                    instructions: "Rewrite each sentence in the requested form.",
                    items: [
                        {
                            type: "text",
                            label: "Change to a question: 'You practiced yesterday.'",
                            expectedAnswer: "Did you practice yesterday?"
                        },
                        {
                            type: "text",
                            label: "Change to a negative: 'He is listening now.'",
                            expectedAnswer: "He isn't listening now."
                        },
                        {
                            type: "text",
                            label: "Change to a question: 'They are studying late.'",
                            expectedAnswer: "Are they studying late?"
                        }
                    ]
                }
            ]
        },
        {
            id: "continuous-tenses",
            title: "Continuous Tenses: the motion of a moment",
            icon: "🌊",
            explanation: `
                <p>Continuous tenses keep one foot on the ground and one foot moving. They use <em>be + verb-ing</em> to show actions that are happening right now, were in progress, or will be ongoing.</p>
                <p>We keep the time anchors from the simple tenses, but now we imagine the action is unfolding—this is a nice bridge to hear how habits can stretch into the moment.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "Auxiliary be (am/is/are/was/were/will be)", type: "verb" },
                { text: "Main verb + -ing", type: "other" }
            ],
            usageMeanings: [
                {
                    title: "Present Continuous: action in progress",
                    description: "This feels like something happening right as you tell it.",
                    examples: [
                        { sentence: "I am talking while I prepare the notes.", explanation: "Middle of the action" },
                        { sentence: "They are reading quietly now.", explanation: "Right now" }
                    ]
                },
                {
                    title: "Past Continuous: background or interrupted actions",
                    description: "Use this when another action happens in the middle of something else.",
                    examples: [
                        { sentence: "The bus was arriving when the rain started.", explanation: "Background action interrupted" },
                        { sentence: "She was teaching while the kids were drawing.", explanation: "Two actions in progress" }
                    ]
                },
                {
                    title: "Future Continuous: we imagine the future moment in motion",
                    description: "Shows that the action will be happening at a specific time ahead.",
                    examples: [
                        { sentence: "He will be working at 3 p.m. tomorrow.", explanation: "Future routine in progress" },
                        { sentence: "We will be practicing when the guests arrive.", explanation: "Future overlap" }
                    ]
                }
            ],
            tipBox: {
                title: "💡 Continuous key",
                content: "Keep the helper verb be in all continuous tenses. Only the form (am/is/are, was/were, will be) changes with the time you mean."
            },
            exercises: [
                {
                    id: "cycle1-continuous-feel",
                    title: "Why the continuous tense?",
                    instructions: "Match each sentence to the reason you hear a continuous tense.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I am listening while you explain.\"",
                            options: [
                                { value: "now", label: "Showing action happening right now" },
                                { value: "past", label: "Action that finished" },
                                { value: "future", label: "Plan for tomorrow" }
                            ],
                            expectedAnswer: "now"
                        },
                        {
                            type: "radio",
                            label: "\"They were cooking when the guests knocked.\"",
                            options: [
                                { value: "interrupt", label: "Background action interrupted" },
                                { value: "habit", label: "Regular routine" },
                                { value: "promise", label: "Future promise" }
                            ],
                            expectedAnswer: "interrupt"
                        },
                        {
                            type: "radio",
                            label: "\"We will be studying while the computers run practice tests.\"",
                            options: [
                                { value: "future-overlap", label: "Two future actions overlapping" },
                                { value: "past", label: "Past routine" },
                                { value: "simple", label: "Simple future" }
                            ],
                            expectedAnswer: "future-overlap"
                        }
                    ]
                },
                {
                    id: "cycle1-continuous-rewrite",
                    title: "Rewrite for ongoing action",
                    instructions: "Turn the sentence into a continuous form that feels like the action is unfolding now.",
                    items: [
                        {
                            type: "text",
                            label: "Right now, I eat lunch.",
                            expectedAnswer: "I am eating lunch."
                        }
                    ]
                }
            ]
        },
        {
            id: "present-perfect",
            title: "Present Perfect: your stories with a bridge to now",
            icon: "🌉",
            explanation: `
                <p>Present perfect connects the past to the present. The time period is not over (this week, this month, today), but the action already happened.</p>
                <p>We often see words like <strong>already</strong>, <strong>yet</strong>, <strong>ever</strong>, <strong>never</strong>, <strong>just</strong>, <strong>recently</strong>, <strong>for</strong>, and <strong>since</strong> in the same sentence.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "have / has", type: "verb" },
                { text: "past participle", type: "other" }
            ],
            timeExpressions: [
                { word: "already / yet", usage: "Recently finished actions", examples: ["I have already finished the task.", "Have you finished yet?"] },
                { word: "ever / never", usage: "Experiences up to now", examples: ["Have you ever tried falafel?", "I have never been to Boston."] },
                { word: "for / since", usage: "Actions that continue to the present", examples: ["She has lived here for five years.", "They have known each other since 2010."] }
            ],
            usageMeanings: [
                {
                    title: "Experiences with present perfect",
                    description: "Talk about things you have (or haven't) done before now.",
                    examples: [
                        { sentence: "I have traveled on the Green Line.", explanation: "Experience" },
                        { sentence: "She has never seen snow.", explanation: "Negative experience" }
                    ]
                },
                {
                    title: "Recent actions that still matter",
                    description: "Use this tense when the action finished recently but the moment is still connected to the present.",
                    examples: [
                        { sentence: "We have just cleaned the room.", explanation: "Result still visible" },
                        { sentence: "He has already started the meeting.", explanation: "Action finished, impact now" }
                    ]
                }
            ],
            tipBox: {
                title: "💡 Notice the difference",
                content: "Past simple likes clear time markers (yesterday, last week). Present perfect leaves the time open or uses words like for/since, yet, already."
            },
            exercises: [
                {
                    id: "cycle1-present-perfect-scramble",
                    title: "Reorder to make a present perfect sentence",
                    instructions: "Use the words to create a sentence about something that just happened.",
                    items: [
                        {
                            type: "word-scramble",
                            label: "Words: have / just / I / eaten / lunch",
                            words: ["have", "just", "I", "eaten", "lunch"],
                            correctAnswer: "I have just eaten lunch.",
                            hint: "Start with the subject and the helper verb."
                        }
                    ]
                },
                {
                    id: "cycle1-present-perfect-fill",
                    title: "Complete the present perfect",
                    instructions: "Add the helper verb and past participle that fit the sentence.",
                    items: [
                        {
                            type: "text",
                            label: "She ___ already ___ the forms.",
                            expectedAnswer: "has signed"
                        }
                    ]
                }
            ]
        },
        {
            id: "common-confusions",
            title: "Commonly confused moments: pause and notice",
            icon: "⚠️",
            explanation: `
                <p>Because the tenses share similar vocabulary, we sometimes use the wrong helper verb. This section pauses on a few crowded corners so you can feel the difference.</p>
                <p>We compare Past Simple vs Present Perfect when the time is specific versus still connected to now, and Simple vs Continuous when the ending feels static vs in motion.</p>
            `,
            usageMeanings: [
                {
                    title: "Past Simple vs Present Perfect",
                    description: "Past simple needs a clear past time (yesterday, last year). Present perfect keeps the window open (this week, already, yet).",
                    examples: [
                        { sentence: "I practiced the speech yesterday.", explanation: "Past Simple with a clear day" },
                        { sentence: "I have practiced the speech this week.", explanation: "Present Perfect without a finished time" }
                    ]
                },
                {
                    title: "Simple vs Continuous",
                    description: "Simple tenses describe facts or routines; continuous tenses show the same action in motion.",
                    examples: [
                        { sentence: "I work from 9 to 5.", explanation: "Present Simple habit" },
                        { sentence: "I am working right now.", explanation: "Present Continuous in progress" }
                    ]
                }
            ],
            tipBox: {
                title: "🧭 Quick check",
                content: "Ask: 'Is the time finished?' and 'Is the action moving?' That helps you pair the tense with either past (specific) or present perfect (open) and simple vs continuous motion."
            },
            exercises: [
                {
                    id: "cycle1-confusions-radio",
                    title: "Which tense belongs?",
                    instructions: "Listen to the clue and choose the tense that fits the time/motion.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I ___ the form yesterday.\"",
                            options: [
                                { value: "past-simple", label: "Past Simple" },
                                { value: "present-perfect", label: "Present Perfect" }
                            ],
                            expectedAnswer: "past-simple"
                        },
                        {
                            type: "radio",
                            label: "\"I ___ the form this week.\"",
                            options: [
                                { value: "past-simple", label: "Past Simple" },
                                { value: "present-perfect", label: "Present Perfect" }
                            ],
                            expectedAnswer: "present-perfect"
                        },
                        {
                            type: "radio",
                            label: "\"She ___ Spanish every Friday.\"",
                            options: [
                                { value: "simple", label: "Simple tense" },
                                { value: "continuous", label: "Continuous tense" }
                            ],
                            expectedAnswer: "simple"
                        },
                        {
                            type: "radio",
                            label: "\"She ___ Spanish right now.\"",
                            options: [
                                { value: "simple", label: "Simple tense" },
                                { value: "continuous", label: "Continuous tense" }
                            ],
                            expectedAnswer: "continuous"
                        }
                    ]
                },
                {
                    id: "cycle1-confusions-fill",
                    title: "Fix the confusion",
                    instructions: "Rewrite the sentence using the tense that matches the description.",
                    items: [
                        {
                            type: "text",
                            label: "This week I ___ (finish) the report (present perfect).",
                            expectedAnswer: "have finished"
                        },
                        {
                            type: "text",
                            label: "Right now he ___ (talk) to the coach (present continuous).",
                            expectedAnswer: "is talking"
                        }
                    ]
                }
            ]
        },
        {
            id: "parts-of-speech",
            title: "Core parts of speech: the words that describe your tenses",
            icon: "🧱",
            explanation: `
                <p>When you know what part of speech each word is, the tenses above become easier to build. Nouns name people or things, verbs show actions, adjectives describe nouns, adverbs describe verbs, and prepositions connect the pieces.</p>
                <p>This section highlights the five building blocks using sentences from earlier sections so you can see how they repeat.</p>
            `,
            exercises: [
                {
                    id: "cycle1-pos-word-select",
                    title: "Spot the nouns and verbs",
                    instructions: "Select the words that match the part of speech requested.",
                    items: [
                        {
                            type: "word-select",
                            label: "Nouns in: \"Morning routines give families new energy.\"",
                            tokens: [
                                { text: "Morning", isTarget: true },
                                { text: "routines", isTarget: true },
                                { text: "give", isTarget: false },
                                { text: "families", after: " ", isTarget: true },
                                { text: "new", isTarget: false },
                                { text: "energy", isTarget: true }
                            ]
                        },
                        {
                            type: "word-select",
                            label: "Verbs in: \"We practice speaking while the radio plays.\"",
                            tokens: [
                                { text: "We", isTarget: false },
                                { text: "practice", isTarget: true },
                                { text: "speaking", isTarget: true },
                                { text: "while", isTarget: false },
                                { text: "the", isTarget: false },
                                { text: "radio", isTarget: false },
                                { text: "plays", isTarget: true }
                            ]
                        }
                    ]
                },
                {
                    id: "cycle1-pos-queries",
                    title: "Name the modifiers and movers",
                    instructions: "Choose the word that matches the requested part of speech.",
                    items: [
                        {
                            type: "select",
                            label: "Which word describes \"lessons\" in \"Gentle lessons build confidence\"?",
                            options: ["Gentle", "Build", "Confidence", "Lessons"],
                            expectedAnswer: "Gentle"
                        },
                        {
                            type: "select",
                            label: "Which word is an adverb in \"She always walks slowly\"?",
                            options: ["She", "Always", "Walks", "Slowly"],
                            expectedAnswer: "Slowly"
                        },
                        {
                            type: "select",
                            label: "Which word is a preposition in \"We sit beside the window\"?",
                            options: ["We", "Sit", "Beside", "Window"],
                            expectedAnswer: "Beside"
                        }
                    ]
                }
            ]
        },
        {
            id: "frequency",
            title: "Adverbs of frequency: naming how often",
            icon: "🔁",
            explanation: `
                <p>Adverbs of frequency (always, usually, sometimes, never) cozy up to the present simple to describe how steady a habit feels.</p>
                <p>Place them before the main verb (but after auxiliary verbs) so sentences stay smooth.</p>
            `,
            tipBox: {
                title: "📌 Placement tip",
                content: "Frequency adverbs usually sit before the main verb: 'She always takes notes.' If there is an auxiliary (like have or am), the adverb follows that auxiliary."
            },
            exercises: [
                {
                    id: "cycle1-frequency-match",
                    title: "Which adverb fits best?",
                    instructions: "Choose the adverb that captures the habit.",
                    items: [
                        {
                            type: "radio",
                            label: "I ___ check the bus schedule before I leave.",
                            options: [
                                { value: "always", label: "always" },
                                { value: "yesterday", label: "yesterday" },
                                { value: "now", label: "now" }
                            ],
                            expectedAnswer: "always"
                        },
                        {
                            type: "radio",
                            label: "He ___ forgets his keys.",
                            options: [
                                { value: "never", label: "never" },
                                { value: "tomorrow", label: "tomorrow" },
                                { value: "right", label: "right" }
                            ],
                            expectedAnswer: "never"
                        }
                    ]
                },
                {
                    id: "cycle1-frequency-write",
                    title: "Write it naturally",
                    instructions: "Place 'usually' so the sentence sounds natural.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ take the bus after class.",
                            expectedAnswer: "I usually take the bus after class."
                        }
                    ]
                }
            ]
        },
        {
            id: "comparatives",
            title: "Comparatives: describe what is more or less",
            icon: "⚖️",
            explanation: `
                <p>Comparatives let you compare two things. Short adjectives add <strong>-er</strong>; longer ones go with <strong>more</strong>.</p>
                <p>You can also compare habits: My mornings are calmer than my evenings.</p>
            `,
            tipBox: {
                title: "💡 Comparative shortcut",
                content: "Try the adjective out loud: if it sounds easy with -er, use that (taller). If it feels clunky, pair it with more (more careful)."
            },
            exercises: [
                {
                    id: "cycle1-comparatives",
                    title: "Which comparative belongs?",
                    instructions: "Choose the sentence that uses a correct comparative form.",
                    items: [
                        {
                            type: "radio",
                            label: "My new workplace is ___ than my old one.",
                            options: [
                                { value: "more-friendlier", label: "more friendlier" },
                                { value: "friendlier", label: "friendlier" },
                                { value: "friendliest", label: "friendliest" }
                            ],
                            expectedAnswer: "friendlier"
                        }
                    ]
                },
                {
                    id: "cycle1-comparatives-write",
                    title: "Fill the blank",
                    instructions: "Complete the sentence with a comparative that makes sense.",
                    items: [
                        {
                            type: "text",
                            label: "My mornings are ___ than my evenings (calm).",
                            expectedAnswer: "calmer"
                        }
                    ]
                }
            ]
        },
        {
            id: "connectors",
            title: "Connectors: glue time, actions, and meaning",
            icon: "🧵",
            explanation: `
                <p>Connectors keep your sentences flowing. Coordinators like <strong>and, but, or, so</strong> let you add, contrast, offer alternatives, or show results. Time connectors—<strong>when, while, before, after</strong>—organize events on a timeline.</p>
                <p>We already used these connectors in the examples above. Notice them again: they link tenses, frequency, and thoughts.</p>
            `,
            usageMeanings: [
                {
                    title: "Coordinators",
                    description: "Use and to add, but to contrast, or to choose, so to show a result.",
                    examples: [
                        { sentence: "I practice speaking, and I listen to stories.", explanation: "Addition" },
                        { sentence: "I studied hard, but I still had questions.", explanation: "Contrast" },
                        { sentence: "Would you like coffee or tea?", explanation: "Alternative" },
                        { sentence: "I woke up early, so I had time to review.", explanation: "Result" }
                    ]
                },
                {
                    title: "Time connectors",
                    description: "Use when/while/before/after to place actions on a timeline or describe overlaps.",
                    examples: [
                        { sentence: "When class ends, we stretch.", explanation: "Sequential" },
                        { sentence: "While I cook, my classmates clean up.", explanation: "Overlap" },
                        { sentence: "Before I leave, I double-check my bag.", explanation: "Earlier action" },
                        { sentence: "After homework, I relax with music.", explanation: "Later action" }
                    ]
                }
            ],
            tipBox: {
                title: "✳️ Smooth connections",
                content: "Listen for the feeling of the sentence: adding words is usually 'and', contrast is 'but', choices are 'or', results are 'so'. Then place time connectors close to the verbs they link."
            },
            exercises: [
                {
                    id: "cycle1-connectors-choice",
                    title: "Choose the connector",
                    instructions: "Pick the connector that keeps the meaning flowing.",
                    items: [
                        {
                            type: "radio",
                            label: "I want to rest, ___ I still have homework.",
                            options: [
                                { value: "and", label: "and" },
                                { value: "but", label: "but" },
                                { value: "or", label: "or" }
                            ],
                            expectedAnswer: "but"
                        },
                        {
                            type: "radio",
                            label: "Would you like tea ___ coffee?",
                            options: [
                                { value: "or", label: "or" },
                                { value: "so", label: "so" },
                                { value: "when", label: "when" }
                            ],
                            expectedAnswer: "or"
                        }
                    ]
                },
                {
                    id: "cycle1-connectors-order",
                    title: "Time connectors in place",
                    instructions: "Choose the time connector that connects the two phrases smoothly.",
                    items: [
                        {
                            type: "select",
                            label: "___ class begins, we check the board.",
                            options: ["when", "and", "but"],
                            expectedAnswer: "when"
                        },
                        {
                            type: "select",
                            label: "I start the project ___ the team gathers ideas.",
                            options: ["while", "so", "or"],
                            expectedAnswer: "while"
                        }
                    ]
                }
            ]
        },
        {
            id: "summary",
            title: "Grammar Quick Reference Cheat Sheet",
            icon: "📋",
            explanation: `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
                    <div>
                        <h3 style="background: rgba(200, 107, 81, 0.2); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem;">Verb Tenses</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                            <thead>
                                <tr style="background: rgba(200, 107, 81, 0.1);">
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left; font-size: 0.9rem;">Tense</th>
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left; font-size: 0.9rem;">Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Simple Present</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I <strong>work</strong> every day.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Present Continuous</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I am <strong>studying</strong> now.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Simple Past</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I <strong>called</strong> my mom yesterday.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Past Continuous</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I was <strong>cooking</strong> when you arrived.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Simple Future</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I will <strong>start</strong> tomorrow.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Future Continuous</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I will be <strong>working</strong> at 3 PM.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Present Perfect</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I have <strong>lived</strong> here for 5 years.</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">Common Irregular Verbs</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                            <thead>
                                <tr style="background: rgba(200, 107, 81, 0.1);">
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">V1 (Base)</th>
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">V2 (Past)</th>
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">V3 (Past Participle)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">go</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">went</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">gone</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">eat</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">ate</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">eaten</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">see</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">saw</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">seen</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">have</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">had</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">had</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">make</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">made</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">made</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">come</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">came</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">come</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">take</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">took</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">taken</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">give</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">gave</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">given</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">buy</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">bought</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">bought</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">think</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">thought</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">thought</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">Time Expressions</h4>
                        <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem;">
                            <p style="margin: 0.5rem 0;"><strong>Past:</strong> yesterday, last week, ago, in 2020</p>
                            <p style="margin: 0.5rem 0;"><strong>Present:</strong> today, now, right now, these days</p>
                            <p style="margin: 0.5rem 0;"><strong>Future:</strong> tomorrow, next week, soon, in 2025</p>
                        </div>
                    </div>

                    <div>
                        <h3 style="background: rgba(200, 107, 81, 0.2); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem;">Adverbs of Frequency</h3>
                        <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <p style="margin: 0.5rem 0;"><strong>Order:</strong> always → usually → often → sometimes → rarely → never</p>
                            <p style="margin: 0.5rem 0;"><strong>With "To Be":</strong> I am <strong>usually</strong> tired. / She is <strong>never</strong> late.</p>
                            <p style="margin: 0.5rem 0;"><strong>With other verbs:</strong> I <strong>usually</strong> eat at 7. / She <strong>never</strong> drinks coffee.</p>
                        </div>

                        <h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">Comparatives</h4>
                        <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <p style="margin: 0.5rem 0;"><strong>Short words:</strong> add -er than → cold → <strong>colder than</strong></p>
                            <p style="margin: 0.5rem 0;"><strong>Words ending in Y:</strong> change Y to -ier → happy → <strong>happier</strong></p>
                            <p style="margin: 0.5rem 0;"><strong>Long words:</strong> more...than → <strong>more beautiful than</strong></p>
                            <p style="margin: 0.5rem 0;"><strong>Irregular:</strong> good → <strong>better</strong>, bad → <strong>worse</strong></p>
                        </div>

                        <h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">Connectors</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: 1rem;">
                            <thead>
                                <tr style="background: rgba(200, 107, 81, 0.1);">
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Connector</th>
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Function</th>
                                    <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>because</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">reason</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I am happy <strong>because</strong> it is sunny.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>so</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">result</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">It's cold, <strong>so</strong> I wear a jacket.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>but</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">contrast</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I'm tired, <strong>but</strong> I'm going to work.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>while</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">same time</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">I cooked <strong>while</strong> they played.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);"><strong>whereas</strong></td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">compare</td>
                                    <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Last year was hard, <strong>whereas</strong> this year is easier.</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">Prepositions of Time</h4>
                        <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem;">
                            <p style="margin: 0.5rem 0;"><strong>in</strong> - months/years/periods → in June; in 2025; in the morning</p>
                            <p style="margin: 0.5rem 0;"><strong>on</strong> - days/dates → on Monday; on July 4th</p>
                        </div>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Keep This Handy",
                content: "Print this page or bookmark it for quick reference during class, homework, or when you're writing. All the Cycle 1 grammar essentials in one place!"
            }
        }
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "Which tense fits the routine: 'Every morning, I ___ coffee.'?",
            options: [
                { value: "present-simple", label: "Present Simple" },
                { value: "past-simple", label: "Past Simple" },
                { value: "future-simple", label: "Future Simple" }
            ],
            correctAnswer: "present-simple",
            explanation: "Daily routines use present simple."
        },
        {
            id: "q2",
            question: "Which tense describes a finished action: 'She ___ the report yesterday.'?",
            options: [
                { value: "past-simple", label: "Past Simple" },
                { value: "present-simple", label: "Present Simple" },
                { value: "future-simple", label: "Future Simple" }
            ],
            correctAnswer: "past-simple",
            explanation: "A clear time (yesterday) signals past simple."
        },
        {
            id: "q3",
            question: "Which sentence uses Past Simple instead of Present Perfect?",
            options: [
                { value: "past-simple", label: "I finished the report yesterday." },
                { value: "present-perfect", label: "I have finished the report this week." },
                { value: "present-continuous", label: "I am finishing the report now." }
            ],
            correctAnswer: "past-simple",
            explanation: "A specific past time (yesterday) signals Past Simple; the others keep the time open or show ongoing action."
        },
        {
            id: "q4",
            question: "Which sentence uses Present Continuous?",
            options: [
                { value: "i-am-reading", label: "I am reading a book right now." },
                { value: "i-read", label: "I read a book every night." },
                { value: "i-will-read", label: "I will read a book tomorrow." }
            ],
            correctAnswer: "i-am-reading"
        },
        {
            id: "q5",
            question: "Which sentence describes a Past Continuous situation?",
            options: [
                { value: "was-watching", label: "She was watching TV when the power went out." },
                { value: "watched", label: "She watched TV last night." },
                { value: "will-watch", label: "She will watch TV tonight." }
            ],
            correctAnswer: "was-watching"
        },
        {
            id: "q6",
            question: "Which sentence is Future Continuous?",
            options: [
                { value: "will-be-working", label: "They will be working at 3 p.m. tomorrow." },
                { value: "work", label: "They work at 3 p.m. tomorrow." },
                { value: "worked", label: "They worked at 3 p.m. yesterday." }
            ],
            correctAnswer: "will-be-working"
        },
        {
            id: "q7",
            question: "Which word often appears with Present Perfect?",
            options: [
                { value: "already", label: "already" },
                { value: "yesterday", label: "yesterday" },
                { value: "tomorrow", label: "tomorrow" }
            ],
            correctAnswer: "already"
        },
        {
            id: "q8",
            question: "Which sentence shows Present Perfect experience?",
            options: [
                { value: "have-visited", label: "I have visited Boston." },
                { value: "visited", label: "I visited Boston last year." },
                { value: "will-visit", label: "I will visit Boston next month." }
            ],
            correctAnswer: "have-visited"
        },
        {
            id: "q9",
            question: "Which word is a verb in 'She always brings snacks'?",
            options: [
                { value: "she", label: "She" },
                { value: "always", label: "Always" },
                { value: "brings", label: "Brings" },
                { value: "snacks", label: "Snacks" }
            ],
            correctAnswer: "brings"
        },
        {
            id: "q10",
            question: "Which word is a preposition in 'We walk to work each morning'?",
            options: [
                { value: "walk", label: "Walk" },
                { value: "to", label: "To" },
                { value: "work", label: "Work" },
                { value: "each", label: "Each" }
            ],
            correctAnswer: "to"
        },
        {
            id: "q11",
            question: "Which adverb of frequency fits 'I ___ check the bus schedule before I leave'?",
            options: [
                { value: "always", label: "always" },
                { value: "yesterday", label: "yesterday" },
                { value: "soon", label: "soon" }
            ],
            correctAnswer: "always"
        },
        {
            id: "q12",
            question: "Choose the comparative: 'My new job is ___ than my old job.'",
            options: [
                { value: "more-flexible", label: "more flexible" },
                { value: "flexiblier", label: "flexiblier" },
                { value: "flexible", label: "flexible" }
            ],
            correctAnswer: "more-flexible"
        },
        {
            id: "q13",
            question: "Which connector adds information between two ideas?",
            options: [
                { value: "and", label: "and" },
                { value: "but", label: "but" },
                { value: "so", label: "so" }
            ],
            correctAnswer: "and"
        },
        {
            id: "q14",
            question: "Which connector shows contrast?",
            options: [
                { value: "but", label: "but" },
                { value: "and", label: "and" },
                { value: "or", label: "or" }
            ],
            correctAnswer: "but"
        },
        {
            id: "q15",
            question: "Which connector gives a choice between two options?",
            options: [
                { value: "or", label: "or" },
                { value: "and", label: "and" },
                { value: "so", label: "so" }
            ],
            correctAnswer: "or"
        },
        {
            id: "q16",
            question: "Which connector shows a result?",
            options: [
                { value: "so", label: "so" },
                { value: "or", label: "or" },
                { value: "but", label: "but" }
            ],
            correctAnswer: "so"
        },
        {
            id: "q17",
            question: "Which time connector fits '___ class ends, we check homework'?",
            options: [
                { value: "when", label: "when" },
                { value: "after", label: "after" },
                { value: "and", label: "and" }
            ],
            correctAnswer: "when"
        },
        {
            id: "q18",
            question: "Which time connector fits '___ the rain poured, we stayed inside'?",
            options: [
                { value: "while", label: "while" },
                { value: "before", label: "before" },
                { value: "so", label: "so" }
            ],
            correctAnswer: "while"
        },
        {
            id: "q19",
            question: "Which time connector fits '___ you finish homework, you can relax'?",
            options: [
                { value: "after", label: "after" },
                { value: "and", label: "and" },
                { value: "but", label: "but" }
            ],
            correctAnswer: "after"
        },
        {
            id: "q20",
            question: "Which time connector fits '___ the bus arrives, we wait outside'?",
            options: [
                { value: "before", label: "before" },
                { value: "when", label: "when" },
                { value: "or", label: "or" }
            ],
            correctAnswer: "before"
        }
    ]
};
