import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { getLearnerState, type LearnerMode } from "@/lib/learner-mode";
import { isAdminInStudentMode } from "@/lib/admin-student-view";
import { canUseTeacherTools } from "@/lib/auth/roles";

export type LearnerPreview = "classroom" | "independent";

function readLearnerPreviewFromSettings(gameSettings: unknown): LearnerPreview | null {
    if (!gameSettings || typeof gameSettings !== "object" || Array.isArray(gameSettings)) {
        return null;
    }

    const dashboard = (gameSettings as Record<string, unknown>).dashboard;
    if (!dashboard || typeof dashboard !== "object" || Array.isArray(dashboard)) {
        return null;
    }

    const experience = (dashboard as Record<string, unknown>).learnerExperience;
    if (experience === "classroom" || experience === "independent") {
        return experience;
    }

    return null;
}

export async function readLearnerPreview(userId: string): Promise<LearnerPreview | null> {
    const prefs = await withPrismaReadRetry(() =>
        prisma.userPreferences.findUnique({
            where: { userId },
            select: { gameSettings: true },
        })
    );

    return readLearnerPreviewFromSettings(prefs?.gameSettings);
}

/** Remember which learner experience a teacher is previewing in student view. */
export async function persistLearnerPreview(userId: string, preview: LearnerPreview): Promise<void> {
    const existing = await withPrismaReadRetry(() =>
        prisma.userPreferences.findUnique({
            where: { userId },
            select: { gameSettings: true },
        })
    );

    const prior =
        existing?.gameSettings &&
        typeof existing.gameSettings === "object" &&
        !Array.isArray(existing.gameSettings)
            ? (existing.gameSettings as Record<string, unknown>)
            : {};

    const priorDashboard =
        prior.dashboard &&
        typeof prior.dashboard === "object" &&
        !Array.isArray(prior.dashboard)
            ? (prior.dashboard as Record<string, unknown>)
            : {};

    await withPrismaReadRetry(() =>
        prisma.userPreferences.upsert({
            where: { userId },
            update: {
                gameSettings: {
                    ...prior,
                    dashboard: {
                        ...priorDashboard,
                        learnerExperience: preview,
                    },
                },
            },
            create: {
                userId,
                gameSettings: {
                    dashboard: {
                        learnerExperience: preview,
                    },
                },
            },
        })
    );
}

/**
 * Enrollment-based mode for students; teachers in student view use their
 * persisted learner preview (independent vs classroom) when set.
 */
export async function getEffectiveLearnerMode(
    userId: string,
    user: { role?: string | null; id?: string } | null | undefined
): Promise<LearnerMode> {
    const enrollmentMode = (await getLearnerState(prisma, userId)).mode;

    if (!user?.id || !canUseTeacherTools(user)) {
        return enrollmentMode;
    }

    const inStudentMode = await isAdminInStudentMode(user);
    if (!inStudentMode) {
        return enrollmentMode;
    }

    const preview = await readLearnerPreview(userId);
    if (preview) {
        return preview;
    }

    return enrollmentMode;
}
