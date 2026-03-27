'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GIExercise } from '@/types/gerund-infinitive';

interface Props {
  exercise: GIExercise;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

export function MemoryMatchExercise({ exercise, onAnswer, answered }: Props) {
  const pairs = exercise.matchPairs ?? [];
  const allCards = pairs.flatMap((p, i) => [
    { id: `t-${i}-${p.trigger}`, text: p.trigger, type: 'trigger' as const },
    { id: `f-${i}-${p.form}`, text: p.form, type: 'form' as const },
  ]);
  const [shuffled] = useState(() => shuffleArray([...allCards]));

  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [lastTwo, setLastTwo] = useState<{ idx: number; id: string }[]>([]);

  const triggerToForm = new Map(pairs.map(p => [p.trigger, p.form]));

  const handleFlip = (idx: number) => {
    if (answered || flipped.has(idx) || matched.has(shuffled[idx].id)) return;
    const card = shuffled[idx];
    const newFlipped = new Set(flipped).add(idx);
    const newLastTwo = [...lastTwo, { idx, id: card.id }].slice(-2);

    setFlipped(newFlipped);
    setLastTwo(newLastTwo);

    if (newLastTwo.length === 2) {
      const [a, b] = newLastTwo;
      const cardA = shuffled[a.idx];
      const cardB = shuffled[b.idx];
      const isPair =
        (cardA.type === 'trigger' &&
          cardB.type === 'form' &&
          triggerToForm.get(cardA.text) === cardB.text) ||
        (cardB.type === 'trigger' &&
          cardA.type === 'form' &&
          triggerToForm.get(cardB.text) === cardA.text);

      if (isPair) {
        setMatched(prev => new Set(prev).add(cardA.id).add(cardB.id));
        setFlipped(new Set());
        setLastTwo([]);
        const allMatched =
          new Set([...matched, cardA.id, cardB.id]).size === allCards.length;
        if (allMatched) {
          onAnswer(true);
        }
      } else {
        setTimeout(() => {
          setFlipped(prev => {
            const next = new Set(prev);
            next.delete(a.idx);
            next.delete(b.idx);
            return next;
          });
          setLastTwo([]);
        }, 800);
      }
    }
  };

  const allMatched = matched.size === allCards.length;

  return (
    <div className="space-y-6">
      <p className="text-center text-text-muted text-sm font-medium">
        Click to flip cards and match each word or phrase with its verb form
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shuffled.map((card, idx) => {
          const isFlipped = flipped.has(idx) || matched.has(card.id);
          return (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(idx)}
              disabled={answered || matched.has(card.id)}
              className="aspect-[4/3] rounded-xl border-2 overflow-hidden flex items-center justify-center p-2 text-center font-medium text-sm"
              style={{
                background: isFlipped
                  ? 'var(--color-bg)'
                  : 'var(--color-primary)',
                color: isFlipped ? 'inherit' : 'white',
                borderColor: matched.has(card.id)
                  ? 'var(--color-secondary)'
                  : 'var(--color-border)',
              }}
            >
              {isFlipped ? card.text : '?'}
            </motion.button>
          );
        })}
      </div>
      {allMatched && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-secondary font-bold"
        >
          All matched!
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
