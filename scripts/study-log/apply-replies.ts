/**
 * Saves teacher-approved practice log replies drafted by the /practice-log-corrections skill.
 *
 * Input: a JSON file with { replies: [{ logId, kind: "recast" | "praise", text? }] }.
 * Each reply is checked again before saving: the log must still have no reply (a reply
 * the teacher sent in the app always wins), and a recast must change the sentence.
 * Replies are saved as from --teacher and show as unread to the student. Points never change.
 *
 * Usage:
 *   npx tsx scripts/study-log/apply-replies.ts tmp/practice-log/approved.json --teacher marlie
 *   ALLOW_PROD_DB_MUTATION=yes CONFIRM_DB_HOST=<host> \
 *     npx tsx scripts/study-log/apply-replies.ts tmp/practice-log/approved.json --teacher marlie --apply
 *
 * Without --apply it prints what it would save and writes nothing.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { isStudyLogReplyKind, parseStudyLogRecast } from "@/lib/learner/study-log";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
    const i = process.argv.indexOf(`--${name}`);
    return i >= 0 ? process.argv[i + 1] : undefined;
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`);

type Reply = { logId: string; kind: string; text?: string };

async function main() {
    const file = process.argv[2];
    const teacherUsername = arg("teacher");
    const apply = hasFlag("apply");
    if (!file || file.startsWith("--") || !teacherUsername) {
        throw new Error("Usage: apply-replies.ts <approved.json> --teacher <username> [--apply]");
    }

    const replies: Reply[] = JSON.parse(readFileSync(file, "utf8")).replies;
    if (!Array.isArray(replies)) throw new Error(`${file} has no "replies" array`);

    const teacher = await prisma.user.findUnique({ where: { username: teacherUsername }, select: { id: true, role: true } });
    if (!teacher || !["teacher", "teacher_admin", "admin"].includes(teacher.role)) {
        throw new Error(`No teacher account named ${teacherUsername}`);
    }

    const logs = await prisma.studyLog.findMany({
        where: { id: { in: replies.map((r) => r.logId) } },
        select: { id: true, text: true, replyKind: true },
    });
    const byId = new Map(logs.map((log) => [log.id, log]));

    const ready: Array<{ logId: string; kind: "recast" | "praise"; text: string | null; original: string }> = [];
    for (const reply of replies) {
        const log = byId.get(reply.logId);
        if (!log) console.log(`skip ${reply.logId}: log not found`);
        else if (log.replyKind) console.log(`skip ${reply.logId}: already has a reply ("${log.text}")`);
        else if (!isStudyLogReplyKind(reply.kind)) console.log(`skip ${reply.logId}: kind must be recast or praise`);
        else if (reply.kind === "praise") ready.push({ logId: log.id, kind: "praise", text: null, original: log.text });
        else {
            const parsed = parseStudyLogRecast(reply.text, log.text);
            if ("error" in parsed) console.log(`skip ${reply.logId}: ${parsed.error} ("${log.text}")`);
            else ready.push({ logId: log.id, kind: "recast", text: parsed.text, original: log.text });
        }
    }

    for (const r of ready) console.log(`${r.kind === "praise" ? "👍" : "✎"} ${r.original}${r.text ? `\n   → ${r.text}` : ""}`);
    console.log(`\n${ready.length} of ${replies.length} replies ready.`);
    if (!apply) {
        console.log("Dry run. Re-run with --apply to save them.");
        return;
    }

    requireSafeDbTarget(`save ${ready.length} practice log replies`);
    let saved = 0;
    for (const r of ready) {
        // replyKind: null in the where keeps a reply sent from the app in the meantime.
        const result = await prisma.studyLog.updateMany({
            where: { id: r.logId, replyKind: null },
            data: { replyKind: r.kind, replyText: r.text, repliedById: teacher.id, repliedAt: new Date(), replySeenAt: null },
        });
        saved += result.count;
    }
    console.log(`Saved ${saved} replies.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
