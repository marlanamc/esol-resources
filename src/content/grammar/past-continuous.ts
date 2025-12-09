import type { InteractiveGuideContent } from "@/types/activity";

export const pastContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Past Continuous: What Was Going On",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(240, 180, 90, 0.12) 0%, rgba(128, 156, 245, 0.12) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="margin: 0; font-size: 1.05rem;">Past Continuous is your play-by-play: what was happening <strong>at a specific moment in the past</strong>, especially when something else interrupted.</p>
                </div>
            `,
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Past Continuous",
            icon: "⭐",
            usageMeanings: [
                {
                    title: "⏸️ 1. Action In Progress at a Past Time",
                    description: "Show what was happening at an exact past moment",
                    examples: [
                        {
                            sentence: "I <strong>was uploading</strong> the report at 11:58 PM.",
                            explanation: "✓ Ongoing action at a specific past time",
                        },
                        {
                            sentence: "They <strong>were fixing</strong> the Wi-Fi while we <strong>were waiting</strong> in the lobby.",
                            explanation: "✓ Background actions in progress",
                        },
                    ],
                },
                {
                    title: "⚡ 2. Interrupted Actions",
                    description: "A longer action stopped by a shorter one",
                    examples: [
                        {
                            sentence: "She <strong>was presenting</strong> when the power <strong>went</strong> out.",
                            explanation: "✓ Presenting = in progress; power outage = interruption",
                        },
                        {
                            sentence: "We <strong>were drafting</strong> the email when the client <strong>called</strong> back.",
                            explanation: "✓ Drafting = longer; call = interruption",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Contrast",
                content: "Past Continuous = in-progress background. Past Simple = completed event. 'I was typing when the laptop died.'",
            },
            exercises: [
                {
                    id: "ex-usage-past-cont-1",
                    title: "Was It In Progress?",
                    instructions: "Choose when Past Continuous is the best fit.",
                    items: [
                        {
                            type: "radio",
                            label: '"She was presenting when the power went out."',
                            options: [
                                { value: "interrupted", label: "Interrupted action in progress" },
                                { value: "finished", label: "Finished one-time action" },
                                { value: "habit", label: "Habit/routine" },
                            ],
                            expectedAnswer: "interrupted",
                        },
                        {
                            type: "radio",
                            label: '"They were testing the app at 3 PM yesterday."',
                            options: [
                                { value: "time-in-progress", label: "Action in progress at a past time" },
                                { value: "completed", label: "Completed past action" },
                                { value: "future", label: "Future plan" },
                            ],
                            expectedAnswer: "time-in-progress",
                        },
                        {
                            type: "radio",
                            label: '"I was commuting when the train stopped."',
                            options: [
                                { value: "interrupted", label: "Interrupted action" },
                                { value: "habit", label: "Habit" },
                                { value: "future", label: "Future ongoing" },
                            ],
                            expectedAnswer: "interrupted",
                        },
                    ],
                },
            ],
        },
        {
            id: "step-positive",
            stepNumber: 2,
            title: "Positive Form",
            explanation: `<p>Formula: <strong>was/were + verb-ing</strong>. Same pattern for everyone—just choose was or were.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "was/were", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I was replying to emails all morning.",
                "You were holding the door when the boxes arrived.",
                "He was updating the slides at midnight.",
                "She was commuting when the train stopped.",
                "We were testing the app during the outage.",
                "They were celebrating after the launch party.",
            ],
            exercises: [
                {
                    id: "ex-1",
                    title: "Exercise 1: Describe What Was Happening",
                    instructions: "Use was/were + verb-ing.",
                    items: [
                        { type: "text", label: "1. I ___ (finish) the report at 10 PM.", placeholder: "was/were + ing", expectedAnswer: "was finishing" },
                        { type: "text", label: "2. They ___ (set) up the projector before the meeting.", placeholder: "was/were + ing", expectedAnswer: "were setting" },
                        { type: "text", label: "3. We ___ (wait) for the bus when it started raining.", placeholder: "was/were + ing", expectedAnswer: "were waiting" },
                    ],
                },
            ],
        },
        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `<p>Add <strong>not</strong> after was/were to show what wasn't happening.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "wasn't/weren't", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I wasn't checking messages during dinner.",
                "They weren't paying attention when the alarm went off.",
            ],
            exercises: [
                {
                    id: "ex-neg-1",
                    title: "Exercise 2: Say What Wasn't Happening",
                    instructions: "Use wasn't/weren't + verb-ing.",
                    items: [
                        { type: "text", label: "1. She ___ (not listen) when you explained.", placeholder: "wasn't/weren't + ing", expectedAnswer: "wasn't listening" },
                        { type: "text", label: "2. We ___ (not use) the old password anymore.", placeholder: "wasn't/weren't + ing", expectedAnswer: "weren't using" },
                    ],
                },
            ],
        },
        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `<p>Flip was/were to the front to ask about what was going on.</p>`,
            formula: [
                { text: "Was/Were", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Were you working late last night?",
                "Was she driving when you called?",
                "Were they testing the feature during the outage?",
            ],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Use:</strong> Actions in progress at a specific past time; background actions interrupted by shorter events</li>
                    <li><strong>Form:</strong> was/were + verb-ing</li>
                    <li><strong>Signal words:</strong> while, when, at 8pm yesterday, during, all night</li>
                </ul>
            `,
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly shows an interrupted action?",
            options: [
                { value: "a", label: "I cooked when the phone rang." },
                { value: "b", label: "I was cooking when the phone rang." },
                { value: "c", label: "I am cooking when the phone rang." },
            ],
            correctAnswer: "b",
            explanation: "Use was/were + verb-ing for the longer background action in the past.",
        },
        {
            id: "quiz-2",
            question: "Which sentence fits 'action in progress at a past time'?",
            options: [
                { value: "a", label: "I worked on the deck yesterday." },
                { value: "b", label: "I was working on the deck at 9 PM yesterday." },
                { value: "c", label: "I work on the deck at 9 PM yesterday." },
            ],
            correctAnswer: "b",
            explanation: "Past Continuous highlights what was happening at a specific past time.",
        },
        {
            id: "quiz-3",
            question: "Choose the correct question form.",
            options: [
                { value: "a", label: "Were you waiting when the train arrived?" },
                { value: "b", label: "Was you waiting when the train arrived?" },
                { value: "c", label: "Did you waiting when the train arrived?" },
            ],
            correctAnswer: "a",
            explanation: "Question: Was/Were + subject + verb-ing.",
        },
        {
            id: "quiz-4",
            question: "Which sentence is NOT a good Past Continuous use?",
            options: [
                { value: "a", label: "She was knowing the answer during the quiz." },
                { value: "b", label: "She was studying when I called." },
                { value: "c", label: "They were driving when the alert popped up." },
            ],
            correctAnswer: "a",
            explanation: "Stative verbs like know typically avoid continuous; use 'She knew the answer.'",
        },
    ],
};
