/**
 * Creates preset Timeline Tenses activity rows for the course path.
 * Each row stores tenseCategories (and optionally practiceMode) in content,
 * which auto-starts the game focused on those tenses/mode with no setup screen.
 *
 * Safe to re-run (upsert).
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRESETS: Array<{
    id: string;
    title: string;
    description: string;
    tenseCategories: string[];
    practiceMode?: string;
}> = [
    // ── Existing Level 1 presets ─────────────────────────────────────────────
    {
        id: "timeline-tenses-simple",
        title: "Timeline Tenses: Simple Tenses",
        description: "Practice present simple and past simple on the timeline — no setup needed.",
        tenseCategories: ["simple"],
    },
    {
        id: "timeline-tenses-simple-continuous",
        title: "Timeline Tenses: Simple & Continuous",
        description: "Practice all simple and continuous tenses together on the timeline.",
        tenseCategories: ["simple", "continuous"],
    },

    // ── Level 3 tense-focused presets ────────────────────────────────────────
    {
        id: "timeline-tenses-continuous",
        title: "Timeline Tenses: Continuous Tenses",
        description: "Practice all continuous tenses on the timeline — present, past, and future continuous.",
        tenseCategories: ["continuous"],
    },
    {
        id: "timeline-tenses-perfect",
        title: "Timeline Tenses: Present Perfect",
        description: "Practice present perfect and past perfect on the timeline.",
        tenseCategories: ["perfect"],
    },
    {
        id: "timeline-tenses-perfect-continuous",
        title: "Timeline Tenses: Perfect Continuous",
        description: "Practice present perfect continuous and past perfect continuous on the timeline.",
        tenseCategories: ["perfect-continuous"],
    },
    {
        id: "timeline-tenses-perfect-pair",
        title: "Timeline Tenses: Perfect & Perfect Continuous",
        description: "Practice perfect and perfect continuous tenses together — see the contrast on the timeline.",
        tenseCategories: ["perfect", "perfect-continuous"],
    },
    {
        id: "timeline-tenses-used-to",
        title: "Timeline Tenses: Used To & Would",
        description: "Practice used to and would for past habits on the timeline.",
        tenseCategories: ["used-to"],
    },
    {
        id: "timeline-tenses-all-challenge",
        title: "Timeline Tenses: Full Mix",
        description: "All tenses together — a full mixed challenge across the whole timeline.",
        tenseCategories: [],
    },

    // ── Level 3 challenge mode presets ───────────────────────────────────────
    {
        id: "timeline-tenses-perfect-fix-it",
        title: "Timeline Tenses: Fix the Perfect",
        description: "Find and fix present perfect and past perfect errors — Fix-It challenge mode.",
        tenseCategories: ["perfect"],
        practiceMode: "fix-it",
    },
    {
        id: "timeline-tenses-perfect-transformer",
        title: "Timeline Tenses: Transform to Perfect",
        description: "Rewrite sentences using perfect tenses — Transformer challenge mode.",
        tenseCategories: ["perfect"],
        practiceMode: "transformer",
    },
    {
        id: "timeline-tenses-mixed-in-context",
        title: "Timeline Tenses: Tenses in Context",
        description: "Choose the right tense from context clues — In-Context challenge mode.",
        tenseCategories: ["mixed"],
        practiceMode: "in-context",
    },
    {
        id: "timeline-tenses-all-spot-diff",
        title: "Timeline Tenses: Spot the Difference",
        description: "Compare two timelines and choose the one that matches the sentence — all tenses.",
        tenseCategories: [],
        practiceMode: "spot-the-difference",
    },
];

async function main() {
    const teacher = await prisma.user.findFirst({ where: { role: "teacher" } });
    if (!teacher) {
        console.error("No teacher found. Run the main seed first.");
        return;
    }

    for (const preset of PRESETS) {
        const content = JSON.stringify({
            type: "timeline-tenses",
            tenseCategories: preset.tenseCategories,
            ...(preset.practiceMode ? { practiceMode: preset.practiceMode } : {}),
        });

        await prisma.activity.upsert({
            where: { id: preset.id },
            update: {
                title: preset.title,
                description: preset.description,
                content,
                isReleased: true,
                deletedAt: null,
            },
            create: {
                id: preset.id,
                title: preset.title,
                description: preset.description,
                type: "game",
                category: "games",
                ui: "timeline-tenses",
                level: "beginner",
                content,
                createdBy: teacher.id,
                isReleased: true,
            },
        });

        console.log(`Upserted: ${preset.id}${preset.practiceMode ? ` (${preset.practiceMode})` : ""}`);
    }

    console.log("Done.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
