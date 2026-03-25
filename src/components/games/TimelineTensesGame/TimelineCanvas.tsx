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
      if (highlightZone === 'present') {
        return { x: NOW_POSITION - 15, width: 30 };
      }
      if (highlightZone === 'future') {
        return { x: FUTURE_ZONE.start - 5, width: FUTURE_ZONE.end - FUTURE_ZONE.start + 10 };
      }
      if (highlightZone === 'past') {
        return { x: PAST_SINGLE.start - 5, width: PAST_SINGLE.end - PAST_SINGLE.start + 10 };
      }
      if (highlightZone === 'past-earlier') {
        return {
          x: PAST_EARLIER_SPLIT.start - 5,
          width: PAST_EARLIER_SPLIT.end - PAST_EARLIER_SPLIT.start + 10,
        };
      }
      if (highlightZone === 'past-later') {
        return {
          x: PAST_LATER_SPLIT.start - 5,
          width: PAST_LATER_SPLIT.end - PAST_LATER_SPLIT.start + 10,
        };
      }
      return null;
    }, [highlightZone]);

    const gapMidX = (PAST_TIMELINE_END + NOW_POSITION) / 2;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${TIMELINE_WIDTH} ${TIMELINE_HEIGHT}`}
        className={`w-full max-w-lg mx-auto ${className}`}
        style={{ touchAction: 'none' }}
      >
        {/* Static zone tints — past bands stop short of NOW */}
        {pastLayout === 'split' ? (
          <>
            <rect
              x={PAST_EARLIER_SPLIT.start - 4}
              y={12}
              width={PAST_EARLIER_SPLIT.end - PAST_EARLIER_SPLIT.start + 8}
              height={56}
              rx={8}
              fill={COLORS['past-earlier'].bg}
              opacity={0.45}
            />
            <rect
              x={PAST_LATER_SPLIT.start - 4}
              y={12}
              width={PAST_LATER_SPLIT.end - PAST_LATER_SPLIT.start + 8}
              height={56}
              rx={8}
              fill={COLORS['past-later'].bg}
              opacity={0.45}
            />
          </>
        ) : (
          <rect
            x={PAST_SINGLE.start - 4}
            y={12}
            width={PAST_SINGLE.end - PAST_SINGLE.start + 8}
            height={56}
            rx={8}
            fill={COLORS.past.bg}
            opacity={0.4}
          />
        )}

        <rect
          x={FUTURE_ZONE.start - 4}
          y={12}
          width={FUTURE_ZONE.end - FUTURE_ZONE.start + 8}
          height={56}
          rx={8}
          fill={COLORS.future.bg}
          opacity={0.35}
        />

        <rect
          x={NOW_POSITION - 14}
          y={12}
          width={28}
          height={56}
          rx={6}
          fill={COLORS.present.bg}
          opacity={0.4}
        />

        {highlightZone && highlightGeom && (
          <rect
            x={highlightGeom.x}
            y={10}
            width={highlightGeom.width}
            height={60}
            rx={8}
            fill={COLORS[highlightZone].bg}
            opacity={0.5}
          />
        )}

        <line
          x1={10}
          y1={AXIS_Y}
          x2={TIMELINE_WIDTH - 10}
          y2={AXIS_Y}
          stroke={COLORS.axis.stroke}
          strokeWidth={4}
          strokeLinecap="round"
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

        {showLabels && (
          <>
            {pastLayout === 'split' ? (
              <>
                <text
                  x={(PAST_EARLIER_SPLIT.start + PAST_EARLIER_SPLIT.end) / 2}
                  y={17}
                  textAnchor="middle"
                  className="fill-amber-900 dark:fill-amber-200 text-[9px] font-bold uppercase"
                  style={{ fontSize: '9px', fontWeight: 700 }}
                >
                  Earlier
                </text>
                <text
                  x={(PAST_EARLIER_SPLIT.start + PAST_EARLIER_SPLIT.end) / 2}
                  y={27}
                  textAnchor="middle"
                  className="fill-amber-800/90 dark:fill-amber-300/90 text-[8px] font-semibold"
                  style={{ fontSize: '8px', fontWeight: 600 }}
                >
                  not tied to NOW
                </text>
                <text
                  x={(PAST_LATER_SPLIT.start + PAST_LATER_SPLIT.end) / 2}
                  y={17}
                  textAnchor="middle"
                  className="fill-amber-700 dark:fill-amber-300 text-[9px] font-bold uppercase"
                  style={{ fontSize: '9px', fontWeight: 700 }}
                >
                  Later
                </text>
                <text
                  x={(PAST_LATER_SPLIT.start + PAST_LATER_SPLIT.end) / 2}
                  y={27}
                  textAnchor="middle"
                  className="fill-amber-700/85 dark:fill-amber-400/85 text-[8px] font-semibold"
                  style={{ fontSize: '8px', fontWeight: 600 }}
                >
                  past (near NOW)
                </text>
              </>
            ) : (
              <text
                x={(PAST_SINGLE.start + PAST_SINGLE.end) / 2}
                y={20}
                textAnchor="middle"
                className="fill-amber-600 text-xs font-bold uppercase"
                style={{ fontSize: '10px', fontWeight: 700 }}
              >
                PAST
              </text>
            )}
            <text
              x={gapMidX}
              y={74}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: '7px', fontWeight: 500 }}
            >
              not now
            </text>
            <text
              x={NOW_POSITION}
              y={20}
              textAnchor="middle"
              className="fill-emerald-600 text-xs font-bold uppercase"
              style={{ fontSize: '10px', fontWeight: 700 }}
            >
              NOW
            </text>
            <text
              x={FUTURE_ZONE.start + (FUTURE_ZONE.end - FUTURE_ZONE.start) / 2}
              y={20}
              textAnchor="middle"
              className="fill-blue-600 text-xs font-bold uppercase"
              style={{ fontSize: '10px', fontWeight: 700 }}
            >
              FUTURE
            </text>
          </>
        )}

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

        {interactive && (
          <>
            {pastLayout === 'split' ? (
              <>
                <rect
                  x={PAST_EARLIER_SPLIT.start}
                  y={AXIS_Y - 15}
                  width={PAST_EARLIER_SPLIT.end - PAST_EARLIER_SPLIT.start}
                  height={30}
                  fill="transparent"
                  className="cursor-pointer"
                  data-zone="past-earlier"
                />
                <rect
                  x={PAST_LATER_SPLIT.start}
                  y={AXIS_Y - 15}
                  width={PAST_LATER_SPLIT.end - PAST_LATER_SPLIT.start}
                  height={30}
                  fill="transparent"
                  className="cursor-pointer"
                  data-zone="past-later"
                />
              </>
            ) : (
              <rect
                x={PAST_SINGLE.start}
                y={AXIS_Y - 15}
                width={PAST_SINGLE.end - PAST_SINGLE.start}
                height={30}
                fill="transparent"
                className="cursor-pointer"
                data-zone="past"
              />
            )}
            <rect
              x={FUTURE_ZONE.start}
              y={AXIS_Y - 15}
              width={FUTURE_ZONE.end - FUTURE_ZONE.start}
              height={30}
              fill="transparent"
              className="cursor-pointer"
              data-zone="future"
            />
          </>
        )}
      </svg>
    );
  }
);

export { COLORS, NOW_POSITION, TIMELINE_WIDTH, TIMELINE_HEIGHT, AXIS_Y };
