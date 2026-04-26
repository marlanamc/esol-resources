import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const teacher = await prisma.user.findFirst({ where: { role: "teacher" } });
    if (!teacher) {
        console.error("Teacher user not found. Please run main seed first.");
        return;
    }

    const activity = await prisma.activity.upsert({
        where: { id: "emotion-spin-wheel" },
        update: {
            title: "How Are You Feeling?",
            description:
                "Spin the wheel to land on an emotion word. Practice definitions, example sentences, and discussion prompts for 18 common emotions.",
            type: "game",
            category: "games",
            ui: "emotion-spin-wheel",
            level: "beginner",
            content: JSON.stringify({ type: "emotion-spin-wheel" }),
            isReleased: true,
        },
        create: {
            id: "emotion-spin-wheel",
            title: "How Are You Feeling?",
            description:
                "Spin the wheel to land on an emotion word. Practice definitions, example sentences, and discussion prompts for 18 common emotions.",
            type: "game",
            category: "games",
            ui: "emotion-spin-wheel",
            level: "beginner",
            content: JSON.stringify({ type: "emotion-spin-wheel" }),
            createdBy: teacher.id,
            isReleased: true,
        },
    });

    console.log(`Emotion Spin Wheel activity ${activity.id} seeded/updated.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
