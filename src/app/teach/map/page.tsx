import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { withPrismaReadRetry } from "@/lib/database/retry";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import { resolveTeachClassId } from "@/lib/teach/active-class";
import { CourseMapManager } from "@/components/teach/CourseMapManager";
import type { MapWeek } from "@/components/teach/CourseMapManager";

export const metadata = { title: "Course Map | Class Companion" };

export default async function TeachMapPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");

    const params = await searchParams;
    const userId = session.user.id;
    const admin = isAdmin(session.user);
    const { classId: resolvedClassId } = await resolveTeachClassId(userId, admin, params.classId);

    const cls = resolvedClassId
        ? await withPrismaReadRetry(() =>
            prisma.class.findFirst({
                where: {
                    id: resolvedClassId,
                    ...(admin ? {} : { teacherId: userId }),
                },
                select: { id: true, name: true },
            })
        )
        : null;

    if (!cls) {
        return (
            <div>
                <div className="mb-6">
                    <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                        Course
                    </p>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">Course Map</h1>
                </div>
                <div
                    className="rounded-xl border p-8 text-center text-sm text-text-muted"
                    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-subtle)" }}
                >
                    No class found. Create a class first to manage course progression.
                </div>
            </div>
        );
    }

    const [unitsRaw, reveals] = await Promise.all([
        withPrismaReadRetry(() =>
            prisma.courseUnit.findMany({
                orderBy: { number: "asc" },
                include: {
                    weeks: {
                        orderBy: { number: "asc" },
                        include: {
                            _count: { select: { items: true } },
                        },
                    },
                },
            })
        ),
        withPrismaReadRetry(() =>
            prisma.classReveal.findMany({
                where: { classId: cls.id },
                select: { weekId: true },
            })
        ),
    ]);

    const revealedWeekIds = reveals.map((r) => r.weekId);

    const allWeeks: MapWeek[] = unitsRaw.flatMap((unit) =>
        unit.weeks.map((week) => ({
            id: week.id,
            number: week.number,
            title: week.title,
            goal: week.goal ?? null,
            itemCount: week._count.items,
            unitTitle: unit.title,
        }))
    );

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--secondary)" }}>
                    Course
                </p>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text mt-0.5">
                    Course Map
                </h1>
                <p className="text-sm text-text-muted mt-1">
                    Control which weeks students can see on their Course Map.
                </p>
            </div>

            <CourseMapManager
                classId={cls.id}
                className={cls.name}
                allWeeks={allWeeks}
                revealedWeekIds={revealedWeekIds}
            />
        </div>
    );
}
