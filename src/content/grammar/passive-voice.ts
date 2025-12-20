import type { InteractiveGuideContent } from "@/types/activity";

export const passiveVoiceContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Passive Voice: Understanding Medical Instructions",
            icon: "🔄",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"Your blood will be drawn." "The test is performed on an empty stomach." "You will be called when results are ready." Passive voice is EVERYWHERE in medical settings. If you don't understand it, you'll be confused about what's happening at the clinic or hospital.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Passive voice is critical in healthcare because:</p>
                <ul>
                    <li><strong>Medical instructions:</strong> "The medication should be taken twice daily."</li>
                    <li><strong>Procedures:</strong> "Your blood pressure will be checked first."</li>
                    <li><strong>Forms and documents:</strong> "This form must be completed before your appointment."</li>
                    <li><strong>Results:</strong> "Your test results were sent to your doctor."</li>
                </ul>
            `,
        },

        {
            id: "active-vs-passive",
            stepNumber: 1,
            title: "Active vs Passive Voice",
            icon: "🔀",
            explanation: `
                <h3>What's the Difference?</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #7ba884;">Active Voice</h4>
                    <p><strong>The subject DOES the action.</strong></p>
                    <p style="font-size: 1.125rem; font-weight: bold;">Subject (doer) → Verb → Object</p>
                    <ul>
                        <li><strong>The nurse</strong> takes your blood pressure. (nurse = subject/doer)</li>
                        <li><strong>The doctor</strong> ordered the test. (doctor = subject/doer)</li>
                        <li><strong>They</strong> will call you tomorrow. (they = subject/doer)</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #d97757;">Passive Voice</h4>
                    <p><strong>The subject RECEIVES the action.</strong></p>
                    <p style="font-size: 1.125rem; font-weight: bold;">Subject (receiver) → be + past participle (+ by doer)</p>
                    <ul>
                        <li><strong>Your blood pressure</strong> is taken (by the nurse). (blood pressure = subject/receiver)</li>
                        <li><strong>The test</strong> was ordered (by the doctor). (test = subject/receiver)</li>
                        <li><strong>You</strong> will be called tomorrow. (you = subject/receiver)</li>
                    </ul>
                </div>

                <h3>Same Meaning, Different Focus</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Active (Who does it)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Passive (What happens)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The nurse drew my blood.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">My blood was drawn.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The doctor will call you.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You will be called.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Someone sterilized the equipment.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The equipment was sterilized.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Active = who did it matters. Passive = what happened matters (who did it is less important or unknown).",
            },
        },

        {
            id: "forming-passive",
            stepNumber: 2,
            title: "How to Form Passive Voice",
            icon: "🔨",
            explanation: `
                <h3>The Passive Formula</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #d4a843;">
                    <p style="font-size: 1.5rem; font-weight: bold; color: #d4a843; text-align: center;">be + Past Participle</p>
                    <p style="text-align: center; margin-top: 0.5rem; font-style: italic;">(The form of "be" changes based on tense)</p>
                </div>

                <h3>Present Simple Passive</h3>
                <p style="font-weight: bold;">am/is/are + past participle</p>
                <ul>
                    <li>The test <strong>is performed</strong> on an empty stomach.</li>
                    <li>Appointments <strong>are scheduled</strong> online.</li>
                    <li>I <strong>am called</strong> for my appointment.</li>
                </ul>

                <h3>Past Simple Passive</h3>
                <p style="font-weight: bold;">was/were + past participle</p>
                <ul>
                    <li>My blood <strong>was drawn</strong> yesterday.</li>
                    <li>The results <strong>were sent</strong> to my doctor.</li>
                    <li>I <strong>was told</strong> to fast before the test.</li>
                </ul>

                <h3>Future Passive</h3>
                <p style="font-weight: bold;">will be + past participle</p>
                <ul>
                    <li>You <strong>will be called</strong> when the doctor is ready.</li>
                    <li>The medicine <strong>will be prescribed</strong> after your exam.</li>
                    <li>Your test <strong>will be scheduled</strong> for next week.</li>
                </ul>

                <h3>Modal Passive</h3>
                <p style="font-weight: bold;">modal + be + past participle</p>
                <ul>
                    <li>This form <strong>must be completed</strong> before your visit.</li>
                    <li>The medication <strong>should be taken</strong> with food.</li>
                    <li>Results <strong>can be viewed</strong> on your patient portal.</li>
                </ul>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4>Common Irregular Past Participles in Medical Settings:</h4>
                    <ul>
                        <li>take → <strong>taken</strong></li>
                        <li>give → <strong>given</strong></li>
                        <li>write → <strong>written</strong></li>
                        <li>send → <strong>sent</strong></li>
                        <li>tell → <strong>told</strong></li>
                        <li>draw (blood) → <strong>drawn</strong></li>
                        <li>prescribe → <strong>prescribed</strong></li>
                        <li>perform → <strong>performed</strong></li>
                    </ul>
                </div>
            `,
        },

        {
            id: "when-to-use-passive",
            stepNumber: 3,
            title: "When to Use Passive Voice",
            icon: "❓",
            explanation: `
                <h3>Reason #1: The Doer Is Unknown or Unimportant</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p>When we don't know who did the action, or it doesn't matter:</p>
                    <ul>
                        <li>"My car <strong>was stolen</strong>." (We don't know who stole it)</li>
                        <li>"The clinic <strong>was built</strong> in 1995." (Builder doesn't matter)</li>
                        <li>"Your prescription <strong>was sent</strong> to the pharmacy." (Who sent it? Doesn't matter)</li>
                    </ul>
                </div>

                <h3>Reason #2: Focus on the Action, Not the Person</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p>Medical instructions focus on WHAT happens to you, not WHO does it:</p>
                    <ul>
                        <li>"Your blood pressure <strong>will be checked</strong>." (The action is what matters)</li>
                        <li>"The test <strong>is performed</strong> in the lab." (How it's done is what matters)</li>
                        <li>"You <strong>will be contacted</strong> with results." (What happens to you matters)</li>
                    </ul>
                </div>

                <h3>Reason #3: Scientific/Formal Writing</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p>Passive is common in formal instructions, signs, and procedures:</p>
                    <ul>
                        <li>"This medication <strong>should be taken</strong> with food." (medication label)</li>
                        <li>"Patients <strong>must be registered</strong> before their appointment." (clinic sign)</li>
                        <li>"The area <strong>was cleaned</strong> and sterilized." (procedure report)</li>
                    </ul>
                </div>

                <h3>When NOT to Use Passive</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p><strong>Use active voice when the doer IS important:</strong></p>
                    <ul>
                        <li>✅ ACTIVE: "<strong>Dr. Smith</strong> prescribed this medication." (specific doctor matters)</li>
                        <li>❌ PASSIVE: "This medication was prescribed." (too vague if you need to know who)</li>
                    </ul>
                </div>
            `,
        },

        {
            id: "medical-contexts",
            stepNumber: 4,
            title: "Medical Contexts: Real Examples",
            icon: "🏥",
            explanation: `
                <h3>Clinic Signs & Instructions</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #7ba884; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"Patients <strong>must be checked in</strong> 15 minutes before appointment."</li>
                        <li>"Insurance cards <strong>should be presented</strong> at check-in."</li>
                        <li>"Co-pays <strong>are collected</strong> at the front desk."</li>
                        <li>"Masks <strong>are required</strong> in the building."</li>
                    </ul>
                </div>

                <h3>Medication Labels</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d97757; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"This medication <strong>should be taken</strong> twice daily with food."</li>
                        <li>"Tablets <strong>should not be crushed</strong> or chewed."</li>
                        <li>"The bottle <strong>must be stored</strong> in a cool, dry place."</li>
                        <li>"If symptoms persist, a doctor <strong>should be consulted</strong>."</li>
                    </ul>
                </div>

                <h3>Test & Procedure Instructions</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d4a843; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"Your blood <strong>will be drawn</strong> in the lab on the 2nd floor."</li>
                        <li>"The test <strong>is performed</strong> on an empty stomach."</li>
                        <li>"You <strong>will be called</strong> when the doctor is ready."</li>
                        <li>"Results <strong>will be sent</strong> to your primary care doctor."</li>
                    </ul>
                </div>

                <h3>Phone Messages & Emails from Clinic</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"Your appointment <strong>has been scheduled</strong> for May 15th."</li>
                        <li>"A reminder <strong>will be sent</strong> 24 hours before your visit."</li>
                        <li>"Your prescription <strong>was refilled</strong> and sent to CVS Pharmacy."</li>
                        <li>"Your lab results <strong>have been posted</strong> to your patient portal."</li>
                    </ul>
                </div>

                <h3>Converting Active to Passive (Medical Examples)</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Active</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Passive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The nurse will check your vitals.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Your vitals will be checked.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The lab performs the test.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The test is performed by the lab.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Someone sterilized the equipment.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The equipment was sterilized.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The doctor prescribed antibiotics.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Antibiotics were prescribed.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Patient Portal Tip",
                content: "Patient portals use LOTS of passive voice: 'Your results have been posted.' 'A message was sent.' 'Your appointment was confirmed.'",
            },
        },

        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Forgetting "be"</h3>
                <ul>
                    <li>❌ "The test <strong>performed</strong> yesterday." → ✅ "The test <strong>was performed</strong> yesterday."</li>
                    <li>❌ "You <strong>called</strong> tomorrow." → ✅ "You <strong>will be called</strong> tomorrow."</li>
                </ul>

                <h3>Mistake #2: Wrong Tense of "be"</h3>
                <ul>
                    <li>❌ "The medicine <strong>is taken</strong> yesterday." → ✅ "The medicine <strong>was taken</strong> yesterday."</li>
                    <li>❌ "Results <strong>were sent</strong> tomorrow." → ✅ "Results <strong>will be sent</strong> tomorrow."</li>
                </ul>

                <h3>Mistake #3: Using Wrong Past Participle</h3>
                <ul>
                    <li>❌ "My blood was <strong>drew</strong>." → ✅ "My blood was <strong>drawn</strong>."</li>
                    <li>❌ "I was <strong>gave</strong> medication." → ✅ "I was <strong>given</strong> medication."</li>
                    <li>❌ "The form was <strong>wrote</strong>." → ✅ "The form was <strong>written</strong>."</li>
                </ul>

                <h3>Mistake #4: Overusing Passive</h3>
                <ul>
                    <li>❌ PASSIVE: "A prescription was given to me by Dr. Smith." (too wordy)</li>
                    <li>✅ ACTIVE: "Dr. Smith gave me a prescription." (clearer, simpler)</li>
                </ul>
                <p style="margin-top: 1rem;"><strong>Use passive when the doer is unimportant. Use active when the doer matters.</strong></p>
            `,
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "passive-voice-ex-1",
                    title: "Exercise 1: Past Passive",
                    instructions: "Complete the passive form.",
                    items: [
                        {
                            type: "text",
                            label: "The nurse took my blood pressure. → My blood pressure _____.",
                            expectedAnswer: "was taken",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-2",
                    title: "Exercise 2: Present Passive",
                    instructions: "Choose the correct present passive form.",
                    items: [
                        {
                            type: "select",
                            label: "The test _____ on an empty stomach.",
                            options: ["performs", "is performed", "was performed", "will perform"],
                            expectedAnswer: "is performed",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-3",
                    title: "Exercise 3: Future Passive",
                    instructions: "Choose the correct future passive form.",
                    items: [
                        {
                            type: "select",
                            label: "The doctor will call you tomorrow. → You _____ tomorrow.",
                            options: ["will call", "will be called", "are called", "were called"],
                            expectedAnswer: "will be called",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-4",
                    title: "Exercise 4: Modal Passive",
                    instructions: "Choose the correct modal passive form.",
                    items: [
                        {
                            type: "select",
                            label: "This medication must _____ with food.",
                            options: ["take", "be taken", "to be taken", "taking"],
                            expectedAnswer: "be taken",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-5",
                    title: "Exercise 5: Irregular Past Participle",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: "My blood was drew yesterday."',
                            options: [
                                { value: "a", label: "My blood was drawn yesterday." },
                                { value: "b", label: "My blood was drew yesterday." },
                                { value: "c", label: "My blood is drew yesterday." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-6",
                    title: "Exercise 6: Passive (Unknown Doer)",
                    instructions: "Complete the sentence in passive voice.",
                    items: [
                        {
                            type: "select",
                            label: "Someone sent the results to my doctor. → The results _____ to my doctor.",
                            options: ["sent", "were sent", "are sent", "will send"],
                            expectedAnswer: "were sent",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-7",
                    title: "Exercise 7: Present Passive Plural",
                    instructions: "Choose the correct present passive form.",
                    items: [
                        {
                            type: "select",
                            label: "Appointments _____ online.",
                            options: ["schedule", "are scheduled", "is scheduled", "scheduled"],
                            expectedAnswer: "are scheduled",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-8",
                    title: "Exercise 8: When Passive Sounds Better",
                    instructions: "Choose the better sentence for a medication label.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is better for a medication label?",
                            options: [
                                { value: "a", label: "You should take this with food." },
                                { value: "b", label: "This should be taken with food." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference Guide",
            icon: "📋",
            explanation: `
                <h3>Passive Voice Formula</h3>
                <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">be + Past Participle</p>

                <h3>Tense Chart</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Tense</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Active</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Passive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Present Simple</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They take my blood.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">My blood is taken.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Past Simple</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They drew my blood.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">My blood was drawn.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Future</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They will call you.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You will be called.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Modal</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You must take this.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">This must be taken.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Irregular Past Participles</h3>
                <ul>
                    <li>take → <strong>taken</strong></li>
                    <li>give → <strong>given</strong></li>
                    <li>write → <strong>written</strong></li>
                    <li>send → <strong>sent</strong></li>
                    <li>tell → <strong>told</strong></li>
                    <li>draw → <strong>drawn</strong></li>
                    <li>do → <strong>done</strong></li>
                    <li>prescribe → <strong>prescribed</strong></li>
                </ul>

                <h3>When to Use Passive</h3>
                <ul>
                    <li>✅ Doer is unknown: "My car was stolen."</li>
                    <li>✅ Doer is unimportant: "The test is performed in the lab."</li>
                    <li>✅ Focus on action/receiver: "You will be called."</li>
                    <li>✅ Formal instructions: "This must be completed."</li>
                    <li>❌ Doer is important: Use active instead!</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Passive = be + past participle. Medical settings LOVE passive voice for instructions and procedures!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which is the passive voice sentence?",
            options: [
                { value: "a", label: "The nurse took my blood pressure." },
                { value: "b", label: "My blood pressure was taken." },
                { value: "c", label: "The nurse will take my blood pressure." },
            ],
            correctAnswer: "b",
            explanation: "Passive voice uses 'be + past participle.' 'My blood pressure was taken' is passive.",
        },
        {
            id: "quiz-2",
            question: "Complete: 'The test _____ on an empty stomach.'",
            options: [
                { value: "a", label: "performs" },
                { value: "b", label: "is performed" },
                { value: "c", label: "performed" },
            ],
            correctAnswer: "b",
            explanation: "'Is performed' is the correct present simple passive form (is + past participle).",
        },
        {
            id: "quiz-3",
            question: "Convert to passive: 'The doctor will call you.' → 'You _____.'",
            options: [
                { value: "a", label: "will call" },
                { value: "b", label: "will be called" },
                { value: "c", label: "are called" },
            ],
            correctAnswer: "b",
            explanation: "Future passive = will be + past participle. 'You will be called' is correct.",
        },
        {
            id: "quiz-4",
            question: "Which sentence is INCORRECT?",
            options: [
                { value: "a", label: "My blood was drawn yesterday." },
                { value: "b", label: "The results were sent to my doctor." },
                { value: "c", label: "I was gave medication." },
            ],
            correctAnswer: "c",
            explanation: "'Gave' is past tense, not past participle. Correct: 'I was given medication.'",
        },
        {
            id: "quiz-5",
            question: "When should you use passive voice?",
            options: [
                { value: "a", label: "When the doer is important" },
                { value: "b", label: "When the doer is unknown or unimportant" },
                { value: "c", label: "Always in medical settings" },
            ],
            correctAnswer: "b",
            explanation: "Use passive when the doer is unknown or unimportant. Use active when the doer matters.",
        },
        {
            id: "quiz-6",
            question: "Complete: 'This medication must _____ with food.'",
            options: [
                { value: "a", label: "take" },
                { value: "b", label: "be taken" },
                { value: "c", label: "be took" },
            ],
            correctAnswer: "b",
            explanation: "Modal passive = modal + be + past participle. 'Must be taken' is correct.",
        },
    ],
};
