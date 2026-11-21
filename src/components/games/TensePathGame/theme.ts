import type { TensePathWorldId } from '@/lib/tense-path/levels';

/**
 * Each world takes the color of its timeline zone, so the map reads like the
 * stamps: present = green NOW, past = amber, future = blue, earlier past = orange.
 */
export const WORLD_THEME: Record<
  TensePathWorldId,
  { badge: string; number: string; dashed: string; solid: string; ring: string }
> = {
  present: {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    number: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    dashed: 'border-emerald-300! dark:border-emerald-700!',
    solid: 'bg-emerald-700 text-white',
    ring: 'text-emerald-800 dark:text-emerald-200',
  },
  past: {
    badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
    number: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200',
    dashed: 'border-amber-300! dark:border-amber-700!',
    solid: 'bg-amber-700 text-white',
    ring: 'text-amber-900 dark:text-amber-200',
  },
  future: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    number: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    dashed: 'border-blue-300! dark:border-blue-700!',
    solid: 'bg-blue-700 text-white',
    ring: 'text-blue-800 dark:text-blue-200',
  },
  'past-to-now': {
    badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
    number: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200',
    dashed: 'border-amber-300! dark:border-amber-700!',
    solid: 'bg-amber-700 text-white',
    ring: 'text-amber-900 dark:text-amber-200',
  },
  'before-and-by': {
    badge: 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200',
    number: 'bg-orange-100 text-orange-900 dark:bg-orange-900/50 dark:text-orange-200',
    dashed: 'border-orange-300! dark:border-orange-700!',
    solid: 'bg-orange-700 text-white',
    ring: 'text-orange-900 dark:text-orange-200',
  },
};

/** Surfaces shared with the other pattern games. */
export const SURFACE = 'bg-white dark:bg-[#162b3d] border border-border dark:border-white/10';
export const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-primary! text-white! font-bold hover:bg-primary-dark! transition-colors disabled:opacity-60';
