import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { isAdmin } from "@/lib/auth/roles";

export async function isAdminInStudentMode(user: { role?: string | null } | null | undefined): Promise<boolean> {
    if (!isAdmin(user) || !("id" in (user ?? {}))) return false;
    const userId = (user as { id: string }).id;

    const prefs = await withPrismaReadRetry(() =>
        prisma.userPreferences.findUnique({
            where: { userId },
            select: { gameSettings: true },
        })
    );

    if (!prefs?.gameSettings || typeof prefs.gameSettings !== "object" || Array.isArray(prefs.gameSettings)) {
        return false;
    }

    const dashboard = (prefs.gameSettings as Record<string, unknown>).dashboard;
    if (!dashboard || typeof dashboard !== "object" || Array.isArray(dashboard)) return false;

    return (dashboard as Record<string, unknown>).mode === "student";
}
