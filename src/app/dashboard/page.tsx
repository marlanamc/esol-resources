import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { timedQuery } from "@/lib/shared/perf-log";
import { trackLogin, getTimeframedLeaderboard } from "@/lib/gamification/gamification";
import { getStudentMomentumSnapshot } from "@/lib/dashboard/student-momentum";
import { logger } from "@/lib/shared/logger";
import { parseCategoryData } from "@/lib/categoryData";
import { renderAnnouncementMarkdown } from "@/utils/announcementMarkdown";
import Link from "next/link";
import {
    MiniCalendar,
    CalendarEvent,
    UpcomingEventsList,
    ClassAnnouncement,
    NewThisWeekSection,
    MissedClassCatchUpCard,
    MomentumCard,
    ExploreCategoriesCarousel,
    AllActivitiesCategoriesPanel,
    DashboardWelcomeHeader,
    PinnedDailyHabitRow,
} from "@/components/dashboard";
import { MobileStudentGreeting } from "@/components/dashboard/MobileStudentGreeting";
import { ContinueLearningRow } from "@/components/dashboard/ContinueLearningRow";
import { DashboardResumeHero } from "@/components/dashboard/DashboardResumeHero";
import { DashboardNextStepFallbackCard } from "@/components/dashboard/DashboardNextStepFallbackCard";
import { formatDashboardWeekRangeLabel } from "@/lib/dashboard/week-range-label";
import { isLearnerVisibleActivity } from "@/lib/learner/visibility";
import { buildActivityHref } from "@/lib/learner/navigation";
import { expandClassIdsToSectionGroupIds } from "@/lib/section-group-classes";
import { getLearnerState } from "@/lib/learner-mode";
import { isCatchUpPathEnabled } from "@/lib/catch-up-deadlines";
import { AdminViewSwitcher } from "@/components/dashboard/AdminViewSwitcher";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { persistLearnerPreview } from "@/lib/learner-preview";
import { canUseTeacherTools } from "@/lib/auth/roles";
import { getDailyVocabHabitForUser } from "@/lib/daily-habits";

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

