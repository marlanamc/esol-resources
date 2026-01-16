import type { InteractiveGuideContent } from "@/types/activity";

export const gerundsInfinitivesPatternsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Gerunds or Infinitives? Patterns That Keep Meaning Clear",
            icon: "🌀",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(132, 204, 22, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem;">
                    <p style="margin-bottom: 0; font-size: 1.15rem;">“I plan to move next month” vs “I enjoy walking through East Boston.” Gerunds (-ing) often talk about routine or feelings, while infinitives (to + verb) name intentions or choices. This guide gathers the patterns you need so you can choose confidently.</p>
                </div>

                <h3>Why These Patterns Matter</h3>
                <ul>
                    <li><strong>Housing:</strong> Decide if you describe a routine (“I love biking to the community center”) or a plan (“I want to rent the apartment soon”).</li>
                    <li><strong>Jobs:</strong> Talk about experience (“I have practiced customer service”) vs goals (“I hope to lead a project”).</li>
                    <li><strong>Health:</strong> Use gerunds with prepositions (“After stretching, I feel stronger”) and infinitives to share intentions (“I plan to ask about community clinics”).</li>
                </ul>

                <p>Let's map the most useful patterns, then practice mixing them in conversations and writing.</p>
            `,
        },
        {
            id: "pattern-matrix",
            stepNumber: 1,
            title: "Pattern Matrix: Routine vs. Intention",
            icon: "🗂️",
            explanation: `
                <p>The easiest way to choose is to notice the <strong>role</strong> of the verb. Here's a quick matrix:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
                    <tr style="background: #f5f5f5;"><th style="padding: 0.4rem; border: 1px solid #e5e7eb;">Focus</th><th style="padding: 0.4rem; border: 1px solid #e5e7eb;">Gerund (-ing)</th><th style="padding: 0.4rem; border: 1px solid #e5e7eb;">Infinitive (to + verb)</th></tr>
                    <tr><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">Routine / Enjoyment</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">I enjoy meeting my neighbors at the block party.</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">—</td></tr>
                    <tr><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">Plans / Intentions</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">—</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">I plan to submit my job application today.</td></tr>
                    <tr><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">After prepositions</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">After touring the apartment, I felt hopeful.</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">—</td></tr>
                </table>
                <p style="margin-top: 1rem;">If you're unsure, ask: “Is this happening now (gerund) or is it about planning/deciding (infinitive)?”</p>
            `,
            exercises: [
                {
                    id: "pattern-matrix-1",
                    title: "Choose the Right Form",
                    instructions: "Which sentence best matches the idea of a plan?",
                    items: [
                        {
                            type: "radio",
                            label: "After my shift, I enjoy walking along Salem Street.",
                            options: [
                                { value: "plan", label: "Plan / intention" },
                                { value: "routine", label: "Routine / feeling" },
                            ],
                            expectedAnswer: "routine",
                        },
                        {
                            type: "radio",
                            label: "I plan to ask the clinic about vaccination hours.",
                            options: [
                                { value: "routine", label: "Routine / feeling" },
                                { value: "plan", label: "Plan / intention" },
                            ],
                            expectedAnswer: "plan",
                        },
                    ],
                },
            ],
        },
        {
            id: "verb-groups",
            stepNumber: 2,
            title: "Verbs That Lock in Gerunds or Infinitives",
            icon: "🔁",
            explanation: `
                <p>Certain verbs always want a gerund, others pair with infinitives, and a few allow both but with different meanings.</p>
                <div style="display: grid; gap: 1rem;">
                    <div style="background: rgba(59, 130, 246, 0.08); border-left: 4px solid #1d4ed8; padding: 0.75rem; border-radius: 0.5rem;">
                        <h4 style="margin-top: 0;">Always Gerund</h4>
                        <ul>
                            <li>enjoy, avoid, keep, finish, consider</li>
                        </ul>
                        <p><em>Example:</em> I enjoy helping neighbors with their groceries.</p>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.08); border-left: 4px solid #059669; padding: 0.75rem; border-radius: 0.5rem;">
                        <h4 style="margin-top: 0;">Always Infinitive</h4>
                        <ul>
                            <li>decide, plan, hope, promise, want</li>
                        </ul>
                        <p><em>Example:</em> I plan to visit the East Boston career center tomorrow.</p>
                    </div>
                </div>
                <p style="margin-top: 1rem;">Some verbs, like <strong>remember</strong> or <strong>stop</strong>, change meaning depending on the form. Practice noticing how the meaning shifts in real sentences.</p>
            `,
            exercises: [
                {
                    id: "verb-groups-1",
                    title: "Gerund or Infinitive?",
                    instructions: "Decide which form belongs in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "I stopped (___) so many shifts; I needed rest.",
                            options: [
                                { value: "call", label: "calling (gerund)" },
                                { value: "to call", label: "to call (infinitive)" },
                            ],
                            expectedAnswer: "calling",
                        },
                        {
                            type: "radio",
                            label: "She promised (___) the landlord next week.",
                            options: [
                                { value: "calling", label: "calling" },
                                { value: "to call", label: "to call" },
                            ],
                            expectedAnswer: "to call",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Tip",
                content: "If the verb describes a feeling or habit, reach for the gerund. If it describes a plan, intention, or decision, reach for the infinitive.",
            },
        },
        {
            id: "prep-gerund",
            stepNumber: 3,
            title: "Gerunds After Prepositions and Nouns",
            icon: "🧭",
            explanation: `
                <p>Gerunds are the go-to after prepositions, especially when you describe daily routines or feelings about East Boston community events.</p>
                <ul>
                    <li>Keep practicing preposition + gerund pairs: <strong>thinking about moving</strong>, <strong>talking with neighbors</strong>, <strong>waiting for the shuttle</strong>.</li>
                    <li>Use the gerund after a noun that needs extra detail: <strong>the idea of learning</strong> or <strong>the habit of walking</strong>.</li>
                </ul>
                <p>Infinitives appear after adjectives and nouns when you want to explain why or what comes next.</p>
            `,
            exercises: [
                {
                    id: "prep-gerund-1",
                    title: "Choose the Complete Phrase",
                    instructions: "Which option uses the correct form after the preposition?",
                    items: [
                        {
                            type: "radio",
                            label: "I'm excited about (___) for the job fair.",
                            options: [
                                { value: "going", label: "going" },
                                { value: "to go", label: "to go" },
                            ],
                            expectedAnswer: "going",
                        },
                        {
                            type: "radio",
                            label: "He graduated and promised (___) other East Boston students.",
                            options: [
                                { value: "helping", label: "helping" },
                                { value: "to help", label: "to help" },
                            ],
                            expectedAnswer: "to help",
                        },
                    ],
                },
            ],
        },
        {
            id: "mix-practice",
            stepNumber: 4,
            title: "Mix & Match in Class Conversations",
            icon: "🎤",
            explanation: `
                <p>Use it like this: start with a context, decide if it is repeating, describing a feeling, or planning, then pick the verb form that fits.</p>
                <p style="font-style: italic;">Sentence frames to try: “I always ___ (gerund) when I…” vs “I'm trying ___ (infinitive) before the next shuttle.”</p>
                <p>Work in pairs to compare answers and explain your choice. Staying intentional with each form will build confidence when you speak with community members or employers.</p>
            `,
            exercises: [
                {
                    id: "mix-practice-1",
                    title: "Pair Practice",
                    instructions: "Rebuild each sentence with the best form (gerund or infinitive).",
                    items: [
                        {
                            type: "radio",
                            label: "We plan ___ a new roommate once the lease ends.",
                            options: [
                                { value: "finding", label: "finding" },
                                { value: "to find", label: "to find" },
                            ],
                            expectedAnswer: "to find",
                        },
                        {
                            type: "radio",
                            label: "I remember ___ at the booth to get health information last spring.",
                            options: [
                                { value: "talking", label: "talking" },
                                { value: "to talk", label: "to talk" },
                            ],
                            expectedAnswer: "talking",
                        },
                    ],
                },
            ],
        },
    ],
};
