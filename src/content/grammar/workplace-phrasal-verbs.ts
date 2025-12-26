import type { InteractiveGuideContent } from "@/types/activity";

export const workplacePhrasalVerbsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Workplace Phrasal Verbs: The Secret Language of Work",
            icon: "💼",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"Clock in before your shift." "Fill out this form." "Call back if you can't make it." Phrasal verbs are everywhere at work - and if you don't know them, you'll be lost. These two-word (or three-word) combinations have special meanings you can't guess from the individual words.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Phrasal verbs are the #1 thing that makes English sound natural at work:</p>
                <ul>
                    <li><strong>Your boss uses them:</strong> "Fill in for Sarah" "Turn in your timesheet"</li>
                    <li><strong>Policies mention them:</strong> "Clock in/out" "Call out sick"</li>
                    <li><strong>Coworkers expect you to know:</strong> "Can you cover for me?" "I'll get back to you"</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Making workplace small talk ("How's the new schedule working out?")</li>
                        <li>Understanding workplace policies ("You need to clock in before 9 AM" "Fill out this form")</li>
                        <li>Following instructions ("Turn in your timesheet" "Call back if you can't make it")</li>
                        <li>Role-playing common workplace situations</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💼 Phrasal verbs make you sound like you belong at work - not knowing them makes you stand out!</p>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-intro-1",
                    title: "Quick Check: Pick the Best Phrase",
                    instructions: "Choose the best phrase for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "Your shift starts now. You need to _____.",
                            options: ["clock in", "clock out", "get back", "turn in"],
                            expectedAnswer: "clock in",
                        },
                        {
                            type: "select",
                            label: "You finished a form. Now you should _____.",
                            options: ["turn it in", "call it out", "clock it in", "show it up"],
                            expectedAnswer: "turn it in",
                        },
                    ],
                },
            ],
        },

        {
            id: "what-are-phrasal-verbs",
            stepNumber: 1,
            title: "What Are Phrasal Verbs?",
            icon: "🔤",
            explanation: `
                <h3>Verb + Particle = New Meaning</h3>
                <p>A phrasal verb = a verb + a particle (preposition or adverb) that creates a completely new meaning:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Examples:</h4>
                    <ul>
                        <li><strong>turn on</strong> ≠ turn + on → means "start/activate"</li>
                        <li><strong>fill out</strong> ≠ fill + out → means "complete a form"</li>
                        <li><strong>call back</strong> ≠ call + back → means "return a phone call"</li>
                    </ul>
                </div>

                <p>The meaning is NOT literal! You can't guess it from the words.</p>
            `,
            exercises: [
                {
                    id: "workplace-pv-what-1",
                    title: "Quick Check: What Does It Mean?",
                    instructions: "Choose the meaning of the phrasal verb.",
                    items: [
                        {
                            type: "radio",
                            label: "Please <strong>fill out</strong> this form.",
                            options: [
                                { value: "a", label: "Complete the form" },
                                { value: "b", label: "Make the form bigger" },
                                { value: "c", label: "Throw the form away" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I'll <strong>call you back</strong> after my shift.",
                            options: [
                                { value: "a", label: "Call you again later" },
                                { value: "b", label: "Meet you in person" },
                                { value: "c", label: "Text you right now" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Can you <strong>look over</strong> this schedule?",
                            options: [
                                { value: "a", label: "Review/check it" },
                                { value: "b", label: "Look above it" },
                                { value: "c", label: "Memorize it forever" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Good News",
                content: "There are thousands of phrasal verbs in English, but you only need about 50 common ones for everyday work life. Focus on the most common, and you'll sound natural!",
            },
        },

        {
            id: "clock-verbs",
            stepNumber: 2,
            title: "Clock In/Out: Time & Attendance",
            icon: "⏰",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #7ba884; margin-top: 0;">clock in / punch in</h4>
                        <p style="margin: 0;">= record your arrival at work</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Don't forget to <strong>clock in</strong> when you arrive."</p>
                    </div>

                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #d97757; margin-top: 0;">clock out / punch out</h4>
                        <p style="margin: 0;">= record your departure from work</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Remember to <strong>clock out</strong> before you leave."</p>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #3b82f6; margin-top: 0;">call out / call in sick</h4>
                        <p style="margin: 0;">= notify that you can't come to work (usually illness)</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"I had to <strong>call out</strong> sick yesterday."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-clock-1",
                    title: "Practice: Time & Attendance",
                    instructions: "Choose the best phrasal verb for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "You arrive at work and start your shift. You need to _____.",
                            options: ["clock in", "clock out", "call back", "turn in"],
                            expectedAnswer: "clock in",
                        },
                        {
                            type: "select",
                            label: "Your shift ends and you are leaving. You should _____.",
                            options: ["clock out", "clock in", "fill out", "get back to"],
                            expectedAnswer: "clock out",
                        },
                        {
                            type: "select",
                            label: "You have a fever and can't come to work. You should _____.",
                            options: ["call out", "call back", "show up", "look over"],
                            expectedAnswer: "call out",
                        },
                    ],
                },
            ],
        },

        {
            id: "forms-paperwork",
            stepNumber: 3,
            title: "Fill Out/In, Turn In: Forms & Paperwork",
            icon: "📝",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #a855f7; margin-top: 0;">fill out / fill in</h4>
                        <p style="margin: 0;">= complete a form by writing information</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Please <strong>fill out</strong> this application form."</p>
                    </div>

                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #22c55e; margin-top: 0;">turn in / hand in</h4>
                        <p style="margin: 0;">= submit, give to someone (paperwork, assignments)</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"<strong>Turn in</strong> your timesheet by Friday."</p>
                    </div>

                    <div style="background: rgba(249, 115, 22, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #f97316; margin-top: 0;">look over / go over</h4>
                        <p style="margin: 0;">= review, check carefully</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Can you <strong>look over</strong> this report before I send it?"</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-forms-1",
                    title: "Practice: Forms & Paperwork",
                    instructions: "Choose the best phrasal verb for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "Please _____ this application before class ends.",
                            options: ["fill out", "clock in", "call out", "show up"],
                            expectedAnswer: "fill out",
                        },
                        {
                            type: "select",
                            label: "Don't forget to _____ your timesheet on Friday.",
                            options: ["turn in", "turn on", "fill in for", "get back"],
                            expectedAnswer: "turn in",
                        },
                        {
                            type: "select",
                            label: "Can you _____ this paper and check for mistakes?",
                            options: ["look over", "call back", "clock out", "follow up"],
                            expectedAnswer: "look over",
                        },
                    ],
                },
            ],
        },

        {
            id: "communication",
            stepNumber: 4,
            title: "Call Back, Get Back, Follow Up: Communication",
            icon: "📞",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin-bottom: 1rem;">
                        <h4>call back</h4>
                        <p style="margin: 0;">= return a phone call</p>
                        <p style="font-style: italic;">"I'll <strong>call you back</strong> in 10 minutes."</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin-bottom: 1rem;">
                        <h4>get back to (someone)</h4>
                        <p style="margin: 0;">= respond later (phone, email, with information)</p>
                        <p style="font-style: italic;">"I'll <strong>get back to you</strong> about the schedule tomorrow."</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4>follow up (on)</h4>
                        <p style="margin: 0;">= check on progress, send a reminder</p>
                        <p style="font-style: italic;">"I need to <strong>follow up on</strong> that order."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-comm-1",
                    title: "Practice: Communication",
                    instructions: "Choose the best meaning.",
                    items: [
                        {
                            type: "radio",
                            label: "I'll <strong>get back to you</strong> later.",
                            options: [
                                { value: "a", label: "I'll respond later" },
                                { value: "b", label: "I'll return to the building" },
                                { value: "c", label: "I'll give you money back" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Please <strong>call me back</strong> when you can.",
                            options: [
                                { value: "a", label: "Return my phone call" },
                                { value: "b", label: "Come back to work" },
                                { value: "c", label: "Call my mother" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I'm going to <strong>follow up</strong> tomorrow.",
                            options: [
                                { value: "a", label: "Check again / ask for an update" },
                                { value: "b", label: "Walk behind you" },
                                { value: "c", label: "Finish my shift early" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "coverage-substitution",
            stepNumber: 5,
            title: "Cover For, Fill In For: Coverage & Substitution",
            icon: "🔄",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4>cover for (someone)</h4>
                        <p style="margin: 0;">= do someone's job temporarily</p>
                        <p style="font-style: italic;">"Can you <strong>cover for me</strong> tomorrow? I have an appointment."</p>
                    </div>

                    <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4>fill in for (someone)</h4>
                        <p style="margin: 0;">= substitute for someone, do their work</p>
                        <p style="font-style: italic;">"Maria is <strong>filling in for</strong> the manager this week."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-cover-1",
                    title: "Practice: Coverage",
                    instructions: "Choose the best phrasal verb for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "I'm late today. Can you _____ me for 10 minutes?",
                            options: ["cover for", "fill out", "call back", "clock out"],
                            expectedAnswer: "cover for",
                        },
                        {
                            type: "select",
                            label: "Carlos is on vacation, so I'm going to _____ him this week.",
                            options: ["fill in for", "turn in", "call out", "show up"],
                            expectedAnswer: "fill in for",
                        },
                        {
                            type: "select",
                            label: "We're very busy right now. Can you _____ a little?",
                            options: ["help out", "look over", "get back", "clock in"],
                            expectedAnswer: "help out",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference: Essential Workplace Phrasal Verbs",
            icon: "📋",
            explanation: `
                <h3>Time & Attendance</h3>
                <ul>
                    <li><strong>clock in/out</strong> - record arrival/departure</li>
                    <li><strong>call out</strong> - notify you can't work (sick)</li>
                    <li><strong>show up</strong> - arrive, appear</li>
                </ul>

                <h3>Forms & Paperwork</h3>
                <ul>
                    <li><strong>fill out/in</strong> - complete a form</li>
                    <li><strong>turn in</strong> - submit, hand in</li>
                    <li><strong>look over</strong> - review, check</li>
                </ul>

                <h3>Communication</h3>
                <ul>
                    <li><strong>call back</strong> - return a phone call</li>
                    <li><strong>get back to</strong> - respond later</li>
                    <li><strong>follow up</strong> - check on progress</li>
                </ul>

                <h3>Coverage & Help</h3>
                <ul>
                    <li><strong>cover for</strong> - do someone's job temporarily</li>
                    <li><strong>fill in for</strong> - substitute for someone</li>
                    <li><strong>help out</strong> - assist</li>
                </ul>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ "Fill the form" → ✅ "Fill out the form"</li>
                    <li>❌ "I will call you again" → ✅ "I'll call you back"</li>
                    <li>❌ "Clock yourself" → ✅ "Clock in/out"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Learning Tip",
                content: "Don't try to translate phrasal verbs word-by-word! Learn them as complete phrases. Practice using them in sentences until they feel natural.",
            },
            exercises: [
                {
                    id: "workplace-pv-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the best phrasal verb.",
                    items: [
                        {
                            type: "select",
                            label: "You need to respond later: I'll _____ you tomorrow.",
                            options: ["get back to", "fill out", "clock out", "turn in"],
                            expectedAnswer: "get back to",
                        },
                        {
                            type: "select",
                            label: "You missed a call: Please _____ when you can.",
                            options: ["call back", "call out", "look over", "show up"],
                            expectedAnswer: "call back",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What does 'clock in' mean?",
            options: [
                { value: "a", label: "Check the time" },
                { value: "b", label: "Record your arrival at work" },
                { value: "c", label: "Fix a clock" },
            ],
            correctAnswer: "b",
            explanation: "'Clock in' (or 'punch in') means to record your arrival time at work, usually using a time clock or computer system.",
        },
        {
            id: "quiz-2",
            question: "Complete: 'Please ___ this application form.'",
            options: [
                { value: "a", label: "fill" },
                { value: "b", label: "fill out" },
                { value: "c", label: "fill up" },
            ],
            correctAnswer: "b",
            explanation: "'Fill out' (or 'fill in') means to complete a form by writing the required information.",
        },
        {
            id: "quiz-3",
            question: "What does 'I'll get back to you' mean?",
            options: [
                { value: "a", label: "I'll return to where you are" },
                { value: "b", label: "I'll respond to you later" },
                { value: "c", label: "I'll give you something back" },
            ],
            correctAnswer: "b",
            explanation: "'Get back to someone' means to respond or reply later, usually with information or an answer.",
        },
        {
            id: "quiz-4",
            question: "If you 'cover for' someone, you:",
            options: [
                { value: "a", label: "Hide them" },
                { value: "b", label: "Do their job temporarily" },
                { value: "c", label: "Pay for them" },
            ],
            correctAnswer: "b",
            explanation: "'Cover for someone' means to do their work or take their shift while they're absent.",
        },
        {
            id: "quiz-5",
            question: "What should you do if you're sick and can't work?",
            options: [
                { value: "a", label: "Call out" },
                { value: "b", label: "Call in" },
                { value: "c", label: "Both A and B are correct" },
            ],
            correctAnswer: "c",
            explanation: "Both 'call out' and 'call in sick' are correct ways to notify your employer that you can't come to work due to illness.",
        },
    ],
};
