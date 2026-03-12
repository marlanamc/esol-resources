'use client';

import React, { useEffect, useState } from 'react';
import type {
    StudentAnalyticsCategoryKey,
    StudentAnalyticsCategorySummary,
    StudentAnalyticsNextAction,
    StudentAnalyticsResponse,
} from '@/lib/teacher-student-analytics';

const CATEGORY_ORDER: StudentAnalyticsCategoryKey[] = ['vocab', 'grammar', 'numbers', 'other'];
const CATEGORY_META: Record<
    StudentAnalyticsCategoryKey,
    {
        label: string;
        icon: string;
        accent: string;
        accentBg: string;
        bar: string;
        cardBorder: string;
    }
> = {
    vocab: {
        label: 'Vocabulary',
        icon: '📚',
        accent: 'text-emerald-700',
        accentBg: 'bg-emerald-50',
        bar: 'bg-emerald-500',
        cardBorder: 'border-emerald-200/70',
    },
    grammar: {
        label: 'Grammar',
        icon: '✍️',
        accent: 'text-orange-700',
        accentBg: 'bg-orange-50',
        bar: 'bg-orange-500',
        cardBorder: 'border-orange-200/70',
    },
    numbers: {
        label: 'Numbers',
        icon: '🔢',
        accent: 'text-sky-700',
        accentBg: 'bg-sky-50',
        bar: 'bg-sky-500',
        cardBorder: 'border-sky-200/70',
    },
    other: {
        label: 'Other',
        icon: '🧩',
        accent: 'text-slate-700',
        accentBg: 'bg-slate-100',
        bar: 'bg-slate-500',
        cardBorder: 'border-slate-200/80',
    },
};

const STATUS_META: Record<
    StudentAnalyticsCategorySummary['status'],
    { label: string; className: string }
