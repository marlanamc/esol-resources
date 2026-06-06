import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { trackLogin, getTimeframedLeaderboard } from "@/lib/gamification";
import { buildCalendarWeekActivity, getCalendarWeekStart } from "@/lib/gamification/calendar-week";
import { formatDashboardWeekRangeLabel } from "@/lib/dashboard/week-range-label";
import { logger } from "@/lib/logger";
import { parseCategoryData } from "@/lib/categoryData";
import { renderAnnouncementMarkdown } from "@/utils/announcementMarkdown";
import Link from "next/link";
import { UsersIcon } from "@/components/icons/Icons";
import {
    MiniCalendar,
    CalendarEvent,
    UpcomingEventsList,
    TodaysAssignments,
    ClassAnnouncement,
    MissedClassCatchUpCard,
    MomentumCard,
    ExploreCategoriesCarousel,
} from "@/components/dashboard";
import { getLearnerCategoryTone } from "@/lib/learner-theme";
import { getDailyVocabHabitForUser } from "@/lib/daily-habits";
import { isLearnerVisibleActivity } from "@/lib/learner-visibility";
import { expandClassIdsToSectionGroupIds } from "@/lib/section-group-classes";
import { getLearnerState } from "@/lib/learner-mode";
import { isCatchUpPathEnabled } from "@/lib/catch-up-deadlines";

