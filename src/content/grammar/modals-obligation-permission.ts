import type { InteractiveGuideContent, ExerciseItem } from "@/types/activity";

export const modalsObligationPermissionContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Modals: Must, Have To, Can, May, Should - The Politeness Game",
            icon: "🎭",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"You must clock in before your shift." "Can I leave early today?" "Should I email my manager?" At work, the way you ask for permission or talk about obligations can make or break relationships. Modals are your secret weapon for sounding professional and polite.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Understanding modals helps you:</p>
                <ul>
                    <li><strong>Navigate workplace expectations</strong> - Know what's required vs. recommended</li>
                    <li><strong>Ask politely for what you need</strong> - Permission, time off, help, clarification</li>
                    <li><strong>Sound professional</strong> - Choose the right level of formality</li>
                    <li><strong>Understand your boss</strong> - Decode whether something is mandatory or optional</li>
                    <li><strong>Advocate for yourself</strong> - Request changes without sounding demanding</li>
                </ul>
            `,
            exercises: [
                {
                    id: "modals-intro-1",
                    title: "Quick Check: What Does It Mean?",
                    instructions: "Choose the best meaning.",
                    items: [
                        {
                            type: "radio",
                            label: "You <strong>must</strong> clock in before your shift.",
                            options: [
                                { value: "required", label: "Required (no choice)" },
                                { value: "suggestion", label: "Suggestion (optional)" },
                                { value: "permission", label: "Permission (allowed)" },
                            ],
                            expectedAnswer: "required",
                        },
                        {
                            type: "radio",
                            label: "<strong>Could</strong> I leave early today?",
                            options: [
                                { value: "permission", label: "Asking for permission (very polite)" },
                                { value: "required", label: "Stating a rule" },
                                { value: "past", label: "Talking about the past" },
                            ],
                            expectedAnswer: "permission",
                        },
                    ],
                },
            ],
        },

        // Modals Overview
        {
            id: "modals-overview",
            stepNumber: 1,
            title: "What Are Modals?",
            icon: "🔑",
            explanation: `
                <h3>Special Helping Verbs That Change Everything</h3>
                <p>Modals are special verbs that come before the main verb and change its meaning. They express things like:</p>

                <div style="margin-top: 1.5rem; background: rgba(200, 107, 81, 0.1); padding: 1.5rem; border-radius: 0.5rem;">
                    <ul>
                        <li><strong>Obligation:</strong> must, have to (you're required to do it)</li>
                        <li><strong>Permission:</strong> can, may, could (you're allowed to do it)</li>
                        <li><strong>Advice:</strong> should, ought to (it's a good idea)</li>
                        <li><strong>Possibility:</strong> might, could (it may happen)</li>
                    </ul>
                </div>

                <h4>Important Pattern:</h4>
                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 2px solid #7ba884;">
                    <p style="margin: 0; font-size: 1.125rem; text-align: center;">
                        <span style="color: #3b82f6;">Subject</span> +
                        <span style="color: #d97757; font-weight: 600;"> Modal </span> +
                        <span style="color: #22c55e;">Base Verb</span>
                    </p>
                    <p style="margin: 0.5rem 0 0 0; text-align: center; font-style: italic;">
                        I <strong style="color: #d97757;">must</strong> work. She <strong style="color: #d97757;">can</strong> leave. You <strong style="color: #d97757;">should</strong> ask.
                    </p>
                </div>
            `,
            exercises: [
                {
                    id: "modals-overview-1",
                    title: "Practice: Modal + Base Verb",
                    instructions: "Choose the correct sentence (base verb after the modal).",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "She can help today." },
                                { value: "b", label: "She can helps today." },
                                { value: "c", label: "She cans help today." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "I must to leave now." },
                                { value: "b", label: "I must leave now." },
                                { value: "c", label: "I must leaving now." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Grammar Rule",
                content:
                    "Modals don't change form! No -s, no -ed, no -ing. 'She cans'? NO. 'She musted'? NO. 'I am musting'? DEFINITELY NO. Just: She can, She must, I am required to.",
            },
        },

        // Must vs Have To
        {
            id: "must-have-to",
            stepNumber: 2,
            title: "Must vs Have To: Strong Obligation",
            icon: "⚠️",
            explanation: `
                <h3>Both Mean "Required" - But There's a Difference</h3>
                <p>Both <strong>must</strong> and <strong>have to</strong> express obligation (you don't have a choice), but they have slightly different uses:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #dc2626;">MUST = Personal Authority, Rules, Strong Internal Feeling</h4>
                    <p>Use when YOU feel it's necessary, or when stating official rules:</p>
                    <ul>
                        <li>Employees <strong>must</strong> wear safety equipment. (official rule)</li>
                        <li>You <strong>must</strong> wash your hands before handling food. (regulation)</li>
                        <li>I <strong>must</strong> finish this report today. (I feel it's urgent)</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #3b82f6;">HAVE TO = External Authority, Someone Else's Rule</h4>
                    <p>Use when someone else (boss, company, law) requires it:</p>
                    <ul>
                        <li>I <strong>have to</strong> work weekends. (my boss requires it)</li>
                        <li>We <strong>have to</strong> clock in by 8 AM. (company policy)</li>
                        <li>She <strong>has to</strong> take a drug test. (employer requirement)</li>
                    </ul>
                </div>

                <h4>In Practice:</h4>
                <p>Americans use "have to" much more often than "must" in everyday speech. "Must" can sound very formal or strong.</p>
                <ul>
                    <li><strong>Signs/Written rules:</strong> "Employees must wear hairnets"</li>
                    <li><strong>Spoken/Everyday:</strong> "I have to wear a hairnet at work"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Don't Have To vs Must Not",
                content:
                    "IMPORTANT: 'don't have to' = not necessary (you can choose). 'must not' = forbidden (you can't do it). Example: 'You don't have to come early' (optional) vs 'You must not be late' (prohibited).",
            },
            exercises: [
                {
                    id: "ex-must-have-1",
                    title: "Practice: Must or Have To?",
                    instructions:
                        "Choose the more natural option for each workplace situation.",
                    items: [
                        {
                            type: "radio",
                            label: "My boss says I ___ work this Saturday.",
                            options: [
                                { value: "must", label: "must" },
                                { value: "have-to", label: "have to" },
                            ],
                            expectedAnswer: "have-to",
                        },
                        {
                            type: "radio",
                            label: "The sign says: 'Visitors ___ sign in at the front desk.'",
                            options: [
                                { value: "must", label: "must" },
                                { value: "have-to", label: "have to" },
                            ],
                            expectedAnswer: "must",
                        },
                        {
                            type: "radio",
                            label: "I ___ finish this project by Friday or I'll get in trouble. (personal urgency)",
                            options: [
                                { value: "must", label: "must" },
                                { value: "have-to", label: "have to" },
                            ],
                            expectedAnswer: "must",
                        },
                    ],
                },
            ],
        },

        // Can vs May
        {
            id: "can-may",
            stepNumber: 3,
            title: "Can vs May: Asking for Permission",
            icon: "🙋",
            explanation: `
                <h3>The Politeness Scale</h3>
                <p>When asking for permission, you have options - and your choice affects how polite you sound:</p>

                <div style="margin: 1.5rem 0;">
                    <div style="padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #22c55e;">
                        <h4 style="color: #22c55e; margin-top: 0;">CAN = Informal, Direct</h4>
                        <p style="margin: 0;">Use with friends, close coworkers, casual situations</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li><strong>Can I</strong> take a break?</li>
                            <li><strong>Can I</strong> leave a few minutes early?</li>
                            <li><strong>Can I</strong> ask you a question?</li>
                        </ul>
                    </div>

                    <div style="padding: 1rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #a855f7;">
                        <h4 style="color: #a855f7; margin-top: 0;">MAY = More Formal, Polite</h4>
                        <p style="margin: 0;">Use with supervisors, customers, formal situations</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li><strong>May I</strong> speak with you for a moment?</li>
                            <li><strong>May I</strong> have tomorrow off?</li>
                            <li><strong>May I</strong> ask what time the meeting is?</li>
                        </ul>
                    </div>

                    <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="color: #3b82f6; margin-top: 0;">COULD = Most Polite, Tentative</h4>
                        <p style="margin: 0;">Use for big requests, or when you're unsure about the answer</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li><strong>Could I</strong> possibly leave early today? (big request)</li>
                            <li><strong>Could I</strong> request a schedule change? (formal request)</li>
                            <li><strong>Could I</strong> speak with the manager? (polite, tentative)</li>
                        </ul>
                    </div>
                </div>

                <h4>In American English:</h4>
                <p>"Can I...?" is by far the most common in everyday workplace situations. "May I...?" sounds more formal but is still perfectly acceptable. "Could I...?" is extra polite for sensitive requests.</p>
            `,
            exercises: [
                {
                    id: "ex-can-may-1",
                    title: "Practice: Choose the Right Politeness Level",
                    instructions:
                        "Select the best option for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Asking your coworker if you can borrow their pen:",
                            options: [
                                { value: "can", label: "Can I borrow your pen?" },
                                { value: "may", label: "May I borrow your pen?" },
                                { value: "could", label: "Could I possibly borrow your pen?" },
                            ],
                            expectedAnswer: "can",
                        },
                        {
                            type: "radio",
                            label: "Asking your supervisor for time off for a family emergency:",
                            options: [
                                { value: "can", label: "Can I have Friday off?" },
                                { value: "may", label: "May I have Friday off?" },
                                { value: "could", label: "Could I request Friday off for a family emergency?" },
                            ],
                            expectedAnswer: "could",
                        },
                        {
                            type: "radio",
                            label: "Asking the HR manager a quick question:",
                            options: [
                                { value: "can", label: "Can I ask you something?" },
                                { value: "may", label: "May I ask you a quick question?" },
                                { value: "could", label: "Could I possibly ask you something?" },
                            ],
                            expectedAnswer: "may",
                        },
                    ],
                },
            ],
        },

        // Should for Advice
        {
            id: "should",
            stepNumber: 4,
            title: "Should: Advice and Recommendations",
            icon: "💡",
            explanation: `
                <h3>Should = Good Idea, Recommended (But Not Required)</h3>
                <p><strong>Should</strong> expresses advice, recommendations, or expectations - but NOT obligations. It means "this is the right thing to do" or "this is expected."</p>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Giving Advice:</h4>
                    <ul>
                        <li>You <strong>should</strong> arrive 10 minutes early on your first day.</li>
                        <li>She <strong>should</strong> talk to HR about that issue.</li>
                        <li>We <strong>should</strong> double-check the schedule.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Asking for Advice:</h4>
                    <ul>
                        <li><strong>Should I</strong> email my boss or call?</li>
                        <li>What <strong>should I</strong> wear to the interview?</li>
                        <li><strong>Should I</strong> ask for a raise now or wait?</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Expectations:</h4>
                    <ul>
                        <li>The package <strong>should</strong> arrive by Friday. (we expect it to)</li>
                        <li>She <strong>should</strong> be here by now. (I'm surprised she's not)</li>
                        <li>That <strong>should</strong> be enough time. (probably is)</li>
                    </ul>
                </div>

                <h4>Should vs Must/Have To:</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);"><strong>Must/Have To</strong> = Required</td>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>must</strong> clock in. (no choice)</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(34, 197, 94, 0.1);"><strong>Should</strong> = Recommended</td>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>should</strong> clock in early. (good idea, but optional)</td>
                    </tr>
                </table>
            `,
            tipBox: {
                title: "💡 Understanding Your Boss",
                content:
                    "When your boss says 'you should...' they usually mean 'you really need to' (closer to must than to maybe). Context matters! In performance reviews or direct instructions, 'should' often carries more weight than just advice.",
            },
            exercises: [
                {
                    id: "ex-should-1",
                    title: "Practice: Should for Advice",
                    instructions:
                        "Complete each workplace advice sentence with 'should' or 'should not' (shouldn't).",
                    items: [
                        {
                            type: "text",
                            label: "1. You ___ arrive at least 5 minutes before your shift starts. (positive advice)",
                            expectedAnswer: "should",
                        },
                        {
                            type: "text",
                            label: "2. You ___ use your phone during meetings. (negative advice)",
                            expectedAnswers: ["should not", "shouldn't", "shouldnt"],
                        } as ExerciseItem,
                        {
                            type: "text",
                            label: "3. I ___ ask for clarification if I don't understand something. (positive advice)",
                            expectedAnswer: "should",
                        },
                        {
                            type: "text",
                            label: "4. We ___ skip the safety training. (negative advice)",
                            expectedAnswers: ["should not", "shouldn't", "shouldnt"],
                        } as ExerciseItem,
                    ],
                },
            ],
        },

        // Politeness Levels
        {
            id: "politeness-levels",
            stepNumber: 5,
            title: "The Politeness Ladder: Making Requests at Work",
            icon: "🪜",
            explanation: `
                <h3>From Casual to Super Polite</h3>
                <p>The same request can be phrased many ways. Your choice depends on the situation and relationship:</p>

                <div style="margin: 1.5rem 0; background: rgba(200, 107, 81, 0.1); padding: 1.5rem; border-radius: 0.5rem;">
                    <h4>Example: Asking Someone to Help You</h4>

                    <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.5rem;">
                        <strong style="color: #dc2626;">Least Polite (Direct Command):</strong><br/>
                        "Help me with this."
                    </div>

                    <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(249, 115, 22, 0.1); border-radius: 0.5rem;">
                        <strong style="color: #f97316;">Casual (with friends/close coworkers):</strong><br/>
                        "Can you help me with this?"
                    </div>

                    <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.5rem;">
                        <strong style="color: #22c55e;">Polite (standard workplace):</strong><br/>
                        "Could you help me with this?"
                    </div>

                    <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                        <strong style="color: #3b82f6;">More Polite (with supervisor/stranger):</strong><br/>
                        "Would you be able to help me with this?"
                    </div>

                    <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem;">
                        <strong style="color: #a855f7;">Most Polite (big favor/formal):</strong><br/>
                        "I was wondering if you might be able to help me with this?"
                    </div>
                </div>

                <h4>Modal Politeness Scale for Requests:</h4>
                <ol style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <li><strong>Can you...?</strong> (casual, direct)</li>
                    <li><strong>Could you...?</strong> (polite, standard)</li>
                    <li><strong>Would you...?</strong> (more polite)</li>
                    <li><strong>Would you mind...?</strong> (very polite)</li>
                    <li><strong>I was wondering if you could...?</strong> (extremely polite)</li>
                </ol>
            `,
            exercises: [
                {
                    id: "ex-politeness-1",
                    title: "Practice: Rewrite for Politeness",
                    instructions:
                        "Rewrite each direct command as a polite request using 'Could you' or 'Would you'.",
                    items: [
                        {
                            type: "text",
                            label: "1. Direct: 'Send me that file.' → Polite: '___'",
                            expectedAnswer: "Could you send me that file?",
                        },
                        {
                            type: "text",
                            label: "2. Direct: 'Check the schedule.' → Polite: '___'",
                            expectedAnswer: "Could you check the schedule?",
                        },
                        {
                            type: "text",
                            label: "3. Direct: 'Close the door.' → Polite: '___'",
                            expectedAnswer: "Would you close the door?",
                        },
                    ],
                },
            ],
        },

        // Workplace Scenarios
        {
            id: "workplace-scenarios",
            stepNumber: 6,
            title: "Real Workplace Situations: Choosing the Right Modal",
            icon: "💼",
            explanation: `
                <h3>Practice Thinking Like a Professional</h3>
                <p>Let's apply what you learned to real workplace situations:</p>

                <div style="margin: 1.5rem 0;">
                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 1: You're sick and need to call in</h4>
                        <p><strong>❌ Too casual:</strong> "I can't come in today."</p>
                        <p><strong>✓ Professional:</strong> "I'm not feeling well. I won't be able to come in today."</p>
                        <p><strong>✓ Very professional:</strong> "I'm ill and won't be able to work today. Should I find someone to cover my shift?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 2: You need help with a task</h4>
                        <p><strong>❌ Too direct:</strong> "Help me with this."</p>
                        <p><strong>✓ Polite:</strong> "Could you help me with this when you have a moment?"</p>
                        <p><strong>✓ More polite:</strong> "I was wondering if you could help me understand how to do this?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 3: You want to leave early</h4>
                        <p><strong>❌ Too casual:</strong> "Can I go now?"</p>
                        <p><strong>✓ Better:</strong> "Would it be okay if I left a bit early today?"</p>
                        <p><strong>✓ Best:</strong> "I have an appointment. Would it be possible for me to leave 30 minutes early today?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 4: You don't understand instructions</h4>
                        <p><strong>❌ Vague:</strong> "I don't get it."</p>
                        <p><strong>✓ Professional:</strong> "Could you explain that again?"</p>
                        <p><strong>✓ More specific:</strong> "I want to make sure I understand. Should I do X first, or Y?"</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-scenarios-1",
                    title: "Practice: Choose the Best Response",
                    instructions:
                        "Pick the most professional option for each workplace situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Your boss asks you to work overtime, but you have plans:",
                            options: [
                                { value: "a", label: "I can't, I have plans." },
                                { value: "b", label: "I have a prior commitment tonight. Would it be possible to do it tomorrow instead?" },
                                { value: "c", label: "No thanks." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You need a coworker to switch shifts with you:",
                            options: [
                                { value: "a", label: "Can you take my shift?" },
                                { value: "b", label: "Switch with me." },
                                { value: "c", label: "I have a situation on Friday. Would you be able to switch shifts with me?" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "You need to ask your manager about a policy:",
                            options: [
                                { value: "a", label: "What's the rule about breaks?" },
                                { value: "b", label: "Could you clarify the policy on break times?" },
                                { value: "c", label: "Tell me about breaks." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Quick Reference: Modals for Work Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>Modals at a Glance</h3>

                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Modal</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Meaning</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>must</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Strong obligation (rule/law)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Employees must wash hands.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>have to</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Obligation (external rule)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I have to work weekends.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>should</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Advice/recommendation</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You should arrive early.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>can</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Permission (casual)/ability</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Can I take a break?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>may</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Permission (formal)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">May I speak with you?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>could</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Permission (polite)/possibility</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Could I leave early?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>would</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Polite request</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Would you help me?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>might</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Possibility (maybe)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I might be late.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Politeness Scale for Requests</h3>
                <ol style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <li>Can you...? (casual)</li>
                    <li>Could you...? (polite)</li>
                    <li>Would you...? (more polite)</li>
                    <li>Would you mind...? (very polite)</li>
                    <li>I was wondering if you could...? (extremely polite)</li>
                </ol>

                <h3>Key Grammar Rules</h3>
                <ul>
                    <li><strong>Pattern:</strong> Subject + modal + base verb (no -s, no -ing!)</li>
                    <li><strong>Negative:</strong> modal + not → can't, shouldn't, mustn't, don't have to</li>
                    <li><strong>Questions:</strong> Modal + subject + base verb? → Can I...? Should we...?</li>
                </ul>

                <h3>Common Mistakes to Avoid</h3>
                <ul>
                    <li>❌ "She cans come" → ✅ "She can come" (no -s on modals)</li>
                    <li>❌ "I must to work" → ✅ "I must work" OR "I have to work" (no 'to' after must)</li>
                    <li>❌ "You don't must" → ✅ "You must not" OR "You don't have to" (correct negative forms)</li>
                    <li>❌ "Could you helping me?" → ✅ "Could you help me?" (base verb after modal)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Real-World Tip",
                content:
                    "When in doubt at work, err on the side of being MORE polite. 'Could you...?' and 'Would you...?' are safe choices for almost any workplace request. Save 'Can you...?' for coworkers you know well.",
            },
            exercises: [
                {
                    id: "modals-summary-1",
                    title: "Quick Review: Choose the Best Modal",
                    instructions: "Pick the best option for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "It’s a rule: You _____ wear your badge at work.",
                            options: ["must", "should", "can"],
                            expectedAnswer: "must",
                        },
                        {
                            type: "select",
                            label: "You want to be very polite to your manager: _____ I leave early today?",
                            options: ["Can", "May", "Could"],
                            expectedAnswer: "Could",
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
            question: "Which sentence expresses obligation (you're required to do it)?",
            options: [
                { value: "a", label: "You should clock in before your shift." },
                { value: "b", label: "You must clock in before your shift." },
                { value: "c", label: "You can clock in before your shift." },
            ],
            correctAnswer: "b",
            explanation: "'Must' = obligation/requirement. 'Should' = advice (recommended but not required). 'Can' = permission/ability.",
        },
        {
            id: "quiz-2",
            question: "Which is the most polite way to ask your boss for help?",
            options: [
                { value: "a", label: "Can you help me?" },
                { value: "b", label: "Help me with this." },
                { value: "c", label: "Could you help me with this when you have a moment?" },
            ],
            correctAnswer: "c",
            explanation: "'Could you' is more polite than 'Can you,' and adding 'when you have a moment' shows respect for their time.",
        },
        {
            id: "quiz-3",
            question: "What's the difference? 'You don't have to wear a tie' vs 'You must not wear jeans'",
            options: [
                { value: "a", label: "They mean the same thing." },
                { value: "b", label: "First = optional (you can choose). Second = forbidden (you can't do it)." },
                { value: "c", label: "First = forbidden. Second = optional." },
            ],
            correctAnswer: "b",
            explanation: "'Don't have to' = not necessary (you can if you want). 'Must not' = prohibited (you're not allowed).",
        },
        {
            id: "quiz-4",
            question: "Your manager says: 'You should finish this by Friday.' What does this mean?",
            options: [
                { value: "a", label: "It's just a suggestion, you can finish whenever." },
                { value: "b", label: "It's strongly recommended/expected (closer to must in a work context)." },
                { value: "c", label: "You are absolutely required to finish by Friday or you'll be fired." },
            ],
            correctAnswer: "b",
            explanation: "At work, 'should' from your boss usually means it's expected, not just a casual suggestion. Context matters!",
        },
        {
            id: "quiz-5",
            question: "Which sentence is grammatically correct?",
            options: [
                { value: "a", label: "She cans work overtime tomorrow." },
                { value: "b", label: "She can works overtime tomorrow." },
                { value: "c", label: "She can work overtime tomorrow." },
            ],
            correctAnswer: "c",
            explanation: "Modals don't take -s, and the verb after a modal is always the base form (no -s, no -ing): can work.",
        },
    ],
};
