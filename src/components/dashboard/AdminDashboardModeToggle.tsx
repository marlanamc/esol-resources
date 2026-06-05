"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type AdminDashboardMode = "teaching" | "admin" | "student";

type AdminDashboardModeToggleProps = {
    mode: AdminDashboardMode;
};

const OPTIONS: Array<{ mode: AdminDashboardMode; label: string }> = [
    { mode: "student", label: "Student" },
    { mode: "teaching", label: "Teaching" },
    { mode: "admin", label: "Admin" },
];

export function AdminDashboardModeToggle({ mode }: AdminDashboardModeToggleProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const updateMode = (nextMode: AdminDashboardMode) => {
        if (nextMode === mode || isPending) return;

        startTransition(async () => {
            const response = await fetch("/api/user/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gameSettings: {
                        dashboard: {
                            mode: nextMode,
                        },
                    },
                }),
            });

            if (response.ok) {
                router.refresh();
            }
        });
    };

    return (
        <div
            className="inline-flex rounded-xl border bg-white/75 p-1 shadow-sm dark:bg-white/5"
            style={{ borderColor: "var(--dashboard-divider)" }}
            aria-label="Dashboard view"
        >
            {OPTIONS.map((option) => {
                const selected = option.mode === mode;
                return (
                    <button
                        key={option.mode}
                        type="button"
                        onClick={() => updateMode(option.mode)}
                        disabled={isPending}
                        aria-pressed={selected}
                        className={[
                            "min-h-9 min-w-[92px] rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            selected
                                ? "bg-primary text-[color:var(--text-on-accent)] shadow-sm"
                                : "text-text-muted hover:bg-[var(--surface-subtle)] hover:text-text",
                            isPending ? "cursor-wait opacity-80" : "",
                        ].join(" ")}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
