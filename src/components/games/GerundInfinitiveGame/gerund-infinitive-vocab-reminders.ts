import type { GerundInfinitiveGroup } from '@/types/gerund-infinitive';

export interface GIVocabReminder {
  title: string;
  examples: string;
  note?: string;
}

/**
 * Short vocabulary sidebars for preposition-heavy levels (walkthrough + pattern intro).
 * Colocated with game client components to avoid Turbopack/HMR chunk issues with `src/lib` imports.
 */
export function getGIVocabReminder(group: GerundInfinitiveGroup): GIVocabReminder | null {
  if (group.id === 'group-1' || group.id === 'group-1b' || group.id === 'group-1d') {
    return {
      title: 'What is a preposition?',
      examples: 'in, at, for, of, about, to, from, with, without, before, after',
      note: 'Small words that link ideas — place, time, or direction.',
    };
  }
  if (group.id === 'group-1c') {
    return {
      title: 'When is "to" a preposition?',
      examples: 'look forward to, be used to, get used to, committed to',
      note: 'Here "to" is part of the phrase, so the next verb is -ing.',
    };
  }
  if (group.id === 'group-8a') {
    return {
      title: 'Why -ing here?',
      examples: 'How about, What about, thought of',
      note: 'These phrases end with a preposition → use -ing next.',
    };
  }
  if (group.id === 'group-8b') {
    return {
      title: 'Look before the blank',
      examples: 'for + -ing, to + base verb',
      note: 'Same idea; different cue word (for vs to).',
    };
  }
  return null;
}
