'use client';

import type { ReactNode } from 'react';
import type { RealLifeDialogue, ValidVerbAnswer } from '@/types/activity';
import type { TimelineVerbBlankResult } from './timelineTensesUtils';
import { AnswerFeedback } from './AnswerFeedback';
import { TenseDialogueCard } from './TenseDialogueCard';
import { highlightSentenceFeatures, highlightTimeClues } from './highlightUtils';

interface FeedbackPanelProps {
  feedbackKey: string;
  isCorrect: boolean;
  tenseName: string;
  explanation: string;
  onContinue: () => void;
  answerVisual?: ReactNode;
  // For Type 2 questions with multiple valid answers
  matchedAnswer?: ValidVerbAnswer;
  allValidAnswers?: ValidVerbAnswer[];
  blankFeedback?: TimelineVerbBlankResult[];
  /** Original sentence template for showing full correct sentence */
  sentenceTemplate?: string;
  /** Original sentence (SentenceToTimeline) — shown with time clue highlighting */
  sentence?: string;
  /** Original sentence verb phrase for sentence-to-timeline feedback */
  verbPhrase?: string;
  /** Second verb phrase (for two-verb mixed sentences) */
  verbPhrase2?: string;
  /** Optional per-question real-life dialogue */
  realLifeDialogue?: RealLifeDialogue;
}

export function FeedbackPanel({
  feedbackKey, isCorrect, tenseName, explanation, onContinue,
  blankFeedback, sentenceTemplate, sentence, verbPhrase, verbPhrase2,
  realLifeDialogue, answerVisual,
}: FeedbackPanelProps) {
  // Escape special regex characters in a string
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Build the full correct sentence by replacing blanks with correct answers
  const buildCorrectSentence = (): string | null => {
    if (!sentenceTemplate || !blankFeedback || blankFeedback.length === 0) {
      return null;
    }

    let sentence = sentenceTemplate;
    for (const blank of blankFeedback) {
      // Get the correct answer (matched if correct, or first valid answer)
      const correctAnswer =
        blank.matchedAnswer?.answer ?? blank.validAnswers[0]?.answer ?? '';
      // Replace the blank pattern like ___[verb]___ with the correct answer
      // Escape special regex characters in the prompt label to prevent issues
      const escapedLabel = escapeRegex(blank.promptLabel);
      const blankPattern = new RegExp(`___\\[${escapedLabel}\\]___`, 'g');
      sentence = sentence.replace(blankPattern, correctAnswer);
    }
    return sentence;
  };

  const correctSentence = buildCorrectSentence();

  return (
    <AnswerFeedback
      feedbackKey={feedbackKey}
      isCorrect={isCorrect}
      onContinue={onContinue}
      answer={<>
        <p className="font-semibold">{tenseName}</p>
        {correctSentence ? <p>{highlightTimeClues(correctSentence)}</p> : sentence ? (
          <p>{highlightSentenceFeatures(sentence, verbPhrase, verbPhrase2)}</p>
        ) : null}
        {blankFeedback?.filter((blank) => !blank.isCorrect).map((blank) => (
          <p key={blank.blankId} className="text-sm">
            {blank.promptLabel}: <span className="rounded px-1 py-0.5 font-semibold bg-[#fef2f2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fecaca]">{blank.userAnswer || '(missing)'}</span> → {blank.validAnswers[0]?.answer}
          </p>
        ))}
        {answerVisual}
      </>}
      details={<>
        <p>{explanation}</p>
        {blankFeedback && blankFeedback.length > 1 && (
          <ul className="space-y-2 text-sm">
            {blankFeedback.map((blank) => {
              const answer = blank.matchedAnswer ?? blank.validAnswers[0];
              return answer ? <li key={blank.blankId}>{blank.promptLabel}: {answer.answer} ({answer.tenseName})</li> : null;
            })}
          </ul>
        )}
        {(correctSentence || sentence) && <p className="text-sm text-text-muted">Highlighted words are time clues.{sentence && !correctSentence ? ' Underlined words are the verb phrase.' : ''}</p>}
        <TenseDialogueCard dialogue={realLifeDialogue} tenseName={tenseName} />
      </>}
    />
  );
}
