import type { InteractiveGuideContent } from "@/types/activity";

export const reportedSpeechContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Reported Speech: Communicating Messages",
            icon: "💬",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"The doctor said I need to rest." "The nurse told me to take this medicine twice a day." "They asked me to fast before the test." Reported speech helps you communicate what someone else said or asked you to do. This is essential for medical appointments, MyChart messages, and workplace communication.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Reported speech is critical for:</p>
                <ul>
                    <li><strong>Medical communication:</strong> "The doctor said my test results were normal."</li>
                    <li><strong>MyChart messages:</strong> "They told me to schedule a follow-up."</li>
                    <li><strong>Phone calls:</strong> "The receptionist said my appointment is on Friday."</li>
                    <li><strong>Workplace:</strong> "My boss told me to submit the report by Monday."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "reported-speech-intro-1",
                    title: "Practice: Understanding Reported Speech",
                    instructions: "Identify what reported speech is used for.",
                    items: [
                        {
                            type: "radio",
                            label: "What is reported speech?",
                            options: [
                                { value: "a", label: "Telling someone what another person said or asked" },
                                { value: "b", label: "Speaking directly to someone" },
                                { value: "c", label: "Asking questions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses reported speech?",
                            options: [
                                { value: "a", label: "The doctor said I need to rest." },
                                { value: "b", label: "The doctor said, 'You need to rest.'" },
                                { value: "c", label: "Rest!" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Why is reported speech important?",
                            options: [
                                { value: "a", label: "It's used in medical communication, messages, phone calls, and workplace" },
                                { value: "b", label: "It's only used in formal writing" },
                                { value: "c", label: "It's rarely used" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "direct-vs-reported",
            stepNumber: 1,
            title: "Direct Speech vs Reported Speech",
            icon: "🔀",
            explanation: `
                <h3>What's the Difference?</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #7ba884;">Direct Speech</h4>
                    <p><strong>Exact words someone said</strong> (using quotation marks)</p>
                    <ul>
                        <li>The doctor said, <strong>"You need to rest."</strong></li>
                        <li>The nurse said, <strong>"Take this medicine twice a day."</strong></li>
                        <li>She said, <strong>"I will call you tomorrow."</strong></li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #d97757;">Reported Speech (Indirect Speech)</h4>
                    <p><strong>Telling someone what was said</strong> (NO quotation marks, tenses change)</p>
                    <ul>
                        <li>The doctor said <strong>I needed to rest</strong>.</li>
                        <li>The nurse told me <strong>to take this medicine twice a day</strong>.</li>
                        <li>She said <strong>she would call me tomorrow</strong>.</li>
                    </ul>
                </div>

                <h3>Key Changes in Reported Speech</h3>
                <ol>
                    <li><strong>NO quotation marks</strong></li>
                    <li><strong>Tenses shift back</strong> (present → past, will → would, etc.)</li>
                    <li><strong>Pronouns change</strong> (I → he/she, you → I/me, etc.)</li>
                    <li><strong>Time words change</strong> (today → that day, tomorrow → the next day)</li>
                </ol>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Direct speech = exact quote. Reported speech = retelling what was said (tenses shift back in time).",
            },
            exercises: [
                {
                    id: "direct-vs-reported-1",
                    title: "Practice: Direct vs Reported Speech",
                    instructions: "Identify whether each sentence is direct speech or reported speech.",
                    items: [
                        {
                            type: "radio",
                            label: '"The doctor said, \'You need to rest.\'"',
                            options: [
                                { value: "direct", label: "Direct speech - exact words with quotation marks" },
                                { value: "reported", label: "Reported speech - retelling without quotation marks" },
                            ],
                            expectedAnswer: "direct",
                        },
                        {
                            type: "radio",
                            label: '"The doctor said I needed to rest."',
                            options: [
                                { value: "direct", label: "Direct speech - exact words" },
                                { value: "reported", label: "Reported speech - retelling, tenses changed" },
                            ],
                            expectedAnswer: "reported",
                        },
                        {
                            type: "radio",
                            label: "What changes when converting direct to reported speech?",
                            options: [
                                { value: "a", label: "No quotation marks, tenses shift back, pronouns change, time words change" },
                                { value: "b", label: "Nothing changes" },
                                { value: "c", label: "Only punctuation changes" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "say-vs-tell",
            stepNumber: 2,
            title: "Say vs Tell",
            icon: "🗣️",
            explanation: `
                <h3>The Difference Between SAY and TELL</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #7ba884;">SAY (no indirect object)</h4>
                    <p style="font-weight: bold;">Subject + said + (that) + statement</p>
                    <ul>
                        <li>The doctor <strong>said</strong> (that) I need to rest.</li>
                        <li>She <strong>said</strong> (that) she would call me.</li>
                        <li>They <strong>said</strong> (that) the test results were normal.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ DON'T use "to" after "said"</p>
                    <p>❌ "She said <strong>to me</strong> that..." → ✅ "She said that..." OR "She told me that..."</p>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #d97757;">TELL (requires indirect object)</h4>
                    <p style="font-weight: bold;">Subject + told + (me/you/him/her/us/them) + (that) + statement</p>
                    <ul>
                        <li>The doctor <strong>told me</strong> (that) I needed to rest.</li>
                        <li>She <strong>told me</strong> (that) she would call me.</li>
                        <li>They <strong>told us</strong> (that) the results were normal.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ You MUST say who was told</p>
                    <p>❌ "She told that..." → ✅ "She told <strong>me</strong> that..."</p>
                </div>

                <h3>Quick Comparison</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Say</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Tell</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said (that) he was sick.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He told me (that) he was sick.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She said (that) the test is ready.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She told us (that) the test was ready.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They said (that) I need to fast.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They told me (that) I needed to fast.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "reported-speech-say-vs-tell-1",
                    title: "Practice: Say vs Tell",
                    instructions: "Choose the correct form (say or tell) for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "The doctor said that I need to rest." },
                                { value: "b", label: "The doctor said to me that I need to rest." },
                                { value: "c", label: "The doctor said me that I need to rest." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "She told me that she would call." },
                                { value: "b", label: "She told that she would call." },
                                { value: "c", label: "She told to me that she would call." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the main difference between 'say' and 'tell'?",
                            options: [
                                { value: "a", label: "'Say' doesn't need an indirect object; 'tell' requires one, like me/you/him/her/us/them." },
                                { value: "b", label: "'Say' is only for questions; 'tell' is for statements" },
                                { value: "c", label: "They mean the same thing and can be used interchangeably" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'say'?",
                            options: [
                                { value: "a", label: "They said that the test results were normal." },
                                { value: "b", label: "They said me that the test results were normal." },
                                { value: "c", label: "They said to us that the test results were normal." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "tense-backshifting",
            stepNumber: 3,
            title: "Tense Backshifting",
            icon: "⏮️",
            explanation: `
                <h3>How Tenses Change in Reported Speech</h3>
                <p>When reporting what someone said in the past, tenses "shift back" one step:</p>

                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Direct Speech (Exact Quote)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Reported Speech</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>am</strong> tired." (present simple)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She said she <strong>was</strong> tired. (past simple)</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>have</strong> a headache." (present simple)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said he <strong>had</strong> a headache. (past simple)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>am working</strong>." (present continuous)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said he <strong>was working</strong>. (past continuous)</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>will</strong> call you." (future)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She said she <strong>would</strong> call me. (conditional)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>can</strong> help." (modal)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said he <strong>could</strong> help.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"You <strong>must</strong> rest." (modal)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The doctor said I <strong>had to</strong> rest.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Pronouns & Time Words Also Change</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Pronouns</h4>
                    <ul>
                        <li><strong>I</strong> → he/she</li>
                        <li><strong>you</strong> → I/me</li>
                        <li><strong>we</strong> → they</li>
                        <li><strong>my</strong> → his/her</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Example:</strong></p>
                    <p>Direct: The doctor said, "<strong>You</strong> need to take <strong>your</strong> medicine."</p>
                    <p>Reported: The doctor said <strong>I</strong> needed to take <strong>my</strong> medicine.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Time Words</h4>
                    <ul>
                        <li><strong>today</strong> → that day</li>
                        <li><strong>tomorrow</strong> → the next day</li>
                        <li><strong>yesterday</strong> → the day before</li>
                        <li><strong>now</strong> → then</li>
                        <li><strong>next week</strong> → the following week</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Example:</strong></p>
                    <p>Direct: "Come back <strong>tomorrow</strong>."</p>
                    <p>Reported: She told me to come back <strong>the next day</strong>.</p>
                </div>
            `,
            tipBox: {
                title: "⚠️ Exception",
                content: "If something is still true NOW, you don't have to backshift: 'She said she lives in Boston' (still true) vs 'She said she lived in Boston' (past/not sure).",
            },
            exercises: [
                {
                    id: "reported-speech-tense-backshifting-1",
                    title: "Practice: Tense Backshifting",
                    instructions: "Choose the correct reported speech form with proper tense backshifting.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: "I am tired." Reported:',
                            options: [
                                { value: "a", label: "She said she was tired." },
                                { value: "b", label: "She said she is tired." },
                                { value: "c", label: "She said she will be tired." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "I will call you." Reported:',
                            options: [
                                { value: "a", label: "He said he would call me." },
                                { value: "b", label: "He said he will call me." },
                                { value: "c", label: "He said he can call me." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "I can help." Reported:',
                            options: [
                                { value: "a", label: "She said she could help." },
                                { value: "b", label: "She said she can help." },
                                { value: "c", label: "She said she will help." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What happens to tenses in reported speech?",
                            options: [
                                { value: "a", label: "Tenses shift back one step, like present → past and will → would." },
                                { value: "b", label: "Tenses stay the same as in direct speech" },
                                { value: "c", label: "Tenses always become past perfect" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "reported-commands",
            stepNumber: 4,
            title: "Reported Commands & Requests",
            icon: "📋",
            explanation: `
                <h3>Reporting Commands, Instructions, and Requests</h3>
                <p>Use <strong>told/asked + person + to + verb</strong> to report commands and requests.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Formula for Commands:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">told + me/you/him/her + to + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>Direct: "Take this medicine twice a day."</li>
                        <li>Reported: The doctor <strong>told me to take</strong> this medicine twice a day.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Rest for a week."</li>
                        <li>Reported: The nurse <strong>told me to rest</strong> for a week.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Don't eat before the test."</li>
                        <li>Reported: They <strong>told me not to eat</strong> before the test.</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Formula for Requests:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">asked + me/you/him/her + to + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>Direct: "Please fill out this form."</li>
                        <li>Reported: The receptionist <strong>asked me to fill out</strong> the form.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Can you call us back?"</li>
                        <li>Reported: They <strong>asked me to call</strong> them back.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Please don't bring food."</li>
                        <li>Reported: The sign <strong>asked us not to bring</strong> food.</li>
                    </ul>
                </div>

                <h3>Negative Commands</h3>
                <p>Use <strong>told/asked + person + NOT to + verb</strong></p>
                <ul>
                    <li>Direct: "Don't drive after taking this medication."</li>
                    <li>Reported: The pharmacist <strong>told me not to drive</strong> after taking the medication.</li>
                </ul>
            `,
            exercises: [
                {
                    id: "reported-speech-commands-requests-1",
                    title: "Practice: Reported Commands & Requests",
                    instructions: "Choose the correct reported speech form for commands and requests.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: "Take this medicine twice a day." Reported:',
                            options: [
                                { value: "a", label: "The doctor told me to take this medicine twice a day." },
                                { value: "b", label: "The doctor told me take this medicine twice a day." },
                                { value: "c", label: "The doctor said me to take this medicine twice a day." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "Please fill out this form." Reported:',
                            options: [
                                { value: "a", label: "The receptionist asked me to fill out the form." },
                                { value: "b", label: "The receptionist asked me fill out the form." },
                                { value: "c", label: "The receptionist said me to fill out the form." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "Don\'t eat before the test." Reported:',
                            options: [
                                { value: "a", label: "They told me not to eat before the test." },
                                { value: "b", label: "They told me don't eat before the test." },
                                { value: "c", label: "They said me not to eat before the test." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for reporting commands?",
                            options: [
                                { value: "a", label: "told/asked + person + to + base verb" },
                                { value: "b", label: "told/asked + to + base verb, no person needed" },
                                { value: "c", label: "said + person + to + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "medical-contexts",
            stepNumber: 5,
            title: "Medical Communication Contexts",
            icon: "🏥",
            explanation: `
                <h3>MyChart Messages</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #7ba884; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #7ba884; margin: 0 0 0.5rem 0;">Sample MyChart Message:</p>
                    <p style="font-style: italic; background: rgba(110, 145, 118, 0.1); padding: 0.75rem; border-radius: 0.25rem;">"Your test results are normal. Please schedule a follow-up appointment in 3 months."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>They said my test results <strong>were</strong> normal.</li>
                        <li>They told me <strong>to schedule</strong> a follow-up in 3 months.</li>
                    </ul>
                </div>

                <h3>Phone Calls from Clinic</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d97757; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d97757; margin: 0 0 0.5rem 0;">Receptionist Says:</p>
                    <p style="font-style: italic; background: rgba(200, 107, 81, 0.1); padding: 0.75rem; border-radius: 0.25rem;">"Your appointment is on Friday at 2pm. Please arrive 15 minutes early."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>She said my appointment <strong>was</strong> on Friday at 2pm.</li>
                        <li>She told me <strong>to arrive</strong> 15 minutes early.</li>
                    </ul>
                </div>

                <h3>Doctor's Instructions</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d4a843; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d4a843; margin: 0 0 0.5rem 0;">Doctor Says:</p>
                    <p style="font-style: italic; background: rgba(244, 211, 94, 0.1); padding: 0.75rem; border-radius: 0.25rem;">"You need to rest for one week. Don't lift anything heavy. Come back if you have any pain."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>The doctor said I <strong>needed to rest</strong> for one week.</li>
                        <li>She told me <strong>not to lift</strong> anything heavy.</li>
                        <li>She told me <strong>to come back</strong> if I had any pain.</li>
                    </ul>
                </div>

                <h3>Pharmacy Instructions</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; margin: 0 0 0.5rem 0;">Pharmacist Says:</p>
                    <p style="font-style: italic;">"Take this medication with food. You can't drink alcohol while taking it."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>The pharmacist told me <strong>to take</strong> the medication with food.</li>
                        <li>She said I <strong>couldn't drink</strong> alcohol while taking it.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-medical-contexts-1",
                    title: "Practice: Medical Communication Contexts",
                    instructions: "Convert direct speech to reported speech in medical contexts.",
                    items: [
                        {
                            type: "radio",
                            label: 'MyChart message: "Your test results are normal. Please schedule a follow-up appointment in 3 months." How do you report this?',
                            options: [
                                { value: "a", label: "They said my test results were normal and told me to schedule a follow-up in 3 months." },
                                { value: "b", label: "They said my test results are normal and told me schedule a follow-up in 3 months." },
                                { value: "c", label: "They said to me that my test results are normal and told me to schedule a follow-up." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Receptionist says: "Your appointment is on Friday at 2pm. Please arrive 15 minutes early." How do you report this?',
                            options: [
                                { value: "a", label: "She said my appointment was on Friday at 2pm and told me to arrive 15 minutes early." },
                                { value: "b", label: "She said my appointment is on Friday at 2pm and told me arrive 15 minutes early." },
                                { value: "c", label: "She said to me that my appointment is on Friday and told me arrive early." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Doctor says: "You need to rest for one week. Don\'t lift anything heavy." How do you report this?',
                            options: [
                                { value: "a", label: "The doctor said I needed to rest for one week and told me not to lift anything heavy." },
                                { value: "b", label: "The doctor said I need to rest for one week and told me don't lift anything heavy." },
                                { value: "c", label: "The doctor said to me that I need to rest and told me to not lift anything heavy." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Pharmacist says: "Take this medication with food. You can\'t drink alcohol while taking it." How do you report this?',
                            options: [
                                { value: "a", label: "The pharmacist told me to take the medication with food and said I couldn't drink alcohol while taking it." },
                                { value: "b", label: "The pharmacist told me take the medication with food and said I can't drink alcohol." },
                                { value: "c", label: "The pharmacist said to me to take the medication and said I can't drink alcohol." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 6,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Using "to" with "said"</h3>
                <ul>
                    <li>❌ "She said <strong>to me</strong> that..." → ✅ "She said that..." OR "She told me that..."</li>
                </ul>

                <h3>Mistake #2: Forgetting the object with "told"</h3>
                <ul>
                    <li>❌ "He told that he was sick." → ✅ "He told <strong>me</strong> that he was sick."</li>
                </ul>

                <h3>Mistake #3: Not backshifting tenses</h3>
                <ul>
                    <li>❌ "She said she <strong>is</strong> tired." → ✅ "She said she <strong>was</strong> tired."</li>
                    <li>❌ "He said he <strong>will</strong> call." → ✅ "He said he <strong>would</strong> call."</li>
                </ul>

                <h3>Mistake #4: Wrong structure for commands</h3>
                <ul>
                    <li>❌ "She told me <strong>that</strong> take the medicine." → ✅ "She told me <strong>to take</strong> the medicine."</li>
                    <li>❌ "They said me <strong>to</strong> come back." → ✅ "They told me <strong>to</strong> come back."</li>
                </ul>

                <h3>Mistake #5: Not changing pronouns</h3>
                <ul>
                    <li>❌ "The doctor said <strong>you</strong> need rest." → ✅ "The doctor said <strong>I</strong> needed rest."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "reported-speech-common-mistakes-1",
                    title: "Practice: Common Reported Speech Mistakes",
                    instructions: "Identify and correct common mistakes in reported speech.",
                    items: [
                        {
                            type: "radio",
                            label: "What is Mistake #1?",
                            options: [
                                { value: "a", label: "Using 'to' with 'said' - 'She said to me that...' should be 'She said that...' or 'She told me that...'" },
                                { value: "b", label: "Using 'told' incorrectly" },
                                { value: "c", label: "Not using enough words" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #2?",
                            options: [
                                { value: "a", label: "Forgetting the object with 'told' - 'He told that...' should be 'He told me that...'" },
                                { value: "b", label: "Using 'said' instead of 'told'" },
                                { value: "c", label: "Using too many words" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #3?",
                            options: [
                                { value: "a", label: "Not backshifting tenses: 'She said she is tired' should be 'She said she was tired'." },
                                { value: "b", label: "Using wrong pronouns" },
                                { value: "c", label: "Using active voice" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #4?",
                            options: [
                                { value: "a", label: "Wrong structure for commands: 'She told me that take...' should be 'She told me to take...'." },
                                { value: "b", label: "Using 'said' instead of 'told'" },
                                { value: "c", label: "Not changing pronouns" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "reported-speech-ex-1",
                    title: "Exercise 1: Report a Statement",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: The doctor said, "You need to rest."',
                            options: [
                                { value: "a", label: "The doctor said I need to rest." },
                                { value: "b", label: "The doctor said I needed to rest." },
                                { value: "c", label: "The doctor told me rest." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-2",
                    title: "Exercise 2: Report a Command (Tell + To)",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: The nurse said, "Take this medicine twice a day."',
                            options: [
                                { value: "a", label: "The nurse told me to take this medicine twice a day." },
                                { value: "b", label: "The nurse said me to take this medicine twice a day." },
                                { value: "c", label: "The nurse said that take this medicine twice a day." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-3",
                    title: "Exercise 3: Will → Would",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: She said, "I will call you tomorrow."',
                            options: [
                                { value: "a", label: "She said she will call me tomorrow." },
                                { value: "b", label: "She said she would call me the next day." },
                                { value: "c", label: "She told me that I would call her tomorrow." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-4",
                    title: "Exercise 4: Fix the Error",
                    instructions: 'Fix the sentence (no "to me" after "said").',
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: "He said to me that he was sick."',
                            options: [
                                { value: "a", label: "He said that he was sick." },
                                { value: "b", label: "He said to me that he was sick." },
                                { value: "c", label: "He told that he was sick." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-5",
                    title: "Exercise 5: Negative Command",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: They said, "Don\'t eat before the test."',
                            options: [
                                { value: "a", label: "They told me not to eat before the test." },
                                { value: "b", label: "They said me not eat before the test." },
                                { value: "c", label: "They told me that don't eat before the test." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-6",
                    title: "Exercise 6: Present → Past (Backshift)",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: The doctor said, "Your results are normal."',
                            options: [
                                { value: "a", label: "The doctor said my results are normal." },
                                { value: "b", label: "The doctor said my results were normal." },
                                { value: "c", label: "The doctor told my results were normal." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-7",
                    title: "Exercise 7: Say vs Tell",
                    instructions: "Choose the correct answer.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "A only" },
                                { value: "b", label: "B only" },
                                { value: "c", label: "C only" },
                                { value: "d", label: "B and C" },
                            ],
                            expectedAnswer: "d",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-8",
                    title: "Exercise 8: Ask + To (Polite Request)",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: "Please fill out this form."',
                            options: [
                                { value: "a", label: "The receptionist asked me to fill out this form." },
                                { value: "b", label: "The receptionist said me to fill out this form." },
                                { value: "c", label: "The receptionist asked me that I fill out this form." },
                            ],
                            expectedAnswer: "a",
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
                <h3>Say vs Tell</h3>
                <ul>
                    <li><strong>Say:</strong> said (that) + statement (no person)</li>
                    <li><strong>Tell:</strong> told + me/you/him/her + (that) + statement</li>
                </ul>

                <h3>Reporting Statements</h3>
                <p>Subject + said/told + (that) + statement with backshifted tense</p>
                <ul>
                    <li>Direct: "I am tired." → Reported: She said she <strong>was</strong> tired.</li>
                    <li>Direct: "I will call you." → Reported: He said he <strong>would</strong> call me.</li>
                </ul>

                <h3>Reporting Commands/Requests</h3>
                <p><strong>told/asked + person + to + base verb</strong></p>
                <ul>
                    <li>Direct: "Take this medicine." → Reported: She told me <strong>to take</strong> the medicine.</li>
                    <li>Direct: "Please wait." → Reported: She asked me <strong>to wait</strong>.</li>
                    <li>Direct: "Don't drive." → Reported: He told me <strong>not to drive</strong>.</li>
                </ul>

                <h3>Tense Backshifting</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Direct</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Reported</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">am/is/are</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">was/were</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">will</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">would</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">can</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">could</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">must</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">had to</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Say = no person needed. Tell = person required. Commands/requests = told/asked + person + to + verb.",
            },
            exercises: [
                {
                    id: "reported-speech-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of reported speech rules.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the correct structure for 'say'?",
                            options: [
                                { value: "a", label: "said that + statement; no person needed" },
                                { value: "b", label: "said + me + that + statement" },
                                { value: "c", label: "said to me + that + statement" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the correct structure for 'tell'?",
                            options: [
                                { value: "a", label: "told + me/you/him/her/us/them + that + statement; person required" },
                                { value: "b", label: "told that + statement" },
                                { value: "c", label: "told to me + that + statement" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for reporting commands?",
                            options: [
                                { value: "a", label: "told/asked + person + to + base verb" },
                                { value: "b", label: "told/asked + person + that + base verb" },
                                { value: "c", label: "said + person + to + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "I am tired." Reported:',
                            options: [
                                { value: "a", label: "She said she was tired." },
                                { value: "b", label: "She said she is tired." },
                                { value: "c", label: "She told me she is tired." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "Take this medicine." Reported:',
                            options: [
                                { value: "a", label: "She told me to take this medicine." },
                                { value: "b", label: "She said me to take this medicine." },
                                { value: "c", label: "She told me that take this medicine." },
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
            question: "Which is correct?",
            options: [
                { value: "a", label: "She said to me that she was sick." },
                { value: "b", label: "She told me that she was sick." },
                { value: "c", label: "She said me that she was sick." },
            ],
            correctAnswer: "b",
            explanation: "Use 'told me' (not 'said to me' or 'said me'). 'Told' requires a person.",
        },
        {
            id: "quiz-2",
            question: "Convert: The doctor said, 'You need to rest.' → The doctor said _____.",
            options: [
                { value: "a", label: "you need to rest" },
                { value: "b", label: "I needed to rest" },
                { value: "c", label: "I need to rest" },
            ],
            correctAnswer: "b",
            explanation: "Tense backshifts (need → needed) and pronoun changes (you → I).",
        },
        {
            id: "quiz-3",
            question: "Convert: 'Take this medicine twice a day.' → The nurse told me _____.",
            options: [
                { value: "a", label: "to take this medicine twice a day" },
                { value: "b", label: "that take this medicine twice a day" },
                { value: "c", label: "take this medicine twice a day" },
            ],
            correctAnswer: "a",
            explanation: "Commands use 'told + person + to + verb' structure.",
        },
        {
            id: "quiz-4",
            question: "Convert: 'I will call you tomorrow.' → She said _____.",
            options: [
                { value: "a", label: "she will call me tomorrow" },
                { value: "b", label: "she would call me the next day" },
                { value: "c", label: "I would call you tomorrow" },
            ],
            correctAnswer: "b",
            explanation: "'Will' becomes 'would', 'I' becomes 'she', 'tomorrow' becomes 'the next day'.",
        },
        {
            id: "quiz-5",
            question: "Which is a correctly reported command?",
            options: [
                { value: "a", label: "She said me to wait." },
                { value: "b", label: "She told me wait." },
                { value: "c", label: "She told me to wait." },
            ],
            correctAnswer: "c",
            explanation: "Commands use 'told + person + to + verb'.",
        },
        {
            id: "quiz-6",
            question: "Convert: 'Don't eat before the test.' → They told me _____.",
            options: [
                { value: "a", label: "to not eat before the test" },
                { value: "b", label: "not to eat before the test" },
                { value: "c", label: "don't eat before the test" },
            ],
            correctAnswer: "b",
            explanation: "Negative commands use 'told + person + NOT to + verb'.",
        },
    ],
};
