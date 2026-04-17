'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Play, Sparkles, AlertCircle,
  CheckCircle2, XCircle, ArrowDown, Info,
} from 'lucide-react';
import Image from 'next/image';
import type { POSGroup, POSRoundMode, PartOfSpeech } from '@/types/parts-of-speech';
import { POS_COLORS, POS_LABELS } from '@/types/parts-of-speech';
import { DiagramSentence } from './DiagramSentence';
import { SpeakButton } from './SpeakButton';

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

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 7)) % (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickSeededExampleIndex(length: number, seed: number): number {
  if (length <= 0) return 0;
  return Math.abs(seed) % length;
}

function buildCheckpointQuestion(group: POSGroup, patternIndex: number, seed: number): CheckpointQuestion | null {
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

// Tint every word in a sentence by looking it up in the group's patterns/photo gallery.
function tintSentence(sentence: string, group: POSGroup): React.ReactNode[] {
  const lookup = new Map<string, PartOfSpeech>();
  for (const p of group.patterns) {
    const w = p.word.trim().toLowerCase();
    if (w) lookup.set(w, p.partOfSpeech);
    for (const ex of p.examples) {
      const hw = ex.highlightWord?.trim().toLowerCase();
      if (hw) lookup.set(hw, p.partOfSpeech);
      const bl = ex.blank?.trim().toLowerCase();
      if (bl) lookup.set(bl, p.partOfSpeech);
    }
  }
  for (const entry of group.photoGallery ?? []) {
    lookup.set(entry.word.trim().toLowerCase(), entry.partOfSpeech);
  }

  const parts = sentence.split(/(\s+)/);
  return parts.map((segment, i) => {
    if (!segment.trim()) return segment;
    const key = segment.replace(/[.,!?;:"'()]/g, '').toLowerCase();
    const pos = lookup.get(key);
    if (!pos) return <span key={i}>{segment}</span>;
    return (
      <span
        key={i}
        className={`inline-block rounded-md border px-1 mx-[1px] font-bold shadow-sm ${POS_COLORS[pos]}`}
        style={{ textShadow: 'none' }}
      >
        {segment}
      </span>
    );
  });
}

export function PatternWalkthroughScreen({
  group,
  roundMode,
  onStartChallenge,
  onBack,
}: PatternWalkthroughScreenProps) {
  const currentRoundNumber = parseInt(String(roundMode).replace(/[^0-9]/g, ''), 10) || 1;
  const groupPOS = useMemo(() => [...new Set(group.patterns.map(p => p.partOfSpeech))], [group]);
  const hasPhotoGallery = (group.photoGallery?.length ?? 0) > 0;
  const heroPhoto = hasPhotoGallery ? group.photoGallery?.[0] : null;
  const rawHeroSentence = group.patternExample || group.patterns[0]?.examples?.[0]?.sentence || '';
  // Trim compound/contrast examples (split on "/" or " — ") so the hero stays punchy and legible.
  // Longer explanations live in the Rule and Pattern card sections below.
  const heroSentence = useMemo(() => {
    if (!rawHeroSentence) return '';
    const firstClause = rawHeroSentence.split(/\s*\/\s*/)[0] ?? rawHeroSentence;
    const stripped = firstClause.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    return stripped || firstClause.trim();
  }, [rawHeroSentence]);

  const checkpointQuestion = useMemo(
    () => buildCheckpointQuestion(group, 0, 17 + group.id.charCodeAt(0)),
    [group],
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && checkpointQuestion !== null && selectedAnswer === checkpointQuestion.correctIndex;

  const mistakes = group.patterns.filter(p => p.commonError).slice(0, 4);

  return (
    <div className="pb-28 sm:pb-24">
      {/* Back button */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative mt-4 mx-4 sm:mx-6 rounded-3xl overflow-hidden border border-border shadow-lg">
        {heroPhoto ? (
          <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full">
            <Image
              src={heroPhoto.imageUrl}
              alt={heroPhoto.altText}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 960px"
              unoptimized
              referrerPolicy="no-referrer-when-downgrade"
              priority
            />
            {/* Layered scrim: stronger at the bottom where text lives, plus a subtle full overlay for overall legibility */}
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
          </div>
        ) : (
          <div className={`aspect-[16/9] ${group.colorClass}`} />
        )}

        <div
          className="absolute inset-x-0 bottom-0 p-5 sm:p-7"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.6)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl sm:text-3xl leading-none">{group.icon ?? '📚'}</span>
            <span
              className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20"
              style={{ color: '#ffffff' }}
            >
              Discover
            </span>
          </div>
          <h1
            className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-2"
            style={{ color: '#ffffff' }}
          >
            {group.title}
          </h1>
          {heroSentence && (
            <div
              className="text-base sm:text-xl font-semibold leading-snug flex flex-wrap items-center gap-1.5"
              style={{ color: '#ffffff' }}
            >
              <span>{tintSentence(heroSentence, group)}</span>
              <SpeakButton text={heroSentence} size="sm" />
            </div>
          )}
        </div>
      </section>

      {/* ── Tint legend + memory trick ───────────────────────────── */}
      <section className="px-4 sm:px-6 mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">You'll meet:</span>
          {groupPOS.map(pos => (
            <span key={pos} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${POS_COLORS[pos]}`}>
              {POS_LABELS[pos]}
            </span>
          ))}
        </div>

        {group.memoryTrick && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
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
      </section>

      {/* ── Pattern cards (horizontal scroll row) ────────────────── */}
      <section className="mt-6">
        <div className="flex items-end justify-between px-4 sm:px-6 mb-3">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-text">The patterns</h2>
            <p className="text-xs text-text-muted">Swipe to explore each one.</p>
          </div>
          <span className="text-xs font-medium text-text-muted hidden sm:inline">{group.patterns.length} patterns</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-2 -mx-0 snap-x snap-mandatory">
          {group.patterns.slice(0, 6).map((pattern, i) => {
            const example = pattern.examples[0];
            const sentence = example?.blank ? example.sentence.replace('___', example.blank) : example?.sentence ?? '';
            return (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-[82%] sm:w-[320px] snap-start rounded-2xl border-2 border-border bg-white dark:bg-[#162b3d] shadow-sm overflow-hidden flex flex-col"
              >
                <div className={`px-4 py-2 flex items-center justify-between border-b-2 border-border ${POS_COLORS[pattern.partOfSpeech]}`}>
                  <span className="text-[11px] font-black uppercase tracking-widest">{POS_LABELS[pattern.partOfSpeech]}</span>
                  <span className="text-xs font-semibold opacity-75">#{i + 1}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-text">{pattern.word}</span>
                    <SpeakButton text={pattern.word} size="sm" />
                  </div>
                  {sentence && (
                    <p className="text-sm text-text leading-relaxed">
                      {tintSentence(sentence, group)}
                    </p>
                  )}
                  {pattern.memoryTrick && (
                    <p className="text-xs text-text-muted italic border-t border-border pt-2 flex items-start gap-1.5">
                      <Info size={12} className="flex-shrink-0 mt-0.5" />
                      {pattern.memoryTrick}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── The rule ─────────────────────────────────────────────── */}
      <section className="mt-6 px-4 sm:px-6">
        <div className={`p-5 rounded-3xl border-2 border-dashed shadow-sm relative overflow-hidden dark:bg-[#1a2435] dark:border-white/20 ${group.colorClass}`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-6xl">{group.icon}</span>
          </div>
          <div className="relative z-10 space-y-3">
            <p className="text-xs font-bold text-text uppercase tracking-wider">The rule</p>
            <p className="text-base sm:text-lg text-text font-medium leading-relaxed">{group.pattern}</p>
            {group.patternExample && (
              <div className="pt-2 border-t border-black/10 dark:border-white/10">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Example</p>
                <DiagramSentence text={group.patternExample} colorClass={group.colorClass} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Common mistakes ──────────────────────────────────────── */}
      {mistakes.length > 0 && (
        <section className="mt-6 px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-error flex-shrink-0" />
            <h2 className="font-display text-base font-bold text-error">Watch out for these</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {mistakes.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
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
        </section>
      )}

      {/* ── Checkpoint question ──────────────────────────────────── */}
      {checkpointQuestion && (
        <section className="mt-6 px-4 sm:px-6">
          <CheckpointQuestionCard
            question={checkpointQuestion}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
            isCorrect={isCorrect}
            onAnswer={(i) => { if (!isAnswered) setSelectedAnswer(i); }}
          />
        </section>
      )}

      {/* ── Game plan ─────────────────────────────────────────────── */}
      <section className="mt-6 px-4 sm:px-6">
        <h2 className="font-display text-base font-bold text-text mb-3">Your game plan</h2>
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-3">
            <p className="text-[#ffffff] font-bold text-sm">{group.maxRounds} rounds to mastery</p>
          </div>
          <div className="divide-y divide-border bg-white dark:bg-[#162b3d]">
            {[
              { n: 1, label: 'Notice', threshold: '70%' },
              { n: 2, label: 'Sort', threshold: '75%' },
              { n: 3, label: 'Connect', threshold: '80%' },
              { n: 4, label: 'Build', threshold: '85%' },
              { n: 5, label: 'Master', threshold: '90%' },
            ].filter(r => r.n <= group.maxRounds).map(round => {
              const isCurrent = round.n === currentRoundNumber;
              return (
                <div
                  key={round.n}
                  className={`flex items-center gap-4 px-5 py-2.5 ${isCurrent ? 'bg-primary/5' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs ${
                    isCurrent ? 'bg-primary text-[#ffffff]' : round.n === group.maxRounds ? 'bg-secondary/15 text-secondary' : 'bg-primary/15 text-primary'
                  }`}>{round.n}</span>
                  <p className={`font-semibold text-sm flex-1 ${isCurrent ? 'text-primary' : 'text-text'}`}>
                    Round {round.n} &middot; {round.label}
                    {isCurrent && <span className="ml-2 text-[10px] uppercase tracking-wide text-primary font-bold">You&rsquo;re here</span>}
                  </p>
                  <span className="text-xs font-bold text-text-muted">{round.threshold}+</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Sticky CTA ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-bg/95 backdrop-blur-md border-t border-border pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onBack}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors font-semibold min-h-[48px]"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <motion.button
          type="button"
          onClick={onStartChallenge}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-primary text-[#ffffff] hover:bg-primary-dark transition-colors min-h-[48px]"
        >
          <Play size={20} /> Try it
          <ArrowRight size={18} />
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
      transition={{ delay: 0.1 }}
      className="p-5 sm:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/50 space-y-4 shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-indigo-100 dark:border-indigo-900/30 pb-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 flex items-center justify-center font-bold text-xs">?</span>
        <h3 className="font-display font-semibold text-text text-base">Quick check</h3>
        <p className="text-xs text-text-muted ml-auto">Answer to confirm you&rsquo;re ready</p>
      </div>

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
