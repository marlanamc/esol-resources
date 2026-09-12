import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { getEffectiveLearnerMode } from "@/lib/learner-preview";
import { isAdmin } from "@/lib/auth/roles";
import { MAP } from "@/lib/content-kind";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CourseMapActivityType =
  | "guide"
  | "game"
  | "quiz"
  | "pronunciation"
  | "writing"
  | "speaking"
  | "review"
  | "catch-up"
  | "assessment";

export type CourseMapActivityStatus = "available" | "locked" | "completed" | "planned";

export interface CourseMapActivity {
  id: string;
  title: string;
  activityType: CourseMapActivityType;
  status: CourseMapActivityStatus;
  activityId?: string;
  href?: string;
  vocabUi?: string;
  wrappedGame?: boolean;
  /** Short chip shown next to the item on the map, e.g. "Challenge". */
  badge?: string;
}

export interface CourseMapLevel {
  levelNumber: number;
  levelTitle: string;
  levelGoal?: string;
  requiredActivities: CourseMapActivity[];
  extraPractice?: CourseMapActivity[];
}

export interface CourseMapUnit {
  unitNumber: number;
  unitTitle: string;
  month: string;
  levels: CourseMapLevel[];
}

// ── DB fetch ──────────────────────────────────────────────────────────────────

