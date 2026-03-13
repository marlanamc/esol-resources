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

                <div style="background: rgba(200, 107, 81, 0.08); padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.1rem;">💪 Modal Strength Meter: How Strong Is It?</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: rgba(220, 38, 38, 0.15); border-radius: 0.25rem;">
                            <span style="font-size: 1.25rem;">💪💪💪</span>
                            <span><strong>STRONG:</strong> must, have to</span>
                            <span style="color: #666; font-size: 0.9rem;">(required - no choice!)</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: rgba(249, 115, 22, 0.15); border-radius: 0.25rem;">
                            <span style="font-size: 1.25rem;">💪💪</span>
                            <span><strong>MEDIUM:</strong> should</span>
                            <span style="color: #666; font-size: 0.9rem;">(recommended - good idea)</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: rgba(34, 197, 94, 0.15); border-radius: 0.25rem;">
                            <span style="font-size: 1.25rem;">💪</span>
                            <span><strong>SOFT:</strong> can, may, could</span>
                            <span style="color: #666; font-size: 0.9rem;">(permission - asking politely)</span>
                        </div>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "modals-intro-1",
                    title: "Quick Check: What Does It Mean?",
                    instructions: "Choose the best meaning.",
                    items: [
                        {
                            type: "radio",
                            label: "You <span class='eg-helper'>must</span> clock in before your shift.",
                            options: [
                                { value: "suggestion", label: "Suggestion (optional)" },
                                { value: "required", label: "Required (no choice)" },
                                { value: "permission", label: "Permission (allowed)" },
                            ],
                            expectedAnswer: "required",
                        },
                        {
                            type: "radio",
                            label: "<span class='eg-helper'>Could</span> I leave early today?",
                            options: [
                                { value: "required", label: "Stating a rule" },
                                { value: "past", label: "Talking about the past" },
                                { value: "permission", label: "Asking for permission (very polite)" },
                            ],
                            expectedAnswer: "permission",
                        },
                    ],
                },
            ],
        },

        // Modals Overview - Condensed
        {
            id: "modals-overview",
            stepNumber: 1,
            title: "What Are Modals?",
            icon: "🔑",
            explanation: `
                <h3>Small Words, Big Power</h3>
                <p>Modals are special helping verbs that change how your sentence feels. Compare:</p>

                <div style="margin: 1rem 0; padding: 1rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Without modal:</strong> "I work Saturday." (just a fact)</p>
                    <p style="margin: 0 0 0.5rem 0;"><strong>With modal:</strong> "I <span style="color: #d97757; font-weight: 600;">have to</span> work Saturday." (my boss scheduled me)</p>
                    <p style="margin: 0;"><strong>Different modal:</strong> "I <span style="color: #d97757; font-weight: 600;">can</span> work Saturday." (I'm available if needed)</p>
                </div>

                <p>In this guide, you'll learn the most important modals for work: <strong>must</strong>, <strong>have to</strong>, <strong>should</strong>, <strong>can</strong>, <strong>may</strong>, and <strong>could</strong>.</p>

                <h4>🎯 The One Rule You Need:</h4>
                <div style="margin: 1rem 0; padding: 1rem; background: var(--color-surface-elevated); color: var(--color-text); border-radius: 0.5rem; border: 2px solid #7ba884;">
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
                    "Modals don't change form! No -s, no -ed, no -ing. 'She cans'? NO. 'She musted'? NO. Just: She can, She must.",
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

                <div style="margin-top: 2rem; border: 3px solid #ef4444; border-radius: 0.75rem; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 0.75rem 1rem; border-bottom: 2px dashed #ef4444;">
                        <h4 style="margin: 0; color: #dc2626; font-size: 1.1rem;">🚨 DANGER ZONE: Don't Confuse These!</h4>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <div style="padding: 1rem; background: rgba(34, 197, 94, 0.1); border-bottom: 2px solid rgba(0,0,0,0.1);">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="font-size: 1.5rem;">✅</span>
                                <strong style="color: #16a34a; font-size: 1.1rem;">GREEN ZONE: "don't have to"</strong>
                            </div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 1rem;"><strong>= Optional!</strong> Your choice! 🎉</p>
                            <p style="margin: 0; font-style: italic; color: #374151;">"You <strong>don't have to</strong> come early." → You CAN come early if you want, but it's not required.</p>
                        </div>
                        <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1);">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="font-size: 1.5rem;">🚫</span>
                                <strong style="color: #dc2626; font-size: 1.1rem;">RED ZONE: "must not"</strong>
                            </div>
                            <p style="margin: 0 0 0.5rem 0; font-size: 1rem;"><strong>= Forbidden!</strong> Not allowed! ⛔</p>
                            <p style="margin: 0; font-style: italic; color: #374151;">"You <strong>must not</strong> be late." → Being late is NOT okay. Don't do it!</p>
                        </div>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Quick Memory Trick",
                content:
                    "Think of a red traffic light 🚦: 'Must NOT' = STOP, don't do it. But 'don't have to' = green light, go if you want!",
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
                                { value: "have-to", label: "have to" },
                                { value: "must", label: "must" },
                            ],
                            expectedAnswer: "have-to",
                        },
                        {
                            type: "radio",
                            label: "The sign says: 'Visitors ___ sign in at the front desk.'",
                            options: [
                                { value: "have-to", label: "have to" },
                                { value: "must", label: "must" },
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
                {
                    id: "ex-must-have-scramble",
                    title: "🧩 Word Scramble: Build the Sentence",
                    instructions:
                        "Put the words in the correct order to make a sentence.",
                    items: [
                        {
                            type: "word-scramble",
                            label: "Unscramble this workplace rule:",
                            words: ["must", "badge", "wear", "You", "your"],
                            correctAnswer: "You must wear your badge",
                        },
                        {
                            type: "word-scramble",
                            label: "Unscramble this sentence about a schedule:",
                            words: ["have", "Saturday", "to", "work", "I"],
                            correctAnswer: "I have to work Saturday",
                        },
                        {
                            type: "word-scramble",
                            label: "Unscramble this about optional rules:",
                            words: ["have", "don't", "to", "You", "early", "come"],
                            correctAnswer: "You don't have to come early",
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

                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(249, 115, 22, 0.1); border-radius: 0.5rem; border-left: 4px solid #f97316;">
                    <h4 style="color: #f97316; margin-top: 0;">💡 "Can" Has Two Meanings!</h4>
                    <p style="margin: 0.5rem 0;">Don't confuse them:</p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Permission:</strong> "<strong>Can I</strong> leave early?" (Am I allowed to?)</li>
                        <li><strong>Ability:</strong> "I <strong>can</strong> speak Spanish." (I have the skill.)</li>
                    </ul>
                    <p style="margin: 0.75rem 0 0 0; font-style: italic; color: #666;">Context usually makes it clear which meaning you intend!</p>
                </div>
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
                                { value: "may", label: "May I borrow your pen?" },
                                { value: "could", label: "Could I possibly borrow your pen?" },
                                { value: "can", label: "Can I borrow your pen?" },
                            ],
                            expectedAnswer: "can",
                        },
                        {
                            type: "radio",
                            label: "Asking your supervisor for time off for a family emergency:",
                            options: [
                                { value: "could", label: "Could I request Friday off for a family emergency?" },
                                { value: "can", label: "Can I have Friday off?" },
                                { value: "may", label: "May I have Friday off?" },
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

                <div style="margin: 1.5rem 0; padding: 1rem; background: var(--color-surface-elevated); color: var(--color-text); border-radius: 0.5rem; border: 1px solid var(--color-border-strong);">
                    <h4>Giving Advice:</h4>
                    <ul>
                        <li>You <strong>should</strong> arrive 10 minutes early on your first day.</li>
                        <li>She <strong>should</strong> talk to HR about that issue.</li>
                        <li>We <strong>should</strong> double-check the schedule.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: var(--color-surface-elevated); color: var(--color-text); border-radius: 0.5rem; border: 1px solid var(--color-border-strong);">
                    <h4>Asking for Advice:</h4>
                    <ul>
                        <li><strong>Should I</strong> email my boss or call?</li>
                        <li>What <strong>should I</strong> wear to the interview?</li>
                        <li><strong>Should I</strong> ask for a raise now or wait?</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: var(--color-surface-elevated); color: var(--color-text); border-radius: 0.5rem; border: 1px solid var(--color-border-strong);">
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
                            label: "You ___ arrive at least 5 minutes before your shift starts. (positive advice)",
                            expectedAnswer: "should",
                        },
                        {
                            type: "text",
                            label: "You ___ use your phone during meetings. (negative advice)",
                            expectedAnswers: ["should not", "shouldn't", "shouldnt"],
                        } as ExerciseItem,
                        {
                            type: "text",
                            label: "I ___ ask for clarification if I don't understand something. (positive advice)",
                            expectedAnswer: "should",
                        },
                        {
                            type: "text",
                            label: "We ___ skip the safety training. (negative advice)",
                            expectedAnswers: ["should not", "shouldn't", "shouldnt"],
                        } as ExerciseItem,
                    ],
                },
                {
                    id: "ex-should-sorting",
                    title: "🎯 Sort It Out: Required vs Recommended vs Optional",
                    instructions:
                        "Categorize each statement. Is it REQUIRED (must/have to), RECOMMENDED (should), or OPTIONAL (don't have to)?",
                    items: [
                        {
                            type: "radio",
                            label: "\"You must clock in by 8 AM.\"",
                            options: [
                                { value: "required", label: "🔴 REQUIRED (must do it)" },
                                { value: "recommended", label: "🟡 RECOMMENDED (good idea)" },
                                { value: "optional", label: "🟢 OPTIONAL (your choice)" },
                            ],
                            expectedAnswer: "required",
                        },
                        {
                            type: "radio",
                            label: "\"You should arrive 10 minutes early on your first day.\"",
                            options: [
                                { value: "required", label: "🔴 REQUIRED (must do it)" },
                                { value: "recommended", label: "🟡 RECOMMENDED (good idea)" },
                                { value: "optional", label: "🟢 OPTIONAL (your choice)" },
                            ],
                            expectedAnswer: "recommended",
                        },
                        {
                            type: "radio",
                            label: "\"You don't have to wear a tie to the office.\"",
                            options: [
                                { value: "required", label: "🔴 REQUIRED (must do it)" },
                                { value: "recommended", label: "🟡 RECOMMENDED (good idea)" },
                                { value: "optional", label: "🟢 OPTIONAL (your choice)" },
                            ],
                            expectedAnswer: "optional",
                        },
                        {
                            type: "radio",
                            label: "\"Employees have to complete safety training before starting.\"",
                            options: [
                                { value: "required", label: "🔴 REQUIRED (must do it)" },
                                { value: "recommended", label: "🟡 RECOMMENDED (good idea)" },
                                { value: "optional", label: "🟢 OPTIONAL (your choice)" },
                            ],
                            expectedAnswer: "required",
                        },
                        {
                            type: "radio",
                            label: "\"You should double-check your work before submitting.\"",
                            options: [
                                { value: "required", label: "🔴 REQUIRED (must do it)" },
                                { value: "recommended", label: "🟡 RECOMMENDED (good idea)" },
                                { value: "optional", label: "🟢 OPTIONAL (your choice)" },
                            ],
                            expectedAnswer: "recommended",
                        },
                    ],
                },
            ],
        },

        // Modal Decision Flowchart - New Visual Section
        {
            id: "modal-flowchart",
            stepNumber: 5,
            title: "Which Modal Should I Use? A Decision Guide",
            icon: "🗺️",
            explanation: `
                <h3>🚦 Choose Your Own Modal Adventure!</h3>
                <p>Not sure which modal to use? Follow this flowchart:</p>

                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.08) 0%, rgba(110, 145, 118, 0.08) 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0;">

                    <div style="text-align: center; padding: 1rem; background: rgba(59, 130, 246, 0.15); border-radius: 0.5rem; margin-bottom: 1rem;">
                        <strong style="font-size: 1.1rem;">🎯 START: What do you need to express?</strong>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">

                        <div style="padding: 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.5rem; border-left: 4px solid #dc2626;">
                            <strong style="color: #dc2626;">🔴 It's REQUIRED (no choice)</strong>
                            <div style="margin-left: 1rem; margin-top: 0.5rem;">
                                <p style="margin: 0.25rem 0;">↳ Is it written on a sign or official rule?</p>
                                <div style="margin-left: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
                                    <span>📋 <strong>Yes</strong> → Use <strong style="color: #dc2626;">MUST</strong></span>
                                    <span>👔 <strong>No</strong> (boss/schedule) → Use <strong style="color: #dc2626;">HAVE TO</strong></span>
                                </div>
                            </div>
                        </div>

                        <div style="padding: 1rem; background: rgba(249, 115, 22, 0.1); border-radius: 0.5rem; border-left: 4px solid #f97316;">
                            <strong style="color: #f97316;">🟡 It's a GOOD IDEA (advice/recommendation)</strong>
                            <div style="margin-left: 1rem; margin-top: 0.5rem;">
                                <span>💡 Use <strong style="color: #f97316;">SHOULD</strong></span>
                            </div>
                        </div>

                        <div style="padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                            <strong style="color: #22c55e;">🟢 You're asking PERMISSION</strong>
                            <div style="margin-left: 1rem; margin-top: 0.5rem;">
                                <p style="margin: 0.25rem 0;">↳ How polite do you need to be?</p>
                                <div style="margin-left: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
                                    <span>😊 <strong>Casual</strong> (friend/coworker) → Use <strong style="color: #22c55e;">CAN</strong></span>
                                    <span>🤝 <strong>Formal</strong> (HR/manager) → Use <strong style="color: #22c55e;">MAY</strong></span>
                                    <span>🙏 <strong>Very polite</strong> (big ask) → Use <strong style="color: #22c55e;">COULD</strong></span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                    <p style="margin: 0; text-align: center;"><strong>🎓 Pro Tip:</strong> When in doubt, <strong>COULD</strong> is almost always safe. It works for permission AND polite requests!</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-flowchart-1",
                    title: "Practice: Use the Flowchart",
                    instructions:
                        "Choose the best modal for each situation using the flowchart above.",
                    items: [
                        {
                            type: "radio",
                            label: "The company policy says all visitors need to sign in. (official rule)",
                            options: [
                                { value: "must", label: "must" },
                                { value: "have-to", label: "have to" },
                                { value: "should", label: "should" },
                            ],
                            expectedAnswer: "must",
                        },
                        {
                            type: "radio",
                            label: "Your friend recommends bringing lunch to save money. (good idea)",
                            options: [
                                { value: "must", label: "must" },
                                { value: "should", label: "should" },
                                { value: "can", label: "can" },
                            ],
                            expectedAnswer: "should",
                        },
                        {
                            type: "radio",
                            label: "Asking the CEO if you can present your idea. (very polite, big ask)",
                            options: [
                                { value: "can", label: "Can I..." },
                                { value: "could", label: "Could I..." },
                                { value: "may", label: "May I..." },
                            ],
                            expectedAnswer: "could",
                        },
                    ],
                },
            ],
        },

        // Politeness Levels
        {
            id: "politeness-levels",
            stepNumber: 6,
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

                <h4>🌡️ The Politeness Thermometer</h4>
                <p>Think of it like temperature - warmer = more polite!</p>

                <div style="background: linear-gradient(to bottom, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.15), rgba(34, 197, 94, 0.15), rgba(249, 115, 22, 0.15), rgba(220, 38, 38, 0.2)); padding: 1.5rem; border-radius: 0.75rem; margin: 1rem 0; border: 2px solid rgba(0,0,0,0.1);">
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;">
                            <span style="font-size: 1.25rem;">🔥🔥🔥</span>
                            <span><strong>HOT:</strong> "I was wondering if you could..."</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;">
                            <span style="font-size: 1.25rem;">🔥🔥</span>
                            <span><strong>WARM:</strong> "Would you mind...?"</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;">
                            <span style="font-size: 1.25rem;">🔥</span>
                            <span><strong>COMFORTABLE:</strong> "Would you...?" / "Could you...?"</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;">
                            <span style="font-size: 1.25rem;">☺️</span>
                            <span><strong>ROOM TEMP:</strong> "Can you...?"</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;">
                            <span style="font-size: 1.25rem;">❄️</span>
                            <span><strong>COLD:</strong> Direct command ("Do this.")</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;">
                            <span style="font-size: 1.25rem;">🥶</span>
                            <span><strong>FREEZING:</strong> Rude! ("Give me that now!")</span>
                        </div>
                    </div>
                </div>

                <p style="font-style: italic; color: #666;">💡 <strong>Remember:</strong> At work, aim for at least "comfortable" with supervisors and customers!</p>
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
                            label: "Direct: 'Send me that file.' → Polite: '___'",
                            expectedAnswer: "Could you send me that file?",
                        },
                        {
                            type: "text",
                            label: "Direct: 'Check the schedule.' → Polite: '___'",
                            expectedAnswer: "Could you check the schedule?",
                        },
                        {
                            type: "text",
                            label: "Direct: 'Close the door.' → Polite: '___'",
                            expectedAnswer: "Would you close the door?",
                        },
                    ],
                },
                {
                    id: "ex-politeness-match",
                    title: "🎯 Match the Politeness Level",
                    instructions:
                        "Match each situation to the best politeness level.",
                    items: [
                        {
                            type: "radio",
                            label: "Asking your close coworker (a friend) to cover your shift:",
                            options: [
                                { value: "can", label: "☺️ Can you cover my shift?" },
                                { value: "could", label: "🔥 Could you possibly cover my shift?" },
                                { value: "wondering", label: "🔥🔥🔥 I was wondering if you might be able to..." },
                            ],
                            expectedAnswer: "can",
                        },
                        {
                            type: "radio",
                            label: "Asking your supervisor for a day off next week:",
                            options: [
                                { value: "can", label: "☺️ Can I have Friday off?" },
                                { value: "could", label: "🔥 Could I have Friday off?" },
                                { value: "wondering", label: "🔥🔥🔥 I was wondering if I could have Friday off?" },
                            ],
                            expectedAnswer: "could",
                        },
                        {
                            type: "radio",
                            label: "Asking the company CEO for a meeting about your idea:",
                            options: [
                                { value: "can", label: "☺️ Can I meet with you?" },
                                { value: "could", label: "🔥 Could I meet with you?" },
                                { value: "wondering", label: "🔥🔥🔥 I was wondering if I might be able to schedule a brief meeting..." },
                            ],
                            expectedAnswer: "wondering",
                        },
                    ],
                },
            ],
        },

        // Workplace Scenarios
        {
            id: "workplace-scenarios",
            stepNumber: 7,
            title: "Real Workplace Situations: Choosing the Right Modal",
            icon: "💼",
            explanation: `
                <h3>Practice Thinking Like a Professional</h3>
                <p>Let's apply what you learned to real workplace situations:</p>

                <div style="margin: 1.5rem 0;">
                    <div style="background: var(--color-surface-elevated); color: var(--color-text); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--color-border-strong);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 1: You're sick and need to call in</h4>
                        <p><strong>❌ Too casual:</strong> "I can't come in today."</p>
                        <p><strong>✓ Professional:</strong> "I'm not feeling well. I won't be able to come in today."</p>
                        <p><strong>✓ Very professional:</strong> "I'm ill and won't be able to work today. Should I find someone to cover my shift?"</p>
                    </div>

                    <div style="background: var(--color-surface-elevated); color: var(--color-text); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--color-border-strong);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 2: You need help with a task</h4>
                        <p><strong>❌ Too direct:</strong> "Help me with this."</p>
                        <p><strong>✓ Polite:</strong> "Could you help me with this when you have a moment?"</p>
                        <p><strong>✓ More polite:</strong> "I was wondering if you could help me understand how to do this?"</p>
                    </div>

                    <div style="background: var(--color-surface-elevated); color: var(--color-text); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--color-border-strong);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 3: You want to leave early</h4>
                        <p><strong>❌ Too casual:</strong> "Can I go now?"</p>
                        <p><strong>✓ Better:</strong> "Would it be okay if I left a bit early today?"</p>
                        <p><strong>✓ Best:</strong> "I have an appointment. Would it be possible for me to leave 30 minutes early today?"</p>
                    </div>

                    <div style="background: var(--color-surface-elevated); color: var(--color-text); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--color-border-strong);">
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
                    title: "Practice: Best Fit for the Context",
                    instructions:
                        "Choose the option that best matches the situation. Think about who you're talking to and how formal you need to be.",
                    items: [
                        {
                            type: "radio",
                            label: "Your boss asks you to work overtime, but you have plans. You need to decline politely:",
                            options: [
                                { value: "a", label: "I can't, I have plans." },
                                { value: "c", label: "No thanks." },
                                { value: "b", label: "I have a prior commitment tonight. Would it be possible to do it tomorrow instead?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You need a close coworker (and friend) to switch shifts. You're talking in the break room:",
                            options: [
                                { value: "c", label: "I have a situation on Friday. Would you be able to switch shifts with me?" },
                                { value: "a", label: "Can you take my shift on Friday?" },
                                { value: "b", label: "Switch with me." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You need to ask your manager about the break policy. You want to sound professional:",
                            options: [
                                { value: "a", label: "What's the rule about breaks?" },
                                { value: "b", label: "Could you clarify the policy on break times?" },
                                { value: "c", label: "Tell me about breaks." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You're emailing the HR director you've never met to request time off for a family event:",
                            options: [
                                { value: "a", label: "Hey, I need Friday off. Let me know." },
                                { value: "b", label: "Hi, could I request Friday off? I have a family event. Please let me know if that works. Thank you!" },
                                { value: "c", label: "I'm taking Friday off." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "ex-fix-email",
                    title: "📧 Fix the Email: Best Fit for the Context",
                    instructions:
                        "Each email is too casual. Choose the version that best fits who you're writing to.",
                    items: [
                        {
                            type: "radio",
                            label: "Context: Email to your supervisor about a doctor appointment. Original: \"Hey, I need friday off. Let me know.\"",
                            options: [
                                { value: "a", label: "Hi, I need Friday off for a doctor appointment. Could you let me know if that works?" },
                                { value: "b", label: "Could I request Friday off? I have a personal appointment. Please let me know if this works. Thank you!" },
                                { value: "c", label: "I'm taking Friday off." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Context: Email to a client or senior manager. Original: \"Where's the report? Send it now.\"",
                            options: [
                                { value: "a", label: "I need the report. Can you send it?" },
                                { value: "b", label: "Give me the report today." },
                                { value: "c", label: "Could you send me the report when you have a chance? I would like to review it before the meeting. Thank you!" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "Context: Quick message to a close coworker who sent you confusing instructions. Original: \"I don't understand this. Explain it.\"",
                            options: [
                                { value: "a", label: "Could you explain this a bit? I want to make sure I get it right." },
                                { value: "b", label: "What does this mean? I don't get it." },
                                { value: "c", label: "This is confusing. Fix it." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Mistakes to Avoid Section
        {
            id: "mistakes-to-avoid",
            stepNumber: 8,
            title: "Common Mistakes to Avoid",
            icon: "🚫",
            explanation: `
                <h3>Don't Make These Errors!</h3>
                <p>Here are the most common mistakes learners make with modals - and how to fix them:</p>

                <div style="margin: 1.5rem 0;">

                    <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #dc2626;">❌ Mistake #1: Adding -s to modals</h4>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ She cans help.</span>
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ He musts work.</span>
                        </div>
                        <p style="margin: 0.5rem 0 0 0;"><strong style="color: #16a34a;">✅ Correct:</strong> She <strong>can</strong> help. He <strong>must</strong> work.</p>
                        <p style="margin: 0.25rem 0 0 0; font-style: italic; color: #666;">Modals NEVER change form - no matter who the subject is!</p>
                    </div>

                    <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #dc2626;">❌ Mistake #2: Using "to" after must/can/should</h4>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ I must to go.</span>
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ She can to swim.</span>
                        </div>
                        <p style="margin: 0.5rem 0 0 0;"><strong style="color: #16a34a;">✅ Correct:</strong> I <strong>must go</strong>. She <strong>can swim</strong>.</p>
                        <p style="margin: 0.25rem 0 0 0; font-style: italic; color: #666;">Use "to" with "have to" but NOT with must, can, should, could, may!</p>
                    </div>

                    <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #dc2626;">❌ Mistake #3: Using -ing after modals</h4>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ Could you helping me?</span>
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ I must leaving now.</span>
                        </div>
                        <p style="margin: 0.5rem 0 0 0;"><strong style="color: #16a34a;">✅ Correct:</strong> Could you <strong>help</strong> me? I must <strong>leave</strong> now.</p>
                        <p style="margin: 0.25rem 0 0 0; font-style: italic; color: #666;">Always use the BASE verb (no -ing, no -ed, no -s) after modals!</p>
                    </div>

                    <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #dc2626;">❌ Mistake #4: Confusing "don't have to" and "must not"</h4>
                        <p style="margin: 0.5rem 0;">Saying "You don't have to be late" when you mean "You must not be late"</p>
                        <div style="margin: 0.5rem 0; padding: 0.5rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.25rem;">
                            <p style="margin: 0;"><strong>don't have to</strong> = optional (you can choose)</p>
                        </div>
                        <div style="margin: 0.5rem 0; padding: 0.5rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.25rem;">
                            <p style="margin: 0;"><strong>must not</strong> = forbidden (don't do it!)</p>
                        </div>
                    </div>

                    <div style="background: rgba(239, 68, 68, 0.08); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                        <h4 style="margin-top: 0; color: #dc2626;">❌ Mistake #5: Wrong question word order</h4>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ I can leave early?</span>
                            <span style="background: rgba(239, 68, 68, 0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">❌ Do I can help you?</span>
                        </div>
                        <p style="margin: 0.5rem 0 0 0;"><strong style="color: #16a34a;">✅ Correct:</strong> <strong>Can I</strong> leave early? <strong>Can I</strong> help you?</p>
                        <p style="margin: 0.25rem 0 0 0; font-style: italic; color: #666;">For questions: Modal + Subject + Base Verb (Can I...? Should we...? Could you...?)</p>
                    </div>

                </div>
            `,
            exercises: [
                {
                    id: "ex-mistakes-fix",
                    title: "🔧 Fix the Mistake",
                    instructions:
                        "Choose the correct version of each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "She musts finish the report." },
                                { value: "b", label: "She must finish the report." },
                                { value: "c", label: "She must to finish the report." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "Could you helping me with this?" },
                                { value: "b", label: "Could you help me with this?" },
                                { value: "c", label: "Do you could help me with this?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which sentence means \"it's optional\" (not required)?",
                            options: [
                                { value: "a", label: "You must not bring your lunch." },
                                { value: "b", label: "You don't have to bring your lunch." },
                                { value: "c", label: "You can't bring your lunch." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which is the correct way to ask a question?",
                            options: [
                                { value: "a", label: "I may ask a question?" },
                                { value: "b", label: "Do I may ask a question?" },
                                { value: "c", label: "May I ask a question?" },
                            ],
                            expectedAnswer: "c",
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
                <ol style="background: var(--color-surface-elevated); color: var(--color-text); padding: 1.5rem; border-radius: 0.5rem; border: 1px solid var(--color-border-strong);">
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
                    "When you're not sure at work, it's better to be MORE polite. 'Could you...?' and 'Would you...?' are safe choices for almost any workplace request. Save 'Can you...?' for coworkers you know well.",
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
                            label: "Your coworker asks how to save money. You give them advice: You _____ bring your lunch to work.",
                            options: ["must not", "should", "have to"],
                            expectedAnswer: "should",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz (16 questions)
    miniQuiz: [
      {
        id: "quiz-1",
        question:
          "Which sentence expresses obligation (you are required to do it)?",
        options: [
          { value: "a", label: "You should clock in before your shift." },
          { value: "c", label: "You can clock in before your shift." },
          { value: "b", label: "You must clock in before your shift." },
      ],
      correctAnswer: "b",
        explanation:
          "'Must' shows a rule or strong obligation. 'Should' is advice. 'Can' is permission or ability.",
        skillTag: "meaning-obligation-must",
        difficulty: "easy",
      },
      {
        id: "quiz-2",
        question: "Which is the most polite way to ask your boss for help?",
        options: [
          { value: "a", label: "Can you help me?" },
          { value: "b", label: "Help me with this." },
          {
            value: "c",
            label: "Could you help me with this when you have a moment?",
          },
        ],
        correctAnswer: "c",
        explanation:
          "'Could you...when you have a moment?' is a polite request that respects the boss's time.",
        skillTag: "politeness-request-could-boss",
        difficulty: "medium",
      },
      {
        id: "quiz-3",
        question:
          "What is the difference? 'You don't have to wear a tie' vs 'You must not wear jeans'",
        options: [
          { value: "a", label: "They mean the same thing." },
          {
            value: "b",
            label:
              "First = optional (you can choose). Second = forbidden (you are not allowed).",
          },
          {
            value: "c",
            label: "First = forbidden. Second = optional.",
          },
        ],
        correctAnswer: "b",
        explanation:
          "'Don't have to' means something is not necessary. 'Must not' means something is prohibited.",
        skillTag: "contrast-dont-have-to-vs-must-not",
        difficulty: "medium",
      },
      {
        id: "quiz-4",
        question:
          "Your manager says: 'You should finish this by Friday.' What does this usually mean at work?",
        options: [
          {
            value: "a",
            label: "It is just a casual idea, you can finish whenever.",
          },
          {
            value: "b",
            label:
              "It is strongly recommended and expected (close to a requirement).",
          },
          {
            value: "c",
            label:
              "You will be fired if you do not finish by Friday, no exceptions.",
          },
        ],
        correctAnswer: "b",
        explanation:
          "In workplace context, 'should' from a boss usually means a strong expectation, not a light suggestion.",
        skillTag: "meaning-should-workplace-expectation",
        difficulty: "medium",
      },
      {
        id: "quiz-5",
        question: "Which sentence correctly uses a modal verb with a base verb?",
        options: [
          { value: "c", label: "She can work overtime tomorrow." },
          { value: "a", label: "She cans work overtime tomorrow." },
          { value: "b", label: "She can works overtime tomorrow." },
      ],
      correctAnswer: "c",
        explanation:
          "After a modal, use the base verb: 'can work', not 'cans work' or 'can works'.",
        skillTag: "form-modal-plus-base-verb",
        difficulty: "easy",
      },
      {
        id: "quiz-6",
        question:
          "The sign on the wall says: 'Employees ___ wash their hands before returning to work.'",
        options: [
          { value: "a", label: "should" },
          { value: "b", label: "must" },
          { value: "c", label: "can" },
        ],
        correctAnswer: "b",
        explanation:
          "Official rules and signs often use 'must' to show strong obligation.",
        skillTag: "meaning-obligation-must-rule",
        difficulty: "easy",
      },
      {
        id: "quiz-7",
        question:
          "Your boss put you on the schedule for Saturday. You must work or find someone to cover your shift. Which sentence matches this situation?",
        options: [
          { value: "a", label: "I must relax on Saturday." },
          { value: "c", label: "I can work on Saturday if I feel like it." },
          { value: "b", label: "I have to work on Saturday." },
      ],
      correctAnswer: "b",
        explanation:
          "'Have to' fits external rules or schedules made by someone else, like a boss.",
        skillTag: "meaning-obligation-have-to-external",
        difficulty: "easy",
      },
      {
        id: "quiz-9",
        question:
          "You want to ask a coworker a quick question. What is most natural?",
        options: [
          { value: "c", label: "Can I ask you a question?" },
          { value: "a", label: "May I ask you a question?" },
          { value: "b", label: "Could I request to ask a question?" },
      ],
      correctAnswer: "c",
        explanation:
          "'Can I ask you a question?' is the most common casual way to ask a coworker for a quick moment.",
        skillTag: "permission-can-casual-coworker",
        difficulty: "easy",
      },
      {
        id: "quiz-10",
        question:
          "You have a serious family emergency and need to ask your manager for time off. Which is best?",
        options: [
          { value: "a", label: "Can I have tomorrow off?" },
          {
            value: "b",
            label: "Could I have tomorrow off for a family emergency?",
          },
          {
            value: "c",
            label: "May I take tomorrow because I want to relax?",
          },
        ],
        correctAnswer: "b",
        explanation:
          "'Could I...' sounds more careful and respectful for a serious request, and giving the reason is helpful.",
        skillTag: "permission-could-polite-manager",
        difficulty: "medium",
      },
      {
        id: "quiz-11",
        question:
          "You need to ask the HR manager about an important policy. Which is most appropriate?",
        options: [
          {
            value: "a",
            label: "May I ask you a question about the attendance policy?",
          },
          { value: "b", label: "Can I know about the rule?" },
          { value: "c", label: "Tell me the rule about attendance." },
        ],
        correctAnswer: "a",
        explanation:
          "'May I ask...' is a polite and formal way to start a question with HR or management.",
        skillTag: "permission-may-formal-hr",
        difficulty: "medium",
      },
      {
        id: "quiz-12",
        question:
          "Your coworker says: 'You don't have to finish that today.' What does this mean?",
        options: [
          { value: "a", label: "You are forbidden from finishing today." },
          {
            value: "b",
            label: "It's optional - you can finish today or wait.",
          },
          {
            value: "c",
            label: "You should definitely finish today.",
          },
        ],
        correctAnswer: "b",
        explanation:
          "'Don't have to' means something is optional - you have a choice. It does NOT mean forbidden.",
        skillTag: "meaning-not-necessary-dont-have-to",
        difficulty: "medium",
      },
      {
        id: "quiz-13",
        question:
          "Complete the sentence: 'You ___ arrive 10 minutes early on your first day.' (good idea, not a strict rule)",
        options: [
          { value: "a", label: "must" },
          { value: "b", label: "should" },
          { value: "c", label: "can" },
        ],
        correctAnswer: "b",
        explanation:
          "'Should' expresses advice or recommendation, not a strict rule.",
        skillTag: "meaning-advice-should",
        difficulty: "easy",
      },
      {
        id: "quiz-14",
        question:
          "Complete the sentence: 'You ___ wear your ID badge at all times in the building.' (company rule)",
        options: [
          { value: "a", label: "should" },
          { value: "c", label: "can" },
          { value: "b", label: "must" },
      ],
      correctAnswer: "b",
        explanation:
          "Company rules about safety or security often use 'must' to show obligation.",
        skillTag: "meaning-rule-must-id-badge",
        difficulty: "easy",
      },
      {
        id: "quiz-15",
        question: "Which sentence is correct with 'must'?",
        options: [
          { value: "c", label: "I must leave now." },
          { value: "a", label: "I must to leave now." },
          { value: "b", label: "I must leaving now." },
      ],
      correctAnswer: "c",
        explanation:
          "After 'must', use the base verb: 'must leave', not 'must to leave' or 'must leaving'.",
        skillTag: "form-must-plus-base-verb",
        difficulty: "easy",
      },
      {
        id: "quiz-16",
        question:
          "Which question is grammatically correct and polite with a modal first?",
        options: [
          {
            value: "a",
            label: "May I speak with you about my schedule?",
          },
          {
            value: "b",
            label: "I may speak with you about my schedule?",
          },
          {
            value: "c",
            label: "Do I may speak with you about my schedule?",
          },
        ],
        correctAnswer: "a",
        explanation:
          "Modal questions use the pattern: modal + subject + base verb. 'May I speak...?' follows this pattern.",
        skillTag: "form-modal-question-word-order",
        difficulty: "medium",
      },
    ],

  /*
  TEACHER DIAGNOSTIC NOTES – Modals: Obligation, Permission, Politeness Mini Quiz

  This mini quiz checks whether students can:
  - Understand the meaning difference between MUST, HAVE TO, SHOULD, CAN, MAY, COULD, and DO NOT HAVE TO.
  - Distinguish:
    • obligation vs advice vs permission vs not necessary vs forbidden.
    • workplace expectations vs strict rules.
  - Use correct grammar patterns:
    • Subject + modal + base verb (no -s, no -ing, no 'to' after must/can).
    • Correct question word order: modal + subject + base verb.
  - Choose appropriate politeness level when speaking to coworkers, supervisors, and HR.

  Skill tags:

  Meaning: obligation, advice, not necessary, rules
  - meaning-obligation-must
  - meaning-obligation-must-rule
  - meaning-obligation-have-to-external
  - meaning-advice-should
  - meaning-should-workplace-expectation
  - meaning-not-necessary-dont-have-to
  - contrast-dont-have-to-vs-must-not

  Permission and politeness
  - permission-can-casual-coworker
  - permission-could-polite-manager
  - permission-may-formal-hr
  - form-modal-question-word-order
  - politeness-request-could-boss
  - politeness-ladder-indirect-request

  Form: modal + base verb
  - form-modal-plus-base-verb
  - form-must-plus-base-verb

  Rules and workplace context
  - meaning-rule-must-id-badge

  How to read the diagnostics:
  - If obligation vs advice tags are weak (meaning-obligation-must, meaning-obligation-have-to-external, meaning-advice-should, meaning-should-workplace-expectation) →
    Rebuild the chart from the guide:
    • MUST / HAVE TO = required (rules, schedules, laws).
    • SHOULD = advice/expectation (good idea, but grammar softer).
    Use real example sentences from your students' jobs and have them sort them into REQUIRED vs RECOMMENDED.

  - If not necessary vs forbidden tags are weak (meaning-not-necessary-dont-have-to, contrast-dont-have-to-vs-must-not) →
    Make a three-column chart:
    • REQUIRED: must, have to.
    • NOT NECESSARY: do not have to.
    • FORBIDDEN: must not.
    Ask students to move sentence cards into the correct column, then explain in their own words.

  - If form tags are weak (form-modal-plus-base-verb, form-must-plus-base-verb, form-modal-question-word-order) →
    Go back to the pattern:
    • Statement: Subject + modal + base verb → She can work. I must leave.
    • Question: Modal + subject + base verb → Can I leave? May I ask?
    Do quick error-correction drills:
    • She cans work → She can work.
    • I must to leave → I must leave.
    • I may speak with you? → May I speak with you?

  - If permission/politeness tags are weak (permission-can-casual-coworker, permission-could-polite-manager, permission-may-formal-hr, politeness-request-could-boss, politeness-ladder-indirect-request) →
    Re-teach the politeness ladder:
    • Can you...? (casual)
    • Could you...? (standard polite)
    • May I...? (formal)
    • I was wondering if you could... (very polite, indirect)
    Use role-plays with different power levels:
    • Coworker to coworker → Can you / Could you.
    • Employee to supervisor → Could you / Would it be possible.
    • Employee to HR or director → May I / I was wondering if I could.

  - If rules and workplace context tags are weak (meaning-obligation-must-rule, meaning-rule-must-id-badge) →
    Collect real workplace signs and policies:
    • Employees must...
    • Visitors must...
    • You must wear...
    Have students rewrite them in spoken language with HAVE TO, and also rewrite spoken sentences back into formal sign language with MUST.

  Suggested use:
  - Use this mini quiz after students complete the sections on:
    • Must vs Have to.
    • Can/May/Could for permission.
    • Should for advice and workplace expectations.
    • Politeness ladder for requests at work.
  - At the class level:
    • If meaning tags are red → spend more time on charts, scenarios, and sentence sorting (Required vs Recommended vs Optional vs Forbidden).
    • If form tags are red → do short, high-repetition drills focusing on modal + base verb and question word order.
    • If politeness tags are red → prioritize speaking activities and role-plays where students practice asking for help, time off, and clarification in different levels of formality.
  */
};
