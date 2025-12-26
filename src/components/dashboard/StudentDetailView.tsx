'use client';

import React, { useEffect, useState } from 'react';

interface StudentAnalytics {
    student: {
        id: string;
        name: string;
        username: string;
        points: number;
        weeklyPoints: number;
        currentStreak: number;
        longestStreak: number;
        lastActive: string | null;
        daysActiveThisMonth: number;
    };
    engagement: {
        totalActivitiesCompleted: number;
        activitiesInProgress: number;
        totalActivitiesStarted: number;
        favoriteActivities: Array<{
            key: string;
            count: number;
            title: string;
            category: string;
        }>;
        currentStreak: number;
        longestStreak: number;
    };
    progress: {
        byCategory: {
            vocab: {
                avgProgress: number;
                completed: number;
                activities: unknown[];
            };
            grammar: {
                avgProgress: number;
                completed: number;
                activities: unknown[];
            };
            numbers: {
                avgProgress: number;
                completed: number;
                activities: unknown[];
            };
            other: {
                avgProgress: number;
                completed: number;
                activities: unknown[];
            };
        };
        all: unknown[];
    };
    timeline: Array<{
        id: string;
        points: number;
        activity: string;
        timestamp: string;
    }>;
}

export default function StudentDetailView({ studentId }: { studentId: string }) {
    const [data, setData] = useState<StudentAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/teacher/student-analytics/${studentId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch student data');
                return res.json();
            })
            .then((data: StudentAnalytics) => {
                setData(data);
                setLoading(false);
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Failed to fetch student data');
                setLoading(false);
            });
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

    const getLastActiveText = (lastActive: string | null) => {
        if (!lastActive) return 'Never';
        const date = new Date(lastActive);
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
    };

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
                        This month · Last: {getLastActiveText(data.student.lastActive)}
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

                    {/* Progress by Category */}
                    <div className="bg-white rounded-lg border border-border p-6">
                        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                            <span>📊</span>
                            Progress by Category
                        </h2>
                        <div className="space-y-4">
                            {/* Vocab */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-text">Vocabulary</span>
                                    <span className="text-sm text-text-muted">
                                        {data.progress.byCategory.vocab.completed} completed
                                    </span>
                                </div>
                                <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-300"
                                        style={{ width: `${data.progress.byCategory.vocab.avgProgress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-text-muted mt-1">
                                    {data.progress.byCategory.vocab.avgProgress}% average progress
                                </div>
                            </div>

                            {/* Grammar */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-text">Grammar</span>
                                    <span className="text-sm text-text-muted">
                                        {data.progress.byCategory.grammar.completed} completed
                                    </span>
                                </div>
                                <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-[#e76f51] transition-all duration-300"
                                        style={{ width: `${data.progress.byCategory.grammar.avgProgress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-text-muted mt-1">
                                    {data.progress.byCategory.grammar.avgProgress}% average progress
                                </div>
                            </div>

                            {/* Numbers */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-text">Numbers</span>
                                    <span className="text-sm text-text-muted">
                                        {data.progress.byCategory.numbers.completed} completed
                                    </span>
                                </div>
                                <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${data.progress.byCategory.numbers.avgProgress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-text-muted mt-1">
                                    {data.progress.byCategory.numbers.avgProgress}% average progress
                                </div>
                            </div>

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
                                    const activityName = entry.activity.split(':')[1]
                                        ?.replace(/-/g, ' ')
                                        .split(' ')
                                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                        .join(' ') || entry.activity;

                                    return (
                                        <div
                                            key={entry.id}
                                            className="flex items-start gap-3 p-3 bg-bg rounded-lg"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">
                                                    +{entry.points}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-text">
                                                    {activityName}
                                                </div>
                                                <div className="text-xs text-text-muted">
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
