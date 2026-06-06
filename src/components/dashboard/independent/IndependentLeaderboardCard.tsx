import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";

interface IndependentLeaderboardCardProps {
    rank: number;
    learnerCount: number;
}

export function IndependentLeaderboardCard({
    rank,
    learnerCount,
}: IndependentLeaderboardCardProps) {
    return (
        <Link
            href="/dashboard/leaderboard?scope=independent"
            className="dashboard-panel group block rounded-2xl border p-4 transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            style={{
                background:
                    "linear-gradient(150deg, color-mix(in srgb, var(--accent) 22%, var(--dashboard-surface-start)) 0%, var(--dashboard-surface-end) 100%)",
                borderColor: "color-mix(in srgb, var(--accent) 24%, var(--dashboard-border))",
            }}
            aria-label={`You're number ${rank} on the self-paced leaderboard this week`}
        >
            <div className="flex items-center gap-3">
                <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
                    style={{
                        background: "color-mix(in srgb, var(--accent) 34%, var(--dashboard-surface-start))",
                        color: "var(--accent-dark)",
                    }}
                    aria-hidden
                >
                    <Trophy size={22} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-tight text-text">
                        You&apos;re{" "}
                        <span className="text-primary">#{rank}</span> this week
                    </p>
                    <p className="mt-0.5 text-[11.5px] font-medium text-text-muted">
                        Self-paced leaderboard · {learnerCount.toLocaleString()} learner{learnerCount === 1 ? "" : "s"}
                    </p>
                </div>
                <ChevronRight
                    size={18}
                    className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                />
            </div>
        </Link>
    );
}
