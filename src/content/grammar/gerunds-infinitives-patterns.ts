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
                    <p style="margin-bottom: 0.5rem; font-size: 1.15rem;">Identify whether you are describing a routine, a feeling, or a plan. Gerunds (-ing) often signal what you enjoy or do regularly; infinitives (to + verb) point to intention, decisions, or next steps.</p>
                    <p style="margin-bottom: 0;">Use these patterns when you talk about housing, jobs, health, or East Boston community life so listeners know if you are describing a habit or a goal.</p>
                </div>
                <ul style="margin-top: 0; padding-left: 1.2rem;">
                    <li>Housing: “I enjoy walking past the community garden.”</li>
                    <li>Jobs: “I plan to submit the resume tomorrow.”</li>
                    <li>Health: “After stretching, I feel ready for classes.”</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Quick Tip",
                content: "Ask yourself, is this repeating or feeling (use gerund) or is it a plan/choice (use infinitive)? Keep the context in mind before you pick a form.",
            },
        },
        {
            id: "pattern-map",
            stepNumber: 1,
            title: "Pattern Map: Routine vs Intention",
            icon: "🗂️",
            explanation: `
                <p>The easiest way to choose is to notice the <strong>role</strong> of the verb:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
                    <tr style="background: #f5f5f5;"><th style="padding: 0.4rem; border: 1px solid #e5e7eb;">Role</th><th style="padding: 0.4rem; border: 1px solid #e5e7eb;">Gerund (-ing)</th><th style="padding: 0.4rem; border: 1px solid #e5e7eb;">Infinitive (to + verb)</th></tr>
                    <tr><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">Routine / Feeling</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">I enjoy meeting neighbors at the block party.</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">—</td></tr>
                    <tr><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">Plan / Decision</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">—</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">I plan to submit my job application today.</td></tr>
                    <tr><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">After prepositions</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">After touring the apartment, I felt hopeful.</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">—</td></tr>
                    <tr><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">Object of verbs</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">I quit working late shifts.</td><td style="padding: 0.4rem; border: 1px solid #e5e7eb;">I promise to arrive early.</td></tr>
                </table>
            `,
            exercises: [
                {
                    id: "pattern-matrix-1",
                    title: "Choose the Right Form",
                    instructions: "Which sentence best matches routine or plan?",
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
            id: "context-board",
            stepNumber: 2,
            title: "Context Board: Housing, Jobs, Health",
            icon: "🏙️",
            explanation: `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
                    <div style="background: rgba(16, 185, 129, 0.08); border-left: 4px solid #059669; padding: 0.75rem; border-radius: 0.5rem;">
                        <h4 style="margin-top: 0;">Housing</h4>
                        <p>Use gerunds for feelings (I enjoy touring apartments), infinitives for plans (I hope to sign a lease).</p>
                    </div>
                    <div style="background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb; padding: 0.75rem; border-radius: 0.5rem;">
                        <h4 style="margin-top: 0;">Jobs</h4>
                        <p>Pair verbs (decide, agree, promise) with infinitives to show choices.</p>
                    </div>
                    <div style="background: rgba(248, 113, 113, 0.08); border-left: 4px solid #dc2626; padding: 0.75rem; border-radius: 0.5rem;">
                        <h4 style="margin-top: 0;">Health</h4>
                        <p>Gerunds follow prepositions in check-in phrases (after stretching, before resting).</p>
                    </div>
                </div>
                <p style="margin-top: 0.75rem;">Use these callouts while you discuss East Boston community events so students see why the form matters.</p>
            `,
        },
        {
            id: "timeline",
            stepNumber: 3,
            title: "Routine → Intention Timeline",
            icon: "📊",
            explanation: `
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem;">
                    <div style="flex: 1 1 150px; background: rgba(251, 191, 36, 0.1); border-left: 4px solid #f59e0b; padding: 0.9rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600;">Routine</p>
                        <p style="margin: 0;">Gerunds + feelings/habits</p>
                    </div>
                    <div style="flex: 1 1 150px; background: rgba(14, 165, 233, 0.1); border-left: 4px solid #0ea5e9; padding: 0.9rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600;">Transition</p>
                        <p style="margin: 0;">Preposition + gerund</p>
                    </div>
                    <div style="flex: 1 1 150px; background: rgba(16, 185, 129, 0.1); border-left: 4px solid #059669; padding: 0.9rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600;">Intention</p>
                        <p style="margin: 0;">Infinitives signal tomorrow and goals</p>
                    </div>
                </div>
                <p style="margin-top: 0.75rem;">When you write or speak, circle the form on your timeline before answering to stay intentional.</p>
            `,
            exercises: [
                {
                    id: "history-check",
                    title: "Timeline Check",
                    instructions: "Match the sentence to the right spot on the timeline.",
                    items: [
                        {
                            type: "radio",
                            label: "I decided to attend the community health fair.",
                            options: [
                                { value: "routine", label: "Routine" },
                                { value: "intention", label: "Intention" },
                            ],
                            expectedAnswer: "intention",
                        },
                        {
                            type: "radio",
                            label: "After stretching, I feel strong.",
                            options: [
                                { value: "routine", label: "Routine" },
                                { value: "transition", label: "Transition" },
                                { value: "intention", label: "Intention" },
                            ],
                            expectedAnswer: "routine",
                        },
                    ],
                },
            ],
        },
        {
            id: "practice",
            stepNumber: 4,
            title: "Practice: Mix & Match",
            icon: "🎤",
            explanation: `
                <p>Use sentence frames: “I always ___ (gerund) when I…” vs “I am trying ___ (infinitive) before the next shuttle.” Work in pairs to explain your choice.</p>
            `,
            exercises: [
                {
                    id: "mix-practice-1",
                    title: "Pair Practice",
                    instructions: "Rebuild each sentence with the best form.",
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
            tipBox: {
                title: "🌟 Level Up",
                content: "Stretch: Rewrite each sentence with a mini explanation (why this form?) before sharing with a partner.",
            },
        },
    ],
};
