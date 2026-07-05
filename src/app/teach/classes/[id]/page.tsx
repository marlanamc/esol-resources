import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { isCatchUpPathEnabled } from "@/lib/catch-up-deadlines";
import Link from "next/link";
import { ActivityLink } from "@/components/navigation/ActivityLink";
import { FeatureToggleButton, AssignmentRequirementToggle } from "@/components/dashboard";
import { ClassAnnouncementEditor } from "@/components/dashboard/ClassAnnouncementEditor";
import {
    Users, Pencil, ChevronRight, BookOpen, Plus,
    Megaphone, AlertCircle, Clock,
} from "lucide-react";

export const metadata = { title: "Class | Class Companion" };

interface Props {
    params: Promise<{ id: string }>;
}

const cutoff = () => Date.now() - 7 * 24 * 60 * 60 * 1000;
const daysAgo = (date: Date) => Math.floor((Date.now() - date.getTime()) / 86400000);

export default async function TeachClassDetailPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");

    const { id } = await params;
    const userId = session.user.id;
    const admin = isAdmin(session.user);

    const cls = await prisma.class.findUnique({
        where: { id },
        include: {
            teacher: { select: { name: true, username: true } },
            enrollments: {
                where: { status: "active", student: { isSystemAccount: false } },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            currentStreak: true,
                            weeklyPoints: true,
                            lastActivityDate: true,
                        },
                    },
                },
                orderBy: { joinedAt: "desc" },
            },
            assignments: {
                include: {
                    activity: {
                        select: { id: true, title: true, description: true, type: true, ui: true },
                    },
                },
                orderBy: [{ sequenceNumber: "asc" }, { createdAt: "asc" }],
            },
        },
    });

    if (!cls) notFound();

    const isTeacher = admin || cls.teacherId === userId;
    if (!isTeacher) redirect("/teach");

    const attentionCount = cls.enrollments.filter(
        (e) => !e.student.lastActivityDate || e.student.lastActivityDate.getTime() < cutoff()
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <Link href="/teach/classes" className="text-xs text-text-muted hover:text-primary font-semibold mb-1 inline-flex items-center gap-1">
                        ← Classes
                    </Link>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-text">{cls.name}</h1>
                    <p className="text-xs text-text-muted font-mono tracking-widest mt-0.5">
                        Join code: <span className="font-bold text-text">{cls.code}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/dashboard/classes/${id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-[var(--surface-subtle)]"
                        style={{ borderColor: "var(--border-subtle)", color: "var(--text-color)" }}
                    >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <Link
                        href={`/dashboard/classes/${id}/assignments/new`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                        style={{ background: "var(--primary)" }}
                    >
                        <Plus className="h-3.5 w-3.5" /> Assign activity
                    </Link>
                </div>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white text-sm" style={{ borderColor: "var(--border-subtle)" }}>
                    <Users className="h-4 w-4" style={{ color: "#4a8ca0" }} />
                    <span className="font-bold text-text">{cls.enrollments.length}</span>
                    <span className="text-text-muted">student{cls.enrollments.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white text-sm" style={{ borderColor: "var(--border-subtle)" }}>
                    <BookOpen className="h-4 w-4" style={{ color: "#b05740" }} />
                    <span className="font-bold text-text">{cls.assignments.length}</span>
                    <span className="text-text-muted">assignment{cls.assignments.length !== 1 ? "s" : ""}</span>
                </div>
                {attentionCount > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm" style={{ borderColor: "#f9a8d4", background: "#fff1f5" }}>
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <span className="font-bold text-warning">{attentionCount}</span>
                        <span style={{ color: "#be185d" }}>silent 7+ days</span>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-6 min-w-0">
                    {/* Roster */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
                            Roster
                        </h2>
                        {cls.enrollments.length === 0 ? (
                            <div className="rounded-xl border p-6 text-center text-sm text-text-muted" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-subtle)" }}>
                                No students yet. Share code <strong className="text-text font-mono">{cls.code}</strong> to enroll students.
                            </div>
                        ) : (
                            <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--border-subtle)" }}>
                                <table className="w-full">
                                    <thead>
                                        <tr style={{ background: "#f8f9fc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                            {["Name", "Username", "Streak", "Pts this wk", "Last active"].map((h) => (
                                                <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cls.enrollments.map((e) => {
                                            const silent = !e.student.lastActivityDate || e.student.lastActivityDate.getTime() < cutoff();
                                            return (
                                                <tr key={e.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                                    <td className="py-3 px-4">
                                                        <Link
                                                            href={`/teach/students/${e.student.id}`}
                                                            className="text-sm font-semibold hover:underline flex items-center gap-1"
                                                            style={{ color: "var(--primary)" }}
                                                        >
                                                            {e.student.name ?? e.student.username}
                                                            <ChevronRight className="h-3 w-3 opacity-50" />
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-text-muted font-mono">{e.student.username}</td>
                                                    <td className="py-3 px-4 text-sm text-text">
                                                        {e.student.currentStreak > 0 ? `🔥 ${e.student.currentStreak}` : "—"}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm font-semibold" style={{ color: "var(--primary)" }}>
                                                        {e.student.weeklyPoints > 0 ? `${e.student.weeklyPoints} pts` : "—"}
                                                    </td>
                                                    <td className="py-3 px-4 text-xs" style={{ color: silent ? "#be185d" : "#94a3b8" }}>
                                                        {e.student.lastActivityDate
                                                            ? `${daysAgo(e.student.lastActivityDate)}d ago`
                                                            : "Never"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Assignments */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                                Assignments
                            </h2>
                            <Link
                                href={`/dashboard/classes/${id}/assignments/new`}
                                className="text-xs font-semibold"
                                style={{ color: "var(--primary)" }}
                            >
                                + Assign activity
                            </Link>
                        </div>
                        {cls.assignments.length === 0 ? (
                            <div className="rounded-xl border p-6 text-center text-sm text-text-muted" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-subtle)" }}>
                                No assignments yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {cls.assignments.map((a) => (
                                    <div key={a.id} className="rounded-xl border bg-white px-4 py-3 flex items-start gap-4" style={{ borderColor: "var(--border-subtle)" }}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-text truncate">
                                                {a.title || a.activity.title}
                                            </p>
                                            {a.activity.description && (
                                                <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{a.activity.description}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                                    style={{ background: "var(--surface-subtle)", color: "var(--text-muted)" }}>
                                                    {a.activity.type}
                                                </span>
                                                {a.dueDate && (
                                                    <span className="text-xs text-text-muted flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                                            <FeatureToggleButton
                                                assignmentId={a.id}
                                                initialIsFeatured={a.isFeatured}
                                            />
                                            {isCatchUpPathEnabled && (
                                                <AssignmentRequirementToggle
                                                    assignmentId={a.id}
                                                    initialIsRequired={a.isRequired}
                                                />
                                            )}
                                            <Link
                                                href={`/dashboard/classes/${id}/assignments/${a.id}/submissions`}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[var(--surface-subtle)]"
                                                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                                            >
                                                Submissions
                                            </Link>
                                            <ActivityLink
                                                activityId={a.activity.id}
                                                assignmentId={a.id}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                                                style={{ background: "var(--secondary)" }}
                                            >
                                                View
                                            </ActivityLink>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right rail */}
                <div className="space-y-4">
                    {/* Announcement */}
                    <div className="rounded-xl border bg-white px-4 py-4" style={{ borderColor: "var(--border-subtle)" }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Megaphone className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                            <p className="text-sm font-semibold text-text">Announcement</p>
                        </div>
                        <ClassAnnouncementEditor classId={cls.id} initialAnnouncement={cls.announcement ?? null} />
                    </div>

                    {/* Quick actions */}
                    <div className="rounded-xl border bg-white px-4 py-4 space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Actions</p>
                        <Link
                            href={`/dashboard/classes/${id}/assignments/new`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors hover:bg-[var(--surface-subtle)]"
                            style={{ borderColor: "var(--border-subtle)", color: "var(--text-color)" }}
                        >
                            <Plus className="h-4 w-4" style={{ color: "var(--primary)" }} /> Assign activity
                        </Link>
                        <Link
                            href={`/teach/gradebook?classId=${cls.id}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors hover:bg-[var(--surface-subtle)]"
                            style={{ borderColor: "var(--border-subtle)", color: "var(--text-color)" }}
                        >
                            <BookOpen className="h-4 w-4" style={{ color: "#8a7abc" }} /> Grammar gradebook
                        </Link>
                        <Link
                            href={`/teach/reports?classId=${cls.id}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors hover:bg-[var(--surface-subtle)]"
                            style={{ borderColor: "var(--border-subtle)", color: "var(--text-color)" }}
                        >
                            <Users className="h-4 w-4" style={{ color: "#4a8ca0" }} /> Student engagement
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
