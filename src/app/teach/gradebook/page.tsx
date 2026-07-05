import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { timedQuery } from "@/lib/shared/perf-log";
import { GradebookClient } from "@/app/dashboard/gradebook/GradebookClient";
import { normalizeGuideTitle } from "@/lib/grammar-activity-resolution";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";

export const metadata = { title: "Gradebook | Class Companion" };

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

export default async function TeachGradebookPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string; page?: string; pageSize?: string; q?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");

    const userRole = session.user.role || "student";
    const userId = session.user.id;
    const admin = isAdmin(session.user);

    const params = await searchParams;
    const selectedClassId = params.classId || null;
    const searchQuery = (params.q || "").trim();
    const requestedPage = parsePositiveInt(params.page, DEFAULT_PAGE);
    const requestedPageSize = Math.min(MAX_PAGE_SIZE, parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE));

    const classes = await timedQuery(
        { route: "/teach/gradebook", queryLabel: "class.findMany.gradebookClasses", userRole },
        () => withPrismaReadRetry(() =>
            prisma.class.findMany({
                where: admin ? {} : { teacherId: userId },
                select: {
                    id: true,
                    name: true,
                    enrollments: {
                        where: { student: { isSystemAccount: false } },
                        select: { student: { select: { id: true } } },
                    },
                },
            })
        ),
        (r) => r.length
    );

    const filteredClasses = selectedClassId ? classes.filter((c) => c.id === selectedClassId) : classes;
    const classOptions = classes.map((c) => ({ id: c.id, name: c.name }));
    const studentIds = Array.from(new Set(filteredClasses.flatMap((c) => c.enrollments.map((e) => e.student.id))));

    const studentWhere = {
        id: { in: studentIds },
        isSystemAccount: false,
        ...(searchQuery ? {
            OR: [
                { name: { contains: searchQuery, mode: "insensitive" as const } },
                { username: { contains: searchQuery, mode: "insensitive" as const } },
            ],
        } : {}),
    };

    const totalStudents = studentIds.length === 0 ? 0 : await timedQuery(
        { route: "/teach/gradebook", queryLabel: "user.count.gradebookStudents", userRole },
        () => withPrismaReadRetry(() => prisma.user.count({ where: studentWhere })),
    );

    const totalPages = Math.max(1, Math.ceil(totalStudents / requestedPageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const skip = (currentPage - 1) * requestedPageSize;

    const students = studentIds.length === 0 ? [] : await timedQuery(
        { route: "/teach/gradebook", queryLabel: "user.findMany.gradebookStudentsPage", userRole },
        () => withPrismaReadRetry(() =>
            prisma.user.findMany({
                where: studentWhere,
                select: { id: true, name: true, username: true },
                orderBy: { name: "asc" },
                skip,
                take: requestedPageSize,
            })
        ),
        (r) => r.length
    );

    const pagedStudentIds = students.map((s) => s.id);

    const activities = await timedQuery(
        { route: "/teach/gradebook", queryLabel: "activity.findMany.grammarActivities", userRole },
        () => withPrismaReadRetry(() =>
            prisma.activity.findMany({
                where: { category: "grammar", type: "guide", isReleased: true },
                select: { id: true, title: true, content: true },
                orderBy: { title: "asc" },
            })
        ),
        (r) => r.length
    );

    const activitiesWithQuizzes = activities
        .filter((a) => { try { return !!(JSON.parse(a.content) as { miniQuiz?: unknown }).miniQuiz; } catch { return false; } })
        .map((a) => ({ id: a.id, title: a.title.replace(" Guide", "") }));

    const rawSubmissions = pagedStudentIds.length === 0 ? [] : await timedQuery(
        { route: "/teach/gradebook", queryLabel: "submission.findMany.gradebookSubmissions", userRole },
        () => withPrismaReadRetry(() =>
            prisma.submission.findMany({
                where: {
                    userId: { in: pagedStudentIds },
                    score: { not: null },
                    activity: { category: "grammar", type: "guide" },
                },
                select: {
                    userId: true, activityId: true, score: true, updatedAt: true,
                    activity: { select: { title: true } },
                },
            })
        ),
        (r) => r.length
    );

    const displayActivityIds = new Set(activitiesWithQuizzes.map((a) => a.id));
    const displayIdByNormalizedTitle = new Map(activitiesWithQuizzes.map((a) => [normalizeGuideTitle(a.title), a.id] as const));
    const submissionByKey = new Map<string, { userId: string; activityId: string; score: number; updatedAt: Date }>();

    for (const s of rawSubmissions) {
        if (s.score === null) continue;
        const canonicalId = displayActivityIds.has(s.activityId)
            ? s.activityId
            : displayIdByNormalizedTitle.get(normalizeGuideTitle(s.activity.title));
        if (!canonicalId) continue;
        const key = `${s.userId}:${canonicalId}`;
        const existing = submissionByKey.get(key);
        if (!existing || s.updatedAt > existing.updatedAt) {
            submissionByKey.set(key, { userId: s.userId, activityId: canonicalId, score: s.score, updatedAt: s.updatedAt });
        }
    }

    const submissions = Array.from(submissionByKey.values());

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Assessment
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    Grammar Gradebook
                </h1>
                <p className="text-sm text-text-muted mt-1">
                    Mini-quiz scores across all grammar guides.
                </p>
            </div>

            <GradebookClient
                students={students}
                activities={activitiesWithQuizzes}
                submissions={submissions}
                classes={classOptions}
                selectedClassId={selectedClassId}
                searchQuery={searchQuery}
                pagination={{
                    page: currentPage,
                    pageSize: requestedPageSize,
                    total: totalStudents,
                    totalPages,
                }}
            />
        </div>
    );
}
