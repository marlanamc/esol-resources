'use client';

import { Fragment, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { ProductionExercise } from '@/data/timeline-time-expressions';

interface TimeSignalsProductionProps {
  exercises: ProductionExercise[];
  groupTone: string;
  groupBorder: string;
  groupIconBg: string;
  onComplete: (correct: number, total: number) => void;
  onGoToExercises: () => void;
}

const MAX_PRODUCTION_QUESTIONS = 8;

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderTextWithBlank(text: string, verbBase: string) {
  const parts = text.split('______');

  if (parts.length === 1) {
    return text;
  }

  return parts.flatMap((part, index) => {
    if (index === parts.length - 1) return [part];
    return [
      part,
      <span
        key={`blank-${index}`}
        className="inline-block px-2 py-0.5 rounded-md bg-white dark:bg-[#22364b] border border-border/60 font-black text-text"
      >
        ______ ({verbBase})
      </span>,
    ];
  });
}

function renderWithHighlight(sentence: string, verbBase: string, timeSignal: string, highlightClass: string) {
  const escaped = timeSignal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matcher = new RegExp(`(${escaped})`, 'i');
  const parts = sentence.split(matcher);

  return parts.map((part, index) => {
    if (part.toLowerCase() === timeSignal.toLowerCase()) {
      return (
        <span
          key={`highlight-${index}`}
          className={`px-1.5 py-0.5 rounded-md border ${highlightClass}`}
        >
          {renderTextWithBlank(part, verbBase)}
        </span>
      );
    }

    return <Fragment key={`text-${index}`}>{renderTextWithBlank(part, verbBase)}</Fragment>;
  });
}

export function TimeSignalsProduction({
  exercises,
  groupTone,
  groupBorder,
  groupIconBg,
  onComplete,
  onGoToExercises,
}: TimeSignalsProductionProps) {
  const questionSet = useMemo(() => {
    const seed = exercises.length * 41;
    return shuffleArray(exercises, seed).slice(0, MAX_PRODUCTION_QUESTIONS);
  }, [exercises]);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questionSet[qIndex];
  const correctIndex = question.options.findIndex((option) => option.isCorrect);
  const isAnswered = selected !== null;
  const isCorrect = selected === correctIndex;

  function handleSelect(optionIndex: number) {
    if (isAnswered) return;
    setSelected(optionIndex);
    if (optionIndex === correctIndex) {
      setCorrectCount((count) => count + 1);
    }
  }

  function handleNext() {
    if (qIndex + 1 >= questionSet.length) {
      setFinished(true);
      onComplete(correctCount + (isCorrect ? 0 : 0), questionSet.length);
      return;
    }

    setQIndex((index) => index + 1);
    setSelected(null);
  }

  if (finished) {
    const pct = Math.round((correctCount / questionSet.length) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
          <span className="text-4xl">{pct >= 70 ? '🎉' : '💪'}</span>
        </div>
        <div>
          <p className="font-display text-3xl font-black text-text mb-1">
            {correctCount} / {questionSet.length}
          </p>
          <p className="text-text-muted font-medium">
            {pct >= 90
              ? 'Excellent! You are choosing the right verb forms with these time signals.'
              : pct >= 70
              ? 'Good work! Review the explanations, then try another set.'
              : 'Keep practising. The time signal tells you what tense pattern to expect.'}
          </p>
        </div>
        <button
          onClick={() => { setQIndex(0); setSelected(null); setCorrectCount(0); setFinished(false); }}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onGoToExercises}
          className="px-6 py-3 rounded-xl font-bold border border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/30 transition-colors"
        >
          Back to Time Signals
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-xs font-bold text-text-muted/50 uppercase tracking-wider">
        <span>Question {qIndex + 1} of {questionSet.length}</span>
        <span>{correctCount} correct</span>
      </div>
      <div className="h-1.5 bg-border/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-secondary rounded-full"
          animate={{ width: `${(qIndex / questionSet.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className="flex flex-col gap-5"
        >
          <div className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/50 mb-3">
              Choose the correct verb form
            </p>
            <p className="text-xl font-display font-bold text-text leading-relaxed">
              {renderWithHighlight(
                question.sentence,
                question.verbBase,
                question.timeSignal,
                `${groupBorder} ${groupIconBg} ${groupTone}`
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              const isRight = option.isCorrect;
              let borderClass = 'border-border/40 hover:border-border';
              let bgClass = 'bg-white dark:bg-[#162b3d]';

              if (isAnswered) {
                if (isRight) {
                  borderClass = 'border-secondary';
                  bgClass = 'bg-secondary/5 dark:bg-secondary/10';
                } else if (isSelected) {
                  borderClass = 'border-error';
                  bgClass = 'bg-error/5 dark:bg-error/10';
                }
              }

              return (
                <motion.button
                  key={`${question.id}-${option.conjugated}`}
                  onClick={() => handleSelect(index)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.01 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                  className={`relative flex items-start justify-between gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${borderClass} ${bgClass}`}
                >
                  <div>
                    <p className="text-lg font-black text-text">{option.conjugated}</p>
                    <p className="text-sm text-text-muted/70 font-medium">{option.tenseName}</p>
                  </div>
                  {isAnswered && (isRight || isSelected) && (
                    <div className="pt-0.5">
                      {isRight
                        ? <CheckCircle size={18} className="text-secondary" />
                        : <XCircle size={18} className="text-error" />
                      }
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-4 ${
                isCorrect
                  ? 'bg-secondary/5 border-secondary/20'
                  : 'bg-error/5 border-error/20'
              }`}
            >
              <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-secondary' : 'text-error'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <p className="text-sm text-text-muted leading-snug">{question.explanation}</p>
            </motion.div>
          )}

          {isAnswered && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg hover:bg-primary-dark transition-colors"
            >
              {qIndex + 1 >= questionSet.length ? 'See Results' : 'Next →'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
