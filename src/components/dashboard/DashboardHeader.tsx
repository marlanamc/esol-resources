"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Home, Map } from "lucide-react";
import { TrophyIcon } from "@/components/icons/Icons";
import { LearnerMenu } from "@/components/navigation/LearnerMenu";
import { ModeHeader } from "@/components/layout/ModeHeader";

const STUDENT_NAV_ITEMS = [
    { href: "/dashboard", label: "Home", Icon: Home, exact: true },
    { href: "/dashboard/map", label: "Map", Icon: Map, exact: false },
    { href: "/dashboard/activities", label: "Activities", Icon: BookOpen, exact: false },
] as const;

interface DashboardHeaderProps {
    userName?: string;
    variant?: "default" | "dashboardv2";
    enableSearch?: boolean;
    /** Student's weekly leaderboard rank (1–3) to show medal in header. Only for students. */
    leaderboardRank?: number | null;
    /** Show 🙋🏻‍♀️ next to name (Marlie test account) to indicate medal placement */
    showMarlieEmoji?: boolean;
    /** Show the view-mode switcher (Teaching / Student / Admin) in the header. For teachers/admins browsing in student mode. */
    showViewModeToggle?: boolean;
    /** Whether to show the Admin option in the switcher */
    isAdmin?: boolean;
}

export function DashboardHeader({
    userName = "",
    variant = "default",
    enableSearch = false,
    leaderboardRank = null,
    showMarlieEmoji = false,
    showViewModeToggle = false,
    isAdmin = false,
}: DashboardHeaderProps) {
    const handleCalendarOpen = () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("dashboardv2:open-calendar"));
            const rail = document.getElementById("dashboardv2-calendar-rail");
            if (rail && window.innerWidth >= 1280) {
                rail.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <ModeHeader
            mode="student"
            homeHref="/dashboard"
            subtitle="Student · Learning dashboard"
            userName={userName}
            tabs={STUDENT_NAV_ITEMS}
            ariaLabel="Student navigation"
            brandSlot={
                <LearnerMenu
                    mode="brand"
                    userName={userName}
                    showSearch={enableSearch}
                    hideMobileName={showViewModeToggle}
                    leaderboardRank={leaderboardRank}
                    showMarlieEmoji={showMarlieEmoji}
                />
            }
            showViewModeToggle={showViewModeToggle}
            showAdminMode={isAdmin}
            enableSearch={enableSearch}
            profileVariant={variant}
            actions={
                <>
                    {variant === "dashboardv2" ? (
                        <button
                            type="button"
                            onClick={handleCalendarOpen}
                            className="hidden h-11 shrink-0 appearance-none items-center justify-center gap-2 rounded-xl border px-3 py-0 font-bold text-white shadow-[0_2px_8px_rgba(38,31,23,0.08)] transition-colors hover:bg-[#c46a52] hover:border-[#b75e46] focus:outline-none focus:ring-2 focus:ring-[#d48c76] focus:ring-offset-1 xl:inline-flex"
                            style={{
                                backgroundColor: "#cf7a5f",
                                borderColor: "#c06d52",
                                fontSize: "14px",
                                lineHeight: "20px",
                                minWidth: "132px",
                            }}
                            aria-label="Open calendar"
                        >
                            <Calendar className="h-4 w-4 text-white" />
                            <span className="font-bold text-white leading-5">Calendar</span>
                        </button>
                    ) : null}
                    <Link
                        href="/dashboard/leaderboard"
                        className="hidden h-11 min-w-[132px] shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold text-white shadow-[0_2px_8px_rgba(38,31,23,0.08)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_4px_12px_rgba(136,163,146,0.2)] focus:outline-none focus:ring-2 focus:ring-[#88A392] focus:ring-offset-1 md:inline-flex"
                        style={{
                            backgroundColor: "#88A392",
                            borderColor: "#7a9384",
                        }}
                    >
                        <TrophyIcon className="w-4 h-4" />
                        Leaderboard
                    </Link>
                </>
            }
        />
    );
}
