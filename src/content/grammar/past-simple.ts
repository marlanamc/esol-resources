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
                        <li><strong> Telling detailed housing problem stories (past continuous + past simple together)</li>
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
                        { type: "text", label: "1. buy → ___", expectedAnswer: "bought" },
                        { type: "text", label: "2. teach → ___", expectedAnswer: "taught" },
                        { type: "text", label: "3. feel → ___", expectedAnswer: "felt" },
                        { type: "text", label: "4. bring → ___", expectedAnswer: "brought" },
                        { type: "text", label: "5. catch → ___", expectedAnswer: "caught" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 6: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "1. She didn't went to the party last night.", expectedAnswer: "She didn't go to the party last night" },
                        { type: "text", label: "2. They eated dinner at a new restaurant yesterday.", expectedAnswer: "They ate dinner at a new restaurant yesterday" },
                        { type: "text", label: "3. Did you saw the news this morning?", expectedAnswer: "Did you see the news this morning" },
                        { type: "text", label: "4. He buyed a new car last month.", expectedAnswer: "He bought a new car last month" },
                        { type: "text", label: "5. We didn't finished the project on time.", expectedAnswer: "We didn't finish the project on time" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 7: Transformation Practice",
                    instructions: "Change each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "1. Make negative: I visited my grandparents last weekend.", expectedAnswer: "I didn't visit my grandparents last weekend" },
                        { type: "text", label: "2. Make a question: She finished her homework yesterday.", expectedAnswer: "Did she finish her homework yesterday" },
                        { type: "text", label: "3. Make affirmative: They didn't travel abroad last year.", expectedAnswer: "They traveled abroad last year" },
                        { type: "text", label: "4. Make negative: The movie started at 7 PM.", expectedAnswer: "The movie didn't start at 7 PM" },
                    ],
                },
                {
                    id: "ex-contextual-1",
                    title: "Exercise 8: Story Time - Complete the Narrative",
                    instructions: "Complete this story about last weekend. Use Past Simple!",
                    items: [
                        { type: "text", label: "1. Last Saturday, I ___ (wake) up early.", expectedAnswer: "woke" },
                        { type: "text", label: "2. I ___ (make) breakfast.", expectedAnswer: "made" },
                        { type: "text", label: "3. Then I ___ (go) to the park with my dog.", expectedAnswer: "went" },
                        { type: "text", label: "4. We ___ (not stay) long because it started raining.", expectedAnswer: "didn't stay" },
                        { type: "text", label: "5. When I got home, I ___ (call) my friend.", expectedAnswer: "called" },
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
                                { value: "finished", label: "finished" },
                                { value: "finishing", label: "finishing" },
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
