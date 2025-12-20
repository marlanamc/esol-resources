import type { InteractiveGuideContent } from "@/types/activity";

export const informationQuestionsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Information Questions: Getting the Answers You Need",
            icon: "❓",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"When does the lease start?" "How much is the security deposit?" "Who do I call for repairs?" Real life requires real questions - and knowing how to ask them correctly can make all the difference.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Information questions (also called WH-questions) help you:</p>
                <ul>
                    <li><strong>Get crucial information</strong> - About housing, jobs, healthcare, your rights</li>
                    <li><strong>Advocate for yourself</strong> - Ask follow-up questions when you don't understand</li>
                    <li><strong>Sound professional</strong> - In interviews, meetings, and important conversations</li>
                    <li><strong>Avoid misunderstandings</strong> - Clarify details before it's too late</li>
                </ul>
            `,
            exercises: [
                {
                    id: "infoq-intro-1",
                    title: "Quick Check: Pick the Best Question Word",
                    instructions: "Choose the best WH-word for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "You want to know the price of the rent. _____ is the rent?",
                            options: ["Who", "What", "When", "Where", "Why", "How much", "How many"],
                            expectedAnswer: "How much",
                        },
                        {
                            type: "select",
                            label: "You want to know the person responsible for repairs. _____ do I call for repairs?",
                            options: ["Who", "What", "When", "Where", "Why", "How", "How many"],
                            expectedAnswer: "Who",
                        },
                    ],
                },
            ],
        },

        // WH-Words Overview
        {
            id: "wh-words-overview",
            stepNumber: 1,
            title: "The Question Words: Who, What, When, Where, Why, How",
            icon: "🔍",
            explanation: `
                <h3>The Six Essential Question Words</h3>
                <p>Each question word asks for a different type of information. Knowing which one to use helps you get the exact answer you need.</p>
            `,
            exercises: [
                {
                    id: "infoq-wh-1",
                    title: "Practice: Match the Question Word",
                    instructions: "Choose the best question word.",
                    items: [
                        {
                            type: "select",
                            label: "_____ is the bus stop? (location)",
                            options: ["Who", "What", "When", "Where", "Why", "How"],
                            expectedAnswer: "Where",
                        },
                        {
                            type: "select",
                            label: "_____ do you need this form? (reason)",
                            options: ["Who", "What", "When", "Where", "Why", "How"],
                            expectedAnswer: "Why",
                        },
                        {
                            type: "select",
                            label: "_____ can I contact maintenance? (method)",
                            options: ["Who", "What", "When", "Where", "Why", "How"],
                            expectedAnswer: "How",
                        },
                    ],
                },
            ],
            usageMeanings: [
                {
                    title: "👤 WHO = Person",
                    description: "Use 'who' to ask about people - their identity, role, or responsibility",
                    examples: [
                        {
                            sentence: "<strong>Who</strong> is the landlord?",
                            explanation: "✓ Asking about a person's identity"
                        },
                        {
                            sentence: "<strong>Who</strong> should I ask about benefits?",
                            explanation: "✓ Asking which person has the information you need"
                        },
                        {
                            sentence: "<strong>Who</strong> do I report to at this job?",
                            explanation: "✓ Asking about a person's role/position"
                        },
                    ],
                },
                {
                    title: "📝 WHAT = Thing/Information/Action",
                    description: "Use 'what' to ask about things, information, actions, or details",
                    examples: [
                        {
                            sentence: "<strong>What</strong> time does the shift start?",
                            explanation: "✓ Asking for specific information (time)"
                        },
                        {
                            sentence: "<strong>What</strong> documents do I need?",
                            explanation: "✓ Asking about things (documents)"
                        },
                        {
                            sentence: "<strong>What</strong> are the building rules?",
                            explanation: "✓ Asking for details/information"
                        },
                    ],
                },
                {
                    title: "📅 WHEN = Time",
                    description: "Use 'when' to ask about time - days, dates, hours, deadlines",
                    examples: [
                        {
                            sentence: "<strong>When</strong> is rent due?",
                            explanation: "✓ Asking about a specific date/deadline"
                        },
                        {
                            sentence: "<strong>When</strong> do I start?",
                            explanation: "✓ Asking about start time/date"
                        },
                        {
                            sentence: "<strong>When</strong> can I move in?",
                            explanation: "✓ Asking about timing/availability"
                        },
                    ],
                },
                {
                    title: "📍 WHERE = Place/Location",
                    description: "Use 'where' to ask about locations, places, or positions",
                    examples: [
                        {
                            sentence: "<strong>Where</strong> do I park?",
                            explanation: "✓ Asking about a location"
                        },
                        {
                            sentence: "<strong>Where</strong> is the office?",
                            explanation: "✓ Asking about the position of a place"
                        },
                        {
                            sentence: "<strong>Where</strong> should I submit my application?",
                            explanation: "✓ Asking about a destination"
                        },
                    ],
                },
                {
                    title: "🤔 WHY = Reason/Explanation",
                    description: "Use 'why' to ask for reasons, explanations, or causes",
                    examples: [
                        {
                            sentence: "<strong>Why</strong> was I charged a fee?",
                            explanation: "✓ Asking for a reason/explanation"
                        },
                        {
                            sentence: "<strong>Why</strong> is the rent going up?",
                            explanation: "✓ Asking about the cause of a change"
                        },
                        {
                            sentence: "<strong>Why</strong> did the last tenant move out?",
                            explanation: "✓ Asking for background/context"
                        },
                    ],
                },
                {
                    title: "🔧 HOW = Method/Manner/Degree",
                    description: "Use 'how' to ask about the way something is done, or to what extent",
                    examples: [
                        {
                            sentence: "<strong>How</strong> do I pay rent?",
                            explanation: "✓ Asking about the method/process"
                        },
                        {
                            sentence: "<strong>How</strong> long is the commute?",
                            explanation: "✓ Asking about duration/extent"
                        },
                        {
                            sentence: "<strong>How</strong> can I contact you?",
                            explanation: "✓ Asking about the way/manner to do something"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Tip",
                content:
                    "All these words start with WH except 'how.' That's why we call them 'WH-questions' even though 'how' sneaks in there!",
            },
        },

        // How Much vs How Many
        {
            id: "how-much-how-many",
            stepNumber: 2,
            title: "How Much vs How Many: The Money Question",
            icon: "💰",
            explanation: `
                <h3>Two of the Most Important Questions</h3>
                <p>These questions come up constantly when discussing money, time, rent, and work. Getting them right makes you sound professional.</p>
            `,
            usageMeanings: [
                {
                    title: "🔢 HOW MANY = Count Nouns",
                    description: "Use 'how many' when asking about things you can count (plural nouns)",
                    examples: [
                        {
                            sentence: "<strong>How many hours</strong> per week do you work?",
                            explanation: "✓ Hours are countable (1 hour, 2 hours, 40 hours)"
                        },
                        {
                            sentence: "<strong>How many bedrooms</strong> does the apartment have?",
                            explanation: "✓ Bedrooms are countable units"
                        },
                        {
                            sentence: "<strong>How many vacation days</strong> do you get?",
                            explanation: "✓ Days are countable"
                        },
                        {
                            sentence: "<strong>How many employees</strong> work here?",
                            explanation: "✓ People/employees are countable"
                        },
                    ],
                },
                {
                    title: "💵 HOW MUCH = Non-Count Nouns",
                    description: "Use 'how much' when asking about amounts you can't count individually",
                    examples: [
                        {
                            sentence: "<strong>How much is</strong> the rent?",
                            explanation: "✓ Money/rent is uncountable (asking about amount)"
                        },
                        {
                            sentence: "<strong>How much is</strong> the security deposit?",
                            explanation: "✓ Money as a concept is uncountable"
                        },
                        {
                            sentence: "<strong>How much time</strong> do I have before the deadline?",
                            explanation: "✓ Time is uncountable (though hours/minutes are countable)"
                        },
                        {
                            sentence: "<strong>How much experience</strong> is required?",
                            explanation: "✓ Experience is uncountable"
                        },
                    ],
                },
                {
                    title: "💼 Essential Housing & Work Questions",
                    description: "The questions you'll actually use when apartment hunting or job searching",
                    examples: [
                        {
                            sentence: "<strong>How much</strong> is the rent per month?",
                            explanation: "✓ Rent = money = uncountable"
                        },
                        {
                            sentence: "<strong>How many</strong> people can live here?",
                            explanation: "✓ People = countable"
                        },
                        {
                            sentence: "<strong>How much</strong> notice do I need to give?",
                            explanation: "✓ Notice (time) = uncountable"
                        },
                        {
                            sentence: "<strong>How many</strong> sick days do I get?",
                            explanation: "✓ Days = countable"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Same rule as many/much from the last lesson! Can you count it (1, 2, 3...)? Use HOW MANY. Can't count it? Use HOW MUCH.",
            },
            exercises: [
                {
                    id: "ex-how-much-many-1",
                    title: "Practice: How Much or How Many?",
                    instructions:
                        "Choose the correct question word for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "___ does the apartment cost per month?",
                            options: [
                                { value: "how-many", label: "How many" },
                                { value: "how-much", label: "How much" },
                            ],
                            expectedAnswer: "how-much",
                        },
                        {
                            type: "radio",
                            label: "___ bedrooms does it have?",
                            options: [
                                { value: "how-many", label: "How many" },
                                { value: "how-much", label: "How much" },
                            ],
                            expectedAnswer: "how-many",
                        },
                        {
                            type: "radio",
                            label: "___ notice do I need to give before moving out?",
                            options: [
                                { value: "how-many", label: "How many" },
                                { value: "how-much", label: "How much" },
                            ],
                            expectedAnswer: "how-much",
                        },
                        {
                            type: "radio",
                            label: "___ people live in the building?",
                            options: [
                                { value: "how-many", label: "How many" },
                                { value: "how-much", label: "How much" },
                            ],
                            expectedAnswer: "how-many",
                        },
                    ],
                },
            ],
        },

        // Question Word Order
        {
            id: "question-word-order",
            stepNumber: 3,
            title: "Word Order: The Formula That Always Works",
            icon: "📐",
            explanation: `
                <h3>The Standard Question Pattern</h3>
                <p>Information questions follow a specific word order. Get this right, and your questions will always sound natural:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <div style="font-size: 1.25rem; text-align: center; margin-bottom: 1rem; font-weight: 600;">
                        WH-word + Auxiliary + Subject + Main Verb + ?
                    </div>
                    <p style="text-align: center; margin: 0; font-style: italic;">
                        (Question word) + (do/does/did/is/are/can) + (who/what) + (verb) + ?
                    </p>
                </div>

                <h4>Examples with Different Auxiliaries:</h4>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <p style="margin: 0; font-weight: 600;">Present Simple (do/does):</p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>When</strong> <span style="color: #d97757;">do</span> <span style="color: #3b82f6;">you</span> <span style="color: #22c55e;">pay</span> rent?</li>
                        <li><strong>Where</strong> <span style="color: #d97757;">does</span> <span style="color: #3b82f6;">the manager</span> <span style="color: #22c55e;">work</span>?</li>
                        <li><strong>How</strong> <span style="color: #d97757;">do</span> <span style="color: #3b82f6;">I</span> <span style="color: #22c55e;">contact</span> maintenance?</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <p style="margin: 0; font-weight: 600;">With 'be' (is/are/was/were):</p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Where</strong> <span style="color: #d97757;">is</span> <span style="color: #3b82f6;">the laundry room</span>?</li>
                        <li><strong>What</strong> <span style="color: #d97757;">are</span> <span style="color: #3b82f6;">the building rules</span>?</li>
                        <li><strong>When</strong> <span style="color: #d97757;">was</span> <span style="color: #3b82f6;">the building</span> <span style="color: #22c55e;">built</span>?</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <p style="margin: 0; font-weight: 600;">With modals (can/will/should):</p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>How</strong> <span style="color: #d97757;">can</span> <span style="color: #3b82f6;">I</span> <span style="color: #22c55e;">pay</span> the deposit?</li>
                        <li><strong>When</strong> <span style="color: #d97757;">will</span> <span style="color: #3b82f6;">you</span> <span style="color: #22c55e;">fix</span> the heater?</li>
                        <li><strong>Who</strong> <span style="color: #d97757;">should</span> <span style="color: #3b82f6;">I</span> <span style="color: #22c55e;">call</span> for emergencies?</li>
                    </ul>
                </div>
            `,
            formula: [
                { text: "WH-word", type: "other" },
                { text: "+", type: "other" },
                { text: "Auxiliary", type: "verb" },
                { text: "+", type: "other" },
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "Main Verb", type: "verb" },
                { text: "+", type: "other" },
                { text: "?", type: "other" },
            ],
            tipBox: {
                title: "💡 Common Mistake",
                content:
                    "Don't forget the auxiliary! ❌ 'Where you live?' → ✅ 'Where DO you live?' The auxiliary (do/does/did/is/are/can/will) is required in information questions.",
            },
            exercises: [
                {
                    id: "ex-word-order-1",
                    title: "Practice: Put Words in Order",
                    instructions:
                        "Rewrite each scrambled question in the correct order.",
                    items: [
                        {
                            type: "text",
                            label: "1. (rent / when / is / due / the) ?",
                            expectedAnswer: "When is the rent due?",
                        },
                        {
                            type: "text",
                            label: "2. (landlord / does / where / live / the) ?",
                            expectedAnswer: "Where does the landlord live?",
                        },
                        {
                            type: "text",
                            label: "3. (utilities / what / included / are) ?",
                            expectedAnswer: "What utilities are included?",
                        },
                        {
                            type: "text",
                            label: "4. (I / how / pay / can / rent) ?",
                            expectedAnswer: "How can I pay rent?",
                        },
                    ],
                },
            ],
        },

        // Subject vs Object Questions
        {
            id: "subject-object-questions",
            stepNumber: 4,
            title: "Subject Questions: When 'Who' and 'What' Break the Rules",
            icon: "⚡",
            explanation: `
                <h3>The Exception: No Auxiliary Needed!</h3>
                <p>When <strong>who</strong> or <strong>what</strong> is the subject of the sentence (the doer of the action), you DON'T use do/does/did:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Compare These Two Types:</h4>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">✓ Subject Question (who/what DOES the action):</p>
                        <ul style="margin: 0;">
                            <li><strong>Who</strong> pays the utilities? (No 'does'!)</li>
                            <li><strong>What</strong> includes heat and water? (No 'does'!)</li>
                            <li><strong>Who</strong> manages the building?</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">✓ Object Question (who/what RECEIVES the action):</p>
                        <ul style="margin: 0;">
                            <li><strong>Who</strong> do you pay? (Need 'do'!)</li>
                            <li><strong>What</strong> does the rent include? (Need 'does'!)</li>
                            <li><strong>Who</strong> should I call?</li>
                        </ul>
                    </div>
                </div>

                <h4>How to Tell the Difference:</h4>
                <p>Ask yourself: Is 'who' or 'what' doing the action, or receiving it?</p>
                <ul>
                    <li><strong>Doing:</strong> "Who broke the window?" (Someone broke it → subject question, no auxiliary)</li>
                    <li><strong>Receiving:</strong> "Who did you call?" (You called someone → object question, needs 'did')</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Quick Test",
                content:
                    "Can you answer with a simple subject? Then it's a subject question (no auxiliary). Example: 'Who manages the building?' → 'Maria does.' vs 'Who do you know?' → 'I know Maria.'",
            },
            exercises: [
                {
                    id: "ex-subject-object-1",
                    title: "Practice: Subject or Object Question?",
                    instructions:
                        "Choose the correct question form.",
                    items: [
                        {
                            type: "radio",
                            label: "___ lives in apartment 3B?",
                            options: [
                                { value: "who", label: "Who" },
                                { value: "who-does", label: "Who does" },
                                { value: "who-do", label: "Who do" },
                            ],
                            expectedAnswer: "who",
                        },
                        {
                            type: "radio",
                            label: "___ you contact for repairs?",
                            options: [
                                { value: "who", label: "Who" },
                                { value: "who-does", label: "Who does" },
                                { value: "who-do", label: "Who do" },
                            ],
                            expectedAnswer: "who-do",
                        },
                        {
                            type: "radio",
                            label: "___ pays for pest control?",
                            options: [
                                { value: "who", label: "Who" },
                                { value: "who-does", label: "Who does" },
                                { value: "who-do", label: "Who do" },
                            ],
                            expectedAnswer: "who",
                        },
                    ],
                },
            ],
        },

        // Housing Questions
        {
            id: "housing-questions",
            stepNumber: 5,
            title: "Essential Housing Questions: What to Ask Landlords",
            icon: "🏠",
            explanation: `
                <h3>Real Questions for Real Situations</h3>
                <p>These are the questions you actually need when looking for housing or dealing with landlords:</p>

                <div style="margin-top: 1.5rem;">
                    <div style="background: rgba(110, 145, 118, 0.05); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #7ba884;">
                        <h4 style="margin-top: 0;">About Money:</h4>
                        <ul style="margin: 0;">
                            <li>How much is the rent per month?</li>
                            <li>How much is the security deposit?</li>
                            <li>When is rent due?</li>
                            <li>What utilities are included?</li>
                            <li>How can I pay rent?</li>
                        </ul>
                    </div>

                    <div style="background: rgba(200, 107, 81, 0.05); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #d97757;">
                        <h4 style="margin-top: 0;">About the Apartment:</h4>
                        <ul style="margin: 0;">
                            <li>How many bedrooms does it have?</li>
                            <li>Where is parking?</li>
                            <li>What's included in the apartment?</li>
                            <li>When was it last renovated?</li>
                            <li>Where is the laundry?</li>
                        </ul>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.05); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="margin-top: 0;">About Rules & Repairs:</h4>
                        <ul style="margin: 0;">
                            <li>What are the building rules?</li>
                            <li>Who do I contact for repairs?</li>
                            <li>How much notice do I give before moving?</li>
                            <li>When can I move in?</li>
                            <li>Why did the last tenant move out?</li>
                        </ul>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-housing-1",
                    title: "Practice: Write Your Own Questions",
                    instructions:
                        "Complete these landlord interview questions with the correct WH-word.",
                    items: [
                        {
                            type: "text",
                            label: "1. ___ do I contact if the heat doesn't work?",
                            expectedAnswer: "Who",
                        },
                        {
                            type: "text",
                            label: "2. ___ is garbage collection day?",
                            expectedAnswer: "When",
                        },
                        {
                            type: "text",
                            label: "3. ___ can I park my car?",
                            expectedAnswer: "Where",
                        },
                        {
                            type: "text",
                            label: "4. ___ notice do I need to give before moving out?",
                            expectedAnswer: "How much",
                        },
                        {
                            type: "text",
                            label: "5. ___ is the rent going up next year?",
                            expectedAnswer: "Why",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Quick Reference: Information Questions Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>Question Words Quick Guide</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Question Word</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Asks About</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Who</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Person</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Who is the manager?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>What</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Thing/Information</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">What's included?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>When</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Time</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">When is rent due?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Where</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Place</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Where do I park?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Why</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Reason</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Why is rent increasing?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>How</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Method/Manner</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">How do I pay?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>How much</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Amount (non-count)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">How much is rent?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>How many</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Number (count)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">How many rooms?</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Standard Word Order</h3>
                <p><strong>WH-word + Auxiliary + Subject + Main Verb + ?</strong></p>
                <ul>
                    <li>Where <em>do</em> you live?</li>
                    <li>When <em>does</em> the lease start?</li>
                    <li>What <em>is</em> the deposit?</li>
                </ul>

                <h3>Exception: Subject Questions</h3>
                <p><strong>Who/What + Verb + ?</strong> (NO auxiliary when who/what is the subject)</p>
                <ul>
                    <li>Who pays utilities? (NOT: Who does pay...)</li>
                    <li>What includes parking? (NOT: What does include...)</li>
                </ul>

                <h3>Common Mistakes to Avoid:</h3>
                <ul>
                    <li>❌ "Where you live?" → ✅ "Where do you live?" (need auxiliary)</li>
                    <li>❌ "How much bedrooms?" → ✅ "How many bedrooms?" (bedrooms are countable)</li>
                    <li>❌ "Who does pay rent?" → ✅ "Who pays rent?" (subject question, no auxiliary)</li>
                    <li>❌ "What is the rent costs?" → ✅ "How much is the rent?" OR "What does the rent cost?"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Practice Tip",
                content:
                    "Next time you need to ask a question, pause and think: What information do I need? (Choose WH-word) → What's the auxiliary? (do/does/is/are/can) → Put them in order. With practice, it becomes automatic!",
            },
            exercises: [
                {
                    id: "infoq-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the correct question.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to ask about the due date of rent.",
                            options: [
                                { value: "a", label: "When is the rent due?" },
                                { value: "b", label: "When the rent is due?" },
                                { value: "c", label: "When is due the rent?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Subject question (no auxiliary):",
                            options: [
                                { value: "a", label: "Who pays utilities?" },
                                { value: "b", label: "Who does pay utilities?" },
                                { value: "c", label: "Who do pay utilities?" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "How much bedrooms does the apartment have?" },
                { value: "b", label: "How many bedrooms the apartment has?" },
                { value: "c", label: "How many bedrooms does the apartment have?" },
            ],
            correctAnswer: "c",
            explanation: "Bedrooms are countable (use 'how many'), and we need the auxiliary 'does' after the question word.",
        },
        {
            id: "quiz-2",
            question: "Choose the correct subject question:",
            options: [
                { value: "a", label: "Who does pay the utilities?" },
                { value: "b", label: "Who pays the utilities?" },
                { value: "c", label: "Who do pay the utilities?" },
            ],
            correctAnswer: "b",
            explanation: "This is a subject question ('Who' is doing the action of paying), so no auxiliary is needed.",
        },
        {
            id: "quiz-3",
            question: "Put the words in correct order: (rent / when / due / is / the)",
            options: [
                { value: "a", label: "When the rent is due?" },
                { value: "b", label: "When is the rent due?" },
                { value: "c", label: "When is due the rent?" },
            ],
            correctAnswer: "b",
            explanation: "Correct order: WH-word + auxiliary + subject + adjective/complement → When is the rent due?",
        },
        {
            id: "quiz-4",
            question: "Which question asks about a person?",
            options: [
                { value: "a", label: "What should I call for emergencies?" },
                { value: "b", label: "Who should I call for emergencies?" },
                { value: "c", label: "When should I call for emergencies?" },
            ],
            correctAnswer: "b",
            explanation: "'Who' asks about people. 'What' asks about things, and 'When' asks about time.",
        },
        {
            id: "quiz-5",
            question: "What's the correct question: 'I want to know the amount of the deposit.'",
            options: [
                { value: "a", label: "How much is the deposit?" },
                { value: "b", label: "How many is the deposit?" },
                { value: "c", label: "What many is the deposit?" },
            ],
            correctAnswer: "a",
            explanation: "Money/deposit is uncountable, so use 'how much' (not 'how many').",
        },
    ],
};
