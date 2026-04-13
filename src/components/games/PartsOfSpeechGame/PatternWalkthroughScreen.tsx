'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, Play, Sparkles, AlertCircle,
  CheckCircle2, XCircle, ArrowDown,
} from 'lucide-react';
import Image from 'next/image';
import type { POSGroup, POSRoundMode, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_COLORS, POS_LABELS } from '@/types/parts-of-speech';
import { DiagramSentence } from './DiagramSentence';
import { SpeakButton } from './SpeakButton';

function patternToBullets(pattern: string): string[] {
  return pattern
    .split(/(?<=[.!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function pickSeededExampleIndex(length: number, seed: number): number {
  if (length <= 0) return 0;
  return Math.abs(seed) % length;
}

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
  sentenceDisplay: string | null;
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
  const example = pattern?.examples?.[pickSeededExampleIndex(pattern?.examples?.length ?? 0, seed + patternIndex * 13)];
  if (!pattern || !example) return null;

  const word = example.highlightWord ?? pattern.word;
  const correctPOS = pattern.partOfSpeech;
  const correctLabel = POS_LABELS[correctPOS];

  const distractors = DISTRACTOR_POS
    .filter(p => p !== correctPOS)
    .slice(0, 2)
    .map(p => POS_LABELS[p]);

  const unshuffled = [...distractors, correctLabel];
  const shuffled = seededShuffle(unshuffled, seed);
  const correctIndex = shuffled.indexOf(correctLabel);

  return {
    questionText: `What part of speech is "${word}" in this sentence?`,
    sentenceDisplay: example.sentence ?? null,
    highlightWord: word,
    options: shuffled,
    correctIndex,
    feedbackCorrect: `Correct! "${word}" is a ${correctLabel.toLowerCase()} — you've got it.`,
    feedbackWrong: `Not quite. "${word}" is a ${correctLabel.toLowerCase()}. Look for it highlighted above.`,
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
  patternIndex: number;
  hasQuestion: boolean;
}

export function PatternWalkthroughScreen({
  group,
  roundMode: _roundMode,
  onStartChallenge,
  onBack,
}: PatternWalkthroughScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  const groupPOS = useMemo(() => [...new Set(group.patterns.map(p => p.partOfSpeech))], [group]);
  const hasMistakes = group.patterns.some(p => p.commonError);
  const hasPhotoGallery = (group.photoGallery?.length ?? 0) > 0;

  const steps: WalkthroughStep[] = useMemo(() => {
    const list: WalkthroughStep[] = [];
    // Photo gallery replaces the old text-only "intro" + "examples" steps.
    // Only shown when the group has photos (nouns, action verbs — NOT adjectives/adverbs/etc.)
    if (hasPhotoGallery) {
      list.push({ id: 'photo-gallery', label: 'See it in real life', patternIndex: 0, hasQuestion: true });
    }
    list.push({ id: 'rules', label: 'The rules', patternIndex: hasPhotoGallery ? 1 : 0, hasQuestion: true });
    if (hasMistakes) {
      list.push({ id: 'mistakes', label: 'Watch out', patternIndex: hasPhotoGallery ? 2 : 1, hasQuestion: true });
    }
    list.push({ id: 'ready', label: "You're ready!", patternIndex: 0, hasQuestion: false });
    return list;
  }, [hasPhotoGallery, hasMistakes]);

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
    if (isAnswered) return;
    setAnswers(prev => ({ ...prev, [currentStep]: optionIndex }));
  }, [isAnswered, currentStep]);

  const eyebrow = isLast ? 'Last step' : `Step ${currentStep + 1} of ${steps.length}`;

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

          {/* ── Step: photo-gallery ──────────────────────── */}
          {step.id === 'photo-gallery' && group.photoGallery && (
            <div className="space-y-4">
              {/* Memory trick above the gallery */}
              {group.memoryTrick && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-amber-100/30 dark:from-accent/15 dark:to-amber-900/20 border-2 border-accent/40"
                >
                  <div className="absolute top-2 right-3 text-4xl opacity-10 select-none">{group.icon}</div>
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="flex-shrink-0" />
                    Remember this
                  </p>
                  <p className="text-base font-bold text-text leading-relaxed">{group.memoryTrick}</p>
                </motion.div>
              )}

              {/* POS badge(s) */}
              <div className="flex flex-wrap gap-2">
                {groupPOS.map(pos => (
                  <span key={pos} className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 ${POS_COLORS[pos]}`}>
                    {POS_LABELS[pos]}
                  </span>
                ))}
              </div>

              {/* 2×2 photo grid */}
              <div className="grid grid-cols-2 gap-3">
                {group.photoGallery.map((entry, i) => (
                  <motion.div
                    key={entry.word}
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-border shadow-sm"
                  >
                    <Image
                      src={entry.imageUrl}
                      alt={entry.altText}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 44vw, 240px"
                      unoptimized
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    {/* Dark gradient strip at bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 pb-3 px-3">
                      {entry.subcategoryLabel && (
                        <p className="text-xs font-bold text-[#f8fafc]/80 uppercase tracking-wider leading-none mb-1">
                          {entry.subcategoryLabel}
                        </p>
                      )}
                      <p className="text-base font-bold text-[#f8fafc] leading-tight">{entry.word}</p>
                    </div>
                    {/* Speak button — bottom-right corner */}
                    <div className="absolute bottom-2 right-2">
                      <SpeakButton text={entry.word} size="sm" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                These are all <strong>{groupPOS.map(p => POS_LABELS[p]).join(' / ')}</strong>. Tap 🔊 to hear each word, then answer the question below.
              </p>
            </div>
          )}

          {/* ── Step: rules ─────────────────────────────── */}
          {step.id === 'rules' && (
            <div className="space-y-4">
              {/* If no photo gallery, show memory trick + POS badges here instead */}
              {!hasPhotoGallery && (
                <>
                  {group.memoryTrick && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-amber-100/30 dark:from-accent/15 dark:to-amber-900/20 border-2 border-accent/40"
                    >
                      <div className="absolute top-2 right-3 text-4xl opacity-10 select-none">{group.icon}</div>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="flex-shrink-0" />
                        Remember this
                      </p>
                      <p className="text-base font-bold text-text leading-relaxed">{group.memoryTrick}</p>
                    </motion.div>
                  )}
                  {groupPOS.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {groupPOS.map(pos => (
                        <span key={pos} className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 ${POS_COLORS[pos]}`}>
                          {POS_LABELS[pos]}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className={`p-5 rounded-3xl border-2 border-dashed shadow-sm relative overflow-hidden dark:bg-[#1a2435] dark:border-white/20 ${group.colorClass}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="text-6xl">{group.icon}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    The pattern
                  </p>
                  <div className="space-y-3">
                    {patternToBullets(group.pattern).map((bullet, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/80 dark:bg-white/10 shadow-sm border border-black/5 dark:border-white/10">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-[#ffffff] flex items-center justify-center font-bold text-sm shadow-sm">
                          {i + 1}
                        </div>
                        <p className="text-sm text-text font-medium leading-relaxed pt-0.5">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {group.patternExample && (
                <div className="p-4 sm:p-5 bg-white dark:bg-[#162b3d] border-2 border-border shadow-sm rounded-3xl">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                    Example
                  </p>
                  <DiagramSentence text={group.patternExample} colorClass={group.colorClass} />
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

              <div className="space-y-3">
                {group.patterns.filter(p => p.commonError).slice(0, 4).map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-border shadow-sm"
                  >
                    <div className="flex items-start gap-3 px-4 py-3 bg-error/5 border-b border-error/15">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-error text-[#ffffff] flex items-center justify-center text-xs font-bold mt-0.5">✗</span>
                      <p className="text-sm text-error/90 font-medium">{p.commonError}</p>
                    </div>
                    <div className="flex justify-center py-1 bg-bg-light dark:bg-white/5">
                      <ArrowDown size={14} className="text-text-muted" />
                    </div>
                    <div className="flex items-start gap-3 px-4 py-3 bg-secondary/5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-[#ffffff] flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
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
                  <p className="text-[#ffffff] font-bold text-base">Your game plan</p>
                  <p className="text-[#ffffff]/70 text-xs mt-0.5">{group.maxRounds} rounds to mastery</p>
                </div>
                <div className="divide-y divide-border bg-white dark:bg-[#162b3d]">
                  {[
                    { n: 1, label: 'Notice', threshold: '70%', desc: 'Pass Round 1 to unlock the next group.' },
                    { n: 2, label: 'Sort', threshold: '75%', desc: 'Group similar words and spot patterns faster.' },
                    { n: 3, label: 'Connect', threshold: '80%', desc: 'Recognize the target in real sentences.' },
                    { n: 4, label: 'Build', threshold: '85%', desc: 'Use the target in more active tasks.' },
                    { n: 5, label: 'Master', threshold: '90%', desc: 'Finish the full progression and earn ✦ mastery.' },
                  ].filter((round) => round.n <= group.maxRounds).map((round) => (
                    <div key={round.n} className="flex items-start gap-4 px-5 py-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm ${
                        round.n === group.maxRounds
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-primary/15 text-primary'
                      }`}>{round.n}</span>
                      <div>
                        <p className="font-bold text-text text-sm">Round {round.n} · {round.label}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          Score <strong>{round.threshold}+</strong> · {round.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <p className="text-sm text-text-muted leading-relaxed px-1">
                You&apos;ve seen the pattern and what to watch out for. Time to try it yourself!
              </p>
            </div>
          )}

          {/* ── Checkpoint question ─────────────────────── */}
          {question && (
            <CheckpointQuestionCard
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
              ? 'bg-primary text-[#ffffff] hover:bg-primary-dark'
              : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {isLast ? (
            <><Play size={18} />Start Challenge</>
          ) : (
            <>Next<ArrowRight size={18} /></>
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
              ? 'bg-primary text-[#ffffff] hover:bg-primary-dark'
              : 'bg-border text-text-muted cursor-not-allowed'
          }`}
        >
          {isLast ? (
            <><Play size={20} />Start Challenge</>
          ) : (
            <>Next<ArrowRight size={20} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ── Checkpoint question sub-component ───────────────────────────────────────

interface CheckpointQuestionCardProps {
  question: CheckpointQuestion;
  selectedAnswer: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onAnswer: (index: number) => void;
}

function CheckpointQuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onAnswer,
}: CheckpointQuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 p-5 sm:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/50 space-y-4 shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-indigo-100 dark:border-indigo-900/30 pb-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 flex items-center justify-center font-bold text-xs">?</span>
        <h3 className="font-display font-semibold text-text text-base">Your turn</h3>
        <p className="text-xs text-text-muted ml-auto">Answer to continue</p>
      </div>

      {/* Sentence with speak button */}
      {question.sentenceDisplay && question.highlightWord && (
        <div className="flex items-start gap-3">
          <SpeakButton text={question.sentenceDisplay} size="sm" className="mt-0.5 flex-shrink-0" />
          <p className="text-base text-text leading-relaxed font-medium flex-1">
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
        </div>
      )}

      <p className="text-sm font-semibold text-text-muted">{question.questionText}</p>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isThisCorrect = i === question.correctIndex;
          let buttonClass = 'border-2 border-border bg-white dark:bg-[#162b3d] text-text hover:border-primary/50 hover:bg-primary/5 shadow-sm font-medium';
          if (isAnswered) {
            if (isThisCorrect) buttonClass = 'border-2 border-secondary bg-secondary/10 text-secondary font-bold shadow-none';
            else if (isSelected) buttonClass = 'border-2 border-error bg-error/10 text-error font-bold shadow-none';
            else buttonClass = 'border-2 border-border bg-surface text-text-muted opacity-50 shadow-none';
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
              {isAnswered && isThisCorrect && <CheckCircle2 size={15} className="flex-shrink-0" />}
              {isAnswered && isSelected && !isThisCorrect && <XCircle size={15} className="flex-shrink-0" />}
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
              ? <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
              : <XCircle size={15} className="flex-shrink-0 mt-0.5" />}
            <span>{isCorrect ? question.feedbackCorrect : question.feedbackWrong}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
