import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Script from "next/script";
import { isInteractiveGuideContent, isLegacyGuideContent, parseActivityContent } from "@/types/activity";
import ActivityRenderer from "@/components/ActivityRenderer";
import SubmissionForm from "@/components/SubmissionForm";
import LogoutButton from "@/components/LogoutButton";
import { ActivityProgressBadge } from "@/components/ActivityProgressBadge";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ assignment?: string }>;
}

export default async function ActivityPage({ params, searchParams }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const { assignment: assignmentId } = await searchParams;

    if (!session) {
        redirect("/login");
    }

    const userId = (session.user as any)?.id;
    const userRole = (session.user as any)?.role;

    const activity = await prisma.activity.findUnique({
        where: { id },
    });

    if (!activity) {
        notFound();
    }

    // Get assignment if provided
    let assignment = null;
    if (assignmentId) {
        assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: {
                class: true,
            },
        });

        // Verify student is enrolled or teacher owns the class
        if (assignment) {
            if (userRole === "student") {
                const enrollment = await prisma.classEnrollment.findUnique({
                    where: {
                        classId_studentId: {
                            classId: assignment.classId,
                            studentId: userId,
                        },
                    },
                });
                if (!enrollment) {
                    redirect("/dashboard");
                }
            } else if (userRole === "teacher") {
                if (assignment.class.teacherId !== userId) {
                    redirect("/dashboard");
                }
            }
        }
    }

    // Get existing submission if this is an assignment
    let submission = null;
    if (assignmentId && userRole === "student") {
        submission = await prisma.submission.findUnique({
            where: {
                userId_activityId_assignmentId: {
                    userId,
                    activityId: id,
                    assignmentId: assignmentId,
                },
            },
        });
    }

    const progressRecord = await prisma.activityProgress.findUnique({
        where: {
            userId_activityId: {
                userId,
                activityId: id,
            },
        },
        select: {
            progress: true,
        },
    });
    const progressValue = progressRecord?.progress ?? 0;

    // Parse content once
    let parsedContent: any = null;
    try {
        parsedContent = parseActivityContent(activity.content);
    } catch {
        parsedContent = null;
    }

    // If activity is an external URL wrapper, redirect server-side to avoid flash
    if (parsedContent && typeof parsedContent === "object" && "externalUrl" in parsedContent && typeof parsedContent.externalUrl === "string") {
        redirect(parsedContent.externalUrl as string);
    }

    // Check if this is an interactive or legacy guide
    const isInteractiveGuide =
        parsedContent && (isInteractiveGuideContent(parsedContent) || isLegacyGuideContent(parsedContent));

    // Full screen layout for interactive guides
    if (isInteractiveGuide) {
        return (
            <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
                {/* Minimal Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-1">
                            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium whitespace-nowrap">
                                &larr; Back to Dashboard
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900 truncate">{activity.title}</h1>
                        </div>
                        {activity.description && (
                            <p className="text-sm text-gray-600 ml-0 mt-1 line-clamp-2">{activity.description}</p>
                        )}
                    </div>
                <div className="ml-4 flex-shrink-0 flex items-center gap-3">
                    <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                    <LogoutButton />
                </div>
                </header>

                {/* Full Screen Guide */}
                <div className="flex-1 overflow-hidden min-h-0">
                    <ActivityRenderer activity={activity} />
                </div>

                {/* Load presentation mode scripts */}
                <Script src="/assets/js/guide-presentation.js" strategy="afterInteractive" />
            </div>
        );
    }

    // Standard layout for other activities
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Back Button */}
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </Link>

                        {/* Centered Title */}
                        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-900">
                            {activity.title}
                        </h1>

                        {/* Logout Button */}
                        <div className="flex items-center gap-3">
                            <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 space-y-6">

                    {/* Activity Content */}
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <ActivityRenderer activity={activity} />
                    </div>

                    {/* Submission Status */}
                    {submission && submission.status === "graded" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">Graded</h3>
                            {submission.score !== null && (
                                <p className="text-2xl font-bold text-green-700 mb-2">
                                    Score: {submission.score}%
                                </p>
                            )}
                            {submission.feedback && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-green-800 mb-1">Feedback:</p>
                                    <p className="text-green-700">{submission.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
