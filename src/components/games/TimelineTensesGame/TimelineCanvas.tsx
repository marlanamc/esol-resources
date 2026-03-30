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
  resolveTimelineConnectionPartner,
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
  { fillClass: string; strokeClass: string }
> = {
  past: { fillClass: 'fill-amber-600 dark:fill-amber-500', strokeClass: 'stroke-amber-700 dark:stroke-amber-400' },
  'past-earlier': { fillClass: 'fill-orange-700 dark:fill-orange-500', strokeClass: 'stroke-orange-800 dark:stroke-orange-400' },
  'past-later': { fillClass: 'fill-amber-600 dark:fill-amber-500', strokeClass: 'stroke-amber-700 dark:stroke-amber-400' },
  present: { fillClass: 'fill-emerald-600 dark:fill-emerald-500', strokeClass: 'stroke-emerald-700 dark:stroke-emerald-400' },
  future: { fillClass: 'fill-blue-600 dark:fill-blue-500', strokeClass: 'stroke-blue-700 dark:stroke-blue-400' },
  axis: { fillClass: '', strokeClass: '' },
  nowMarker: { fillClass: '', strokeClass: '' },
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
    const DURATION_LINE_HALF_LENGTH = 30;
    const SINGLE_DOT_RADIUS = 8;

    const pastLayout: PastTimelineLayout = useMemo(() => {
      if (pastLayoutProp) {
        return pastLayoutProp;
      }
      return elementsUseSplitPast(elements) ? 'split' : 'single';
    }, [pastLayoutProp, elements]);

    const getElementX = (element: TimelineElement) =>
      getTimelineElementX(element, pastLayout);

    const renderedElementXMap = useMemo(() => {
      const map = new Map<string, number>();
      const baseXMap = new Map<string, number>();

      for (const element of elements) {
        const baseX = getTimelineElementX(element, pastLayout);
        baseXMap.set(element.id, baseX);
        map.set(element.id, baseX);
      }

      for (const element of elements) {
        if (element.type !== 'single-dot') {
          continue;
        }

        const dotBaseX = baseXMap.get(element.id) ?? getTimelineElementX(element, pastLayout);
        const durationPeers = elements.filter(
          (peer) =>
            peer.zone === element.zone &&
            (peer.type === 'solid-line' || peer.type === 'dashed-line')
        );

        if (durationPeers.length === 0) {
          continue;
        }

        const nearestDuration = durationPeers.reduce((closest, peer) => {
          const peerX = baseXMap.get(peer.id) ?? getTimelineElementX(peer, pastLayout);
          const closestX = baseXMap.get(closest.id) ?? getTimelineElementX(closest, pastLayout);
          return Math.abs(peerX - dotBaseX) < Math.abs(closestX - dotBaseX) ? peer : closest;
        });

        const durationX =
          baseXMap.get(nearestDuration.id) ?? getTimelineElementX(nearestDuration, pastLayout);
        const direction = dotBaseX >= durationX ? 1 : -1;
        const touchingX =
          durationX + direction * (DURATION_LINE_HALF_LENGTH + SINGLE_DOT_RADIUS);

        map.set(element.id, touchingX);
      }

      if (showLabels) {
        const overlapGroups = new Map<string, TimelineElement[]>();
        const stackableTypes = new Set([
          'multiple-dots',
          'single-dot',
          'solid-line',
          'dashed-line',
        ]);

        for (const element of elements) {
          if (!element.verbLabel || !stackableTypes.has(element.type)) {
            continue;
          }

          const currentX = map.get(element.id) ?? baseXMap.get(element.id);
          if (currentX === undefined) {
            continue;
          }

          const groupKey = `${element.type}:${element.zone}:${Math.round(currentX)}`;
          const existingGroup = overlapGroups.get(groupKey) ?? [];
          existingGroup.push(element);
          overlapGroups.set(groupKey, existingGroup);
        }

        for (const group of overlapGroups.values()) {
          if (group.length <= 1) {
            continue;
          }

          const orderedGroup = [...group].sort((a, b) => a.id.localeCompare(b.id));
          const centerX =
            orderedGroup.reduce(
              (sum, element) => sum + (map.get(element.id) ?? baseXMap.get(element.id) ?? 0),
              0
            ) / orderedGroup.length;
          const gap = orderedGroup[0]?.type === 'multiple-dots' ? 30 : 20;
          const centerIndex = (orderedGroup.length - 1) / 2;

          orderedGroup.forEach((element, index) => {
            map.set(element.id, centerX + (index - centerIndex) * gap);
          });
        }
      }

      return map;
    }, [elements, pastLayout, showLabels]);

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
        className={`w-full max-w-2xl mx-auto ${className}`}
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
                rx={12}
                className="fill-orange-100/60 dark:fill-orange-900/20 transition-colors duration-300"
              />
              <rect
                x={PAST_LATER_SPLIT.start - 4}
                y={12}
                width={NOW_POSITION - PAST_LATER_SPLIT.start - 6}
                height={56}
                rx={12}
                className="fill-amber-100/40 dark:fill-amber-900/10 transition-colors duration-300"
              />
            </>
          ) : (
            <rect
              x={PAST_SINGLE.start - 4}
              y={12}
              width={NOW_POSITION - PAST_SINGLE.start - 6}
              height={56}
              rx={12}
              className="fill-amber-100/40 dark:fill-amber-900/15 transition-colors duration-300"
            />
          )}

          <rect
            x={FUTURE_ZONE.start - 4}
            y={12}
            width={FUTURE_ZONE.end - FUTURE_ZONE.start + 8}
            height={56}
            rx={12}
            className="fill-blue-100/40 dark:fill-blue-900/15 transition-colors duration-300"
          />

          <rect
            x={NOW_POSITION - 14}
            y={12}
            width={32}
            height={56}
            rx={10}
            className="fill-emerald-100/50 dark:fill-emerald-900/20 transition-colors duration-300"
          />
        </g>

        {/* 2. Highlight Overlay */}
        {highlightZone && highlightGeom && (
          <rect
            x={highlightGeom.x}
            y={10}
            width={highlightGeom.width}
            height={60}
            rx={10}
            className={`opacity-60 dark:opacity-40 transition-all pointer-events-none
              ${highlightZone === 'present' ? 'fill-emerald-300 dark:fill-emerald-700' : ''}
              ${highlightZone === 'future' ? 'fill-blue-300 dark:fill-blue-700' : ''}
              ${highlightZone === 'past' ? 'fill-amber-300 dark:fill-amber-700' : ''}
              ${highlightZone === 'past-earlier' ? 'fill-orange-300 dark:fill-orange-700' : ''}
              ${highlightZone === 'past-later' ? 'fill-amber-300 dark:fill-amber-700' : ''}
            `}
          />
        )}

        {/* 3. Axis and NOW Marker */}
        <line
          x1={10}
          y1={AXIS_Y}
          x2={TIMELINE_WIDTH - 10}
          y2={AXIS_Y}
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-slate-300 dark:stroke-slate-700 transition-colors duration-300"
        />

        {/* Glow underneath now marker for emphasis */}
        <line
          x1={NOW_POSITION}
          y1={AXIS_Y - 20}
          x2={NOW_POSITION}
          y2={AXIS_Y + 20}
          strokeWidth={10}
          strokeLinecap="round"
          className="stroke-emerald-400 dark:stroke-emerald-600 opacity-20 blur-sm mix-blend-screen"
        />
        <line
          x1={NOW_POSITION}
          y1={AXIS_Y - 20}
          x2={NOW_POSITION}
          y2={AXIS_Y + 20}
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-emerald-500 dark:stroke-emerald-400 transition-colors duration-300"
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
                  RECENT
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
          const partner = resolveTimelineConnectionPartner(element, elements, pastLayout);
          if (partner) {
            arcTargetX =
              renderedElementXMap.get((partner as TimelineElement).id) ??
              getElementX(partner as TimelineElement);
          }

          let yOffset = 0;
          // Offset durations vertically if they share a zone, avoiding direct overlap constraint
          if (element.type === 'solid-line' || element.type === 'dashed-line') {
            const peers = elements.filter(
              (e) => e.zone === element.zone && (e.type === 'solid-line' || e.type === 'dashed-line')
            );
            if (peers.length > 1) {
              const sorted = [...peers].sort((a, b) => a.id.localeCompare(b.id));
              const idx = sorted.findIndex((e) => e.id === element.id);
              // Distribute strictly ABOVE the axis line so they don't overlap the zone text labels below
              const offsets = [-24, -12, -36, -8];
              yOffset = offsets[idx % offsets.length] || 0;
            }
          }

          return (
            <TimelineElementComponent
              key={element.id}
              element={element}
              x={renderedElementXMap.get(element.id) ?? getElementX(element)}
              y={AXIS_Y + yOffset}
              colors={colorsForElement(element.zone)}
              showLabel={showLabels}
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
