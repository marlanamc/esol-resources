'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import type { StoryBuilderQuestion } from '@/types/activity';
import { TimelineCanvas } from '../TimelineCanvas';
import { elementsUseSplitPast } from '../timelineTensesUtils';
import { useTimelineAudio } from '../hooks/useTimelineAudio';
import { areExerciseAnswersEquivalent } from '@/lib/exercise-answer-normalization';

interface StoryBuilderExerciseProps {
  question: StoryBuilderQuestion;
  onSubmit: (answer: { completedSentences: number }, isCorrect: boolean, tenseName?: string) => void;
  onNext: () => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
}

/**
 * Split a sentence template into words.
 * Words with the pattern "___ (verb)" become blank inputs.
 */
function splitTemplate(template: string): string[] {
  return template.split(/\s+/);
}

function shouldHideStoryTemplateToken(word: string, inHint: boolean): {
  hide: boolean;
  nextInHint: boolean;
} {
  if (inHint) {
    return {
      hide: true,
      nextInHint: !word.endsWith(')'),
    };
  }

  if (word.startsWith('(')) {
    return {
      hide: true,
      nextInHint: !word.endsWith(')'),
    };
  }

  return { hide: false, nextInHint: false };
}

export function extractStoryBlankHint(
  templateWords: string[],
  blankIndex: number
): string {
  const hintWords: string[] = [];

  for (let index = blankIndex + 1; index < templateWords.length; index += 1) {
    const word = templateWords[index];

    if (!word.startsWith('(') && hintWords.length === 0) {
      break;
    }

    const cleanedWord = word.replace(/^\(/, '').replace(/\)$/, '');
    if (cleanedWord.length > 0) {
      hintWords.push(cleanedWord);
    }

    if (word.endsWith(')')) {
      break;
    }
  }

  return hintWords.join(' ');
}

export function buildStorySentenceReviewText(
  template: string,
  blanks: StoryBuilderQuestion["sentences"][number]["blanks"]
): string {
  const words = splitTemplate(template);
  const blankMap = new Map(
    blanks.map((blank) => [blank.index, blank.validAnswers[0] ?? ""])
  );
  let inHint = false;

  return words
    .flatMap((word, index) => {
      if (blankMap.has(index)) {
        return [blankMap.get(index) ?? ""];
      }
      if (word === "___") {
        return [];
      }
      const hintState = shouldHideStoryTemplateToken(word, inHint);
      inHint = hintState.nextInHint;
      if (hintState.hide) {
        return [];
      }
      return [word];
    })
    .join(" ");
}

