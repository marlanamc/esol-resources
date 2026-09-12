"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { LearnerSearchTrigger } from "@/components/search/LearnerSearchTrigger";
import { ViewModeSwitcher } from "@/components/teach/ViewModeSwitcher";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";

export type ModeHeaderMode = "student" | "teaching" | "admin";

export type ModeHeaderTab = {
    href: string;
    label: string;
    Icon: ComponentType<{ className?: string }>;
    exact?: boolean;
};

type ModeHeaderProps = {
    mode: ModeHeaderMode;
    homeHref: string;
    subtitle: string;
    userName: string;
    tabs?: readonly ModeHeaderTab[];
    ariaLabel: string;
    brandSlot?: ReactNode;
    showViewModeToggle?: boolean;
    showAdminMode?: boolean;
    enableSearch?: boolean;
    searchLabel?: string;
    actions?: ReactNode;
    profileVariant?: "default" | "dashboardv2";
};

const MODE_ACCENT: Record<ModeHeaderMode, string> = {
    student: "#6f937f",
    teaching: "var(--primary)",
    admin: "#c86633",
};

const MODE_ICON_BG: Record<ModeHeaderMode, string> = {
    student: "#465564",
    teaching: "var(--primary)",
    admin: "#465564",
};

function isTabActive(pathname: string, tab: ModeHeaderTab) {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href) && pathname !== tab.href.replace(/\/[^/]+$/, "");
}

function DefaultBrand({ mode, homeHref, subtitle, ariaLabel }: Pick<ModeHeaderProps, "mode" | "homeHref" | "subtitle" | "ariaLabel">) {
    return (
        <Link
            href={homeHref}
            className="group flex min-w-0 items-center gap-3"
            aria-label={ariaLabel}
        >
            <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_10px_22px_rgba(47,74,102,0.18)] transition-transform duration-200 group-hover:scale-[1.03]"
                style={{ background: MODE_ICON_BG[mode] }}
                aria-hidden="true"
            >
                <Sparkles className="h-5 w-5" />
            </span>
            <span className="hidden min-w-0 sm:block">
                <span className="block truncate font-display text-lg font-bold leading-tight text-text">
                    Class Companion
                </span>
                <span className="block truncate text-sm font-semibold text-text-muted">
                    {subtitle}
                </span>
            </span>
        </Link>
    );
}

export function ModeHeader({
    mode,
    homeHref,
    subtitle,
    userName,
    tabs = [],
    ariaLabel,
    brandSlot,
    showViewModeToggle = false,
    showAdminMode = false,
    enableSearch = false,
    searchLabel = "Search",
    actions,
    profileVariant = "default",
}: ModeHeaderProps) {
    const pathname = usePathname();
    const accent = MODE_ACCENT[mode];
    const hasTabs = tabs.length > 0;

    return (
        <header
            className="mode-header sticky top-0 z-[260] touch-pan-y border-b border-[var(--border-subtle)] bg-[var(--surface-overlay)]/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-[var(--surface-overlay)]/82"
            style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
            }}
        >
            <div
                className={[
                    "mx-auto max-w-[1800px] items-center gap-2 px-3 py-2.5 sm:px-6 sm:py-3 md:px-7 lg:px-8",
                    showViewModeToggle
                        ? "grid min-h-[60px] grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] md:min-h-[74px] md:grid-cols-[1fr_auto_1fr] md:gap-3"
                        : "flex min-h-[60px] justify-between md:min-h-[74px] md:grid md:grid-cols-[1fr_auto_1fr] md:gap-3",
                ].join(" ")}
            >
                <div className="min-w-0 overflow-hidden md:justify-self-start">
                    {brandSlot ?? (
                        <DefaultBrand mode={mode} homeHref={homeHref} subtitle={subtitle} ariaLabel={ariaLabel} />
                    )}
                </div>

                <div
                    className={
                        showViewModeToggle
                            ? "flex min-w-0 items-center justify-center overflow-hidden px-0.5 md:justify-self-center"
                            : "hidden md:block"
                    }
                >
                    {showViewModeToggle ? (
                        <>
                            <div className="md:hidden">
                                <ViewModeSwitcher showAdmin={showAdminMode} size="sm" />
                            </div>
                            <div className="hidden md:block">
                                <ViewModeSwitcher showAdmin={showAdminMode} />
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:min-w-0 md:gap-3 md:justify-self-end">
                    <div className="hidden items-center gap-2 sm:flex md:contents">
                        {actions}
                    </div>
                    {enableSearch ? (
                        <>
                            <div className="shrink-0 lg:hidden">
                                <LearnerSearchTrigger
                                    className="h-9 w-9 min-h-0 justify-center rounded-full p-0 sm:h-10 sm:w-10"
                                />
                            </div>
                            <div className="hidden lg:block">
                                <LearnerSearchTrigger
                                    label={searchLabel}
                                    className="min-w-[220px] justify-start px-5"
                                />
                            </div>
                        </>
                    ) : null}
                    <UserProfileDropdown userName={userName} variant={profileVariant} />
                </div>
            </div>

            <nav
                className={[
                    "mx-auto min-h-12 max-w-[1800px] items-end gap-1 overflow-x-auto px-4 sm:px-6 md:px-7 lg:px-8",
                    mode === "student" ? "hidden md:flex" : "flex",
                ].join(" ")}
                aria-label={ariaLabel}
            >
                {hasTabs ? tabs.map((tab) => {
                    const active = isTabActive(pathname, tab);
                    const Icon = tab.Icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={[
                                "inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-bold whitespace-nowrap transition-colors sm:text-base",
                                active
                                    ? "text-text"
                                    : "border-transparent text-text-muted hover:border-[var(--border-strong)] hover:text-text",
                            ].join(" ")}
                            style={active ? { borderColor: accent } : undefined}
                            aria-current={active ? "page" : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {tab.label}
                        </Link>
                    );
                }) : (
                    <span className="sr-only">No section tabs for this mode</span>
                )}
            </nav>
        </header>
    );
}
