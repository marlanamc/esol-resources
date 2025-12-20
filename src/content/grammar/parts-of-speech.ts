import type { InteractiveGuideContent } from "@/types/activity";

export const partsOfSpeechContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Parts of Speech: The Building Blocks of English",
            icon: "🧱",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Every sentence you speak is built from four main building blocks: <span style="color: #3b82f6;">nouns</span>, <span style="color: #dc2626;">verbs</span>, <span style="color: #16a34a;">adjectives</span>, and <span style="color: #9333ea;">adverbs</span>. Understanding these parts helps you build stronger, clearer sentences.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Parts of speech are the foundation of everything in English:</p>
                <ul>
                    <li><strong>Building sentences:</strong> You need to know what type of word goes where</li>
                    <li><strong>Understanding grammar:</strong> Most grammar rules are based on parts of speech</li>
                    <li><strong>Expanding vocabulary:</strong> One word can change forms (work → worker → working)</li>
                    <li><strong>Fixing mistakes:</strong> Knowing parts of speech helps you spot and fix errors</li>
                </ul>
            `,
            exercises: [
                {
                    id: "parts-intro-1",
                    title: "Quick Check: Identify the Word Type",
                    instructions: "What part of speech is the highlighted word?",
                    items: [
                        {
                            type: "radio",
                            label: "I <strong>work</strong> on Tuesdays.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "verb",
                        },
                        {
                            type: "radio",
                            label: "This is a <strong>small</strong> class.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "adjective",
                        },
                    ],
                },
            ],
        },

        {
            id: "nouns",
            stepNumber: 1,
            title: "Nouns: People, Places, Things, and Ideas",
            icon: "🔵",
            explanation: `
                <h3>What Is a Noun?</h3>
                <p>A <strong>noun</strong> is a word that names a person, place, thing, or idea. If you can see it, touch it, or think about it - it's probably a noun!</p>
            `,
            usageMeanings: [
                {
                    title: "👤 People",
                    description: "Names of people or their roles",
                    examples: [
                        {
                            sentence: "My <strong style='color: #3b82f6;'>teacher</strong> helps me learn English.",
                            explanation: "✓ A person and their role"
                        },
                        {
                            sentence: "<strong style='color: #3b82f6;'>Maria</strong> works at the hospital as a <strong style='color: #3b82f6;'>nurse</strong>.",
                            explanation: "✓ A specific person (proper noun) and a job title"
                        },
                        {
                            sentence: "The <strong style='color: #3b82f6;'>students</strong> are studying for the test.",
                            explanation: "✓ A group of people"
                        },
                    ],
                },
                {
                    title: "📍 Places",
                    description: "Locations, buildings, cities, countries",
                    examples: [
                        {
                            sentence: "I live in <strong style='color: #3b82f6;'>Boston</strong>, <strong style='color: #3b82f6;'>Massachusetts</strong>.",
                            explanation: "✓ City and state names (proper nouns)"
                        },
                        {
                            sentence: "The <strong style='color: #3b82f6;'>clinic</strong> is on <strong style='color: #3b82f6;'>Main Street</strong>.",
                            explanation: "✓ A building and a street name"
                        },
                        {
                            sentence: "We're going to the <strong style='color: #3b82f6;'>park</strong> after <strong style='color: #3b82f6;'>work</strong>.",
                            explanation: "✓ Common place nouns"
                        },
                    ],
                },
                {
                    title: "📦 Things",
                    description: "Objects you can see, touch, or use",
                    examples: [
                        {
                            sentence: "I need to buy <strong style='color: #3b82f6;'>bread</strong>, <strong style='color: #3b82f6;'>milk</strong>, and <strong style='color: #3b82f6;'>eggs</strong>.",
                            explanation: "✓ Concrete objects you can touch"
                        },
                        {
                            sentence: "My <strong style='color: #3b82f6;'>phone</strong> is on the <strong style='color: #3b82f6;'>table</strong>.",
                            explanation: "✓ Everyday objects"
                        },
                        {
                            sentence: "The <strong style='color: #3b82f6;'>car</strong> won't start in cold <strong style='color: #3b82f6;'>weather</strong>.",
                            explanation: "✓ Vehicles and natural phenomena"
                        },
                    ],
                },
                {
                    title: "💭 Ideas & Feelings",
                    description: "Abstract concepts you can't touch but can think about",
                    examples: [
                        {
                            sentence: "<strong style='color: #3b82f6;'>Health</strong> is more important than <strong style='color: #3b82f6;'>money</strong>.",
                            explanation: "✓ Abstract concepts"
                        },
                        {
                            sentence: "I need more <strong style='color: #3b82f6;'>time</strong> and less <strong style='color: #3b82f6;'>stress</strong>.",
                            explanation: "✓ Ideas and feelings"
                        },
                        {
                            sentence: "Her <strong style='color: #3b82f6;'>happiness</strong> shows in her <strong style='color: #3b82f6;'>smile</strong>.",
                            explanation: "✓ Emotions and expressions"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-nouns-1",
                    title: "Quick Practice: Nouns",
                    instructions: "What part of speech is the highlighted word?",
                    items: [
                        {
                            type: "radio",
                            label: "My <strong>neighbor</strong> has a friendly dog.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "noun",
                        },
                        {
                            type: "radio",
                            label: "We took the <strong>bus</strong> to class.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "noun",
                        },
                        {
                            type: "radio",
                            label: "<strong>Patience</strong> is important when you learn a language.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "noun",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Can you put 'a', 'an', or 'the' before it? (a book, the car, an idea) → It's probably a noun!",
            },
        },

        {
            id: "verbs",
            stepNumber: 2,
            title: "Verbs: Action and State",
            icon: "🔴",
            explanation: `
                <h3>What Is a Verb?</h3>
                <p>A <strong>verb</strong> is a word that shows action (what you do) or state (how you are). Every sentence needs a verb!</p>
            `,
            usageMeanings: [
                {
                    title: "🏃 Action Verbs",
                    description: "Physical or mental actions you can do",
                    examples: [
                        {
                            sentence: "I <strong style='color: #dc2626;'>work</strong> at the hospital.",
                            explanation: "✓ What you do for a living"
                        },
                        {
                            sentence: "She <strong style='color: #dc2626;'>walks</strong> to the bus stop every morning.",
                            explanation: "✓ Physical movement"
                        },
                        {
                            sentence: "We <strong style='color: #dc2626;'>study</strong> English twice a week.",
                            explanation: "✓ Mental action"
                        },
                        {
                            sentence: "The doctor <strong style='color: #dc2626;'>checked</strong> my blood pressure.",
                            explanation: "✓ Professional action"
                        },
                    ],
                },
                {
                    title: "🧘 State Verbs (Be, Have, Feel)",
                    description: "How you are, what you have, or how you feel",
                    examples: [
                        {
                            sentence: "I <strong style='color: #dc2626;'>am</strong> tired today.",
                            explanation: "✓ Your current state (be verb)"
                        },
                        {
                            sentence: "She <strong style='color: #dc2626;'>has</strong> three children.",
                            explanation: "✓ What you possess (have)"
                        },
                        {
                            sentence: "They <strong style='color: #dc2626;'>feel</strong> stressed about the deadline.",
                            explanation: "✓ Emotional state"
                        },
                        {
                            sentence: "The coffee <strong style='color: #dc2626;'>tastes</strong> good.",
                            explanation: "✓ Sensory state"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-verbs-1",
                    title: "Quick Practice: Verbs",
                    instructions: "What part of speech is the highlighted word?",
                    items: [
                        {
                            type: "radio",
                            label: "I <strong>cook</strong> dinner after work.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "verb",
                        },
                        {
                            type: "radio",
                            label: "She <strong>is</strong> sick today.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "verb",
                        },
                        {
                            type: "radio",
                            label: "We <strong>need</strong> more time for practice.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "verb",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Can you add -ing to it and use it after 'I am'? (I am walking, I am thinking) → It's probably a verb!",
            },
        },

        {
            id: "adjectives",
            stepNumber: 3,
            title: "Adjectives: Describing Words",
            icon: "🟢",
            explanation: `
                <h3>What Is an Adjective?</h3>
                <p>An <strong>adjective</strong> describes or gives more information about a noun. It answers questions like: What kind? How many? Which one?</p>
            `,
            usageMeanings: [
                {
                    title: "🎨 What Kind? (Quality)",
                    description: "Describing the type, quality, or characteristics",
                    examples: [
                        {
                            sentence: "The <strong style='color: #16a34a;'>warm</strong> weather makes me happy.",
                            explanation: "✓ Describes temperature (what kind of weather?)"
                        },
                        {
                            sentence: "She's a <strong style='color: #16a34a;'>good</strong> teacher.",
                            explanation: "✓ Describes quality (what kind of teacher?)"
                        },
                        {
                            sentence: "I need a <strong style='color: #16a34a;'>quiet</strong> place to study.",
                            explanation: "✓ Describes atmosphere"
                        },
                    ],
                },
                {
                    title: "🔢 How Many? (Quantity)",
                    description: "Telling the number or amount",
                    examples: [
                        {
                            sentence: "I have <strong style='color: #16a34a;'>two</strong> jobs.",
                            explanation: "✓ Exact number"
                        },
                        {
                            sentence: "There are <strong style='color: #16a34a;'>many</strong> students in the class.",
                            explanation: "✓ Large quantity (not exact)"
                        },
                        {
                            sentence: "I need <strong style='color: #16a34a;'>more</strong> time to finish.",
                            explanation: "✓ Comparative quantity"
                        },
                    ],
                },
                {
                    title: "👉 Which One? (Specific)",
                    description: "Pointing out which specific one",
                    examples: [
                        {
                            sentence: "<strong style='color: #16a34a;'>This</strong> book is helpful.",
                            explanation: "✓ Pointing to a specific book (near)"
                        },
                        {
                            sentence: "I want <strong style='color: #16a34a;'>that</strong> job.",
                            explanation: "✓ Pointing to a specific job (far)"
                        },
                        {
                            sentence: "<strong style='color: #16a34a;'>My</strong> apartment is small.",
                            explanation: "✓ Showing ownership"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-adjectives-1",
                    title: "Quick Practice: Adjectives",
                    instructions: "What part of speech is the highlighted word?",
                    items: [
                        {
                            type: "radio",
                            label: "I had a <strong>busy</strong> day.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "adjective",
                        },
                        {
                            type: "radio",
                            label: "This is a <strong>small</strong> apartment.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "adjective",
                        },
                        {
                            type: "radio",
                            label: "I need <strong>more</strong> water.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "adjective",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Can you put it between 'the' and a noun? (the TALL building, the BLUE car) → It's probably an adjective!",
            },
        },

        {
            id: "adverbs",
            stepNumber: 4,
            title: "Adverbs: How, When, Where, How Much",
            icon: "🟣",
            explanation: `
                <h3>What Is an Adverb?</h3>
                <p>An <strong>adverb</strong> describes a verb (how you do something), an adjective (how much), or another adverb. Many adverbs end in -ly.</p>
            `,
            usageMeanings: [
                {
                    title: "🏃 How? (Manner)",
                    description: "Describing how an action is done",
                    examples: [
                        {
                            sentence: "She speaks English <strong style='color: #9333ea;'>fluently</strong>.",
                            explanation: "✓ How she speaks (manner)"
                        },
                        {
                            sentence: "Drive <strong style='color: #9333ea;'>carefully</strong> in the rain.",
                            explanation: "✓ How to drive"
                        },
                        {
                            sentence: "He works <strong style='color: #9333ea;'>hard</strong> every day.",
                            explanation: "✓ How he works (no -ly, but still an adverb!)"
                        },
                    ],
                },
                {
                    title: "⏰ When? (Time)",
                    description: "Telling when something happens",
                    examples: [
                        {
                            sentence: "I <strong style='color: #9333ea;'>always</strong> eat breakfast.",
                            explanation: "✓ Frequency (how often)"
                        },
                        {
                            sentence: "She called me <strong style='color: #9333ea;'>yesterday</strong>.",
                            explanation: "✓ Specific time in the past"
                        },
                        {
                            sentence: "I'll do it <strong style='color: #9333ea;'>later</strong>.",
                            explanation: "✓ Future time"
                        },
                    ],
                },
                {
                    title: "📍 Where? (Place)",
                    description: "Telling where something happens",
                    examples: [
                        {
                            sentence: "Come <strong style='color: #9333ea;'>here</strong>.",
                            explanation: "✓ Location (near the speaker)"
                        },
                        {
                            sentence: "I left my keys <strong style='color: #9333ea;'>there</strong>.",
                            explanation: "✓ Location (away from speaker)"
                        },
                        {
                            sentence: "Let's go <strong style='color: #9333ea;'>outside</strong>.",
                            explanation: "✓ Direction/location"
                        },
                    ],
                },
                {
                    title: "📊 How Much? (Degree)",
                    description: "Showing intensity or degree",
                    examples: [
                        {
                            sentence: "I'm <strong style='color: #9333ea;'>very</strong> tired.",
                            explanation: "✓ Describes how tired (degree)"
                        },
                        {
                            sentence: "The test was <strong style='color: #9333ea;'>extremely</strong> difficult.",
                            explanation: "✓ How difficult (intensity)"
                        },
                        {
                            sentence: "She speaks <strong style='color: #9333ea;'>too</strong> fast.",
                            explanation: "✓ Excessive degree"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-adverbs-1",
                    title: "Quick Practice: Adverbs",
                    instructions: "What part of speech is the highlighted word?",
                    items: [
                        {
                            type: "radio",
                            label: "He drives <strong>carefully</strong> in the rain.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "adverb",
                        },
                        {
                            type: "radio",
                            label: "I <strong>always</strong> drink water in the morning.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "adverb",
                        },
                        {
                            type: "radio",
                            label: "The music is <strong>too</strong> loud.",
                            options: [
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                            ],
                            expectedAnswer: "adverb",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Does it end in -ly and describe HOW something is done? (quickly, carefully, easily) → It's probably an adverb!",
            },
        },

        {
            id: "practice",
            stepNumber: 5,
            title: "Practice: Identify the Parts of Speech",
            icon: "✏️",
            explanation: `
                <h3>Let's Practice!</h3>
                <p>Read each sentence and identify the parts of speech. Use the color-coding system:</p>
                <ul>
                    <li><strong style='color: #3b82f6;'>Blue = Noun</strong></li>
                    <li><strong style='color: #dc2626;'>Red = Verb</strong></li>
                    <li><strong style='color: #16a34a;'>Green = Adjective</strong></li>
                    <li><strong style='color: #9333ea;'>Purple = Adverb</strong></li>
                </ul>
            `,
            exercises: [
                {
                    id: "parts-practice-1",
                    title: "Identify Parts of Speech",
                    instructions: "What part of speech is the highlighted word?",
                    items: [
                        {
                            type: "radio",
                            label: "The <strong>doctor</strong> checked my blood pressure.",
                            options: [
                                { value: "noun", label: "Noun (person, place, thing, idea)" },
                                { value: "verb", label: "Verb (action or state)" },
                                { value: "adjective", label: "Adjective (describes noun)" },
                                { value: "adverb", label: "Adverb (describes verb/adjective)" },
                            ],
                            expectedAnswer: "noun",
                        },
                        {
                            type: "radio",
                            label: "I <strong>walk</strong> to work every day.",
                            options: [
                                { value: "noun", label: "Noun (person, place, thing, idea)" },
                                { value: "verb", label: "Verb (action or state)" },
                                { value: "adjective", label: "Adjective (describes noun)" },
                                { value: "adverb", label: "Adverb (describes verb/adjective)" },
                            ],
                            expectedAnswer: "verb",
                        },
                        {
                            type: "radio",
                            label: "She's a <strong>good</strong> teacher.",
                            options: [
                                { value: "noun", label: "Noun (person, place, thing, idea)" },
                                { value: "verb", label: "Verb (action or state)" },
                                { value: "adjective", label: "Adjective (describes noun)" },
                                { value: "adverb", label: "Adverb (describes verb/adjective)" },
                            ],
                            expectedAnswer: "adjective",
                        },
                        {
                            type: "radio",
                            label: "He speaks English <strong>fluently</strong>.",
                            options: [
                                { value: "noun", label: "Noun (person, place, thing, idea)" },
                                { value: "verb", label: "Verb (action or state)" },
                                { value: "adjective", label: "Adjective (describes noun)" },
                                { value: "adverb", label: "Adverb (describes verb/adjective)" },
                            ],
                            expectedAnswer: "adverb",
                        },
                        {
                            type: "radio",
                            label: "My <strong>apartment</strong> is small.",
                            options: [
                                { value: "noun", label: "Noun (person, place, thing, idea)" },
                                { value: "verb", label: "Verb (action or state)" },
                                { value: "adjective", label: "Adjective (describes noun)" },
                                { value: "adverb", label: "Adverb (describes verb/adjective)" },
                            ],
                            expectedAnswer: "noun",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            stepNumber: 6,
            title: "Quick Reference",
            icon: "📋",
            explanation: `
                <h3>The Four Main Parts of Speech</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #3b82f6; margin-top: 0;">🔵 Nouns</h4>
                        <p><strong>What:</strong> Person, place, thing, or idea</p>
                        <p><strong>Examples:</strong> teacher, Boston, book, happiness</p>
                        <p><strong>Test:</strong> Can you add 'a/an/the'?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #dc2626; margin-top: 0;">🔴 Verbs</h4>
                        <p><strong>What:</strong> Action or state</p>
                        <p><strong>Examples:</strong> work, walk, am, have, feel</p>
                        <p><strong>Test:</strong> Can you add -ing after 'I am'?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(22, 163, 74, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #16a34a; margin-top: 0;">🟢 Adjectives</h4>
                        <p><strong>What:</strong> Describes a noun</p>
                        <p><strong>Examples:</strong> good, warm, two, this, my</p>
                        <p><strong>Test:</strong> Can it go between 'the' and a noun?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(147, 51, 234, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #9333ea; margin-top: 0;">🟣 Adverbs</h4>
                        <p><strong>What:</strong> Describes verb, adjective, or adverb</p>
                        <p><strong>Examples:</strong> fluently, always, here, very</p>
                        <p><strong>Test:</strong> Does it end in -ly or answer how/when/where?</p>
                    </div>
                </div>

                <h3>Word Families (Same Word, Different Parts)</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Noun</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Verb</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Adjective</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Adverb</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">work</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">work</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">working</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">teacher</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">teach</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">care</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">care</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">careful</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">carefully</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">happiness</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">happy</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">happily</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Learning word families helps you expand your vocabulary fast. If you know 'happy', you also know 'happiness' and 'happily'!",
            },
            exercises: [
                {
                    id: "parts-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the correct part of speech.",
                    items: [
                        {
                            type: "radio",
                            label: "She speaks very <strong>quickly</strong>.",
                            options: [
                                { value: "adverb", label: "Adverb" },
                                { value: "adjective", label: "Adjective" },
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                            ],
                            expectedAnswer: "adverb",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What part of speech is 'hospital' in: 'I work at the hospital'?",
            options: [
                { value: "a", label: "Noun" },
                { value: "b", label: "Verb" },
                { value: "c", label: "Adjective" },
                { value: "d", label: "Adverb" },
            ],
            correctAnswer: "a",
            explanation: "'Hospital' is a noun - it's a place/thing.",
        },
        {
            id: "quiz-2",
            question: "What part of speech is 'carefully' in: 'Drive carefully'?",
            options: [
                { value: "a", label: "Noun" },
                { value: "b", label: "Verb" },
                { value: "c", label: "Adjective" },
                { value: "d", label: "Adverb" },
            ],
            correctAnswer: "d",
            explanation: "'Carefully' is an adverb - it describes HOW to drive (ends in -ly).",
        },
        {
            id: "quiz-3",
            question: "What part of speech is 'good' in: 'She's a good teacher'?",
            options: [
                { value: "a", label: "Noun" },
                { value: "b", label: "Verb" },
                { value: "c", label: "Adjective" },
                { value: "d", label: "Adverb" },
            ],
            correctAnswer: "c",
            explanation: "'Good' is an adjective - it describes the noun 'teacher'.",
        },
        {
            id: "quiz-4",
            question: "What part of speech is 'walk' in: 'I walk to work'?",
            options: [
                { value: "a", label: "Noun" },
                { value: "b", label: "Verb" },
                { value: "c", label: "Adjective" },
                { value: "d", label: "Adverb" },
            ],
            correctAnswer: "b",
            explanation: "'Walk' is a verb - it's an action you do.",
        },
        {
            id: "quiz-5",
            question: "Which word is a noun in: 'The small cat sleeps quietly'?",
            options: [
                { value: "a", label: "small" },
                { value: "b", label: "cat" },
                { value: "c", label: "sleeps" },
                { value: "d", label: "quietly" },
            ],
            correctAnswer: "b",
            explanation: "'Cat' is the noun - it's a thing/animal. 'Small' is an adjective, 'sleeps' is a verb, 'quietly' is an adverb.",
        },
    ],
};
