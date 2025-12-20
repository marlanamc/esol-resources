import type { InteractiveGuideContent } from "@/types/activity";

export const paragraphFormatContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Paragraph Format: Building Strong Paragraphs",
            icon: "📄",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">A paragraph is more than just a bunch of sentences! It has a clear structure: topic sentence → supporting details → conclusion. Strong paragraphs make your writing clear, organized, and professional.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Good paragraph structure is essential for:</p>
                <ul>
                    <li><strong>Academic writing:</strong> Essays, reports, and assignments</li>
                    <li><strong>Professional communication:</strong> Emails, reports, and proposals</li>
                    <li><strong>Clarity:</strong> Helping readers follow your ideas</li>
                    <li><strong>Organization:</strong> Presenting information logically</li>
                </ul>
            `,
        },

        {
            id: "what-is-paragraph",
            stepNumber: 1,
            title: "What Is a Paragraph?",
            icon: "❓",
            explanation: `
                <h3>Definition</h3>
                <p>A <strong>paragraph</strong> is a group of sentences about <strong>ONE main idea</strong>.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>The Three-Part Structure:</h4>
                    <ol style="font-size: 1.125rem;">
                        <li><strong>Topic Sentence</strong> - introduces the main idea</li>
                        <li><strong>Supporting Details</strong> - explain, describe, or prove the main idea (3-5 sentences)</li>
                        <li><strong>Conclusion Sentence</strong> - wraps up or restates the main idea</li>
                    </ol>
                </div>

                <h3>Example Paragraph</h3>
                <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 2px solid #7ba884; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #7ba884; margin: 0 0 0.5rem 0;">Topic Sentence:</p>
                    <p style="margin: 0 0 1rem 0; padding-left: 1rem; border-left: 3px solid #7ba884;">Exercise is important for good health.</p>

                    <p style="font-weight: bold; color: #d97757; margin: 1rem 0 0.5rem 0;">Supporting Details:</p>
                    <p style="margin: 0 0 0.5rem 0; padding-left: 1rem; border-left: 3px solid #d97757;">First, it helps you lose weight and stay in shape. Second, exercise reduces stress and makes you feel happier. Finally, it lowers your risk of serious diseases like diabetes and heart disease.</p>

                    <p style="font-weight: bold; color: #d4a843; margin: 1rem 0 0.5rem 0;">Conclusion Sentence:</p>
                    <p style="margin: 0; padding-left: 1rem; border-left: 3px solid #d4a843;">For these reasons, everyone should try to exercise at least 30 minutes a day.</p>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "ONE paragraph = ONE main idea. If you have a new idea, start a new paragraph!",
            },
        },

        {
            id: "topic-sentence",
            stepNumber: 2,
            title: "Topic Sentence: The Main Idea",
            icon: "🎯",
            explanation: `
                <h3>What Is a Topic Sentence?</h3>
                <p>The <strong>topic sentence</strong> is the FIRST sentence of a paragraph. It tells the reader what the paragraph is about.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Characteristics of a Good Topic Sentence:</h4>
                    <ul>
                        <li>✅ States the main idea clearly</li>
                        <li>✅ Is a complete sentence (subject + verb)</li>
                        <li>✅ Is not too specific (needs room for details)</li>
                        <li>✅ Is not too general (needs a clear focus)</li>
                    </ul>
                </div>

                <h3>Good vs Bad Topic Sentences</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">❌ Too General</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">✅ Just Right</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Exercise is good.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Exercise is important for good health.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Food is important.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Eating breakfast helps you concentrate at work.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I like things.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I enjoy walking in the park every morning.</td>
                        </tr>
                    </tbody>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">❌ Too Specific</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">✅ Just Right</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I walk for exactly 32 minutes.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Walking daily has many health benefits.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">On Tuesday I ate oatmeal at 7:15am.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Eating a healthy breakfast improves my energy.</td>
                        </tr>
                    </tbody>
                </table>
            `,
        },

        {
            id: "supporting-details",
            stepNumber: 3,
            title: "Supporting Details: The Body",
            icon: "📝",
            explanation: `
                <h3>What Are Supporting Details?</h3>
                <p><strong>Supporting details</strong> are sentences that explain, describe, or prove your topic sentence. They make up the "body" of the paragraph.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Types of Supporting Details:</h4>
                    <ul>
                        <li><strong>Examples:</strong> "For example, I walk 30 minutes every day."</li>
                        <li><strong>Reasons:</strong> "First, it helps me lose weight."</li>
                        <li><strong>Facts:</strong> "Exercise reduces the risk of heart disease."</li>
                        <li><strong>Personal experience:</strong> "When I started walking, I felt less stressed."</li>
                    </ul>
                </div>

                <h3>How Many Supporting Details?</h3>
                <p>Usually <strong>3-5 sentences</strong> - enough to fully explain your main idea.</p>

                <h3>Using Transition Words</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>Transition words help connect your ideas:</strong></p>
                    <ul>
                        <li><strong>Listing:</strong> First, Second, Third, Finally</li>
                        <li><strong>Adding:</strong> Also, In addition, Furthermore</li>
                        <li><strong>Giving examples:</strong> For example, For instance</li>
                        <li><strong>Showing results:</strong> Therefore, As a result, Consequently</li>
                    </ul>
                </div>

                <h3>Example: Supporting Details with Transitions</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; margin: 0 0 0.5rem 0;">Topic: Exercise is important for good health.</p>
                    <p><strong>First,</strong> it helps you lose weight and stay in shape. <strong>Second,</strong> exercise reduces stress and makes you feel happier. <strong>Finally,</strong> it lowers your risk of serious diseases like diabetes and heart disease.</p>
                </div>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "ALL supporting details must relate to your topic sentence. If a sentence doesn't support the main idea, delete it or move it to a different paragraph!",
            },
        },

        {
            id: "conclusion-sentence",
            stepNumber: 4,
            title: "Conclusion Sentence: Wrapping Up",
            icon: "🏁",
            explanation: `
                <h3>What Is a Conclusion Sentence?</h3>
                <p>The <strong>conclusion sentence</strong> is the LAST sentence of a paragraph. It wraps up the paragraph by restating the main idea or summarizing the key points.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem;">
                    <h4>Ways to Write a Conclusion Sentence:</h4>
                    <ol>
                        <li><strong>Restate the topic sentence</strong> (in different words)</li>
                        <li><strong>Summarize key points</strong></li>
                        <li><strong>Give a final thought</strong> or recommendation</li>
                    </ol>
                </div>

                <h3>Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Topic: Exercise is important for good health.</p>
                    <p style="margin-top: 0.5rem;"><strong>Option 1 (Restate):</strong> For these reasons, exercise is essential for staying healthy.</p>
                    <p style="margin-top: 0.5rem;"><strong>Option 2 (Recommend):</strong> Everyone should try to exercise at least 30 minutes a day.</p>
                    <p style="margin-top: 0.5rem;"><strong>Option 3 (Summary):</strong> In short, regular exercise helps you lose weight, reduce stress, and prevent disease.</p>
                </div>

                <h3>Common Conclusion Starters</h3>
                <ul>
                    <li>For these reasons,...</li>
                    <li>In conclusion,...</li>
                    <li>In short,...</li>
                    <li>Therefore,...</li>
                    <li>As a result,...</li>
                    <li>That is why...</li>
                </ul>
            `,
        },

        {
            id: "unity-coherence",
            stepNumber: 5,
            title: "Unity & Coherence",
            icon: "🔗",
            explanation: `
                <h3>Unity: One Main Idea</h3>
                <p><strong>Unity</strong> means all sentences in a paragraph support the SAME main idea.</p>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold;">❌ Paragraph WITHOUT Unity:</p>
                    <p>Exercise is important for good health. <span style="background: yellow;">I also like pizza.</span> Exercise helps you lose weight. <span style="background: yellow;">My friend doesn't like to exercise.</span> It also reduces stress.</p>
                    <p style="margin-top: 0.75rem; font-style: italic;">Problem: The highlighted sentences don't support the main idea (exercise is important).</p>
                </div>

                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold;">✅ Paragraph WITH Unity:</p>
                    <p>Exercise is important for good health. First, it helps you lose weight and stay in shape. Second, exercise reduces stress and makes you feel happier. Finally, it lowers your risk of serious diseases.</p>
                    <p style="margin-top: 0.75rem; font-style: italic;">Better: All sentences support the main idea.</p>
                </div>

                <h3>Coherence: Logical Flow</h3>
                <p><strong>Coherence</strong> means your ideas are connected in a logical order that's easy to follow.</p>

                <h4>Tips for Coherence:</h4>
                <ul>
                    <li>Use transition words (First, Second, Finally)</li>
                    <li>Put sentences in logical order</li>
                    <li>Repeat key words from the topic sentence</li>
                    <li>Use pronouns to refer back (it, they, this)</li>
                </ul>
            `,
        },

        {
            id: "common-mistakes",
            stepNumber: 6,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: No Topic Sentence</h3>
                <p>❌ Starting with details without stating the main idea first</p>
                <p>✅ Start with a clear topic sentence</p>

                <h3>Mistake #2: Too Many Ideas in One Paragraph</h3>
                <p>❌ Talking about exercise, food, AND sleep in one paragraph</p>
                <p>✅ One paragraph = one main idea. Use separate paragraphs for different ideas.</p>

                <h3>Mistake #3: No Conclusion</h3>
                <p>❌ Ending abruptly without wrapping up</p>
                <p>✅ Add a conclusion sentence to finish the paragraph</p>

                <h3>Mistake #4: Off-Topic Sentences</h3>
                <p>❌ Including sentences that don't relate to the topic sentence</p>
                <p>✅ Every sentence must support the main idea</p>

                <h3>Mistake #5: No Transitions</h3>
                <p>❌ Listing ideas without connecting them</p>
                <p>✅ Use transition words to connect sentences smoothly</p>

                <h3>Mistake #6: One or Two Sentences</h3>
                <p>❌ Writing only 1-2 sentences and calling it a paragraph</p>
                <p>✅ A paragraph needs at least 5-7 sentences (topic + 3-5 details + conclusion)</p>
            `,
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "paragraph-format-ex-1",
                    title: "Exercise 1: Topic Sentence",
                    instructions: "Choose the topic sentence (the main idea).",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is the topic sentence?",
                            options: [
                                { value: "a", label: "First, it saves money." },
                                { value: "b", label: "Cooking at home is better than eating out." },
                                { value: "c", label: "Second, it's healthier." },
                                { value: "d", label: "Finally, you can control ingredients." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-2",
                    title: "Exercise 2: Off-Topic Sentence",
                    instructions: "Choose the sentence that does NOT belong.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence does NOT belong in the paragraph?",
                            options: [
                                { value: "a", label: "Exercise is important." },
                                { value: "b", label: "It helps you lose weight." },
                                { value: "c", label: "I like pizza." },
                                { value: "d", label: "It reduces stress." },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-3",
                    title: "Exercise 3: What's Missing?",
                    instructions: "Choose what the paragraph needs.",
                    items: [
                        {
                            type: "select",
                            label: "Walking is good exercise. It's free and easy to do. You can walk anywhere. (What is missing?)",
                            options: ["Topic sentence", "Supporting details", "Conclusion sentence"],
                            expectedAnswer: "Conclusion sentence",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-4",
                    title: "Exercise 4: Transition Word",
                    instructions: "Choose the best transition word for the blank.",
                    items: [
                        {
                            type: "select",
                            label: "_____, exercise reduces stress.",
                            options: ["Also", "Yesterday", "Because", "But"],
                            expectedAnswer: "Also",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-5",
                    title: "Exercise 5: Conclusion Sentence",
                    instructions: "Choose the best conclusion sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Topic: Drinking water is important for health.",
                            options: [
                                { value: "a", label: "Drinking water is important for health." },
                                { value: "b", label: "Water is wet." },
                                { value: "c", label: "For these reasons, everyone should drink enough water every day." },
                                { value: "d", label: "I like coffee." },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-6",
                    title: "Exercise 6: Too General or Too Specific?",
                    instructions: "Choose the best answer.",
                    items: [
                        {
                            type: "select",
                            label: "Things are important.",
                            options: ["too general", "too specific"],
                            expectedAnswer: "too general",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-7",
                    title: "Exercise 7: Improve the Topic Sentence",
                    instructions: "Choose the better topic sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix this topic sentence: "I walk."',
                            options: [
                                { value: "a", label: "I walk." },
                                { value: "b", label: "Walking daily has many health benefits." },
                                { value: "c", label: "Yesterday I walked at 7:15 AM." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "paragraph-format-ex-8",
                    title: "Exercise 8: Paragraph Length",
                    instructions: "Choose the best answer.",
                    items: [
                        {
                            type: "select",
                            label: "How many sentences should a paragraph have (usually)?",
                            options: ["1–2", "3–4", "5–7", "10–12"],
                            expectedAnswer: "5–7",
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
                <h3>Paragraph Structure</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ol style="font-size: 1.125rem; margin: 0;">
                        <li><strong>Topic Sentence</strong> - States the main idea (1 sentence)</li>
                        <li><strong>Supporting Details</strong> - Explain/prove the main idea (3-5 sentences)</li>
                        <li><strong>Conclusion Sentence</strong> - Wraps up the paragraph (1 sentence)</li>
                    </ol>
                    <p style="margin-top: 1rem; font-weight: bold;">Total: 5-7 sentences minimum</p>
                </div>

                <h3>Topic Sentence</h3>
                <ul>
                    <li>First sentence of paragraph</li>
                    <li>States main idea clearly</li>
                    <li>Not too general, not too specific</li>
                    <li>Complete sentence (subject + verb)</li>
                </ul>

                <h3>Supporting Details</h3>
                <ul>
                    <li>Explain, describe, or prove topic sentence</li>
                    <li>Use examples, reasons, facts, or personal experience</li>
                    <li>Use transition words (First, Second, Also, For example)</li>
                    <li>All sentences must relate to the main idea</li>
                </ul>

                <h3>Conclusion Sentence</h3>
                <ul>
                    <li>Last sentence of paragraph</li>
                    <li>Restate main idea OR summarize key points</li>
                    <li>Use: For these reasons, In conclusion, Therefore, etc.</li>
                </ul>

                <h3>Unity & Coherence</h3>
                <ul>
                    <li><strong>Unity:</strong> One paragraph = ONE main idea</li>
                    <li><strong>Coherence:</strong> Ideas flow logically with transitions</li>
                </ul>

                <h3>Common Errors to Avoid</h3>
                <ul>
                    <li>❌ No topic sentence</li>
                    <li>❌ Too many ideas in one paragraph</li>
                    <li>❌ Off-topic sentences</li>
                    <li>❌ No conclusion</li>
                    <li>❌ No transition words</li>
                    <li>❌ Too short (1-2 sentences)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Pro Tip",
                content: "Before you start writing, ask: What is my ONE main idea? Then build everything around that!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What are the three parts of a paragraph?",
            options: [
                { value: "a", label: "Beginning, middle, end" },
                { value: "b", label: "Topic sentence, supporting details, conclusion" },
                { value: "c", label: "Introduction, examples, summary" },
            ],
            correctAnswer: "b",
            explanation: "A paragraph has: topic sentence (main idea), supporting details (body), and conclusion sentence.",
        },
        {
            id: "quiz-2",
            question: "Where should the topic sentence go?",
            options: [
                { value: "a", label: "At the end" },
                { value: "b", label: "In the middle" },
                { value: "c", label: "At the beginning" },
            ],
            correctAnswer: "c",
            explanation: "The topic sentence is the FIRST sentence of a paragraph.",
        },
        {
            id: "quiz-3",
            question: "Which is a good topic sentence?",
            options: [
                { value: "a", label: "I like things." },
                { value: "b", label: "Exercise is important for good health." },
                { value: "c", label: "Yesterday I walked for 32 minutes." },
            ],
            correctAnswer: "b",
            explanation: "'Exercise is important for good health' is clear, complete, and not too general or specific.",
        },
        {
            id: "quiz-4",
            question: "What does 'unity' mean in a paragraph?",
            options: [
                { value: "a", label: "Using transition words" },
                { value: "b", label: "All sentences support the same main idea" },
                { value: "c", label: "Having a conclusion sentence" },
            ],
            correctAnswer: "b",
            explanation: "Unity means all sentences in the paragraph support the SAME main idea.",
        },
        {
            id: "quiz-5",
            question: "How many sentences should a paragraph have?",
            options: [
                { value: "a", label: "1-2 sentences" },
                { value: "b", label: "At least 5-7 sentences" },
                { value: "c", label: "As many as possible" },
            ],
            correctAnswer: "b",
            explanation: "A paragraph needs at least 5-7 sentences: topic + supporting details + conclusion.",
        },
        {
            id: "quiz-6",
            question: "What do transition words do?",
            options: [
                { value: "a", label: "Make sentences longer" },
                { value: "b", label: "Connect ideas and improve flow" },
                { value: "c", label: "Replace the topic sentence" },
            ],
            correctAnswer: "b",
            explanation: "Transition words (First, Also, Therefore) connect ideas and help the paragraph flow smoothly.",
        },
    ],
};
