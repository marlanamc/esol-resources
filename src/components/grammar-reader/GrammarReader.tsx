"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { InteractiveGuideContent, InteractiveGuideSection, QuestionResponse } from "@/types/activity";
import { useRouter } from "next/navigation";
import { SectionHeader } from "./SectionHeader";
import { ExplanationPanel } from "./ExplanationPanel";
import { PracticePanel } from "./PracticePanel";
import { ProgressBar } from "./ProgressBar";
import { TableOfContents } from "./TableOfContents";
import { MiniQuizSection } from "./MiniQuizSection";
import { PointsToast } from "@/components/ui/PointsToast";
import Link from "next/link";
import { GrammarSaveQueue } from "@/lib/grammar-save-queue";
import { saveActivityProgress } from "@/lib/activityProgress";
import { getGuideWorkRemaining } from "@/lib/grammar-guide-completion";
import type { ExerciseCompletionInfo } from "./exercises/ExerciseSection";
import { LearnerMenu } from "@/components/navigation/LearnerMenu";
import { useResolvedLearnerReturnHref } from "@/hooks/useResolvedLearnerReturnHref";
import { RETURN_TO_QUERY_PARAM } from "@/lib/learner/navigation";
import { NotepadTextDashed } from "lucide-react";

interface GrammarReaderProps {
    content: InteractiveGuideContent;
    onComplete?: () => void;
    completionKey?: string;
    activityId?: string;
}

function getSlugFromPath(pathname: string | null): string | null {
    if (!pathname) return null;
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? null;
}

