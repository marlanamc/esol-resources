"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";

export type ViewMode = "teaching" | "student" | "admin";

const ROUTES: Record<ViewMode, string> = {
    teaching: "/teach",
    student: "/dashboard",
    admin: "/admin",
};

const OPTIONS: Array<{ mode: ViewMode; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
    { mode: "student", label: "Student", Icon: GraduationCap },
    { mode: "teaching", label: "Teaching", Icon: BookOpen },
    { mode: "admin", label: "Admin", Icon: ShieldCheck },
];

const MODE_ACCENT: Record<ViewMode, string> = {
    teaching: "var(--primary)",
    student: "var(--secondary)",
    admin: "#1e2640",
};

function getCurrentMode(pathname: string): ViewMode {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/teach")) return "teaching";
    return "student";
}

interface ViewModeSwitcherProps {
    showAdmin?: boolean;
    size?: "sm" | "md";
}

export function ViewModeSwitcher({ showAdmin = false, size = "md" }: ViewModeSwitcherProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const currentMode = getCurrentMode(pathname);

    const switchMode = (mode: ViewMode) => {
        if (mode === currentMode || isPending) return;

        void fetch("/api/user/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameSettings: { dashboard: { mode } } }),
        });

        startTransition(() => {
            router.push(ROUTES[mode]);
        });
    };

    const visibleOptions = showAdmin ? OPTIONS : OPTIONS.filter((o) => o.mode !== "admin");
    const buttonMinWidth = size === "sm" ? "min-w-[5.75rem]" : "min-w-[6.5rem]";

    return (
        <div
            className="inline-flex items-center gap-0.5 rounded-xl border p-1 shadow-sm"
            style={{
                borderColor: "var(--border-subtle)",
                background: "var(--surface-subtle)",
            }}
            aria-label="Switch view"
            role="group"
        >
            {visibleOptions.map(({ mode, label, Icon }) => {
                const active = mode === currentMode;
                const accent = MODE_ACCENT[mode];
                return (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => switchMode(mode)}
                        disabled={isPending}
                        aria-pressed={active}
                        aria-current={active ? "true" : undefined}
                        style={active ? { color: accent } : undefined}
                        className={[
                            "inline-flex items-center justify-center gap-1.5 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            buttonMinWidth,
                            size === "sm"
                                ? "px-2.5 py-1.5 text-xs min-h-8"
                                : "px-3.5 py-2 text-sm min-h-9",
                            active
                                ? "bg-white font-bold shadow-[0_1px_3px_rgba(40,31,23,0.14),0_0_0_1px_rgba(0,0,0,0.05)] dark:bg-white/15 dark:shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
                                : "font-medium text-text-muted/55 hover:text-text-muted hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                            isPending ? "cursor-wait opacity-70" : "cursor-pointer",
                        ].filter(Boolean).join(" ")}
                    >
                        <Icon
                            className={[
                                size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
                                active ? "opacity-100" : "opacity-70",
                            ].join(" ")}
                        />
                        <span>{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
