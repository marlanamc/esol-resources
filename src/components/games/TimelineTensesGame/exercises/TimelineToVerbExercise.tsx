'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { TimelineToVerbQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { FeedbackPanel } from '../FeedbackPanel';
import type { VerbFillAnswer } from '../hooks/useTimelineTensesState';
import {
  buildTimelineVerbFeedbackTenseName,
  elementsUseSplitPast,
  parseTimelineSentenceTemplate,
  type TimelineVerbBlankResult,
  validateTimelineVerbAnswers,
} from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';

interface TimelineToVerbExerciseProps {
  question: TimelineToVerbQuestion;
  onSubmit: (answer: VerbFillAnswer, isCorrect: boolean, tenseName?: string) => void;
  onNext: () => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

export function TimelineToVerbExercise({
  question,
  onSubmit,
  onNext,
  showFeedback,
  lastAnswerCorrect,
}: TimelineToVerbExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [blankResults, setBlankResults] = useState<TimelineVerbBlankResult[]>([]);
  const [showHint, setShowHint] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { playPing, playThump } = useTimelineAudio();

  const sentenceParts = parseTimelineSentenceTemplate(question);

  useEffect(() => {
    setAnswers({});
    setBlankResults([]);
    setShowHint(false);
    inputRefs.current = {};
  }, [question.id]);

  // Generate hint showing tense names for blanks
  const getHint = useCallback((): string => {
    const tenseNames = question.blanks
      .map((blank) => {
        const tenseName = blank.validAnswers[0]?.tenseName;
        return tenseName ? `[${blank.baseVerb}]: ${tenseName}` : null;
      })
      .filter(Boolean);

    if (tenseNames.length === 0) {
      return 'Look at the timeline elements to determine the correct tense for each verb.';
    }
    return tenseNames.join(' | ');
  }, [question.blanks]);

  useEffect(() => {
    const firstBlankId = question.blanks[0]?.id;
    if (!firstBlankId) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const firstInput = inputRefs.current[firstBlankId];
      const activeElement = document.activeElement;

      if (!firstInput) {
        return;
      }

      if (
        activeElement &&
        activeElement instanceof HTMLElement &&
        activeElement !== document.body &&
        activeElement !== firstInput
      ) {
        return;
      }

      firstInput.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [question.id, question.blanks]);

  const handleInputChange = useCallback((blankId: string, value: string) => {
    setAnswers((prev) => {
      if (prev[blankId] === value) {
        return prev;
      }

      return { ...prev, [blankId]: value };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const { allCorrect, blankResults: nextBlankResults, firstCorrectTense } =
      validateTimelineVerbAnswers(question, answers);

    setBlankResults(nextBlankResults);
    if (allCorrect) {
      playPing();
    } else {
      playThump();
    }
    onSubmit({ answers }, allCorrect, firstCorrectTense);
  }, [answers, onSubmit, question, playPing, playThump]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentBlankIndex: number) => {
      if (e.key !== 'Enter') {
        return;
      }

      e.preventDefault();
      const nextBlank = question.blanks[currentBlankIndex + 1];

      if (nextBlank?.id && inputRefs.current[nextBlank.id]) {
        inputRefs.current[nextBlank.id]?.focus();
        return;
      }

      handleSubmit();
    },
    [handleSubmit, question.blanks]
  );

  const allFilled = question.blanks.every(
    (blank) => (answers[blank.id] || '').trim().length > 0
  );

  const buildExplanation = (): string => {
    if (lastAnswerCorrect) {
      return (
        blankResults.find((result) => result.matchedAnswer?.nuance)?.matchedAnswer
          ?.nuance ||
        question.blanks[0]?.validAnswers[0]?.nuance ||
        'The verbs match the timeline and the time focus.'
      );
    }

    const firstIncorrectBlank = blankResults.find((result) => !result.isCorrect);
    const targetAnswer = firstIncorrectBlank?.validAnswers[0];

    return (
      targetAnswer?.nuance ||
      `Use the timeline to choose the time focus for each blank.`
    );
  };

  const feedbackTenseName =
    buildTimelineVerbFeedbackTenseName(blankResults) ||
    question.blanks[0]?.validAnswers[0]?.tenseName ||
    '';

  const useSplitPast = elementsUseSplitPast(question.timelineElements);

  return (
    <div className="px-4 sm:px-0">
      {/* Timeline display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-6"
      >
        <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-4 text-center">
          Read the Timeline
        </div>

        {/* Timeline with verb labels */}
        <TimelineCanvas
          elements={question.timelineElements}
          showLabels={true}
          pastTimelineLayout={useSplitPast ? 'split' : 'single'}
        />

        {/* Scenario context */}
        {question.scenario && (
          <div className="mt-4 text-center text-text-muted text-sm italic">
            {question.scenario}
          </div>
        )}
      </motion.div>

      {!showFeedback ? (
        <>
          {/* Sentence with blanks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-6 mb-6"
          >
            <div className="text-sm font-semibold text-text-muted mb-4">
              Fill in the verbs:
            </div>

            <div className="text-xl sm:text-2xl font-display leading-relaxed flex flex-wrap items-baseline gap-1">
              {sentenceParts.map((part, idx) => {
                if (part.type === 'text') {
                  return (
                    <span key={idx} className="text-text">
                      {part.content}
                    </span>
                  );
                }

                return (
                  <span key={idx} className="inline-flex flex-col items-center mx-2">
                    <input
                      ref={(el) => {
                        inputRefs.current[part.blankId] = el;
                      }}
                      type="text"
                      value={answers[part.blankId] || ''}
                      onChange={(e) =>
                        handleInputChange(part.blankId, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, part.blankIndex)}
                      placeholder="type here..."
                      maxLength={50}
                      className="w-[180px] sm:w-[200px] px-4 py-2 border-2 border-border rounded-lg text-center text-base sm:text-lg font-semibold text-text bg-surface-elevated focus:border-primary focus:outline-none transition-colors"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      data-timeline-blank-id={part.blankId}
                    />
                    <span className="text-xs text-text-muted mt-1">
                      [{part.content}]
                    </span>
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Hint section */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Lightbulb size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        Hint - Tense for each blank
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {getHint()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit and hint buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              className="w-full py-4 px-6 bg-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
            >
              Check Answer
            </button>
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="w-full py-3 px-4 text-sm text-text-muted hover:text-text flex items-center justify-center gap-2 transition-colors"
              >
                <Lightbulb size={16} />
                Need a hint?
              </button>
            )}
          </motion.div>
        </>
      ) : (
        /* Feedback */
        <FeedbackPanel
          isCorrect={lastAnswerCorrect ?? false}
          tenseName={feedbackTenseName}
          explanation={buildExplanation()}
          onContinue={onNext}
          blankFeedback={blankResults}
          sentenceTemplate={question.sentenceTemplate}
        />
      )}
    </div>
  );
}
