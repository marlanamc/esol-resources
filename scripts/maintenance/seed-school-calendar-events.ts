/**
 * Adds the school-year calendar to a class: every no-school closure plus the
 * first and last day of class.
 *
 * Source of truth is src/data/school-calendar-2026-27.ts. Closures become
 * "holiday" events (multi-day ones carry an endDate); the term bookends become
 * "event" entries. The first and last class days are derived from the actual
 * Tue/Thu meeting pattern, not from the sheet's generic term start.
 *
 * Safe to re-run: CalendarEvent has a unique (classId, title, type, date)
 * constraint, so existing rows are updated rather than duplicated.
 *
 * Usage:
 *   npx tsx scripts/maintenance/seed-school-calendar-events.ts --class <classId>
 *   npx tsx scripts/maintenance/seed-school-calendar-events.ts --class <classId> --apply
 */
import { PrismaClient } from "@prisma/client";
import { buildTeachingWeeks } from "@/lib/course-map-schedule";
import { SCHOOL_CLOSURES, SCHOOL_YEAR_LABEL } from "@/data/school-calendar-2026-27";

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`);

/** Match the calendar API: noon local, so the date never shifts a day. */
function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

const pretty = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));

interface PlannedEvent {
  title: string;
  date: string;
  endDate: string | null;
  type: "holiday" | "event";
  description: string | null;
}

function planEvents(): PlannedEvent[] {
  const weeks = buildTeachingWeeks();
  const firstClass = weeks[0].classDates[0];
  const lastWeek = weeks[weeks.length - 1];
  const lastClass = lastWeek.classDates[lastWeek.classDates.length - 1];

  const events: PlannedEvent[] = [
    {
      title: "First Day of Class",
      date: firstClass,
      endDate: null,
      type: "event",
      description: `First evening class of the ${SCHOOL_YEAR_LABEL} year`,
    },
    {
      title: "Last Day of Class",
      date: lastClass,
      endDate: null,
      type: "event",
      description: `Final evening class of the ${SCHOOL_YEAR_LABEL} year`,
    },
  ];

  for (const closure of SCHOOL_CLOSURES) {
    events.push({
      title: closure.label,
      date: closure.from,
      endDate: closure.to === closure.from ? null : closure.to,
      type: "holiday",
      description: "No school",
    });
  }

  return events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

async function main() {
  const classId = arg("class");
  const apply = hasFlag("apply");

  if (!classId) {
    const classes = await prisma.class.findMany({
      select: { id: true, name: true, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
    });
    console.log("Pass --class <id>. Classes available:\n");
    for (const c of classes) console.log(`  ${c.id}  ${c.name}  (${c._count.enrollments} enrolled)`);
    return;
  }

  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: { id: true, name: true, teacherId: true },
  });
  if (!cls) throw new Error(`No class with id ${classId}`);

  const events = planEvents();
  console.log(`Class:    ${cls.name} (${cls.id})`);
  console.log(`Calendar: ${SCHOOL_YEAR_LABEL} — ${events.length} events\n`);

  for (const e of events) {
    const span = e.endDate ? `${pretty(e.date)} – ${pretty(e.endDate)}` : pretty(e.date);
    console.log(`  ${e.type.padEnd(8)} ${span.padEnd(34)} ${e.title}`);
  }

  if (!apply) {
    console.log(`\nDry run. Re-run with --apply to write these to the class calendar.`);
    return;
  }

  let created = 0;
  let updated = 0;
  for (const e of events) {
    const date = parseDateOnly(e.date);
    const endDate = e.endDate ? parseDateOnly(e.endDate) : null;

    const existing = await prisma.calendarEvent.findUnique({
      where: { classId_title_type_date: { classId, title: e.title, type: e.type, date } },
      select: { id: true },
    });

    if (existing) {
      await prisma.calendarEvent.update({
        where: { id: existing.id },
        data: { endDate, description: e.description },
      });
      updated++;
    } else {
      await prisma.calendarEvent.create({
        data: {
          classId,
          title: e.title,
          type: e.type,
          date,
          endDate,
          description: e.description,
          createdById: cls.teacherId,
        },
      });
      created++;
    }
  }

  console.log(`\nCreated ${created}, updated ${updated}.`);
}

main()
  .catch((e) => {
    console.error("Error:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
