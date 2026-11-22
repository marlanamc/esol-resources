'use client';

import { useState, useRef, useLayoutEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Copy } from 'lucide-react';
import type { ErrorCorrectionQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { ExerciseActionBar } from '../ExerciseActionBar';
import { elementsUseSplitPast } from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';
import { areExerciseAnswersEquivalent } from '@/lib/exercise-answer-normalization';
import { AnswerFeedback } from '../AnswerFeedback';
import { TenseDialogueCard } from '../TenseDialogueCard';

interface ErrorCorrectionExerciseProps {
  question: ErrorCorrectionQuestion;
  onSubmit: (answer: { correctedValue: string }, isCorrect: boolean, tenseName?: string) => void;
  onNext: () => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

export function isErrorCorrectionAnswerCorrect(
  question: ErrorCorrectionQuestion,
  userInput: string
): boolean {
  if (question.errorLocation !== 'sentence') {
    return true;
  }

  const trimmed = userInput.trim();
  if (areExerciseAnswersEquivalent(trimmed, question.correctSentence)) return true;

  return (
    question.acceptedCorrections?.some((candidate) =>
      areExerciseAnswersEquivalent(trimmed, candidate)
    ) ?? false
  );
}

export const ErrorCorrectionExercise = memo(function ErrorCorrectionExercise({
  question,
  onSubmit,
  onNext,
  showFeedback,
  lastAnswerCorrect,
}: ErrorCorrectionExerciseProps) {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const writeCardRef = useRef<HTMLDivElement | null>(null);

  // Grow the box with the text so the whole sentence is always visible.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [userInput]);

  // When the phone keyboard opens, bring the whole write card (with the
  // sentence to fix) into view instead of just the text box.
  const [typing, setTyping] = useState(false);
  const revealWriteCard = () => {
    setTyping(true);
    const reveal = () => writeCardRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    window.setTimeout(reveal, 300);
    // iOS shrinks the visual viewport once the keyboard finishes opening.
    window.visualViewport?.addEventListener('resize', reveal, { once: true });
  };

  const copyOriginal = () => {
    setUserInput(question.incorrectSentence);
    const el = inputRef.current;
    if (el) {
      el.focus();
      requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
    }
  };
  const { playPing, playThump } = useTimelineAudio();

  const incorrectSplit = elementsUseSplitPast(question.incorrectElements);
  const correctSplit = elementsUseSplitPast(question.correctElements);

  const checkAnswer = (): boolean => {
    return isErrorCorrectionAnswerCorrect(question, userInput);
  };

  const handleSubmit = () => {
    if (question.errorLocation === 'timeline') {
      // Timeline error: auto-advance after viewing correct timeline
      playPing();
      onSubmit({ correctedValue: 'viewed' }, true, question.correctTense);
      return;
    }
    const isCorrect = checkAnswer();
    if (isCorrect) playPing(); else playThump();
    onSubmit({ correctedValue: userInput }, isCorrect, question.correctTense);
  };

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-x-clip">
      {/* Error card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-6 sm:p-10 mb-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-amber-500" />
          <div className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.3em]">
            Fix It
          </div>
          <span className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-black border border-amber-500/20">
            <AlertTriangle size={12} />
            {question.errorLocation === 'sentence' ? 'Sentence Error' : 'Timeline Error'}
          </span>
        </div>

        <p className="text-base text-text-muted font-medium mb-3">
          {question.errorLocation === 'sentence'
            ? 'This sentence uses the wrong tense. Fix it!'
            : 'This timeline doesn\'t match the sentence. Study the correct one.'}
        </p>

        <p className="text-2xl sm:text-3xl font-display font-black text-text leading-tight mb-6">
          &ldquo;{question.incorrectSentence}&rdquo;
        </p>

        {/* Incorrect timeline */}
        <div className="opacity-70">
          <div className="text-xs font-black text-amber-600/60 uppercase tracking-widest mb-2">
            {question.errorLocation === 'timeline' ? '⚠ Wrong Timeline' : 'Current Timeline'}
          </div>
          <TimelineCanvas
            elements={question.incorrectElements}
            interactive={false}
            showLabels={false}
            pastTimelineLayout={incorrectSplit ? 'split' : 'single'}
          />
        </div>
      </motion.div>

      {!showFeedback ? (
        <>
          {question.errorLocation === 'sentence' ? (
            /* Sentence fix — type the corrected sentence */
            <motion.div
              ref={writeCardRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="scroll-mt-4 bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-5 sm:p-8 mb-6 shadow-xl"
            >
              <label htmlFor={`fix-${question.id}`} className="block text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">
                Write the corrected sentence
              </label>

              {/* The sentence to fix, repeated here so learners can see it while
                  the phone keyboard is open. */}
              <div className="mb-3 rounded-2xl bg-amber-500/10 px-4 py-3">
                <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">Fix this sentence:</div>
                <p className="text-lg font-semibold leading-snug text-text">{question.incorrectSentence}</p>
              </div>

              <textarea
                id={`fix-${question.id}`}
                ref={inputRef}
                rows={2}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/\n/g, ' '))}
                onFocus={revealWriteCard}
                // Wait before re-pinning so a tap on Check Answer still lands.
                onBlur={() => window.setTimeout(() => setTyping(false), 250)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (userInput.trim()) handleSubmit();
                  }
                }}
                enterKeyHint="done"
                placeholder="Type the corrected sentence..."
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="block w-full resize-none overflow-hidden rounded-2xl border-2 border-primary/40 bg-white dark:bg-[#0f2233] px-4 py-3 text-xl leading-snug font-bold text-text placeholder:text-text-muted/40 focus:border-primary focus:outline-none transition-colors"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-text-muted">
                  Wrong tense: <span className="font-bold text-amber-700 dark:text-amber-300">{question.incorrectTense}</span>
                </p>
                {userInput.trim() === '' ? (
                  <button
                    type="button"
                    onClick={copyOriginal}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-bold text-text-muted hover:text-primary hover:border-primary/40"
                  >
                    <Copy size={16} aria-hidden="true" />
                    Copy the sentence
                  </button>
                ) : null}
              </div>
            </motion.div>
          ) : (
            /* Timeline error — show correct timeline immediately */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-6 sm:p-8 mb-6 shadow-xl"
            >
              <div className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-3">Correct Timeline ({question.correctTense})</div>
              <TimelineCanvas
                elements={question.correctElements}
                interactive={false}
                showLabels={true}
                pastTimelineLayout={correctSplit ? 'split' : 'single'}
              />
            </motion.div>
          )}

          <ExerciseActionBar pinned={!typing}>
            <button
              onClick={handleSubmit}
              disabled={question.errorLocation === 'sentence' && !userInput.trim()}
              className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {question.errorLocation === 'timeline' ? 'Got It — Next' : 'Check Answer'}
            </button>
          </ExerciseActionBar>
        </>
      ) : (
        /* Feedback */
        <AnswerFeedback
          feedbackKey={question.id}
          isCorrect={lastAnswerCorrect ?? false}
          onContinue={onNext}
          answer={<><p className="font-semibold">{question.correctTense}</p><p>{question.correctSentence}</p></>}
          details={<>
            <p>{question.commonMistakeExplanation}</p>
            <TenseDialogueCard dialogue={question.realLifeDialogue} tenseName={question.correctTense} />
            <TimelineCanvas elements={question.correctElements} interactive={false} showLabels={true} pastTimelineLayout={correctSplit ? 'split' : 'single'} />
          </>}
        />
      )}
    </div>
  );
});