export async function fetchCourseMapUnits(): Promise<CourseMapUnit[]> {
  const units = await withPrismaReadRetry(() =>
    prisma.courseUnit.findMany({
      orderBy: { number: "asc" },
      include: {
        weeks: {
          orderBy: { number: "asc" },
          include: {
            items: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    })
  );

  return units.map((unit) => ({
    unitNumber: unit.number,
    unitTitle: unit.title,
    month: unit.month ?? "",
    levels: unit.weeks.map((week) => {
      const required = week.items.filter((i) => i.slot === "required");
      const extra = week.items.filter((i) => i.slot === "extra");

      const toActivity = (item: (typeof week.items)[number]): CourseMapActivity => ({
        id: item.id,
        title: item.title,
        activityType: item.activityType as CourseMapActivityType,
        status: !item.activityId && !item.href ? "planned" : "available",
        ...(item.activityId ? { activityId: item.activityId } : {}),
        ...(item.href ? { href: item.href } : {}),
        ...(item.vocabUi ? { vocabUi: item.vocabUi } : {}),
        ...(item.wrappedGame ? { wrappedGame: true } : {}),
        ...(item.badge ? { badge: item.badge } : {}),
      });

      return {
        levelNumber: week.number,
        levelTitle: week.title,
        levelGoal: week.goal ?? undefined,
        requiredActivities: required.map(toActivity),
        extraPractice: extra.length > 0 ? extra.map(toActivity) : undefined,
      };
    }),
  }));
}

// ── Visibility ────────────────────────────────────────────────────────────────

export type VisibleMapMode = "independent" | "classroom";

export interface VisibleMapResult {
  units: CourseMapUnit[];
  mode: VisibleMapMode;
  revealedWeekIds: Set<string>;
}

/**
 * Returns only the weeks visible to this user:
 *   - admin (student-view or no class): all published weeks (has ≥1 real activityId)
 *   - independent learner: same — all published weeks
 *   - in-class student: only weeks with a ClassReveal row for their class
 *
 * Units with no visible weeks are omitted from the result.
 */
/**
 * Week IDs currently visible to the given classes.
 *
 * A week is visible when it has been revealed manually, or when its scheduled
 * reveal time has passed. The schedule is evaluated here at read time rather
 * than by a cron, so the timing is exact and nothing can be missed overnight.
 * Shared by the learner map and the teacher's reveal view so the two can never
 * disagree about what students can see.
 */
export async function getVisibleWeekIdsForClasses(
  classIds: string[],
  now: Date = new Date()
): Promise<Set<string>> {
  if (classIds.length === 0) return new Set();

  const [reveals, dueSchedules] = await Promise.all([
    withPrismaReadRetry(() =>
      prisma.classReveal.findMany({
        where: { classId: { in: classIds } },
        select: { weekId: true },
      })
    ),
    withPrismaReadRetry(() =>
      prisma.classWeekSchedule.findMany({
        where: { classId: { in: classIds }, revealAt: { lte: now } },
        select: { weekId: true },
      })
    ),
  ]);

  return new Set([...reveals.map((r) => r.weekId), ...dueSchedules.map((s) => s.weekId)]);
}

export async function getVisibleMap(
  user: { id: string; role?: string | null },
  options?: { mode?: VisibleMapMode }
): Promise<VisibleMapResult> {
  const [allUnitsRaw, mode] = await Promise.all([
    withPrismaReadRetry(() =>
      prisma.courseUnit.findMany({
        orderBy: { number: "asc" },
        include: {
          weeks: {
            orderBy: { number: "asc" },
            include: {
              items: {
                orderBy: { order: "asc" },
                include: { activity: { select: { contentKind: true } } },
              },
            },
          },
        },
      })
    ),
    options?.mode
      ? Promise.resolve(options.mode)
      : getEffectiveLearnerMode(user.id, user),
  ]);

  // Admin always sees all published nodes (useful for student-preview)
  const useAllPublished = isAdmin(user) || mode === "independent";

  let revealedWeekIds: Set<string>;

  if (useAllPublished) {
    // A week is "published" when it has at least one item with a real activityId
    revealedWeekIds = new Set(
      allUnitsRaw
        .flatMap((u) => u.weeks)
        .filter((w) => w.items.some((i) => i.activity?.contentKind === MAP))
        .map((w) => w.id)
    );
  } else {
    // In-class: manual reveals plus any scheduled reveal whose time has passed.
    const enrollments = await withPrismaReadRetry(() =>
      prisma.classEnrollment.findMany({
        where: { studentId: user.id, status: "active" },
        select: { classId: true },
      })
    );

    revealedWeekIds = await getVisibleWeekIdsForClasses(enrollments.map((e) => e.classId));
  }

  // Only surface the activityId when the linked activity is contentKind=map.
  // Items without an activityId (planned) are always included.
  const toActivity = (item: (typeof allUnitsRaw)[number]["weeks"][number]["items"][number]): CourseMapActivity => {
    const isMapActivity = item.activity?.contentKind === MAP;
    return {
      id: item.id,
      title: item.title,
      activityType: item.activityType as CourseMapActivityType,
      status: !item.activityId && !item.href ? "planned" : "available",
      ...(item.activityId && isMapActivity ? { activityId: item.activityId } : {}),
      ...(item.href ? { href: item.href } : {}),
      ...(item.vocabUi ? { vocabUi: item.vocabUi } : {}),
      ...(item.wrappedGame ? { wrappedGame: true } : {}),
      ...(item.badge ? { badge: item.badge } : {}),
    };
  };

  const extraPracticeFor = (
    week: (typeof allUnitsRaw)[number]["weeks"][number]
  ): CourseMapActivity[] | undefined => {
    const extras = week.items.filter((i) => i.slot === "extra").map(toActivity);
    return extras.length > 0 ? extras : undefined;
  };

  const units: CourseMapUnit[] = allUnitsRaw
    .map((unit) => {
      const visibleWeeks = unit.weeks.filter((w) => revealedWeekIds.has(w.id));
      if (visibleWeeks.length === 0) return null;

      return {
        unitNumber: unit.number,
        unitTitle: unit.title,
        month: unit.month ?? "",
        levels: visibleWeeks.map((week) => ({
          levelNumber: week.number,
          levelTitle: week.title,
          levelGoal: week.goal ?? undefined,
          requiredActivities: week.items.filter((i) => i.slot === "required").map(toActivity),
          extraPractice: extraPracticeFor(week),
        })),
      };
    })
    .filter((u): u is NonNullable<typeof u> => u !== null);

  return { units, mode, revealedWeekIds };
}

export { getCourseMapProgressActivityIds as getCourseMapActivityIds } from "@/lib/course-map-progress";
