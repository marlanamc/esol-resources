import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withPrismaReadRetry } from "@/lib/prisma-retry";
import { isAdmin } from "@/lib/roles";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import { TeacherActivityCategories } from "@/components/dashboard";

export const metadata = { title: "Activities | Class Companion" };

export default async function TeachActivitiesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const userId = session.user.id;
    const admin = isAdmin(session.user);

    const [activitiesRaw, classes] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.activity.findMany({
                where: admin
                    ? { deletedAt: null }
                    : { deletedAt: null, createdBy: userId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    category: true,
                    level: true,
                    ui: true,
                    content: true,
                    isReleased: true,
                },
                orderBy: { createdAt: "desc" },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.class.findMany({
                where: admin ? {} : { teacherId: userId },
                select: {
                    id: true,
                    assignments: {
                        select: {
                            id: true,
                            isFeatured: true,
                            activityId: true,
                        },
                    },
                },
            })
        ),
    ]);

    const visibleActivities = collapseEdPronunciationActivities(activitiesRaw);

    const allAssignments = classes.flatMap((c) => c.assignments);
    const featuredAssignments = allAssignments.filter((a) => a.isFeatured);
    const featuredActivityIds = new Set(featuredAssignments.map((a) => a.activityId));
    const activityAssignmentMap: Record<string, string> = {};
    featuredAssignments.forEach((a) => { activityAssignmentMap[a.activityId] = a.id; });
    const defaultClassId = classes[0]?.id ?? null;

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Browse
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    All Activities
                </h1>
            </div>

            <TeacherActivityCategories
                activities={visibleActivities}
                featuredActivityIds={featuredActivityIds}
                defaultClassId={defaultClassId}
                activityAssignmentMap={activityAssignmentMap}
            />
        </div>
    );
}
