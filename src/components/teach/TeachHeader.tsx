"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BookOpen, Calendar, BarChart2, LayoutGrid, GraduationCap, Map } from "lucide-react";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

const NAV_ITEMS = [
    { href: "/teach", label: "Home", Icon: LayoutGrid, exact: true },
    { href: "/teach/classes", label: "Classes", Icon: Users, exact: false },
    { href: "/teach/activities", label: "Activities", Icon: BookOpen, exact: false },
    { href: "/teach/calendar", label: "Calendar", Icon: Calendar, exact: false },
    { href: "/teach/gradebook", label: "Gradebook", Icon: GraduationCap, exact: false },
    { href: "/teach/map", label: "Course Map", Icon: Map, exact: false },
    { href: "/teach/reports", label: "Reports", Icon: BarChart2, exact: false },
] as const;

interface TeachHeaderProps {
    userName?: string;
    isAdmin?: boolean;
}

export function TeachHeader({ userName = "", isAdmin = false }: TeachHeaderProps) {
    const pathname = usePathname();

    return (
        <header
            className="sticky top-0 z-[260] border-b"
            style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
                backgroundColor: "color-mix(in srgb, var(--color-bg) 96%, transparent)",
                borderColor: "var(--border-subtle)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 1px 0 rgba(0,0,0,0.05), 0 2px 8px rgba(40,31,23,0.06)",
            }}
        >
            {/* Top row: brand + right controls */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-3 pb-0 flex items-center justify-between gap-4">
                {/* Brand wordmark */}
                <Link
                    href="/teach"
                    className="flex items-center gap-2 shrink-0 group"
                    aria-label="Class Companion – Teaching"
                >
                    <span
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold shadow-sm"
                        style={{ background: "var(--primary)" }}
                        aria-hidden="true"
                    >
                        CC
                    </span>
                    <span className="hidden sm:block font-display font-bold text-base text-text group-hover:text-primary transition-colors">
                        Class Companion
                    </span>
                    <span
                        className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{
                            background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                            color: "var(--primary)",
                        }}
                    >
                        Teaching
                    </span>
                </Link>

                {/* Right rail */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {isAdmin && <ViewModeSwitcher showAdmin size="sm" />}
                    <UserProfileDropdown userName={userName} />
                </div>
            </div>

            {/* Tab nav row */}
            <nav
                className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-end gap-0 overflow-x-auto scrollbar-none"
                aria-label="Teacher navigation"
            >
                {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
                    const active = exact
                        ? pathname === href
                        : pathname.startsWith(href as string) && pathname !== "/teach";
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={[
                                "inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                                active
                                    ? "border-primary text-primary"
                                    : "border-transparent text-text-muted hover:text-text hover:border-border-subtle",
                            ].join(" ")}
                            aria-current={active ? "page" : undefined}
                        >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
