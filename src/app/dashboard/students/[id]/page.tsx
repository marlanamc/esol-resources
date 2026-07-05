import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { StudentDetailView } from "@/components/dashboard/StudentDetailView";
import { BackButton } from "@/components/ui/BackButton";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";

export default async function StudentDetailPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    const { id: studentId } = await params;
    const teacherId = session.user.id;
    const admin = isAdmin(session.user);

    // Only teachers can access this page
    if (!canUseTeacherTools(session.user)) {
        redirect("/dashboard");
    }

    const [student, enrollment] = await Promise.all([
        prisma.user.findUnique({
            where: { id: studentId },
            select: {
                id: true,
                name: true,
                username: true,
                isSystemAccount: true,
            },
        }),
        prisma.classEnrollment.findFirst({
            where: {
                studentId,
                status: "active",
                student: {
                    isSystemAccount: false,
                },
                ...(admin ? {} : { class: { teacherId } }),
            },
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
    ]);

    const canAccessStudent = !!student && !student.isSystemAccount && (admin || !!enrollment);

    if (!canAccessStudent) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-900 mb-2">
                        Student Not Found
                    </h2>
                    <p className="text-red-700 mb-4">
                        {admin
                            ? "This student could not be loaded."
                            : "This student is not enrolled in any of your classes."}
                    </p>
                    <BackButton href="/dashboard/stats">Back to Stats</BackButton>
                </div>
            </div>
        );
    }

    const studentDisplayName = student.name ?? student.username;
    const studentLabel = enrollment?.class.name ?? "Independent learner";

    return (
        <div className="min-h-screen bg-bg">
            <div className="container mx-auto px-4 py-6">
                {/* Header with breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
                        <Link href="/dashboard" className="hover:text-primary">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <Link href="/dashboard/stats" className="hover:text-primary">
                            Stats
                        </Link>
                        <span>/</span>
                        <span className="text-text font-medium">
                            {studentDisplayName}
                        </span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-text mb-1">
                                {studentDisplayName}
                            </h1>
                            <p className="text-text-muted">
                                @{student.username} · {studentLabel}
                            </p>
                        </div>
                        <BackButton href="/dashboard/stats">Back to Stats</BackButton>
                    </div>
                </div>

                {/* Student detail view component */}
                <StudentDetailView studentId={studentId} />
            </div>
        </div>
    );
}
