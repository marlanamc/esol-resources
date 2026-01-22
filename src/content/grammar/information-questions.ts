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
                            label: "You want to know the price of the utilities (money). _____ are the utilities?",
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
                            explanation: "✓ Identity"
                        },
                        {
                            sentence: "<strong>Who</strong> do I report to?",
                            explanation: "✓ Role/Position"
                        },
                    ],
                },
                {
                    title: "📝 WHAT = Thing/Information/Action",
                    description: "Use 'what' to ask about things, information, or details.",
                    examples: [
                        {
                            sentence: "<strong>What</strong> are the building rules?",
                            explanation: "✓ Information"
                        },
                        {
                            sentence: "<strong>What</strong> documents do I need?",
                            explanation: "✓ Things"
                        },
                    ],
                },
                {
                    title: "🧩 WHAT + NOUN = Specific Details",
                    description: "Combine 'what' with a noun to ask for very specific details.",
                    examples: [
                        {
                            sentence: "<strong>What time</strong> does it start?",
                            explanation: "✓ Specific hour"
                        },
                        {
                            sentence: "<strong>What size</strong> is the apartment?",
                            explanation: "✓ Specific measurement"
                        },
                        {
                            sentence: "<strong>What kind</strong> of pets are allowed?",
                            explanation: "✓ Specific category"
                        },
                    ],
                },
                {
                    title: "📅 WHEN = Time",
                    description: "Use 'when' to ask about dates, hours, and deadlines.",
                    examples: [
                        {
                            sentence: "<strong>When</strong> is rent due?",
                            explanation: "✓ Deadline"
                        },
                    ],
                },
                {
                    title: "📍 WHERE = Place/Location",
                    description: "Use 'where' to ask about locations or positions.",
                    examples: [
                        {
                            sentence: "<strong>Where</strong> do I park?",
                            explanation: "✓ Location"
                        },
                    ],
                },
                {
                    title: "🤔 WHY = Reason/Explanation",
                    description: "Use 'why' to ask for reasons or causes.",
                    examples: [
                        {
                            sentence: "<strong>Why</strong> is the rent going up?",
                            explanation: "✓ Reason"
                        },
                    ],
                },
                {
                    title: "🔧 HOW = Method/Manner",
                    description: "Use 'how' to ask about the way something is done.",
                    examples: [
                        {
                            sentence: "<strong>How</strong> do I pay rent?",
                            explanation: "✓ Method/Process"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Tip",
                content:
                    "All these words start with WH except 'how.' That's why we call them 'WH-questions'!",
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
                <div style="background: #fdf6e3; padding: 1rem; border-left: 4px solid #b58900; border-radius: 0.3rem; margin-top: 1.5rem;">
                    <p style="margin-top: 0; font-weight: 600;">🛑 Stop and Think:</p>
                    <p style="margin-bottom: 0;">In English, we usually say "I live here" (Subj + Verb). But in a question, we <strong>split</strong> the verb: "Where <strong>do</strong> you <strong>live</strong>?"</p>
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

                <div style="margin: 1.5rem 0; padding: 1rem; background: rgba(110, 145, 118, 0.05); border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                    <h4 style="margin-top: 0;">More examples:</h4>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Who</strong> lives in apartment 3B?<br>→ Someone lives there.<br>→ No "do."</li>
                        <li><strong>Who</strong> do you call for repairs?<br>→ You call someone.<br>→ Use "do."</li>
                        <li><strong>Who</strong> owns the building?<br>→ Someone owns it.<br>→ No "do."</li>
                        <li><strong>Who</strong> did you email yesterday?<br>→ You emailed someone.<br>→ Use "did."</li>
                    </ul>
                </div>

                <h4>Who is doing the action?</h4>
                <p>To choose the right pattern, ask yourself: Is the question word (Who/What) the <strong>Doer</strong> or the <strong>Receiver</strong>?</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: rgba(122, 143, 124, 0.1); padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(122, 143, 124, 0.2);">
                        <h4 style="color: #7ba884; margin-top: 0;">👤 The Doer (Subject)</h4>
                        <p>The WH-word <strong>starts</strong> the action.</p>
                        <p style="font-size: 0.9rem; margin-bottom: 0;"><em>"Who <strong>pays</strong> the bill?"</em><br>(Who does the paying?)</p>
                    </div>
                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(200, 107, 81, 0.2);">
                        <h4 style="color: #d97757; margin-top: 0;">🎯 The Receiver (Object)</h4>
                        <p>The WH-word <strong>receives</strong> the action.</p>
                        <p style="font-size: 0.9rem; margin-bottom: 0;"><em>"Who <strong>do you</strong> pay?"</em><br>(The person receiving the money)</p>
                    </div>
                </div>

                <div style="background: #fdf6e3; padding: 1rem; border-left: 4px solid #b58900; border-radius: 0.3rem; margin-bottom: 1.5rem;">
                    <p style="margin-top: 0; font-weight: 600;">🛑 Stop and Think:</p>
                    <p style="margin-bottom: 0;">Look at the sentence: "Someone broke the window." If you want to ask about the person who did it, is that a <strong>Doer</strong> or a <strong>Receiver</strong>? (Check the rule above!)</p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem;">☝️ The "-s" Rule for Doers</h4>
                    <p>When "Who" or "What" is the <strong>Doer</strong>, we treat it like 'He/She/It'. This means the verb usually needs an <strong>-s</strong>.</p>
                    <ul style="margin-bottom: 0;">
                        <li>"Who <strong>pays</strong> rent?" (Think: <em>He</em> pays)</li>
                        <li>"Who <strong>manages</strong> the building?"</li>
                        <li>"What <strong>happens</strong> next?"</li>
                    </ul>
                </div>

                <div style="background: rgba(110, 145, 118, 0.1); border-left: 4px solid #7ba884; padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem;">✅ Quick Check: Who Is Doing the Action?</h3>
                    <p>If this rule feels confusing, try this simple test.</p>
                    <p><strong>Ask yourself:</strong><br><strong>Who is doing the action in the sentence?</strong></p>
                    <ul style="margin: 0.75rem 0;">
                        <li>If <strong>who/what is doing the action</strong>, do NOT use do/does/did</li>
                        <li>If <strong>you or another person is doing the action</strong>, use do/does/did</li>
                    </ul>
                    <p style="margin-top: 1rem; margin-bottom: 0.5rem;"><strong>Examples:</strong></p>
                    <p style="margin: 0.5rem 0;"><strong>Who pays the rent?</strong><br>→ Someone pays the rent.<br>→ "Who" is doing the action.<br>→ No "do."</p>
                    <p style="margin: 0.5rem 0;"><strong>Who do you pay?</strong><br>→ You pay someone.<br>→ "You" are doing the action.<br>→ Use "do."</p>
                    <p style="margin-top: 1rem; margin-bottom: 0; font-weight: 600;">This test works every time.</p>
                    <p style="margin-top: 0.75rem; margin-bottom: 0; font-weight: 600; font-size: 1.05rem;">💭 <strong>Think "Who is the worker?"</strong></p>
                </div>

                <div style="background: rgba(200, 107, 81, 0.08); border-left: 4px solid #d97757; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <p style="margin-top: 0; margin-bottom: 0.5rem; font-weight: 600; color: #d97757;">💬 Note for Students</p>
                    <p style="margin: 0;">This rule is hard at first, even for advanced English learners. If you forget in the moment, it's okay. People will still understand your question. The goal is progress, not perfection.</p>
                </div>

                <p style="margin-top: 1.5rem; margin-bottom: 0; font-weight: 600; font-size: 1.05rem;"><strong>Takeaway:</strong><br>If "who" is doing the action, do not use "do."</p>
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


        // What vs Which
        {
            id: "what-vs-which",
            stepNumber: 6,
            title: "What vs Which: Choosing Between Options",
            icon: "🤔",
            explanation: `
                <h3>Which One Should You Use?</h3>
                <p>Students often get confused between <strong>What</strong> and <strong>Which</strong>. The rule is simple: it depends on how many choices you have.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                            <h4 style="color: #d97757; margin-top: 0;">📝 WHAT</h4>
                            <p style="font-weight: 600;">Unlimited Choices</p>
                            <p>Use "what" when there are many, many possible answers.</p>
                            <p style="font-style: italic;">"What is your name?" (Thousands of possibilities)</p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                            <h4 style="color: #7ba884; margin-top: 0;">🎯 WHICH</h4>
                            <p style="font-weight: 600;">Limited Choices</p>
                            <p>Use "which" when you are choosing from a small group (usually 2-5 things).</p>
                            <p style="font-style: italic;">"Which apartment do you want, 3A or 3B?" (Only two choices)</p>
                        </div>
                    </div>
                </div>

                <h4>In Housing and Work:</h4>
                <ul>
                    <li>"<strong>What</strong> is the address?" (Unlimited possibilities)</li>
                    <li>"<strong>Which</strong> floor is the apartment on?" (Limited floors in a building)</li>
                    <li>"<strong>What</strong> kind of job do you want?" (General)</li>
                    <li>"<strong>Which</strong> shift do you prefer, morning or night?" (Specific choices)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-what-vs-which-1",
                    title: "Practice: What or Which?",
                    instructions: "Choose the best question word for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "You see three different keys on the table. You ask: '____ key is for the mailbox?'",
                            options: [
                                { value: "what", label: "What" },
                                { value: "which", label: "Which" },
                            ],
                            expectedAnswer: "which",
                        },
                        {
                            type: "radio",
                            label: "You want to know someone's phone number. You ask: '____ is your number?'",
                            options: [
                                { value: "what", label: "What" },
                                { value: "which", label: "Which" },
                            ],
                            expectedAnswer: "what",
                        },
                        {
                            type: "radio",
                            label: "There are two buses at the stop. You ask: '____ bus goes to downtown?'",
                            options: [
                                { value: "what", label: "What" },
                                { value: "which", label: "Which" },
                            ],
                            expectedAnswer: "which",
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
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Thing/Information (Unlimited)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">What's the address?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Which</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Choice (Limited)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Which floor?</td>
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
                    title: "Comprehensive Review: Information Questions",
                    instructions: "Choose the correct answer for each question.",
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
                        {
                            type: "radio",
                            label: "Which WH-word asks about a person?",
                            options: [
                                { value: "a", label: "What" },
                                { value: "b", label: "Who" },
                                { value: "c", label: "Where" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct question about money:",
                            options: [
                                { value: "a", label: "How many is the rent?" },
                                { value: "b", label: "How much is the rent?" },
                                { value: "c", label: "How much are the rent?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You see two apartments available. You ask:",
                            options: [
                                { value: "a", label: "What apartment do you prefer?" },
                                { value: "b", label: "Which apartment do you prefer?" },
                                { value: "c", label: "Where apartment do you prefer?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct indirect question:",
                            options: [
                                { value: "a", label: "Could you tell me where is the office?" },
                                { value: "b", label: "Could you tell me where the office is?" },
                                { value: "c", label: "Could you tell me is where the office?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Object question (needs helping verb):",
                            options: [
                                { value: "a", label: "Who you call for repairs?" },
                                { value: "b", label: "Who do you call for repairs?" },
                                { value: "c", label: "Who calls for repairs?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which question asks about a reason?",
                            options: [
                                { value: "a", label: "When is the rent going up?" },
                                { value: "b", label: "Why is the rent going up?" },
                                { value: "c", label: "Where is the rent going up?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct question about countable items:",
                            options: [
                                { value: "a", label: "How much bedrooms does it have?" },
                                { value: "b", label: "How many bedrooms does it have?" },
                                { value: "c", label: "How many bedroom does it have?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which is an embedded question?",
                            options: [
                                { value: "a", label: "What time does the clinic close?" },
                                { value: "b", label: "I'm wondering what time the clinic closes." },
                                { value: "c", label: "What time the clinic closes?" },
                            ],
                            expectedAnswer: "b",
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
                <p>In English, asking questions directly can sometimes sound a bit demanding. To be extra professional and polite (at work, at the doctor, or with landlords), we often use <strong>Indirect Questions</strong>.</p>

                <div style="background: #fdf6e3; padding: 1rem; border-left: 4px solid #b58900; border-radius: 0.3rem; margin-bottom: 1.5rem;">
                    <p style="margin-top: 0; font-weight: 600;">🛑 Stop and Think:</p>
                    <p style="margin-bottom: 0;">If you are asking your boss about your paycheck, which sounds better? "Where is my check?" or "Could you tell me where my check is?"</p>
                </div>

                <div style="background: rgba(110, 145, 118, 0.1); border-left: 4px solid #7ba884; padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem;">🧠 Think of Indirect Questions Like This</h3>
                    <p>An indirect question is:<br><strong>A polite sentence + a question inside it</strong></p>
                    <p>The question itself does NOT change.<br>It just goes inside a sentence.</p>
                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0.5rem 0;"><strong>Direct question:</strong><br>Where is the office?</p>
                        <p style="margin: 0.5rem 0;"><strong>Polite sentence:</strong><br>Could you tell me…</p>
                        <p style="margin: 0.5rem 0;"><strong>Polite long question:</strong><br>Could you tell me where the office is?</p>
                    </div>
                </div>

                <div style="background: #fff3cd; border-left: 4px solid #b58900; padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <p style="margin-top: 0; margin-bottom: 0.75rem; font-weight: 600; color: #856404;">⚠️ Important Reminder</p>
                    <p style="margin: 0.5rem 0;">Inside an indirect question, the word order is like a statement:<br><strong>subject + verb</strong></p>
                    <p style="margin: 0.75rem 0 0.5rem 0;"><strong>We say:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>where the office is</li>
                        <li>what time the clinic closes</li>
                        <li>how much the deposit is</li>
                    </ul>
                    <p style="margin: 0.75rem 0 0.5rem 0;"><strong>NOT:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>where is the office</li>
                        <li>what time does the clinic close</li>
                        <li>how much does the deposit cost</li>
                    </ul>
                    <p style="margin-top: 0.75rem; margin-bottom: 0;">This reinforces what you already taught, without reframing.</p>
                </div>

                <div style="background: rgba(110, 145, 118, 0.1); border-left: 4px solid #7ba884; padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <p style="margin-top: 0; margin-bottom: 0.5rem; font-weight: 600; color: #7ba884;">✅ Good to Know</p>
                    <p style="margin: 0;">If you accidentally use question word order in an indirect question, people will usually still understand you.</p>
                    <p style="margin: 0.75rem 0 0;">Indirect questions are about being polite and professional, not about being perfect.</p>
                </div>

                <p style="margin-top: 1.5rem; margin-bottom: 0; font-weight: 600; font-size: 1.05rem;"><strong>Takeaway:</strong><br>In polite long questions, use statement word order inside the sentence.</p>
            `,
            comparison: {
                title: "Direct vs. Indirect Word Order",
                leftLabel: "Direct (Less Polite)",
                rightLabel: "Indirect (More Polite)",
                rows: [
                    {
                        label: "Location",
                        left: "Where <strong>is the office</strong>?",
                        right: "Could you tell me where <strong>the office is</strong>?"
                    },
                    {
                        label: "Price",
                        left: "How much <strong>does it cost</strong>?",
                        right: "Do you know how much <strong>it costs</strong>?"
                    },
                    {
                        label: "Time",
                        left: "When <strong>does it start</strong>?",
                        right: "I was wondering when <strong>it starts</strong>?"
                    }
                ]
            },
            formula: [
                { text: "Polite Phrase", type: "other" },
                { text: "+", type: "other" },
                { text: "WH-word", type: "other" },
                { text: "+", type: "other" },
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "Verb", type: "verb" },
                { text: "+", type: "other" },
                { text: "?", type: "other" },
            ],
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
                    title: "Practice: Build Complete Question Chains",
                    instructions:
                        "Read each scenario. Then choose the BEST next question to continue the question chain logically.",
                    items: [
                        {
                            type: "radio",
                            label: "Scenario: You're asking about a job. You already asked: 'What are the hours for this position?' and the employer said '40 hours per week.' What's the BEST next question?",
                            options: [
                                { value: "a", label: "How much is the salary?" },
                                { value: "b", label: "Is that Monday through Friday, or does it include weekends?" },
                                { value: "c", label: "What happens if I get sick?" },
                                { value: "d", label: "Who is the manager?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're asking about an apartment. You already asked: 'How much is the rent?' (Answer: $1200) and 'Does that include utilities?' (Answer: Yes, heat and water). What's the BEST next question?",
                            options: [
                                { value: "a", label: "How much is the rent?" },
                                { value: "b", label: "What utilities are included exactly?" },
                                { value: "c", label: "What happens if I can't pay rent one month?" },
                                { value: "d", label: "Where is the apartment?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're at a doctor's appointment. You asked: 'What are the side effects of this medication?' (Answer: Dizziness and nausea) and 'How often should I take it?' (Answer: Twice daily with food). What's the BEST next question?",
                            options: [
                                { value: "a", label: "What is the medication called?" },
                                { value: "b", label: "What should I do if I miss a dose?" },
                                { value: "c", label: "How much does it cost?" },
                                { value: "d", label: "When should I take it?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're asking about a job. You asked: 'What are the hours?' (Answer: 9-5, Monday-Friday) and 'Is there flexibility if I need to come in late sometimes?' (Answer: Yes, with notice). What's the BEST next question?",
                            options: [
                                { value: "a", label: "What are the hours?" },
                                { value: "b", label: "How do I request time off?" },
                                { value: "c", label: "What happens if I'm late without notice?" },
                                { value: "d", label: "Where is the office?" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're asking about an apartment. You asked: 'How much is the rent?' (Answer: $1500) and 'What's included?' (Answer: Heat, water, parking). What's the BEST next question?",
                            options: [
                                { value: "a", label: "How much is the rent?" },
                                { value: "b", label: "Is there any flexibility on the move-in date?" },
                                { value: "c", label: "What happens if I lose my job and can't pay?" },
                                { value: "d", label: "Who is the landlord?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're asking about a job. You asked: 'What are the benefits?' (Answer: Health insurance and 2 weeks vacation) and 'When do benefits start?' (Answer: After 90 days). What's the BEST next question?",
                            options: [
                                { value: "a", label: "What are the benefits?" },
                                { value: "b", label: "What happens if I need to take medical leave before 90 days?" },
                                { value: "c", label: "How much vacation time do I get?" },
                                { value: "d", label: "Where is the office?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're asking about an apartment. You asked: 'When can I move in?' (Answer: Next month) and 'How much notice do I need to give before moving out?' (Answer: 60 days). What's the BEST next question?",
                            options: [
                                { value: "a", label: "When can I move in?" },
                                { value: "b", label: "What happens if I need to move out early for a new job?" },
                                { value: "c", label: "How much is the rent?" },
                                { value: "d", label: "Where is the apartment?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're at a doctor's appointment. You asked: 'What should I do about this pain?' (Answer: Take this medication) and 'How long will it take to feel better?' (Answer: 3-5 days). What's the BEST next question?",
                            options: [
                                { value: "a", label: "What should I do about this pain?" },
                                { value: "b", label: "What should I do if the pain gets worse or doesn't improve?" },
                                { value: "c", label: "How much does the medication cost?" },
                                { value: "d", label: "When should I take it?" },
                            ],
                            expectedAnswer: "b",
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
            explanation: "Correct! 'Bedrooms' are countable (use 'how many'), and questions need the helping verb ('does') before the subject.",
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
            explanation: "Correct! This is a subject question ('Who' is the one doing the action), so we don't use 'do/does'. We also add '-s' to the verb ('pays').",
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
            explanation: "Correct! The pattern is: WH-word (When) + Helping Verb (is) + Subject (the rent) + due.",
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
            explanation: "Correct! 'Who' is used for people. 'What' is for things/information, and 'When' is for time.",
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
            explanation: "Correct! Money/rent is uncountable, so we use 'How much'.",
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
            explanation: "Correct! 'Why' asks for reasons, explanations, or causes.",
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
            explanation: "Correct! Standard questions need a helping verb ('do/does') after the question word.",
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
            explanation: "Correct! Indirect questions use polite phrases like 'Could you tell me...' and they use statement word order (the meeting starts).",
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
            explanation: "Correct! WH-word + Helping Verb (do/does) + Subject + Main Verb.",
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
            explanation: "Correct! 'Where' is the word for places and locations.",
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
            explanation: "Correct! When we use 'does', the main verb ('start') stays in its base form (no '-s').",
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
            explanation: "Correct! 'How' is for method. The order is: How + can + Subject + Verb.",
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
            explanation: "Correct! This is an object question because 'you' is the subject (the doer). The question asks about the person receiving the call.",
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
            explanation: "Correct! 'Money' is uncountable. We use 'How much' for uncountable amounts.",
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
            explanation: "Correct! In indirect questions, the second part follows statement order (Subject + Verb: the office is).",
        },
        {
            id: "quiz-16",
            question: "What vs Which: You see three keys on the table. You ask:",
            options: [
                { value: "a", label: "What key is for the mailbox?" },
                { value: "b", label: "Which key is for the mailbox?" },
                { value: "c", label: "Where key is for the mailbox?" },
            ],
            correctAnswer: "b",
            explanation: "Correct! Use 'which' when choosing from a limited number of options (here, 3 keys).",
        },
        {
            id: "quiz-17",
            question: "What vs Which: You want to know someone's phone number. You ask:",
            options: [
                { value: "a", label: "What is your phone number?" },
                { value: "b", label: "Which is your phone number?" },
                { value: "c", label: "Where is your phone number?" },
            ],
            correctAnswer: "a",
            explanation: "Correct! Use 'what' when there are unlimited possibilities (any phone number).",
        },
        {
            id: "quiz-18",
            question: "Which is a subject question?",
            options: [
                { value: "a", label: "Who do you know?" },
                { value: "b", label: "Who knows the answer?" },
                { value: "c", label: "Who did you call?" },
            ],
            correctAnswer: "b",
            explanation: "Correct! 'Who knows the answer?' - 'Who' is doing the action (knowing), so no helping verb is needed.",
        },
        {
            id: "quiz-19",
            question: "Which is an object question?",
            options: [
                { value: "a", label: "Who lives here?" },
                { value: "b", label: "Who did you see?" },
                { value: "c", label: "Who owns the building?" },
            ],
            correctAnswer: "b",
            explanation: "Correct! 'Who did you see?' - 'You' is doing the action (seeing), so we need 'did'.",
        },
        {
            id: "quiz-20",
            question: "Choose the correct embedded question:",
            options: [
                { value: "a", label: "I'm wondering if the position offers health insurance." },
                { value: "b", label: "I'm wondering does the position offer health insurance." },
                { value: "c", label: "I'm wondering if does the position offer health insurance." },
            ],
            correctAnswer: "a",
            explanation: "Correct! Embedded questions use statement word order: 'if the position offers' (not 'does the position offer').",
        },
        {
            id: "quiz-21",
            question: "Which question is Level 1 (Initial) in the 4-level question strategy?",
            options: [
                { value: "a", label: "How much is the rent per month?" },
                { value: "b", label: "Does that include utilities?" },
                { value: "c", label: "What happens if I need to break the lease early?" },
            ],
            correctAnswer: "a",
            explanation: "Correct! Level 1 asks the basic question (What? When? How much?).",
        },
        {
            id: "quiz-22",
            question: "Which question is Level 2 (Clarify) in the 4-level question strategy?",
            options: [
                { value: "a", label: "How much is the rent per month?" },
                { value: "b", label: "Does that include heat and water?" },
                { value: "c", label: "Is there flexibility on the move-in date?" },
            ],
            correctAnswer: "b",
            explanation: "Correct! Level 2 clarifies specific details with questions like 'Does that include...?'",
        },
        {
            id: "quiz-23",
            question: "Which question is Level 4 (Plan ahead) in the 4-level question strategy?",
            options: [
                { value: "a", label: "How much is the rent per month?" },
                { value: "b", label: "Does that include utilities?" },
                { value: "c", label: "What happens if I need to break the lease early?" },
            ],
            correctAnswer: "c",
            explanation: "Correct! Level 4 plans for scenarios with 'What if...?' or 'What happens if...?' questions.",
        },
        {
            id: "quiz-24",
            question: "Fix the error: 'Where you work?'",
            options: [
                { value: "a", label: "Where do you work?" },
                { value: "b", label: "Where you do work?" },
                { value: "c", label: "Where are you work?" },
            ],
            correctAnswer: "a",
            explanation: "Correct! Standard questions need a helping verb ('do/does') after the question word.",
        },
        {
            id: "quiz-25",
            question: "Choose the correct indirect question about time:",
            options: [
                { value: "a", label: "Could you tell me when does the clinic close?" },
                { value: "b", label: "Could you tell me when the clinic closes?" },
                { value: "c", label: "Could you tell me when closes the clinic?" },
            ],
            correctAnswer: "b",
            explanation: "Correct! Indirect questions use statement word order: 'when the clinic closes' (not 'when does the clinic close').",
        },
        {
            id: "quiz-26",
            question: "Which question asks about method or manner?",
            options: [
                { value: "a", label: "When do I pay rent?" },
                { value: "b", label: "How do I pay rent?" },
                { value: "c", label: "Where do I pay rent?" },
            ],
            correctAnswer: "b",
            explanation: "Correct! 'How' asks about the method or way something is done.",
        },
        {
            id: "quiz-27",
            question: "Subject question: What should the verb form be?",
            options: [
                { value: "a", label: "Who pay the rent? (no -s)" },
                { value: "b", label: "Who pays the rent? (with -s)" },
                { value: "c", label: "Who does pay the rent? (with do)" },
            ],
            correctAnswer: "b",
            explanation: "Correct! When 'Who' is the subject (doer), we treat it like 'He/She/It', so the verb needs '-s' (pays).",
        },
        {
            id: "quiz-28",
            question: "Which question correctly uses 'What + noun'?",
            options: [
                { value: "a", label: "What time does the meeting start?" },
                { value: "b", label: "What does time the meeting start?" },
                { value: "c", label: "What time the meeting starts?" },
            ],
            correctAnswer: "a",
            explanation: "Correct! 'What time' is a common combination. The question still needs the helping verb 'does'.",
        },
        {
            id: "quiz-29",
            question: "Choose the correct question about uncountable amount:",
            options: [
                { value: "a", label: "How many notice do I need to give?" },
                { value: "b", label: "How much notice do I need to give?" },
                { value: "c", label: "How much notices do I need to give?" },
            ],
            correctAnswer: "b",
            explanation: "Correct! 'Notice' (time) is uncountable, so use 'How much'. Also, uncountable nouns don't take plural form.",
        },
        {
            id: "quiz-30",
            question: "Which is the correct polite way to ask about salary?",
            options: [
                { value: "a", label: "How much is the salary?" },
                { value: "b", label: "I'd like to know how much the salary is." },
                { value: "c", label: "Tell me how much is the salary." },
            ],
            correctAnswer: "b",
            explanation: "Correct! 'I'd like to know...' is a polite embedded question. It uses statement word order: 'how much the salary is'.",
        },
    ],
};
