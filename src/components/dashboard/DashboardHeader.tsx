"use client";

import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { TrophyIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { StudentQuickStats } from "@/components/dashboard/StudentQuickStats";
import { LearnerMenu } from "@/components/navigation/LearnerMenu";

interface DashboardHeaderProps {
    userName?: string;
    variant?: "default" | "dashboardv2";
}

export function DashboardHeader({ userName = "", variant = "default" }: DashboardHeaderProps) {
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
        <header
            className="sticky top-0 border-b z-[260] bg-[#fef9f3] border-[rgba(0,0,0,0.08)] shadow-[0_1px_4px_rgba(38,30,20,0.06)] sm:shadow-sm"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
            <div className="max-w-[1800px] mx-auto py-4 sm:py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex-1">
                    <LearnerMenu mode="brand" userName={userName} />
                </div>
                <div className="flex items-center gap-3">
                    <div className="sm:hidden flex items-center gap-1.5">
                        <StudentQuickStats mobile maxVisible={2} chipKeys={["streak", "weekly"]} compact />
                    </div>
                    {variant === "dashboardv2" ? (
                        <button
                            type="button"
                            onClick={handleCalendarOpen}
                            className="hidden xl:inline-flex h-[38px] shrink-0 appearance-none items-center justify-center gap-2 rounded-lg border px-3 py-0 shadow-md transition-colors text-white hover:bg-[#c46a52] hover:border-[#b75e46] focus:outline-none focus:ring-2 focus:ring-[#d48c76] focus:ring-offset-1"
                            style={{
                                backgroundColor: "#cf7a5f",
                                borderColor: "#c06d52",
                                fontSize: "14px",
                                lineHeight: "20px",
                                minWidth: "132px",
                                minHeight: "38px",
                            }}
                            aria-label="Open calendar"
                        >
                            <Calendar className="h-4 w-4 text-white" />
                            <span className="font-bold text-white leading-5">Calendar</span>
                        </button>
                    ) : null}
                    <Link
                        href="/dashboard/leaderboard"
                        className="hidden md:inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border shadow-md transition-colors text-white hover:bg-[#7a9384] hover:border-[#6d8577] focus:outline-none focus:ring-2 focus:ring-[#88A392] focus:ring-offset-1 min-w-[132px] justify-center"
                        style={{
                            backgroundColor: "#88A392",
                            borderColor: "#7a9384",
                        }}
                    >
                        <TrophyIcon className="w-4 h-4" />
                        Leaderboard
                    </Link>
                    <UserProfileDropdown userName={userName} variant={variant} />
                </div>
            </div>
        </header>
    );
}
