'use client';

import type { TimelineElement, TimelineElementType } from '@/types/activity';
import {
  PAST_TIMELINE_END,
  TIMELINE_NOW_X,
} from './timelineTensesUtils';

interface ElementColors {
  fillClass: string;
  strokeClass: string;
}

interface TimelineElementComponentProps {
  element: TimelineElement;
  x: number;
  y: number;
  colors: ElementColors;
  showLabel?: boolean;
  /** Target X coordinate for arc elements to connect to (instead of NOW) */
  arcTargetX?: number;
}

// Render different element types as SVG
export function TimelineElementComponent({
  element,
  x,
  y,
  colors,
  showLabel = false,
  arcTargetX,
}: TimelineElementComponentProps) {
  const renderElement = () => {
    switch (element.type) {
      case 'single-dot':
        return <circle cx={x} cy={y} r={8} className={colors.fillClass} />;

      case 'multiple-dots':
        // Three dots representing repeated action
        return (
          <g>
            <circle cx={x - 20} cy={y} r={5} className={`${colors.fillClass} opacity-70`} />
            <circle cx={x} cy={y} r={6} className={colors.fillClass} />
            <circle cx={x + 20} cy={y} r={5} className={`${colors.fillClass} opacity-70`} />
          </g>
        );

      case 'solid-line':
        // Thick line representing duration
        return (
          <line
            x1={x - 30}
            y1={y}
            x2={x + 30}
            y2={y}
            className={colors.strokeClass}
            strokeWidth={8}
            strokeLinecap="round"
          />
        );

      case 'dashed-line':
        // Dashed line representing uncertain/future duration
        return (
          <line
            x1={x - 30}
            y1={y}
            x2={x + 30}
            y2={y}
            className={colors.strokeClass}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="8 6"
          />
        );

      case 'arc': {
        // Partner dot → arc ends on the dot (no cap). No partner: past-earlier ends
        // at the past boundary (not NOW); past-later / past → Present Perfect style to NOW.
        const nowX = TIMELINE_NOW_X;
        const arcStartX = x;
        const hasPartner = arcTargetX !== undefined;
        const arcEndX = hasPartner
          ? arcTargetX
          : element.zone === 'past-earlier'
            ? PAST_TIMELINE_END
            : nowX;
        const arcMidX = (arcStartX + arcEndX) / 2;
        const arcCurveHeight = Math.min(30, Math.abs(arcEndX - arcStartX) / 4);
        const endsAtNow = !hasPartner && arcEndX === nowX;
        return (
          <g>
            <circle cx={arcStartX} cy={y} r={6} className={colors.fillClass} />
            <path
              d={`M ${arcStartX} ${y} Q ${arcMidX} ${y - arcCurveHeight} ${arcEndX} ${y}`}
              fill="none"
              className={colors.strokeClass}
              strokeWidth={4}
            />
            {hasPartner ? null : endsAtNow ? (
              <circle cx={arcEndX} cy={y} r={7} className="fill-emerald-600 dark:fill-emerald-400" />
            ) : (
              <circle cx={arcEndX} cy={y} r={6} className={`${colors.fillClass} ${colors.strokeClass}`} strokeWidth={2} />
            )}
          </g>
        );
      }

      case 'arc-dashed':
        // Dashed arc for future perfect (from NOW to future position)
        const futureNowX = TIMELINE_NOW_X;
        const dashedArcStartX = futureNowX;
        const dashedArcEndX = x;
        const dashedArcMidX = (dashedArcStartX + dashedArcEndX) / 2;
        const dashedArcCurveHeight = Math.min(30, Math.abs(dashedArcEndX - dashedArcStartX) / 4);
        return (
          <g>
            <circle cx={dashedArcStartX} cy={y} r={6} className="fill-emerald-600 dark:fill-emerald-400" />
            <path
              d={`M ${dashedArcStartX} ${y} Q ${dashedArcMidX} ${y - dashedArcCurveHeight} ${dashedArcEndX} ${y}`}
              fill="none"
              className={colors.strokeClass}
              strokeWidth={4}
              strokeDasharray="6 4"
            />
            <circle cx={dashedArcEndX} cy={y} r={7} className={colors.fillClass} />
          </g>
        );

      case 'solid-to-now': {
        const solidNowX = TIMELINE_NOW_X;
        const hasPartner = arcTargetX !== undefined;
        const solidEndX = hasPartner
          ? arcTargetX
          : element.zone === 'past-earlier'
            ? PAST_TIMELINE_END
            : solidNowX;
        const solidMidX = (x + solidEndX) / 2;
        const solidCurveHeight = Math.min(25, Math.abs(solidEndX - x) / 5);
        const endsAtNow = !hasPartner && solidEndX === solidNowX;
        return (
          <g>
            <circle cx={x} cy={y} r={6} className={colors.fillClass} />
            <path
              d={`M ${x} ${y} Q ${solidMidX} ${y - solidCurveHeight} ${solidEndX} ${y}`}
              fill="none"
              className={colors.strokeClass}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
            {hasPartner ? null : endsAtNow ? (
              <circle cx={solidEndX} cy={y} r={7} className="fill-emerald-600 dark:fill-emerald-400" />
            ) : (
              <circle cx={solidEndX} cy={y} r={6} className={`${colors.fillClass} ${colors.strokeClass}`} strokeWidth={2} />
            )}
          </g>
        );
      }

      case 'solid-to-point': {
        const solidPointNowX = TIMELINE_NOW_X;
        const hasPartnerPt = arcTargetX !== undefined;
        const solidPointEndX = hasPartnerPt
          ? arcTargetX
          : element.zone === 'past-earlier'
            ? PAST_TIMELINE_END
            : solidPointNowX;
        const solidPointMidX = (x + solidPointEndX) / 2;
        const solidPointCurveHeight = Math.min(25, Math.abs(solidPointEndX - x) / 5);
        return (
          <g>
            <circle cx={x} cy={y} r={6} className={colors.fillClass} />
            <path
              d={`M ${x} ${y} Q ${solidPointMidX} ${y - solidPointCurveHeight} ${solidPointEndX} ${y}`}
              fill="none"
              className={colors.strokeClass}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
            {hasPartnerPt ? null : (
              <circle
                cx={solidPointEndX}
                cy={y}
                r={6}
                className={`${colors.fillClass} ${colors.strokeClass}`}
                strokeWidth={2}
              />
            )}
          </g>
        );
      }

      default:
        return <circle cx={x} cy={y} r={6} className={colors.fillClass} />;
    }
  };

  return (
    <g>
      {renderElement()}
      {showLabel && element.verbLabel && (
        <text
          x={x}
          y={y - 20}
          textAnchor="middle"
          className={`${colors.fillClass.replace(/fill-/g, 'text-')} text-xs font-semibold`}
          style={{ fontSize: '11px', fontWeight: 600 }}
        >
          {element.verbLabel}
        </text>
      )}
    </g>
  );
}

