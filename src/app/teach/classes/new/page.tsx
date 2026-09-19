import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import CreateClassForm from "@/components/forms/CreateClassForm";
import { BackButton } from "@/components/ui/BackButton";
import { prisma } from "@/lib/database/prisma";
import { classOwnershipWhere, ensureTeacher } from "@/lib/auth/policies";

export default async function NewClassPage({
    searchParams,
}: {
    searchParams: Promise<{ sourceClassId?: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const teacherCheck = ensureTeacher(session.user);
    if (!teacherCheck.ok) {
        redirect("/dashboard");
    }
    const admin = teacherCheck.admin;

    const existingClasses = await prisma.class.findMany({
        where: classOwnershipWhere(session.user, admin),
        select: {
            id: true,
            name: true,
        },
        orderBy: { createdAt: "desc" },
    });
    const params = await searchParams;
    const sourceClassId = params.sourceClassId;
    const initialSourceClassId = existingClasses.some((cls) => cls.id === sourceClassId) ? sourceClassId : "";

    return (
        <div className="space-y-6">
            <header className="border-b border-border pb-5">
                <div className="space-y-2">
                    <BackButton href="/teach/classes" className="mb-4">Back to Classes</BackButton>
                    <h1 className="text-3xl font-bold text-text">Create New Class</h1>
                </div>
            </header>
            <section className="max-w-3xl">
                <div className="min-w-0">
                    <CreateClassForm existingClasses={existingClasses} initialSourceClassId={initialSourceClassId} />
                </div>
            </section>
        </div>
    );
}
