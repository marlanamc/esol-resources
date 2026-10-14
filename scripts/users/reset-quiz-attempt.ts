/**
 * Let one learner take one weekly quiz again, as if they had never submitted it.
 *
 * Removes their submission and progress for that week's quiz, plus the points
 * that quiz awarded (ledger rows and the matching User.points / weeklyPoints),
 * so retaking it awards points once instead of twice. Nothing else on the
 * account changes. Dry run by default:
 *
 *   node --import tsx scripts/users/reset-quiz-attempt.ts --user test27 --week 4
 *   node --import tsx scripts/users/reset-quiz-attempt.ts --user test27 --week 4 --apply
 */
import { PrismaClient } from "@prisma/client";
import { getCalendarWeekStart } from "@/lib/gamification/calendar-week";

function arg(name: string): string | undefined {
    const i = process.argv.indexOf(`--${name}`);
    return i >= 0 ? process.argv[i + 1] : undefined;
}

const APPLY = process.argv.includes("--apply");
const username = arg("user");
const week = Number(arg("week"));

const prisma = new PrismaClient();

async function main() {
    if (!username || !Number.isInteger(week)) {
        console.error("Usage: --user <username> --week <number> [--apply]");
        process.exitCode = 1;
        return;
    }

    const host = (() => {
        try { return new URL(process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "").host; } catch { return "(unknown)"; }
    })();
    console.log(`Database host: ${host}`);

    const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, username: true, points: true, weeklyPoints: true },
    });
    if (!user) {
        console.error(`${username} not found — nothing done.`);
        process.exitCode = 1;
        return;
    }

    const quizzes = (await prisma.activity.findMany({
        where: { type: "quiz", content: { contains: '"type":"weekly-quiz"' } },
        select: { id: true, title: true, content: true },
    })).filter((a) => {
        try { return JSON.parse(a.content).weekNumber === week; } catch { return false; }
    });
    if (!quizzes.length) {
        console.error(`No weekly quiz found for week ${week} — nothing done.`);
        process.exitCode = 1;
        return;
    }

    const activityIds = quizzes.map((q) => q.id);
    const [submissions, progress, ledger] = await Promise.all([
        prisma.submission.findMany({
            where: { userId: user.id, activityId: { in: activityIds } },
            select: { id: true, activityId: true, status: true, score: true, pointsAwarded: true, completedAt: true },
        }),
        prisma.activityProgress.findMany({
            where: { userId: user.id, activityId: { in: activityIds } },
            select: { id: true, activityId: true, status: true },
        }),
        // The submit route writes quiz awards with reason "<title>|Quiz".
        prisma.pointsLedger.findMany({
            where: { userId: user.id, source: "activity", reason: { in: quizzes.map((q) => `${q.title || q.id}|Quiz`) } },
            select: { id: true, points: true, reason: true, createdAt: true },
        }),
    ]);

    const weekStart = getCalendarWeekStart();
    const points = ledger.reduce((sum, row) => sum + row.points, 0);
    const weeklyPoints = ledger.filter((row) => row.createdAt >= weekStart).reduce((sum, row) => sum + row.points, 0);

    console.log(`User ${user.username}: points=${user.points} weeklyPoints=${user.weeklyPoints}`);
    for (const q of quizzes) console.log(`Quiz: ${q.title} (${q.id})`);
    for (const s of submissions) console.log(`  submission ${s.id} status=${s.status} score=${s.score} pointsAwarded=${s.pointsAwarded} completedAt=${s.completedAt?.toISOString()}`);
    for (const p of progress) console.log(`  progress   ${p.id} status=${p.status}`);
    for (const row of ledger) console.log(`  ledger     ${row.createdAt.toISOString()} ${row.points} ${row.reason}`);
    console.log(`Would remove ${submissions.length} submission(s), ${progress.length} progress row(s), ${ledger.length} ledger row(s); points -${points}, weeklyPoints -${weeklyPoints}.`);

    if (!APPLY) {
        console.log("\nDry run. Re-run with --apply to write.");
        return;
    }

    await prisma.$transaction([
        prisma.submission.deleteMany({ where: { id: { in: submissions.map((s) => s.id) } } }),
        prisma.activityProgress.deleteMany({ where: { id: { in: progress.map((p) => p.id) } } }),
        prisma.pointsLedger.deleteMany({ where: { id: { in: ledger.map((row) => row.id) } } }),
        prisma.user.update({
            where: { id: user.id },
            data: {
                points: Math.max(0, user.points - points),
                weeklyPoints: Math.max(0, user.weeklyPoints - weeklyPoints),
            },
        }),
    ]);
    console.log(`Done. ${user.username} can take the week ${week} quiz again.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
