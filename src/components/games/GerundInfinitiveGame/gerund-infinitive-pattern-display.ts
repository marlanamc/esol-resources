import type { PatternCategory } from '@/types/gerund-infinitive';

/**
 * Last word before the `___` slot (same as the word right before the purpose phrase to + verb in the exercise).
 */
export function getWordBeforeBlank(sentence: string): string | null {
  if (!sentence.includes('___')) return null;
  const before = sentence.split('___')[0]?.trim() ?? '';
  const words = before.split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  const raw = words[words.length - 1];
  const cleaned = raw.replace(/^['"‘’(]+/u, '').replace(/[,.;:!)]+$/u, '');
  return cleaned || null;
}

/**
 * Text for amber cue badges in walkthroughs. For purpose infinitives, `pattern.trigger`
 * is often a bucket label (e.g. "study"); show the word before `___` when possible (often the object before to + verb).
 */
export function getTriggerBadgeLabel(
  category: PatternCategory,
  trigger: string,
  sentence?: string
): string {
  if (category === 'purpose' && sentence?.includes('___')) {
    const beforeBlank = getWordBeforeBlank(sentence);
    if (beforeBlank) return beforeBlank;
  }
  if (category === 'purpose') {
    return 'Purpose (why?)';
  }
  if (category === 'purpose-contrast') {
    return 'Purpose: for vs to';
  }
  return trigger;
}
