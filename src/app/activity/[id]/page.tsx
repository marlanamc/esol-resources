import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Script from "next/script";
import { type ActivityContent, isInteractiveGuideContent, isLegacyGuideContent, parseActivityContent } from "@/types/activity";
import ActivityRenderer from "@/components/ActivityRenderer";
import { ActivityProgressBadge } from "@/components/ActivityProgressBadge";
import { CategoryProgressDisplay } from "@/components/CategoryProgressDisplay";
import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { completionKeyFromActivityTitle } from "@/utils/completionKey";
import { grammarTopics } from "@/data/grammar-map";
import { numbersGameCategoryNames } from "@/data/numbersGameCategories";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ assignment?: string }>;
}

export default async function ActivityPage({ params, searchParams }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const { assignment: assignmentId } = await searchParams;

    if (!session?.user) {
        redirect("/login");
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    const activity = await prisma.activity.findUnique({
        where: { id },
    });

    if (!activity) {
        notFound();
    }

    // SECURITY: Students cannot access unreleased speaking activities
    if (userRole === "student" && activity.type === "speaking") {
        try {
            const content = JSON.parse(activity.content);
            if (content.released !== true) {
                // Redirect to dashboard if trying to access unreleased speaking activity
                redirect("/dashboard");
            }
        } catch {
            // If content is malformed, deny access
            redirect("/dashboard");
        }
    }

    // For grammar guides, prefer the dedicated `/grammar-reader/:slug` routes (source-of-truth content).
    // This avoids stale DB-stored JSON when the guide content is updated in code.
    if (activity.type === "guide" && activity.category === "grammar") {
        const slug = completionKeyFromActivityTitle(activity.title);
        const known = new Set(grammarTopics.map((t) => t.id));
        if (known.has(slug)) {
            const qs = new URLSearchParams();
            if (assignmentId) qs.set("assignment", assignmentId);
            redirect(`/grammar-reader/${slug}${qs.toString() ? `?${qs.toString()}` : ""}`);
        }
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

    // Get existing submission
    let submission = null;
    if (userRole === "student") {
        submission = await prisma.submission.findFirst({
            where: {
                userId,
                activityId: id,
                assignmentId: assignmentId ?? null,
            },
        });
        if (submission?.content && typeof submission.content === "string") {
            try {
                submission = {
                    ...submission,
                    content: JSON.parse(submission.content),
                };
            } catch {
                // Keep raw content if parsing fails.
            }
        }
    }

    const progressRecord = await prisma.activityProgress.findFirst({
        where: {
            userId,
            activityId: id,
            assignmentId: assignmentId ?? null,
        },
        select: {
            progress: true,
            categoryData: true,
        },
    });
    const progressValue = progressRecord?.progress ?? 0;
    const categoryData = progressRecord?.categoryData;

    // Parse content once
    let parsedContent: ActivityContent | null = null;
    try {
        parsedContent = parseActivityContent(activity.content);
    } catch {
        parsedContent = null;
    }

    // If activity is an external URL wrapper, redirect server-side to avoid flash
    if (parsedContent && typeof parsedContent === "object") {
        const externalUrl = (parsedContent as Record<string, unknown>).externalUrl;
        if (typeof externalUrl === "string") {
            redirect(externalUrl);
        }
    }

    // Check if this is an interactive or legacy guide
    const isInteractiveGuide =
        parsedContent && (isInteractiveGuideContent(parsedContent) || isLegacyGuideContent(parsedContent));

    // Grammar interactive guides should use the dedicated GrammarReader (newer UI + correct HTML rendering).
    if (activity.category === "grammar" && parsedContent && isInteractiveGuideContent(parsedContent)) {
        return (
            <div className="min-h-screen bg-bg">
                <GrammarReader
                    content={parsedContent}
                    completionKey={completionKeyFromActivityTitle(activity.title)}
                    activityId={id}
                />
            </div>
        );
    }

    // Full screen layout for interactive guides
    if (isInteractiveGuide) {
        return (
            <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
                {/* Minimal Header */}
                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 z-10 flex-shrink-0">
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        <div className="flex items-center justify-between gap-2">
                            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium whitespace-nowrap flex-shrink-0">
                                &larr; Back
                            </Link>
                            <h1 className="text-lg font-bold text-gray-900 truncate flex-1 min-w-0 text-center px-2">
                                {activity.title}
                            </h1>
                            <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                        </div>
                        {activity.description && (
                            <p className="text-xs text-gray-600 line-clamp-1">{activity.description}</p>
                        )}
                    </div>

                    {/* Desktop Layout: Horizontal */}
                    <div className="hidden sm:flex items-center justify-between">
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
                        <div className="ml-4 flex-shrink-0">
                            <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                        </div>
                    </div>
                </header>

                {/* Full Screen Guide */}
                <div className="flex-1 overflow-hidden min-h-0">
                    <ActivityRenderer
                        activity={activity}
                        assignmentId={assignmentId}
                        existingSubmission={submission}
                    />
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
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col gap-3 sm:hidden">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </Link>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <h1 className="text-lg font-bold text-gray-900 truncate flex-1 min-w-0">
                                {activity.title}
                            </h1>
                            <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                        </div>
                    </div>

                    {/* Desktop Layout: Horizontal */}
                    <div className="hidden sm:flex items-center justify-between">
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

                        {/* Progress Badge */}
                        <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                    </div>
                </div>
            </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 space-y-6">

                    {/* Activity Content */}
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <ActivityRenderer
                            activity={activity}
                            assignmentId={assignmentId}
                            existingSubmission={submission}
                        />
                    </div>

                    {/* Category Progress for Numbers Game */}
                    {id === 'numbers-game' && categoryData && (
                        <CategoryProgressDisplay
                            activityId={id}
                            categoryNames={numbersGameCategoryNames}
                            initialCategoryData={categoryData}
                        />
                    )}

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
