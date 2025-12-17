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
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Think of all the things you already did: you woke up late, you ate breakfast too fast, you missed the bus, you survived another day. Past Simple is how you tell those stories.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Past Simple is for actions that are finished. They're done, over, in the past. You use it every time you tell someone what happened yesterday, explain why you're late, or share what you did last weekend.</p>
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
                            sentence: "I <strong>woke up</strong> at 6 AM yesterday morning.",
                            explanation: "✓ Clear past time, action is done",
                        },
                        {
                            sentence: "She <strong>called</strong> her mom last night after dinner.",
                            explanation: "✓ One action, finished",
                        },
                        {
                            sentence: "The party <strong>ended</strong> early because it <strong>started</strong> raining.",
                            explanation: "✓ Both actions are over",
                        },
                    ],
                },
                {
                    title: "🔁 2. Past Habits/Routines That Stopped",
                    description: "Things you used to do regularly, but not anymore",
                    examples: [
                        {
                            sentence: "I <strong>walked</strong> to work every morning when I <strong>lived</strong> closer.",
                            explanation: "✓ Past routine that ended",
                        },
                        {
                            sentence: "Last year, I <strong>cooked</strong> dinner every night. This year, I <strong>order</strong> takeout more.",
                            explanation: "✓ Habit that changed",
                        },
                        {
                            sentence: "She <strong>called</strong> her mom every Sunday when she <strong>lived</strong> in another country.",
                            explanation: "✓ Regular action in a finished time period",
                        },
                    ],
                },
                {
                    title: "🎬 3. Storytelling & Sequences",
                    description: "Telling what happened, step by step",
                    examples: [
                        {
                            sentence: "I <strong>woke up</strong> late, <strong>skipped</strong> breakfast, and <strong>ran</strong> to catch the bus.",
                            explanation: "✓ A sequence of completed actions",
                        },
                        {
                            sentence: "We <strong>cleaned</strong> the house, <strong>cooked</strong> dinner, and <strong>watched</strong> a movie together.",
                            explanation: "✓ Past events in order",
                        },
                        {
                            sentence: "He <strong>overslept</strong>, <strong>missed</strong> the bus, and <strong>walked</strong> to work in the rain.",
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
                            label: '"My daughter graduated from college in May 2023."',
                            options: [
                                { value: "timestamp", label: "Finished action with a time" },
                                { value: "habit", label: "Ongoing habit" },
                                { value: "present", label: "Connected to now" },
                            ],
                            expectedAnswer: "timestamp",
                        },
                        {
                            type: "radio",
                            label: '"We packed our bags, locked the door, and drove to the airport."',
                            options: [
                                { value: "sequence", label: "Story/sequence of events" },
                                { value: "unfinished", label: "Still happening now" },
                                { value: "future", label: "Future plan" },
                            ],
                            expectedAnswer: "sequence",
                        },
                        {
                            type: "radio",
                            label: '"She played tennis three times a week before she injured her knee."',
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
                <p><strong>Irregular verbs:</strong> Change form completely. You just have to memorize these—there's no shortcut.</p>
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
                            expectedAnswer: "went",
                        },
                        {
                            type: "text",
                            label: "2. work → ___",
                            expectedAnswer: "worked",
                        },
                        {
                            type: "text",
                            label: "3. study → ___",
                            expectedAnswer: "studied",
                        },
                        {
                            type: "text",
                            label: "4. have → ___",
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
                "I finished my homework before dinner.",
                "You fixed the car in record time.",
                "He called his friend at 11 PM last night.",
                "She ordered pizza after her shift ended.",
                "It rained right when I left the house.",
                "We cleaned the entire apartment in two hours.",
                "They bought groceries last week.",
            ],
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Make It Past",
                    instructions: "Change each verb to Past Simple. Think about everyday moments.",
                    items: [
                        {
                            type: "text",
                            label: "1. The museum (close) ___ early yesterday due to a power outage.",
                            expectedAnswer: "closed",
                        },
                        {
                            type: "text",
                            label: "2. My nephew (build) ___ a treehouse with his grandfather last summer.",
                            expectedAnswer: "built",
                        },
                        {
                            type: "text",
                            label: "3. The neighbors (move) ___ to a different state three months ago.",
                            expectedAnswer: "moved",
                        },
                        {
                            type: "text",
                            label: "4. I (find) ___ a twenty dollar bill on the sidewalk this morning.",
                            expectedAnswer: "found",
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
                "I didn't eat breakfast this morning—I woke up too late.",
                "She didn't go to the party last night.",
                "They didn't fix the sink last week.",
                "We didn't see our neighbors at the park yesterday.",
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use didn't + base verb to say what did NOT happen.",
                    items: [
                        {
                            type: "text",
                            label: "1. The concert (not start) ___ on time because of technical problems.",
                            expectedAnswer: "didn't start",
                        },
                        {
                            type: "text",
                            label: "2. My sister (not pass) ___ her driving test on the first try.",
                            expectedAnswer: "didn't pass",
                        },
                        {
                            type: "text",
                            label: "3. We (not bring) ___ umbrellas, and it rained all afternoon.",
                            expectedAnswer: "didn't bring",
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
                "Did you eat breakfast this morning?",
                "Did she call you yesterday?",
                "Did they catch the last bus home?",
                "Did he finish his homework before bed?",
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Yesterday",
                    instructions: "Write Past Simple questions about everyday situations.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ your son (win) his soccer match on Saturday?",
                            expectedAnswer: "Did your son win",
                        },
                        {
                            type: "text",
                            label: "2. ___ the dentist (give) you any painkillers after the procedure?",
                            expectedAnswer: "Did the dentist give",
                        },
                        {
                            type: "text",
                            label: "3. ___ you (remember) to water the plants before we left?",
                            expectedAnswer: "Did you remember",
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
                { value: "a", label: "The kids drawed pictures at the art class yesterday." },
                { value: "b", label: "The kids drew pictures at the art class yesterday." },
                { value: "c", label: "The kids draw pictures at the art class yesterday." },
            ],
            correctAnswer: "b",
            explanation: "Irregular verb draw → drew; matches past time word 'yesterday.'",
        },
        {
            id: "quiz-2",
            question: "Which negative sentence is correct (watch the main verb form)?",
            options: [
                { value: "a", label: "My grandparents didn't traveled to Europe last year." },
                { value: "b", label: "My grandparents didn't travel to Europe last year." },
                { value: "c", label: "My grandparents no traveled to Europe last year." },
            ],
            correctAnswer: "b",
            explanation: "After 'didn't', the main verb stays in base form: didn't travel.",
        },
        {
            id: "quiz-3",
            question: "Which question is correct in Past Simple?",
            options: [
                { value: "a", label: "Did the festival attracted many visitors last weekend?" },
                { value: "b", label: "Did the festival attract many visitors last weekend?" },
                { value: "c", label: "The festival attracted many visitors last weekend?" },
            ],
            correctAnswer: "b",
            explanation: "Questions use Did + subject + base verb: 'Did the festival attract...?'",
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
                { value: "a", label: "The bakery has opened at 6 AM this morning." },
                { value: "b", label: "The bakery opened at 6 AM this morning." },
                { value: "c", label: "The bakery opens at 6 AM this morning." },
            ],
            correctAnswer: "b",
            explanation: "Specific past time ('this morning') needs Past Simple: opened.",
        },
    ],
};
