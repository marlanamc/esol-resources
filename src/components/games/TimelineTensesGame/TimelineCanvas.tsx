'use client';

import { forwardRef, useMemo } from 'react';
import type { TimelineElement, TimelineZone } from '@/types/activity';
import { TimelineElementComponent } from './TimelineElement';
import {
  elementsUseSplitPast,
  getTimelineElementX,
  PAST_EARLIER_END_SPLIT,
  PAST_LATER_START_SPLIT,
  PAST_TIMELINE_END,
  PAST_TIMELINE_START,
  resolvePastConnectionPartner,
  TIMELINE_FUTURE_START,
  TIMELINE_NOW_X,
  TIMELINE_WIDTH,
  type PastTimelineLayout,
} from './timelineTensesUtils';

const TIMELINE_HEIGHT = 80;
const AXIS_Y = 50;
const NOW_POSITION = TIMELINE_NOW_X;

const FUTURE_ZONE = {
  start: TIMELINE_FUTURE_START,
  end: TIMELINE_WIDTH - 20,
};

const PAST_SINGLE = { start: PAST_TIMELINE_START, end: PAST_TIMELINE_END };
const PAST_EARLIER_SPLIT = { start: PAST_TIMELINE_START, end: PAST_EARLIER_END_SPLIT };
const PAST_LATER_SPLIT = { start: PAST_LATER_START_SPLIT, end: PAST_TIMELINE_END };

const COLORS: Record<
  Exclude<TimelineZone, never> | 'axis' | 'nowMarker',
  { fill: string; stroke: string; bg: string }
> = {
  past: { fill: '#d97706', stroke: '#b45309', bg: '#fef3c7' },
  'past-earlier': { fill: '#b45309', stroke: '#92400e', bg: '#fff7ed' },
  'past-later': { fill: '#d97706', stroke: '#b45309', bg: '#fef3c7' },
  present: { fill: '#059669', stroke: '#047857', bg: '#d1fae5' },
  future: { fill: '#2563eb', stroke: '#1d4ed8', bg: '#dbeafe' },
  axis: { fill: '#cbd5e1', stroke: '#cbd5e1', bg: '#f1f5f9' },
  nowMarker: { fill: '#059669', stroke: '#059669', bg: '#d1fae5' },
};

function colorsForElement(zone: TimelineZone) {
  return COLORS[zone] ?? COLORS.past;
}

interface TimelineCanvasProps {
  elements?: TimelineElement[];
  interactive?: boolean;
  onElementDrop?: (element: TimelineElement, zone: TimelineZone, position: number) => void;
  highlightZone?: TimelineZone | null;
  showLabels?: boolean;
  className?: string;
  /** When set, controls past band layout; otherwise inferred from element zones. */
  pastTimelineLayout?: PastTimelineLayout;
}

