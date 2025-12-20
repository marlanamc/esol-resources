import type { InteractiveGuideContent } from "@/types/activity";

export const superlativesQuantifiersContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Superlatives & Quantifiers: Making Comparisons That Matter",
            icon: "📊",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"This is the cheapest apartment I found." "My new job has the most benefits." "We have less time but more responsibilities." These comparisons are essential for describing your life, making decisions, and explaining situations.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Whether you're apartment hunting, job searching, or just describing your day, you need to compare and quantify. This lesson gives you the tools to:</p>
                <ul>
                    <li><strong>Find the best deal</strong> - Compare apartments, jobs, prices</li>
                    <li><strong>Make informed decisions</strong> - "Which option has the most advantages?"</li>
                    <li><strong>Describe situations accurately</strong> - "I have too much work and too little time"</li>
                    <li><strong>Negotiate effectively</strong> - At work, at stores, with landlords</li>
                </ul>
            `,
            exercises: [
                {
                    id: "sq-intro-1",
                    title: "Quick Check: What Are We Doing?",
                    instructions: "Choose the best label for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "This is the cheapest apartment I found.",
                            options: [
                                { value: "superlative", label: "Superlative (the extreme in a group)" },
                                { value: "quantifier", label: "Quantifier (amount: much/many/few/less)" },
                            ],
                            expectedAnswer: "superlative",
                        },
                        {
                            type: "radio",
                            label: "I have less time but more responsibilities.",
                            options: [
                                { value: "superlative", label: "Superlative" },
                                { value: "quantifier", label: "Quantifier" },
                            ],
                            expectedAnswer: "quantifier",
                        },
                    ],
                },
            ],
        },

        // Superlatives Section
        {
            id: "superlatives-intro",
            stepNumber: 1,
            title: "Superlatives: The Most, The Best, The -est",
            icon: "🏆",
            explanation: `
                <h3>What Are Superlatives?</h3>
                <p>Superlatives help you identify the <strong>extreme</strong> in a group - the highest, the lowest, the best, the worst. Use them when comparing <strong>three or more</strong> things.</p>
            `,
            exercises: [
                {
                    id: "sq-superlatives-intro-1",
                    title: "Practice: Superlative or Comparative?",
                    instructions: "Choose the correct answer.",
                    items: [
                        {
                            type: "radio",
                            label: "This is the cheapest apartment in the neighborhood.",
                            options: [
                                { value: "superlative", label: "Superlative (3+ things)" },
                                { value: "comparative", label: "Comparative (2 things)" },
                            ],
                            expectedAnswer: "superlative",
                        },
                        {
                            type: "radio",
                            label: "This apartment is cheaper than that one.",
                            options: [
                                { value: "superlative", label: "Superlative" },
                                { value: "comparative", label: "Comparative" },
                            ],
                            expectedAnswer: "comparative",
                        },
                    ],
                },
            ],
            usageMeanings: [
                {
                    title: "💰 Finding the Best Deal",
                    description: "Use superlatives when comparing apartments, jobs, or shopping options to identify the extreme in a group",
                    examples: [
                        {
                            sentence: "This is <strong>the cheapest</strong> apartment in the neighborhood.",
                            explanation: "✓ Comparing this apartment to all others in the area (3+ apartments)"
                        },
                        {
                            sentence: "This apartment is <strong>cheaper</strong> than that one.",
                            explanation: "✗ NOT a superlative! This compares only 2 apartments (use comparative)"
                        },
                    ],
                },
                {
                    title: "📅 Describing Your Schedule",
                    description: "Talk about the busiest days, longest shifts, or most demanding tasks",
                    examples: [
                        {
                            sentence: "Monday is <strong>the busiest</strong> day at work.",
                            explanation: "✓ Monday compared to all other days of the week"
                        },
                        {
                            sentence: "That restaurant has <strong>the best</strong> food downtown.",
                            explanation: "✓ This restaurant compared to all others downtown"
                        },
                    ],
                },
                {
                    title: "💼 Job Comparisons",
                    description: "Compare job offers, benefits, or work conditions",
                    examples: [
                        {
                            sentence: "This job offers <strong>the most</strong> vacation days.",
                            explanation: "✓ Comparing vacation days across all jobs you're considering"
                        },
                        {
                            sentence: "She's <strong>the most experienced</strong> person on the team.",
                            explanation: "✓ Comparing her experience to all other team members"
                        },
                    ],
                },
            ],
            formula: [
                { text: "the", type: "other" },
                { text: "+", type: "other" },
                { text: "adjective + -est", type: "subject" },
                { text: "OR", type: "other" },
                { text: "most/least + adjective", type: "subject" },
            ],
            tipBox: {
                title: "💡 Three or More",
                content:
                    "Superlatives are for comparing 3+ things. For comparing just 2 things, use comparatives (cheaper, better, more expensive). Example: 'This apartment is cheaper than that one' (2 apartments) vs 'This is the cheapest apartment' (3+ apartments).",
            },
        },

        // Superlatives Formation
        {
            id: "superlatives-formation",
            stepNumber: 2,
            title: "How to Form Superlatives",
            icon: "⚙️",
            explanation: `
                <h3>The Two Main Patterns</h3>
                <p>How you form a superlative depends on how long the adjective is:</p>
            `,
            verbTable: {
                title: "Superlative Formation Rules",
                headers: ["Type", "Pattern", "Examples"],
                rows: [
                    ["Short adjectives (1 syllable)", "the + adjective + -est", "cheap → the cheapest, old → the oldest, big → the biggest"],
                    ["Short adjectives ending in -y", "the + adjective (y→iest)", "busy → the busiest, happy → the happiest, easy → the easiest"],
                    ["Long adjectives (2+ syllables)", "the most/least + adjective", "expensive → the most expensive, comfortable → the most comfortable, affordable → the most affordable"],
                    ["Irregular adjectives", "(special forms)", "good → the best, bad → the worst, far → the farthest"],
                ],
            },
            exercises: [
                {
                    id: "ex-superlatives-1",
                    title: "Practice: Form the Superlative",
                    instructions:
                        "Complete each sentence with the correct superlative form.",
                    items: [
                        {
                            type: "text",
                            label: "1. This is ___ (cheap) apartment I can afford.",
                            expectedAnswer: "the cheapest",
                        },
                        {
                            type: "text",
                            label: "2. Monday is ___ (busy) day of the week at the restaurant.",
                            expectedAnswer: "the busiest",
                        },
                        {
                            type: "text",
                            label: "3. She's ___ (experienced) worker on our team.",
                            expectedAnswer: "the most experienced",
                        },
                        {
                            type: "text",
                            label: "4. That was ___ (good) interview I've ever had!",
                            expectedAnswer: "the best",
                        },
                        {
                            type: "text",
                            label: "5. This job has ___ (good) benefits in the industry.",
                            expectedAnswer: "the best",
                        },
                    ],
                },
            ],
        },

        // Quantifiers Introduction
        {
            id: "quantifiers-intro",
            stepNumber: 3,
            title: "Quantifiers: How Much? How Many?",
            icon: "🔢",
            explanation: `
                <h3>What Are Quantifiers?</h3>
                <p>Quantifiers tell you <strong>how much</strong> or <strong>how many</strong> of something there is. They're essential for describing amounts without being specific.</p>
            `,
            exercises: [
                {
                    id: "sq-quantifiers-intro-1",
                    title: "Practice: Count or Non-Count?",
                    instructions: "Choose the best answer for each word.",
                    items: [
                        {
                            type: "radio",
                            label: "<strong>jobs</strong>",
                            options: [
                                { value: "count", label: "Count noun (you can count it)" },
                                { value: "noncount", label: "Non-count noun (you can't count it)" },
                            ],
                            expectedAnswer: "count",
                        },
                        {
                            type: "radio",
                            label: "<strong>money</strong>",
                            options: [
                                { value: "count", label: "Count noun" },
                                { value: "noncount", label: "Non-count noun" },
                            ],
                            expectedAnswer: "noncount",
                        },
                        {
                            type: "radio",
                            label: "<strong>time</strong>",
                            options: [
                                { value: "count", label: "Count noun" },
                                { value: "noncount", label: "Non-count noun" },
                            ],
                            expectedAnswer: "noncount",
                        },
                    ],
                },
            ],
            usageMeanings: [
                {
                    title: "🔢 Count Nouns",
                    description: "Things you can count individually - use numbers with them",
                    examples: [
                        {
                            sentence: "I applied for three <strong>jobs</strong> this week.",
                            explanation: "✓ You can count jobs: 1 job, 2 jobs, 3 jobs"
                        },
                        {
                            sentence: "The apartment has two <strong>bedrooms</strong> and one <strong>bathroom</strong>.",
                            explanation: "✓ Bedrooms and bathrooms are countable"
                        },
                        {
                            sentence: "How many <strong>hours</strong> do you work per week?",
                            explanation: "✓ Hours are countable: 1 hour, 2 hours, 40 hours"
                        },
                    ],
                },
                {
                    title: "💧 Non-Count Nouns",
                    description: "Things you can't count individually - substances, abstract concepts, collective ideas",
                    examples: [
                        {
                            sentence: "The rent costs too much <strong>money</strong>.",
                            explanation: "✓ You don't say '1 money, 2 moneys' - it's uncountable"
                        },
                        {
                            sentence: "I don't have much <strong>time</strong> before my shift.",
                            explanation: "✓ Time is uncountable (though hours/minutes/days are countable)"
                        },
                        {
                            sentence: "This job requires a lot of <strong>experience</strong>.",
                            explanation: "✓ Experience is uncountable (though 'experiences' as events can be countable)"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content:
                    "Can you put a number in front of it? If yes, it's countable (1 job, 2 jobs). If no, it's uncountable (money, not *1 money). When in doubt, uncountable nouns are usually substances, abstract ideas, or collective concepts.",
            },
        },

        // Many vs Much
        {
            id: "many-much",
            stepNumber: 4,
            title: "Many vs Much: The Most Common Mistake",
            icon: "🔀",
            explanation: `
                <h3>The Rule That Changes Everything</h3>
                <p>One of the most common mistakes in English: using "much" with countable nouns or "many" with uncountable ones. Master this, and you'll sound more natural.</p>
            `,
            usageMeanings: [
                {
                    title: "✅ MANY = Count Nouns",
                    description: "Use 'many' with things you can count (plural nouns)",
                    examples: [
                        {
                            sentence: "How <strong>many hours</strong> do you work per week?",
                            explanation: "✓ Hours are countable (1 hour, 2 hours...)"
                        },
                        {
                            sentence: "She has <strong>many responsibilities</strong> at work.",
                            explanation: "✓ You can count responsibilities: 1 responsibility, 2 responsibilities..."
                        },
                        {
                            sentence: "There aren't <strong>many apartments</strong> available.",
                            explanation: "✓ Apartments are countable units"
                        },
                    ],
                },
                {
                    title: "✅ MUCH = Non-Count Nouns",
                    description: "Use 'much' with things you cannot count individually (singular nouns)",
                    examples: [
                        {
                            sentence: "I don't have <strong>much time</strong> for lunch.",
                            explanation: "✓ Time is uncountable (you can't say '1 time, 2 times' in this sense)"
                        },
                        {
                            sentence: "The rent costs too <strong>much money</strong>.",
                            explanation: "✓ Money as a concept is uncountable"
                        },
                        {
                            sentence: "This job requires <strong>much experience</strong>.",
                            explanation: "✓ Experience is uncountable"
                        },
                    ],
                },
                {
                    title: "❌ Common Mistakes",
                    description: "Watch out for these errors that even advanced learners make",
                    examples: [
                        {
                            sentence: "❌ How <strong>much hours</strong> do you work?",
                            explanation: "✗ WRONG! Hours are countable → use 'many hours'"
                        },
                        {
                            sentence: "❌ I don't have <strong>many time</strong>.",
                            explanation: "✗ WRONG! Time is uncountable → use 'much time'"
                        },
                        {
                            sentence: "❌ She has <strong>much responsibilities</strong>.",
                            explanation: "✗ WRONG! Responsibilities are countable → use 'many responsibilities'"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-many-much-1",
                    title: "Practice: Many or Much?",
                    instructions:
                        "Choose 'many' or 'much' for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "How ___ vacation days do you get?",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" },
                            ],
                            expectedAnswer: "many",
                        },
                        {
                            type: "radio",
                            label: "I don't have ___ experience with computers.",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" },
                            ],
                            expectedAnswer: "much",
                        },
                        {
                            type: "radio",
                            label: "There aren't ___ affordable apartments available.",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" },
                            ],
                            expectedAnswer: "many",
                        },
                        {
                            type: "radio",
                            label: "This job requires too ___ travel.",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" },
                            ],
                            expectedAnswer: "much",
                        },
                    ],
                },
            ],
        },

        // Few vs Little
        {
            id: "few-little",
            stepNumber: 5,
            title: "Few vs Little: Not Enough",
            icon: "📉",
            explanation: `
                <h3>Describing Small Amounts</h3>
                <p>Just like many/much, the choice between few and little depends on count vs non-count:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                            <h4 style="color: #7ba884; margin-top: 0;">FEW = Count Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Small number, not enough</p>
                            <ul style="margin: 0;">
                                <li>few <strong>options</strong></li>
                                <li>few <strong>openings</strong></li>
                                <li>few <strong>applicants</strong></li>
                            </ul>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                            <h4 style="color: #d97757; margin-top: 0;">LITTLE = Non-Count Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Small amount, not enough</p>
                            <ul style="margin: 0;">
                                <li>little <strong>money</strong></li>
                                <li>little <strong>space</strong></li>
                                <li>little <strong>hope</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h4>Bonus: A FEW vs A LITTLE (Positive Meaning)</h4>
                <ul>
                    <li><strong>a few</strong> = some, a small number (positive) → "I have a few friends here" (I do have some!)</li>
                    <li><strong>few</strong> = almost none (negative) → "I have few friends here" (I'm lonely)</li>
                    <li><strong>a little</strong> = some, a small amount (positive) → "I have a little time" (enough for something)</li>
                    <li><strong>little</strong> = almost none (negative) → "I have little time" (I'm rushed)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-few-little-1",
                    title: "Practice: Few or Little?",
                    instructions:
                        "Choose the correct quantifier.",
                    items: [
                        {
                            type: "radio",
                            label: "There are very ___ good apartments in my budget.",
                            options: [
                                { value: "few", label: "few" },
                                { value: "little", label: "little" },
                            ],
                            expectedAnswer: "few",
                        },
                        {
                            type: "radio",
                            label: "I have very ___ patience for rude customers.",
                            options: [
                                { value: "few", label: "few" },
                                { value: "little", label: "little" },
                            ],
                            expectedAnswer: "little",
                        },
                        {
                            type: "radio",
                            label: "We received ___ applications for the position. (only 3)",
                            options: [
                                { value: "few", label: "few" },
                                { value: "little", label: "little" },
                            ],
                            expectedAnswer: "few",
                        },
                    ],
                },
            ],
        },

        // Fewer vs Less
        {
            id: "fewer-less",
            stepNumber: 6,
            title: "Fewer vs Less: The Grocery Store Rule",
            icon: "🛒",
            explanation: `
                <h3>The Rule Everyone Gets Wrong</h3>
                <p>You've probably seen the supermarket sign: "10 items or less." Guess what? It's wrong! It should be "10 items or fewer" because items are countable.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 2px solid #7ba884;">
                            <h4 style="color: #7ba884; margin-top: 0;">FEWER = Count Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Comparing numbers</p>
                            <ul style="margin: 0;">
                                <li>fewer <strong>hours</strong></li>
                                <li>fewer <strong>employees</strong></li>
                                <li>fewer <strong>benefits</strong></li>
                                <li>fewer <strong>problems</strong></li>
                            </ul>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 2px solid #d97757;">
                            <h4 style="color: #d97757; margin-top: 0;">LESS = Non-Count Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Comparing amounts</p>
                            <ul style="margin: 0;">
                                <li>less <strong>time</strong></li>
                                <li>less <strong>stress</strong></li>
                                <li>less <strong>money</strong></li>
                                <li>less <strong>experience</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h4>Real-Life Comparisons:</h4>
                <ul>
                    <li>My new job has <strong>fewer hours</strong> but <strong>less stress</strong>.</li>
                    <li>This apartment has <strong>fewer rooms</strong> but costs <strong>less money</strong>.</li>
                    <li>We need <strong>fewer meetings</strong> and <strong>less paperwork</strong>!</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Memory Trick",
                content:
                    "FEWER has an 'e' like countablE. LESS has no 'e' like non-count (no 'e'). Also: if you can say 'number of,' use fewer. If you can say 'amount of,' use less.",
            },
            exercises: [
                {
                    id: "ex-fewer-less-1",
                    title: "Practice: Fewer or Less?",
                    instructions:
                        "Choose the correct word for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "This job offers ___ vacation days than my last one.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "fewer",
                        },
                        {
                            type: "radio",
                            label: "I want a job with ___ responsibility.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "less",
                        },
                        {
                            type: "radio",
                            label: "The new apartment has ___ bedrooms.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "fewer",
                        },
                        {
                            type: "radio",
                            label: "Working night shift means ___ traffic on my commute.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "less",
                        },
                    ],
                },
            ],
        },

        // Most vs Least
        {
            id: "most-least",
            stepNumber: 7,
            title: "Most vs Least: The Extremes",
            icon: "⚖️",
            explanation: `
                <h3>Talking About Extremes</h3>
                <p>Use <strong>most</strong> and <strong>least</strong> to describe the maximum and minimum in a group:</p>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>MOST = Maximum/Highest</h4>
                    <ul>
                        <li>This job has <strong>the most</strong> benefits.</li>
                        <li>Monday has <strong>the most</strong> traffic.</li>
                        <li>She does <strong>the most</strong> work on our team.</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>LEAST = Minimum/Lowest</h4>
                    <ul>
                        <li>This option costs <strong>the least</strong> money.</li>
                        <li>Wednesday has <strong>the least</strong> traffic.</li>
                        <li>That job requires <strong>the least</strong> experience.</li>
                    </ul>
                </div>

                <h4>Good News!</h4>
                <p>MOST and LEAST work with BOTH count and non-count nouns:</p>
                <ul>
                    <li>the most <strong>hours</strong> (count)</li>
                    <li>the most <strong>time</strong> (non-count)</li>
                    <li>the least <strong>problems</strong> (count)</li>
                    <li>the least <strong>stress</strong> (non-count)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-most-least-1",
                    title: "Practice: Real-Life Comparisons",
                    instructions:
                        "Complete these apartment/job comparison sentences.",
                    items: [
                        {
                            type: "text",
                            label: "1. Apartment A has 2 bedrooms, B has 3, C has 1. Apartment C has ___ bedrooms. (Use: the fewest OR the least)",
                            expectedAnswer: "the fewest",
                        },
                        {
                            type: "text",
                            label: "2. Job A offers $15/hr, B offers $18/hr, C offers $20/hr. Job C pays ___ money. (Use: the most)",
                            expectedAnswer: "the most",
                        },
                        {
                            type: "text",
                            label: "3. Of all my coworkers, Maria has ___ experience (she's been here 10 years). (Use: the most)",
                            expectedAnswer: "the most",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Quick Reference: Superlatives & Quantifiers Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>Superlatives</h3>
                <ul>
                    <li><strong>Short adjectives:</strong> the + -est → the cheapest, the oldest, the biggest</li>
                    <li><strong>Long adjectives:</strong> the most/least + adjective → the most expensive, the least crowded</li>
                    <li><strong>Irregular:</strong> good → the best, bad → the worst</li>
                </ul>

                <h3>Quantifiers Cheat Sheet</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Quantifier</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Use With</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>many</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Count nouns</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">many jobs, many hours</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>much</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Non-count nouns</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">much time, much stress</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>few</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Count nouns (not enough)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">few options, few applicants</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>little</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Non-count nouns (not enough)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">little money, little hope</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>fewer</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Count nouns (comparison)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">fewer hours, fewer problems</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>less</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Non-count nouns (comparison)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">less time, less stress</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>most/least</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Both!</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">the most hours, the most time</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Mistakes to Avoid:</h3>
                <ul>
                    <li>❌ "much hours" → ✅ "many hours" (hours are countable)</li>
                    <li>❌ "less employees" → ✅ "fewer employees" (employees are countable)</li>
                    <li>❌ "the most cheap" → ✅ "the cheapest" (short adjective = -est)</li>
                    <li>❌ "more better" → ✅ "better" (better already means "more good")</li>
                </ul>
            `,
            tipBox: {
                title: "💡 The Ultimate Test",
                content:
                    "Count vs non-count? Ask: Can I say 'one ___'? If yes → count (use many/few/fewer). If no → non-count (use much/little/less). Examples: 'one hour' works (count), but 'one time' sounds weird (non-count).",
            },
            exercises: [
                {
                    id: "sq-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the best answer for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "How ___ time do you have before class? (time = non-count)",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" },
                            ],
                            expectedAnswer: "much",
                        },
                        {
                            type: "radio",
                            label: "This is ___ apartment in the building. (cheap)",
                            options: [
                                { value: "the-cheapest", label: "the cheapest" },
                                { value: "the-most-cheap", label: "the most cheap" },
                            ],
                            expectedAnswer: "the-cheapest",
                        },
                        {
                            type: "radio",
                            label: "My new job has ___ meetings than my old one. (meetings = count)",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "fewer",
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
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "This is the most cheap apartment in the building." },
                { value: "b", label: "This is the cheaper apartment in the building." },
                { value: "c", label: "This is the cheapest apartment in the building." },
            ],
            correctAnswer: "c",
            explanation: "'Cheap' is a short adjective (1 syllable), so use -est: the cheapest.",
        },
        {
            id: "quiz-2",
            question: "Choose the correct quantifier: 'How ___ experience do you have?'",
            options: [
                { value: "a", label: "many" },
                { value: "b", label: "much" },
                { value: "c", label: "few" },
            ],
            correctAnswer: "b",
            explanation: "'Experience' is uncountable, so use 'much.' You can't say 'one experience' in this context.",
        },
        {
            id: "quiz-3",
            question: "Which is correct? 'My new job has ___ hours than my old one.'",
            options: [
                { value: "a", label: "fewer" },
                { value: "b", label: "less" },
                { value: "c", label: "few" },
            ],
            correctAnswer: "a",
            explanation: "'Hours' are countable (1 hour, 2 hours), so use 'fewer' for comparisons.",
        },
        {
            id: "quiz-4",
            question: "What's the best completion? 'I have very ___ time before my shift starts.'",
            options: [
                { value: "a", label: "few" },
                { value: "b", label: "little" },
                { value: "c", label: "less" },
            ],
            correctAnswer: "b",
            explanation: "'Time' is uncountable, and we're not comparing, so 'little' is correct (very little = almost none).",
        },
        {
            id: "quiz-5",
            question: "Which sentence correctly uses superlatives AND quantifiers? 'Of all the options, this apartment has...'",
            options: [
                { value: "a", label: "the most space and the fewer problems." },
                { value: "b", label: "the most space and the fewest problems." },
                { value: "c", label: "the much space and the least problems." },
            ],
            correctAnswer: "b",
            explanation: "'The most space' (superlative + non-count) and 'the fewest problems' (superlative + count) are both correct.",
        },
    ],
};
