'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface FeaturedAssignment {
    id: string;
    title?: string | null;
    activityId: string;
    dueDate?: string | Date | null;
    progress?: number;
    progressStatus?: string;
    activity: {
        title: string;
        description: string | null;
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
}

export const TodaysAssignments: React.FC<Props> = ({
    initialAssignments,
    title,
    ctaLabel = "Start Activity",
    variant = 'cards',
}) => {
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
        // If we already have data from the server, skip the client fetch.
        if (initialAssignments && initialAssignments.length >= 0) {
            setLoading(false);
            return;
        }
        fetchFeaturedAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                {resolvedTitle && (
                    <h2 className="text-3xl sm:text-3xl font-display font-bold text-text mb-4 leading-tight">
                        {resolvedTitle}
                    </h2>
                )}
                <div className="animate-pulse bg-bg-light rounded-xl h-32"></div>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="mb-8">
                {resolvedTitle && (
                    <h2 className="text-3xl sm:text-3xl font-display font-bold text-text mb-4 leading-tight">
                        {resolvedTitle}
                    </h2>
                )}
                <div className="bg-gradient-to-br from-bg-light to-white rounded-xl p-8 text-center border border-border/60 shadow-sm">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-text-muted font-medium">No featured assignments right now</p>
                    <p className="text-sm text-text-muted mt-1">Check out the activities below to keep learning!</p>
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

    const getCategoryStyle = (category?: string | null) => {
        const categoryKey = (category || '').toLowerCase();
        const categoryStyles: Record<string, { label: string; bg: string; text: string; accent: string }> = {
            vocab: { label: 'VOCAB', bg: '#fef3e7', text: '#b45b1c', accent: '#f4a261' },
            vocabulary: { label: 'VOCAB', bg: '#fef3e7', text: '#b45b1c', accent: '#f4a261' },
            grammar: { label: 'GRAMMAR', bg: '#fdece8', text: '#c24a32', accent: '#e76f51' },
            numbers: { label: 'NUMBERS', bg: '#e3f2fd', text: '#1e5aa8', accent: '#4a90e2' },
            number: { label: 'NUMBERS', bg: '#e3f2fd', text: '#1e5aa8', accent: '#4a90e2' },
            reading: { label: 'READING', bg: '#e8f6f3', text: '#217f72', accent: '#2a9d8f' },
            writing: { label: 'WRITING', bg: '#eef6ee', text: '#4f7b55', accent: '#7ba884' },
            pronunciation: { label: 'PRONUNCIATION', bg: '#f1e9f7', text: '#5b3c86', accent: '#6a4c93' },
            speaking: { label: 'SPEAKING', bg: '#fff3e6', text: '#c4681a', accent: '#f5a524' },
            listening: { label: 'LISTENING', bg: '#e8f7f6', text: '#1b7d73', accent: '#2a9d8f' },
            quizzes: { label: 'QUIZ', bg: '#fff1f2', text: '#9f1239', accent: '#fb7185' },
            default: { label: 'ACTIVITY', bg: '#eef2ff', text: '#3730a3', accent: '#6366f1' },
        };
        return categoryStyles[categoryKey] || categoryStyles.default;
    };

    if (variant === 'checklist') {
        const rows = assignments.map((assignment, index) => {
            const submission = assignment.submissions[0];
            const progressValue = typeof assignment.progress === 'number' ? assignment.progress : 0;
            const isCompleted =
                progressValue >= 100 ||
                assignment.progressStatus === 'completed' ||
                !!submission?.completedAt;
            const rawTitle = assignment.title || assignment.activity.title;
            const displayTitle = rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide');
            const categoryStyle = getCategoryStyle(assignment.activity.category);
            const dueLabel = formatDueDate(assignment.dueDate);

            return { assignment, submission, isCompleted, displayTitle, categoryStyle, dueLabel, progressValue, index };
        });

        const sortedRows = [...rows].sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }

            if (!a.isCompleted) {
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

        const completedCount = rows.filter((r) => r.isCompleted).length;
        const percent = rows.length ? Math.round((completedCount / rows.length) * 100) : 0;
        const isFullyComplete = percent === 100;

        return (
            <div className="mb-8">
                <div className={`bg-white rounded-2xl border border-border/40 shadow-lg overflow-hidden ${isFullyComplete ? 'celebrate-complete ring-2 ring-accent/50' : ''}`}>
                    <div className="p-4 border-b border-border/30 bg-gradient-to-br from-white via-white to-bg-light/30 relative overflow-hidden">
                        {/* Subtle decorative element */}
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

                        <div className="flex items-center justify-between gap-3 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-lg shadow-sm">
                                    {isFullyComplete ? '🎉' : '📋'}
                                </div>
                                {resolvedTitle && (
                                    <h2 className="text-xl sm:text-2xl font-display font-bold text-text leading-tight">
                                        {resolvedTitle}
                                    </h2>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-text/70">
                                <span className="px-3 py-1.5 rounded-full bg-white border border-border/50 shadow-sm">
                                    {completedCount}/{rows.length} done
                                </span>
                                <span className={`px-3 py-1.5 rounded-full border shadow-sm ${isFullyComplete ? 'bg-accent/20 border-accent/40 text-amber-700' : 'bg-white border-border/50'}`}>
                                    {percent}%
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 relative z-10">
                            <div className="w-full bg-border/40 rounded-full h-2.5 overflow-hidden shadow-inner">
                                <div
                                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${isFullyComplete ? 'progress-bar-shimmer' : 'bg-gradient-to-r from-secondary via-primary to-primary'}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-border/20">
                        {sortedRows.map(({ assignment, isCompleted, displayTitle, categoryStyle, dueLabel, progressValue }) => (
                            <div
                                key={assignment.id}
                                className="relative group checklist-row checklist-row-hover"
                                style={{ borderLeft: `6px solid ${categoryStyle.accent}` }}
                            >
                                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={isCompleted}
                                            disabled
                                            aria-label={isCompleted ? 'Completed' : 'Not completed yet'}
                                            className="custom-checkbox mt-0.5 cursor-not-allowed"
                                        />
                                        <div className="min-w-0">
                                            <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                                <span
                                                    className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm"
                                                    style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
                                                >
                                                    {categoryStyle.label}
                                                </span>
                                                {progressValue > 0 && !isCompleted && (
                                                    <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                                        {progressValue}% done
                                                    </span>
                                                )}
                                                {dueLabel && (
                                                    <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        Due: {dueLabel}
                                                    </span>
                                                )}
                                                {isCompleted && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary/15 text-secondary rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Done
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-base sm:text-lg font-bold font-display leading-snug truncate transition-colors ${isCompleted ? 'text-text/60 line-through decoration-secondary/40' : 'text-text group-hover:text-primary'}`}>
                                                {displayTitle}
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                                        className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:shadow-lg active:scale-95 rounded-xl whitespace-nowrap sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                                            isCompleted
                                                ? 'border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50'
                                                : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:brightness-110 shadow-md'
                                        }`}
                                    >
                                        {isCompleted ? 'Review' : ctaLabel}
                                    </Link>
                                </div>
                            </div>
                        ))}
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
            <div className="bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-yellow-50/20 rounded-2xl p-5 border border-orange-100/50 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {assignments.map((assignment, index) => {
                    const submission = assignment.submissions[0];
                    const isCompleted = submission?.completedAt;
                    const categoryStyle = getCategoryStyle(assignment.activity.category);
                    const rawTitle = assignment.title || assignment.activity.title;
                    const displayTitle = rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide');

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
                                    <div className="flex items-center gap-2 mb-1.5">
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

                                        {/* Completion badge */}
                                        {isCompleted && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] font-bold uppercase tracking-wide">
                                                <span className="text-xs">✓</span>
                                                Done
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base sm:text-lg font-bold text-text group-hover:text-primary transition-colors font-display leading-snug">
                                        {displayTitle}
                                    </h3>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold transition-[box-shadow,transform,filter] hover:shadow-md active:scale-95 rounded-lg bg-primary text-white hover:brightness-110 whitespace-nowrap sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
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
