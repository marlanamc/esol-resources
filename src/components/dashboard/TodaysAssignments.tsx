'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { stripVocabTypeSuffix, getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { parseCategoryData } from '@/lib/categoryData';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
import { PenLine, Gamepad2, BookOpen, ClipboardList, Sparkles, LayoutGrid, Rows3 } from 'lucide-react';
import { ActivityLink } from '@/components/navigation/ActivityLink';

interface VocabCategoryData {
    'word-list'?: { completed: boolean; progress: number; completedAt?: string };
    'flashcards'?: { completed: boolean; progress: number; completedAt?: string };
    'matching'?: { completed: boolean; progress: number; completedAt?: string };
    'fill-blank'?: { completed: boolean; progress: number; completedAt?: string };
}

interface FeaturedAssignment {
    id: string;
    title?: string | null;
    activityId: string;
    href?: string;
    sectionCount?: number;
    dueDate?: string | Date | null;
    featuredAt?: string | Date | null;
    updatedAt?: string | Date | null;
    createdAt?: string | Date | null;
    isNewRelease?: boolean;
    progress?: number;
    progressStatus?: string;
    categoryData?: VocabCategoryData | string | null;
    activity: {
        title: string;
        description: string | null;
        type?: string;
        category?: string | null;
    };
    submissions: Array<{
        id: string;
        status: string;
        completedAt: string | Date | null;
        score: number | null;
    }>;
}

interface Props {
    initialAssignments?: FeaturedAssignment[];
    title?: string;
    ctaLabel?: string;
    variant?: 'cards' | 'checklist';
    actions?: React.ReactNode;
    refreshOnMount?: boolean;
}

