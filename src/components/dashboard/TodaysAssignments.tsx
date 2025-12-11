'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface FeaturedAssignment {
    id: string;
    title?: string | null;
    activityId: string;
    activity: {
        title: string;
        description: string | null;
        category?: string | null;
    };
    submissions: Array<{
        id: string;
        status: string;
        completedAt: Date | null;
        score: number | null;
    }>;
}

interface Props {
    initialAssignments?: FeaturedAssignment[];
    title?: string;
    ctaLabel?: string;
}

export const TodaysAssignments: React.FC<Props> = ({
    initialAssignments,
    title = "This Week's Activities",
    ctaLabel = "Start Activity",
}) => {
    const [assignments, setAssignments] = useState<FeaturedAssignment[]>(initialAssignments || []);
    const [loading, setLoading] = useState(true);

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
                <h2 className="text-3xl sm:text-3xl font-display font-bold text-text mb-4 leading-tight">{title}</h2>
                <div className="animate-pulse bg-bg-light rounded-xl h-32"></div>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="mb-8">
                <h2 className="text-3xl sm:text-3xl font-display font-bold text-text mb-4 leading-tight">{title}</h2>
                <div className="bg-gradient-to-br from-bg-light to-white rounded-xl p-8 text-center border border-border/60 shadow-sm">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-text-muted font-medium">No featured assignments right now</p>
                    <p className="text-sm text-text-muted mt-1">Check out the activities below to keep learning!</p>
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
                    const categoryKey = (assignment.activity.category || '').toLowerCase();
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
                        default: { label: 'VOCAB', bg: '#fef3e7', text: '#b45b1c', accent: '#f4a261' }
                    };
                    const categoryStyle = categoryStyles[categoryKey] || categoryStyles.default;
                    const rawTitle = assignment.title || assignment.activity.title;
                    const displayTitle = rawTitle.replace(/ - Complete Step-by-Step Guide$/i, ' Guide');

                    return (
                        <div
                            key={assignment.id}
                            className="relative bg-white rounded-xl border border-border/20 hover:border-border/40 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                            style={{
                                animationDelay: `${index * 80}ms`
                            }}
                        >
                            {/* Accent bar */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 group-hover:w-1.5"
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
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold transition-all hover:shadow-md active:scale-95 rounded-lg bg-primary text-white hover:brightness-110 whitespace-nowrap sm:shrink-0"
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
