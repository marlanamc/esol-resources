import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";
import { isLeaderboardExcludedUser } from "@/lib/gamification/leaderboard-filter";
import { ExcludeLeaderboardToggle } from "@/components/admin/ExcludeLeaderboardToggle";
import { StudentPasswordManager } from "@/components/student/StudentPasswordManager";
import { KeyRound, Users } from "lucide-react";

export const metadata = { title: "Users | Admin" };

function roleBadge(role: string) {
    if (role === "admin") return { bg: "#ede9fe", text: "#6d28d9", border: "#c4b5fd" };
    if (role === "teacher") return { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" };
    return { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" };
}

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!isAdmin(session.user)) redirect("/teach");

    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            name: true,
            role: true,
            isSystemAccount: true,
            excludeFromLeaderboard: true,
            mustChangePassword: true,
            lastActivityDate: true,
            createdAt: true,
            classes: {
                select: { class: { select: { id: true, name: true } } },
                orderBy: { class: { name: "asc" } },
            },
            createdClasses: {
                select: { id: true, name: true },
                orderBy: { name: "asc" },
            },
            _count: { select: { classes: true, createdClasses: true } },
        },
        orderBy: [{ role: "asc" }, { username: "asc" }],
    });

    // Build password manager data (students enrolled in any class)
    const classes = await prisma.class.findMany({
        select: {
            id: true,
            name: true,
            enrollments: {
                where: { status: "active", student: { isSystemAccount: false } },
                select: {
                    student: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            mustChangePassword: true,
                        },
                    },
                },
            },
        },
        orderBy: { name: "asc" },
    });

    const studentMap = new Map<string, { id: string; username: string; name: string | null; mustChangePassword: boolean }>();
    const sections = classes.map((cls) => {
        const sectionStudents: typeof studentMap extends Map<string, infer V> ? V[] : never[] = [];
        cls.enrollments.forEach((e) => {
            if (e.student) {
                studentMap.set(e.student.id, e.student);
                sectionStudents.push(e.student);
            }
        });
        return { id: cls.id, name: cls.name, students: sectionStudents };
    });
    const allStudents = Array.from(studentMap.values());

    const teachers = users.filter((u) => u.role === "teacher" || u.role === "admin");
    const students = users.filter((u) => u.role === "student" && !u.isSystemAccount);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "#1e2640" }}>
                    Manage Users
                </h1>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                    Roles, leaderboard exclusions, and password resets
                </p>
            </div>

            {/* Staff table */}
            <section>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                    <Users className="h-3.5 w-3.5" />
                    Teachers &amp; Admins ({teachers.length})
                </h2>
                <div className="rounded-2xl overflow-hidden border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr style={{ background: "#f8f9fc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                {["Username", "Name", "Role", "Classes", "Joined"].map((h) => (
                                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((u) => {
                                const badge = roleBadge(u.role);
                                return (
                                    <tr key={u.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                        <td className="py-3 px-4 text-sm font-semibold" style={{ color: "#1e2640" }}>{u.username}</td>
                                        <td className="py-3 px-4 text-sm" style={{ color: "#475569" }}>{u.name || "—"}</td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border"
                                                style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm" style={{ color: "#64748b" }}>
                                            {u._count.createdClasses} teaching
                                        </td>
                                        <td className="py-3 px-4 text-sm" style={{ color: "#94a3b8" }}>
                                            {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Students table */}
            <section>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                    <Users className="h-3.5 w-3.5" />
                    Students ({students.length})
                </h2>
                <div className="rounded-2xl overflow-hidden border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr style={{ background: "#f8f9fc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                    {["Username", "Name", "Enrolled In", "Leaderboard", "Last Active", "Joined"].map((h) => (
                                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((u) => {
                                    const isExcluded = isLeaderboardExcludedUser(u);
                                    const classNames = u.classes.map((e) => e.class.name);
                                    return (
                                        <tr key={u.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                            <td className="py-3 px-4 text-sm font-semibold" style={{ color: "#1e2640" }}>{u.username}</td>
                                            <td className="py-3 px-4 text-sm" style={{ color: "#475569" }}>{u.name || "—"}</td>
                                            <td className="py-3 px-4 text-xs" style={{ color: "#64748b" }}>
                                                {classNames.length > 0 ? classNames.join(", ") : <em style={{ color: "#94a3b8" }}>independent</em>}
                                            </td>
                                            <td className="py-3 px-4">
                                                <ExcludeLeaderboardToggle userId={u.id} initialExcluded={isExcluded} />
                                            </td>
                                            <td className="py-3 px-4 text-xs" style={{ color: "#94a3b8" }}>
                                                {u.lastActivityDate
                                                    ? new Date(u.lastActivityDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                                    : "Never"}
                                            </td>
                                            <td className="py-3 px-4 text-xs" style={{ color: "#94a3b8" }}>
                                                {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Password reset */}
            <section>
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748b" }}>
                    <KeyRound className="h-3.5 w-3.5" />
                    Password Reset
                </h2>
                <div className="rounded-2xl border p-5 bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    {allStudents.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-4">No enrolled students found.</p>
                    ) : (
                        <StudentPasswordManager students={allStudents} sections={sections} />
                    )}
                </div>
            </section>
        </div>
    );
}
