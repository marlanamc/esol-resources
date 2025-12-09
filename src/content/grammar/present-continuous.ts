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
                    <p style="font-size: 1.1rem; margin: 0;">Think video calls, typing an email, waiting for your coffee to brew. Present Continuous is the tense for what you're <strong>doing right this second</strong> or what's <strong>temporary</strong> in your life.</p>
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
                            sentence: "I <strong>am answering</strong> emails while my coffee cools.",
                            explanation: "✓ In-progress action this moment",
                        },
                        {
                            sentence: "She <strong>is presenting</strong> on Zoom, and her Wi-Fi <strong>is freezing</strong> again.",
                            explanation: "✓ Ongoing action + classic tech fail",
                        },
                        {
                            sentence: "They <strong>are waiting</strong> for the printer to stop jamming.",
                            explanation: "✓ Still happening right now",
                        },
                    ],
                },
                {
                    title: "⏳ 2. Temporary Situations (Not Forever)",
                    description: "Short-term arrangements or phases",
                    examples: [
                        {
                            sentence: "I'm <strong>staying</strong> with my sister this month while my place gets fixed.",
                            explanation: "✓ Temporary living situation",
                        },
                        {
                            sentence: "He <strong>is covering</strong> night shifts this week.",
                            explanation: "✓ Short-term schedule",
                        },
                        {
                            sentence: "We <strong>are testing</strong> a new remote-work policy this quarter.",
                            explanation: "✓ Temporary trial, not permanent",
                        },
                    ],
                },
                {
                    title: "🤝 3. Plans in the Near Future",
                    description: "Arranged future plans (similar to 'going to')",
                    examples: [
                        {
                            sentence: "I'm <strong>meeting</strong> the client at 3 PM.",
                            explanation: "✓ Scheduled soon",
                        },
                        {
                            sentence: "They're <strong>launching</strong> the update tonight.",
                            explanation: "✓ Near-future arrangement",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Contrast",
                content:
                    "Present Simple = routines and facts. Present Continuous = happening now or just for a while. 'I work in IT' (general). 'I'm working late tonight' (temporary).",
            },
            exercises: [
                {
                    id: "ex-usage-pc-1",
                    title: "When Do We Use Present Continuous?",
                    instructions: "Choose the best reason for Present Continuous.",
                    items: [
                        {
                            type: "radio",
                            label: '"She is presenting on Zoom right now."',
                            options: [
                                { value: "now", label: "Action happening now" },
                                { value: "habit", label: "Habit/routine" },
                                { value: "future", label: "Future schedule" },
                            ],
                            expectedAnswer: "now",
                        },
                        {
                            type: "radio",
                            label: '"I’m staying with my sister this month."',
                            options: [
                                { value: "temporary", label: "Temporary situation" },
                                { value: "fact", label: "Permanent fact" },
                                { value: "past", label: "Finished past" },
                            ],
                            expectedAnswer: "temporary",
                        },
                        {
                            type: "radio",
                            label: '"We’re meeting the client at 3 PM."',
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
                "I am running the weekly report right now.",
                "You are talking to the IT help desk.",
                "He is fixing the Wi-Fi router again.",
                "She is grabbing coffee before the meeting.",
                "We are onboarding three new hires today.",
                "They are testing the new feature on staging.",
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
                        { type: "text", label: "1. I ___ (finish) this slide deck right now.", placeholder: "am/is/are + ing", expectedAnswer: "am finishing" },
                        { type: "text", label: "2. She ___ (present) to the team at the moment.", placeholder: "am/is/are + ing", expectedAnswer: "is presenting" },
                        { type: "text", label: "3. They ___ (wait) for the train that is late again.", placeholder: "am/is/are + ing", expectedAnswer: "are waiting" },
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
                "I'm not checking email during dinner tonight.",
                "He isn't commuting this week; he's working from home.",
                "They aren't using that software anymore.",
            ],
            exercises: [
                {
                    id: "ex-neg-1",
                    title: "Exercise 2: Say What's NOT Happening",
                    instructions: "Use am/is/are not + verb-ing.",
                    items: [
                        { type: "text", label: "1. I ___ (not answer) messages after 8 PM.", placeholder: "am/is/are not + ing", expectedAnswer: "am not answering" },
                        { type: "text", label: "2. She ___ (not travel) this month.", placeholder: "am/is/are not + ing", expectedAnswer: "is not traveling" },
                        { type: "text", label: "3. They ___ (not join) the meeting right now.", placeholder: "am/is/are not + ing", expectedAnswer: "are not joining" },
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
                "Are you joining the call now?",
                "Is he sharing his screen?",
                "Are they ordering lunch for everyone?",
            ],
            exercises: [
                {
                    id: "ex-q-1",
                    title: "Exercise 3: Ask About Right Now",
                    instructions: "Form questions with am/is/are + subject + verb-ing.",
                    items: [
                        { type: "text", label: "1. ___ you ___ (work) from home today?", placeholder: "Am/Is/Are + subject + ing", expectedAnswer: "Are you working" },
                        { type: "text", label: "2. ___ she ___ (take) notes on this?", placeholder: "Am/Is/Are + subject + ing", expectedAnswer: "Is she taking" },
                        { type: "text", label: "3. ___ they ___ (test) the new app right now?", placeholder: "Am/Is/Are + subject + ing", expectedAnswer: "Are they testing" },
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
                { value: "a", label: "I answer emails right now." },
                { value: "b", label: "I am answering emails right now." },
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
                { value: "a", label: "She manages the support team." },
                { value: "b", label: "She is managing the support team this quarter." },
                { value: "c", label: "She managed the support team last year." },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous fits temporary/short-term arrangements: is managing this quarter.",
        },
    ],
};
