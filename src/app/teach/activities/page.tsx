import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { isAdmin } from "@/lib/auth/roles";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import {
    buildTeacherActivitiesWhere,
    filterTeacherBrowsableActivities,
} from "@/lib/teacher-activities";
import { TeacherActivityCategories } from "@/components/dashboard";
import { resolveTeachClassId } from "@/lib/teach/active-class";

export const metadata = { title: "Activities | My ESOL Class" };

export default async function TeachActivitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");

    const params = await searchParams;
    const userId = session.user.id;
    const admin = isAdmin(session.user);
    // The activity library itself is shared, but assigning targets the active class.
    const { classId: activeClassId, classes: teachClasses } = await resolveTeachClassId(
        userId,
        admin,
        params.classId
    );

    const [activitiesRaw, classes] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.activity.findMany({
                where: buildTeacherActivitiesWhere(),
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

    const visibleActivities = collapseEdPronunciationActivities(
        filterTeacherBrowsableActivities(activitiesRaw)
    );

    const scopedClasses = activeClassId ? classes.filter((c) => c.id === activeClassId) : classes;
    const allAssignments = scopedClasses.flatMap((c) => c.assignments);
    const featuredAssignments = allAssignments.filter((a) => a.isFeatured);
    const featuredActivityIds = new Set(featuredAssignments.map((a) => a.activityId));
    const activityAssignmentMap: Record<string, string> = {};
    featuredAssignments.forEach((a) => { activityAssignmentMap[a.activityId] = a.id; });
    const defaultClassId = activeClassId ?? classes[0]?.id ?? null;
    const activeClassName = teachClasses.find((c) => c.id === activeClassId)?.name ?? null;

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Browse
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    All Activities
                </h1>
                {activeClassName ? (
                    <p className="text-sm text-text-muted mt-1">
                        Assigning to <strong className="font-semibold text-text">{activeClassName}</strong>
                    </p>
                ) : null}
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
