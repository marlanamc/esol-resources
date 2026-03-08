'use client';

import React, { useId } from 'react';

/**
 * Timeline position for the marker on the tense timeline.
 * - 'past': Action/event is in the past (left side)
 * - 'present': Action/event is at present (center)
 * - 'future': Action/event is in the future (right side)
 * - 'past-span': Duration wholly in the past (past continuous)
 * - 'past-to-present': Continuous from past to present
 * - 'present-to-future': Continuous from present to future
 * - 'past-to-future': Spans entire timeline
 */
export type TimelinePosition =
  | 'past'
  | 'present'
  | 'future'
  | 'past-span'
  | 'past-to-present'
  | 'present-to-future'
  | 'past-to-future';

/**
 * Visual style for the timeline marker.
 * - 'point': Single X marker (for simple tenses)
 * - 'repeating': Multiple X markers across timeline (for habitual actions, e.g. Present Simple)
 * - 'wave': Wavy/bar span (for continuous/progressive tenses)
 * - 'arrow': Arrow pointing to now (for perfect tenses)
 * - 'wave-arrow': Wave ending at arrow (for perfect continuous)
 */
export type TimelineMarkerStyle = 'point' | 'repeating' | 'wave' | 'arrow' | 'wave-arrow';

export interface TenseTimelineProps {
  /** Where to place the marker(s) on the timeline */
  position: TimelinePosition;
  /** Visual style of the marker */
  markerStyle?: TimelineMarkerStyle;
  /** Accent color for the marker (defaults to primary terracotta) */
  color?: string;
  /** Optional example sentence to show above timeline */
  example?: {
    text: string;
    highlight: string; // The verb to highlight
  };
  /** Show labels under the timeline (Past, Present, Future) */
  showLabels?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
}

/**
 * TenseTimeline - A visual timeline diagram for grammar cards.
 * Shows where actions occur in time with different marker styles
 * for different tense families.
 */