function formatGuideTitle(raw: string | null | undefined): string {
    if (!raw) return "Grammar";

    return raw
        .replace(/[-_]+/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function GrammarReader({ content, onComplete, completionKey, activityId }: GrammarReaderProps) {
    const router = useRouter();
    const storageKey = `grammarReader:${completionKey || "guide"}:unlocked`;
    const readerContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [completedSections, setCompletedSections] = useState<Set<string>>(
        new Set()
    );
    const [exerciseAnswers, setExerciseAnswers] = useState<
        Record<string, Record<number, string>>
    >({});
    const [showTOC, setShowTOC] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [unlockedPractice, setUnlockedPractice] = useState<Set<string>>(new Set());
    const practicePanelRef = useRef<HTMLDivElement | null>(null);
    const saveQueue = useRef(new GrammarSaveQueue());
    const [failedSaveCount, setFailedSaveCount] = useState(0);
    const [retryingSaves, setRetryingSaves] = useState(false);
    const [saveNotice, setSaveNotice] = useState("");
    const saveGuideWork = useCallback(async (key: string, operation: () => Promise<void>) => {
        const ok = await saveQueue.current.run(key, operation);
        setFailedSaveCount(saveQueue.current.failedCount);
        return ok;
    }, []);
    const retryGuideSaves = useCallback(async () => {
        setRetryingSaves(true);
        const ok = await saveQueue.current.retry();
        setFailedSaveCount(saveQueue.current.failedCount);
        setRetryingSaves(false);
        return ok;
    }, []);
    const [awardSent, setAwardSent] = useState(false);
    const [guideTitle, setGuideTitle] = useState<string>(() => formatGuideTitle(completionKey));
    const [showPractice, setShowPractice] = useState(true);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const [progressHydrated, setProgressHydrated] = useState(false);
    const quizSavedRef = useRef(false);
    const quizSavePromiseRef = useRef<Promise<boolean | undefined> | null>(null);
    const persistedProgressRef = useRef(0);
    const hasSkippedInitialProgressSaveRef = useRef(false);
    // The mini-quiz earns the checkmark; exercises remain available for practice points.
    const finishedExercisesRef = useRef<Set<string>>(new Set());
    const quizSubmittedRef = useRef(false);
    const [workHydrated, setWorkHydrated] = useState(false);
    const guideCompletedRef = useRef(false);
    const grammarActivitiesHref = "/dashboard/activities?category=grammar";
    const returnHref = useResolvedLearnerReturnHref({ fallbackHref: grammarActivitiesHref });
    const isFromMap = returnHref.startsWith("/dashboard/map");
    const sourceLabel = returnHref.startsWith("/grammar-map") ? "Grammar Map" : isFromMap ? "Course Map" : "Activities";
    const sectionKeys = useMemo(
        () => content.sections.map((section, index) => section.id || `section-${index}`),
        [content.sections]
    );

    const readAssignmentId = useCallback((): string | null => {
        if (typeof window === "undefined") return null;
        try {
            const value = new URLSearchParams(window.location.search).get("assignment");
            if (!value) return null;
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : null;
        } catch {
            return null;
        }
    }, []);

    // Restore resume state when opening the guide (section index + completed sections).
    useEffect(() => {
        if (!activityId || content.sections.length === 0) return;
        let cancelled = false;
        setProgressHydrated(false);
        hasSkippedInitialProgressSaveRef.current = false;
        (async () => {
            try {
                const params = new URLSearchParams({ activityId });
                const assignmentId = readAssignmentId();
                if (assignmentId) {
                    params.set("assignmentId", assignmentId);
                }

                const res = await fetch(`/api/activity/progress?${params.toString()}`, {
                    cache: "no-store",
                });
                if (!res.ok || cancelled) return;
                const data = await res.json();
                if (cancelled) return;

                const fetchedProgress =
                    typeof data.progress === "number"
                        ? Math.max(0, Math.min(100, Math.round(data.progress)))
                        : 0;
                persistedProgressRef.current = fetchedProgress;
                guideCompletedRef.current = data.status === "completed";

                let restoredLastSectionIndex: number | null = null;
                let restoredCompletedSectionIds: string[] = [];
                let hasRetiredOverviewSections = false;
                const categoryData = data.categoryData;
                if (categoryData && typeof categoryData === "string") {
                    const parsed = JSON.parse(categoryData) as {
                        _guide?: { lastSectionIndex?: number; completedSectionIds?: string[] };
                    };
                    const idx = parsed?._guide?.lastSectionIndex;
                    if (typeof idx === "number") {
                        restoredLastSectionIndex = idx;
                    }
                    const savedCompleted = parsed?._guide?.completedSectionIds;
                    if (Array.isArray(savedCompleted)) {
                        hasRetiredOverviewSections = completionKey === "verb-forms-overview" &&
                            savedCompleted.some((id) => ["your-study-toolkit", "small-study-routine", "quiz-ready"].includes(id));
                        restoredCompletedSectionIds = Array.from(
                            new Set(
                                savedCompleted
                                    .filter((item): item is string => typeof item === "string")
                                    .map((item) => item.trim())
                                    .filter((item) => sectionKeys.includes(item))
                            )
                        );
                    }
                }

                if (typeof restoredLastSectionIndex === "number") {
                    const clamped = Math.max(0, Math.min(restoredLastSectionIndex, content.sections.length - 1));
                    // Old numeric positions no longer match the shortened overview.
                    const firstIncomplete = sectionKeys.findIndex((id) => !restoredCompletedSectionIds.includes(id));
                    setCurrentSectionIndex(hasRetiredOverviewSections
                        ? (firstIncomplete < 0 ? content.sections.length - 1 : firstIncomplete)
                        : clamped);
                }

                if (restoredCompletedSectionIds.length > 0) {
                    setCompletedSections(new Set(restoredCompletedSectionIds));
                } else if (fetchedProgress >= 100) {
                    // Legacy records may have progress=100 without section-level completion keys.
                    setCompletedSections(new Set(sectionKeys));
                } else {
                    setCompletedSections(new Set());
                }
            } catch {
                // non-blocking; start at section 0
            } finally {
                if (!cancelled) {
                    setProgressHydrated(true);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [activityId, completionKey, content.sections.length, readAssignmentId, sectionKeys]);

    useEffect(() => {
        if (!completionKey) return;
        let cancelled = false;
        (async () => {
            try {
                const params = new URLSearchParams({ slug: completionKey });
                if (activityId) params.set("activityId", activityId);
                const res = await fetch(`/api/grammar/exercise-progress?${params.toString()}`, { cache: "no-store" });
                if (!res.ok || cancelled) return;
                const data = await res.json() as {
                    exercises?: Record<string, { completed?: boolean }>;
                    miniQuizSubmitted?: boolean;
                };
                if (cancelled) return;
                for (const [key, exercise] of Object.entries(data.exercises ?? {})) {
                    if (exercise?.completed) finishedExercisesRef.current.add(key);
                }
                if (data.miniQuizSubmitted) quizSubmittedRef.current = true;
                setWorkHydrated(true);
            } catch {
                // non-blocking; work done this visit still counts
            }
        })();
        return () => { cancelled = true; };
    }, [activityId, completionKey]);

    /** Saves 100% (the checkmark) once all guide work is done; otherwise reports what is left. */
    const saveCompletionIfDone = useCallback(async () => {
        const remaining = getGuideWorkRemaining(content, finishedExercisesRef.current, quizSubmittedRef.current);
        if (!remaining.done || !activityId || guideCompletedRef.current) return remaining;
        const result = await saveActivityProgress(
            activityId,
            100,
            "completed",
            undefined,
            undefined,
            readAssignmentId(),
            {
                lastSectionIndex: Math.max(0, content.sections.length - 1),
                completedSectionIds: sectionKeys,
            }
        );
        if (!result?.ok) throw new Error("Completion progress did not save");
        guideCompletedRef.current = true;
        persistedProgressRef.current = 100;
        return remaining;
    }, [activityId, content, readAssignmentId, sectionKeys]);

    // Reconcile previously saved quizzes, including guides left at 99% by the old rule.
    useEffect(() => {
        if (!progressHydrated || !workHydrated || !quizSubmittedRef.current) return;
        void saveGuideWork("completion-progress", async () => { await saveCompletionIfDone(); });
    }, [progressHydrated, workHydrated, saveCompletionIfDone, saveGuideWork]);

    // Fallback title if a page didn't provide completionKey.
    useEffect(() => {
        if (completionKey) {
            setGuideTitle(formatGuideTitle(completionKey));
            return;
        }

        try {
            setGuideTitle(formatGuideTitle(getSlugFromPath(window.location.pathname)));
        } catch {
            // ignore
        }
    }, [completionKey]);

    const awardCompletion = useCallback(async (quizScore?: number, quizTotal?: number, responses?: QuestionResponse[]) => {
        if (!completionKey) return;
        // Don't skip if it's a quiz score update, as students can take it multiple times
        if (awardSent && quizScore === undefined) return;

        return saveGuideWork("completion", async () => {
            const assignmentId = readAssignmentId();
            const completionResponse = await fetch("/api/grammar/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: completionKey,
                    score: quizScore,
                    total: quizTotal,
                    activityId,
                    responses,
                    assignmentId,
                }),
                signal: AbortSignal.timeout(20000),
            });
            if (!completionResponse.ok) {
                throw new Error(`/api/grammar/complete failed with ${completionResponse.status}`);
            }
            const award = await completionResponse.json();
            if (quizScore !== undefined) quizSubmittedRef.current = true;
            const remaining = await saveCompletionIfDone();
            if (award.points > 0 && award.awarded) {
                setPointsToast({ points: award.points, key: Date.now() });
            }
            if (remaining.done) {
                const credit = award.points > 0 && award.awarded ? ` +${award.points} points.` : "";
                setSaveNotice(`Guide complete!${credit} You can keep practicing for exercise points.`);
            } else if (remaining.exercisesLeft > 0) {
                const exercises = remaining.exercisesLeft === 1 ? "1 more practice exercise" : `${remaining.exercisesLeft} more practice exercises`;
                setSaveNotice(`Saved. Finish ${exercises} to complete this guide.`);
            } else if (award.points > 0 && award.awarded) {
                setSaveNotice(`Practice saved. +${award.points} completion points.`);
            } else if (award.message) {
                setSaveNotice(award.message);
            } else {
                setSaveNotice("Practice saved. Any previously earned points are already in your balance.");
            }
            if (quizScore === undefined) setAwardSent(true);
            else quizSavedRef.current = true;
        });
    }, [completionKey, awardSent, activityId, readAssignmentId, saveGuideWork, saveCompletionIfDone]);

    // Track progress as user navigates through sections (and save last section for resume)
    useEffect(() => {
        if (!activityId || content.sections.length === 0 || !progressHydrated) return;
        if (!hasSkippedInitialProgressSaveRef.current) {
            hasSkippedInitialProgressSaveRef.current = true;
            return;
        }

        const totalSections = content.sections.length;
        const sectionsViewed = currentSectionIndex + 1;
        const sectionsCompleted = completedSections.size;

        // Calculate progress based on sections viewed and completed
        // Weight: 20% for viewing sections, 80% for completing exercises
        // This prioritizes actually doing the work over just clicking through
        const viewProgress = (sectionsViewed / totalSections) * 20;
        const completionProgress = (sectionsCompleted / totalSections) * 80;
        const totalProgress = Math.round(viewProgress + completionProgress);
        // Reading every section is not enough for the checkmark; stay below 100 until the work is done.
        const workDone = guideCompletedRef.current ||
            getGuideWorkRemaining(content, finishedExercisesRef.current, quizSubmittedRef.current).done;
        const progressToSave = Math.max(workDone ? totalProgress : Math.min(totalProgress, 99), persistedProgressRef.current);
        const assignmentId = readAssignmentId();

        let cancelled = false;
        (async () => {
            const result = await saveActivityProgress(
                activityId,
                progressToSave,
                progressToSave >= 100 ? "completed" : "in_progress",
                undefined,
                undefined,
                assignmentId,
                {
                    lastSectionIndex: currentSectionIndex,
                    completedSectionIds: Array.from(completedSections),
                }
            );
            if (cancelled) return;

            if (typeof result?.progress === "number") {
                persistedProgressRef.current = Math.max(persistedProgressRef.current, result.progress);
            } else {
                persistedProgressRef.current = Math.max(persistedProgressRef.current, progressToSave);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [activityId, content, currentSectionIndex, completedSections, progressHydrated, readAssignmentId]);

    useEffect(() => {
        try {
            const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setUnlockedPractice(new Set(parsed));
                }
            }
        } catch {
            // ignore storage errors
        }
    }, [storageKey]);

    const currentSection = showQuiz
        ? null
        : content.sections[currentSectionIndex];
    const currentSectionKey = currentSection?.id || `section-${currentSectionIndex}`;

    const effectiveSection: InteractiveGuideSection | null = useMemo(() => {
        if (!currentSection) return null;
        return {
            ...currentSection,
            exercises: currentSection.exercises || [],
        };
    }, [currentSection]);

    const currentHasExercises = !!effectiveSection?.exercises && effectiveSection.exercises.length > 0;
    const practiceUnlocked = currentHasExercises
        ? unlockedPractice.has(currentSectionKey)
        : true;
    
    // Only show the split layout after exercises are unlocked (matches the original reader UX)
    const showSplitLayout = useMemo(() => 
        currentHasExercises && practiceUnlocked && showPractice
    , [currentHasExercises, practiceUnlocked, showPractice]);

    useEffect(() => {
        if (currentHasExercises) {
            setShowPractice(true);
        }
    }, [currentSectionKey, currentHasExercises]);

    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === content.sections.length - 1;
    const markCurrentSectionComplete = useCallback(() => {
        setCompletedSections((prev) => {
            if (prev.has(currentSectionKey)) return prev;
            const next = new Set(prev);
            next.add(currentSectionKey);
            return next;
        });
    }, [currentSectionKey]);

    const scrollReaderToTop = useCallback((behavior: ScrollBehavior = "smooth") => {
        if (typeof window === "undefined") return;

        window.scrollTo({ top: 0, behavior });
        document.scrollingElement?.scrollTo({ top: 0, behavior });

        const container = readerContainerRef.current;
        if (!container) return;

        container.scrollIntoView({ block: "start", behavior });

        let ancestor: HTMLElement | null = container.parentElement;
        while (ancestor) {
            const style = window.getComputedStyle(ancestor);
            const isScrollable =
                (style.overflowY === "auto" || style.overflowY === "scroll" || style.overflowY === "overlay") &&
                ancestor.scrollHeight > ancestor.clientHeight;

            if (isScrollable) {
                ancestor.scrollTo({ top: 0, behavior });
            }

            ancestor = ancestor.parentElement;
        }
    }, []);

    const handleNext = useCallback(() => {
        if (!isLastSection) {
            // Mark current section as completed
            markCurrentSectionComplete();
            setCurrentSectionIndex((prev) => prev + 1);
        } else if (content.miniQuiz && !showQuiz) {
            // Show quiz after last section
            markCurrentSectionComplete();
            setShowQuiz(true);
        } else if (!content.miniQuiz) {
            // Completed without quiz
            markCurrentSectionComplete();
            void awardCompletion();
            if (onComplete) {
                onComplete();
            }
        }
    }, [isLastSection, content.miniQuiz, showQuiz, awardCompletion, onComplete, markCurrentSectionComplete]);

    const handlePrevious = useCallback(() => {
        if (showQuiz) {
            setShowQuiz(false);
        } else if (!isFirstSection) {
            setCurrentSectionIndex((prev) => prev - 1);
        }
    }, [isFirstSection, showQuiz]);

    useEffect(() => {
        const rafId = window.requestAnimationFrame(() => {
            scrollReaderToTop(currentSectionIndex === 0 && !showQuiz ? "auto" : "smooth");
        });

        return () => window.cancelAnimationFrame(rafId);
    }, [currentSectionIndex, showQuiz, scrollReaderToTop]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" && !isLastSection) {
                handleNext();
            } else if (e.key === "ArrowLeft" && !isFirstSection) {
                handlePrevious();
            } else if (e.key === "Escape" && showTOC) {
                setShowTOC(false);
            } else if (e.key === "Escape" && showQuiz) {
                setShowQuiz(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrevious, isFirstSection, isLastSection, showTOC, showQuiz]);

    const handleSectionComplete = useCallback(() => {
        markCurrentSectionComplete();
    }, [markCurrentSectionComplete]);

    const handleExerciseComplete = useCallback(async (info: ExerciseCompletionInfo) => {
        if (!completionKey) return;

        await saveGuideWork(`exercise:${info.sectionId}:${info.exerciseId}`, async () => {
            const response = await fetch("/api/grammar/exercise-progress", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: completionKey, activityId, exerciseId: info.exerciseId, sectionId: info.sectionId }),
                signal: AbortSignal.timeout(20000),
            });
            if (!response.ok) throw new Error("Exercise save failed");
            const data = await response.json();
            if (data.pointsAwarded > 0) setPointsToast({ points: data.pointsAwarded, key: Date.now() });
            finishedExercisesRef.current.add(`${info.sectionId}:${info.exerciseId}`);
            // Finishing the last exercise after the quiz completes the guide.
            if (quizSubmittedRef.current || !content.miniQuiz?.length) await saveCompletionIfDone();
        });
    }, [completionKey, activityId, content.miniQuiz, saveGuideWork, saveCompletionIfDone]);

    const handleUnlockExercises = useCallback(() => {
        if (!currentSectionKey || !currentHasExercises) return;
        setUnlockedPractice((prev) => {
            const next = new Set(prev);
            next.add(currentSectionKey);
            return next;
        });
    }, [currentHasExercises, currentSectionKey]);

    const handleTogglePractice = useCallback(() => {
        if (!currentHasExercises || !practiceUnlocked) return;
        setShowPractice((prev) => !prev);
    }, [currentHasExercises, practiceUnlocked]);

    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, JSON.stringify(Array.from(unlockedPractice)));
            }
        } catch {
            // ignore storage errors
        }
    }, [storageKey, unlockedPractice]);

    useEffect(() => {
        if (practiceUnlocked && showSplitLayout && practicePanelRef.current) {
            practicePanelRef.current.focus();
        }
    }, [practiceUnlocked, showSplitLayout]);

    const handleAnswerChange = useCallback(
        (exerciseId: string, itemIndex: number, value: string) => {
            setExerciseAnswers((prev) => ({
                ...prev,
                [exerciseId]: {
                    ...(prev[exerciseId] || {}),
                    [itemIndex]: value,
                },
            }));
        },
        []
    );

    const handleJumpToSection = useCallback((index: number) => {
        // Batch these updates to avoid multiple re-renders
        setCurrentSectionIndex(index);
        setShowTOC(false);
        setShowQuiz(false);
    }, []);

    const buildMiniQuizCertificateHref = useCallback((score: number, total: number) => {
        const params = new URLSearchParams();
        params.set("score", String(score));
        params.set("total", String(total));
        params.set("title", guideTitle);
        if (completionKey) {
            params.set("slug", completionKey);
        }
        if (activityId) {
            params.set("activityId", activityId);
        }
        const assignmentId = readAssignmentId();
        if (assignmentId) {
            params.set("assignment", assignmentId);
        }
        if (returnHref) {
            params.set(RETURN_TO_QUERY_PARAM, returnHref);
        }
        return `/dashboard/certificates/mini-quiz?${params.toString()}`;
    }, [activityId, completionKey, guideTitle, readAssignmentId, returnHref]);

    // Save quiz score and responses immediately when student submits (before they click "Finish")
    const handleQuizScoreSubmit = useCallback((score: number, total: number, responses?: QuestionResponse[]) => {
        quizSavedRef.current = false;
        const savePromise = awardCompletion(score, total, responses);
        quizSavePromiseRef.current = savePromise;
        void savePromise.finally(() => {
            if (quizSavePromiseRef.current === savePromise) {
                quizSavePromiseRef.current = null;
            }
        });
    }, [awardCompletion]);

    // Called when student clicks "Finish" after seeing score.
    const handleQuizComplete = useCallback(async (score: number, total: number) => {
        if (quizSavePromiseRef.current) await quizSavePromiseRef.current;
        if (!(await retryGuideSaves())) return;
        if (!quizSavedRef.current) await awardCompletion(score, total);
        if (!(await retryGuideSaves())) return;
        router.push(buildMiniQuizCertificateHref(score, total));
        if (onComplete) {
            onComplete();
        }
    }, [awardCompletion, buildMiniQuizCertificateHref, onComplete, router, retryGuideSaves]);

    return (
        <div ref={readerContainerRef} className="grammar-reader-container min-h-dvh bg-bg" data-testid="grammar-reader-shell">
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {failedSaveCount > 0 && <div role="alert" className="sticky top-0 z-50 border border-red-300 bg-white p-4 text-text">
                <p>Your practice has not finished saving. Keep this page open and retry so your work and points are saved.</p>
                <button className="mt-2 min-h-12 rounded-lg bg-primary px-4 text-white" disabled={retryingSaves} onClick={() => void retryGuideSaves()}>{retryingSaves ? "Saving…" : "Retry saving practice"}</button>
            </div>}
            {saveNotice && <p role="status" className="bg-secondary/10 p-3 text-text">{saveNotice}</p>}
            {/* Main Content Container - Everything in one card */}
            <main className="w-full px-0 py-0 pb-24 sm:px-4 sm:py-4 md:container md:mx-auto md:pb-4">
                <div className="grammar-reader-split-screen rounded-none border-y border-text/35 shadow-none overflow-hidden sm:rounded-xl sm:border sm:shadow-lg">
                    {/* Compact Header: Breadcrumb + Progress + TOC */}
                    <div className="border-b border-border bg-bg-light">
                        <div className="px-4 sm:px-6 py-3 group">
                            {/* Top Row: Breadcrumb and TOC Button */}
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <div className="flex items-center flex-shrink-0">
                                    <LearnerMenu mode="quiet" className="h-9 w-9" />
                                </div>
                                <nav className="flex items-center gap-1.5 text-xs overflow-x-auto flex-1 min-w-0">
                                    {!isFromMap && (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="text-primary hover:underline flex-shrink-0"
                                            >
                                                Home
                                            </Link>
                                            <span className="text-text-muted flex-shrink-0">/</span>
                                        </>
                                    )}
                                    <Link
                                        href={returnHref}
                                        className="text-primary hover:underline flex-shrink-0"
                                    >
                                        {sourceLabel}
                                    </Link>
                                    {!isFromMap && (
                                        <>
                                            <span className="text-text-muted flex-shrink-0">/</span>
                                            <Link
                                                href={grammarActivitiesHref}
                                                className="text-primary hover:underline flex-shrink-0"
                                            >
                                                Grammar
                                            </Link>
                                        </>
                                    )}
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <span className="text-text font-medium flex-shrink-0">{guideTitle}</span>
                                </nav>

                                <div className="flex items-center gap-2 flex-shrink-0 pt-0.5 md:pt-0">
                                    {/* TOC Button */}
                                    {content.tableOfContents && (
                                        <button
                                            onClick={() => setShowTOC(!showTOC)}
                                            className="grammar-reader-toc-toggle flex-shrink-0 text-xs text-primary hover:text-primary-dark flex items-center gap-1 px-2 py-1 rounded transition-colors"
                                        >
                                            <NotepadTextDashed className="w-3.5 h-3.5" aria-hidden="true" />
                                            {showTOC ? "Hide" : "Show"} TOC
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar - Compact (hidden until hover) */}
                            <div className="transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-focus-within:max-h-20 group-focus-within:opacity-100">
                                <ProgressBar
                                    total={content.sections.length}
                                    current={currentSectionIndex}
                                    completed={completedSections.size}
                                    readingProgress={completionKey === "questions-real-answers"}
                                />
                            </div>
                        </div>

                        {/* Table of Contents - Expandable (desktop only; mobile uses bottom sheet) */}
                        {content.tableOfContents && showTOC && (
                            <div className="hidden md:block px-4 sm:px-6 pb-4 border-t border-border">
                                <div className="pt-4">
                                    <TableOfContents
                                        sections={content.sections}
                                        onSelectSection={handleJumpToSection}
                                        onClose={() => setShowTOC(false)}
                                        currentIndex={currentSectionIndex}
                                        completedSections={completedSections}
                                        hasMiniQuiz={!!content.miniQuiz}
                                        showingQuiz={showQuiz}
                                        onSelectQuiz={() => setShowQuiz(true)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mini Quiz Section */}
                    {showQuiz && content.miniQuiz && (
                        <div className="md:p-6">
                            <MiniQuizSection
                                questions={content.miniQuiz}
                                onComplete={handleQuizComplete}
                                onScoreSubmit={handleQuizScoreSubmit}
                                topicTitle={guideTitle}
                                onBack={() => setShowQuiz(false)}
                            />
                        </div>
                    )}

                    {/* Main Content: Split Screen Layout */}
                    {!showQuiz && currentSection && (
                        <>
                            {/* Section Header */}
                            <SectionHeader
                                section={currentSection}
                                sectionNumber={currentSectionIndex + 1}
                                totalSections={content.sections.length}
                            />

                            {/* Split Screen Content */}
                            {showSplitLayout ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                                    {/* Left Side: Explanation */}
                                    <ExplanationPanel
                                        section={effectiveSection!}
                                        onUnlockExercises={handleUnlockExercises}
                                        practiceUnlocked={practiceUnlocked}
                                        hasExercises={currentHasExercises}
                                        showPractice={showPractice}
                                        onTogglePractice={handleTogglePractice}
                                        variant="split"
                                        className="w-full"
                                    />

                                    {/* Right Side: Practice */}
                                    <div
                                        ref={practicePanelRef}
                                        tabIndex={-1}
                                        aria-live="polite"
                                        className="outline-none"
                                    >
                                        <PracticePanel
                                            section={effectiveSection!}
                                            sectionId={currentSectionKey}
                                            answers={exerciseAnswers}
                                            onAnswerChange={handleAnswerChange}
                                            onSectionComplete={handleSectionComplete}
                                            onExerciseComplete={handleExerciseComplete}
                                            rewardAttempts={completionKey !== 'welcome-back-tenses-review' && completionKey !== 'parts-of-speech'}
                                            unlocked={practiceUnlocked}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full min-h-[500px]">
                                    <ExplanationPanel
                                        section={effectiveSection!}
                                        onUnlockExercises={handleUnlockExercises}
                                        practiceUnlocked={practiceUnlocked}
                                        hasExercises={currentHasExercises}
                                        showPractice={showPractice}
                                        onTogglePractice={handleTogglePractice}
                                        variant="full"
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Section Counter Footer - Hidden on mobile (shown in bottom bar instead) */}
                    {!showTOC && (
                        <div className="hidden md:block px-4 sm:px-6 py-3 border-t border-border bg-bg-light">
                            <div className="text-center">
                                <div className="text-sm text-text-muted">
                                    {showQuiz
                                        ? "Mini Quiz"
                                        : `Section ${currentSectionIndex + 1} of ${content.sections.length}`}
                                </div>
                                {/* Keyboard Shortcuts Hint - hidden on mobile (uses bottom bar instead) */}
                                <div className="hidden md:block text-xs text-text-muted mt-2">
                                    <p>
                                        Use <kbd className="px-2 py-1 rounded border border-border">←</kbd>{" "}
                                        and <kbd className="px-2 py-1 rounded border border-border">→</kbd>{" "}
                                        to navigate
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating Navigation Buttons - Outside the card, on sides */}
                {!showTOC && (
                    <>
                        {/* Previous Button - Left Side */}
                        {(!showQuiz && !isFirstSection) || showQuiz ? (
                            <button
                                onClick={handlePrevious}
                                disabled={!showQuiz && isFirstSection}
                                className="grammar-reader-nav-button grammar-reader-nav-button-secondary hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 h-14 w-14 items-center justify-center rounded-full border-2 border-border shadow-lg transition-[border-color,background-color,color] duration-200 group disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                aria-label="Previous section"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                <span className="absolute left-full ml-3 px-3 py-2 bg-text text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    Previous
                                </span>
                            </button>
                        ) : null}

                        {/* Next Button - Right Side */}
                        <button
                            onClick={handleNext}
                            disabled={showQuiz && !content.miniQuiz}
                            className="grammar-reader-nav-button grammar-reader-nav-button-primary hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 h-14 w-14 items-center justify-center rounded-full shadow-lg transition-[background-color,transform] duration-200 group disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            aria-label="Next section"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                            <span className="absolute right-full mr-3 px-3 py-2 bg-text text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {isLastSection && content.miniQuiz && !showQuiz
                                    ? "Take Quiz"
                                    : showQuiz
                                        ? "Finish"
                                        : "Next"}
                            </span>
                        </button>
                    </>
                )}

                {/* Mobile TOC bottom sheet - sits above the nav bar so both stay visible */}
                {content.tableOfContents && showTOC && (
                    <div
                        className="md:hidden fixed left-0 right-0 z-10 overflow-y-auto rounded-t-2xl border-t-2 border-x-2 border-border bg-bg shadow-[0_-8px_24px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-8 duration-300"
                        style={{
                            bottom: "calc(4rem + env(safe-area-inset-bottom, 0px))",
                            maxHeight: "min(60vh, 400px)",
                        }}
                    >
                        <div className="p-4 pb-2">
                            <TableOfContents
                                sections={content.sections}
                                onSelectSection={handleJumpToSection}
                                onClose={() => setShowTOC(false)}
                                currentIndex={currentSectionIndex}
                                completedSections={completedSections}
                                hasMiniQuiz={!!content.miniQuiz}
                                showingQuiz={showQuiz}
                                onSelectQuiz={() => setShowQuiz(true)}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile bottom nav bar - always visible so user can toggle TOC via section counter */}
                {!showQuiz && (
                    <div
                        className="flex md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-border items-center justify-between gap-2 px-3 py-2 safe-area-bottom-padding-mobile-lg"
                        style={{ backgroundColor: "var(--surface-overlay)" }}
                    >
                        <button
                            onClick={handlePrevious}
                            disabled={!showQuiz && isFirstSection}
                            aria-label="Previous section"
                            className={`grammar-reader-nav-button min-w-[72px] min-h-[40px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                                (!showQuiz && !isFirstSection) || showQuiz
                                    ? "grammar-reader-nav-button-secondary border-2 border-border"
                                    : "bg-border text-text-muted cursor-not-allowed"
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            Prev
                        </button>
                        {content.tableOfContents ? (
                            <button
                                type="button"
                                onClick={() => setShowTOC((prev) => !prev)}
                                className={`text-sm font-semibold flex-shrink-0 py-1.5 px-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${showTOC ? "text-primary bg-primary/10" : "text-text-muted hover:bg-border/40 hover:text-text"}`}
                                aria-label={showTOC ? "Close table of contents" : "Open table of contents"}
                                aria-expanded={showTOC}
                            >
                                {showQuiz
                                    ? "Mini Quiz"
                                    : `Section ${currentSectionIndex + 1} of ${content.sections.length}`}
                            </button>
                        ) : (
                            <div className="text-sm font-semibold text-text-muted flex-shrink-0">
                                {showQuiz
                                    ? "Mini Quiz"
                                    : `Section ${currentSectionIndex + 1} of ${content.sections.length}`}
                            </div>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={showQuiz && !content.miniQuiz}
                            aria-label={
                                isLastSection && content.miniQuiz && !showQuiz
                                    ? "Take Quiz"
                                    : showQuiz
                                        ? "Finish"
                                        : "Next section"
                            }
                            className={`grammar-reader-nav-button min-w-[72px] min-h-[40px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                                !(showQuiz && !content.miniQuiz)
                                    ? "grammar-reader-nav-button-primary"
                                    : "bg-border text-text-muted cursor-not-allowed"
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            {isLastSection && content.miniQuiz && !showQuiz
                                ? "Take Quiz"
                                : showQuiz
                                    ? "Finish"
                                    : "Next"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
