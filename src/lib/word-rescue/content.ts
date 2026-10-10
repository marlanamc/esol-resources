import { WEEKLY_LANGUAGE_HELP, REVIEWED_RESCUE_PHRASES } from '@/data/word-rescue-language-help';
import weekly from '@/data/word-rescue-weekly.generated.json';
import { EVERYDAY_WORDS, RESCUE_HINTS } from '@/data/word-rescue-hints';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
import type { RescueCollection, RescueWord } from './types';

export const RESCUE_WORDS: RescueWord[] = [
  ...EVERYDAY_WORDS,
  ...weekly.flatMap(week => week.words.map(word => ({ ...word, help: WEEKLY_LANGUAGE_HELP[word.term], ...RESCUE_HINTS[word.term], phrase: RESCUE_HINTS[word.term]?.phrase ?? REVIEWED_RESCUE_PHRASES[word.term] ?? word.phrase }))),
];
export const RESCUE_WORD_BY_ID = Object.fromEntries(RESCUE_WORDS.map(word => [word.id, word]));
export const RESCUE_COLLECTIONS: RescueCollection[] = [
  { id: 'everyday', label: 'Everyday tricky words', wordIds: EVERYDAY_WORDS.map(word => word.id) },
  ...COURSE_MAP_UNITS.flatMap(unit => unit.weeks.flatMap(mapWeek => {
    const set = weekly.find(set => mapWeek.items.some(item => item.activityId === `vocab-${set.id}`));
    if (!set) return [];
    return [{
      id: set.id,
      label: `Week ${mapWeek.number} · ${mapWeek.title}`,
      sourceActivityId: `vocab-${set.id}`,
      wordIds: set.words.map(word => word.id),
    }];
  })),
];
export function rescueAudioPath(wordId: string, clip: 'word' | 'phrase' | 'sentence') {
  return `/word-rescue-audio/${wordId}-${clip}.mp3?v=elevenlabs-fy27-1`;
}
