/**
 * Seeds the Level 1 course path sequence for all real classes.
 *
 * What this does:
 * 1. Releases the Level 1 activities that are currently unreleased.
 * 2. For each real class, finds existing assignments (or creates new ones)
 *    for each path activity, then stamps sequenceNumber + unitLabel.
 *
 * Safe to re-run: uses upsert/findFirst + update, no destructive deletes.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Stable IDs for the E2E test class — skip it.
const SKIP_CLASS_IDS = new Set(["cmmfqiuuy00030emvbwlzww54"]);

// Level 1 course path definition.
// Each entry: { activityId, unitLabel, title (optional display override) }
const LEVEL1_PATH: Array<{
    activityId: string;
    unitLabel: string;
    title?: string;
}> = [
    // ── Unit 1: Simple Tense Review ─────────────────────────────────────────
    {
        activityId: "present-simple-guide",
        unitLabel: "Unit 1: Simple Tense Review",
    },
    {
        activityId: "timeline-tenses-simple", // preset: simple only, auto-starts
        unitLabel: "Unit 1: Simple Tense Review",
    },
    {
        activityId: "parts-of-speech-discovery-guided",
        unitLabel: "Unit 1: Simple Tense Review",
    },
    {
        activityId: "vocab-sep-w1",
        unitLabel: "Unit 1: Simple Tense Review",
        title: "Vocab: Digital Habits",
    },
    {
        activityId: "vocab-sep-w2",
        unitLabel: "Unit 1: Simple Tense Review",
        title: "Vocab: Key Verbs",
    },
    {
        activityId: "vocab-sep-w3",
        unitLabel: "Unit 1: Simple Tense Review",
        title: "Vocab: Action Words",
    },
    {
        activityId: "vocab-sep-w4",
        unitLabel: "Unit 1: Simple Tense Review",
        title: "Vocab: Personal Journey Verbs",
    },
    {
        activityId: "cafe-catch-up-big-questions",
        unitLabel: "Unit 1: Simple Tense Review",
    },

    // ── Unit 2: Past Simple ─────────────────────────────────────────────────
    {
        activityId: "past-simple-guide",
        unitLabel: "Unit 2: Past Simple",
    },
    {
        activityId: "timeline-tenses-simple", // same preset — simple tenses, separate completion
        unitLabel: "Unit 2: Past Simple",
        title: "Timeline Tenses: Past Simple Focus",
    },
    {
        activityId: "parts-of-speech-discovery-guided",
        unitLabel: "Unit 2: Past Simple",
        title: "Parts of Speech: Adjectives",
    },
    {
        activityId: "vocab-oct-w1",
        unitLabel: "Unit 2: Past Simple",
        title: "Vocab: Schedule Verbs",
    },
    {
        activityId: "vocab-oct-w2",
        unitLabel: "Unit 2: Past Simple",
        title: "Vocab: Movement Verbs",
    },
    {
        activityId: "vocab-oct-w3",
        unitLabel: "Unit 2: Past Simple",
        title: "Vocab: Protect Yourself Verbs",
    },
    {
        activityId: "vocab-oct-w4",
        unitLabel: "Unit 2: Past Simple",
        title: "Vocab: Communication Verbs",
    },

    // ── Unit 3: Continuous Tenses ────────────────────────────────────────────
    {
        activityId: "present-continuous-guide",
        unitLabel: "Unit 3: Continuous Tenses",
    },
    {
        activityId: "grammar-hospital-helper-repair-guided",
        unitLabel: "Unit 3: Continuous Tenses",
    },
    {
        activityId: "timeline-tenses-simple-continuous", // preset: simple + continuous, auto-starts
        unitLabel: "Unit 3: Continuous Tenses",
    },
    {
        activityId: "vocab-nov-w1",
        unitLabel: "Unit 3: Continuous Tenses",
        title: "Vocab: Action Verbs",
    },
    {
        activityId: "vocab-nov-w2",
        unitLabel: "Unit 3: Continuous Tenses",
        title: "Vocab: Discussion Verbs",
    },
    {
        activityId: "vocab-nov-w3",
        unitLabel: "Unit 3: Continuous Tenses",
        title: "Vocab: Civic Verbs",
    },
    {
        activityId: "vocab-nov-w4",
        unitLabel: "Unit 3: Continuous Tenses",
        title: "Vocab: Problem-Solving Verbs",
    },
    {
        activityId: "cmnia5vkr00000emt02nctzhy", // Write About Your Experience
        unitLabel: "Unit 3: Continuous Tenses",
    },
    {
        activityId: "cafe-catch-up-boston-healthcare",
        unitLabel: "Unit 3: Continuous Tenses",
    },
];

async function main() {
    const toRelease = [
        "parts-of-speech-discovery-guided",
        // Cycle 1 weekly vocab (Sep–Nov, covered in Level 1)
        "vocab-sep-w1", "vocab-sep-w2", "vocab-sep-w3", "vocab-sep-w4",
        "vocab-oct-w1", "vocab-oct-w2", "vocab-oct-w3", "vocab-oct-w4",
        "vocab-nov-w1", "vocab-nov-w2", "vocab-nov-w3", "vocab-nov-w4",
        "cafe-catch-up-big-questions",
        "cafe-catch-up-boston-healthcare",
        "cmnia5vkr00000emt02nctzhy",
        "grammar-hospital-helper-repair-guided",
    ];

    for (const id of toRelease) {
        const updated = await prisma.activity.updateMany({
            where: { id, isReleased: false },
            data: { isReleased: true },
        });
        if (updated.count > 0) {
            console.log(`Released activity: ${id}`);
        }
    }

    // 2. Get all real classes.
    const classes = await prisma.class.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

    const realClasses = classes.filter((c) => !SKIP_CLASS_IDS.has(c.id));
    console.log(`\nSeeding path for ${realClasses.length} class(es):`);
    realClasses.forEach((c) => console.log(`  • ${c.name} (${c.id})`));

    for (const classItem of realClasses) {
        console.log(`\n── ${classItem.name} ──`);

        // Activities that appear multiple times in the path (Timeline Tenses, Parts of Speech)
        // need separate assignment rows for each occurrence so each can have its own
        // sequenceNumber. We track which activityIds we've already assigned in this class
        // to decide when to create a new row vs. reuse.
        const usedAssignmentIds = new Set<string>();

        for (let i = 0; i < LEVEL1_PATH.length; i++) {
            const item = LEVEL1_PATH[i];
            const sequenceNumber = i + 1;

            // Find an existing assignment for this activity in this class that hasn't
            // been claimed yet by an earlier step.
            const existing = await prisma.assignment.findFirst({
                where: {
                    classId: classItem.id,
                    activityId: item.activityId,
                    id: { notIn: [...usedAssignmentIds] },
                },
                orderBy: { createdAt: "asc" },
            });

            let assignmentId: string;

            if (existing) {
                assignmentId = existing.id;
                console.log(
                    `  [${sequenceNumber}] reuse  ${item.activityId} → ${existing.id}`
                );
            } else {
                // Create a new assignment row.
                const created = await prisma.assignment.create({
                    data: {
                        classId: classItem.id,
                        activityId: item.activityId,
                        title: item.title ?? null,
                        sequenceNumber,
                        unitLabel: item.unitLabel,
                        isFeatured: false,
                        isRequired: false,
                    },
                });
                assignmentId = created.id;
                console.log(
                    `  [${sequenceNumber}] create ${item.activityId} → ${created.id}`
                );
            }

            usedAssignmentIds.add(assignmentId);

            // Stamp sequenceNumber + unitLabel (+ title if provided) on this assignment.
            await prisma.assignment.update({
                where: { id: assignmentId },
                data: {
                    sequenceNumber,
                    unitLabel: item.unitLabel,
                    ...(item.title ? { title: item.title } : {}),
                },
            });
        }

        console.log(`  ✓ ${LEVEL1_PATH.length} path items set`);
    }

    console.log("\nDone. Level 1 course path seeded.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
