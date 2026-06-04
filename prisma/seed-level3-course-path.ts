/**
 * Seeds the Level 3 course path sequence for all real classes.
 *
 * What this does:
 * 1. Releases any Level 3 activities that are currently unreleased.
 * 2. For each real class, finds existing assignments (or creates new ones)
 *    for each path activity, then stamps sequenceNumber + unitLabel.
 *
 * Safe to re-run: uses upsert/findFirst + update, no destructive deletes.
 *
 * Unit map follows the school-year-at-a-glance.md plan (Sept–June, 10 units).
 * Run seed-timeline-tenses-presets.ts first so all preset IDs exist.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Stable IDs for the E2E test class — skip it.
const SKIP_CLASS_IDS = new Set(["cmmfqiuuy00030emvbwlzww54"]);

const LEVEL3_PATH: Array<{
    activityId: string;
    unitLabel: string;
    title?: string;
}> = [
    // ── Unit 1: Getting to Know You (September) ──────────────────────────────
    // Grammar: verb forms overview + parts of speech
    // Pronunciation: -ed endings (intro)
    // Vocab: September | Verb Quizzes: 1–2 (be/have/do/make, come/find/buy)
    {
        activityId: "all-verb-tenses-overview",
        unitLabel: "Unit 1: Getting to Know You",
    },
    {
        activityId: "parts-of-speech-discovery-guided",
        unitLabel: "Unit 1: Getting to Know You",
    },
    {
        activityId: "timeline-tenses-simple",
        unitLabel: "Unit 1: Getting to Know You",
        title: "Timeline Tenses: Verb Forms Review",
    },
    {
        activityId: "vocab-sep-w1",
        unitLabel: "Unit 1: Getting to Know You",
        title: "Vocab: Digital Habits",
    },
    {
        activityId: "vocab-sep-w2",
        unitLabel: "Unit 1: Getting to Know You",
        title: "Vocab: Key Verbs",
    },
    {
        activityId: "vocab-sep-w3",
        unitLabel: "Unit 1: Getting to Know You",
        title: "Vocab: Action Words",
    },
    {
        activityId: "vocab-sep-w4",
        unitLabel: "Unit 1: Getting to Know You",
        title: "Vocab: Personal Journey Verbs",
    },
    {
        activityId: "cafe-catch-up-big-questions",
        unitLabel: "Unit 1: Getting to Know You",
    },
    {
        activityId: "cmlkjcabs00000ezpkp32c6lz", // -ed Sounds Game
        unitLabel: "Unit 1: Getting to Know You",
        title: "Pronunciation: -ed Endings",
    },
    {
        activityId: "verb-quiz-1", // Verb Quiz 1
        unitLabel: "Unit 1: Getting to Know You",
        title: "Verb Quiz 1",
    },
    {
        activityId: "verb-quiz-2", // Verb Quiz 2
        unitLabel: "Unit 1: Getting to Know You",
        title: "Verb Quiz 2",
    },

    // ── Unit 2: Daily Life in the Community (October) ────────────────────────
    // Grammar: information questions, imperatives, present perfect spiral
    // Pronunciation: B vs V
    // Vocab: October | Verb Quizzes: 3–4 (pay/hold/break, burst/freeze/call)
    {
        activityId: "information-questions",
        unitLabel: "Unit 2: Daily Life in the Community",
    },
    {
        activityId: "timeline-tenses-simple-continuous",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Timeline Tenses: Simple & Continuous Review",
    },
    {
        activityId: "vocab-oct-w1",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Vocab: Schedule Verbs",
    },
    {
        activityId: "vocab-oct-w2",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Vocab: Movement Verbs",
    },
    {
        activityId: "vocab-oct-w3",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Vocab: Protect Yourself Verbs",
    },
    {
        activityId: "vocab-oct-w4",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Vocab: Communication Verbs",
    },
    {
        activityId: "pron-b-v-listening",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Pronunciation: B vs V",
    },
    {
        activityId: "cafe-catch-up-boston-healthcare",
        unitLabel: "Unit 2: Daily Life in the Community",
    },
    {
        activityId: "verb-quiz-3",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Verb Quiz 3",
    },
    {
        activityId: "verb-quiz-4",
        unitLabel: "Unit 2: Daily Life in the Community",
        title: "Verb Quiz 4",
    },

    // ── Unit 3: Community Participation (November) ───────────────────────────
    // Grammar: gerunds after prepositions, zero/first conditionals
    // Pronunciation: Short i vs Long e
    // Vocab: November | Verb Quizzes: 5–6 (sleep/wake/eat, spend/cost/give)
    {
        activityId: "gerunds-infinitives",
        unitLabel: "Unit 3: Community Participation",
    },
    {
        activityId: "conditionals-zero-first",
        unitLabel: "Unit 3: Community Participation",
    },
    {
        activityId: "timeline-tenses-simple-continuous",
        unitLabel: "Unit 3: Community Participation",
        title: "Timeline Tenses: Continuous Spiral",
    },
    {
        activityId: "vocab-nov-w1",
        unitLabel: "Unit 3: Community Participation",
        title: "Vocab: Action Verbs",
    },
    {
        activityId: "vocab-nov-w2",
        unitLabel: "Unit 3: Community Participation",
        title: "Vocab: Discussion Verbs",
    },
    {
        activityId: "vocab-nov-w3",
        unitLabel: "Unit 3: Community Participation",
        title: "Vocab: Civic Verbs",
    },
    {
        activityId: "vocab-nov-w4",
        unitLabel: "Unit 3: Community Participation",
        title: "Vocab: Problem-Solving Verbs",
    },
    {
        activityId: "pron-short-i-long-e-listening",
        unitLabel: "Unit 3: Community Participation",
        title: "Pronunciation: Short i vs Long e",
    },
    {
        activityId: "verb-quiz-5",
        unitLabel: "Unit 3: Community Participation",
        title: "Verb Quiz 5",
    },
    {
        activityId: "verb-quiz-6",
        unitLabel: "Unit 3: Community Participation",
        title: "Verb Quiz 6",
    },

    // ── Unit 4: Consumer Smarts (December — short month) ─────────────────────
    // Grammar: comparatives, superlatives, quantifiers
    // Pronunciation: B vs V + Short i/Long e spiral
    // Vocab: December | Verb Quizzes: 7–8 (write/submit/work, speak/tell/say)
    {
        activityId: "superlatives-quantifiers",
        unitLabel: "Unit 4: Consumer Smarts",
    },
    {
        activityId: "numbers-through-trillions-guided",
        unitLabel: "Unit 4: Consumer Smarts",
        title: "Numbers: Thousands to Trillions",
    },
    {
        activityId: "vocab-dec-w1",
        unitLabel: "Unit 4: Consumer Smarts",
        title: "Vocab: Money Verbs",
    },
    {
        activityId: "vocab-dec-w2",
        unitLabel: "Unit 4: Consumer Smarts",
        title: "Vocab: Financial Action Verbs",
    },
    {
        activityId: "pron-b-v-listening",
        unitLabel: "Unit 4: Consumer Smarts",
        title: "Pronunciation Spiral: B vs V",
    },
    {
        activityId: "verb-quiz-7",
        unitLabel: "Unit 4: Consumer Smarts",
        title: "Verb Quiz 7",
    },
    {
        activityId: "verb-quiz-8",
        unitLabel: "Unit 4: Consumer Smarts",
        title: "Verb Quiz 8",
    },

    // ── Unit 5: Housing (January) ─────────────────────────────────────────────
    // Grammar: parts of speech, information questions, past simple vs past continuous
    // Pronunciation: R vs L
    // Vocab: January
    {
        activityId: "parts-of-speech",
        unitLabel: "Unit 5: Housing",
    },
    {
        activityId: "information-questions",
        unitLabel: "Unit 5: Housing",
        title: "Information Questions: Tenant & Landlord",
    },
    {
        activityId: "timeline-tenses-simple-continuous",
        unitLabel: "Unit 5: Housing",
        title: "Timeline Tenses: Past Simple vs Past Continuous",
    },
    {
        activityId: "vocab-jan-w1",
        unitLabel: "Unit 5: Housing",
        title: "Vocab: Renter Verbs",
    },
    {
        activityId: "vocab-jan-w2",
        unitLabel: "Unit 5: Housing",
        title: "Vocab: Decision Verbs",
    },
    {
        activityId: "vocab-jan-w3",
        unitLabel: "Unit 5: Housing",
        title: "Vocab: Maintenance Verbs",
    },
    {
        activityId: "vocab-jan-w4",
        unitLabel: "Unit 5: Housing",
        title: "Vocab: Resolution Verbs",
    },
    {
        activityId: "pron-r-l-listening",
        unitLabel: "Unit 5: Housing",
        title: "Pronunciation: R vs L",
    },
    {
        activityId: "verb-quiz-9",
        unitLabel: "Unit 5: Housing",
        title: "Verb Quiz 9",
    },
    {
        activityId: "verb-quiz-10",
        unitLabel: "Unit 5: Housing",
        title: "Verb Quiz 10",
    },

    // ── Unit 6: Workforce Preparation (February) ─────────────────────────────
    // Grammar: zero/first conditionals, modals (obligation/permission), continuous tenses
    // Pronunciation: V vs W
    // Vocab: February | Verb Quizzes: 11–12 (chat/discuss/ask, comply/get/know)
    {
        activityId: "conditionals-zero-first",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Conditionals: Work Scenarios",
    },
    {
        activityId: "modals-obligation-permission",
        unitLabel: "Unit 6: Workforce Preparation",
    },
    {
        activityId: "timeline-tenses-continuous",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Timeline Tenses: Continuous Focus",
    },
    {
        activityId: "vocab-feb-3-5",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Vocab: Jobs Foundations",
    },
    {
        activityId: "vocab-feb-10-12",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Vocab: Workplace Phrasal Verbs",
    },
    {
        activityId: "vocab-feb-24-26",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Vocab: Experience & Timelines",
    },
    {
        activityId: "pron-v-w-listening",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Pronunciation: V vs W",
    },
    {
        activityId: "verb-quiz-11",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Verb Quiz 11",
    },
    {
        activityId: "verb-quiz-12",
        unitLabel: "Unit 6: Workforce Preparation",
        title: "Verb Quiz 12",
    },

    // ── Unit 7: Career Awareness (March) — Present Perfect Deep Dive ──────────
    // Grammar: present perfect + PPC taught as a pair (career story framing)
    // Timeline: PP practice → PP+PPC combined → Fix-It challenge
    // Grammar also: gerunds/infinitives in career context
    // Pronunciation: S vs Th
    // Vocab: March | Verb Quizzes: 13–14 (drive/ride/run, feel/hurt/prescribe)
    {
        activityId: "present-perfect-guide",
        unitLabel: "Unit 7: Career Awareness",
    },
    {
        activityId: "present-perfect-continuous-guide",
        unitLabel: "Unit 7: Career Awareness",
    },
    {
        activityId: "timeline-tenses-perfect",
        unitLabel: "Unit 7: Career Awareness",
        title: "Timeline Tenses: Present Perfect",
    },
    {
        activityId: "timeline-tenses-perfect-pair",
        unitLabel: "Unit 7: Career Awareness",
        title: "Timeline Tenses: Perfect & Perfect Continuous",
    },
    {
        activityId: "timeline-tenses-perfect-fix-it",
        unitLabel: "Unit 7: Career Awareness",
        title: "Timeline Tenses: Fix the Perfect (Challenge)",
    },
    {
        activityId: "gerunds-infinitives",
        unitLabel: "Unit 7: Career Awareness",
        title: "Gerunds & Infinitives: Career Language",
    },
    {
        activityId: "vocab-mar-3-5",
        unitLabel: "Unit 7: Career Awareness",
        title: "Vocab: Skills & Qualifications",
    },
    {
        activityId: "vocab-mar-10-12",
        unitLabel: "Unit 7: Career Awareness",
        title: "Vocab: Rules & Obligation",
    },
    {
        activityId: "vocab-mar-17-19",
        unitLabel: "Unit 7: Career Awareness",
        title: "Vocab: Communication & Feedback",
    },
    {
        activityId: "vocab-mar-24-26",
        unitLabel: "Unit 7: Career Awareness",
        title: "Vocab: Rights, Rules & Advocacy",
    },
    {
        activityId: "vocab-mar-31-apr-2",
        unitLabel: "Unit 7: Career Awareness",
        title: "Vocab: Small Talk & Social Conversation",
    },
    {
        activityId: "pron-s-th-listening",
        unitLabel: "Unit 7: Career Awareness",
        title: "Pronunciation: S vs Th",
    },
    {
        activityId: "verb-quiz-13",
        unitLabel: "Unit 7: Career Awareness",
        title: "Verb Quiz 13",
    },
    {
        activityId: "verb-quiz-14",
        unitLabel: "Unit 7: Career Awareness",
        title: "Verb Quiz 14",
    },

    // ── Unit 8: Health (April) ────────────────────────────────────────────────
    // Grammar: advice modals, passive voice (pharmacy/notices), reported speech
    // Timeline: Mixed tenses in-context challenge
    // Pronunciation: Sh vs Ch
    // Vocab: April | Verb Quizzes: 15–16 (take/need/store, bring/put/begin)
    {
        activityId: "modals-health-advice-caution-consent",
        unitLabel: "Unit 8: Health",
    },
    {
        activityId: "passive-voice",
        unitLabel: "Unit 8: Health",
    },
    {
        activityId: "reported-speech",
        unitLabel: "Unit 8: Health",
    },
    {
        activityId: "timeline-tenses-mixed-in-context",
        unitLabel: "Unit 8: Health",
        title: "Timeline Tenses: Tenses in Context (Challenge)",
    },
    {
        activityId: "vocab-apr-7-9",
        unitLabel: "Unit 8: Health",
        title: "Vocab: Symptoms & Expectations",
    },
    {
        activityId: "vocab-apr-14-16",
        unitLabel: "Unit 8: Health",
        title: "Vocab: Symptoms & Care",
    },
    {
        activityId: "vocab-apr-28-30",
        unitLabel: "Unit 8: Health",
        title: "Vocab: Health Advice & Habits",
    },
    {
        activityId: "pron-sh-ch-listening",
        unitLabel: "Unit 8: Health",
        title: "Pronunciation: Sh vs Ch",
    },
    {
        activityId: "verb-quiz-15",
        unitLabel: "Unit 8: Health",
        title: "Verb Quiz 15",
    },
    {
        activityId: "verb-quiz-16",
        unitLabel: "Unit 8: Health",
        title: "Verb Quiz 16",
    },

    // ── Unit 9: Holistic Wellness (May) ──────────────────────────────────────
    // Grammar: used to / would, future conditional
    // Timeline: Used-To preset + Spot the Difference challenge (all tenses)
    // Pronunciation: P vs B
    // Vocab: May | Verb Quizzes: 17–18 (catch/fall/forgive, mix/heat/try)
    {
        activityId: "used-to-would-rather",
        unitLabel: "Unit 9: Holistic Wellness",
    },
    {
        activityId: "future-simple-guide",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Future & Conditional: Wellness Goals",
    },
    {
        activityId: "timeline-tenses-used-to",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Timeline Tenses: Used To & Would",
    },
    {
        activityId: "timeline-tenses-all-spot-diff",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Timeline Tenses: Spot the Difference (Challenge)",
    },
    {
        activityId: "vocab-may-5-7",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Vocab: Your Body & Wellness",
    },
    {
        activityId: "vocab-may-12-14",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Vocab: Daily Care & Nutrition",
    },
    {
        activityId: "vocab-may-19-21",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Vocab: Life Skills & Habits",
    },
    {
        activityId: "vocab-may-26-28",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Vocab: Holistic Health Review",
    },
    {
        activityId: "pron-p-b-listening",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Pronunciation: P vs B",
    },
    {
        activityId: "verb-quiz-17",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Verb Quiz 17",
    },
    {
        activityId: "verb-quiz-18",
        unitLabel: "Unit 9: Holistic Wellness",
        title: "Verb Quiz 18",
    },

    // ── Unit 10: Future Academic Goals (June — short month) ──────────────────
    // Light spiral review — no new grammar
    // Timeline: Full mix challenge (all tenses)
    // Pronunciation: Mixed review
    // Vocab: June | Verb Quizzes: 19–20 (feed/bite/burn, teach/grow/deal)
    {
        activityId: "timeline-tenses-all-challenge",
        unitLabel: "Unit 10: Future Academic Goals",
        title: "Timeline Tenses: Full Year Challenge",
    },
    {
        activityId: "vocab-jun-2-4",
        unitLabel: "Unit 10: Future Academic Goals",
        title: "Vocab: Wrap-Up & Next Steps",
    },
    {
        activityId: "pron-mixed-review",
        unitLabel: "Unit 10: Future Academic Goals",
        title: "Pronunciation: Mixed Review",
    },
    {
        activityId: "verb-quiz-19",
        unitLabel: "Unit 10: Future Academic Goals",
        title: "Verb Quiz 19",
    },
    {
        activityId: "verb-quiz-20",
        unitLabel: "Unit 10: Future Academic Goals",
        title: "Verb Quiz 20",
    },
];

async function main() {
    // Release any Level 3 activities that may still be unreleased.
    const toRelease = [
        "all-verb-tenses-overview",
        "parts-of-speech-discovery-guided",
        "parts-of-speech",
        "information-questions",
        "gerunds-infinitives",
        "conditionals-zero-first",
        "superlatives-quantifiers",
        "numbers-through-trillions-guided",
        "modals-obligation-permission",
        "present-perfect-guide",
        "present-perfect-continuous-guide",
        "passive-voice",
        "reported-speech",
        "used-to-would-rather",
        "future-simple-guide",
        "modals-health-advice-caution-consent",
        "cafe-catch-up-big-questions",
        "cafe-catch-up-boston-healthcare",
        // Cycle 1 weekly vocab (Sep–Jan)
        "vocab-sep-w1", "vocab-sep-w2", "vocab-sep-w3", "vocab-sep-w4",
        "vocab-oct-w1", "vocab-oct-w2", "vocab-oct-w3", "vocab-oct-w4",
        "vocab-nov-w1", "vocab-nov-w2", "vocab-nov-w3", "vocab-nov-w4",
        "vocab-dec-w1", "vocab-dec-w2",
        "vocab-jan-w1", "vocab-jan-w2", "vocab-jan-w3", "vocab-jan-w4",
        // Cycle 2 weekly vocab (Feb–Jun)
        "vocab-feb-3-5", "vocab-feb-10-12", "vocab-feb-24-26",
        "vocab-mar-3-5", "vocab-mar-10-12", "vocab-mar-17-19", "vocab-mar-24-26", "vocab-mar-31-apr-2",
        "vocab-apr-7-9", "vocab-apr-14-16", "vocab-apr-28-30",
        "vocab-may-5-7", "vocab-may-12-14", "vocab-may-19-21", "vocab-may-26-28",
        "vocab-jun-2-4",
        "cmlkjcabs00000ezpkp32c6lz",
        "pron-b-v-listening",
        "pron-r-l-listening",
        "pron-v-w-listening",
        "pron-s-th-listening",
        "pron-sh-ch-listening",
        "pron-short-i-long-e-listening",
        "pron-p-b-listening",
        "pron-mixed-review",
        "grammar-hospital-helper-repair-guided",
        // Timeline tenses presets (created by seed-timeline-tenses-presets.ts)
        "timeline-tenses-simple",
        "timeline-tenses-simple-continuous",
        "timeline-tenses-continuous",
        "timeline-tenses-perfect",
        "timeline-tenses-perfect-pair",
        "timeline-tenses-perfect-fix-it",
        "timeline-tenses-used-to",
        "timeline-tenses-all-challenge",
        "timeline-tenses-mixed-in-context",
        "timeline-tenses-all-spot-diff",
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

    // Strip due_date and week from all verb quiz content — they're now path-sequenced, not date-gated.
    const verbQuizIds = [
        "verb-quiz-1", "verb-quiz-2", "verb-quiz-3", "verb-quiz-4", "verb-quiz-5",
        "verb-quiz-6", "verb-quiz-7", "verb-quiz-8", "verb-quiz-9", "verb-quiz-10",
        "verb-quiz-11", "verb-quiz-12", "verb-quiz-13", "verb-quiz-14", "verb-quiz-15",
        "verb-quiz-16", "verb-quiz-17", "verb-quiz-18", "verb-quiz-19", "verb-quiz-20"
    ];
    for (const id of verbQuizIds) {
        const activity = await prisma.activity.findUnique({ where: { id }, select: { id: true, content: true } });
        if (!activity?.content) continue;
        try {
            const parsed = JSON.parse(activity.content);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { due_date, week, ...rest } = parsed;
            if (due_date !== undefined || week !== undefined) {
                await prisma.activity.update({ where: { id }, data: { content: JSON.stringify(rest) } });
                console.log(`Stripped due_date/week from: ${id}`);
            }
        } catch {
            // ignore parse errors
        }
    }

    // Clear any old Level 1 unit labels that would collide with the Level 3 path.
    const oldLevel1Labels = [
        "Unit 1: Simple Tense Review",
        "Unit 2: Past Simple",
        "Unit 3: Continuous Tenses",
    ];
    const cleared = await prisma.assignment.updateMany({
        where: { unitLabel: { in: oldLevel1Labels } },
        data: { sequenceNumber: null, unitLabel: null },
    });
    if (cleared.count > 0) {
        console.log(`Cleared ${cleared.count} old Level 1 path assignments`);
    }

    // Get all real classes.
    const classes = await prisma.class.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

    const realClasses = classes.filter((c) => !SKIP_CLASS_IDS.has(c.id));
    console.log(`\nSeeding Level 3 path for ${realClasses.length} class(es):`);
    realClasses.forEach((c) => console.log(`  • ${c.name} (${c.id})`));

    for (const classItem of realClasses) {
        console.log(`\n── ${classItem.name} ──`);

        // Activities that appear multiple times need separate assignment rows so
        // each has its own sequenceNumber. Track which rows we've already claimed.
        const usedAssignmentIds = new Set<string>();

        for (let i = 0; i < LEVEL3_PATH.length; i++) {
            const item = LEVEL3_PATH[i];
            const sequenceNumber = i + 1;

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
                console.log(`  [${sequenceNumber}] reuse  ${item.activityId} → ${existing.id}`);
            } else {
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
                console.log(`  [${sequenceNumber}] create ${item.activityId} → ${created.id}`);
            }

            usedAssignmentIds.add(assignmentId);

            await prisma.assignment.update({
                where: { id: assignmentId },
                data: {
                    sequenceNumber,
                    unitLabel: item.unitLabel,
                    ...(item.title ? { title: item.title } : {}),
                },
            });
        }

        console.log(`  ✓ ${LEVEL3_PATH.length} path items set`);
    }

    console.log("\nDone. Level 3 course path seeded.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
