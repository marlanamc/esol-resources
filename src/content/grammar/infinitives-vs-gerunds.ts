import type { InteractiveGuideContent } from "@/types/activity";

export const infinitivesVsGerundsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Infinitives vs Gerunds: To Do or Doing?",
            icon: "🤔",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"I want to work here" or "I want working here"? "I enjoy to cook" or "I enjoy cooking"? There are <strong>6 essential patterns</strong> for using gerunds and infinitives. Master these, and you'll sound like a native speaker!</p>
                </div>

                <h3>The 6 Patterns You'll Learn</h3>
                <ol>
                    <li><strong>Subject = Gerund:</strong> "Swimming is fun!" "Cooking takes time"</li>
                    <li><strong>Verb + Gerund:</strong> "I enjoy cooking" "She stopped smoking"</li>
                    <li><strong>Preposition + Gerund:</strong> "I'm good at cooking" "Thank you for helping"</li>
                    <li><strong>Adjective + Infinitive:</strong> "It's nice to meet you" "It's important to be on time"</li>
                    <li><strong>Noun + Infinitive:</strong> "I asked him to help" "She wants me to call"</li>
                    <li><strong>Verb + Infinitive:</strong> "I want to work here" "She decided to apply"</li>
                </ol>

                <h3>Why This Matters</h3>
                <p>These patterns are everywhere in daily conversation:</p>
                <ul>
                    <li><strong>At work:</strong> "I decided <em>to apply</em>" vs "I finished <em>working</em>"</li>
                    <li><strong>In negotiations:</strong> "I'd like <em>to request</em>" vs "I avoid <em>working</em> weekends"</li>
                    <li><strong>Making plans:</strong> "It's important <em>to arrive</em> on time" vs "I enjoy <em>teaching</em>"</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Talking about transportation and getting around ("I want to learn how to drive")</li>
                        <li>Preparing for job interviews ("I enjoy working with people" "I plan to stay long-term")</li>
                        <li>Describing your job interests and skills ("I'm interested in learning new skills")</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Professional requests and negotiation:</strong> "I'd like to request..." "I avoid working..."</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💼 Using the right form makes you sound professional and confident in interviews!</p>
                </div>
            `,
            exercises: [
                {
                    id: "infinitives-gerunds-intro-1",
                    title: "Practice: Infinitive or Gerund?",
                    instructions: "Choose whether each sentence uses an infinitive (to + verb) or gerund (verb + -ing).",
                    items: [
                        {
                            type: "radio",
                            label: '"I want <span class=\'eg-verb\'>to work</span> here."',
                            options: [
                                { value: "infinitive", label: "Infinitive (to + verb)" },
                                { value: "gerund", label: "Gerund (verb + -ing)" },
                                { value: "both", label: "Both are correct" },
                            ],
                            expectedAnswer: "infinitive",
                        },
                        {
                            type: "radio",
                            label: '"I enjoy <span class=\'eg-verb\'>cooking</span>."',
                            options: [
                                { value: "infinitive", label: "Infinitive (to + verb)" },
                                { value: "gerund", label: "Gerund (verb + -ing)" },
                                { value: "both", label: "Both are correct" },
                            ],
                            expectedAnswer: "gerund",
                        },
                        {
                            type: "radio",
                            label: "Why is this grammar important?",
                            options: [
                                { value: "a", label: "It's everywhere in daily conversation and using the wrong form sounds incorrect" },
                                { value: "b", label: "It's only used in formal writing" },
                                { value: "c", label: "It doesn't matter which one you use" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "definitions",
            stepNumber: 1,
            title: "Infinitive vs Gerund: What's the Difference?",
            icon: "📖",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #3b82f6;">
                        <h4 style="color: #3b82f6; margin-top: 0;">Infinitive = to + base verb</h4>
                        <p style="margin: 0;">Expresses future, intention, purpose, or goal</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li>to work, to learn, to start, to finish</li>
                            <li>I want <strong>to work</strong> here.</li>
                            <li>She decided <strong>to apply</strong> for the job.</li>
                        </ul>
                    </div>

                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                        <h4 style="color: #22c55e; margin-top: 0;">Gerund = verb + -ing</h4>
                        <p style="margin: 0;">Expresses an activity, experience, or ongoing action</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li>working, learning, starting, finishing</li>
                            <li>I enjoy <strong>working</strong> here.</li>
                            <li>She finished <strong>applying</strong> for jobs.</li>
                        </ul>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Bad News",
                content: "There's no perfect rule - you have to memorize which verbs take infinitives vs gerunds. BUT: I'll give you memory tricks and the most common patterns!",
            },
            exercises: [
                {
                    id: "definitions-1",
                    title: "Practice: Infinitive vs Gerund",
                    instructions: "Identify whether each example uses an infinitive or gerund.",
                    items: [
                        {
                            type: "radio",
                            label: '"I want <span class=\'eg-verb\'>to work</span> here." What form is used?',
                            options: [
                                { value: "infinitive", label: "Infinitive (to + base verb) - expresses intention/goal" },
                                { value: "gerund", label: "Gerund (verb + -ing) - expresses activity" },
                            ],
                            expectedAnswer: "infinitive",
                        },
                        {
                            type: "radio",
                            label: '"I enjoy <span class=\'eg-verb\'>working</span> here." What form is used?',
                            options: [
                                { value: "infinitive", label: "Infinitive (to + base verb)" },
                                { value: "gerund", label: "Gerund (verb + -ing) - expresses activity/experience" },
                            ],
                            expectedAnswer: "gerund",
                        },
                        {
                            type: "radio",
                            label: "What's the key difference between infinitives and gerunds?",
                            options: [
                                { value: "a", label: "Infinitive = to + verb (future/intention) | Gerund = verb + -ing (activity/experience)" },
                                { value: "b", label: "They're the same thing" },
                                { value: "c", label: "Only infinitives are used" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "pattern-1-subject-gerund",
            stepNumber: 1,
            title: "Pattern 1: Subject = Gerund (___ing is...)",
            icon: "🌊",
            explanation: `
                <h3>Gerunds as Subjects: Using -ing Words Like Nouns</h3>
                <p>In English, you can start a sentence with a gerund (verb + -ing) to talk about activities, hobbies, or general statements.</p>

                <div style="background: rgba(34, 197, 94, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #22c55e; margin: 1.5rem 0;">
                    <h4 style="color: #22c55e; margin-top: 0;">Formula: [Gerund] + is/are + [adjective/noun]</h4>
                    <p style="margin: 0.5rem 0 0 0;"><strong>Swimming</strong> is fun. | <strong>Cooking</strong> takes time. | <strong>Reading</strong> is relaxing.</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🏊 Talking About Hobbies and Activities",
                    description: "Use gerund subjects to describe activities you enjoy or dislike",
                    examples: [
                        {
                            sentence: "<strong style='color: #22c55e;'>Swimming</strong> is fun!",
                            explanation: "✓ The activity of swimming = fun"
                        },
                        {
                            sentence: "<strong style='color: #22c55e;'>Cooking</strong> relaxes me.",
                            explanation: "✓ The activity of cooking = relaxing for me"
                        },
                        {
                            sentence: "<strong style='color: #22c55e;'>Learning</strong> English is hard but worth it.",
                            explanation: "✓ The activity of learning English = difficult"
                        },
                        {
                            sentence: "<strong style='color: #22c55e;'>Working</strong> from home saves time.",
                            explanation: "✓ The activity of working from home = time-saving"
                        },
                    ],
                },
                {
                    title: "⏱️ Talking About How Long Things Take",
                    description: "Use gerunds to say how much time an activity requires",
                    examples: [
                        {
                            sentence: "<strong style='color: #22c55e;'>Cooking</strong> takes time.",
                            explanation: "✓ The activity of cooking = time-consuming"
                        },
                        {
                            sentence: "<strong style='color: #22c55e;'>Finding</strong> a job takes patience.",
                            explanation: "✓ The process of finding a job = requires patience"
                        },
                        {
                            sentence: "<strong style='color: #22c55e;'>Commuting</strong> to work takes an hour.",
                            explanation: "✓ The activity of commuting = 1 hour"
                        },
                    ],
                },
                {
                    title: "💭 Making General Statements",
                    description: "Use gerunds to make general truths or observations",
                    examples: [
                        {
                            sentence: "<strong style='color: #22c55e;'>Smoking</strong> is bad for your health.",
                            explanation: "✓ General statement about smoking"
                        },
                        {
                            sentence: "<strong style='color: #22c55e;'>Exercising</strong> regularly improves your mood.",
                            explanation: "✓ General truth about exercise"
                        },
                        {
                            sentence: "<strong style='color: #22c55e;'>Being</strong> late is unprofessional.",
                            explanation: "✓ General observation about lateness"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "pattern-1-practice",
                    title: "Practice: Subject = Gerund",
                    instructions: "Complete each sentence using a gerund as the subject.",
                    items: [
                        {
                            type: "text",
                            label: "___ (read) is my favorite hobby.",
                            expectedAnswer: "Reading",
                        },
                        {
                            type: "text",
                            label: "___ (drive) in the city is stressful.",
                            expectedAnswer: "Driving",
                        },
                        {
                            type: "text",
                            label: "___ (work) two jobs is exhausting.",
                            expectedAnswer: "Working",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses a gerund as the subject?",
                            options: [
                                { value: "a", label: "Swimming is fun!" },
                                { value: "b", label: "I enjoy swimming." },
                                { value: "c", label: "I want to swim." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Tip",
                content: "When a gerund is the subject, the verb that follows is singular: 'Cooking IS fun' (not 'Cooking ARE fun'). Even if you're talking about multiple activities, each activity is singular!",
            },
        },

        {
            id: "infinitive-verbs",
            stepNumber: 6,
            title: "Pattern 6: Verb + Infinitive (to + verb)",
            icon: "➡️",
            explanation: `
                <h3>These Verbs Are Followed by Infinitives</h3>
                <p>Think: <strong>Future, Plans, Decisions, Desires</strong></p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                    <h4>Common Verbs + Infinitive:</h4>
                    <ul>
                        <li><strong>want to:</strong> I want <em>to work</em> here.</li>
                        <li><strong>need to:</strong> You need <em>to arrive</em> early.</li>
                        <li><strong>decide to:</strong> She decided <em>to apply</em>.</li>
                        <li><strong>plan to:</strong> We plan <em>to expand</em> the team.</li>
                        <li><strong>hope to:</strong> I hope <em>to get</em> this job.</li>
                        <li><strong>expect to:</strong> They expect <em>to finish</em> by Friday.</li>
                        <li><strong>agree to:</strong> He agreed <em>to work</em> overtime.</li>
                        <li><strong>refuse to:</strong> She refused <em>to accept</em> the offer.</li>
                        <li><strong>promise to:</strong> I promise <em>to be</em> on time.</li>
                        <li><strong>offer to:</strong> He offered <em>to help</em> me.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Memory Trick: "W.N.D.P.H." Verbs</h4>
                    <p style="margin: 0;"><strong>W</strong>ant, <strong>N</strong>eed, <strong>D</strong>ecide, <strong>P</strong>lan, <strong>H</strong>ope → all take infinitives!</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-infinitive-1",
                    title: "Practice: Choose the Infinitive",
                    instructions: "Complete each sentence with the infinitive form.",
                    items: [
                        {
                            type: "text",
                            label: "I want ___ (apply) for the paid training program.",
                            expectedAnswer: "to apply",
                        },
                        {
                            type: "text",
                            label: "She decided ___ (ask) for a schedule change.",
                            expectedAnswer: "to ask",
                        },
                        {
                            type: "text",
                            label: "We plan ___ (meet) after class to practice.",
                            expectedAnswer: "to meet",
                        },
                        {
                            type: "text",
                            label: "He refused ___ (sign) the form without reading it.",
                            expectedAnswer: "to sign",
                        },
                    ],
                },
            ],
        },

        {
            id: "gerund-verbs",
            stepNumber: 2,
            title: "Pattern 2: Verb + Gerund (I enjoy ___ing)",
            icon: "🔄",
            explanation: `
                <h3>These Verbs Are Followed by Gerunds</h3>
                <p>Think: <strong>Experiences, Activities, Reactions</strong></p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.5rem;">
                    <h4>Common Verbs + Gerund:</h4>
                    <ul>
                        <li><strong>enjoy:</strong> I enjoy <em>working</em> with people.</li>
                        <li><strong>finish:</strong> She finished <em>filling out</em> the form.</li>
                        <li><strong>avoid:</strong> I avoid <em>working</em> late.</li>
                        <li><strong>keep:</strong> Keep <em>trying</em>!</li>
                        <li><strong>quit / stop:</strong> He quit <em>smoking</em>.</li>
                        <li><strong>consider:</strong> I'm considering <em>changing</em> jobs.</li>
                        <li><strong>suggest:</strong> She suggested <em>taking</em> a break.</li>
                        <li><strong>recommend:</strong> I recommend <em>applying</em> early.</li>
                        <li><strong>mind:</strong> Do you mind <em>working</em> late?</li>
                        <li><strong>miss:</strong> I miss <em>seeing</em> my family.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Memory Trick: "E.F.A.K.Q." Verbs</h4>
                    <p style="margin: 0;"><strong>E</strong>njoy, <strong>F</strong>inish, <strong>A</strong>void, <strong>K</strong>eep, <strong>Q</strong>uit → all take gerunds!</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-gerund-1",
                    title: "Practice: Choose the Gerund",
                    instructions: "Complete each sentence with the gerund form.",
                    items: [
                        {
                            type: "text",
                            label: "I enjoy ___ (help) new students in class.",
                            expectedAnswer: "helping",
                        },
                        {
                            type: "text",
                            label: "She finished ___ (fill out) the intake form.",
                            expectedAnswer: "filling out",
                        },
                        {
                            type: "text",
                            label: "We avoid ___ (miss) deadlines at work.",
                            expectedAnswer: "missing",
                        },
                        {
                            type: "text",
                            label: "He quit ___ (check) his phone during meetings.",
                            expectedAnswer: "checking",
                        },
                    ],
                },
            ],
        },

        {
            id: "pattern-3-preposition-gerund",
            stepNumber: 3,
            title: "Pattern 3: Preposition + Gerund (good at ___ing)",
            icon: "🔗",
            explanation: `
                <h3>Prepositions Are Always Followed by Gerunds</h3>
                <p>When a verb comes after a preposition (at, in, on, for, about, of, to, etc.), it must be a gerund (-ing form).</p>

                <div style="background: rgba(34, 197, 94, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #22c55e; margin: 1.5rem 0;">
                    <h4 style="color: #22c55e; margin-top: 0;">Formula: [Preposition] + [Gerund]</h4>
                    <p style="margin: 0.5rem 0 0 0;">I'm good <strong>at cooking</strong>. | Thank you <strong>for helping</strong>. | I'm interested <strong>in learning</strong>.</p>
                </div>

                <h3>Common Patterns:</h3>
                <ul>
                    <li><strong>good at / bad at:</strong> I'm good <em>at</em> cooking.</li>
                    <li><strong>interested in:</strong> She's interested <em>in</em> learning Spanish.</li>
                    <li><strong>thank you for:</strong> Thank you <em>for</em> helping me.</li>
                    <li><strong>tired of:</strong> I'm tired <em>of</em> working late.</li>
                    <li><strong>think about:</strong> I'm thinking <em>about</em> changing jobs.</li>
                    <li><strong>look forward to:</strong> I look forward <em>to</em> seeing you! (NOT "to see")</li>
                </ul>

                <div style="background: rgba(249, 115, 22, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0; border-left: 4px solid #f97316;">
                    <p style="margin: 0;"><strong>📚 Want to learn more about this pattern?</strong><br/>
                    We have a dedicated guide called <strong>"Gerunds After Prepositions"</strong> that focuses on professional communication and job applications. It includes 30+ common preposition + gerund combinations you'll use at work!</p>
                </div>
            `,
            exercises: [
                {
                    id: "pattern-3-practice",
                    title: "Quick Practice: Preposition + Gerund",
                    instructions: "Complete each sentence with the gerund form.",
                    items: [
                        {
                            type: "text",
                            label: "I'm good at ___ (organize) paperwork.",
                            expectedAnswer: "organizing",
                        },
                        {
                            type: "text",
                            label: "Thank you for ___ (wait) for me.",
                            expectedAnswer: "waiting",
                        },
                        {
                            type: "text",
                            label: "She's interested in ___ (apply) for a new position.",
                            expectedAnswer: "applying",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I'm thinking about to change jobs." },
                                { value: "b", label: "I'm thinking about changing jobs." },
                                { value: "c", label: "I'm thinking about change jobs." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Tricky One!",
                content: "'Look forward to' ends with 'to' but it's a preposition, not an infinitive marker! → I look forward to SEEING you (NOT 'to see').",
            },
        },

        {
            id: "pattern-4-adjective-infinitive",
            stepNumber: 4,
            title: "Pattern 4: Adjective + Infinitive (It's nice to...)",
            icon: "✨",
            explanation: `
                <h3>It's + Adjective + Infinitive</h3>
                <p>Use this pattern to give opinions, make small talk, or describe situations.</p>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6; margin: 1.5rem 0;">
                    <h4 style="color: #3b82f6; margin-top: 0;">Formula: It's + [adjective] + to + [verb]</h4>
                    <p style="margin: 0.5rem 0 0 0;">It's nice <strong>to meet</strong> you. | It's important <strong>to be</strong> on time. | It's easy <strong>to learn</strong>.</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "👋 Making Small Talk and Being Polite",
                    description: "Common phrases for greetings and professional communication",
                    examples: [
                        {
                            sentence: "It's nice <strong style='color: #3b82f6;'>to meet</strong> you.",
                            explanation: "✓ Standard greeting when meeting someone"
                        },
                        {
                            sentence: "It's great <strong style='color: #3b82f6;'>to see</strong> you again!",
                            explanation: "✓ Polite way to greet someone you know"
                        },
                        {
                            sentence: "It's good <strong style='color: #3b82f6;'>to hear</strong> from you.",
                            explanation: "✓ Responding to messages or calls"
                        },
                    ],
                },
                {
                    title: "💼 Giving Opinions About Work",
                    description: "Expressing what's important, necessary, or difficult in professional contexts",
                    examples: [
                        {
                            sentence: "It's important <strong style='color: #3b82f6;'>to arrive</strong> on time.",
                            explanation: "✓ Stating workplace expectations"
                        },
                        {
                            sentence: "It's necessary <strong style='color: #3b82f6;'>to complete</strong> the training.",
                            explanation: "✓ Explaining requirements"
                        },
                        {
                            sentence: "It's hard <strong style='color: #3b82f6;'>to find</strong> a good job.",
                            explanation: "✓ Describing difficulty"
                        },
                        {
                            sentence: "It's easy <strong style='color: #3b82f6;'>to make</strong> mistakes when you're learning.",
                            explanation: "✓ Being encouraging"
                        },
                    ],
                },
                {
                    title: "📋 Common Adjectives with This Pattern",
                    description: "Frequently used adjectives in this structure",
                    examples: [
                        {
                            sentence: "It's possible <strong style='color: #3b82f6;'>to change</strong> your schedule.",
                            explanation: "✓ Discussing possibilities"
                        },
                        {
                            sentence: "It's difficult <strong style='color: #3b82f6;'>to understand</strong> medical terms.",
                            explanation: "✓ Expressing challenges"
                        },
                        {
                            sentence: "It's safe <strong style='color: #3b82f6;'>to walk</strong> here during the day.",
                            explanation: "✓ Discussing safety"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "pattern-4-practice",
                    title: "Practice: Adjective + Infinitive",
                    instructions: "Complete each sentence using the infinitive form.",
                    items: [
                        {
                            type: "text",
                            label: "It's nice ___ (meet) you!",
                            expectedAnswer: "to meet",
                        },
                        {
                            type: "text",
                            label: "It's important ___ (be) on time for work.",
                            expectedAnswer: "to be",
                        },
                        {
                            type: "text",
                            label: "It's hard ___ (find) a good apartment.",
                            expectedAnswer: "to find",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct for making small talk?",
                            options: [
                                { value: "a", label: "It's nice meeting you." },
                                { value: "b", label: "It's nice to meet you." },
                                { value: "c", label: "Both are correct" },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Common Adjectives",
                content: "nice, good, great, important, necessary, hard, difficult, easy, possible, impossible, safe, dangerous",
            },
        },

        {
            id: "pattern-5-noun-infinitive",
            stepNumber: 5,
            title: "Pattern 5: Noun + Infinitive (I asked him to...)",
            icon: "👥",
            explanation: `
                <h3>Object Pronoun + Infinitive: Making Requests and Giving Instructions</h3>
                <p>Use this pattern when you want someone to do something, or when you're talking about what someone wants/expects from another person.</p>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6; margin: 1.5rem 0;">
                    <h4 style="color: #3b82f6; margin-top: 0;">Formula: Verb + [object pronoun/noun] + to + [verb]</h4>
                    <p style="margin: 0.5rem 0 0 0;">I asked <strong>him to call</strong> me. | She wants <strong>us to help</strong>. | I need <strong>you to listen</strong>.</p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "🗣️ Making Requests",
                    description: "Politely asking someone to do something",
                    examples: [
                        {
                            sentence: "I need <strong style='color: #3b82f6;'>you to send</strong> me the form.",
                            explanation: "✓ Direct request"
                        },
                        {
                            sentence: "Could you ask <strong style='color: #3b82f6;'>him to call</strong> me?",
                            explanation: "✓ Polite request through someone else"
                        },
                        {
                            sentence: "I'd like <strong style='color: #3b82f6;'>you to review</strong> this document.",
                            explanation: "✓ Formal/polite request"
                        },
                    ],
                },
                {
                    title: "📢 Giving Instructions",
                    description: "Telling someone what to do (work, school, home)",
                    examples: [
                        {
                            sentence: "The manager told <strong style='color: #3b82f6;'>me to arrive</strong> early.",
                            explanation: "✓ Instruction from supervisor"
                        },
                        {
                            sentence: "The teacher asked <strong style='color: #3b82f6;'>us to complete</strong> the assignment.",
                            explanation: "✓ School instruction"
                        },
                        {
                            sentence: "My doctor advised <strong style='color: #3b82f6;'>me to exercise</strong> more.",
                            explanation: "✓ Professional advice"
                        },
                    ],
                },
                {
                    title: "💭 Expressing Expectations and Desires",
                    description: "Saying what you want or expect from others",
                    examples: [
                        {
                            sentence: "She wants <strong style='color: #3b82f6;'>me to help</strong> with the project.",
                            explanation: "✓ What someone desires"
                        },
                        {
                            sentence: "They expect <strong style='color: #3b82f6;'>us to finish</strong> by Friday.",
                            explanation: "✓ What's expected"
                        },
                        {
                            sentence: "I would like <strong style='color: #3b82f6;'>you to consider</strong> my request.",
                            explanation: "✓ Formal desire/hope"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "pattern-5-practice",
                    title: "Practice: Noun + Infinitive",
                    instructions: "Complete each sentence using the pattern: object + to + verb.",
                    items: [
                        {
                            type: "text",
                            label: "I asked the office ___ (email) me the document.",
                            expectedAnswer: "to email",
                        },
                        {
                            type: "text",
                            label: "She wants us ___ (arrive) 10 minutes early.",
                            expectedAnswer: "to arrive",
                        },
                        {
                            type: "text",
                            label: "The supervisor told me ___ (sign) the log book.",
                            expectedAnswer: "to sign",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I need you listen to me." },
                                { value: "b", label: "I need you to listen to me." },
                                { value: "c", label: "I need you listening to me." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Common Verbs for This Pattern",
                content: "ask, tell, want, need, would like, expect, advise, remind, encourage, allow, help",
            },
        },

        {
            id: "both",
            stepNumber: 7,
            title: "Verbs That Take BOTH (with Different Meanings)",
            icon: "⚡",
            explanation: `
                <h3>Tricky! Some Verbs Take Both - But the Meaning Changes</h3>

                <div style="margin: 1.5rem 0;">
                    <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 2px solid #d97757; margin-bottom: 1rem;">
                        <h4 style="color: #d97757; margin-top: 0;">STOP + infinitive vs STOP + gerund</h4>
                        <ul style="margin: 0;">
                            <li><strong>Stop to do</strong> = pause in order to do something<br/>
                                <em>I stopped to rest.</em> (I paused my work to take a rest)</li>
                            <li><strong>Stop doing</strong> = quit an activity<br/>
                                <em>I stopped working.</em> (I quit my job)</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 2px solid #7ba884; margin-bottom: 1rem;">
                        <h4 style="color: #7ba884; margin-top: 0;">REMEMBER + infinitive vs REMEMBER + gerund</h4>
                        <ul style="margin: 0;">
                            <li><strong>Remember to do</strong> = don't forget (future action)<br/>
                                <em>Remember to clock in.</em> (Don't forget to do it)</li>
                            <li><strong>Remember doing</strong> = recall a past experience<br/>
                                <em>I remember working there.</em> (I recall that experience)</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 2px solid #3b82f6;">
                        <h4 style="color: #3b82f6; margin-top: 0;">TRY + infinitive vs TRY + gerund</h4>
                        <ul style="margin: 0;">
                            <li><strong>Try to do</strong> = attempt, make an effort<br/>
                                <em>I tried to call you.</em> (I attempted but maybe failed)</li>
                            <li><strong>Try doing</strong> = experiment with a method<br/>
                                <em>Try calling him again.</em> (Test this approach)</li>
                        </ul>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Most Important",
                content: "For most daily situations, you can often use either form with verbs like 'start,' 'begin,' 'like,' 'love,' 'hate,' and 'prefer' - the meaning stays the same! Example: 'I started to work' = 'I started working.'",
            },
            exercises: [
                {
                    id: "ex-both-1",
                    title: "Practice: Choose the Right Meaning",
                    instructions: "Select the sentence with the correct meaning.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to say 'Don't forget to bring your ID':",
                            options: [
                                { value: "a", label: "Remember bringing your ID." },
                                { value: "b", label: "Remember to bring your ID." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You want to say 'I quit drinking soda':",
                            options: [
                                { value: "a", label: "I stopped to drink soda." },
                                { value: "b", label: "I stopped drinking soda." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "practical-tips",
            stepNumber: 8,
            title: "Practical Tips: Using All 6 Patterns in Real Life",
            icon: "💼",
            explanation: `
                <h3>How to Use This in Job Applications & Negotiations</h3>

                <div style="margin: 1.5rem 0; background: rgba(200, 107, 81, 0.1); padding: 1.5rem; border-radius: 0.5rem;">
                    <h4>Talking About Your Goals (Use Infinitives):</h4>
                    <ul>
                        <li>I want <strong>to work</strong> for your company.</li>
                        <li>I plan <strong>to improve</strong> my English.</li>
                        <li>I hope <strong>to advance</strong> in my career.</li>
                        <li>I'd like <strong>to learn</strong> new skills.</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; background: rgba(110, 145, 118, 0.1); padding: 1.5rem; border-radius: 0.5rem;">
                    <h4>Talking About Your Experience (Use Gerunds):</h4>
                    <ul>
                        <li>I enjoy <strong>working</strong> with teams.</li>
                        <li>I finished <strong>training</strong> last month.</li>
                        <li>I avoid <strong>missing</strong> deadlines.</li>
                        <li>I keep <strong>learning</strong> new things.</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Making Requests & Negotiations:</h4>
                    <ul>
                        <li>I'd like <strong>to request</strong> a schedule change. (infinitive)</li>
                        <li>Would you consider <strong>giving</strong> me more hours? (gerund)</li>
                        <li>I need <strong>to leave</strong> early today. (infinitive)</li>
                        <li>I don't mind <strong>working</strong> weekends. (gerund)</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "infinitives-vs-gerunds-practical-tips-1",
                    title: "Practice: Practical Tips for Real Life",
                    instructions: "Choose the correct form (infinitive or gerund) for different real-world situations.",
                    items: [
                        {
                            type: "radio",
                            label: "When talking about your goals in a job application, which form should you use?",
                            options: [
                                { value: "a", label: "Infinitives: I want to work for your company." },
                                { value: "b", label: "Gerunds: I want working for your company." },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When talking about your experience, which form should you use?",
                            options: [
                                { value: "a", label: "Gerunds: I enjoy working with teams." },
                                { value: "b", label: "Infinitives: I enjoy to work with teams." },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When making a request, which form should you use?",
                            options: [
                                { value: "a", label: "Infinitives: I'd like to request a schedule change." },
                                { value: "b", label: "Gerunds: I'd like requesting a schedule change." },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When expressing what you don't mind doing, which form should you use?",
                            options: [
                                { value: "a", label: "Gerunds: I don't mind working weekends." },
                                { value: "b", label: "Infinitives: I don't mind to work weekends." },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference: All 6 Patterns Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>The 6 Essential Patterns</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                        <h4 style="color: #22c55e; margin-top: 0;">Pattern 1: Subject = Gerund</h4>
                        <p style="margin: 0.25rem 0;"><strong>Formula:</strong> [Gerund] + is/are</p>
                        <p style="margin: 0;"><em>Swimming is fun!</em><br/><em>Cooking takes time.</em></p>
                    </div>

                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                        <h4 style="color: #22c55e; margin-top: 0;">Pattern 2: Verb + Gerund</h4>
                        <p style="margin: 0.25rem 0;"><strong>Verbs:</strong> enjoy, finish, avoid, keep, quit</p>
                        <p style="margin: 0;"><em>I enjoy cooking.</em><br/><em>She stopped smoking.</em></p>
                    </div>

                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                        <h4 style="color: #22c55e; margin-top: 0;">Pattern 3: Preposition + Gerund</h4>
                        <p style="margin: 0.25rem 0;"><strong>Formula:</strong> [Prep] + [Gerund]</p>
                        <p style="margin: 0;"><em>I'm good at cooking.</em><br/><em>Thank you for helping.</em></p>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="color: #3b82f6; margin-top: 0;">Pattern 4: Adjective + Infinitive</h4>
                        <p style="margin: 0.25rem 0;"><strong>Formula:</strong> It's + [adj] + to + [verb]</p>
                        <p style="margin: 0;"><em>It's nice to meet you.</em><br/><em>It's important to be on time.</em></p>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="color: #3b82f6; margin-top: 0;">Pattern 5: Noun + Infinitive</h4>
                        <p style="margin: 0.25rem 0;"><strong>Formula:</strong> Verb + [object] + to + [verb]</p>
                        <p style="margin: 0;"><em>I asked him to help.</em><br/><em>She wants me to call.</em></p>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="color: #3b82f6; margin-top: 0;">Pattern 6: Verb + Infinitive</h4>
                        <p style="margin: 0.25rem 0;"><strong>Verbs:</strong> want, need, decide, plan, hope</p>
                        <p style="margin: 0;"><em>I want to work here.</em><br/><em>She decided to apply.</em></p>
                    </div>
                </div>

                <h3>Verbs That Take BOTH (same meaning)</h3>
                <p style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem;">
                    start, begin, like, love, hate, prefer, continue
                </p>

                <h3>Verbs That Take BOTH (different meaning)</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Verb</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Infinitive</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Gerund</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">stop</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">stopped to rest (paused)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">stopped working (quit)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">remember</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">remember to call (don't forget)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">remember calling (recall past)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">try</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">tried to open (attempted)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">try opening (experiment)</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ "I enjoy to work here" → ✅ "I enjoy working here" (Pattern 2)</li>
                    <li>❌ "I want working here" → ✅ "I want to work here" (Pattern 6)</li>
                    <li>❌ "I'm good at to cook" → ✅ "I'm good at cooking" (Pattern 3)</li>
                    <li>❌ "It's important arriving on time" → ✅ "It's important to arrive on time" (Pattern 4)</li>
                    <li>❌ "I asked him calling me" → ✅ "I asked him to call me" (Pattern 5)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Quick Memory Trick",
                content: "Gerunds (Patterns 1-3): Subject, Verb, Preposition + -ing. Infinitives (Patterns 4-6): Adjective, Noun, Verb + to. When in doubt, think about the context!",
            },
            exercises: [
                {
                    id: "infinitives-vs-gerunds-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of infinitives vs gerunds.",
                    items: [
                        {
                            type: "radio",
                            label: "Which verbs take infinitives (to + verb)?",
                            options: [
                                { value: "a", label: "want, need, decide, plan, hope, expect, agree, refuse, promise, offer, would like" },
                                { value: "b", label: "enjoy, finish, avoid, keep, quit, stop, consider, suggest, recommend" },
                                { value: "c", label: "All verbs take infinitives" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which verbs take gerunds (-ing form)?",
                            options: [
                                { value: "a", label: "want, need, decide, plan" },
                                { value: "b", label: "enjoy, finish, avoid, keep, quit, stop, consider, suggest, recommend" },
                                { value: "c", label: "All verbs take gerunds" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "What's the difference between 'stop to smoke' and 'stop smoking'?",
                            options: [
                                { value: "a", label: "stop to smoke = paused to have a cigarette | stop smoking = quit cigarettes" },
                                { value: "b", label: "They mean the same thing" },
                                { value: "c", label: "stop to smoke = quit | stop smoking = paused" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I enjoy working here." },
                                { value: "b", label: "I enjoy to work here." },
                                { value: "c", label: "I enjoy work here." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I decided to apply for the job." },
                                { value: "b", label: "I decided applying for the job." },
                                { value: "c", label: "I decided apply for the job." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Pattern 1 (Subject = Gerund): Which sentence uses a gerund as the subject?",
            options: [
                { value: "a", label: "Swimming is fun!" },
                { value: "b", label: "I enjoy swimming." },
                { value: "c", label: "I want to swim." },
            ],
            correctAnswer: "a",
            explanation: "'Swimming is fun' uses a gerund (Swimming) as the subject of the sentence. Pattern 1: Subject = Gerund.",
        },
        {
            id: "quiz-2",
            question: "Pattern 2 (Verb + Gerund): Which sentence is correct?",
            options: [
                { value: "a", label: "I enjoy to work with children." },
                { value: "b", label: "I enjoy working with children." },
                { value: "c", label: "I enjoy work with children." },
            ],
            correctAnswer: "b",
            explanation: "'Enjoy' takes a gerund (-ing form), not an infinitive. Pattern 2: Verb + Gerund.",
        },
        {
            id: "quiz-3",
            question: "Pattern 3 (Preposition + Gerund): Which sentence is correct?",
            options: [
                { value: "a", label: "I'm good at to cook." },
                { value: "b", label: "I'm good at cooking." },
                { value: "c", label: "I'm good at cook." },
            ],
            correctAnswer: "b",
            explanation: "Prepositions are always followed by gerunds, not infinitives. Pattern 3: Preposition + Gerund.",
        },
        {
            id: "quiz-4",
            question: "Pattern 4 (Adjective + Infinitive): Which sentence is correct?",
            options: [
                { value: "a", label: "It's nice meeting you." },
                { value: "b", label: "It's nice to meet you." },
                { value: "c", label: "It's nice meet you." },
            ],
            correctAnswer: "b",
            explanation: "Use 'It's + adjective + infinitive' for greetings and opinions. Pattern 4: Adjective + Infinitive. (Note: 'It's nice meeting you' is also correct in some contexts!)",
        },
        {
            id: "quiz-5",
            question: "Pattern 5 (Noun + Infinitive): Which sentence is correct?",
            options: [
                { value: "a", label: "I asked him calling me." },
                { value: "b", label: "I asked him to call me." },
                { value: "c", label: "I asked him call me." },
            ],
            correctAnswer: "b",
            explanation: "Use 'verb + object + infinitive' for requests and instructions. Pattern 5: Noun + Infinitive.",
        },
        {
            id: "quiz-6",
            question: "Pattern 6 (Verb + Infinitive): Which sentence is correct?",
            options: [
                { value: "a", label: "I decided applying for the job." },
                { value: "b", label: "I decided to apply for the job." },
                { value: "c", label: "I decided apply for the job." },
            ],
            correctAnswer: "b",
            explanation: "'Decide' takes an infinitive (to + verb), not a gerund. Pattern 6: Verb + Infinitive.",
        },
        {
            id: "quiz-7",
            question: "Complete using Pattern 2 (Verb + Gerund): 'She finished ___ her application.'",
            options: [
                { value: "a", label: "to complete" },
                { value: "b", label: "completing" },
                { value: "c", label: "complete" },
            ],
            correctAnswer: "b",
            explanation: "'Finish' always takes a gerund: finished completing. Pattern 2: Verb + Gerund.",
        },
        {
            id: "quiz-8",
            question: "What's the difference? 'I stopped to smoke' vs 'I stopped smoking'",
            options: [
                { value: "a", label: "They mean the same thing." },
                { value: "b", label: "First = I paused to have a cigarette. Second = I quit cigarettes." },
                { value: "c", label: "First = I quit cigarettes. Second = I paused to have a cigarette." },
            ],
            correctAnswer: "b",
            explanation: "'Stop to do' = pause in order to do. 'Stop doing' = quit the activity. Some verbs take both forms with different meanings!",
        },
        {
            id: "quiz-9",
            question: "Which pattern is used in: 'Learning English takes time'?",
            options: [
                { value: "a", label: "Pattern 1: Subject = Gerund" },
                { value: "b", label: "Pattern 2: Verb + Gerund" },
                { value: "c", label: "Pattern 3: Preposition + Gerund" },
            ],
            correctAnswer: "a",
            explanation: "'Learning' is the subject of the sentence. Pattern 1: Subject = Gerund (___ing is/takes/etc.)",
        },
        {
            id: "quiz-10",
            question: "Which pattern is used in: 'The manager wants us to finish by Friday'?",
            options: [
                { value: "a", label: "Pattern 4: Adjective + Infinitive" },
                { value: "b", label: "Pattern 5: Noun + Infinitive" },
                { value: "c", label: "Pattern 6: Verb + Infinitive" },
            ],
            correctAnswer: "b",
            explanation: "'Wants us to finish' follows the pattern: verb + object + infinitive. Pattern 5: Noun + Infinitive.",
        },
        {
            id: "quiz-11",
            question: "Complete: 'I'm looking forward to _____ you after class.'",
            options: [
                { value: "a", label: "see" },
                { value: "b", label: "to see" },
                { value: "c", label: "seeing" },
            ],
            correctAnswer: "c",
            explanation: "'To' in 'look forward to' is a preposition, so the next verb is a gerund: to seeing.",
        },
        {
            id: "quiz-12",
            question: "Complete: 'It's important _____ the address carefully on the form.'",
            options: [
                { value: "a", label: "to write" },
                { value: "b", label: "writing" },
                { value: "c", label: "write" },
            ],
            correctAnswer: "a",
            explanation: "Pattern 4: It's + adjective + infinitive → It's important to write…",
        },
        {
            id: "quiz-13",
            question: "Complete: 'I asked my supervisor _____ my schedule.'",
            options: [
                { value: "a", label: "to change" },
                { value: "b", label: "changing" },
                { value: "c", label: "change" },
            ],
            correctAnswer: "a",
            explanation: "Pattern 5: verb + object + infinitive → asked my supervisor to change…",
        },
        {
            id: "quiz-14",
            question: "Which sentence means you paused your work in order to make a phone call?",
            options: [
                { value: "a", label: "I stopped to call the clinic." },
                { value: "b", label: "I stopped calling the clinic." },
                { value: "c", label: "I stopped call the clinic." },
            ],
            correctAnswer: "a",
            explanation: "Stop to do = pause in order to do something (make a call). Stop doing = quit the activity.",
        },
        {
            id: "quiz-15",
            question: "Complete using Pattern 3 (Preposition + Gerund): 'Thanks for _____ me the directions.'",
            options: [
                { value: "a", label: "help" },
                { value: "b", label: "to help" },
                { value: "c", label: "helping" },
            ],
            correctAnswer: "c",
            explanation: "After a preposition (for), use a gerund: for helping.",
        },
    ],
};
