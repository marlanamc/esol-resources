#!/usr/bin/env node
/**
 * Read-only: show every account matching a name, with its point totals and
 * the last few days of ledger rows, submissions, progress, and speaking saves.
 * Usage: node scripts/diagnostics/inspect-student-points.js alex [days=3]
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL || process.env.POSTGRES_URL } },
});

async function main() {
    const term = process.argv[2];
    const days = Number(process.argv[3] || 3);
    if (!term) throw new Error("Usage: inspect-student-points.js <name-fragment> [days]");
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: term, mode: "insensitive" } },
                { name: { contains: term, mode: "insensitive" } },
            ],
        },
        select: {
            id: true, username: true, name: true, role: true, createdAt: true,
            points: true, weeklyPoints: true, currentStreak: true, lastActivityDate: true,
            excludeFromLeaderboard: true, isSystemAccount: true,
            classes: { select: { status: true, class: { select: { name: true } } } },
        },
    });
    console.log(`${users.length} account(s) match "${term}" (look for duplicates!)\n`);

    for (const u of users) {
        const [ledgerTotal, ledger, submissions, progress, speaking] = await Promise.all([
            prisma.pointsLedger.aggregate({ where: { userId: u.id }, _sum: { points: true }, _count: true }),
            prisma.pointsLedger.findMany({ where: { userId: u.id, createdAt: { gte: since } }, orderBy: { createdAt: "asc" } }),
            prisma.submission.findMany({
                where: { userId: u.id, createdAt: { gte: since } },
                select: { createdAt: true, activityId: true, status: true, score: true, pointsAwarded: true, activity: { select: { title: true } } },
                orderBy: { createdAt: "asc" },
            }),
            prisma.activityProgress.findMany({
                where: { userId: u.id, updatedAt: { gte: since } },
                select: { updatedAt: true, activityId: true, progress: true, status: true },
                orderBy: { updatedAt: "asc" },
            }),
            prisma.speakingSubmission.findMany({ where: { userId: u.id, submittedAt: { gte: since } }, select: { submittedAt: true } }).catch(() => []),
        ]);

        console.log("=".repeat(70));
        console.log(`${u.username} (${u.name ?? "no name"}) role=${u.role} id=${u.id} created=${u.createdAt.toISOString()}`);
        console.log(`  User.points=${u.points} weeklyPoints=${u.weeklyPoints} streak=${u.currentStreak} lastActivity=${u.lastActivityDate?.toISOString() ?? "never"}`);
        console.log(`  Ledger: ${ledgerTotal._count} rows, sum=${ledgerTotal._sum.points ?? 0}`);
        console.log(`  excludeFromLeaderboard=${u.excludeFromLeaderboard} isSystemAccount=${u.isSystemAccount}`);
        console.log(`  Classes: ${u.classes.map((c) => `${c.class.name} [${c.status}]`).join(", ") || "NONE"}`);
        console.log(`\n  Ledger rows (last ${days}d): ${ledger.length}`);
        for (const r of ledger) console.log(`    ${r.createdAt.toISOString()}  ${String(r.points).padStart(4)}  ${r.source ?? ""} ${r.reason ?? ""}`);
        console.log(`  Submissions (last ${days}d): ${submissions.length}`);
        for (const s of submissions) console.log(`    ${s.createdAt.toISOString()}  ${s.status} score=${s.score} pts=${s.pointsAwarded}  ${s.activity?.title ?? s.activityId}`);
        console.log(`  Progress updates (last ${days}d): ${progress.length}`);
        for (const p of progress) console.log(`    ${p.updatedAt.toISOString()}  ${p.status} ${p.progress}%  ${p.activityId}`);
        console.log(`  Speaking submissions (last ${days}d): ${speaking.length}\n`);
    }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
