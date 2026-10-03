'use client';

import { useId, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';

/** Compact completion recognition, with a label available on touch and keyboard. */
export function WeeklyQuizBadge() {
  const [expanded, setExpanded] = useState(false);
  const labelId = useId();

  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <button
        type="button"
        className="group inline-flex min-h-8 min-w-8 shrink-0 items-center justify-center rounded-full text-violet-700 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:text-violet-300 dark:hover:bg-violet-950"
        aria-label="Weekly quiz complete"
        aria-expanded={expanded}
        aria-controls={labelId}
        title="Weekly quiz complete"
        onClick={() => setExpanded(value => !value)}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950">
          <ClipboardCheck size={14} aria-hidden="true" />
        </span>
      </button>
      <span id={labelId} hidden={!expanded} className="text-xs font-semibold text-violet-700 dark:text-violet-300">
        Weekly quiz complete
      </span>
    </span>
  );
}
