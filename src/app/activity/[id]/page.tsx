import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Script from "next/script";
import { isInteractiveGuideContent, isLegacyGuideContent, isVocabularyContent } from "@/types/activity";
import ActivityRenderer from "@/components/ActivityRenderer";
import { ActivityProgressBadge } from "@/components/ActivityProgressBadge";
import { CategoryProgressDisplay } from "@/components/CategoryProgressDisplay";
import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { completionKeyFromActivityTitle } from "@/utils/completionKey";
import { numbersGameCategoryNames } from "@/data/numbersGameCategories";
import { resolveActivityGameUi } from "@/lib/gamification/activity-points";
import NetworkStatusBanner from "@/components/NetworkStatusBanner";
import SubmissionOutboxManager from "@/components/SubmissionOutboxManager";
import { ContextualBackButton } from "@/components/navigation/ContextualBackButton";
import { LearnerMenu } from "@/components/navigation/LearnerMenu";
import { loadActivityPageData } from "./activity-page-data";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ assignment?: string; ui?: string; returnTo?: string }>;
}

export default async function ActivityPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { assignment: assignmentId, ui, returnTo } = await searchParams;

    const { activity, parsedContent, submission, progressValue, categoryData, viewer } = await loadActivityPageData({
        activityId: id,
        assignmentId,
        returnTo,
    });
    const userRole = viewer.userRole;
    const studentReliabilityOverlays = userRole === "student" ? (
        <>
            <NetworkStatusBanner />
            <SubmissionOutboxManager />
        </>
    ) : null;

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
    const shouldShowHeaderProgressBadge = activity.type !== "vocabulary";
    const activityForRender = { ...activity, ui: ui || activity.ui };

    // Grammar interactive guides should use the dedicated GrammarReader (newer UI + correct HTML rendering).
    if (activity.category === "grammar" && parsedContent && isInteractiveGuideContent(parsedContent)) {
        return (
            <div className="min-h-screen bg-bg">
                {studentReliabilityOverlays}
                <GrammarReader
                    content={parsedContent}
                    completionKey={completionKeyFromActivityTitle(activity.title)}
                    activityId={id}
                />
            </div>
        );
    }

    // Vocabulary activities use the immersive shell for both the picker and the sub-activities.
    if (activity.type === "vocabulary" && parsedContent && isVocabularyContent(parsedContent)) {
        return renderImmersiveActivity(
            studentReliabilityOverlays,
            activityForRender,
            assignmentId,
            submission,
            id,
            progressValue,
            userRole,
            shouldShowHeaderProgressBadge
        );
    }

    // Immersive games should render in the full-screen themed shell instead of the standard light activity page.
    const gameUi = activity.type === "game"
        ? resolveActivityGameUi({ ...activity, ui: ui || activity.ui })
        : null;
    if (
        gameUi === "irregular-verbs" ||
        gameUi === "matching" ||
        gameUi === "ed-pronunciation" ||
        gameUi === "minimal-pairs"
    ) {
        return renderImmersiveActivity(
            studentReliabilityOverlays,
            activityForRender,
            assignmentId,
            submission,
            id,
            progressValue,
            userRole,
            shouldShowHeaderProgressBadge
        );
    }

    // Full screen layout for interactive guides
    if (isInteractiveGuide) {
        return (
            <div className="fixed inset-0 bg-bg flex flex-col overflow-hidden">
                {studentReliabilityOverlays}
                {/* Minimal Header */}
                <header className="bg-white dark:bg-[#162b3d] border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 z-10 flex-shrink-0">
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <LearnerMenu mode="quiet" />
                                <ContextualBackButton className="flex-shrink-0" aria-label="Return to previous page" />
                            </div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1 min-w-0 text-center px-2">
                                {activity.title}
                            </h1>
                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                            )}
                        </div>
                        {activity.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{activity.description}</p>
                        )}
                    </div>

                    {/* Desktop Layout: Horizontal */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-1">
                                <LearnerMenu mode="quiet" />
                                <ContextualBackButton aria-label="Return to previous page" />
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{activity.title}</h1>
                            </div>
                            {activity.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 ml-0 mt-1 line-clamp-2">{activity.description}</p>
                            )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                            )}
                        </div>
                    </div>
                </header>

                {/* Full Screen Guide */}
                <div className="flex-1 overflow-hidden min-h-0">
                    <ActivityRenderer
                        activity={activityForRender}
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
        <div className="min-h-screen bg-bg">
            {studentReliabilityOverlays}
            <header className="bg-white dark:bg-[#162b3d] shadow-sm border-b border-gray-200 dark:border-white/10">
                <div className="relative py-4 px-4 sm:px-6 lg:px-8">
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <LearnerMenu mode="quiet" />
                                <ContextualBackButton className="flex-shrink-0" aria-label="Return to previous page" />
                            </div>
                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                            )}
                        </div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                            {activity.title}
                        </h1>
                    </div>

                    {/* Desktop Layout: Horizontal */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <LearnerMenu mode="quiet" />
                            <ContextualBackButton aria-label="Return to previous page" />
                        </div>

                        {/* Centered Title */}
                        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-900 dark:text-white">
                            {activity.title}
                        </h1>

                        {/* Progress Badge */}
                        {shouldShowHeaderProgressBadge && (
                            <ActivityProgressBadge activityId={id} initialProgress={progressValue} userRole={userRole} />
                        )}
                    </div>
                </div>
            </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 space-y-6">

                    {/* Activity Content */}
                    <div className="bg-white dark:bg-[#162b3d] shadow sm:rounded-lg p-6 dark:border dark:border-white/10">
                        <ActivityRenderer
                            activity={activityForRender}
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
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">Graded</h3>
                            {submission.score !== null && (
                                <p className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                                    Score: {submission.score}%
                                </p>
                            )}
                            {submission.feedback && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">Feedback:</p>
                                    <p className="text-green-700 dark:text-green-300">{submission.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function renderImmersiveActivity(
    overlays: ReactNode,
    activity: Parameters<typeof ActivityRenderer>[0]["activity"],
    assignmentId: string | undefined,
    submission: Parameters<typeof ActivityRenderer>[0]["existingSubmission"],
    activityId: string,
    progressValue: number | null | undefined,
    userRole: string | null | undefined,
    shouldShowHeaderProgressBadge: boolean
) {
    const shouldRenderImmersiveHeader = !(activity.type === "vocabulary" && activity.ui);

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {overlays}
            {shouldRenderImmersiveHeader && (
                <header className="border-b border-white/10 bg-bg/95 backdrop-blur-md shadow-sm flex-shrink-0">
                    <div className="relative px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-2 sm:hidden">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <LearnerMenu mode="quiet" />
                                    <ContextualBackButton className="flex-shrink-0" aria-label="Return to previous page" />
                                </div>
                                {shouldShowHeaderProgressBadge && (
                                    <ActivityProgressBadge activityId={activityId} initialProgress={progressValue} userRole={userRole} />
                                )}
                            </div>
                            <h1 className="text-base font-bold text-white line-clamp-2 leading-snug">
                                {activity.title}
                            </h1>
                        </div>

                        <div className="hidden sm:flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <LearnerMenu mode="quiet" />
                                <ContextualBackButton aria-label="Return to previous page" />
                            </div>

                            <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-white">
                                {activity.title}
                            </h1>

                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge activityId={activityId} initialProgress={progressValue} userRole={userRole} />
                            )}
                        </div>
                    </div>
                </header>
            )}

            <div className="flex-1 min-h-0 bg-bg">
                <ActivityRenderer
                    activity={activity}
                    assignmentId={assignmentId}
                    existingSubmission={submission}
                />
            </div>
        </div>
    );
}
