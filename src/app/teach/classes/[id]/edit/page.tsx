import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import EditClassForm from "@/components/forms/EditClassForm";
import { BackButton } from "@/components/ui/BackButton";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditClassPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    if (!canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    const admin = isAdmin(session.user);
    const userId = session.user.id;

    const classItem = await prisma.class.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            teacherId: true,
            sectionGroupId: true,
        },
    });

    if (!classItem) {
        notFound();
    }

    if (!admin && classItem.teacherId !== userId) {
        redirect("/dashboard");
    }

    const sourceOptions = await prisma.class.findMany({
        where: admin ? { id: { not: classItem.id } } : { teacherId: userId, id: { not: classItem.id } },
        select: {
            id: true,
            name: true,
            sectionGroupId: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const currentSource =
        classItem.sectionGroupId
            ? sourceOptions.find((cls) => cls.sectionGroupId === classItem.sectionGroupId)?.id || null
            : null;

    return (
        <div className="space-y-6">
            <header className="border-b border-border pb-5">
                <div className="space-y-2">
                    <BackButton href={`/teach/classes/${id}`} className="mb-4">Back to Class</BackButton>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Class</h1>
                </div>
            </header>
            <section className="max-w-3xl">
                <div className="min-w-0">
                    <EditClassForm
                        classId={classItem.id}
                        initialName={classItem.name}
                        initialDescription={classItem.description}
                        initialSectionGroupId={classItem.sectionGroupId}
                        sourceOptions={sourceOptions.map((cls) => ({ id: cls.id, name: cls.name }))}
                        initialSourceClassId={currentSource}
                    />
                </div>
            </section>
        </div>
    );
}
