"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, BookOpen, Stethoscope, ShieldCheck } from "lucide-react";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { ViewModeSwitcher } from "@/components/teach/ViewModeSwitcher";

const NAV_ITEMS = [
    { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", Icon: Users, exact: false },
    { href: "/admin/content", label: "Content", Icon: BookOpen, exact: false },
    { href: "/admin/diagnostics", label: "Diagnostics", Icon: Stethoscope, exact: false },
] as const;

interface AdminHeaderProps {
    userName?: string;
}

export function AdminHeader({ userName = "" }: AdminHeaderProps) {
    const pathname = usePathname();

    return (
        <header
            className="sticky top-0 z-[260]"
            style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
                background: "linear-gradient(180deg, #1e2640 0%, #1a2236 100%)",
                boxShadow: "0 1px 0 rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15)",
            }}
        >
            {/* Top row */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-3 pb-0 flex items-center justify-between gap-4">
                {/* Brand */}
                <Link
                    href="/admin"
                    className="flex items-center gap-2.5 shrink-0 group"
                    aria-label="Class Companion Admin"
                >
                    <span
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold shadow"
                        style={{ background: "var(--primary)" }}
                        aria-hidden="true"
                    >
                        CC
                    </span>
                    <span className="hidden sm:block font-display font-bold text-base text-white/90 group-hover:text-white transition-colors">
                        Class Companion
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/20 text-[#f4a98a] border border-primary/30">
                        <ShieldCheck className="h-3 w-3" />
                        Admin
                    </span>
                </Link>

                {/* Right rail */}
                <div className="flex items-center gap-3">
                    <ViewModeSwitcher showAdmin size="sm" />
                    <UserProfileDropdown userName={userName} />
                </div>
            </div>

            {/* Tab nav */}
            <nav
                className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-end gap-0 overflow-x-auto scrollbar-none mt-1"
                aria-label="Admin navigation"
            >
                {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
                    const active = exact
                        ? pathname === href
                        : pathname.startsWith(href as string) && pathname !== "/admin";
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={[
                                "inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                                active
                                    ? "border-[#f4a98a] text-white"
                                    : "border-transparent text-white/50 hover:text-white/80 hover:border-white/20",
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
