import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";
import { DiagnosticReport } from "@/components/dashboard/DiagnosticReport";
import { TabNavTelemetryCard } from "@/components/dashboard/TabNavTelemetryCard";
import { BarChart3 } from "lucide-react";

export const metadata = { title: "Diagnostics | Admin" };

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

    const classes = await prisma.class.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-3" style={{ color: "#1e2640" }}>
                    <BarChart3 className="h-6 w-6" style={{ color: "#b05740" }} />
                    Diagnostics
                </h1>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                    Class skills, student performance, and tab telemetry
                </p>
            </div>

            {/* Class selector */}
            {classes.length > 0 && (
                <div className="rounded-xl border bg-white p-4" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Select a class + activity from the Gradebook to load a diagnostic report
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {classes.map((cls) => (
                            <a
                                key={cls.id}
                                href={`/dashboard/gradebook?classId=${cls.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:bg-[var(--surface-subtle)]"
                                style={{ borderColor: "var(--border-subtle)", color: "var(--text-color)" }}
                            >
                                {cls.name} →
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab telemetry */}
            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <h2 className="font-semibold text-sm mb-3" style={{ color: "#1e2640" }}>Tab Navigation Telemetry</h2>
                <TabNavTelemetryCard />
            </div>

            {/* Diagnostic report */}
            {classId && activityId && classData && activityData ? (
                <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: "#b05740" }}>
                            <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-lg" style={{ color: "#1e2640" }}>
                                {activityData.title}
                            </h2>
                            <p className="text-sm" style={{ color: "#64748b" }}>
                                {classData.name} · {enrollmentCount} students
                            </p>
                        </div>
                    </div>
                    <DiagnosticReport
                        classId={classId}
                        activityId={activityId}
                        totalStudents={enrollmentCount}
                    />
                </div>
            ) : (
                <div className="rounded-xl border bg-white px-5 py-8 text-center"
                    style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <BarChart3 className="h-8 w-8 mx-auto mb-3" style={{ color: "#cbd5e1" }} />
                    <p className="text-sm font-semibold" style={{ color: "#475569" }}>No report loaded</p>
                    <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                        Open a class in the Gradebook and click a mini-quiz to view skill diagnostics here.
                    </p>
                </div>
            )}

            {/* Interpretation guide */}
            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <h3 className="font-semibold text-sm mb-3" style={{ color: "#1e2640" }}>
                    Reading the Report
                </h3>
                <dl className="space-y-2 text-sm" style={{ color: "#64748b" }}>
                    <div><dt className="inline font-semibold text-text">Skills — </dt><dd className="inline">Each tag is a grammar concept tested in the quiz questions.</dd></div>
                    <div><dt className="inline font-semibold text-text">% Correct — </dt><dd className="inline">Class average for that skill across all student attempts.</dd></div>
                    <div><dt className="inline font-semibold text-text">Students Need Help — </dt><dd className="inline">Count of students below 60% on questions for this skill.</dd></div>
                    <div><dt className="inline font-semibold text-text">Difficulty Filter — </dt><dd className="inline">Filter by easy / medium / hard to pinpoint where students struggle.</dd></div>
                </dl>
            </div>
        </div>
    );
}
