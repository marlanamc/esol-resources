"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { InteractiveGuideContent, InteractiveGuideSection, QuestionResponse } from "@/types/activity";
import { SectionHeader } from "./SectionHeader";
import { ExplanationPanel } from "./ExplanationPanel";
import { PracticePanel } from "./PracticePanel";
import { ProgressBar } from "./ProgressBar";
import { TableOfContents } from "./TableOfContents";
import { MiniQuizSection } from "./MiniQuizSection";
import { PointsToast } from "@/components/ui/PointsToast";
import Link from "next/link";
import { saveActivityProgress } from "@/lib/activityProgress";
import type { ExerciseCompletionInfo } from "./exercises/ExerciseSection";

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
    const storageKey = `grammarReader:${completionKey || "guide"}:unlocked`;
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
    const [awardSent, setAwardSent] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activitiesHref, setActivitiesHref] = useState<string>("/dashboard/activities");
    const [guideTitle, setGuideTitle] = useState<string>(() => formatGuideTitle(completionKey));
    const [showPractice, setShowPractice] = useState(true);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

    // Restore last section when opening the guide (so students return to where they left off)
    useEffect(() => {
        if (!activityId || content.sections.length === 0) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/activity/progress?activityId=${encodeURIComponent(activityId)}`);
                if (!res.ok || cancelled) return;
                const data = await res.json();
                if (cancelled) return;
                const categoryData = data.categoryData;
                if (categoryData && typeof categoryData === "string") {
                    const parsed = JSON.parse(categoryData) as { _guide?: { lastSectionIndex?: number } };
                    const idx = parsed?._guide?.lastSectionIndex;
                    if (typeof idx === "number") {
                        const clamped = Math.max(0, Math.min(idx, content.sections.length - 1));
                        setCurrentSectionIndex(clamped);
                    }
                }
            } catch {
                // non-blocking; start at section 0
            }
        })();
        return () => { cancelled = true; };
    }, [activityId, content.sections.length]);

    // Detect if we're on desktop (md breakpoint: 768px)
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Choose where the "Activities" breadcrumb should take the user based on entry point.
    useEffect(() => {
        let fromParam: string | null = null;
        try {
            fromParam = new URLSearchParams(window.location.search).get("from");
        } catch {
            // ignore
        }

        if (fromParam === "grammar-map") {
            setActivitiesHref("/grammar-map");
            return;
        }

        // Backward-compat: if the user navigated here directly from /grammar-map.
        try {
            const ref = document.referrer;
            if (ref) {
                const url = new URL(ref);
                if (url.pathname === "/grammar-map") {
                    setActivitiesHref("/grammar-map");
                    return;
                }
            }
        } catch {
            // ignore
        }

        setActivitiesHref("/dashboard/activities");
    }, []);

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

        try {
            await fetch("/api/grammar/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: completionKey,
                    score: quizScore,
                    total: quizTotal,
                    activityId,
                    responses
                }),
            });
            // Also save 100% progress if activityId is provided
            if (activityId) {
                await saveActivityProgress(activityId, 100, "completed");
            }
        } catch {
            // non-blocking; user still reached completion
        } finally {
            if (quizScore === undefined) {
                setAwardSent(true);
            }
        }
    }, [completionKey, awardSent, activityId]);

    // Track progress as user navigates through sections (and save last section for resume)
    useEffect(() => {
        if (!activityId || content.sections.length === 0) return;

        const totalSections = content.sections.length;
        const sectionsViewed = currentSectionIndex + 1;
        const sectionsCompleted = completedSections.size;

        // Calculate progress based on sections viewed and completed
        // Weight: 20% for viewing sections, 80% for completing exercises
        // This prioritizes actually doing the work over just clicking through
        const viewProgress = (sectionsViewed / totalSections) * 20;
        const completionProgress = (sectionsCompleted / totalSections) * 80;
        const totalProgress = Math.round(viewProgress + completionProgress);

        void saveActivityProgress(
            activityId,
            totalProgress,
            totalProgress >= 100 ? "completed" : "in_progress",
            undefined,
            undefined,
            undefined,
            { lastSectionIndex: currentSectionIndex }
        );
    }, [activityId, currentSectionIndex, completedSections.size, content.sections.length]);

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

    const handleNext = useCallback(() => {
        if (!isLastSection) {
            // Mark current section as completed
            if (currentSection?.id) {
                setCompletedSections((prev) => new Set(prev).add(currentSection.id!));
            }
            setCurrentSectionIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (content.miniQuiz && !showQuiz) {
            // Show quiz after last section
            if (currentSection?.id) {
                setCompletedSections((prev) => new Set(prev).add(currentSection.id!));
            }
            setShowQuiz(true);
        } else if (!content.miniQuiz) {
            // Completed without quiz
            if (currentSection?.id) {
                setCompletedSections((prev) => new Set(prev).add(currentSection.id!));
            }
            void awardCompletion();
            if (onComplete) {
                onComplete();
            }
        }
    }, [isLastSection, currentSection, content.miniQuiz, showQuiz, awardCompletion, onComplete]);

    const handlePrevious = useCallback(() => {
        if (showQuiz) {
            setShowQuiz(false);
        } else if (!isFirstSection) {
            setCurrentSectionIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [isFirstSection, showQuiz]);

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
        if (currentSection?.id) {
            setCompletedSections((prev) => new Set(prev).add(currentSection.id!));
        }
    }, [currentSection]);

    const handleExerciseComplete = useCallback(async (info: ExerciseCompletionInfo) => {
        if (!completionKey) return;

        try {
            const response = await fetch("/api/grammar/exercise-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: completionKey,
                    activityId,
                    exerciseId: info.exerciseId,
                    sectionId: info.sectionId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.pointsAwarded > 0) {
                    setPointsToast({ points: data.pointsAwarded, key: Date.now() });
                }
            }
        } catch {
            // Non-blocking; don't interrupt user experience
        }
    }, [completionKey, activityId]);

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
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Save quiz score and responses immediately when student submits (before they click "Finish")
    const handleQuizScoreSubmit = useCallback((score: number, total: number, responses?: QuestionResponse[]) => {
        void awardCompletion(score, total, responses);
    }, [awardCompletion]);

    // Called when student clicks "Finish" - just closes the quiz view
    const handleQuizComplete = useCallback((_score: number, _total: number) => {
        setShowQuiz(false);
        if (onComplete) {
            onComplete();
        }
    }, [onComplete]);

    return (
        <div className="grammar-reader-container min-h-screen bg-bg">
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {/* Main Content Container - Everything in one card */}
            <main className="container mx-auto px-4 py-4 pb-24 md:pb-4">
                <div className="grammar-reader-split-screen bg-white rounded-xl shadow-lg border border-border overflow-hidden">
                    {/* Compact Header: Breadcrumb + Progress + TOC */}
                    <div className="border-b border-border bg-bg-light">
                        <div className="px-6 py-3 group">
                            {/* Top Row: Breadcrumb and TOC Button */}
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <nav className="flex items-center gap-1.5 text-xs overflow-x-auto flex-1 min-w-0">
                                    <Link
                                        href={activitiesHref}
                                        className="text-primary hover:underline flex-shrink-0"
                                    >
                                        Activities
                                    </Link>
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <Link
                                        href={isDesktop ? "/dashboard" : "/dashboard/activities?category=grammar"}
                                        className="text-primary hover:underline flex-shrink-0"
                                    >
                                        Grammar
                                    </Link>
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <span className="text-text font-medium flex-shrink-0">{guideTitle}</span>
                                </nav>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Link
                                        href="/dashboard"
                                        className="text-xs text-primary hover:text-primary-dark px-3 py-1 rounded-full border border-border hover:border-primary transition-colors bg-white shadow-sm"
                                    >
                                        Home
                                    </Link>
                                    {/* TOC Button */}
                                    {content.tableOfContents && (
                                        <button
                                            onClick={() => setShowTOC(!showTOC)}
                                            className="flex-shrink-0 text-xs text-primary hover:text-primary-dark flex items-center gap-1 px-2 py-1 rounded hover:bg-white transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                                />
                                            </svg>
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
                                />
                            </div>
                        </div>

                        {/* Table of Contents - Expandable */}
                        {content.tableOfContents && showTOC && (
                            <div className="px-6 pb-4 border-t border-border">
                                <div className="pt-4">
                                    <TableOfContents
                                        sections={content.sections}
                                        onSelectSection={handleJumpToSection}
                                        currentIndex={currentSectionIndex}
                                        completedSections={completedSections}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mini Quiz Section */}
                    {showQuiz && content.miniQuiz && (
                        <div className="p-6">
                            <MiniQuizSection
                                questions={content.miniQuiz}
                                onComplete={handleQuizComplete}
                                onScoreSubmit={handleQuizScoreSubmit}
                                topicTitle={guideTitle}
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

                    {/* Section Counter Footer - Just shows current section */}
                    {!showTOC && (
                        <div className="px-6 py-3 border-t border-border bg-bg-light">
                            <div className="text-center">
                                <div className="text-sm text-text-muted">
                                    {showQuiz
                                        ? "Mini Quiz"
                                        : `Section ${currentSectionIndex + 1} of ${content.sections.length}`}
                                </div>
                                {/* Keyboard Shortcuts Hint */}
                                <div className="text-xs text-text-muted mt-2">
                                    <p>
                                        Use <kbd className="px-2 py-1 bg-white rounded border border-border">←</kbd>{" "}
                                        and <kbd className="px-2 py-1 bg-white rounded border border-border">→</kbd>{" "}
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
                                className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white shadow-lg border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-[border-color,background-color,color] duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-border disabled:hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
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
                            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark hover:scale-110 transition-[background-color,transform] duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
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
            </main>
        </div>
    );
}
