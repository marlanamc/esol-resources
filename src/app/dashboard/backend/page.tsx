import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UserRow = {
    id: string;
    username: string;
    name: string | null;
    role: string;
    isSystemAccount: boolean;
    mustChangePassword: boolean;
    createdAt: Date;
    _count: {
        classes: number;
        createdClasses: number;
    };
};

function roleBadgeClasses(role: string) {
    if (role === "teacher_admin") return "bg-purple-100 text-purple-800 border-purple-200";
    if (role === "teacher") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
}

export default async function BackendUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    const canAccess = session.user.role === "teacher" && session.user.username === "teacher_user";
    if (!canAccess) {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            name: true,
            role: true,
            isSystemAccount: true,
            mustChangePassword: true,
            createdAt: true,
            _count: {
                select: {
                    classes: true,
                    createdClasses: true,
                },
            },
        },
        orderBy: [{ role: "asc" }, { username: "asc" }],
    }) as UserRow[];

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard" className="mb-1">Back to Dashboard</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Backend Users
                        </h1>
                        <p className="text-sm text-text-muted">
                            View roles and permission-related account flags.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-sm text-text-muted">
                            {session.user?.name}
                        </span>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
                <div className="border rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                        <h2 className="text-xl font-bold text-text">Accounts ({users.length})</h2>
                        <p className="text-sm text-text-muted">Access: `teacher_user` only</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-border/60">
                                    <th className="text-left py-3 px-3 text-sm font-semibold text-text">Username</th>
                                    <th className="text-left py-3 px-3 text-sm font-semibold text-text">Name</th>
                                    <th className="text-left py-3 px-3 text-sm font-semibold text-text">Role</th>
                                    <th className="text-left py-3 px-3 text-sm font-semibold text-text">Permissions</th>
                                    <th className="text-left py-3 px-3 text-sm font-semibold text-text">Classes</th>
                                    <th className="text-left py-3 px-3 text-sm font-semibold text-text">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const permissions = [
                                        user.role === "teacher_admin" ? "Global teacher access" : null,
                                        user.role === "teacher" ? "Teacher tools" : "Student tools",
                                        user.mustChangePassword ? "Must change password" : "Password current",
                                        user.isSystemAccount ? "System account" : "Regular account",
                                    ].filter(Boolean) as string[];

                                    return (
                                        <tr key={user.id} className="border-b border-border/30 hover:bg-bg-light/40">
                                            <td className="py-3 px-3 text-sm font-semibold text-text">{user.username}</td>
                                            <td className="py-3 px-3 text-sm text-text">{user.name || "—"}</td>
                                            <td className="py-3 px-3 text-sm">
                                                <span className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold ${roleBadgeClasses(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-xs text-text-muted">{permissions.join(" • ")}</td>
                                            <td className="py-3 px-3 text-sm text-text">
                                                {user._count.classes}
                                                {user.role !== "student" ? ` enrolled / ${user._count.createdClasses} teaching` : ""}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-text-muted">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