export function TenseTimeline({
  position,
  markerStyle = 'point',
  color = '#d97757',
  example,
  showLabels = true,
  size = 'sm',
  className = '',
}: TenseTimelineProps) {
  const idBase = useId().replace(/:/g, '');
  const isSmall = size === 'sm';
  const height = isSmall ? 48 : 72;
  const lineY = example ? (isSmall ? 32 : 44) : (isSmall ? 20 : 28);
  const timelineArrowId = `${idBase}-timeline-arrow`;
  const perfectArrowId = `${idBase}-perfect-arrow`;
  const perfectContinuousArrowId = `${idBase}-perfect-continuous-arrow`;

  // Calculate marker positions (percentage along timeline)
  const pastX = 15;
  const presentX = 50;
  const futureX = 85;

  // Get marker X position based on timeline position
  const getMarkerX = () => {
    switch (position) {
      case 'past':
        return pastX;
      case 'present':
        return presentX;
      case 'future':
        return futureX;
      default:
        return presentX;
    }
  };

  // Render the example sentence with highlighted verb
  const renderExample = () => {
    if (!example) return null;
    const parts = example.text.split(example.highlight);
    return (
      <div
        className={`text-center font-medium ${isSmall ? 'text-[11px]' : 'text-xs'}`}
        style={{ color: 'var(--text-color)' }}
      >
        {parts[0]}
        <span className="font-bold" style={{ color }}>{example.highlight}</span>
        {parts[1]}
      </div>
    );
  };

  // Render different marker styles
  const renderMarker = () => {
    const x = getMarkerX();

    if (markerStyle === 'point') {
      // Single X marker for simple tenses (past/future)
      return (
        <g>
          <text
            x={`${x}%`}
            y={lineY - (isSmall ? 8 : 12)}
            textAnchor="middle"
            fontSize={isSmall ? 14 : 18}
            fontWeight="bold"
            fill={color}
          >
            ✕
          </text>
        </g>
      );
    }

    if (markerStyle === 'repeating') {
      // Multiple X markers across timeline — habitual actions (e.g. "every day I read")
      const positions = [18, 30, 42, 54, 66, 78, 90];
      const size = isSmall ? 10 : 12;
      return (
        <g>
          {positions.map((px) => (
            <text
              key={px}
              x={`${px}%`}
              y={lineY - (isSmall ? 8 : 12)}
              textAnchor="middle"
              fontSize={size}
              fontWeight="bold"
              fill={color}
            >
              ✕
            </text>
          ))}
        </g>
      );
    }

    if (markerStyle === 'wave') {
      const startX = position === 'past-to-present'
        ? 24
        : position === 'past-span'
          ? pastX
          : position === 'present-to-future'
            ? presentX
            : pastX;
      const endX = position === 'past-to-present'
        ? 76
        : position === 'present-to-future'
          ? futureX
          : position === 'past-span'
            ? 35
            : futureX;
      const archPeakY = lineY - (isSmall ? 24 : 30);
      const strokeWidth = isSmall ? 3.2 : 4;
      const highlightX = position === 'past-to-present' ? startX + 8 : position === 'present-to-future' ? endX - 8 : startX + ((endX - startX) * 0.55);
      const highlightY = archPeakY - (isSmall ? 2 : 2.5);
      const dashPattern = position === 'past-to-present' ? '7,4' : position === 'present-to-future' ? '0' : '7,4';
      const supportStroke = isSmall ? 1.8 : 2.2;
      const archPath = `M ${startX} ${lineY} Q ${(startX + endX) / 2} ${archPeakY} ${endX} ${lineY}`;
      const guidePath = position === 'past-span'
        ? `M ${startX + 1} ${lineY - (isSmall ? 1.5 : 2)} Q ${(startX + endX) / 2} ${archPeakY - (isSmall ? 4 : 5)} ${endX - 1} ${lineY - (isSmall ? 1.5 : 2)}`
        : null;

      return (
        <g>
          <ellipse
            cx={`${(startX + endX) / 2}%`}
            cy={lineY - (isSmall ? 8 : 10)}
            rx={`${Math.max((endX - startX) * 0.34, 8)}%`}
            ry={isSmall ? 11 : 14}
            fill={color}
            fillOpacity={0.14}
          />

          <path
            d={archPath}
            fill="none"
            stroke="white"
            strokeOpacity={0.7}
            strokeWidth={strokeWidth + 1.8}
            strokeLinecap="round"
            strokeDasharray={dashPattern}
          />

          <path
            d={archPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={dashPattern}
          />

          {position === 'past-span' && (
            <>
              {guidePath && (
                <path
                  d={guidePath}
                  fill="none"
                  stroke={color}
                  strokeOpacity={0.2}
                  strokeWidth={supportStroke}
                  strokeLinecap="round"
                />
              )}
              <text
                x={`${highlightX}%`}
                y={highlightY}
                textAnchor="middle"
                fontSize={isSmall ? 18 : 22}
                fontWeight="bold"
                fill={color}
                stroke="white"
                strokeWidth={isSmall ? 0.7 : 0.9}
              >
                ✕
              </text>
            </>
          )}

          {position === 'past-to-present' && (
            <>
              <line
                x1={`${presentX}%`}
                y1={lineY - (isSmall ? 12 : 16)}
                x2={`${presentX}%`}
                y2={lineY + (isSmall ? 1 : 2)}
                stroke={color}
                strokeOpacity={0.48}
                strokeWidth={supportStroke}
              />
              <circle
                cx={`${presentX}%`}
                cy={archPeakY + (isSmall ? 1.5 : 2)}
                r={isSmall ? 1.7 : 2.2}
                fill={color}
              />
            </>
          )}

          {position === 'present-to-future' && (
            <>
              <path
                d={`M ${startX} ${lineY} Q ${startX + 2} ${lineY - (isSmall ? 2 : 3)} ${startX + 4} ${lineY}`}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <path
                d={`M ${startX + 1.5} ${lineY - (isSmall ? 1.5 : 2)} Q ${(startX + endX) / 2} ${archPeakY - (isSmall ? 4 : 5)} ${endX - 1} ${lineY - (isSmall ? 1.5 : 2)}`}
                fill="none"
                stroke={color}
                strokeOpacity={0.3}
                strokeWidth={supportStroke}
                strokeLinecap="round"
              />
              <path
                d={`M ${endX} ${lineY} l ${isSmall ? 1.8 : 2.2} ${isSmall ? -5 : -6.5} l ${isSmall ? 1.8 : 2.2} ${isSmall ? 5 : 6.5}`}
                fill="none"
                stroke={color}
                strokeWidth={supportStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </g>
      );
    }

    if (markerStyle === 'arrow') {
      // Perfect tenses all connect an earlier action to a reference point,
      // but the anchor and destination should feel different per tense.
      const startX = position === 'past-to-present' ? pastX : position === 'present-to-future' ? presentX : pastX;
      const endX = position === 'past-to-present' ? presentX : position === 'present-to-future' ? futureX : presentX;
      const arrowY = lineY - (isSmall ? 12 : 16);
      const haloR = isSmall ? 4.5 : 6;
      const connectorStart = startX + 3;
      const connectorEnd = endX - 3;

      return (
        <g>
          <circle
            cx={`${startX}%`}
            cy={arrowY}
            r={isSmall ? 1.9 : 2.5}
            fill={color}
            fillOpacity={0.9}
          />

          <line
            x1={`${connectorStart}%`}
            y1={arrowY}
            x2={`${connectorEnd}%`}
            y2={arrowY}
            stroke={color}
            strokeWidth={isSmall ? 1.5 : 2}
            strokeDasharray="4,2"
            markerEnd={`url(#${perfectArrowId})`}
          />

          {position === 'past-to-present' && (
            <>
              <circle
                cx={`${endX}%`}
                cy={arrowY}
                r={haloR}
                fill="white"
                fillOpacity={0.95}
              />
              <circle
                cx={`${endX}%`}
                cy={arrowY}
                r={haloR + (isSmall ? 2 : 3)}
                fill="none"
                stroke={color}
                strokeOpacity={0.24}
                strokeWidth={isSmall ? 1.5 : 2}
              />
              <path
                d={`M ${startX + 5} ${arrowY + (isSmall ? 6 : 8)} Q ${(startX + endX) / 2} ${arrowY + (isSmall ? 1.5 : 3)} ${endX - 4} ${arrowY + (isSmall ? 6 : 8)}`}
                fill="none"
                stroke={color}
                strokeOpacity={0.28}
                strokeWidth={isSmall ? 1.25 : 1.5}
                strokeLinecap="round"
              />
            </>
          )}

          {position === 'past' && (
            <>
              <line
                x1={`${endX}%`}
                y1={arrowY - (isSmall ? 5 : 7)}
                x2={`${endX}%`}
                y2={arrowY + (isSmall ? 5 : 7)}
                stroke={color}
                strokeOpacity={0.5}
                strokeWidth={isSmall ? 1.4 : 1.8}
              />
              <circle
                cx={`${startX}%`}
                cy={arrowY}
                r={haloR}
                fill="none"
                stroke={color}
                strokeOpacity={0.2}
                strokeWidth={isSmall ? 1.4 : 1.8}
              />
            </>
          )}

          {position === 'present-to-future' && (
            <>
              <rect
                x={`${startX - 1.5}%`}
                y={arrowY - (isSmall ? 4 : 5.5)}
                width="3%"
                height={isSmall ? 8 : 11}
                rx={isSmall ? 1.5 : 2}
                fill={color}
                fillOpacity={0.28}
              />
              <path
                d={`M ${startX + 4} ${arrowY + (isSmall ? 6 : 8)} Q ${(startX + endX) / 2} ${arrowY + (isSmall ? 11 : 14)} ${endX - 2} ${arrowY + (isSmall ? 4.5 : 6)}`}
                fill="none"
                stroke={color}
                strokeOpacity={0.22}
                strokeWidth={isSmall ? 1.25 : 1.5}
                strokeLinecap="round"
                strokeDasharray="2,3"
              />
            </>
          )}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id={perfectArrowId}
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill={color} />
            </marker>
          </defs>
        </g>
      );
    }

    if (markerStyle === 'wave-arrow') {
      // Wave ending at arrow for perfect continuous
      const startX = position === 'past-to-present' ? pastX : pastX;
      const endX = position === 'past-to-present' ? presentX : presentX;

      return (
        <g>
          {/* Wavy duration line */}
          <path
            d={`M ${startX}% ${lineY - 6}
                Q ${startX + 8}% ${lineY - 12}, ${startX + 16}% ${lineY - 6}
                T ${endX - 8}% ${lineY - 6}`}
            fill="none"
            stroke={color}
            strokeWidth={isSmall ? 2 : 2.5}
            strokeLinecap="round"
          />
          {/* Arrow to NOW */}
          <line
            x1={`${endX - 10}%`}
            y1={lineY - 6}
            x2={`${endX - 2}%`}
            y2={lineY - 6}
            stroke={color}
            strokeWidth={isSmall ? 1.5 : 2}
            markerEnd={`url(#${perfectContinuousArrowId})`}
          />
          <defs>
            <marker
              id={perfectContinuousArrowId}
              markerWidth="5"
              markerHeight="5"
              refX="4"
              refY="2.5"
              orient="auto"
            >
              <path d="M0,0 L5,2.5 L0,5 Z" fill={color} />
            </marker>
          </defs>
        </g>
      );
    }

    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      {renderExample()}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        {/* Main timeline arrow */}
        <defs>
          <marker
            id={timelineArrowId}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,1 L7,4 L0,7 Z" fill="var(--text-color-muted)" />
          </marker>
        </defs>

        {/* Timeline base line with arrow */}
        <line
          x1="5%"
          y1={lineY}
          x2="95%"
          y2={lineY}
          stroke="var(--text-color-muted)"
          strokeWidth="1.5"
          markerEnd={`url(#${timelineArrowId})`}
        />

        {/* Present marker (vertical line at center) */}
        <line
          x1={`${presentX}%`}
          y1={lineY - 8}
          x2={`${presentX}%`}
          y2={lineY + 8}
          stroke="var(--text-color-muted)"
          strokeWidth="1.5"
        />

        {/* Tense-specific marker */}
        {renderMarker()}

        {/* Labels */}
        {showLabels && (
          <g>
            <text
              x={`${pastX}%`}
              y={lineY + (isSmall ? 14 : 18)}
              textAnchor="middle"
              fontSize={isSmall ? 8 : 10}
              fill="var(--text-color-muted)"
              fontWeight="500"
            >
              Past
            </text>
            <text
              x={`${presentX}%`}
              y={lineY + (isSmall ? 14 : 18)}
              textAnchor="middle"
              fontSize={isSmall ? 8 : 10}
              fill="var(--text-color-muted)"
              fontWeight="500"
            >
              Now
            </text>
            <text
              x={`${futureX}%`}
              y={lineY + (isSmall ? 14 : 18)}
              textAnchor="middle"
              fontSize={isSmall ? 8 : 10}
              fill="var(--text-color-muted)"
              fontWeight="500"
            >
              Future
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Pre-configured timeline configs for each tense.
 * Use these to quickly render the appropriate timeline for a tense.
 */
export const TENSE_TIMELINE_CONFIGS: Record<string, {
  position: TimelinePosition;
  markerStyle: TimelineMarkerStyle;
  color: string;
  example?: { text: string; highlight: string };
}> = {
  // Simple tenses - single point or repeating markers
  'present-simple': {
    position: 'past-to-future',
    markerStyle: 'repeating',
    color: '#d97757',
    example: { text: 'I study English.', highlight: 'study' },
  },
  'past-simple': {
    position: 'past',
    markerStyle: 'point',
    color: '#d97757',
    example: { text: 'I studied English.', highlight: 'studied' },
  },
  'future-simple': {
    position: 'future',
    markerStyle: 'point',
    color: '#d97757',
    example: { text: 'I will study English.', highlight: 'will study' },
  },

  // Continuous tenses - solid bar spanning duration
  'present-continuous': {
    position: 'past-to-present',
    markerStyle: 'wave',
    color: '#8b5cf6',
    example: { text: 'I am studying now.', highlight: 'am studying' },
  },
  'past-continuous': {
    position: 'past-span',
    markerStyle: 'wave',
    color: '#8b5cf6',
    example: { text: 'I was studying.', highlight: 'was studying' },
  },
  'future-continuous': {
    position: 'present-to-future',
    markerStyle: 'wave',
    color: '#8b5cf6',
    example: { text: 'I will be studying.', highlight: 'will be studying' },
  },

  // Perfect tenses - arrow markers (past connects to reference point)
  'present-perfect': {
    position: 'past-to-present',
    markerStyle: 'arrow',
    color: '#7ba884',
    example: { text: 'I have studied English.', highlight: 'have studied' },
  },
  'past-perfect': {
    position: 'past',
    markerStyle: 'arrow',
    color: '#7ba884',
    example: { text: 'I had studied before.', highlight: 'had studied' },
  },
  'future-perfect': {
    position: 'present-to-future',
    markerStyle: 'arrow',
    color: '#7ba884',
    example: { text: 'I will have studied.', highlight: 'will have studied' },
  },

  // Perfect continuous - wave + arrow
  'present-perfect-continuous': {
    position: 'past-to-present',
    markerStyle: 'wave-arrow',
    color: '#8b7aa8',
    example: { text: 'I have been studying.', highlight: 'have been studying' },
  },
  'past-perfect-continuous': {
    position: 'past',
    markerStyle: 'wave-arrow',
    color: '#8b7aa8',
    example: { text: 'I had been studying.', highlight: 'had been studying' },
  },
  'future-perfect-continuous': {
    position: 'present-to-future',
    markerStyle: 'wave-arrow',
    color: '#8b7aa8',
    example: { text: 'I will have been studying.', highlight: 'will have been studying' },
  },
};

/**
 * Get the timeline config for a tense based on activity title/id.
 */
export function getTenseTimelineConfig(activityTitle: string): typeof TENSE_TIMELINE_CONFIGS[string] | null {
  const title = activityTitle.toLowerCase();

  // Check for specific tense matches
  if (title.includes('present perfect continuous')) return TENSE_TIMELINE_CONFIGS['present-perfect-continuous'];
  if (title.includes('past perfect continuous')) return TENSE_TIMELINE_CONFIGS['past-perfect-continuous'];
  if (title.includes('future perfect continuous')) return TENSE_TIMELINE_CONFIGS['future-perfect-continuous'];
  if (title.includes('present perfect')) return TENSE_TIMELINE_CONFIGS['present-perfect'];
  if (title.includes('past perfect')) return TENSE_TIMELINE_CONFIGS['past-perfect'];
  if (title.includes('future perfect')) return TENSE_TIMELINE_CONFIGS['future-perfect'];
  if (title.includes('present continuous') || title.includes('present progressive')) return TENSE_TIMELINE_CONFIGS['present-continuous'];
  if (title.includes('past continuous') || title.includes('past progressive')) return TENSE_TIMELINE_CONFIGS['past-continuous'];
  if (title.includes('future continuous') || title.includes('future progressive')) return TENSE_TIMELINE_CONFIGS['future-continuous'];
  if (title.includes('present simple')) return TENSE_TIMELINE_CONFIGS['present-simple'];
  if (title.includes('past simple')) return TENSE_TIMELINE_CONFIGS['past-simple'];
  if (title.includes('future simple') || title.includes('will') || title.includes('going to')) return TENSE_TIMELINE_CONFIGS['future-simple'];

  return null;
}
