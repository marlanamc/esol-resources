import { PrismaClient } from "@prisma/client";
import { GUIDED_VERB_QUIZ_PLAN } from "@/data/verb-quiz-plan";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

const APPLY = process.argv.includes("--apply");

async function main() {
  requireSafeDbTarget(APPLY ? "retire legacy verb quizzes (APPLY)" : "retire legacy verb quizzes (dry-run)");

  const fy27Ids = new Set(GUIDED_VERB_QUIZ_PLAN.map((q) => q.activityId));

  const verbQuizzes = await prisma.activity.findMany({
    where: {
      type: "quiz",
      content: { contains: '"type":"verb-quiz"' },
    },
    select: {
      id: true,
      title: true,
      isReleased: true,
      isFeaturedForIndependent: true,
      deletedAt: true,
    },
    orderBy: { id: "asc" },
  });

  const legacy = verbQuizzes.filter((q) => !fy27Ids.has(q.id));
  const fy27 = verbQuizzes.filter((q) => fy27Ids.has(q.id));

  console.log(`\nFound ${verbQuizzes.length} total verb-quiz activities:`);
  console.log(`  - ${fy27.length} match FY27 IDs (verb-quiz-1..${GUIDED_VERB_QUIZ_PLAN.length}) — will be left alone`);
  console.log(`  - ${legacy.length} legacy rows — candidates for soft-retire\n`);

  if (legacy.length === 0) {
    console.log("Nothing to retire. Exiting.");
    return;
  }

  console.log("Legacy quizzes to soft-retire:");
  for (const q of legacy) {
    const flags = [
      q.isReleased ? "released" : "unreleased",
      q.isFeaturedForIndependent ? "featured" : "not-featured",
      q.deletedAt ? `deleted@${q.deletedAt.toISOString()}` : "active",
    ].join(", ");
    console.log(`  - ${q.id}  ${JSON.stringify(q.title)}  [${flags}]`);
  }

  const needsUpdate = legacy.filter(
    (q) => q.isReleased || q.isFeaturedForIndependent,
  );

  console.log(`\n${needsUpdate.length} of ${legacy.length} rows would be updated (skip already-retired rows).`);

  if (!APPLY) {
    console.log("\nDry-run only. Re-run with --apply to set isReleased=false, isFeaturedForIndependent=false.");
    return;
  }

  if (needsUpdate.length === 0) {
    console.log("\nAll legacy rows already retired. Nothing to do.");
    return;
  }

  const result = await prisma.activity.updateMany({
    where: { id: { in: needsUpdate.map((q) => q.id) } },
    data: {
      isReleased: false,
      isFeaturedForIndependent: false,
    },
  });

  console.log(`\nUpdated ${result.count} rows. Submissions, progress, and ledger entries untouched.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
