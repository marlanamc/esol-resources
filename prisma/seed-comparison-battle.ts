import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const teacher = await prisma.user.findFirst({ where: { role: "teacher" } });
    if (!teacher) {
        console.error("Teacher user not found. Please run the main seed first.");
        return;
    }

    const activity = await prisma.activity.upsert({
        where: { id: "comparison-battle" },
        update: {
            title: "Comparison Battle",
            description:
                "Practice comparative and superlative adjectives through quick lessons, choice questions, sentence repairs, a speed round, and fill-in-the-blank prompts.",
            type: "game",
            category: "games",
            ui: "comparison-battle",
            level: "beginner",
            content: JSON.stringify({ type: "comparison-battle" }),
            isReleased: true,
            deletedAt: null,
        },
        create: {
            id: "comparison-battle",
            title: "Comparison Battle",
            description:
                "Practice comparative and superlative adjectives through quick lessons, choice questions, sentence repairs, a speed round, and fill-in-the-blank prompts.",
            type: "game",
            category: "games",
            ui: "comparison-battle",
            level: "beginner",
            content: JSON.stringify({ type: "comparison-battle" }),
            createdBy: teacher.id,
            isReleased: true,
        },
    });

    console.log(`Comparison Battle activity ${activity.id} seeded/updated.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
