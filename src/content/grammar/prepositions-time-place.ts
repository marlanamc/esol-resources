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
                <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem">
                    <p style="margin-bottom: 0.4rem">Prepositions glue verbs to places and times. Use them to give clear directions, schedule appointments, or describe neighborhoods.</p>
                    <p style="margin: 0">Think: at for exact points, on for days/surfaces, in for months/areas, during for ranges, and from…to for spans.</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem">
                    <div class="gc-callout-amber" style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(251, 191, 36, 0.08); ">
                        <p style="margin: 0; font-weight: 600">Housing</p>
                        <p style="margin: 0">“We moved in on January 6,” “Meet the landlord at the office.”</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb">
                        <p style="margin: 0; font-weight: 600">Jobs</p>
                        <p style="margin: 0">“I work from 9 to 5,” “Arrive at the cafe before breakfast.”</p>
                    </div>
                    <div class="gc-callout-red" style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(248, 113, 113, 0.08); ">
                        <p style="margin: 0; font-weight: 600">Health</p>
                        <p style="margin: 0">“During April, I follow the clinic schedule.”</p>
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
                <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem">
                    <tr><th style="border: 1px solid #e5e7eb; padding: 0.4rem">Preposition</th><th style="border: 1px solid #e5e7eb; padding: 0.4rem">Use</th><th style="border: 1px solid #e5e7eb; padding: 0.4rem">Example</th></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem">at</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">exact time/point</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">at 6:00 PM</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem">on</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">day/date</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">on Tuesday</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem">in</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">month/part of day</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">in January, in the morning</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem">during</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">range</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">during spring break</td></tr>
                    <tr><td style="border: 1px solid #e5e7eb; padding: 0.4rem">from…to</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">start + end</td><td style="border: 1px solid #e5e7eb; padding: 0.4rem">from 9 to 5</td></tr>
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
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 0.5rem">
                    <div style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(16, 185, 129, 0.08); border-left: 4px solid #059669">
                        <p style="margin: 0; font-weight: 600">At</p>
                        <p style="margin: 0">The shuttle stops at the community center.</p>
                    </div>
                    <div style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb">
                        <p style="margin: 0; font-weight: 600">In</p>
                        <p style="margin: 0">The apartment is in the third floor.</p>
                    </div>
                    <div class="gc-callout-red" style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(248, 113, 113, 0.08); ">
                        <p style="margin: 0; font-weight: 600">On</p>
                        <p style="margin: 0">We leave on the sidewalk near the bakery.</p>
                    </div>
                    <div class="gc-callout-amber" style="padding: 0.6rem; border-radius: 0.5rem; background: rgba(251, 191, 36, 0.08); ">
                        <p style="margin: 0; font-weight: 600">Near / Between</p>
                        <p style="margin: 0">Near Maverick Square, between the clinic and the park.</p>
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
                <p style="margin-top: 0.5rem">Example: "Walk toward the library, go through the lobby, then cross the plaza."</p>
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
                                { value: "between", label: "between" },
                                { value: "through", label: "through" },
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
                <p style="margin-top: 0.5rem">Create a mini-dialogue using the preposition that belongs naturally with each verb.</p>
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
                                { value: "on", label: "on" },
                                { value: "at", label: "at" },
                                { value: "in", label: "in" },
                            ],
                            expectedAnswer: "at",
                        },
                        {
                            type: "radio",
                            label: "She applied ___ a job program last week.",
                            options: [
                                { value: "at", label: "at" },
                                { value: "to", label: "to" },
                                { value: "for", label: "for" },
                            ],
                            expectedAnswer: "for",
                        },
                    ],
                },
            ],
        },
        {
            id: "mini-quiz",
            title: "📝 Mini Quiz: Prepositions Mastery",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem">
                    <h3 style="margin-top: 0; color: #2563eb">Test Your Prepositions Knowledge!</h3>
                    <p style="margin-bottom: 0">This quick quiz covers time and place prepositions. Choose the best preposition for each sentence.</p>
                </div>
            `,
            exercises: [
                {
                    id: "prep-quiz-1",
                    title: "Quiz Question 1",
                    instructions: "Choose the correct time preposition.",
                    items: [
                        {
                            type: "radio",
                            label: "My appointment is ___ Friday morning.",
                            options: [
                                { value: "on", label: "on" },
                                { value: "at", label: "at" },
                                { value: "in", label: "in" },
                            ],
                            expectedAnswer: "on",
                        },
                    ],
                },
                {
                    id: "prep-quiz-2",
                    title: "Quiz Question 2", 
                    instructions: "Choose the correct time preposition.",
                    items: [
                        {
                            type: "radio",
                            label: "I work ___ 9 AM ___ 5 PM.",
                            options: [
                                { value: "at-on", label: "at / on" },
                                { value: "from-to", label: "from / to" },
                                { value: "at-to", label: "at / to" },
                            ],
                            expectedAnswer: "from-to",
                        },
                    ],
                },
                {
                    id: "prep-quiz-3",
                    title: "Quiz Question 3",
                    instructions: "Choose the correct place preposition.",
                    items: [
                        {
                            type: "radio",
                            label: "The library is ___ Central Square.",
                            options: [
                                { value: "at", label: "at" },
                                { value: "on", label: "on" },
                                { value: "in", label: "in" },
                            ],
                            expectedAnswer: "in",
                        },
                    ],
                },
                {
                    id: "prep-quiz-4",
                    title: "Quiz Question 4",
                    instructions: "Choose the correct place preposition.",
                    items: [
                        {
                            type: "radio",
                            label: "We live ___ the community center.",
                            options: [
                                { value: "near", label: "near" },
                                { value: "at", label: "at" },
                                { value: "on", label: "on" },
                            ],
                            expectedAnswer: "near",
                        },
                    ],
                },
                {
                    id: "prep-quiz-5",
                    title: "Quiz Question 5",
                    instructions: "Choose the correct combination.",
                    items: [
                        {
                            type: "radio",
                            label: "I'm waiting ___ the bus ___ the station.",
                            options: [
                                { value: "to-on", label: "to / on" },
                                { value: "for-at", label: "for / at" },
                                { value: "at-in", label: "at / in" },
                            ],
                            expectedAnswer: "for-at",
                        },
                    ],
                },
            ],
        },
    ],
    // Mini Quiz for diagnostics (16 questions)
    miniQuiz: [
        {
            id: "quiz-1",
            question:
                "My appointment is ___ Friday morning.",
            options: [
                { value: "at", label: "at" },
                { value: "in", label: "in" },
                { value: "on", label: "on" },
            ],
            correctAnswer: "on",
            explanation:
                "We use 'on' for days and dates: on Friday, on July 4, on Monday morning.",
            skillTag: "time-on-day-date",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question:
                "I work ___ 9 AM ___ 5 PM.",
            options: [
                { value: "from-to", label: "from / to" },
                { value: "at-on", label: "at / on" },
                { value: "at-to", label: "at / to" },
            ],
            correctAnswer: "from-to",
            explanation:
                "Use 'from...to...' to show a time range: I work from 9 to 5.",
            skillTag: "time-from-to-range",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question:
                "The class starts ___ 6:30 PM.",
            options: [
                { value: "on", label: "on" },
                { value: "at", label: "at" },
                { value: "in", label: "in" },
            ],
            correctAnswer: "at",
            explanation:
                "Use 'at' for exact clock times: at 6:30 PM.",
            skillTag: "time-at-clock-time",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question:
                "My son was born ___ January.",
            options: [
                { value: "at", label: "at" },
                { value: "on", label: "on" },
                { value: "in", label: "in" },
            ],
            correctAnswer: "in",
            explanation:
                "Use 'in' for months, years, and seasons: in January, in 2020, in the summer.",
            skillTag: "time-in-month-season",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question:
                "The clinic is very busy ___ the winter.",
            options: [
                { value: "during", label: "during" },
                { value: "in", label: "in" },
                { value: "at", label: "at" },
            ],
            correctAnswer: "during",
            explanation:
                "Use 'during' to focus on what happens in a whole period: during the winter, during the summer.",
            skillTag: "time-during-period",
            difficulty: "medium",
        },
        {
            id: "quiz-6",
            question:
                "I usually study English ___ the evening after work.",
            options: [
                { value: "at", label: "at" },
                { value: "in", label: "in" },
                { value: "on", label: "on" },
            ],
            correctAnswer: "in",
            explanation:
                "Use 'in' for parts of the day: in the morning, in the afternoon, in the evening.",
            skillTag: "time-in-part-of-day",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question:
                "The library is ___ Central Square.",
            options: [
                { value: "at", label: "at" },
                { value: "on", label: "on" },
                { value: "in", label: "in" },
            ],
            correctAnswer: "in",
            explanation:
                "Use 'in' for neighborhoods, cities, and squares: in East Boston, in Central Square.",
            skillTag: "place-in-neighborhood-area",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question:
                "The shuttle stops ___ the East Boston community center.",
            options: [
                { value: "at", label: "at" },
                { value: "in", label: "in" },
                { value: "on", label: "on" },
            ],
            correctAnswer: "at",
            explanation:
                "'At' is used for specific points and buildings: at the bus stop, at the community center.",
            skillTag: "place-at-specific-point-building",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question:
                "The apartment is ___ the third floor.",
            options: [
                { value: "in", label: "in" },
                { value: "on", label: "on" },
                { value: "at", label: "at" },
            ],
            correctAnswer: "on",
            explanation:
                "We say 'on the third floor' for levels of a building.",
            skillTag: "place-on-floor-level",
            difficulty: "easy",
        },
        {
            id: "quiz-10",
            question:
                "We live ___ the community center, so we can walk there.",
            options: [
                { value: "at", label: "at" },
                { value: "on", label: "on" },
                { value: "near", label: "near" },
            ],
            correctAnswer: "near",
            explanation:
                "'Near' shows that something is close but not inside or exactly at the place.",
            skillTag: "place-near-landmark",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question:
                "The job center is ___ the park and the bakery.",
            options: [
                { value: "between", label: "between" },
                { value: "across", label: "across" },
                { value: "through", label: "through" },
            ],
            correctAnswer: "between",
            explanation:
                "Use 'between' with two places: between the park and the bakery.",
            skillTag: "place-between-two-places",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question:
                "Walk ___ the tunnel and turn left at the stairs.",
            options: [
                { value: "toward", label: "toward" },
                { value: "through", label: "through" },
                { value: "between", label: "between" },
            ],
            correctAnswer: "through",
            explanation:
                "'Through' is used when you go inside a space from one side to the other (through the tunnel, through the park).",
            skillTag: "direction-through-enclosed-space",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question:
                "The clinic is ___ the street from the blue apartment building.",
            options: [
                { value: "between", label: "between" },
                { value: "in", label: "in" },
                { value: "across", label: "across" },
            ],
            correctAnswer: "across",
            explanation:
                "'Across (the street) from' means it is on the other side of the street.",
            skillTag: "place-across-from-landmark",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question:
                "I am waiting ___ the bus ___ the station.",
            options: [
                { value: "for-at", label: "for / at" },
                { value: "to-on", label: "to / on" },
                { value: "at-in", label: "at / in" },
            ],
            correctAnswer: "for-at",
            explanation:
                "We say 'wait for' something or someone and 'at' a specific place: waiting for the bus at the station.",
            skillTag: "verb-prep-wait-for-at-place",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question:
                "She applied ___ a job program ___ the community center.",
            options: [
                { value: "to-in", label: "to / in" },
                { value: "for-at", label: "for / at" },
                { value: "for-in", label: "for / in" },
            ],
            correctAnswer: "for-at",
            explanation:
                "We use 'apply for' a program or job and 'at' for the specific place: applied for a job program at the community center.",
            skillTag: "verb-prep-apply-for-at",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question:
                "They arrived ___ East Boston ___ 2019.",
            options: [
                { value: "at-on", label: "at / on" },
                { value: "in-on", label: "in / on" },
                { value: "in-in", label: "in / in" },
            ],
            correctAnswer: "in-in",
            explanation:
                "We usually say 'arrive in' for a city or neighborhood and 'in' for a year: arrived in East Boston in 2019.",
            skillTag: "verb-prep-arrive-in-place-time",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Prepositions of Time & Place Mini Quiz

    This mini quiz checks whether students can:
    - Choose the correct preposition for time: at, on, in, during, from...to.
    - Choose the correct preposition for place: at, in, on, near, between, across.
    - Use prepositions for direction and movement in real East Boston contexts.
    - Use common verb + preposition combinations used in housing, jobs, and daily life.
    - Connect quiz items with the charts and examples from this guide.

    Skill tags:

    Time prepositions
    - time-on-day-date
    - time-from-to-range
    - time-at-clock-time
    - time-in-month-season
    - time-during-period
    - time-in-part-of-day

    Place prepositions
    - place-in-neighborhood-area
    - place-at-specific-point-building
    - place-on-floor-level
    - place-near-landmark
    - place-between-two-places
    - place-across-from-landmark

    Direction and movement
    - direction-through-enclosed-space

    Verb + preposition combinations
    - verb-prep-wait-for-at-place
    - verb-prep-apply-for-at
    - verb-prep-arrive-in-place-time

    How to read the diagnostics:
    - If time preposition tags are weak (time-at-clock-time, time-on-day-date, time-in-month-season, time-during-period, time-from-to-range, time-in-part-of-day) →
      Rebuild the time chart from the guide:
      • AT = clock times and certain fixed expressions (at 3:30, at noon).
      • ON = days and dates (on Monday, on July 4).
      • IN = months, years, long periods, parts of the day (in May, in 2025, in the evening).
      • DURING = what happens in a period (during the winter, during my shift).
      • FROM...TO... = start and end of a range.
      Use real schedules (clinic, work, school) and have students write 3–4 true sentences about their week using these patterns.

    - If place preposition tags are weak (place-in-neighborhood-area, place-at-specific-point-building, place-on-floor-level, place-near-landmark, place-between-two-places, place-across-from-landmark) →
      Draw a simple East Boston map on the board:
      • Put a park, clinic, community center, bus stop, and a few buildings.
      Practice:
      • 'The clinic is in East Boston.' (area)
      • 'The bus stop is at the corner.' (point)
      • 'My apartment is on the third floor.' (level)
      • 'The bakery is near the station.' (close to)
      • 'The job center is between the park and the bakery.' (two places)
      • 'The clinic is across the street from the blue building.' (other side)
      Have students give directions to each other using these phrases.

    - If direction/movement tags are weak (direction-through-enclosed-space) →
      Practice short commands with arrows on the board:
      • Walk through the tunnel.
      • Go through the lobby.
      Contrast with 'toward' and 'across' if you have covered those: toward = general direction, across = from one side to another.

    - If verb + preposition tags are weak (verb-prep-wait-for-at-place, verb-prep-apply-for-at, verb-prep-arrive-in-place-time) →
      Build a verb + preposition mini-chart:
      • wait for the bus at the station.
      • apply for a job at the community center.
      • arrive in East Boston in 2019.
      Have students correct common errors:
      • wait the bus → wait for the bus.
      • apply to a job → apply for a job.
      • arrive to East Boston → arrive in East Boston.

    Suggested use:
    - Use this mini quiz after students work through the time and place sections and the verb + preposition section.
    - At the class level:
      • If time prepositions are red → slow down and use students' real schedules (work, school, childcare) to practice AT/ON/IN/DURING/FROM...TO...
      • If place prepositions are red → do more map and direction activities with local East Boston landmarks.
      • If verb + preposition tags are red → integrate quick 5-minute drills at the beginning of class, focusing on one or two verb + preposition pairs each day.
    */
};
