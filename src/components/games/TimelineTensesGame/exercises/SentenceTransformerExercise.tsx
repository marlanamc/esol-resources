'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight, ArrowDown, BookMarked } from 'lucide-react';
import type { SentenceTransformerQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { InlineInfoTooltip } from '../InlineInfoTooltip';
import { elementsUseSplitPast } from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';
import { areExerciseAnswersEquivalent } from '@/lib/exercise-answer-normalization';
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
  'Present Continuous':         { formula: 'subject + am/is/are + V1-ing',               example: 'She is working right now.' },
  'Past Continuous':            { formula: 'subject + was/were + V1-ing',                example: 'She was working at 8pm.' },
  'Future Continuous':          { formula: 'subject + will be + V1-ing',                 example: 'She will be working all night.' },
  'Present Perfect':            { formula: 'subject + have/has + V3',                    example: 'She has worked here before.' },
  'Past Perfect':               { formula: 'subject + had + V3',                         example: 'She had worked before the meeting.' },
  'Future Perfect':             { formula: 'subject + will have + V3',                   example: 'She will have worked 10 hours by then.' },
  'Present Perfect Continuous': { formula: 'subject + have/has + been + V1-ing',         example: 'She has been working for hours.' },
  'Past Perfect Continuous':    { formula: 'subject + had + been + V1-ing',              example: 'She had been working when I called.' },
  'Future Perfect Continuous':  { formula: 'subject + will have been + V1-ing',          example: 'She will have been working for a year.' },
};

/**
 * Split a sentence into words, preserving punctuation attached to words.
 * Returns an array of strings — the word at verbBlank.index is a fill-in.
 */
function splitSentence(sentence: string): string[] {
  return sentence.split(/\s+/);
}

export function SentenceTransformerExercise({
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
  }, [question.id]);

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

  const transformLabel = `Rewrite naturally in ${question.targetTense}`;

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
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
      <div className="flex justify-center my-2">
        <div className="flex flex-col items-center gap-1 text-primary/60">
          <ArrowDown size={22} strokeWidth={2.5} />
          <span className="text-xs font-black uppercase tracking-widest">{transformLabel}</span>
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
                      placeholder={`___ (${blank.validAnswers[0].split(' ').length} words)`}
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="inline-block min-w-[120px] max-w-[200px] border-b-2 border-primary bg-transparent text-primary placeholder-primary/30 focus:outline-none focus:border-primary-dark text-2xl font-display font-black text-center transition-colors"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-4 sm:p-6 shadow-lg flex flex-col gap-3"
          >
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check Answer
            </button>
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
          </motion.div>
        </>
      ) : (
        /* Feedback */
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Result */}
            <motion.div
              className={`rounded-[2.5rem] p-6 sm:p-8 border border-white/30 backdrop-blur-2xl shadow-2xl ${
                lastAnswerCorrect ? 'bg-white/40 dark:bg-emerald-500/10' : 'bg-white/40 dark:bg-amber-500/10'
              }`}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  lastAnswerCorrect ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {lastAnswerCorrect ? <Check size={28} strokeWidth={3} /> : <X size={28} strokeWidth={3} />}
                </div>
                <div>
                  <h3 className={`text-2xl font-black font-display ${lastAnswerCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {lastAnswerCorrect ? 'Stellar Work!' : 'Almost There'}
                  </h3>
                </div>
              </div>

              {/* Correct sentence with time clue highlighting */}
              <div className="mb-5 p-5 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-text-muted/40 mb-3">Correct Transformation:</div>
                <p className="text-xl sm:text-2xl font-display font-black text-text">&ldquo;{highlightTimeClues(question.targetSentence)}&rdquo;</p>
                <InlineInfoTooltip text="Highlighted words are time clues." className="mt-2" />
              </div>

              {/* Grammar explanation */}
              <div className={`p-5 rounded-2xl border-l-4 ${lastAnswerCorrect ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-amber-500/5 border-amber-500/40'}`}>
                <div className="flex items-start gap-3">
                  <Lightbulb size={20} className={`${lastAnswerCorrect ? 'text-emerald-600' : 'text-amber-600'} mt-0.5`} />
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-text-muted/40 mb-1">Grammar Logic</div>
                    <p className="text-base font-medium text-text leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Mini-dialogue */}
              <TenseDialogueCard
                dialogue={question.realLifeDialogue}
                tenseName={question.targetTense}
              />
            </motion.div>

            {/* Target timeline revealed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2rem] border border-white/30 bg-white/60 dark:bg-[#162b3d]/60 p-5 sm:p-6 shadow-md"
            >
              <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3">{question.targetTense} Timeline</div>
              <TimelineCanvas
                elements={question.targetElements}
                interactive={false}
                showLabels={true}
                pastTimelineLayout={targetSplit ? 'split' : 'single'}
              />
            </motion.div>

            {/* Continue */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onNext}
              className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>Next Question</span>
              <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
