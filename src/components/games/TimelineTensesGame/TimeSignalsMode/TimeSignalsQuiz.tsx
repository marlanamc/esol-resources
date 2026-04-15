'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { TimelineCanvas } from '../TimelineCanvas';
import { highlightSentenceFeatures } from '../highlightUtils';
import type { TimeSignalGroup, TimeSignalEntry } from '@/data/timeline-time-expressions';
import { getAllTimeSignalEntries } from '@/data/timeline-time-expressions';
import type { TimelineElement } from '@/types/activity';
import { getTimeSignalTimelineLabel } from './timeSignalTimelineCanon';
import { getTimeSignalQuizExamples } from './timeSignalQuizBank';

interface QuizQuestionSource {
  sentence: string;
  verbPhrase: string;
  verbPhrase2?: string;
  timelineElements: TimelineElement[];
  quizDistractors?: TimelineElement[][];
  contextLabel?: string;
  note?: string;
  isContextual: boolean;
}

interface QuizQuestion {
  entry: TimeSignalEntry;
  groupId: string;
  source: QuizQuestionSource;
  options: {
    elements: TimelineElement[];
    label: string;
  }[];
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
const MAX_QUIZ_OPTIONS = 4;

type TimelineOption = {
  elements: TimelineElement[];
  label: string;
};

const ALL_TIME_SIGNAL_ENTRIES = getAllTimeSignalEntries();

function timelineSignature(elements: TimelineElement[]): string {
  return elements
    .map((element) => `${element.type}|${element.zone}|${Math.round(element.position / 5) * 5}`)
    .sort()
    .join('::');
}

function cloneTimelineElements(elements: TimelineElement[], suffix: string): TimelineElement[] {
  return elements.map((element, index) => ({
    ...element,
    id: `${element.id}-${suffix}-${index}`,
  }));
}

function makeWrongVariant(elements: TimelineElement[], variantIndex: number): TimelineElement[] {
  const variant = variantIndex % 4;
  const fallbackVariants: Array<{
    zone: TimelineElement['zone'];
    type: TimelineElement['type'];
    positionShift: number;
  }> = [
    { zone: 'future', type: 'arc-dashed', positionShift: -12 },
    { zone: 'present', type: 'multiple-dots', positionShift: 12 },
    { zone: 'past-earlier', type: 'solid-line', positionShift: 0 },
    { zone: 'past-later', type: 'single-dot', positionShift: 8 },
  ];

  const selected = fallbackVariants[variant];

  return elements.map((element, index) => ({
    ...element,
    id: `${element.id}-wrong-${variantIndex}-${index}`,
    zone: selected.zone,
    type: selected.type,
    position: Math.max(20, Math.min(380, element.position + selected.positionShift + (index * 4))),
  }));
}

function buildTimelineOptions(
  group: TimeSignalGroup,
  entry: TimeSignalEntry,
  correctTimelineElements: TimelineElement[],
  quizDistractors?: TimelineElement[][],
  includeBaseTimelineAsDistractor = false
): TimelineOption[] {
  const correctSignature = timelineSignature(correctTimelineElements);
  const seen = new Set<string>([correctSignature]);
  const options: TimelineOption[] = [];

  const tryAdd = (elements: TimelineElement[], label: string) => {
    const signature = timelineSignature(elements);
    if (seen.has(signature)) return;
    seen.add(signature);
    options.push({ elements, label });
  };

  if (quizDistractors && quizDistractors.length > 0) {
    for (const distractor of quizDistractors) {
      tryAdd(cloneTimelineElements(distractor, 'entry-distractor'), getTimeSignalTimelineLabel(distractor));
    }
  }

  if (includeBaseTimelineAsDistractor) {
    tryAdd(cloneTimelineElements(entry.timelineElements, `base-${entry.word}`), 'Base use');
  }

  for (const candidate of group.expressions) {
    if (options.length >= MAX_QUIZ_OPTIONS - 1) break;
    tryAdd(cloneTimelineElements(candidate.timelineElements, `same-group-${candidate.word}`), getTimeSignalTimelineLabel(candidate.timelineElements));
  }

  if (options.length < MAX_QUIZ_OPTIONS - 1) {
    for (const candidate of ALL_TIME_SIGNAL_ENTRIES) {
      if (candidate.word === entry.word || candidate.groupId === group.id) continue;
      if (options.length >= MAX_QUIZ_OPTIONS - 1) break;
      tryAdd(cloneTimelineElements(candidate.timelineElements, `global-${candidate.groupId}-${candidate.word}`), candidate.groupId);
    }
  }

  let fallbackIndex = 0;
  while (options.length < MAX_QUIZ_OPTIONS - 1 && fallbackIndex < 6) {
    tryAdd(makeWrongVariant(entry.timelineElements, fallbackIndex), 'Common trap');
    fallbackIndex += 1;
  }

  return options;
}

function makePrimarySources(group: TimeSignalGroup, entry: TimeSignalEntry): QuizQuestionSource[] {
  const examples = getTimeSignalQuizExamples(group, entry);

  return examples.map((example) => ({
    sentence: example.sentence,
    verbPhrase: example.verbPhrase,
    verbPhrase2: example.verbPhrase2,
    timelineElements: example.timelineElements,
    quizDistractors: entry.quizDistractors,
    note: example.note ?? entry.notes,
    isContextual: false,
  }));
}

function normalizeSentence(sentence: string): string {
  return sentence.toLowerCase().replace(/\s+/g, ' ').trim();
}

function timelineBucket(question: QuizQuestion): string {
  const elements = question.source.timelineElements;
  const hasArc = elements.some((element) => element.type === 'arc' || element.type === 'arc-dashed');
  const hasRepeats = elements.some((element) => element.type === 'multiple-dots');
  const hasPast = elements.some((element) => element.zone === 'past' || element.zone === 'past-earlier' || element.zone === 'past-later');
  const hasPresent = elements.some((element) => element.zone === 'present');
  const hasFuture = elements.some((element) => element.zone === 'future');

  if (hasArc && hasFuture) return 'future-perfect';
  if (hasArc) return 'present-perfect';
  if (hasRepeats && hasPast) return 'past-habit';
  if (hasRepeats && hasPresent) return 'present-habit';
  if (hasFuture) return 'future';
  if (hasPast) return 'past';
  if (hasPresent) return 'present';
  return 'other';
}

function selectDiverseQuestions(allQuestions: QuizQuestion[], maxQuestions: number): QuizQuestion[] {
  const selected: QuizQuestion[] = [];
  const usedSentences = new Set<string>();
  const usedWords = new Set<string>();
  const usedBuckets = new Set<string>();
  const remaining = [...allQuestions];

  const takeQuestion = (index: number) => {
    const [question] = remaining.splice(index, 1);
    selected.push(question);
    usedSentences.add(normalizeSentence(question.source.sentence));
    usedWords.add(question.entry.word);
    usedBuckets.add(timelineBucket(question));
  };

  // First pass: spread across timeline buckets so one run is not overloaded with the same
  // present-vs-past pattern, especially in dense groups like Frequency Markers.
  while (selected.length < maxQuestions && remaining.length > 0) {
    const lastWord = selected[selected.length - 1]?.entry.word;

    const freshBucketIndex = remaining.findIndex((question) => {
      const normalized = normalizeSentence(question.source.sentence);
      const bucket = timelineBucket(question);
      return !usedSentences.has(normalized) && !usedBuckets.has(bucket) && question.entry.word !== lastWord;
    });

    if (freshBucketIndex >= 0) {
      takeQuestion(freshBucketIndex);
      continue;
    }

    break;
  }

  while (selected.length < maxQuestions && remaining.length > 0) {
    const lastWord = selected[selected.length - 1]?.entry.word;

    const preferredFreshWordIndex = remaining.findIndex((question) => {
      const normalized = normalizeSentence(question.source.sentence);
      return !usedSentences.has(normalized) && !usedWords.has(question.entry.word) && question.entry.word !== lastWord;
    });

    if (preferredFreshWordIndex >= 0) {
      takeQuestion(preferredFreshWordIndex);
      continue;
    }

    const anyFreshWordIndex = remaining.findIndex((question) => {
      const normalized = normalizeSentence(question.source.sentence);
      return !usedSentences.has(normalized) && !usedWords.has(question.entry.word);
    });

    if (anyFreshWordIndex >= 0) {
      takeQuestion(anyFreshWordIndex);
      continue;
    }

    break;
  }

  while (selected.length < maxQuestions && remaining.length > 0) {
    const lastWord = selected[selected.length - 1]?.entry.word;

    const preferredIndex = remaining.findIndex((question) => {
      const normalized = normalizeSentence(question.source.sentence);
      return !usedSentences.has(normalized) && question.entry.word !== lastWord;
    });

    if (preferredIndex >= 0) {
      takeQuestion(preferredIndex);
      continue;
    }

    const uniqueSentenceIndex = remaining.findIndex((question) => {
      const normalized = normalizeSentence(question.source.sentence);
      return !usedSentences.has(normalized);
    });

    if (uniqueSentenceIndex >= 0) {
      takeQuestion(uniqueSentenceIndex);
      continue;
    }

    break;
  }

  return selected;
}

function buildQuestions(group: TimeSignalGroup): QuizQuestion[] {
  const allQuestions = group.expressions.flatMap((entry, i) => {
    const sources = makePrimarySources(group, entry);

    return sources.map((source, sourceIndex) => {
      const correctTimeline = cloneTimelineElements(
        source.timelineElements,
        `correct-${entry.word}-${source.isContextual ? 'context' : 'base'}-${sourceIndex}`
      );
      const options: TimelineOption[] = buildTimelineOptions(
        group,
        entry,
        source.timelineElements,
        source.quizDistractors,
        source.isContextual
      );
      const preparedOptions = shuffleArray(
        [
          { elements: correctTimeline, label: getTimeSignalTimelineLabel(correctTimeline) },
          ...options,
        ],
        i * 37 + sourceIndex * 17 + group.id.charCodeAt(0)
      ).slice(0, MAX_QUIZ_OPTIONS);

      const correctSignature = timelineSignature(correctTimeline);
      const correctIndex = preparedOptions.findIndex((option) => timelineSignature(option.elements) === correctSignature);

      return {
        entry,
        groupId: group.id,
        source,
        options: preparedOptions,
        correctIndex,
      };
    });
  });
  // Cap at MAX_QUIZ_QUESTIONS using a deterministic shuffle so every student gets the same set
  const seed = group.id.charCodeAt(0) * 31 + group.expressions.length;
  const shuffledAll = shuffleArray(allQuestions, seed);
  return selectDiverseQuestions(shuffledAll, MAX_QUIZ_QUESTIONS);
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
            Back to Time Signals
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
            {question.source.contextLabel && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wide text-secondary">
                  {question.source.contextLabel}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-bold">
                  Context shift
                </span>
              </div>
            )}
            <p className="text-xl font-display font-bold text-text leading-snug">
              &ldquo;{highlightSentenceFeatures(
                question.source.sentence,
                question.source.verbPhrase,
                question.source.verbPhrase2
              )}&rdquo;
            </p>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, i) => {
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
                  <TimelineCanvas elements={option.elements} showLabels={false} />
                  <p className="text-[10px] text-text-muted mt-2 font-medium">{option.label}</p>
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
              {question.source.contextLabel && (
                <p className="text-xs text-secondary mt-2 font-black uppercase tracking-wide">
                  {question.source.contextLabel}
                </p>
              )}
              {question.source.note ? (
                <p className="text-xs text-text-muted/70 mt-2 font-medium">{question.source.note}</p>
              ) : question.entry.notes && (
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
