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
}

export const TodaysAssignments: React.FC<Props> = ({ initialAssignments }) => {
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
                <h2 className="text-2xl font-display font-bold text-text mb-4">Today's Assignments</h2>
                <div className="animate-pulse bg-bg-light rounded-xl h-32"></div>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-text mb-4">Today's Assignments</h2>
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
            <h2 className="text-2xl font-display font-bold text-text mb-4">Today's Assignments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((assignment, index) => {
                    const submission = assignment.submissions[0];
                    const isCompleted = submission?.completedAt;
                    const categoryKey = (assignment.activity.category || '').toLowerCase();
                    const categoryStyles: Record<string, { label: string; bg: string; text: string; border: string }> = {
                        vocab: { label: 'Vocab', bg: '#fef3e7', text: '#b45b1c', border: '#f4a261' },
                        vocabulary: { label: 'Vocab', bg: '#fef3e7', text: '#b45b1c', border: '#f4a261' },
                        grammar: { label: 'Grammar', bg: '#fdece8', text: '#c24a32', border: '#e76f51' },
                        reading: { label: 'Reading', bg: '#e8f6f3', text: '#217f72', border: '#2a9d8f' },
                        writing: { label: 'Writing', bg: '#eef6ee', text: '#4f7b55', border: '#7ba884' },
                        pronunciation: { label: 'Pronunciation', bg: '#f1e9f7', text: '#5b3c86', border: '#6a4c93' },
                        speaking: { label: 'Speaking', bg: '#fff3e6', text: '#c4681a', border: '#f5a524' },
                        listening: { label: 'Listening', bg: '#e8f7f6', text: '#1b7d73', border: '#2a9d8f' },
                        default: { label: 'Vocab', bg: '#fef3e7', text: '#b45b1c', border: '#f4a261' }
                    };
                    const categoryStyle = categoryStyles[categoryKey] || categoryStyles.default;

                    return (
                        <div
                            key={assignment.id}
                            className="relative bg-white rounded-xl p-6 border border-border/60 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group flex flex-col h-full"
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Type badge */}
                            <div className="absolute top-4 right-4">
                                <div
                                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md border"
                                    style={{
                                        backgroundColor: categoryStyle.bg,
                                        color: categoryStyle.text,
                                        borderColor: categoryStyle.border
                                    }}
                                >
                                    {categoryStyle.label}
                                </div>
                            </div>

                            {/* Completion badge */}
                            {isCompleted && (
                                <div className="absolute top-4 left-4">
                                    <div className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
                                        <span>✓</span>
                                        <span>Completed</span>
                                    </div>
                                </div>
                            )}

                            <div className={`${isCompleted ? 'mt-8' : 'mt-8 sm:mt-0'} flex flex-col h-full`}>
                                <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors mb-2 font-display pr-24">
                                    {assignment.title || assignment.activity.title}
                                </h3>

                                <Link
                                    href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                                    className="inline-flex items-center justify-center px-8 py-3 text-base font-bold transition-all hover:shadow-lg active:scale-95 rounded-lg bg-primary text-white hover:bg-primary/90 mt-auto self-end"
                                >
                                    {isCompleted ? 'Review' : 'Start Activity'}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
