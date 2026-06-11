'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { ActivityLink } from '@/components/navigation/ActivityLink';
import { VocabActivityVisual } from './VocabActivityVisual';
import type { Activity, ActivityCardMeta } from './activity-categories-types';
import { capitalizeFirstLetter } from './activity-categories-helpers';
import type { TenseTexture } from './activity-categories-textures';

export interface ActivityCardProps {
    activity: Activity;
    isCompleted: boolean;
    progressValue: number;
    progressText: string | null;
    accentColor?: string;
    hideTypeChip?: boolean;
    points?: number;
    tenseTexture?: TenseTexture;
    vocabType: ReturnType<typeof getVocabActivityType>;
    vocabUnitNumber: number | null;
    vocabThemeChip: string | null;
    vocabWordsChip: string | null;
    verbQuizWordsChip: string | null;
    activityCardTitle: string;
    grammarChipCopy: { friendlyTitle: string; useThisFor: string } | null;
    gameEmoji: string | null;
    showDecorativeTexture: boolean;
}

export const getCategoryProgressText = (activityId: string, progressMap?: Record<string, { progress: number; categoryData?: string }>) => {
    const data = progressMap?.[activityId];
    if (!data?.categoryData) return null;

    try {
        const categories = JSON.parse(data.categoryData) as unknown;
        if (!categories || typeof categories !== "object") return null;
        const values = Object.values(categories as Record<string, unknown>);
        const completed = values.filter((value) => {
            if (!value || typeof value !== "object") return false;
            const entry = value as { completed?: unknown };
            return entry.completed === true;
        }).length;
        const total = values.length;
        return `${completed}/${total} categories`;
    } catch {
        return null;
    }
};

