'use client';

import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowDown, BookMarked } from 'lucide-react';
import type { SentenceTransformerQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { ExerciseActionBar } from '../ExerciseActionBar';
import { elementsUseSplitPast } from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';
import { areExerciseAnswersEquivalent } from '@/lib/exercise-answer-normalization';
import { AnswerFeedback } from '../AnswerFeedback';
import { TenseDialogueCard } from '../TenseDialogueCard';
import { highlightTimeClues } from '../highlightUtils';

interface SentenceTransformerExerciseProps {
  question: SentenceTransformerQuestion;
  onSubmit: (answer: { transformedWords: string[] }, isCorrect: boolean, tenseName?: string) => void;
  onNext: () => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

const TENSE_FORMULA_LOOKUP: Record<string, { formula: string; example: string }> = {
  'Present Simple':             { formula: 'subject + V1 (/ V1-s for he/she/it)',       example: 'She works every day.' },
  'Past Simple':                { formula: 'subject + V2',                               example: 'She worked yesterday.' },
  'Future Simple':              { formula: 'subject + will + V1',                        example: 'She will work tomorrow.' },
  'Present Continuous':         { formula: 'subject + am/is/are + V-ing',               example: 'She is working right now.' },
  'Past Continuous':            { formula: 'subject + was/were + V-ing',                example: 'She was working at 8pm.' },
  'Future Continuous':          { formula: 'subject + will be + V-ing',                 example: 'She will be working all night.' },
  'Present Perfect':            { formula: 'subject + have/has + V3',                    example: 'She has worked here before.' },
  'Past Perfect':               { formula: 'subject + had + V3',                         example: 'She had worked before the meeting.' },
  'Future Perfect':             { formula: 'subject + will have + V3',                   example: 'She will have worked 10 hours by then.' },
  'Present Perfect Continuous': { formula: 'subject + have/has + been + V-ing',         example: 'She has been working for hours.' },
  'Past Perfect Continuous':    { formula: 'subject + had + been + V-ing',              example: 'She had been working when I called.' },
  'Future Perfect Continuous':  { formula: 'subject + will have been + V-ing',          example: 'She will have been working for a year.' },
};

/**
 * Split a sentence into words, preserving punctuation attached to words.
 * Returns an array of strings — the word at verbBlank.index is a fill-in.
 */
function splitSentence(sentence: string): string[] {
  return sentence.split(/\s+/);
}

export const SentenceTransformerExercise = memo(function SentenceTransformerExercise({
  question,
  onSubmit,
  onNext,
  showFeedback,
  lastAnswerCorrect,
}: SentenceTransformerExerciseProps) {
  const targetWords = splitSentence(question.targetSentence);
  // For each blank, compute how many words it spans (based on the first valid answer).
  const blankStartIndices = new Set(question.verbBlanks.map((b) => b.index));
  // Every word index that belongs to a blank span (start + subsequent consumed words)
  const blankCoveredIndices = new Set<number>();
  for (const blank of question.verbBlanks) {
    const wordCount = blank.validAnswers[0]?.split(' ').length ?? 1;
    for (let i = blank.index; i < blank.index + wordCount; i++) {
      blankCoveredIndices.add(i);
    }
  }

  // userInputs: index → typed value
  const [userInputs, setUserInputs] = useState<Record<number, string>>(() =>
    Object.fromEntries(question.verbBlanks.map((b) => [b.index, '']))
  );
  const [showHint, setShowHint] = useState(false);
  const [showFormulaHint, setShowFormulaHint] = useState(false);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const { playPing, playThump } = useTimelineAudio();

  useEffect(() => {
    setUserInputs(Object.fromEntries(question.verbBlanks.map((b) => [b.index, ''])));
    setShowHint(false);
    setShowFormulaHint(false);
    inputRefs.current = {};
  }, [question.id, question.verbBlanks]);

  // Replace spans from right to left so multiword alternatives keep later indices intact.
  const reviewWords = [...targetWords];
  for (const blank of [...question.verbBlanks].sort((a, b) => b.index - a.index)) {
    const matched = blank.validAnswers.find((answer) => areExerciseAnswersEquivalent(userInputs[blank.index] ?? '', answer));
    if (matched) {
      const span = blank.validAnswers[0]?.split(' ').length ?? 1;
      const punctuation = targetWords[blank.index + span - 1]?.match(/[.,!?;:]+$/)?.[0] ?? '';
      reviewWords.splice(blank.index, span, matched.replace(/[.,!?;:]+$/, '') + punctuation);
    }
  }
  const reviewSentence = reviewWords.join(' ');

  const sourceSplit = elementsUseSplitPast(question.sourceElements);
  const targetSplit = elementsUseSplitPast(question.targetElements);

  const handleSubmit = useCallback(() => {
    const allCorrect = question.verbBlanks.every((blank) => {
      const typed = userInputs[blank.index]?.trim() ?? '';
      return blank.validAnswers.some((ans) => areExerciseAnswersEquivalent(typed, ans));
    });
    if (allCorrect) playPing(); else playThump();
    onSubmit(
      { transformedWords: Object.entries(userInputs).map(([, v]) => v) },
      allCorrect,
      question.targetTense
    );
  }, [userInputs, question.verbBlanks, question.targetTense, onSubmit, playPing, playThump]);

  // Move focus to next blank on Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIdx: number) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const allIndices = question.verbBlanks.map((b) => b.index).sort((a, z) => a - z);
        const pos = allIndices.indexOf(currentIdx);
        const nextIdx = allIndices[pos + 1];
        if (nextIdx !== undefined) {
          inputRefs.current[nextIdx]?.focus();
        } else {
          handleSubmit();
        }
      }
    },
    [question.verbBlanks, handleSubmit]
  );

  const allFilled = question.verbBlanks.every(
    (b) => (userInputs[b.index]?.trim() ?? '') !== ''
  );

  const transformLabel = 'Your turn: rewrite it in';

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-x-clip">
      {/* Source card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-6 sm:p-8 mb-4 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-amber-500" />
          <div className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.3em]">
            {question.sourceTense}
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-display font-black text-text leading-tight mb-5">
          &ldquo;{question.sourceSentence}&rdquo;
        </p>
        <TimelineCanvas
          elements={question.sourceElements}
          interactive={false}
          showLabels={false}
          pastTimelineLayout={sourceSplit ? 'split' : 'single'}
        />
      </motion.div>

      {/* Arrow */}
      {/* The task: big and solid so learners know they must change the tense. */}
      <div className="my-4 flex items-center gap-4 rounded-3xl bg-primary px-5 py-4 text-white shadow-lg sm:px-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20" aria-hidden="true">
          <ArrowDown size={24} strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-snug sm:text-xl">
            {transformLabel} <span className="whitespace-nowrap rounded-lg bg-white px-2 py-0.5 text-primary-dark">{question.targetTense}</span>
          </p>
          {TENSE_FORMULA_LOOKUP[question.targetTense] ? (
            <p className="mt-1 text-sm font-semibold text-white/90 sm:text-base">
              Use: {TENSE_FORMULA_LOOKUP[question.targetTense].formula}
            </p>
          ) : null}
        </div>
      </div>

      {!showFeedback ? (
        <>
          {/* Target sentence with blanks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-6 sm:p-8 mb-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-primary" />
              <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                {question.targetTense}
              </div>
            </div>

            {/* Inline sentence with input fields */}
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-3 text-2xl font-display font-black text-text leading-relaxed">
              {targetWords.map((word, idx) => {
                // Words consumed by a multi-word blank (not the start) are hidden
                if (blankCoveredIndices.has(idx) && !blankStartIndices.has(idx)) return null;

                if (blankStartIndices.has(idx)) {
                  const blank = question.verbBlanks.find((b) => b.index === idx)!;
                  return (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      value={userInputs[idx] ?? ''}
                      onChange={(e) =>
                        setUserInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                      }
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      placeholder={`___ (${blank.validAnswers[0].split(' ').length} ${blank.validAnswers[0].split(' ').length === 1 ? 'word' : 'words'})`}
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="inline-block min-w-[140px] max-w-[240px] rounded-t-lg border-b-4 border-primary bg-primary/10 px-1 text-primary placeholder-primary-dark/70 focus:outline-none focus:border-primary-dark focus:bg-primary/15 text-2xl font-display font-black text-center transition-colors dark:placeholder-primary-light/70"
                      style={{ width: `${Math.max(10, (userInputs[idx]?.length ?? 4) + 2)}ch` }}
                    />
                  );
                }
                return <span key={idx}>{word}</span>;
              })}
            </div>
          </motion.div>

          {/* Hint */}
          {question.hint && (
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-4 p-5 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-600/60 uppercase tracking-widest mb-1">Hint</div>
                    <p className="text-text font-medium">{question.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Formula hint */}
          <AnimatePresence>
            {showFormulaHint && TENSE_FORMULA_LOOKUP[question.targetTense] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4 p-5 bg-primary/5 border border-primary/20 rounded-3xl flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookMarked className="text-primary" size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-primary/60 uppercase tracking-widest mb-1">
                    {question.targetTense} Formula
                  </div>
                  <p className="text-text font-black font-mono text-sm leading-relaxed">
                    {TENSE_FORMULA_LOOKUP[question.targetTense].formula}
                  </p>
                  <p className="text-text-muted/70 text-xs mt-1.5 italic">
                    e.g. &ldquo;{TENSE_FORMULA_LOOKUP[question.targetTense].example}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <ExerciseActionBar
            secondary={
              <>
                {question.hint && !showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="w-full py-3 text-sm font-black text-text-muted/70 hover:text-primary uppercase tracking-[0.18em] border border-border/40 hover:border-primary/30 bg-white/40 dark:bg-[#162b3d]/40 hover:bg-primary/5 rounded-2xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Lightbulb size={16} />
                    Need a Hint?
                  </button>
                )}
                {!showFormulaHint && TENSE_FORMULA_LOOKUP[question.targetTense] && (
                  <button
                    onClick={() => setShowFormulaHint(true)}
                    className="w-full py-3 text-sm font-black text-text-muted/70 hover:text-primary uppercase tracking-[0.18em] border border-border/40 hover:border-primary/30 bg-white/40 dark:bg-[#162b3d]/40 hover:bg-primary/5 rounded-2xl flex items-center justify-center gap-2 transition-all"
                  >
                    <BookMarked size={16} />
                    Show Formula
                  </button>
                )}
              </>
            }
          >
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check Answer
            </button>
          </ExerciseActionBar>
        </>
      ) : (
        /* Feedback */
        <AnswerFeedback
          feedbackKey={question.id}
          isCorrect={lastAnswerCorrect ?? false}
          onContinue={onNext}
          answer={<>
            <p className="font-semibold">{question.targetTense}</p>
            <p>{highlightTimeClues(reviewSentence)}</p>
            {question.verbBlanks.filter((blank) => !blank.validAnswers.some((answer) => areExerciseAnswersEquivalent(userInputs[blank.index] ?? '', answer))).map((blank) => (
              <p key={blank.index} className="text-sm">Blank {question.verbBlanks.indexOf(blank) + 1}: <span className="rounded px-1 py-0.5 font-semibold bg-[#fef2f2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fecaca]">{userInputs[blank.index] || '(missing)'}</span> → {blank.validAnswers[0]}</p>
            ))}
          </>}
          details={<>
            <p>{question.explanation}</p>
            <p className="text-sm text-text-muted">Highlighted words are time clues.</p>
            <TenseDialogueCard dialogue={question.realLifeDialogue} tenseName={question.targetTense} />
            <TimelineCanvas elements={question.targetElements} interactive={false} showLabels={true} pastTimelineLayout={targetSplit ? 'split' : 'single'} />
          </>}
        />
      )}
    </div>
  );
});
