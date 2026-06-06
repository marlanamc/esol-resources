import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";
import { getDiagnosableGrammarGuides } from "@/lib/diagnostics/grammar-guides";
import { DiagnosticReport } from "@/components/dashboard/DiagnosticReport";
import { AdminDiagnosticsPicker } from "@/components/admin/AdminDiagnosticsPicker";
import { AlertTriangle, BarChart3, BookOpen, CheckCircle2, Users } from "lucide-react";

export const metadata = { title: "Skill Diagnostics | Admin" };

type QuickReport = {
    classId: string;
    className: string;
    activityId: string;
    activityTitle: string;
    responseCount: number;
    accuracy: number;
    strugglingSkills: number;
    lastAttemptAt: Date;
};

async function getQuickReports(guides: { id: string; title: string }[]): Promise<QuickReport[]> {
    const guideIds = guides.map((g) => g.id);
    const guideTitleById = new Map(guides.map((g) => [g.id, g.title]));

    if (guideIds.length === 0) return [];

    const classes = await prisma.class.findMany({
        select: {
            id: true,
            name: true,
            enrollments: {
                where: { status: "active", student: { isSystemAccount: false } },
                select: { studentId: true },
            },
        },
        orderBy: { name: "asc" },
    });

    const studentToClasses = new Map<string, Array<{ id: string; name: string }>>();
    for (const cls of classes) {
        for (const enrollment of cls.enrollments) {
            const existing = studentToClasses.get(enrollment.studentId) ?? [];
            existing.push({ id: cls.id, name: cls.name });
            studentToClasses.set(enrollment.studentId, existing);
        }
    }

    const allStudentIds = [...studentToClasses.keys()];
    if (allStudentIds.length === 0) return [];

    const responses = await prisma.quizResponse.findMany({
        where: {
            userId: { in: allStudentIds },
            activityId: { in: guideIds },
            skillTag: { not: null },
        },
        select: {
            userId: true,
            activityId: true,
            skillTag: true,
            isCorrect: true,
            createdAt: true,
        },
    });

    type Bucket = {
        classId: string;
        className: string;
        activityId: string;
        responses: typeof responses;
    };

    const buckets = new Map<string, Bucket>();

    for (const response of responses) {
        const memberships = studentToClasses.get(response.userId) ?? [];
        for (const membership of memberships) {
            const key = `${membership.id}:${response.activityId}`;
            const bucket = buckets.get(key) ?? {
                classId: membership.id,
                className: membership.name,
                activityId: response.activityId,
                responses: [],
            };
            bucket.responses.push(response);
            buckets.set(key, bucket);
        }
    }

    const quickReports: QuickReport[] = [];

    for (const bucket of buckets.values()) {
        if (bucket.responses.length === 0) continue;

        const skillStats = new Map<string, { correct: number; total: number }>();
        for (const row of bucket.responses) {
            const skillTag = row.skillTag!;
            const stat = skillStats.get(skillTag) ?? { correct: 0, total: 0 };
            stat.total++;
            if (row.isCorrect) stat.correct++;
            skillStats.set(skillTag, stat);
        }

        const strugglingSkills = [...skillStats.values()].filter(
            (stat) => stat.total > 0 && (stat.correct / stat.total) * 100 < 60
        ).length;

        const correct = bucket.responses.filter((row) => row.isCorrect).length;
        const lastAttemptAt = bucket.responses.reduce(
            (latest, row) => (row.createdAt > latest ? row.createdAt : latest),
            bucket.responses[0]!.createdAt
        );

        quickReports.push({
            classId: bucket.classId,
            className: bucket.className,
            activityId: bucket.activityId,
            activityTitle: guideTitleById.get(bucket.activityId) ?? "Grammar guide",
            responseCount: bucket.responses.length,
            accuracy: Math.round((correct / bucket.responses.length) * 100),
            strugglingSkills,
            lastAttemptAt,
        });
    }

    return quickReports
        .sort((a, b) => b.lastAttemptAt.getTime() - a.lastAttemptAt.getTime())
        .slice(0, 6);
}