export const ActivityCard = React.memo(function ActivityCard({
    activity,
    isCompleted,
    progressValue,
    progressText,
    accentColor,
    hideTypeChip,
    points,
    tenseTexture,
    vocabType,
    vocabUnitNumber,
    vocabThemeChip,
    vocabWordsChip,
    verbQuizWordsChip,
    activityCardTitle,
    grammarChipCopy,
    gameEmoji,
    showDecorativeTexture,
}: ActivityCardProps) {
    const progressChipLabel = activity.id === 'numbers-game' && progressText
        ? progressText
        : `${progressValue}% done`;
    const isVocabularyCard = activity.id.startsWith('vocab-') || activity.category?.toLowerCase() === 'vocabulary';
    const isGameCard = activity.type === 'game' || activity.category?.toLowerCase() === 'games';

    // Determine card state for styling
    const hasProgress = progressValue > 0 && progressValue < 100;
    const showCompletedState = isCompleted && !isGameCard;
    const showProgressState = hasProgress && !isGameCard;

    // Use tense texture color if provided, otherwise fall back to defaults
    const accentBorderColor = tenseTexture?.color || (showCompletedState ? undefined : accentColor);

    return (
        <div
            className={`group relative block rounded-xl border bg-white p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 overflow-hidden
                ${showCompletedState
                    ? 'border-secondary/30 shadow-sm'
                    : showProgressState
                        ? 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
                        : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
            style={{
                borderColor: showCompletedState ? undefined : (accentBorderColor ? `${accentBorderColor}40` : undefined),
                contentVisibility: 'auto',
                containIntrinsicSize: '160px',
            }}
        >
            {/* Tense texture background pattern */}
            {tenseTexture && !showCompletedState && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{ background: tenseTexture.gradient }}
                />
            )}

            {/* Wave pattern overlay for continuous tenses */}
            {showDecorativeTexture && tenseTexture?.pattern === 'wave' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`wave-${activity.id}`} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                            <path
                                d="M0 10 Q10 0, 20 10 T40 10"
                                fill="none"
                                stroke={tenseTexture.color}
                                strokeWidth="2"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#wave-${activity.id})`} />
                </svg>
            )}

            {/* Dots pattern for perfect tenses */}
            {showDecorativeTexture && tenseTexture?.pattern === 'dots' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`dots-${activity.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                            <circle cx="8" cy="8" r="1.5" fill={tenseTexture.color} />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dots-${activity.id})`} />
                </svg>
            )}

            {/* Diagonal lines for perfect continuous */}
            {showDecorativeTexture && tenseTexture?.pattern === 'diagonal' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`diagonal-${activity.id}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                            <path d="M0 12 L12 0" stroke={tenseTexture.color} strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#diagonal-${activity.id})`} />
                </svg>
            )}

            {/* Mixed pattern for reviews */}
            {showDecorativeTexture && tenseTexture?.pattern === 'mixed' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`mixed-${activity.id}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="6" cy="6" r="1" fill={tenseTexture.color} />
                            <circle cx="18" cy="18" r="1" fill={tenseTexture.color} />
                            <path d="M12 0 L12 24" stroke={tenseTexture.color} strokeWidth="0.5" strokeDasharray="2,4" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#mixed-${activity.id})`} />
                </svg>
            )}

            {/* Grid pattern for vocab flashcards */}
            {showDecorativeTexture && tenseTexture?.pattern === 'grid' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`grid-${activity.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M20 0 L0 0 0 20" fill="none" stroke={tenseTexture.color} strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${activity.id})`} />
                </svg>
            )}

            {/* Bubbles pattern for speaking/conversation */}
            {showDecorativeTexture && tenseTexture?.pattern === 'bubbles' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`bubbles-${activity.id}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="5" cy="5" r="3" fill="none" stroke={tenseTexture.color} strokeWidth="0.8" />
                            <circle cx="20" cy="18" r="4" fill="none" stroke={tenseTexture.color} strokeWidth="0.8" />
                            <circle cx="12" cy="25" r="2" fill="none" stroke={tenseTexture.color} strokeWidth="0.6" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#bubbles-${activity.id})`} />
                </svg>
            )}

            {/* Lines pattern for writing */}
            {showDecorativeTexture && tenseTexture?.pattern === 'lines' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`lines-${activity.id}`} x="0" y="0" width="100" height="12" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="11" x2="100" y2="11" stroke={tenseTexture.color} strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#lines-${activity.id})`} />
                </svg>
            )}

            {/* Pulse pattern for games (concentric circles) */}
            {showDecorativeTexture && tenseTexture?.pattern === 'pulse' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`pulse-${activity.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="6" fill="none" stroke={tenseTexture.color} strokeWidth="0.8" />
                            <circle cx="20" cy="20" r="12" fill="none" stroke={tenseTexture.color} strokeWidth="0.5" />
                            <circle cx="20" cy="20" r="18" fill="none" stroke={tenseTexture.color} strokeWidth="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pulse-${activity.id})`} />
                </svg>
            )}

            {/* Scatter pattern for word scramble */}
            {showDecorativeTexture && tenseTexture?.pattern === 'scatter' && !showCompletedState && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" preserveAspectRatio="none">
                    <defs>
                        <pattern id={`scatter-${activity.id}`} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                            <rect x="2" y="4" width="4" height="4" rx="1" fill={tenseTexture.color} transform="rotate(15 4 6)" />
                            <rect x="18" y="2" width="3" height="3" rx="0.5" fill={tenseTexture.color} transform="rotate(-10 19.5 3.5)" />
                            <rect x="8" y="20" width="5" height="5" rx="1" fill={tenseTexture.color} transform="rotate(25 10.5 22.5)" />
                            <rect x="24" y="22" width="3" height="3" rx="0.5" fill={tenseTexture.color} transform="rotate(-20 25.5 23.5)" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#scatter-${activity.id})`} />
                </svg>
            )}

            {/* Progress background fill */}
            {showProgressState && (
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                        background: tenseTexture
                            ? `linear-gradient(90deg, ${tenseTexture.color}08 0%, transparent 100%)`
                            : 'linear-gradient(90deg, rgba(217, 119, 87, 0.03) 0%, transparent 100%)',
                        width: `${Math.min(progressValue, 100)}%`
                    }}
                />
            )}

            {/* Completed state background */}
            {showCompletedState && (
                <div className="absolute inset-0 rounded-xl bg-secondary/[0.04] pointer-events-none" />
            )}

            {showCompletedState && (
                <div className="absolute top-3 right-3 z-20">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-3 relative z-10">
                {gameEmoji ? (
                    <span className="mt-0.5 text-xl flex-shrink-0">
                        {gameEmoji}
                    </span>
                ) : tenseTexture ? (
                    <span
                        className="mt-1 text-sm flex-shrink-0 font-medium select-none"
                        style={{ color: showCompletedState ? 'var(--secondary)' : tenseTexture.color }}
                        title={tenseTexture.id}
                    >
                        {tenseTexture.icon}
                    </span>
                ) : (
                    <span
                        className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                            isCompleted
                                ? 'bg-secondary'
                                : hasProgress
                                    ? 'bg-primary'
                                    : 'bg-gray-300'
                        }`}
                    />
                )}
                <div className="flex-1 min-w-0">
                    <ActivityLink
                        activityId={activity.id}
                        className={`text-sm font-semibold leading-snug group-hover:text-primary transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:rounded ${
                            showCompletedState ? 'text-secondary' : 'text-text'
                        }`}
                    >
                        {activityCardTitle}
                    </ActivityLink>
                    {isVocabularyCard && (
                        <div className="mt-2 -mx-1">
                            <VocabActivityVisual
                                activityId={activity.id}
                                title={activity.title}
                                unitNumber={vocabUnitNumber}
                            />
                        </div>
                    )}
                    <div className="mt-2 flex items-start gap-2 text-xs text-text-muted">
                        <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
                            {vocabThemeChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#2563eb'}08`,
                                        borderColor: `${tenseTexture?.color ?? '#2563eb'}2A`,
                                        color: tenseTexture?.color ?? '#1e3a8a',
                                    }}
                                >
                                    {capitalizeFirstLetter(vocabThemeChip)}
                                </span>
                            )}
                            {vocabWordsChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#2563eb'}12`,
                                        borderColor: `${tenseTexture?.color ?? '#2563eb'}30`,
                                        color: tenseTexture?.color ?? '#1e3a8a',
                                    }}
                                >
                                    {vocabWordsChip}
                                </span>
                            )}
                            {verbQuizWordsChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#15803d'}12`,
                                        borderColor: `${tenseTexture?.color ?? '#15803d'}30`,
                                        color: tenseTexture?.color ?? '#166534',
                                    }}
                                >
                                    {verbQuizWordsChip}
                                </span>
                            )}
                            {grammarChipCopy && (
                                <span
                                    className="px-2 py-0.5 rounded-full font-semibold text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#64748b'}14`,
                                        color: tenseTexture?.color ?? '#475569',
                                    }}
                                >
                                    {grammarChipCopy.friendlyTitle}
                                </span>
                            )}
                            {!hideTypeChip && (
                                vocabType ? (
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${VOCAB_CHIP_CONFIG[vocabType].className}`}
                                    >
                                        {VOCAB_CHIP_CONFIG[vocabType].icon} {VOCAB_CHIP_CONFIG[vocabType].label}
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold rounded-full text-[10px] uppercase tracking-wide">
                                        {activity.type}
                                    </span>
                                )
                            )}
                            {points !== undefined && points > 0 && !showCompletedState && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px]">
                                    +{points} pts
                                </span>
                            )}
                        </div>
                        {showProgressState && (
                            <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                                {progressChipLabel}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress bar - now more subtle and integrated */}
            {showProgressState && (
                <div className="mt-3 h-1.5 bg-gray-200/50 rounded-full overflow-hidden relative z-10 border border-gray-200/30">
                    <div
                        className="h-full bg-primary/80 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(var(--primary-rgb),0.2)]"
                        style={{ width: `${Math.min(progressValue, 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
});

export const DesktopCarousel = React.memo(function DesktopCarousel({
    children,
    ariaLabel,
}: {
    children: React.ReactNode;
    ariaLabel: string;
}) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(maxScrollLeft > 8 && el.scrollLeft < maxScrollLeft - 8);
    }, []);

    useEffect(() => {
        updateScrollState();
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);

        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [children, updateScrollState]);

    const scrollByPage = useCallback((direction: -1 | 1) => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollBy({
            left: el.clientWidth * 0.82 * direction,
            behavior: 'smooth',
        });
    }, []);

    return (
        <div className="relative">
            <div ref={scrollRef} className="activity-carousel">
                {children}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden lg:block">
                <button
                    type="button"
                    aria-label={`Scroll ${ariaLabel} left`}
                    onClick={() => scrollByPage(-1)}
                    className={`pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 h-10 w-10 rounded-full border bg-white/95 shadow-md transition-all ${
                        canScrollLeft ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ borderColor: 'rgba(15, 23, 42, 0.08)', color: 'var(--text-color)' }}
                >
                    <span aria-hidden="true" className="text-lg leading-none">‹</span>
                </button>

                <button
                    type="button"
                    aria-label={`Scroll ${ariaLabel} right`}
                    onClick={() => scrollByPage(1)}
                    className={`pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 h-10 w-10 rounded-full border bg-white/95 shadow-md transition-all ${
                        canScrollRight ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ borderColor: 'rgba(15, 23, 42, 0.08)', color: 'var(--text-color)' }}
                >
                    <span aria-hidden="true" className="text-lg leading-none">›</span>
                </button>
            </div>
        </div>
    );
});

