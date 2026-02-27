import Link from "next/link";
import { BookOpenIcon, TrophyIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = "" }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 backdrop-blur-md border-b z-[260] bg-[#fef9f3]/95 border-[rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(38,30,20,0.08)] sm:shadow-sm transition-all">
            <div className="max-w-[1800px] mx-auto py-4 sm:py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 group"
                        aria-label="Go to dashboard home"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                            <BookOpenIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] sm:text-[12px] font-medium text-secondary tracking-[0.06em] uppercase pl-[2px]">ESOL</span>
                            <span className="text-base sm:text-lg font-bold text-primary leading-tight tracking-[-0.01em]" style={{ fontFamily: "Lora, serif" }}>Class Companion</span>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-3 animate-fade-in-up delay-100">
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
