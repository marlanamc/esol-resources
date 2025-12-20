import type { InteractiveGuideContent } from "@/types/activity";

export const punctuationCapitalizationContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Punctuation & Capitalization: Writing Conventions",
            icon: "✍️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Correct punctuation and capitalization make your writing look professional and easy to read. Without them, your writing can be confusing or look careless - even if your grammar is perfect!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Punctuation and capitalization are essential for:</p>
                <ul>
                    <li><strong>Professional communication:</strong> Emails, job applications, and workplace documents</li>
                    <li><strong>Academic writing:</strong> Essays, assignments, and reports</li>
                    <li><strong>Clarity:</strong> Helping readers understand your meaning</li>
                    <li><strong>Credibility:</strong> Showing attention to detail and professionalism</li>
                </ul>
            `,
        },

        {
            id: "end-punctuation",
            stepNumber: 1,
            title: "End Punctuation: . ? !",
            icon: "⏹️",
            explanation: `
                <h3>Three Types of End Punctuation</h3>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4 style="color: #7ba884;">Period (.) - Statements</h4>
                    <p>Use for statements and commands:</p>
                    <ul>
                        <li>I live in Boston<strong>.</strong></li>
                        <li>Please submit your report by Friday<strong>.</strong></li>
                        <li>The doctor said I need to rest<strong>.</strong></li>
                    </ul>
                </div>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4 style="color: #d97757;">Question Mark (?) - Questions</h4>
                    <p>Use for direct questions:</p>
                    <ul>
                        <li>Where do you live<strong>?</strong></li>
                        <li>Can you help me<strong>?</strong></li>
                        <li>What time is your appointment<strong>?</strong></li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>⚠️ BUT:</strong> Indirect questions use periods:</p>
                    <ul>
                        <li>I wonder where you live<strong>.</strong> (NOT ?)</li>
                        <li>She asked if I could help<strong>.</strong> (NOT ?)</li>
                    </ul>
                </div>

                <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4 style="color: #d4a843;">Exclamation Point (!) - Strong Emotion</h4>
                    <p>Use sparingly for strong emotion or urgency:</p>
                    <ul>
                        <li>Help<strong>!</strong></li>
                        <li>Watch out<strong>!</strong></li>
                        <li>I got the job<strong>!</strong></li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>⚠️ Caution:</strong> Don't overuse in professional writing!</p>
                </div>
            `,
        },

        {
            id: "commas",
            stepNumber: 2,
            title: "Commas (,)",
            icon: "📍",
            explanation: `
                <h3>When to Use Commas</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>1. Lists (3+ items)</h4>
                    <p>I need bread<strong>,</strong> milk<strong>,</strong> and eggs.</p>
                    <p>She speaks English<strong>,</strong> Spanish<strong>,</strong> and Portuguese.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>2. After introductory words/phrases</h4>
                    <p>However<strong>,</strong> I disagree.</p>
                    <p>After work<strong>,</strong> I'm going to the gym.</p>
                    <p>If I have time<strong>,</strong> I'll call you.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>3. Compound sentences (two independent clauses)</h4>
                    <p>I wanted to go<strong>,</strong> but I was too tired.</p>
                    <p>She studied hard<strong>,</strong> and she passed the test.</p>
                    <p>(Pattern: sentence<strong>,</strong> FANBOYS sentence)</p>
                    <p style="font-style: italic;">FANBOYS = for, and, nor, but, or, yet, so</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>4. Between city and state/country</h4>
                    <p>I live in Boston<strong>,</strong> Massachusetts.</p>
                    <p>He's from Paris<strong>,</strong> France.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>5. Dates</h4>
                    <p>My appointment is on June 15<strong>,</strong> 2026.</p>
                    <p>(But: June 2026 - no comma when no day)</p>
                </div>
            `,
            tipBox: {
                title: "💡 Common Error",
                content: "DON'T use a comma between subject and verb: ❌ 'The doctor, said I need rest.' ✅ 'The doctor said I need rest.'",
            },
        },

        {
            id: "apostrophes",
            stepNumber: 3,
            title: "Apostrophes (')",
            icon: "'",
            explanation: `
                <h3>Two Uses of Apostrophes</h3>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>1. Contractions (showing missing letters)</h4>
                    <p>do not → don<strong>'</strong>t</p>
                    <p>I am → I<strong>'</strong>m</p>
                    <p>she is → she<strong>'</strong>s</p>
                    <p>they are → they<strong>'</strong>re</p>
                    <p>cannot → can<strong>'</strong>t</p>
                    <p>will not → won<strong>'</strong>t</p>
                </div>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>2. Possession (showing ownership)</h4>
                    <p><strong>Singular nouns:</strong> add <strong>'s</strong></p>
                    <ul>
                        <li>the doctor<strong>'s</strong> office</li>
                        <li>Maria<strong>'s</strong> book</li>
                        <li>my boss<strong>'s</strong> email</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Plural nouns ending in -s:</strong> add <strong>'</strong> only</p>
                    <ul>
                        <li>the doctors<strong>'</strong> offices (multiple doctors)</li>
                        <li>my parents<strong>'</strong> house</li>
                        <li>the teachers<strong>'</strong> lounge</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Irregular plurals:</strong> add <strong>'s</strong></p>
                    <ul>
                        <li>children<strong>'s</strong> toys</li>
                        <li>women<strong>'s</strong> clothing</li>
                    </ul>
                </div>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ its' → ✅ <strong>its</strong> (possessive, no apostrophe!)</li>
                    <li>❌ it's book → ✅ <strong>its</strong> book (possessive)</li>
                    <li>✅ <strong>it's</strong> raining (it is raining - contraction)</li>
                    <li>❌ your' → ✅ <strong>your</strong> (possessive, no apostrophe!)</li>
                    <li>❌ you're book → ✅ <strong>your</strong> book (possessive)</li>
                    <li>✅ <strong>you're</strong> late (you are late - contraction)</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Critical Rule",
                content: "Never use apostrophes to make plurals! ❌ apple's → ✅ apples (plural, no apostrophe)",
            },
        },

        {
            id: "capitalization",
            stepNumber: 4,
            title: "Capitalization Rules",
            icon: "🔤",
            explanation: `
                <h3>When to Use Capital Letters</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>1. Beginning of sentences</h4>
                    <p><strong>T</strong>he doctor said I need to rest.</p>
                    <p><strong>I</strong> live in Boston.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>2. The pronoun "I"</h4>
                    <p>My friend and <strong>I</strong> went to the store.</p>
                    <p><strong>I</strong> am a student.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>3. Proper nouns (specific names)</h4>
                    <p><strong>People:</strong> Maria, Dr. Smith, President Biden</p>
                    <p><strong>Places:</strong> Boston, Massachusetts, United States, Main Street</p>
                    <p><strong>Days/Months:</strong> Monday, January (NOT seasons: spring, summer)</p>
                    <p><strong>Organizations:</strong> Harvard University, Google, Red Cross</p>
                    <p><strong>Languages/Nationalities:</strong> English, Spanish, American, Mexican</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>4. Titles (when before a name)</h4>
                    <p><strong>Doctor</strong> Smith (✓ - title before name)</p>
                    <p>my doctor (✗ - no capital, not before name)</p>
                    <p><strong>Professor</strong> Johnson</p>
                    <p>my professor</p>
                </div>

                <h3>When NOT to Capitalize</h3>
                <ul>
                    <li><strong>Seasons:</strong> spring, summer, fall, winter</li>
                    <li><strong>General nouns:</strong> the hospital, the university, my doctor</li>
                    <li><strong>Job titles alone:</strong> I am a teacher. (NOT Teacher)</li>
                    <li><strong>Subjects (except languages):</strong> math, science, history (BUT: English, Spanish)</li>
                </ul>
            `,
        },

        {
            id: "quotation-marks",
            stepNumber: 5,
            title: "Quotation Marks (\" \")",
            icon: "💬",
            explanation: `
                <h3>When to Use Quotation Marks</h3>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>1. Direct Speech (exact words)</h4>
                    <p>The doctor said, <strong>"You need to rest."</strong></p>
                    <p><strong>"I feel better,"</strong> she said.</p>
                    <p>He asked, <strong>"When is your appointment?"</strong></p>
                </div>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>2. Punctuation with Quotation Marks</h4>
                    <p><strong>Periods and commas:</strong> INSIDE the quotes</p>
                    <ul>
                        <li>She said, "I'm tired<strong>."</strong></li>
                        <li>"I'll call you later<strong>,"</strong> he said.</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Question marks and exclamation points:</strong></p>
                    <ul>
                        <li>If the quote is a question: "Where are you<strong>?"</strong> she asked.</li>
                        <li>If the sentence is a question: Did she say "I'm tired"<strong>?</strong></li>
                    </ul>
                </div>
            `,
        },

        {
            id: "practice",
            title: "Editing Practice",
            icon: "✏️",
            exercises: [
                {
                    id: "punctuation-capitalization-ex-1",
                    title: "Exercise 1: Commas in a List",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Add punctuation: I need bread milk and eggs",
                            options: [
                                { value: "a", label: "I need bread, milk, and eggs." },
                                { value: "b", label: "I need bread milk and eggs." },
                                { value: "c", label: "I need bread, milk and eggs" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-2",
                    title: "Exercise 2: Capital Letters",
                    instructions: "Choose the correctly capitalized sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix capitalization: i live in boston, massachusetts.",
                            options: [
                                { value: "a", label: "I live in Boston, Massachusetts." },
                                { value: "b", label: "I live in boston, massachusetts." },
                                { value: "c", label: "i live in Boston, Massachusetts." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-3",
                    title: "Exercise 3: Apostrophes (Contractions + Possessive)",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Add apostrophes: Thats my doctors office.",
                            options: [
                                { value: "a", label: "That's my doctor's office." },
                                { value: "b", label: "Thats my doctors office." },
                                { value: "c", label: "That's my doctors office." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-4",
                    title: "Exercise 4: Quotation Marks",
                    instructions: "Choose the correctly punctuated sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: She said I need to rest (add quotation marks)',
                            options: [
                                { value: "a", label: 'She said, "I need to rest."' },
                                { value: "b", label: 'She said "I need to rest".' },
                                { value: "c", label: "She said, I need to rest." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-5",
                    title: "Exercise 5: Comma After an Intro Clause",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Add a comma: If I have time I'll call you.",
                            options: [
                                { value: "a", label: "If I have time, I'll call you." },
                                { value: "b", label: "If I have time I'll call you." },
                                { value: "c", label: "If I have time; I'll call you." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-6",
                    title: "Exercise 6: Possessive (Children's)",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: The childrens toys are in the box.",
                            options: [
                                { value: "a", label: "The children's toys are in the box." },
                                { value: "b", label: "The childrens toys are in the box." },
                                { value: "c", label: "The childrens' toys are in the box." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-7",
                    title: "Exercise 7: Proper Nouns",
                    instructions: "Choose the correctly capitalized sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Capitalize correctly: i study english and math at harvard university.",
                            options: [
                                { value: "a", label: "I study English and math at Harvard University." },
                                { value: "b", label: "I study english and Math at harvard university." },
                                { value: "c", label: "i study English and math at Harvard university." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "punctuation-capitalization-ex-8",
                    title: "Exercise 8: It's vs Its",
                    instructions: "Choose the correct sentence (it is = it's).",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: Its a beautiful day. (it is a beautiful day)",
                            options: [
                                { value: "a", label: "It's a beautiful day." },
                                { value: "b", label: "Its a beautiful day." },
                                { value: "c", label: "It's a beautiful day" },
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
                <h3>End Punctuation</h3>
                <ul>
                    <li><strong>Period (.):</strong> Statements and commands</li>
                    <li><strong>Question Mark (?):</strong> Direct questions only</li>
                    <li><strong>Exclamation Point (!):</strong> Strong emotion (use sparingly)</li>
                </ul>

                <h3>Commas (,)</h3>
                <ul>
                    <li>Lists: bread, milk, and eggs</li>
                    <li>After intro: However, I disagree.</li>
                    <li>Compound: I tried, but I failed.</li>
                    <li>Location: Boston, Massachusetts</li>
                    <li>Dates: June 15, 2026</li>
                </ul>

                <h3>Apostrophes (')</h3>
                <ul>
                    <li>Contractions: don't, I'm, she's</li>
                    <li>Singular possessive: doctor's office</li>
                    <li>Plural possessive (ending in -s): doctors' offices</li>
                    <li>Irregular plural possessive: children's toys</li>
                </ul>

                <h3>Capitalization</h3>
                <ul>
                    <li>Beginning of sentences</li>
                    <li>Pronoun "I"</li>
                    <li>Proper nouns (names, places, organizations)</li>
                    <li>Days/months (NOT seasons)</li>
                    <li>Languages/nationalities</li>
                    <li>Titles before names</li>
                </ul>

                <h3>Common Errors</h3>
                <ul>
                    <li>❌ its' → ✅ its (possessive)</li>
                    <li>❌ it's book → ✅ its book / it's = it is</li>
                    <li>❌ apple's → ✅ apples (plural, no apostrophe!)</li>
                    <li>❌ i live in boston → ✅ I live in Boston</li>
                    <li>❌ I study Math and english → ✅ I study math and English</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Pro Tip",
                content: "Read your writing out loud. Pause at commas, stop at periods, and listen for questions (?).",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which needs a comma? 'I wanted to go but I was too tired.'",
            options: [
                { value: "a", label: "No comma needed" },
                { value: "b", label: "After 'go'" },
                { value: "c", label: "After 'but'" },
            ],
            correctAnswer: "b",
            explanation: "Compound sentences need a comma before the conjunction: 'I wanted to go, but I was too tired.'",
        },
        {
            id: "quiz-2",
            question: "Which is correct?",
            options: [
                { value: "a", label: "That's my doctors office." },
                { value: "b", label: "Thats my doctor's office." },
                { value: "c", label: "That's my doctor's office." },
            ],
            correctAnswer: "c",
            explanation: "Need apostrophes for both: 'That's' (that is) and 'doctor's' (possessive).",
        },
        {
            id: "quiz-3",
            question: "Which is capitalized correctly?",
            options: [
                { value: "a", label: "i study english at Harvard University." },
                { value: "b", label: "I study English at harvard university." },
                { value: "c", label: "I study English at Harvard University." },
            ],
            correctAnswer: "c",
            explanation: "Capitalize: I (pronoun), English (language), Harvard University (proper noun).",
        },
        {
            id: "quiz-4",
            question: "What's wrong? 'The childrens toys are here.'",
            options: [
                { value: "a", label: "Nothing, it's correct" },
                { value: "b", label: "Needs apostrophe: children's" },
                { value: "c", label: "Should be: childrens'" },
            ],
            correctAnswer: "b",
            explanation: "Irregular plurals add 's for possession: 'The children's toys are here.'",
        },
        {
            id: "quiz-5",
            question: "Which is correct?",
            options: [
                { value: "a", label: "Its a beautiful day." },
                { value: "b", label: "It's a beautiful day." },
                { value: "c", label: "Its' a beautiful day." },
            ],
            correctAnswer: "b",
            explanation: "'It's' = contraction for 'it is'. 'Its' = possessive (no apostrophe).",
        },
        {
            id: "quiz-6",
            question: "Where do commas go? 'I need bread milk eggs and cheese.'",
            options: [
                { value: "a", label: "After bread, milk, and eggs" },
                { value: "b", label: "After bread and milk only" },
                { value: "c", label: "No commas needed" },
            ],
            correctAnswer: "a",
            explanation: "Lists need commas: 'I need bread, milk, eggs, and cheese.'",
        },
    ],
};
