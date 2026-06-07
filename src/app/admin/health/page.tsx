import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle, Circle, Database, KeyRound } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";
import { buildEnvVarConfig } from "@/lib/shared/env";

export const metadata = { title: "Health | Admin" };
export const dynamic = "force-dynamic";

type EnvStatus = "ok" | "missing-required" | "invalid" | "missing-optional";

type EnvRow = {
    key: string;
    description: string;
    status: EnvStatus;
};

const PAIRED_GROUPS: { keys: string[]; description: string; required: boolean }[] = [
    {
        keys: ["POSTGRES_URL", "DATABASE_URL"],
        description: "PostgreSQL connection string (either var satisfies)",
        required: true,
    },
    {
        keys: ["NEXTAUTH_SECRET", "AUTH_SECRET"],
        description: "Auth signing secret, min 32 chars (either var satisfies)",
        required: true,
    },
];

function maskDbHost(): string {
    const raw = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "";
    if (!raw) return "—";
    try {
        const u = new URL(raw);
        const db = u.pathname.replace(/^\//, "") || "?";
        return `${u.hostname}${u.port ? ":" + u.port : ""}/${db}`;
    } catch {
        return "unparsable";
    }
}

function evaluateEnv(): { rows: EnvRow[]; problemCount: number } {
    const config = buildEnvVarConfig(process.env.NODE_ENV);
    const pairedKeys = new Set(PAIRED_GROUPS.flatMap((g) => g.keys));
    const rows: EnvRow[] = [];

    for (const group of PAIRED_GROUPS) {
        let pairOk = false;
        for (const key of group.keys) {
            const cfg = config.find((c) => c.key === key);
            const val = process.env[key];
            if (!val) continue;
            if (cfg?.validate && !cfg.validate(val)) continue;
            pairOk = true;
            break;
        }
        rows.push({
            key: group.keys.join(" or "),
            description: group.description,
            status: pairOk ? "ok" : group.required ? "missing-required" : "missing-optional",
        });
    }

    for (const cfg of config) {
        if (pairedKeys.has(cfg.key)) continue;
        const val = process.env[cfg.key];
        let status: EnvStatus;
        if (!val) {
            status = cfg.required ? "missing-required" : "missing-optional";
        } else if (cfg.validate && !cfg.validate(val)) {
            status = "invalid";
        } else {
            status = "ok";
        }
        rows.push({ key: cfg.key, description: cfg.description, status });
    }

    const problemCount = rows.filter(
        (r) => r.status === "missing-required" || r.status === "invalid"
    ).length;

    return { rows, problemCount };
}

async function pingDatabase(): Promise<{
    status: "ok" | "fail";
    latencyMs: number;
    error: string | null;
}> {
    const start = Date.now();
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { status: "ok", latencyMs: Date.now() - start, error: null };
    } catch (err) {
        return {
            status: "fail",
            latencyMs: Date.now() - start,
            error: err instanceof Error ? err.message : String(err),
        };
    }
}

function StatusPill({ status }: { status: EnvStatus | "ok" | "fail" }) {
    const styles: Record<string, { bg: string; fg: string; label: string }> = {
        ok: { bg: "#dcfce7", fg: "#166534", label: "OK" },
        fail: { bg: "#fee2e2", fg: "#991b1b", label: "Fail" },
        "missing-required": { bg: "#fee2e2", fg: "#991b1b", label: "Missing" },
        invalid: { bg: "#fef3c7", fg: "#92400e", label: "Invalid" },
        "missing-optional": { bg: "#f1f5f9", fg: "#64748b", label: "Not set" },
    };
    const s = styles[status];
    return (
        <span
            className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: s.bg, color: s.fg }}
        >
            {s.label}
        </span>
    );
}

