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

const MODE_ACTIVE_STYLE: Record<ViewMode, { bg: string; ring: string; color: string }> = {
    student: { bg: "#e3efe8", ring: "#6a8d73", color: "#4a7358" },
    teaching: { bg: "#fae8e2", ring: "#b05740", color: "#8f4532" },
    admin: { bg: "#e4eaf3", ring: "#345476", color: "#1e2640" },
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
    const isMobile = size === "sm";

    if (isMobile) {
        return (
            <div
                className="inline-flex shrink-0 items-center gap-px rounded-lg border p-px shadow-sm"
                style={{
                    borderColor: "var(--border-subtle)",
                    background: "var(--surface-subtle)",
                }}
                aria-label="Switch view"
                role="group"
            >
                {visibleOptions.map(({ mode, label, Icon }) => {
                    const active = mode === currentMode;
                    const activeStyle = MODE_ACTIVE_STYLE[mode];
                    return (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => switchMode(mode)}
                            disabled={isPending}
                            aria-pressed={active}
                            aria-current={active ? "true" : undefined}
                            aria-label={`Switch to ${label} view`}
                            title={label}
                            style={
                                active
                                    ? {
                                          color: activeStyle.color,
                                          backgroundColor: activeStyle.bg,
                                          boxShadow: `inset 0 0 0 2px ${activeStyle.ring}`,
                                      }
                                    : undefined
                            }
                            className={[
                                "inline-flex h-8 w-8 items-center justify-center rounded-[7px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                                active ? "shadow-sm" : "text-text-muted/50 hover:bg-black/[0.03]",
                                isPending ? "cursor-wait opacity-70" : "cursor-pointer",
                            ].filter(Boolean).join(" ")}
                        >
                            <Icon className={["h-3.5 w-3.5", active ? "opacity-100" : "opacity-60"].join(" ")} />
                        </button>
                    );
                })}
            </div>
        );
    }

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
                const activeStyle = MODE_ACTIVE_STYLE[mode];
                return (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => switchMode(mode)}
                        disabled={isPending}
                        aria-pressed={active}
                        aria-current={active ? "true" : undefined}
                        style={
                            active
                                ? {
                                      color: activeStyle.color,
                                      backgroundColor: activeStyle.bg,
                                      boxShadow: `inset 0 0 0 2px ${activeStyle.ring}`,
                                  }
                                : undefined
                        }
                        className={[
                            "inline-flex min-h-9 min-w-[6.5rem] items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            active
                                ? "font-bold shadow-sm"
                                : "font-medium text-text-muted/55 hover:text-text-muted hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                            isPending ? "cursor-wait opacity-70" : "cursor-pointer",
                        ].filter(Boolean).join(" ")}
                    >
                        <Icon className={["h-4 w-4", active ? "opacity-100" : "opacity-70"].join(" ")} />
                        <span>{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
