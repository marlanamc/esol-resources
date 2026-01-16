import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsContinuumContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "intro",
            title: "Conditionals Continuum: Routine, Plans, and Imagining Better",
            icon: "✨",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem;">
                    <p style="margin-bottom: 0.4rem;">Conditionals link steps in your life: routines, future plans, or imagined what-ifs. Use them in housing updates, job planning, or health check-ins so listeners know the timeline.</p>
                    <p style="margin: 0;">Zero = facts. First/Future = goals. Second/Third = dreams or lessons learned. Keep the continuum in mind when you speak or write.</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(251, 191, 36, 0.08); border-left: 4px solid #f59e0b;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">Zero Conditional</p>
                        <p style="margin: 0;">Facts or routines, e.g., "If I heat water, it boils."</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">First / Future</p>
                        <p style="margin: 0;">Real plans, promises, deadlines.</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(239, 68, 68, 0.08); border-left: 4px solid #dc2626;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">Second / Third</p>
                        <p style="margin: 0;">Imagined situations or reflections.</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "🗣️ Why It Matters",
                content: "Clear conditionals keep community goals, job interviews, and health plans in order. Frame your thoughts along the timeline before speaking.",
            },
        },
        {
            id: "zero-first",
            stepNumber: 1,
            title: "Zero, First & Future: Routine to Real Possibility",
            icon: "🔄",
            explanation: `
                <div style="background: rgba(59, 130, 246, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #2563eb;">
                    <h4 style="margin-top: 0; margin-bottom: 0.4rem;">Zero</h4>
                    <p style="margin: 0;">Present simple in both clauses: habits and facts. "If I visit the East Boston kitchen, I bring snacks."</p>
                </div>
                <div style="background: rgba(16, 185, 129, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #059669; margin-top: 0.8rem;">
                    <h4 style="margin-top: 0; margin-bottom: 0.4rem;">First / Future</h4>
                    <p style="margin: 0;">Present simple + will for choices you can still make and promises with deadlines: "If I finish the resume, I will submit it by Thursday."</p>
                </div>
                <p style="margin-top: 0.75rem;">Think: zero = what always happens, first/future = what you can control before the deadline.</p>
            `,
            exercises: [
                {
                    id: "zero-first-1",
                    title: "Match the Meaning",
                    instructions: "Choose whether the sentence describes a zero or first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "If water gets cold, it freezes.",
                            options: [
                                { value: "zero", label: "Zero (routine/fact)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "If I rehearse the presentation, I will feel confident.",
                            options: [
                                { value: "zero", label: "Zero (routine/fact)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "first",
                        },
                    ],
                },
                {
                    id: "zero-first-2",
                    title: "Complete the Sentence",
                    instructions: "Fill in the blank with the correct first conditional verb.",
                    items: [
                        {
                            type: "radio",
                            label: "If I get hired, I ___ bring my ID to the meeting.",
                            options: [
                                { value: "will", label: "will" },
                                { value: "would", label: "would" },
                            ],
                            expectedAnswer: "will",
                        },
                    ],
                },
                {
                    id: "zero-first-3",
                    title: "Future Conditional Check",
                    instructions: "Pick the sentence that matches a future promise with will.",
                    items: [
                        {
                            type: "radio",
                            label: "If we finish the application, we will call the employer before Friday.",
                            options: [
                                { value: "future", label: "Future conditional (will)" },
                                { value: "zero", label: "Zero conditional (routine)" },
                            ],
                            expectedAnswer: "future",
                        },
                    ],
                },
            ],
        },
        {
            id: "continuum-diagram",
            stepNumber: 2,
            title: "Conditional Roadmap",
            icon: "🗺️",
            explanation: `
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.5rem;">
                    <div style="flex: 1 1 200px; border-radius: 0.5rem; background: rgba(251, 191, 36, 0.08); padding: 0.75rem; border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; font-weight: 600;">Zero</p>
                        <p style="margin: 0;">Routine facts</p>
                    </div>
                    <div style="flex: 1 1 200px; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); padding: 0.75rem; border-left: 4px solid #2563eb;">
                        <p style="margin: 0; font-weight: 600;">First</p>
                        <p style="margin: 0;">Jobs + opportunities</p>
                    </div>
                    <div style="flex: 1 1 200px; border-radius: 0.5rem; background: rgba(14, 165, 233, 0.08); padding: 0.75rem; border-left: 4px solid #0ea5e9;">
                        <p style="margin: 0; font-weight: 600;">Future</p>
                        <p style="margin: 0;">Promises with deadlines</p>
                    </div>
                    <div style="flex: 1 1 200px; border-radius: 0.5rem; background: rgba(239, 68, 68, 0.08); padding: 0.75rem; border-left: 4px solid #dc2626;">
                        <p style="margin: 0; font-weight: 600;">Second</p>
                        <p style="margin: 0;">Imagined goals</p>
                    </div>
                    <div style="flex: 1 1 200px; border-radius: 0.5rem; background: rgba(16, 185, 129, 0.08); padding: 0.75rem; border-left: 4px solid #059669;">
                        <p style="margin: 0; font-weight: 600;">Third</p>
                        <p style="margin: 0;">Lessons from the past</p>
                    </div>
                </div>
                <p style="margin-top: 0.75rem;">Trace where each sentence fits on the roadmap before you speak. That keeps workplace plans, health goals, and community commitments clear.</p>
            `,
        },
        {
            id: "second-third",
            stepNumber: 3,
            title: "Second & Third: Imagining and Reflecting",
            icon: "🌠",
            explanation: `
                <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #dc2626;">
                    <h4 style="margin-top: 0; margin-bottom: 0.4rem;">Second Conditional</h4>
                    <p style="margin: 0;">Past simple + would/could/might to dream about improvements: "If I spoke more English, I would apply for more jobs."</p>
                </div>
                <div style="background: rgba(14, 165, 233, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #0ea5e9; margin-top: 0.8rem;">
                    <h4 style="margin-top: 0; margin-bottom: 0.4rem;">Third Conditional</h4>
                    <p style="margin: 0;">Past perfect + would have/could have/might have to reflect on past choices. "If I had known about the training, I would have signed up earlier."</p>
                </div>
                <p style="margin-top: 0.75rem;">Use these to describe dreams, advocate for future supports, or explain lessons the community has learned.</p>
            `,
            exercises: [
                {
                    id: "second-1",
                    title: "Rewrite with Would",
                    instructions: "Change the sentence to second conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "I don’t have childcare, so I can’t apply for the day shift.",
                            options: [
                                { value: "If I had childcare, I would apply for the day shift.", label: "Option A" },
                                { value: "If I have childcare, I will apply for the day shift.", label: "Option B" },
                            ],
                            expectedAnswer: "If I had childcare, I would apply for the day shift.",
                        },
                    ],
                },
                {
                    id: "third-1",
                    title: "Third Conditional Reflection",
                    instructions: "Pick the sentence that correctly uses a third conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "If I had known about the class, I would have registered earlier.",
                            options: [
                                { value: "correct", label: "Correct (past perfect + would have)" },
                                { value: "incorrect", label: "Incorrect" },
                            ],
                            expectedAnswer: "correct",
                        },
                    ],
                },
            ],
        },
        {
            id: "modals",
            stepNumber: 4,
            title: "Mixing Modals and Conditionals",
            icon: "🧩",
            explanation: `
                <div style="background: rgba(59, 130, 246, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #2563eb;">
                    <p style="margin: 0; font-weight: 600;">First & Future</p>
                    <p style="margin: 0;">Pair with can/should/might to show ability, advice, or probability.</p>
                </div>
                <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #dc2626; margin-top: 0.75rem;">
                    <p style="margin: 0; font-weight: 600;">Second & Third</p>
                    <p style="margin: 0;">Use would/could/might have for imagined outcomes or reflections.</p>
                </div>
                <p style="margin-top: 0.75rem;">Practice adding modals to soften or strengthen your statements about work or community goals.</p>
            `,
            exercises: [
                {
                    id: "modals-1",
                    title: "Complete the Conditional",
                    instructions: "Use the modal in parentheses.",
                    items: [
                        {
                            type: "radio",
                            label: "If I talk to the supervisor, I ___ (should) ask about night classes.",
                            options: [
                                { value: "should", label: "should" },
                                { value: "would", label: "would" },
                            ],
                            expectedAnswer: "should",
                        },
                        {
                            type: "radio",
                            label: "If I had finished the paperwork, I ___ (could) start next week.",
                            options: [
                                { value: "could", label: "could" },
                                { value: "will", label: "will" },
                            ],
                            expectedAnswer: "could",
                        },
                    ],
                },
            ],
        },
        {
            id: "review",
            stepNumber: 5,
            title: "Review Checklist",
            icon: "✅",
            explanation: `
                <div style="background: rgba(16, 185, 129, 0.08); padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #059669;">
                    <p style="margin: 0;"><strong>Checklist</strong></p>
                    <ol style="margin: 0.5rem 0 0 1.2rem; padding: 0;">
                        <li>Did we identify routine, promise, or imagined outcome?</li>
                        <li>Is the verb form correct (present simple, past simple, past perfect)?</li>
                        <li>Did we add a modal to change tone?</li>
                    </ol>
                </div>
                <p style="margin-top: 0.75rem;">Use this checklist before your next job planning conversation, health update, or community reflection.</p>
            `,
        },
    ],
};
