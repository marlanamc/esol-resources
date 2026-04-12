'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { TimelineCanvas } from '../TimelineCanvas';
import { highlightSentenceFeatures } from '../highlightUtils';
import type { TimeSignalExample, TimeSignalGroup, TimeSignalEntry } from '@/data/timeline-time-expressions';
import type { TimelineElement } from '@/types/activity';

interface QuizQuestion {
  entry: TimeSignalEntry;
  groupId: string;
  example: TimeSignalExample;
  options: TimelineElement[][];
  correctIndex: number;
}

interface TimeSignalsQuizProps {
  group: TimeSignalGroup;
  onComplete: (correct: number, total: number) => void;
  onGoToExercises?: () => void;
}

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

const MAX_QUIZ_QUESTIONS = 8;

function buildQuestions(group: TimeSignalGroup): QuizQuestion[] {
  const allQuestions = group.expressions.flatMap((entry, i) => {
    const distractors = entry.quizDistractors ?? [
      [{ id: 'e1', type: 'single-dot' as const, zone: 'past' as const, position: 50 }],
      [{ id: 'e1', type: 'multiple-dots' as const, zone: 'present' as const, position: 50 }],
      [{ id: 'e1', type: 'solid-line' as const, zone: 'past' as const, position: 50 }],
    ];

    const pool: TimelineElement[][] = [entry.timelineElements, ...distractors.slice(0, 3)];
    const shuffled = shuffleArray(pool, i * 37 + group.id.charCodeAt(0));
    const correctIndex = shuffled.indexOf(entry.timelineElements);
    const examples = entry.commonExamples ?? [
      { sentence: entry.exampleSentence, verbPhrase: entry.verbPhrase },
    ];

    return examples.map((example) => ({
      entry,
      groupId: group.id,
      example,
      options: shuffled,
      correctIndex,
    }));
  });
  // Cap at MAX_QUIZ_QUESTIONS using a deterministic shuffle so every student gets the same set
  const seed = group.id.charCodeAt(0) * 31 + group.expressions.length;
  const shuffledAll = shuffleArray(allQuestions, seed);
  return shuffledAll.slice(0, MAX_QUIZ_QUESTIONS);
}

export function TimeSignalsQuiz({ group, onComplete, onGoToExercises }: TimeSignalsQuizProps) {
  const questions = useMemo(() => buildQuestions(group), [group]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[qIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === question.correctIndex;

  function handleSelect(optionIndex: number) {
    if (isAnswered) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (qIndex + 1 >= questions.length) {
      setFinished(true);
      onComplete(correctCount, questions.length);
    } else {
      setQIndex((q) => q + 1);
      setSelected(null);
    }
  }

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
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
            {correctCount} / {questions.length}
          </p>
          <p className="text-text-muted font-medium">
            {pct >= 90
              ? 'Excellent! You know these time signals well.'
              : pct >= 70
              ? 'Good work! Review the ones you missed in Explore mode.'
              : 'Keep practising — try the Explore cards again before re-quizzing.'}
          </p>
        </div>
        <button
          onClick={() => { setQIndex(0); setSelected(null); setCorrectCount(0); setFinished(false); }}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
        {onGoToExercises && (
          <button
            onClick={onGoToExercises}
            className="px-6 py-3 rounded-xl font-bold border border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/30 transition-colors"
          >
            Go to Exercises →
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-bold text-text-muted/50 uppercase tracking-wider">
        <span>Question {qIndex + 1} of {questions.length}</span>
        <span>{correctCount} correct</span>
      </div>
      <div className="h-1.5 bg-border/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-secondary rounded-full"
          animate={{ width: `${((qIndex) / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className="flex flex-col gap-5"
        >
          {/* Sentence */}
          <div className="bg-white dark:bg-[#162b3d] rounded-2xl border border-border dark:border-white/10 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/50 mb-3">
              Which timeline matches this example use?
            </p>
            <p className="text-xl font-display font-bold text-text leading-snug">
              &ldquo;{highlightSentenceFeatures(question.example.sentence, question.example.verbPhrase)}&rdquo;
            </p>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((elements, i) => {
              const isSelected = selected === i;
              const isRight = i === question.correctIndex;
              let borderClass = 'border-border/40 hover:border-border';
              let bgClass = 'bg-white dark:bg-[#162b3d]';

              if (isAnswered) {
                if (isRight) {
                  borderClass = 'border-secondary';
                  bgClass = 'bg-secondary/5 dark:bg-secondary/10';
                } else if (isSelected && !isRight) {
                  borderClass = 'border-error';
                  bgClass = 'bg-error/5 dark:bg-error/10';
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  className={`relative p-3 rounded-2xl border-2 transition-all duration-200 ${borderClass} ${bgClass} ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  {isAnswered && (isRight || isSelected) && (
                    <div className="absolute top-2 right-2">
                      {isRight
                        ? <CheckCircle size={16} className="text-secondary" />
                        : <XCircle size={16} className="text-error" />
                      }
                    </div>
                  )}
                  <TimelineCanvas elements={elements} showLabels={false} />
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
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
              <p className="text-sm text-text-muted leading-snug">{question.entry.meaning}</p>
              {question.entry.notes && (
                <p className="text-xs text-text-muted/70 mt-2 font-medium">{question.entry.notes}</p>
              )}
            </motion.div>
          )}

          {/* Next button */}
          {isAnswered && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg hover:bg-primary-dark transition-colors"
            >
              {qIndex + 1 >= questions.length ? 'See Results' : 'Next →'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
