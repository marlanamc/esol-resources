import type { InteractiveGuideContent } from "@/types/activity";

export const futureSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Simple: Making Plans & Promises",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(133, 196, 255, 0.12) 0%, rgba(255, 189, 118, 0.12) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem;">
                    <p style="margin: 0; font-size: 1.05rem;">Future Simple is your crystal ball for quick decisions, promises, and predictions. “I’ll send that email.” “She’ll join the call.” “It’ll rain during the commute.”</p>
                </div>
            `,
        },

        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Simple",
            icon: "⭐",
            explanation: `
                <p>Use <strong>will</strong> for quick decisions, promises, offers, and predictions. If the plan is already set, you’re probably in “going to” land instead.</p>
            `,
            usageMeanings: [
                {
                    title: "🔮 1. Predictions",
                    description: "What we think will happen (weather, tech, coworkers)",
                    examples: [
                        {
                            sentence: "It <strong>will rain</strong> right when I leave the office.",
                            explanation: "✓ Weather prediction",
                        },
                        {
                            sentence: "The Wi‑Fi <strong>will drop</strong> during the all-hands—just wait.",
                            explanation: "✓ Tech-life prediction",
                        },
                    ],
                },
                {
                    title: "🤝 2. Promises & Offers",
                    description: "Things you commit to do",
                    examples: [
                        {
                            sentence: "I <strong>will help</strong> you debug after lunch.",
                            explanation: "✓ Offer",
                        },
                        {
                            sentence: "I <strong>will email</strong> you the slides tonight.",
                            explanation: "✓ Promise",
                        },
                    ],
                },
                {
                    title: "💡 3. Spontaneous Decisions",
                    description: "Decisions made right now",
                    examples: [
                        {
                            sentence: "The phone is ringing—I <strong>will answer</strong> it.",
                            explanation: "✓ Decision at the moment",
                        },
                        {
                            sentence: "We need snacks. I <strong>will order</strong> pizza.",
                            explanation: "✓ Instant choice",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Will vs Going To",
                content: "Use 'will' for predictions or decisions made now. Use 'going to' for plans arranged before this moment.",
            },
            exercises: [
                {
                    id: "ex-usage-fs-1",
                    title: "Practice: Why Use 'Will'?",
                    instructions: "Choose the best reason to use Future Simple (will) in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"I’ll call the client now."',
                            options: [
                                { value: "promise", label: "Promise/offer" },
                                { value: "plan", label: "Pre-planned schedule" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "promise",
                        },
                        {
                            type: "radio",
                            label: '"It will rain during the commute."',
                            options: [
                                { value: "prediction", label: "Prediction" },
                                { value: "decision", label: "Decision right now" },
                                { value: "routine", label: "Routine" },
                            ],
                            expectedAnswer: "prediction",
                        },
                        {
                            type: "radio",
                            label: '"We’ll order pizza. Who’s in?"',
                            options: [
                                { value: "decision", label: "Decision made now" },
                                { value: "schedule", label: "Fixed schedule" },
                                { value: "ongoing", label: "Ongoing action" },
                            ],
                            expectedAnswer: "decision",
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
                <h3>How to Form Future Simple (Positive)</h3>
                <p>Formula: <strong>will + base verb</strong>. Same for every subject—no extra endings.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I will finish the report before noon.",
                "You will see the updated doc in your inbox.",
                "He will join the video call from the airport.",
                "She will present the slides this afternoon.",
                "It will take longer if the Wi‑Fi drops again.",
                "We will grab coffee before the meeting.",
                "They will book the conference room.",
            ],
            tipBox: {
                title: "✏️ Contractions",
                content: "We often use contractions: I'll, you'll, he'll, she'll, it'll, we'll, they'll",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Say What You'll Do",
                    instructions: "Complete with will + base verb (realistic work/life plans).",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (send) the updated deck tonight.",
                            placeholder: "will + verb",
                            expectedAnswer: "will send",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (cover) my shift on Friday.",
                            placeholder: "will + verb",
                            expectedAnswer: "will cover",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (order) lunch for the whole team.",
                            placeholder: "will + verb",
                            expectedAnswer: "will order",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-negative",
            stepNumber: 3,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>will not (won't)</strong> + base verb.</p>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            examples: [
                "I won't schedule meetings after 6 PM.",
                "She won't reply-all this time (hopefully).",
                "They won't push code on Friday night.",
                "It won't ship without QA approval.",
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Say What Won't Happen",
                    instructions: "Use won't + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. I ___ (not join) the late call.",
                            placeholder: "won't + verb",
                            expectedAnswer: "won't join",
                        },
                        {
                            type: "text",
                            label: "2. She ___ (not share) the draft before noon.",
                            placeholder: "won't + verb",
                            expectedAnswer: "won't share",
                        },
                        {
                            type: "text",
                            label: "3. They ___ (not deploy) without testing.",
                            placeholder: "won't + verb",
                            expectedAnswer: "won't deploy",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-questions",
            stepNumber: 4,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Will</strong> at the beginning.</p>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Will you join the 9 AM stand-up?",
                "Will she present the numbers?",
                "Will it crash if we add more users?",
                "Will they approve the budget?",
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About the Future",
                    instructions: "Make questions with Will + subject + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ you ___ (join) the kickoff call?",
                            placeholder: "Will + subject + verb",
                            expectedAnswer: "Will you join",
                        },
                        {
                            type: "text",
                            label: "2. ___ she ___ (lead) the demo?",
                            placeholder: "Will + subject + verb",
                            expectedAnswer: "Will she lead",
                        },
                        {
                            type: "text",
                            label: "3. ___ they ___ (cover) the weekend shift?",
                            placeholder: "Will + subject + verb",
                            expectedAnswer: "Will they cover",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Predictions, promises/offers, spontaneous decisions</li>
                    <li><strong>Positive:</strong> Subject + will + base verb</li>
                    <li><strong>Negative:</strong> Subject + won't + base verb</li>
                    <li><strong>Questions:</strong> Will + subject + base verb?</li>
                    <li><strong>Contractions:</strong> I'll, you'll, he'll, she'll, won't</li>
                    <li><strong>Time Words:</strong> tomorrow, next week, soon, tonight, in an hour</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "Will = same form for all subjects. Very easy to use!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly uses 'will' (base verb)?",
            options: [
                { value: "a", label: "I will to send the file now." },
                { value: "b", label: "I will send the file now." },
                { value: "c", label: "I will sending the file now." },
            ],
            correctAnswer: "b",
            explanation: "Future Simple: will + base verb (no 'to', no -ing).",
        },
        {
            id: "quiz-2",
            question: "Which negative is correct?",
            options: [
                { value: "a", label: "She won't comes." },
                { value: "b", label: "She won't come." },
                { value: "c", label: "She will not comes." },
            ],
            correctAnswer: "b",
            explanation: "Won't + base verb (come, not comes).",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Will you helps me?" },
                { value: "b", label: "Will you help me?" },
                { value: "c", label: "You will help me?" },
            ],
            correctAnswer: "b",
            explanation: "Will + subject + base verb (help, not helps).",
        },
        {
            id: "quiz-4",
            question: "Choose 'will' vs a different tense: Which needs 'will'?",
            options: [
                { value: "a", label: "The train leaves at 7:10 AM." },
                { value: "b", label: "I’ll get the door—that’s the delivery." },
                { value: "c", label: "I’m meeting the client at 3 PM." },
            ],
            correctAnswer: "b",
            explanation: "Spontaneous decision → will. A) timetable uses Present Simple; C) arranged plan uses Present Continuous.",
        },
        {
            id: "quiz-5",
            question: "Pick the correct use of 'will' for a promise/offer.",
            options: [
                { value: "a", label: "I will fixing it later." },
                { value: "b", label: "I fix it later." },
                { value: "c", label: "I will fix it later." },
            ],
            correctAnswer: "c",
            explanation: "Promise: will + base verb → will fix.",
        },
    ],
};
