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
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Every sentence you speak is built from <strong>eight essential building blocks</strong>: <span style="color: #3b82f6;">nouns</span>, <span style="color: #dc2626;">verbs</span>, <span style="color: #16a34a;">adjectives</span>, <span style="color: #9333ea;">adverbs</span>, <span style="color: #eab308;">pronouns</span>, <span style="color: #f97316;">articles</span>, <span style="color: #ea580c;">prepositions</span>, and <span style="color: #16a34a;">conjunctions</span>. Understanding these parts helps you build stronger, clearer sentences.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Parts of speech are the foundation of everything in English:</p>
                <ul>
                    <li><strong>Building sentences:</strong> You need to know what type of word goes where</li>
                    <li><strong>Understanding grammar:</strong> Most grammar rules are based on parts of speech</li>
                    <li><strong>Expanding vocabulary:</strong> One word can change forms (work → worker → working)</li>
                    <li><strong>Fixing mistakes:</strong> Knowing parts of speech helps you spot and fix errors</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Understanding classroom instructions ("Use an <em>adjective</em> to describe it")</li>
                        <li>Building better sentences when you speak (knowing where each word type goes)</li>
                        <li>Learning grammar terminology so you can understand future lessons</li>
                        <li>Practicing question formation (you need to know what a "verb" and "noun" are!)</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>Throughout the course, you'll use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Every week:</strong> Understanding what "gerund," "infinitive," "auxiliary verb," and "modal" mean</li>
                        <li><strong>Learning about gerunds vs infinitives</strong> (you need to know what a "verb" is first!)</li>
                        <li><strong>Understanding adverbs for workplace politeness:</strong> "Could you <em>possibly</em> help me?"</li>
                        <li><strong>Expanding vocabulary:</strong> If you know "happy" (adjective), you also know "happiness" (noun) and "happily" (adverb)</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🧱 Think of parts of speech as LEGO blocks - once you know what each piece does, you can build anything!</p>
                </div>
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
            id: "pronouns",
            stepNumber: 5,
            title: "Pronouns: Words That Replace Nouns",
            icon: "🟡",
            explanation: `
                <h3>What Is a Pronoun?</h3>
                <p>A <strong>pronoun</strong> is a word that takes the place of a noun. Instead of repeating "Maria" over and over, we can say "she."</p>
                <p><strong>Example:</strong> Maria went to work. <span style="color: #3b82f6;">Maria</span> is tired. → <span style="color: #eab308;">She</span> is tired.</p>
            `,
            usageMeanings: [
                {
                    title: "👤 Subject Pronouns (Before the Verb)",
                    description: "Who/what is doing the action - comes BEFORE the verb",
                    examples: [
                        {
                            sentence: "<strong style='color: #eab308;'>I</strong> work at the hospital.",
                            explanation: "✓ Subject doing the action (first person)"
                        },
                        {
                            sentence: "<strong style='color: #eab308;'>She</strong> speaks English well.",
                            explanation: "✓ Subject doing the action (third person female)"
                        },
                        {
                            sentence: "<strong style='color: #eab308;'>They</strong> are my classmates.",
                            explanation: "✓ Subject (plural)"
                        },
                        {
                            sentence: "<strong style='color: #eab308;'>We</strong> study on Tuesdays and Thursdays.",
                            explanation: "✓ Subject (first person plural)"
                        },
                    ],
                },
                {
                    title: "🎯 Object Pronouns (After the Verb)",
                    description: "Who/what receives the action - comes AFTER the verb",
                    examples: [
                        {
                            sentence: "The teacher helps <strong style='color: #eab308;'>me</strong> with grammar.",
                            explanation: "✓ Receiving the help (first person object)"
                        },
                        {
                            sentence: "I called <strong style='color: #eab308;'>him</strong> yesterday.",
                            explanation: "✓ Receiving the action (third person male object)"
                        },
                        {
                            sentence: "People like <strong style='color: #eab308;'>her</strong>. She's very kind.",
                            explanation: "✓ Receiving the liking (third person female object)"
                        },
                        {
                            sentence: "Can you help <strong style='color: #eab308;'>us</strong> with this?",
                            explanation: "✓ Receiving the help (first person plural object)"
                        },
                    ],
                },
                {
                    title: "🏠 Possessive Adjectives (My, Your, His, Her...)",
                    description: "Shows ownership - always comes before a noun",
                    examples: [
                        {
                            sentence: "This is <strong style='color: #eab308;'>my</strong> apartment.",
                            explanation: "✓ Shows who owns the apartment"
                        },
                        {
                            sentence: "<strong style='color: #eab308;'>His</strong> name is Carlos.",
                            explanation: "✓ Shows whose name"
                        },
                        {
                            sentence: "Where is <strong style='color: #eab308;'>your</strong> car?",
                            explanation: "✓ Shows who owns the car"
                        },
                        {
                            sentence: "<strong style='color: #eab308;'>Their</strong> children go to this school.",
                            explanation: "✓ Shows whose children (plural)"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-pronouns-1",
                    title: "Quick Practice: Pronouns",
                    instructions: "Choose the correct pronoun.",
                    items: [
                        {
                            type: "radio",
                            label: "Maria is tired. <strong>___</strong> worked all day.",
                            options: [
                                { value: "she", label: "She (subject pronoun)" },
                                { value: "her", label: "Her (object pronoun)" },
                                { value: "hers", label: "Hers (possessive)" },
                            ],
                            expectedAnswer: "she",
                        },
                        {
                            type: "radio",
                            label: "The teacher called <strong>___</strong> yesterday. (talking about yourself)",
                            options: [
                                { value: "i", label: "I (subject)" },
                                { value: "me", label: "Me (object pronoun)" },
                                { value: "my", label: "My (possessive)" },
                            ],
                            expectedAnswer: "me",
                        },
                        {
                            type: "radio",
                            label: "This is <strong>___</strong> book. (belongs to you)",
                            options: [
                                { value: "you", label: "You" },
                                { value: "your", label: "Your (possessive adjective)" },
                                { value: "yours", label: "Yours" },
                            ],
                            expectedAnswer: "your",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Common Mistake",
                content: "Don't say 'Me and my friend went to the store.' Say 'My friend and I went to the store.' Subject pronouns (I, he, she, we, they) come BEFORE the verb!",
            },
        },

        {
            id: "articles",
            stepNumber: 6,
            title: "Articles: a, an, the",
            icon: "🟠",
            explanation: `
                <h3>What Is an Article?</h3>
                <p>An <strong>article</strong> is a small word that comes before a noun. English has three articles: <strong>a</strong>, <strong>an</strong>, and <strong>the</strong>.</p>
            `,
            usageMeanings: [
                {
                    title: "📌 'a' - General, Consonant Sound",
                    description: "Use 'a' for general things (not specific) starting with a consonant SOUND",
                    examples: [
                        {
                            sentence: "I need <strong style='color: #f97316;'>a</strong> job.",
                            explanation: "✓ Any job (not a specific one), starts with 'j' sound"
                        },
                        {
                            sentence: "She's <strong style='color: #f97316;'>a</strong> teacher.",
                            explanation: "✓ General profession, starts with 't' sound"
                        },
                        {
                            sentence: "We saw <strong style='color: #f97316;'>a</strong> doctor at the clinic.",
                            explanation: "✓ Any doctor (not a specific one), starts with 'd' sound"
                        },
                    ],
                },
                {
                    title: "📌 'an' - General, Vowel Sound",
                    description: "Use 'an' for general things starting with a vowel SOUND (a, e, i, o, u)",
                    examples: [
                        {
                            sentence: "I ate <strong style='color: #f97316;'>an</strong> apple.",
                            explanation: "✓ Any apple, starts with 'a' sound"
                        },
                        {
                            sentence: "She's <strong style='color: #f97316;'>an</strong> engineer.",
                            explanation: "✓ General profession, starts with 'e' sound"
                        },
                        {
                            sentence: "It takes <strong style='color: #f97316;'>an</strong> hour to get there.",
                            explanation: "✓ Starts with vowel SOUND ('our'), even though 'h' is a consonant!"
                        },
                    ],
                },
                {
                    title: "📍 'the' - Specific (You Both Know Which One)",
                    description: "Use 'the' when talking about a SPECIFIC thing that both people know",
                    examples: [
                        {
                            sentence: "I need to go to <strong style='color: #f97316;'>the</strong> bank.",
                            explanation: "✓ Your specific bank (you both know which one)"
                        },
                        {
                            sentence: "<strong style='color: #f97316;'>The</strong> teacher said the test is on Thursday.",
                            explanation: "✓ Your specific teacher (everyone knows who)"
                        },
                        {
                            sentence: "Close <strong style='color: #f97316;'>the</strong> door, please.",
                            explanation: "✓ The specific door in this room (we can see it)"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-articles-1",
                    title: "Quick Practice: Articles",
                    instructions: "Choose the correct article.",
                    items: [
                        {
                            type: "radio",
                            label: "I need <strong>___</strong> apartment. (any apartment, not specific)",
                            options: [
                                { value: "a", label: "a" },
                                { value: "an", label: "an" },
                                { value: "the", label: "the" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "She works at <strong>___</strong> hospital. (starts with 'h' sound, not specific)",
                            options: [
                                { value: "a", label: "a" },
                                { value: "an", label: "an" },
                                { value: "the", label: "the" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I'm going to <strong>___</strong> store. (the specific store we always go to)",
                            options: [
                                { value: "a", label: "a" },
                                { value: "an", label: "an" },
                                { value: "the", label: "the" },
                            ],
                            expectedAnswer: "the",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Is it specific (you both know which one)? → Use 'the'. Is it general and starts with a vowel SOUND? → Use 'an'. Is it general and starts with a consonant sound? → Use 'a'.",
            },
        },

        {
            id: "prepositions",
            stepNumber: 7,
            title: "Prepositions: Location, Time, Direction",
            icon: "🔶",
            explanation: `
                <h3>What Is a Preposition?</h3>
                <p>A <strong>preposition</strong> shows the relationship between things - usually about time, location, or direction.</p>
                <p><strong>Common prepositions:</strong> in, on, at, to, from, between, next to, behind, in front of, under, over</p>
            `,
            usageMeanings: [
                {
                    title: "⏰ Time (in, on, at)",
                    description: "Shows when something happens",
                    examples: [
                        {
                            sentence: "Class is <strong style='color: #ea580c;'>at</strong> 6:00 PM.",
                            explanation: "✓ Specific time → use 'at'"
                        },
                        {
                            sentence: "I work <strong style='color: #ea580c;'>on</strong> Tuesdays.",
                            explanation: "✓ Days of the week → use 'on'"
                        },
                        {
                            sentence: "She was born <strong style='color: #ea580c;'>in</strong> January.",
                            explanation: "✓ Months/years/seasons → use 'in'"
                        },
                        {
                            sentence: "We have class <strong style='color: #ea580c;'>in</strong> the morning.",
                            explanation: "✓ General time period → use 'in'"
                        },
                    ],
                },
                {
                    title: "📍 Location (in, on, at)",
                    description: "Shows where something is",
                    examples: [
                        {
                            sentence: "I live <strong style='color: #ea580c;'>in</strong> Boston.",
                            explanation: "✓ City/country → use 'in'"
                        },
                        {
                            sentence: "The book is <strong style='color: #ea580c;'>on</strong> the table.",
                            explanation: "✓ Surface contact → use 'on'"
                        },
                        {
                            sentence: "I'm <strong style='color: #ea580c;'>at</strong> work right now.",
                            explanation: "✓ Specific location/place → use 'at'"
                        },
                        {
                            sentence: "The bank is <strong style='color: #ea580c;'>next to</strong> the post office.",
                            explanation: "✓ Beside/adjacent to something"
                        },
                    ],
                },
                {
                    title: "➡️ Direction (to, from, into, through)",
                    description: "Shows movement from one place to another",
                    examples: [
                        {
                            sentence: "I walk <strong style='color: #ea580c;'>to</strong> work every day.",
                            explanation: "✓ Moving toward a destination"
                        },
                        {
                            sentence: "She's coming <strong style='color: #ea580c;'>from</strong> the hospital.",
                            explanation: "✓ Starting point of movement"
                        },
                        {
                            sentence: "Come <strong style='color: #ea580c;'>into</strong> the classroom.",
                            explanation: "✓ Movement from outside to inside"
                        },
                        {
                            sentence: "We drove <strong style='color: #ea580c;'>through</strong> the city.",
                            explanation: "✓ Movement passing through something"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-prepositions-1",
                    title: "Quick Practice: Prepositions",
                    instructions: "Choose the correct preposition.",
                    items: [
                        {
                            type: "radio",
                            label: "Class starts <strong>___</strong> 6:00 PM.",
                            options: [
                                { value: "in", label: "in" },
                                { value: "on", label: "on" },
                                { value: "at", label: "at (for specific time)" },
                            ],
                            expectedAnswer: "at",
                        },
                        {
                            type: "radio",
                            label: "I live <strong>___</strong> Main Street.",
                            options: [
                                { value: "in", label: "in" },
                                { value: "on", label: "on (for streets)" },
                                { value: "at", label: "at" },
                            ],
                            expectedAnswer: "on",
                        },
                        {
                            type: "radio",
                            label: "She's going <strong>___</strong> the store.",
                            options: [
                                { value: "to", label: "to (direction toward)" },
                                { value: "at", label: "at" },
                                { value: "in", label: "in" },
                            ],
                            expectedAnswer: "to",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Common Patterns",
                content: "Time: at 6:00, on Tuesday, in January. Location: in Boston, on Main Street, at the hospital. Direction: to work, from home, into the room.",
            },
        },

        {
            id: "conjunctions",
            stepNumber: 8,
            title: "Conjunctions: Connecting Words (FANBOYS)",
            icon: "🔗",
            explanation: `
                <h3>What Is a Conjunction?</h3>
                <p>A <strong>conjunction</strong> is a word that connects two ideas in a sentence. The most common ones are called <strong>FANBOYS</strong>:</p>
                <p><strong>F</strong>or, <strong>A</strong>nd, <strong>N</strong>or, <strong>B</strong>ut, <strong>O</strong>r, <strong>Y</strong>et, <strong>S</strong>o</p>
            `,
            usageMeanings: [
                {
                    title: "➕ 'and' - Adding Information",
                    description: "Connects two similar ideas",
                    examples: [
                        {
                            sentence: "I work on Tuesdays <strong style='color: #16a34a;'>and</strong> Thursdays.",
                            explanation: "✓ Adding two days together"
                        },
                        {
                            sentence: "She speaks English <strong style='color: #16a34a;'>and</strong> Spanish.",
                            explanation: "✓ Two languages, both true"
                        },
                        {
                            sentence: "I need to buy milk <strong style='color: #16a34a;'>and</strong> bread.",
                            explanation: "✓ Adding items to a list"
                        },
                    ],
                },
                {
                    title: "⚡ 'but' - Contrasting Ideas",
                    description: "Shows contrast or unexpected information",
                    examples: [
                        {
                            sentence: "I'm tired, <strong style='color: #16a34a;'>but</strong> I need to work.",
                            explanation: "✓ Contrasting two ideas (tired vs working)"
                        },
                        {
                            sentence: "The apartment is small, <strong style='color: #16a34a;'>but</strong> it's cheap.",
                            explanation: "✓ Showing contrast (size vs price)"
                        },
                        {
                            sentence: "She studied hard, <strong style='color: #16a34a;'>but</strong> she didn't pass.",
                            explanation: "✓ Unexpected result"
                        },
                    ],
                },
                {
                    title: "❓ 'or' - Choices/Options",
                    description: "Shows alternatives or options",
                    examples: [
                        {
                            sentence: "Do you want tea <strong style='color: #16a34a;'>or</strong> coffee?",
                            explanation: "✓ Giving a choice between two options"
                        },
                        {
                            sentence: "We can go now <strong style='color: #16a34a;'>or</strong> wait until later.",
                            explanation: "✓ Two possible options"
                        },
                        {
                            sentence: "Is that your phone <strong style='color: #16a34a;'>or</strong> mine?",
                            explanation: "✓ Question with two options"
                        },
                    ],
                },
                {
                    title: "📌 'so' - Result/Consequence",
                    description: "Shows the result or reason for something",
                    examples: [
                        {
                            sentence: "I was tired, <strong style='color: #16a34a;'>so</strong> I went to bed early.",
                            explanation: "✓ Result of being tired → went to bed"
                        },
                        {
                            sentence: "It's raining, <strong style='color: #16a34a;'>so</strong> take an umbrella.",
                            explanation: "✓ Because it's raining → consequence is take umbrella"
                        },
                        {
                            sentence: "She studied hard, <strong style='color: #16a34a;'>so</strong> she passed the test.",
                            explanation: "✓ Result of studying → passed"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-conjunctions-1",
                    title: "Quick Practice: Conjunctions",
                    instructions: "Choose the correct conjunction.",
                    items: [
                        {
                            type: "radio",
                            label: "I want to go, <strong>___</strong> I'm too tired.",
                            options: [
                                { value: "and", label: "and" },
                                { value: "but", label: "but (shows contrast)" },
                                { value: "or", label: "or" },
                            ],
                            expectedAnswer: "but",
                        },
                        {
                            type: "radio",
                            label: "Do you work on Tuesdays <strong>___</strong> Thursdays?",
                            options: [
                                { value: "and", label: "and (both days)" },
                                { value: "but", label: "but" },
                                { value: "or", label: "or (one or the other)" },
                            ],
                            expectedAnswer: "or",
                        },
                        {
                            type: "radio",
                            label: "It's cold outside, <strong>___</strong> wear a jacket.",
                            options: [
                                { value: "and", label: "and" },
                                { value: "but", label: "but" },
                                { value: "so", label: "so (result/consequence)" },
                            ],
                            expectedAnswer: "so",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Remember FANBOYS",
                content: "For, And, Nor, But, Or, Yet, So - these are the seven main conjunctions. The most common ones you'll use daily are: and, but, or, so.",
            },
        },

        {
            id: "practice",
            stepNumber: 9,
            title: "Practice: Identify the Parts of Speech",
            icon: "✏️",
            explanation: `
                <h3>Let's Practice All 8 Parts!</h3>
                <p>Read each sentence and identify the parts of speech. Use the color-coding system:</p>
                <ul>
                    <li><strong style='color: #3b82f6;'>Blue = Noun</strong> (person, place, thing, idea)</li>
                    <li><strong style='color: #dc2626;'>Red = Verb</strong> (action or state)</li>
                    <li><strong style='color: #16a34a;'>Green = Adjective</strong> (describes noun)</li>
                    <li><strong style='color: #9333ea;'>Purple = Adverb</strong> (describes verb/adjective)</li>
                    <li><strong style='color: #eab308;'>Yellow = Pronoun</strong> (replaces noun)</li>
                    <li><strong style='color: #f97316;'>Orange = Article</strong> (a, an, the)</li>
                    <li><strong style='color: #ea580c;'>Dark Orange = Preposition</strong> (in, on, at, to, from...)</li>
                    <li><strong style='color: #16a34a;'>Dark Green = Conjunction</strong> (and, but, or, so...)</li>
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
            stepNumber: 10,
            title: "Quick Reference",
            icon: "📋",
            explanation: `
                <h3>All 8 Parts of Speech - Quick Reference</h3>

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

                    <div style="padding: 1rem; background: rgba(234, 179, 8, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #eab308; margin-top: 0;">🟡 Pronouns</h4>
                        <p><strong>What:</strong> Replaces a noun</p>
                        <p><strong>Examples:</strong> I, you, he, she, it, we, they, me, him, her, us, them</p>
                        <p><strong>Test:</strong> Can it replace a person's name?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(249, 115, 22, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #f97316; margin-top: 0;">🟠 Articles</h4>
                        <p><strong>What:</strong> Small words before nouns</p>
                        <p><strong>Examples:</strong> a, an, the</p>
                        <p><strong>Test:</strong> Only 3 in English - a, an, the!</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(234, 88, 12, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #ea580c; margin-top: 0;">🔶 Prepositions</h4>
                        <p><strong>What:</strong> Shows time, location, direction</p>
                        <p><strong>Examples:</strong> in, on, at, to, from, between, next to</p>
                        <p><strong>Test:</strong> Does it show where, when, or which direction?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(22, 163, 74, 0.15); border-radius: 0.5rem;">
                        <h4 style="color: #16a34a; margin-top: 0;">🔗 Conjunctions</h4>
                        <p><strong>What:</strong> Connects two ideas</p>
                        <p><strong>Examples:</strong> and, but, or, so (FANBOYS)</p>
                        <p><strong>Test:</strong> Does it join two sentences or ideas?</p>
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
            question: "What part of speech is 'she' in: 'She works at the hospital'?",
            options: [
                { value: "a", label: "Noun" },
                { value: "b", label: "Verb" },
                { value: "c", label: "Pronoun" },
                { value: "d", label: "Article" },
            ],
            correctAnswer: "c",
            explanation: "'She' is a pronoun - it replaces a person's name (subject pronoun).",
        },
        {
            id: "quiz-6",
            question: "What part of speech is 'the' in: 'I went to the store'?",
            options: [
                { value: "a", label: "Preposition" },
                { value: "b", label: "Article" },
                { value: "c", label: "Conjunction" },
                { value: "d", label: "Pronoun" },
            ],
            correctAnswer: "b",
            explanation: "'The' is an article - one of only 3 articles in English (a, an, the).",
        },
        {
            id: "quiz-7",
            question: "What part of speech is 'at' in: 'Class starts at 6:00 PM'?",
            options: [
                { value: "a", label: "Pronoun" },
                { value: "b", label: "Article" },
                { value: "c", label: "Preposition" },
                { value: "d", label: "Conjunction" },
            ],
            correctAnswer: "c",
            explanation: "'At' is a preposition - it shows time (when the class starts).",
        },
        {
            id: "quiz-8",
            question: "What part of speech is 'but' in: 'I'm tired, but I need to work'?",
            options: [
                { value: "a", label: "Preposition" },
                { value: "b", label: "Conjunction" },
                { value: "c", label: "Adverb" },
                { value: "d", label: "Pronoun" },
            ],
            correctAnswer: "b",
            explanation: "'But' is a conjunction - it connects two contrasting ideas (FANBOYS).",
        },
        {
            id: "quiz-9",
            question: "Choose the correct pronoun: 'The teacher called ___ yesterday.' (talking about yourself)",
            options: [
                { value: "a", label: "I" },
                { value: "b", label: "me" },
                { value: "c", label: "my" },
                { value: "d", label: "mine" },
            ],
            correctAnswer: "b",
            explanation: "'Me' is correct - it's an object pronoun (comes after the verb). 'I' is a subject pronoun (comes before the verb).",
        },
        {
            id: "quiz-10",
            question: "Choose the correct preposition: 'Class is ___ Tuesdays.'",
            options: [
                { value: "a", label: "in" },
                { value: "b", label: "at" },
                { value: "c", label: "on" },
                { value: "d", label: "to" },
            ],
            correctAnswer: "c",
            explanation: "'On' is correct - we use 'on' for days of the week (on Monday, on Tuesday, etc.).",
        },
    ],
};
