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
        <div className="min-h-screen bg-gray-50 dark:bg-bg">
            <header className="bg-white dark:bg-[var(--surface-elevated)] shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <BackButton href="/dashboard" className="mb-4">Back to Dashboard</BackButton>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Class</h1>
                </div>
            </header>
            <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <CreateClassForm existingClasses={existingClasses} initialSourceClassId={initialSourceClassId} />
                </div>
            </main>
        </div>
    );
}
