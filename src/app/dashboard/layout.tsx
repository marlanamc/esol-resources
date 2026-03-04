import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard";
import { HomeIcon, BookOpenIcon, TrophyIcon, UsersIcon, BarChartIcon, MapIcon } from "@/components/icons/Icons";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import NetworkStatusBanner from "@/components/NetworkStatusBanner";
import SubmissionOutboxManager from "@/components/SubmissionOutboxManager";
import { getDashboardBottomNavItems } from "@/lib/dashboard-bottom-nav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);
    const navItems = getDashboardBottomNavItems(session?.user?.role).map((item) => {
        const icon = (() => {
            switch (item.iconKey) {
                case "home":
                    return <HomeIcon />;
                case "activities":
                    return <BookOpenIcon />;
                case "classes":
                    return <UsersIcon />;
                case "map":
                    return <MapIcon />;
                case "stats":
                    return <BarChartIcon />;
                case "leaderboard":
                    return <TrophyIcon />;
            }
        })();

        return {
            href: item.href,
            label: item.label,
            iconKey: item.iconKey,
            icon,
        };
    });

    return (
        <div className="min-h-screen bg-bg relative">
            {session && (
                <DashboardHeader userName={session.user?.name || ""} />
            )}
            {children}
            <ServiceWorkerRegistration />
            {session?.user?.role === "student" && (
                <>
                    <NetworkStatusBanner />
                    <SubmissionOutboxManager />
                </>
            )}
            <PWAInstallPrompt />
            <BottomNav items={navItems} />
        </div>
    );
}
