import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { timedQuery } from "@/lib/perf-log";
import { GradebookClient } from "./GradebookClient";
import { normalizeGuideTitle } from "@/lib/grammar-activity-resolution";
import { isTeacherAdmin } from "@/lib/roles";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

export default async function GradebookPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string; page?: string; pageSize?: string; q?: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;
    const admin = isTeacherAdmin(session.user);

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const selectedClassId = params.classId || null;
    const searchQuery = (params.q || "").trim();
    const requestedPage = parsePositiveInt(params.page, DEFAULT_PAGE);
    const requestedPageSize = Math.min(MAX_PAGE_SIZE, parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE));

    const classes = await timedQuery(
        {
            route: "/dashboard/gradebook",
            queryLabel: "class.findMany.gradebookClasses",
            userRole,
        },
        () =>
            withPrismaReadRetry(() =>
                prisma.class.findMany({
                    where: admin ? {} : { teacherId: userId },
                    select: {
                        id: true,
                        name: true,
                        enrollments: {
                            select: {
                                student: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                })
            ),
        (result) => result.length
    );

    const filteredClasses = selectedClassId
        ? classes.filter((c) => c.id === selectedClassId)
        : classes;

    const classOptions = classes.map((c) => ({
        id: c.id,
        name: c.name,
    }));

    const studentIds = Array.from(
        new Set(filteredClasses.flatMap((c) => c.enrollments.map((e) => e.student.id)))
    );

    const studentWhere = {
        id: { in: studentIds },
        ...(searchQuery
            ? {
                OR: [
                    { name: { contains: searchQuery, mode: "insensitive" as const } },
                    { username: { contains: searchQuery, mode: "insensitive" as const } },
                ],
            }
            : {}),
    };

    const totalStudents = studentIds.length === 0
        ? 0
        : await timedQuery(
            {
                route: "/dashboard/gradebook",
                queryLabel: "user.count.gradebookStudents",
                userRole,
            },
            () => withPrismaReadRetry(() => prisma.user.count({ where: studentWhere }))
        );

    const totalPages = Math.max(1, Math.ceil(totalStudents / requestedPageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const skip = (currentPage - 1) * requestedPageSize;

    const students = studentIds.length === 0
        ? []
        : await timedQuery(
            {
                route: "/dashboard/gradebook",
                queryLabel: "user.findMany.gradebookStudentsPage",
                userRole,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.user.findMany({
                        where: studentWhere,
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                        orderBy: {
                            name: "asc",
                        },
                        skip,
                        take: requestedPageSize,
                    })
                ),
            (result) => result.length
        );

    const pagedStudentIds = students.map((student) => student.id);

    const activities = await timedQuery(
        {
            route: "/dashboard/gradebook",
            queryLabel: "activity.findMany.gradebookGrammarActivities",
            userRole,
        },
        () =>
            withPrismaReadRetry(() =>
                prisma.activity.findMany({
                    where: {
                        category: "grammar",
                        type: "guide",
                        isReleased: true,
                    },
                    select: {
                        id: true,
                        title: true,
                        content: true,
                    },
                    orderBy: {
                        title: "asc",
                    },
                })
            ),
        (result) => result.length
    );

    const activitiesWithQuizzes = activities
        .filter((activity) => {
            try {
                const content = JSON.parse(activity.content);
                return !!content.miniQuiz;
            } catch {
                return false;
            }
        })
        .map((a) => ({
            id: a.id,
            title: a.title.replace(" Guide", "").replace(" Guide", ""),
        }));

    const rawSubmissions = pagedStudentIds.length === 0
        ? []
        : await timedQuery(
            {
                route: "/dashboard/gradebook",
                queryLabel: "submission.findMany.gradebookSubmissions",
                userRole,
            },
            () =>
                withPrismaReadRetry(() =>
                    prisma.submission.findMany({
                        where: {
                            userId: { in: pagedStudentIds },
                            score: { not: null },
                            activity: {
                                category: "grammar",
                                type: "guide",
                            },
                        },
                        select: {
                            userId: true,
                            activityId: true,
                            score: true,
                            updatedAt: true,
                            activity: {
                                select: {
                                    title: true,
                                },
                            },
                        },
                    })
                ),
            (result) => result.length
        );

    const displayActivityIds = new Set(activitiesWithQuizzes.map((a) => a.id));
    const displayIdByNormalizedTitle = new Map(
        activitiesWithQuizzes.map((a) => [normalizeGuideTitle(a.title), a.id] as const)
    );

    const submissionByKey = new Map<string, { userId: string; activityId: string; score: number; updatedAt: Date }>();
    for (const submission of rawSubmissions) {
        if (submission.score === null) continue;

        const canonicalActivityId = displayActivityIds.has(submission.activityId)
            ? submission.activityId
            : displayIdByNormalizedTitle.get(normalizeGuideTitle(submission.activity.title));

        if (!canonicalActivityId) continue;

        const key = `${submission.userId}:${canonicalActivityId}`;
        const existing = submissionByKey.get(key);
        if (!existing || submission.updatedAt > existing.updatedAt) {
            submissionByKey.set(key, {
                userId: submission.userId,
                activityId: canonicalActivityId,
                score: submission.score,
                updatedAt: submission.updatedAt,
            });
        }
    }

    const submissions = Array.from(submissionByKey.values());

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard/stats" className="mb-1">Back to Stats</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Grammar Gradebook
                        </h1>
                        <p className="text-sm text-text-muted">
                            A complete overview of mini-quiz scores across all grammar guides.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
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
            </main>
        </div>
    );
}
