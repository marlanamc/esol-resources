import type { InteractiveGuideContent } from "@/types/activity";

export const imperativesDeclarativesContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Imperatives vs Declaratives: Understanding Tone in Instructions",
            icon: "🗣️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"Take this medicine twice a day." vs "You should take this medicine twice a day." The difference is small, but the tone is completely different. One is a command (imperative), the other is advice (declarative). Understanding this difference is critical for medical instructions, workplace communication, and everyday interactions.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>These sentence types affect how you sound:</p>
                <ul>
                    <li><strong>Medical settings:</strong> Doctors use both: "Take this twice daily" (imperative) vs "You need to rest" (declarative)</li>
                    <li><strong>Professional communication:</strong> "Please submit the form" (polite imperative) vs "You should submit the form" (declarative)</li>
                    <li><strong>Politeness:</strong> Knowing when to use each shows cultural awareness and professionalism</li>
                </ul>
            `,
        },

        {
            id: "what-are-imperatives",
            stepNumber: 1,
            title: "Imperatives: Commands and Instructions",
            icon: "📢",
            explanation: `
                <h3>What Is an Imperative?</h3>
                <p>An <strong>imperative sentence</strong> gives a command, instruction, request, or advice. The subject (you) is understood but not stated.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">Base Verb + (object/details)</p>
                    <p style="font-style: italic; margin-top: 0.5rem;">(No subject! Start with the verb.)</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li><strong>Take</strong> this medicine.</li>
                        <li><strong>Rest</strong> for 3 days.</li>
                        <li><strong>Drink</strong> plenty of water.</li>
                        <li><strong>Call</strong> the office if you have questions.</li>
                        <li><strong>Don't</strong> drive after taking this medication.</li>
                    </ul>
                </div>

                <h3>Types of Imperatives</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d97757;">1. Direct Commands (Strong)</h4>
                    <p>Used by authority figures (doctors, bosses, parents):</p>
                    <ul>
                        <li><strong>Stop</strong> smoking.</li>
                        <li><strong>Take</strong> this twice a day.</li>
                        <li><strong>Come</strong> back in two weeks.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #7ba884;">2. Polite Requests ("Please")</h4>
                    <p>Softened with "please" to sound more polite:</p>
                    <ul>
                        <li><strong>Please</strong> fill out this form.</li>
                        <li><strong>Please</strong> wait here.</li>
                        <li><strong>Please</strong> call us if you need help.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d4a843;">3. Negative Imperatives ("Don't")</h4>
                    <p>Tells someone NOT to do something:</p>
                    <ul>
                        <li><strong>Don't</strong> eat before the test.</li>
                        <li><strong>Don't</strong> take this on an empty stomach.</li>
                        <li><strong>Don't</strong> lift anything heavy.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Imperatives have NO subject (no 'you'). They start directly with the verb.",
            },
        },

        {
            id: "what-are-declaratives",
            stepNumber: 2,
            title: "Declaratives: Statements and Advice",
            icon: "💬",
            explanation: `
                <h3>What Is a Declarative?</h3>
                <p>A <strong>declarative sentence</strong> makes a statement. It has a subject and gives information, advice, or describes a situation.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">Subject + Verb + (object/details)</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li><strong>You need to</strong> take this medicine.</li>
                        <li><strong>You should</strong> rest for 3 days.</li>
                        <li><strong>I recommend</strong> drinking plenty of water.</li>
                        <li><strong>You have to</strong> call if you have questions.</li>
                        <li><strong>You shouldn't</strong> drive after taking this.</li>
                    </ul>
                </div>

                <h3>Common Patterns in Declaratives</h3>

                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Pattern</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Example</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Tone</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You need to...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You need to rest.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Strong/Required</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You should...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You should exercise.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Advice/Suggestion</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I recommend...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I recommend this treatment.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Professional advice</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You have to...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You have to fast before surgery.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Obligation/Necessary</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I will...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I will call you tomorrow.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Promise/Plan</td>
                        </tr>
                    </tbody>
                </table>
            `,
        },

        {
            id: "comparison",
            stepNumber: 3,
            title: "Imperatives vs Declaratives: Side by Side",
            icon: "⚖️",
            explanation: `
                <h3>Same Meaning, Different Tone</h3>
                <p>You can express the same idea with either an imperative or a declarative, but the tone changes:</p>

                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Imperative (Direct)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Declarative (Indirect)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Take</strong> this twice a day.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You need to take</strong> this twice a day.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Rest</strong> for a week.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You should rest</strong> for a week.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Don't</strong> lift anything heavy.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You shouldn't</strong> lift anything heavy.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Call</strong> if you have pain.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You should call</strong> if you have pain.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Come back</strong> in two weeks.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You need to come back</strong> in two weeks.</td>
                        </tr>
                    </tbody>
                </table>

                <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h4 style="color: #d4a843;">Which Should You Use?</h4>
                    <ul>
                        <li><strong>Imperatives:</strong> More common in medical instructions (prescriptions, clinic signs, doctor's orders)</li>
                        <li><strong>Declaratives:</strong> Sound more polite and less bossy in conversations</li>
                        <li><strong>In writing:</strong> Imperatives are standard (medication labels, instructions)</li>
                        <li><strong>In speaking:</strong> Declaratives sound friendlier</li>
                    </ul>
                </div>
            `,
        },

        {
            id: "medical-contexts",
            stepNumber: 4,
            title: "Real-World Medical Contexts",
            icon: "🏥",
            explanation: `
                <h3>Prescription Labels (Imperatives)</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d97757; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d97757; margin: 0 0 0.5rem 0;">MEDICATION INSTRUCTIONS:</p>
                    <ul style="margin: 0;">
                        <li><strong>Take</strong> 1 tablet by mouth twice daily with food.</li>
                        <li><strong>Avoid</strong> alcohol while taking this medication.</li>
                        <li><strong>Do not</strong> drive or operate heavy machinery.</li>
                        <li><strong>Finish</strong> all medication even if you feel better.</li>
                    </ul>
                </div>

                <h3>Doctor's Advice (Declaratives)</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #7ba884; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #7ba884; margin: 0 0 0.5rem 0;">DOCTOR SPEAKING TO PATIENT:</p>
                    <ul style="margin: 0;">
                        <li>"<strong>You should</strong> take 1 tablet twice a day with food."</li>
                        <li>"<strong>I recommend</strong> avoiding alcohol while on this medication."</li>
                        <li>"<strong>You shouldn't</strong> drive after taking this."</li>
                        <li>"<strong>You need to</strong> finish all the pills, even if you feel better."</li>
                    </ul>
                </div>

                <h3>Clinic Signs (Imperatives)</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li><strong>Please</strong> check in at the front desk.</li>
                        <li><strong>Turn off</strong> your cell phone.</li>
                        <li><strong>Wash</strong> your hands before entering.</li>
                        <li><strong>Do not</strong> bring food or drinks into the exam room.</li>
                    </ul>
                </div>

                <h3>Patient to Doctor (Declaratives)</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-style: italic;">Patients usually use declaratives when speaking to doctors:</p>
                    <ul>
                        <li>"<strong>I will</strong> take it twice a day."</li>
                        <li>"<strong>I'll try to</strong> rest more."</li>
                        <li>"<strong>I need to</strong> ask about the side effects."</li>
                    </ul>
                    <p style="margin-top: 1rem; font-weight: bold;">❌ Patients DON'T usually use imperatives with doctors (too direct/rude).</p>
                </div>
            `,
            tipBox: {
                title: "💡 Cultural Note",
                content: "In American medical settings, doctors can use imperatives (they're the authority), but patients should use declaratives when speaking to doctors to show respect.",
            },
        },

        {
            id: "workplace-contexts",
            stepNumber: 5,
            title: "Workplace Communication",
            icon: "💼",
            explanation: `
                <h3>Boss to Employee (Can Use Both)</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>Imperative (more direct):</strong></p>
                    <ul>
                        <li>"<strong>Please submit</strong> your timesheet by Friday."</li>
                        <li>"<strong>Turn in</strong> the report tomorrow."</li>
                    </ul>
                    <p style="margin-top: 1rem;"><strong>Declarative (softer):</strong></p>
                    <ul>
                        <li>"<strong>You need to submit</strong> your timesheet by Friday."</li>
                        <li>"<strong>I need you to turn in</strong> the report tomorrow."</li>
                    </ul>
                </div>

                <h3>Employee to Boss (Use Declaratives)</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p>✅ <strong>Use declaratives</strong> to sound respectful:</p>
                    <ul>
                        <li>"<strong>I will submit</strong> it by Friday."</li>
                        <li>"<strong>I can turn in</strong> the report tomorrow."</li>
                        <li>"<strong>I'd like to</strong> request time off."</li>
                    </ul>
                    <p style="margin-top: 1rem;">❌ <strong>DON'T use imperatives</strong> with your boss (too direct/disrespectful):</p>
                    <ul>
                        <li>❌ "Give me more time." → ✅ "Could I have more time?"</li>
                        <li>❌ "Approve my request." → ✅ "Could you please approve my request?"</li>
                    </ul>
                </div>

                <h3>Coworker to Coworker (Polite Imperatives OK)</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p>With equals, polite imperatives are fine:</p>
                    <ul>
                        <li>"<strong>Please</strong> send me that file."</li>
                        <li>"<strong>Let me know</strong> if you need help."</li>
                        <li>"<strong>Check</strong> your email when you get a chance."</li>
                    </ul>
                </div>
            `,
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "imperatives-declaratives-ex-1",
                    title: "Exercise 1: Imperative → Declarative",
                    instructions: "Choose the best declarative sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Convert: Take this medicine twice a day.",
                            options: [
                                { value: "a", label: "You need to take this medicine twice a day." },
                                { value: "b", label: "Need take this medicine twice a day." },
                                { value: "c", label: "Take you this medicine twice a day." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "imperatives-declaratives-ex-2",
                    title: "Exercise 2: Declarative → Polite Imperative",
                    instructions: "Choose the best polite imperative.",
                    items: [
                        {
                            type: "radio",
                            label: "Convert: You should rest for a week.",
                            options: [
                                { value: "a", label: "Please rest for a week." },
                                { value: "b", label: "You rest for a week." },
                                { value: "c", label: "Resting for a week." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "imperatives-declaratives-ex-3",
                    title: "Exercise 3: Politeness in a Medical Setting",
                    instructions: "Choose the more appropriate sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Patient to doctor:",
                            options: [
                                { value: "a", label: 'Give me stronger medication.' },
                                { value: "b", label: 'Could I have stronger medication?' },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "imperatives-declaratives-ex-4",
                    title: "Exercise 4: Make It Polite",
                    instructions: "Choose the best polite email version.",
                    items: [
                        {
                            type: "radio",
                            label: "Convert: Send me the report.",
                            options: [
                                { value: "a", label: "Send me the report." },
                                { value: "b", label: "Could you please send me the report?" },
                                { value: "c", label: "You send me the report." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "imperatives-declaratives-ex-5",
                    title: "Exercise 5: Identify the Sentence Type",
                    instructions: "Choose the correct label.",
                    items: [
                        {
                            type: "select",
                            label: "Don't lift anything heavy.",
                            options: ["imperative", "declarative"],
                            expectedAnswer: "imperative",
                        },
                    ],
                },
                {
                    id: "imperatives-declaratives-ex-6",
                    title: "Exercise 6: Advice Modal",
                    instructions: "Choose the best modal for advice.",
                    items: [
                        {
                            type: "select",
                            label: "You _____ drink plenty of water.",
                            options: ["should", "are", "did", "to"],
                            expectedAnswer: "should",
                        },
                    ],
                },
                {
                    id: "imperatives-declaratives-ex-7",
                    title: "Exercise 7: Negative Imperative",
                    instructions: "Choose the correct negative imperative.",
                    items: [
                        {
                            type: "radio",
                            label: "Convert: You shouldn't eat before the test.",
                            options: [
                                { value: "a", label: "Don't eat before the test." },
                                { value: "b", label: "No eat before the test." },
                                { value: "c", label: "You don't eat before the test." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "imperatives-declaratives-ex-8",
                    title: "Exercise 8: Which Sounds More Polite?",
                    instructions: "Choose the more polite sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sounds more polite?",
                            options: [
                                { value: "a", label: "Submit your timesheet." },
                                { value: "b", label: "Please submit your timesheet." },
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
                <h3>Imperatives</h3>
                <ul>
                    <li><strong>Structure:</strong> Base verb (no subject)</li>
                    <li><strong>Purpose:</strong> Commands, instructions, requests</li>
                    <li><strong>Examples:</strong> Take this. Don't drive. Please wait.</li>
                    <li><strong>Tone:</strong> Direct, authoritative</li>
                    <li><strong>When to use:</strong> Instructions, signs, recipes, authority speaking to subordinate</li>
                </ul>

                <h3>Declaratives</h3>
                <ul>
                    <li><strong>Structure:</strong> Subject + verb</li>
                    <li><strong>Purpose:</strong> Statements, advice, information</li>
                    <li><strong>Examples:</strong> You should take this. You need to rest. I will call you.</li>
                    <li><strong>Tone:</strong> Indirect, polite, conversational</li>
                    <li><strong>When to use:</strong> Advice, conversation, speaking to authority</li>
                </ul>

                <h3>Politeness Guidelines</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Situation</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Best Choice</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Speaking to boss</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Declaratives only</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Speaking to doctor</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Declaratives only</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Speaking to coworker</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Polite imperatives OK</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Written instructions</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Imperatives standard</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Doctor/boss to you</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Either (they choose)</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Imperatives = direct/bossy. Declaratives = polite/indirect. When in doubt with authority, use declaratives.",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which is an imperative sentence?",
            options: [
                { value: "a", label: "You should rest." },
                { value: "b", label: "Rest for a week." },
                { value: "c", label: "I recommend resting." },
            ],
            correctAnswer: "b",
            explanation: "Imperatives start with the base verb (no subject). 'Rest for a week' is a command.",
        },
        {
            id: "quiz-2",
            question: "Which is most appropriate for a patient speaking to a doctor?",
            options: [
                { value: "a", label: "Give me a referral." },
                { value: "b", label: "I need a referral." },
                { value: "c", label: "Refer me to a specialist." },
            ],
            correctAnswer: "b",
            explanation: "Patients should use declaratives (not imperatives) when speaking to doctors to show respect.",
        },
        {
            id: "quiz-3",
            question: "Convert to imperative: 'You should take this twice a day.'",
            options: [
                { value: "a", label: "You take this twice a day." },
                { value: "b", label: "Take this twice a day." },
                { value: "c", label: "Taking this twice a day." },
            ],
            correctAnswer: "b",
            explanation: "Imperatives remove the subject and start with the base verb: 'Take this twice a day.'",
        },
        {
            id: "quiz-4",
            question: "Which sentence is a declarative?",
            options: [
                { value: "a", label: "Don't eat before the test." },
                { value: "b", label: "Please wait here." },
                { value: "c", label: "You need to fast before the test." },
            ],
            correctAnswer: "c",
            explanation: "Declaratives have a subject + verb. 'You need to fast' is a declarative statement.",
        },
        {
            id: "quiz-5",
            question: "How can you make an imperative more polite?",
            options: [
                { value: "a", label: "Add 'please'" },
                { value: "b", label: "Add an exclamation mark" },
                { value: "c", label: "Make it a question" },
            ],
            correctAnswer: "a",
            explanation: "Adding 'please' softens the imperative and makes it sound more polite: 'Please wait here.'",
        },
        {
            id: "quiz-6",
            question: "Which is better for an employee emailing their boss?",
            options: [
                { value: "a", label: "Approve my time off request." },
                { value: "b", label: "I'd like to request time off." },
                { value: "c", label: "Give me Friday off." },
            ],
            correctAnswer: "b",
            explanation: "Use declaratives when speaking to authority. 'I'd like to request' is polite and respectful.",
        },
    ],
};