export function StoryBuilderExercise({
  question,
  onSubmit,
  onNext,
  showFeedback,
  lastAnswerCorrect,
}: StoryBuilderExerciseProps) {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [sentenceCorrect, setSentenceCorrect] = useState<boolean | null>(null);
  const [completedSentences, setCompletedSentences] = useState<number>(0);
  // Revealed timeline elements grow as sentences are completed
  const [revealedElements, setRevealedElements] = useState<typeof question.fullTimelineElements>([]);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const { playPing, playThump } = useTimelineAudio();

  const currentSentence = question.sentences[currentSentenceIdx];
  const isLastSentence = currentSentenceIdx === question.sentences.length - 1;
  const templateWords = splitTemplate(currentSentence.template);
  const blankIndices = new Set(currentSentence.blanks.map((b) => b.index));

  const allFilled = currentSentence.blanks.every(
    (b) => (inputs[b.index]?.trim() ?? '') !== ''
  );

  const checkCurrentSentence = useCallback((): boolean => {
    return currentSentence.blanks.every((blank) => {
      const typed = inputs[blank.index]?.trim() ?? '';
      return blank.validAnswers.some((ans) => areExerciseAnswersEquivalent(typed, ans));
    });
  }, [currentSentence.blanks, inputs]);

  const handleCheckSentence = useCallback(() => {
    const isCorrect = checkCurrentSentence();
    setSentenceCorrect(isCorrect);
    if (isCorrect) {
      playPing();
      // Grow the timeline
      setRevealedElements((prev) => [...prev, ...currentSentence.elements]);
      setCompletedSentences((n) => n + 1);
    } else {
      playThump();
    }
  }, [checkCurrentSentence, currentSentence.elements, playPing, playThump]);

  const handleNextSentence = useCallback(() => {
    if (isLastSentence) {
      // Story complete — report to parent
      const allCorrect = completedSentences === question.sentences.length;
      onSubmit({ completedSentences }, allCorrect, 'Story Complete');
      return;
    }
    setCurrentSentenceIdx((i) => i + 1);
    setInputs({});
    setSentenceCorrect(null);
  }, [isLastSentence, completedSentences, question.sentences.length, onSubmit]);

  const useSplit = elementsUseSplitPast(revealedElements.length > 0 ? revealedElements : question.fullTimelineElements);

  return (
    <div className="px-2 sm:px-0 max-w-full overflow-hidden">
      {/* Story header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-primary" />
            <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">
              Story Builder
            </div>
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {question.sentences.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < currentSentenceIdx
                    ? 'bg-emerald-500'
                    : i === currentSentenceIdx
                    ? 'bg-primary scale-125'
                    : 'bg-border/40'
                }`}
              />
            ))}
          </div>
        </div>
        <h2 className="text-xl font-display font-black text-text">{question.storyTitle}</h2>
        <p className="text-sm text-text-muted font-medium mt-1">{question.storyPrompt}</p>
      </motion.div>

      {/* Growing timeline */}
      <AnimatePresence mode="wait">
        {revealedElements.length > 0 && (
          <motion.div
            key={revealedElements.length}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2rem] border border-white/30 p-4 sm:p-6 mb-6 shadow-md"
          >
            <div className="text-xs font-black text-text-muted/40 uppercase tracking-[0.2em] mb-3">Your Story Timeline</div>
            <TimelineCanvas
              elements={revealedElements}
              interactive={false}
              showLabels={false}
              pastTimelineLayout={useSplit ? 'split' : 'single'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!showFeedback ? (
        <>
          {/* Current sentence */}
          <motion.div
            key={currentSentenceIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 dark:bg-[#162b3d]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 p-6 sm:p-8 mb-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                Sentence {currentSentenceIdx + 1} — {currentSentence.targetTense}
              </div>
            </div>

            {/* Context hint */}
            <div className="mb-4 p-3 rounded-2xl bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-2">
                <Lightbulb size={15} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs font-bold text-text-muted">{currentSentence.contextHint}</p>
              </div>
            </div>

            {/* Inline sentence with inputs */}
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-3 text-xl sm:text-2xl font-display font-black text-text leading-relaxed">
              {(() => {
                let inHint = false;

                return templateWords.map((word, idx) => {
                if (blankIndices.has(idx)) {
                  const blank = currentSentence.blanks.find((b) => b.index === idx)!;
                  const blankHint = extractStoryBlankHint(templateWords, idx);
                  const wordCount = blank.validAnswers[0].split(' ').length;
                  return (
                    <span key={idx} className="inline-flex flex-col items-center gap-1 align-middle">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-primary/60">
                        {blankHint || 'verb'}
                      </span>
                      <input
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        value={inputs[idx] ?? ''}
                        onChange={(e) => setInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && allFilled) handleCheckSentence();
                        }}
                        placeholder={`___(${wordCount}w)`}
                        aria-label={`Use the base verb ${blankHint || 'verb'}`}
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        className="inline-block min-w-[90px] border-b-2 border-primary bg-transparent text-primary placeholder-primary/30 focus:outline-none focus:border-primary-dark text-xl font-display font-black text-center transition-colors"
                        style={{ width: `${Math.max(8, (inputs[idx]?.length ?? Math.max(blankHint.length, 4)) + 2)}ch` }}
                      />
                    </span>
                  );
                }
                if (word === '___') return null;
                const hintState = shouldHideStoryTemplateToken(word, inHint);
                inHint = hintState.nextInHint;
                if (hintState.hide) return null;
                return <span key={idx}>{word}</span>;
              });
              })()}
            </div>

            {/* Inline feedback for the sentence */}
            <AnimatePresence>
              {sentenceCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 p-3 rounded-2xl flex items-center gap-3 ${
                    sentenceCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                  }`}
                >
                  {sentenceCorrect ? (
                    <Check size={16} className="text-emerald-500" strokeWidth={3} />
                  ) : (
                    <X size={16} className="text-amber-500" strokeWidth={3} />
                  )}
                  <span className={`text-sm font-bold ${sentenceCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {sentenceCorrect
                      ? 'Perfect! The timeline is growing.'
                      : `Try again. Correct: ${currentSentence.blanks.map((b) => b.validAnswers[0]).join(', ')}`}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 dark:bg-[#162b3d]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-4 sm:p-6 shadow-lg"
          >
            {sentenceCorrect ? (
              <button
                onClick={handleNextSentence}
                className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLastSentence ? 'Finish Story' : 'Next Sentence'}
                <ArrowRight size={22} />
              </button>
            ) : (
              <button
                onClick={handleCheckSentence}
                disabled={!allFilled}
                className="w-full py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-[0_12px_24px_-8px_rgba(var(--primary-color-rgb),0.5)] hover:bg-primary-dark transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check Sentence
              </button>
            )}
          </motion.div>
        </>
      ) : (
        /* Final story feedback */
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
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
                    {lastAnswerCorrect ? 'Story Complete!' : 'Story Finished'}
                  </h3>
                  <p className="text-sm text-text-muted font-medium mt-1">
                    {completedSentences} / {question.sentences.length} sentences correct
                  </p>
                </div>
              </div>

              {/* Full story text */}
              <div className="p-5 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 space-y-2">
                {question.sentences.map((s, i) => (
                  <p key={i} className="text-base font-medium text-text leading-relaxed">
                    <span className="text-xs font-black text-primary/60 uppercase tracking-widest mr-2">{s.targetTense}</span>
                    {buildStorySentenceReviewText(s.template, s.blanks)}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Complete timeline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2rem] border border-white/30 bg-white/60 dark:bg-[#162b3d]/60 p-5 sm:p-6 shadow-md"
            >
              <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3">Complete Story Timeline</div>
              <TimelineCanvas
                elements={question.fullTimelineElements}
                interactive={false}
                showLabels={true}
                pastTimelineLayout={elementsUseSplitPast(question.fullTimelineElements) ? 'split' : 'single'}
              />
            </motion.div>

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
