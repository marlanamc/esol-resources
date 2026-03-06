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
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to main content
            </a>
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
