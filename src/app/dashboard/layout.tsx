import type { ReactNode } from "react";
import { BottomNav } from "@/components/ui";
import { HomeIcon, BookOpenIcon, TrophyIcon, CalendarIcon } from "@/components/icons/Icons";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-bg relative">
            {children}
            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                    { href: "/dashboard/calendar", label: "Calendar", icon: <CalendarIcon /> },
                    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
                ]}
            />
        </div>
    );
}

