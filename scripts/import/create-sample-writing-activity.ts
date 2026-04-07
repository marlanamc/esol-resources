import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const content = {
        type: "writing",
        timerSeconds: 300, // 5 minutes
        showWordCount: true,
        prompts: [
            {
                text: "Describe a time when you had to solve a problem at work or at home. What was the problem, what did you do, and what happened?",
                suggestions: {
                    starters: [
                        "One time at work, I had to…",
                        "I remember when…",
                        "The problem was…",
                        "First, I decided to…",
                        "In the end,…",
                    ],
                    vocab: [
                        "problem",
                        "solution",
                        "decide",
                        "responsible",
                        "communicate",
                        "step by step",
                        "figure out",
                        "work out",
                    ],
                },
            },
            {
                text: "Think about a skill you learned outside of school — maybe cooking, driving, or using a new tool. How did you learn it, and why was it important to you?",
                suggestions: {
                    starters: [
                        "I learned how to…",
                        "Someone taught me…",
                        "It was important because…",
                        "At first it was hard, but…",
                        "Now I can…",
                    ],
                    vocab: [
                        "practice",
                        "patient",
                        "improve",
                        "confident",
                        "mistakes",
                        "little by little",
                        "pick up",
                        "get better at",
                    ],
                },
            },
        ],
    };

    const existing = await prisma.activity.findFirst({
        where: { title: "Write About Your Experience" },
    });

    if (existing) {
        console.log("✅ Activity already exists:", existing.id);
        return;
    }

    const activity = await prisma.activity.create({
        data: {
            title: "Write About Your Experience",
            description: "Share a personal story. Use the sentence starters and vocabulary hints to help you.",
            type: "writing",
            category: "writing",
            level: "1",
            content: JSON.stringify(content),
        },
    });

    console.log("✅ Created writing activity:", activity.id);
    console.log("   Title:", activity.title);
    console.log("   Prompts:", content.prompts.length);
    console.log("   Timer:", content.timerSeconds / 60, "minutes");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
