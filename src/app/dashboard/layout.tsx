import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTimeframedLeaderboard } from "@/lib/gamification";
import { resolveLearnerMode, type LearnerMode } from "@/lib/learner-mode";
import { BottomNav } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { NetworkStatusBanner } from "@/components/NetworkStatusBanner";
import { SubmissionOutboxManager } from "@/components/SubmissionOutboxManager";

async function getStudentDashboardContext(userId: string): Promise<{
    learnerMode: LearnerMode;
    leaderboardRank: number | null;
}> {
    const [preferences, latestEnrollment, enrollmentCount] = await Promise.all([
        prisma.userPreferences.findUnique({
            where: { userId },
            select: { learnerMode: true },
        }),
        prisma.classEnrollment.findFirst({
            where: { studentId: userId },
            orderBy: { joinedAt: "desc" },
            select: { classId: true },
        }),
        prisma.classEnrollment.count({
            where: { studentId: userId },
        }),
    ]);

    const learnerMode = resolveLearnerMode({
        storedMode: preferences?.learnerMode,
        enrollmentCount,
    });

    if (learnerMode === "independent") {
        const leaderboard = await getTimeframedLeaderboard("week", 20, undefined, undefined, { independentOnly: true });
        const entry = leaderboard.find((e) => e.id === userId);
        return {
            learnerMode,
            leaderboardRank: entry && entry.rank <= 3 ? entry.rank : null,
        };
    }

    if (!latestEnrollment) {
        return {
            learnerMode,
            leaderboardRank: null,
        };
    }

    const leaderboard = await getTimeframedLeaderboard("week", 20, latestEnrollment.classId);
    const entry = leaderboard.find((e) => e.id === userId);
    return {
        learnerMode,
        leaderboardRank: entry && entry.rank <= 3 ? entry.rank : null,
    };
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    let leaderboardRank: number | null = null;
    let learnerMode: LearnerMode = "classroom";
    
    if (session?.user?.role === "student" && session.user?.id) {
        const studentDashboardContext = await getStudentDashboardContext(session.user.id);
        leaderboardRank = studentDashboardContext.leaderboardRank;
        learnerMode = studentDashboardContext.learnerMode;
    }

    return (
        <div className="min-h-screen bg-bg relative">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to main content
            </a>
            {session && (
                <DashboardHeader
                    userName={session.user?.name || ""}
                    enableSearch={session.user?.role === "student" || session.user?.role === "teacher"}
                    leaderboardRank={leaderboardRank}
                    showMarlieEmoji={session.user?.username?.toLowerCase() === "marlie"}
                />
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
            <BottomNav variant={learnerMode} />
        </div>
    );
}