function FeaturedFallbackRow() {
    const cards = [
        {
            title: "Level 3 Group Trivia",
            meta: "Game · 10 min",
            emoji: "🎮",
            href: "/dashboard/activities?category=games",
        },
        {
            title: "Comparison Battle",
            meta: "Game · 10 min",
            emoji: "🎮",
            href: "/dashboard/activities?category=games",
        },
    ];

    return (
        <section aria-label="Featured for you">
            <div className="mb-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="h-[2px] w-6 shrink-0 rounded-full bg-primary" aria-hidden />
                    <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-primary">
                        Featured for you
                    </h2>
                </div>
                <Link
                    href="/dashboard/activities"
                    className="rounded text-sm font-bold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                >
                    View all →
                </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="group flex items-stretch overflow-hidden rounded-[18px] border transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(40,31,23,0.05),0_10px_24px_rgba(40,31,23,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                        style={{
                            background: "var(--surface-elevated, #ffffff)",
                            borderColor: "color-mix(in srgb, var(--dashboard-border) 72%, transparent)",
                            boxShadow: "0 1px 2px rgba(40,31,23,0.04), 0 6px 18px rgba(40,31,23,0.05)",
                        }}
                    >
                        {/* Category accent stripe — games tone */}
                        <span
                            className="w-[3px] shrink-0 self-stretch rounded-l-[18px]"
                            style={{ background: "var(--tone-games-accent, #b05740)" }}
                            aria-hidden
                        />
                        <span className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5">
                            <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-base leading-none"
                                style={{
                                    background: "color-mix(in srgb, var(--tone-games-chip-bg, rgba(176,87,64,0.12)) 78%, transparent)",
                                    boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--tone-games-border, rgba(176,87,64,0.28)) 40%, transparent)",
                                }}
                                aria-hidden
                            >
                                {card.emoji}
                            </span>
                            <span className="min-w-0 flex-1 space-y-1">
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-2 py-[3px] text-[10px] font-semibold uppercase leading-none tracking-wide text-primary">
                                    Featured
                                </span>
                                <span className="block truncate text-[15px] font-bold leading-tight text-text">
                                    {card.title}
                                </span>
                                <span className="block text-xs text-text-muted/90">
                                    {card.meta}
                                </span>
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    if (
        canUseTeacherTools(session.user) &&
        (await isAdminInStudentMode(session.user))
    ) {
        await persistLearnerPreview(userId, "classroom");
    }

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

    const newThisWeekItems = featuredAssignments;
    const nextStepAssignment = featuredAssignments[0] ?? allAssignments[0] ?? null;
    const nextStepFallback = nextStepAssignment ? (
        <DashboardNextStepFallbackCard
            href={buildActivityHref(nextStepAssignment.activityId, nextStepAssignment.id)}
            title={nextStepAssignment.title || nextStepAssignment.activity.title}
            type={nextStepAssignment.activity.type}
            category={nextStepAssignment.activity.category}
            minutes={nextStepAssignment.activity.type?.toLowerCase() === "guide" ? 5 : 10}
        />
    ) : (
        <DashboardNextStepFallbackCard
            href="/dashboard/activities?category=games"
            title="Vocab: Digital Habits"
            type="game"
            category="games"
            minutes={10}
            icon="🎮"
        />
    );

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
    const [studentLeaderboard, momentumSnapshot, dailyVocabHabit] = await Promise.all([
        firstClassId ? getTimeframedLeaderboard("week", 20, firstClassId) : Promise.resolve([]),
        getStudentMomentumSnapshot(userId),
        getDailyVocabHabitForUser(prisma, userId),
    ]);
    const studentEntry = studentLeaderboard.find((e) => e.id === userId);
    const studentLeaderboardRank = studentEntry?.rank ?? null;
    const studentLeaderboardMedal = studentLeaderboardRank === 1 ? "🥇" : studentLeaderboardRank === 2 ? "🥈" : studentLeaderboardRank === 3 ? "🥉" : null;
    const isMarlie = (session.user as { username?: string })?.username?.toLowerCase() === "marlie";
    const desktopNameEmoji = isMarlie ? "🙋🏻‍♀️" : studentLeaderboardMedal;

    return (
        <div className="min-h-screen bg-bg">
            <main id="main-content" className="container mx-auto pt-0 md:pt-6 pb-24 md:pb-12 px-3 sm:px-6 md:px-7 lg:px-8 max-w-full lg:max-w-[1600px] lg:pt-4">
                <AdminViewSwitcher user={{ id: userId, role: userRole }} currentView="classroom" />
                {/* ── MOBILE + TABLET layout (< lg) ── */}
                <div className="lg:hidden dashboard-shell grid w-full max-w-full min-w-0 grid-cols-1 gap-0 p-0 md:p-6">
                    <div className="min-w-0 space-y-5">
                        <div className="md:hidden">
                            <MobileStudentGreeting
                                userName={session.user?.name?.trim() || "there"}
                                {...momentumSnapshot}
                            />
                        </div>
                        <ClassAnnouncement announcements={classAnnouncements} />
                        {isCatchUpPathEnabled && featuredAssignments.some((a) => a.isRequired === true) && <MissedClassCatchUpCard />}
                        <DashboardResumeHero user={{ id: userId, role: userRole }} fallback={nextStepFallback} heroStyle />
                        <ContinueLearningRow
                            vocabHabit={dailyVocabHabit}
                            items={newThisWeekItems}
                        />
                        <ExploreCategoriesCarousel />
                    </div>
                </div>

                {/* ── DESKTOP layout (lg+) — Option 2: Card-Based & Focused ── */}
                <div className="hidden lg:block">
                    <ClassAnnouncement announcements={classAnnouncements} />
                    {isCatchUpPathEnabled && featuredAssignments.some((a) => a.isRequired === true) && <MissedClassCatchUpCard />}

                    {/* Two-column grid: main left, sidebar right */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_348px] gap-5 items-start">

                        {/* ── Left / Main column ── */}
                        <div className="min-w-0 space-y-3">

                            <div className="hidden lg:block">
                                <DashboardWelcomeHeader
                                    userName={session.user?.name?.trim() || "there"}
                                    mode="classroom"
                                    weekLabel={formatDashboardWeekRangeLabel(new Date())}
                                    nameEmoji={desktopNameEmoji}
                                />
                            </div>

                            <DashboardResumeHero user={{ id: session.user.id, role: session.user.role }} fallback={nextStepFallback} />

                            {dailyVocabHabit ? (
                                <section aria-label="Daily vocab review">
                                    <PinnedDailyHabitRow habit={dailyVocabHabit} compact ctaVariant="vocabulary" />
                                </section>
                            ) : null}

                            {newThisWeekItems.length > 0 ? (
                                <NewThisWeekSection items={newThisWeekItems} />
                            ) : (
                                <FeaturedFallbackRow />
                            )}

                            <AllActivitiesCategoriesPanel />
                        </div>

                        {/* ── Right sidebar ── */}
                        <aside className="space-y-3 sticky top-4">

                            {/* Streak / Momentum card — top of sidebar */}
                            <MomentumCard variant="sidebar" {...momentumSnapshot} />

                            <div className="dashboard-panel paper-texture rounded-2xl p-4">
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

                        </aside>
                    </div>
                </div>

            </main>

        </div>
    );
}
