'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { ActivityLink } from '@/components/navigation/ActivityLink';
import { getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab/display';
import type { FeaturedAssignment, CategoryStyle } from './types';

const FEATURED_NEW_BADGE_CLASS_NAME = 'inline-flex items-center gap-1 rounded-full border';

export interface AssignmentCardProps {
    assignment: FeaturedAssignment;
    index: number;
    ctaLabel: string;
    categoryStyle: CategoryStyle;
    displayTitle: string;
    isNew: boolean;
    isCompleted: boolean;
}

/**
 * Single assignment card for the "cards" variant of TodaysAssignments.
 * Presentational; parent computes categoryStyle, displayTitle, isNew, isCompleted.
 */
export function AssignmentCard({
    assignment,
    index,
    ctaLabel,
    categoryStyle,
    displayTitle,
    isNew,
    isCompleted,
}: AssignmentCardProps) {
    return (
        <div
            className="dashboard-panel-hover relative overflow-hidden rounded-2xl border surface-card-shadow group"
            style={{
                animationDelay: `${index * 40}ms`,
                backgroundColor: 'var(--dashboard-surface-start)',
                borderColor: 'var(--dashboard-border)',
            }}
        >
            <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-[width] duration-200 group-hover:w-1.5"
                style={{ backgroundColor: categoryStyle.accent }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 pl-5">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                            className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                            style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
                        >
                            {categoryStyle.label}
                        </span>

                        {isNew && (
                            <span
                                className={`${FEATURED_NEW_BADGE_CLASS_NAME} px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide`}
                            >
                                <Sparkles className="h-2.5 w-2.5 text-amber-700" aria-hidden />
                                New
                            </span>
                        )}

                        {(() => {
                            const vocabType = getVocabActivityType(assignment.activityId);
                            if (!vocabType) return null;
                            const chip = VOCAB_CHIP_CONFIG[vocabType];
                            return (
                                <ActivityLink
                                    activityId={assignment.activityId}
                                    assignmentId={assignment.id}
                                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border transition-colors z-20 ${chip.className}`}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {chip.icon} {chip.label}
                                </ActivityLink>
                            );
                        })()}

                        {assignment.progress != null && assignment.progress > 0 && !isCompleted && (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {Math.round(assignment.progress)}% done
                            </span>
                        )}

                        {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-[#3d6b47] dark:text-secondary rounded text-[10px] font-bold uppercase tracking-wide">
                                <span className="text-xs">✓</span>
                                Done
                            </span>
                        )}
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-text group-hover:text-primary transition-colors leading-snug">
                        {displayTitle}
                    </h3>
                </div>

                <ActivityLink
                    activityId={assignment.activityId}
                    assignmentId={assignment.assignmentId ?? assignment.id}
                    href={assignment.href}
                    className="dashboard-accent-button inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold whitespace-nowrap active:scale-95 sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    aria-label={`${isCompleted ? 'Review' : ctaLabel} ${displayTitle}`}
                    style={
                        {
                            '--dashboard-button-accent': categoryStyle.accent,
                            '--dashboard-button-text': categoryStyle.text,
                        } as React.CSSProperties
                    }
                >
                    {isCompleted ? 'Review' : ctaLabel}
                </ActivityLink>
            </div>
        </div>
    );
}
