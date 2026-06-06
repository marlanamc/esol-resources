import Link from "next/link";
import { getCourseMapNextLaunchForUser } from "@/lib/course-map-next-launch";

export async function DashboardCoursePathCard({
    user,
}: {
    user: { id: string; role?: string | null };
}) {
    const nextLaunchResult = await getCourseMapNextLaunchForUser(user);
    const nextLaunch = nextLaunchResult?.launch ?? null;

    return (
        <Link
            href={nextLaunch?.href ?? "/dashboard/map"}
            className="group dashboard-panel dashboard-panel-hover rounded-2xl p-4 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{
                background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--tone-grammar-chip-bg) 55%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)",
                borderColor: "color-mix(in srgb, var(--primary) 18%, var(--border-subtle))",
            }}
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-lg shadow-sm" style={{ background: "var(--tone-grammar-chip-bg)", border: "1px solid color-mix(in srgb, var(--primary) 14%, transparent)" }}>
                🗺️
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-text leading-tight">
                    {nextLaunch ? "Continue Your Path" : "Course Map"}
                </p>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                    {nextLaunch
                        ? `Next up: ${nextLaunch.title}`
                        : "Browse units and weeks"}
                </p>
                <p className="text-[11px] font-semibold mt-2 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: "var(--primary)" }}>
                    {nextLaunch ? "Continue lesson →" : "Open map →"}
                </p>
            </div>
        </Link>
    );
}
