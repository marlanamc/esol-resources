'use client';

/**
 * Shared text highlighting utilities for Timeline Tenses feedback panels.
 *
 * highlightTimeClues  — auto-detects common time expressions and marks them
 *                       in amber so students learn to spot tense clues.
 * highlightVerbPhrase — bolds the verb phrase in a sentence so students
 *                       immediately know which word(s) they are analysing.
 */

// Common time expressions that signal a particular tense.
// Listed longest-first so multi-word phrases match before single words.
const TIME_CLUE_PATTERNS: string[] = [
  // Multi-word past markers
  'last night', 'last week', 'last month', 'last year',
  'last summer', 'last winter', 'last spring', 'last fall',
  'last Monday', 'last Tuesday', 'last Wednesday',
  'last Thursday', 'last Friday', 'last Saturday', 'last Sunday',
  'this morning', 'this afternoon', 'this evening', 'earlier today',
  // Multi-word present markers
  'every day', 'every morning', 'every night', 'every week',
  'every month', 'every year', 'every Monday', 'every Tuesday',
  'every Wednesday', 'every Thursday', 'every Friday',
  'every Saturday', 'every Sunday',
  'twice a week', 'twice a day', 'once a day', 'once a week',
  'three times a week', 'all the time',
  // Present continuous markers
  'right now', 'at the moment',
  // Perfect markers (multi-word)
  'so far', 'up to now', 'by the time', 'for the past',
  'as soon as',
  // Future markers (multi-word)
  'next week', 'next month', 'next year',
  'next Monday', 'next Tuesday', 'next Wednesday',
  'next Thursday', 'next Friday', 'next Saturday', 'next Sunday',
  'in the future', 'by the end of', 'by then', 'by tomorrow',
  'by midnight', 'by noon',
  // Single-word markers
  'yesterday', 'always', 'usually', 'often', 'sometimes',
  'rarely', 'never', 'regularly', 'currently', 'still',
  'already', 'yet', 'just', 'recently', 'lately',
  'ever', 'since', 'before', 'after', 'previously',
  'tomorrow', 'soon', 'tonight', 'later', 'while', 'when', 'until', 'during',
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Wrap matched time expressions in an amber highlight mark. */
export function highlightTimeClues(text: string): React.ReactNode {
  if (!text) return <>{text}</>;

  // Build regex matching any clue pattern, longest first, word-boundary aware
  const escaped = TIME_CLUE_PATTERNS.map(escapeRegex);
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const isClue = TIME_CLUE_PATTERNS.some(
          (c) => c.toLowerCase() === part.toLowerCase()
        );
        return isClue ? (
          <mark
            key={i}
            className="bg-accent/40 text-text rounded px-0.5 not-italic font-bold"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

/** Bold a specific verb phrase inside a sentence string. */
export function highlightVerbPhrase(
  sentence: string,
  verbPhrase: string | undefined
): React.ReactNode {
  if (!verbPhrase) return <>{sentence}</>;

  const escaped = escapeRegex(verbPhrase);
  const pattern = new RegExp(`(${escaped})`, 'i');
  const parts = sentence.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === verbPhrase.toLowerCase() ? (
          <span
            key={i}
            className="underline decoration-primary decoration-2 underline-offset-4 font-black text-primary"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
