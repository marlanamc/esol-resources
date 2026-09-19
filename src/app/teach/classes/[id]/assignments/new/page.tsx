import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import CreateAssignmentForm from "@/components/forms/CreateAssignmentForm";
import { BackButton } from "@/components/ui/BackButton";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function NewAssignmentPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        redirect("/login");
    }

    const userId = session.user?.id;
    const admin = isAdmin(session.user);

    if (!canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    const classItem = await prisma.class.findUnique({
        where: { id },
        include: {
            teacher: true,
        },
    });

    if (!classItem) {
        notFound();
    }

    if (!admin && classItem.teacherId !== userId) {
        redirect("/dashboard");
    }

    const activities = await prisma.activity.findMany({
        where: admin ? { deletedAt: null } : { deletedAt: null, createdBy: userId },
        orderBy: { createdAt: "desc" },
    });
    const visibleActivities = collapseEdPronunciationActivities(activities);

    return (
        <div className="space-y-6">
            <header className="border-b border-border pb-5">
                <div className="space-y-2">
                    <BackButton href={`/teach/classes/${id}`} className="mb-4">Back to Class</BackButton>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Assignment</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Class: {classItem.name}</p>
                </div>
            </header>
            <section className="max-w-3xl">
                <div className="min-w-0">
                    <CreateAssignmentForm
                        classId={id}
                        activities={visibleActivities}
                        supportsSectionSync={Boolean(classItem.sectionGroupId)}
                    />
                </div>
            </section>
        </div>
    );
}