> = {
    'on-track': {
        label: 'On track',
        className: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    },
    'needs-attention': {
        label: 'Needs attention',
        className: 'bg-rose-100 text-rose-800 border border-rose-200',
    },
    'not-started': {
        label: 'Not started',
        className: 'bg-amber-100 text-amber-800 border border-amber-200',
    },
    'no-assigned-work': {
        label: 'No assigned work',
        className: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
};

function getRelativeTimeLabel(value: string | null) {
    if (!value) return 'Never';
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

function getActionLabel(action: StudentAnalyticsNextAction | null) {
    if (!action) return null;
    if (action.actionType === 'resume') return `Resume ${action.title}`;
    if (action.actionType === 'start') return `Start ${action.title}`;
    return `Review ${action.title}`;
}

function getActionMeta(summary: StudentAnalyticsCategorySummary) {
    const actionLabel = getActionLabel(summary.nextAction);
    const dueDateLabel = summary.nextAction?.dueDate
        ? new Date(summary.nextAction.dueDate).toLocaleDateString()
        : null;

    if (actionLabel) {
        return {
            title: actionLabel,
            detail:
                summary.nextAction?.actionType === 'review'
                    ? 'Latest scored work needs review.'
                    : dueDateLabel
                        ? `Due ${dueDateLabel}`
                        : 'Most relevant next assignment to follow up on.',
        };
    }

    if (summary.status === 'no-assigned-work') {
        return {
            title: 'No assigned work in this category',
            detail:
                summary.historicalActivityCount > 0
                    ? 'This student has older activity here, but nothing currently assigned.'
                    : 'No follow-up needed until work is assigned.',
        };
    }

    if (summary.status === 'not-started') {
        return {
            title: 'No activity yet',
            detail: 'The student has assigned work here but has not started it.',
        };
    }

    if (summary.status === 'needs-attention') {
        return {
            title: 'Follow up soon',
            detail: 'This category includes overdue or stalled work.',
        };
    }

    return {
        title: 'Momentum is healthy',
        detail: 'Recent work is moving forward with no immediate blockers.',
    };
}

function shouldShowCategory(
    categoryKey: StudentAnalyticsCategoryKey,
    summary: StudentAnalyticsCategorySummary
) {
    if (categoryKey !== 'other') {
        return true;
    }

    return (
        summary.assignedCount > 0 ||
        summary.historicalActivityCount > 0 ||
        summary.lastActiveAt !== null ||
        summary.latestScore !== null
    );
}

function InterventionCategoryCard({
    categoryKey,
    summary,
}: {
    categoryKey: StudentAnalyticsCategoryKey;
    summary: StudentAnalyticsCategorySummary;
}) {
    const meta = CATEGORY_META[categoryKey];
    const statusMeta = STATUS_META[summary.status];
    const actionMeta = getActionMeta(summary);

    return (
        <div className={`rounded-2xl border bg-white p-5 shadow-sm ${meta.cardBorder}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${meta.accentBg}`}>
                            {meta.icon}
                        </span>
                        <div>
                            <h3 className="text-lg font-semibold text-text">{meta.label}</h3>
                            <p className="text-sm text-text-muted">
                                {summary.completedCount} of {summary.assignedCount} assigned completed
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {summary.latestScore !== null ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.accentBg} ${meta.accent}`}>
                            Latest score {summary.latestScore}%
                        </span>
                    ) : null}
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
                        {statusMeta.label}
                    </span>
                </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                    <div className="text-3xl font-black tracking-tight text-text">
                        {summary.completedCount}
                        <span className="ml-1 text-lg font-semibold text-text-muted">/ {summary.assignedCount}</span>
                    </div>
                    <p className="text-sm text-text-muted">Completed assignments</p>
                </div>
                <div className="text-right">
                    <div className={`text-2xl font-black ${meta.accent}`}>
                        {summary.assignedCount > 0 ? `${summary.completionRate}%` : '—'}
                    </div>
                    <p className="text-sm text-text-muted">Completion rate</p>
                </div>
            </div>

            {summary.assignedCount > 0 ? (
                <div className="mt-4">
                    <div className="h-2.5 overflow-hidden rounded-full bg-bg">
                        <div
                            className={`h-full transition-[width] duration-300 ${meta.bar}`}
                            style={{ width: `${summary.completionRate}%` }}
                        />
                    </div>
                </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-bg px-3 py-3">
                    <div className="text-xs uppercase tracking-[0.12em] text-text-muted">Started</div>
                    <div className="mt-1 text-lg font-bold text-text">{summary.startedCount}</div>
                </div>
                <div className="rounded-xl bg-bg px-3 py-3">
                    <div className="text-xs uppercase tracking-[0.12em] text-text-muted">Stalled</div>
                    <div className="mt-1 text-lg font-bold text-text">{summary.stalledCount}</div>
                </div>
                <div className="rounded-xl bg-bg px-3 py-3">
                    <div className="text-xs uppercase tracking-[0.12em] text-text-muted">Overdue</div>
                    <div className="mt-1 text-lg font-bold text-text">{summary.overdueCount}</div>
                </div>
                <div className="rounded-xl bg-bg px-3 py-3">
                    <div className="text-xs uppercase tracking-[0.12em] text-text-muted">Last active</div>
                    <div className="mt-1 text-sm font-semibold text-text">
                        {getRelativeTimeLabel(summary.lastActiveAt)}
                    </div>
                </div>
            </div>

            <div className={`mt-5 rounded-2xl border px-4 py-4 ${meta.accentBg} ${meta.cardBorder}`}>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Next action
                </div>
                <div className="mt-1 text-sm font-semibold text-text">{actionMeta.title}</div>
                <div className="mt-1 text-sm text-text-muted">{actionMeta.detail}</div>
            </div>
        </div>
    );
}

export default function StudentDetailView({ studentId }: { studentId: string }) {
    const [data, setData] = useState<StudentAnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch(`/api/teacher/student-analytics/${studentId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch student data');
                return res.json();
            })
            .then((nextData: StudentAnalyticsResponse) => {
                if (cancelled) return;
                setData(nextData);
                setLoading(false);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : 'Failed to fetch student data');
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [studentId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-text-muted">Loading student data...</div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-900">Error loading student data: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Engagement Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Current Streak */}
                <div className="bg-white rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-muted">Current Streak</span>
                        <span className="text-2xl">🔥</span>
                    </div>
                    <div className="text-3xl font-bold text-text">
                        {data.student.currentStreak}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                        Longest: {data.student.longestStreak} days
                    </div>
                </div>

                {/* Total Points */}
                <div className="bg-white rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-muted">Total Points</span>
                        <span className="text-2xl">⭐</span>
                    </div>
                    <div className="text-3xl font-bold text-text">
                        {data.student.points}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                        +{data.student.weeklyPoints} this week
                    </div>
                </div>

                {/* Activities Completed */}
                <div className="bg-white rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-muted">Completed</span>
                        <span className="text-2xl">✅</span>
                    </div>
                    <div className="text-3xl font-bold text-text">
                        {data.engagement.totalActivitiesCompleted}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                        {data.engagement.activitiesInProgress} in progress
                    </div>
                </div>

                {/* Days Active */}
                <div className="bg-white rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-muted">Days Active</span>
                        <span className="text-2xl">📅</span>
                    </div>
                    <div className="text-3xl font-bold text-text">
                        {data.student.daysActiveThisMonth}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                        This month · Last: {getRelativeTimeLabel(data.student.lastActive)}
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Favorite Activities & Progress */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Favorite Activities */}
                    <div className="bg-white rounded-lg border border-border p-6">
                        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                            <span>❤️</span>
                            Favorite Activities
                        </h2>
                        {data.engagement.favoriteActivities.length === 0 ? (
                            <p className="text-text-muted">No activities completed yet</p>
                        ) : (
                            <div className="space-y-2">
                                {data.engagement.favoriteActivities.map((activity, idx) => (
                                    <div
                                        key={activity.key}
                                        className="flex items-center justify-between p-3 bg-bg rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-semibold text-text-muted">
                                                #{idx + 1}
                                            </span>
                                            <div>
                                                <div className="font-medium text-text">
                                                    {activity.title}
                                                </div>
                                                <div className="text-xs text-text-muted capitalize">
                                                    {activity.category}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                                {activity.count}x played
                                            </span>
                                            {activity.count > 1 && (
                                                <span className="text-sm">🔁</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Grammar Guide Quiz Results */}
                    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                            <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </span>
                            Grammar Guide Quiz Scores
                        </h2>
                        {data.grammarQuizResults.length === 0 ? (
                            <div className="text-center py-8 bg-bg rounded-lg border border-dashed border-border/60">
                                <p className="text-text-muted">No grammar guide quizzes completed yet.</p>
                                <p className="text-xs text-text-muted/60 mt-1 italic">Scores will appear here once the student finishes a guide's mini-quiz.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {data.grammarQuizResults.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className={`flex items-center justify-between p-4 rounded-xl transition-all border ${
                                            quiz.completed
                                                ? quiz.score !== null && quiz.score >= 80
                                                    ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50'
                                                    : quiz.score !== null && quiz.score >= 60
                                                    ? 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
                                                    : 'bg-rose-50/50 border-rose-100 hover:bg-rose-50'
                                                : 'bg-bg border-border/40'
                                        }`}
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="font-semibold text-text truncate">
                                                {quiz.title}
                                            </div>
                                            {quiz.submittedAt && (
                                                <div className="text-xs text-text-muted flex items-center gap-1.5 mt-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Last attempted: {new Date(quiz.submittedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {quiz.completed && quiz.score !== null ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-black ${
                                                            quiz.score >= 80 ? 'text-emerald-700' :
                                                            quiz.score >= 60 ? 'text-amber-700' :
                                                            'text-rose-700'
                                                        }`}>
                                                            {quiz.score}%
                                                        </div>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                        quiz.score >= 80 ? 'bg-emerald-200 text-emerald-800' :
                                                        quiz.score >= 60 ? 'bg-amber-200 text-amber-800' :
                                                        'bg-rose-200 text-rose-800'
                                                    }`}>
                                                        {quiz.score >= 80 ? 'A' : quiz.score >= 60 ? 'B' : 'C'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium text-text-muted bg-white/50 px-2 py-1 rounded border border-border/40">Not Started</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Verb Quiz Results */}
                    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                            <span className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </span>
                            Verb Quiz Scores
                        </h2>
                        {data.verbQuizResults.length === 0 ? (
                            <p className="text-text-muted">No verb quizzes available</p>
                        ) : (
                            <div className="space-y-2">
                                {data.verbQuizResults.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${
                                            quiz.completed
                                                ? quiz.score !== null && quiz.score >= 80
                                                    ? 'bg-green-50/50 border-green-100'
                                                    : quiz.score !== null && quiz.score >= 60
                                                    ? 'bg-yellow-50/50 border-yellow-100'
                                                    : 'bg-red-50/50 border-red-100'
                                                : 'bg-bg border-border/40'
                                        }`}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-text">
                                                {quiz.title}
                                            </div>
                                            {quiz.submittedAt && (
                                                <div className="text-xs text-text-muted">
                                                    Submitted {new Date(quiz.submittedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {quiz.completed && quiz.score !== null ? (
                                                <>
                                                    <div className="text-right">
                                                        <div className={`text-lg font-bold ${
                                                            quiz.score >= 80 ? 'text-green-700' :
                                                            quiz.score >= 60 ? 'text-yellow-700' :
                                                            'text-red-700'
                                                        }`}>
                                                            {quiz.score}%
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-sm text-text-muted">Not completed</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress by Category */}
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                            <span>📊</span>
                            Category Intervention
                        </h2>
                        <p className="mb-5 text-sm text-text-muted">
                            Assigned-work status by category, with stalled and overdue work surfaced first.
                        </p>
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {CATEGORY_ORDER.filter((categoryKey) =>
                                shouldShowCategory(categoryKey, data.progress.byCategory[categoryKey])
                            ).map((categoryKey) => (
                                <InterventionCategoryCard
                                    key={categoryKey}
                                    categoryKey={categoryKey}
                                    summary={data.progress.byCategory[categoryKey]}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Recent Activity Timeline */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-border p-6">
                        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                            <span>⏱️</span>
                            Recent Activity
                        </h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {data.timeline.length === 0 ? (
                                <p className="text-text-muted text-sm">No activity yet</p>
                            ) : (
                                data.timeline.map(entry => {
                                    // Parse the new format: "Title|Type" or legacy formats
                                    let activityName = entry.activity;
                                    let activityType: string | undefined = entry.activityType;

                                    if (!activityType && entry.activity.includes('|')) {
                                        // New format: "Title|Type"
                                        const [title, type] = entry.activity.split('|');
                                        activityName = title.trim();
                                        activityType = type?.trim();
                                    } else if (!activityType && entry.activity.startsWith('Completed: ')) {
                                        // Legacy format
                                        activityName = entry.activity.replace('Completed: ', '');
                                    } else if (!activityType && entry.activity.includes(':')) {
                                        // Legacy grammar format: "grammar:slug"
                                        const formatted = entry.activity.split(':')[1]
                                            ?.replace(/-/g, ' ')
                                            .split(' ')
                                            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                            .join(' ') || entry.activity;
                                        activityName = formatted;
                                        if (entry.activity.startsWith('grammar:')) {
                                            activityType = 'Grammar Guide';
                                        }
                                    }

                                    // Special handling for streak and achievement entries
                                    if (entry.activity === 'Streak bonus' || entry.activity === 'Streak + weekly bonus') {
                                        activityType = 'Streak Bonus';
                                    } else if (entry.activity.startsWith('Achievement:')) {
                                        activityType = 'Achievement';
                                        activityName = entry.activity.replace('Achievement: ', '');
                                    } else if (entry.source === 'progress') {
                                        activityType = 'In progress';
                                    }

                                    return (
                                        <div
                                            key={entry.id}
                                            className="flex items-start gap-3 p-3 bg-bg rounded-lg"
                                        >
                                            {entry.points > 0 ? (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-primary">
                                                        +{entry.points}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-secondary">↻</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-text">
                                                    {activityName}
                                                </div>
                                                {activityType && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium text-secondary bg-secondary/10 rounded-full">
                                                        {activityType}
                                                    </span>
                                                )}
                                                <div className="text-xs text-text-muted mt-1">
                                                    {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                                                    {new Date(entry.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
