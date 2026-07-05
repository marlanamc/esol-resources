import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StudentDetailView } from "@/components/dashboard/StudentDetailView";

export const metadata = { title: "Student | Class Companion" };

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TeachStudentDetailPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");

    const { id } = await params;
    const userId = session.user.id;
    const admin = isAdmin(session.user);

    const student = await prisma.user.findUnique({
        where: { id },
        include: {
            classes: {
                where: { status: "active" },
                select: { class: { select: { teacherId: true } } },
            },
        },
    });

    if (!student || student.role !== "student" || student.isSystemAccount) notFound();

    const canView =
        admin ||
        student.classes.some((e: { class: { teacherId: string } }) => e.class.teacherId === userId);

    if (!canView) redirect("/teach");

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/teach/classes"
                    className="text-xs text-text-muted hover:text-primary font-semibold inline-flex items-center gap-1"
                >
                    <ChevronLeft className="h-3 w-3" /> Classes
                </Link>
            </div>

            <StudentDetailView studentId={id} />
        </div>
    );
}
