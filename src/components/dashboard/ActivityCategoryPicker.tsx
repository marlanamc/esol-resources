'use client';

import React, { useState, useMemo } from 'react';
import { PenLine, Gamepad2, BookOpen, ClipboardList, Mic, PenTool, Volume2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getLearnerCategoryTone } from '@/lib/learner-theme';

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
    icon: React.ReactNode;
}

const CATEGORY_CARDS: CategoryCardDef[] = [
    {
        key: 'grammar',
        name: 'Grammar',
        subtitle: 'Sentences · Rules',
        icon: <PenLine className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
    },
    {
        key: 'games',
        name: 'Games',
        subtitle: 'Practice + fun',
        icon: <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
    },
    {
        key: 'vocabulary',
        name: 'Vocabulary',
        subtitle: 'Words · Meaning · Use',
        icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
    },
    {
        key: 'quizzes',
        name: 'Quizzes',
        subtitle: 'Points · Grades',
        icon: <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
    },
    {
        key: 'speaking',
        name: 'Speaking',
        subtitle: 'Say it out loud',
        icon: <Mic className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
    },
    {
        key: 'pronunciation',
        name: 'Pronunciation',
        subtitle: 'Sounds · minimal pairs',
        icon: <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
    },
    {
        key: 'writing',
        name: 'Writing',
        subtitle: 'Short answers',
        icon: <PenTool className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />,
    },
];

interface ActivityCategoryPickerProps {
    activities: Activity[];
    completedActivityIds?: Set<string>;
    completedActivityTitles?: Set<string>;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    /** Initial category to open (e.g. from ?category=grammar). Must match a CATEGORY_CARDS key. */
    initialCategory?: string | null;
}

// Lazy-import ActivityCategories to avoid circular deps
const ActivityCategories = React.lazy(() =>
    import('./ActivityCategories').then(mod => ({ default: mod.ActivityCategories }))
);

