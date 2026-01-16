import type { InteractiveGuideContent } from "@/types/activity";

export const articlesCommunityResourcesContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "intro",
            title: "Articles & References for Community Resources",
            icon: "🏘️",
            explanation: `
                <p>Articles (a/an/the) help listeners know whether you are naming something general, specific, or uncountable. When you talk about housing, jobs, or health services in East Boston, choosing the right article keeps your meaning sharp.</p>
                <p>Example: “I need <strong>a</strong> counselor” (any counselor) vs “I need <strong>the</strong> counselor” (a specific one who helped before).</p>
            `,
        },
        {
            id: "indefinite-versus-definite",
            stepNumber: 1,
            title: "Indefinite vs. Definite vs. Zero Articles",
            icon: "📌",
            explanation: `
                <h3>Indefinite (a/an)</h3>
                <p>Use when you mention something for the first time, or you mean any example of it.</p>
                <h3>Definite (the)</h3>
                <p>Use when both speaker and listener know the exact item.</p>
                <h3>Zero Article</h3>
                <p>No article is needed with plural nouns referring to a group in general or with some uncountable nouns.</p>
                <ul>
                    <li><strong>Examples:</strong> “I visited <strong>a</strong> community center.” “<strong>The</strong> center has free ESL classes.” “I love <strong>(no article)</strong> community events.”</li>
                </ul>
            `,
            exercises: [
                {
                    id: "articles-1",
                    title: "Select the Right Article",
                    instructions: "Choose a/an/the/zero to complete the sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "I saw ___ counselor at the clinic yesterday.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "the",
                        },
                        {
                            type: "radio",
                            label: "We need ___ translator for the housing meeting.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "an", label: "an" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "proper-and-abstract",
            stepNumber: 2,
            title: "Proper Names, Abstract Nouns, and Zero Article",
            icon: "🗺️",
            explanation: `
                <p>Use <strong>the</strong> with unique places (“the Orient Heights branch”) and with abstract nouns when the listener knows the topic (“the safety of my family”). Drop the article with general services or names of languages, meals, or transportation.</p>
                <p>Examples:</p>
                <ul>
                    <li>The East Boston Branch Library opens at 9 a.m.</li>
                    <li>We look for work at community centers and job fairs.</li>
                    <li>Health fairs often offer free check-ups.</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "If you can point to it or both people know which one, use 'the'. If you only know the kind of thing and it's not specific, use 'a/an' or nothing.",
            },
        },
        {
            id: "article-practice",
            stepNumber: 3,
            title: "Practice with East Boston Contexts",
            icon: "📖",
            explanation: `
                <p>Don't rush. Think about whether you have mentioned the item before or if everyone knows exactly which one you mean.</p>
                <p>Talk to your partner and ask: “Is it any clinic (a) or the clinic we visited last week?”</p>
            `,
            exercises: [
                {
                    id: "articles-2",
                    title: "Choose the Article",
                    instructions: "Fill in the blanks with a/an/the/(no article).",
                    items: [
                        {
                            type: "radio",
                            label: "___ bus to Maverick leaves every 20 minutes.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "the",
                        },
                        {
                            type: "radio",
                            label: "We joined ___ volunteer group after the class.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "an", label: "an" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I want ___ job that lets me work from home.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],
};
