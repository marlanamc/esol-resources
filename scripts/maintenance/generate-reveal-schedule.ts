/**
 * Writes the automatic week-reveal schedule for a class.
 *
 * Pairs each course-map week with a teaching week from the school calendar
 * (src/data/school-calendar-2026-27.ts) and stores the instant it should open
 * to students — Sunday 8pm ET by default. Break weeks hold no class sessions,
 * so the sequence pauses over them instead of unlocking content during a
 * vacation.
 *
 * Nothing reads a cron: getVisibleMap() treats a week as visible once its
 * revealAt has passed. Manual reveals still work and win when they are earlier.
 *
 * Usage:
 *   npx tsx scripts/maintenance/generate-reveal-schedule.ts --class <classId>
 *   npx tsx scripts/maintenance/generate-reveal-schedule.ts --class <classId> --apply
 *
 * Without --apply it prints the schedule and writes nothing.
 */
import { PrismaClient } from "@prisma/client";
import { buildTeachingWeeks } from "@/lib/course-map-schedule";
import { LEARNER_DAY_TIME_ZONE } from "@/lib/daily-habits";
import { SCHOOL_YEAR_LABEL } from "@/data/school-calendar-2026-27";

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`);

const fmt = (d: Date) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: LEARNER_DAY_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);

async function main() {
  const classId = arg("class");
  const apply = hasFlag("apply");

  if (!classId) {
    const classes = await prisma.class.findMany({
      select: { id: true, name: true, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
    });
    console.log("Pass --class <id>. Classes available:\n");
    for (const c of classes) {
      console.log(`  ${c.id}  ${c.name}  (${c._count.enrollments} enrolled)`);
    }
    return;
  }

  const cls = await prisma.class.findUnique({ where: { id: classId }, select: { id: true, name: true } });
  if (!cls) throw new Error(`No class with id ${classId}`);

  const weeks = await prisma.courseWeek.findMany({
    orderBy: { number: "asc" },
    select: { id: true, number: true, title: true },
  });
  const teachingWeeks = buildTeachingWeeks();

  if (teachingWeeks.length < weeks.length) {
    throw new Error(
      `Calendar has ${teachingWeeks.length} teaching weeks but the course map has ${weeks.length}. ` +
        `Shorten the map or extend the calendar before scheduling.`
    );
  }

  const existingReveals = await prisma.classReveal.findMany({
    where: { classId },
    select: { weekId: true },
  });
  const revealed = new Set(existingReveals.map((r) => r.weekId));

  const now = new Date();
  const pairs = weeks.map((week, i) => ({ week, teaching: teachingWeeks[i] }));

  console.log(`Class:    ${cls.name} (${cls.id})`);
  console.log(`Calendar: ${SCHOOL_YEAR_LABEL}, ${teachingWeeks.length} teaching weeks for ${weeks.length} course weeks`);
  console.log(`Spare:    ${teachingWeeks.length - weeks.length} week(s) at the end\n`);

  for (const { week, teaching } of pairs) {
    const past = teaching.revealAt <= now ? "  (already open)" : "";
    const manual = revealed.has(week.id) ? "  [revealed manually]" : "";
    const short = teaching.classDates.length === 1 ? "  [one session]" : "";
    console.log(
      `  W${String(week.number).padStart(2)}  ${fmt(teaching.revealAt).padEnd(30)} ${week.title}${past}${manual}${short}`
    );
  }

  if (!apply) {
    console.log(`\nDry run. Re-run with --apply to write ${pairs.length} schedule rows.`);
    return;
  }

  let written = 0;
  for (const { week, teaching } of pairs) {
    await prisma.classWeekSchedule.upsert({
      where: { classId_weekId: { classId, weekId: week.id } },
      create: { classId, weekId: week.id, revealAt: teaching.revealAt },
      update: { revealAt: teaching.revealAt },
    });
    written++;
  }

  // Weeks beyond the course map should not carry a stale schedule row.
  const activeWeekIds = weeks.map((w) => w.id);
  const pruned = await prisma.classWeekSchedule.deleteMany({
    where: { classId, weekId: { notIn: activeWeekIds } },
  });

  console.log(`\nWrote ${written} schedule rows.` + (pruned.count ? ` Removed ${pruned.count} stale row(s).` : ""));
}

main()
  .catch((e) => {
    console.error("Error:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
