import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { getTimeframedLeaderboard } from "@/lib/gamification/gamification";
import { getLearnerState, type LearnerMode } from "@/lib/learner-mode";
import { BottomNav } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard";
import ServiceWorkerRegistration from "@/components/system/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/system/PWAInstallPrompt";
import NetworkStatusBanner from "@/components/system/NetworkStatusBanner";
import SubmissionOutboxManager from "@/components/system/SubmissionOutboxManager";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { getEffectiveLearnerMode } from "@/lib/learner-preview";
import { AccentColorInitializer } from "@/components/dashboard/AccentColorInitializer";
import { resolveAccentKey } from "@/lib/accent-colors";

async function getStudentDashboardContext(userId: string): Promise<{
    learnerMode: LearnerMode;
    leaderboardRank: number | null;
}> {
    const [learnerState, latestEnrollment] = await Promise.all([
        getLearnerState(prisma, userId),
        prisma.classEnrollment.findFirst({
            where: { studentId: userId, status: "active" },
            orderBy: { joinedAt: "desc" },
            select: { classId: true },
        }),
    ]);

    const learnerMode = learnerState.mode;

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

    let accentKey = resolveAccentKey(null);

    if (session?.user?.id) {
        const [dashboardContext, userPrefs] = await Promise.all([
            session.user.role === "student"
                ? getStudentDashboardContext(session.user.id)
                : Promise.resolve({ learnerMode: "classroom" as LearnerMode, leaderboardRank: null }),
            prisma.userPreferences.findUnique({
                where: { userId: session.user.id },
                select: { accentColor: true },
            }),
        ]);

        leaderboardRank = dashboardContext.leaderboardRank;
        learnerMode = dashboardContext.learnerMode;
        accentKey = resolveAccentKey(userPrefs?.accentColor);

        if (
            canUseTeacherTools(session.user) &&
            (await isAdminInStudentMode(session.user))
        ) {
            learnerMode = await getEffectiveLearnerMode(session.user.id, session.user);
        }
    }

    return (
        <div className="min-h-screen bg-bg relative">
            <AccentColorInitializer accentKey={accentKey} />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
            >
                Skip to main content
            </a>
            {session && (
                <DashboardHeader
                    userName={session.user?.name || ""}
                    enableSearch={session.user?.role === "student" || canUseTeacherTools(session.user)}
                    leaderboardRank={leaderboardRank}
                    showMarlieEmoji={session.user?.username?.toLowerCase() === "marlie"}
                    showViewModeToggle={canUseTeacherTools(session.user)}
                    isAdmin={isAdmin(session.user)}
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
