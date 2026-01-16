import type { InteractiveGuideContent, ExerciseItem } from "@/types/activity";

export const modalsHealthAdviceCautionConsentContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Modals for Health: Advice, Caution & Consent - Navigating Healthcare",
            icon: "🏥",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(248, 113, 113, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"You should take this medicine with food." "You must not drink alcohol while taking this." "You can ask questions at any time." In healthcare, understanding modals helps you follow instructions safely, ask for what you need, and protect your health.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Understanding modals in health contexts helps you:</p>
                <ul>
                    <li><strong>Follow medical instructions safely</strong> - Know what's required vs. recommended</li>
                    <li><strong>Ask for what you need</strong> - Permission to ask questions, request translators, access records</li>
                    <li><strong>Protect your health</strong> - Understand warnings and cautions</li>
                    <li><strong>Advocate for yourself</strong> - Know your rights and what you're allowed to do</li>
                    <li><strong>Communicate with healthcare providers</strong> - Ask questions politely and understand responses</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Understanding clinic visit procedures and instructions</li>
                        <li>Reading pharmacy labels and medication instructions</li>
                        <li>Practicing health-related conversations and scenarios</li>
                        <li>Learning about healthcare systems and patient rights</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>At the doctor's office</strong> - Understanding instructions and asking questions</li>
                        <li><strong>At the pharmacy</strong> - Reading medication labels and following dosage instructions</li>
                        <li><strong>In emergency situations</strong> - Understanding warnings and safety instructions</li>
                        <li><strong>Managing your health records</strong> - Understanding what you can access and request</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🏥 Remember: Understanding modals in healthcare can literally save your life - it helps you follow instructions correctly and ask for help when you need it!</p>
                </div>
            `,
            exercises: [
                {
                    id: "modals-health-intro-1",
                    title: "Quick Check: What Does It Mean?",
                    instructions: "Choose the best meaning.",
                    items: [
                        {
                            type: "radio",
                            label: "You <span class='eg-helper'>should</span> take this medicine with food.",
                            options: [
                                { value: "required", label: "Required (you must do it)" },
                                { value: "advice", label: "Advice (recommended, but optional)" },
                                { value: "permission", label: "Permission (you're allowed)" },
                            ],
                            expectedAnswer: "advice",
                        },
                        {
                            type: "radio",
                            label: "You <span class='eg-helper'>must not</span> drink alcohol while taking this medication.",
                            options: [
                                { value: "advice", label: "Advice (not recommended)" },
                                { value: "caution", label: "Caution/Warning (forbidden, dangerous)" },
                                { value: "permission", label: "Permission (not allowed)" },
                            ],
                            expectedAnswer: "caution",
                        },
                        {
                            type: "radio",
                            label: "<span class='eg-helper'>Can I</span> ask you a question about my prescription?",
                            options: [
                                { value: "advice", label: "Asking for advice" },
                                { value: "caution", label: "Giving a warning" },
                                { value: "consent", label: "Asking for permission (consent)" },
                            ],
                            expectedAnswer: "consent",
                        },
                    ],
                },
            ],
        },

        // Modals Overview for Health
        {
            id: "modals-overview",
            stepNumber: 1,
            title: "Three Types of Modals in Healthcare",
            icon: "🔑",
            explanation: `
                <h3>Advice, Caution, and Consent</h3>
                <p>In healthcare, modals fall into three important categories:</p>

                <div style="margin-top: 1.5rem; background: rgba(34, 197, 94, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                    <h4 style="color: #22c55e; margin-top: 0;">💡 ADVICE (should/shouldn't)</h4>
                    <p>Recommendations that are good for your health, but not required:</p>
                    <ul>
                        <li>You <strong>should</strong> drink plenty of water.</li>
                        <li>You <strong>should</strong> get 7-8 hours of sleep.</li>
                        <li>You <strong>shouldn't</strong> skip meals.</li>
                    </ul>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(220, 38, 38, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #dc2626;">
                    <h4 style="color: #dc2626; margin-top: 0;">⚠️ CAUTION (must/must not)</h4>
                    <p>Required actions or dangerous prohibitions:</p>
                    <ul>
                        <li>You <strong>must</strong> take this medicine exactly as prescribed.</li>
                        <li>You <strong>must not</strong> drive after taking this medication.</li>
                        <li>You <strong>must</strong> finish all the medicine, even if you feel better.</li>
                    </ul>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                    <h4 style="color: #3b82f6; margin-top: 0;">✅ CONSENT (can/may/are allowed to)</h4>
                    <p>What you're permitted to do or request:</p>
                    <ul>
                        <li>You <strong>can</strong> ask questions at any time.</li>
                        <li>You <strong>may</strong> bring someone with you to the appointment.</li>
                        <li>You <strong>are allowed to</strong> request a translator.</li>
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
                        You <strong style="color: #d97757;">should</strong> rest. You <strong style="color: #d97757;">must</strong> take it. You <strong style="color: #d97757;">can</strong> ask.
                    </p>
                </div>
            `,
            exercises: [
                {
                    id: "modals-health-overview-1",
                    title: "Practice: Modal + Base Verb",
                    instructions: "Choose the correct sentence (base verb after the modal).",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "You should take this medicine with food." },
                                { value: "b", label: "You should takes this medicine with food." },
                                { value: "c", label: "You should to take this medicine with food." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "You must not to drive after taking this." },
                                { value: "b", label: "You must not drive after taking this." },
                                { value: "c", label: "You must not driving after taking this." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Grammar Rule",
                content:
                    "Modals don't change form! No -s, no -ed, no -ing. 'She shoulds'? NO. 'You musted'? NO. 'I am canning'? DEFINITELY NO. Just: You should, You must, I can.",
            },
        },

        // Should for Advice
        {
            id: "should-advice",
            stepNumber: 2,
            title: "Should/Shouldn't: Health Advice",
            icon: "💡",
            explanation: `
                <h3>Should = Recommended for Your Health (But Not Required)</h3>
                <p><strong>Should</strong> and <strong>shouldn't</strong> give health advice - things that are good for you, but you have a choice:</p>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Health Advice Examples:</h4>
                    <ul>
                        <li>You <strong>should</strong> drink 8 glasses of water daily.</li>
                        <li>You <strong>should</strong> get regular exercise.</li>
                        <li>You <strong>should</strong> eat fruits and vegetables.</li>
                        <li>You <strong>shouldn't</strong> smoke.</li>
                        <li>You <strong>shouldn't</strong> skip meals.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Medical Advice Examples:</h4>
                    <ul>
                        <li>You <strong>should</strong> take this medicine with food to avoid stomach upset.</li>
                        <li>You <strong>should</strong> rest if you feel tired.</li>
                        <li>You <strong>should</strong> call if your symptoms get worse.</li>
                        <li>You <strong>shouldn't</strong> stop taking the medicine without talking to your doctor.</li>
                    </ul>
                </div>

                <h4>Should vs Must:</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);"><strong>Must</strong> = Required</td>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>must</strong> take this medicine twice daily. (required, no choice)</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(34, 197, 94, 0.1);"><strong>Should</strong> = Recommended</td>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>should</strong> take it with food. (good idea, but optional)</td>
                    </tr>
                </table>
            `,
            tipBox: {
                title: "💡 Understanding Medical Advice",
                content:
                    "When a doctor says 'you should...' they usually mean it's important for your health, even though it's not a strict rule. In healthcare, 'should' often means 'strongly recommended for your safety and recovery.'",
            },
            exercises: [
                {
                    id: "ex-should-advice-1",
                    title: "Practice: Should for Health Advice",
                    instructions:
                        "Complete each health advice sentence with 'should' or 'should not' (shouldn't).",
                    items: [
                        {
                            type: "text",
                            label: "You ___ drink plenty of water when you're sick. (positive advice)",
                            expectedAnswer: "should",
                        },
                        {
                            type: "text",
                            label: "You ___ skip doses of your medication. (negative advice)",
                            expectedAnswers: ["should not", "shouldn't", "shouldnt"],
                        } as ExerciseItem,
                        {
                            type: "text",
                            label: "You ___ get 7-8 hours of sleep each night. (positive advice)",
                            expectedAnswer: "should",
                        },
                        {
                            type: "text",
                            label: "You ___ take medicine that has expired. (negative advice)",
                            expectedAnswers: ["should not", "shouldn't", "shouldnt"],
                        } as ExerciseItem,
                    ],
                },
            ],
        },

        // Must/Must Not for Caution
        {
            id: "must-caution",
            stepNumber: 3,
            title: "Must/Must Not: Health Caution & Warnings",
            icon: "⚠️",
            explanation: `
                <h3>Must = Required for Safety | Must Not = Dangerous/Forbidden</h3>
                <p><strong>Must</strong> and <strong>must not</strong> express strong requirements or dangerous prohibitions in healthcare:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.5rem; border-left: 4px solid #dc2626;">
                    <h4 style="color: #dc2626; margin-top: 0;">MUST = Required for Safety</h4>
                    <p>Use when something is necessary for your health or safety:</p>
                    <ul>
                        <li>You <strong>must</strong> take this medicine exactly as prescribed.</li>
                        <li>You <strong>must</strong> finish all the antibiotics, even if you feel better.</li>
                        <li>You <strong>must</strong> bring your insurance card to the appointment.</li>
                        <li>You <strong>must</strong> tell your doctor about all medications you're taking.</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(239, 68, 68, 0.15); border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                    <h4 style="color: #ef4444; margin-top: 0;">MUST NOT = Dangerous/Forbidden</h4>
                    <p>Use when something is dangerous or prohibited:</p>
                    <ul>
                        <li>You <strong>must not</strong> drink alcohol while taking this medication.</li>
                        <li>You <strong>must not</strong> drive after taking this medicine (it causes drowsiness).</li>
                        <li>You <strong>must not</strong> take more than the recommended dose.</li>
                        <li>You <strong>must not</strong> share your prescription with others.</li>
                    </ul>
                </div>

                <h4>Must Not vs Don't Have To:</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);"><strong>Must Not</strong> = Forbidden</td>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>must not</strong> drink alcohol. (dangerous, forbidden)</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(34, 197, 94, 0.1);"><strong>Don't Have To</strong> = Not Required</td>
                        <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>don't have to</strong> fast before this test. (optional, not required)</td>
                    </tr>
                </table>
            `,
            tipBox: {
                title: "💡 Safety First",
                content:
                    "IMPORTANT: When you see 'must not' on medication labels or from your doctor, take it seriously. It's not just advice - it's a warning about something dangerous. Always follow 'must' and 'must not' instructions exactly.",
            },
            exercises: [
                {
                    id: "ex-must-caution-1",
                    title: "Practice: Must or Must Not?",
                    instructions:
                        "Choose the correct modal for each health situation.",
                    items: [
                        {
                            type: "radio",
                            label: "The label says: 'You ___ take this medicine with food.' (required for safety)",
                            options: [
                                { value: "must", label: "must" },
                                { value: "should", label: "should" },
                                { value: "can", label: "can" },
                            ],
                            expectedAnswer: "must",
                        },
                        {
                            type: "radio",
                            label: "Warning: 'You ___ drive after taking this medication.' (dangerous)",
                            options: [
                                { value: "must not", label: "must not" },
                                { value: "don't have to", label: "don't have to" },
                                { value: "should not", label: "should not" },
                            ],
                            expectedAnswer: "must not",
                        },
                        {
                            type: "radio",
                            label: "The doctor says: 'You ___ finish all the antibiotics.' (required)",
                            options: [
                                { value: "should", label: "should" },
                                { value: "must", label: "must" },
                                { value: "can", label: "can" },
                            ],
                            expectedAnswer: "must",
                        },
                    ],
                },
            ],
        },

        // Can/May/Are Allowed To for Consent
        {
            id: "can-may-consent",
            stepNumber: 4,
            title: "Can/May/Are Allowed To: Health Consent & Permission",
            icon: "✅",
            explanation: `
                <h3>Asking for Permission and Understanding Your Rights</h3>
                <p>In healthcare, you have rights. These modals show what you're allowed to do or request:</p>

                <div style="margin: 1.5rem 0;">
                    <div style="padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #22c55e;">
                        <h4 style="color: #22c55e; margin-top: 0;">CAN = Informal Permission</h4>
                        <p style="margin: 0;">Use when asking for permission in everyday healthcare situations</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li><strong>Can I</strong> ask you a question about my prescription?</li>
                            <li><strong>Can I</strong> bring someone with me to the appointment?</li>
                            <li><strong>Can I</strong> see my test results online?</li>
                        </ul>
                    </div>

                    <div style="padding: 1rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #a855f7;">
                        <h4 style="color: #a855f7; margin-top: 0;">MAY = Formal Permission</h4>
                        <p style="margin: 0;">Use in more formal healthcare settings or when asking about policies</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li><strong>May I</strong> request a copy of my medical records?</li>
                            <li><strong>May I</strong> speak with the doctor for a moment?</li>
                            <li><strong>May I</strong> have a translator for my appointment?</li>
                        </ul>
                    </div>

                    <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="color: #3b82f6; margin-top: 0;">ARE ALLOWED TO = Your Rights</h4>
                        <p style="margin: 0;">Use when talking about your legal rights or official permissions</p>
                        <ul style="margin: 0.5rem 0 0 0;">
                            <li>You <strong>are allowed to</strong> ask questions at any time.</li>
                            <li>You <strong>are allowed to</strong> request a second opinion.</li>
                            <li>You <strong>are allowed to</strong> access your health records.</li>
                        </ul>
                    </div>
                </div>

                <h4>Patient Rights Examples:</h4>
                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <ul>
                        <li>You <strong>can</strong> ask questions if you don't understand something.</li>
                        <li>You <strong>may</strong> bring a family member or friend to appointments.</li>
                        <li>You <strong>are allowed to</strong> request a translator if needed.</li>
                        <li>You <strong>can</strong> access your medical records online.</li>
                        <li>You <strong>may</strong> get a second opinion from another doctor.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "ex-can-may-consent-1",
                    title: "Practice: Choose the Right Permission Modal",
                    instructions:
                        "Select the best option for each healthcare situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Asking your doctor a quick question:",
                            options: [
                                { value: "can", label: "Can I ask you something?" },
                                { value: "may", label: "May I ask you a question?" },
                                { value: "allowed", label: "Am I allowed to ask you something?" },
                            ],
                            expectedAnswer: "can",
                        },
                        {
                            type: "radio",
                            label: "Asking the receptionist about accessing your records:",
                            options: [
                                { value: "can", label: "Can I see my records?" },
                                { value: "may", label: "May I request access to my medical records?" },
                                { value: "allowed", label: "Am I allowed to see my records?" },
                            ],
                            expectedAnswer: "may",
                        },
                        {
                            type: "radio",
                            label: "Talking about your legal right to a translator:",
                            options: [
                                { value: "can", label: "I can request a translator." },
                                { value: "may", label: "I may request a translator." },
                                { value: "allowed", label: "I am allowed to request a translator." },
                            ],
                            expectedAnswer: "allowed",
                        },
                    ],
                },
            ],
        },

        // Need To for Necessity
        {
            id: "need-to",
            stepNumber: 5,
            title: "Need To: Health Necessity",
            icon: "🔔",
            explanation: `
                <h3>Need To = Necessary for Your Health</h3>
                <p><strong>Need to</strong> expresses necessity - something is required for your health or treatment:</p>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Health Necessity Examples:</h4>
                    <ul>
                        <li>You <strong>need to</strong> take this medicine twice daily.</li>
                        <li>You <strong>need to</strong> fast for 12 hours before the blood test.</li>
                        <li>You <strong>need to</strong> drink lots of fluids when you have a fever.</li>
                        <li>You <strong>need to</strong> keep the wound clean and dry.</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>Asking About Necessity:</h4>
                    <ul>
                        <li>Do I <strong>need to</strong> make an appointment?</li>
                        <li>What do I <strong>need to</strong> bring to the clinic?</li>
                        <li>Do I <strong>need to</strong> stop taking my other medications?</li>
                    </ul>
                </div>

                <h4>Need To vs Must:</h4>
                <p>Both express necessity, but "need to" is more common in everyday healthcare conversations:</p>
                <ul>
                    <li><strong>Must</strong> = stronger, more formal (often on labels/instructions)</li>
                    <li><strong>Need to</strong> = more natural in spoken English</li>
                </ul>
                <p style="font-style: italic;">Example: "You must take this with food" (label) vs "You need to take this with food" (doctor speaking)</p>
            `,
            exercises: [
                {
                    id: "ex-need-to-1",
                    title: "Practice: Need To for Necessity",
                    instructions:
                        "Complete each sentence with 'need to' or 'don't need to'.",
                    items: [
                        {
                            type: "text",
                            label: "You ___ fast before this blood test. (required)",
                            expectedAnswer: "need to",
                        },
                        {
                            type: "text",
                            label: "You ___ bring anything special for a routine checkup. (not required)",
                            expectedAnswers: ["don't need to", "do not need to"],
                        } as ExerciseItem,
                        {
                            type: "text",
                            label: "You ___ keep taking this medicine until it's finished. (required)",
                            expectedAnswer: "need to",
                        },
                    ],
                },
            ],
        },

        // Health Scenarios
        {
            id: "health-scenarios",
            stepNumber: 6,
            title: "Real Health Situations: Choosing the Right Modal",
            icon: "🏥",
            explanation: `
                <h3>Practice Thinking Like a Healthcare Advocate</h3>
                <p>Let's apply what you learned to real healthcare situations:</p>

                <div style="margin: 1.5rem 0;">
                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 1: Reading a Medication Label</h4>
                        <p><strong>Advice:</strong> "You should take this with food to avoid stomach upset."</p>
                        <p><strong>Caution:</strong> "You must not drink alcohol while taking this medication."</p>
                        <p><strong>Consent:</strong> "You can take this with or without food, but food is recommended."</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 2: At a Clinic Visit</h4>
                        <p><strong>Advice:</strong> "You should arrive 15 minutes early for your appointment."</p>
                        <p><strong>Caution:</strong> "You must bring your insurance card and ID."</p>
                        <p><strong>Consent:</strong> "You can ask questions at any time during your visit."</p>
                        <p><strong>Consent:</strong> "You may bring someone with you if you'd like."</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 3: Understanding Treatment Instructions</h4>
                        <p><strong>Advice:</strong> "You should rest if you feel tired."</p>
                        <p><strong>Caution:</strong> "You must finish all the antibiotics, even if symptoms improve."</p>
                        <p><strong>Necessity:</strong> "You need to drink plenty of fluids."</p>
                        <p><strong>Consent:</strong> "You can call if you have any questions or concerns."</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4 style="margin-top: 0; color: #d97757;">Scenario 4: Accessing Your Health Records</h4>
                        <p><strong>Consent:</strong> "You can access your records online through MyChart."</p>
                        <p><strong>Consent:</strong> "You may request a paper copy of your records."</p>
                        <p><strong>Rights:</strong> "You are allowed to view your test results as soon as they're available."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-scenarios-1",
                    title: "Practice: Choose the Best Modal",
                    instructions:
                        "Pick the most appropriate modal for each healthcare situation.",
                    items: [
                        {
                            type: "radio",
                            label: "The medication label says: 'Take with food to avoid stomach upset.'",
                            options: [
                                { value: "should", label: "You should take this with food. (advice)" },
                                { value: "must", label: "You must take this with food. (required)" },
                                { value: "can", label: "You can take this with food. (permission)" },
                            ],
                            expectedAnswer: "should",
                        },
                        {
                            type: "radio",
                            label: "The warning says: 'Do not operate machinery after taking this medication.'",
                            options: [
                                { value: "should not", label: "You should not drive. (advice)" },
                                { value: "must not", label: "You must not drive. (dangerous/forbidden)" },
                                { value: "don't need to", label: "You don't need to drive. (not required)" },
                            ],
                            expectedAnswer: "must not",
                        },
                        {
                            type: "radio",
                            label: "You want to ask your doctor a question during the appointment:",
                            options: [
                                { value: "can", label: "Can I ask you a question?" },
                                { value: "must", label: "Must I ask you a question?" },
                                { value: "should", label: "Should I ask you a question?" },
                            ],
                            expectedAnswer: "can",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Quick Reference: Modals for Health Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>Modals in Healthcare at a Glance</h3>

                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Type</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Modal</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Meaning</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(34, 197, 94, 0.1);"><strong>Advice</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>should</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Recommended (good idea)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You should take it with food.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(34, 197, 94, 0.1);"><strong>Advice</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>shouldn't</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Not recommended</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You shouldn't skip doses.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);"><strong>Caution</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>must</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Required for safety</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You must finish all the medicine.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);"><strong>Caution</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>must not</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Dangerous/forbidden</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You must not drink alcohol.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(59, 130, 246, 0.1);"><strong>Consent</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>can</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Permission (informal)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Can I ask a question?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(59, 130, 246, 0.1);"><strong>Consent</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>may</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Permission (formal)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">May I request a translator?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(59, 130, 246, 0.1);"><strong>Consent</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>are allowed to</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Your rights</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You are allowed to access your records.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(251, 191, 36, 0.1);"><strong>Necessity</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>need to</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Required/necessary</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You need to fast before the test.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Key Grammar Rules</h3>
                <ul>
                    <li><strong>Pattern:</strong> Subject + modal + base verb (no -s, no -ing!)</li>
                    <li><strong>Negative:</strong> modal + not → shouldn't, mustn't, can't, don't need to</li>
                    <li><strong>Questions:</strong> Modal + subject + base verb? → Can I...? Should I...? May I...?</li>
                </ul>

                <h3>Common Mistakes to Avoid</h3>
                <ul>
                    <li>❌ "You shoulds take it" → ✅ "You should take it" (no -s on modals)</li>
                    <li>❌ "You must to finish" → ✅ "You must finish" OR "You need to finish" (no 'to' after must)</li>
                    <li>❌ "You don't must" → ✅ "You must not" OR "You don't have to" (correct negative forms)</li>
                    <li>❌ "Can you helping me?" → ✅ "Can you help me?" (base verb after modal)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Real-World Tip",
                content:
                    "When reading medication labels or clinic instructions, pay special attention to 'must' and 'must not' - these are safety warnings, not suggestions. Always follow them exactly. When in doubt about your rights, use 'Can I...?' or 'Am I allowed to...?' to ask politely.",
            },
            exercises: [
                {
                    id: "modals-health-summary-1",
                    title: "Quick Review: Choose the Best Modal",
                    instructions: "Pick the best option for each healthcare situation.",
                    items: [
                        {
                            type: "select",
                            label: "The label says it's recommended: You _____ take this with food.",
                            options: ["must", "should", "can"],
                            expectedAnswer: "should",
                        },
                        {
                            type: "select",
                            label: "The warning says it's dangerous: You _____ drive after taking this.",
                            options: ["should not", "must not", "don't need to"],
                            expectedAnswer: "must not",
                        },
                        {
                            type: "select",
                            label: "Asking politely: _____ I bring someone with me to the appointment?",
                            options: ["Must", "Should", "Can"],
                            expectedAnswer: "Can",
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
            question: "Which sentence expresses health advice (recommended but not required)?",
            options: [
                { value: "a", label: "You must take this medicine twice daily." },
                { value: "b", label: "You should take this medicine with food." },
                { value: "c", label: "You can take this medicine with food." },
            ],
            correctAnswer: "b",
            explanation: "'Should' = advice/recommendation. 'Must' = required. 'Can' = permission.",
        },
        {
            id: "quiz-2",
            question: "Which is a safety warning (dangerous/forbidden)?",
            options: [
                { value: "a", label: "You should not drink alcohol." },
                { value: "b", label: "You must not drink alcohol while taking this medication." },
                { value: "c", label: "You don't need to drink alcohol." },
            ],
            correctAnswer: "b",
            explanation: "'Must not' = dangerous/forbidden (safety warning). 'Should not' = advice. 'Don't need to' = not required.",
        },
        {
            id: "quiz-3",
            question: "Which is the most polite way to ask your doctor for permission?",
            options: [
                { value: "a", label: "Can I ask you a question?" },
                { value: "b", label: "May I ask you a question?" },
                { value: "c", label: "I must ask you a question." },
            ],
            correctAnswer: "b",
            explanation: "'May I' is more formal and polite than 'Can I' when asking for permission. 'Must' = obligation, not permission.",
        },
        {
            id: "quiz-4",
            question: "What's the difference? 'You should rest' vs 'You must rest'",
            options: [
                { value: "a", label: "They mean the same thing." },
                { value: "b", label: "First = advice (recommended). Second = required (necessary)." },
                { value: "c", label: "First = required. Second = advice." },
            ],
            correctAnswer: "b",
            explanation: "'Should' = advice/recommendation (good idea but optional). 'Must' = required/necessary (no choice).",
        },
        {
            id: "quiz-5",
            question: "Which sentence is grammatically correct?",
            options: [
                { value: "a", label: "You shoulds take it with food." },
                { value: "b", label: "You should to take it with food." },
                { value: "c", label: "You should take it with food." },
            ],
            correctAnswer: "c",
            explanation: "Modals don't take -s, and the verb after a modal is always the base form (no -s, no -ing, no 'to'): should take.",
        },
    ],
};
