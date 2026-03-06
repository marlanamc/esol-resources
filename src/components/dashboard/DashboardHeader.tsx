"use client";

import React from "react";
import Link from "next/link";
import { TrophyIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { StudentQuickStats } from "@/components/dashboard/StudentQuickStats";
import { LearnerMenu } from "@/components/navigation/LearnerMenu";

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = "" }: DashboardHeaderProps) {
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
                    <UserProfileDropdown userName={userName} />
                </div>
            </div>
        </header>
    );
}
