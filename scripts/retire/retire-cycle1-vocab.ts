import { PrismaClient } from "@prisma/client";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

const APPLY = process.argv.includes("--apply");

// Cycle 1 vocab activity IDs to hide from /dashboard/activities?category=vocabulary.
// Two flavors:
//   1. Weekly IDs (vocab-sep-w1 ... vocab-jan-w4) — backing the per-week tiles.
//   2. Monthly IDs (vocab-september ... vocab-january) — legacy rows that back
//      the "CYCLE 1" unit-card row in ActivityCategories.tsx (vocabCycle1).
// All activities, their VocabCards, and their topic tags are preserved.
// They simply disappear from the learner-visible activity grid.
const CYCLE1_VOCAB_ACTIVITY_IDS = [
  // Weekly
  "vocab-sep-w1",
  "vocab-sep-w2",
  "vocab-sep-w3",
  "vocab-sep-w4",
  "vocab-oct-w1",
  "vocab-oct-w2",
  "vocab-oct-w3",
  "vocab-oct-w4",
  "vocab-nov-w1",
  "vocab-nov-w2",
  "vocab-nov-w3",
  "vocab-nov-w4",
  "vocab-dec-w1",
  "vocab-dec-w2",
  "vocab-jan-w1",
  "vocab-jan-w2",
  "vocab-jan-w3",
  "vocab-jan-w4",
  // Monthly (legacy unit cards)
  "vocab-september",
  "vocab-october",
  "vocab-november",
  "vocab-december",
  "vocab-january",
];

async function main() {
  requireSafeDbTarget(APPLY ? "retire Cycle 1 vocab activities (APPLY)" : "retire Cycle 1 vocab activities (dry-run)");

  const activities = await prisma.activity.findMany({
    where: { id: { in: CYCLE1_VOCAB_ACTIVITY_IDS } },
    select: {
      id: true,
      title: true,
      isReleased: true,
      isFeaturedForIndependent: true,
      deletedAt: true,
    },
    orderBy: { id: "asc" },
  });

  const missing = CYCLE1_VOCAB_ACTIVITY_IDS.filter(
    (id) => !activities.find((a) => a.id === id),
  );

  console.log(`\nFound ${activities.length} of ${CYCLE1_VOCAB_ACTIVITY_IDS.length} Cycle 1 vocab activities.`);
  if (missing.length > 0) {
    console.log(`Missing (not in DB): ${missing.join(", ")}`);
  }
  console.log();

  for (const a of activities) {
    const flags = [
      a.isReleased ? "released" : "unreleased",
      a.isFeaturedForIndependent ? "featured-indep" : "not-featured",
      a.deletedAt ? `deleted@${a.deletedAt.toISOString()}` : "active",
    ].join(", ");
    console.log(`  - ${a.id}  ${JSON.stringify(a.title)}  [${flags}]`);
  }

  const needsUpdate = activities.filter(
    (a) => a.isReleased || a.isFeaturedForIndependent,
  );

  console.log(`\n${needsUpdate.length} of ${activities.length} rows would be updated (skip already-retired rows).`);

  if (!APPLY) {
    console.log("\nDry-run only. Re-run with --apply to set isReleased=false, isFeaturedForIndependent=false.");
    console.log("VocabCards, submissions, progress, ledger entries are NOT touched.");
    return;
  }

  if (needsUpdate.length === 0) {
    console.log("\nAll Cycle 1 vocab rows already retired. Nothing to do.");
    return;
  }

  const result = await prisma.activity.updateMany({
    where: { id: { in: needsUpdate.map((a) => a.id) } },
    data: {
      isReleased: false,
      isFeaturedForIndependent: false,
    },
  });

  console.log(`\nUpdated ${result.count} rows. VocabCards + Library + Daily Review untouched.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
