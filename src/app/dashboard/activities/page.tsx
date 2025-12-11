import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ActivityCategories } from "@/components/dashboard";

export default async function ActivitiesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const userId = (session.user as any)?.id;

    const activities = await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
    });

    const progressEntries = await (prisma as any).activityProgress.findMany({
        where: { userId },
        select: { activityId: true, progress: true },
    });
    const progressMap = (progressEntries as Array<{ activityId: string; progress: number }>).reduce<Record<string, { progress: number; categoryData?: string }>>(
        (acc, p) => {
            acc[p.activityId] = { progress: p.progress };
            return acc;
        },
        {}
    );

    const completedActivities = await prisma.submission.findMany({
        where: {
            userId,
            status: { in: ["submitted", "graded"] },
            completedAt: { not: null }
        },
        select: { activityId: true }
    });
    const completedActivityIds = new Set<string>(completedActivities.map((s: { activityId: string }) => s.activityId));

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 backdrop-blur-md border-b z-40 bg-white/90 border-white/60 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <p className="text-xs font-semibold text-secondary tracking-widest uppercase">Browse</p>
                    <h1 className="text-3xl font-display font-bold text-text">All Activities</h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
                <ActivityCategories
                    activities={activities}
                    completedActivityIds={completedActivityIds}
                    progressMap={progressMap}
                />
            </main>
        </div>
    );
}