export const TodaysAssignments: React.FC<Props> = ({
    initialAssignments,
    title,
    ctaLabel = "Start Activity",
    variant = 'cards',
    actions,
    refreshOnMount = false,
}) => {
    const featuredNewBadgeClassName = "inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 text-amber-800";
    const hasInitialAssignments = initialAssignments !== undefined;
    const [assignments, setAssignments] = useState<FeaturedAssignment[]>(initialAssignments || []);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [mobileViewMode, setMobileViewMode] = useState<'grouped' | 'condensed'>('grouped');
    const [loading, setLoading] = useState(() => !hasInitialAssignments || refreshOnMount);

    const formatWeekRangeLabel = (referenceDate: Date): string => {
        const weekStart = new Date(referenceDate);
        const day = weekStart.getDay();
        const offsetToMonday = day === 0 ? -6 : 1 - day;
        weekStart.setDate(weekStart.getDate() + offsetToMonday);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
        const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();

        if (weekStart.getFullYear() !== weekEnd.getFullYear()) {
            return `Week of ${startMonth} ${startDay}, ${weekStart.getFullYear()}-${endMonth} ${endDay}, ${weekEnd.getFullYear()}`;
        }

        if (startMonth === endMonth) {
            return `Week of ${startMonth} ${startDay}-${endDay}`;
        }

        return `Week of ${startMonth} ${startDay}-${endMonth} ${endDay}`;
    };


    const resolvedTitle = (() => {
        // If title is omitted, provide a sensible default by variant
        if (title === undefined) {
            return variant === "checklist" ? "Weekly Checklist" : "This Week's Activities";
        }
        // If title is explicitly set to empty/whitespace, treat as "hide title"
        if (title.trim() === "") return null;
        return title;
    })();

    const weeklyRangeLabel = variant === 'checklist'
        ? formatWeekRangeLabel(new Date())
        : null;

    useEffect(() => {
        // Optionally refresh from API even when server-provided data exists.
        if (refreshOnMount) {
            void fetchFeaturedAssignments();
            return;
        }

        // If we already have data from the server, skip the client fetch.
        if (hasInitialAssignments) {
            setLoading(false);
            return;
        }
        void fetchFeaturedAssignments();
    }, [hasInitialAssignments, refreshOnMount]);

    const fetchFeaturedAssignments = async () => {
        try {
            const response = await fetch('/api/assignments/featured');
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            }
        } catch (error) {
            console.error('Error fetching featured assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-8">
                <div className="bg-white rounded-2xl border border-border/40 shadow-lg overflow-hidden">
                    {/* Skeleton header */}
                    <div className="p-4 border-b border-border/30 bg-gradient-to-br from-white via-white to-bg-light/30">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl skeleton"></div>
                                <div className="h-6 w-32 skeleton rounded-lg"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-20 skeleton rounded-full"></div>
                                <div className="h-8 w-14 skeleton rounded-full"></div>
                            </div>
                        </div>
                        <div className="mt-4 h-2.5 skeleton rounded-full"></div>
                    </div>

                    {/* Skeleton rows */}
                    <div className="divide-y divide-border/20">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderLeft: '6px solid #e2ddd5' }}>
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-[22px] h-[22px] skeleton rounded-md mt-0.5"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-5 w-16 skeleton rounded-md"></div>
                                        </div>
                                        <div className="h-5 w-48 sm:w-64 skeleton rounded-lg"></div>
                                    </div>
                                </div>
                                <div className="h-10 w-24 skeleton rounded-xl sm:shrink-0"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="mb-8">
                <div className="bg-white rounded-2xl border border-border/40 shadow-lg overflow-hidden">
                    {/* Header matching the normal checklist */}
                    <div className="px-4 py-3 border-b border-border/10 bg-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                            📋
                        </div>
                        {resolvedTitle ? (
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">
                                    {resolvedTitle}
                                </h2>
                                {weeklyRangeLabel ? (
                                    <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-text-muted">
                                        {weeklyRangeLabel}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    {/* Empty state content */}
                    <div className="p-8 text-center relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-4 left-8 w-16 h-16 bg-accent/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-4 right-8 w-20 h-20 bg-secondary/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <p className="text-lg font-semibold text-text mb-1">All caught up!</p>
                            <p className="text-sm text-text-muted max-w-xs mx-auto">
                                No assignments this week. Explore activities below to keep building your skills.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formatDueDate = (dueDate?: string | Date | null) => {
        if (!dueDate) return null;
        const d = dueDate instanceof Date ? dueDate : new Date(dueDate);
        if (Number.isNaN(d.getTime())) return null;
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const isNewlyFeatured = (assignment: FeaturedAssignment): boolean => {
        return assignment.isNewRelease === true;
    };

    const getVocabProgress = (assignment: FeaturedAssignment) => {
        const categoryKey = (assignment.activity.category || '').toLowerCase();
        const isVocabAssignment =
            assignment.activityId.startsWith('vocab-') || categoryKey === 'vocab' || categoryKey === 'vocabulary';
        if (!isVocabAssignment) {
            return null;
        }

        const parsedCategoryData = parseCategoryData<VocabCategoryData>(assignment.categoryData) ?? {};

        const types: Array<keyof VocabCategoryData> = ['word-list', 'flashcards', 'matching', 'fill-blank'];
        const completed = types.filter(type => parsedCategoryData[type]?.completed).length;
        const total = types.length;

        return { completed, total, types, categoryData: parsedCategoryData };
    };

    const getCategoryStyle = (category?: string | null) => {
        const categoryKey = (category || '').toLowerCase();
        // Bold accent palette — confident color hits, clean white card bodies
        const categoryStyles: Record<string, { label: string; bg: string; text: string; accent: string; cardBg: string }> = {
            vocab: { label: 'VOCAB', bg: '#edf5f4', text: '#1a6560', accent: '#268a82', cardBg: '#ffffff' },
            vocabulary: { label: 'VOCAB', bg: '#edf5f4', text: '#1a6560', accent: '#268a82', cardBg: '#ffffff' },
            grammar: { label: 'GRAMMAR', bg: '#eef4ec', text: '#2d6930', accent: '#3d8e42', cardBg: '#ffffff' },
            games: { label: 'GAMES', bg: '#f2edf6', text: '#5c2d7a', accent: '#7d3fa6', cardBg: '#ffffff' },
            activity: { label: 'GAMES', bg: '#f2edf6', text: '#5c2d7a', accent: '#7d3fa6', cardBg: '#ffffff' },
            numbers: { label: 'NUMBERS', bg: '#edf5f4', text: '#1a6560', accent: '#268a82', cardBg: '#ffffff' },
            number: { label: 'NUMBERS', bg: '#edf5f4', text: '#1a6560', accent: '#268a82', cardBg: '#ffffff' },
            reading: { label: 'READING', bg: '#edf5f4', text: '#1a6560', accent: '#268a82', cardBg: '#ffffff' },
            writing: { label: 'WRITING', bg: '#eef4ec', text: '#2d6930', accent: '#3d8e42', cardBg: '#ffffff' },
            pronunciation: { label: 'PRONUNCIATION', bg: '#f2edf6', text: '#5c2d7a', accent: '#7d3fa6', cardBg: '#ffffff' },
            speaking: { label: 'SPEAKING', bg: '#f5f0e8', text: '#7a5020', accent: '#b56e1a', cardBg: '#ffffff' },
            listening: { label: 'LISTENING', bg: '#edf5f4', text: '#1a6560', accent: '#268a82', cardBg: '#ffffff' },
            quizzes: { label: 'QUIZ', bg: '#f5edea', text: '#923a25', accent: '#c44a28', cardBg: '#ffffff' },
            default: { label: 'ACTIVITY', bg: '#f2efea', text: '#5a4530', accent: '#8a7358', cardBg: '#ffffff' },
        };
        return categoryStyles[categoryKey] || categoryStyles.default;
    };

    const isGameCategory = (category?: string | null): boolean => {
        const key = (category || '').toLowerCase();
        return !['quiz', 'quizzes', 'grammar', 'vocab', 'vocabulary'].includes(key);
    };

    if (variant === 'checklist') {
        const rows = assignments.map((assignment, index) => {
            const submission = assignment.submissions[0];
            const progressValue = typeof assignment.progress === 'number' ? assignment.progress : 0;
            const isNew = isNewlyFeatured(assignment);
            const isGameRow = isGameCategory(assignment.activity.category);
            const isGrammarGuide =
                (assignment.activity.type || '').toLowerCase() === 'guide' &&
                (assignment.activity.category || '').toLowerCase() === 'grammar';

            // For vocabulary activities, check if all 4 sub-activities are complete
            const vocabProgress = getVocabProgress(assignment);
            const isVocabComplete = vocabProgress ? vocabProgress.completed === vocabProgress.total : false;
            const grammarPassed = assignment.submissions.some(
                (s) => !!s.completedAt && typeof s.score === 'number' && s.score > 70
            );

            const isCompleted = isGameRow
                ? false
                : isGrammarGuide
                ? (grammarPassed || assignment.progressStatus === 'completed')
                : vocabProgress
                ? isVocabComplete
                : (progressValue >= 100 ||
                   assignment.progressStatus === 'completed' ||
                   !!submission?.completedAt);

            const rawTitle = assignment.title || assignment.activity.title;
            const displayTitle = stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide'));
            const categoryStyle = getCategoryStyle(assignment.activity.category);
            const dueLabel = formatDueDate(assignment.dueDate);

            return { assignment, submission, isCompleted, isNew, isGameRow, displayTitle, categoryStyle, dueLabel, progressValue, index };
        });

        const getCategoryPriority = (category?: string | null): number => {
            const key = (category || '').toLowerCase();
            if (key === 'quiz' || key === 'quizzes') return 0;
            if (key === 'grammar') return 2;
            if (key === 'vocab' || key === 'vocabulary') return 3;
            return 1; // Activity (default) and everything else
        };

        const sortedRows = [...rows].sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }

            if (!a.isCompleted) {
                const aPriority = getCategoryPriority(a.assignment.activity.category);
                const bPriority = getCategoryPriority(b.assignment.activity.category);
                if (aPriority !== bPriority) return aPriority - bPriority;

                const getDateFromTitle = (title: string) => {
                    const match = title.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
                    if (!match) return null;
                    const [, month, day, year] = match;
                    const parsed = new Date(Number(`20${year}`), Number(month) - 1, Number(day));
                    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
                };

                const aTitle = a.assignment.title || a.assignment.activity.title || "";
                const bTitle = b.assignment.title || b.assignment.activity.title || "";
                const aDueFallback = getDateFromTitle(aTitle);
                const bDueFallback = getDateFromTitle(bTitle);
                const aDue = a.assignment.dueDate ? new Date(a.assignment.dueDate).getTime() : (aDueFallback ?? Number.POSITIVE_INFINITY);
                const bDue = b.assignment.dueDate ? new Date(b.assignment.dueDate).getTime() : (bDueFallback ?? Number.POSITIVE_INFINITY);
                if (!Number.isNaN(aDue) && !Number.isNaN(bDue) && aDue !== bDue) {
                    return aDue - bDue;
                }
            }

            return a.index - b.index;
        });

        const checklistRows = rows.filter((r) => !r.isGameRow);
        const completedCount = checklistRows.filter((r) => r.isCompleted).length;
        const percent = checklistRows.length ? Math.round((completedCount / checklistRows.length) * 100) : 0;
        const isFullyComplete = percent === 100;

        // Group sorted rows by category - using Lucide icons instead of emojis
        const CHECKLIST_GROUPS: Array<{
            key: string;
            label: string;
            icon: React.ReactNode;
            match: (c: string) => boolean;
        }> = [
            { key: 'grammar', label: 'Grammar', icon: <PenLine className="w-5 h-5" />, match: (c: string) => c === 'grammar' },
            { key: 'vocabulary', label: 'Vocabulary', icon: <BookOpen className="w-5 h-5" />, match: (c: string) => c === 'vocab' || c === 'vocabulary' },
            { key: 'quizzes', label: 'Quizzes', icon: <ClipboardList className="w-5 h-5" />, match: (c: string) => c === 'quiz' || c === 'quizzes' },
            { key: 'activity', label: 'Games', icon: <Gamepad2 className="w-5 h-5" />, match: (c: string) => !['quiz','quizzes','grammar','vocab','vocabulary'].includes(c) },
        ];

        const groups = CHECKLIST_GROUPS.map(group => {
            const items = sortedRows.filter(r => group.match((r.assignment.activity.category || '').toLowerCase()));
            const doneInGroup = items.filter(r => r.isCompleted).length;
            const isGameGroup = group.key === 'activity';
            return { ...group, items, doneInGroup, allDone: !isGameGroup && items.length > 0 && doneInGroup === items.length, isGameGroup };
        }).filter(g => g.items.length > 0);



        const renderChecklistRow = (
            { assignment, isCompleted, isNew, displayTitle, dueLabel, progressValue }: typeof sortedRows[0],
            isGameGroup = false,
            categoryStyle: { text: string; accent: string; bg: string },
            showCategoryChip?: { label: string; bg: string; text: string; accent: string }
        ) => (
            <div
                key={assignment.id}
                className={`relative group/row pl-3 pr-2 py-2.5 sm:px-4 flex flex-col gap-1 sm:gap-0 transition-colors duration-200 hover:bg-white/40 border-b border-border/10 last:border-0 ${isCompleted ? 'opacity-75' : ''}`}
            >
                {/* Title row: checkbox + title + button aligned on one line (mobile & desktop) */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox (or Game Icon placeholder) - centers with title text */}
                    <div className="shrink-0 flex items-center justify-center w-5 h-5">
                        {isGameGroup ? (
                            <div className="w-5 h-5 flex items-center justify-center text-[18px] leading-none">
                                {getGameEmojiForActivity({ activityId: assignment.activityId, title: assignment.title || assignment.activity.title })}
                            </div>
                        ) : (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isCompleted
                                    ? 'bg-secondary/15 border-secondary/45 text-secondary'
                                    : 'bg-white border-slate-400/90 text-transparent shadow-sm'
                            }`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </div>

                    {/* NEW badge - right in front of title */}
                    {isNew && (
                        <span className={`${featuredNewBadgeClassName} shrink-0 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide`}>
                            <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                            New
                        </span>
                    )}

                    {assignment.sectionCount && assignment.sectionCount > 1 && (
                        <span className="shrink-0 inline-flex items-center rounded-full border border-slate-300/70 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                            {assignment.sectionCount} sections
                        </span>
                    )}

                    <div className="min-w-0 flex-1">
                        {/* Title */}
                        <div className={`text-[13px] sm:text-sm font-semibold leading-tight truncate transition-colors ${isCompleted ? 'text-text/85' : 'text-text'}`}>
                            {displayTitle}
                        </div>
                        {/* Category chip - shown in flat list mode (mobile), below title */}
                        {showCategoryChip && (
                            <div className="mt-1">
                                <span
                                    className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                                    style={{ backgroundColor: showCategoryChip.bg, color: showCategoryChip.text }}
                                >
                                    {showCategoryChip.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Button - Differentiated by state */}
                    <div className="shrink-0 pl-1">
                        <ActivityLink
                            activityId={assignment.activityId}
                            assignmentId={assignment.id}
                            href={assignment.href}
                            className="inline-flex items-center justify-center !min-h-0 min-w-[82px] sm:min-w-[92px] h-9 sm:h-10 px-3 sm:px-4 text-[13px] sm:text-sm font-semibold tracking-tight transition-[color,background-color,border-color,transform,box-shadow] duration-200 rounded-full whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                            style={isGameGroup ? {
                                /* Play: distinct tinted style */
                                color: categoryStyle.text,
                                borderWidth: '1.5px',
                                borderStyle: 'solid',
                                borderColor: `${categoryStyle.accent}50`,
                                backgroundColor: `${categoryStyle.accent}18`,
                            } : isCompleted ? {
                                /* Review: visible but secondary */
                                color: categoryStyle.text,
                                borderWidth: '1.5px',
                                borderStyle: 'solid',
                                borderColor: `${categoryStyle.accent}45`,
                                backgroundColor: `${categoryStyle.accent}12`,
                            } : {
                                /* Start: solid fill - most prominent */
                                color: '#fff',
                                borderWidth: '1.5px',
                                borderStyle: 'solid',
                                borderColor: categoryStyle.accent,
                                backgroundColor: categoryStyle.accent,
                                boxShadow: `0 1px 3px ${categoryStyle.accent}40`,
                            }}
                            onMouseEnter={(e) => {
                                if (isGameGroup) {
                                    e.currentTarget.style.borderColor = `${categoryStyle.accent}80`;
                                    e.currentTarget.style.backgroundColor = `${categoryStyle.accent}28`;
                                } else if (isCompleted) {
                                    e.currentTarget.style.borderColor = `${categoryStyle.accent}70`;
                                    e.currentTarget.style.backgroundColor = `${categoryStyle.accent}22`;
                                } else {
                                    e.currentTarget.style.backgroundColor = categoryStyle.text;
                                    e.currentTarget.style.borderColor = categoryStyle.text;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isGameGroup) {
                                    e.currentTarget.style.borderColor = `${categoryStyle.accent}50`;
                                    e.currentTarget.style.backgroundColor = `${categoryStyle.accent}18`;
                                } else if (isCompleted) {
                                    e.currentTarget.style.borderColor = `${categoryStyle.accent}45`;
                                    e.currentTarget.style.backgroundColor = `${categoryStyle.accent}12`;
                                } else {
                                    e.currentTarget.style.backgroundColor = categoryStyle.accent;
                                    e.currentTarget.style.borderColor = categoryStyle.accent;
                                }
                            }}
                            aria-label={`${isGameGroup ? 'Play' : isCompleted ? 'Review' : 'Start'} ${displayTitle}`}
                        >
                            <span>{isGameGroup ? 'Play' : isCompleted ? 'Review' : 'Start'}</span>
                        </ActivityLink>
                    </div>
                </div>

                {/* Badges & progress row - below title, aligned with content */}
                <div className="min-w-0 flex flex-col gap-0.5 pl-8">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Vocab type / New / due date badges */}
                        {(() => {
                            const vocabType = getVocabActivityType(assignment.activityId);
                            if (vocabType) {
                                const chip = VOCAB_CHIP_CONFIG[vocabType];
                                return (
                                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${chip.className.replace('text-[10px]', '')} opacity-90`}>
                                        {chip.label}
                                    </span>
                                );
                            }
                            return null;
                        })()}

                        {/* Only show due date if overdue */}
                        {!isGameGroup && dueLabel && !isCompleted && new Date(assignment.dueDate as string) < new Date() && (
                            <span className="text-[9px] font-semibold text-red-500">
                                {dueLabel}
                            </span>
                        )}
                    </div>

                    {/* Progress: Vocab 4-dots chip OR Generic Bar */}
                    {(() => {
                        if (isGameGroup) return null;

                        const vocabProgress = getVocabProgress(assignment);
                        // Show 4-dots chip if it's a vocab assignment and not fully complete
                        if (vocabProgress && vocabProgress.completed < vocabProgress.total) {
                            return (
                                <div className="flex items-center gap-2 mt-1.5">
                                     <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                                        <span className="tracking-tight">{vocabProgress.completed} / {vocabProgress.total}</span>
                                        <div className="flex items-center gap-1">
                                            {vocabProgress.types.map(type => {
                                                const isComplete = vocabProgress.categoryData[type]?.completed;
                                                return <div key={type} className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-amber-600' : 'bg-amber-200'}`} />;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Generic Progress Bar (if started but not done) - bar only, no percentage text
                        if (!isCompleted && progressValue > 0) {
                            return (
                                <div className="mt-1.5">
                                    <div className="h-1.5 w-24 max-w-full bg-[#e8e1d6]/50 rounded-full overflow-hidden border border-[#e8e1d6]/30">
                                        <div
                                            className="h-full rounded-full transition-[width] duration-300"
                                            style={{ width: `${progressValue}%`, backgroundColor: categoryStyle.accent }}
                                        />
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>
        );

        return (
            <div className="mb-8">
                {/* Unified checklist container - header + category groups connected */}
                <div className={`rounded-2xl overflow-hidden border bg-white shadow-[0_4px_12px_rgba(52,43,34,0.06)] ${isFullyComplete ? 'border-[#d7c09a]/70 ring-1 ring-[#d7c09a]/30' : 'border-[#e7dfd3]'}`}>
                    {/* Progress header - enhanced celebration when 100% */}
                    <div className={`px-4 py-3 border-b border-border/15 ${isFullyComplete ? 'bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${isFullyComplete ? 'bg-[#f8f3ec] border border-[#d7c09a]/30 shadow-sm' : 'bg-primary/10 text-primary'}`}>
                                    {isFullyComplete ? '🏆' : '📋'}
                                </div>
                                {resolvedTitle ? (
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-xl font-display font-bold text-[#1f2633] leading-tight">
                                            {resolvedTitle}
                                        </h2>
                                        {weeklyRangeLabel ? (
                                            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-text-muted">
                                                {weeklyRangeLabel}
                                            </p>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-text/70">
                                {actions && <div className="mr-2">{actions}</div>}
                                <span className="hidden sm:inline-block px-2 py-1 rounded-md bg-white border border-border/50 tabular-nums">{completedCount}/{checklistRows.length} done</span>
                                <div className="lg:hidden inline-flex items-center rounded-full border border-border/25 bg-white/70 p-0.5">
                                    <button
                                        onClick={() => setMobileViewMode('grouped')}
                                        className={`!min-h-0 !min-w-0 px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none transition-colors touch-manipulation ${
                                            mobileViewMode === 'grouped'
                                                ? 'bg-white text-text shadow-sm border border-border/25'
                                                : 'text-text/65'
                                        }`}
                                        aria-label="Grouped view"
                                        title="Grouped view"
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setMobileViewMode('condensed')}
                                        className={`!min-h-0 !min-w-0 px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none transition-colors touch-manipulation ${
                                            mobileViewMode === 'condensed'
                                                ? 'bg-white text-text shadow-sm border border-border/25'
                                                : 'text-text/65'
                                        }`}
                                        aria-label="Condensed view"
                                        title="Condensed view"
                                    >
                                        <Rows3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <span className={`px-2 py-1 rounded-md border tabular-nums ${isFullyComplete ? 'bg-slate-50 border-border/50 text-slate-700 shadow-sm' : 'bg-bg-light border-border/50'}`}>{percent}%</span>
                            </div>
                        </div>
                        <div className={`w-full rounded-full h-2.5 overflow-hidden ${isFullyComplete ? 'bg-slate-100 shadow-inner' : 'bg-bg-light'}`}>
                            <div
                                className={`h-full rounded-full transition-[width] duration-700 ease-out ${isFullyComplete ? 'bg-gradient-to-r from-[#b86a56] via-[#d49a7e] to-[#b86a56] shadow-[0_0_12px_rgba(184,106,86,0.4)]' : ''}`}
                                style={{
                                    width: `${percent}%`,
                                    ...(!isFullyComplete ? { backgroundColor: '#d0877a' } : {}),
                                    boxShadow: isFullyComplete ? '0 0 15px rgba(184,106,86,0.45), inset 0 1px 1px rgba(255,255,255,0.3)' : 'none'
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* === MOBILE: Category Filters (Condensed mode) === */}
                    {mobileViewMode === 'condensed' && (
                    <div className="lg:hidden bg-white/80 border-b border-border/5">
                        <div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto no-scrollbar mask-edges">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`shrink-0 !min-h-0 !min-w-0 px-2.5 py-0.5 rounded-full text-[7.5px] font-bold uppercase leading-none transition-all duration-200 flex items-center gap-1 ${
                                    activeFilter === 'all'
                                        ? 'bg-white text-[#2d2a26] border border-[#b86a56]/70 shadow-sm'
                                        : 'bg-white/60 text-text/70 hover:bg-white border border-border/30 hover:shadow-sm'
                                }`}
                                style={{ fontSize: '10px', WebkitTextSizeAdjust: '100%' }}
                            >
                                ALL
                                <span className={`px-1 py-0.5 rounded text-[7.5px] font-bold leading-none ${activeFilter === 'all' ? 'bg-white/20' : 'bg-black/5'}`}>
                                    {sortedRows.length}
                                </span>
                            </button>

                            {groups.map(group => {
                                const groupStyle = getCategoryStyle(group.key);
                                const isActive = activeFilter === group.key;

                                return (
                                    <button
                                        key={group.key}
                                        onClick={() => setActiveFilter(group.key)}
                                        className={`shrink-0 !min-h-0 !min-w-0 px-2.5 py-0.5 rounded-full text-[7.5px] font-bold uppercase leading-none transition-all duration-200 border flex items-center gap-1.5`}
                                        style={{
                                            fontSize: '10px',
                                            WebkitTextSizeAdjust: '100%',
                                            backgroundColor: isActive ? groupStyle.text : 'rgba(255, 255, 255, 0.6)',
                                            color: isActive ? '#fff' : groupStyle.text,
                                            borderColor: isActive ? groupStyle.text : `${groupStyle.text}30`,
                                        }}
                                    >
                                        <span className={`[&>svg]:w-3 [&>svg]:h-3 [&>svg]:stroke-[2.5px] ${isActive ? 'text-white/90' : 'opacity-70'}`}>
                                            {group.icon}
                                        </span>
                                        {group.label}
                                        <span className={`ml-0.5 px-1 py-0.5 rounded text-[7.5px] font-bold leading-none ${isActive ? 'bg-white/20' : 'bg-black/5'}`}>
                                            {group.items.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    )}

                    {/* === MOBILE: Unified flat list (Condensed mode) === */}
                    {mobileViewMode === 'condensed' && (
                    <div className="lg:hidden bg-white/80">
                        <div className="bg-[#fdfbf7] sm:bg-[#fdfbf8] rounded-b-2xl overflow-hidden shadow-inner-sm">
                            <div className="divide-y divide-border/10">
                                {sortedRows
                                    .filter(row => {
                                        if (activeFilter === 'all') return true;
                                        const group = groups.find(g => g.key === activeFilter);
                                        return group?.match((row.assignment.activity.category || '').toLowerCase());
                                    })
                                    .map((row) => {
                                        const catStyle = getCategoryStyle(row.assignment.activity.category);
                                        return renderChecklistRow(row, row.isGameRow, catStyle, catStyle);
                                    })}
                                
                                {/* Empty state for filter */}
                                {sortedRows.filter(row => {
                                    if (activeFilter === 'all') return true;
                                    const group = groups.find(g => g.key === activeFilter);
                                    return group?.match((row.assignment.activity.category || '').toLowerCase());
                                }).length === 0 && (
                                    <div className="py-8 text-center px-4">
                                        <div className="w-12 h-12 rounded-full bg-border/20 flex items-center justify-center mx-auto mb-3 text-2xl opacity-80">
                                            🔍
                                        </div>
                                        <p className="text-sm font-semibold text-text/80">No activities found</p>
                                        <p className="text-xs text-text-muted mt-1">Try selecting a different category</p>
                                        <button 
                                            onClick={() => setActiveFilter('all')}
                                            className="mt-3 text-primary text-xs font-bold uppercase tracking-wider hover:underline"
                                        >
                                            Show All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    )}

                    {/* === GROUPED VIEW: default on mobile + desktop === */}
                    <div className={`${mobileViewMode === 'grouped' ? 'block' : 'hidden'} lg:block p-2.5 sm:p-4 bg-white`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:auto-rows-fr">
                            {groups.map((group) => {
                                const groupStyle = getCategoryStyle(group.key);
                                return (
                                    <div
                                        key={group.key}
                                        className="rounded-xl overflow-hidden border border-[#d7c09a]/45 shadow-[0_2px_8px_rgba(52,43,34,0.06)] hover:shadow-[0_4px_12px_rgba(52,43,34,0.1)] transition-all duration-300 flex flex-col group/card"
                                        style={{ backgroundColor: groupStyle.cardBg || 'white' }}
                                    >
                                        {/* Category header with tinted background */}
                                        {/* Category header */}
                                        <div
                                            className="w-full px-3.5 py-2.5 flex items-center justify-between"
                                            style={{
                                                borderLeft: `5px solid ${groupStyle.accent}`,
                                                backgroundColor: groupStyle.bg,
                                            }}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="opacity-80" style={{ color: groupStyle.accent }}>{group.icon}</span>
                                                <Link
                                                    href={`/dashboard/activities?category=${group.key === 'activity' ? 'games' : group.key}`}
                                                    className="font-bold text-[15px] tracking-tight hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 rounded"
                                                    style={{ color: groupStyle.text }}
                                                >
                                                    {group.label}
                                                </Link>
                                                <span
                                                    className="text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums"
                                                    style={{ backgroundColor: `${groupStyle.accent}20`, color: groupStyle.text, border: `1px solid ${groupStyle.accent}30` }}
                                                >
                                                    {group.isGameGroup ? `${group.items.length}` : `${group.doneInGroup}/${group.items.length}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-border/10 flex-1">
                                            {group.items.map((row) => renderChecklistRow(row, group.isGameGroup, groupStyle))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text mb-4 flex items-center gap-3 leading-tight">
                <span className="w-1 h-6 rounded-full bg-primary"></span>
                {title}
            </h2>
            <div className="bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-yellow-50/20 rounded-2xl p-4 sm:p-5 border border-orange-100/50 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {assignments.map((assignment, index) => {
                    const submission = assignment.submissions[0];
                    const isCompleted = submission?.completedAt || assignment.progressStatus === 'completed';
                    const isNew = isNewlyFeatured(assignment);
                    const categoryStyle = getCategoryStyle(assignment.activity.category);
                    const rawTitle = assignment.title || assignment.activity.title;
                    const displayTitle = stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide'));

                    return (
                        <div
                            key={assignment.id}
                            className="relative bg-white rounded-xl border border-border/20 hover:border-border/40 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-200 overflow-hidden group"
                            style={{
                                animationDelay: `${index * 40}ms`
                            }}
                        >
                            {/* Accent bar */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1 transition-[width] duration-200 group-hover:w-1.5"
                                style={{ backgroundColor: categoryStyle.accent }}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 pl-5">
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        {/* Category badge */}
                                        <span
                                            className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                                            style={{
                                                backgroundColor: categoryStyle.bg,
                                                color: categoryStyle.text
                                            }}
                                        >
                                            {categoryStyle.label}
                                        </span>

                        {isNew && (
                            <span className={`${featuredNewBadgeClassName} px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide`}>
                                <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                                New
                            </span>
                        )}

                                        {/* Vocab type chip - next to category, before % done */}
                                        {(() => {
                                            const vocabType = getVocabActivityType(assignment.activityId);
                                            if (!vocabType) return null;
                                            const chip = VOCAB_CHIP_CONFIG[vocabType];
                                            return (
                                                <ActivityLink
                                                    activityId={assignment.activityId}
                                                    assignmentId={assignment.id}
                                                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-colors z-20 ${chip.className}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {chip.icon} {chip.label}
                                                </ActivityLink>
                                            );
                                        })()}

                                        {/* % done chip */}
                                        {assignment.progress != null && assignment.progress > 0 && !isCompleted && (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {Math.round(assignment.progress)}% done
                                            </span>
                                        )}

                                        {/* Completion badge */}
                                        {isCompleted && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] font-bold uppercase tracking-wide">
                                                <span className="text-xs">✓</span>
                                                Done
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base sm:text-lg font-semibold text-text group-hover:text-primary transition-colors leading-snug">
                                        {displayTitle}
                                    </h3>
                                </div>

                                {/* CTA Button */}
                                <ActivityLink
                                    activityId={assignment.activityId}
                                    assignmentId={assignment.id}
                                    className="inline-flex items-center justify-center px-4 py-2 min-h-11 text-sm font-semibold rounded-2xl border transition-[color,background-color,border-color,transform] duration-200 active:scale-95 whitespace-nowrap sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                    aria-label={`${isCompleted ? 'Review' : ctaLabel} ${displayTitle}`}
                                    style={{
                                        color: categoryStyle.text,
                                        borderColor: `${categoryStyle.accent}90`,
                                        backgroundColor: `${categoryStyle.accent}08`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = categoryStyle.accent;
                                        e.currentTarget.style.backgroundColor = `${categoryStyle.accent}15`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = `${categoryStyle.accent}90`;
                                        e.currentTarget.style.backgroundColor = `${categoryStyle.accent}08`;
                                    }}
                                >
                                    {isCompleted ? 'Review' : ctaLabel}
                                </ActivityLink>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
};
