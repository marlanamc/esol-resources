import type { InteractiveGuideContent } from "@/types/activity";

export const gerundsPrepositionsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Gerunds After Prepositions: The -ing Connection",
            icon: "🔗",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"I'm interested in working here." "She's good at solving problems." "Thank you for helping me." Notice the pattern? After prepositions (in, at, for), we use the -ing form. Master this, and your English sounds natural and professional.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>This pattern is everywhere in job applications, interviews, and professional communication:</p>
                <ul>
                    <li><strong>Job applications:</strong> "I'm interested in <em>joining</em> your team"</li>
                    <li><strong>Interviews:</strong> "I'm good at <em>working</em> under pressure"</li>
                    <li><strong>Professional emails:</strong> "Thank you for <em>considering</em> my application"</li>
                    <li><strong>Everyday conversation:</strong> "I get to work by <em>taking</em> the bus"</li>
                </ul>
            `,
            exercises: [
                {
                    id: "gerunds-prepositions-intro-1",
                    title: "Practice: Gerunds After Prepositions",
                    instructions: "Choose the correct form after each preposition.",
                    items: [
                        {
                            type: "radio",
                            label: '"I\'m interested _____ here."',
                            options: [
                                { value: "a", label: "in working (preposition + gerund)" },
                                { value: "b", label: "in to work (preposition + infinitive)" },
                                { value: "c", label: "working (no preposition)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"Thank you _____ me."',
                            options: [
                                { value: "a", label: "for helping (preposition + gerund)" },
                                { value: "b", label: "for to help (preposition + infinitive)" },
                                { value: "c", label: "helping (no preposition)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What form comes after prepositions?",
                            options: [
                                { value: "a", label: "Always gerund (-ing form), never infinitive (to + verb)" },
                                { value: "b", label: "Always infinitive (to + verb)" },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "what-is-gerund",
            stepNumber: 1,
            title: "What Is a Gerund?",
            icon: "📝",
            explanation: `
                <h3>Verb + -ing = Gerund</h3>
                <p>A gerund looks like a continuous verb, but it acts like a noun:</p>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <p style="margin: 0;"><strong>Verb:</strong> work → <strong>Gerund:</strong> working</p>
                    <p style="margin: 0;"><strong>Verb:</strong> solve → <strong>Gerund:</strong> solving</p>
                    <p style="margin: 0;"><strong>Verb:</strong> learn → <strong>Gerund:</strong> learning</p>
                </div>

                <h4>Why It's Called a Gerund (Not Just -ing):</h4>
                <p>Because it acts like a noun - you can use it as a subject or object:</p>
                <ul>
                    <li><strong>Working</strong> here is great. (subject)</li>
                    <li>I love <strong>teaching</strong>. (object)</li>
                    <li>My hobby is <strong>cooking</strong>. (complement)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Quick Rule",
                content: "After a preposition (in, at, for, by, about, of, without, etc.), ALWAYS use the gerund (-ing form), NEVER the infinitive (to + verb).",
            },
            exercises: [
                {
                    id: "gerunds-prepositions-what-is-1",
                    title: "Practice: Identifying Gerunds",
                    instructions: "Choose the correct answer about gerunds.",
                    items: [
                        {
                            type: "radio",
                            label: "What is a gerund?",
                            options: [
                                { value: "a", label: "A verb form ending in -ing that acts like a noun" },
                                { value: "b", label: "A verb form ending in -ed that acts like an adjective" },
                                { value: "c", label: "A verb form with 'to' that acts like a noun" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "In the sentence 'Working here is great,' what is 'Working'?",
                            options: [
                                { value: "a", label: "A gerund acting as the subject" },
                                { value: "b", label: "A continuous verb" },
                                { value: "c", label: "An adjective" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses a gerund correctly?",
                            options: [
                                { value: "a", label: "I love teaching." },
                                { value: "b", label: "I love to teaching." },
                                { value: "c", label: "I love teach." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "How do you form a gerund from the verb 'solve'?",
                            options: [
                                { value: "a", label: "Add -ing: solving" },
                                { value: "b", label: "Add -ed: solved" },
                                { value: "c", label: "Add 'to': to solve" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-patterns",
            stepNumber: 2,
            title: "Common Adjective + Preposition Patterns",
            icon: "🎯",
            explanation: `
                <h3>Be + Adjective + Preposition + Gerund</h3>
                <p>These patterns are essential for job applications and professional communication:</p>

                <div style="margin-top: 1.5rem;">
                    <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #7ba884; margin-top: 0;">Interested in + gerund</h4>
                        <ul style="margin: 0;">
                            <li>I'm <strong>interested in learning</strong> more about this position.</li>
                            <li>She's <strong>interested in working</strong> with children.</li>
                            <li>Are you <strong>interested in joining</strong> our team?</li>
                        </ul>
                    </div>

                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #d97757; margin-top: 0;">Good at / Bad at + gerund</h4>
                        <ul style="margin: 0;">
                            <li>I'm <strong>good at solving</strong> problems.</li>
                            <li>He's <strong>good at working</strong> with numbers.</li>
                            <li>I'm not very <strong>good at speaking</strong> in public. (honest!)</li>
                        </ul>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #3b82f6; margin-top: 0;">Excited about + gerund</h4>
                        <ul style="margin: 0;">
                            <li>I'm <strong>excited about starting</strong> this new job.</li>
                            <li>We're <strong>excited about meeting</strong> the team.</li>
                            <li>She's <strong>excited about learning</strong> new skills.</li>
                        </ul>
                    </div>

                    <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #a855f7; margin-top: 0;">Tired of / Sick of + gerund</h4>
                        <ul style="margin: 0;">
                            <li>I'm <strong>tired of working</strong> long hours.</li>
                            <li>She's <strong>sick of dealing</strong> with rude customers.</li>
                            <li>We're <strong>tired of waiting</strong> for a decision.</li>
                        </ul>
                    </div>
                </div>
            `,
            verbTable: {
                title: "Common Adjective + Preposition Combinations",
                headers: ["Pattern", "Example"],
                rows: [
                    ["good at + gerund", "I'm good at organizing."],
                    ["interested in + gerund", "She's interested in applying."],
                    ["excited about + gerund", "We're excited about working here."],
                    ["tired of + gerund", "I'm tired of commuting."],
                    ["worried about + gerund", "He's worried about losing his job."],
                    ["responsible for + gerund", "I'm responsible for training new staff."],
                ],
            },
            exercises: [
                {
                    id: "ex-patterns-1",
                    title: "Practice: Complete the Patterns",
                    instructions: "Complete each sentence with the gerund form of the verb in parentheses.",
                    items: [
                        {
                            type: "text",
                            label: "1. I'm interested in ___ (work) at your company.",
                            expectedAnswer: "working",
                        },
                        {
                            type: "text",
                            label: "2. She's good at ___ (manage) teams.",
                            expectedAnswer: "managing",
                        },
                        {
                            type: "text",
                            label: "3. We're excited about ___ (start) the new project.",
                            expectedAnswer: "starting",
                        },
                        {
                            type: "text",
                            label: "4. He's tired of ___ (commute) two hours each day.",
                            expectedAnswer: "commuting",
                        },
                    ],
                },
            ],
        },

        {
            id: "by-gerund",
            stepNumber: 3,
            title: "By + Gerund: How You Do Something",
            icon: "🛠️",
            explanation: `
                <h3>Explaining Your Method or Process</h3>
                <p>Use <strong>by + gerund</strong> to explain HOW you do something or HOW you achieve something:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Work & Career Examples:</h4>
                    <ul>
                        <li>I get to work <strong>by taking</strong> the bus.</li>
                        <li>You can improve your English <strong>by practicing</strong> every day.</li>
                        <li>She solved the problem <strong>by asking</strong> for help.</li>
                        <li>We save money <strong>by cooking</strong> at home.</li>
                        <li>I got this job <strong>by applying</strong> online.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Pattern:</h4>
                    <p style="margin: 0; font-size: 1.125rem;">
                        <span style="color: #3b82f6;">Subject</span> +
                        <span style="color: #d97757;"> verb </span> +
                        <span style="color: #22c55e;"> by + gerund</span>
                    </p>
                </div>

                <h4>Interview Gold:</h4>
                <p>This structure is perfect for interviews when they ask "How did you...?"</p>
                <ul>
                    <li>"How did you handle that situation?" → "I handled it <strong>by staying</strong> calm and <strong>by talking</strong> to my supervisor."</li>
                    <li>"How do you manage stress?" → "I manage stress <strong>by exercising</strong> and <strong>by taking</strong> breaks."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-by-1",
                    title: "Practice: By + Gerund",
                    instructions: "Complete each sentence using 'by + gerund' to explain how.",
                    items: [
                        {
                            type: "text",
                            label: "1. I get to work ___ (take) the train.",
                            expectedAnswer: "by taking",
                        },
                        {
                            type: "text",
                            label: "2. You can improve your skills ___ (practice) regularly.",
                            expectedAnswer: "by practicing",
                        },
                        {
                            type: "text",
                            label: "3. She learned English ___ (watch) movies.",
                            expectedAnswer: "by watching",
                        },
                        {
                            type: "text",
                            label: "4. We stay healthy ___ (eat) well and ___ (exercise).",
                            expectedAnswer: "by eating",
                        },
                    ],
                },
            ],
        },

        {
            id: "thank-for",
            stepNumber: 4,
            title: "Thank You For + Gerund: Professional Gratitude",
            icon: "🙏",
            explanation: `
                <h3>Expressing Thanks Professionally</h3>
                <p>One of the most common professional phrases uses this pattern:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Essential Phrases:</h4>
                    <ul>
                        <li>Thank you for <strong>considering</strong> my application.</li>
                        <li>Thank you for <strong>taking</strong> the time to meet with me.</li>
                        <li>Thank you for <strong>helping</strong> me with this.</li>
                        <li>Thank you for <strong>giving</strong> me this opportunity.</li>
                        <li>I appreciate you <strong>taking</strong> the time to explain.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Other "For + Gerund" Phrases:</h4>
                    <ul>
                        <li>I apologize for <strong>being</strong> late.</li>
                        <li>She's responsible for <strong>opening</strong> the store.</li>
                        <li>He's famous for <strong>making</strong> great coffee.</li>
                        <li>This tool is used for <strong>cutting</strong> metal.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "ex-thank-1",
                    title: "Practice: Professional Thank-Yous",
                    instructions: "Complete each professional statement with the gerund.",
                    items: [
                        {
                            type: "text",
                            label: "1. Thank you for ___ (consider) me for this position.",
                            expectedAnswer: "considering",
                        },
                        {
                            type: "text",
                            label: "2. I appreciate you ___ (take) the time to train me.",
                            expectedAnswer: "taking",
                        },
                        {
                            type: "text",
                            label: "3. I apologize for ___ (miss) the meeting.",
                            expectedAnswer: "missing",
                        },
                    ],
                },
            ],
        },

        {
            id: "without-before-after",
            stepNumber: 5,
            title: "Without, Before, After + Gerund",
            icon: "⏰",
            explanation: `
                <h3>More Essential Preposition Patterns</h3>

                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(220, 38, 38, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #dc2626; margin-top: 0;">Without + gerund</h4>
                        <ul style="margin: 0;">
                            <li>Don't leave <strong>without clocking out</strong>.</li>
                            <li>You can't get the job <strong>without applying</strong>.</li>
                            <li>She finished the task <strong>without asking</strong> for help.</li>
                        </ul>
                    </div>

                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #22c55e; margin-top: 0;">Before + gerund</h4>
                        <ul style="margin: 0;">
                            <li>Wash your hands <strong>before eating</strong>.</li>
                            <li>Check your schedule <strong>before leaving</strong>.</li>
                            <li>Think carefully <strong>before making</strong> a decision.</li>
                        </ul>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #3b82f6; margin-top: 0;">After + gerund</h4>
                        <ul style="margin: 0;">
                            <li>Call me <strong>after finishing</strong> your shift.</li>
                            <li>She felt better <strong>after talking</strong> to HR.</li>
                            <li>Clean up <strong>after using</strong> the equipment.</li>
                        </ul>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "gerunds-prepositions-without-before-after-1",
                    title: "Practice: Without, Before, After + Gerund",
                    instructions: "Choose the correct form to complete each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Don't leave _____ clocking out.",
                            options: [
                                { value: "a", label: "without clocking out (without + gerund)" },
                                { value: "b", label: "without to clock out (without + infinitive)" },
                                { value: "c", label: "without clock out (without + base verb)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Wash your hands _____ eating.",
                            options: [
                                { value: "a", label: "before eating (before + gerund)" },
                                { value: "b", label: "before to eat (before + infinitive)" },
                                { value: "c", label: "before eat (before + base verb)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Call me _____ finishing your shift.",
                            options: [
                                { value: "a", label: "after finishing (after + gerund)" },
                                { value: "b", label: "after to finish (after + infinitive)" },
                                { value: "c", label: "after finish (after + base verb)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What form always comes after 'without,' 'before,' and 'after'?",
                            options: [
                                { value: "a", label: "Gerund (-ing form)" },
                                { value: "b", label: "Infinitive (to + verb)" },
                                { value: "c", label: "Base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference: Gerunds After Prepositions",
            icon: "📋",
            explanation: `
                <h3>The Golden Rule</h3>
                <p style="font-size: 1.25rem; padding: 1rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem; text-align: center; font-weight: 600;">
                    Preposition + Gerund (-ing form)
                </p>

                <h3>Common Patterns for Work/Life</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Pattern</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">interested in + gerund</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I'm interested in working here.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">good/bad at + gerund</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">She's good at solving problems.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">by + gerund</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I get to work by taking the bus.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">thank you for + gerund</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Thank you for considering my application.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">without + gerund</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Don't leave without clocking out.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">before/after + gerund</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Wash hands before eating.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ "I'm interested in to work" → ✅ "I'm interested in working"</li>
                    <li>❌ "Thank you for help me" → ✅ "Thank you for helping me"</li>
                    <li>❌ "I'm good at to solve problems" → ✅ "I'm good at solving problems"</li>
                    <li>❌ "By take the bus" → ✅ "By taking the bus"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Memory Trick",
                content: "After IN, AT, FOR, BY, WITHOUT = Always -ING. No exceptions!",
            },
            exercises: [
                {
                    id: "gerunds-prepositions-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of gerunds after prepositions.",
                    items: [
                        {
                            type: "radio",
                            label: "What form comes after prepositions?",
                            options: [
                                { value: "a", label: "Always gerund (-ing form)" },
                                { value: "b", label: "Always infinitive (to + verb)" },
                                { value: "c", label: "Base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I'm interested in working here." },
                                { value: "b", label: "I'm interested in to work here." },
                                { value: "c", label: "I'm interested in work here." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "Thank you for considering my application." },
                                { value: "b", label: "Thank you for to consider my application." },
                                { value: "c", label: "Thank you for consider my application." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I get to work by taking the bus." },
                                { value: "b", label: "I get to work by take the bus." },
                                { value: "c", label: "I get to work by to take the bus." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the golden rule for prepositions?",
                            options: [
                                { value: "a", label: "Preposition + Gerund (-ing form) - always" },
                                { value: "b", label: "Preposition + Infinitive (to + verb)" },
                                { value: "c", label: "Either form is fine" },
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
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "I'm interested in to work here." },
                { value: "b", label: "I'm interested in work here." },
                { value: "c", label: "I'm interested in working here." },
            ],
            correctAnswer: "c",
            explanation: "After a preposition (in), we use the gerund (-ing form), not the infinitive (to + verb).",
        },
        {
            id: "quiz-2",
            question: "Complete: 'I get to work ___.'",
            options: [
                { value: "a", label: "by take the bus" },
                { value: "b", label: "by taking the bus" },
                { value: "c", label: "by to take the bus" },
            ],
            correctAnswer: "b",
            explanation: "After 'by' (preposition), use the gerund: by taking.",
        },
        {
            id: "quiz-3",
            question: "Which is the most professional thank-you?",
            options: [
                { value: "a", label: "Thank you for consider my application." },
                { value: "b", label: "Thank you for to consider my application." },
                { value: "c", label: "Thank you for considering my application." },
            ],
            correctAnswer: "c",
            explanation: "After 'for' (preposition), use the gerund: for considering.",
        },
        {
            id: "quiz-4",
            question: "Complete: 'She's good ___ with customers.'",
            options: [
                { value: "a", label: "at work" },
                { value: "b", label: "at working" },
                { value: "c", label: "at to work" },
            ],
            correctAnswer: "b",
            explanation: "After 'at' (preposition), use the gerund: at working.",
        },
        {
            id: "quiz-5",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "Don't leave without clock out." },
                { value: "b", label: "Don't leave without to clock out." },
                { value: "c", label: "Don't leave without clocking out." },
            ],
            correctAnswer: "c",
            explanation: "After 'without' (preposition), use the gerund: without clocking out.",
        },
    ],
};