// Stamp preview for toolkit
interface StampPreviewProps {
  type: TimelineElementType;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  /** Keyboard shortcut key (e.g., "1", "2") */
  shortcut?: string;
}

export function StampPreview({
  type,
  label,
  selected = false,
  onClick,
  shortcut,
}: StampPreviewProps) {
  const getPreviewSVG = () => {
    const baseColor = 'currentColor';

    switch (type) {
      case 'single-dot':
        return <circle cx={20} cy={15} r={6} fill={baseColor} />;
      case 'multiple-dots':
        return (
          <g>
            <circle cx={8} cy={15} r={4} fill={baseColor} opacity={0.6} />
            <circle cx={20} cy={15} r={5} fill={baseColor} />
            <circle cx={32} cy={15} r={4} fill={baseColor} opacity={0.6} />
          </g>
        );
      case 'solid-line':
        return (
          <line
            x1={5}
            y1={15}
            x2={35}
            y2={15}
            stroke={baseColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="8 6"
          />
        );
      case 'dashed-line':
        return (
          <line
            x1={5}
            y1={15}
            x2={35}
            y2={15}
            stroke={baseColor}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        );
      case 'arc':
        return (
          <g>
            <circle cx={8} cy={15} r={4} fill={baseColor} />
            <path
              d="M 8 15 Q 20 3 32 15"
              fill="none"
              stroke={baseColor}
              strokeWidth={3}
            />
            <circle cx={32} cy={15} r={5} fill={baseColor} />
          </g>
        );
      case 'arc-dashed':
        return (
          <g>
            <circle cx={8} cy={15} r={4} fill={baseColor} />
            <path
              d="M 8 15 Q 20 3 32 15"
              fill="none"
              stroke={baseColor}
              strokeWidth={3}
              strokeDasharray="4 3"
            />
            <circle cx={32} cy={15} r={5} fill={baseColor} />
          </g>
        );
      case 'solid-to-now':
        // Thick line curving to NOW - shows duration connecting to present
        return (
          <g>
            <circle cx={5} cy={15} r={4} fill={baseColor} />
            <path
              d="M 5 15 Q 18 5 32 15"
              fill="none"
              stroke={baseColor}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="5 4"
            />
            <circle cx={32} cy={15} r={5} fill={baseColor} />
          </g>
        );
      case 'solid-to-point':
        // Thick line curving to a point - shows duration before reference
        return (
          <g>
            <circle cx={5} cy={15} r={4} fill={baseColor} />
            <path
              d="M 5 15 Q 18 5 32 15"
              fill="none"
              stroke={baseColor}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="5 4"
            />
            <circle cx={32} cy={15} r={5} fill={baseColor} />
          </g>
        );
      default:
        return <circle cx={20} cy={15} r={6} fill={baseColor} />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all relative w-full h-full gap-2 ${
        selected
          ? 'border-primary bg-primary/10 shadow-md text-primary scale-100'
          : 'border-border hover:border-primary/50 hover:bg-surface-elevated text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 scale-[0.98]'
      }`}
    >
      {/* Keyboard shortcut badge */}
      {shortcut && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded bg-border/40 text-text-muted text-[10px] font-mono flex items-center justify-center">
          {shortcut}
        </span>
      )}
      <svg viewBox="0 0 40 30" className="w-10 h-8 flex-shrink-0 mt-1">
        {getPreviewSVG()}
      </svg>
      <div className="text-center">
        <div className="text-[11px] sm:text-xs font-bold leading-tight uppercase tracking-wider">{label}</div>
      </div>
    </button>
  );
}
