'use client';

import { useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { ErrorCorrectionQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
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
  const inputRef = useRef<HTMLInputElement | null>(null);
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
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-6 sm:p-8 mb-6 shadow-xl"
            >
              <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Write the corrected sentence</div>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && userInput.trim()) handleSubmit(); }}
                placeholder="Type the corrected sentence..."
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full border-b-2 border-primary bg-transparent text-text text-xl font-display font-black placeholder-text-muted/30 focus:outline-none focus:border-primary-dark pb-2 transition-colors"
              />
              <p className="text-xs text-text-muted/50 font-medium mt-2">
                Hint: incorrect tense is <span className="font-black text-amber-600/70">{question.incorrectTense}</span>
              </p>
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-4 sm:p-6 shadow-lg"
          >
            <button
              onClick={handleSubmit}
              disabled={question.errorLocation === 'sentence' && !userInput.trim()}
              className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {question.errorLocation === 'timeline' ? 'Got It — Next' : 'Check Answer'}
            </button>
          </motion.div>
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