export default async function AdminDiagnosticsPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string; activityId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!isAdmin(session.user)) redirect("/teach");

    const params = await searchParams;
    const classId = params.classId;
    const activityId = params.activityId;

    const [classesRaw, guides] = await Promise.all([
        prisma.class.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        enrollments: {
                            where: { status: "active", student: { isSystemAccount: false } },
                        },
                    },
                },
            },
            orderBy: { name: "asc" },
        }),
        getDiagnosableGrammarGuides(),
    ]);
    const quickReports = await getQuickReports(guides);

    const classes = classesRaw.map((cls) => ({
        id: cls.id,
        name: cls.name,
        studentCount: cls._count.enrollments,
    }));

    let classData: { id: string; name: string } | null = null;
    let activityData: { id: string; title: string } | null = null;
    let enrollmentCount = 0;

    if (classId && activityId) {
        [classData, activityData, enrollmentCount] = await Promise.all([
            prisma.class.findUnique({ where: { id: classId }, select: { id: true, name: true } }),
            prisma.activity.findUnique({ where: { id: activityId }, select: { id: true, title: true } }),
            prisma.classEnrollment.count({
                where: { classId, status: "active", student: { isSystemAccount: false } },
            }),
        ]);
    }

    const hasReport = Boolean(classId && activityId && classData && activityData);
    const reportsWithGaps = quickReports.filter((report) => report.strugglingSkills > 0);

    return (
        <div className="space-y-6 text-[#2d261f]">
            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dddeda] px-3 py-1.5 text-xs font-bold text-[#345476]">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Admin · Skill diagnostics
                </span>
                <h1 className="font-display text-2xl font-bold sm:text-3xl">Where is the class struggling?</h1>
                <p className="max-w-2xl text-sm text-[#64748b]">
                    See which grammar skills need reteaching after students complete grammar guide mini-quizzes.
                    Pick a class and guide below to open a skill-by-skill breakdown.
                </p>
            </div>

            <div
                className="rounded-2xl border bg-white p-5"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
                <h2 className="mb-1 text-sm font-semibold">Choose a report</h2>
                <p className="mb-4 text-xs text-[#8b8174]">
                    Reports are built from tagged mini-quiz answers. Students must finish a grammar guide quiz first.
                </p>
                <AdminDiagnosticsPicker
                    classes={classes}
                    guides={guides}
                    selectedClassId={classId}
                    selectedActivityId={activityId}
                />
            </div>

            {hasReport && classData && activityData ? (
                <div
                    className="rounded-2xl border bg-white p-5"
                    style={{ borderColor: "rgba(0,0,0,0.08)" }}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{ background: "#b05740" }}
                        >
                            <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-bold">
                                {activityData.title.replace(/ Guide$/i, "")}
                            </h2>
                            <p className="text-sm text-[#64748b]">
                                {classData.name} · {enrollmentCount} enrolled student{enrollmentCount === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>
                    <DiagnosticReport
                        classId={classId!}
                        activityId={activityId!}
                        totalStudents={enrollmentCount}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div
                            className="rounded-xl border bg-white p-4"
                            style={{ borderColor: "rgba(0,0,0,0.08)" }}
                        >
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8b8174]">
                                <Users className="h-3.5 w-3.5" />
                                Classes
                            </div>
                            <p className="mt-2 text-2xl font-bold">{classes.length}</p>
                            <p className="text-xs text-[#94a3b8]">with active enrollments</p>
                        </div>
                        <div
                            className="rounded-xl border bg-white p-4"
                            style={{ borderColor: "rgba(0,0,0,0.08)" }}
                        >
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8b8174]">
                                <BookOpen className="h-3.5 w-3.5" />
                                Mini-quizzes
                            </div>
                            <p className="mt-2 text-2xl font-bold">{guides.length}</p>
                            <p className="text-xs text-[#94a3b8]">released grammar guides</p>
                        </div>
                        <div
                            className="rounded-xl border bg-white p-4"
                            style={{ borderColor: "rgba(0,0,0,0.08)" }}
                        >
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8b8174]">
                                <BarChart3 className="h-3.5 w-3.5" />
                                Reports ready
                            </div>
                            <p className="mt-2 text-2xl font-bold">{quickReports.length}</p>
                            <p className="text-xs text-[#94a3b8]">class + guide combos with data</p>
                        </div>
                    </div>

                    {quickReports.length > 0 ? (
                        <div
                            className="rounded-2xl border bg-white p-5"
                            style={{ borderColor: "rgba(0,0,0,0.08)" }}
                        >
                            <h2 className="mb-1 text-sm font-semibold">Recent reports with data</h2>
                            <p className="mb-4 text-xs text-[#8b8174]">
                                Jump straight to a class guide that already has student answers.
                            </p>
                            <div className="space-y-2">
                                {quickReports.map((report) => (
                                    <Link
                                        key={`${report.classId}-${report.activityId}`}
                                        href={`/admin/diagnostics?classId=${report.classId}&activityId=${report.activityId}`}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-[#faf8f4]"
                                        style={{ borderColor: "rgba(0,0,0,0.08)" }}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {report.className} · {report.activityTitle}
                                            </p>
                                            <p className="text-xs text-[#94a3b8]">
                                                {report.responseCount} answers · last activity{" "}
                                                {report.lastAttemptAt.toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                                    report.accuracy >= 80
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : report.accuracy >= 60
                                                          ? "bg-amber-50 text-amber-700"
                                                          : "bg-rose-50 text-rose-700"
                                                }`}
                                            >
                                                {report.accuracy}% class avg
                                            </span>
                                            {report.strugglingSkills > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {report.strugglingSkills} skill{report.strugglingSkills === 1 ? "" : "s"} &lt;60%
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    On track
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div
                            className="rounded-xl border bg-white px-5 py-8 text-center"
                            style={{ borderColor: "rgba(0,0,0,0.08)" }}
                        >
                            <BarChart3 className="mx-auto mb-3 h-8 w-8 text-[#cbd5e1]" />
                            <p className="text-sm font-semibold text-[#475569]">No skill data yet</p>
                            <p className="mx-auto mt-1 max-w-md text-xs text-[#94a3b8]">
                                Once students complete grammar guide mini-quizzes, reports will appear here automatically.
                                You can also pick a class and guide above to check a specific combo.
                            </p>
                        </div>
                    )}

                    {reportsWithGaps.length > 0 && (
                        <div
                            className="rounded-xl border border-rose-200 bg-rose-50/60 p-4"
                        >
                            <p className="text-sm font-semibold text-rose-800">
                                {reportsWithGaps.length} report{reportsWithGaps.length === 1 ? "" : "s"} flagged for reteaching
                            </p>
                            <p className="mt-1 text-xs text-rose-700">
                                Start with guides showing skills below 60% class average — those are the highest-impact reteach targets.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div
                className="rounded-2xl border bg-white p-5"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
                <h3 className="mb-3 text-sm font-semibold">How to use this page</h3>
                <ol className="space-y-2 text-sm text-[#64748b] list-decimal list-inside">
                    <li>Students finish a grammar guide and take its end-of-guide mini-quiz.</li>
                    <li>Select their class and the matching grammar guide to load the report.</li>
                    <li>Review skills below 60% and the students who need extra support on each skill.</li>
                    <li>Reteach those skills, then check the 7-day trend on the report to see if accuracy improves.</li>
                </ol>
            </div>
        </div>
    );
}