export function ActivityCategoryPicker({
    activities,
    completedActivityIds,
    completedActivityTitles,
    progressMap,
    initialCategory = null,
}: ActivityCategoryPickerProps) {
    const ACTIVITIES_CATEGORY_STORAGE_KEY = 'dashboard-activities-selected-category-v1';
    const ACTIVITIES_LAST_HREF_STORAGE_KEY = 'dashboard-activities-last-href-v1';
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
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

        // Pronunciation
        map['pronunciation'] = activities.some(
            (a) => a.category === 'pronunciation' || a.ui === 'ed-pronunciation' || a.ui === 'minimal-pairs'
        );

        return map;
    }, [activities]);

    const visibleCards = CATEGORY_CARDS.filter((c) => categoryHasActivities[c.key]);
    const validInitialCategory =
        initialCategory && CATEGORY_CARDS.some((c) => c.key === initialCategory) && categoryHasActivities[initialCategory]
            ? initialCategory
            : null;

    const [selectedCategory, setSelectedCategory] = useState<string | null>(() => validInitialCategory);

    const updateCategoryQuery = (category: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category) params.set('category', category);
        else params.delete('category');
        const qs = params.toString();
        const nextHref = qs ? `${pathname}?${qs}` : pathname;
        window.sessionStorage.setItem(ACTIVITIES_LAST_HREF_STORAGE_KEY, nextHref);
        router.replace(nextHref, { scroll: false });
    };

    React.useEffect(() => {
        if (selectedCategory) {
            window.sessionStorage.setItem(ACTIVITIES_CATEGORY_STORAGE_KEY, selectedCategory);
            return;
        }
        window.sessionStorage.removeItem(ACTIVITIES_CATEGORY_STORAGE_KEY);
    }, [selectedCategory]);

    React.useEffect(() => {
        if (selectedCategory || validInitialCategory) return;
        const stored = window.sessionStorage.getItem(ACTIVITIES_CATEGORY_STORAGE_KEY);
        if (!stored) return;
        if (!categoryHasActivities[stored]) return;
        setSelectedCategory(stored);
    }, [categoryHasActivities, selectedCategory, validInitialCategory]);

    React.useEffect(() => {
        const currentHref = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        window.sessionStorage.setItem(ACTIVITIES_LAST_HREF_STORAGE_KEY, currentHref);
    }, [pathname, searchParams]);

    // Category picker view
    if (!selectedCategory) {
        return (
            <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
                    {visibleCards.map((card) => (
                        (() => {
                            const tone = getLearnerCategoryTone(card.key);
                            return (
                        <button
                            key={card.key}
                            onClick={() => {
                                setSelectedCategory(card.key);
                                updateCategoryQuery(card.key);
                            }}
                            className="group flex flex-col rounded-2xl overflow-hidden border surface-card-shadow transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 cursor-pointer"
                            style={{
                                borderColor: tone.border,
                                background: `linear-gradient(180deg, ${tone.surfaceMuted} 0%, var(--surface-elevated) 42%, var(--surface-elevated) 100%)`,
                            }}
                        >
                            {/* Category-tinted icon area */}
                            <div
                                className="flex items-center justify-center py-6 sm:py-7 transition-transform duration-300 relative border-b"
                                style={{
                                    background: `linear-gradient(180deg, ${tone.surface} 0%, ${tone.surfaceMuted} 100%)`,
                                    borderColor: tone.border,
                                    borderTop: `4px solid ${tone.accent}`,
                                }}
                            >
                                <div
                                    className="absolute inset-x-8 top-4 h-16 rounded-full blur-2xl opacity-80"
                                    style={{ backgroundColor: tone.surface }}
                                    aria-hidden="true"
                                />
                                <span
                                    className="select-none group-hover:scale-105 transition-transform duration-300 relative z-10 rounded-xl p-3"
                                    style={{
                                        color: tone.accent,
                                        backgroundColor: tone.chipBg,
                                        boxShadow: `inset 0 0 0 1px ${tone.border}, 0 8px 20px rgba(13,22,32,0.18)`,
                                    }}
                                >
                                    {card.icon}
                                </span>
                            </div>

                            <div className="flex flex-col items-center gap-1 py-3 sm:py-3.5 px-2">
                                <div
                                    className="mb-1 h-px w-[78%]"
                                    style={{ background: `linear-gradient(90deg, transparent 0%, ${tone.accentStrong} 18%, ${tone.accentStrong} 82%, transparent 100%)` }}
                                    aria-hidden="true"
                                />
                                <span className="text-base sm:text-lg font-bold font-display" style={{ color: tone.accentStrong, textShadow: '0 1px 0 rgba(0,0,0,0.12)' }}>
                                    {card.name}
                                </span>
                                <span className="text-[11px] sm:text-xs font-medium tracking-wide" style={{ color: 'var(--text-color-muted)' }}>
                                    {card.subtitle}
                                </span>
                            </div>
                        </button>
                            );
                        })()
                    ))}
                </div>
            </div>
        );
    }

    // Activity list view for selected category
    const selectedCardDef = CATEGORY_CARDS.find((c) => c.key === selectedCategory);

    return (
        <div>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <li>
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                updateCategoryQuery(null);
                            }}
                            className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer active:scale-95"
                        >
                            <svg
                                className="w-4 h-4"
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
                            <span>Activities</span>
                        </button>
                    </li>
                    <li aria-hidden="true" className="text-border">/</li>
                    <li className="text-text font-semibold">{selectedCardDef?.name}</li>
                </ol>
            </nav>

            {/* Category header */}
            <div className="flex items-center justify-center gap-3 mb-6 text-center">
                {selectedCardDef && (
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                        style={{
                            backgroundColor: getLearnerCategoryTone(selectedCardDef.key).chipBg,
                            color: getLearnerCategoryTone(selectedCardDef.key).accent,
                            boxShadow: `inset 0 0 0 1px ${getLearnerCategoryTone(selectedCardDef.key).border}`,
                        }}
                    >
                        {selectedCardDef.icon}
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
                    completedActivityTitles={completedActivityTitles}
                    progressMap={progressMap}
                    filterCategory={selectedCategory}
                />
            </React.Suspense>
        </div>
    );
}
