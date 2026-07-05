import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { isAdmin } from "@/lib/auth/roles";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import Link from "next/link";
import { Users, Eye, AlertCircle, ChevronRight } from "lucide-react";

export const metadata = { title: "Classes | Class Companion" };

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
function getCutoff() { return Date.now() - SEVEN_DAYS_MS; }

export default async function TeachClassesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = session.user.id;
    const admin = isAdmin(session.user);

    const classes = await withPrismaReadRetry(() =>
        prisma.class.findMany({
            where: admin ? {} : { teacherId: userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                code: true,
                classReveals: {
                    orderBy: { week: { number: "desc" } },
                    take: 1,
                    select: { week: { select: { number: true, title: true } } },
                },
                enrollments: {
                    where: { status: "active" },
                    select: {
                        student: { select: { lastActivityDate: true } },
                    },
                },
                _count: {
                    select: {
                        assignments: true,
                    },
                },
            },
        })
    );

    return (
        <div>
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                        Teaching
                    </p>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                        Your Classes
                    </h1>
                </div>
                <Link
                    href="/dashboard/classes/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm"
                    style={{ background: "var(--primary)" }}
                >
                    + New class
                </Link>
            </div>

            {classes.length === 0 ? (
                <div
                    className="rounded-2xl border-2 border-dashed p-12 text-center"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <p className="text-text-muted mb-4 text-sm">No classes yet.</p>
                    <Link
                        href="/dashboard/classes/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow"
                        style={{ background: "var(--primary)" }}
                    >
                        Create a class
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {classes.map((cls) => {
                        const activeCount = cls.enrollments.length;
                        const attentionCount = cls.enrollments.filter(
                            (e) => !e.student.lastActivityDate || e.student.lastActivityDate.getTime() < getCutoff()
                        ).length;
                        const currentWeek = cls.classReveals[0]?.week ?? null;

                        return (
                            <Link
                                key={cls.id}
                                href={`/dashboard/classes/${cls.id}`}
                                className="flex items-center gap-4 p-4 rounded-2xl border bg-white transition-shadow hover:shadow-md"
                                style={{ borderColor: "var(--border-subtle)" }}
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-display font-bold text-lg text-text leading-tight">
                                        {cls.name}
                                    </p>
                                    <p className="text-xs text-text-muted font-mono mt-0.5 tracking-widest">
                                        {cls.code}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 text-sm">
                                    <span className="flex items-center gap-1.5 text-text-muted">
                                        <Users className="h-3.5 w-3.5" />
                                        <span className="font-semibold text-text">{activeCount}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5 text-text-muted">
                                        <Eye className="h-3.5 w-3.5" />
                                        <span className="text-xs">
                                            {currentWeek ? `Wk ${currentWeek.number}` : "—"}
                                        </span>
                                    </span>
                                    {attentionCount > 0 && (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-warning">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            {attentionCount}
                                        </span>
                                    )}
                                </div>

                                <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
