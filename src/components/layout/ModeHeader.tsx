"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { LearnerSearchTrigger } from "@/components/search/LearnerSearchTrigger";
import { ViewModeSwitcher } from "@/components/teach/ViewModeSwitcher";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";

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
                <span className="block truncate font-display text-lg font-bold leading-tight text-[#2d261f]">
                    Class Companion
                </span>
                <span className="block truncate text-sm font-semibold text-[#8b8174]">
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
            className="sticky top-0 z-[260] border-b"
            style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
                background: "rgba(247, 246, 243, 0.96)",
                borderColor: "#2f4a66",
                boxShadow: "0 1px 0 rgba(47,74,102,0.22), 0 12px 30px rgba(38,31,23,0.08)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
            }}
        >
            <div className="mx-auto flex min-h-[60px] max-w-[1800px] items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3 md:grid md:min-h-[74px] md:grid-cols-[1fr_auto_1fr] md:gap-3 lg:px-8">
                <div className="min-w-0 flex-1 md:flex-none md:justify-self-start">
                    {brandSlot ?? (
                        <DefaultBrand mode={mode} homeHref={homeHref} subtitle={subtitle} ariaLabel={ariaLabel} />
                    )}
                </div>

                <div className="hidden justify-self-center md:block">
                    {showViewModeToggle ? <ViewModeSwitcher showAdmin={showAdminMode} /> : null}
                </div>

                <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:min-w-0 md:gap-3 md:justify-self-end">
                    <div className="hidden items-center gap-2 sm:flex md:contents">
                        {actions}
                    </div>
                    {showViewModeToggle ? (
                        <div className="shrink-0 md:hidden">
                            <ViewModeSwitcher showAdmin={showAdminMode} size="sm" />
                        </div>
                    ) : null}
                    {enableSearch ? (
                        <>
                            <div className="shrink-0 lg:hidden">
                                <LearnerSearchTrigger
                                    className="h-9 w-9 min-h-0 justify-center rounded-full border-0 bg-[#ded7ca] p-0 text-[#2d261f] shadow-none hover:bg-[#d8d0c2] sm:h-10 sm:w-10"
                                />
                            </div>
                            <div className="hidden lg:block">
                                <LearnerSearchTrigger
                                    label={searchLabel}
                                    className="min-w-[220px] justify-start border-0 bg-[#ded7ca] px-5 text-[#2d261f] shadow-none hover:bg-[#d8d0c2]"
                                />
                            </div>
                        </>
                    ) : null}
                    <UserProfileDropdown userName={userName} variant={profileVariant} />
                </div>
            </div>

            <nav
                className={[
                    "mx-auto min-h-12 max-w-[1800px] items-end gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8",
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
                                    ? "text-[#2d261f]"
                                    : "border-transparent text-[#8f8579] hover:border-[#b9afa1] hover:text-[#2d261f]",
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
