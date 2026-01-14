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
            exercises: [
                {
                    id: "present-continuous-intro-1",
                    title: "Practice: Understanding Present Continuous",
                    instructions: "Identify what Present Continuous is used for.",
                    items: [
                        {
                            type: "radio",
                            label: "What is Present Continuous used for?",
                            options: [
                                { value: "a", label: "Actions happening right now or temporary situations" },
                                { value: "b", label: "Habits and routines" },
                                { value: "c", label: "Past actions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"The TV <span class=\'eg-helper\'>is</span> <span class=\'eg-verb\'>playing</span>." What does this describe?',
                            options: [
                                { value: "a", label: "What's happening right now" },
                                { value: "b", label: "A habit" },
                                { value: "c", label: "A future plan" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do we use Present Continuous?",
                            options: [
                                { value: "a", label: "For actions in motion right now or temporary situations" },
                                { value: "b", label: "Only for future plans" },
                                { value: "c", label: "Only for past actions" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
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
                            label: "\"She <span class=\'eg-helper\'>is</span> <span class=\'eg-verb\'>talking</span> on the phone right now.\"",
                            options: [
                                { value: "now", label: "Action happening now" },
                                { value: "habit", label: "Habit/routine" },
                                { value: "future", label: "Future schedule" },
                            ],
                            expectedAnswer: "now",
                        },
                        {
                            type: "radio",
                            label: "\"My parents <span class=\'eg-helper\'>are</span> <span class=\'eg-verb\'>renovating</span> their bathroom this summer.\"",
                            options: [
                                { value: "temporary", label: "Temporary situation" },
                                { value: "fact", label: "Permanent fact" },
                                { value: "past", label: "Finished past" },
                            ],
                            expectedAnswer: "temporary",
                        },
                        {
                            type: "radio",
                            label: "\"The kids <span class=\'eg-helper\'>are</span> <span class=\'eg-verb\'>performing</span> in the school play tomorrow evening.\"",
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
            explanation: `
                <p>Formula: <strong>am/is/are + verb-ing</strong>. Same for all subjects—just swap am/is/are.</p>

                <div style="margin-top: 1.5rem; background: rgba(240, 180, 90, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(240, 180, 90, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            I <span style="color: #f0b45a; font-weight: 600;">am washing</span> the dishes right now.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            You <span style="color: #f0b45a; font-weight: 600;">are listening</span> to music on your headphones.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            He <span style="color: #f0b45a; font-weight: 600;">is fixing</span> his car in the driveway.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            She <span style="color: #f0b45a; font-weight: 600;">is making</span> dinner for the family.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            We <span style="color: #f0b45a; font-weight: 600;">are watching</span> the game on TV.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            They <span style="color: #f0b45a; font-weight: 600;">are playing</span> soccer in the park.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "am/is/are", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
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
                        { type: "text", label: "The baby ___ (sleep) peacefully in her crib right now.", expectedAnswer: "is sleeping" },
                        { type: "text", label: "My neighbors ___ (plant) a vegetable garden in their backyard.", expectedAnswer: "are planting" },
                        { type: "text", label: "I ___ (take) guitar lessons every Tuesday this course.", expectedAnswer: "am taking" },
                    ],
                },
            ],
        },
        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `
                <p>Add <strong>not</strong> after am/is/are to show something is NOT happening.</p>

                <div style="margin-top: 1.5rem; background: rgba(240, 180, 90, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(240, 180, 90, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            I<span style="color: #f0b45a; font-weight: 600;">'m not eating</span> meat this month—I'm trying something new.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            He <span style="color: #f0b45a; font-weight: 600;">isn't taking</span> the early shift this week.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            They <span style="color: #f0b45a; font-weight: 600;">aren't going</span> to the party tonight.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "am/is/are not", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-neg-1",
                    title: "Exercise 2: Say What's NOT Happening",
                    instructions: "Use am/is/are not + verb-ing.",
                    items: [
                        { type: "text", label: "The museum ___ (not charge) admission fees this weekend.", expectedAnswer: "is not charging" },
                        { type: "text", label: "We ___ (not buy) a new couch this month because we're saving money.", expectedAnswer: "are not buying" },
                        { type: "text", label: "My son ___ (not listen) to my advice about his college applications.", expectedAnswer: "is not listening" },
                    ],
                },
            ],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `
                <p>Flip am/is/are to the front to ask about actions in progress.</p>

                <div style="margin-top: 1.5rem; background: rgba(240, 180, 90, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(240, 180, 90, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            <span style="color: #f0b45a; font-weight: 600;">Are</span> you <span style="color: #f0b45a; font-weight: 600;">coming</span> to dinner tonight?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            <span style="color: #f0b45a; font-weight: 600;">Is</span> he <span style="color: #f0b45a; font-weight: 600;">watching</span> the game?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(240, 180, 90, 0.1);">
                            <span style="color: #f0b45a; font-weight: 600;">Are</span> they <span style="color: #f0b45a; font-weight: 600;">making</span> pizza for everyone?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Am/Is/Are", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-q-1",
                    title: "Exercise 3: Ask About Right Now",
                    instructions: "Form questions with am/is/are + subject + verb-ing.",
                    items: [
                        { type: "text", label: "___ the library ___ (offer) free workshops this month?", expectedAnswer: "Is the library offering" },
                        { type: "text", label: "___ your cousins ___ (visit) next week?", expectedAnswer: "Are your cousins visiting" },
                        { type: "text", label: "___ the city ___ (repair) the sidewalks in our neighborhood?", expectedAnswer: "Is the city repairing" },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'eat' with the subject 'they'.",
                    items: [
                        { type: "text", label: "Affirmative: They ___ eating", expectedAnswer: "are" },
                        { type: "text", label: "Negative: They ___ eating", expectedAnswer: "aren't" },
                        { type: "text", label: "Question: ___ they eating?", expectedAnswer: "Are" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 5: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "She is cook dinner right now.", expectedAnswer: "She is cooking dinner right now" },
                        { type: "text", label: "They is watching a movie.", expectedAnswer: "They are watching a movie" },
                        { type: "text", label: "I'm not go to the party tonight.", expectedAnswer: "I'm not going to the party tonight" },
                        { type: "text", label: "Are you come with us?", expectedAnswer: "Are you coming with us" },
                        { type: "text", label: "He working on a new project.", expectedAnswer: "He is working on a new project" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 6: Transformation Practice",
                    instructions: "Change each sentence as instructed.",
                    items: [
                        { type: "text", label: "Make negative: I am studying for my exam.", expectedAnswer: "I am not studying for my exam" },
                        { type: "text", label: "Make a question: She is working from home today.", expectedAnswer: "Is she working from home today" },
                        { type: "text", label: "Make affirmative: They aren't working this weekend.", expectedAnswer: "They are working this weekend" },
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
            exercises: [
                {
                    id: "present-continuous-summary-1",
                    title: "Practice: Quick Summary Check",
                    instructions: "Use am/is/are + verb-ing for actions in progress or temporary situations.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is a good use of Present Continuous?",
                            options: [
                                { value: "a", label: "I am waiting for the bus right now." },
                                { value: "b", label: "I wait for the bus every day." },
                                { value: "c", label: "I waited for the bus yesterday." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Complete: They ___ (not watch) TV right now.",
                            expectedAnswer: "are not watching",
                        },
                        {
                            type: "word-scramble",
                            label: "Put the words in order to make a correct sentence.",
                            words: ["She", "is", "cooking", "right", "now"],
                            correctAnswer: "She is cooking right now",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly shows an action in progress?",
            options: [
                { value: "a", label: "I cook dinner right now." },
                { value: "b", label: "I am cooking dinner right now." },
                { value: "c", label: "I cooked dinner right now." },
            ],
            correctAnswer: "b",
            explanation: "Use am/is/are + verb-ing for actions happening at this moment.",
        },
        {
            id: "quiz-2",
            question: "Which sentence shows a temporary situation (not permanent)?",
            options: [
                { value: "a", label: "My aunt lives in Dorchester." },
                { value: "b", label: "My aunt is living with her sister this month while her apartment is painted." },
                { value: "c", label: "My aunt lived in Dorchester when she was a child." },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous fits temporary arrangements that are true for a short period.",
        },
        {
            id: "quiz-3",
            question: "Which sentence is an arranged near-future plan (Present Continuous)?",
            options: [
                { value: "a", label: "I'm meeting the teacher tomorrow afternoon." },
                { value: "b", label: "I meet the teacher tomorrow afternoon." },
                { value: "c", label: "I met the teacher tomorrow afternoon." },
            ],
            correctAnswer: "a",
            explanation: "We often use Present Continuous for arranged plans: I'm meeting… tomorrow.",
        },
        {
            id: "quiz-4",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Are you working today?" },
                { value: "b", label: "Do you working today?" },
                { value: "c", label: "Are you work today?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Am/Is/Are + subject + verb-ing.",
        },
        {
            id: "quiz-5",
            question: "Which negative sentence is correct?",
            options: [
                { value: "a", label: "He isn't taking the early shift this week." },
                { value: "b", label: "He doesn't taking the early shift this week." },
                { value: "c", label: "He isn't take the early shift this week." },
            ],
            correctAnswer: "a",
            explanation: "Negative Present Continuous: am/is/are not + verb-ing.",
        },
        {
            id: "quiz-6",
            question: "Which sentence is NOT a good use of Present Continuous?",
            options: [
                { value: "a", label: "I'm knowing the answer right now." },
                { value: "b", label: "She's staying with her cousin this week." },
                { value: "c", label: "They're waiting for the bus right now." },
            ],
            correctAnswer: "a",
            explanation: "Stative verbs like know rarely take -ing; use 'I know the answer.'",
        },
        {
            id: "quiz-7",
            question: "Choose the correct -ing form: write → ____",
            options: [
                { value: "a", label: "writeing" },
                { value: "b", label: "writing" },
                { value: "c", label: "writting" },
            ],
            correctAnswer: "b",
            explanation: "Drop final -e: write → writing.",
        },
        {
            id: "quiz-8",
            question: "Choose the correct -ing form: run → ____",
            options: [
                { value: "a", label: "runing" },
                { value: "b", label: "running" },
                { value: "c", label: "runeing" },
            ],
            correctAnswer: "b",
            explanation: "One-syllable CVC verbs double the last consonant: run → running.",
        },
        {
            id: "quiz-9",
            question: "Choose Present Continuous or Present Simple: Which sentence is a habit?",
            options: [
                { value: "a", label: "I am taking the bus to work every day." },
                { value: "b", label: "I take the bus to work every day." },
                { value: "c", label: "I took the bus to work every day." },
            ],
            correctAnswer: "b",
            explanation: "Habits/routines usually use Present Simple: I take… every day.",
        },
        {
            id: "quiz-10",
            question: "Which sentence correctly shows something happening now?",
            options: [
                { value: "a", label: "The kids play outside right now." },
                { value: "b", label: "The kids are playing outside right now." },
                { value: "c", label: "The kids played outside right now." },
            ],
            correctAnswer: "b",
            explanation: "Right now → Present Continuous: are playing.",
        },
        {
            id: "quiz-11",
            question: "Which sentence has the correct word order?",
            options: [
                { value: "a", label: "Why you are waiting?" },
                { value: "b", label: "Why are you waiting?" },
                { value: "c", label: "Why are waiting you?" },
            ],
            correctAnswer: "b",
            explanation: "Questions: WH-word + am/is/are + subject + verb-ing.",
        },
        {
            id: "quiz-12",
            question: "Choose 'will' or Present Continuous: Someone knocks. You decide now.",
            options: [
                { value: "a", label: "I'm answering the door." },
                { value: "b", label: "I'll answer the door." },
                { value: "c", label: "I answer the door." },
            ],
            correctAnswer: "b",
            explanation: "A spontaneous decision right now often uses will: I'll answer.",
        },
        {
            id: "quiz-13",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "She is cook dinner right now." },
                { value: "b", label: "She is cooking dinner right now." },
                { value: "c", label: "She cooking dinner right now." },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous needs am/is/are + verb-ing: is cooking.",
        },
        {
            id: "quiz-14",
            question: "Which time expression often goes with Present Continuous?",
            options: [
                { value: "a", label: "right now" },
                { value: "b", label: "in 2020" },
                { value: "c", label: "two years ago" },
            ],
            correctAnswer: "a",
            explanation: "Right now/currently/at the moment often signal Present Continuous.",
        },
        {
            id: "quiz-15",
            question: "Which sentence best describes a temporary work schedule?",
            options: [
                { value: "a", label: "He works the night shift." },
                { value: "b", label: "He is working the night shift this week." },
                { value: "c", label: "He worked the night shift this week." },
            ],
            correctAnswer: "b",
            explanation: "This week suggests a temporary situation, so Present Continuous fits: is working.",
        },
    ],
};
