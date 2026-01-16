import type { InteractiveGuideContent } from "@/types/activity";

export const prepositionsTimePlaceContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "intro",
            title: "Prepositions of Time & Place for East Boston Living",
            icon: "🗺️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem;">
                    <p style="margin-bottom: 0.4rem;">Prepositions glue verbs to places and times. Use them to give clear directions, schedule appointments, or describe neighborhoods.</p>
                    <p style="margin: 0;">Think: at for exact points, on for days/surfaces, in for months/areas, during for ranges, and from…to for spans.</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(251, 191, 36, 0.08); border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; font-weight: 600;">Housing</p>
                        <p style="margin: 0;">“We moved in on January 6,” “Meet the landlord at the office.”</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb;">
                        <p style="margin: 0; font-weight: 600;">Jobs</p>
                        <p style="margin: 0;">“I work from 9 to 5,” “Arrive at the cafe before breakfast.”</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(248, 113, 113, 0.08); border-left: 4px solid #ef4444;">
                        <p style="margin: 0; font-weight: 600;">Health</p>
                        <p style="margin: 0;">“During April, I follow the clinic schedule.”</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "🕒 Quick Check",
                content: "Ask yourself: Is this a point (at), a day/date (on), or a month/area (in)? For ranges, use during or from...to.",
            },
        },
        {
            id: "time",
            stepNumber: 1,
            title: "Time Prepositions: at, on, in, during, from…to",
            icon: "⏰",
            explanation: `
                <p>Use <strong>at</strong> for exact times, <strong>on</strong> for days/dates, <strong>in</strong> for months or parts of the day, <strong>during</strong> for ranges, and <strong>from…to</strong> for start and end.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
                    <tr><th style="border: 1px solid #e5e7eb; padding: 0.4rem;">Preposition</th><th style="border: 1px solid #e5e7eb; padding: 0.4rem;">Use</th><th style="border: 1px solid #e5e7eb; padding: 0.4rem;">Example</th></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">at</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">exact time/point</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">at 6:00 PM</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">on</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">day/date</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">on Tuesday</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">in</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">month/part of day</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">in January, in the morning</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">during</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">range</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">during spring break</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">from…to</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">start + end</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem;">from 9 to 5</td></tr>
                </table>
            `,
            exercises: [
                {
                    id: "time-1",
                    title: "Fill in the Time Preposition",
                    instructions: "Which preposition fits best?",
                    items: [
                        {
                            type: "radio",
                            label: "We meet ___ Wednesday evenings.",
                            options: [
                                { value: "at", label: "at" },
                                { value: "on", label: "on" },
                                { value: "in", label: "in" },
                            ],
                            expectedAnswer: "on",
                        },
                        {
                            type: "radio",
                            label: "My doctor appointment is ___ 3:30 PM.",
                            options: [
                                { value: "on", label: "on" },
                                { value: "in", label: "in" },
                                { value: "at", label: "at" },
                            ],
                            expectedAnswer: "at",
                        },
                    ],
                },
            ],
        },
        {
            id: "place",
            stepNumber: 2,
            title: "Place Prepositions: at, in, on, near, between",
            icon: "📍",
            explanation: `
                <p>Use <strong>at</strong> for a point, <strong>in</strong> for enclosed spaces, and <strong>on</strong> for surfaces. <strong>Near</strong> and <strong>between</strong> show relationships with other places.</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;">
                    <div style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(16, 185, 129, 0.08); border-left: 4px solid #059669;">
                        <p style="margin: 0; font-weight: 600;">At</p>
                        <p style="margin: 0;">The shuttle stops at the community center.</p>
                    </div>
                    <div style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb;">
                        <p style="margin: 0; font-weight: 600;">In</p>
                        <p style="margin: 0;">The apartment is in the third floor.</p>
                    </div>
                    <div style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(248, 113, 113, 0.08); border-left: 4px solid #ef4444;">
                        <p style="margin: 0; font-weight: 600;">On</p>
                        <p style="margin: 0;">We leave on the sidewalk near the bakery.</p>
                    </div>
                    <div style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(251, 191, 36, 0.08); border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; font-weight: 600;">Near / Between</p>
                        <p style="margin: 0;">Near Maverick Square, between the clinic and the park.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "place-1",
                    title: "Choose the Place Preposition",
                    instructions: "Pick the best preposition for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "The shuttle stops ___ the East Boston community center.",
                            options: [
                                { value: "at", label: "at" },
                                { value: "in", label: "in" },
                                { value: "on", label: "on" },
                            ],
                            expectedAnswer: "at",
                        },
                        {
                            type: "radio",
                            label: "The apartment is ___ the third floor.",
                            options: [
                                { value: "in", label: "in" },
                                { value: "on", label: "on" },
                                { value: "at", label: "at" },
                            ],
                            expectedAnswer: "on",
                        },
                    ],
                },
            ],
        },
        {
            id: "direction",
            stepNumber: 3,
            title: "Direction & Movement",
            icon: "🧭",
            explanation: `
                <p>Use <strong>toward</strong> for movement in a direction, <strong>through</strong> for passing inside, <strong>across</strong> for moving side to side, and <strong>between</strong> when mentioning two landmarks.</p>
                <p style="margin-top: 0.5rem;">Example: "Walk toward the library, go through the lobby, then cross the plaza."</p>
            `,
            exercises: [
                {
                    id: "direction-1",
                    title: "Direction Practice",
                    instructions: "Select the correct preposition to describe movement.",
                    items: [
                        {
                            type: "radio",
                            label: "Walk ___ the community market and turn right.",
                            options: [
                                { value: "toward", label: "toward" },
                                { value: "through", label: "through" },
                                { value: "between", label: "between" },
                            ],
                            expectedAnswer: "through",
                        },
                        {
                            type: "radio",
                            label: "The job center is ___ the park and the bakery.",
                            options: [
                                { value: "between", label: "between" },
                                { value: "across", label: "across" },
                                { value: "toward", label: "toward" },
                            ],
                            expectedAnswer: "between",
                        },
                    ],
                },
            ],
        },
        {
            id: "verb-prep",
            stepNumber: 4,
            title: "Verbs + Prepositions for Natural Sentences",
            icon: "🗣️",
            explanation: `
                <p>Some verbs prefer specific prepositions: "arrive at the office," "arrive in East Boston," "wait for the shuttle," "look for work." Pair verbs and prepositions to avoid awkward combinations.</p>
                <p style="margin-top: 0.5rem;">Create a mini-dialogue using the preposition that belongs naturally with each verb.</p>
            `,
            exercises: [
                {
                    id: "verb-prep-1",
                    title: "Verb + Preposition Match",
                    instructions: "Which preposition fits best with the verb?",
                    items: [
                        {
                            type: "radio",
                            label: "I am waiting ___ the doctor's office.",
                            options: [
                                { value: "at", label: "at" },
                                { value: "on", label: "on" },
                                { value: "in", label: "in" },
                            ],
                            expectedAnswer: "at",
                        },
                        {
                            type: "radio",
                            label: "She applied ___ a job program last week.",
                            options: [
                                { value: "for", label: "for" },
                                { value: "at", label: "at" },
                                { value: "to", label: "to" },
                            ],
                            expectedAnswer: "for",
                        },
                    ],
                },
            ],
        },
    ],
};
