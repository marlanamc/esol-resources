export interface HighlightMatch {
  before: string;
  match: string;
  after: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds the first standalone occurrence of a highlighted word or phrase.
 * This avoids matching substrings inside larger words, e.g. "her" in "teacher".
 */
export function findStandaloneHighlightMatch(
  sentence: string,
  highlightedText: string,
): HighlightMatch | null {
  const target = highlightedText.trim();
  if (!sentence || !target) return null;

  const escapedTarget = escapeRegExp(target);
  const pattern = new RegExp(`(^|[^A-Za-z0-9'])(${escapedTarget})(?=$|[^A-Za-z0-9'])`, 'i');
  const result = pattern.exec(sentence);

  if (!result) return null;

  const prefix = result[1] ?? '';
  const match = result[2] ?? '';
  const matchStart = result.index + prefix.length;
  const matchEnd = matchStart + match.length;

  return {
    before: sentence.slice(0, matchStart),
    match: sentence.slice(matchStart, matchEnd),
    after: sentence.slice(matchEnd),
  };
}
