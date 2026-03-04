import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard";
import { HomeIcon, BookOpenIcon, TrophyIcon, CalendarIcon } from "@/components/icons/Icons";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import NetworkStatusBanner from "@/components/NetworkStatusBanner";
import SubmissionOutboxManager from "@/components/SubmissionOutboxManager";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

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
