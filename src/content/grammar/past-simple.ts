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

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Telling problem stories about banking and shopping ("I went to the bank, but they charged me a fee")</li>
                        <li>Reporting what happened ("The cashier said..." "The manager told me...")</li>
                        <li>Explaining past events ("I called customer service, they didn't help, so I complained")</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Telling detailed housing problem stories</strong> (past continuous + past simple together)</li>
                        <li><strong>Weeks 9 & 14:</strong> Talking about your work experience and health history</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">📖 Past Simple is the storytelling tense - every story needs it!</p>
                </div>
            `,
            exercises: [
                {
                    id: "past-simple-intro-1",
                    title: "Quick Check: Past Simple Needs a Past Time",
                    instructions: "Choose the best time expression.",
                    items: [
                        {
                            type: "select",
                            label: "I missed the bus _____.",
                            options: ["yesterday", "right now", "every day", "at the moment"],
                            expectedAnswer: "yesterday",
                        },
                        {
                            type: "select",
                            label: "We watched a movie _____.",
                            options: ["last night", "usually", "right now", "every week"],
                            expectedAnswer: "last night",
                        },
                    ],
                },
            ],
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
                            label: '"My daughter <span class=\'eg-verb\'>graduated</span> from college in May 2023."',
                            options: [
                                { value: "habit", label: "Ongoing habit" },
                                { value: "timestamp", label: "Finished action with a time" },
                                { value: "present", label: "Connected to now" },
                            ],
                            expectedAnswer: "timestamp",
                        },
                        {
                            type: "radio",
                            label: '"We <span class=\'eg-verb\'>packed</span> our bags, <span class=\'eg-verb\'>locked</span> the door, and <span class=\'eg-verb\'>drove</span> to the airport."',
                            options: [
                                { value: "unfinished", label: "Still happening now" },
                                { value: "future", label: "Future plan" },
                                { value: "sequence", label: "Story/sequence of events" },
                            ],
                            expectedAnswer: "sequence",
                        },
                        {
                            type: "radio",
                            label: '"She <span class=\'eg-verb\'>played</span> tennis three times a week before she <span class=\'eg-verb\'>injured</span> her knee."',
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
                            label: "go → ___",
                            expectedAnswer: "went",
                        },
                        {
                            type: "text",
                            label: "work → ___",
                            expectedAnswer: "worked",
                        },
                        {
                            type: "text",
                            label: "study → ___",
                            expectedAnswer: "studied",
                        },
                        {
                            type: "text",
                            label: "have → ___",
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

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">finished</span> my homework before dinner.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            You <span style="color: #f59e0b; font-weight: 600;">fixed</span> the car in record time.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            He <span style="color: #f59e0b; font-weight: 600;">called</span> his friend at 11 PM last night.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">ordered</span> pizza after her shift ended.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            It <span style="color: #f59e0b; font-weight: 600;">rained</span> right when I left the house.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            We <span style="color: #f59e0b; font-weight: 600;">cleaned</span> the entire apartment in two hours.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">bought</span> groceries last week.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "past verb", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Make It Past",
                    instructions: "Change each verb to Past Simple. Think about everyday moments.",
                    items: [
                        {
                            type: "text",
                            label: "The museum (close) ___ early yesterday due to a power outage.",
                            expectedAnswer: "closed",
                        },
                        {
                            type: "text",
                            label: "My nephew (build) ___ a treehouse with his grandfather last summer.",
                            expectedAnswer: "built",
                        },
                        {
                            type: "text",
                            label: "The neighbors (move) ___ to a different state three months ago.",
                            expectedAnswer: "moved",
                        },
                        {
                            type: "text",
                            label: "I (find) ___ a twenty dollar bill on the sidewalk this morning.",
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

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">didn't eat</span> breakfast this morning—I woke up too late.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">didn't go</span> to the party last night.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">didn't fix</span> the sink last week.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            We <span style="color: #f59e0b; font-weight: 600;">didn't see</span> our neighbors at the park yesterday.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "didn't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use didn't + base verb to say what did NOT happen.",
                    items: [
                        {
                            type: "text",
                            label: "The concert (not start) ___ on time because of technical problems.",
                            expectedAnswer: "didn't start",
                        },
                        {
                            type: "text",
                            label: "My sister (not pass) ___ her driving test on the first try.",
                            expectedAnswer: "didn't pass",
                        },
                        {
                            type: "text",
                            label: "We (not bring) ___ umbrellas, and it rained all afternoon.",
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

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Did</span> you <span style="color: #f59e0b; font-weight: 600;">eat</span> breakfast this morning?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Did</span> she <span style="color: #f59e0b; font-weight: 600;">call</span> you yesterday?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Did</span> they <span style="color: #f59e0b; font-weight: 600;">catch</span> the last bus home?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Did</span> he <span style="color: #f59e0b; font-weight: 600;">finish</span> his homework before bed?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Did", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Yesterday",
                    instructions: "Write Past Simple questions about everyday situations.",
                    items: [
                        {
                            type: "text",
                            label: "___ your son (win) his soccer match on Saturday?",
                            expectedAnswer: "Did your son win",
                        },
                        {
                            type: "text",
                            label: "___ the dentist (give) you any painkillers after the procedure?",
                            expectedAnswer: "Did the dentist give",
                        },
                        {
                            type: "text",
                            label: "___ you (remember) to water the plants before we left?",
                            expectedAnswer: "Did you remember",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'call' with the subject 'they'.",
                    items: [
                        { type: "text", label: "Affirmative: They ___", expectedAnswer: "called" },
                        { type: "text", label: "Negative: They ___ call", expectedAnswer: "didn't" },
                        { type: "text", label: "Question: ___ they call?", expectedAnswer: "Did" },
                    ],
                },
                {
                    id: "ex-irregular-practice",
                    title: "Exercise 5: Irregular Verb Practice",
                    instructions: "Write the Past Simple form of these irregular verbs.",
                    items: [
                        { type: "text", label: "buy → ___", expectedAnswer: "bought" },
                        { type: "text", label: "teach → ___", expectedAnswer: "taught" },
                        { type: "text", label: "feel → ___", expectedAnswer: "felt" },
                        { type: "text", label: "bring → ___", expectedAnswer: "brought" },
                        { type: "text", label: "catch → ___", expectedAnswer: "caught" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 6: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "She didn't went to the party last night.", expectedAnswer: "She didn't go to the party last night" },
                        { type: "text", label: "They eated dinner at a new restaurant yesterday.", expectedAnswer: "They ate dinner at a new restaurant yesterday" },
                        { type: "text", label: "Did you saw the news this morning?", expectedAnswer: "Did you see the news this morning" },
                        { type: "text", label: "He buyed a new car last month.", expectedAnswer: "He bought a new car last month" },
                        { type: "text", label: "We didn't finished the project on time.", expectedAnswer: "We didn't finish the project on time" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 7: Transformation Practice",
                    instructions: "Change each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "Make negative: I visited my grandparents last weekend.", expectedAnswer: "I didn't visit my grandparents last weekend" },
                        { type: "text", label: "Make a question: She finished her homework yesterday.", expectedAnswer: "Did she finish her homework yesterday" },
                        { type: "text", label: "Make affirmative: They didn't renew their lease last year.", expectedAnswer: "They renewed their lease last year" },
                        { type: "text", label: "Make negative: The movie started at 7 PM.", expectedAnswer: "The movie didn't start at 7 PM" },
                    ],
                },
                {
                    id: "ex-contextual-1",
                    title: "Exercise 8: Story Time - Complete the Narrative",
                    instructions: "Complete this story about last weekend. Use Past Simple!",
                    items: [
                        { type: "text", label: "Last Saturday, I ___ (wake) up early.", expectedAnswer: "woke" },
                        { type: "text", label: "I ___ (make) breakfast.", expectedAnswer: "made" },
                        { type: "text", label: "Then I ___ (go) to the park with my dog.", expectedAnswer: "went" },
                        { type: "text", label: "We ___ (not stay) long because it started raining.", expectedAnswer: "didn't stay" },
                        { type: "text", label: "When I got home, I ___ (call) my friend.", expectedAnswer: "called" },
                    ],
                },
                {
                    id: "ex-mixed-practice",
                    title: "Exercise 9: Mixed Practice",
                    instructions: "Choose the correct Past Simple form.",
                    items: [
                        {
                            type: "radio",
                            label: "The kids ___ their room yesterday.",
                            options: [
                                { value: "clean", label: "clean" },
                                { value: "cleaned", label: "cleaned" },
                                { value: "cleaning", label: "cleaning" },
                            ],
                            expectedAnswer: "cleaned",
                        },
                        {
                            type: "radio",
                            label: "She ___ her keys in the car.",
                            options: [
                                { value: "leave", label: "leave" },
                                { value: "leaved", label: "leaved" },
                                { value: "left", label: "left" },
                            ],
                            expectedAnswer: "left",
                        },
                        {
                            type: "radio",
                            label: "___ they ___ the concert last night?",
                            options: [
                                { value: "Did enjoy", label: "Did enjoy" },
                                { value: "Did enjoyed", label: "Did enjoyed" },
                                { value: "Do enjoy", label: "Do enjoy" },
                            ],
                            expectedAnswer: "Did enjoy",
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
            exercises: [
                {
                    id: "past-simple-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the correct Past Simple form.",
                    items: [
                        {
                            type: "radio",
                            label: "Yesterday I ___ to work.",
                            options: [
                                { value: "go", label: "go" },
                                { value: "went", label: "went" },
                                { value: "gone", label: "gone" },
                            ],
                            expectedAnswer: "went",
                        },
                        {
                            type: "radio",
                            label: "She ___ her homework last night.",
                            options: [
                                { value: "finish", label: "finish" },
                                { value: "finishing", label: "finishing" },
                                { value: "finished", label: "finished" },
                            ],
                            expectedAnswer: "finished",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly uses Past Simple with an irregular verb?",
            options: [
                { value: "b", label: "I taught my coworker how to use the printer yesterday." },
                { value: "a", label: "I teached my coworker how to use the printer yesterday." },
                { value: "c", label: "I teach my coworker how to use the printer yesterday." },
            ],
            correctAnswer: "b",
            explanation: "Teach is irregular: teach → taught. 'Yesterday' signals Past Simple.",
            skillTag: "form-irregular-past",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Which sentence correctly uses Past Simple with a regular verb?",
            options: [
                { value: "b", label: "We clean the classroom after class last night." },
                { value: "a", label: "We cleaned the classroom after class last night." },
                { value: "c", label: "We have cleaned the classroom after class last night." },
            ],
            correctAnswer: "a",
            explanation: "Finished past time ('last night') uses Past Simple: cleaned.",
            skillTag: "form-regular-ed-spelling",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which sentence correctly uses Past Simple with a verb ending in -e?",
            options: [
                { value: "b", label: "She arriveed at the clinic on time." },
                { value: "c", label: "She arrives at the clinic on time yesterday." },
                { value: "a", label: "She arrived at the clinic on time." },
            ],
            correctAnswer: "a",
            explanation: "Arrive ends in -e, so we add -d: arrive → arrived.",
            skillTag: "form-regular-ed-spelling",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Choose the correct Past Simple spelling for a verb ending in -y.",
            options: [
                { value: "b", label: "He studied for the driver test last weekend." },
                { value: "a", label: "He studyed for the driver test last weekend." },
                { value: "c", label: "He studies for the driver test last weekend." },
            ],
            correctAnswer: "b",
            explanation: "Study → studied (change y to i + ed).",
            skillTag: "form-regular-y-ied",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Choose the correct Past Simple spelling for a one-syllable CVC verb.",
            options: [
                { value: "a", label: "The bus stoped suddenly, so everyone held on." },
                { value: "b", label: "The bus stopped suddenly, so everyone held on." },
                { value: "c", label: "The bus stops suddenly, so everyone holds on." },
            ],
            correctAnswer: "b",
            explanation: "Stop → stopped (double the final consonant + ed).",
            skillTag: "form-regular-double-consonant",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Which negative sentence is correct (watch the main verb form)?",
            options: [
                { value: "a", label: "I didn't went to the appointment." },
                { value: "c", label: "I no went to the appointment." },
                { value: "b", label: "I didn't go to the appointment." },
            ],
            correctAnswer: "b",
            explanation: "After didn't, the main verb stays base form: didn't go (not didn't went).",
            skillTag: "form-negative-didnt-base-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which question is correct in Past Simple?",
            options: [
                { value: "b", label: "Did you pay the bill yesterday?" },
                { value: "a", label: "Did you paid the bill yesterday?" },
                { value: "c", label: "You did pay the bill yesterday?" },
            ],
            correctAnswer: "b",
            explanation: "Questions use Did + subject + base verb: Did you pay…?",
            skillTag: "form-question-did-subject-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Choose the correct Past Simple form of 'be'.",
            options: [
                { value: "b", label: "I were at the clinic yesterday afternoon." },
                { value: "a", label: "I was at the clinic yesterday afternoon." },
                { value: "c", label: "I am at the clinic yesterday afternoon." },
            ],
            correctAnswer: "a",
            explanation: "Past of 'be' is was/were: I was, you/we/they were.",
            skillTag: "form-be-was-were",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "Which sentence is best for a finished action with a clear past time?",
            options: [
                { value: "a", label: "I have met my caseworker last Friday." },
                { value: "c", label: "I meet my caseworker last Friday." },
                { value: "b", label: "I met my caseworker last Friday." },
            ],
            correctAnswer: "b",
            explanation: "A specific finished time ('last Friday') uses Past Simple: met.",
            skillTag: "meaning-finished-time",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Which sentence correctly uses Past Simple with 'ago'?",
            options: [
                { value: "a", label: "We called maintenance two days ago." },
                { value: "b", label: "We have called maintenance two days ago." },
                { value: "c", label: "We call maintenance two days ago." },
            ],
            correctAnswer: "a",
            explanation: "'Ago' points to a finished past time, so Past Simple is correct: called.",
            skillTag: "time-expression-ago",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which sentence describes a past habit that has ended?",
            options: [
                { value: "a", label: "I take the bus every day now." },
                { value: "b", label: "I took the bus every day when I lived downtown." },
                { value: "c", label: "I have taken the bus every day this week." },
            ],
            correctAnswer: "b",
            explanation: "A past habit uses Past Simple with a finished time in the past: when I lived downtown.",
            skillTag: "meaning-past-habit",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: "Which sentence correctly tells a short sequence of events?",
            options: [
                { value: "a", label: "She was calling, then she was leaving a message, then she was going home." },
                { value: "c", label: "She calls, leaves a message, and goes home." },
                { value: "b", label: "She called, left a message, and went home." },
            ],
            correctAnswer: "b",
            explanation: "Past Simple is the storytelling tense for finished steps: called → left → went.",
            skillTag: "meaning-story-sequence",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Choose the best sentence for a finished time in the past.",
            options: [
                { value: "b", label: "I met my manager in 2022." },
                { value: "a", label: "I have met my manager in 2022." },
                { value: "c", label: "I meet my manager in 2022." },
            ],
            correctAnswer: "b",
            explanation: "A finished time ('in 2022') needs Past Simple: met.",
            skillTag: "contrast-past-simple-present-perfect",
            difficulty: "hard",
        },
        {
            id: "quiz-14",
            question: "Which sentence is correct with a finished past time?",
            options: [
                { value: "a", label: "We have paid the rent yesterday." },
                { value: "b", label: "We paid the rent yesterday." },
                { value: "c", label: "We pay the rent yesterday." },
            ],
            correctAnswer: "b",
            explanation: "'Yesterday' is a finished time, so use Past Simple: paid.",
            skillTag: "contrast-past-simple-present-perfect",
            difficulty: "hard",
        },
        {
            id: "quiz-15",
            question: "Choose the correct sentence with an irregular past form.",
            options: [
                { value: "a", label: "He buyed a monthly pass last week." },
                { value: "c", label: "He buys a monthly pass last week." },
                { value: "b", label: "He bought a monthly pass last week." },
            ],
            correctAnswer: "b",
            explanation: "Buy is irregular: buy → bought.",
            skillTag: "error-detection-irregular-form",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question: "Which sentence is correct in a Past Simple negative?",
            options: [
                { value: "b", label: "She didn't receive the text." },
                { value: "a", label: "She didn't received the text." },
                { value: "c", label: "She doesn't received the text." },
            ],
            correctAnswer: "b",
            explanation: "Negative Past Simple is didn't + base verb: didn't receive.",
            skillTag: "error-detection-didnt-verb2",
            difficulty: "medium",
        },
        {
            id: "quiz-17",
            question: "Which sentence correctly uses a time word like 'yesterday'?",
            options: [
                { value: "a", label: "My childcare starts yesterday." },
                { value: "b", label: "My child’s childcare started yesterday." },
                { value: "c", label: "My childcare has started yesterday." },
            ],
            correctAnswer: "b",
            explanation: "'Yesterday' is a finished time, so use Past Simple: started.",
            skillTag: "time-expression-last-yesterday",
            difficulty: "easy",
        },
        {
            id: "quiz-18",
            question: "Which sentence best describes a finished action at a clear past time?",
            options: [
                { value: "a", label: "I have submitted the form on Monday." },
                { value: "c", label: "I submit the form on Monday." },
                { value: "b", label: "I submitted the form on Monday." },
            ],
            correctAnswer: "b",
            explanation: "A specific finished time ('on Monday') needs Past Simple: submitted.",
            skillTag: "meaning-finished-time",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Past Simple

    Skill map by skillTag:
    - form-irregular-past: questions 1
    - form-regular-ed-spelling: questions 2, 3
    - form-regular-y-ied: question 4
    - form-regular-double-consonant: question 5
    - form-negative-didnt-base-verb: question 6
    - form-question-did-subject-verb: question 7
    - form-be-was-were: question 8
    - meaning-finished-time: questions 9, 18
    - time-expression-ago: question 10
    - meaning-past-habit: question 11
    - meaning-story-sequence: question 12
    - contrast-past-simple-present-perfect: questions 13, 14
    - error-detection-irregular-form: question 15
    - error-detection-didnt-verb2: question 16
    - time-expression-last-yesterday: question 17

    How to use this data:
    - If many students miss "form-negative-didnt-base-verb" or "error-detection-didnt-verb2",
      review negative form: subject + didn't + base verb, and correct errors like "didn't went".
    - If scores are low on "contrast-past-simple-present-perfect", spend more time on
      finished time expressions (yesterday, last week, in 2022) versus life experience or present relevance.
    - If "meaning-story-sequence" is weak, practice short storytelling with ordered steps
      using Past Simple verbs in sequence (first, then, after that).
    */
};
