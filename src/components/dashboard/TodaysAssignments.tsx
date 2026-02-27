'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { stripVocabTypeSuffix, getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { parseCategoryData } from '@/lib/categoryData';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
import { PenLine, Gamepad2, BookOpen, ClipboardList, Sparkles } from 'lucide-react';

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
    const [assignments, setAssignments] = useState<FeaturedAssignment[]>(initialAssignments || []);
    const [loading, setLoading] = useState(true);


    const resolvedTitle = (() => {
        // If title is omitted, provide a sensible default by variant
        if (title === undefined) {
            return variant === "checklist" ? "Weekly Checklist" : "This Week's Activities";
        }
        // If title is explicitly set to empty/whitespace, treat as "hide title"
        if (title.trim() === "") return null;
        return title;
    })();

    useEffect(() => {
        // Optionally refresh from API even when server-provided data exists.
        if (refreshOnMount) {
            void fetchFeaturedAssignments();
            return;
        }

        // If we already have data from the server, skip the client fetch.
        if (initialAssignments && initialAssignments.length >= 0) {
            setLoading(false);
            return;
        }
        void fetchFeaturedAssignments();
    }, [initialAssignments, refreshOnMount]);

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
                        {resolvedTitle && (
                            <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">
                                {resolvedTitle}
                            </h2>
                        )}
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
        if (!assignment.activityId.startsWith('vocab-') || !assignment.categoryData) {
            return null;
        }

        const parsedCategoryData = parseCategoryData<VocabCategoryData>(assignment.categoryData);
        if (!parsedCategoryData) {
            return null;
        }

        const types: Array<keyof VocabCategoryData> = ['word-list', 'flashcards', 'matching', 'fill-blank'];
        const completed = types.filter(type => parsedCategoryData[type]?.completed).length;
        const total = types.length;

        return { completed, total, types, categoryData: parsedCategoryData };
    };

    const getCategoryStyle = (category?: string | null) => {
        const categoryKey = (category || '').toLowerCase();
        const categoryStyles: Record<string, { label: string; bg: string; text: string; accent: string }> = {
            vocab: { label: 'VOCAB', bg: '#edf4f9', text: '#264c72', accent: '#5d8eb7' },
            vocabulary: { label: 'VOCAB', bg: '#edf4f9', text: '#264c72', accent: '#5d8eb7' },
            grammar: { label: 'GRAMMAR', bg: '#edf5ee', text: '#274d31', accent: '#5d8f65' },
            games: { label: 'GAMES', bg: '#f2eef7', text: '#564770', accent: '#8a76ad' },
            activity: { label: 'GAMES', bg: '#f2eef7', text: '#564770', accent: '#8a76ad' },
            numbers: { label: 'NUMBERS', bg: '#edf4f9', text: '#264c72', accent: '#5d8eb7' },
            number: { label: 'NUMBERS', bg: '#edf4f9', text: '#264c72', accent: '#5d8eb7' },
            reading: { label: 'READING', bg: '#eef4f3', text: '#2a5a56', accent: '#4d8b84' },
            writing: { label: 'WRITING', bg: '#edf5ee', text: '#355841', accent: '#6d9674' },
            pronunciation: { label: 'PRONUNCIATION', bg: '#f2eef7', text: '#4f426a', accent: '#7f67a8' },
            speaking: { label: 'SPEAKING', bg: '#f8f1e9', text: '#765530', accent: '#b88a5a' },
            listening: { label: 'LISTENING', bg: '#eef4f3', text: '#2a5a56', accent: '#4d8b84' },
            quizzes: { label: 'QUIZ', bg: '#f9efec', text: '#7a3f37', accent: '#c47467' },
            default: { label: 'ACTIVITY', bg: '#f3f0ec', text: '#54473b', accent: '#8f7b67' },
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
                ? grammarPassed
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
            { key: 'activity', label: 'Games', icon: <Gamepad2 className="w-5 h-5" />, match: (c: string) => !['quiz','quizzes','grammar','vocab','vocabulary'].includes(c) },
            { key: 'vocabulary', label: 'Vocabulary', icon: <BookOpen className="w-5 h-5" />, match: (c: string) => c === 'vocab' || c === 'vocabulary' },
            { key: 'quizzes', label: 'Quizzes', icon: <ClipboardList className="w-5 h-5" />, match: (c: string) => c === 'quiz' || c === 'quizzes' },
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
            categoryStyle: { text: string; accent: string }
        ) => (
            <div key={assignment.id} className="relative group/row pl-3 pr-2 py-2.5 sm:px-4 flex flex-col gap-1 sm:gap-0 transition-all duration-200 hover:bg-white/70 border-b border-border/10 last:border-0">
                {/* Title row: checkbox + title + button aligned on one line (mobile & desktop) */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox (or Game Icon placeholder) - centers with title text */}
                    <div className="shrink-0 flex items-center justify-center w-5 h-5">
                        {isGameGroup ? (
                            <div className="w-5 h-5 flex items-center justify-center text-[18px] leading-none">
                                {getGameEmojiForActivity({ activityId: assignment.activityId, title: assignment.title || assignment.activity.title })}
                            </div>
                        ) : (
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isCompleted
                                    ? 'bg-secondary/10 border-secondary/20 text-secondary'
                                    : 'bg-white border-border/40 text-transparent'
                            }`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </div>

                    {/* Title - same line as checkbox for clean alignment */}
                    <div className={`min-w-0 flex-1 text-sm sm:text-base font-semibold leading-tight break-words transition-colors ${isCompleted ? 'text-text/85' : 'text-text'}`}>
                        {displayTitle}
                    </div>

                    {/* Action Button - Category-colored outline style */}
                    <div className="shrink-0 pl-1">
                        <Link
                            href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 min-h-11 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-2xl whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                            style={{
                                color: categoryStyle.text,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: `${categoryStyle.accent}80`,
                                backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = categoryStyle.accent;
                                e.currentTarget.style.backgroundColor = `${categoryStyle.accent}15`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = `${categoryStyle.accent}80`;
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-label={`${isGameGroup ? 'Play' : isCompleted ? 'Review' : 'Start'} ${displayTitle}`}
                        >
                            <span>{isGameGroup ? 'Play' : isCompleted ? 'Review' : 'Start'}</span>
                        </Link>
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

                        {isNew && (
                            <span className={`${featuredNewBadgeClassName} px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide`}>
                                <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                                New
                            </span>
                        )}

                        {/* Only show due date if overdue */}
                        {!isGameGroup && dueLabel && !isCompleted && new Date(assignment.dueDate as string) < new Date() && (
                            <span className="text-[10px] font-semibold text-red-500">
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
                                     <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
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
                                    <div className="h-1 w-24 max-w-full bg-border/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
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
                <div className={`rounded-2xl overflow-hidden border border-[#e7dfd3] bg-[#f8f1e8] sm:bg-[#faf6f1] shadow-[0_1px_4px_rgba(52,43,34,0.035)] sm:shadow-[0_2px_8px_rgba(52,43,34,0.045)] ${isFullyComplete ? 'celebrate-complete ring-2 ring-[#d7c09a]/50' : ''}`}>
                    {/* Progress header */}
                    <div className="px-4 py-3 border-b border-border/15">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                                    {isFullyComplete ? '🎉' : '📋'}
                                </div>
                                {resolvedTitle && <h2 className="text-lg sm:text-xl font-display font-bold text-[#1f2633] leading-tight">{resolvedTitle}</h2>}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-text/70">
                                {actions && <div className="mr-2">{actions}</div>}
                                <span className="hidden sm:inline-block px-2 py-1 rounded-md bg-bg-light border border-border/50">{completedCount}/{checklistRows.length} done</span>
                                <span className={`px-2 py-1 rounded-md border ${isFullyComplete ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-bg-light border-border/50'}`}>{percent}%</span>
                            </div>
                        </div>
                        <div className="w-full bg-bg-light rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-[width] duration-700 ease-out"
                                style={{
                                    width: `${percent}%`,
                                    background: isFullyComplete
                                        ? 'linear-gradient(90deg, #c47467 0%, #5d8f65 34%, #5d8eb7 68%, #8a76ad 100%)'
                                        : 'linear-gradient(90deg, #d0877a 0%, #6f9c76 34%, #6f9bbf 68%, #9a88ba 100%)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Category sections inside the same container */}
                    <div className="p-2.5 sm:p-4 bg-[#f8f3ec]/55 sm:bg-[#fbf8f2]/45">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {groups.map((group, groupIdx) => {
                                const groupStyle = getCategoryStyle(group.key);
                                return (
                                    <div
                                        key={group.key}
                                        className="checklist-group bg-[#fdfbf7] sm:bg-[#fdfbf8] rounded-xl border border-[#e8e1d6] overflow-hidden shadow-[0_6px_16px_rgba(43,36,29,0.085)] sm:shadow-[0_5px_14px_rgba(43,36,29,0.07)]"
                                        style={{ animationDelay: `${groupIdx * 100}ms` }}
                                    >
                                        <div
                                            className="w-full px-3 py-2 border-b border-border/10 flex items-center justify-between"
                                            style={{
                                                borderTop: `3px solid ${groupStyle.accent}`,
                                                backgroundColor: '#fdfbf7',
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span style={{ color: groupStyle.text }}>{group.icon}</span>
                                                <Link
                                                    href={`/dashboard/activities?category=${group.key === 'activity' ? 'games' : group.key}`}
                                                    className="font-semibold text-base hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 rounded"
                                                    style={{ color: groupStyle.text }}
                                                >
                                                    {group.label}
                                                </Link>
                                                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-white/70 border border-white/80" style={{ color: groupStyle.text }}>
                                                    {group.isGameGroup ? `${group.items.length}` : `${group.doneInGroup}/${group.items.length}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-border/10">
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
                    const isCompleted = submission?.completedAt;
                    const isNew = isNewlyFeatured(assignment);
                    const categoryStyle = getCategoryStyle(assignment.activity.category);
                    const rawTitle = assignment.title || assignment.activity.title;
                    const displayTitle = stripVocabTypeSuffix(rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide'));

                    return (
                        <div
                            key={assignment.id}
                            className="relative bg-white rounded-xl border border-border/20 hover:border-border/40 shadow-sm hover:shadow-md transition-[border-color,box-shadow] duration-200 overflow-hidden group"
                            style={{
                                animationDelay: `${index * 80}ms`
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
                                            const qs = assignment.id ? `?assignment=${assignment.id}` : '';
                                            return (
                                                <Link
                                                    href={`/activity/${assignment.activityId}${qs}`}
                                                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-colors z-20 ${chip.className}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {chip.icon} {chip.label}
                                                </Link>
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
                                <Link
                                    href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                                    className="inline-flex items-center justify-center px-4 py-2 min-h-11 text-sm font-semibold rounded-2xl border transition-all duration-200 active:scale-95 whitespace-nowrap sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                    style={{
                                        color: categoryStyle.text,
                                        borderColor: `${categoryStyle.accent}90`,
                                        backgroundColor: 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = categoryStyle.accent;
                                        e.currentTarget.style.backgroundColor = `${categoryStyle.accent}15`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = `${categoryStyle.accent}90`;
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    {isCompleted ? 'Review' : ctaLabel}
                                </Link>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
};
