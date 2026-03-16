'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function MatchPairExercise({ exercise, onAnswer, answered }: Props) {
  const pairs = exercise.matchPairs ?? [];
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [done, setDone] = useState(false);

  const triggers = pairs.map(p => p.trigger);
  const forms = shuffleArray([...pairs.map(p => p.form)]);
  const correctMap = new Map(pairs.map(p => [p.trigger, p.form]));

  const handleTriggerClick = (t: string) => {
    if (answered || done) return;
    if (matches.has(t)) return;
    setSelectedTrigger(t);
  };

  const handleFormClick = (f: string) => {
    if (answered || done || !selectedTrigger) return;
    const newMatches = new Map(matches).set(selectedTrigger, f);
    setMatches(newMatches);
    setSelectedTrigger(null);

    const allMatched = triggers.every(t => newMatches.has(t));
    if (allMatched) {
      setDone(true);
      const allCorrect = triggers.every(t => correctMap.get(t) === newMatches.get(t));
      onAnswer(allCorrect);
    }
  };

  const allMatched = triggers.every(t => matches.has(t));
  const allCorrect = allMatched && triggers.every(t => correctMap.get(t) === matches.get(t));

  return (
    <div className="space-y-6">
      <p className="text-center text-text-muted text-sm font-medium">
        Match each word or phrase with its correct verb form
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-text-muted mb-2">Triggers</p>
          {triggers.map(t => (
            <motion.button
              key={t}
              onClick={() => handleTriggerClick(t)}
              disabled={answered || done || matches.has(t)}
              whileHover={!matches.has(t) ? { scale: 1.02 } : {}}
              whileTap={!matches.has(t) ? { scale: 0.98 } : {}}
              className={`w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                selectedTrigger === t
                  ? 'border-primary bg-primary/10'
                  : matches.has(t)
                  ? 'border-secondary/50 bg-secondary/5 opacity-80'
                  : 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40'
              }`}
            >
              {t}
              {matches.has(t) && (
                <span className="ml-2 text-secondary text-xs">→ {matches.get(t)}</span>
              )}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-text-muted mb-2">Verb forms</p>
          {forms.map(f => (
            <motion.button
              key={f}
              onClick={() => handleFormClick(f)}
              disabled={answered || done || !selectedTrigger}
              whileHover={selectedTrigger ? { scale: 1.02 } : {}}
              whileTap={selectedTrigger ? { scale: 0.98 } : {}}
              className={`w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                !selectedTrigger || answered || done
                  ? 'border-border bg-bg-gray opacity-60 cursor-not-allowed'
                  : 'border-border bg-white dark:bg-[#162b3d] hover:border-primary/40'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>
      {(answered || done) && !allCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-error font-medium"
        >
          Check your matches — some may be incorrect
        </motion.p>
      )}
    </div>
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