export default async function AdminHealthPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!isAdmin(session.user)) redirect("/teach");

    const db = await pingDatabase();
    const { rows, problemCount } = evaluateEnv();
    const allOk = db.status === "ok" && problemCount === 0;
    const dbHost = maskDbHost();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "#1e2640" }}>
                    Site Health
                </h1>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                    Quick checks for database connectivity and required environment variables
                </p>
            </div>

            {/* Overall banner */}
            <div
                className="rounded-xl border px-5 py-4 flex items-start gap-3"
                style={
                    allOk
                        ? { background: "#f0fdf4", borderColor: "#bbf7d0" }
                        : { background: "#fef2f2", borderColor: "#fecaca" }
                }
            >
                {allOk ? (
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
                ) : (
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
                )}
                <div>
                    <p
                        className="text-sm font-semibold"
                        style={{ color: allOk ? "#166534" : "#991b1b" }}
                    >
                        {allOk
                            ? "All systems normal"
                            : `${problemCount + (db.status === "fail" ? 1 : 0)} problem${
                                  problemCount + (db.status === "fail" ? 1 : 0) === 1 ? "" : "s"
                              } detected`}
                    </p>
                    <p
                        className="text-xs mt-0.5"
                        style={{ color: allOk ? "#15803d" : "#b91c1c" }}
                    >
                        Checked just now · this page revalidates on every load
                    </p>
                </div>
            </div>

            {/* Database card */}
            <section>
                <div className="flex items-center gap-3 mb-3">
                    <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white"
                        style={{ background: "#4a8ca0" }}
                    >
                        <Database className="h-3.5 w-3.5" />
                    </span>
                    <h2
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: "#64748b" }}
                    >
                        Database
                    </h2>
                </div>
                <div
                    className="rounded-2xl border bg-white p-5 space-y-3"
                    style={{ borderColor: "rgba(0,0,0,0.08)" }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: "#1e2640" }}>
                            Connectivity (SELECT 1)
                        </span>
                        <StatusPill status={db.status} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span style={{ color: "#64748b" }}>Latency</span>
                        <span className="font-mono tabular-nums" style={{ color: "#1e2640" }}>
                            {db.latencyMs} ms
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span style={{ color: "#64748b" }}>Host</span>
                        <span className="font-mono text-xs" style={{ color: "#1e2640" }}>
                            {dbHost}
                        </span>
                    </div>
                    {db.error && (
                        <div
                            className="text-xs rounded-lg p-3 font-mono whitespace-pre-wrap"
                            style={{ background: "#fef2f2", color: "#991b1b" }}
                        >
                            {db.error}
                        </div>
                    )}
                </div>
            </section>

            {/* Env vars table */}
            <section>
                <div className="flex items-center gap-3 mb-3">
                    <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white"
                        style={{ background: "#b05740" }}
                    >
                        <KeyRound className="h-3.5 w-3.5" />
                    </span>
                    <h2
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: "#64748b" }}
                    >
                        Environment variables
                    </h2>
                    <span className="text-xs" style={{ color: "#94a3b8" }}>
                        keys only · values are never displayed
                    </span>
                </div>
                <div
                    className="rounded-2xl overflow-hidden border bg-white"
                    style={{ borderColor: "rgba(0,0,0,0.08)" }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px]">
                            <thead>
                                <tr
                                    style={{
                                        background: "#f8f9fc",
                                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                                    }}
                                >
                                    {["Key", "Status", "Description"].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "#94a3b8" }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr
                                        key={r.key}
                                        style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                                    >
                                        <td
                                            className="py-2.5 px-4 text-sm font-mono"
                                            style={{ color: "#1e2640" }}
                                        >
                                            {r.key}
                                        </td>
                                        <td className="py-2.5 px-4">
                                            {r.status === "missing-optional" ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "#94a3b8" }}>
                                                    <Circle className="h-3 w-3" />
                                                    Not set
                                                </span>
                                            ) : (
                                                <StatusPill status={r.status} />
                                            )}
                                        </td>
                                        <td className="py-2.5 px-4 text-xs" style={{ color: "#64748b" }}>
                                            {r.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
