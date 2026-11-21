'use client';

import { motion } from 'framer-motion';
import { Check, RotateCcw, Star, Trophy } from 'lucide-react';
import { TENSE_PATH_FINAL_BONUS_POINTS } from '@/lib/tense-path/levels';
import { PASS_ACCURACY, type TensePathRoundResult } from '@/lib/tense-path/progress';
import { QUESTION_TYPE_LABEL, getQuestionLabel, type TensePathQuestion } from '@/lib/tense-path/questions';
import { PRIMARY_BUTTON, SURFACE } from './theme';

interface ResultsScreenProps {
  title: string;
  result: TensePathRoundResult;
  missed: TensePathQuestion[];
  bestStreak: number;
  pointsAwarded: number | null;
  primaryLabel: string;
  onPrimary: () => void;
  onMap: () => void;
}

export function ResultsScreen({ title, result, missed, bestStreak, pointsAwarded, primaryLabel, onPrimary, onMap }: ResultsScreenProps) {
  const needed = Math.ceil((result.total * PASS_ACCURACY[result.mode]) / 100);
  const heading = result.earnedBadge
    ? 'Tense Master!'
    : result.newlyMastered
      ? 'Mastered!'
      : result.passed
        ? 'You passed!'
        : 'Almost there';
  const sub = result.passed
    ? result.mode === 'round1'
      ? 'Round 2 is open. Get 9 of 10 to master this level.'
      : result.mode === 'round2'
        ? 'This level is mastered. Nice work.'
        : result.mode === 'checkpoint'
          ? 'The next world is open.'
          : 'You finished every world.'
    : `You need ${needed} of ${result.total}. Try again: you will get new questions.`;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-5 px-4 pb-10 pt-8 sm:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full ${
            result.earnedBadge
              ? 'bg-accent-light text-[#8a6a12]'
              : result.passed
                ? 'bg-secondary/20 text-secondary-dark'
                : 'bg-primary/15 text-primary-dark'
          }`}
        >
          {result.earnedBadge ? (
            <Trophy size={48} aria-hidden="true" />
          ) : result.newlyMastered ? (
            <Star size={48} className="fill-accent text-accent-dark" aria-hidden="true" />
          ) : result.passed ? (
            <Check size={48} strokeWidth={3} aria-hidden="true" />
          ) : (
            <RotateCcw size={44} aria-hidden="true" />
          )}
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-text-muted">{title}</div>
        <h1 className="font-display text-4xl text-text sm:text-5xl">{heading}</h1>
        <p className="max-w-md text-lg text-text-muted">{sub}</p>
      </motion.div>

      {result.earnedBadge ? (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-accent-dark bg-accent-light p-4 text-[#3d2f08]">
          <Trophy size={28} aria-hidden="true" />
          <div className="font-bold">Tense Master badge + {TENSE_PATH_FINAL_BONUS_POINTS} bonus points</div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <Stat value={`${result.correct}/${result.total}`} label="Correct" />
        <Stat value={String(bestStreak)} label="Best streak" />
        <Stat value={pointsAwarded === null ? '…' : `+${pointsAwarded}`} label="Points" accent />
      </div>

      {missed.length > 0 ? (
        <div className={`flex flex-col gap-2 rounded-2xl p-4 ${SURFACE}`}>
          <div className="text-sm font-bold text-text-muted">Look at these again</div>
          <ul className="flex flex-col gap-2">
            {missed.slice(0, 5).map((q, i) => (
              <li key={`${q.id}-${i}`} className="flex flex-col gap-0.5 border-t border-border/60 pt-2 first:border-t-0 first:pt-0 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{QUESTION_TYPE_LABEL[q.type]}</span>
                <span className="text-base text-text">{getQuestionLabel(q)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <button type="button" onClick={onPrimary} className={`${PRIMARY_BUTTON} h-16 text-xl`}>
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onMap}
          className="h-12 rounded-2xl text-base font-bold text-primary-dark underline-offset-4 hover:underline dark:text-primary-light"
        >
          Back to the map
        </button>
      </div>
    </div>
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${SURFACE}`}>
      <div className={`text-2xl font-bold ${accent ? 'text-primary-dark dark:text-primary-light' : 'text-text'}`}>{value}</div>
      <div className="text-xs font-bold text-text-muted">{label}</div>
    </div>
  );
}
