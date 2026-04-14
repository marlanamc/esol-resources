import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudentStatsView } from "@/components/dashboard/StudentStatsView";
import { createLearnerContentMetadataCache, filterLearnerVisibleActivities } from "@/lib/learner-visibility";

export default async function StudentStatsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    if (userRole !== "student") {
        redirect("/dashboard/stats");
    }

    const activitiesRaw = await prisma.activity.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            category: true,
            type: true,
            isReleased: true,
                content: true,
        },
    });
    const activities = filterLearnerVisibleActivities(
        activitiesRaw,
        createLearnerContentMetadataCache()
    );

    const progressEntries = await prisma.activityProgress.findMany({
        where: { userId },
        select: { activityId: true, progress: true },
    });
    const progressMap = progressEntries.reduce<Record<string, number>>((acc, p) => {
        acc[p.activityId] = p.progress;
        return acc;
    }, {});

    const statsActivities = activities.map((a) => ({
        ...a,
        progress: progressMap[a.id] ?? 0,
    }));

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/80 border-white/40 shadow-sm transition-all">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div className="min-w-0">
                        <BackButton href="/dashboard" className="mb-1">Back to Dashboard</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Your Progress
                        </h1>
                        <p className="text-sm text-text-muted">
                            Track vocab, grammar, and other activities in one place.
                        </p>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                        <span className="truncate text-sm text-text-muted">
                            {session.user?.name}
                        </span>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1200px] px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8">
                <StudentStatsView activities={statsActivities} />
            </main>
        </div>
    );
}

