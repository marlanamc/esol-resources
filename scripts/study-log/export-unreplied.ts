/**
 * Prints one class's practice log entries that have no teacher reply yet, as JSON,
 * for the /practice-log-corrections skill to draft replies from. Reads only.
 *
 * Usage:
 *   npx tsx scripts/study-log/export-unreplied.ts --class "ESOL 3" [--since 2026-10-26] [--out tmp/practice-log/unreplied.json]
 *
 * --since defaults to the Monday of the current week. Same students as the teacher
 * practice log panel: active enrollments, no system or leaderboard-excluded accounts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { PrismaClient } from "@prisma/client";
import { getCalendarWeekStartDayKey } from "@/lib/gamification/calendar-week";
import { normalizeStudyLogKind, parseDayKey } from "@/lib/learner/study-log";

const { parseActiveDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
    const i = process.argv.indexOf(`--${name}`);
    return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
    const className = arg("class");
    if (!className) {
        const classes = await prisma.class.findMany({ select: { name: true }, orderBy: { createdAt: "desc" } });
        console.log("Pass --class <name>. Classes available:\n");
        for (const c of classes) console.log(`  ${c.name}`);
        return;
    }
    const sinceArg = arg("since");
    const since = sinceArg ? parseDayKey(sinceArg) : getCalendarWeekStartDayKey();
    if (!since) throw new Error(`--since must be YYYY-MM-DD, got ${sinceArg}`);

    const target = parseActiveDbTarget();
    console.error(`[export] reading host=${target.hostname} db=${target.database}`);

    const cls = await prisma.class.findFirst({ where: { name: className }, select: { id: true, name: true } });
    if (!cls) throw new Error(`No class named ${className}`);

    const enrollments = await prisma.classEnrollment.findMany({
        where: { classId: cls.id, status: "active", student: { isSystemAccount: false, excludeFromLeaderboard: false } },
        select: { student: { select: { id: true, name: true, username: true } } },
    });
    const names = new Map(enrollments.map((e) => [e.student.id, e.student.name?.trim() || e.student.username]));

    const logs = await prisma.studyLog.findMany({
        where: { userId: { in: [...names.keys()] }, dayKey: { gte: since }, replyKind: null },
        orderBy: [{ dayKey: "asc" }, { createdAt: "asc" }],
        select: { id: true, userId: true, kind: true, text: true, dayKey: true },
    });

    const entries = logs.map((log) => ({
        logId: log.id,
        student: names.get(log.userId)!,
        day: log.dayKey,
        kind: normalizeStudyLogKind(log.kind) ?? log.kind,
        text: log.text,
    }));
    const json = JSON.stringify({ class: cls.name, since, entries }, null, 2);

    const out = arg("out");
    if (out) {
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, json + "\n");
        console.error(`[export] ${entries.length} entries without a reply since ${since} -> ${out}`);
    } else {
        console.log(json);
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
