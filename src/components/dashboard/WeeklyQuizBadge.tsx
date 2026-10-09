import { ClipboardCheck } from 'lucide-react';

/**
 * Inline completion chip sized to sit in a text row next to points and streak.
 * Always labeled: an icon-only button was taller than the row (misaligning the
 * learner's name) and hid its meaning behind a tap.
 *
 * `compact` matches the 11px points line on the narrow mobile podium cards so
 * the label stays on one line.
 */
export function WeeklyQuizBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-semibold leading-none text-violet-700 dark:text-violet-300 ${
        compact ? 'gap-0.5 text-[11px]' : 'gap-1 text-sm'
      }`}
      title="Finished this week's quiz"
    >
      <ClipboardCheck size={compact ? 12 : 14} aria-hidden="true" />
      <span>Quiz done</span>
    </span>
  );
}
