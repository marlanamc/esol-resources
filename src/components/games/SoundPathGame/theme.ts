import type { PanelTone } from '@/lib/sound-path/levels';

/**
 * Colors from the -ed Sounds game: /t/ sky, /d/ amber, /id/ violet, with the
 * violet-to-fuchsia header. The header uses the 600 shades (not the game's
 * 300/400) so white text on it is readable.
 */
export const TONE: Record<PanelTone, { card: string; text: string; chip: string; button: string }> = {
  t: {
    card: 'bg-sky-50 border border-sky-100 dark:bg-sky-900/30 dark:border-sky-800/60',
    text: 'text-sky-800 dark:text-sky-200',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
    button: 'bg-sky-100! border-sky-300! text-sky-900! hover:bg-sky-200! dark:bg-sky-900/40! dark:border-sky-700! dark:text-sky-100!',
  },
  d: {
    card: 'bg-amber-50 border border-amber-100 dark:bg-amber-900/30 dark:border-amber-800/60',
    text: 'text-amber-900 dark:text-amber-200',
    chip: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200',
    button: 'bg-amber-100! border-amber-300! text-amber-950! hover:bg-amber-200! dark:bg-amber-900/40! dark:border-amber-700! dark:text-amber-100!',
  },
  id: {
    card: 'bg-violet-50 border border-violet-100 dark:bg-violet-900/30 dark:border-violet-800/60',
    text: 'text-violet-800 dark:text-violet-200',
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
    button: 'bg-violet-100! border-violet-300! text-violet-900! hover:bg-violet-200! dark:bg-violet-900/40! dark:border-violet-700! dark:text-violet-100!',
  },
  'no-clap': {
    card: 'bg-sky-50 border border-sky-100 dark:bg-sky-900/30 dark:border-sky-800/60',
    text: 'text-sky-800 dark:text-sky-200',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
    button: 'bg-sky-100! border-sky-300! text-sky-900! hover:bg-sky-200! dark:bg-sky-900/40! dark:border-sky-700! dark:text-sky-100!',
  },
  now: {
    card: 'bg-white border border-border dark:bg-[#162b3d] dark:border-white/10',
    text: 'text-text',
    chip: 'bg-bg-gray text-text dark:bg-white/10',
    button: 'bg-white! border-border! text-text! hover:bg-bg-light! dark:bg-[#162b3d]! dark:border-white/15!',
  },
  past: {
    card: 'bg-violet-50 border border-violet-100 dark:bg-violet-900/30 dark:border-violet-800/60',
    text: 'text-violet-800 dark:text-violet-200',
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
    button: 'bg-violet-100! border-violet-300! text-violet-900! hover:bg-violet-200! dark:bg-violet-900/40! dark:border-violet-700! dark:text-violet-100!',
  },
};

export const HEADER_GRADIENT = 'bg-gradient-to-br from-violet-600 to-fuchsia-600';
export const SURFACE = 'bg-white dark:bg-[#162b3d] border border-border dark:border-white/10';
export const VIOLET_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600! text-white! font-bold hover:bg-violet-700! transition-colors disabled:opacity-60';

export const WORLD_BADGE: Record<string, string> = {
  'hear-it': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
  'sort-it': 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
  'use-it': 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200',
};
