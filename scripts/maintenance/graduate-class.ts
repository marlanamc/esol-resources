/**
 * Graduates every active student in a class, converting them to independent
 * learners.
 *
 * A student with no active enrollment is independent by definition
 * (see getLearnerState in src/lib/learner-mode.ts), so graduating the last
 * class moves them to the independent dashboard, the independent leaderboard,
 * and progress-based pacing instead of the school calendar.
 *
 * Nothing is deleted: the enrollment row stays with status "graduated" plus a
 * statusChangedAt/statusNote audit trail, so the roster history and every
 * submission, point and achievement survive. Re-enrolling later reactivates the
 * same row (enrollStudentInClass sets isReturning).
 *
 * Usage:
 *   npx tsx scripts/maintenance/graduate-class.ts --class FY26
 *   ALLOW_PROD_DB_MUTATION=yes CONFIRM_DB_HOST=<host> \
 *     npx tsx scripts/maintenance/graduate-class.ts --class FY26 --apply
 *
 * Without --apply it prints the roster and writes nothing.
 */
import { PrismaClient } from "@prisma/client";
import { graduateStudentFromClass } from "@/lib/learner-transitions";
import { ACTIVE_ENROLLMENT_STATUS } from "@/lib/learner-mode";

const { requireSafeDbTarget } = require("../lib/require-safe-db-target");

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
    const i = process.argv.indexOf(`--${name}`);
    return i >= 0 ? process.argv[i + 1] : undefined;
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`);

async function main() {
    const className = arg("class");
    const apply = hasFlag("apply");
    const note = arg("note") ?? "Class year complete — converted to independent learner";

    if (!className) {
        const classes = await prisma.class.findMany({
            select: {
                name: true,
                _count: { select: { enrollments: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        console.log("Pass --class <name>. Classes available:\n");
        for (const c of classes) {
            console.log(`  ${c.name}  (${c._count.enrollments} enrollments)`);
        }
        return;
    }

    const cls = await prisma.class.findFirst({
        where: { name: className },
        select: { id: true, name: true },
    });
    if (!cls) throw new Error(`No class named ${className}`);

    const enrollments = await prisma.classEnrollment.findMany({
        where: { classId: cls.id, status: ACTIVE_ENROLLMENT_STATUS },
        select: {
            studentId: true,
            student: {
                select: {
                    username: true,
                    points: true,
                    isSystemAccount: true,
                    classes: {
                        where: { status: ACTIVE_ENROLLMENT_STATUS },
                        select: { classId: true },
                    },
                },
            },
        },
    });

    if (enrollments.length === 0) {
        console.log(`${cls.name} has no active enrollments. Nothing to do.`);
        return;
    }

    console.log(`Class: ${cls.name} (${cls.id})`);
    console.log(`Active enrollments: ${enrollments.length}\n`);

    for (const e of enrollments) {
        // Someone still enrolled elsewhere stays a classroom learner; flag it
        // so the outcome is never a surprise.
        const otherClasses = e.student.classes.filter((c) => c.classId !== cls.id).length;
        const outcome = otherClasses > 0
            ? `stays classroom (${otherClasses} other active class)`
            : "becomes independent";
        const system = e.student.isSystemAccount ? "  [system account]" : "";
        console.log(
            `  ${e.student.username.padEnd(16)} ${String(e.student.points).padStart(5)}pts  → ${outcome}${system}`
        );
    }

    if (!apply) {
        console.log(`\nDry run. Re-run with --apply to graduate ${enrollments.length} student(s).`);
        return;
    }

    requireSafeDbTarget(`graduate all active students from ${cls.name}`);

    let graduated = 0;
    for (const e of enrollments) {
        await graduateStudentFromClass({
            prisma,
            studentId: e.studentId,
            classId: cls.id,
            note,
        });
        graduated++;
    }

    console.log(`\nGraduated ${graduated} student(s) from ${cls.name}.`);
    console.log("Their enrollment history, points and submissions are unchanged.");
}

main()
    .catch((e) => {
        console.error("Error:", e instanceof Error ? e.message : e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
