'use client';

import React from 'react';
import { ActivityLink } from '@/components/navigation/ActivityLink';
import { GrammarGuideVisual, hasGrammarGuideVisual } from './GrammarGuideVisual';
import { getSubcategorySubtitle } from '@/lib/subcategory-labels';

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

interface ActivityTexture {
  id: string;
  color: string;
  bgColor: string;
  gradient: string;
  pattern: string;
  icon: string;
}

interface ActivityCarouselProps {
  /** Section title (e.g., "SIMPLE") */
  sectionTitle: string;
  /** Activities to display in the carousel */
  activities: Activity[];
  /** Set of completed activity IDs */
  completedActivityIds?: Set<string>;
  /** Progress map: activityId -> { progress: number, categoryData?: string } */
  progressMap?: Record<string, { progress: number; categoryData?: string }>;
  /** Function to get texture/color for an activity */
  getActivityTexture?: (activity: Activity) => ActivityTexture | undefined;
  /** Function to get display title for an activity */
  getActivityTitle?: (activity: Activity) => string;
  /** Function to get grammar chip copy for an activity */
  getGrammarChipCopy?: (activity: Activity) => { friendlyTitle: string; useThisFor: string } | null;
  /** Optional "See all" click handler */
  onSeeAll?: () => void;
  /** Whether this is a grammar section (enables timeline diagrams) */
  isGrammarSection?: boolean;
}

/**
 * ActivityCarousel - Horizontal scrolling card layout for activities.
 * Shows timeline diagrams for grammar tenses and learning outcome descriptions.
 */
export function ActivityCarousel({
  sectionTitle,
  activities,
  completedActivityIds = new Set(),
  progressMap = {},
  getActivityTexture,
  getActivityTitle,
  getGrammarChipCopy,
  onSeeAll,
  isGrammarSection = false,
}: ActivityCarouselProps) {
  const subtitle = getSubcategorySubtitle(sectionTitle);

  if (activities.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Section Header - Dual line with grammatical term + descriptive subtitle */}
      <div className="flex items-end justify-between mb-3 px-1">
        <div>
          <div
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-color-muted)' }}
          >
            {sectionTitle}
          </div>
          {subtitle && (
            <div
              className="text-base font-semibold mt-0.5"
              style={{ color: 'var(--text-color)' }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
          >
            See all
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="activity-carousel">
        {activities.map((activity) => {
          const isCompleted = completedActivityIds.has(activity.id);
          const progress = progressMap[activity.id]?.progress ?? 0;
          const hasProgress = progress > 0 && progress < 100;
          const texture = getActivityTexture?.(activity);
          const displayTitle = getActivityTitle?.(activity) ?? activity.title;
          const grammarCopy = getGrammarChipCopy?.(activity);
          const hasGrammarVisual = isGrammarSection ? hasGrammarGuideVisual(activity.title) : false;

          return (
            <ActivityLink
              key={activity.id}
              activityId={activity.id}
              className="activity-carousel-card block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-2xl"
            >
              <div
                className={`relative rounded-2xl border bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] h-full
                  ${isCompleted
                    ? 'border-secondary/30 bg-secondary/[0.02]'
                    : hasProgress
                      ? 'border-primary/30'
                      : 'border-border-subtle hover:border-primary/40'
                  }`}
                style={{
                  borderTopWidth: '3px',
                  borderTopColor: isCompleted
                    ? 'var(--secondary-color)'
                    : texture?.color ?? 'var(--primary-color)',
                }}
              >
                {/* Texture gradient background */}
                {texture && !isCompleted && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{ background: texture.gradient }}
                  />
                )}

                {/* Completed state background */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-secondary/[0.04] pointer-events-none" />
                )}

                {/* Card Content */}
                <div className="relative z-10 p-4 flex flex-col h-full min-h-[160px]">
                  {/* Top row: Tense badge + completion check */}
                  <div className="flex items-start justify-between mb-2">
                    {/* Tense/Type badge */}
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        backgroundColor: isCompleted
                          ? 'rgba(123, 168, 132, 0.12)'
                          : `${texture?.color ?? '#d97757'}14`,
                        color: isCompleted
                          ? 'var(--secondary-color)'
                          : texture?.color ?? '#d97757',
                      }}
                    >
                      {(() => {
                        const shortened = displayTitle.replace(/ Guide$/i, '').replace(/ Review$/i, '');
                        return shortened === 'Cycle 1' ? 'Cycle 1 Review' : shortened;
                      })()}
                    </span>

                    {/* Completion checkmark */}
                    {isCompleted && (
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shadow-sm flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Timeline diagram for tense guides */}
                  {hasGrammarVisual && (
                    <div className="mb-2 -mx-1">
                      <GrammarGuideVisual title={activity.title} isCompleted={isCompleted} />
                    </div>
                  )}

                  {/* Learning outcome / description - PRIMARY FOCUS */}
                  <div className="flex-1">
                    {grammarCopy ? (
                      <>
                        <p
                          className="text-sm font-semibold leading-snug mb-1"
                          style={{ color: isCompleted ? 'var(--secondary-color)' : 'var(--text-color)' }}
                        >
                          {grammarCopy.friendlyTitle}
                        </p>
                        <p
                          className="text-xs leading-relaxed pl-4 relative"
                          style={{ color: 'var(--text-color-muted)' }}
                        >
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-[0.45rem] block h-px w-2.5"
                            style={{ backgroundColor: 'currentColor', opacity: 0.45 }}
                          />
                          {grammarCopy.useThisFor}
                        </p>
                      </>
                    ) : activity.description ? (
                      <p
                        className="text-sm font-medium leading-snug"
                        style={{ color: isCompleted ? 'var(--secondary-color)' : 'var(--text-color)' }}
                      >
                        {activity.description.length > 80
                          ? `${activity.description.slice(0, 80)}...`
                          : activity.description}
                      </p>
                    ) : (
                      <p
                        className="text-sm font-medium leading-snug"
                        style={{ color: isCompleted ? 'var(--secondary-color)' : 'var(--text-color)' }}
                      >
                        {displayTitle}
                      </p>
                    )}
                  </div>

                  {/* Bottom row: Progress / Points */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle/50">
                    {/* Progress indicator */}
                    {isCompleted ? (
                      <span className="text-[11px] font-semibold text-secondary">
                        Completed
                      </span>
                    ) : hasProgress ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: texture?.color ?? 'var(--primary-color)',
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-text-muted">
                          {progress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-text-muted">
                        Not started
                      </span>
                    )}

                    {/* Points badge (only show if not completed) */}
                    {!isCompleted && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: 'rgba(244, 211, 94, 0.15)',
                          color: '#92400e',
                        }}
                      >
                        +10 pts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ActivityLink>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ActivityCarouselSection - A section header with dual-line title.
 * Use this separately if you want more control over the layout.
 */
export function ActivityCarouselHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  const subtitle = getSubcategorySubtitle(title);

  return (
    <div className="flex items-end justify-between mb-3 px-1">
      <div>
        <div
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: 'var(--text-color-muted)' }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className="text-base font-semibold mt-0.5"
            style={{ color: 'var(--text-color)' }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="text-xs font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
        >
          See all
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
