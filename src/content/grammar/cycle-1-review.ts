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
                <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; border-left: 5px solid #22c55e;">
                    <h3 style="margin-top: 0; color: #16a34a; font-size: 1.4rem;">Cycle 1: The Foundation</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6;">
                        Cycle 1 asked you to notice how time and meaning play together in everyday routines. This is a quick review to see what you remember and what we need to practice more before we start Cycle 2.
                    </p>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #22c55e; margin-top: 0;">🛠️ Simple</h4>
                            <p style="font-size: 0.85rem; color: #4b5563;">Habits, Facts, Finished Stories.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #3b82f6; margin-top: 0;">🌊 Continuous</h4>
                            <p style="font-size: 0.85rem; color: #4b5563;">Actions in motion (Duration).</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #f59e0b; margin-top: 0;">🌉 Perfect</h4>
                            <p style="font-size: 0.85rem; color: #4b5563;">Connecting past to now (Result).</p>
                        </div>
                    </div>
                </div>
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
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #f0fdf4; padding: 1.25rem; border-radius: 0.75rem; border-top: 4px solid #22c55e; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 0.5rem 0; color: #16a34a; display: flex; align-items: center; gap: 0.5rem;">☀️ Present Simple</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Every day / Usually</strong></p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"I take the bus."</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1.25rem; border-radius: 0.75rem; border-top: 4px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 0.5rem 0; color: #1d4ed8; display: flex; align-items: center; gap: 0.5rem;">📖 Past Simple</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Yesterday / Last week</strong></p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"I took the bus."</p>
                    </div>
                    <div style="background: #fffbeb; padding: 1.25rem; border-radius: 0.75rem; border-top: 4px solid #f59e0b; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 0.5rem 0; color: #b45309; display: flex; align-items: center; gap: 0.5rem;">🎯 Future Simple</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Tomorrow / Soon</strong></p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"I will take the bus."</p>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
                    <p style="margin: 0; font-size: 0.95rem;">Don’t forget how to make negatives and questions: <strong>don’t/doesn’t/didn’t</strong> flip the routine upside down, and <strong>do/does/did</strong> invite conversation.</p>
                </div>
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
                
                <div style="overflow-x: auto; margin: 1.5rem 0;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 500px;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 1rem; border-bottom: 2px solid #e2e8f0; text-align: left;">If it is...</th>
                                <th style="padding: 1rem; border-bottom: 2px solid #e2e8f0; text-align: left;">Helper Verb (Negative)</th>
                                <th style="padding: 1rem; border-bottom: 2px solid #e2e8f0; text-align: left;">Helper Verb (Question)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Present Simple</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">don't / doesn't</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Do / Does...?</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Past Simple</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">didn't</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Did...?</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Future Simple</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">won't</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Will...?</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Continuous</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">am/is/are not</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Am/Is/Are...?</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
                <p>Continuous tenses keep one foot on the ground and one foot moving. They use <strong>be + verb-ing</strong> to show actions that are in progress or ongoing.</p>
                
                <div style="background: white; border: 2px solid #3b82f6; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #1d4ed8;">Timeline: The Living Moment</h4>
                    <div style="position: relative; margin: 2rem auto; max-width: 500px; padding: 1rem 0;">
                        <!-- Highlighted bar -->
                        <div style="position: relative; height: 35px; background: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 1)); border-radius: 17px; border: 2px solid #3b82f6; display: flex; align-items: center; padding: 0 1.5rem;">
                             <span style="color: #1e3a8a; font-weight: 600; font-size: 0.85rem;">...walking...talking...playing...</span>
                        </div>
                        <div style="display: flex; justify-content: center; margin-top: 0.75rem; font-size: 0.8rem; color: #64748b;">
                            <span>Focus: The Duration of the Action</span>
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "Helping verb be (am/is/are/was/were/will be)", type: "verb" },
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
                <p>Present perfect connects the past to the present. Think of it as the <strong>"Result"</strong> tense—it's not about <em>when</em> it happened, but that it's <em>done</em> now.</p>
                
                <div style="background: #fffbeb; border-left: 5px solid #f59e0b; padding: 1.25rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.5rem 0;">
                    <p style="margin: 0; font-size: 1.1rem; color: #92400e; font-weight: 600;">"I have finished."</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #b45309;">Result: The task is ready for me to show you!</p>
                </div>

                <p>We often see words like <strong>already</strong>, <strong>yet</strong>, <strong>for</strong>, and <strong>since</strong>.</p>
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
                <p>Because the tenses share similar vocabulary, we sometimes use the wrong helping verb. This section pauses on a few crowded corners so you can feel the difference.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <!-- Time Comparison -->
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="margin: 0 0 1rem 0; color: #475569; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.5rem;">Finished vs Open Time</h4>
                        <div style="margin-bottom: 1rem;">
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Past Simple (Finished)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I eaten yesterday." ❌</p>
                            <p style="margin: 0; font-size: 0.95rem;">"I <strong>ate</strong> yesterday." ✓</p>
                        </div>
                        <div>
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Present Perfect (Open)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I have eaten today." ✓</p>
                        </div>
                    </div>
                    
                    <!-- Motion Comparison -->
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="margin: 0 0 1rem 0; color: #475569; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.5rem;">Fact vs Motion</h4>
                        <div style="margin-bottom: 1rem;">
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Simple (Fact/Habit)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I work at 9."</p>
                        </div>
                        <div>
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Continuous (In Motion)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I am working now."</p>
                        </div>
                    </div>
                </div>
            `,
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
                <p>Identify the building blocks of every sentence. When you know the parts, the grammar patterns become clear.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fdf2f8; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #fbcfe8;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">👤</span>
                        <h4 style="margin: 0; color: #be185d;">Noun</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #9d174d;">Person, Place, Thing</p>
                    </div>
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #bbf7d0;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🏃</span>
                        <h4 style="margin: 0; color: #15803d;">Verb</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #166534;">Action or State</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #bfdbfe;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🎨</span>
                        <h4 style="margin: 0; color: #1d4ed8;">Adjective</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #1e40af;">Describes a Noun</p>
                    </div>
                    <div style="background: #faf5ff; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #e9d5ff;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">💨</span>
                        <h4 style="margin: 0; color: #7e22ce;">Adverb</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #6b21a8;">Describes a Verb</p>
                    </div>
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #ffedd5;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🔗</span>
                        <h4 style="margin: 0; color: #c2410c;">Preposition</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #9a3412;">Connects Ideas</p>
                    </div>
                </div>
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
                <p>Adverbs of frequency describe how steady a habit feels.</p>
                
                <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 0.75rem; padding: 1.25rem; margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="background: #be185d; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">100% Always</span>
                        <span style="background: #db2777; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">80% Usually</span>
                        <span style="background: #f472b6; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">50% Sometimes</span>
                        <span style="background: #94a3b8; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">0% Never</span>
                    </div>
                    <p style="margin: 0; font-size: 0.95rem; color: #9d174d;"><strong>The Rule:</strong> Place them before the main verb, but <em>after</em> helping verbs (be/have).</p>
                </div>
            `,
            tipBox: {
                title: "📌 Placement tip",
                content: "Frequency adverbs usually sit before the main verb: 'She always takes notes.' If there is a helping verb (like have or am), the adverb follows that helping verb."
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
                <p>Comparatives let you compare two things. Think of it as a <strong>Scale</strong> logic.</p>
                
                <div style="display: flex; gap: 1rem; margin: 1.5rem 0; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px; background: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0; color: #c2410c;">Short Adjectives</h4>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Add <strong>-er</strong> (fast → faster)</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; background: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0; color: #c2410c;">Long Adjectives</h4>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Use <strong>more</strong> (more creative)</p>
                    </div>
                </div>
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
            id: "superlatives",
            title: "Superlatives: The Most, The Best, The -est",
            icon: "🏆",
            explanation: `
                <p>Superlatives help you find the <strong>extreme</strong> in a group—the highest, lowest, best, worst. Use them when comparing <strong>three or more</strong> things.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #22c55e;">
                        <h4 style="margin: 0; color: #16a34a;">Short adjectives: -est</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">cheap → <strong>the cheapest</strong><br>old → <strong>the oldest</strong><br>busy → <strong>the busiest</strong></p>
                    </div>
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #3b82f6;">
                        <h4 style="margin: 0; color: #1d4ed8;">Long adjectives: most/least</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">expensive → <strong>the most expensive</strong><br>comfortable → <strong>the most comfortable</strong></p>
                    </div>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0;"><strong>Irregular forms:</strong> good → <strong>the best</strong> | bad → <strong>the worst</strong> | far → <strong>the farthest</strong></p>
                </div>
            `,
            tipBox: {
                title: "💡 Comparatives vs Superlatives",
                content: "Comparatives compare 2 things (cheaper than). Superlatives find the extreme in 3+ things (the cheapest of all)."
            },
            exercises: [
                {
                    id: "cycle1-superlatives",
                    title: "Form the superlative",
                    instructions: "Complete with the correct superlative form.",
                    items: [
                        {
                            type: "text",
                            label: "This is ___ (cheap) apartment in the building.",
                            expectedAnswer: "the cheapest"
                        },
                        {
                            type: "text",
                            label: "Monday is ___ (busy) day of the week.",
                            expectedAnswer: "the busiest"
                        },
                        {
                            type: "text",
                            label: "She's ___ (experienced) person on our team.",
                            expectedAnswer: "the most experienced"
                        }
                    ]
                }
            ]
        },
        {
            id: "quantifiers",
            title: "Quantifiers: How Much? How Many?",
            icon: "🔢",
            explanation: `
                <p>Quantifiers describe amounts. The key is knowing if the noun is <strong>countable</strong> (you can count it) or <strong>uncountable</strong> (you can't count it).</p>

                <div style="overflow-x: auto; margin: 1.5rem 0;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 400px;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 0.75rem; border-bottom: 2px solid #e2e8f0; text-align: left;"></th>
                                <th style="padding: 0.75rem; border-bottom: 2px solid #22c55e; text-align: left; color: #16a34a;">Countable (hours, jobs)</th>
                                <th style="padding: 0.75rem; border-bottom: 2px solid #3b82f6; text-align: left; color: #1d4ed8;">Uncountable (time, money)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Large amount</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>many</strong> hours</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>much</strong> time</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Small amount</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>few</strong> options</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>little</strong> money</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Comparing</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>fewer</strong> hours</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>less</strong> time</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; font-weight: 600; color: #dc2626;">⚠️ Common Mistakes</p>
                    <p style="margin: 0.5rem 0 0 0;">❌ "How <strong>much</strong> hours?" → ✓ "How <strong>many</strong> hours?" (hours are countable)</p>
                    <p style="margin: 0.25rem 0 0 0;">❌ "<strong>less</strong> employees" → ✓ "<strong>fewer</strong> employees" (employees are countable)</p>
                </div>
            `,
            tipBox: {
                title: "💡 Quick Test",
                content: "Can you put a number in front of it? '1 hour, 2 hours' = countable (use many/few/fewer). 'Money' (not 1 money) = uncountable (use much/little/less)."
            },
            exercises: [
                {
                    id: "cycle1-quantifiers-choice",
                    title: "Many or Much?",
                    instructions: "Choose the correct quantifier.",
                    items: [
                        {
                            type: "radio",
                            label: "How ___ vacation days do you get?",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" }
                            ],
                            expectedAnswer: "many"
                        },
                        {
                            type: "radio",
                            label: "I don't have ___ experience with computers.",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" }
                            ],
                            expectedAnswer: "much"
                        }
                    ]
                },
                {
                    id: "cycle1-quantifiers-fewer-less",
                    title: "Fewer or Less?",
                    instructions: "Choose the correct word for comparing.",
                    items: [
                        {
                            type: "radio",
                            label: "This job has ___ hours than my last one.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" }
                            ],
                            expectedAnswer: "fewer"
                        },
                        {
                            type: "radio",
                            label: "I want a job with ___ stress.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" }
                            ],
                            expectedAnswer: "less"
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
                <p>Connectors keep your sentences flowing. They are the <strong>"Glue"</strong> of your story.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #22c55e;">
                        <h4 style="margin: 0; color: #16a34a;">Coordinators</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">And, But, Or, So</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #3b82f6;">
                        <h4 style="margin: 0; color: #1d4ed8;">Time Markers</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">When, While, Before, After</p>
                    </div>
                </div>
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
                <div style="background: white; border: 2px solid #e2e8f0; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                    <h2 style="margin-top: 0; text-align: center; color: #1e293b; border-bottom: 3px solid #3b82f6; padding-bottom: 0.5rem; display: inline-block; width: 100%;">Cycle 1 Grammar Reference</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                        <!-- Left Column: Tenses -->
                        <div>
                            <h3 style="color: #2563eb; display: flex; align-items: center; gap: 0.5rem; margin-top: 0;">⏱️ Verb Tenses</h3>
                            <div style="display: grid; gap: 0.75rem;">
                                <div style="background: #f0fdf4; padding: 0.75rem; border-radius: 0.5rem;">
                                    <strong>Simple Present:</strong> I <strong>work</strong> daily.
                                </div>
                                <div style="background: #eff6ff; padding: 0.75rem; border-radius: 0.5rem;">
                                    <strong>Present Continuous:</strong> I <strong>am working</strong> now.
                                </div>
                                <div style="background: #f0fdf4; padding: 0.75rem; border-radius: 0.5rem;">
                                    <strong>Simple Past:</strong> I <strong>worked</strong> yesterday.
                                </div>
                                <div style="background: #eff6ff; padding: 0.75rem; border-radius: 0.5rem;">
                                    <strong>Past Continuous:</strong> I <strong>was working</strong> when...
                                </div>
                                <div style="background: #f0fdf4; padding: 0.75rem; border-radius: 0.5rem;">
                                    <strong>Simple Future:</strong> I <strong>will work</strong> soon.
                                </div>
                                <div style="background: #fffbeb; padding: 0.75rem; border-radius: 0.5rem;">
                                    <strong>Present Perfect:</strong> I <strong>have worked</strong>.
                                </div>
                            </div>

                            <h3 style="color: #2563eb; display: flex; align-items: center; gap: 0.5rem; margin-top: 2rem;">📅 Time expressions</h3>
                            <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
                                <p style="margin: 0;"><strong>Past:</strong> yesterday, ago, last...</p>
                                <p style="margin: 0.5rem 0;"><strong>Present:</strong> now, today, these days</p>
                                <p style="margin: 0;"><strong>Future:</strong> tomorrow, soon, next...</p>
                            </div>
                        </div>

                        <!-- Right Column: Others -->
                        <div>
                            <h3 style="color: #db2777; display: flex; align-items: center; gap: 0.5rem; margin-top: 0;">🔁 Frequency</h3>
                            <p style="background: #fdf2f8; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.9rem;">
                                always → usually → sometimes → never
                            </p>

                            <h3 style="color: #d97706; display: flex; align-items: center; gap: 0.5rem; margin-top: 2rem;">⚖️ Comparatives</h3>
                            <div style="background: #fffbeb; padding: 1rem; border-radius: 0.5rem; font-size: 0.9rem;">
                                <p style="margin: 0;">Short: <strong>-er than</strong> (faster)</p>
                                <p style="margin: 0.4rem 0;">Long: <strong>more...than</strong> (more creative)</p>
                                <p style="margin: 0;">Irregular: <strong>better / worse</strong></p>
                            </div>

                            <h3 style="color: #b45309; display: flex; align-items: center; gap: 0.5rem; margin-top: 2rem;">🏆 Superlatives</h3>
                            <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; font-size: 0.9rem;">
                                <p style="margin: 0;">Short: <strong>the + -est</strong> (the cheapest)</p>
                                <p style="margin: 0.4rem 0;">Long: <strong>the most/least</strong> (the most expensive)</p>
                                <p style="margin: 0;">Irregular: <strong>the best / the worst</strong></p>
                            </div>

                            <h3 style="color: #7c3aed; display: flex; align-items: center; gap: 0.5rem; margin-top: 2rem;">🔢 Quantifiers</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                <div style="background: #f0fdf4; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;">Countable: <strong>many/few/fewer</strong></div>
                                <div style="background: #eff6ff; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;">Uncountable: <strong>much/little/less</strong></div>
                            </div>

                            <h3 style="color: #059669; display: flex; align-items: center; gap: 0.5rem; margin-top: 2rem;">🧵 Connectors</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                <div style="background: #ecfdf5; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;"><strong>and:</strong> add</div>
                                <div style="background: #ecfdf5; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;"><strong>but:</strong> contrast</div>
                                <div style="background: #ecfdf5; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;"><strong>so:</strong> result</div>
                                <div style="background: #ecfdf5; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;"><strong>or:</strong> choice</div>
                                <div style="background: #f0f9ff; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem; grid-column: span 2;"><strong>when/while:</strong> time</div>
                            </div>
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
        },
        {
            id: "q21",
            question: "Which is the correct superlative form?",
            options: [
                { value: "a", label: "This is the most cheap apartment." },
                { value: "b", label: "This is the cheapest apartment." },
                { value: "c", label: "This is the cheaper apartment." }
            ],
            correctAnswer: "b",
            explanation: "'Cheap' is a short adjective, so use -est: the cheapest."
        },
        {
            id: "q22",
            question: "Choose the correct quantifier: 'How ___ experience do you have?'",
            options: [
                { value: "a", label: "many" },
                { value: "b", label: "much" },
                { value: "c", label: "few" }
            ],
            correctAnswer: "b",
            explanation: "'Experience' is uncountable, so use 'much.'"
        },
        {
            id: "q23",
            question: "Which is correct? 'My new job has ___ hours than my old one.'",
            options: [
                { value: "a", label: "fewer" },
                { value: "b", label: "less" },
                { value: "c", label: "little" }
            ],
            correctAnswer: "a",
            explanation: "'Hours' are countable, so use 'fewer' for comparisons."
        },
        {
            id: "q24",
            question: "Choose the correct sentence:",
            options: [
                { value: "a", label: "She's the most experienced person on the team." },
                { value: "b", label: "She's the experiencedest person on the team." },
                { value: "c", label: "She's the most experienceder person on the team." }
            ],
            correctAnswer: "a",
            explanation: "'Experienced' is a long adjective, so use 'the most' + adjective."
        }
    ]
};
