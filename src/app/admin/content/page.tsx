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
                <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--color-text)" }}>
                    Content Health
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                    Release status, content kinds, and activity inventory
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="rounded-2xl border bg-surface-elevated p-4" style={{ borderColor: "var(--border-subtle)" }}>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-text)" }}>{activities.length}</p>
                    <p className="text-xs font-semibold text-text-muted mt-0.5">Total activities</p>
                </div>
                <div className="rounded-2xl border bg-surface-elevated p-4" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="h-3.5 w-3.5" style={{ color: "#d97706", fill: "#f59e0b" }} aria-hidden="true" />
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Featured (Indep.)</p>
                    </div>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-text)" }}>{featuredIndependentCount}</p>
                </div>
                {["practice", "map", "assignment"].map((kind) => {
                    const Icon = KIND_ICONS[kind] ?? BookOpen;
                    const count = byKind[kind]?.length ?? 0;
                    return (
                        <div key={kind} className="rounded-2xl border bg-surface-elevated p-4" style={{ borderColor: "var(--border-subtle)" }}>
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-3.5 w-3.5" style={{ color: KIND_COLORS[kind] }} />
                                <p className="text-xs font-semibold" style={{ color: KIND_COLORS[kind] }}>{KIND_LABELS[kind]}</p>
                            </div>
                            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-text)" }}>{count}</p>
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
                            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                {KIND_LABELS[kind]}
                            </h2>
                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                {released}/{rows.length} released
                            </span>
                        </div>

                        <div className="rounded-2xl overflow-hidden border bg-surface-elevated" style={{ borderColor: "var(--border-subtle)" }}>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <caption className="sr-only">{KIND_LABELS[kind]} activities</caption>
                                    <thead>
                                        <tr style={{ background: "var(--color-surface-subtle)", borderBottom: "1px solid var(--color-border-subtle)" }}>
                                            {["Title", "Type", "Category", "Released", "Featured", "Created"].map((h) => (
                                                <th key={h} scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                                                    style={{ color: "var(--color-text-muted)" }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((a) => (
                                            <tr key={a.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                                                <th scope="row" className="py-2.5 px-4 text-left text-sm font-medium max-w-[280px]" style={{ color: "var(--color-text)" }}>
                                                    <span className="line-clamp-1" title={a.title}>{a.title}</span>
                                                </th>
                                                <td className="py-2.5 px-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                                                    {a.type ?? "—"}
                                                </td>
                                                <td className="py-2.5 px-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                                                    {a.category ?? "—"}
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    {a.isReleased ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-400" aria-hidden="true" />
                                                            <span className="sr-only">Released</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-4 w-4 text-text-muted" aria-hidden="true" />
                                                            <span className="sr-only">Not released</span>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    <IndependentFeaturedToggle
                                                        activityId={a.id}
                                                        initial={a.isFeaturedForIndependent}
                                                    />
                                                </td>
                                                <td className="py-2.5 px-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
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
