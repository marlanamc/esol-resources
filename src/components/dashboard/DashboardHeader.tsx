"use client";

import React from "react";
import { BookOpen, Calendar, Home, Map, Trophy } from "lucide-react";
import { LearnerMenu } from "@/components/navigation/LearnerMenu";
import { ModeHeader } from "@/components/layout/ModeHeader";

const STUDENT_NAV_ITEMS = [
    { href: "/dashboard", label: "Home", Icon: Home, exact: true },
    { href: "/dashboard/map", label: "Map", Icon: Map, exact: false },
    { href: "/dashboard/activities", label: "Activities", Icon: BookOpen, exact: false },
    { href: "/dashboard/leaderboard", label: "Leaderboard", Icon: Trophy, exact: false },
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
    initialAvatar?: string | null;
    initialAvatarColor?: string | null;
}

export function DashboardHeader({
    userName = "",
    variant = "default",
    enableSearch = false,
    leaderboardRank = null,
    showMarlieEmoji = false,
    showViewModeToggle = false,
    isAdmin = false,
    initialAvatar = null,
    initialAvatarColor = null,
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
            initialAvatar={initialAvatar}
            initialAvatarColor={initialAvatarColor}
            actions={
                variant === "dashboardv2" ? (
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
                ) : undefined
            }
        />
    );
}
