'use client';

import React, { useState, useMemo } from 'react';

// Re-use the Activity type shape from ActivityCategories
interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
    content?: string;
}

interface CategoryCardDef {
    key: string;
    name: string;
    subtitle: string;
    emoji: string;
    bgColor: string;       // top section background
    iconBg: string;         // icon circle background
}

const CATEGORY_CARDS: CategoryCardDef[] = [
    {
        key: 'vocabulary',
        name: 'Vocabulary',
        subtitle: 'Words · Meaning · Use',
        emoji: '📖',
        bgColor: '#c8e6c9',
        iconBg: '#a5d6a7',
    },
    {
        key: 'grammar',
        name: 'Grammar',
        subtitle: 'Sentences · Rules',
        emoji: '✏️',
        bgColor: '#bbdefb',
        iconBg: '#90caf9',
    },
    {
        key: 'games',
        name: 'Games',
        subtitle: 'Practice + fun',
        emoji: '🎮',
        bgColor: '#d1c4e9',
        iconBg: '#b39ddb',
    },
    {
        key: 'quizzes',
        name: 'Quizzes',
        subtitle: 'Points · Grades',
        emoji: '📋',
        bgColor: '#ffcdd2',
        iconBg: '#ef9a9a',
    },
    {
        key: 'speaking',
        name: 'Speaking',
        subtitle: 'Say it out loud',
        emoji: '🎙️',
        bgColor: '#ffe0b2',
        iconBg: '#ffcc80',
    },
    {
        key: 'writing',
        name: 'Writing',
        subtitle: 'Short answers',
        emoji: '✍️',
        bgColor: '#d7ccc8',
        iconBg: '#bcaaa4',
    },
];

interface ActivityCategoryPickerProps {
    activities: Activity[];
    completedActivityIds?: Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
}

// Lazy-import ActivityCategories to avoid circular deps
const ActivityCategories = React.lazy(() =>
    import('./ActivityCategories').then(mod => ({ default: mod.ActivityCategories }))
);

export function ActivityCategoryPicker({
    activities,
    completedActivityIds,
    progressMap,
}: ActivityCategoryPickerProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Determine which categories actually have activities so we can hide empty ones
    const categoryHasActivities = useMemo(() => {
        const map: Record<string, boolean> = {};

        // Vocabulary: has vocab- prefixed activities
        map['vocabulary'] = activities.some((a) => a.id?.startsWith('vocab-'));

        // Grammar
        map['grammar'] = activities.some((a) => a.category === 'grammar');

        // Games
        map['games'] = activities.some((a) => {
            if (a.type !== 'game') return false;
            if (a.id?.startsWith('vocab-')) return false;
            return (
                a.id === 'numbers-game' ||
                a.id === 'countable-uncountable-nouns' ||
                a.ui === 'verb-forms' ||
                a.ui === 'verbforms' ||
                a.category === 'games'
            );
        });

        // Quizzes
        map['quizzes'] = activities.some((a) => {
            if (a.category !== 'quizzes') return false;
            try {
                const content = JSON.parse(a.content || '{}');
                return content.released === true;
            } catch {
                return false;
            }
        });

        // Speaking
        map['speaking'] = activities.some((a) => {
            if (a.category !== 'speaking') return false;
            try {
                const content = JSON.parse(a.content || '{}');
                return content.released === true;
            } catch {
                return false;
            }
        });

        // Writing
        map['writing'] = activities.some(
            (a) => a.category === 'writing' || a.category === 'writing-reading'
        );

        return map;
    }, [activities]);

    const visibleCards = CATEGORY_CARDS.filter((c) => categoryHasActivities[c.key]);

    // Category picker view
    if (!selectedCategory) {
        return (
            <div className="animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
                    {visibleCards.map((card, idx) => (
                        <button
                            key={card.key}
                            onClick={() => setSelectedCategory(card.key)}
                            className="category-card group flex flex-col rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer"
                            style={{
                                animationDelay: `${idx * 80}ms`,
                            }}
                        >
                            {/* Colored icon area */}
                            <div
                                className="flex items-center justify-center py-6 sm:py-8 transition-transform duration-300"
                                style={{ backgroundColor: card.bgColor }}
                            >
                                <span className="text-4xl sm:text-5xl select-none group-hover:scale-110 transition-transform duration-300">
                                    {card.emoji}
                                </span>
                            </div>

                            {/* Label area */}
                            <div className="flex flex-col items-center gap-1 py-3 sm:py-4 px-2">
                                <span className="text-base sm:text-lg font-bold font-display text-text">
                                    {card.name}
                                </span>
                                <span className="text-[11px] sm:text-xs text-text-muted font-medium tracking-wide">
                                    {card.subtitle}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Activity list view for selected category
    const selectedCardDef = CATEGORY_CARDS.find((c) => c.key === selectedCategory);

    return (
        <div className="animate-fade-in">
            {/* Back button */}
            <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-all mb-6 group cursor-pointer active:scale-95"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
                    <svg
                        className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
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
                </div>
                <span>Back</span>
            </button>

            {/* Category header */}
            <div className="flex items-center gap-3 mb-6">
                {selectedCardDef && (
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: selectedCardDef.bgColor }}
                    >
                        {selectedCardDef.emoji}
                    </div>
                )}
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
                    {selectedCardDef?.name}
                </h2>
            </div>

            {/* Filtered activity list */}
            <React.Suspense
                fallback={
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                }
            >
                <ActivityCategories
                    activities={activities}
                    completedActivityIds={completedActivityIds}
                    progressMap={progressMap}
                    filterCategory={selectedCategory}
                />
            </React.Suspense>
        </div>
    );
}
