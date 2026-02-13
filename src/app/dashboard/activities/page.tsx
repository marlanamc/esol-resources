import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import { TeacherActivityCategories } from "@/components/dashboard";
import { ActivityCategoryPicker } from "@/components/dashboard/ActivityCategoryPicker";
import { BackButton } from "@/components/ui/BackButton";

export default async function ActivitiesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const userId = session.user?.id;
    const userRole = session.user?.role;

    // Filter activities by release status for students
    const activities = await prisma.activity.findMany({
        where: userRole === "student"
            ? {
                OR: [
                    // Released grammar guides only
                    { type: "guide", category: "grammar", isReleased: true },
                    // Non-grammar activities (speaking/quiz filtered client-side)
                    { NOT: { AND: [{ type: "guide" }, { category: "grammar" }] } }
                ]
            }
            : undefined,
        orderBy: { createdAt: "desc" },
    });
    const visibleActivities = collapseEdPronunciationActivities(activities);

    if (userRole === "teacher") {
        // Teacher View - Get featured assignments and class info
        const classes = await prisma.class.findMany({
            where: { teacherId: userId },
            include: {
                assignments: {
                    include: {
                        activity: true,
                    },
                },
            },
        });

        const allAssignments = classes.flatMap((c) => c.assignments);
        const featuredAssignments = allAssignments.filter((a) => a.isFeatured);
        const featuredActivityIds = new Set(featuredAssignments.map((a) => a.activityId));
        const activityAssignmentMap: Record<string, string> = {};
        featuredAssignments.forEach((assignment) => {
            activityAssignmentMap[assignment.activityId] = assignment.id;
        });

        const defaultClassId = classes.length > 0 ? classes[0]!.id : null;

        return (
            <div className="min-h-screen bg-bg">
                <header className="sticky top-0 backdrop-blur-md border-b z-40 bg-white/90 border-white/60 shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                        <BackButton href="/dashboard" variant="home" className="mb-2" hideOnMobile />
                        <p className="text-xs font-semibold text-secondary tracking-widest uppercase">Browse</p>
                        <h1 className="text-3xl font-display font-bold text-text">All Activities</h1>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
                    <TeacherActivityCategories
                        activities={visibleActivities}
                        featuredActivityIds={featuredActivityIds}
                        defaultClassId={defaultClassId}
                        activityAssignmentMap={activityAssignmentMap}
                    />
                </main>
            </div>
        );
    }

    // Student View
    const progressEntries = await prisma.activityProgress.findMany({
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
                    <BackButton href="/dashboard" variant="home" className="mb-2" hideOnMobile />
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-text text-center">
                        What do you want to{" "}
                        <span className="text-primary italic">practice</span> today?
                    </h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
                <ActivityCategoryPicker
                    activities={visibleActivities}
                    completedActivityIds={completedActivityIds}
                    progressMap={progressMap}
                />
            </main>
        </div>
    );
}