export const TimelineCanvas = forwardRef<SVGSVGElement, TimelineCanvasProps>(
  function TimelineCanvas(
    {
      elements = [],
      interactive = false,
      highlightZone,
      showLabels = true,
      className = '',
      pastTimelineLayout: pastLayoutProp,
    },
    ref
  ) {
    const pastLayout: PastTimelineLayout = useMemo(() => {
      if (pastLayoutProp) {
        return pastLayoutProp;
      }
      return elementsUseSplitPast(elements) ? 'split' : 'single';
    }, [pastLayoutProp, elements]);

    const getElementX = (element: TimelineElement) =>
      getTimelineElementX(element, pastLayout);

    const highlightGeom = useMemo(() => {
      if (!highlightZone) {
        return null;
      }
      const PADDING = 4;
      if (highlightZone === 'present') {
        return { x: NOW_POSITION - 14, width: 28 + PADDING * 2 };
      }
      if (highlightZone === 'future') {
        return { x: FUTURE_ZONE.start - PADDING, width: (FUTURE_ZONE.end - FUTURE_ZONE.start) + PADDING * 2 };
      }
      if (highlightZone === 'past') {
        return { x: PAST_SINGLE.start - PADDING, width: (NOW_POSITION - PAST_SINGLE.start - 6) + PADDING * 2 };
      }
      if (highlightZone === 'past-earlier') {
        return {
          x: PAST_EARLIER_SPLIT.start - PADDING,
          width: (PAST_EARLIER_SPLIT.end - PAST_EARLIER_SPLIT.start) + PADDING * 2,
        };
      }
      if (highlightZone === 'past-later') {
        return {
          x: PAST_LATER_SPLIT.start - PADDING,
          width: (NOW_POSITION - PAST_LATER_SPLIT.start - 6) + PADDING * 2,
        };
      }
      return null;
    }, [highlightZone]);

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${TIMELINE_WIDTH} ${TIMELINE_HEIGHT}`}
        className={`w-full max-w-lg mx-auto ${className}`}
        style={{ touchAction: 'none' }}
      >
        {/* 1. Zone backgrounds — Always visible, overlapping for seamless connection */}
        <g className="pointer-events-none select-none">
          {pastLayout === 'split' ? (
            <>
              <rect
                x={PAST_EARLIER_SPLIT.start - 4}
                y={12}
                width={PAST_EARLIER_SPLIT.end - PAST_EARLIER_SPLIT.start + 8}
                height={56}
                rx={8}
                fill={COLORS['past-earlier'].bg}
                className="opacity-40 dark:opacity-20"
              />
              <rect
                x={PAST_LATER_SPLIT.start - 4}
                y={12}
                width={NOW_POSITION - PAST_LATER_SPLIT.start - 6}
                height={56}
                rx={8}
                fill={COLORS['past-later'].bg}
                className="opacity-40 dark:opacity-20"
              />
            </>
          ) : (
            <rect
              x={PAST_SINGLE.start - 4}
              y={12}
              width={NOW_POSITION - PAST_SINGLE.start - 6}
              height={56}
              rx={8}
              fill={COLORS.past.bg}
              className="opacity-40 dark:opacity-20"
            />
          )}

          <rect
            x={FUTURE_ZONE.start - 4}
            y={12}
            width={FUTURE_ZONE.end - FUTURE_ZONE.start + 8}
            height={56}
            rx={8}
            fill={COLORS.future.bg}
            className="opacity-30 dark:opacity-15"
          />

          <rect
            x={NOW_POSITION - 14}
            y={12}
            width={32}
            height={56}
            rx={6}
            fill={COLORS.present.bg}
            className="opacity-40 dark:opacity-20"
          />
        </g>

        {/* 2. Highlight Overlay */}
        {highlightZone && highlightGeom && (
          <rect
            x={highlightGeom.x}
            y={10}
            width={highlightGeom.width}
            height={60}
            rx={8}
            fill={COLORS[highlightZone].bg}
            className="opacity-60 dark:opacity-40 pointer-events-none"
          />
        )}

        {/* 3. Axis and NOW Marker */}
        <line
          x1={10}
          y1={AXIS_Y}
          x2={TIMELINE_WIDTH - 10}
          y2={AXIS_Y}
          stroke={COLORS.axis.stroke}
          strokeWidth={4}
          strokeLinecap="round"
          className="opacity-60 dark:opacity-40"
        />

        <line
          x1={NOW_POSITION}
          y1={AXIS_Y - 20}
          x2={NOW_POSITION}
          y2={AXIS_Y + 20}
          stroke={COLORS.nowMarker.stroke}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* 4. Zone Labels */}
        {showLabels && (
          <g className="pointer-events-none select-none">
            {pastLayout === 'split' ? (
              <>
                <text
                  x={(PAST_EARLIER_SPLIT.start - 4 + (NOW_POSITION - 6)) / 2}
                  y={12}
                  textAnchor="middle"
                  className="fill-amber-800 dark:fill-amber-300 font-bold uppercase opacity-60"
                  style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em' }}
                >
                  PAST
                </text>
                <text
                  x={(PAST_EARLIER_SPLIT.start + PAST_EARLIER_SPLIT.end) / 2}
                  y={72}
                  textAnchor="middle"
                  className="fill-amber-800 dark:fill-amber-400 font-bold"
                  style={{ fontSize: '10px', fontWeight: 700 }}
                >
                  EARLIER
                </text>
                <text
                  x={(PAST_LATER_SPLIT.start + NOW_POSITION - 6) / 2}
                  y={72}
                  textAnchor="middle"
                  className="fill-amber-700 dark:fill-amber-400 font-bold"
                  style={{ fontSize: '10px', fontWeight: 700 }}
                >
                  LATER
                </text>
              </>
            ) : (
              <text
                x={(PAST_SINGLE.start + NOW_POSITION - 6) / 2}
                y={72}
                textAnchor="middle"
                className="fill-amber-800 dark:fill-amber-400 font-bold"
                style={{ fontSize: '12px', fontWeight: 700 }}
              >
                PAST
              </text>
            )}

            <text
              x={NOW_POSITION}
              y={12}
              textAnchor="middle"
              className="fill-emerald-700 dark:fill-emerald-400 font-bold uppercase"
              style={{ fontSize: '10px', fontWeight: 800 }}
            >
              NOW
            </text>

            <text
              x={(FUTURE_ZONE.start + FUTURE_ZONE.end) / 2}
              y={72}
              textAnchor="middle"
              className="fill-blue-700 dark:fill-blue-400 font-bold"
              style={{ fontSize: '12px', fontWeight: 700 }}
            >
              FUTURE
            </text>
          </g>
        )}

        {/* 5. Timeline Elements (Placed Stamps) */}
        {elements.map((element) => {
          let arcTargetX: number | undefined;
          const partner = resolvePastConnectionPartner(element, elements, pastLayout);
          if (partner) {
            arcTargetX = getElementX(partner as TimelineElement);
          }

          return (
            <TimelineElementComponent
              key={element.id}
              element={element}
              x={getElementX(element)}
              y={AXIS_Y}
              colors={colorsForElement(element.zone)}
              arcTargetX={arcTargetX}
            />
          );
        })}

        {/* 6. Interactive Hitboxes */}
        {interactive && (
          <g>
            {pastLayout === 'split' ? (
              <>
                <rect
                  x={PAST_EARLIER_SPLIT.start}
                  y={AXIS_Y - 25}
                  width={PAST_EARLIER_SPLIT.end - PAST_EARLIER_SPLIT.start}
                  height={50}
                  fill="transparent"
                  className="cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                />
                <rect
                  x={PAST_LATER_SPLIT.start}
                  y={AXIS_Y - 25}
                  width={NOW_POSITION - PAST_LATER_SPLIT.start - 6}
                  height={50}
                  fill="transparent"
                  className="cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                />
              </>
            ) : (
              <rect
                x={PAST_SINGLE.start}
                y={AXIS_Y - 25}
                width={NOW_POSITION - PAST_SINGLE.start - 6}
                height={50}
                fill="transparent"
                className="cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              />
            )}
            <rect
              x={NOW_POSITION - 10}
              y={AXIS_Y - 25}
              width={20}
              height={50}
              fill="transparent"
              className="cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            />
            <rect
              x={FUTURE_ZONE.start}
              y={AXIS_Y - 25}
              width={FUTURE_ZONE.end - FUTURE_ZONE.start}
              height={50}
              fill="transparent"
              className="cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            />
          </g>
        )}
      </svg>
    );
  }
);

export { COLORS, NOW_POSITION, TIMELINE_WIDTH, TIMELINE_HEIGHT, AXIS_Y };
