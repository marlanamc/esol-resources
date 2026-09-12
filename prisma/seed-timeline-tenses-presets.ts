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
    maxDifficulty?: 1 | 2 | 3;
    singleVerbOnly?: boolean;
    /** Questions per round. Defaults to 5 in the game; set this only to differ. */
    roundSize?: number;
    /** "map" for presets that appear in the Course Map; getVisibleMap only
     *  surfaces an item's activityId when the activity is contentKind=map. */
    contentKind?: "practice" | "map";
}> = [
    // ── Week 1 placement check: one tense family at a time ───────────────────
    // Three short rounds in Week 1 read where a class actually is, instead of
    // opening on a mixed simple + continuous set and learning nothing from a bad
    // score. Rounds are 5 questions by default, so none of these set a size.
    {
        // Week 1 fallback: easiest questions only, one verb per sentence, for
        // anyone the check shows is not ready for a full round.
        id: "timeline-tenses-week1-easy",
        title: "Timeline Tenses: Easy Start",
        description: "A gentle first look at the timeline — one short sentence at a time, present and past simple only.",
        tenseCategories: ["simple"],
        maxDifficulty: 1,
        singleVerbOnly: true,
        contentKind: "map",
    },
    {
        // Check 1: simple tenses on their own, no difficulty cap.
        id: "timeline-tenses-simple",
        title: "Timeline Tenses: Simple Only",
        description: "Simple tenses on their own — present, past, and future simple. Nothing else mixed in.",
        tenseCategories: ["simple"],
        contentKind: "map",
    },
    {
        // Check 2: continuous on its own, nothing mixed in.
        id: "timeline-tenses-continuous",
        title: "Timeline Tenses: Continuous Only",
        description: "Continuous tenses on their own — present, past, and future continuous. Still no simple tenses mixed in.",
        tenseCategories: ["continuous"],
        contentKind: "map",
    },
    {
        // Check 3: the two families together — the one that sorts the class.
        id: "timeline-tenses-simple-continuous",
        title: "Timeline Tenses: Simple + Continuous",
        description: "Now mix the two — choose between simple and continuous and show the difference on the timeline.",
        tenseCategories: ["simple", "continuous"],
        contentKind: "map",
    },

    // ── Level 3 tense-focused presets ────────────────────────────────────────
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
        contentKind: "map",
    },
    {
        id: "timeline-tenses-perfect-pair",
        title: "Timeline Tenses: Perfect & Perfect Continuous",
        description: "Practice perfect and perfect continuous tenses together — see the contrast on the timeline.",
        tenseCategories: ["perfect", "perfect-continuous"],
        contentKind: "map",
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
        contentKind: "map",
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
    const teacher = await prisma.user.findFirst({ where: { role: { in: ["admin", "teacher"] } } });
    if (!teacher) {
        console.error("No teacher found. Run the main seed first.");
        return;
    }

    for (const preset of PRESETS) {
        const content = JSON.stringify({
            type: "timeline-tenses",
            tenseCategories: preset.tenseCategories,
            ...(preset.practiceMode ? { practiceMode: preset.practiceMode } : {}),
            ...(preset.maxDifficulty ? { maxDifficulty: preset.maxDifficulty } : {}),
            ...(preset.singleVerbOnly ? { singleVerbOnly: true } : {}),
            ...(preset.roundSize ? { roundSize: preset.roundSize } : {}),
        });

        await prisma.activity.upsert({
            where: { id: preset.id },
            update: {
                title: preset.title,
                description: preset.description,
                content,
                isReleased: true,
                deletedAt: null,
                ...(preset.contentKind ? { contentKind: preset.contentKind } : {}),
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
                ...(preset.contentKind ? { contentKind: preset.contentKind } : {}),
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
