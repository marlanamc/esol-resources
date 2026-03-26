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
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Timeline display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-6 sm:p-10 mb-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-1.5 h-6 rounded-full bg-primary" />
          <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">
            Reading the Timeline
          </div>
          <div className="w-1.5 h-6 rounded-full bg-primary" />
        </div>

        {/* Timeline with verb labels */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <TimelineCanvas
            elements={question.timelineElements}
            showLabels={true}
            pastTimelineLayout={useSplitPast ? 'split' : 'single'}
          />
        </div>

        {/* Scenario context */}
        {question.scenario && (
          <div className="mt-8 p-4 bg-white/20 dark:bg-white/5 rounded-2xl border border-white/10 text-center text-text-muted text-sm font-medium italic">
            "{question.scenario}"
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
            className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-6 sm:p-10 mb-8 shadow-xl"
          >
            <div className="text-xs font-black text-text-muted/40 uppercase tracking-[0.2em] mb-8 text-center sm:text-left underline decoration-primary/20 underline-offset-8">
              Complete the sentence:
            </div>

            <div className="text-lg sm:text-2xl md:text-3xl font-display font-bold leading-relaxed flex flex-wrap items-baseline gap-x-1 sm:gap-x-1.5 gap-y-5 sm:gap-y-6">
              {sentenceParts.map((part, idx) => {
                if (part.type === 'text') {
                  return (
                    <span key={idx} className="text-text tracking-tight">
                      {part.content}
                    </span>
                  );
                }

                return (
                  <span key={idx} className="relative inline-flex items-center mx-0.5">
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
                      placeholder="type..."
                      maxLength={50}
                      className="w-[120px] sm:w-[150px] md:w-[170px] px-3 py-2 sm:px-4 sm:py-3 border-2 border-border/40 rounded-xl sm:rounded-2xl text-center text-base sm:text-lg md:text-xl font-bold text-text bg-white/50 dark:bg-[#162b3d]/50 focus:border-primary focus:bg-white dark:focus:bg-[#162b3d] focus:shadow-xl focus:shadow-primary/10 focus:outline-none transition-all duration-300 placeholder:text-text-muted/20"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    {/* Animated underscore for focus */}
                    <motion.div 
                      className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      whileFocus={{ scaleX: 1 }}
                    />
                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-muted/50 whitespace-nowrap pointer-events-none">
                      {part.content}
                    </div>
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Hint section */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-8"
              >
                <div className="p-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-600/60 uppercase tracking-widest mb-1">Teaching Tip</div>
                    <p className="text-text font-medium leading-relaxed">
                      {getHint()}
                    </p>
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
            className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col items-stretch gap-3">
              <button
                onClick={handleSubmit}
                disabled={!allFilled}
                className="w-full py-4 sm:py-5 px-6 sm:px-10 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:shadow-[0_20px_32px_-12px_rgba(var(--primary-color-rgb),0.6)] hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden"
              >
                Check Answer
              </button>
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="w-full px-5 sm:px-6 py-3 sm:py-4 text-sm font-black text-text-muted/70 hover:text-primary uppercase tracking-[0.18em] border border-border/40 hover:border-primary/30 bg-white/40 dark:bg-[#162b3d]/40 hover:bg-primary/5 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <Lightbulb size={18} />
                  Need a Hint?
                </button>
              )}
            </div>
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
