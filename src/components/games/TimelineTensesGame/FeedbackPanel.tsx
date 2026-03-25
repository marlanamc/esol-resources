'use client';

import { motion } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight } from 'lucide-react';
import type { ValidVerbAnswer } from '@/types/activity';
import {
  getDistinctTimelineValidAnswers,
  type TimelineVerbBlankResult,
} from './timelineTensesUtils';

interface FeedbackPanelProps {
  isCorrect: boolean;
  tenseName: string;
  explanation: string;
  onContinue: () => void;
  // For Type 2 questions with multiple valid answers
  matchedAnswer?: ValidVerbAnswer;
  allValidAnswers?: ValidVerbAnswer[];
  blankFeedback?: TimelineVerbBlankResult[];
  /** Original sentence template for showing full correct sentence */
  sentenceTemplate?: string;
}

export function FeedbackPanel({
  isCorrect,
  tenseName,
  explanation,
  onContinue,
  matchedAnswer,
  allValidAnswers,
  blankFeedback,
  sentenceTemplate,
}: FeedbackPanelProps) {
  const otherAnswers = allValidAnswers?.filter(
    (a) => a.answer !== matchedAnswer?.answer
  );
  const hasBlankFeedback = (blankFeedback?.length ?? 0) > 0;

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 border-2 ${
        isCorrect
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
            isCorrect
              ? 'bg-gradient-to-br from-green-400 to-green-600'
              : 'bg-gradient-to-br from-amber-400 to-amber-600'
          }`}
        >
          {isCorrect ? (
            <Check size={28} className="text-white" strokeWidth={3} />
          ) : (
            <X size={28} className="text-white" strokeWidth={3} />
          )}
        </motion.div>

        <div className="flex-1">
          <h3
            className={`text-2xl font-bold font-display ${
              isCorrect
                ? 'text-green-700 dark:text-green-300'
                : 'text-amber-700 dark:text-amber-300'
            }`}
          >
            {isCorrect ? 'Correct!' : 'Not quite'}
          </h3>
          <div className="mt-1">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                isCorrect
                  ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                  : 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              {tenseName}
            </span>
          </div>
        </div>
      </div>

      {/* Full correct sentence - shown for blank-fill questions */}
      {correctSentence && (
        <div className="mb-6 p-4 bg-white/60 dark:bg-black/20 rounded-xl border border-border/50">
          <div className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
            Correct sentence:
          </div>
          <p className="text-lg sm:text-xl font-display text-text leading-relaxed">
            {correctSentence}
          </p>
        </div>
      )}

      {/* Matched answer (legacy single-answer feedback) */}
      {!hasBlankFeedback && matchedAnswer && isCorrect && (
        <div className="mb-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
          <div className="text-sm font-medium text-text-muted mb-1">
            Your answer:
          </div>
          <div className="text-lg font-semibold text-text">
            "{matchedAnswer.answer}"
          </div>
          {matchedAnswer.nuance && (
            <div className="text-sm text-text-muted mt-1">
              {matchedAnswer.nuance}
            </div>
          )}
        </div>
      )}

      {/* Key Learning Point - Prominent callout */}
      <div
        className={`mb-6 p-4 rounded-xl border-l-4 ${
          isCorrect
            ? 'bg-green-100/50 dark:bg-green-900/30 border-green-500'
            : 'bg-amber-100/50 dark:bg-amber-900/30 border-amber-500'
        }`}
      >
        <div className="flex items-start gap-3">
          <Lightbulb
            size={22}
            className={`flex-shrink-0 mt-0.5 ${
              isCorrect
                ? 'text-green-600 dark:text-green-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">
              Why this tense?
            </p>
            <p className="text-base font-medium text-text leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {hasBlankFeedback && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.15 }}
          className="mt-6"
        >
          {/* Section divider */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted px-2">
              Your Answers
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            {blankFeedback?.map((blank) => {
              const distinctValidAnswers = getDistinctTimelineValidAnswers(
                blank.validAnswers
              );
              const alsoAccepted = blank.matchedAnswer
                ? distinctValidAnswers.filter(
                    (answer) => answer.answer !== blank.matchedAnswer?.answer
                  )
                : distinctValidAnswers;
              const targetAnswer = blank.validAnswers[0];
              const nuanceText = blank.isCorrect
                ? blank.matchedAnswer?.nuance
                : targetAnswer?.nuance;

              return (
                <div
                  key={blank.blankId}
                  className={`rounded-xl overflow-hidden ${
                    blank.isCorrect
                      ? 'bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                      : 'bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {/* Header bar */}
                  <div
                    className={`px-4 py-2 flex items-center justify-between ${
                      blank.isCorrect
                        ? 'bg-green-100/70 dark:bg-green-900/30'
                        : 'bg-amber-100/70 dark:bg-amber-900/30'
                    }`}
                  >
                    <span className="font-semibold text-text">
                      [{blank.promptLabel}]
                    </span>
                    <span
                      className={`flex items-center gap-1.5 text-sm font-semibold ${
                        blank.isCorrect
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {blank.isCorrect ? (
                        <>
                          <Check size={16} />
                          Correct
                        </>
                      ) : (
                        <>
                          <X size={16} />
                          Review
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Your answer */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs uppercase tracking-wide text-text-muted font-medium w-20 flex-shrink-0">
                        You wrote:
                      </span>
                      <span
                        className={`font-semibold text-lg ${
                          blank.isCorrect
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {blank.userAnswer ? `"${blank.userAnswer}"` : '(empty)'}
                      </span>
                    </div>

                    {/* Correct answer - only show when wrong */}
                    {!blank.isCorrect && targetAnswer && (
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs uppercase tracking-wide text-text-muted font-medium w-20 flex-shrink-0">
                          Correct:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-lg text-green-700 dark:text-green-300">
                            "{targetAnswer.answer}"
                          </span>
                          <span className="rounded-full bg-green-200/70 dark:bg-green-800/70 px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-300">
                            {targetAnswer.tenseName}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tense badge - show when correct */}
                    {blank.isCorrect && blank.matchedAnswer && (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-green-200/70 dark:bg-green-800/70 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-300">
                          {blank.matchedAnswer.tenseName}
                        </span>
                      </div>
                    )}

                    {/* Nuance callout */}
                    {nuanceText && (
                      <div
                        className={`mt-2 p-3 rounded-lg border-l-[3px] ${
                          blank.isCorrect
                            ? 'bg-green-50/70 dark:bg-green-900/20 border-green-400'
                            : 'bg-amber-50/70 dark:bg-amber-900/20 border-amber-400'
                        }`}
                      >
                        <p className="text-sm text-text leading-relaxed">
                          {nuanceText}
                        </p>
                      </div>
                    )}

                    {/* Also accepted - de-emphasized */}
                    {alsoAccepted.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-text-muted">
                          Also accepted:{' '}
                          {alsoAccepted.map((a) => `"${a.answer}"`).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Other valid answers (legacy single-answer feedback) */}
      {!hasBlankFeedback && isCorrect && otherAnswers && otherAnswers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-green-200 dark:border-green-700"
        >
          <div className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">
            Also accepted:
          </div>
          <div className="space-y-2">
            {otherAnswers.map((answer, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/50 dark:bg-black/20 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text">
                    "{answer.answer}"
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-200/50 dark:bg-green-800/50 text-green-700 dark:text-green-300">
                    {answer.tenseName}
                  </span>
                </div>
                {answer.nuance && (
                  <div className="text-sm text-text-muted mt-1">
                    — {answer.nuance}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onContinue}
        className="mt-6 w-full py-3 px-6 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
      >
        Continue
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}
