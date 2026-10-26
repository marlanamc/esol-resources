import { WEEKLY_LANGUAGE_HELP, REVIEWED_RESCUE_PHRASES } from '@/data/word-rescue-language-help';
import retired from '@/data/word-rescue-retired.json';
import weekly from '@/data/word-rescue-weekly.generated.json';
import { EVERYDAY_WORDS, RESCUE_HINTS } from '@/data/word-rescue-hints';
import { RESCUE_TRANSLATIONS, RESCUE_TRANSLATIONS_BY_ID } from '@/data/word-rescue-translations';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
import type { RescueCollection, RescueWord } from './types';

export const RESCUE_WORDS: RescueWord[] = [
  ...EVERYDAY_WORDS,
  ...[...weekly.flatMap(week => week.words), ...retired].map(word => ({ ...word, help: WEEKLY_LANGUAGE_HELP[word.term], ...RESCUE_HINTS[word.term], phrase: RESCUE_HINTS[word.term]?.phrase ?? REVIEWED_RESCUE_PHRASES[word.term] ?? word.phrase })),
].map(word => ({ ...word, translations: RESCUE_TRANSLATIONS_BY_ID[word.id] ?? RESCUE_TRANSLATIONS[word.term] }));
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
  const version = RESCUE_WORD_BY_ID[wordId]?.term === 'advocate' && clip === 'phrase'
    ? 'advocate-verb-1'
    : 'elevenlabs-fy27-3';
  return `/word-rescue-audio/${wordId}-${clip}.mp3?v=${version}`;
}
