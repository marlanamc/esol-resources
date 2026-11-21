'use client';

import { motion } from 'framer-motion';
import { Check, RotateCcw, Star, Trophy, Volume2 } from 'lucide-react';
import { PASS_ACCURACY, type PathRoundResult } from '@/lib/pattern-path/engine';
import { SOUND_PATH_FINAL_BONUS_POINTS } from '@/lib/sound-path/levels';
import { explainVerb, getQuestionWord, type SoundQuestion } from '@/lib/sound-path/questions';
import { SURFACE, TONE, VIOLET_BUTTON } from './theme';

interface ResultsScreenProps {
  title: string;
  result: PathRoundResult;
  missed: SoundQuestion[];
  bestStreak: number;
  pointsAwarded: number | null;
  primaryLabel: string;
  onPrimary: () => void;
  onMap: () => void;
  playWord: (word: string) => void;
}

export function ResultsScreen({ title, result, missed, bestStreak, pointsAwarded, primaryLabel, onPrimary, onMap, playWord }: ResultsScreenProps) {
  const needed = Math.ceil((result.total * PASS_ACCURACY[result.mode]) / 100);
  const heading = result.earnedBadge ? 'Sound Master!' : result.newlyMastered ? 'Mastered!' : result.passed ? 'You passed!' : 'Almost there';
  const sub = result.passed
    ? result.mode === 'round1'
      ? 'Round 2 is open. Get 9 of 10 to master this level.'
      : result.mode === 'round2'
        ? 'This level is mastered. Great ears!'
        : result.mode === 'checkpoint'
          ? 'The next world is open.'
          : 'You finished every world.'
    : `You need ${needed} of ${result.total}. Try again: you will get new words.`;

  // One row per missed word, no repeats.
  const seen = new Set<string>();
  const words = missed.map(getQuestionWord).filter((v) => (seen.has(v.past) ? false : (seen.add(v.past), true)));

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-5 px-4 pb-10 pt-8 sm:px-8">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 text-center">
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full ${
            result.earnedBadge ? 'bg-accent-light text-[#8a6a12]' : result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'
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
        <h1 className="text-4xl font-black text-text sm:text-5xl">{heading}</h1>
        <p className="max-w-md text-lg text-text-muted">{sub}</p>
      </motion.div>

      {result.earnedBadge ? (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-accent-dark bg-accent-light p-4 text-[#3d2f08]">
          <Trophy size={28} aria-hidden="true" />
          <div className="font-bold">Sound Master badge + {SOUND_PATH_FINAL_BONUS_POINTS} bonus points</div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <Stat value={`${result.correct}/${result.total}`} label="Correct" />
        <Stat value={String(bestStreak)} label="Best streak" />
        <Stat value={pointsAwarded === null ? '…' : `+${pointsAwarded}`} label="Points" accent />
      </div>

      {words.length > 0 ? (
        <div className={`flex flex-col gap-2 rounded-2xl p-4 ${SURFACE}`}>
          <div className="text-sm font-bold text-text-muted">Listen again</div>
          <ul className="flex flex-col gap-2">
            {words.slice(0, 6).map((verb) => (
              <li key={verb.past} className="flex items-center gap-3 border-t border-border/60 pt-2 first:border-t-0 first:pt-0 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => playWord(verb.past)}
                  aria-label={`Listen to ${verb.past}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100! text-violet-700! dark:bg-violet-900/50! dark:text-violet-200!"
                >
                  <Volume2 size={20} aria-hidden="true" />
                </button>
                <div className="flex-1">
                  <div className="text-xl font-black text-text">{verb.past}</div>
                  <div className="text-sm text-text-muted">{explainVerb(verb)}</div>
                </div>
                <span className={`rounded-xl px-2.5 py-1 text-lg font-black ${TONE[verb.sound].chip}`}>/{verb.sound}/</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <button type="button" onClick={onPrimary} className={`${VIOLET_BUTTON} h-16 text-xl`}>
          {primaryLabel}
        </button>
        <button type="button" onClick={onMap} className="h-12 rounded-2xl text-base font-bold text-violet-700 underline-offset-4 hover:underline dark:text-violet-300">
          Back to the map
        </button>
      </div>
    </div>
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${SURFACE}`}>
      <div className={`text-2xl font-black ${accent ? 'text-violet-700 dark:text-violet-300' : 'text-text'}`}>{value}</div>
      <div className="text-xs font-bold text-text-muted">{label}</div>
    </div>
  );
}
