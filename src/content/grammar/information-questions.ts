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

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>Throughout the course, you'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong> Asking your landlord questions (rent, repairs, rules)</li>
                        <li><strong> Preparing for job interviews (asking about the job, schedule, benefits)</li>
                        <li><strong> Asking about your rights at work</li>
                        <li><strong> Talking to your doctor (symptoms, medications, appointments)</li>
                        <li><strong> Getting information about community resources</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">✨ This is one of the MOST IMPORTANT grammar topics - that's why we practice it 6 times this course!</p>
                </div>
            `,
            exercises: [
                {
                    id: "infoq-intro-1",
                    title: "Quick Check: Pick the Best Question Word",
                    instructions: "Choose the best WH-word for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "You want to know the price of the utilities. _____ are the utilities?",
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
                    title: "🔢 HOW MANY = Countable Nouns",
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
                    title: "💵 HOW MUCH = Uncountable Nouns",
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
                        WH-word + Helping Verb + Subject + Main Verb + ?
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
                { text: "Helping Verb", type: "verb" },
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
                    "Don't forget the helping verb! ❌ 'Where you live?' → ✅ 'Where DO you live?' The helping verb (do/does/did/is/are/can/will) is required in information questions.",
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
                            label: "(rent / when / is / due / the) ?",
                            expectedAnswer: "When is the rent due?",
                        },
                        {
                            type: "text",
                            label: "(landlord / does / where / live / the) ?",
                            expectedAnswer: "Where does the landlord live?",
                        },
                        {
                            type: "text",
                            label: "(utilities / what / included / are) ?",
                            expectedAnswer: "What utilities are included?",
                        },
                        {
                            type: "text",
                            label: "(I / how / pay / can / rent) ?",
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
                <h3>The Exception: No Helping Verb Needed!</h3>
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
                    <li><strong>Doing:</strong> "Who broke the window?" (Someone broke it → subject question, no helping verb)</li>
                    <li><strong>Receiving:</strong> "Who did you call?" (You called someone → object question, needs 'did')</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Quick Test",
                content:
                    "Can you answer with a simple subject? Then it's a subject question (no helping verb). Example: 'Who manages the building?' → 'Maria does.' vs 'Who do you know?' → 'I know Maria.'",
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
                            label: "___ do I contact if the heat doesn't work?",
                            expectedAnswer: "Who",
                        },
                        {
                            type: "text",
                            label: "___ does the landlord call for repairs?",
                            expectedAnswer: "Who",
                        },
                        {
                            type: "text",
                            label: "___ is garbage collection day?",
                            expectedAnswer: "When",
                        },
                        {
                            type: "text",
                            label: "___ can I park my car?",
                            expectedAnswer: "Where",
                        },
                        {
                            type: "text",
                            label: "___ notice do I need to give before moving out?",
                            expectedAnswer: "How much",
                        },
                        {
                            type: "text",
                            label: "___ is the rent going up next year?",
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
                <p><strong>WH-word + Helping Verb + Subject + Main Verb + ?</strong></p>
                <ul>
                    <li>Where <em>do</em> you live?</li>
                    <li>When <em>does</em> the lease start?</li>
                    <li>What <em>is</em> the deposit?</li>
                </ul>

                <h3>Exception: Subject Questions</h3>
                <p><strong>Who/What + Verb + ?</strong> (NO helping verb when who/what is the subject)</p>
                <ul>
                    <li>Who pays utilities? (NOT: Who does pay...)</li>
                    <li>What includes parking? (NOT: What does include...)</li>
                </ul>

                <h3>Common Mistakes to Avoid:</h3>
                <ul>
                    <li>❌ "Where you live?" → ✅ "Where do you live?" (need helping verb)</li>
                    <li>❌ "How much bedrooms?" → ✅ "How many bedrooms?" (bedrooms are countable)</li>
                    <li>❌ "Who does pay rent?" → ✅ "Who pays rent?" (subject question, no helping verb)</li>
                    <li>❌ "What is the rent costs?" → ✅ "How much is the rent?" OR "What does the rent cost?"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Practice Tip",
                content:
                    "Next time you need to ask a question, pause and think: What information do I need? (Choose WH-word) → What's the helping verb? (do/does/is/are/can) → Put them in order. With practice, it becomes automatic!",
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
                            label: "Subject question (no helping verb):",
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

        // ADVANCED: Indirect Questions
        {
            id: "indirect-questions",
            stepNumber: 7,
            title: "Indirect Questions: Polite and Professional",
            icon: "💼",
            explanation: `
                <h3>Making Questions More Polite</h3>
                <p>Indirect questions are more polite and professional than direct questions. Instead of asking directly, you use phrases like "Could you tell me..." or "Do you know..."</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(122, 143, 124, 0.1); border-radius: 0.5rem;">
                    <h4>Compare Direct vs Indirect:</h4>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Direct (Less Polite):</p>
                        <ul style="margin: 0;">
                            <li>Where is the office?</li>
                            <li>What time does the interview start?</li>
                            <li>How much does this cost?</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">✓ Indirect (More Polite):</p>
                        <ul style="margin: 0;">
                            <li><strong>Could you tell me</strong> where the office <strong>is</strong>? (not "is the office")</li>
                            <li><strong>Do you know</strong> what time the interview <strong>starts</strong>? (not "does start")</li>
                            <li><strong>I was wondering</strong> how much this <strong>costs</strong>? (not "does cost")</li>
                        </ul>
                    </div>
                </div>

                <h4>The Formula Changes!</h4>
                <p>In indirect questions, the word order becomes like a statement (Subject + Verb), NOT like a question:</p>
                <ul>
                    <li>Direct: Where <strong>is</strong> the office? (Verb + Subject)</li>
                    <li>Indirect: Could you tell me where the office <strong>is</strong>? (Subject + Verb)</li>
                </ul>

                <h4>Common Indirect Question Phrases:</h4>
                <ul>
                    <li>Could you tell me...?</li>
                    <li>Do you know...?</li>
                    <li>Can you explain...?</li>
                    <li>Would you mind telling me...?</li>
                    <li>I was wondering...?</li>
                    <li>I'd like to know...?</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Why Use Indirect Questions?",
                content:
                    "Use indirect questions when: (1) Talking to your boss or doctor, (2) Asking for sensitive information (salary, rent cost), (3) You don't know the person well. They sound more respectful!",
            },
            exercises: [
                {
                    id: "ex-indirect-1",
                    title: "Practice: Make It Indirect",
                    instructions:
                        "Rewrite each direct question as an indirect question.",
                    items: [
                        {
                            type: "text",
                            label: "Direct: Where is the manager's office?",
                            expectedAnswer: "Could you tell me where the manager's office is?",
                            expectedAnswers: [
                                "Do you know where the manager's office is?",
                                "I was wondering where the manager's office is?",
                            ],
                        },
                        {
                            type: "text",
                            label: "Direct: What time does the clinic close?",
                            expectedAnswer: "Do you know what time the clinic closes?",
                            expectedAnswers: [
                                "Could you tell me what time the clinic closes?",
                                "I was wondering what time the clinic closes?",
                            ],
                        },
                        {
                            type: "text",
                            label: "Direct: How much is the security deposit?",
                            expectedAnswer: "Could you tell me how much the security deposit is?",
                            expectedAnswers: [
                                "Do you know how much the security deposit is?",
                                "I was wondering how much the security deposit is?",
                            ],
                        },
                        {
                            type: "text",
                            label: "Direct: When is the rent due?",
                            expectedAnswer: "I was wondering when the rent is due?",
                            expectedAnswers: [
                                "Could you tell me when the rent is due?",
                                "Do you know when the rent is due?",
                            ],
                        },
                    ],
                },
            ],
        },

        // ADVANCED: Embedded Questions
        {
            id: "embedded-questions",
            stepNumber: 8,
            title: "Embedded Questions: Even More Professional",
            icon: "🎓",
            explanation: `
                <h3>Questions Within Statements</h3>
                <p>Embedded questions are indirect questions that are part of a larger statement. They're extremely polite and professional - perfect for work, healthcare, and formal situations.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Examples:</h4>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">Starting with "I'm wondering...":</p>
                        <ul style="margin: 0;">
                            <li>I'm wondering <strong>if you could explain</strong> the benefits package.</li>
                            <li>I'm wondering <strong>whether there's flexibility</strong> in the schedule.</li>
                            <li>I'm wondering <strong>what time</strong> the interview is.</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">Starting with "I'd like to know...":</p>
                        <ul style="margin: 0;">
                            <li>I'd like to know <strong>if this position</strong> offers health insurance.</li>
                            <li>I'd like to know <strong>how many hours</strong> per week this is.</li>
                            <li>I'd like to know <strong>when you need</strong> someone to start.</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">Starting with "Could you clarify...":</p>
                        <ul style="margin: 0;">
                            <li>Could you clarify <strong>what the dress code is</strong>?</li>
                            <li>Could you clarify <strong>whether overtime is paid</strong>?</li>
                            <li>Could you clarify <strong>how the commission works</strong>?</li>
                        </ul>
                    </div>
                </div>

                <h4>Why They Sound Professional:</h4>
                <ul>
                    <li>They soften requests for information</li>
                    <li>They show thoughtfulness (not demanding answers)</li>
                    <li>They're perfect for job interviews, doctor visits, and landlord questions</li>
                </ul>
            `,
            tipBox: {
                title: "💡 When to Use Embedded Questions",
                content:
                    "Job interviews, asking about salary/benefits, talking to your landlord about repairs, asking your doctor about treatment options. Basically: anytime you want to sound extra professional!",
            },
            exercises: [
                {
                    id: "ex-embedded-1",
                    title: "Practice: Embedded Questions",
                    instructions:
                        "Complete each sentence with an embedded question.",
                    items: [
                        {
                            type: "text",
                            label: "I'm wondering ____ the position offers health insurance. (if/whether)",
                            expectedAnswer: "if the position offers health insurance",
                            expectedAnswers: ["whether the position offers health insurance"],
                        },
                        {
                            type: "text",
                            label: "Could you clarify ____ the rent includes utilities? (whether)",
                            expectedAnswer: "whether the rent includes utilities",
                        },
                        {
                            type: "text",
                            label: "I'd like to know ____ per week this position is. (how many hours)",
                            expectedAnswer: "how many hours per week this position is",
                        },
                    ],
                },
            ],
        },

        // ADVANCED: Question Chains
        {
            id: "question-chains",
            stepNumber: 9,
            title: "Professional Question Chains: Digging Deeper",
            icon: "🔗",
            explanation: `
                <h3>Asking Follow-Up Questions</h3>
                <p>In professional situations (job interviews, doctor visits, landlord meetings), you need to ask <strong>3-4 follow-up questions</strong> to get the complete picture. This shows you're engaged and thinking critically.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Example: Asking About a Job</h4>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 1 - Initial Question:</p>
                        <p style="margin: 0;">"What are the hours for this position?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 2 - Clarify Details:</p>
                        <p style="margin: 0;">"Is that Monday through Friday, or does it include weekends?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 3 - Dig Deeper:</p>
                        <p style="margin: 0;">"How much flexibility is there if I need to adjust my schedule occasionally?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 4 - Plan for Scenarios:</p>
                        <p style="margin: 0;">"What would be the process for requesting time off?"</p>
                    </div>
                </div>

                <h4>The 4-Level Question Strategy:</h4>
                <ol>
                    <li><strong>Initial:</strong> Ask the basic question (What? When? How much?)</li>
                    <li><strong>Clarify:</strong> Get specific details ("Does that include...?" "Is that...?")</li>
                    <li><strong>Dig deeper:</strong> Ask about flexibility, exceptions, options</li>
                    <li><strong>Plan ahead:</strong> "What if...?" "How would...?" "What would happen if...?"</li>
                </ol>

                <h4>Why This Matters:</h4>
                <ul>
                    <li><strong>You avoid misunderstandings</strong> (don't assume - ask!)</li>
                    <li><strong>You show professionalism</strong> (employers/landlords see you're thoughtful)</li>
                    <li><strong>You make informed decisions</strong> (know all the facts before signing a lease or accepting a job)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Practice This in Class!",
                content:
                    "When we do speaking activities, challenge yourself to ask at least 3 follow-up questions. Don't just accept the first answer - dig deeper! This is how you become a confident communicator.",
            },
            exercises: [
                {
                    id: "ex-chains-1",
                    title: "Practice: Identify the Strategy",
                    instructions:
                        "Each follow-up question below matches one level of the 4-level strategy. Choose which level it is.",
                    items: [
                        {
                            type: "radio",
                            label: "How much is the rent per month?",
                            options: [
                                { value: "a", label: "Initial (basic question)" },
                                { value: "b", label: "Clarify (specific details)" },
                                { value: "c", label: "Dig deeper (flexibility, exceptions)" },
                                { value: "d", label: "Plan ahead (what if...?)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Does that include heat and water?",
                            options: [
                                { value: "a", label: "Initial (basic question)" },
                                { value: "b", label: "Clarify (specific details)" },
                                { value: "c", label: "Dig deeper (flexibility, exceptions)" },
                                { value: "d", label: "Plan ahead (what if...?)" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Is there any flexibility on the move-in date?",
                            options: [
                                { value: "a", label: "Initial (basic question)" },
                                { value: "b", label: "Clarify (specific details)" },
                                { value: "c", label: "Dig deeper (flexibility, exceptions)" },
                                { value: "d", label: "Plan ahead (what if...?)" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "What happens if I need to break the lease early?",
                            options: [
                                { value: "a", label: "Initial (basic question)" },
                                { value: "b", label: "Clarify (specific details)" },
                                { value: "c", label: "Dig deeper (flexibility, exceptions)" },
                                { value: "d", label: "Plan ahead (what if...?)" },
                            ],
                            expectedAnswer: "d",
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
            explanation: "Bedrooms are countable (use 'how many'), and we need the helping verb 'does' after the question word.",
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
            explanation: "This is a subject question ('Who' is doing the action of paying), so no helping verb is needed.",
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
            explanation: "Correct order: WH-word + helping verb + subject + adjective/complement → When is the rent due?",
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
        {
            id: "quiz-6",
            question: "Which WH-word asks about a reason?",
            options: [
                { value: "a", label: "Where" },
                { value: "b", label: "Why" },
                { value: "c", label: "When" },
            ],
            correctAnswer: "b",
            explanation: "'Why' asks for reasons or explanations. Example: 'Why is the rent going up?'",
        },
        {
            id: "quiz-7",
            question: "Fix the error: 'Where you live?'",
            options: [
                { value: "a", label: "Where do you live?" },
                { value: "b", label: "Where you do live?" },
                { value: "c", label: "Where are you live?" },
            ],
            correctAnswer: "a",
            explanation: "WH-questions need an helping verb: WH-word + do/does + subject + verb.",
        },
        {
            id: "quiz-8",
            question: "Which is an indirect (polite) question?",
            options: [
                { value: "a", label: "What time does the meeting start?" },
                { value: "b", label: "Could you tell me what time the meeting starts?" },
                { value: "c", label: "What time the meeting starts?" },
            ],
            correctAnswer: "b",
            explanation: "Indirect questions use phrases like 'Could you tell me...' and have statement word order.",
        },
        {
            id: "quiz-9",
            question: "What's the formula for standard information questions?",
            options: [
                { value: "a", label: "WH-word + Subject + Helping Verb + Verb" },
                { value: "b", label: "WH-word + Helping Verb + Subject + Verb" },
                { value: "c", label: "Subject + WH-word + Verb + Helping Verb" },
            ],
            correctAnswer: "b",
            explanation: "Standard order: WH-word + Helping Verb (do/does/is/are/can) + Subject + Main Verb.",
        },
        {
            id: "quiz-10",
            question: "Which question asks about location?",
            options: [
                { value: "a", label: "When is the laundry room?" },
                { value: "b", label: "Where is the laundry room?" },
                { value: "c", label: "What is the laundry room?" },
            ],
            correctAnswer: "b",
            explanation: "'Where' asks about places and locations.",
        },
        {
            id: "quiz-11",
            question: "Choose the correct question about time:",
            options: [
                { value: "a", label: "What time does the shift start?" },
                { value: "b", label: "What time the shift starts?" },
                { value: "c", label: "What time does the shift starts?" },
            ],
            correctAnswer: "a",
            explanation: "Correct: WH-word + does + subject + base verb (no 's' on 'start' after 'does').",
        },
        {
            id: "quiz-12",
            question: "Which is correct: asking about method?",
            options: [
                { value: "a", label: "How can I pay rent?" },
                { value: "b", label: "How I can pay rent?" },
                { value: "c", label: "How can pay I rent?" },
            ],
            correctAnswer: "a",
            explanation: "'How' asks about method. Order: WH-word + modal (can) + subject + verb.",
        },
        {
            id: "quiz-13",
            question: "Subject question or object question? 'Who did you call?'",
            options: [
                { value: "a", label: "Subject question (no helping verb needed)" },
                { value: "b", label: "Object question (helping verb required)" },
                { value: "c", label: "Neither" },
            ],
            correctAnswer: "b",
            explanation: "'You' is the subject (doer), 'who' is the object (receiver). Object questions need 'did'.",
        },
        {
            id: "quiz-14",
            question: "What's wrong with: 'How many money do you need?'",
            options: [
                { value: "a", label: "Should be 'How much money' (money is uncountable)" },
                { value: "b", label: "Should be 'What many money'" },
                { value: "c", label: "Nothing is wrong" },
            ],
            correctAnswer: "a",
            explanation: "Money is uncountable. Use 'how much' for uncountable nouns, 'how many' for countable.",
        },
        {
            id: "quiz-15",
            question: "Which indirect question has correct word order?",
            options: [
                { value: "a", label: "Do you know where is the office?" },
                { value: "b", label: "Do you know where the office is?" },
                { value: "c", label: "Do you know is where the office?" },
            ],
            correctAnswer: "b",
            explanation: "In indirect questions, use statement order: subject + verb (where the office IS, not 'is the office').",
        },
    ],
};