type StudentEnrollment = {
    classId: string;
    class: {
        name: string;
        announcement: string | null;
        assignments: {
            id: string;
            title: string | null;
            activityId: string;
            classId: string;
            activity: {
                id: string;
                title: string;
                description: string | null;
                type: string;
                category?: string | null;
            };
            isFeatured: boolean;
            sequenceNumber: number | null;
            unitLabel: string | null;
            dueDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        calendarEvents: {
            id: string;
            title: string;
            description: string | null;
            date: Date;
            endDate: Date | null;
            type: string;
        }[];
    };
};

const NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

function isWithinNewReleaseWindow(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ageMs = Date.now() - date.getTime();
    return ageMs >= 0 && ageMs <= NEW_RELEASE_WINDOW_MS;
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    void trackLogin(userId).catch((err) => {
        logger.warn("Failed to track login for streak", { userId, error: String(err) });
    });

    if (userRole === "student") {
        const learnerState = await withPrismaReadRetry(() => getLearnerState(prisma, userId));
        const learnerMode = learnerState.mode;

        if (learnerMode === "independent") {
            redirect("/dashboard/independent");
        }
    }

        // Student Dashboard
    const enrollments = await timedQuery(
        {
            route: "/dashboard",
            queryLabel: "classEnrollment.findMany.studentDashboard",
            userRole,
        },
        () =>
            withPrismaReadRetry(() =>
                prisma.classEnrollment.findMany({
                    where: { studentId: userId, status: "active" },
                    include: {
                        class: {
                            include: {
                                assignments: {
                                    select: {
                                        id: true,
                                        title: true,
                                        activityId: true,
                                        classId: true,
                                        isFeatured: true,
                                        sequenceNumber: true,
                                        unitLabel: true,
                                        dueDate: true,
                                        createdAt: true,
                                        updatedAt: true,
                                        activity: {
                                            select: {
                                                id: true,
                                                title: true,
                                                description: true,
                                                type: true,
                                                category: true,
                                                isReleased: true,
                                                content: true,
                                            },
                                        },
                                    },
                                    orderBy: [{ sequenceNumber: "asc" }, { createdAt: "asc" }],
                                },
                                calendarEvents: {
                                    select: {
                                        id: true,
                                        title: true,
                                        description: true,
                                        date: true,
                                        endDate: true,
                                        type: true,
                                    },
                                },
                            },
                        },
                    },
                })
            ),
        (result) => result.length
    ) as StudentEnrollment[];

    type ReleasableAssignment = {
        activity: {
            type: string;
            category?: string | null;
            isReleased?: boolean;
        };
    };

    const filterReleasedActivities = (assignment: ReleasableAssignment) => {
        return isLearnerVisibleActivity(assignment.activity);
    };

    const allAssignments = enrollments.flatMap((enrollment: StudentEnrollment) =>
        enrollment.class.assignments
            .filter(filterReleasedActivities)
            .map((assignment) => ({
                ...assignment,
                className: enrollment.class.name,
            }))
    );
    const classAnnouncements = enrollments
        .map((enrollment: StudentEnrollment) => ({
            className: enrollment.class.name,
            message: enrollment.class.announcement?.trim() || "",
            messageHtml: renderAnnouncementMarkdown(enrollment.class.announcement),
        }))
        .filter((announcement) => announcement.message.length > 0);

    const classIds = enrollments.map(e => e.classId);
    const featuredClassIds = await withPrismaReadRetry(() =>
        expandClassIdsToSectionGroupIds(prisma, classIds)
    );
    const featuredAssignmentsRawUnfiltered = featuredClassIds.length === 0 ? [] : await timedQuery(
        {
            route: "/dashboard",
            queryLabel: "assignment.findMany.featuredStudentDashboard",
            userRole,
        },
        () =>
            withPrismaReadRetry(() =>
                prisma.assignment.findMany({
                    where: {
                        classId: { in: featuredClassIds },
                        isFeatured: true,
                        activity: { id: { not: "" } },
                    },
                    include: {
                        activity: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                type: true,
                                category: true,
                                isReleased: true,
                                content: true,
                            },
                        },
                        submissions: {
                            where: { userId },
                            select: {
                                id: true,
                                status: true,
                                completedAt: true,
                                score: true,
                            },
                        },
                    },
                    orderBy: [{ sequenceNumber: "asc" }, { createdAt: "asc" }],
                })
            ),
        (result) => result.length
    );

    const featuredAssignmentsRaw = featuredAssignmentsRawUnfiltered.filter(filterReleasedActivities);

    // Deduplicate by activityId: section-group expansion can return same activity from multiple classes.
    // Prefer assignments from the student's enrolled classes so activity links work (access check requires enrollment).
    const enrolledClassIds = new Set(classIds);
    const featuredAssignmentsDeduped = Array.from(
        featuredAssignmentsRaw
            .reduce<
                Map<
                    string,
                    (typeof featuredAssignmentsRaw)[number]
                >
            >((map, a) => {
                const existing = map.get(a.activityId);
                const aEnrolled = enrolledClassIds.has(a.classId);
                const existingEnrolled = existing ? enrolledClassIds.has(existing.classId) : false;
                const aTime = (a.updatedAt ?? a.createdAt).getTime();
                const existingTime = existing ? (existing.updatedAt ?? existing.createdAt).getTime() : -1;
                const keepNew = !existing || aEnrolled && !existingEnrolled || (aEnrolled === existingEnrolled && aTime > existingTime);
                if (keepNew) map.set(a.activityId, a);
                return map;
            }, new Map())
            .values()
    );

    const featuredActivityIds = Array.from(new Set(featuredAssignmentsDeduped.map((a) => a.activityId)));
    const featuredProgressRows =
        featuredActivityIds.length === 0
            ? []
            : await timedQuery(
                {
                    route: "/dashboard",
                    queryLabel: "activityProgress.findMany.featuredActivities",
                    userRole,
                },
                () =>
                    withPrismaReadRetry(() =>
                        prisma.activityProgress.findMany({
                  where: { userId, activityId: { in: featuredActivityIds } },
                  select: { activityId: true, progress: true, status: true, categoryData: true, updatedAt: true },
                  orderBy: { updatedAt: "desc" },
                        })
                    ),
                (result) => result.length
            );

    const featuredProgressMap = (featuredProgressRows as Array<{
        activityId: string;
        progress: number;
        status: string;
        categoryData: string | null;
    }>).reduce<Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>>(
        (map, row) => {
            if (map.has(row.activityId)) {
                return map;
            }

            map.set(row.activityId, {
                progress: row.progress,
                status: row.status,
                categoryData: parseCategoryData(row.categoryData),
            });
            return map;
        },
        new Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>()
    );

    let dailyVocabHabit = null;
    try {
        dailyVocabHabit = await getDailyVocabHabitForUser(prisma, userId);
    } catch (error) {
        logger.warn("Failed to load daily vocab habit for student dashboard", {
            userId,
            error: String(error),
        });
    }

    const featuredAssignments = featuredAssignmentsDeduped
        .filter((a) => a.activityId !== "vocab-daily-review")
        .map((a) => {
            const p = featuredProgressMap.get(a.activityId);
            const isGrammarGuide =
                (a.activity.type || "").toLowerCase() === "guide" &&
                (a.activity.category || "").toLowerCase() === "grammar";
            const hasPassedMiniQuiz = isGrammarGuide && a.submissions.some(
                (s) => !!s.completedAt && typeof s.score === "number" && s.score > 70
            );

            return {
                ...a,
                featuredAt: a.updatedAt ?? a.createdAt,
                isNewRelease: isWithinNewReleaseWindow(a.updatedAt ?? a.createdAt),
                progress: hasPassedMiniQuiz ? 100 : (p?.progress ?? 0),
                progressStatus: hasPassedMiniQuiz ? "completed" : (p?.status ?? "in_progress"),
                categoryData: p?.categoryData ?? null,
            };
        });

    const calendarEvents: CalendarEvent[] = [
        ...allAssignments
            .filter((a) => a.dueDate)
            .map((a) => ({
                date: a.dueDate as Date,
                type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                title: `${a.title || a.activity.title || "Assignment"}`,
            })),
        ...enrollments.flatMap((enrollment: StudentEnrollment) =>
            enrollment.class.calendarEvents.map((ev: { id: string; date: Date; endDate: Date | null; type: string; title: string; description: string | null }) => ({
                date: ev.date,
                endDate: ev.endDate || null,
                type: (ev.type as CalendarEvent["type"]) || "holiday",
                title: `${ev.title}`,
                description: ev.description,
            }))
        ),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const firstClassId = enrollments[0]?.classId;
    const calendarWeekStart = getCalendarWeekStart();
    const [studentLeaderboard, studentUserStats, studentLedgerEntries] = await Promise.all([
        firstClassId ? getTimeframedLeaderboard("week", 20, firstClassId) : Promise.resolve([]),
        withPrismaReadRetry(() =>
            prisma.user.findUnique({
                where: { id: userId },
                select: { currentStreak: true, longestStreak: true, points: true },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.pointsLedger.findMany({
                where: { userId, createdAt: { gte: calendarWeekStart } },
                select: { createdAt: true },
            })
        ),
    ]);
    const studentSevenDayActivity = buildCalendarWeekActivity(studentLedgerEntries);
    const studentEntry = studentLeaderboard.find((e) => e.id === userId);
    const studentLeaderboardRank = studentEntry && studentEntry.rank <= 3 ? studentEntry.rank : null;
    const studentLeaderboardMedal = studentLeaderboardRank === 1 ? "🥇" : studentLeaderboardRank === 2 ? "🥈" : studentLeaderboardRank === 3 ? "🥉" : null;
    const isMarlie = (session.user as { username?: string })?.username?.toLowerCase() === "marlie";
    const desktopNameEmoji = isMarlie ? "🙋🏻‍♀️" : studentLeaderboardMedal;

    return (
        <div className="min-h-screen bg-bg">
            <main id="main-content" className="container mx-auto pt-2 sm:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
                {/* ── MOBILE + TABLET layout (< lg) ── */}
                <div className="lg:hidden dashboard-shell grid w-full max-w-full min-w-0 grid-cols-1 gap-6 overflow-x-hidden p-0 md:grid-cols-12 md:p-6 md:items-start">
                    <div className="md:col-span-8 min-w-0 space-y-5">
                        <ClassAnnouncement announcements={classAnnouncements} />
                        <div className="md:hidden">
                            <MomentumCard
                                initialStreak={studentUserStats?.currentStreak ?? 0}
                                initialLongestStreak={studentUserStats?.longestStreak ?? 0}
                                initialSevenDayActivity={studentSevenDayActivity}
                                initialTotalPoints={studentUserStats?.points ?? 0}
                            />
                        </div>
                        {isCatchUpPathEnabled && featuredAssignments.some((a) => a.isRequired === true) && <MissedClassCatchUpCard />}
                        <section aria-label="This Week's Path">
                            <TodaysAssignments
                                initialAssignments={featuredAssignments}
                                title="This Week's Path"
                                ctaLabel="Start"
                                variant="checklist"
                                sectionId="weekly-path"
                                pinnedHabit={dailyVocabHabit}
                                mobileTasksLinkHref="/dashboard/activities"
                                mobileTasksLinkLabel="All Activities"
                                hideProgressBar
                            />
                        </section>
                        <ExploreCategoriesCarousel />
                    </div>
                    <aside className="hidden md:block md:col-span-4">
                        <div className="dashboard-panel paper-texture sticky top-4 p-5 space-y-5">
                            <MomentumCard variant="sidebar" initialStreak={studentUserStats?.currentStreak ?? 0} initialLongestStreak={studentUserStats?.longestStreak ?? 0} initialSevenDayActivity={studentSevenDayActivity} initialTotalPoints={studentUserStats?.points ?? 0} />
                            <div className="border-t pt-4" style={{ borderColor: "color-mix(in srgb, var(--dashboard-border) 65%, transparent)" }}>
                                <MiniCalendar compact flat events={calendarEvents} />
                            </div>
                            <div className="border-t pt-4" style={{ borderColor: "color-mix(in srgb, var(--dashboard-border) 65%, transparent)" }}>
                                <UpcomingEventsList events={calendarEvents.filter(event => { const today = new Date(); today.setHours(0,0,0,0); const end = event.endDate ? new Date(event.endDate) : new Date(event.date); end.setHours(0,0,0,0); return end >= today; })} allowDelete={false} showSyncedLabel={false} />
                            </div>
                            <div className="border-t pt-4" style={{ borderColor: "color-mix(in srgb, var(--dashboard-border) 65%, transparent)" }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary shrink-0"><UsersIcon className="h-4 w-4" /></div>
                                    <div className="min-w-0"><h3 className="text-sm font-bold text-text">Invite Friends</h3><p className="text-xs text-text-muted leading-snug">Share your invite link so others can join your learning circle.</p></div>
                                </div>
                                <Link href="/dashboard/invite" className="dashboard-soft-button mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-[var(--dashboard-surface-start)] px-4 py-2.5 text-sm font-semibold text-secondary"><UsersIcon className="h-4 w-4" />Open Invite Link</Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ── DESKTOP layout (lg+) — Option 2: Card-Based & Focused ── */}
                <div className="hidden lg:block">
                    <ClassAnnouncement announcements={classAnnouncements} />
                    {isCatchUpPathEnabled && featuredAssignments.some((a) => a.isRequired === true) && <MissedClassCatchUpCard />}

                    {/* Two-column grid: main left, sidebar right */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_348px] gap-5 items-start">

                        {/* ── Left / Main column ── */}
                        <div className="min-w-0 space-y-5">

                            {/* Welcome header — compact, above the cards */}
                            <div className="pt-2 pb-1">
                                <h1
                                    className="font-display font-bold text-text leading-tight tracking-tight flex items-baseline gap-x-2.5 gap-y-1 flex-wrap"
                                    style={{ textWrap: "balance" } as React.CSSProperties}
                                >
                                    <span className="text-xl text-text-muted font-medium">Welcome back,</span>
                                    <span className="text-[2rem] text-primary relative inline-block leading-none">
                                        {session.user?.name?.trim() || "there"}
                                        <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-[#88A392]/40 -z-10 rounded-sm -rotate-1" />
                                    </span>
                                    {desktopNameEmoji ? (
                                        <span
                                            className="inline-flex text-2xl leading-none"
                                            {...(isMarlie ? { "aria-hidden": true } : { "aria-label": `Rank ${studentLeaderboardRank}` })}
                                        >
                                            {desktopNameEmoji}
                                        </span>
                                    ) : null}
                                </h1>
                                <p className="mt-1 text-sm text-text-muted/90">
                                    {formatDashboardWeekRangeLabel(new Date())} · You&apos;re doing great!
                                </p>
                            </div>

                            {/* This Week's Path — primary focus card */}
                            <div className="dashboard-panel rounded-2xl overflow-hidden">
                                <div className="px-6 pt-5 pb-3 border-b flex items-center justify-between" style={{ borderColor: "var(--dashboard-border)" }}>
                                    <div>
                                        <h2 className="text-lg font-bold font-display text-text leading-tight">This Week&apos;s Path</h2>
                                        <p className="text-xs text-text-muted mt-0.5">Focus on your goals</p>
                                    </div>
                                    <Link
                                        href="/dashboard/map"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        style={{ color: "var(--primary)" }}
                                    >
                                        Full map →
                                    </Link>
                                </div>
                                <TodaysAssignments
                                    weekHub
                                    initialAssignments={featuredAssignments}
                                    title={undefined}
                                    ctaLabel="Start"
                                    variant="checklist"
                                    sectionId="weekly-path"
                                    pinnedHabit={dailyVocabHabit}
                                    hideProgressBar
                                />
                            </div>

                            {/* Explore Activities — secondary card */}
                            <div className="dashboard-panel rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-base font-bold font-display text-text">Explore Activities</h2>
                                    <Link
                                        href="/dashboard/activities"
                                        className="text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        style={{ color: "var(--primary)" }}
                                    >
                                        Browse all →
                                    </Link>
                                </div>
                                <div className="grid grid-cols-6 gap-2.5">
                                    {[
                                        { label: 'Grammar', href: '/dashboard/activities?category=grammar', tone: getLearnerCategoryTone('grammar'), emoji: '📖' },
                                        { label: 'Vocabulary', href: '/dashboard/activities?category=vocabulary', tone: getLearnerCategoryTone('vocabulary'), emoji: '🗂️' },
                                        { label: 'Quizzes', href: '/dashboard/activities?category=quizzes', tone: getLearnerCategoryTone('quizzes'), emoji: '✏️' },
                                        { label: 'Games', href: '/dashboard/activities?category=games', tone: getLearnerCategoryTone('games'), emoji: '🎮' },
                                        { label: 'Pronunciation', href: '/dashboard/activities?category=pronunciation', tone: getLearnerCategoryTone('pronunciation'), emoji: '🔊' },
                                        { label: 'Speaking', href: '/dashboard/activities?category=speaking', tone: getLearnerCategoryTone('speaking'), emoji: '🎤' },
                                    ].map(chip => (
                                        <Link
                                            key={chip.label}
                                            href={chip.href}
                                            className="flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-center transition-all duration-200 active:scale-95 hover:scale-[1.02] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                            style={{
                                                backgroundColor: chip.tone.chipBg,
                                                borderColor: chip.tone.border,
                                            }}
                                        >
                                            <span
                                                className="flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none"
                                                style={{
                                                    background: `color-mix(in srgb, ${chip.tone.accent} 14%, var(--dashboard-surface-start))`,
                                                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${chip.tone.border} 60%, transparent)`,
                                                }}
                                            >
                                                {chip.emoji}
                                            </span>
                                            <span className="text-[11px] font-bold leading-tight" style={{ color: chip.tone.chipText }}>{chip.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Right sidebar ── */}
                        <aside className="space-y-4 sticky top-4">

                            {/* Streak / Momentum card — top of sidebar */}
                            <MomentumCard
                                variant="sidebar"
                                initialStreak={studentUserStats?.currentStreak ?? 0}
                                initialLongestStreak={studentUserStats?.longestStreak ?? 0}
                                initialSevenDayActivity={studentSevenDayActivity}
                                initialTotalPoints={studentUserStats?.points ?? 0}
                            />

                            {/* Calendar card */}
                            <div className="dashboard-panel paper-texture rounded-2xl p-5">
                                <MiniCalendar compact flat events={calendarEvents} />
                                <div className="border-t mt-4 pt-4" style={{ borderColor: "color-mix(in srgb, var(--dashboard-border) 65%, transparent)" }}>
                                    <UpcomingEventsList
                                        events={calendarEvents.filter(event => {
                                            const today = new Date(); today.setHours(0,0,0,0);
                                            const end = event.endDate ? new Date(event.endDate) : new Date(event.date); end.setHours(0,0,0,0);
                                            return end >= today;
                                        })}
                                        allowDelete={false}
                                        showSyncedLabel={false}
                                    />
                                </div>
                            </div>

                            {/* Small utility cards row — Course Map + Invite Friends */}
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/dashboard/map"
                                    className="group dashboard-panel dashboard-panel-hover rounded-2xl p-4 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    style={{
                                        background: "linear-gradient(135deg, color-mix(in srgb, var(--tone-grammar-chip-bg) 55%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)",
                                        borderColor: "color-mix(in srgb, var(--primary) 18%, var(--border-subtle))",
                                    }}
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-lg shadow-sm" style={{ background: "var(--tone-grammar-chip-bg)", border: "1px solid color-mix(in srgb, var(--primary) 14%, transparent)" }}>
                                        🗺️
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-text leading-tight">Course Map</p>
                                        <p className="text-[11px] font-semibold mt-1 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: "var(--primary)" }}>Open map →</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/dashboard/invite"
                                    className="group dashboard-panel dashboard-panel-hover rounded-2xl p-4 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary shrink-0">
                                        <UsersIcon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-text leading-tight">Invite Friends</p>
                                        <p className="text-[11px] font-semibold mt-1 text-secondary transition-transform duration-200 group-hover:translate-x-0.5">Open Invite Link</p>
                                    </div>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>

            </main>

        </div>
    );
}
