import { ClipboardCheck } from 'lucide-react';

/**
 * Inline completion chip sized to sit in a text row next to points and streak.
 * Always labeled: an icon-only button was taller than the row (misaligning the
 * learner's name) and hid its meaning behind a tap.
 */
export function WeeklyQuizBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-sm font-semibold leading-none text-violet-700 dark:text-violet-300"
      title="Finished this week's quiz"
    >
      <ClipboardCheck size={14} aria-hidden="true" />
      <span>Quiz done</span>
    </span>
  );
}
