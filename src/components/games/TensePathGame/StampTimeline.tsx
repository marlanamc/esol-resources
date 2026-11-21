'use client';

import type { TimelineElement } from '@/types/activity';
import { TimelineCanvas } from '../TimelineTensesGame/TimelineCanvas';
import { elementsUseSplitPast } from '../TimelineTensesGame/timelineTensesUtils';

interface StampTimelineProps {
  elements: TimelineElement[];
  /** Show PAST / NOW / FUTURE labels (off for small level-card previews). */
  showLabels?: boolean;
  className?: string;
}

/** Read-only stamp timeline, drawn by the same canvas as the Timeline Tenses game. */
export function StampTimeline({ elements, showLabels = true, className = '' }: StampTimelineProps) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <TimelineCanvas
        elements={elements}
        interactive={false}
        showLabels={showLabels}
        showVerbLabels={false}
        pastTimelineLayout={elementsUseSplitPast(elements) ? 'split' : 'single'}
      />
    </div>
  );
}
