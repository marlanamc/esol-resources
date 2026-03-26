'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { TimelineElementType, TimelineZone } from '@/types/activity';
import { StampPreview } from './TimelineElement';

interface PlacedStamp {
  id: string;
  type: TimelineElementType;
  zone: TimelineZone;
}

interface StampToolkitProps {
  selectedStamp: TimelineElementType | null;
  onSelectStamp: (type: TimelineElementType | null) => void;
  placedStamps: PlacedStamp[];
  onRemoveStamp: (id: string) => void;
}

/**
 * Simplified stamp system: Zone + Shape = Tense
 *
 * Students think about WHAT happened, not which grammar tense.
 * The zone (where they place it) + the shape = the meaning.
 *
 * For Past Perfect / Past Perfect Continuous:
 * Draw mode always uses EARLIER vs LATER past taps (orange never touches NOW on
 * the line). Grading still accepts either tap as plain “past” unless the answer
 * requires a specific sub-zone (past perfect).
 */
const STAMPS: Array<{
  type: TimelineElementType;
  label: string;
  description: string;
  shortcut: string;
}> = [
  {
    type: 'single-dot',
    label: 'Moment',
    description: 'One event (or a reference point)',
    shortcut: '1',
  },
  {
    type: 'multiple-dots',
    label: 'Habit/Fact',
    description: 'Repeated actions or routines',
    shortcut: '2',
  },
  {
    type: 'solid-line',
    label: 'Duration',
    description: 'Action happening over time',
    shortcut: '3',
  },
  {
    type: 'arc',
    label: 'Link',
    description: 'Links an event to another event (or to NOW)',
    shortcut: '4',
  },
  {
    type: 'solid-to-now',
    label: 'Link with Duration',
    description: 'Ongoing action that links to another event (or NOW)',
    shortcut: '5',
  },
];

export function StampToolkit({
  selectedStamp,
  onSelectStamp,
  placedStamps,
  onRemoveStamp,
}: StampToolkitProps) {
  // Handle keyboard shortcuts for stamp selection
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;
      const stampIndex = parseInt(key, 10) - 1;

      if (stampIndex >= 0 && stampIndex < STAMPS.length) {
        e.preventDefault();
        const stamp = STAMPS[stampIndex];
        onSelectStamp(selectedStamp === stamp.type ? null : stamp.type);
      }

      // Escape to deselect
      if (e.key === 'Escape' && selectedStamp) {
        e.preventDefault();
        onSelectStamp(null);
      }
    },
    [onSelectStamp, selectedStamp]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="text-center min-h-[1.75rem] flex flex-col justify-end pb-1">
        {selectedStamp ? (
          <p className="text-sm font-medium text-primary dark:text-primary/90 font-semibold">
            {STAMPS.find(s => s.type === selectedStamp)?.description}
          </p>
        ) : null}
      </div>

      {/* Stamp grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {STAMPS.map((stamp) => (
          <motion.div
            key={stamp.type}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <StampPreview
              type={stamp.type}
              label={stamp.label}
              shortcut={stamp.shortcut}
              selected={selectedStamp === stamp.type}
              onClick={() =>
                onSelectStamp(selectedStamp === stamp.type ? null : stamp.type)
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Placed stamps (removable) */}
      {placedStamps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm font-semibold text-text-muted mb-2">
            Placed on timeline:
          </div>
          <div className="flex flex-wrap gap-2">
            {placedStamps.map((stamp) => {
              const stampDef = STAMPS.find((s) => s.type === stamp.type);
              const zoneColors: Record<TimelineZone, string> = {
                past: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
                'past-earlier':
                  'bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
                'past-later':
                  'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
                present: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
                future: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
              };

              return (
                <motion.button
                  key={stamp.id}
                  onClick={() => onRemoveStamp(stamp.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium flex items-center gap-2 ${
                    zoneColors[stamp.zone]
                  }`}
                >
                  <span>{stampDef?.label || stamp.type}</span>
                  <span className="text-xs opacity-60">({stamp.zone})</span>
                  <span className="ml-1 opacity-60 hover:opacity-100">×</span>
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-text-muted mt-2">
            Tap a stamp to remove it
          </p>
        </div>
      )}
    </div>
  );
}
