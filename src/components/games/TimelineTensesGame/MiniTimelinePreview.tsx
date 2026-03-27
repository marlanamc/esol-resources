'use client';

import type { TimelineElement } from '@/types/activity';
import { TimelineCanvas } from './TimelineCanvas';
import { elementsUseSplitPast } from './timelineTensesUtils';

interface MiniTimelinePreviewProps {
  elements: TimelineElement[];
  className?: string;
}

/**
 * A read-only timeline rendered at ~40% scale inside a fixed-size container.
 * Used on option cards in ContextTenseExercise.
 */
export function MiniTimelinePreview({ elements, className = '' }: MiniTimelinePreviewProps) {
  const useSplit = elementsUseSplitPast(elements);

  return (
    <div
      className={`overflow-hidden pointer-events-none ${className}`}
      style={{ height: 44 }}
      aria-hidden="true"
    >
      <div
        style={{
          transform: 'scale(0.42)',
          transformOrigin: 'top left',
          width: `${100 / 0.42}%`,
        }}
      >
        <TimelineCanvas
          elements={elements}
          interactive={false}
          showLabels={false}
          pastTimelineLayout={useSplit ? 'split' : 'single'}
        />
      </div>
    </div>
  );
}
