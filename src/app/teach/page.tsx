import TeacherReportCard from "@/components/dashboard/TeacherReportCard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Plus, CalendarDays, Map } from "lucide-react";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { resolveTeachClassId } from "@/lib/teach/active-class";
import { getClassParticipation } from "@/lib/teach/participation";
import { participationStatus } from "@/lib/teach/participation-status";
import { getVisibleWeekIdsForClasses } from "@/lib/course-map";
import { getClassQuizCompletion, type QuizCompletion } from "@/lib/teach/quiz-completion";
import { ClassAnnouncementEditor } from "@/components/dashboard/ClassAnnouncementEditor";
import { ClassQuestionsPanel } from "@/components/teach/ClassQuestionsPanel";
import { StudyLogPanel } from "@/components/teach/StudyLogPanel";
import { TeachHomeTabs, type TeachHomeTab } from "@/components/teach/TeachHomeTabs";
import { resolveScheduledTeachingWeek } from "@/lib/course-map-current-week";
import { getLearnerDayKey } from "@/lib/daily-habits";
import {
    addDaysToDayKey,
    getCalendarWeekStartDayKey,
    getInstantForLearnerDayStart,
} from "@/lib/gamification/calendar-week";

export default async function TeachHomePage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string; view?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");
    const params = await searchParams;
    const { classId } = await resolveTeachClassId(
        session.user.id,
        isAdmin(session.user),
        params.classId,
    );
    if (!classId)
        return (
            <div className="space-y-5">
                <h1 className="font-display text-3xl font-bold">
                    Your teaching workspace
                </h1>
                <p className="text-text-muted">
                    Create a class to assign activities and follow student
                    participation.
                </p>
                <Link
                    className="workspace-button workspace-button-primary"
                    href="/teach/classes/new"
                >
                    Create a class
                </Link>
            </div>
        );
    const now = new Date().getTime();
    const [cls, students, visibleWeekIds] = await Promise.all([
        prisma.class.findUnique({
            where: { id: classId },
            select: {
                name: true,
                code: true,
                announcement: true,
                assignments: {
                    where: {
                        dueDate: {
                            gte: new Date(now),
                            lte: new Date(now + 14 * 86400000),
                        },
                    },
                    orderBy: { dueDate: "asc" },
                    take: 4,
                    select: {
                        id: true,
                        title: true,
                        dueDate: true,
                        activity: { select: { title: true } },
                    },
                },
            },
        }),
        getClassParticipation(classId),
        getVisibleWeekIdsForClasses([classId]),
    ]);
    if (!cls) redirect("/teach/classes");
    const scheduledWeek = resolveScheduledTeachingWeek(new Date(now))?.weekNumber ?? 1;
    // Same Mon–Sun week the practice log panel opens on.
    const logWeekStart = getCalendarWeekStartDayKey(new Date(now));
    const openQuestionsWhere = {
        classId,
        answeredAt: null,
        weekNumber: { lte: scheduledWeek + 1 },
    };
    const [week, quizCompletion, pendingQuestion, openQuestions, toReply] =
        await Promise.all([
            prisma.courseWeek.findFirst({
                where: { id: { in: [...visibleWeekIds] } },
                orderBy: { number: "desc" },
                select: { number: true, title: true },
            }),
            getClassQuizCompletion(classId, students, new Date(now)),
            // Open on the newest week with unanswered questions (students can ask a week early).
            prisma.classQuestion
                .findFirst({
                    where: openQuestionsWhere,
                    orderBy: { weekNumber: "desc" },
                    select: { weekNumber: true },
                })
                .catch(() => null),
            prisma.classQuestion
                .count({ where: openQuestionsWhere })
                .catch(() => 0),
            students.length
                ? prisma.studyLog
                      .count({
                          where: {
                              userId: { in: students.map((s) => s.id) },
                              dayKey: {
                                  gte: logWeekStart,
                                  lte: addDaysToDayKey(logWeekStart, 6),
                              },
                              repliedAt: null,
                          },
                      })
                      .catch(() => 0)
                : 0,
        ]);
    const counts = { active: 0, inactive: 0, never: 0 };
    students.forEach((s) => counts[participationStatus(s.lastActive, now)]++);
    const todayStart = getInstantForLearnerDayStart(
        getLearnerDayKey(new Date(now)),
    );
    const activeToday = students.filter(
        (s) => s.lastActive && s.lastActive >= todayStart,
    ).length;
    const latestQuiz = quizCompletion[0];
    const report = `/teach/reports?classId=${encodeURIComponent(classId)}`;
    const checkIns = students
        .filter((s) => participationStatus(s.lastActive, now) !== "active")
        .sort((a, b) =>
            (a.name || a.username).localeCompare(b.name || b.username),
        )
        .slice(0, 5);

    const tabs: TeachHomeTab[] = [
        {
            id: "questions",
            label: "Questions",
            count: openQuestions,
            hint: openQuestions === 1 ? "new question" : "new questions",
            attention: true,
            panel: (
                <ClassQuestionsPanel
                    classId={classId}
                    initialWeek={pendingQuestion?.weekNumber ?? scheduledWeek}
                />
            ),
        },
        {
            id: "log",
            label: "Practice log",
            count: toReply,
            hint: "sentences to reply to this week",
            attention: true,
            panel: <StudyLogPanel classId={classId} />,
        },
        {
            id: "quizzes",
            label: "Quizzes",
            count: latestQuiz?.missing.length ?? 0,
            hint: latestQuiz
                ? `haven't finished ${latestQuiz.title}`
                : "No quiz open yet",
            attention: true,
            panel: (
                <QuizCompletionPanel
                    classId={classId}
                    quizzes={quizCompletion}
                    now={now}
                />
            ),
        },
        {
            id: "activity",
            label: "Recent activity",
            count: activeToday,
            hint:
                activeToday === 1
                    ? "student active today"
                    : "students active today",
            panel: (
                <div className="grid xl:grid-cols-[1.6fr_1fr] gap-6 items-start">
                    <div className="min-w-0">
                        <TeacherReportCard
                            studentReturnTo={`/teach?classId=${classId}&view=activity`}
                            activeClassId={classId}
                            showClassFilter={false}
                            compact
                        />
                    </div>
                    <section className="workspace-panel">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="font-display text-xl font-bold">
                                Student participation
                            </h2>
                            <Link
                                href={report}
                                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
                            >
                                View all <ArrowRight size={16} />
                            </Link>
                        </div>
                        <p className="text-sm text-text-muted mt-1">
                            {students.length} students included in reporting
                        </p>
                        <div className="divide-y divide-border mt-4">
                            {(
                                [
                                    {
                                        status: "active",
                                        label: "Active in the last 7 days",
                                    },
                                    {
                                        status: "inactive",
                                        label: "No activity for 7+ days",
                                    },
                                    {
                                        status: "never",
                                        label: "Not started yet",
                                    },
                                ] as const
                            ).map((item) => (
                                <Link
                                    key={item.status}
                                    href={`${report}&status=${item.status}`}
                                    className="flex items-center gap-3 py-4 min-h-11 hover:text-primary"
                                >
                                    <span
                                        className={`font-display text-3xl font-bold tabular-nums w-12 ${item.status === "active" ? "text-primary" : "text-text"}`}
                                    >
                                        {counts[item.status]}
                                    </span>
                                    <span className="text-sm flex-1">
                                        {item.label}
                                    </span>
                                    <ArrowRight
                                        size={16}
                                        className="text-text-muted"
                                    />
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-border pt-5 mt-2">
                            <h3 className="workspace-eyebrow mb-3">
                                Check in with
                            </h3>
                            {checkIns.length ? (
                                <ul className="space-y-1">
                                    {checkIns.map((s) => (
                                        <li key={s.id}>
                                            <Link
                                                className="flex items-center justify-between gap-3 min-h-11 text-sm"
                                                href={`/teach/students/${s.id}?classId=${classId}&returnTo=${encodeURIComponent(report)}`}
                                            >
                                                <span className="font-medium break-words">
                                                    {s.name || s.username}
                                                </span>
                                                <span className="text-xs text-text-muted shrink-0">
                                                    {s.lastActive
                                                        ? "7+ days away"
                                                        : "Not started"}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-text-muted">
                                    {students.length
                                        ? "Everyone has been active in the last seven days."
                                        : "Participation will appear here as students join."}
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-text-muted mt-4 leading-relaxed">
                            Participation reflects app activity, not mastery.
                            Reporting excludes system accounts and students
                            excluded from reporting.
                        </p>
                    </section>
                </div>
            ),
        },
    ];
    // An explicit ?view wins; otherwise open on the first tile that needs something.
    const initialTab =
        params.view ??
        tabs.find((t) => t.attention && t.count > 0)?.id ??
        "activity";

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="workspace-eyebrow mb-2">Your classroom</p>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold">
                        Ready for class
                    </h1>
                    <p className="mt-2 text-sm text-text-muted">
                        {cls.name} <span aria-hidden="true">·</span> Join code{" "}
                        <span className="font-semibold tracking-wider text-text">
                            {cls.code}
                        </span>
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        className="workspace-button"
                        href={`/teach/classes/${classId}`}
                    >
                        Class details <ArrowRight size={16} />
                    </Link>
                    <Link
                        className="workspace-button workspace-button-primary"
                        href={`/teach/classes/${classId}/assignments/new`}
                    >
                        <Plus size={16} />
                        Assign work
                    </Link>
                </div>
            </div>
            <TeachHomeTabs key={classId} tabs={tabs} initialTab={initialTab} />
            <section
                className="workspace-panel space-y-5"
                aria-labelledby="class-setup-heading"
            >
                <h2
                    id="class-setup-heading"
                    className="font-display text-xl font-bold"
                >
                    Class setup
                </h2>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                    <div>
                        <p className="workspace-eyebrow mb-2">
                            Available to students
                        </p>
                        <p className="text-lg font-semibold">
                            {week
                                ? `Week ${week.number} · ${week.title}`
                                : "No course weeks available yet"}
                        </p>
                        <Link
                            className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-primary mt-1"
                            href={`/teach/map?classId=${classId}`}
                        >
                            <Map size={16} />
                            Manage course releases <ArrowRight size={15} />
                        </Link>
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold">
                                Due in the next two weeks
                            </h3>
                            <Link
                                href={`/teach/calendar?classId=${classId}`}
                                aria-label="Open calendar"
                                className="workspace-icon-button text-primary"
                            >
                                <CalendarDays size={19} />
                            </Link>
                        </div>
                        {cls.assignments.length ? (
                            <ul className="divide-y divide-border">
                                {cls.assignments.map((a) => (
                                    <li key={a.id}>
                                        <Link
                                            className="flex items-start justify-between gap-4 py-3 min-h-11 text-sm"
                                            href={`/teach/classes/${classId}/assignments/${a.id}/submissions`}
                                        >
                                            <span className="font-medium">
                                                {a.title || a.activity.title}
                                            </span>
                                            <time
                                                className="shrink-0 text-text-muted"
                                                dateTime={a.dueDate?.toISOString()}
                                            >
                                                {a.dueDate?.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        timeZone:
                                                            "America/New_York",
                                                    },
                                                )}
                                            </time>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-text-muted py-3">
                                No upcoming deadlines. Assign an activity when
                                you’re ready.
                            </p>
                        )}
                    </div>
                </div>
                <details className="border-t border-border pt-4">
                    <summary className="min-h-11 cursor-pointer text-sm font-semibold">
                        {cls.announcement
                            ? "Edit class announcement"
                            : "Add a class announcement"}
                    </summary>
                    <div className="pt-2">
                        <ClassAnnouncementEditor
                            key={classId}
                            classId={classId}
                            initialAnnouncement={cls.announcement}
                        />
                    </div>
                </details>
            </section>
        </div>
    );
}

/** Released quizzes, newest first, with the students still missing each one listed by name. */
function QuizCompletionPanel({
    classId,
    quizzes,
    now,
}: {
    classId: string;
    quizzes: QuizCompletion[];
    now: number;
}) {
    return (
        <section
            className="workspace-panel space-y-4"
            aria-labelledby="quiz-completion-heading"
        >
            <h2
                id="quiz-completion-heading"
                className="font-display text-xl font-bold"
            >
                Who hasn&apos;t finished the quiz
            </h2>
            {quizzes.length ? (
                <ul className="divide-y divide-border border-y border-border">
                    {quizzes.map((q) => (
                        <li key={q.id} className="py-4 text-sm space-y-2">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <span className="font-semibold">{q.title}</span>
                                <span className="text-text-muted">
                                    {now > q.dueAt.getTime() ? "Was due" : "Due"}{" "}
                                    {q.dueAt.toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        timeZone: "America/New_York",
                                    })}
                                </span>
                            </div>
                            {q.missing.length ? (
                                <>
                                    <p className="text-text-muted">
                                        <b className="text-text">
                                            {q.missing.length}
                                        </b>{" "}
                                        of {q.expected} students still need to
                                        finish
                                    </p>
                                    <ul className="flex flex-wrap gap-2">
                                        {q.missing.map((s) => (
                                            <li key={s.id}>
                                                <Link
                                                    className="workspace-button"
                                                    href={`/teach/students/${s.id}?classId=${classId}`}
                                                >
                                                    {s.name || s.username}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="text-text-muted">
                                    All {q.expected} students finished
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-text-muted">
                    No quizzes are open for this class yet.
                </p>
            )}
        </section>
    );
}
