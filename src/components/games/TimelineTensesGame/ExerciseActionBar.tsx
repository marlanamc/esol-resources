'use client';

import type { ReactNode } from 'react';

interface ExerciseActionBarProps {
  /** The main button (Check Answer). */
  children: ReactNode;
  /** Optional helper buttons (hint, formula). They stay in the page on phones. */
  secondary?: ReactNode;
  /**
   * Pin to the bottom of the screen on phones (default). Turn off while the
   * learner is typing in a large box, so the bar never covers what they write.
   */
  pinned?: boolean;
}

/**
 * Phones: the main button is pinned to the bottom of the screen so learners
 * never have to scroll to find it; helper buttons stay in the page above it.
 * Larger screens: everything sits in one card at the end of the exercise.
 *
 * Must be a direct child of the exercise's full-height root, and that root
 * must not use `overflow-hidden` (use `overflow-x-clip`), or sticky won't work.
 */
export function ExerciseActionBar({ children, secondary, pinned = true }: ExerciseActionBarProps) {
  return (
    <>
      {secondary ? <div className="mb-3 flex flex-col gap-3 sm:hidden">{secondary}</div> : null}
      <div
        className={[
          // Phone: pinned bar that fades into the page above it.
          pinned
            ? 'sticky bottom-0 z-20 -mx-2 bg-linear-to-t from-bg from-70% to-bg/0 px-2 pt-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]'
            : 'pb-3',
          // Tablet / desktop: the original card.
          'sm:static sm:z-auto sm:mx-0 sm:rounded-[2.5rem] sm:border sm:border-white/20 sm:bg-white/40 sm:bg-none sm:p-6 sm:shadow-lg sm:backdrop-blur-xl sm:dark:bg-[#162b3d]/40',
        ].join(' ')}
      >
        {children}
        {secondary ? <div className="mt-3 hidden flex-col gap-3 sm:flex">{secondary}</div> : null}
      </div>
    </>
  );
}
