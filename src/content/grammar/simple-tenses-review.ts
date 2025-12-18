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
            id: "timeline-visualization",
            title: "Timeline: The Three Simple Tenses",
            icon: "⏰",
            explanation: `
                <div style="max-width: 700px; margin: 2rem auto; padding: 2rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%); border-radius: 12px; border: 2px solid rgba(139, 92, 246, 0.2);">
                    <p style="text-align: center; font-size: 1.125rem; margin-bottom: 2rem; color: #2b3a4a; font-weight: 600;">
                        Simple tenses separate time into three distinct moments
                    </p>

                    <!-- Timeline with three circles -->
                    <div style="position: relative; display: flex; justify-content: space-between; align-items: center; margin: 3rem 0; padding: 0 2rem;">
                        <!-- Gradient connecting line -->
                        <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 4px; background: linear-gradient(90deg, #f59e0b 0%, #8b5cf6 50%, #06b6d4 100%); transform: translateY(-50%); z-index: 0;"></div>

                        <!-- Past circle -->
                        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%); border: 4px solid #fff; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; text-align: center; color: white; font-weight: 700; font-size: 0.875rem; line-height: 1.3; padding: 0.5rem;">
                                PAST<br/>Simple
                            </div>
                            <div style="margin-top: 1rem; font-size: 0.875rem; color: #d97757; font-weight: 600;">
                                yesterday
                            </div>
                        </div>

                        <!-- Present/NOW circle -->
                        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); border: 4px solid #fff; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4); display: flex; align-items: center; justify-content: center; text-align: center; color: white; font-weight: 700; font-size: 0.875rem; line-height: 1.3; padding: 0.5rem;">
                                PRESENT<br/>Simple
                            </div>
                            <div style="margin-top: 1rem; font-size: 0.875rem; color: #8b5cf6; font-weight: 600;">
                                every day
                            </div>
                        </div>

                        <!-- Future circle -->
                        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%); border: 4px solid #fff; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4); display: flex; align-items: center; justify-content: center; text-align: center; color: white; font-weight: 700; font-size: 0.875rem; line-height: 1.3; padding: 0.5rem;">
                                FUTURE<br/>Simple
                            </div>
                            <div style="margin-top: 1rem; font-size: 0.875rem; color: #06b6d4; font-weight: 600;">
                                tomorrow
                            </div>
                        </div>
                    </div>

                    <!-- Example sentences grid -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2.5rem;">
                        <!-- Past example -->
                        <div style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <div style="font-weight: 700; color: #d97757; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                PAST
                            </div>
                            <div style="color: #2b3a4a; font-size: 0.9rem; line-height: 1.4;">
                                I <span style="color: #f59e0b; font-weight: 700;">walked</span> to work
                            </div>
                        </div>

                        <!-- Present example -->
                        <div style="background: rgba(139, 92, 246, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                            <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                PRESENT
                            </div>
                            <div style="color: #2b3a4a; font-size: 0.9rem; line-height: 1.4;">
                                I <span style="color: #8b5cf6; font-weight: 700;">walk</span> to work
                            </div>
                        </div>

                        <!-- Future example -->
                        <div style="background: rgba(6, 182, 212, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #06b6d4;">
                            <div style="font-weight: 700; color: #06b6d4; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                FUTURE
                            </div>
                            <div style="color: #2b3a4a; font-size: 0.9rem; line-height: 1.4;">
                                I <span style="color: #06b6d4; font-weight: 700;">will walk</span> to work
                            </div>
                        </div>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Big Picture",
                content: "Simple tenses are like three separate rooms in a house—each one is completely independent. Past Simple finished yesterday. Present Simple happens every day. Future Simple will happen tomorrow. They don't overlap or connect—they just describe different times.",
            },
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
                            sentence: "I <span style=\"color: #8b5cf6; font-weight: 600;\">start</span> work at 8 AM every day.",
                            explanation: "✓ Your regular schedule (not 'I'm starting work')",
                        },
                        {
                            sentence: "She <span style=\"color: #8b5cf6; font-weight: 600;\">loves</span> coffee more than meetings.",
                            explanation: "✓ Feelings and preferences that stay true",
                        },
                        {
                            sentence: "The store <span style=\"color: #8b5cf6; font-weight: 600;\">closes</span> at 9 PM on weekdays.",
                            explanation: "✓ Fixed timetables and schedules",
                        },
                    ],
                },
                {
                    title: "📅 Past Simple: Finished Business",
                    description: "For completed actions with a clear time reference",
                    examples: [
                        {
                            sentence: "I <span style=\"color: #f59e0b; font-weight: 600;\">called</span> my mom yesterday afternoon.",
                            explanation: "✓ Specific finished time + finished action",
                        },
                        {
                            sentence: "They <span style=\"color: #f59e0b; font-weight: 600;\">visited</span> Paris last summer.",
                            explanation: "✓ Completed trips and experiences",
                        },
                        {
                            sentence: "She <span style=\"color: #f59e0b; font-weight: 600;\">finished</span> the project on Friday.",
                            explanation: "✓ Done and dusted with a time stamp",
                        },
                    ],
                },
                {
                    title: "🔮 Future Simple: Quick Future Decisions",
                    description: "For spontaneous plans, promises, and predictions",
                    examples: [
                        {
                            sentence: "I<span style=\"color: #06b6d4; font-weight: 600;\">'ll bring</span> the snacks tonight.",
                            explanation: "✓ Spontaneous offer (not 'I'm bringing')",
                        },
                        {
                            sentence: "It <span style=\"color: #06b6d4; font-weight: 600;\">will rain</span> tomorrow, I can feel it.",
                            explanation: "✓ Quick predictions based on current evidence",
                        },
                        {
                            sentence: "We <span style=\"color: #06b6d4; font-weight: 600;\">won't finish</span> until next week.",
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
                            label: '"I\'ll water the garden before it gets too hot."',
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
                            label: '"The farmers market ___ at 8 AM every Saturday." (fixed schedule)',
                            options: [
                                { value: "opens", label: "opens" },
                                { value: "opened", label: "opened" },
                                { value: "will open", label: "will open" },
                            ],
                            expectedAnswer: "opens",
                        },
                        {
                            type: "radio",
                            label: '"The neighbors ___ their house three months ago." (finished action)',
                            options: [
                                { value: "renovate", label: "renovate" },
                                { value: "renovated", label: "renovated" },
                                { value: "will renovate", label: "will renovate" },
                            ],
                            expectedAnswer: "renovated",
                        },
                        {
                            type: "radio",
                            label: '"___ the kids ___ their science project by next week?" (promise about future)',
                            options: [
                                { value: "Will the kids complete", label: "Will the kids complete" },
                                { value: "Do the kids complete", label: "Do the kids complete" },
                                { value: "Did the kids complete", label: "Did the kids complete" },
                            ],
                            expectedAnswer: "Will the kids complete",
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
                            label: "1. The corner store ___ (carry) organic produce from local farms.",
                            expectedAnswer: "carries",
                        },
                        {
                            type: "text",
                            label: "2. My nephew ___ (study) marine biology at university.",
                            expectedAnswer: "studies",
                        },
                        {
                            type: "text",
                            label: "3. The art gallery ___ (display) contemporary paintings every month.",
                            expectedAnswer: "displays",
                        },
                        {
                            type: "text",
                            label: "4. She ___ (worry) about her elderly parents living alone.",
                            expectedAnswer: "worries",
                        },
                        {
                            type: "text",
                            label: "5. My neighbor ___ (have) two golden retrievers that love everyone.",
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
                        { type: "text", label: "1. I ___ (not drink) coffee after 3 PM. (negative present)", expectedAnswer: "don't drink" },
                        { type: "text", label: "2. She ___ (call) her parents every Sunday. (positive present)", expectedAnswer: "calls" },
                        { type: "text", label: "3. They ___ (finish) the project yesterday. (positive past)", expectedAnswer: "finished" },
                        { type: "text", label: "4. I ___ (not see) the movie last week. (negative past)", expectedAnswer: "didn't see" },
                        { type: "text", label: "5. ___ you ___ (help) me tomorrow? (question future)", expectedAnswer: "Will you help" },
                        { type: "text", label: "6. He ___ (not work) on Fridays. (negative present)", expectedAnswer: "doesn't work" },
                    ],
                },
                {
                    id: "ex-mixed-2",
                    title: "Real-Life Conversations",
                    instructions: "Complete these natural English conversations.",
                    items: [
                        { type: "text", label: "1a. \"What time ___ (you/start) work?\"", expectedAnswer: "do you start" },
                        { type: "text", label: "1b. \"I ___ (start) at 8 AM every day.\"", expectedAnswer: "start" },
                        { type: "text", label: "2a. \"___ (you/see) the new movie?\"", expectedAnswer: "Did you see" },
                        { type: "text", label: "2b. \"No, I ___ (not see) it yet.\"", expectedAnswer: "didn't see" },
                        { type: "text", label: "3a. \"___ (they/come) to the party?\"", expectedAnswer: "Will they come" },
                        { type: "text", label: "3b. \"Yes, they ___ (promise) to bring dessert.\"", expectedAnswer: "will promise" },
                        { type: "text", label: "4a. \"Why ___ (she/look) so tired?\"", expectedAnswer: "does she look" },
                        { type: "text", label: "4b. \"She ___ (work) late last night.\"", expectedAnswer: "worked" },
                    ],
                },
            ],
        },
        {
            id: "verb-conjugation",
            stepNumber: 4,
            title: "Verb Conjugation Practice: Master All Forms",
            icon: "📊",
            explanation: `
                <h3>Complete Verb Conjugation Charts</h3>
                <p>Practice conjugating verbs across all three simple tenses and all three forms (affirmative, negative, question). This is how you build true fluency!</p>

                <div style="background: rgba(139, 92, 246, 0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <p style="margin: 0;"><strong>💡 Tip:</strong> For third-person singular (he/she/it) in Present Simple, remember to add -s or -es to the base verb!</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-conjugation-present",
                    title: "Present Simple Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'work' in Present Simple with the subject 'she'.",
                    items: [
                        { type: "text", label: "Affirmative: She ___", expectedAnswer: "works" },
                        { type: "text", label: "Negative: She ___ work", expectedAnswer: "doesn't" },
                        { type: "text", label: "Question: ___ she work?", expectedAnswer: "Does" },
                    ],
                },
                {
                    id: "ex-conjugation-past",
                    title: "Past Simple Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'visit' in Past Simple with the subject 'they'.",
                    items: [
                        { type: "text", label: "Affirmative: They ___", expectedAnswer: "visited" },
                        { type: "text", label: "Negative: They ___ visit", expectedAnswer: "didn't" },
                        { type: "text", label: "Question: ___ they visit?", expectedAnswer: "Did" },
                    ],
                },
                {
                    id: "ex-conjugation-future",
                    title: "Future Simple Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'help' in Future Simple with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ help", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ help", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I help?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-conjugation-mixed-1",
                    title: "Mixed Tenses: Verb 'study'",
                    instructions: "Conjugate the verb 'study' with the subject 'he' in all three simple tenses (affirmative form only).",
                    items: [
                        { type: "text", label: "Present Simple: He ___", expectedAnswer: "studies" },
                        { type: "text", label: "Past Simple: He ___", expectedAnswer: "studied" },
                        { type: "text", label: "Future Simple: He ___ study", expectedAnswer: "will" },
                    ],
                },
                {
                    id: "ex-conjugation-mixed-2",
                    title: "Mixed Forms: Verb 'go'",
                    instructions: "Conjugate the irregular verb 'go' with the subject 'we' in all three forms of Past Simple.",
                    items: [
                        { type: "text", label: "Affirmative: We ___", expectedAnswer: "went" },
                        { type: "text", label: "Negative: We ___ go", expectedAnswer: "didn't" },
                        { type: "text", label: "Question: ___ we go?", expectedAnswer: "Did" },
                    ],
                },
                {
                    id: "ex-conjugation-challenge",
                    title: "Full Conjugation Challenge: Verb 'write'",
                    instructions: "Complete the full conjugation chart for 'write' with subject 'you' across all simple tenses and forms.",
                    items: [
                        { type: "text", label: "Present Simple - Affirmative: You ___", expectedAnswer: "write" },
                        { type: "text", label: "Present Simple - Negative: You ___ write", expectedAnswer: "don't" },
                        { type: "text", label: "Present Simple - Question: ___ you write?", expectedAnswer: "Do" },
                        { type: "text", label: "Past Simple - Affirmative: You ___", expectedAnswer: "wrote" },
                        { type: "text", label: "Past Simple - Negative: You ___ write", expectedAnswer: "didn't" },
                        { type: "text", label: "Past Simple - Question: ___ you write?", expectedAnswer: "Did" },
                        { type: "text", label: "Future Simple - Affirmative: You ___ write", expectedAnswer: "will" },
                        { type: "text", label: "Future Simple - Negative: You ___ write", expectedAnswer: "won't" },
                        { type: "text", label: "Future Simple - Question: ___ you write?", expectedAnswer: "Will" },
                    ],
                },
            ],
        },
        {
            id: "advanced-practice",
            stepNumber: 5,
            title: "Advanced Practice: Real-World Challenges",
            icon: "🎯",
            explanation: `
                <h3>Test Your Mastery</h3>
                <p>These exercises mix all three simple tenses in authentic scenarios. This is where you prove you can think like a native speaker!</p>
            `,
            exercises: [
                {
                    id: "ex-error-correction-1",
                    title: "Error Correction: Fix the Mistakes",
                    instructions: "Each sentence has ONE grammar mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "1. She don't work on weekends anymore.", expectedAnswer: "She doesn't work on weekends anymore" },
                        { type: "text", label: "2. They visited the museum last Sunday and loves the exhibits.", expectedAnswer: "They visited the museum last Sunday and loved the exhibits" },
                        { type: "text", label: "3. I will calling you tomorrow morning.", expectedAnswer: "I will call you tomorrow morning" },
                        { type: "text", label: "4. Does your brother works at the hospital?", expectedAnswer: "Does your brother work at the hospital" },
                        { type: "text", label: "5. We didn't went to the party last night.", expectedAnswer: "We didn't go to the party last night" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Transformation Practice",
                    instructions: "Change each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "1. Make negative: The train arrives at 6 PM.", expectedAnswer: "The train doesn't arrive at 6 PM" },
                        { type: "text", label: "2. Make a question: She finished the report yesterday.", expectedAnswer: "Did she finish the report yesterday" },
                        { type: "text", label: "3. Make negative: They will attend the conference.", expectedAnswer: "They won't attend the conference" },
                        { type: "text", label: "4. Make a question: You drink coffee every morning.", expectedAnswer: "Do you drink coffee every morning" },
                    ],
                },
                {
                    id: "ex-contextual-1",
                    title: "Real-Life Story: Complete the Paragraph",
                    instructions: "Fill in the blanks with the correct form of the verb in parentheses. Choose the right simple tense!",
                    items: [
                        { type: "text", label: "1. Every morning, I ___ (wake) up at 7 AM.", expectedAnswer: "wake" },
                        { type: "text", label: "2. Yesterday, I ___ (oversleep) and missed my alarm.", expectedAnswer: "overslept" },
                        { type: "text", label: "3. Tomorrow, I ___ (set) two alarms to make sure it doesn't happen again!", expectedAnswer: "will set" },
                        { type: "text", label: "4. Usually, I ___ (eat) breakfast at home.", expectedAnswer: "eat" },
                        { type: "text", label: "5. But last week, I ___ (grab) coffee at the café instead.", expectedAnswer: "grabbed" },
                        { type: "text", label: "6. Next time, I ___ (try) their new breakfast sandwich.", expectedAnswer: "will try" },
                    ],
                },
                {
                    id: "ex-contextual-2",
                    title: "Email Practice: Choose the Right Tense",
                    instructions: "Complete this work email with the correct simple tense.",
                    items: [
                        { type: "text", label: "Hi team, I ___ (send) you the meeting notes right now.", expectedAnswer: "am sending" },
                        { type: "text", label: "We ___ (discuss) the new project yesterday.", expectedAnswer: "discussed" },
                        { type: "text", label: "The deadline ___ (be) next Friday.", expectedAnswer: "is" },
                        { type: "text", label: "I ___ (share) the final draft tomorrow morning.", expectedAnswer: "will share" },
                        { type: "text", label: "Please ___ (review) it when you have time.", expectedAnswer: "review" },
                    ],
                },
                {
                    id: "ex-mixed-challenge",
                    title: "Mixed Tense Challenge",
                    instructions: "Read the situation and choose ALL correct answers. Some questions may have multiple correct options.",
                    items: [
                        {
                            type: "radio",
                            label: "Talking about your regular commute to work:",
                            options: [
                                { value: "a", label: "I drive to work every day." },
                                { value: "b", label: "I drove to work every day." },
                                { value: "c", label: "I will drive to work every day." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Describing what happened at a party you attended last weekend:",
                            options: [
                                { value: "a", label: "We dance all night." },
                                { value: "b", label: "We danced all night." },
                                { value: "c", label: "We will dance all night." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Making a spontaneous promise to help your friend:",
                            options: [
                                { value: "a", label: "I help you move next week." },
                                { value: "b", label: "I helped you move next week." },
                                { value: "c", label: "I'll help you move next week." },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
                {
                    id: "ex-time-expressions",
                    title: "Time Expression Practice",
                    instructions: "Match the time expression with the correct simple tense verb form.",
                    items: [
                        { type: "text", label: "1. last night → I ___ (watch) a movie.", expectedAnswer: "watched" },
                        { type: "text", label: "2. every Saturday → She ___ (volunteer) at the shelter.", expectedAnswer: "volunteers" },
                        { type: "text", label: "3. tomorrow → They ___ (announce) the winner.", expectedAnswer: "will announce" },
                        { type: "text", label: "4. three years ago → We ___ (move) to this city.", expectedAnswer: "moved" },
                        { type: "text", label: "5. next month → I ___ (start) my new job.", expectedAnswer: "will start" },
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
                content: "❌ She work downtown → ✅ She works downtown (add -s for he/she/it). ❌ He don't like coffee → ✅ He doesn't like coffee (doesn't with he/she/it). ❌ Does she works? → ✅ Does she work? (base verb in questions). ❌ She didn't worked → ✅ She didn't work (base verb after didn't). ❌ I will going → ✅ I will go (no -ing with will).",
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
