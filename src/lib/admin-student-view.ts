import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { canUseTeacherTools } from "@/lib/auth/roles";

type DashboardViewMode = "student" | "teaching" | "admin";

function readDashboardViewMode(gameSettings: unknown): DashboardViewMode | null {
    if (!gameSettings || typeof gameSettings !== "object" || Array.isArray(gameSettings)) {
        return null;
    }

    const dashboard = (gameSettings as Record<string, unknown>).dashboard;
    if (!dashboard || typeof dashboard !== "object" || Array.isArray(dashboard)) {
        return null;
    }

    const mode = (dashboard as Record<string, unknown>).mode;
    if (mode === "student" || mode === "teaching" || mode === "admin") {
        return mode;
    }

    return null;
}

/** True when a teacher/admin is browsing learner dashboard routes in student view. */
export async function isAdminInStudentMode(
    user: { role?: string | null; id?: string } | null | undefined
): Promise<boolean> {
    if (!user?.id || !canUseTeacherTools(user)) return false;

    const prefs = await withPrismaReadRetry(() =>
        prisma.userPreferences.findUnique({
            where: { userId: user.id },
            select: { gameSettings: true },
        })
    );

    const mode = readDashboardViewMode(prefs?.gameSettings);
    if (mode === "teaching" || mode === "admin") return false;

    // Unset preference defaults to student view on /dashboard routes.
    return true;
}
