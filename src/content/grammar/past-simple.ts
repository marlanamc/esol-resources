import type { InteractiveGuideContent } from "@/types/activity";

export const pastSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Past Simple: Talking About What Already Happened",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(103, 119, 239, 0.1) 0%, rgba(255, 179, 71, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Think of all the things you already did: you sent that late-night email, you forgot to mute on the video call, you survived Monday. Past Simple is how you tell those stories.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Past Simple is for actions that are finished. They're done, shipped, over. You use it every time you report what happened at work, explain a tech fail, or share what actually went down last weekend.</p>
            `,
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Past Simple",
            icon: "⭐",
            explanation: `
                <h3>Past Simple = finished, stamped, and in the past</h3>
                <p>Use it when the action is over. If it still connects to now, that's a different tense (hello, Present Perfect).</p>
            `,
            usageMeanings: [
                {
                    title: "📅 1. Finished Actions with a Timestamp",
                    description: "You can point to when it happened: yesterday, last night, in 2022, two days ago",
                    examples: [
                        {
                            sentence: "I <strong>signed</strong> the contract yesterday at 4:58 PM.",
                            explanation: "✓ Clear past time, task is done",
                        },
                        {
                            sentence: "My boss <strong>sent</strong> a 'quick email' at midnight.",
                            explanation: "✓ One action, finished (and rude)",
                        },
                        {
                            sentence: "The meeting <strong>ended</strong> early because the Wi-Fi <strong>crashed</strong>.",
                            explanation: "✓ Both actions are over",
                        },
                    ],
                },
                {
                    title: "🔁 2. Past Habits/Routines That Stopped",
                    description: "Things you used to do regularly, but not anymore",
                    examples: [
                        {
                            sentence: "I <strong>took</strong> the 6:10 train every morning before we went remote.",
                            explanation: "✓ Past routine that ended",
                        },
                        {
                            sentence: "Last year, I <strong>cooked</strong> dinner every night. This year, I <strong>ordered</strong> takeout.",
                            explanation: "✓ Habit that changed",
                        },
                        {
                            sentence: "She <strong>called</strong> her mom every Sunday when she <strong>lived</strong> abroad.",
                            explanation: "✓ Regular action in a finished time period",
                        },
                    ],
                },
                {
                    title: "🎬 3. Storytelling & Sequences",
                    description: "Telling what happened, step by step",
                    examples: [
                        {
                            sentence: "I <strong>opened</strong> my laptop, the Wi-Fi <strong>died</strong>, and I <strong>restarted</strong> the router like a hero.",
                            explanation: "✓ A sequence of completed actions",
                        },
                        {
                            sentence: "We <strong>finished</strong> the project, <strong>sent</strong> the report, and <strong>celebrated</strong> with cold pizza.",
                            explanation: "✓ Past events in order",
                        },
                        {
                            sentence: "He <strong>overslept</strong>, <strong>missed</strong> the train, and <strong>walked</strong> to work in the rain.",
                            explanation: "✓ Storytelling of a bad morning",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Key Point",
                content:
                    "Past Simple = action started AND finished in the past. If you feel a connection to now (experience, result, open time period), switch to Present Perfect instead.",
            },
            exercises: [
                {
                    id: "ex-usage-ps-1",
                    title: "Practice: Which Use of Past Simple?",
                    instructions: "Pick the best reason we use Past Simple in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"I signed the contract yesterday at 4:58 PM."',
                            options: [
                                { value: "timestamp", label: "Finished action with a time" },
                                { value: "habit", label: "Ongoing habit" },
                                { value: "present", label: "Connected to now" },
                            ],
                            expectedAnswer: "timestamp",
                        },
                        {
                            type: "radio",
                            label: '"We finished the project and celebrated with pizza."',
                            options: [
                                { value: "sequence", label: "Story/sequence of events" },
                                { value: "unfinished", label: "Still happening now" },
                                { value: "future", label: "Future plan" },
                            ],
                            expectedAnswer: "sequence",
                        },
                        {
                            type: "radio",
                            label: '"I took the 6:10 train every morning before we went remote."',
                            options: [
                                { value: "past-habit", label: "Past habit that ended" },
                                { value: "present-habit", label: "Current habit" },
                                { value: "prediction", label: "Future prediction" },
                            ],
                            expectedAnswer: "past-habit",
                        },
                    ],
                },
            ],
        },

        // Regular vs Irregular Verbs
        {
            id: "regular-irregular",
            stepNumber: 2,
            title: "Regular vs Irregular Verbs",
            explanation: `
                <h3>Two Types of Past Simple Verbs</h3>
                <p><strong>Regular verbs:</strong> Add -ed. Easy.</p>
                <p><strong>Irregular verbs:</strong> Change form completely. Memorize them like your work passwords.</p>
            `,
            verbTable: {
                title: "Common Irregular Past Simple Verbs",
                headers: ["Infinitive", "Past Simple"],
                rows: [
                    ["go", "went"],
                    ["come", "came"],
                    ["see", "saw"],
                    ["do", "did"],
                    ["make", "made"],
                    ["take", "took"],
                    ["get", "got"],
                    ["have", "had"],
                    ["be", "was/were"],
                    ["eat", "ate"],
                    ["drink", "drank"],
                    ["give", "gave"],
                    ["buy", "bought"],
                    ["think", "thought"],
                    ["say", "said"],
                ],
            },
            tipBox: {
                title: "📝 Spelling Rules for Regular Verbs",
                content:
                    "Most verbs: add -ed (work → worked). Verbs ending in -e: add -d (live → lived). Consonant + y: change y to i, add -ed (study → studied).",
            },
            exercises: [
                {
                    id: "ex-regular-irregular-1",
                    title: "Check: Regular or Irregular?",
                    instructions: "Write the correct Past Simple form.",
                    items: [
                        {
                            type: "text",
                            label: "1. go → ___",
                            placeholder: "irregular form",
                            expectedAnswer: "went",
                        },
                        {
                            type: "text",
                            label: "2. work → ___",
                            placeholder: "regular form",
                            expectedAnswer: "worked",
                        },
                        {
                            type: "text",
                            label: "3. study → ___",
                            placeholder: "regular form (watch spelling)",
                            expectedAnswer: "studied",
                        },
                        {
                            type: "text",
                            label: "4. have → ___",
                            placeholder: "irregular form",
                            expectedAnswer: "had",
                        },
                    ],
                },
            ],
        },

        // Positive Form
        {
            id: "step-positive",
            stepNumber: 3,
            title: "Positive Form",
            explanation: `
                <h3>How to Form Past Simple (Positive)</h3>
                <p>Use the past form of the verb (same for all subjects!). Report what already happened and move on.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "past verb", type: "verb" },
            ],
            examples: [
                "I wrapped up the report before the deadline.",
                "You fixed the Wi-Fi in record time.",
                "He sent the deck at 11:59 PM.",
                "She ordered pizza after the night shift.",
                "It rained right when the commute started.",
                "We finished the onboarding in two days.",
                "They booked the flights last week.",
            ],
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Make It Past",
                    instructions: "Change each verb to Past Simple. Think real-life work/life moments.",
                    items: [
                        {
                            type: "text",
                            label: "1. I (finish) ___ a 10-hour shift yesterday.",
                            placeholder: "past simple",
                            expectedAnswer: "finished",
                        },
                        {
                            type: "text",
                            label: "2. She (send) ___ the client the deck at 11:59 PM.",
                            placeholder: "past simple",
                            expectedAnswer: "sent",
                        },
                        {
                            type: "text",
                            label: "3. They (lose) ___ Wi-Fi during the demo.",
                            placeholder: "past simple",
                            expectedAnswer: "lost",
                        },
                        {
                            type: "text",
                            label: "4. We (celebrate) ___ with pizza after the launch.",
                            placeholder: "past simple",
                            expectedAnswer: "celebrated",
                        },
                    ],
                },
            ],
        },

        // Negative Form
        {
            id: "step-negative",
            stepNumber: 4,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>did not (didn't)</strong> + base verb.</p>
                <p><strong>Important:</strong> The main verb returns to base form. The <em>did</em> already shows the past.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "didn't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I didn't check emails after 7 PM last night.",
                "She didn't join the call yesterday.",
                "They didn't fix the printer last week.",
                "We didn't see the new hire at orientation.",
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use didn't + base verb to say what did NOT happen.",
                    items: [
                        {
                            type: "text",
                            label: "1. I (not reply) ___ to messages after dinner.",
                            placeholder: "didn't + base verb",
                            expectedAnswer: "didn't reply",
                        },
                        {
                            type: "text",
                            label: "2. He (not join) ___ the team lunch yesterday.",
                            placeholder: "didn't + base verb",
                            expectedAnswer: "didn't join",
                        },
                        {
                            type: "text",
                            label: "3. They (not finish) ___ the report before Friday.",
                            placeholder: "didn't + base verb",
                            expectedAnswer: "didn't finish",
                        },
                    ],
                },
            ],
        },

        // Question Form
        {
            id: "step-questions",
            stepNumber: 5,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Did</strong> at the beginning, then subject + base verb.</p>
            `,
            formula: [
                { text: "Did", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Did you mute yourself during the call?",
                "Did she submit the ticket yesterday?",
                "Did they catch the last train home?",
                "Did he back up the files before the crash?",
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Yesterday",
                    instructions: "Write Past Simple questions about real-life situations.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ you (catch) the last train last night?",
                            placeholder: "Did + subject + base verb",
                            expectedAnswer: "Did you catch",
                        },
                        {
                            type: "text",
                            label: "2. ___ she (remember) to mute herself?",
                            placeholder: "Did + subject + base verb",
                            expectedAnswer: "Did she remember",
                        },
                        {
                            type: "text",
                            label: "3. ___ they (finish) the slides before the meeting?",
                            placeholder: "Did + subject + base verb",
                            expectedAnswer: "Did they finish",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Finished actions in the past with a clear time (yesterday, last night, two days ago)</li>
                    <li><strong>Regular Verbs:</strong> Add -ed (work → worked)</li>
                    <li><strong>Irregular Verbs:</strong> Memorize the forms (go → went, see → saw)</li>
                    <li><strong>Positive:</strong> Subject + past verb → "She sent the email."</li>
                    <li><strong>Negative:</strong> Subject + didn't + base verb → "He didn't join."</li>
                    <li><strong>Questions:</strong> Did + subject + base verb? → "Did they finish?"</li>
                    <li><strong>Time Words:</strong> yesterday, last week, last night, in 2022, two days ago</li>
                </ul>
            `,
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly uses Past Simple with an irregular verb?",
            options: [
                { value: "a", label: "I goed to the meeting yesterday." },
                { value: "b", label: "I went to the meeting yesterday." },
                { value: "c", label: "I go to the meeting yesterday." },
            ],
            correctAnswer: "b",
            explanation: "Irregular verb go → went; matches past time word 'yesterday.'",
        },
        {
            id: "quiz-2",
            question: "Which negative sentence is correct (watch the main verb form)?",
            options: [
                { value: "a", label: "She didn't checked her email on Sunday." },
                { value: "b", label: "She didn't check her email on Sunday." },
                { value: "c", label: "She no checked her email on Sunday." },
            ],
            correctAnswer: "b",
            explanation: "After 'didn't', the main verb stays in base form: didn't check.",
        },
        {
            id: "quiz-3",
            question: "Which question is correct in Past Simple?",
            options: [
                { value: "a", label: "Did they finished the report last night?" },
                { value: "b", label: "Did they finish the report last night?" },
                { value: "c", label: "They finished the report last night?" },
            ],
            correctAnswer: "b",
            explanation: "Questions use Did + subject + base verb: 'Did they finish...?'",
        },
        {
            id: "quiz-4",
            question: "When should you choose Past Simple instead of Present Perfect?",
            options: [
                { value: "a", label: "For something happening right now" },
                { value: "b", label: "For a finished action with a clear past time (yesterday/last week)" },
                { value: "c", label: "For life experiences with no time given" },
            ],
            correctAnswer: "b",
            explanation: "Past Simple = finished action in a finished time period (yesterday/last week). Life experience with no time uses Present Perfect.",
        },
        {
            id: "quiz-5",
            question: "Choose the correct Past Simple form with a time expression.",
            options: [
                { value: "a", label: "I have finished the deck last night." },
                { value: "b", label: "I finished the deck last night." },
                { value: "c", label: "I finish the deck last night." },
            ],
            correctAnswer: "b",
            explanation: "Specific past time ('last night') needs Past Simple: finished.",
        },
    ],
};
