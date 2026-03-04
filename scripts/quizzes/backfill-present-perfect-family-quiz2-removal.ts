import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TARGET_ACTIVITY_ID = "present-perfect-family-guide";
const REMOVED_QUESTION_ID = "quiz-2";
const OLD_TOTAL = 15;
const NEW_TOTAL = 14;
const LEDGER_SOURCE = "manual_adjustment";
const LEDGER_REASON_PREFIX = "present-perfect-family-quiz2-removal";

type MiniQuizPayload = {
  type?: string;
  score?: number;
  total?: number;
  slug?: string;
};

function calculateQuizPoints(score: number): number {
  if (score === 100) return 15;
  if (score >= 90) return 10;
  if (score >= 80) return 5;
  if (score >= 70) return 2;
  return 0;
}

function inferCorrectCount(percent: number, total: number): number {
  const exactMatches: number[] = [];
  for (let correct = 0; correct <= total; correct += 1) {
    if (Math.round((correct / total) * 100) === percent) {
      exactMatches.push(correct);
    }
  }
  if (exactMatches.length > 0) return exactMatches[0]!;

  let bestCorrect = 0;
  let bestDelta = Number.POSITIVE_INFINITY;
  for (let correct = 0; correct <= total; correct += 1) {
    const candidate = Math.round((correct / total) * 100);
    const delta = Math.abs(candidate - percent);
    if (delta < bestDelta) {
      bestDelta = delta;
      bestCorrect = correct;
    }
  }
  return bestCorrect;
}

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(apply
    ? "Applying Present Perfect Family quiz backfill..."
    : "Dry run: Present Perfect Family quiz backfill...");

  const submissions = await prisma.submission.findMany({
    where: {
      activityId: TARGET_ACTIVITY_ID,
      assignmentId: null,
      score: { not: null },
    },
    select: {
      id: true,
      userId: true,
      score: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const latestQ2Responses = await prisma.quizResponse.findMany({
    where: {
      activityId: TARGET_ACTIVITY_ID,
      assignmentId: null,
      questionId: REMOVED_QUESTION_ID,
    },
    select: {
      userId: true,
      isCorrect: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const latestQ2ByUser = new Map<string, { isCorrect: boolean; createdAt: Date }>();
  for (const row of latestQ2Responses) {
    if (!latestQ2ByUser.has(row.userId)) {
      latestQ2ByUser.set(row.userId, { isCorrect: row.isCorrect, createdAt: row.createdAt });
    }
  }

  let examined = 0;
  let eligible = 0;
  let updated = 0;
  let pointsAdjustedUsers = 0;
  let pointsAdjustedTotal = 0;

  for (const submission of submissions) {
    examined += 1;
    const latestQ2 = latestQ2ByUser.get(submission.userId);
    if (!latestQ2 || latestQ2.isCorrect) {
      continue;
    }

    let payload: MiniQuizPayload = {};
    try {
      payload = JSON.parse(submission.content) as MiniQuizPayload;
    } catch {
      // If parsing fails, use submission.score with default total.
      payload = {};
    }

    const oldTotal = typeof payload.total === "number" ? payload.total : OLD_TOTAL;
    if (oldTotal !== OLD_TOTAL) {
      // Skip already-updated or non-standard attempts.
      continue;
    }

    const oldPercentRaw = typeof submission.score === "number"
      ? submission.score
      : (typeof payload.score === "number" ? payload.score : 0);
    const oldPercent = Math.max(0, Math.min(100, oldPercentRaw));
    const oldCorrectCount = inferCorrectCount(oldPercent, OLD_TOTAL);
    const newPercent = Math.round((oldCorrectCount / NEW_TOTAL) * 100);

    eligible += 1;
    if (newPercent === oldPercent) {
      continue;
    }

    const oldQuizPoints = calculateQuizPoints(oldPercent);
    const newQuizPoints = calculateQuizPoints(newPercent);
    const deltaPoints = Math.max(0, newQuizPoints - oldQuizPoints);
    const ledgerReason = `${LEDGER_REASON_PREFIX}:${submission.id}`;

    if (apply) {
      await prisma.$transaction(async (tx) => {
        const nextPayload: MiniQuizPayload = {
          ...(payload ?? {}),
          score: newPercent,
          total: NEW_TOTAL,
          slug: typeof payload.slug === "string" ? payload.slug : "present-perfect-family",
          type: typeof payload.type === "string" ? payload.type : "mini-quiz",
        };

        await tx.submission.update({
          where: { id: submission.id },
          data: {
            score: newPercent,
            content: JSON.stringify(nextPayload),
          },
        });

        if (deltaPoints > 0) {
          const existingLedger = await tx.pointsLedger.findFirst({
            where: {
              userId: submission.userId,
              reason: ledgerReason,
            },
            select: { id: true },
          });

          if (!existingLedger) {
            await tx.user.update({
              where: { id: submission.userId },
              data: {
                points: { increment: deltaPoints },
                weeklyPoints: { increment: deltaPoints },
              },
            });

            await tx.pointsLedger.create({
              data: {
                userId: submission.userId,
                points: deltaPoints,
                reason: ledgerReason,
                source: LEDGER_SOURCE,
              },
            });
          }
        }
      });
    }

    updated += 1;
    if (deltaPoints > 0) {
      pointsAdjustedUsers += 1;
      pointsAdjustedTotal += deltaPoints;
    }
  }

  console.log(`Examined submissions: ${examined}`);
  console.log(`Eligible (latest quiz-2 was incorrect, old total=${OLD_TOTAL}): ${eligible}`);
  console.log(`${apply ? "Updated" : "Would update"} submissions: ${updated}`);
  console.log(`${apply ? "Adjusted" : "Would adjust"} users for points: ${pointsAdjustedUsers}`);
  console.log(`${apply ? "Total points awarded" : "Total points to award"}: ${pointsAdjustedTotal}`);
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
