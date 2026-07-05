import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { BackButton } from "@/components/ui/BackButton";
import { canUseTeacherTools, isAdmin } from "@/lib/auth/roles";

interface Props {
    params: Promise<{ id: string }>;
}

interface WritingSubmissionContent {
    text?: string;
    wordCount?: number;
    submittedAt?: string;
}

function parseWritingContent(raw: string): WritingSubmissionContent | null {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
            return parsed as WritingSubmissionContent;
        }
    } catch {
        // ignore
    }
    return null;
}

export default async function WritingSubmissionsPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");

    const activity = await prisma.activity.findFirst({
        where: { id, deletedAt: null },
    });

    if (!activity) notFound();
    if (activity.type !== "writing") redirect(`/dashboard/activities`);

    // Get all classes this teacher owns, then find submissions for this activity in those classes
    const teacherClasses = await prisma.class.findMany({
        where: isAdmin(session.user) ? {} : { teacherId: session.user.id },
        select: { id: true },
    });
    const classIds = teacherClasses.map((c) => c.id);

    // Find all students enrolled in teacher's classes
    const enrollments = await prisma.classEnrollment.findMany({
        where: { classId: { in: classIds }, status: "active" },
        select: { studentId: true },
    });
    const studentIds = [...new Set(enrollments.map((e) => e.studentId))];

    // Find submissions for this activity by these students
    const submissions = await prisma.submission.findMany({
        where: {
            activityId: id,
            userId: { in: studentIds },
        },
        include: {
            user: { select: { id: true, name: true, username: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg">
            <header className="bg-white dark:bg-[var(--surface-elevated)] shadow">
                <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <BackButton href="/dashboard/activities" className="mb-4">Back to Activities</BackButton>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{activity.title}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-4">
                {submissions.length === 0 ? (
                    <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-xl border border-gray-100 dark:border-white/10 p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No submissions yet.</p>
                    </div>
                ) : (
                    submissions.map((sub) => {
                        const writing = parseWritingContent(sub.content);
                        const studentName = sub.user.name || sub.user.username || "Student";
                        const submittedAt = new Date(sub.createdAt).toLocaleString();

                        return (
                            <div
                                key={sub.id}
                                className="bg-white dark:bg-[var(--surface-elevated)] rounded-xl border border-gray-100 dark:border-white/10 p-5 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-gray-900 dark:text-white">{studentName}</span>
                                        <span className="ml-3 text-sm text-gray-400">{submittedAt}</span>
                                    </div>
                                    {writing?.wordCount !== undefined && (
                                        <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                            {writing.wordCount} {writing.wordCount === 1 ? "word" : "words"}
                                        </span>
                                    )}
                                </div>
                                {writing?.text ? (
                                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                                        {writing.text}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No text submitted.</p>
                                )}
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
}
