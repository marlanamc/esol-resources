import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { isAdmin } from "@/lib/auth/roles";
import { CheckCircle, XCircle, BookOpen, MapPin, FileText, Star } from "lucide-react";
import { IndependentFeaturedToggle } from "@/components/admin/IndependentFeaturedToggle";

export const metadata = { title: "Content | Admin" };

const KIND_LABELS: Record<string, string> = {
    practice: "Practice",
    map: "Course Map",
    assignment: "Assignment",
};

const KIND_ICONS: Record<string, typeof BookOpen> = {
    practice: BookOpen,
    map: MapPin,
    assignment: FileText,
};

const KIND_COLORS: Record<string, string> = {
    practice: "#b05740",
    map: "#6a8d73",
    assignment: "#4a8ca0",
};

type ActivityRow = {
    id: string;
    title: string;
    type: string | null;
    category: string | null;
    contentKind: string | null;
    isReleased: boolean;
    isFeaturedForIndependent: boolean;
    createdAt: Date;
};

export default async function AdminContentPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!isAdmin(session.user)) redirect("/teach");

    const activities = await prisma.activity.findMany({
        where: { deletedAt: null },
        select: {
            id: true,
            title: true,
            type: true,
            category: true,
            contentKind: true,
            isReleased: true,
            isFeaturedForIndependent: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    }) as ActivityRow[];

    const byKind = activities.reduce<Record<string, ActivityRow[]>>((acc, a) => {
        const k = a.contentKind ?? "practice";
        if (!acc[k]) acc[k] = [];
        acc[k].push(a);
        return acc;
    }, {});

    const featuredIndependentCount = activities.filter((a) => a.isFeaturedForIndependent).length;

    const unreleasedGated = activities.filter(
        (a) => !a.isReleased && (
            a.type === "quiz" ||
            (a.category ?? "").toLowerCase() === "quizzes" ||
            (a.type === "guide" && (a.category ?? "").toLowerCase() === "grammar")
        )
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "#1e2640" }}>
                    Content Health
                </h1>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                    Release status, content kinds, and activity inventory
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: "#1e2640" }}>{activities.length}</p>
                    <p className="text-xs font-semibold text-text-muted mt-0.5">Total activities</p>
                </div>
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="h-3.5 w-3.5" style={{ color: "#d97706", fill: "#f59e0b" }} />
                        <p className="text-xs font-semibold" style={{ color: "#d97706" }}>Featured (Indep.)</p>
                    </div>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: "#1e2640" }}>{featuredIndependentCount}</p>
                </div>
                {["practice", "map", "assignment"].map((kind) => {
                    const Icon = KIND_ICONS[kind] ?? BookOpen;
                    const count = byKind[kind]?.length ?? 0;
                    return (
                        <div key={kind} className="rounded-2xl border bg-white p-4" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-3.5 w-3.5" style={{ color: KIND_COLORS[kind] }} />
                                <p className="text-xs font-semibold" style={{ color: KIND_COLORS[kind] }}>{KIND_LABELS[kind]}</p>
                            </div>
                            <p className="text-2xl font-bold tabular-nums" style={{ color: "#1e2640" }}>{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Unreleased gated items banner */}
            {unreleasedGated.length > 0 && (
                <div className="rounded-xl border px-5 py-4 flex items-start gap-3"
                    style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#ea580c" }} />
                    <div>
                        <p className="text-sm font-semibold" style={{ color: "#9a3412" }}>
                            {unreleasedGated.length} gated activit{unreleasedGated.length === 1 ? "y" : "ies"} not yet released
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#c2410c" }}>
                            Quizzes and grammar guides require manual release before students can see them.
                        </p>
                    </div>
                </div>
            )}

            {/* Activity table by kind */}
            {(["practice", "map", "assignment"] as const).map((kind) => {
                const rows = byKind[kind] ?? [];
                if (rows.length === 0) return null;
                const Icon = KIND_ICONS[kind] ?? BookOpen;
                const color = KIND_COLORS[kind];
                const released = rows.filter((a) => a.isReleased).length;

                return (
                    <section key={kind}>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white"
                                style={{ background: color }}>
                                <Icon className="h-3.5 w-3.5" />
                            </span>
                            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>
                                {KIND_LABELS[kind]}
                            </h2>
                            <span className="text-xs" style={{ color: "#94a3b8" }}>
                                {released}/{rows.length} released
                            </span>
                        </div>

                        <div className="rounded-2xl overflow-hidden border bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <thead>
                                        <tr style={{ background: "#f8f9fc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                            {["Title", "Type", "Category", "Released", "Featured", "Created"].map((h) => (
                                                <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                                                    style={{ color: "#94a3b8" }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((a) => (
                                            <tr key={a.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                                <td className="py-2.5 px-4 text-sm font-medium max-w-[280px]" style={{ color: "#1e2640" }}>
                                                    <span className="line-clamp-1">{a.title}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-xs" style={{ color: "#64748b" }}>
                                                    {a.type ?? "—"}
                                                </td>
                                                <td className="py-2.5 px-4 text-xs" style={{ color: "#64748b" }}>
                                                    {a.category ?? "—"}
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    {a.isReleased ? (
                                                        <CheckCircle className="h-4 w-4" style={{ color: "#16a34a" }} />
                                                    ) : (
                                                        <XCircle className="h-4 w-4" style={{ color: "#cbd5e1" }} />
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    <IndependentFeaturedToggle
                                                        activityId={a.id}
                                                        initial={a.isFeaturedForIndependent}
                                                    />
                                                </td>
                                                <td className="py-2.5 px-4 text-xs" style={{ color: "#94a3b8" }}>
                                                    {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
