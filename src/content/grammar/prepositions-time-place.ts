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
                <p>Prepositions help us say when and where things happen. With the spring themes of housing, jobs, and health, choosing the right preposition keeps your directions and schedules clear.</p>
                <p>Think of prepositions as the glue between verbs and the places, days, or times you describe.</p>
            `,
        },
        {
            id: "time",
            stepNumber: 1,
            title: "Time Prepositions: at, on, in, during, from…to",
            icon: "⏰",
            explanation: `
                <p>Use <strong>at</strong> for exact times (at 6:00 PM), <strong>on</strong> for days and dates (on Tuesdays, on March 5), and <strong>in</strong> for months or parts of the day (in January, in the morning).</p>
                <p><strong>During</strong> focuses on a range (during spring break), <strong>from…to</strong> shows a start and end time.</p>
                <ul>
                    <li>At the housing fair, we meet at 6:00 PM.</li>
                    <li>On Thursdays, we practice workplace conversations.</li>
                    <li>In April, I see my doctor for check-ups.</li>
                </ul>
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
                <p>Use <strong>at</strong> for a point (at the corner, at the station), <strong>in</strong> for enclosed spaces (in the apartment, in the community center), and <strong>on</strong> for surfaces (on the second floor, on the sidewalk).</p>
                <p><strong>Near</strong> and <strong>between</strong> show relationships with other places (“near Maverick Square,” “between the clinic and the park”).</p>
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
                <p>Use <strong>toward</strong> when you move in the direction of something, <strong>through</strong> for passing inside, <strong>across</strong> for moving from one side to the other, and <strong>between</strong> when you talk about two landmarks.</p>
                <p>Example: “Walk toward the library, go through the lobby, and then cross the plaza.”</p>
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
                <p>Some verbs prefer specific prepositions: “arrive at the office,” “arrive in East Boston,” “wait for the shuttle,” “look for work.” Pair verbs and prepositions to avoid awkward combinations.</p>
                <p>Create a mini-dialogue using the preposition that belongs naturally with each verb.</p>
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
