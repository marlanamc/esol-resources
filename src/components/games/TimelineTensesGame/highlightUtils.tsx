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

interface TextRange {
  start: number;
  end: number;
}

const SINGLE_WORD_TIME_CLUES = new Set(
  TIME_CLUE_PATTERNS.filter((pattern) => !pattern.includes(' ')).map((pattern) =>
    pattern.toLowerCase()
  )
);

function getPatternRanges(text: string, patterns: string[]): TextRange[] {
  const escaped = patterns.map(escapeRegex);
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  const ranges: TextRange[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    ranges.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return ranges;
}

function getVerbPhraseRanges(text: string, verbPhrase?: string): TextRange[] {
  if (!verbPhrase) return [];

  const escaped = escapeRegex(verbPhrase);
  const pattern = new RegExp(escaped, 'i');
  const match = pattern.exec(text);

  if (!match || match.index === undefined) return [];

  const phraseText = match[0];
  const phraseStart = match.index;
  const tokenPattern = /\S+/g;
  const ranges: TextRange[] = [];
  let tokenMatch: RegExpExecArray | null;

  while ((tokenMatch = tokenPattern.exec(phraseText)) !== null) {
    const token = tokenMatch[0];
    const normalizedToken = token.replace(/^[^\w']+|[^\w']+$/g, '').toLowerCase();

    if (!normalizedToken || SINGLE_WORD_TIME_CLUES.has(normalizedToken)) {
      continue;
    }

    ranges.push({
      start: phraseStart + tokenMatch.index,
      end: phraseStart + tokenMatch.index + token.length,
    });
  }

  return ranges;
}

function rangeContains(ranges: TextRange[], index: number): boolean {
  return ranges.some((range) => index >= range.start && index < range.end);
}

/** Wrap matched time expressions in an amber highlight mark. */
export function highlightTimeClues(text: string): React.ReactNode {
  if (!text) return <>{text}</>;

  const timeClueRanges = getPatternRanges(text, TIME_CLUE_PATTERNS);
  return renderHighlightedText(text, timeClueRanges, []);
}

function renderHighlightedText(
  text: string,
  timeClueRanges: TextRange[],
  verbPhraseRanges: TextRange[]
): React.ReactNode {
  if (!text) return <>{text}</>;

  const segments: Array<{ text: string; isTimeClue: boolean; isVerbPhrase: boolean }> = [];
  let current = '';
  let currentTime = rangeContains(timeClueRanges, 0);
  let currentVerb = rangeContains(verbPhraseRanges, 0);

  for (let index = 0; index < text.length; index += 1) {
    const nextTime = rangeContains(timeClueRanges, index);
    const nextVerb = rangeContains(verbPhraseRanges, index);

    if (index === 0) {
      currentTime = nextTime;
      currentVerb = nextVerb;
    } else if (nextTime !== currentTime || nextVerb !== currentVerb) {
      segments.push({
        text: current,
        isTimeClue: currentTime,
        isVerbPhrase: currentVerb,
      });
      current = '';
      currentTime = nextTime;
      currentVerb = nextVerb;
    }

    current += text[index];
  }

  if (current) {
    segments.push({
      text: current,
      isTimeClue: currentTime,
      isVerbPhrase: currentVerb,
    });
  }

  return (
    <>
      {segments.map((segment, i) => {
        if (!segment.isTimeClue && !segment.isVerbPhrase) {
          return <span key={i}>{segment.text}</span>;
        }

        const className = [
          segment.isTimeClue ? 'bg-accent/40 text-text rounded px-0.5 not-italic font-bold' : '',
          segment.isVerbPhrase ? 'underline decoration-primary decoration-2 underline-offset-4 text-primary' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <span key={i} className={className}>
            {segment.text}
          </span>
        );
      })}
    </>
  );
}

/** Underline a specific verb phrase inside a sentence string. */
export function highlightVerbPhrase(
  sentence: string,
  verbPhrase: string | undefined
): React.ReactNode {
  if (!verbPhrase) return <>{sentence}</>;

  return renderHighlightedText(sentence, [], getVerbPhraseRanges(sentence, verbPhrase));
}

/** Highlight time clues and underline the target verb phrase in one pass. */
export function highlightSentenceFeatures(
  sentence: string,
  verbPhrase: string | undefined
): React.ReactNode {
  return renderHighlightedText(
    sentence,
    getPatternRanges(sentence, TIME_CLUE_PATTERNS),
    getVerbPhraseRanges(sentence, verbPhrase)
  );
}
