'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, Play, Sparkles, AlertCircle, Lightbulb,
  CheckCircle2, XCircle, ArrowDown,
} from 'lucide-react';
import type { POSGroup, POSRoundMode, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_COLORS, POS_LABELS } from '@/types/parts-of-speech';
import { DiagramSentence } from './DiagramSentence';

function patternToBullets(pattern: string): string[] {
  return pattern
    .split(/(?<=[.!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// Stable shuffle using a seed derived from group id + step to prevent re-ordering on re-render
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 7)) % (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const DISTRACTOR_POS: PartOfSpeech[] = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction'];

interface CheckpointQuestion {
  questionText: string;
  sentenceDisplay: string | null; // the sentence to show, or null if not needed
  highlightWord: string | null;
  options: string[];
  correctIndex: number;
  feedbackCorrect: string;
  feedbackWrong: string;
}

function buildCheckpointQuestion(
  group: POSGroup,
  patternIndex: number,
  seed: number,
): CheckpointQuestion | null {
  const pattern = group.patterns[patternIndex % group.patterns.length];
  const example = pattern?.examples?.[0];
  if (!pattern || !example) return null;

  const word = example.highlightWord ?? pattern.word;
  const correctPOS = pattern.partOfSpeech;
  const correctLabel = POS_LABELS[correctPOS];

  // Pick 2 distractors that are different from the correct POS
  const distractors = DISTRACTOR_POS
    .filter(p => p !== correctPOS)
    .slice(0, 2)
    .map(p => POS_LABELS[p]);

  const unshuffled = [...distractors, correctLabel];
  const shuffled = seededShuffle(unshuffled, seed);
  const correctIndex = shuffled.indexOf(correctLabel);

  const sentence = example.sentence ?? null;

  return {
    questionText: `What part of speech is "${word}" in this sentence?`,
    sentenceDisplay: sentence,
    highlightWord: word,
    options: shuffled,
    correctIndex,
    feedbackCorrect: `Correct! "${word}" is a ${correctLabel.toLowerCase()} — you've got it.`,
    feedbackWrong: `Not quite. "${word}" is a ${correctLabel.toLowerCase()}. Look for it highlighted in the sentence above.`,
  };
}

interface PatternWalkthroughScreenProps {
  group: POSGroup;
  roundMode: POSRoundMode;
  onStartChallenge: () => void;
  onBack: () => void;
}

interface WalkthroughStep {
  id: string;
  label: string;
  patternIndex: number; // which group pattern to use for the checkpoint question
  hasQuestion: boolean;
}

export function PatternWalkthroughScreen({
  group,
  roundMode,
  onStartChallenge,
  onBack,
}: PatternWalkthroughScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  // Per-step answer tracking (null = unanswered, number = chosen option index)
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  const displayExamples = useMemo(() => group.patterns
    .slice(0, 5)
    .map(p => ({
      ...p.examples[0],
      word: p.word,
      partOfSpeech: p.partOfSpeech,
    })), [group]);

  const groupPOS = useMemo(() => [...new Set(group.patterns.map(p => p.partOfSpeech))], [group]);
  const hasExamples = displayExamples.length > 0;
  const hasMistakes = group.patterns.some(p => p.commonError);
  const hasWordFamilies = group.patterns.some(p => p.wordFamily?.length);

  // Build steps once
  const steps: WalkthroughStep[] = useMemo(() => {
    const list: WalkthroughStep[] = [
      { id: 'intro', label: "What we're learning", patternIndex: 0, hasQuestion: true },
      { id: 'rules', label: 'The rules', patternIndex: 1, hasQuestion: true },
    ];
    if (hasExamples) list.push({ id: 'examples', label: 'In action', patternIndex: 2, hasQuestion: true });
    if (hasMistakes) list.push({ id: 'mistakes', label: 'Watch out', patternIndex: 3, hasQuestion: true });
    list.push({ id: 'ready', label: "You're ready!", patternIndex: 0, hasQuestion: false });
    return list;
  }, [hasExamples, hasMistakes]);

  // Pre-compute checkpoint questions (stable across renders)
  const questions = useMemo(() =>
    steps.map((s, i) =>
      s.hasQuestion ? buildCheckpointQuestion(group, s.patternIndex, i * 31 + group.id.charCodeAt(0)) : null
    ),
    [steps, group]
  );

  const step = steps[currentStep];
  const question = questions[currentStep];
  const selectedAnswer = answers[currentStep] ?? null;
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && question !== null && selectedAnswer === question.correctIndex;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  // Can advance: either no question on this step, or user has answered
  const canAdvance = !step.hasQuestion || isAnswered;

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    if (isLast) {
      onStartChallenge();
    } else {
      setDirection(1);
      setCurrentStep(s => s + 1);
    }
  }, [canAdvance, isLast, onStartChallenge]);

  const goPrev = useCallback(() => {
    if (isFirst) {
      onBack();
    } else {
      setDirection(-1);
      setCurrentStep(s => s - 1);
    }
  }, [isFirst, onBack]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return; // locked after first answer
    setAnswers(prev => ({ ...prev, [currentStep]: optionIndex }));
  }, [isAnswered, currentStep]);

  const eyebrow = isLast
    ? 'Last step'
    : `Step ${currentStep + 1} of ${steps.length}`;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 36 : -36 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -36 : 36 }),
  };

  return (
    <div className="max-w-2xl mx-auto pb-28 sm:pb-8">
      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-full transition-all duration-300 ${
              i < currentStep
                ? 'w-2 h-2 bg-primary/60'
                : i === currentStep
                ? 'w-6 h-2 bg-primary'
                : 'w-2 h-2 bg-border'
            }`}
          />
        ))}
      </motion.div>

      {/* Group badge + eyebrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 mb-3"
      >
        <span className="text-xl">{group.icon ?? '📚'}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {group.title}
        </span>
        <span className="ml-auto text-xs font-medium text-text-muted">{eyebrow}</span>
      </motion.div>

      {/* Step heading */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.h2
          key={`heading-${step.id}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="font-display text-2xl sm:text-3xl text-text mb-5 leading-tight"
        >
          {step.label}
        </motion.h2>
      </AnimatePresence>

      {/* Step content + checkpoint */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-5"
        >
          {/* ── Step: intro ─────────────────────────────── */}
          {step.id === 'intro' && (
            <>
              {group.memoryTrick ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-accent/20 to-amber-100/30 dark:from-accent/15 dark:to-amber-900/20 border-2 border-accent/40"
                >
                  <div className="absolute top-2 right-3 text-5xl opacity-10 select-none">{group.icon}</div>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="flex-shrink-0" />
                    Quick rule to remember
                  </p>
                  <p className="text-lg font-bold text-text leading-relaxed">{group.memoryTrick}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/20"
                >
                  <div className="absolute top-2 right-3 text-5xl opacity-10 select-none">{group.icon}</div>
                  <p className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="flex-shrink-0" />
                    Today&apos;s topic
                  </p>
                  <p className="text-lg font-bold text-text leading-relaxed">{group.title}</p>
                </motion.div>
              )}

              {/* POS type badge cluster */}
              {groupPOS.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-bg to-border/10 border-2 border-border shadow-sm"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
                    Part{groupPOS.length > 1 ? 's' : ''} of speech covered
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groupPOS.map((pos, i) => (
                      <motion.span
                        key={pos}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 260, damping: 18 }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${POS_COLORS[pos]}`}
                      >
                        {POS_LABELS[pos]}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              <p className="text-sm text-text-muted leading-relaxed">
                Study the topic above, then answer the quick check below to move on.
              </p>
            </>
          )}

          {/* ── Step: rules ─────────────────────────────── */}
          {step.id === 'rules' && (
            <div className="space-y-4">
              <div className={`p-6 bg-gradient-to-br ${group.colorClass.replace(/bg-\w+-50/, 'from-transparent to-black/5 dark:to-white/5').replace('border-', 'border-2 border-')} border-dashed rounded-3xl shadow-sm relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="text-6xl">{group.icon}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-bold text-text uppercase tracking-wider mb-5 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" />
                    The pattern
                  </p>
                  <div className="space-y-4">
                    {patternToBullets(group.pattern).map((bullet, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/80 dark:bg-black/20 shadow-sm border border-black/5 dark:border-white/5 backdrop-blur-sm">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
                          {i + 1}
                        </div>
                        <p className="text-base text-text-strong font-medium leading-relaxed pt-0.5">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {group.patternExample && (
                <div className="p-5 sm:p-6 bg-white dark:bg-[#162b3d] border-2 border-border shadow-sm rounded-3xl">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                    Example Diagram
                  </p>
                  <DiagramSentence text={group.patternExample} colorClass={group.colorClass} />
                </div>
              )}
            </div>
          )}

          {/* ── Step: examples ──────────────────────────── */}
          {step.id === 'examples' && (
            <div className="space-y-4">
              {groupPOS.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {groupPOS.map(pos => (
                    <span
                      key={pos}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${POS_COLORS[pos]}`}
                    >
                      {POS_LABELS[pos]}
                    </span>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {displayExamples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
                    className={`flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#162b3d] border border-border border-l-4 shadow-sm`}
                    style={{ borderLeftColor: 'var(--color-primary)' }}
                  >
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-xs font-bold border-2 mt-0.5 ${POS_COLORS[ex.partOfSpeech]}`}>
                      {POS_LABELS[ex.partOfSpeech]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-text text-sm leading-relaxed">
                        {ex.sentence?.includes('___') ? (
                          <>
                            {ex.sentence.split('___')[0]}
                            <span className="font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded">
                              {ex.blank ?? ex.highlightWord}
                            </span>
                            {ex.sentence.split('___')[1]}
                          </>
                        ) : (
                          ex.sentence?.split(ex.highlightWord).map((part, j, arr) => (
                            j < arr.length - 1 ? (
                              <span key={j}>
                                {part}
                                <span className="font-bold text-primary bg-primary/15 px-1 rounded">{ex.highlightWord}</span>
                              </span>
                            ) : part
                          ))
                        )}
                      </p>
                      {ex.context && (
                        <p className="text-xs text-text-muted mt-1 italic">{ex.context}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {hasWordFamilies && (
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-900/25 border border-sky-200 dark:border-sky-800">
                  <p className="text-sm font-bold text-sky-800 dark:text-sky-200 flex items-center gap-2 mb-2">
                    <Lightbulb size={14} />
                    Word families — same word, different job
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.patterns.flatMap(p =>
                      (p.wordFamily ?? []).map(wf => (
                        <span
                          key={`${p.id}-${wf.word}`}
                          className={`px-2 py-0.5 rounded-md text-xs font-medium border ${POS_COLORS[wf.partOfSpeech]}`}
                        >
                          {wf.word} ({POS_LABELS[wf.partOfSpeech].toLowerCase()})
                        </span>
                      ))
                    ).slice(0, 8)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step: mistakes ──────────────────────────── */}
          {step.id === 'mistakes' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <AlertCircle size={16} className="text-error flex-shrink-0" />
                <p className="text-sm font-bold text-error">Watch out for these errors</p>
              </div>

              <div className="space-y-4">
                {group.patterns.filter(p => p.commonError).slice(0, 4).map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-border shadow-sm"
                  >
                    {/* Wrong */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-error/5 border-b border-error/15">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center text-xs font-bold mt-0.5">✗</span>
                      <p className="text-sm text-error/90 font-medium">{p.commonError}</p>
                    </div>
                    {/* Arrow */}
                    <div className="flex justify-center py-1 bg-bg-light dark:bg-white/5">
                      <ArrowDown size={14} className="text-text-muted" />
                    </div>
                    {/* Correct */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-secondary/5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                      <p className="text-sm text-secondary font-semibold">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold border mr-2 ${POS_COLORS[p.partOfSpeech]}`}>
                          {POS_LABELS[p.partOfSpeech]}
                        </span>
                        {p.word}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-text-muted leading-relaxed px-1">
                Spotting the mistake before you make it is half the battle.
              </p>
            </div>
          )}

          {/* ── Step: ready ─────────────────────────────── */}
          {step.id === 'ready' && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden border border-border shadow-sm"
              >
                <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-4">
                  <p className="text-white font-bold text-base">Your game plan</p>
                  <p className="text-white/70 text-xs mt-0.5">Two rounds to mastery</p>
                </div>
                <div className="divide-y divide-border bg-white dark:bg-[#162b3d]">
                  <div className="flex items-start gap-4 px-5 py-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/15 text-primary font-bold flex items-center justify-center text-base">1</span>
                    <div>
                      <p className="font-bold text-text text-sm">Round 1 · Discover</p>
                      <p className="text-xs text-text-muted mt-0.5">Score <strong>80%+</strong> to pass → unlocks Round 2</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 px-5 py-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-secondary/15 text-secondary font-bold flex items-center justify-center text-base">2</span>
                    <div>
                      <p className="font-bold text-text text-sm">Round 2 · Master</p>
                      <p className="text-xs text-text-muted mt-0.5">Score <strong>90%+</strong> → earn ✦ mastery badge</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <p className="text-sm text-text-muted leading-relaxed px-1">
                You&apos;ve seen the pattern, the examples, and what to watch out for. Time to try it yourself!
              </p>
            </div>
          )}

          {/* ── Checkpoint question ─────────────────────── */}
          {question && (
            <CheckpointQuestion
              question={question}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              onAnswer={handleAnswer}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Desktop nav */}
      <div className="hidden sm:flex gap-3 pt-8">
        <button
          type="button"
          onClick={goPrev}
          className="flex-none flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors font-semibold"
        >
          <ArrowLeft size={18} />
          {isFirst ? 'Back' : 'Previous'}
        </button>
        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          whileHover={canAdvance ? { scale: 1.02 } : {}}
          whileTap={canAdvance ? { scale: 0.98 } : {}}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
            canAdvance
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {isLast ? (
            <>
              <Play size={18} />
              Start Challenge
            </>
          ) : (
            <>
              Next
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-bg/95 backdrop-blur-md border-t border-border pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={goPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors font-semibold min-h-[48px]"
        >
          <ArrowLeft size={20} />
          {isFirst ? 'Back' : 'Prev'}
        </button>
        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          whileHover={canAdvance ? { scale: 1.02 } : {}}
          whileTap={canAdvance ? { scale: 0.98 } : {}}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors min-h-[48px] flex-1 ${
            canAdvance
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {isLast ? (
            <>
              <Play size={20} />
              Start Challenge
            </>
          ) : (
            <>
              Next
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ── Checkpoint question sub-component ───────────────────────────────────────

interface CheckpointQuestionProps {
  question: CheckpointQuestion;
  selectedAnswer: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onAnswer: (index: number) => void;
}

function CheckpointQuestion({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onAnswer,
}: CheckpointQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 p-5 sm:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/50 space-y-5 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-indigo-100 dark:border-indigo-900/30 pb-3 mb-1">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 flex items-center justify-center font-bold text-xs">
            ?
          </span>
          <h3 className="font-display font-semibold text-text text-lg">Your turn</h3>
        </div>
        <p className="text-xs text-text-muted sm:ml-auto">Quick check to continue</p>
      </div>

      <div className="space-y-4">
        {/* Sentence context */}
        {question.sentenceDisplay && question.highlightWord && (
          <p className="text-lg text-text leading-relaxed font-medium">
            {question.sentenceDisplay.includes('___') ? (
              <>
                {question.sentenceDisplay.split('___')[0]}
                <span className={`font-bold px-1.5 py-0.5 rounded mx-0.5 ${isAnswered && !isCorrect ? 'bg-error/10 text-error' : 'bg-accent/30 text-amber-800 dark:text-amber-200'}`}>
                  {question.highlightWord}
                </span>
                {question.sentenceDisplay.split('___')[1]}
              </>
            ) : (
              question.sentenceDisplay.split(question.highlightWord).map((part, j, arr) =>
                j < arr.length - 1 ? (
                  <span key={j}>
                    {part}
                    <span className={`font-bold px-1 rounded mx-0.5 ${isAnswered && !isCorrect ? 'bg-error/10 text-error' : 'bg-accent/30 text-amber-800 dark:text-amber-200'}`}>
                      {question.highlightWord}
                    </span>
                  </span>
                ) : part
              )
            )}
          </p>
        )}

        <p className="text-sm font-semibold text-text-muted">{question.questionText}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 pt-2">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isThisCorrect = i === question.correctIndex;
          let buttonClass = 'border-2 border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/50 hover:bg-primary/5 shadow-sm font-medium';
          if (isAnswered) {
            if (isThisCorrect) {
              buttonClass = 'border-2 border-secondary bg-secondary/10 text-secondary font-bold shadow-none';
            } else if (isSelected && !isThisCorrect) {
              buttonClass = 'border-2 border-error bg-error/10 text-error font-bold shadow-none';
            } else {
              buttonClass = 'border-2 border-border bg-surface text-text-muted opacity-50 shadow-none';
            }
          } else if (isSelected) {
            buttonClass = 'border-2 border-primary bg-primary/10 text-primary font-bold shadow-none';
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => onAnswer(i)}
              disabled={isAnswered}
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 ${buttonClass}`}
            >
              {isAnswered && isThisCorrect && <CheckCircle2 size={16} className="flex-shrink-0" />}
              {isAnswered && isSelected && !isThisCorrect && <XCircle size={16} className="flex-shrink-0" />}
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
              isCorrect
                ? 'bg-secondary/10 border border-secondary/30 text-secondary'
                : 'bg-error/8 border border-error/20 text-error/90'
            }`}
          >
            {isCorrect
              ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
              : <XCircle size={16} className="flex-shrink-0 mt-0.5" />}
            <span>{isCorrect ? question.feedbackCorrect : question.feedbackWrong}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nudge when unanswered */}
      <AnimatePresence>
        {!isAnswered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-text-muted text-center"
          >
            Answer to continue
          </motion.p>
        )}
      </AnimatePresence>    </motion.div>
  );
}
