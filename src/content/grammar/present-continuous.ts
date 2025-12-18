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
                        { type: "text", label: "1. ___ the library ___ (offer) free workshops this month?", expectedAnswer: "Is the library offering" },
                        { type: "text", label: "2. ___ your grandparents ___ (visit) from overseas next week?", expectedAnswer: "Are your grandparents visiting" },
                        { type: "text", label: "3. ___ the city ___ (repair) the sidewalks in our neighborhood?", expectedAnswer: "Is the city repairing" },
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
                        { type: "text", label: "1. She is cook dinner right now.", expectedAnswer: "She is cooking dinner right now" },
                        { type: "text", label: "2. They is watching a movie.", expectedAnswer: "They are watching a movie" },
                        { type: "text", label: "3. I'm not go to the party tonight.", expectedAnswer: "I'm not going to the party tonight" },
                        { type: "text", label: "4. Are you come with us?", expectedAnswer: "Are you coming with us" },
                        { type: "text", label: "5. He working on a new project.", expectedAnswer: "He is working on a new project" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 6: Transformation Practice",
                    instructions: "Change each sentence as instructed.",
                    items: [
                        { type: "text", label: "1. Make negative: I am studying for my exam.", expectedAnswer: "I am not studying for my exam" },
                        { type: "text", label: "2. Make a question: She is working from home today.", expectedAnswer: "Is she working from home today" },
                        { type: "text", label: "3. Make affirmative: They aren't traveling this summer.", expectedAnswer: "They are traveling this summer" },
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
