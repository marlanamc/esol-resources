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
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"I want to work here" or "I want working here"? "I enjoy to cook" or "I enjoy cooking"? Some verbs need infinitives (to + verb), some need gerunds (-ing), and some take both! Master this, and you'll sound like a native speaker.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>This is one of the trickiest parts of English, but it's everywhere in daily conversation:</p>
                <ul>
                    <li><strong>At work:</strong> "I decided <em>to apply</em>" vs "I finished <em>working</em>"</li>
                    <li><strong>In negotiations:</strong> "I'd like <em>to request</em>" vs "I avoid <em>working</em> weekends"</li>
                    <li><strong>Making plans:</strong> "I plan <em>to start</em>" vs "I enjoy <em>teaching</em>"</li>
                </ul>
            `,
            exercises: [
                {
                    id: "infinitives-gerunds-intro-1",
                    title: "Practice: Infinitive or Gerund?",
                    instructions: "Choose whether each sentence uses an infinitive (to + verb) or gerund (verb + -ing).",
                    items: [
                        {
                            type: "radio",
                            label: '"I want to work here."',
                            options: [
                                { value: "infinitive", label: "Infinitive (to + verb)" },
                                { value: "gerund", label: "Gerund (verb + -ing)" },
                                { value: "both", label: "Both are correct" },
                            ],
                            expectedAnswer: "infinitive",
                        },
                        {
                            type: "radio",
                            label: '"I enjoy cooking."',
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
                            label: '"I want to work here." What form is used?',
                            options: [
                                { value: "infinitive", label: "Infinitive (to + base verb) - expresses intention/goal" },
                                { value: "gerund", label: "Gerund (verb + -ing) - expresses activity" },
                            ],
                            expectedAnswer: "infinitive",
                        },
                        {
                            type: "radio",
                            label: '"I enjoy working here." What form is used?',
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
            id: "infinitive-verbs",
            stepNumber: 2,
            title: "Verbs + Infinitive (to + verb)",
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
                            label: "1. I want ___ (work) in healthcare.",
                            expectedAnswer: "to work",
                        },
                        {
                            type: "text",
                            label: "2. She decided ___ (apply) for the promotion.",
                            expectedAnswer: "to apply",
                        },
                        {
                            type: "text",
                            label: "3. We plan ___ (start) next month.",
                            expectedAnswer: "to start",
                        },
                        {
                            type: "text",
                            label: "4. He refused ___ (work) weekends.",
                            expectedAnswer: "to work",
                        },
                    ],
                },
            ],
        },

        {
            id: "gerund-verbs",
            stepNumber: 3,
            title: "Verbs + Gerund (verb + -ing)",
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
                            label: "1. I enjoy ___ (teach) English.",
                            expectedAnswer: "teaching",
                        },
                        {
                            type: "text",
                            label: "2. She finished ___ (write) her resume.",
                            expectedAnswer: "writing",
                        },
                        {
                            type: "text",
                            label: "3. We avoid ___ (eat) fast food.",
                            expectedAnswer: "eating",
                        },
                        {
                            type: "text",
                            label: "4. He quit ___ (work) there last year.",
                            expectedAnswer: "working",
                        },
                    ],
                },
            ],
        },

        {
            id: "both",
            stepNumber: 4,
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
                            label: "You want to say 'Don't forget to send the email':",
                            options: [
                                { value: "a", label: "Remember sending the email." },
                                { value: "b", label: "Remember to send the email." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You want to say 'I quit smoking cigarettes':",
                            options: [
                                { value: "a", label: "I stopped to smoke." },
                                { value: "b", label: "I stopped smoking." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "practical-tips",
            stepNumber: 5,
            title: "Practical Tips for Real Life",
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
                                { value: "a", label: "Infinitives - 'I want to work for your company' (goals/future plans)" },
                                { value: "b", label: "Gerunds - 'I want working for your company' (incorrect)" },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When talking about your experience, which form should you use?",
                            options: [
                                { value: "a", label: "Gerunds - 'I enjoy working with teams' (experience/activities)" },
                                { value: "b", label: "Infinitives - 'I enjoy to work with teams' (incorrect)" },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When making a request, which form should you use?",
                            options: [
                                { value: "a", label: "Infinitives - 'I'd like to request a schedule change' (requests/goals)" },
                                { value: "b", label: "Gerunds - 'I'd like requesting a schedule change' (incorrect)" },
                                { value: "c", label: "Either form is fine" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When expressing what you don't mind doing, which form should you use?",
                            options: [
                                { value: "a", label: "Gerunds - 'I don't mind working weekends' (activities/experiences)" },
                                { value: "b", label: "Infinitives - 'I don't mind to work weekends' (incorrect)" },
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
            title: "Quick Reference: Infinitives vs Gerunds Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>Common Verbs + Infinitive (to + verb)</h3>
                <p style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem;">
                    want, need, decide, plan, hope, expect, agree, refuse, promise, offer, would like
                </p>

                <h3>Common Verbs + Gerund (verb + -ing)</h3>
                <p style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem;">
                    enjoy, finish, avoid, keep, quit/stop, consider, suggest, recommend, mind, miss
                </p>

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
                    <li>❌ "I enjoy to work here" → ✅ "I enjoy working here"</li>
                    <li>❌ "I want working here" → ✅ "I want to work here"</li>
                    <li>❌ "She finished to study" → ✅ "She finished studying"</li>
                    <li>❌ "We decided applying" → ✅ "We decided to apply"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 When in Doubt",
                content: "If the verb expresses a FUTURE goal, decision, or desire, try the infinitive first. If it expresses an EXPERIENCE or ongoing activity, try the gerund. Most of the time, this works!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "I enjoy to work with children." },
                { value: "b", label: "I enjoy working with children." },
                { value: "c", label: "I enjoy work with children." },
            ],
            correctAnswer: "b",
            explanation: "'Enjoy' takes a gerund (-ing form), not an infinitive.",
        },
        {
            id: "quiz-2",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "I decided applying for the job." },
                { value: "b", label: "I decided to apply for the job." },
                { value: "c", label: "I decided apply for the job." },
            ],
            correctAnswer: "b",
            explanation: "'Decide' takes an infinitive (to + verb), not a gerund.",
        },
        {
            id: "quiz-3",
            question: "What's the difference? 'I stopped to smoke' vs 'I stopped smoking'",
            options: [
                { value: "a", label: "They mean the same thing." },
                { value: "b", label: "First = I paused to have a cigarette. Second = I quit cigarettes." },
                { value: "c", label: "First = I quit cigarettes. Second = I paused to have a cigarette." },
            ],
            correctAnswer: "b",
            explanation: "'Stop to do' = pause in order to do. 'Stop doing' = quit the activity.",
        },
        {
            id: "quiz-4",
            question: "Complete: 'She finished ___ her application.'",
            options: [
                { value: "a", label: "to complete" },
                { value: "b", label: "completing" },
                { value: "c", label: "complete" },
            ],
            correctAnswer: "b",
            explanation: "'Finish' always takes a gerund: finished completing.",
        },
        {
            id: "quiz-5",
            question: "Which verb can take BOTH infinitive and gerund with the same meaning?",
            options: [
                { value: "a", label: "enjoy" },
                { value: "b", label: "start" },
                { value: "c", label: "finish" },
            ],
            correctAnswer: "b",
            explanation: "'Start' can take both: 'started to work' = 'started working' (same meaning). 'Enjoy' only takes gerund, 'finish' only takes gerund.",
        },
    ],
};
